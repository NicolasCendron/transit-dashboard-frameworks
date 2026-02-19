# Transit Dashboard — Framework Comparison

A portfolio project implementing the same **Transit Dashboard** application in three frontend frameworks to compare architecture, patterns, and developer experience.

## Frameworks

| Framework | Stack | Directory |
|-----------|-------|-----------|
| **Vue 3** | Composition API, Vue Router, Pinia, Vite | `vue/` |
| **React** | React 18, React Router, Hooks, Vite | `react/` |
| **Angular** | Angular 17+, Standalone Components, Angular Router | `angular/` |

## The App

A dashboard for managing transit trips. Supports listing, viewing, creating, editing, and cancelling trips — with search/filter, form validation, and loading/error states.

**Entity:** Trip (route, departureTime, status, platform, driver)

**Pages:** Trips List → Trip Details → Create/Edit Trip

**API:** Fake in-memory API with localStorage persistence and simulated network delay. No backend required.

## Structure

```
vue/        → Vue 3 implementation
react/      → React implementation
angular/    → Angular implementation
common/     → Shared fake API, TypeScript models, global CSS
specs/      → Project specs and implementation plans
```

## Running

```bash
# Vue
cd vue && npm install && npm run dev

# React
cd react && npm install && npm run dev

# Angular
cd angular && npm install && ng serve
```

## Purpose

This project exists to learn and demonstrate the differences between Vue, React, and Angular by building the exact same app three times. The comparison notes in [specs/comparison-notes.md](specs/comparison-notes.md) capture observations across routing, state management, forms, component architecture, and DX.

Built with assistance from [Claude Code](https://claude.ai/claude-code).
