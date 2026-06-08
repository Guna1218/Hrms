import { Injectable, NotFoundException } from "@nestjs/common";
import { response } from "../../common/crud-response";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateCandidateDto, CreateJobDto, CreateOfferDto, MoveApplicationStageDto, ScheduleInterviewDto } from "./dto/ats.dto";

@Injectable()
export class AtsService {
  constructor(private readonly prisma: PrismaService) {}

  async jobs() {
    const jobs = await this.prisma.jobPosting.findMany({
      include: {
        applications: { include: { candidate: true, interviews: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return response("ats", "jobs", jobs);
  }

  async createJob(data: CreateJobDto) {
    const job = await this.prisma.jobPosting.create({
      data: {
        companyId: data.companyId,
        title: data.title,
        departmentId: data.departmentId,
        locationId: data.locationId,
        openings: data.openings,
        status: "OPEN",
      },
      include: { applications: true },
    });
    await this.audit("job.create", "job_posting", job.id, job);
    return response("ats", "job.create", job);
  }

  async candidates() {
    const candidates = await this.prisma.candidate.findMany({
      include: {
        applications: {
          include: {
            jobPosting: true,
            interviews: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return response("ats", "candidates", candidates);
  }

  async createCandidate(data: CreateCandidateDto) {
    const candidate = await this.prisma.candidate.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        resumeUrl: data.resumeUrl,
        source: data.source,
        currentStage: "SCREENING",
        applications: data.jobPostingId
          ? {
              create: {
                jobPostingId: data.jobPostingId,
                stage: "SCREENING",
                status: "ACTIVE",
              },
            }
          : undefined,
      },
      include: { applications: { include: { jobPosting: true } } },
    });
    await this.audit("candidate.create", "candidate", candidate.id, candidate);
    return response("ats", "candidate.create", candidate);
  }

  async moveStage(id: string, data: MoveApplicationStageDto) {
    const application = await this.prisma.jobApplication.findUnique({ where: { id } });
    if (!application) throw new NotFoundException("Application not found");
    const updated = await this.prisma.jobApplication.update({
      where: { id },
      data: {
        stage: data.stage,
        status: data.status || application.status,
      },
      include: { candidate: true, jobPosting: true, interviews: true },
    });
    await this.prisma.candidate.update({
      where: { id: updated.candidateId },
      data: { currentStage: data.stage },
    });
    await this.audit("application.stage", "job_application", id, updated);
    return response("ats", "application.stage", updated);
  }

  async scheduleInterview(data: ScheduleInterviewDto) {
    const application = await this.prisma.jobApplication.findUnique({ where: { id: data.applicationId } });
    if (!application) throw new NotFoundException("Application not found");
    const interview = await this.prisma.interview.create({
      data: {
        applicationId: data.applicationId,
        interviewerEmployeeId: data.interviewerEmployeeId,
        scheduledAt: new Date(data.scheduledAt),
        mode: data.mode,
        status: "SCHEDULED",
      },
      include: { application: { include: { candidate: true, jobPosting: true } } },
    });
    await this.audit("interview.schedule", "interview", interview.id, interview);
    return response("ats", "interview.schedule", interview);
  }

  async createOffer(data: CreateOfferDto) {
    const application = await this.prisma.jobApplication.findUnique({ where: { id: data.applicationId } });
    if (!application) throw new NotFoundException("Application not found");
    const updated = await this.prisma.jobApplication.update({
      where: { id: data.applicationId },
      data: { stage: "OFFER", status: "OFFERED" },
      include: { candidate: true, jobPosting: true, interviews: true },
    });
    await this.prisma.candidate.update({
      where: { id: updated.candidateId },
      data: { currentStage: "OFFER" },
    });
    await this.audit("offer.create", "job_application", data.applicationId, updated);
    return response("ats", "offer.create", updated);
  }

  private async audit(action: string, entityType: string, entityId: string, data: unknown) {
    await this.prisma.auditLog.create({
      data: {
        module: "ats",
        action,
        entityType,
        entityId,
        newValueJson: JSON.parse(JSON.stringify(data)),
      },
    });
  }
}
