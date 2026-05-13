import { PropertyRepository } from "../ports/property.repository";
import {
  CreatePropertyInput,
  Property,
} from "../../domain/property.entity";
import { InvalidPropertyDataError } from "../../domain/property.errors";

export class CreatePropertyUseCase {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async execute(input: CreatePropertyInput): Promise<Property> {
    if (!input.name || input.name.trim().length < 3) {
      throw new InvalidPropertyDataError("Property name must have at least 3 characters");
    }

    if (!input.address || input.address.trim().length < 3) {
      throw new InvalidPropertyDataError(
        "Property address must have at least 3 characters"
      );
    }

    if (!input.provinceId || input.provinceId <= 0) {
      throw new InvalidPropertyDataError("Province is required");
    }

    if (!input.propertyTypeId || input.propertyTypeId <= 0) {
      throw new InvalidPropertyDataError("Property type is required");
    }


    if (input.maxGuests <= 0) {
      throw new InvalidPropertyDataError("Max guests must be greater than zero");
    }

    if (Number(input.basePricePerNight) <= 0) {
      throw new InvalidPropertyDataError("Base price per night must be greater than zero");
    }

    return this.propertyRepository.create({
      name: input.name.trim(),
      description: input.description ?? null,
      provinceId: input.provinceId,
      propertyTypeId: input.propertyTypeId,
      address: input.address.trim(),
      maxGuests: input.maxGuests,
      basePricePerNight: input.basePricePerNight,
    });
  }
}