import { Request, Response } from "express";
import { z } from "zod";

import { CreateBookingUseCase } from "../application/usecases/create-booking.usecase";
import { GetAvailabilityUseCase } from "../application/usecases/get-availability.usecase";

import {
  BookingConflictError,
  BookingLockError,
  BookingStatusNotFoundError,
} from "../domain/booking.errors";



const createBookingSchema = z.object({
  propertyId: z.string().uuid(),
  guestName: z.string().min(2),
  fromDate: z.string().date(),
  toDate: z.string().date(),
});

const availabilitySchema = z.object({
  propertyId: z.string().uuid(),
  fromDate: z.string().date(),
  toDate: z.string().date(),
});

export class BookingsController {
  constructor(
    private readonly createBookingUseCase: CreateBookingUseCase,
    private readonly getAvailabilityUseCase: GetAvailabilityUseCase
  ) {}

  create = async (req: Request, res: Response) => {
    try {
      const input = createBookingSchema.parse(req.body);

      const booking = await this.createBookingUseCase.execute(input);

      return res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        });
      }

      if (
        error instanceof BookingConflictError ||
        error instanceof BookingLockError
      ) {
        return res.status(409).json({
          message: error.message,
        });
      }

      if (error instanceof BookingStatusNotFoundError) {
        return res.status(500).json({
          message: error.message,
        });
      }

      console.error(error);

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  };

  getAvailability = async (req: Request, res: Response) => {
    try {
      const input = availabilitySchema.parse({
        propertyId: req.params.propertyId,
        fromDate: req.query.fromDate,
        toDate: req.query.toDate,
      });

      const availability = await this.getAvailabilityUseCase.execute(input);

      return res.json(availability);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        });
      }

      console.error(error);

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  };
}