import { Injectable, NotFoundException } from "@nestjs/common";
import { response } from "../../common/crud-response";
import { PrismaService } from "../../prisma/prisma.service";
import { AwardPointsDto, CreateBenefitDto, CreateRecognitionDto, CreateVoucherDto } from "./dto/rewards.dto";

@Injectable()
export class RewardsService {
  constructor(private readonly prisma: PrismaService) {}

  async summary() {
    const [vouchers, recognitions, benefits, ledger] = await Promise.all([
      this.prisma.rewardVoucher.findMany({ orderBy: { createdAt: "desc" } }),
      this.prisma.recognitionReward.findMany({ include: { recipient: true }, orderBy: { createdAt: "desc" } }),
      this.prisma.benefitItem.findMany({ orderBy: { createdAt: "desc" } }),
      this.prisma.rewardLedger.findMany({ include: { employee: true }, orderBy: { createdAt: "desc" } }),
    ]);
    const totalPoints = ledger.reduce((sum, item) => sum + item.points, 0);
    return response("rewards", "summary", { vouchers, recognitions, benefits, ledger, totalPoints });
  }

  async createVoucher(data: CreateVoucherDto) {
    const voucher = await this.prisma.rewardVoucher.create({ data });
    await this.audit("voucher.create", "reward_voucher", voucher.id, voucher);
    return response("rewards", "voucher.create", voucher);
  }

  async createBenefit(data: CreateBenefitDto) {
    const benefit = await this.prisma.benefitItem.create({ data });
    await this.audit("benefit.create", "benefit_item", benefit.id, benefit);
    return response("rewards", "benefit.create", benefit);
  }

  async awardPoints(data: AwardPointsDto) {
    const employee = await this.prisma.employee.findUnique({ where: { id: data.employeeId } });
    if (!employee) throw new NotFoundException("Employee not found");
    const ledger = await this.prisma.rewardLedger.create({
      data: {
        employeeId: data.employeeId,
        points: data.points,
        reason: data.reason,
        source: data.source || "HR",
      },
      include: { employee: true },
    });
    await this.audit("points.award", "reward_ledger", ledger.id, ledger);
    return response("rewards", "points.award", ledger);
  }

  async recognize(data: CreateRecognitionDto) {
    const employee = await this.prisma.employee.findUnique({ where: { id: data.recipientEmployeeId } });
    if (!employee) throw new NotFoundException("Employee not found");

    const recognition = await this.prisma.$transaction(async (tx) => {
      const created = await tx.recognitionReward.create({
        data: {
          recipientEmployeeId: data.recipientEmployeeId,
          title: data.title,
          message: data.message,
          points: data.points || 0,
        },
        include: { recipient: true },
      });
      if (created.points) {
        await tx.rewardLedger.create({
          data: {
            employeeId: data.recipientEmployeeId,
            points: created.points,
            reason: created.title,
            source: "RECOGNITION",
          },
        });
      }
      return created;
    });

    await this.audit("recognition.create", "recognition_reward", recognition.id, recognition);
    return response("rewards", "recognition.create", recognition);
  }

  private async audit(action: string, entityType: string, entityId: string, data: unknown) {
    await this.prisma.auditLog.create({
      data: {
        module: "rewards",
        action,
        entityType,
        entityId,
        newValueJson: JSON.parse(JSON.stringify(data)),
      },
    });
  }
}
