# i18n Spec — English / Portuguese / Spanish

## Overview

The app supports three languages: **English**, **Portuguese**, and **Spanish**. Default is determined by browser locale (`navigator.language`): if it starts with `"pt"` default to Portuguese, `"es"` to Spanish, otherwise English. A language switcher in the header allows manual toggling.

## Approach

Shared translation files in `common/i18n/`. Each framework uses a lightweight custom i18n solution that reads from the shared locale files — no third-party i18n library required.

| Framework | Solution |
|-----------|----------|
| Vue | `useLocale` composable + `vue-i18n` |
| React | `useLocale` hook (custom, wraps `common/i18n/locale.ts`) |
| Angular | `I18nService` + `TranslatePipe` (custom) |

## File Structure

```
common/
  i18n/
    en.ts       # English strings
    pt.ts       # Portuguese strings
    es.ts       # Spanish strings
    locale.ts   # Locale type, options, getDefaultLocale()
```

## Default Language Detection

```typescript
function getDefaultLocale(): Locale {
  const stored = localStorage.getItem("transit-dashboard-lang");
  if (stored === "en" || stored === "pt" || stored === "es") return stored;
  if (navigator.language.startsWith("pt")) return "pt";
  if (navigator.language.startsWith("es")) return "es";
  return "en";
}
```

## Language Switcher

- Flag + label dropdown in the header (using `CustomSelect`)
- Persists selected language to `localStorage` key `"transit-dashboard-lang"`
- On next load, stored preference takes priority over browser detection

## Translation Keys

See `common/i18n/en.ts` for the full key set. All three locale files share the same key structure.
