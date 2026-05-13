import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, LoaderCircle, Search } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { Property } from "../types/properties";
import { useAvailabilityMutation } from "../hooks/use-availability";
import { getApiErrorMessage } from "../services/api";
import { AvailabilityResultCard } from "./AvailabilityResultCard";
import { FormField } from "./FormField";

const availabilitySchema = z
  .object({
    propertyId: z.string().uuid("Select a property"),
    fromDate: z.string().date("Select a valid start date"),
    toDate: z.string().date("Select a valid end date"),
  })
  .refine((values) => values.fromDate < values.toDate, {
    message: "toDate must be after fromDate",
    path: ["toDate"],
  });

type AvailabilityFormValues = z.infer<typeof availabilitySchema>;

type AvailabilityCheckerFormProps = {
  properties: Property[];
};

export function AvailabilityCheckerForm({
  properties,
}: AvailabilityCheckerFormProps) {
  const mutation = useAvailabilityMutation();
  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<AvailabilityFormValues>({
    resolver: zodResolver(availabilitySchema),
  });

  useEffect(() => {
    if (properties.length === 1) {
      resetField("propertyId", { defaultValue: properties[0].id });
    }
  }, [properties, resetField]);

  const onSubmit = handleSubmit(async (values) => {
    await mutation.mutateAsync(values);
  });

  return (
    <div className="grid gap-6 2xl:grid-cols-[0.9fr_1.1fr]">
      <form className="grid gap-4" onSubmit={onSubmit}>
        <FormField label="Property" error={errors.propertyId?.message}>
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

        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="From date" error={errors.fromDate?.message}>
            <input className="field" type="date" {...register("fromDate")} />
          </FormField>
          <FormField label="To date" error={errors.toDate?.message}>
            <input className="field" type="date" {...register("toDate")} />
          </FormField>
        </div>

        {mutation.isError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {getApiErrorMessage(mutation.error, "Failed to fetch availability")}
          </div>
        ) : null}

        <button
          className="btn-secondary gap-2"
          type="submit"
          disabled={mutation.isPending || properties.length === 0}
        >
          {mutation.isPending ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Calendar className="h-4 w-4" />
              <Search className="h-4 w-4" />
            </>
          )}
          Check availability
        </button>
      </form>

      <div className="min-h-52">
        {mutation.data ? (
          <AvailabilityResultCard result={mutation.data} />
        ) : (
          <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 p-8 text-center text-sm leading-6 text-slate">
            Pick a property and a date range to visualize whether the response was served
            from PostgreSQL or from the Redis availability cache.
          </div>
        )}
      </div>
    </div>
  );
}
