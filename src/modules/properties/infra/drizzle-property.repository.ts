import { eq } from "drizzle-orm";

import { db } from "../../../db";
import { properties } from "../../../db/schema";

import { PropertyRepository } from "../application/ports/property.repository";
import {
  CreatePropertyInput,
  Property,
  UpdatePropertyInput,
} from "../domain/property.entity";

export class DrizzlePropertyRepository implements PropertyRepository {
  
  async create(input: CreatePropertyInput): Promise<Property> {
    const [created] = await db
      .insert(properties)
      .values({
        name: input.name,
        description: input.description ?? null,
        provinceId: input.provinceId,
        propertyTypeId: input.propertyTypeId,
        address: input.address,
        maxGuests: input.maxGuests,
        basePricePerNight: input.basePricePerNight,
      })
      .returning();

    return created;
  }

  async findById(id: string): Promise<Property | null> {
    const [property] = await db
      .select()
      .from(properties)
      .where(eq(properties.id, id))
      .limit(1);

    return property ?? null;
  }

  async findAll(): Promise<Property[]> {
    return db.select().from(properties);
  }

  async update(
    id: string,
    input: UpdatePropertyInput
  ): Promise<Property | null> {
    const [updated] = await db
      .update(properties)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(properties.id, id))
      .returning();

    return updated ?? null;
  }

  async delete(id: string): Promise<void> {
    await db
      .update(properties)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(properties.id, id));
  }
}