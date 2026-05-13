import { Booking } from "../../domain/booking.entity";

export interface BookingRepository {
  create(booking: Booking): Promise<Booking>;

  hasOverlappingBooking(params: {
    propertyId: string;
    fromDate: string;
    toDate: string;
  }): Promise<boolean>;

  findStatusIdByCode(code: string): Promise<number | null>;
}