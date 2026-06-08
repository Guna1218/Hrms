"use client";

import { CheckCircle2, ListChecks, Play, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "../lib/client-api";
import { fallbackLifecycle } from "../lib/fallback-data";
import { emptyLifecycle } from "../lib/live-data";
import { Card, MetricCard, StatusPill } from "./ui";

type LifecycleData = typeof fallbackLifecycle;
type OnboardingRow = LifecycleData["onboardingRows"][number];
interface ExitRow {
  id: string;
  name: string;
  department: string;
  clearance: string;
  assets: string;
  documents: string;
}
interface LifecycleLog {
  id: string;
  action: string;
  entityId: string;
  status: string;
  createdAt: string;
}

function completion(row: OnboardingRow) {
  const values = Object.values(row.checklist);
  return Math.round((values.filter(Boolean).length / values.length) * 100);
}

export function LifecycleConsole() {
  const [data, setData] = useState<LifecycleData>(emptyLifecycle);
  const [message, setMessage] = useState("");

  function load() {
    apiFetch<LifecycleData>("/lifecycle")
      .then((body) => {
        if (body.data) setData(body.data);
      })
      .catch(() => undefined);
  }

  useEffect(() => {
    load();
  }, []);

  async function startOnboarding(id: string) {
    await apiFetch(`/lifecycle/onboarding/${id}/start`, { method: "POST" });
    setMessage("Onboarding workflow logged.");
    load();
  }

  return (
    <div className="grid gap-5">
      {message ? <div className="rounded-lg bg-[#e6f5ef] p-3 text-sm text-[#18865a]">{message}</div> : null}
      <div className="grid grid-cols-4 gap-3 max-xl:grid-cols-2 max-md:grid-cols-1">
        <MetricCard label="Onboarding" value={`${data.onboardingCompleted}/${data.onboardingTotal}`} note="Completed joining workflows" />
        <MetricCard label="Documents" value={String(data.documentsCollected)} note="Collected records" />
        <MetricCard label="Exit Cases" value={String(data.exitTotal)} note="Clearance workflows" />
        <MetricCard label="Lifecycle Logs" value={String(data.logs.length)} note="Audit-backed actions" />
      </div>

      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Joining Checklist</h2>
            <p className="mt-1 text-sm text-muted">Offer letter, documents, interview completion and joining readiness.</p>
          </div>
          <StatusPill>{data.onboardingTotal} Active</StatusPill>
        </div>
        <div className="grid grid-cols-4 gap-3 max-xl:grid-cols-2 max-md:grid-cols-1">
          {data.checklist.map((item) => (
            <div className="rounded-lg border border-[#dce2eb] p-4" key={item.name}>
              <div className="mb-3 flex items-center justify-between">
                <CheckCircle2 className="h-5 w-5 text-brand" />
                <StatusPill tone={item.completed === item.total ? "green" : "yellow"}>{item.completed}/{item.total}</StatusPill>
              </div>
              <div className="font-semibold">{item.name}</div>
              <div className="mt-2 h-2 rounded-full bg-[#e8eef5]">
                <div className="h-2 rounded-full bg-brand" style={{ width: `${Math.round((item.completed / Math.max(item.total, 1)) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-semibold">Onboarding Pipeline</h2>
        <div className="overflow-auto">
          <table className="w-full min-w-[920px] border-collapse text-sm">
            <thead className="bg-[#f8fafc] text-left text-xs uppercase text-muted">
              <tr>
                <th className="border-b border-[#dce2eb] p-3">Person</th>
                <th className="border-b border-[#dce2eb] p-3">Role</th>
                <th className="border-b border-[#dce2eb] p-3">Stage</th>
                <th className="border-b border-[#dce2eb] p-3">Completion</th>
                <th className="border-b border-[#dce2eb] p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.onboardingRows.map((row: OnboardingRow) => (
                <tr key={row.id}>
                  <td className="border-b border-[#dce2eb] p-3 font-semibold"><ListChecks className="mr-2 inline h-4 w-4 text-brand" />{row.name}</td>
                  <td className="border-b border-[#dce2eb] p-3">{row.role}</td>
                  <td className="border-b border-[#dce2eb] p-3"><StatusPill tone={row.stage === "JOINED" ? "green" : "yellow"}>{row.stage}</StatusPill></td>
                  <td className="border-b border-[#dce2eb] p-3">{completion(row)}%</td>
                  <td className="border-b border-[#dce2eb] p-3">
                    <button className="flex min-h-8 items-center gap-2 rounded-lg bg-brand px-3 text-xs font-semibold text-white" onClick={() => startOnboarding(row.id)}>
                      <Play className="h-3.5 w-3.5" /> Start
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-semibold">Exit Clearance</h2>
        {data.exitRows.length ? (
          <div className="grid gap-2">
            {data.exitRows.map((row: ExitRow) => (
              <div className="rounded-lg border border-[#dce2eb] p-3" key={row.id}>{row.name} / {row.department}</div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-[#dce2eb] p-4 text-sm text-muted"><RotateCcw className="mr-2 inline h-4 w-4" />No exit clearance cases currently.</div>
        )}
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-semibold">Lifecycle Logs</h2>
        <div className="grid gap-2">
          {data.logs.map((log: LifecycleLog) => (
            <div className="flex items-center justify-between rounded-lg border border-[#dce2eb] p-3 text-sm" key={log.id}>
              <span className="font-semibold">{log.action}</span>
              <span className="text-muted">{String(log.createdAt).slice(0, 10)}</span>
            </div>
          ))}
          {!data.logs.length ? <div className="text-sm text-muted">No lifecycle actions logged yet.</div> : null}
        </div>
      </Card>
    </div>
  );
}
