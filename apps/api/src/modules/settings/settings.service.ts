import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { response } from "../../common/crud-response";
import { PrismaService } from "../../prisma/prisma.service";
import { UpdateClientRulesDto, UpdateCompanyDto, UpdateModuleDto } from "./dto/settings.dto";

const DEFAULT_COMPANY_ID = "company_skylinx";
const MODULES = [
  "employees",
  "documents",
  "cards",
  "attendance",
  "leave",
  "holidays",
  "organization",
  "payroll",
  "compliance",
  "expenses",
  "insurance",
  "integrations",
  "approvals",
  "lifecycle",
  "assets",
  "performance",
  "notifications",
  "social",
  "rewards",
  "reports",
  "analytics",
  "saas",
  "security",
  "settings",
  "ats",
];

const DEFAULT_RULES: Required<UpdateClientRulesDto> = {
  branding: {
    platformBrand: "SKYLINX PeopleOS",
    clientDisplayName: "SKYLINX Global Solutions",
    logoDataUrl: "",
    linkedinUrl: "",
    facebookUrl: "",
    xUrl: "",
    showPoweredBy: true,
    primaryColor: "#078ced",
  },
  attendance: {
    workWeek: "Monday to Saturday",
    shiftStart: "09:30",
    shiftEnd: "18:30",
    graceMinutes: 10,
    geoAttendance: true,
    biometricRequired: false,
    overtimeEnabled: true,
  },
  leave: {
    approvalFlow: "Manager then HR",
    sandwichLeave: false,
    carryForward: false,
    compOffAllowed: true,
    leaveYear: "Calendar Year",
  },
  payroll: {
    salaryStructure: "Monthly CTC",
    pfEnabled: true,
    esiEnabled: true,
    professionalTaxEnabled: true,
    tdsEnabled: true,
    payrollLockDay: 28,
  },
  approvals: {
    expenseApproval: "Manager then HR",
    documentVerification: "HR",
    payrollApproval: "HR Admin",
  },
  permissions: {
    superAdmin: ["all"],
    hrAdmin: ["employees", "documents", "attendance", "leave", "payroll", "reports", "settings"],
    manager: ["dashboard", "employees", "attendance", "leave", "approvals", "reports"],
    employee: ["dashboard", "attendance", "leave", "documents", "cards"],
  },
};

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async company() {
    const company = await this.prisma.company.findUnique({ where: { id: DEFAULT_COMPANY_ID } });
    return response("settings", "company", company);
  }

  async updateCompany(data: UpdateCompanyDto) {
    const company = await this.prisma.company.update({
      where: { id: DEFAULT_COMPANY_ID },
      data,
    });
    await this.audit("company.update", "company", company.id, company);
    return response("settings", "company.update", company);
  }

  async modules() {
    const existing = await this.prisma.moduleSetting.findMany({
      where: { companyId: DEFAULT_COMPANY_ID },
      orderBy: { module: "asc" },
    });
    const byModule = new Map(existing.map((setting) => [setting.module, setting]));
    const modules = MODULES.map((module) => byModule.get(module) || { companyId: DEFAULT_COMPANY_ID, module, enabled: true, settingsJson: null });
    return response("settings", "modules", modules);
  }

  async updateModule(module: string, data: UpdateModuleDto) {
    const settingsJson = data.settingsJson ? JSON.parse(JSON.stringify(data.settingsJson)) as Prisma.InputJsonValue : undefined;
    const setting = await this.prisma.moduleSetting.upsert({
      where: { companyId_module: { companyId: DEFAULT_COMPANY_ID, module } },
      update: { enabled: data.enabled, settingsJson },
      create: { companyId: DEFAULT_COMPANY_ID, module, enabled: data.enabled, settingsJson },
    });
    await this.audit("module.update", "module_setting", setting.id, setting);
    return response("settings", "module.update", setting);
  }

  async rules() {
    const merged = await this.mergedRules();
    return response("settings", "rules", merged);
  }

  async publicProfile() {
    const [company, rules] = await Promise.all([
      this.prisma.company.findUnique({ where: { id: DEFAULT_COMPANY_ID } }),
      this.mergedRules(),
    ]);
    return response("settings", "publicProfile", {
      company,
      branding: rules.branding,
    });
  }

  private async mergedRules() {
    const rules = await this.prisma.clientRule.findMany({
      where: { companyId: DEFAULT_COMPANY_ID, status: "ACTIVE" },
      orderBy: [{ category: "asc" }, { key: "asc" }],
    });
    const merged = { ...DEFAULT_RULES };
    for (const rule of rules) {
      const category = rule.category as keyof UpdateClientRulesDto;
      if (category in merged) {
        merged[category] = {
          ...merged[category],
          [rule.key]: rule.valueJson,
        } as Record<string, unknown>;
      }
    }
    return merged;
  }

  async updateRules(data: UpdateClientRulesDto) {
    const categories = Object.entries(data).filter(([, value]) => value && typeof value === "object");
    const saved = await this.prisma.$transaction(async (tx) => {
      const updates = [];
      for (const [category, values] of categories) {
        for (const [key, value] of Object.entries(values as Record<string, unknown>)) {
          updates.push(
            await tx.clientRule.upsert({
              where: { companyId_category_key: { companyId: DEFAULT_COMPANY_ID, category, key } },
              update: { valueJson: this.toJson(value), status: "ACTIVE" },
              create: { companyId: DEFAULT_COMPANY_ID, category, key, valueJson: this.toJson(value), status: "ACTIVE" },
            }),
          );
        }
      }

      await tx.auditLog.create({
        data: {
          module: "settings",
          action: "clientRules.update",
          entityType: "client_rules",
          entityId: DEFAULT_COMPANY_ID,
          newValueJson: this.toJson(data),
        },
      });

      return updates;
    });

    return response("settings", "rules.update", { saved: saved.length, rules: await this.rules() });
  }

  async logs() {
    const logs = await this.prisma.auditLog.findMany({
      where: {
        module: { in: ["settings", "auth", "employees", "attendance", "leave", "payroll", "expenses", "insurance", "ats"] },
      },
      include: {
        actor: {
          include: { employee: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return response("settings", "logs", logs);
  }

  private async audit(action: string, entityType: string, entityId: string, data: unknown) {
    await this.prisma.auditLog.create({
      data: {
        module: "settings",
        action,
        entityType,
        entityId,
        newValueJson: JSON.parse(JSON.stringify(data)),
      },
    });
  }

  private toJson(value: unknown): Prisma.InputJsonValue {
    return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
  }
}
