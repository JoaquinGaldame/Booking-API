import { Request, Response } from "express";
import { z } from "zod";

import { CreatePropertyUseCase } from "../application/usecases/create-property.usecase";
import { GetPropertyByIdUseCase } from "../application/usecases/get-property-by-id.usecase";
import { ListPropertiesUseCase } from "../application/usecases/list-properties.usecase";
import { UpdatePropertyUseCase } from "../application/usecases/update-property.usecase";
import { DeletePropertyUseCase } from "../application/usecases/delete-property.usecase";
import { GetAvailabilityUseCase } from "../../bookings/application/usecases/get-availability.usecase";
import {
  InvalidPropertyDataError,
  PropertyNotFoundError,
} from "../domain/property.errors";

type PropertyRouteParams = {
  id: string;
};

type PropertyAvailabilityRouteParams = {
  propertyId: string;
};

const availabilitySchema = z.object({
  propertyId: z.string().uuid(),
  fromDate: z.string().date(),
  toDate: z.string().date(),
});

export class PropertiesController {
  constructor(
    private readonly createPropertyUseCase: CreatePropertyUseCase,
    private readonly getPropertyByIdUseCase: GetPropertyByIdUseCase,
    private readonly listPropertiesUseCase: ListPropertiesUseCase,
    private readonly updatePropertyUseCase: UpdatePropertyUseCase,
    private readonly deletePropertyUseCase: DeletePropertyUseCase,
    private readonly getAvailabilityUseCase: GetAvailabilityUseCase
  ) {}

  create = async (req: Request, res: Response) => {
    try {
      const property = await this.createPropertyUseCase.execute(req.body);
      return res.status(201).json(property);
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  findAll = async (_req: Request, res: Response) => {
    try {
      const properties = await this.listPropertiesUseCase.execute();
      return res.json(properties);
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  findById = async (req: Request<PropertyRouteParams>, res: Response) => {
    try {
      const property = await this.getPropertyByIdUseCase.execute(req.params.id);
      return res.json(property);
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  update = async (req: Request<PropertyRouteParams>, res: Response) => {
    try {
      const property = await this.updatePropertyUseCase.execute(
        req.params.id,
        req.body
      );

      return res.json(property);
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  delete = async (req: Request<PropertyRouteParams>, res: Response) => {
    try {
      await this.deletePropertyUseCase.execute(req.params.id);
      return res.status(204).send();
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  getAvailability = async (
    req: Request<PropertyAvailabilityRouteParams>,
    res: Response
  ) => {
    try {
      const input = availabilitySchema.parse({
        propertyId: req.params.propertyId,
        fromDate: req.query.fromDate,
        toDate: req.query.toDate,
      });

      const availability = await this.getAvailabilityUseCase.execute(input);

      return res.json(availability);
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  private handleError(error: unknown, res: Response) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    if (error instanceof InvalidPropertyDataError) {
      return res.status(400).json({ message: error.message });
    }

    if (error instanceof PropertyNotFoundError) {
      return res.status(404).json({ message: error.message });
    }

    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
