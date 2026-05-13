import axios from "axios";

import type { ApiErrorResponse } from "../types/api";

const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export function getApiErrorMessage(error: unknown, fallback = "Unexpected error") {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const validationErrors = error.response?.data?.errors;

    if (validationErrors?.length) {
      return validationErrors.map((issue) => issue.message).join(", ");
    }

    return error.response?.data?.message ?? fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
