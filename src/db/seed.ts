import "dotenv/config";
import { db, pool } from "./index";
import { 
  bookingStatuses, 
  countries,
  provinces,
  propertyTypes,
  properties, } from "./schema";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("Seeding database...");
   /*
   * BOOKING STATUSES
   */
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
  
   /*
   * COUNTRIES
   */
  await db
    .insert(countries)
    .values([
      { code: "AR", name: "Argentina" },
      { code: "BR", name: "Brasil" },
      { code: "CL", name: "Chile" },
      { code: "UY", name: "Uruguay" },
      { code: "PY", name: "Paraguay" },
      { code: "BO", name: "Bolivia" },
      { code: "PE", name: "Perú" },
      { code: "US", name: "United States" },
      { code: "ES", name: "España" },
    ])
    .onConflictDoNothing();

  /*
   * ARGENTINA
   */
  const [argentina] = await db
    .select()
    .from(countries)
    .where(eq(countries.code, "AR"))
    .limit(1);

  if (!argentina) {
    throw new Error("Argentina country seed failed");
  }

  /*
   * PROVINCES
   */
  await db
    .insert(provinces)
    .values([
      { countryId: argentina.id, code: "AR-B", name: "Buenos Aires" },
      {
        countryId: argentina.id,
        code: "AR-C",
        name: "Ciudad Autónoma de Buenos Aires",
      },
      { countryId: argentina.id, code: "AR-K", name: "Catamarca" },
      { countryId: argentina.id, code: "AR-H", name: "Chaco" },
      { countryId: argentina.id, code: "AR-U", name: "Chubut" },
      { countryId: argentina.id, code: "AR-X", name: "Córdoba" },
      { countryId: argentina.id, code: "AR-W", name: "Corrientes" },
      { countryId: argentina.id, code: "AR-E", name: "Entre Ríos" },
      { countryId: argentina.id, code: "AR-P", name: "Formosa" },
      { countryId: argentina.id, code: "AR-Y", name: "Jujuy" },
      { countryId: argentina.id, code: "AR-L", name: "La Pampa" },
      { countryId: argentina.id, code: "AR-F", name: "La Rioja" },
      { countryId: argentina.id, code: "AR-M", name: "Mendoza" },
      { countryId: argentina.id, code: "AR-N", name: "Misiones" },
      { countryId: argentina.id, code: "AR-Q", name: "Neuquén" },
      { countryId: argentina.id, code: "AR-R", name: "Río Negro" },
      { countryId: argentina.id, code: "AR-A", name: "Salta" },
      { countryId: argentina.id, code: "AR-J", name: "San Juan" },
      { countryId: argentina.id, code: "AR-D", name: "San Luis" },
      { countryId: argentina.id, code: "AR-Z", name: "Santa Cruz" },
      { countryId: argentina.id, code: "AR-S", name: "Santa Fe" },
      { countryId: argentina.id, code: "AR-G", name: "Santiago del Estero" },
      { countryId: argentina.id, code: "AR-V", name: "Tierra del Fuego" },
      { countryId: argentina.id, code: "AR-T", name: "Tucumán" },
    ])
    .onConflictDoNothing();

  /*
   * PROPERTY TYPES
   */
  await db
    .insert(propertyTypes)
    .values([
      { code: "APARTMENT", name: "Apartment" },
      { code: "HOUSE", name: "House" },
      { code: "CABIN", name: "Cabin" },
      { code: "HOTEL_ROOM", name: "Hotel Room" },
      { code: "HOSTEL_ROOM", name: "Hostel Room" },
      { code: "PRIVATE_ROOM", name: "Private Room" },
      { code: "SHARED_ROOM", name: "Shared Room" },
      { code: "STUDIO", name: "Studio" },
      { code: "LOFT", name: "Loft" },
      { code: "CHALET", name: "Chalet" },
      { code: "COUNTRY_HOUSE", name: "Country House" },
      { code: "VILLA", name: "Villa" },
      { code: "BUNGALOW", name: "Bungalow" },
      { code: "DUPLEX", name: "Duplex" },
      { code: "CONDO", name: "Condominium" },
    ])
    .onConflictDoNothing();

  /*
   * OPTIONAL DEMO PROPERTIES
   */
  const [sanJuan] = await db
    .select()
    .from(provinces)
    .where(eq(provinces.code, "AR-J"))
    .limit(1);

  const [apartmentType] = await db
    .select()
    .from(propertyTypes)
    .where(eq(propertyTypes.code, "APARTMENT"))
    .limit(1);

  if (sanJuan && apartmentType) {
    await db
      .insert(properties)
      .values([
        {
          name: "Modern Apartment Downtown",
          description: "Modern apartment in San Juan city center",
          provinceId: sanJuan.id,
          propertyTypeId: apartmentType.id,
          address: "Av. Ignacio de la Roza 123",
          maxGuests: 4,
          basePricePerNight: 120,
        },
      ])
      .onConflictDoNothing();
  }

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