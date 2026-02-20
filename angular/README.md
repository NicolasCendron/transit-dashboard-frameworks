# Transit Dashboard - Angular

Angular 18 implementation using standalone components, signals, and Angular Router.

## Features

- **Standalone Components**: No NgModules, fully standalone architecture
- **Signals**: Reactive state management with Angular signals
- **Angular Router**: File-based routing with lazy loading support
- **TypeScript**: Strict mode enabled
- **Shared Common Layer**: Reuses models, API, utils, and styles from `../common`

## Stack

- Angular 18
- TypeScript 5.4
- RxJS 7.8
- Standalone Components
- Angular Signals
- Angular Router

## Development

```bash
npm install
npm start
```

Open [http://localhost:4200](http://localhost:4200)

## Build

```bash
npm run build
```

## Architecture

- `src/app/components/` - Reusable UI components
- `src/app/views/` - Page components (routes)
- `src/app/services/` - Services (TripService, I18nService)
- `src/app/pipes/` - Custom pipes (TranslatePipe)
- `src/app/app.routes.ts` - Route definitions

## Key Patterns

- **Signals for State**: All reactive state uses Angular signals
- **Standalone Components**: Every component is standalone
- **Dependency Injection**: Services use `providedIn: 'root'`
- **Computed Values**: Derived state with `computed()`
- **Two-way Binding**: Forms use `[(ngModel)]`
