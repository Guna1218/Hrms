import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { JwtService } from "@nestjs/jwt";
import { tenantLocalStorage, TenantStore } from "./tenant-context";

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // 1. Resolve tenantId from header
    let tenantId = (req.headers["x-tenant-id"] as string) || null;

    // 2. Resolve token payload for fallback tenant context
    let userId: string | null = null;
    let isOwner = false;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      try {
        const decoded = this.jwtService.decode(token) as any;
        if (decoded) {
          userId = decoded.sub || null;
          // Fallback to JWT's tenantId if header was not sent
          if (!tenantId) {
            tenantId = decoded.tenantId || null;
          }
          // Determine if user has system owner / super admin roles
          if (decoded.roles && (decoded.roles.includes("SUPER_ADMIN") || decoded.roles.includes("SYSTEM_OWNER"))) {
            isOwner = true;
          }
        }
      } catch (e) {
        // Ignore decode failures
      }
    }

    const store: TenantStore = {
      tenantId,
      userId,
      isOwner,
    };

    tenantLocalStorage.run(store, () => {
      next();
    });
  }
}
