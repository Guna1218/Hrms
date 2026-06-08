import { AppShell } from "../../components/app-shell";
import { AttendanceActionPanel } from "../../components/action-panels";
import { AttendanceTable, RegularizationsTable } from "../../components/live-tables";
import { ReferenceModuleHeader } from "../../components/reference-module";
import { ReferenceFlowStrip } from "../../components/reference-sections";
import { AttendanceRulesWorkspace } from "../../components/reference-workspaces";
import { Card } from "../../components/ui";
import { CalendarDays, Download, Fingerprint, SlidersHorizontal } from "lucide-react";

export default function AttendancePage() {
  return (
    <AppShell title="Attendance Management" subtitle="Check-in/out, shift rules, late marks, regularization, overtime and geo attendance.">
      <ReferenceModuleHeader
        eyebrow="Attendance"
        title="Attendance Dashboard"
        summary="Review daily presence, exceptions, regularization requests and attendance rules from one Kredily-style control desk."
        tabs={["Dashboard", "Attendance Log", "Regularization", "Shift & Rules"]}
        activeTab="Attendance Log"
        actions={[
          { label: "Check In", icon: <Fingerprint className="h-4 w-4" />, tone: "primary" },
          { label: "Month View", icon: <CalendarDays className="h-4 w-4" /> },
          { label: "Export", icon: <Download className="h-4 w-4" /> },
          { label: "Rules", icon: <SlidersHorizontal className="h-4 w-4" /> },
        ]}
        stats={[
          { label: "Source", value: "Live DB", note: "API connected" },
          { label: "Status", value: "Open", note: "Today view" },
          { label: "Approvals", value: "HR", note: "Manager flow" },
        ]}
      />
      <ReferenceFlowStrip module="Attendance" />
      <AttendanceRulesWorkspace />
      <AttendanceActionPanel />
      <Card>
        <h2 className="mb-4 text-lg font-semibold">Today&apos;s Logs</h2>
        <div className="overflow-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead className="bg-[#f8fafc] text-left text-xs uppercase text-muted">
              <tr>
                <th className="border-b border-[#dce2eb] p-3">Employee</th>
                <th className="border-b border-[#dce2eb] p-3">Date</th>
                <th className="border-b border-[#dce2eb] p-3">Check In</th>
                <th className="border-b border-[#dce2eb] p-3">Check Out</th>
                <th className="border-b border-[#dce2eb] p-3">Status</th>
              </tr>
            </thead>
            <AttendanceTable />
          </table>
        </div>
      </Card>
      <RegularizationsTable />
    </AppShell>
  );
}
