"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../lib/client-api";
import { Card, MetricCard, StatusPill } from "./ui";
import { getAccessToken } from "../lib/session";
import {
  Building,
  CreditCard,
  Layers3,
  RefreshCcw,
  Activity,
  ShieldAlert,
  Server,
  CheckCircle,
  Play,
  Pause,
  TrendingUp,
  Terminal
} from "lucide-react";

interface Tenant {
  id: string;
  name: string;
  legalName: string;
  status: string;
  timezone: string;
  createdAt: string;
}

interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  queue?: string;
  priority: string;
  status: string;
  createdAt: string;
  company?: {
    name: string;
  };
}

interface SystemLog {
  id: string;
  service: string;
  logLevel: string;
  message: string;
  timestamp: string;
}

interface ErrorLog {
  id: string;
  service: string;
  endpoint: string;
  errorMessage: string;
  stackTrace: string;
  createdAt: string;
}

export function SaasAdminPageContent() {
  const [panelMode, setPanelMode] = useState<"owner" | "support">("owner");
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [billingEvents, setBillingEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  const triggerToast = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const saasRes = await apiFetch<any>("/saas");
      if (saasRes.data) {
        setTenants(saasRes.data.companies || []);
        setBillingEvents(saasRes.data.billingEvents || []);
      }

      const ticketsRes = await apiFetch<any>("/tickets");
      if (ticketsRes.data) {
        setTickets(ticketsRes.data || []);
      }

      const logsRes = await apiFetch<any>("/saas/logs");
      if (logsRes.data) {
        setErrorLogs(logsRes.data.errorLogs || []);
        setSystemLogs(logsRes.data.systemLogs || []);
      }
    } catch (err) {
      console.error("Failed to load saas-admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      const token = getAccessToken();
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const email = payload.email || "";
        setUserEmail(email);
        const ownerCheck = email === "skylinxcode@gmail.com";
        setIsOwner(ownerCheck);
        if (!ownerCheck) {
          setPanelMode("support");
          setActiveTab("Support");
        }
      }
    } catch (err) {
      console.error("JWT decoding failed in saas-admin:", err);
    }
    loadData();
  }, []);

  const handleToggleTenantStatus = async (tenantId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      await apiFetch(`/saas/companies/${tenantId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });
      triggerToast(`Tenant status updated to ${nextStatus} successfully.`);
      loadData();
    } catch (err) {
      console.error(err);
      triggerToast("Failed to update tenant status.");
    }
  };

  const handleResolveTicket = async (ticketId: string) => {
    try {
      await apiFetch(`/tickets/${ticketId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: "Resolved" }),
      });
      triggerToast("Ticket resolved successfully.");
      loadData();
    } catch (err) {
      console.error(err);
      triggerToast("Failed to resolve ticket.");
    }
  };

  const totalClients = tenants.length;
  const activeClients = tenants.filter((t) => t.status === "ACTIVE").length;
  const suspendedClients = tenants.filter((t) => t.status === "SUSPENDED").length;

  const totalMrr = billingEvents
    .filter((e) => e.status === "COMPLETED" || e.status === "ACTIVE")
    .reduce((sum, e) => sum + (e.amount || 0), 0);

  const totalArr = totalMrr * 12;

  const openTicketsCount = tickets.filter((t) => t.status !== "Resolved").length;
  const dailyErrorsCount = errorLogs.filter(
    (l) => new Date(l.createdAt).toDateString() === new Date().toDateString()
  ).length;

  return (
    <>
      {actionMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-lg border border-[#e6f5ef] bg-[#e6f5ef] p-4 text-[#18865a] shadow-lg animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle className="h-5 w-5 text-[#18865a]" />
          <span className="text-sm font-semibold">{actionMessage}</span>
        </div>
      )}

      {/* Panel Switcher Toggle */}
      {isOwner && (
        <div className="mb-6 flex justify-start">
          <div className="flex bg-slate-200 p-1 rounded-xl shadow-inner">
            <button
              type="button"
              onClick={() => {
                setPanelMode("owner");
                setActiveTab("Dashboard");
              }}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                panelMode === "owner"
                  ? "bg-brand text-white shadow-md"
                  : "text-slate-600 hover:text-[#172033]"
              }`}
            >
              Owner Panel
            </button>
            <button
              type="button"
              onClick={() => {
                setPanelMode("support");
                setActiveTab("Support");
              }}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                panelMode === "support"
                  ? "bg-brand text-white shadow-md"
                  : "text-slate-600 hover:text-[#172033]"
              }`}
            >
              Support Team Panel
            </button>
          </div>
        </div>
      )}

      {/* Ribbon Navigation */}
      <div className="mb-6 flex border-b border-[#dce2eb] pb-3">
        {(panelMode === "owner" ? ["Dashboard", "Tenants", "Observability"] : ["Support"]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`mr-6 pb-2 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
              activeTab === tab
                ? "border-brand text-brand font-bold"
                : "border-transparent text-[#667892] hover:text-[#172033]"
            }`}
          >
            {tab}
          </button>
        ))}
        <button
          onClick={loadData}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-[#dce2eb] px-3 py-1.5 text-xs font-semibold text-[#34465f] hover:border-brand cursor-pointer bg-white"
        >
          <RefreshCcw className="h-3 w-3" /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 text-muted">
          <Activity className="h-8 w-8 animate-spin text-brand mr-3" />
          <span>Syncing platform analytics and telemetry...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Dashboard View */}
          {activeTab === "Dashboard" && (
            <div className="space-y-6">
              {/* Telemetry Metric Grid */}
              <div className="grid grid-cols-4 gap-4 max-xl:grid-cols-2 max-md:grid-cols-1">
                <MetricCard
                  label="Platform MRR / ARR"
                  value={`₹${totalMrr.toLocaleString("en-IN")} / ₹${totalArr.toLocaleString("en-IN")}`}
                  note="Consolidated subscription volume"
                />
                <MetricCard
                  label="Tenant Directory"
                  value={`${activeClients} Active / ${totalClients} Total`}
                  note={`${suspendedClients} subscriptions suspended`}
                />
                <MetricCard
                  label="SLA Queue"
                  value={`${openTicketsCount} Open Tickets`}
                  note="Support Desk backlog"
                />
                <MetricCard
                  label="Telemetry Alerts"
                  value={`${dailyErrorsCount} Incidents Today`}
                  note="Realtime API/SMTP exceptions"
                />
              </div>

              {/* Graphical Progress & Telemetry */}
              <div className="grid grid-cols-2 gap-5 max-lg:grid-cols-1">
                <Card>
                  <h3 className="text-base font-bold text-[#172033] mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-brand" /> System Subscription Revenue Breakdowns
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>Basic (Free Trial)</span>
                        <span>{tenants.filter(t => t.status === "ACTIVE").length} tenants</span>
                      </div>
                      <div className="h-2 w-full bg-[#f1f3f5] rounded-full overflow-hidden">
                        <div className="h-full bg-brand" style={{ width: `${(tenants.length / (totalClients || 1)) * 100}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>Standard (Professional)</span>
                        <span>₹{totalMrr.toLocaleString("en-IN")}/mo volume</span>
                      </div>
                      <div className="h-2 w-full bg-[#f1f3f5] rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: "65%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>Pro (Enterprise)</span>
                        <span>₹{totalArr.toLocaleString("en-IN")}/yr projection</span>
                      </div>
                      <div className="h-2 w-full bg-[#f1f3f5] rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: "35%" }} />
                      </div>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-base font-bold text-[#172033] mb-4 flex items-center gap-2">
                    <Server className="h-5 w-5 text-brand" /> Live Server Diagnostics & Health
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-[#f8fafc] border border-[#dce2eb] p-3 rounded-lg">
                      <span className="text-muted block text-xs">CPU Utilization</span>
                      <span className="font-bold text-[#172033] text-lg">14.2%</span>
                      <div className="h-1.5 w-full bg-slate-200 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: "14.2%" }} />
                      </div>
                    </div>
                    <div className="bg-[#f8fafc] border border-[#dce2eb] p-3 rounded-lg">
                      <span className="text-muted block text-xs">Memory allocation</span>
                      <span className="font-bold text-[#172033] text-lg">512MB / 1GB</span>
                      <div className="h-1.5 w-full bg-slate-200 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: "50%" }} />
                      </div>
                    </div>
                    <div className="bg-[#f8fafc] border border-[#dce2eb] p-3 rounded-lg">
                      <span className="text-muted block text-xs">Database Connection</span>
                      <span className="font-bold text-emerald-600 text-sm flex items-center gap-1 mt-1">
                        <CheckCircle className="h-4 w-4" /> Healthy (2ms)
                      </span>
                    </div>
                    <div className="bg-[#f8fafc] border border-[#dce2eb] p-3 rounded-lg">
                      <span className="text-muted block text-xs">SMTP Dispatch Status</span>
                      <span className="font-bold text-emerald-600 text-sm flex items-center gap-1 mt-1">
                        <CheckCircle className="h-4 w-4" /> Online (Gmail)
                      </span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Recent billing logs */}
              <Card>
                <h3 className="text-base font-bold text-[#172033] mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-brand" /> Platform Billing Event Logs
                </h3>
                <div className="overflow-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead className="bg-[#f8fafc] text-left text-xs uppercase text-muted">
                      <tr>
                        <th className="border-b border-[#dce2eb] p-3">Event Action</th>
                        <th className="border-b border-[#dce2eb] p-3">Status</th>
                        <th className="border-b border-[#dce2eb] p-3">Amount</th>
                        <th className="border-b border-[#dce2eb] p-3">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {billingEvents.slice(0, 5).map((event: any) => (
                        <tr key={event.id} className="hover:bg-[#f8fafc] transition-colors">
                          <td className="border-b border-[#dce2eb] p-3 font-semibold text-[#172033]">{event.action}</td>
                          <td className="border-b border-[#dce2eb] p-3">
                            <StatusPill tone={event.status === "COMPLETED" || event.status === "ACTIVE" ? "green" : "yellow"}>
                              {event.status}
                            </StatusPill>
                          </td>
                          <td className="border-b border-[#dce2eb] p-3 font-semibold">₹{(event.amount || 0).toLocaleString("en-IN")}</td>
                          <td className="border-b border-[#dce2eb] p-3 text-xs text-muted">{new Date(event.createdAt).toLocaleString()}</td>
                        </tr>
                      ))}
                      {billingEvents.length === 0 && (
                        <tr>
                          <td className="p-4 text-center text-muted" colSpan={4}>No billing event records found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* Tenants Tab */}
          {activeTab === "Tenants" && (
            <Card className="p-0">
              <div className="border-b border-[#dce2eb] p-5">
                <h3 className="text-lg font-bold text-[#172033]">Tenant Organization Directories</h3>
                <p className="text-sm text-muted">Manage company status, suspend accounts or change subscription allocations.</p>
              </div>
              <div className="overflow-auto">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-[#f8fafc] text-left text-xs uppercase text-muted">
                    <tr>
                      <th className="p-4 border-b border-[#dce2eb]">Company Name</th>
                      <th className="p-4 border-b border-[#dce2eb]">Domain Slug</th>
                      <th className="p-4 border-b border-[#dce2eb]">Registered At</th>
                      <th className="p-4 border-b border-[#dce2eb]">Timezone</th>
                      <th className="p-4 border-b border-[#dce2eb]">Status</th>
                      <th className="p-4 border-b border-[#dce2eb] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenants.map((t) => (
                      <tr key={t.id} className="hover:bg-[#f8fafc] transition-colors">
                        <td className="p-4 border-b border-[#dce2eb]">
                          <div className="font-bold text-[#172033]">{t.name}</div>
                          <div className="text-xs text-muted">{t.legalName}</div>
                        </td>
                        <td className="p-4 border-b border-[#dce2eb]">
                          <code className="bg-slate-100 px-2 py-1 rounded text-xs text-brand font-semibold">{t.id}</code>
                        </td>
                        <td className="p-4 border-b border-[#dce2eb] text-xs text-muted">
                          {new Date(t.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 border-b border-[#dce2eb] text-xs font-semibold">{t.timezone}</td>
                        <td className="p-4 border-b border-[#dce2eb]">
                          <StatusPill tone={t.status === "ACTIVE" ? "green" : "red"}>
                            {t.status}
                          </StatusPill>
                        </td>
                        <td className="p-4 border-b border-[#dce2eb] text-right">
                          <button
                            onClick={() => handleToggleTenantStatus(t.id, t.status)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              t.status === "ACTIVE"
                                ? "bg-red-50 text-red-600 hover:bg-red-100"
                                : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                            }`}
                          >
                            {t.status === "ACTIVE" ? (
                              <>
                                <Pause className="h-3 w-3" /> Suspend
                              </>
                            ) : (
                              <>
                                <Play className="h-3 w-3" /> Activate
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Support Tab */}
          {activeTab === "Support" && (
            <Card className="p-0">
              <div className="border-b border-[#dce2eb] p-5">
                <h3 className="text-lg font-bold text-[#172033]">SaaS Platform Support Desk</h3>
                <p className="text-sm text-muted">Review support tickets and resolve client complaints globally.</p>
              </div>
              <div className="overflow-auto">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-[#f8fafc] text-left text-xs uppercase text-muted">
                    <tr>
                      <th className="p-4 border-b border-[#dce2eb]">Ticket Code</th>
                      <th className="p-4 border-b border-[#dce2eb]">Tenant</th>
                      <th className="p-4 border-b border-[#dce2eb]">Queue / Dept</th>
                      <th className="p-4 border-b border-[#dce2eb]">Subject / Issue</th>
                      <th className="p-4 border-b border-[#dce2eb]">Priority</th>
                      <th className="p-4 border-b border-[#dce2eb]">Status</th>
                      <th className="p-4 border-b border-[#dce2eb] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((t) => (
                      <tr key={t.id} className="hover:bg-[#f8fafc] transition-colors">
                        <td className="p-4 border-b border-[#dce2eb] font-bold text-muted">{t.ticketNumber}</td>
                        <td className="p-4 border-b border-[#dce2eb] font-semibold text-[#172033]">
                          {t.company?.name || "Global / System"}
                        </td>
                        <td className="p-4 border-b border-[#dce2eb]">
                          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">
                            {t.queue || "HR Helpdesk"}
                          </span>
                        </td>
                        <td className="p-4 border-b border-[#dce2eb]">
                          <div className="font-semibold text-[#172033]">{t.subject}</div>
                          <div className="text-xs text-muted truncate max-w-md">{t.description}</div>
                        </td>
                        <td className="p-4 border-b border-[#dce2eb]">
                          <span
                            className={`text-xs px-2 py-0.5 rounded font-bold ${
                              t.priority === "High"
                                ? "bg-red-100 text-red-700"
                                : t.priority === "Medium"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {t.priority}
                          </span>
                        </td>
                        <td className="p-4 border-b border-[#dce2eb]">
                          <StatusPill tone={t.status === "Resolved" ? "green" : "red"}>
                            {t.status}
                          </StatusPill>
                        </td>
                        <td className="p-4 border-b border-[#dce2eb] text-right">
                          {t.status !== "Resolved" ? (
                            <button
                              onClick={() => handleResolveTicket(t.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all cursor-pointer"
                            >
                              <CheckCircle className="h-3.5 w-3.5" /> Resolve
                            </button>
                          ) : (
                            <span className="text-xs text-[#8ca0bf] font-bold italic">Resolved</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {tickets.length === 0 && (
                      <tr>
                        <td className="p-4 text-center text-muted" colSpan={7}>No client support tickets found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Observability Tab */}
          {activeTab === "Observability" && (
            <div className="grid grid-cols-[1.2fr_1.8fr] gap-5 max-lg:grid-cols-1">
              {/* Telemetry log list */}
              <Card className="p-0">
                <div className="border-b border-[#dce2eb] p-5 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#172033] flex items-center gap-1.5">
                    <Terminal className="h-4 w-4 text-brand" /> System Log Telemetry
                  </h3>
                  <span className="text-xs text-muted">{systemLogs.length} events loaded</span>
                </div>
                <div className="p-4 max-h-[500px] overflow-y-auto space-y-3 font-mono text-xs">
                  {systemLogs.map((log) => (
                    <div
                      key={log.id}
                      className={`p-2.5 rounded border ${
                        log.logLevel === "ERROR"
                          ? "bg-red-50 border-red-100 text-red-800"
                          : "bg-slate-50 border-slate-200 text-slate-800"
                      }`}
                    >
                      <div className="flex justify-between mb-1 text-[10px] text-muted">
                        <span>[{log.service}]</span>
                        <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="leading-relaxed">{log.message}</p>
                    </div>
                  ))}
                  {systemLogs.length === 0 && (
                    <p className="text-center py-6 text-muted font-sans text-sm">No system logs logged yet.</p>
                  )}
                </div>
              </Card>

              {/* Telemetry error list */}
              <Card className="p-0">
                <div className="border-b border-[#dce2eb] p-5 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#172033] flex items-center gap-1.5">
                    <ShieldAlert className="h-4 w-4 text-red-500" /> Platform Exception Incidents
                  </h3>
                  <span className="text-xs text-muted">{errorLogs.length} exceptions loaded</span>
                </div>
                <div className="p-4 max-h-[500px] overflow-y-auto space-y-4 font-sans text-xs">
                  {errorLogs.map((log) => (
                    <div key={log.id} className="p-4 rounded-lg border border-red-200 bg-red-50/50 space-y-2">
                      <div className="flex justify-between items-center gap-3">
                        <span className="font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded text-[10px]">
                          {log.service}
                        </span>
                        <span className="text-muted text-[10px]">{new Date(log.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="font-bold text-slate-800 text-xs">
                        Endpoint: <code className="bg-slate-100 px-1 py-0.5 rounded text-red-600">{log.endpoint}</code>
                      </div>
                      <div className="font-bold text-slate-800 text-xs">
                        Error: <span className="text-red-700 font-semibold">{log.errorMessage}</span>
                      </div>
                      {log.stackTrace && (
                        <div>
                          <span className="font-bold text-slate-800 block text-[10px] mb-1">Stack Trace:</span>
                          <pre className="bg-slate-900 text-slate-200 p-2.5 rounded font-mono text-[9px] overflow-x-auto max-h-32">
                            {log.stackTrace}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                  {errorLogs.length === 0 && (
                    <p className="text-center py-12 text-muted text-sm">No platform exceptions logged yet.</p>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>
      )}
    </>
  );
}
