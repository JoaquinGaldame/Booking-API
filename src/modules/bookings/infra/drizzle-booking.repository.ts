import { and, eq, lt, gt } from "drizzle-orm";
import { db } from "../../../db";
import { bookings, bookingStatuses } from "../../../db/schema";
import { Booking } from "../domain/booking.entity";
import { BookingRepository } from "../application/ports/booking.repository";

export class DrizzleBookingRepository implements BookingRepository {
  async create(booking: Booking): Promise<Booking> {
    const result = await db
      .insert(bookings)
      .values({
        propertyId: booking.propertyId,
        guestName: booking.guestName,
        fromDate: booking.fromDate,
        toDate: booking.toDate,
        statusId: booking.statusId,
      })
      .returning({
        id: bookings.id,
        propertyId: bookings.propertyId,
        guestName: bookings.guestName,
        fromDate: bookings.fromDate,
        toDate: bookings.toDate,
        statusId: bookings.statusId,
      });

    return result[0];
  }

  async hasOverlappingBooking(params: {
    propertyId: string;
    fromDate: string;
    toDate: string;
  }): Promise<boolean> {
    const confirmedStatusId = await this.findStatusIdByCode("CONFIRMED");

    if (!confirmedStatusId) {
      return false;
    }

    const result = await db
      .select({ id: bookings.id })
      .from(bookings)
      .where(
        and(
          eq(bookings.propertyId, params.propertyId),
          eq(bookings.statusId, confirmedStatusId),
          lt(bookings.fromDate, params.toDate),
          gt(bookings.toDate, params.fromDate)
        )
      )
      .limit(1);

    return result.length > 0;
  }

  async findStatusIdByCode(code: string): Promise<number | null> {
    const result = await db
      .select({ id: bookingStatuses.id })
      .from(bookingStatuses)
      .where(eq(bookingStatuses.code, code))
      .limit(1);

    return result[0]?.id ?? null;
  }
}