import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  CalendarRange,
  Filter,
  LoaderCircle,
  RefreshCcw,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { formatDate } from "../lib/utils";
import { useBookingsQuery } from "../hooks/use-bookings";
import { getApiErrorMessage } from "../services/api";
import type { Property } from "../types/properties";
import { EmptyState } from "./EmptyState";
import { FormField } from "./FormField";
import { StatusBadge } from "./StatusBadge";

const bookingsFilterSchema = z
  .object({
    propertyId: z.string().uuid().optional().or(z.literal("")),
    fromDate: z.string().date().optional().or(z.literal("")),
    toDate: z.string().date().optional().or(z.literal("")),
    limit: z.coerce.number().int().min(1).max(100),
  })
  .refine(
    (values) =>
      !values.fromDate || !values.toDate || values.fromDate <= values.toDate,
    {
      path: ["fromDate"],
      message: "fromDate must be less than or equal to toDate",
    }
  );

type BookingsExplorerFormInput = z.input<typeof bookingsFilterSchema>;
type BookingsExplorerFormOutput = z.output<typeof bookingsFilterSchema>;
type BookingsExplorerFilterState = {
  page: number;
  limit: number;
  fromDate: string;
  toDate: string;
  propertyId: string;
};

type BookingsExplorerCardProps = {
  properties: Property[];
  onOpenCreateBooking: () => void;
};

