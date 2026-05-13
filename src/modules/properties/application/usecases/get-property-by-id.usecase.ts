import { PropertyRepository } from "../ports/property.repository";
import { Property } from "../../domain/property.entity";
import { PropertyNotFoundError } from "../../domain/property.errors";

export class GetPropertyByIdUseCase {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async execute(id: string): Promise<Property> {
    const property = await this.propertyRepository.findById(id);

    if (!property) {
      throw new PropertyNotFoundError(id);
    }

    return property;
  }
}