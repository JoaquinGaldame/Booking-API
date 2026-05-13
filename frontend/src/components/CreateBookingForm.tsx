import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, LoaderCircle, Plus } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { Property } from "../types/properties";
import { useCreateBookingMutation } from "../hooks/use-bookings";
import { getApiErrorMessage } from "../services/api";
import { FormField } from "./FormField";

const createBookingSchema = z
  .object({
    propertyId: z.string().uuid("Select a property"),
    guestName: z.string().min(2, "Guest name must have at least 2 characters"),
    fromDate: z.string().date("Select a valid start date"),
    toDate: z.string().date("Select a valid end date"),
  })
  .refine((values) => values.fromDate < values.toDate, {
    message: "toDate must be after fromDate",
    path: ["toDate"],
  });

type CreateBookingFormValues = z.infer<typeof createBookingSchema>;

type CreateBookingFormProps = {
  properties: Property[];
  onSuccess?: () => void;
};

export function CreateBookingForm({
  properties,
  onSuccess,
}: CreateBookingFormProps) {
  const mutation = useCreateBookingMutation();
  const {
    register,
    handleSubmit,
    reset,
    resetField,
    formState: { errors },
  } = useForm<CreateBookingFormValues>({
    resolver: zodResolver(createBookingSchema),
  });

  useEffect(() => {
    if (properties.length === 1) {
      resetField("propertyId", { defaultValue: properties[0].id });
    }
  }, [properties, resetField]);

  const onSubmit = handleSubmit(async (values) => {
    await mutation.mutateAsync(values);
    reset({
      propertyId: values.propertyId,
      guestName: "",
      fromDate: "",
      toDate: "",
    });
    onSuccess?.();
  });

  const mutationError = mutation.isError
    ? getApiErrorMessage(mutation.error, "Failed to create booking")
    : null;
  const bookingErrorMessage =
    mutationError === "Property is already booked for the selected date range"
      ? "Property is not available for selected dates"
      : mutationError;

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <FormField
        label="Property"
        error={errors.propertyId?.message}
        hint="This request acquires a Redis lock and checks PostgreSQL overlap state before persisting."
      >
        <select className="field" defaultValue="" {...register("propertyId")}>
          <option value="" disabled>
            Select a property
          </option>
          {properties.map((property) => (
            <option key={property.id} value={property.id}>
              {property.name}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Guest name" error={errors.guestName?.message}>
        <input className="field" placeholder="Joaquin Perez" {...register("guestName")} />
      </FormField>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="From date" error={errors.fromDate?.message}>
          <input className="field" type="date" {...register("fromDate")} />
        </FormField>
        <FormField label="To date" error={errors.toDate?.message}>
          <input className="field" type="date" {...register("toDate")} />
        </FormField>
      </div>

      {mutation.isSuccess ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Booking created successfully. Availability cache for the property was invalidated.
        </div>
      ) : null}

      {mutationError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {bookingErrorMessage}
        </div>
      ) : null}

      <button
        className="btn-primary gap-2"
        type="submit"
        disabled={mutation.isPending || properties.length === 0}
      >
        {mutation.isPending ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Calendar className="h-4 w-4" />
            <Plus className="h-4 w-4" />
          </>
        )}
        Create booking
      </button>
    </form>
  );
}
