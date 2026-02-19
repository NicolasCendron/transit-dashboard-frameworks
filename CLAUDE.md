# CLAUDE.md — Transit Dashboard Frameworks

## Project Overview

Monorepo implementing the same Transit Dashboard app in **Vue 3**, **React**, and **Angular** to compare framework architecture, routing, forms, state management, and API patterns.

## Repository Structure

```
transport-framework/
  vue/        # Vue 3 + Composition API + Vue Router + Pinia + Vitest
  react/      # React 18 + React Router + hooks (not yet implemented)
  angular/    # Angular 17+ standalone components (not yet implemented)
  common/     # Shared models, fake API, utils, CSS
  specs/      # Project specs and implementation plans
  CLAUDE.md
  README.md
```

## Common Layer (`common/`)

```
common/
  api/
    fake-api.ts         # localStorage-backed fake REST API (400ms simulated delay)
    seed-data.ts        # 10 seed trips
  i18n/
    en.ts / pt.ts / es.ts
    locale.ts
  models/
    trip.ts             # Trip interface + TripStatus
    cities.ts           # EUROPEAN_CITIES list + timezoneForCity() + utcOffsetLabel()
    tripStatusOptions.ts
  styles/
    global.css          # Entry point — @imports all partials
    base.css            # Reset, CSS variables, body, container
    buttons.css
    badge.css
    card.css
    table.css
    forms.css           # Includes .form-row grid, .form-tz-hint, disabled input styles
    states.css          # .loading, .error, .empty
    skeleton.css        # Skeleton loader with shimmer animation
    app-header.css      # Header + LangSelect overrides
    custom-select.css   # CustomSelect + StatusSelect styles
    search-filter.css
    utilities.css       # Flex helpers, spacing, .time-cell, .next-day, .duration
  utils/
    time.ts             # formatCompactDateTime, formatLocalDateTime, formatDuration, isNextDay
    format.ts           # Legacy date formatter (kept for reference)
```

## Entity: Trip

```typescript
interface Trip {
  id: number;
  origin: string;            // City name from EUROPEAN_CITIES
  destination: string;       // City name from EUROPEAN_CITIES
  departureTime: string;     // UTC ISO 8601
  departureTimezone: string; // IANA tz derived from origin
  arrivalTime?: string;      // UTC ISO — only when status === "arrived"
  arrivalTimezone: string;   // IANA tz derived from destination
  status: "scheduled" | "delayed" | "cancelled" | "arrived";
  driver: string;
}
```

## Key Decisions

- **No backend** — fake API with localStorage, shared across all frameworks
- **Timezone-aware times** — stored as UTC, displayed in city-local timezone using `Intl.DateTimeFormat`
- **Compact date format** — `DD/MM/YY HH:MM (+Z)` for all time displays
- **Cities are a curated list** — ~28 European cities in `common/models/cities.ts`; city selection auto-derives timezone and shows UTC offset
- **`arrivalTime` is optional** — only required (and only enabled in the form) when `status === "arrived"`
- **`arrived` is a terminal status** — alongside `cancelled`; Cancel button hidden for both
- **Duration is a separate column/field** — auto-calculated, formatted as `2h 30m` or `1d 5h 30m` for multi-day trips
- **Skeleton loader** — animated placeholder matching table structure during loading
- **CSS is split by responsibility** in `common/styles/` — `global.css` is a pure `@import` entry point
- **Custom select components** — `CustomSelect.vue` (generic base with slots), `StatusSelect.vue` (badge-styled), `LangSelect.vue` (header language picker)
- **i18n** — vue-i18n with EN / PT / ES; locale persisted to localStorage

## Vue Implementation (`vue/`)

### Component Structure
```
src/
  components/
    AppHeader.vue
    CustomSelect.vue      # Generic dropdown base (slots: #trigger, #option)
    StatusSelect.vue      # Badge-styled status picker, uses CustomSelect
    LangSelect.vue        # Language picker, uses CustomSelect
    SearchFilter.vue
    TripStatusBadge.vue
    TripTable.vue
    TripTableSkeleton.vue # Skeleton loader for table
    LoadingSpinner.vue
    ErrorMessage.vue
  views/
    TripsList.vue
    TripDetails.vue
    TripForm.vue
  stores/
    tripStore.ts          # Pinia store
  composables/
    useLocale.ts
  tests/
    time.test.ts          # Vitest unit tests for common/utils/time.ts
```

### Form Layout
- Row 1: Origin | Destination
- Row 2: Departure Time | Status
- Row 3: Arrival Time | Duration (calculated, readonly)
- Row 4: Driver (full width)

### Validations
- Origin, destination, departure time, driver are required
- Arrival time is required when status is `arrived`
- Arrival time must be after departure time
- Changing from `arrived` to any other status clears `arrivalTime`

### Testing
```bash
cd vue && npm test        # vitest run (11 unit tests for time utils)
cd vue && npm run test:watch
```

### Running
```bash
cd vue && npm install && npm run dev
```

## Specs

- `specs/app-spec.md` — entity model, pages, routing, status flow, form layout, validations
- `specs/fake-api.md` — fake API contract and file locations
- `specs/ui-design.md` — design tokens and CSS conventions
- `specs/vue-plan.md` — Vue implementation plan
- `specs/comparison-notes.md` — framework comparison template
- `specs/i18n-spec.md` — i18n structure and locale keys
