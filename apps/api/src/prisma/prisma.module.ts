import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { JobQueueService } from "../common/queue/job-queue.service";

@Global()
@Module({
  providers: [PrismaService, JobQueueService],
  exports: [PrismaService, JobQueueService],
})
export class PrismaModule {}

