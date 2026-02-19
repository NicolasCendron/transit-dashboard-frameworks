# Fake API Spec

## Overview

A shared TypeScript module that simulates a REST API without any backend. Data is seeded on first load and persisted to `localStorage`. All methods return Promises with an artificial delay to simulate network latency.

## Location

```
common/
  api/
    fake-api.ts
    seed-data.ts
  models/
    trip.ts           # Trip interface, TripStatus type
    cities.ts         # EUROPEAN_CITIES list + timezoneForCity()
    tripStatusOptions.ts
  utils/
    time.ts           # formatLocalTime, formatLocalDateTime, formatDuration, isNextDay
    format.ts         # legacy date formatter
```

## Configuration

```typescript
const STORAGE_KEY = "transit-dashboard-trips";
const SIMULATED_DELAY_MS = 400; // milliseconds
```

## API Contract

```typescript
getAll(): Promise<Trip[]>
// Returns all trips sorted by departureTime ascending

getById(id: number): Promise<Trip>
// Returns single trip or throws { status: 404, message: "Trip not found" }

create(trip: Omit<Trip, "id">): Promise<Trip>
// Auto-generates next ID, returns created trip

update(id: number, trip: Partial<Omit<Trip, "id">>): Promise<Trip>
// Merges updates, returns updated trip
// Throws 404 if not found

cancel(id: number): Promise<Trip>
// Sets status to "cancelled", returns updated trip
// Throws 404 if not found

delete(id: number): Promise<void>
// Removes trip from storage
// Throws 404 if not found

reset(): Promise<void>
// Clears localStorage and re-seeds data
```

## Error Shape

```typescript
interface ApiError {
  status: number;
  message: string;
}
```

Consumers should catch errors and check for `status` and `message`.

## Seed Data

8-10 trips with varied statuses, routes, platforms, and drivers. Example:

```typescript
const SEED_TRIPS: Trip[] = [
  {
    id: 1,
    route: "Line A - Downtown Express",
    departureTime: "2026-02-20T07:30:00",
    status: "scheduled",
    platform: "P1",
    driver: "Maria Santos"
  },
  {
    id: 2,
    route: "Line B - Airport Shuttle",
    departureTime: "2026-02-20T08:00:00",
    status: "delayed",
    platform: "P3",
    driver: "João Silva"
  },
  // ... more trips
];
```

## localStorage Behavior

- On first call, if `STORAGE_KEY` is not in localStorage → seed data is written
- All mutations (create, update, cancel, delete) write back to localStorage
- `reset()` clears and re-seeds

## Usage in Each Framework

Each app imports from `common/`:
```typescript
import { tripApi } from "../../common/api/fake-api";
import type { Trip } from "../../common/models/trip";
```

Or if bundler config makes this tricky, each app can copy the shared code into its own src. The important thing is the **contract stays identical**.
