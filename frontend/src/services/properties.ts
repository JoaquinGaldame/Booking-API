import { api } from "./api";
import type {
  AvailabilityResponse,
  CreatePropertyInput,
  Property,
} from "../types/properties";

export async function listProperties() {
  const response = await api.get<Property[]>("/api/properties");
  return response.data;
}

export async function createProperty(input: CreatePropertyInput) {
  const response = await api.post<Property>("/api/properties", input);
  return response.data;
}

export async function checkAvailability(params: {
  propertyId: string;
  fromDate: string;
  toDate: string;
}) {
  const response = await api.get<AvailabilityResponse>(
    `/api/properties/${params.propertyId}/availability`,
    {
      params: {
        fromDate: params.fromDate,
        toDate: params.toDate,
      },
    }
  );

  return response.data;
}
