"use client";

import { Cable, CheckCircle2, Link2, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "../lib/client-api";
import { fallbackIntegrations } from "../lib/fallback-data";
import { emptyIntegrations } from "../lib/live-data";
import { Card, MetricCard, StatusPill } from "./ui";

type IntegrationsData = typeof fallbackIntegrations;
type Integration = IntegrationsData["integrations"][number];
interface IntegrationLog {
  id: string;
  action: string;
  status: string;
  provider: string;
  createdAt: string;
}

function toneFor(status: string) {
  return status === "CONNECTED" || status === "COMPLETED" ? "green" : status === "PENDING" ? "red" : "yellow";
}

export function IntegrationsConsole() {
  const [data, setData] = useState<IntegrationsData>(emptyIntegrations);
  const [message, setMessage] = useState("");

  function load() {
    apiFetch<IntegrationsData>("/integrations")
      .then((body) => {
        if (body.data) setData(body.data);
      })
      .catch(() => undefined);
  }

  useEffect(() => {
    load();
  }, []);

  async function testConnection(key: string) {
    await apiFetch(`/integrations/test/${key}`, { method: "POST" });
    setMessage(`${key} connection test logged.`);
    load();
  }

  return (
    <div className="grid gap-5">
      {message ? <div className="rounded-lg bg-[#e6f5ef] p-3 text-sm text-[#18865a]">{message}</div> : null}
      <div className="grid grid-cols-4 gap-3 max-xl:grid-cols-2 max-md:grid-cols-1">
        <MetricCard label="Connected" value={String(data.connected)} note="Live integrations" />
        <MetricCard label="Configured" value={String(data.configured)} note="Ready or connected" />
        <MetricCard label="Total Connectors" value={String(data.total)} note="HRMS external systems" />
        <MetricCard label="Test Logs" value={String(data.logs.length)} note="Audit-backed checks" />
      </div>

      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Integration Connectors</h2>
            <p className="mt-1 text-sm text-muted">WhatsApp, email, biometric, geo, S3 and bank export connectivity.</p>
          </div>
          <StatusPill tone={data.connected ? "green" : "yellow"}>{data.connected} Connected</StatusPill>
        </div>
        <div className="grid grid-cols-3 gap-3 max-xl:grid-cols-2 max-md:grid-cols-1">
          {data.integrations.map((item: Integration) => (
            <div className="rounded-lg border border-[#dce2eb] p-4" key={item.key}>
              <div className="mb-3 flex items-center justify-between gap-3">
                <Cable className="h-5 w-5 text-brand" />
                <StatusPill tone={toneFor(item.status)}>{item.status}</StatusPill>
              </div>
              <div className="font-semibold">{item.name}</div>
              <div className="mt-1 text-sm text-muted">{item.provider}</div>
              <div className="mt-2 text-xs text-muted">{item.records} linked records</div>
              <button className="mt-4 flex min-h-9 w-full items-center justify-center gap-2 rounded-lg bg-brand px-3 text-xs font-semibold text-white" onClick={() => testConnection(item.key)}>
                <Play className="h-3.5 w-3.5" /> Test Connection
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-semibold">Connection Test Logs</h2>
        <div className="overflow-auto">
          <table className="w-full min-w-[820px] border-collapse text-sm">
            <thead className="bg-[#f8fafc] text-left text-xs uppercase text-muted">
              <tr>
                <th className="border-b border-[#dce2eb] p-3">Provider</th>
                <th className="border-b border-[#dce2eb] p-3">Action</th>
                <th className="border-b border-[#dce2eb] p-3">Status</th>
                <th className="border-b border-[#dce2eb] p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.logs.map((log: IntegrationLog) => (
                <tr key={log.id}>
                  <td className="border-b border-[#dce2eb] p-3 font-semibold"><Link2 className="mr-2 inline h-4 w-4 text-brand" />{log.provider}</td>
                  <td className="border-b border-[#dce2eb] p-3">{log.action}</td>
                  <td className="border-b border-[#dce2eb] p-3"><StatusPill tone={toneFor(log.status)}>{log.status}</StatusPill></td>
                  <td className="border-b border-[#dce2eb] p-3">{String(log.createdAt).slice(0, 10)}</td>
                </tr>
              ))}
              {!data.logs.length ? (
                <tr>
                  <td className="border-b border-[#dce2eb] p-3 text-muted" colSpan={4}><CheckCircle2 className="mr-2 inline h-4 w-4" />No test logs yet.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
