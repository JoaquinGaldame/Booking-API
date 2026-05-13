import { redis } from "../../../shared/infra/redis/redis.client";
import { BookingLock } from "../application/ports/booking-lock";

export class RedisBookingLock implements BookingLock {
  async acquire(key: string, ttlSeconds: number): Promise<boolean> {
    const result = await redis.set(key, "locked", {
      NX: true,
      EX: ttlSeconds,
    });

    return result === "OK";
  }

  async release(key: string): Promise<void> {
    await redis.del(key);
  }
}