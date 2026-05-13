import {
  CreatePropertyInput,
  Property,
  UpdatePropertyInput,
} from "../../domain/property.entity";

export interface PropertyRepository {
  create(input: CreatePropertyInput): Promise<Property>;

  findById(id: string): Promise<Property | null>;

  findAll(): Promise<Property[]>;

  update(id: string, input: UpdatePropertyInput): Promise<Property | null>;

  delete(id: string): Promise<void>;
}