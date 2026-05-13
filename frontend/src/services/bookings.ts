import { api } from "./api";
import type {
  Booking,
  CreateBookingInput,
  ListBookingsParams,
  ListBookingsResponse,
} from "../types/bookings";

export async function createBooking(input: CreateBookingInput) {
  const response = await api.post<Booking>("/api/bookings", input);
  return response.data;
}

export async function listBookings(params: ListBookingsParams) {
  const response = await api.get<ListBookingsResponse>("/api/bookings", {
    params,
  });

  return response.data;
}
