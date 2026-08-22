# PlanUP

A mobile-first grocery, recipe, and budget planner. Track what you need to
buy, what you've bought, what it cost, and see real spending insights broken
down by real calendar weeks and months.

## How this repo is put together

This looks like a TanStack Start / React / Vite project, but the actual app
is **not** built with React. It's a self-contained, vanilla HTML/CSS/JS app
that lives at:

```
public/planup/
  index.html
  style.css
  main.js
```

The React/TanStack shell only exists as a thin wrapper: `src/routes/index.tsx`
immediately redirects `/` to `/planup/index.html`, and Vite serves everything
under `public/` as static files. So the routing, build tooling, and
`src/` folder are scaffolding — none of it is wired into how PlanUP actually
works. **All real feature work happens in `public/planup/main.js`, `style.css`,
and `index.html`.**

Why it's set up this way: the app started as a static prototype and stayed
static because it never needed a framework — it's all `document.getElementById`
+ `localStorage`, no server, no build step required to run it. If you ever
do want to convert it to real React components, budget for that as its own
project — it's ~7,000 lines of tightly-coupled imperative DOM code, and
porting it safely means doing it screen by screen with a working test loop,
not in one pass.

## Running it

```sh
npm i
npm run dev
```

Then open the dev server URL — it'll redirect straight into the app. Since
`public/planup/` is plain static files, you can also just open
`public/planup/index.html` directly in a browser (or serve that folder with
any static file server) without the Vite/React layer at all.

## What's inside the app

- **Inventory** — add items with name, price, quantity, category, store.
  Swipeable cards, favorites, sort/filter.
- **Recipes** — search recipes (via Gemini, see below), see which
  ingredients you already have vs. still need, add missing ones to your
  to-get list.
- **To-Get List** — a running shopping list, separate from your saved
  inventory.
- **Insights** — spending broken down by real calendar week/month (see
  below), category breakdown, a Chart.js bar chart of top items.
- **Budget** — a budget card on the home page with a progress bar and
  over-budget/near-budget alerts.
- **History / Trash / Favorites** — past used/deleted items, trashed items,
  liked items.
- **Settings** — currency (with conversion), dark mode, budget alert
  threshold, data export.
- **Profile** — an iOS-Contacts-style collapsing header (avatar shrinks and
  slides right, name resizes) driven by a single `--scroll-progress` CSS
  variable, smoothed with exponential interpolation in JS rather than raw
  scroll-tied transforms.

Navigation is two layers: a bottom nav (Home / Insights / Profile) switching
between top-level `.full-page` screens, and a hamburger side-drawer whose
items (`.menu-xrn` pages — To-Get List, Favorites, Scheduled, History, Trash,
Feedback, Settings, About) slide in from behind the drawer itself so they
visually emerge from the menu item you tapped.

## Insights: how the week/month math actually works

This was rebuilt to use **real calendar weeks and months**, not rolling
N-day windows. It matters enough to document:

- A week is Sunday-Saturday, real calendar dates. If you start using the app
  mid-week, that week's container still spans the full Sun-Sat range - the
  days before you started just have zero data, nothing is shifted.
- Once a week is fully over, its stats (`expenditure`, `itemsAdded`,
  `avgPerItem`, `topCategory`, full `categoryStats`) are computed once and
  saved permanently to `localStorage` under `planup_weekly_containers`,
  keyed by the week's start date. The **current, in-progress week is never
  saved** - it's recomputed live every time you view Insights
  (`getLiveCurrentWeekStats`).
- Selecting "Last 2 weeks" / "Last 3 weeks" literally sums 2 or 3 of the most
  recently *saved* weekly containers - see `getWeeksForRange()`.
- "This month" / "Last month" / etc. work by checking which saved weeks'
  Sunday falls inside the real calendar month boundaries
  (`getMonthStart`/`getMonthEnd`) - a week "belongs" to whichever month its
  Sunday lands in.
- Data survives deletion: `addToHistory()` stores the item's *original*
  `createdAt` (not the delete/use time), and `getAllTrackedEvents()` merges
  still-active `items` with used/deleted `history` entries. So a week's
  saved numbers stay accurate even if you delete an item afterward - the
  snapshot was taken from real activity at the time the week closed.
- All of this lives in one block in `main.js`, search for `REAL-CALENDAR
  WEEK / MONTH CONTAINERS`. Key functions: `getWeekStart`/`getWeekEnd`,
  `computeWeekStats`, `syncWeeklyContainers` (backfills any completed weeks
  that haven't been saved yet), `getWeeksForRange`, `aggregateWeeks`,
  `getRangeData` (what Insights actually renders from).

## localStorage keys

| Key | What it holds |
|---|---|
| `planup_items` | Current inventory |
| `planup_to_get_items` | Shopping/to-get list |
| `planup_favorites` | Liked items |
| `planup_history` | Used/deleted item log (with preserved original `createdAt`) |
| `planup_weekly_containers` | Saved real-calendar weekly insight snapshots |
| `planup_budget` | Budget amount |
| `planup_alert_percent` | Budget alert threshold % |
| `planup_budget_alerts_enabled` | Whether budget alerts are on |
| `planup_settings` | Currency, dark mode, other app settings |
| `planup_admin_metrics` | Stats for the hidden admin/debug panel |
| `GEMINI_API_KEY` | User-supplied Gemini API key for recipe search |

Everything is client-side only - there's no backend. Clearing site data
wipes the app.

## Known rough edges

Worth knowing about if you're debugging something odd, even though none of
these are fixed yet:

- **Duplicate function declarations.** JS in a plain `<script>` tag (sloppy
  mode) silently allows redeclaring a top-level `function` - the *last*
  one in the file wins, everywhere, regardless of where it's called from.
  This file has a few of those (e.g. `initializeRecipeExpansion` is declared
  twice; only the second, simpler version ever actually runs). It won't
  throw an error in the browser, but `node --check main.js` will flag it -
  that's expected, not a regression, unless the error text changes.
- **Admin/debug panel.** There's a hidden admin dashboard
  (`#categoryBreakdownContainer` etc.) not meant for normal users. A couple
  of functions used to silently collide with real Insights-page functions
  of the same name because of the duplicate-declaration behavior above -
  the real one is now named `updateInsightsCategoryBreakdown` specifically
  to avoid that collision. If you add more `updateX`-style functions, grep
  for the name first.
- **Dark mode coverage.** Dark mode overrides are mostly centralized under
  `body.theme-dark` near the bottom of `style.css`, generated by sweeping
  the stylesheet for any surface with a light/white background. If you add
  a new component with a hardcoded light `background`, it won't pick up
  dark mode automatically - either use `var(--main-background)` (which
  already flips dark-aware) or add a `body.theme-dark .your-class` rule.
