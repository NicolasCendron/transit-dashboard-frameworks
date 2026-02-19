# App Spec — Transit Dashboard

## Entity: Trip

```typescript
interface Trip {
  id: number;
  origin: string;              // City name from EUROPEAN_CITIES list
  destination: string;         // City name from EUROPEAN_CITIES list
  departureTime: string;       // UTC ISO 8601 (e.g. "2026-02-20T08:30:00Z")
  departureTimezone: string;   // IANA tz derived from origin (e.g. "Europe/Lisbon")
  arrivalTime?: string;        // UTC ISO 8601 — only set when status === "arrived"
  arrivalTimezone: string;     // IANA tz derived from destination (e.g. "Europe/Warsaw")
  status: "scheduled" | "delayed" | "cancelled" | "arrived";
  driver: string;
}
```

## Timezone Handling

All times are stored as UTC ISO strings. Display always converts to the local timezone of the relevant city:

- Departure time → displayed in `departureTimezone` as `DD/MM/YY HH:MM (+Z)`
- Arrival time → displayed in `arrivalTimezone` as `DD/MM/YY HH:MM (+Z)`
- Duration is shown in a separate column/field (e.g. `2h 30m` or `1d 5h 30m` for multi-day trips)
- Next-day arrival is indicated with a `+1` superscript (only when exactly 1 day difference)

City → timezone mapping lives in `common/models/cities.ts` (curated list of ~28 European cities).

## Status Flow

```
scheduled → delayed → arrived
         ↘          ↘
           cancelled   cancelled
```

| Status    | Color  | Notes                                      |
|-----------|--------|-------------------------------------------|
| scheduled | blue   |                                            |
| delayed   | orange |                                            |
| cancelled | red    |                                            |
| arrived   | green  | Requires `arrivalTime` to be set           |

## Pages & Routing

### 1. Trips List — `/trips`

- Displays all trips in a table
- Columns: Origin, Destination, Departure, Arrival, Status, Duration, Driver, Actions
- Arrival shows `—` if not yet set
- Duration shows `—` if arrival not set, otherwise formatted (e.g. `2h 30m` or `1d 5h 30m`)
- **Search/filter**: text input filtering by `origin`, `destination`, `driver`
- **Loading state**: skeleton loader with animated placeholders matching table structure
- **Actions per row**:
  - View → `/trips/:id`
  - Edit → `/trips/:id/edit`
  - Cancel → only if status is not `cancelled` or `arrived`

### 2. Trip Details — `/trips/:id`

- Displays all fields with timezone-aware times in compact format
- Shows duration as a separate field (only when `arrivalTime` exists)
- Shows `+1` indicator when arrival is exactly 1 day after departure

### 3. Create / Edit Trip — `/trips/new` and `/trips/:id/edit`

- Origin and destination are `<select>` from the curated city list
- City label shows name + timezone + UTC offset (e.g. `Lisbon (Europe/Lisbon +0)`)
- Form layout:
  - Row 1: Origin | Destination
  - Row 2: Departure Time | Status
  - Row 3: Arrival Time | Duration (calculated, readonly)
  - Row 4: Driver (full width)
- Departure time input shows the departure timezone + offset as a hint
- Arrival time input is **disabled** unless status is `arrived`
- Arrival time shows tooltip when disabled: "Arrival time is required when status is Arrived"
- Duration field is always disabled and auto-calculates from departure/arrival times
- **Validations**:
  - Origin, destination, departure time, driver are required
  - Arrival time is required when status is `arrived`
  - Arrival time must be after departure time
- **Status change behavior**: changing from `arrived` to any other status clears `arrivalTime`
- Times entered by the user are treated as local to the selected city and converted to UTC on save

## Route Configuration

| Path              | Page        |
|-------------------|-------------|
| `/`               | → /trips    |
| `/trips`          | TripsList   |
| `/trips/new`      | TripForm    |
| `/trips/:id`      | TripDetails |
| `/trips/:id/edit` | TripForm    |
