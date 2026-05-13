import { Database, HardDrive, ShieldAlert, ShieldCheck } from "lucide-react";

import { formatDate } from "../lib/utils";
import type { AvailabilityResponse } from "../types/properties";
import { StatusBadge } from "./StatusBadge";

type AvailabilityResultCardProps = {
  result: AvailabilityResponse;
};

export function AvailabilityResultCard({
  result,
}: AvailabilityResultCardProps) {
  const isAvailable = result.available;
  const isRedis = result.source === "redis-cache";

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate-400">
            Availability result
          </p>
          <div className="mt-3 flex items-center gap-3">
            {isAvailable ? (
              <ShieldCheck className="h-6 w-6 text-emerald-400" />
            ) : (
              <ShieldAlert className="h-6 w-6 text-red-400" />
            )}
            <h3 className="text-2xl font-semibold">
              {isAvailable ? "AVAILABLE" : "NOT AVAILABLE"}
            </h3>
          </div>
          <p className="mt-3 text-sm text-slate-300">
            {formatDate(result.fromDate)} to {formatDate(result.toDate)}
          </p>
        </div>

        <StatusBadge tone={isRedis ? "warning" : "signal"}>
          {isRedis ? "Redis Cache" : "PostgreSQL"}
        </StatusBadge>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-3">
            {isRedis ? (
              <HardDrive className="h-5 w-5 text-amber-300" />
            ) : (
              <Database className="h-5 w-5 text-teal-300" />
            )}
            <div>
              <p className="text-sm font-semibold">
                {isRedis ? "Served from Redis cache" : "Served from PostgreSQL"}
              </p>
              <p className="mt-1 text-sm text-slate-300">
                {isRedis
                  ? "This response hit the availability cache."
                  : "This response computed fresh overlap state from the source of truth."}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
            Property
          </p>
          <p className="mt-2 font-mono text-sm text-slate-100">{result.propertyId}</p>
        </div>
      </div>
    </div>
  );
}
