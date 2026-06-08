"use client";

import { useEffect, useState } from "react";
import { DashboardMetricsDto } from "../lib/api";
import { apiFetch } from "../lib/client-api";
import { MetricCard } from "./ui";

export function LiveMetrics({ initial }: { initial: Array<{ label: string; value: string; note: string }> }) {
  const [metrics, setMetrics] = useState(initial);

  useEffect(() => {
    apiFetch<DashboardMetricsDto>("/dashboard/admin")
      .then((body) => {
        if (!body.data) return;
        setMetrics([
          { label: "Employees", value: String(body.data.employeeCount), note: "Active workforce" },
          { label: "Present Today", value: String(body.data.presentToday), note: "Attendance live" },
          { label: "Pending Leaves", value: String(body.data.pendingLeaves), note: "Manager approval" },
          { label: "Payroll Net", value: `INR ${body.data.payrollNetPay.toLocaleString("en-IN")}`, note: "Current run" },
          { label: "Compliance", value: String(body.data.pendingCompliance), note: "Due filings" },
          { label: "Approvals", value: String(body.data.pendingApprovals), note: "Across workflows" },
        ]);
      })
      .catch(() => undefined);
  }, []);

  return (
    <section className="grid grid-cols-6 gap-4 max-xl:grid-cols-3 max-md:grid-cols-1">
      {metrics.map((metric) => (
        <MetricCard key={metric.label} {...metric} />
      ))}
    </section>
  );
}
