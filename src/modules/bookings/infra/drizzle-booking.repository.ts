import { SQL, and, desc, eq, gt, lt, sql } from "drizzle-orm";
import { db } from "../../../db";
import { bookings, bookingStatuses } from "../../../db/schema";
import {
  Booking,
  BookingListItem,
  BookingStatusCode,
} from "../domain/booking.entity";
import {
  BookingRepository,
  ListBookingsFilters,
  ListBookingsResult,
} from "../application/ports/booking.repository";

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

  async findById(id: string): Promise<Booking | null> {
    const result = await db
      .select({
        id: bookings.id,
        propertyId: bookings.propertyId,
        guestName: bookings.guestName,
        fromDate: bookings.fromDate,
        toDate: bookings.toDate,
        statusId: bookings.statusId,
      })
      .from(bookings)
      .where(eq(bookings.id, id))
      .limit(1);

    return result[0] ?? null;
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

  async findStatusCodeById(id: number): Promise<BookingStatusCode | null> {
    const result = await db
      .select({ code: bookingStatuses.code })
      .from(bookingStatuses)
      .where(eq(bookingStatuses.id, id))
      .limit(1);

    return (result[0]?.code as BookingStatusCode | undefined) ?? null;
  }

  async updateStatus(id: string, statusId: number): Promise<Booking | null> {
    const result = await db
      .update(bookings)
      .set({ statusId })
      .where(eq(bookings.id, id))
      .returning({
        id: bookings.id,
        propertyId: bookings.propertyId,
        guestName: bookings.guestName,
        fromDate: bookings.fromDate,
        toDate: bookings.toDate,
        statusId: bookings.statusId,
      });

    return result[0] ?? null;
  }

  async list(filters: ListBookingsFilters): Promise<ListBookingsResult> {
    const offset = (filters.page - 1) * filters.limit;
    const conditions: SQL[] = [];

    if (filters.propertyId) {
      conditions.push(eq(bookings.propertyId, filters.propertyId));
    }

    if (filters.fromDate) {
      conditions.push(gt(bookings.toDate, filters.fromDate));
    }

    if (filters.toDate) {
      conditions.push(lt(bookings.fromDate, filters.toDate));
    }

    const whereClause =
      conditions.length > 0 ? and(...conditions) : undefined;

    const items = await db
      .select({
        id: bookings.id,
        propertyId: bookings.propertyId,
        guestName: bookings.guestName,
        fromDate: bookings.fromDate,
        toDate: bookings.toDate,
        statusId: bookings.statusId,
        createdAt: bookings.createdAt,
        statusCode: bookingStatuses.code,
      })
      .from(bookings)
      .innerJoin(bookingStatuses, eq(bookings.statusId, bookingStatuses.id))
      .where(whereClause)
      .orderBy(desc(bookings.createdAt))
      .limit(filters.limit)
      .offset(offset);

    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(bookings)
      .where(whereClause);

    return {
      items: items as BookingListItem[],
      total: Number(totalResult[0]?.count ?? 0),
    };
  }
}
