import { AsyncLocalStorage } from "async_hooks";

export interface TenantStore {
  tenantId: string | null;
  userId: string | null;
  isOwner: boolean;
}

export const tenantLocalStorage = new AsyncLocalStorage<TenantStore>();

export class TenantContext {
  static getStore(): TenantStore | undefined {
    return tenantLocalStorage.getStore();
  }

  static getTenantId(): string | null {
    return this.getStore()?.tenantId || null;
  }

  static getUserId(): string | null {
    return this.getStore()?.userId || null;
  }

  static isOwner(): boolean {
    return this.getStore()?.isOwner || false;
  }
}
