import {
  pgTable,
  uuid,
  varchar,
  integer,
  date,
  timestamp,
  index,
  check,
  boolean,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const bookingStatuses = pgTable("booking_statuses", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
});

export const countries = pgTable("countries", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  code: varchar("code", { length: 10 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
});

export const provinces = pgTable("provinces", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  countryId: integer("country_id")
    .notNull()
    .references(() => countries.id),

  code: varchar("code", { length: 50 }).notNull(),
  name: varchar("name", { length: 150 }).notNull(),
});

export const propertyTypes = pgTable("property_types", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
});

export const properties = pgTable("properties", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  description: varchar("description", { length: 1000 }),
  provinceId: integer("province_id")
    .notNull()
    .references(() => provinces.id),

  propertyTypeId: integer("property_type_id")
    .notNull()
    .references(() => propertyTypes.id),
  maxGuests: integer("max_guests").notNull(),
  basePricePerNight: integer("base_price_per_night").notNull(),
  address: varchar("address", { length: 300 }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
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