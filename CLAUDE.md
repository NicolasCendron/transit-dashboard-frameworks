# CLAUDE.md — Transit Dashboard Frameworks

## Project Overview

Monorepo implementing the same Transit Dashboard app in **Vue 3**, **React**, and **Angular** to compare framework architecture, routing, forms, state management, and API patterns.

## Repository Structure

```
transport-framework/
  vue/        # Vue 3 + Composition API + Vue Router + Pinia + Vitest
  react/      # React 18 + React Router + Zustand + Hooks + Vite
  angular/    # Angular 18 + Standalone Components + Signals + Angular Router
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
    cities.ts           # EUROPEAN_CITIES list + timezoneForCity() + utcOffsetLabel() + timezoneAbbr()
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
    app-header.css      # Header + LangSelect/TimezoneSelect overrides
    custom-select.css   # CustomSelect + StatusSelect + TimezoneSelect styles
    search-filter.css
    utilities.css       # Flex helpers, spacing, .time-cell, .next-day, .duration
  utils/
    time.ts             # formatCompactDateTime, formatDuration, isNextDay, utcToLocalInput, localInputToUtc
    timezone.ts         # TIMEZONE_OPTIONS, getDefaultTimezone(), setStoredTimezone() — shared across frameworks
```

## Entity: Trip

```typescript
interface Trip {
  id: number;
  origin: string;            // City name from EUROPEAN_CITIES
  destination: string;       // City name from EUROPEAN_CITIES
  departureTime: string;     // UTC ISO 8601
  departureTimezone: string; // IANA tz derived from origin city
  arrivalTime?: string;      // UTC ISO — only when status === "arrived"
  arrivalTimezone: string;   // IANA tz derived from destination city
  status: "scheduled" | "delayed" | "cancelled" | "arrived";
  driver: string;
}
```

## Key Decisions

- **No backend** — fake API with localStorage, shared across all frameworks
- **UTC storage** — all times stored as UTC ISO 8601; display and form input use timezone conversion
- **Global display timezone** — header selector (London / CET / EET); persisted to localStorage; auto-detects browser timezone on first visit. Affects table, detail, and form views
- **Form timezone sync** — `utcToLocalInput(utc, displayTz)` on load; `localInputToUtc(local, displayTz)` on save; re-converts when timezone changes. UTC kept as source of truth in a separate ref/signal/state
- **City timezone vs display timezone** — `departureTimezone`/`arrivalTimezone` on the Trip model are city-derived IANA zones (used for `isNextDay` calculation and stored in the entity). The display timezone is user-selected and used for rendering
- **Compact date format** — `DD/MM/YY HH:MM (TZ)` for all time displays
- **Cities are a curated list** — 28 European cities in `common/models/cities.ts`; city selection auto-derives the stored IANA timezone
- **`arrivalTime` is optional** — only required (and only enabled in the form) when `status === "arrived"`
- **`arrived` is a terminal status** — alongside `cancelled`; Cancel button hidden for both
- **Duration is a separate column/field** — auto-calculated from stored UTC, formatted as `2h 30m` or `1d 5h 30m`
- **Skeleton loader** — animated placeholder matching table/form structure during loading
- **CSS is split by responsibility** in `common/styles/` — `global.css` is a pure `@import` entry point
- **i18n** — EN / PT / ES; locale persisted to localStorage

## Vue Implementation (`vue/`)

### Component Structure
```
src/
  components/
    AppHeader.vue
    CustomSelect.vue      # Generic dropdown base (slots: #trigger, #option)
    StatusSelect.vue      # Badge-styled status picker, uses CustomSelect
    LangSelect.vue        # Language picker, uses CustomSelect
    TimezoneSelect.vue    # Display timezone picker, uses CustomSelect
    SearchFilter.vue
    TripStatusBadge.vue
    TripTable.vue
    TripTableSkeleton.vue
    TripDetailsSkeleton.vue
    TripFormSkeleton.vue
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
    useTimezone.ts        # Module-level singleton ref; wraps TIMEZONE_OPTIONS from common
  tests/
    time.test.ts          # Vitest unit tests for common/utils/time.ts
```

