import { Building2 } from "lucide-react";

import type { Property } from "../types/properties";
import { EmptyState } from "./EmptyState";
import { PropertyCard } from "./PropertyCard";

type PropertiesListProps = {
  properties: Property[];
};

export function PropertiesList({ properties }: PropertiesListProps) {
  if (properties.length === 0) {
    return (
      <EmptyState
        title="No properties yet"
        description="Create the first property to start testing availability caching and booking conflict handling."
        icon={<Building2 className="h-8 w-8" />}
      />
    );
  }

  return (
    <div className="grid gap-4 2xl:grid-cols-2">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
