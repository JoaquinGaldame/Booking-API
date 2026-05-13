import { AvailabilityCache } from "../ports/availability-cache";
import { BookingRepository } from "../ports/booking.repository";
import { BookingStatusCode } from "../../domain/booking.entity";
import {
  BookingNotFoundError,
  BookingStatusNotFoundError,
  InvalidBookingStatusTransitionError,
} from "../../domain/booking.errors";

interface ChangeBookingStatusInput {
  bookingId: string;
  targetStatusCode: BookingStatusCode;
}

const allowedTransitions: Record<BookingStatusCode, BookingStatusCode[]> = {
  PENDING: [],
  CONFIRMED: ["CHECKED_IN", "CANCELLED"],
  CANCELLED: [],
  EXPIRED: [],
  CHECKED_IN: ["CHECKED_OUT"],
  CHECKED_OUT: [],
  NO_SHOW: [],
};

export class ChangeBookingStatusUseCase {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly availabilityCache: AvailabilityCache
  ) {}

  async execute(input: ChangeBookingStatusInput) {
    const booking = await this.bookingRepository.findById(input.bookingId);

    if (!booking?.id) {
      throw new BookingNotFoundError(input.bookingId);
    }

    const currentStatusCode = await this.bookingRepository.findStatusCodeById(
      booking.statusId
    );

    if (!currentStatusCode) {
      throw new BookingStatusNotFoundError(String(booking.statusId));
    }

    const isTransitionAllowed = allowedTransitions[currentStatusCode].includes(
      input.targetStatusCode
    );

    if (!isTransitionAllowed) {
      throw new InvalidBookingStatusTransitionError(
        currentStatusCode,
        input.targetStatusCode
      );
    }

    const targetStatusId = await this.bookingRepository.findStatusIdByCode(
      input.targetStatusCode
    );

    if (!targetStatusId) {
      throw new BookingStatusNotFoundError(input.targetStatusCode);
    }

    const updatedBooking = await this.bookingRepository.updateStatus(
      booking.id,
      targetStatusId
    );

    if (!updatedBooking) {
      throw new BookingNotFoundError(input.bookingId);
    }

    await this.invalidateAvailabilityCache(
      updatedBooking.propertyId,
      booking.id
    );

    return updatedBooking;
  }

  private async invalidateAvailabilityCache(
    propertyId: string,
    bookingId: string
  ) {
    try {
      await this.availabilityCache.invalidateByProperty(propertyId);
    } catch (error) {
      console.error("Failed to invalidate availability cache after booking status change", {
        bookingId,
        propertyId,
        error,
      });
    }
  }
}
