# Light/Dark Mode Styling Guide

## Rule: Never use hardcoded Tailwind colors

Do **not** use `bg-white`, `bg-black`, `text-gray-500`, `border-gray-200`, etc. These won't adapt to dark mode. Always use the semantic token classes below.

## Available Tokens

### Surfaces (backgrounds)
| Token | Use for |
|-------|---------|
| `bg-background` | Page background |
| `bg-surface` | Cards, panels, modals, form backgrounds |
| `bg-surface-secondary` | Subtle alternate backgrounds (e.g. "current" items) |
| `bg-surface-tertiary` | Slightly more distinct backgrounds (pills, tags) |

### Text
| Token | Use for |
|-------|---------|
| `text-text-primary` | Headings, main body text |
| `text-text-secondary` | Secondary text, labels |
| `text-text-tertiary` | Descriptions, captions, icons |
| `text-text-muted` | Placeholder-like, least important text |

### Borders
| Token | Use for |
|-------|---------|
| `border-border-theme` | Strong/prominent borders (dividers, section separators) |
| `border-border-muted` | Standard card/input borders |
| `border-border-subtle` | Very faint borders |

### Brand
| Token | Use for |
|-------|---------|
| `text-brand-primary` | Primary brand-colored text (e.g. user's name) |
| `text-brand-secondary` | Secondary brand text (e.g. headline) |
| `border-brand-accent` / `text-brand-accent` | Hover accents, links |

### Buttons
Use existing `ButtonVariant` enum and `<Button>` component. If you need a custom label styled as a button, use:
- `bg-btn-primary-bg text-btn-primary-text border-btn-primary-border`
- `hover:bg-btn-primary-hover-bg hover:text-btn-primary-hover-text`

### Inputs
Use `<Input>` and `<TextArea>` components (already themed). For custom inputs (e.g. `<select>`):
- `border-input-border text-input-text bg-surface`

### Navbar
- `bg-navbar-bg text-navbar-text`

## Quick Reference

| Instead of | Use |
|------------|-----|
| `bg-white` | `bg-surface` |
| `bg-gray-50` | `bg-surface-secondary` |
| `bg-gray-100` / `bg-gray-200` | `bg-surface-tertiary` |
| `text-black` | `text-text-primary` |
| `text-gray-700` | `text-text-secondary` |
| `text-gray-500` / `text-gray-600` | `text-text-tertiary` |
| `text-gray-400` | `text-text-muted` |
| `border-black` | `border-border-theme` |
| `border-gray-200` / `border-gray-300` | `border-border-muted` |
| `text-[#003366]` | `text-brand-primary` |
| `text-[#174978]` | `text-brand-secondary` |

## Things to Watch Out For

1. **Non-color classes are fine** -- `rounded-lg`, `p-4`, `font-bold`, etc. don't need tokens.
2. **Red/green/status colors are OK** -- `text-red-500`, `bg-green-100` for alerts/errors are theme-independent and can stay hardcoded.
3. **Shadows** -- Tailwind shadows (`shadow-md`, `shadow-lg`) work in both modes without changes.
4. **Adding new tokens** -- If you need a new semantic color, add it in both `:root` and `.dark` in `globals.css`, then register it in the `@theme inline` block as `--color-your-token: var(--your-token)`.
5. **No `dark:` prefix needed** -- The token system handles everything. Avoid `dark:bg-...` classes.
6. **Images/logos** -- Test that images are visible on both backgrounds. Use rounded containers with `bg-surface` if needed.
