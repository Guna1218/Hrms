import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Request, Response } from "express";

@Catch()
export class ErrorMonitoringFilter implements ExceptionFilter {
  constructor(private readonly prisma: PrismaService) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof Error
        ? exception.message
        : typeof exception === "string"
        ? exception
        : "Internal server error";

    const stack = exception instanceof Error ? exception.stack : null;

    // Log the error in the database
    try {
      await this.prisma.errorLog.create({
        data: {
          service: "API_SERVICE",
          endpoint: `${request.method} ${request.url}`,
          errorMessage: message,
          stackTrace: stack || undefined,
        },
      });

      // Also log as system log
      await this.prisma.systemLog.create({
        data: {
          service: "API_SERVICE",
          logLevel: "ERROR",
          message: `${request.method} ${request.url} failed: ${message}`,
        },
      });
    } catch (dbError) {
      // Direct console fallback if database is down
      console.error("Failed to write error/system log to database:", dbError);
    }

    // Return the response to the client
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception instanceof HttpException && typeof exception.getResponse() === "object"
        ? (exception.getResponse() as any).message || message
        : message,
    });
  }
}
