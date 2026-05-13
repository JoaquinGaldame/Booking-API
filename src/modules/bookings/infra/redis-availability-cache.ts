import { redis } from "../../../shared/infra/redis/redis.client";
import { AvailabilityCache } from "../application/ports/availability-cache";

export class RedisAvailabilityCache implements AvailabilityCache {
  async get<T>(key: string): Promise<T | null> {
    const value = await redis.get(key);

    if (!value) return null;

    return JSON.parse(value) as T;
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    await redis.set(key, JSON.stringify(value), {
      EX: ttlSeconds,
    });
  }

  async invalidateByProperty(propertyId: string): Promise<void> {
    const pattern = `availability:property:${propertyId}:*`;

    for await (const key of redis.scanIterator({ MATCH: pattern })) {
      await redis.del(key);
    }
  }
}