import { Building2, MapPin, Users, Wallet } from "lucide-react";

import {
  getPropertyTypeName,
  getProvinceName,
} from "../lib/reference-data";
import { formatCurrency } from "../lib/utils";
import type { Property } from "../types/properties";
import { StatusBadge } from "./StatusBadge";

type PropertyCardProps = {
  property: Property;
};

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-signal/30">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-ink">{property.name}</h3>
          <p className="mt-2 text-sm leading-6 text-slate">
            {property.description ?? "No description provided."}
          </p>
        </div>
        <StatusBadge tone={property.isActive ? "signal" : "neutral"}>
          {property.isActive ? "Active" : "Inactive"}
        </StatusBadge>
      </div>

      <dl className="mt-5 grid gap-3 text-sm text-slate">
        <div className="flex items-center gap-3">
          <MapPin className="h-4 w-4 text-signal" />
          <div>
            <dt className="sr-only">Address</dt>
            <dd>{property.address}</dd>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Building2 className="h-4 w-4 text-ember" />
          <div>
            <dt className="sr-only">Property metadata</dt>
            <dd>
              {getProvinceName(property.provinceId)} ·{" "}
              {getPropertyTypeName(property.propertyTypeId)}
            </dd>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Users className="h-4 w-4 text-signal" />
          <div>
            <dt className="sr-only">Max guests</dt>
            <dd>{property.maxGuests} guests max</dd>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Wallet className="h-4 w-4 text-ember" />
          <div>
            <dt className="sr-only">Base price</dt>
            <dd>{formatCurrency(property.basePricePerNight)} / night</dd>
          </div>
        </div>
      </dl>
    </article>
  );
}
