# Framework Comparison Notes

## Routing

| Aspect              | Vue                        | React                        | Angular                        |
|---------------------|----------------------------|------------------------------|--------------------------------|
| Router library      | Vue Router 4               | React Router 6               | Angular Router (built-in)      |
| Config style        | Array of route objects     | JSX `<Routes>` / array       | `app.routes.ts` array          |
| Route params        | `useRoute().params`        | `useParams()`                | `ActivatedRoute.snapshot`      |
| Programmatic nav    | `useRouter().push()`       | `useNavigate()`              | `Router.navigate()`            |
| Route guards        | Route `beforeEnter`        | Wrapper components           | `CanActivate` guards           |

## State Management

| Aspect              | Vue                        | React                        | Angular                        |
|---------------------|----------------------------|------------------------------|--------------------------------|
| Solution            | Pinia                      | Zustand                      | Services (`@Injectable`)       |
| Store definition    | `defineStore()`            | `create()` (Zustand)         | Class with `signal()`          |
| Reactivity model    | Ref/computed (Vue reactivity) | Selector subscriptions    | Signals (`signal`, `computed`) |
| Global singletons   | Module-level `ref` (useTimezone) | Zustand store         | `providedIn: 'root'` service   |
| DevTools support    | Vue DevTools (Pinia)       | Zustand DevTools             | Angular DevTools               |

## Forms & Validation

| Aspect              | Vue                        | React                        | Angular                        |
|---------------------|----------------------------|------------------------------|--------------------------------|
| Binding approach    | `v-model`                  | Controlled inputs + handlers | `ngModel` + `FormControl`      |
| Validation style    | Custom `validateTripForm()` from common | Same shared fn   | Same shared fn                 |
| Disabled field mgmt | `:disabled` binding        | `disabled` prop              | `FormControl.enable/disable()` |
| Timezone sync       | `watch(timezone, ...)` re-converts UTC | `useEffect([timezone])` | `effect(() => timezone())` |
| UTC source of truth | `ref('')` per field        | `useState('')` per field     | `signal('')` per field         |

## Component Architecture

| Aspect              | Vue                        | React                        | Angular                        |
|---------------------|----------------------------|------------------------------|--------------------------------|
| Component format    | SFC (`.vue` — template + script + style) | Function + JSX (`.tsx`) | Class + decorator (`.ts`) |
| Props passing       | `defineProps<T>()`         | Destructured function args   | `@Input()` decorator           |
| Event handling      | `defineEmits` + `$emit`    | Callback props               | `@Output()` + `EventEmitter`   |
| Lifecycle hooks     | `onMounted`, `onUnmounted` | `useEffect`                  | `ngOnInit`, `OnDestroy`        |
| Generic components  | Slots (`#trigger`, `#option`) | Render prop functions     | Content projection (`ng-content`) |

## API Integration

| Aspect              | Vue                        | React                        | Angular                        |
|---------------------|----------------------------|------------------------------|--------------------------------|
| Where calls live    | Pinia store actions        | Zustand store actions        | `TripService` methods          |
| Loading state mgmt  | `loading` ref in store     | `loading` in Zustand state   | `loading` signal in service    |
| Error handling      | `error` ref in store       | `error` in Zustand state     | `error` signal in service      |

## i18n

| Aspect              | Vue                        | React                        | Angular                        |
|---------------------|----------------------------|------------------------------|--------------------------------|
| Library             | `vue-i18n`                 | Custom `useLocale` hook      | Custom `I18nService` + pipe    |
| Translation files   | `common/i18n/` shared      | Same                         | Same                           |
| Locale persistence  | `localStorage`             | `localStorage`               | `localStorage`                 |

## Developer Experience

| Aspect              | Vue                        | React                        | Angular                        |
|---------------------|----------------------------|------------------------------|--------------------------------|
| Boilerplate level   | Low — SFC is self-contained | Low — just functions        | High — decorators, modules, DI |
| Type safety         | Good with `defineProps<T>` | Excellent — JSX is TS-native | Good with strict mode          |
| Template language   | HTML-like with directives  | JSX (TS in markup)           | HTML + structural directives   |
| Reactivity mental model | Explicit refs/computed | Immutable state + hooks   | Signals (Angular 17+)          |
| Two-way binding     | `v-model` (built-in)       | Manual — value + onChange    | `[(ngModel)]`                  |
| Learning curve      | Low–Medium                 | Medium                       | High                           |
| What stands out     | `v-model`, SFC colocation, Pinia simplicity | Flexibility, TS-native JSX | Signals, DI, strict structure |
| Trickiest part      | Module-level singleton refs | Effect dependency arrays    | NG0500 (disabled + formControl), signal reactivity |

## Key Takeaways

1. **Timezone-aware UTC pattern** required different mechanisms: Vue `watch()`, React `useEffect`, Angular `effect()` — same idea, different APIs
2. **Disabled form fields** are most error-prone in Angular (NG0500 — must use `FormControl.disable()` not `[disabled]` with `[formControl]`)
3. **Generic components** (CustomSelect) show the biggest API difference: Vue slots vs React render props vs Angular content projection
4. **State singletons** solved differently: Vue module-level `ref`, React Zustand store, Angular `providedIn: 'root'` service
5. **Shared `common/` layer** (models, API, utils, CSS) worked well — the main difference between frameworks is only the UI layer
