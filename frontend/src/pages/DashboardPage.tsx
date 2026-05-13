import {
  Activity,
  Database,
  LayoutDashboard,
  LoaderCircle,
  Map,
  Plus,
} from "lucide-react";
import { useState } from "react";

import { AvailabilityCheckerForm } from "../components/AvailabilityCheckerForm";
import { BookingsExplorerCard } from "../components/BookingsExplorerCard";
import { CreateBookingForm } from "../components/CreateBookingForm";
import { CreatePropertyForm } from "../components/CreatePropertyForm";
import { Dialog } from "../components/Dialog";
import { EmptyState } from "../components/EmptyState";
import { PropertiesList } from "../components/PropertiesList";
import { SectionCard } from "../components/SectionCard";
import { StatusBadge } from "../components/StatusBadge";
import { usePropertiesQuery } from "../hooks/use-properties";
import { getApiErrorMessage } from "../services/api";

export function DashboardPage() {
  const propertiesQuery = usePropertiesQuery();
  const properties = propertiesQuery.data ?? [];
  const [isCreatePropertyOpen, setIsCreatePropertyOpen] = useState(false);
  const [isCreateBookingOpen, setIsCreateBookingOpen] = useState(false);

  return (
    <main className="min-h-screen bg-grid-fade bg-[size:32px_32px]">
      <div className="w-full px-4 py-6 sm:px-6 lg:px-8 lg:py-8 2xl:px-10">
        <section className="panel overflow-hidden border-0 bg-ink px-6 py-6 text-white md:px-8 md:py-7">
          <div className="grid gap-6 lg:grid-cols-[1.45fr_0.55fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">
                <LayoutDashboard className="h-4 w-4" />
                booking-api frontend demo
              </div>
              <h1 className="mt-4 max-w-4xl text-3xl font-semibold tracking-tight md:text-[2.6rem]">
                Visualize cache hits, overlap checks, and reservation conflicts from one technical dashboard.
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 md:text-base">
                This UI is intentionally focused on backend behavior: PostgreSQL remains the
                source of truth, Redis accelerates availability checks, and overlapping bookings
                are blocked with clear conflict feedback.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-slate-400">
                  Services
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <StatusBadge tone="signal">API</StatusBadge>
                  <StatusBadge tone="warning">Redis</StatusBadge>
                  <StatusBadge tone="neutral">PostgreSQL</StatusBadge>
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-slate-400">
                  Properties loaded
                </p>
                <p className="mt-4 text-3xl font-semibold">{properties.length}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-slate-400">
                  Focus
                </p>
                <p className="mt-4 text-sm leading-6 text-slate-300">
                  Distributed booking lock, overlap validation, and cache invalidation on writes.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
          <SectionCard
            eyebrow="Inventory"
            title="Properties list"
            description="Inspect active properties and the seed-backed reference metadata used by the reservation backend."
            action={
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge tone="neutral">{properties.length} loaded</StatusBadge>
                <button
                  className="btn-primary gap-2"
                  onClick={() => setIsCreatePropertyOpen(true)}
                  type="button"
                >
                  <Plus className="h-4 w-4" />
                  Create Property
                </button>
              </div>
            }
          >
            {propertiesQuery.isLoading ? (
              <div className="flex min-h-[420px] items-center justify-center">
                <LoaderCircle className="h-7 w-7 animate-spin text-signal" />
              </div>
            ) : null}

            {propertiesQuery.isError ? (
              <EmptyState
                title="Properties request failed"
                description={getApiErrorMessage(
                  propertiesQuery.error,
                  "The frontend could not load properties from the API."
                )}
                icon={<Map className="h-8 w-8" />}
              />
            ) : null}

            {!propertiesQuery.isLoading && !propertiesQuery.isError ? (
              <PropertiesList properties={properties} />
            ) : null}
          </SectionCard>

          <SectionCard
            eyebrow="Read path"
            title="Availability checker"
            description="Run the same date-range availability query repeatedly to observe fresh PostgreSQL responses and then Redis cache hits."
            action={<Database className="h-5 w-5 text-signal" />}
          >
            <AvailabilityCheckerForm properties={properties} />
          </SectionCard>
        </div>

        <div className="mt-6 grid gap-6">
          <SectionCard
            eyebrow="Query path"
            title="System bookings"
            description="Browse all reservations with server-side pagination and optional overlap filters by date range or property."
            action={<Activity className="h-5 w-5 text-ember" />}
          >
            <BookingsExplorerCard
              onOpenCreateBooking={() => setIsCreateBookingOpen(true)}
              properties={properties}
            />
          </SectionCard>
        </div>
      </div>

      <Dialog open={isCreatePropertyOpen} onClose={() => setIsCreatePropertyOpen(false)}>
        <SectionCard
          eyebrow="Write path"
          title="Create property"
          description="Add inventory directly against the API. This form uses the same province and property type catalog IDs seeded in PostgreSQL."
          action={<Database className="h-5 w-5 text-signal" />}
        >
          <CreatePropertyForm onSuccess={() => setIsCreatePropertyOpen(false)} />
        </SectionCard>
      </Dialog>

      <Dialog open={isCreateBookingOpen} onClose={() => setIsCreateBookingOpen(false)}>
        <SectionCard
          eyebrow="Reservation path"
          title="Create booking"
          description="Create a reservation and verify that conflicting date ranges return a clear message instead of a duplicate booking."
          action={<StatusBadge tone="danger">Conflict aware</StatusBadge>}
        >
          <CreateBookingForm
            onSuccess={() => setIsCreateBookingOpen(false)}
            properties={properties}
          />
        </SectionCard>
      </Dialog>
    </main>
  );
}
