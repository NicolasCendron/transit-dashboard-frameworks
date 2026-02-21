# Vue Implementation Plan

## Stack

- **Vue 3** with Composition API (`<script setup>`)
- **TypeScript**
- **Vue Router 4**
- **Pinia** for state management
- **Vite** as build tool
- **Vitest** for unit testing

## Project Structure (as implemented)

```
vue/
  index.html
  vite.config.ts
  tsconfig.json
  package.json
  src/
    main.ts
    App.vue
    router/
      index.ts
    stores/
      tripStore.ts          # Pinia store — fetchTrips, fetchTrip, createTrip, updateTrip, cancelTrip
    views/
      TripsList.vue         # /trips — list, search, cancel
      TripDetails.vue       # /trips/:id
      TripForm.vue          # /trips/new and /trips/:id/edit
    components/
      AppHeader.vue         # Header with TimezoneSelect + LangSelect
      CustomSelect.vue      # Generic dropdown base (slots: #trigger, #option)
      StatusSelect.vue      # Badge-styled status picker, uses CustomSelect
      LangSelect.vue        # Language picker, uses CustomSelect
      TimezoneSelect.vue    # Display timezone picker, uses CustomSelect
      SearchFilter.vue      # Search input
      TripStatusBadge.vue   # Status badge
      TripTable.vue         # Table with timezone-aware time display
      TripTableSkeleton.vue # Skeleton loader for table
      TripDetailsSkeleton.vue
      TripFormSkeleton.vue
      LoadingSpinner.vue
      ErrorMessage.vue      # Error state with retry button
    composables/
      useLocale.ts          # Wraps vue-i18n
      useTimezone.ts        # Module-level singleton ref; wraps TIMEZONE_OPTIONS from common
    utils/
      validation.ts         # validateTripForm() — re-exports from common
    tests/
      time.test.ts          # Vitest unit tests for common/utils/time.ts
```

## Key Vue Patterns Demonstrated

| Pattern                  | Where                                              |
|--------------------------|----------------------------------------------------|
| `<script setup>`        | All components                                     |
| `ref` / `computed`      | Form state, derived timezone, duration             |
| `watch`                 | Timezone sync in TripForm; route params in Details |
| `onMounted`             | Data fetching in all views                         |
| Pinia `defineStore`     | `tripStore.ts`                                     |
| Module-level singleton ref | `useTimezone.ts` — shared state without Pinia  |
| Vue Router `useRoute`   | Reading params                                     |
| Vue Router `useRouter`  | Programmatic navigation                            |
| `v-model`              | Form two-way binding                               |
| `v-if` / `v-else`      | Conditional rendering (loading/error/content)      |
| `v-for`                | List rendering                                     |
| Slots (`#trigger`, `#option`) | CustomSelect generic dropdown               |
| Props + emits           | TripTable → TripsList communication                |
| `defineProps` / `defineEmits` | Typed component contracts                  |

## Testing

```bash
cd vue && npm test             # vitest run
cd vue && npm run test:watch   # watch mode
```

11 unit tests covering `formatCompactDateTime`, `formatDuration`, `isNextDay`, `utcToLocalInput`, `localInputToUtc`.