export function BookingsExplorerCard({
  properties,
  onOpenCreateBooking,
}: BookingsExplorerCardProps) {
  const [filters, setFilters] = useState<BookingsExplorerFilterState>({
    page: 1,
    limit: 8,
    fromDate: "",
    toDate: "",
    propertyId: "",
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<
    BookingsExplorerFormInput,
    undefined,
    BookingsExplorerFormOutput
  >({
    resolver: zodResolver(bookingsFilterSchema),
    defaultValues: {
      propertyId: "",
      fromDate: "",
      toDate: "",
      limit: 8,
    },
  });

  const activeLimit = watch("limit");
  const query = useBookingsQuery({
    page: filters.page,
    limit: filters.limit,
    fromDate: filters.fromDate || undefined,
    toDate: filters.toDate || undefined,
    propertyId: filters.propertyId || undefined,
  });

  useEffect(() => {
    const nextLimit =
      typeof activeLimit === "number"
        ? activeLimit
        : Number.parseInt(String(activeLimit ?? ""), 10);

    if (!Number.isFinite(nextLimit) || nextLimit === filters.limit) {
      return;
    }

    setFilters((current) => ({
      ...current,
      page: 1,
      limit: nextLimit,
    }));
  }, [activeLimit, filters.limit]);

  const propertyMap = useMemo(
    () => new Map(properties.map((property) => [property.id, property])),
    [properties]
  );

  const onSubmit = handleSubmit((values) => {
    setFilters({
      page: 1,
      limit: values.limit,
      fromDate: values.fromDate ?? "",
      toDate: values.toDate ?? "",
      propertyId: values.propertyId ?? "",
    });
  });

  const clearFilters = () => {
    reset({
      propertyId: "",
      fromDate: "",
      toDate: "",
      limit: 8,
    });
    setFilters({
      page: 1,
      limit: 8,
      fromDate: "",
      toDate: "",
      propertyId: "",
    });
  };

  const items = query.data?.items ?? [];
  const meta = query.data?.meta;

  return (
    <div className="grid gap-5">
      {/* Header más compacto */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">
            Reservation path
          </p>
          <h3 className="mt-1 text-xl font-semibold text-ink">Bookings explorer</h3>
          <p className="mt-1 text-xs leading-5 text-slate">
            Filter bookings by overlap range and optional property. This list is served
            from the paginated booking endpoint.
          </p>
        </div>
        <button 
          className="btn-primary bg-blue-600 hover:bg-blue-700 whitespace-nowrap" 
          onClick={onOpenCreateBooking} 
          type="button"
        >
          Create booking
        </button>
      </div>

      {/* Filtros más compactos */}
      <form 
        className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-3 lg:grid-cols-[1fr_0.9fr_0.9fr_0.5fr_auto_auto]" 
        onSubmit={onSubmit}
      >
        <FormField label="Property" error={errors.propertyId?.message}>
          <select className="field text-sm py-1.5" {...register("propertyId")}>
            <option value="">All properties</option>
            {properties.map((property) => (
              <option key={property.id} value={property.id}>
                {property.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="From date" error={errors.fromDate?.message}>
          <input className="field text-sm py-1.5" type="date" {...register("fromDate")} />
        </FormField>

        <FormField label="To date" error={errors.toDate?.message}>
          <input className="field text-sm py-1.5" type="date" {...register("toDate")} />
        </FormField>

        <FormField label="Limit" error={errors.limit?.message}>
          <select className="field text-sm py-1.5" {...register("limit")}>
            <option value={8}>8</option>
            <option value={12}>12</option>
            <option value={20}>20</option>
          </select>
        </FormField>

        <div className="flex items-end">
          <button className="btn-secondary w-full gap-1.5 text-sm py-1.5" type="submit">
            <Filter className="h-3.5 w-3.5" />
            Apply
          </button>
        </div>

        <div className="flex items-end">
          <button className="btn-secondary w-full gap-1.5 text-sm py-1.5" onClick={clearFilters} type="button">
            <RefreshCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      </form>

      <div className="grid gap-3">
        {/* Badges y paginación info más compactos - SIN className */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5">
            <StatusBadge tone="neutral">
              {meta ? `${meta.total} bookings` : "Loading"}
            </StatusBadge>
            {filters.fromDate || filters.toDate ? (
              <StatusBadge tone="signal">
                Range filter
              </StatusBadge>
            ) : null}
            {filters.propertyId ? (
              <StatusBadge tone="warning">
                Property filter
              </StatusBadge>
            ) : null}
          </div>
          {meta ? (
            <p className="text-xs text-slate">
              Page {meta.page} of {meta.totalPages || 1}
            </p>
          ) : null}
        </div>

        {query.isLoading ? (
          <div className="flex min-h-48 items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <LoaderCircle className="h-6 w-6 animate-spin text-signal" />
          </div>
        ) : null}

        {query.isError ? (
          <EmptyState
            title="Bookings request failed"
            description={getApiErrorMessage(
              query.error,
              "The frontend could not load bookings from the API."
            )}
            icon={<CalendarRange className="h-7 w-7" />}
          />
        ) : null}

        {!query.isLoading && !query.isError && items.length === 0 ? (
          <EmptyState
            title="No bookings match these filters"
            description="Try widening the range, changing the property filter, or creating a new booking."
            icon={<CalendarRange className="h-7 w-7" />}
          />
        ) : null}

        {!query.isLoading && !query.isError && items.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {/* Header de tabla más compacto */}
            <div className="hidden grid-cols-[1.4fr_1.1fr_0.9fr_1fr_0.7fr] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 lg:grid">
              <span>Guest / Property</span>
              <span>Date range</span>
              <span>Status</span>
              <span>Created</span>
              <span>Property ID</span>
            </div>

            <div className="divide-y divide-slate-200">
              {items.map((booking) => {
                const property = propertyMap.get(booking.propertyId);
                const statusTone =
                  booking.statusCode === "CONFIRMED"
                    ? "signal"
                    : booking.statusCode === "CHECKED_IN"
                      ? "warning"
                      : booking.statusCode === "CHECKED_OUT"
                        ? "neutral"
                        : booking.statusCode === "CANCELLED"
                          ? "danger"
                          : "neutral";

                return (
                  <div
                    key={booking.id}
                    className="grid gap-2 px-4 py-3 lg:grid-cols-[1.4fr_1.1fr_0.9fr_1fr_0.7fr] lg:items-center"
                  >
                    <div>
                      <p className="font-semibold text-ink text-sm">{booking.guestName}</p>
                      <p className="mt-0.5 text-xs text-slate">
                        {property?.name ?? "Unknown property"}
                      </p>
                    </div>
                    {/* Date range mejorado: una sola línea más legible */}
                    <div className="text-xs text-slate">
                      {formatDate(booking.fromDate)} — {formatDate(booking.toDate)}
                    </div>
                    <div>
                      <StatusBadge tone={statusTone}>
                        {booking.statusCode.replace("_", " ")}
                      </StatusBadge>
                    </div>
                    <div className="text-xs text-slate">{formatDate(booking.createdAt)}</div>
                    <div className="font-mono text-[11px] text-slate truncate" title={booking.propertyId}>
                      {booking.propertyId.slice(0, 8)}...
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* Paginación más compacta */}
        {meta && meta.totalPages > 1 ? (
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/60 px-3 py-2">
            <button
              className="btn-secondary gap-1.5 text-sm py-1"
              disabled={filters.page <= 1}
              onClick={() =>
                setFilters((current) => ({
                  ...current,
                  page: Math.max(1, current.page - 1),
                }))
              }
              type="button"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Previous
            </button>

            <p className="text-xs text-slate">
              Page {meta.page} of {meta.totalPages}
            </p>

            <button
              className="btn-secondary gap-1.5 text-sm py-1"
              disabled={filters.page >= meta.totalPages}
              onClick={() =>
                setFilters((current) => ({
                  ...current,
                  page: Math.min(meta.totalPages, current.page + 1),
                }))
              }
              type="button"
            >
              Next
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}