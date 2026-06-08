"use client";

import { Award, Play, Target, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "../lib/client-api";
import { fallbackPerformance } from "../lib/fallback-data";
import { emptyPerformance } from "../lib/live-data";
import { Card, MetricCard, StatusPill } from "./ui";

type PerformanceData = typeof fallbackPerformance;
type PerformanceRow = PerformanceData["rows"][number];
interface PerformanceLog {
  id: string;
  action: string;
  status: string;
  createdAt: string;
}

function toneFor(rating: string) {
  return rating === "EXCELLENT" ? "green" : rating === "GOOD" ? "yellow" : "red";
}

function progress(completed: number, total: number) {
  return Math.round((completed / Math.max(total, 1)) * 100);
}

export function PerformanceConsole() {
  const [data, setData] = useState<PerformanceData>(emptyPerformance);
  const [message, setMessage] = useState("");

  function load() {
    apiFetch<PerformanceData>("/performance")
      .then((body) => {
        if (body.data) setData(body.data);
      })
      .catch(() => undefined);
  }

  useEffect(() => {
    load();
  }, []);

  async function launchCycle() {
    await apiFetch("/performance/cycle", { method: "POST" });
    setMessage("Performance review cycle launched.");
    load();
  }

  return (
    <div className="grid gap-5">
      {message ? <div className="rounded-lg bg-[#e6f5ef] p-3 text-sm text-[#18865a]">{message}</div> : null}
      <div className="grid grid-cols-4 gap-3 max-xl:grid-cols-2 max-md:grid-cols-1">
        <MetricCard label="Employees" value={String(data.employees)} note="Included in performance review" />
        <MetricCard label="Average Score" value={`${data.averageScore}%`} note="Attendance, goals and recognition" />
        <MetricCard label="Review Ready" value={String(data.reviewReady)} note="Eligible appraisal records" />
        <MetricCard label="Recognitions" value={String(data.recognitions)} note="Reward-backed signals" />
      </div>

      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Review Readiness</h2>
            <p className="mt-1 text-sm text-muted">Goals, attendance, recognition and appraisal readiness in one place.</p>
          </div>
          <button className="flex min-h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-white" onClick={launchCycle}>
            <Play className="h-4 w-4" /> Launch Cycle
          </button>
        </div>
        <div className="grid grid-cols-4 gap-3 max-xl:grid-cols-2 max-md:grid-cols-1">
          {data.categories.map((item) => (
            <div className="rounded-lg border border-[#dce2eb] p-4" key={item.name}>
              <div className="mb-3 flex items-center justify-between">
                <Target className="h-5 w-5 text-brand" />
                <StatusPill tone={item.completed === item.total ? "green" : "yellow"}>{item.completed}/{item.total}</StatusPill>
              </div>
              <div className="font-semibold">{item.name}</div>
              <div className="mt-2 h-2 rounded-full bg-[#e8eef5]">
                <div className="h-2 rounded-full bg-brand" style={{ width: `${progress(item.completed, item.total)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-semibold">Performance Matrix</h2>
        <div className="overflow-auto">
          <table className="w-full min-w-[1020px] border-collapse text-sm">
            <thead className="bg-[#f8fafc] text-left text-xs uppercase text-muted">
              <tr>
                <th className="border-b border-[#dce2eb] p-3">Employee</th>
                <th className="border-b border-[#dce2eb] p-3">Department</th>
                <th className="border-b border-[#dce2eb] p-3">Designation</th>
                <th className="border-b border-[#dce2eb] p-3">Goals</th>
                <th className="border-b border-[#dce2eb] p-3">Attendance</th>
                <th className="border-b border-[#dce2eb] p-3">Recognition</th>
                <th className="border-b border-[#dce2eb] p-3">Score</th>
                <th className="border-b border-[#dce2eb] p-3">Rating</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row: PerformanceRow) => (
                <tr key={row.employeeId}>
                  <td className="border-b border-[#dce2eb] p-3 font-semibold"><Award className="mr-2 inline h-4 w-4 text-brand" />{row.employee}</td>
                  <td className="border-b border-[#dce2eb] p-3">{row.department}</td>
                  <td className="border-b border-[#dce2eb] p-3">{row.designation}</td>
                  <td className="border-b border-[#dce2eb] p-3">{row.completedGoals}/{row.goals}</td>
                  <td className="border-b border-[#dce2eb] p-3">{row.attendanceScore}%</td>
                  <td className="border-b border-[#dce2eb] p-3">{row.recognitionPoints} pts</td>
                  <td className="border-b border-[#dce2eb] p-3"><TrendingUp className="mr-2 inline h-4 w-4 text-brand" />{row.performanceScore}%</td>
                  <td className="border-b border-[#dce2eb] p-3"><StatusPill tone={toneFor(row.rating)}>{row.rating}</StatusPill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-semibold">Review Cycle Logs</h2>
        <div className="grid gap-2">
          {data.logs.map((log: PerformanceLog) => (
            <div className="flex items-center justify-between rounded-lg border border-[#dce2eb] p-3 text-sm" key={log.id}>
              <span className="font-semibold">{log.action} / {log.status}</span>
              <span className="text-muted">{String(log.createdAt).slice(0, 10)}</span>
            </div>
          ))}
          {!data.logs.length ? <div className="text-sm text-muted">No performance cycle launched yet.</div> : null}
        </div>
      </Card>
    </div>
  );
}
