import { AvailabilityCache } from "../ports/availability-cache";
import { BookingLock } from "../ports/booking-lock";
import { BookingRepository } from "../ports/booking.repository";
import { BookingConflictError, BookingLockError, BookingStatusNotFoundError } from "../../domain/booking.errors";


interface CreateBookingInput {
  propertyId: string;
  guestName: string;
  fromDate: string;
  toDate: string;
}

export class CreateBookingUseCase {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly bookingLock: BookingLock,
    private readonly availabilityCache: AvailabilityCache
  ) {}

  async execute(input: CreateBookingInput) {
    const lockKey = `lock:booking:property:${input.propertyId}:${input.fromDate}:${input.toDate}`;

    const lockAcquired = await this.bookingLock.acquire(lockKey, 10);

    if (!lockAcquired) {
      throw new BookingLockError();
    }

    try {
      const confirmedStatusId =
        await this.bookingRepository.findStatusIdByCode("CONFIRMED");

      if (!confirmedStatusId) {
        throw new BookingStatusNotFoundError("CONFIRMED");
      }

      const hasOverlap = await this.bookingRepository.hasOverlappingBooking({
        propertyId: input.propertyId,
        fromDate: input.fromDate,
        toDate: input.toDate,
      });

      if (hasOverlap) {
        throw new BookingConflictError();
      }

      const booking = await this.bookingRepository.create({
        propertyId: input.propertyId,
        guestName: input.guestName,
        fromDate: input.fromDate,
        toDate: input.toDate,
        statusId: confirmedStatusId,
      });

      await this.availabilityCache.invalidateByProperty(input.propertyId);

      return booking;
    } finally {
      await this.bookingLock.release(lockKey);
    }
  }
}