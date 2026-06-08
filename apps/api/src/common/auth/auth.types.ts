export interface AuthenticatedUser {
  sub: string;
  email: string;
  employeeId?: string | null;
  tenantId?: string | null;
  roles: string[];
  permissions: string[];
}

declare module "express" {
  interface Request {
    user?: AuthenticatedUser;
  }
}
