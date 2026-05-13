import { Router } from "express";
import { DrizzleBookingRepository } from "../infra/drizzle-booking.repository";
import { RedisAvailabilityCache } from "../infra/redis-availability-cache";
import { RedisBookingLock } from "../infra/redis-booking-lock";
import { CreateBookingUseCase } from "../application/usecases/create-booking.usecase";
import { GetAvailabilityUseCase } from "../application/usecases/get-availability.usecase";
import { BookingsController } from "./bookings.controller";

const router = Router();

const bookingRepository = new DrizzleBookingRepository();
const bookingLock = new RedisBookingLock();
const availabilityCache = new RedisAvailabilityCache();

const createBookingUseCase = new CreateBookingUseCase(
  bookingRepository,
  bookingLock,
  availabilityCache
);

const getAvailabilityUseCase = new GetAvailabilityUseCase(
  bookingRepository,
  availabilityCache
);

const controller = new BookingsController(
  createBookingUseCase,
  getAvailabilityUseCase
);

router.post("/bookings", controller.create);

router.get("/properties/:propertyId/availability",controller.getAvailability);

export { router as bookingsRoutes };