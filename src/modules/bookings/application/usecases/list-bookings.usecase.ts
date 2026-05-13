import {
  BookingRepository,
  ListBookingsFilters,
} from "../ports/booking.repository";

interface ListBookingsInput {
  page: number;
  limit: number;
  fromDate?: string;
  toDate?: string;
  propertyId?: string;
}

export class ListBookingsUseCase {
  constructor(private readonly bookingRepository: BookingRepository) {}

  async execute(input: ListBookingsInput) {
    const filters: ListBookingsFilters = {
      page: input.page,
      limit: input.limit,
      fromDate: input.fromDate,
      toDate: input.toDate,
      propertyId: input.propertyId,
    };

    const result = await this.bookingRepository.list(filters);

    return {
      items: result.items,
      meta: {
        page: input.page,
        limit: input.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / input.limit),
      },
    };
  }
}
