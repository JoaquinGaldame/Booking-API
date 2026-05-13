import { PropertyRepository } from "../ports/property.repository";
import {
  Property,
  UpdatePropertyInput,
} from "../../domain/property.entity";
import { InvalidPropertyDataError, PropertyNotFoundError } from "../../domain/property.errors";

export class UpdatePropertyUseCase {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async execute(id: string, input: UpdatePropertyInput): Promise<Property> {
    

    if (input.name !== undefined && input.name.trim().length < 3) {
      throw new InvalidPropertyDataError(
        "Property name must have at least 3 characters"
      );
    }

    if (input.address !== undefined && input.address.trim().length < 3) {
      throw new InvalidPropertyDataError(
        "Property address must have at least 3 characters"
      );
    }

    if (input.provinceId !== undefined && input.provinceId <= 0) {
      throw new InvalidPropertyDataError("Province is invalid");
    }

    if (input.propertyTypeId !== undefined && input.propertyTypeId <= 0) {
      throw new InvalidPropertyDataError("Property type is invalid");
    }
    
    const updated = await this.propertyRepository.update(id, input);

    if (!updated) {
      throw new PropertyNotFoundError(id);
    }

    return updated;
  }
}