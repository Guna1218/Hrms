"use client";

import { FileDown, FileUp, KeyRound } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { apiFetch } from "../lib/client-api";
import { fallbackCompanySettings, fallbackModuleSettings } from "../lib/fallback-data";
import { defaultActivePlan, hasPlanAccess, isPlanName, planTone, requiredPlanForModule, type PlanName } from "../lib/plan-access";
import { Card, StatusPill } from "./ui";

type CompanySettings = typeof fallbackCompanySettings;
type ModuleSetting = (typeof fallbackModuleSettings)[number];
interface ClientRules {
  branding: Record<string, string | number | boolean>;
  attendance: Record<string, string | number | boolean>;
  leave: Record<string, string | number | boolean>;
  payroll: Record<string, string | number | boolean>;
  approvals: Record<string, string | number | boolean>;
}

interface SettingsLog {
  id: string;
  module: string;
  action: string;
  entityType: string;
  createdAt: string;
  actor?: { email: string; employee?: { firstName: string; lastName: string } | null } | null;
}

const defaultClientRules: ClientRules = {
  branding: {
    platformBrand: "SKYLINX PeopleOS",
    clientDisplayName: "SKYLINX Global Solutions",
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
};

const planCards = [
  {
    plan: "Basic" as PlanName,
    title: "Free Forever",
    price: "\u20B90",
    access: "Core HR access",
    includes: ["Dashboard", "Employee directory", "Documents", "Attendance", "Leave", "Holidays", "Reports", "Settings"],
  },
  {
    plan: "Standard" as PlanName,
    title: "Professional",
    price: "\u20B924,765.84/year",
    access: "HR operations access",
    includes: ["Payroll", "Expenses", "Insurance", "ID & visiting cards", "Organization chart", "Approvals", "Social feed", "Assets"],
  },
  {
    plan: "Pro" as PlanName,
    title: "Enterprise",
    price: "\u20B953,100/year",
    access: "All module access",
    includes: ["ATS", "Rewards", "Compliance", "Security", "Analytics", "Integrations"],
  },
];

function moduleLabel(module: string) {
  return module
    .split("-")
    .join(" ")
    .split("_")
    .join(" ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function SettingsConsole() {
  const [company, setCompany] = useState<CompanySettings>(fallbackCompanySettings);
  const [modules, setModules] = useState<ModuleSetting[]>([]);
  const [rules, setRules] = useState<ClientRules>(defaultClientRules);
  const [logs, setLogs] = useState<SettingsLog[]>([]);
  const [activePlan, setActivePlan] = useState<PlanName>(defaultActivePlan);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function load() {
    apiFetch<CompanySettings>("/settings/company")
      .then((body) => {
        if (body.data) setCompany({ ...fallbackCompanySettings, ...body.data });
      })
      .catch(() => undefined);
    apiFetch<ModuleSetting[]>("/settings/modules")
      .then((body) => {
        if (body.data?.length) setModules(body.data.map((item) => ({ module: item.module, enabled: item.enabled })));
      })
      .catch(() => undefined);
    apiFetch<{ activePlan: string }>("/saas")
      .then((body) => {
        if (body.data?.activePlan && isPlanName(body.data.activePlan)) setActivePlan(body.data.activePlan);
      })
      .catch(() => undefined);
    apiFetch<ClientRules>("/settings/rules")
      .then((body) => {
        if (body.data) setRules({ ...defaultClientRules, ...body.data });
      })
      .catch(() => undefined);
    apiFetch<SettingsLog[]>("/settings/logs")
      .then((body) => {
        if (body.data) setLogs(body.data);
      })
      .catch(() => undefined);
  }

  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )skylinx_peopleos_plan=([^;]+)/);
    const plan = match ? decodeURIComponent(match[1]) : "";
    if (isPlanName(plan)) setActivePlan(plan);
    load();
  }, []);

  async function saveCompany(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const body = await apiFetch<CompanySettings>("/settings/company", {
        method: "PATCH",
        body: JSON.stringify({
          name: String(form.get("name")),
          legalName: String(form.get("legalName")),
          logoUrl: String(form.get("logoUrl")),
          address: String(form.get("address")),
          taxId: String(form.get("taxId")),
          workWeek: String(form.get("workWeek")),
          timezone: String(form.get("timezone")),
        }),
      });
      if (body.data) setCompany({ ...fallbackCompanySettings, ...body.data });
      setMessage("Company settings saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Company update failed");
    }
  }

  async function toggleModule(module: string, enabled: boolean) {
    setMessage("");
    setError("");
    try {
      await apiFetch(`/settings/modules/${module}`, {
        method: "PATCH",
        body: JSON.stringify({ enabled }),
      });
      setModules((current) => current.map((item) => item.module === module ? { ...item, enabled } : item));
      setMessage(`${module} ${enabled ? "enabled" : "disabled"}.`);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Module update failed");
    }
  }

  async function saveRules(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    const form = new FormData(event.currentTarget);
    const body: ClientRules = {
      branding: {
        platformBrand: String(form.get("platformBrand")),
        clientDisplayName: String(form.get("clientDisplayName")),
        showPoweredBy: form.get("showPoweredBy") === "on",
        primaryColor: String(form.get("primaryColor")),
      },
      attendance: {
        workWeek: String(form.get("attendanceWorkWeek")),
        shiftStart: String(form.get("shiftStart")),
        shiftEnd: String(form.get("shiftEnd")),
        graceMinutes: Number(form.get("graceMinutes")),
        geoAttendance: form.get("geoAttendance") === "on",
        biometricRequired: form.get("biometricRequired") === "on",
        overtimeEnabled: form.get("overtimeEnabled") === "on",
      },
      leave: {
        approvalFlow: String(form.get("leaveApprovalFlow")),
        sandwichLeave: form.get("sandwichLeave") === "on",
        carryForward: form.get("carryForward") === "on",
        compOffAllowed: form.get("compOffAllowed") === "on",
        leaveYear: String(form.get("leaveYear")),
      },
      payroll: {
        salaryStructure: String(form.get("salaryStructure")),
        pfEnabled: form.get("pfEnabled") === "on",
        esiEnabled: form.get("esiEnabled") === "on",
        professionalTaxEnabled: form.get("professionalTaxEnabled") === "on",
        tdsEnabled: form.get("tdsEnabled") === "on",
        payrollLockDay: Number(form.get("payrollLockDay")),
      },
      approvals: {
        expenseApproval: String(form.get("expenseApproval")),
        documentVerification: String(form.get("documentVerification")),
        payrollApproval: String(form.get("payrollApproval")),
      },
    };

    try {
      await apiFetch("/settings/rules", {
        method: "PATCH",
        body: JSON.stringify(body),
      });
      setRules(body);
      setMessage("Client rules saved.");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Client rules update failed");
    }
  }

  function downloadSettings() {
    const payload = encodeURIComponent(JSON.stringify({ company, rules, modules }, null, 2));
    const anchor = document.createElement("a");
    anchor.href = `data:application/json;charset=utf-8,${payload}`;
    anchor.download = "skylinx-client-settings.json";
    anchor.click();
    setMessage("Settings export downloaded.");
  }

  function inputClass() {
    return "min-h-10 rounded-lg border border-[#dce2eb] px-3 text-sm";
  }

  function checkbox(name: string, label: string, checked: boolean) {
    return (
      <label className="flex min-h-10 items-center gap-2 rounded-lg border border-[#dce2eb] px-3 text-sm">
        <input defaultChecked={checked} name={name} type="checkbox" />
        {label}
      </label>
    );
  }

  return (
    <div className="grid gap-5">
      {message ? <div className="rounded-lg bg-[#e6f5ef] p-3 text-sm text-[#18865a]">{message}</div> : null}
      {error ? <div className="rounded-lg bg-[#fde8e6] p-3 text-sm text-[#ba3d37]">{error}</div> : null}

      <Card>
        <h2 className="mb-4 text-lg font-semibold">Company Profile</h2>
        <form className="grid grid-cols-3 gap-3 max-lg:grid-cols-2 max-md:grid-cols-1" onSubmit={saveCompany}>
          <input className="min-h-10 rounded-lg border border-[#dce2eb] px-3 text-sm" name="name" defaultValue={company.name} placeholder="Company Name" />
          <input className="min-h-10 rounded-lg border border-[#dce2eb] px-3 text-sm" name="legalName" defaultValue={company.legalName} placeholder="Legal Name" />
          <input className="min-h-10 rounded-lg border border-[#dce2eb] px-3 text-sm" name="logoUrl" defaultValue={company.logoUrl} placeholder="Logo URL" />
          <input className="min-h-10 rounded-lg border border-[#dce2eb] px-3 text-sm" name="address" defaultValue={company.address || ""} placeholder="Address" />
          <input className="min-h-10 rounded-lg border border-[#dce2eb] px-3 text-sm" name="taxId" defaultValue={company.taxId || ""} placeholder="Tax ID / GSTIN" />
          <input className="min-h-10 rounded-lg border border-[#dce2eb] px-3 text-sm" name="workWeek" defaultValue={company.workWeek} placeholder="Work Week" />
          <input className="min-h-10 rounded-lg border border-[#dce2eb] px-3 text-sm" name="timezone" defaultValue={company.timezone} placeholder="Timezone" />
          <button className="min-h-10 rounded-lg bg-brand px-4 text-sm font-semibold text-white">Save Profile</button>
        </form>
      </Card>

      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Client Rules & Branding</h2>
            <p className="mt-1 text-sm text-muted">Configure each client company without changing SKYLINX platform code.</p>
          </div>
          <StatusPill tone="green">Database Saved</StatusPill>
        </div>
        <form className="grid gap-5" onSubmit={saveRules}>
          <div>
            <h3 className="mb-3 text-sm font-bold uppercase text-muted">Branding</h3>
            <div className="grid grid-cols-4 gap-3 max-xl:grid-cols-2 max-md:grid-cols-1">
              <input className={inputClass()} name="platformBrand" defaultValue={String(rules.branding.platformBrand)} placeholder="Platform Brand" />
              <input className={inputClass()} name="clientDisplayName" defaultValue={String(rules.branding.clientDisplayName)} placeholder="Client Display Name" />
              <input className={inputClass()} name="primaryColor" defaultValue={String(rules.branding.primaryColor)} placeholder="Primary Color" />
              {checkbox("showPoweredBy", "Show Powered by SKYLINX", Boolean(rules.branding.showPoweredBy))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold uppercase text-muted">Attendance Rules</h3>
            <div className="grid grid-cols-4 gap-3 max-xl:grid-cols-2 max-md:grid-cols-1">
              <input className={inputClass()} name="attendanceWorkWeek" defaultValue={String(rules.attendance.workWeek)} placeholder="Work Week" />
              <input className={inputClass()} name="shiftStart" defaultValue={String(rules.attendance.shiftStart)} type="time" />
              <input className={inputClass()} name="shiftEnd" defaultValue={String(rules.attendance.shiftEnd)} type="time" />
              <input className={inputClass()} name="graceMinutes" defaultValue={Number(rules.attendance.graceMinutes)} min="0" type="number" />
              {checkbox("geoAttendance", "Geo Attendance", Boolean(rules.attendance.geoAttendance))}
              {checkbox("biometricRequired", "Biometric Required", Boolean(rules.attendance.biometricRequired))}
              {checkbox("overtimeEnabled", "Overtime Enabled", Boolean(rules.attendance.overtimeEnabled))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold uppercase text-muted">Leave Rules</h3>
            <div className="grid grid-cols-4 gap-3 max-xl:grid-cols-2 max-md:grid-cols-1">
              <input className={inputClass()} name="leaveApprovalFlow" defaultValue={String(rules.leave.approvalFlow)} placeholder="Leave Approval Flow" />
              <input className={inputClass()} name="leaveYear" defaultValue={String(rules.leave.leaveYear)} placeholder="Leave Year" />
              {checkbox("sandwichLeave", "Sandwich Leave", Boolean(rules.leave.sandwichLeave))}
              {checkbox("carryForward", "Carry Forward", Boolean(rules.leave.carryForward))}
              {checkbox("compOffAllowed", "Comp-Off Allowed", Boolean(rules.leave.compOffAllowed))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold uppercase text-muted">Payroll & Approval Rules</h3>
            <div className="grid grid-cols-4 gap-3 max-xl:grid-cols-2 max-md:grid-cols-1">
              <input className={inputClass()} name="salaryStructure" defaultValue={String(rules.payroll.salaryStructure)} placeholder="Salary Structure" />
              <input className={inputClass()} name="payrollLockDay" defaultValue={Number(rules.payroll.payrollLockDay)} min="1" max="31" type="number" />
              <input className={inputClass()} name="expenseApproval" defaultValue={String(rules.approvals.expenseApproval)} placeholder="Expense Approval" />
              <input className={inputClass()} name="documentVerification" defaultValue={String(rules.approvals.documentVerification)} placeholder="Document Verification" />
              <input className={inputClass()} name="payrollApproval" defaultValue={String(rules.approvals.payrollApproval)} placeholder="Payroll Approval" />
              {checkbox("pfEnabled", "PF Enabled", Boolean(rules.payroll.pfEnabled))}
              {checkbox("esiEnabled", "ESI Enabled", Boolean(rules.payroll.esiEnabled))}
              {checkbox("professionalTaxEnabled", "Professional Tax", Boolean(rules.payroll.professionalTaxEnabled))}
              {checkbox("tdsEnabled", "TDS Enabled", Boolean(rules.payroll.tdsEnabled))}
            </div>
          </div>

          <button className="min-h-10 w-fit rounded-lg bg-brand px-4 text-sm font-semibold text-white">Save Client Rules</button>
        </form>
      </Card>

      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Plan Access Settings</h2>
            <p className="mt-1 text-sm text-muted">Module permissions are controlled by the selected company plan.</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusPill tone={planTone(activePlan)}>{activePlan} Active</StatusPill>
            <a className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white" href="/saas">Manage Plans</a>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 max-lg:grid-cols-1">
          {planCards.map((card) => {
            const active = card.plan === activePlan;
            return (
              <div className={`rounded-lg border p-4 ${active ? "border-[#ff8a2a] bg-[#fff3e8]" : "border-[#dce2eb] bg-white"}`} key={card.plan}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold text-[#172033]">{card.title}</div>
                    <div className="text-xs font-bold uppercase text-muted">{card.plan}</div>
                  </div>
                  <StatusPill tone={active ? "green" : planTone(card.plan)}>{active ? "Current" : card.price}</StatusPill>
                </div>
                <div className="mt-3 text-sm font-semibold text-brand">{card.access}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {card.includes.map((item) => (
                    <span className="rounded-full bg-[#f3f7fb] px-3 py-1 text-xs font-semibold text-[#34465f]" key={item}>{item}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-semibold">Module Controls</h2>
        <div className="grid grid-cols-4 gap-3 max-xl:grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1">
          {modules.map((item) => (
            (() => {
              const requiredPlan = requiredPlanForModule(item.module);
              const allowed = hasPlanAccess(requiredPlan, activePlan);
              return (
                <div className={`flex items-center justify-between gap-3 rounded-lg border p-3 ${allowed ? "border-[#dce2eb]" : "border-[#f3c4c0] bg-[#fff8f7]"}`} key={item.module}>
                  <div>
                    <div className="font-semibold">{moduleLabel(item.module)}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <StatusPill tone={allowed && item.enabled ? "green" : "red"}>{allowed ? (item.enabled ? "Enabled" : "Disabled") : "Locked"}</StatusPill>
                      <StatusPill tone={planTone(requiredPlan)}>{requiredPlan} Plan</StatusPill>
                    </div>
                  </div>
                  {allowed ? (
                    <button className="rounded-lg border border-[#dce2eb] px-3 py-2 text-sm font-semibold" type="button" onClick={() => toggleModule(item.module, !item.enabled)}>
                      {item.enabled ? "Disable" : "Enable"}
                    </button>
                  ) : (
                    <a className="rounded-lg bg-[#ba3d37] px-3 py-2 text-sm font-semibold text-white" href="/saas">
                      Upgrade
                    </a>
                  )}
                </div>
              );
            })()
          ))}
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Settings & Activity Logs</h2>
            <p className="mt-1 text-sm text-muted">Client administrators can review configuration and workflow changes.</p>
          </div>
          <button className="rounded-lg border border-[#dce2eb] px-4 py-2 text-sm font-semibold" onClick={load} type="button">Refresh Logs</button>
        </div>
        <div className="overflow-auto">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead className="bg-[#f8fafc] text-left text-xs uppercase text-muted">
              <tr>
                <th className="border-b border-[#dce2eb] p-3">Time</th>
                <th className="border-b border-[#dce2eb] p-3">Module</th>
                <th className="border-b border-[#dce2eb] p-3">Action</th>
                <th className="border-b border-[#dce2eb] p-3">Record</th>
                <th className="border-b border-[#dce2eb] p-3">Actor</th>
              </tr>
            </thead>
            <tbody>
              {logs.slice(0, 12).map((log) => (
                <tr key={log.id}>
                  <td className="border-b border-[#dce2eb] p-3">{new Date(log.createdAt).toLocaleString("en-IN")}</td>
                  <td className="border-b border-[#dce2eb] p-3 font-semibold">{moduleLabel(log.module)}</td>
                  <td className="border-b border-[#dce2eb] p-3">{log.action}</td>
                  <td className="border-b border-[#dce2eb] p-3">{log.entityType}</td>
                  <td className="border-b border-[#dce2eb] p-3">{log.actor?.employee ? `${log.actor.employee.firstName} ${log.actor.employee.lastName}` : log.actor?.email || "System"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-4 gap-3 max-xl:grid-cols-2 max-md:grid-cols-1">
        {[
          { title: "Data Import", note: "Use Employee Directory bulk upload for employee CSV import", icon: FileUp, action: "Open Employees", href: "/employees" },
          { title: "Data Export", note: "Download company settings and client rule JSON", icon: FileDown, action: "Download", onClick: downloadSettings },
          { title: "License", note: "Subscription and module entitlement control", icon: KeyRound, action: "Manage Plans", href: "/saas" },
        ].map(({ title, note, icon: Icon, action, href, onClick }) => (
          <div className="rounded-lg border border-[#dce2eb] bg-white p-4 shadow-sm" key={title}>
            <Icon className="h-5 w-5 text-brand" />
            <div className="mt-3 font-semibold">{title}</div>
            <div className="mt-1 text-sm text-muted">{note}</div>
            <div className="mt-3">
              {href ? (
                <a className="inline-flex min-h-9 items-center rounded-lg border border-[#dce2eb] px-3 text-sm font-semibold text-[#172033]" href={href}>
                  {action}
                </a>
              ) : (
                <button className="inline-flex min-h-9 items-center rounded-lg border border-[#dce2eb] px-3 text-sm font-semibold text-[#172033]" onClick={onClick} type="button">
                  {action}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
