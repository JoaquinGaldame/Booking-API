import {
  pgTable,
  uuid,
  varchar,
  integer,
  date,
  timestamp,
  index,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const bookingStatuses = pgTable("booking_statuses", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
});

export const properties = pgTable("properties", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  location: varchar("location", { length: 300 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    propertyId: uuid("property_id")
      .notNull()
      .references(() => properties.id),
    guestName: varchar("guest_name", { length: 200 }).notNull(),
    fromDate: date("from_date").notNull(),
    toDate: date("to_date").notNull(),
    statusId: integer("status_id")
      .notNull()
      .references(() => bookingStatuses.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("idx_bookings_property_dates").on(
      table.propertyId,
      table.fromDate,
      table.toDate
    ),
    index("idx_bookings_status").on(table.statusId),
    check("valid_booking_dates", sql`${table.fromDate} < ${table.toDate}`),
  ]
);