import { PropertyRepository } from "../ports/property.repository";
import { Property } from "../../domain/property.entity";

export class ListPropertiesUseCase {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async execute(): Promise<Property[]> {
    return this.propertyRepository.findAll();
  }
}