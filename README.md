# Transit Dashboard — Framework Comparison

A portfolio project implementing the same **Transit Dashboard** application in three frontend frameworks to compare architecture, patterns, and developer experience.

## Frameworks

| Framework | Stack | Directory |
|-----------|-------|-----------|
| **Vue 3** | Composition API, Vue Router, Pinia, Vite, Vitest | `vue/` |
| **React** | React 18, React Router, Zustand, Hooks, Vite | `react/` |
| **Angular** | Angular 18, Standalone Components, Signals, Angular Router | `angular/` |

## The App

A dashboard for managing transit trips. Supports listing, viewing, creating, editing, and cancelling trips — with search/filter, form validation, i18n, timezone selection, and loading/error states.

**Entity:** Trip (origin, destination, departureTime UTC, arrivalTime UTC, status, driver)

**Pages:** Trips List → Trip Details → Create/Edit Trip

**API:** Fake in-memory API with localStorage persistence and simulated network delay. No backend required.

## Key Features

- **Timezone-aware display** — global timezone selector in the header (London / CET / EET); all times displayed in the selected timezone
- **Form timezone sync** — edit form inputs re-display in the selected timezone; UTC stored as source of truth
- **i18n** — English, Portuguese, Spanish; locale persisted to localStorage
- **Skeleton loaders** — animated placeholders during loading states
- **Status flow** — `scheduled → delayed → arrived/cancelled`; arrival time only enabled for `arrived` status

## Structure

```
vue/        → Vue 3 implementation
react/      → React implementation
angular/    → Angular implementation
common/     → Shared fake API, TypeScript models, utils, global CSS
specs/      → Project specs and implementation plans
```

## Running

```bash
# Vue
cd vue && npm install && npm run dev

# React
cd react && npm install && npm run dev

# Angular
cd angular && npm install && npm start
```

## Testing

All three frameworks run the same shared test suite from `common/tests/` (44 tests: time utils + form validation).

```bash
cd vue && npm test
cd react && npm test
cd angular && npm test

cd vue && npm run test:watch   # watch mode (Vue / React share the same script name)
cd react && npm run test:watch
```

## Purpose

This project exists to learn and demonstrate the differences between Vue, React, and Angular by building the exact same app three times. The comparison notes in [specs/comparison-notes.md](specs/comparison-notes.md) capture observations across routing, state management, forms, component architecture, and DX.

Built with assistance from [Claude Code](https://claude.ai/claude-code).