### Form UTC pattern (Vue)
- `storedUtcDeparture` / `storedUtcArrival` — `ref('')` holding raw UTC
- `watch(form.departureTime)` → `localInputToUtc(val, timezone)` → updates stored UTC
- `watch(timezone)` → `utcToLocalInput(utc, newTz)` → updates form inputs
- Payload uses stored UTC directly; `departureTimezone`/`arrivalTimezone` from `timezoneForCity(city)`

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

## React Implementation (`react/`)

### Component Structure
```
src/
  components/
    AppHeader.tsx
    CustomSelect.tsx      # Generic dropdown base (renderTrigger/renderOption props)
    StatusSelect.tsx      # Badge-styled status picker
    LangSelect.tsx
    TimezoneSelect.tsx    # Display timezone picker
    SearchFilter.tsx
    TripStatusBadge.tsx
    TripTable.tsx
    TripTableSkeleton.tsx
    TripDetailsSkeleton.tsx
    TripFormSkeleton.tsx
    LoadingSpinner.tsx
    ErrorMessage.tsx
    ErrorBoundary.tsx
  views/
    TripsList.tsx
    TripDetails.tsx
    TripForm.tsx
  store/
    tripStore.ts          # Zustand store
    timezoneStore.ts      # Zustand store for display timezone
  hooks/
    useLocale.ts
    useTimezone.ts        # Wraps timezoneStore + TIMEZONE_OPTIONS from common
  router/
    index.tsx
```

### Form UTC pattern (React)
- `utcDeparture` / `utcArrival` — `useState('')` holding raw UTC
- `handleDepartureChange(val)` → `localInputToUtc(val, timezone)` → `setUtcDeparture`
- `useEffect([timezone])` → `utcToLocalInput(utc, timezone)` → updates form inputs
- Payload uses stored UTC directly; `departureTimezone`/`arrivalTimezone` from `timezoneForCity(city)`

### Running
```bash
cd react && npm install && npm run dev
```

## Angular Implementation (`angular/`)

### Component Structure
```
src/app/
  components/
    app-header.component.ts
    custom-select.component.ts
    status-select.component.ts
    lang-select.component.ts
    timezone-select.component.ts
    trip-table.component.ts
    trip-table-skeleton.component.ts
    trip-details-skeleton.component.ts
    trip-form-skeleton.component.ts
    trip-status-badge.component.ts
    search-filter.component.ts
    loading-spinner.component.ts
    error-message.component.ts
  views/
    trips-list.component.ts
    trip-details.component.ts
    trip-form.component.ts
  services/
    trip.service.ts
    i18n.service.ts
    timezone.service.ts   # Signal-based; wraps TIMEZONE_OPTIONS from common
  pipes/
    translate.pipe.ts
```

### Form UTC pattern (Angular)
- `storedUtcDeparture` / `storedUtcArrival` — `signal('')` holding raw UTC
- `FormControl.valueChanges` → `localInputToUtc(val, timezone())` → updates signal
- `effect(() => timezone())` → `utcToLocalInput(utc, tz)` → `FormControl.setValue`
- Arrival `FormControl` initialized disabled; `enable()`/`disable()` via `updateStatus()`
- Payload uses stored UTC signals directly

### Running
```bash
cd angular && npm install && npm start
```

## Timezone Options

Shared via `common/utils/timezone.ts`:
| Label | IANA Zone | Offset (winter/summer) |
|-------|-----------|------------------------|
| London | `Europe/London` | UTC+0 / UTC+1 (BST) |
| CET | `Europe/Paris` | UTC+1 / UTC+2 (CEST) |
| EET | `Europe/Athens` | UTC+2 / UTC+3 (EEST) |

Default: browser timezone if it matches one of the above, otherwise CET. Persisted to localStorage.

## Specs

- `specs/app-spec.md` — entity model, pages, routing, status flow, form layout, validations
- `specs/fake-api.md` — fake API contract and file locations
- `specs/ui-design.md` — design tokens and CSS conventions
- `specs/vue-plan.md` — Vue implementation plan
- `specs/comparison-notes.md` — framework comparison template
- `specs/i18n-spec.md` — i18n structure and locale keys
