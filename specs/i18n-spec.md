# i18n Spec — English / Spanish

## Overview

The app supports two languages: **English** and **Spanish**. Default is determined by browser locale (`navigator.language`): if it starts with `"es"`, default to Spanish; otherwise English. A language switcher in the header allows manual toggling.

## Approach

Shared translation files in `common/i18n/`. Each framework uses its idiomatic i18n solution:

| Framework | Library              |
|-----------|----------------------|
| Vue       | `vue-i18n`           |
| React     | `react-i18next`      |
| Angular   | `@ngx-translate`     |

## File Structure

```
common/
  i18n/
    en.ts
    es.ts
```

## Default Language Detection

```typescript
function getDefaultLocale(): "en" | "es" {
  const stored = localStorage.getItem("transit-dashboard-lang");
  if (stored === "en" || stored === "es") return stored;
  return navigator.language.startsWith("es") ? "es" : "en";
}
```

## Language Switcher

- Small toggle/dropdown in the header
- Persists selected language to `localStorage` key `"transit-dashboard-lang"`
- On next load, stored preference takes priority over browser detection

## Translation Keys

See `common/i18n/en.ts` and `common/i18n/es.ts` for the full key set.
