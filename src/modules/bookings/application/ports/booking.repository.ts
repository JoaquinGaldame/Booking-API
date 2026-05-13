import { Booking, BookingStatusCode } from "../../domain/booking.entity";

export interface BookingRepository {
  create(booking: Booking): Promise<Booking>;

  findById(id: string): Promise<Booking | null>;

  hasOverlappingBooking(params: {
    propertyId: string;
    fromDate: string;
    toDate: string;
  }): Promise<boolean>;

  findStatusIdByCode(code: string): Promise<number | null>;

  findStatusCodeById(id: number): Promise<BookingStatusCode | null>;

  updateStatus(id: string, statusId: number): Promise<Booking | null>;
}
