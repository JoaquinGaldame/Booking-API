export interface BookingStatus {
  id: number;
  code: string;
  name: string;
}

export interface Booking {
  id?: string;
  propertyId: string;
  guestName: string;
  fromDate: string;
  toDate: string;
  statusId: number;
}

export interface BookingListItem extends Booking {
  id: string;
  createdAt: Date;
  statusCode: BookingStatusCode;
}

export type BookingStatusCode =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "EXPIRED"
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "NO_SHOW";
