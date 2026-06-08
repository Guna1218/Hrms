import { Injectable } from "@nestjs/common";
import { response } from "../../common/crud-response";
import { AuthenticatedUser } from "../../common/auth/auth.types";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class LifecycleService {
  constructor(private readonly prisma: PrismaService) {}

  async summary() {
    const [applications, employees, documents, auditLogs] = await Promise.all([
      this.prisma.jobApplication.findMany({
        include: { candidate: true, jobPosting: true, interviews: true },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.employee.findMany({
        include: { department: true, designation: true, documents: true, user: true },
        orderBy: { joiningDate: "desc" },
      }),
      this.prisma.employeeDocument.findMany(),
      this.prisma.auditLog.findMany({
        where: { module: "lifecycle" },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
    ]);

    const onboardingRows = [
      ...applications
        .filter((item) => ["OFFER", "JOINING", "OFFERED", "APPROVED", "ACTIVE"].includes(item.stage) || ["OFFERED", "APPROVED"].includes(item.status))
        .map((item) => ({
          id: item.id,
          name: item.candidate.fullName,
          role: item.jobPosting.title,
          stage: item.stage,
          checklist: {
            offerLetter: ["OFFER", "JOINING"].includes(item.stage) || item.status === "OFFERED",
            documents: Boolean(item.candidate.resumeUrl),
            interview: item.interviews.length > 0,
            joining: item.stage === "JOINING",
          },
        })),
      ...employees.slice(0, 3).map((employee) => ({
        id: employee.id,
        name: `${employee.firstName} ${employee.lastName}`,
        role: employee.designation?.title || "Employee",
        stage: employee.user ? "JOINED" : "ACCOUNT_PENDING",
        checklist: {
          offerLetter: true,
          documents: employee.documents.length > 0,
          interview: true,
          joining: Boolean(employee.user),
        },
      })),
    ];

    const exitRows = employees
      .filter((employee) => employee.status === "EXITED")
      .map((employee) => ({
        id: employee.id,
        name: `${employee.firstName} ${employee.lastName}`,
        department: employee.department?.name || "-",
        clearance: "PENDING",
        assets: "PENDING",
        documents: "PENDING",
      }));

    const completedOnboarding = onboardingRows.filter((row) => Object.values(row.checklist).every(Boolean)).length;

    return response("lifecycle", "summary", {
      onboardingTotal: onboardingRows.length,
      onboardingCompleted: completedOnboarding,
      exitTotal: exitRows.length,
      documentsCollected: documents.length,
      checklist: [
        { name: "Offer Letter", completed: onboardingRows.filter((row) => row.checklist.offerLetter).length, total: onboardingRows.length },
        { name: "Documents", completed: onboardingRows.filter((row) => row.checklist.documents).length, total: onboardingRows.length },
        { name: "Interview", completed: onboardingRows.filter((row) => row.checklist.interview).length, total: onboardingRows.length },
        { name: "Joining", completed: onboardingRows.filter((row) => row.checklist.joining).length, total: onboardingRows.length },
      ],
      onboardingRows,
      exitRows,
      logs: auditLogs.map((log) => ({
        id: log.id,
        action: log.action,
        entityId: log.entityId || "-",
        status: (log.newValueJson as { status?: string } | null)?.status || "COMPLETED",
        createdAt: log.createdAt,
      })),
    });
  }

  async startOnboarding(user: AuthenticatedUser, id: string) {
    return this.audit(user, "onboarding.start", id, "STARTED");
  }

  async requestExitClearance(user: AuthenticatedUser, id: string) {
    return this.audit(user, "exit.clearance", id, "PENDING");
  }

  private async audit(user: AuthenticatedUser, action: string, entityId: string, status: string) {
    const log = await this.prisma.auditLog.create({
      data: {
        actorUserId: user.sub,
        module: "lifecycle",
        action,
        entityType: "employee_lifecycle",
        entityId,
        newValueJson: {
          status,
          actionedAt: new Date().toISOString(),
        },
      },
    });
    return response("lifecycle", action, log);
  }
}
