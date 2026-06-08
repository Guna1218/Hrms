import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class JobQueueService implements OnModuleInit {
  private queue: { id: string; type: string; payload: any }[] = [];
  private processing = false;

  constructor(private readonly prisma: PrismaService) {}

  onModuleInit() {
    // Start polling the queue
    this.processQueue();
  }

  async addJob(type: string, payload: any) {
    const jobId = `JOB_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    this.queue.push({ id: jobId, type, payload });

    // Log to system logs
    try {
      await this.prisma.systemLog.create({
        data: {
          service: "BACKGROUND_WORKER",
          logLevel: "INFO",
          message: `Queued job ${jobId} of type ${type}`,
        },
      });
    } catch (e) {
      console.error("Queue logging failed:", e);
    }

    // Trigger processing
    if (!this.processing) {
      this.processQueue();
    }

    return jobId;
  }

  private async processQueue() {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }

    this.processing = true;
    const job = this.queue.shift();

    if (job) {
      try {
        await this.prisma.systemLog.create({
          data: {
            service: "BACKGROUND_WORKER",
            logLevel: "INFO",
            message: `Starting job ${job.id} (${job.type})`,
          },
        });

        // Execute job
        await this.executeJob(job.type, job.payload);

        await this.prisma.systemLog.create({
          data: {
            service: "BACKGROUND_WORKER",
            logLevel: "INFO",
            message: `Completed job ${job.id} (${job.type}) successfully`,
          },
        });
      } catch (error: any) {
        console.error(`Error processing job ${job.id}:`, error);

        try {
          await this.prisma.errorLog.create({
            data: {
              service: "BACKGROUND_WORKER",
              endpoint: `Job: ${job.type}`,
              errorMessage: error.message || "Job processing failed",
              stackTrace: error.stack,
            },
          });
        } catch (e) {
          console.error("Failed to write job error to database:", e);
        }
      }
    }

    // Process next job
    setTimeout(() => this.processQueue(), 500);
  }

  private async executeJob(type: string, payload: any) {
    switch (type) {
      case "email_notification":
        console.log(`[BACKGROUND WORKER] Sending email to: ${payload.to}, Subject: ${payload.subject}`);
        // Here we could plug in real nodemailer SMTP calls if desired,
        // or trigger the email API.
        break;
      case "payroll_calculation":
        console.log(`[BACKGROUND WORKER] Calculating payroll for company: ${payload.companyId}, month: ${payload.month}`);
        // Simulate CPU intensive calculations
        await new Promise((resolve) => setTimeout(resolve, 2000));
        break;
      case "report_compilation":
        console.log(`[BACKGROUND WORKER] Compiling report for module: ${payload.module}`);
        // Simulate compiling file
        await new Promise((resolve) => setTimeout(resolve, 1500));
        break;
      default:
        console.warn(`[BACKGROUND WORKER] Unknown job type: ${type}`);
    }
  }
}
