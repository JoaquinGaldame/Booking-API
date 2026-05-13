# Booking API — High-Concurrency Reservation System

A production-inspired reservation API built with Node.js, PostgreSQL, and Redis, designed to solve real-world booking challenges such as concurrent reservation conflicts, expensive availability queries, and scalable request handling.

## Project Goal

Design a reservation API that:

- Prevents double bookings under concurrent traffic
- Optimizes availability search performance
- Maintains PostgreSQL as the source of truth
- Uses Redis as a coordination and performance layer
- Demonstrates production-oriented backend architecture patterns

This project was built as a portfolio-grade backend engineering exercise focused on system design, concurrency control, caching strategies, and hexagonal architecture principles.

---

# Problem Statement

Reservation systems appear simple at first:

> "Create a booking if the property is available."

In reality, they introduce several distributed systems challenges.

## 1. Double Booking Problem

Two users may attempt to reserve the same property at the same time.

Example:

- User A requests booking for Property #12
- User B requests booking for Property #12 milliseconds later
- Both requests check availability before either transaction commits
- Both succeed
- Result: inconsistent state

This race condition is common in booking, ticketing, and inventory systems.

---

## 2. Expensive Availability Queries

Availability searches often become expensive because they require:

- date range overlap validation
- exclusion of canceled reservations
- filtering by property
- high read frequency

Example:

```sql
Find all properties available between June 1 and June 10
```

Without optimization, this creates repeated heavy PostgreSQL reads.

## 3. Traffic Spikes

Public reservation APIs often experience bursts of requests:

- bots
- retries
- abusive clients
- frontend polling
- search traffic

Without protection, the database becomes the bottleneck.

## Architecture

This project follows a Modular Monolith architecture with Hexagonal Architecture (Ports & Adapters) principles.

Architecture goals:

- isolate business logic
- avoid infrastructure coupling
- enable testability
- make Redis replaceable
- keep PostgreSQL as the source of truth

### Architectural Style

- Modular Monolith
- Lightweight Hexagonal Architecture
- Repository Pattern
- Use Case Pattern
- Infrastructure Adapters
- Dockerized local development

### High-Level Flow

```text
HTTP Request
    ↓
Controller
    ↓
Use Case
    ↓
Domain Rules
    ↓
Ports (Interfaces)
    ↓
Infrastructure Adapters
    ├── PostgreSQL
    └── Redis
```

### Project Structure

```text
booking-api/
  ├─ .env
  ├─ .env.example
  ├─ .gitignore
  ├─ docker-compose.yml
  ├─ Dockerfile
  ├─ LICENSE
  ├─ package-lock.json
  ├─ package.json
  ├─ README.md
  ├─ tsconfig.json
  ├─ drizzle.config.ts
  ├─ drizzle/
  │  ├─ 0000_icy_the_order.sql
  │  └─ meta/
  │     ├─ 0000_snapshot.json
  │     └─ _journal.json
  │
  └─ src/
     ├─ app.ts
     ├─ server.ts
     │
     ├─ db/
     │  ├─ index.ts
     │  ├─ schema.ts
     │  └─ seed.ts
     │
     ├─ shared/
     │  └─ infra/
     │     └─ redis/
     │        └─ redis.client.ts
     │
     └─ modules/
        ├─ bookings/
        │  ├─ domain/
        │  │  ├─ booking.entity.ts
        │  │  └─ booking.errors.ts
        │  │
        │  ├─ application/
        │  │  ├─ ports/
        │  │  │  ├─ availability-cache.ts
        │  │  │  ├─ booking-lock.ts
        │  │  │  └─ booking.repository.ts
        │  │  │
        │  │  └─ usecases/
        │  │     ├─ change-booking-status.usecase.ts
        │  │     ├─ create-booking.usecase.ts
        │  │     └─ get-availability.usecase.ts
        │  │
        │  ├─ infra/
        │  │  ├─ drizzle-booking.repository.ts
        │  │  ├─ redis-availability-cache.ts
        │  │  └─ redis-booking-lock.ts
        │  │
        │  └─ http/
        │     ├─ bookings.controller.ts
        │     └─ bookings.routes.ts
        │
        └─ properties/
           ├─ domain/
           │  ├─ property.entity.ts
           │  └─ property.errors.ts
           ├─ application/
           │  ├─ ports/
           │  │  └─ property.repository.ts
           │  └─ usecases/
           │     ├─ create-property.usecase.ts
           │     ├─ delete-property.usecase.ts
           │     ├─ get-property-by-id.usecase.ts
           │     ├─ list-properties.usecase.ts
           │     └─ update-property.usecase.ts
           ├─ infra/
           │  └─ drizzle-property.repository.ts
           └─ http/
              ├─ property.controller.ts
              └─ property.routes.ts
```

## Why Redis?

Redis is intentionally introduced as an infrastructure layer, not as the source of truth.

PostgreSQL owns consistency.

Redis provides performance and coordination.

### Redis Use Cases

#### 1. Availability Cache

Availability queries are read-heavy and repetitive.

Instead of repeatedly querying PostgreSQL:

`GET /api/properties/:propertyId/availability`

Responses are cached with TTL.

Benefits:

- reduced database load
- lower latency
- improved scalability

