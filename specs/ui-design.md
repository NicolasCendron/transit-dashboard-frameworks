# UI & Design Spec

## Design Principles

- Clean, minimal, no CSS frameworks
- Shared `global.css` used by all three apps
- Consistent look across Vue, React, and Angular
- Responsive-friendly but desktop-first

## Layout

```
┌─────────────────────────────────────────┐
│  Header: "Transit Dashboard"            │
├─────────────────────────────────────────┤
│                                         │
│   ┌─────────────────────────────────┐   │
│   │  Page content (max-width 900px) │   │
│   │  centered, with padding         │   │
│   └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

## Color Tokens

```css
:root {
  /* Base */
  --color-bg: #f5f5f5;
  --color-surface: #ffffff;
  --color-text: #1a1a1a;
  --color-text-secondary: #666666;
  --color-border: #e0e0e0;

  /* Primary */
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --color-primary-text: #ffffff;

  /* Status badges */
  --color-scheduled: #2563eb;
  --color-delayed: #ea580c;
  --color-cancelled: #dc2626;

  /* Danger */
  --color-danger: #dc2626;
  --color-danger-hover: #b91c1c;

  /* Misc */
  --radius: 6px;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
```

## CSS Classes

### Container
```css
.container { max-width: 900px; margin: 0 auto; padding: 1.5rem; }
```

### Cards
```css
.card { background: var(--color-surface); border-radius: var(--radius); box-shadow: var(--shadow); padding: 1.5rem; }
```

### Buttons
```css
.btn           { padding: 0.5rem 1rem; border-radius: var(--radius); font-size: 0.875rem; cursor: pointer; border: 1px solid var(--color-border); }
.btn-primary   { background: var(--color-primary); color: var(--color-primary-text); border-color: var(--color-primary); }
.btn-danger    { background: var(--color-danger); color: white; border-color: var(--color-danger); }
.btn-secondary { background: var(--color-surface); color: var(--color-text); }
```

### Status Badge
```css
.badge { padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; text-transform: capitalize; }
.badge-scheduled { background: #dbeafe; color: var(--color-scheduled); }
.badge-delayed   { background: #fff7ed; color: var(--color-delayed); }
.badge-cancelled { background: #fef2f2; color: var(--color-cancelled); }
```

### Table
```css
.table         { width: 100%; border-collapse: collapse; }
.table th      { text-align: left; padding: 0.75rem; border-bottom: 2px solid var(--color-border); font-size: 0.75rem; text-transform: uppercase; color: var(--color-text-secondary); }
.table td      { padding: 0.75rem; border-bottom: 1px solid var(--color-border); }
```

### Forms
```css
.form-group    { margin-bottom: 1rem; }
.form-label    { display: block; margin-bottom: 0.375rem; font-size: 0.875rem; font-weight: 500; }
.form-input    { width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--color-border); border-radius: var(--radius); font-size: 0.875rem; }
.form-error    { color: var(--color-danger); font-size: 0.75rem; margin-top: 0.25rem; }
```

### Utility
```css
.text-center   { text-align: center; }
.mt-1          { margin-top: 0.5rem; }
.mt-2          { margin-top: 1rem; }
.mt-3          { margin-top: 1.5rem; }
.gap-1         { gap: 0.5rem; }
.flex          { display: flex; }
.flex-between  { display: flex; justify-content: space-between; align-items: center; }
```

### States
```css
.loading       { text-align: center; padding: 2rem; color: var(--color-text-secondary); }
.error         { text-align: center; padding: 2rem; color: var(--color-danger); }
.empty         { text-align: center; padding: 2rem; color: var(--color-text-secondary); }
```

## Header

Simple fixed-color header bar:
- Background: `var(--color-primary)`
- Text: white, bold, "Transit Dashboard"
- Optional: small subtitle or framework badge (e.g. "Vue", "React", "Angular")

## File Location

```
common/
  styles/
    global.css
```

Each app imports or links to this shared CSS.
