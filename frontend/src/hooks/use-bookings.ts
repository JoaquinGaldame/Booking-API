import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createBooking, listBookings } from "../services/bookings";
import type { ListBookingsParams } from "../types/bookings";

export function useCreateBookingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["properties"] });
      void queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useBookingsQuery(params: ListBookingsParams) {
  return useQuery({
    queryKey: ["bookings", params],
    queryFn: () => listBookings(params),
    placeholderData: keepPreviousData,
  });
}
