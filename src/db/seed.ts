import "dotenv/config";
import { db, pool } from "./index";
import { bookingStatuses } from "./schema";

async function seed() {
  await db
    .insert(bookingStatuses)
    .values([
      { code: "PENDING", name: "Pending Confirmation" },
      { code: "CONFIRMED", name: "Confirmed" },
      { code: "CANCELLED", name: "Cancelled" },
      { code: "EXPIRED", name: "Expired" },
      { code: "CHECKED_IN", name: "Checked In" },
      { code: "CHECKED_OUT", name: "Checked Out" },
      { code: "NO_SHOW", name: "No Show" },
    ])
    .onConflictDoNothing();

  await pool.end();
}

seed()
  .then(() => {
    console.log("Database seeded successfully");
  })
  .catch(async (error) => {
    console.error(error);
    await pool.end();
    process.exit(1);
  });