import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { propertyTypes, provinces } from "../lib/reference-data";
import { getApiErrorMessage } from "../services/api";
import { useCreatePropertyMutation } from "../hooks/use-properties";
import { FormField } from "./FormField";

const createPropertySchema = z.object({
  name: z.string().min(3, "Name must have at least 3 characters"),
  description: z.string().max(1000, "Description is too long").optional(),
  address: z.string().min(5, "Address must have at least 5 characters"),
  provinceId: z.coerce.number().int().min(1, "Select a province"),
  propertyTypeId: z.coerce.number().int().min(1, "Select a property type"),
  maxGuests: z.coerce.number().int().min(1, "Max guests must be at least 1"),
  basePricePerNight: z.coerce
    .number()
    .int()
    .min(1, "Base price per night must be greater than zero"),
});

type CreatePropertyFormInput = z.input<typeof createPropertySchema>;
type CreatePropertyFormOutput = z.output<typeof createPropertySchema>;

type CreatePropertyFormProps = {
  onSuccess?: () => void;
};

export function CreatePropertyForm({ onSuccess }: CreatePropertyFormProps) {
  const mutation = useCreatePropertyMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<
    CreatePropertyFormInput,
    undefined,
    CreatePropertyFormOutput
  >({
    resolver: zodResolver(createPropertySchema),
    defaultValues: {
      description: "",
      provinceId: 18,
      propertyTypeId: 1,
      maxGuests: 2,
      basePricePerNight: 120,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    await mutation.mutateAsync({
      ...values,
      description: values.description?.trim() ? values.description.trim() : null,
    });

    reset({
      name: "",
      description: "",
      address: "",
      provinceId: 18,
      propertyTypeId: 1,
      maxGuests: 2,
      basePricePerNight: 120,
    });

    onSuccess?.();
  });

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <div className="grid gap-4 lg:grid-cols-2">
        <FormField label="Property name" error={errors.name?.message}>
          <input className="field" placeholder="Modern Apartment Downtown" {...register("name")} />
        </FormField>
        <FormField label="Address" error={errors.address?.message}>
          <input className="field" placeholder="Av. Ignacio de la Roza 123" {...register("address")} />
        </FormField>
      </div>

      <FormField label="Description" error={errors.description?.message}>
        <textarea
          className="field min-h-28 resize-y"
          placeholder="Short operational description for the property."
          {...register("description")}
        />
      </FormField>

      <div className="grid gap-4 lg:grid-cols-2">
        <FormField label="Province" error={errors.provinceId?.message}>
          <select className="field" {...register("provinceId")}>
            {provinces.map((province) => (
              <option key={province.id} value={province.id}>
                {province.name}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Property type" error={errors.propertyTypeId?.message}>
          <select className="field" {...register("propertyTypeId")}>
            {propertyTypes.map((propertyType) => (
              <option key={propertyType.id} value={propertyType.id}>
                {propertyType.name}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <FormField label="Max guests" error={errors.maxGuests?.message}>
          <input className="field" type="number" min={1} {...register("maxGuests")} />
        </FormField>
        <FormField label="Base price per night" error={errors.basePricePerNight?.message}>
          <input className="field" type="number" min={1} {...register("basePricePerNight")} />
        </FormField>
      </div>

      {mutation.isSuccess ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Property created. The list on the left has already been refreshed.
        </div>
      ) : null}

      {mutation.isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {getApiErrorMessage(mutation.error, "Failed to create property")}
        </div>
      ) : null}

      <button className="btn-primary gap-2" type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
        Create property
      </button>
    </form>
  );
}
