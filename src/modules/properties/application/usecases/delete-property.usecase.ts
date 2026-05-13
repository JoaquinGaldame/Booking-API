import { PropertyRepository } from "../ports/property.repository";
import { PropertyNotFoundError } from "../../domain/property.errors";

export class DeletePropertyUseCase {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async execute(id: string): Promise<void> {
    const property = await this.propertyRepository.findById(id);

    if (!property) {
      throw new PropertyNotFoundError(id);
    }

    await this.propertyRepository.delete(id);
  }
}