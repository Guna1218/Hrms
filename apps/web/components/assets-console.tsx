"use client";

import { BriefcaseBusiness, Check, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "../lib/client-api";
import { fallbackAssets } from "../lib/fallback-data";
import { emptyAssets } from "../lib/live-data";
import { Card, MetricCard, StatusPill } from "./ui";

type AssetsData = typeof fallbackAssets;
type AssetRow = AssetsData["rows"][number];
interface AssetLog {
  id: string;
  action: string;
  assetTag: string;
  status: string;
  createdAt: string;
}

function toneFor(status: string) {
  return status === "ASSIGNED" || status === "GOOD" || status === "COMPLETED" ? "green" : status === "RETURNED" ? "yellow" : "red";
}

export function AssetsConsole() {
  const [data, setData] = useState<AssetsData>(emptyAssets);
  const [message, setMessage] = useState("");

  function load() {
    apiFetch<AssetsData>("/assets")
      .then((body) => {
        if (body.data) setData(body.data);
      })
      .catch(() => undefined);
  }

  useEffect(() => {
    load();
  }, []);

  async function action(assetTag: string, type: "assign" | "return") {
    await apiFetch(`/assets/${assetTag}/${type}`, { method: "POST" });
    setMessage(`Asset ${type} action logged.`);
    load();
  }

  return (
    <div className="grid gap-5">
      {message ? <div className="rounded-lg bg-[#e6f5ef] p-3 text-sm text-[#18865a]">{message}</div> : null}
      <div className="grid grid-cols-4 gap-3 max-xl:grid-cols-2 max-md:grid-cols-1">
        <MetricCard label="Assets" value={String(data.total)} note="Tracked inventory" />
        <MetricCard label="Assigned" value={String(data.assigned)} note="With employees" />
        <MetricCard label="Available" value={String(data.available)} note="Ready to issue" />
        <MetricCard label="Handover Pending" value={String(data.handoverPending)} note="Lifecycle follow-up" />
      </div>

      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Asset Categories</h2>
            <p className="mt-1 text-sm text-muted">Laptops, ID cards, phones and accessories issued to employees.</p>
          </div>
          <StatusPill>{data.returned} Returned</StatusPill>
        </div>
        <div className="grid grid-cols-4 gap-3 max-xl:grid-cols-2 max-md:grid-cols-1">
          {data.categories.map((item) => (
            <div className="rounded-lg border border-[#dce2eb] p-4" key={item.type}>
              <BriefcaseBusiness className="mb-3 h-5 w-5 text-brand" />
              <div className="font-semibold">{item.type}</div>
              <div className="mt-2 text-2xl font-semibold">{item.count}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-semibold">Assigned Assets</h2>
        <div className="overflow-auto">
          <table className="w-full min-w-[980px] border-collapse text-sm">
            <thead className="bg-[#f8fafc] text-left text-xs uppercase text-muted">
              <tr>
                <th className="border-b border-[#dce2eb] p-3">Asset</th>
                <th className="border-b border-[#dce2eb] p-3">Type</th>
                <th className="border-b border-[#dce2eb] p-3">Assigned To</th>
                <th className="border-b border-[#dce2eb] p-3">Department</th>
                <th className="border-b border-[#dce2eb] p-3">Status</th>
                <th className="border-b border-[#dce2eb] p-3">Condition</th>
                <th className="border-b border-[#dce2eb] p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row: AssetRow) => (
                <tr key={row.id}>
                  <td className="border-b border-[#dce2eb] p-3">
                    <div className="font-semibold">{row.assetTag}</div>
                    <div className="text-xs text-muted">{row.item}</div>
                  </td>
                  <td className="border-b border-[#dce2eb] p-3">{row.type}</td>
                  <td className="border-b border-[#dce2eb] p-3">{row.assignedTo}</td>
                  <td className="border-b border-[#dce2eb] p-3">{row.department}</td>
                  <td className="border-b border-[#dce2eb] p-3"><StatusPill tone={toneFor(row.status)}>{row.status}</StatusPill></td>
                  <td className="border-b border-[#dce2eb] p-3"><StatusPill tone={toneFor(row.condition)}>{row.condition}</StatusPill></td>
                  <td className="border-b border-[#dce2eb] p-3">
                    <div className="flex gap-2">
                      <button className="flex min-h-8 items-center gap-1 rounded-lg bg-brand px-3 text-xs font-semibold text-white" onClick={() => action(row.assetTag, "assign")}>
                        <Check className="h-3.5 w-3.5" /> Assign
                      </button>
                      <button className="flex min-h-8 items-center gap-1 rounded-lg border border-[#dce2eb] px-3 text-xs font-semibold" onClick={() => action(row.assetTag, "return")}>
                        <RotateCcw className="h-3.5 w-3.5" /> Return
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-semibold">Asset Logs</h2>
        <div className="grid gap-2">
          {data.logs.map((log: AssetLog) => (
            <div className="flex items-center justify-between rounded-lg border border-[#dce2eb] p-3 text-sm" key={log.id}>
              <span className="font-semibold">{log.action} / {log.assetTag}</span>
              <span className="text-muted">{String(log.createdAt).slice(0, 10)}</span>
            </div>
          ))}
          {!data.logs.length ? <div className="text-sm text-muted">No asset actions logged yet.</div> : null}
        </div>
      </Card>
    </div>
  );
}
