# App Spec — Transit Dashboard

## Entity: Trip

```typescript
interface Trip {
  id: number;
  origin: string;              // City name from EUROPEAN_CITIES list
  destination: string;         // City name from EUROPEAN_CITIES list
  departureTime: string;       // UTC ISO 8601 (e.g. "2026-02-20T08:30:00.000Z")
  departureTimezone: string;   // IANA tz derived from origin (e.g. "Europe/Paris")
  arrivalTime?: string;        // UTC ISO 8601 — only set when status === "arrived"
  arrivalTimezone: string;     // IANA tz derived from destination (e.g. "Europe/Warsaw")
  status: "scheduled" | "delayed" | "cancelled" | "arrived";
  driver: string;
}
```

## Timezone Handling

All times are stored as UTC ISO strings. Display converts to the **user-selected global display timezone** (chosen in the header), not the city timezone.

- All table/detail times → displayed in the selected display timezone as `DD/MM/YY HH:MM (TZ)`
- Duration is shown in a separate column/field (e.g. `2h 30m` or `1d 5h 30m` for multi-day trips)
- Next-day arrival is indicated with a `+1` superscript (uses city timezones for calendar-day comparison)

**Display timezone options** (shared via `common/utils/timezone.ts`):
| Label | IANA Zone |
|-------|-----------|
| London | `Europe/London` |
| CET | `Europe/Paris` |
| EET | `Europe/Athens` |

Default: browser timezone if it matches one of the above, otherwise CET. Persisted to `localStorage`.

City → IANA timezone mapping lives in `common/models/cities.ts` (28 European cities). The city timezone is stored on the Trip entity but is only used for `isNextDay` calculation, not for display.

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

- Displays all fields with times in the selected display timezone
- Shows duration as a separate field (only when `arrivalTime` exists)
- Shows `+1` indicator when arrival is exactly 1 calendar day after departure (city-timezone comparison)

### 3. Create / Edit Trip — `/trips/new` and `/trips/:id/edit`

- Origin and destination are `<select>` from the curated city list (city name only)
- Form layout:
  - Row 1: Origin | Destination
  - Row 2: Departure Time | Status
  - Row 3: Arrival Time | Duration (calculated, readonly)
  - Row 4: Driver (full width)
- Departure/arrival time inputs show the current **display timezone** label as a hint (e.g. `CET`)
- Times are entered and displayed in the selected display timezone; stored as UTC
- When the display timezone changes, inputs re-display the same moment in the new timezone
- Arrival time input is **disabled** unless status is `arrived`
- Arrival time shows tooltip when disabled: "Arrival time is required when status is Arrived"
- Duration field is always disabled and auto-calculates from stored UTC values
- **Validations**:
  - Origin, destination, departure time, driver are required
  - Arrival time is required when status is `arrived`
  - Arrival time must be after departure time
- **Status change behavior**: changing from `arrived` to any other status clears `arrivalTime`

## Route Configuration

| Path              | Page        |
|-------------------|-------------|
| `/`               | → /trips    |
| `/trips`          | TripsList   |
| `/trips/new`      | TripForm    |
| `/trips/:id`      | TripDetails |
| `/trips/:id/edit` | TripForm    |
