import "dotenv/config";
import { app } from "./app";
import { connectRedis } from "./shared/infra/redis/redis.client";

const PORT = process.env.PORT || 3000;

async function main() {
  await connectRedis();

  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
  });
}

main().catch((error) => {
  console.error("Server failed to start", error);
  process.exit(1);
});