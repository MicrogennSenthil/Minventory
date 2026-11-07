import { AsyncLocalStorage } from 'async_hooks';

// Per-request tenant context. Tenant comes ONLY from the verified JWT.
export interface TenantStore {
  tenantId: string;
  userId: string;
}

export const tenantStorage = new AsyncLocalStorage<TenantStore>();

export function currentTenant(): TenantStore {
  const store = tenantStorage.getStore();
  if (!store) {
    throw new Error('No tenant context: request was not authenticated');
  }
  return store;
}
