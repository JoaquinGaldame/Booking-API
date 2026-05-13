CREATE TABLE "booking_statuses" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "booking_statuses_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"code" varchar(50) NOT NULL,
	"name" varchar(100) NOT NULL,
	CONSTRAINT "booking_statuses_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"guest_name" varchar(200) NOT NULL,
	"from_date" date NOT NULL,
	"to_date" date NOT NULL,
	"status_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "valid_booking_dates" CHECK ("bookings"."from_date" < "bookings"."to_date")
);
--> statement-breakpoint
CREATE TABLE "countries" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "countries_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"code" varchar(10) NOT NULL,
	"name" varchar(100) NOT NULL,
	CONSTRAINT "countries_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "properties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(200) NOT NULL,
	"description" varchar(1000),
	"province_id" integer NOT NULL,
	"property_type_id" integer NOT NULL,
	"max_guests" integer NOT NULL,
	"base_price_per_night" integer NOT NULL,
	"address" varchar(300) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property_types" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "property_types_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"code" varchar(50) NOT NULL,
	"name" varchar(100) NOT NULL,
	CONSTRAINT "property_types_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "provinces" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "provinces_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"country_id" integer NOT NULL,
	"code" varchar(50) NOT NULL,
	"name" varchar(150) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_status_id_booking_statuses_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."booking_statuses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_province_id_provinces_id_fk" FOREIGN KEY ("province_id") REFERENCES "public"."provinces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_property_type_id_property_types_id_fk" FOREIGN KEY ("property_type_id") REFERENCES "public"."property_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "provinces" ADD CONSTRAINT "provinces_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_bookings_property_dates" ON "bookings" USING btree ("property_id","from_date","to_date");--> statement-breakpoint
CREATE INDEX "idx_bookings_status" ON "bookings" USING btree ("status_id");