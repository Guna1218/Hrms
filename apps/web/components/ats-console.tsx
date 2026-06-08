"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../lib/client-api";
import { fallbackAtsCandidates, fallbackAtsJobs } from "../lib/fallback-data";
import { onDataRefresh, requestDataRefresh } from "../lib/refresh-events";
import { Card, MetricCard, StatusPill } from "./ui";

type JobRow = (typeof fallbackAtsJobs)[number];
type CandidateRow = (typeof fallbackAtsCandidates)[number];

interface ApiJob {
  id: string;
  title: string;
  openings: number;
  status: string;
  applications: Array<{ stage: string }>;
}

interface ApiCandidate {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  source?: string | null;
  currentStage: string;
  applications: Array<{ id: string; stage: string; jobPosting: { title: string }; interviews: unknown[] }>;
}

export function AtsConsole() {
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [candidates, setCandidates] = useState<CandidateRow[]>([]);
  const [message, setMessage] = useState("");

  function load() {
    apiFetch<ApiJob[]>("/ats/jobs")
      .then((body) => {
        if (!body.data) return;
        setJobs(body.data.map((job) => ({
          id: job.id,
          title: job.title,
          openings: job.openings,
          status: job.status,
          candidates: job.applications.length,
          stage: job.applications[0]?.stage || "SCREENING",
        })));
      })
      .catch(() => undefined);

    apiFetch<ApiCandidate[]>("/ats/candidates")
      .then((body) => {
        if (!body.data) return;
        setCandidates(body.data.map((candidate) => {
          const application = candidate.applications[0];
          return {
            id: candidate.id,
            fullName: candidate.fullName,
            email: candidate.email,
            phone: candidate.phone || "-",
            source: candidate.source || "-",
            currentStage: candidate.currentStage,
            jobTitle: application?.jobPosting.title || "-",
            applicationId: application?.id || "",
            interviews: application?.interviews.length || 0,
          };
        }));
      })
      .catch(() => undefined);
  }

  useEffect(() => {
    load();
    return onDataRefresh("ats", load);
  }, []);

  async function moveStage(applicationId: string, stage: string) {
    if (!applicationId) return;
    await apiFetch(`/ats/applications/${applicationId}/stage`, {
      method: "PATCH",
      body: JSON.stringify({ stage }),
    });
    setMessage(`Application moved to ${stage}.`);
    requestDataRefresh("ats");
  }

  return (
    <div className="grid gap-5">
      {message ? <div className="rounded-lg bg-[#e6f5ef] p-3 text-sm text-[#18865a]">{message}</div> : null}
      <div className="grid grid-cols-4 gap-3 max-xl:grid-cols-2 max-md:grid-cols-1">
        <MetricCard label="Open Jobs" value={String(jobs.filter((job) => job.status === "OPEN").length)} note="Active hiring" />
        <MetricCard label="Candidates" value={String(candidates.length)} note="Talent pipeline" />
        <MetricCard label="Interviews" value={String(candidates.reduce((sum, item) => sum + item.interviews, 0))} note="Scheduled rounds" />
        <MetricCard label="Offers" value={String(candidates.filter((item) => item.currentStage === "OFFER").length)} note="Offer workflow" />
      </div>

      <Card>
        <h2 className="mb-4 text-lg font-semibold">Open Jobs</h2>
        <div className="grid grid-cols-3 gap-3 max-lg:grid-cols-2 max-md:grid-cols-1">
          {jobs.map((job) => (
            <div className="rounded-lg border border-[#dce2eb] p-4" key={job.id}>
              <div className="font-semibold">{job.title}</div>
              <div className="mt-2 text-sm text-muted">{job.openings} openings / {job.candidates} candidates</div>
              <div className="mt-3 flex gap-2"><StatusPill>{job.status}</StatusPill><StatusPill tone="yellow">{job.stage}</StatusPill></div>
              <div className="mt-3 text-xs text-muted">Job ID: {job.id}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-semibold">Candidate Pipeline</h2>
        <div className="overflow-auto">
          <table className="w-full min-w-[920px] border-collapse text-sm">
            <thead className="bg-[#f8fafc] text-left text-xs uppercase text-muted">
              <tr>
                <th className="border-b border-[#dce2eb] p-3">Candidate</th>
                <th className="border-b border-[#dce2eb] p-3">Job</th>
                <th className="border-b border-[#dce2eb] p-3">Source</th>
                <th className="border-b border-[#dce2eb] p-3">Stage</th>
                <th className="border-b border-[#dce2eb] p-3">Interviews</th>
                <th className="border-b border-[#dce2eb] p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr key={candidate.id}>
                  <td className="border-b border-[#dce2eb] p-3">
                    <div className="font-semibold">{candidate.fullName}</div>
                    <div className="text-xs text-muted">{candidate.email}</div>
                  </td>
                  <td className="border-b border-[#dce2eb] p-3">{candidate.jobTitle}</td>
                  <td className="border-b border-[#dce2eb] p-3">{candidate.source}</td>
                  <td className="border-b border-[#dce2eb] p-3"><StatusPill tone="yellow">{candidate.currentStage}</StatusPill></td>
                  <td className="border-b border-[#dce2eb] p-3">{candidate.interviews}</td>
                  <td className="border-b border-[#dce2eb] p-3">
                    <div className="flex flex-wrap gap-2">
                      <button className="rounded-lg border border-[#dce2eb] px-3 py-1 text-xs font-semibold" onClick={() => moveStage(candidate.applicationId, "INTERVIEW")}>Interview</button>
                      <button className="rounded-lg border border-[#dce2eb] px-3 py-1 text-xs font-semibold" onClick={() => moveStage(candidate.applicationId, "OFFER")}>Offer</button>
                      <button className="rounded-lg bg-brand px-3 py-1 text-xs font-semibold text-white" onClick={() => moveStage(candidate.applicationId, "JOINING")}>Joining</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