#### 2. Distributed Locking

Before creating a booking:

- acquire Redis lock
- validate availability
- commit reservation
- release lock

This prevents concurrent double booking attempts.

Example lock key:

`lock:booking:property:12:2026-06-01:2026-06-10`

### 3. Future Redis Extension: Rate Limiting

Redis also enables future infrastructure protections such as API rate limiting.

A common production approach would be:

- request counting per IP
- sliding window or token bucket limiting
- burst protection for public endpoints

Example target policy:

100 requests / minute per IP

## Core Business Rules

### Booking Creation

A reservation can only be created if:

- property exists
- requested date range is valid
- no overlapping confirmed booking exists
- distributed lock is acquired

### Availability Search

Availability responses:

- are cached
- expire automatically
- are invalidated after booking creation/cancellation

### Booking Status Transitions

Current supported transitions:

- `CONFIRMED -> CHECKED_IN`
- `CONFIRMED -> CANCELLED`
- `CHECKED_IN -> CHECKED_OUT`

When a booking status changes:

- booking state changes in PostgreSQL
- availability cache for the property is invalidated

## Concurrency Strategy

This project intentionally addresses race conditions.

Without locking:

1. Request A checks availability
2. Request B checks availability
3. Request A creates booking
4. Request B creates booking

Result: double booking

With Redis locking:

1. Request A acquires lock
2. Request B fails lock acquisition
3. Request A completes booking
4. Request A releases lock

Result: consistent booking state

## Technology Stack

### Backend

- Node.js
- TypeScript
- Express

### Database

- PostgreSQL

### Data Access

- Drizzle ORM
- Drizzle Kit (schema migrations + versioned database changes)

### Cache / Coordination

- Redis

### Containerization

- Docker
- Docker Compose

### Architecture

- Hexagonal Architecture
- Repository Pattern
- Use Case Pattern

## Architectural Trade-offs

Design decisions intentionally made:

- PostgreSQL is the single source of truth for consistency
- Redis is used only for performance and coordination
- Redis locks improve concurrency safety but introduce lock lifecycle management complexity
- cache invalidation improves performance at the cost of additional operational complexity
- a modular monolith was chosen over microservices to keep deployment and development simple while preserving clean boundaries

## Data Model

Core relational entities:

- properties
- bookings
- booking_statuses
- countries
- provinces
- property_types

Design decisions:

- PostgreSQL remains the source of truth
- booking statuses are normalized instead of hardcoded enums
- booking date integrity is enforced at database level
- indexed queries support efficient availability lookups

## Running Locally

### Requirements

- Docker Desktop
- Node.js 20+
- npm

### Option 1: Infrastructure with Docker, API local

Use this mode for development with `npm run dev`.

1. Start PostgreSQL and Redis:

```bash
docker compose up -d postgres redis
```

2. Install dependencies:

```bash
npm install
```

3. Generate migrations if needed:

```bash
npm run db:generate
```

4. Apply migrations:

```bash
npm run db:migrate
```

5. Seed reference data:

```bash
npm run db:seed
```

6. Run the API locally:

```bash
npm run dev
```

Note:

- local `.env` uses `localhost` connections
- if PostgreSQL is exposed by Docker Compose on port `5433`, your local `DATABASE_URL` must use `localhost:5433`

### Option 2: Full stack with Docker Compose

Use this mode if you want the API container to run too.

```bash
docker compose up --build
```

In this mode:

- `api` starts on port `3000`
- `postgres` is exposed on host port `5433`
- the `api` container runs `npm run db:migrate && npm run db:seed && npm start` on startup

### Seed behavior

The seed script is idempotent for the demo property data currently inserted by `src/db/seed.ts`.

Reference tables such as booking statuses, countries, provinces, and property types use `onConflictDoNothing()`.

### Stop and remove containers, networks, and volumes

```bash
docker compose down -v
```

## API Endpoints

### Health Check

`GET /health`

### Properties

- `POST /api/properties`
- `GET /api/properties`
- `GET /api/properties/:id`
- `PATCH /api/properties/:id`
- `DELETE /api/properties/:id`
- `GET /api/properties/:propertyId/availability?fromDate=2026-06-01&toDate=2026-06-10`

### Bookings

- `POST /api/bookings`
- `POST /api/bookings/:id/check-in`
- `POST /api/bookings/:id/check-out`
- `POST /api/bookings/:id/cancel`

### Create Booking Example

`POST /api/bookings`

```json
{
  "propertyId": "uuid",
  "guestName": "Joaquin",
  "fromDate": "2026-06-01",
  "toDate": "2026-06-10"
}
```

## Future Improvements

Potential production evolutions:

- JWT authentication
- role-based authorization
- idempotency keys
- message queues for async workflows
- background expiration jobs
- OpenTelemetry tracing
- Prometheus metrics
- Grafana dashboards
- booking event publishing
- audit logs
- payment integration
- notification workflows
- optimistic vs pessimistic locking comparison
- integration tests with Testcontainers

## Engineering Focus

This project emphasizes backend engineering concepts rather than CRUD implementation.

Key topics explored:

- distributed coordination
- concurrency control
- cache invalidation
- infrastructure abstraction
- clean boundaries
- scalability trade-offs
- production-oriented backend design
