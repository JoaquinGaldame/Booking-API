import { Router } from "express";
import { redis } from "../../shared/infra/redis/redis.client";

export const propertiesRoutes = Router();

propertiesRoutes.get("/:id/availability", async (req, res) => {
  const { id } = req.params;
  const { from, to } = req.query;

  const cacheKey = `availability:property:${id}:from:${from}:to:${to}`;

  const cached = await redis.get(cacheKey);

  if (cached) {
    return res.json({
      source: "redis-cache",
      data: JSON.parse(cached),
    });
  }

  const availability = {
    propertyId: id,
    from,
    to,
    available: true,
  };

  await redis.set(cacheKey, JSON.stringify(availability), {
    EX: 60,
  });

  return res.json({
    source: "database-fake",
    data: availability,
  });
});