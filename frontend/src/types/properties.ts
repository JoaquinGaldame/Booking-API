export type Property = {
  id: string;
  name: string;
  description: string | null;
  provinceId: number;
  propertyTypeId: number;
  address: string;
  maxGuests: number;
  basePricePerNight: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreatePropertyInput = {
  name: string;
  description?: string | null;
  provinceId: number;
  propertyTypeId: number;
  address: string;
  maxGuests: number;
  basePricePerNight: number;
};

export type AvailabilityResponse = {
  propertyId: string;
  fromDate: string;
  toDate: string;
  available: boolean;
  source: "postgres" | "redis-cache";
};
