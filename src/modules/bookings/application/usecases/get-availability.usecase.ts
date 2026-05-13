import { AvailabilityCache } from "./ports/availability-cache";
import { BookingRepository } from "./ports/booking.repository";


interface GetAvailabilityInput {
  propertyId: string;
  fromDate: string;
  toDate: string;
}

interface AvailabilityResponse {
  propertyId: string;
  fromDate: string;
  toDate: string;
  available: boolean;
  source: "postgres" | "redis-cache";
}

export class GetAvailabilityUseCase {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly availabilityCache: AvailabilityCache
  ) {}

  async execute(input: GetAvailabilityInput): Promise<AvailabilityResponse> {
    const cacheKey = `availability:property:${input.propertyId}:from:${input.fromDate}:to:${input.toDate}`;

    const cached = await this.availabilityCache.get<AvailabilityResponse>(
      cacheKey
    );

    if (cached) {
      return {
        ...cached,
        source: "redis-cache",
      };
    }

    const hasOverlap = await this.bookingRepository.hasOverlappingBooking({
      propertyId: input.propertyId,
      fromDate: input.fromDate,
      toDate: input.toDate,
    });

    const response: AvailabilityResponse = {
      propertyId: input.propertyId,
      fromDate: input.fromDate,
      toDate: input.toDate,
      available: !hasOverlap,
      source: "postgres",
    };

    await this.availabilityCache.set(cacheKey, response, 60);

    return response;
  }
}