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
  createdAt: Date;
  updatedAt: Date;
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

export type UpdatePropertyInput = {
  name?: string;
  description?: string | null;
  provinceId?: number;
  propertyTypeId?: number;
  address?: string;
  maxGuests?: number;
  basePricePerNight?: number;
  isActive?: boolean;
};