export type Booking = {
  id: string;
  propertyId: string;
  guestName: string;
  fromDate: string;
  toDate: string;
  statusId: number;
};

export type CreateBookingInput = {
  propertyId: string;
  guestName: string;
  fromDate: string;
  toDate: string;
};

export type BookingStatusCode =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "EXPIRED"
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "NO_SHOW";

export type BookingListItem = Booking & {
  createdAt: string;
  statusCode: BookingStatusCode;
};

export type ListBookingsParams = {
  page: number;
  limit: number;
  fromDate?: string;
  toDate?: string;
  propertyId?: string;
};

export type ListBookingsResponse = {
  items: BookingListItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
