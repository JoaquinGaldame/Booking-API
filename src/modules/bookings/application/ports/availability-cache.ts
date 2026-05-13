export interface AvailabilityCache {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds: number): Promise<void>;
  invalidateByProperty(propertyId: string): Promise<void>;
}