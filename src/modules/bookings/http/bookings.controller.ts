import { Request, Response } from "express";
import { z } from "zod";

import { CreateBookingUseCase } from "../application/usecases/create-booking.usecase";
import { ChangeBookingStatusUseCase } from "../application/usecases/change-booking-status.usecase";
import {
  BookingConflictError,
  BookingNotFoundError,
  BookingLockError,
  BookingStatusNotFoundError,
  InvalidBookingStatusTransitionError,
} from "../domain/booking.errors";

type BookingRouteParams = {
  id: string;
};

const createBookingSchema = z.object({
  propertyId: z.string().uuid(),
  guestName: z.string().min(2),
  fromDate: z.string().date(),
  toDate: z.string().date(),
});

export class BookingsController {
  constructor(
    private readonly createBookingUseCase: CreateBookingUseCase,
    private readonly changeBookingStatusUseCase: ChangeBookingStatusUseCase
  ) {}

  create = async (req: Request, res: Response) => {
    try {
      const input = createBookingSchema.parse(req.body);

      const booking = await this.createBookingUseCase.execute(input);

      return res.status(201).json(booking);
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  checkIn = async (req: Request<BookingRouteParams>, res: Response) => {
    try {
      const booking = await this.changeBookingStatusUseCase.execute({
        bookingId: req.params.id,
        targetStatusCode: "CHECKED_IN",
      });

      return res.json(booking);
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  checkOut = async (req: Request<BookingRouteParams>, res: Response) => {
    try {
      const booking = await this.changeBookingStatusUseCase.execute({
        bookingId: req.params.id,
        targetStatusCode: "CHECKED_OUT",
      });

      return res.json(booking);
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  cancel = async (req: Request<BookingRouteParams>, res: Response) => {
    try {
      const booking = await this.changeBookingStatusUseCase.execute({
        bookingId: req.params.id,
        targetStatusCode: "CANCELLED",
      });

      return res.json(booking);
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

    if (
      error instanceof BookingConflictError ||
      error instanceof BookingLockError ||
      error instanceof InvalidBookingStatusTransitionError
    ) {
      return res.status(409).json({
        message: error.message,
      });
    }

    if (error instanceof BookingNotFoundError) {
      return res.status(404).json({
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
}
