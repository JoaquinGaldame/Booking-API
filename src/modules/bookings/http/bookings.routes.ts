import { Router } from "express";
import { DrizzleBookingRepository } from "../infra/drizzle-booking.repository";
import { RedisAvailabilityCache } from "../infra/redis-availability-cache";
import { RedisBookingLock } from "../infra/redis-booking-lock";
import { ChangeBookingStatusUseCase } from "../application/usecases/change-booking-status.usecase";
import { CreateBookingUseCase } from "../application/usecases/create-booking.usecase";
import { ListBookingsUseCase } from "../application/usecases/list-bookings.usecase";
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
const changeBookingStatusUseCase = new ChangeBookingStatusUseCase(
  bookingRepository,
  availabilityCache
);
const listBookingsUseCase = new ListBookingsUseCase(bookingRepository);

const controller = new BookingsController(
  createBookingUseCase,
  changeBookingStatusUseCase,
  listBookingsUseCase
);

router.get("/", controller.list);
router.post("/", controller.create);
router.post("/:id/check-in", controller.checkIn);
router.post("/:id/check-out", controller.checkOut);
router.post("/:id/cancel", controller.cancel);

export { router as bookingsRoutes };
