Goal
- Centralize theme variables and provide a short, copy-pastable prompt you (or other contributors) can use when updating other components to respect light/dark themes.

How to use
1) Import variables globally (recommended) in `app/src/styles.scss`:

   @import './styles/theme-variables.css';

2) When editing a component's styles, replace hard-coded colors/backgrounds with CSS variables.
   Example:

   /* Before */
   .my-card { background: #fff; color: #000; }

   /* After */
   .my-card { background: var(--k-card); color: var(--k-text); border: 1px solid var(--k-border); }

3) If a component needs a special light-theme override, scope it under `.kavii-root.light`:

   .kavii-root.light .my-component { background: linear-gradient(135deg, #fff, #e9f8ff); }

Prompt to use when asking a teammate or applying across files
(Paste this into your editor/PR message or to give instructions to an editor/AI):

"Update component X to use centralized theme variables.
- Imported variables are available under `.kavii-root` and `.kavii-root.light`.
- Replace any hard-coded color (e.g., `#fff`, `#000`, `rgba(...)`) with the matching variable: --k-card, --k-bg, --k-text, --k-border, --k-muted, --k-primary, --k-accent.
- For behavior specific to light theme, add rules scoped under `.kavii-root.light .<component-class>`.
- Keep transitions for background/color where appropriate (e.g., `transition: background .25s ease, color .25s ease`).
- Example replacements:
  - `background: #fff` -> `background: var(--k-card)`
  - `color: #000` -> `color: var(--k-text)`
  - `border: 1px solid rgba(0,0,0,.08)` -> `border: 1px solid var(--k-border)`

Please run the app and visually verify light/dark toggles after changes."

Checklist to finish a component update
- [ ] Import `theme-variables.css` (if not already global)
- [ ] Replace hard-coded colors with variables
- [ ] Add `.kavii-root.light` overrides only where needed
- [ ] Test theme toggle for visual regressions

If you want, I can run through the repository and open a PR that converts N components automatically (I can create a list of candidate files first).