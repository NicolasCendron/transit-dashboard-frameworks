# Vue Implementation Plan

## Stack

- **Vue 3** with Composition API (`<script setup>`)
- **TypeScript**
- **Vue Router 4**
- **Pinia** for state management
- **Vite** as build tool

## Project Structure

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
      index.ts              # Route definitions
    stores/
      tripStore.ts          # Pinia store for trips
    views/
      TripsList.vue         # /trips
      TripDetails.vue       # /trips/:id
      TripForm.vue          # /trips/new and /trips/:id/edit
    components/
      AppHeader.vue         # Header bar
      TripTable.vue         # Table rendering trips
      TripStatusBadge.vue   # Status badge component
      SearchFilter.vue      # Search input for filtering
      LoadingSpinner.vue    # Loading state
      ErrorMessage.vue      # Error state with retry
    composables/
      useTrips.ts           # Optional: trip-related composable logic
```

## Implementation Steps

### Phase 1: Project Setup
1. Scaffold with `npm create vite@latest` (Vue + TS)
2. Install dependencies: `vue-router`, `pinia`
3. Configure path alias for `common/` or copy shared code
4. Import `global.css` in `main.ts`

### Phase 2: Shared Code
1. Create `common/models/trip.ts` — Trip interface
2. Create `common/api/seed-data.ts` — seed trips
3. Create `common/api/fake-api.ts` — full API implementation
4. Create `common/styles/global.css` — shared styles

### Phase 3: Vue App Core
1. Set up Vue Router with all routes
2. Create Pinia trip store with actions: `fetchTrips`, `fetchTrip`, `createTrip`, `updateTrip`, `cancelTrip`
3. Build `App.vue` with `<AppHeader>` + `<RouterView>`

### Phase 4: Views & Components
1. `TripsList.vue` — fetch on mount, filter, table, actions
2. `TripDetails.vue` — fetch by ID, display card
3. `TripForm.vue` — create/edit with validation
4. Small components: badge, table, search, loading, error

### Phase 5: Polish
1. Loading/error/empty states on all views
2. Form validation feedback
3. Confirm before cancel action
4. Test all routes and flows manually

## Key Vue Patterns to Demonstrate

| Pattern                  | Where                                    |
|--------------------------|------------------------------------------|
| `<script setup>`        | All components                           |
| `ref` / `reactive`      | Local state in views                     |
| `computed`              | Filtered trips list                      |
| `watch` / `watchEffect` | Route param changes in TripDetails       |
| `onMounted`             | Data fetching                            |
| Pinia `defineStore`     | tripStore.ts                             |
| `storeToRefs`           | Destructuring store state reactively     |
| Vue Router `useRoute`   | Reading params                           |
| Vue Router `useRouter`  | Programmatic navigation                  |
| `v-model`              | Form two-way binding                     |
| `v-if` / `v-else`      | Conditional rendering (loading/error)    |
| `v-for`                | List rendering                           |
| Props + emits           | Child component communication            |
| Template refs           | Form focus management (optional)         |
