# University Management System (UMS)

Admin SPA to manage university operations — FaceID attendance, student ratings,
payments and faculties — surfaced as dashboard diagrams.

## Stack

- **Vue 3** + **TypeScript** + **Vite**
- **Element Plus** UI (auto-imported) + `@element-plus/icons-vue`
- **Tailwind CSS** (utility layer, `darkMode: 'class'`)
- **Pinia** (state) + **Vue Router**
- **vue-i18n** — 4 languages: Uzbek (Latin), Uzbek (Cyrillic), Russian, English
- **ECharts** via `vue-echarts` (tree-shaken) for all charts
- **Axios** data layer (mock data by default, real endpoints swappable)
- **Inter** self-hosted font — full Latin + Cyrillic coverage for all four languages
- Dark / light theme, persisted, synced across Tailwind + Element Plus

## Scripts

```bash
npm run dev      # start dev server (http://localhost:5173)
npm run build    # type-check (vue-tsc) + production build
npm run preview  # preview the production build
```

## Structure

```
src/
  core/                    # cross-cutting infrastructure
    api/          axios client + interceptors + mock helpers
    components/   AppLayout, AppSidebar, AppHeader, ThemeToggle,
                  LangSwitcher, BaseChart, StatCard
    composables/  useTheme, useLocale
    stores/       app.store (theme / locale / sidebar, persisted)
    router/       auto-collects module routes via import.meta.glob
    i18n/         global locales + auto-merges module locales
    types/        shared types, env + router augmentation
    utils/        formatters (money/date/percent), constants
    styles/       Tailwind entry + base + Element Plus font overrides
  modules/                 # feature modules (self-contained)
    dashboard/    overview KPIs + 4 diagrams
    attendance/   FaceID attendance: summary, weekly trend, records
    ratings/      student ratings: distribution, per-faculty, top list
    payments/     collected/pending/overdue, monthly + category charts
    faculties/    CRUD table with add/edit dialog
```

### Module anatomy

Every module is drop-in and owns its slice:

```
modules/<name>/
  types/        <name>.types.ts       domain interfaces
  services/     <name>.service.ts      axios calls (mock data for now)
  composables/  use<Name>.ts           reactive data + loading/error
  views/        page component(s)
  locales/      index.ts               translations (all 4 languages)
  index.ts      default export { routes } — nav meta + lazy component
```

`core/router` and `core/i18n` discover modules automatically with
`import.meta.glob('../../modules/*/index.ts')` and
`.../modules/*/locales/index.ts` — adding a module needs **no** central edits.

## Backend integration

Feature services return typed **mock data** while `VITE_USE_MOCK=true` (see `.env`).
To hit the real API: set `VITE_USE_MOCK=false`; the `else` branch of each service
already calls the intended endpoints (`/attendance`, `/ratings`, `/payments`,
`/faculties`, `/dashboard/overview`). **Auth always hits the real API** — it ignores
the mock flag.

### Dev proxy (avoids CORS)

`VITE_API_BASE_URL` is **relative** (`/api/v1`), and `vite.config.ts` proxies that
prefix to `VITE_API_PROXY_TARGET`. The browser only ever talks to
`localhost:5173`, so there is no cross-origin request, no preflight, and no
dependency on backend CORS headers. When the ngrok URL changes, update
`VITE_API_PROXY_TARGET` only (use the `https://` form) — Vite restarts itself.

For a real deployment, point `VITE_API_BASE_URL` at the absolute API URL and
enable CORS on the backend (`Access-Control-Allow-Origin` for the app origin,
`Authorization` + `ngrok-skip-browser-warning` in `Allow-Headers`, and `OPTIONS`
answered with 204).

## Auth

`modules/auth` owns the session: `/auth/login`, `/auth/refresh`, `/auth/logout`,
`/users/me`. Tokens live in `localStorage` (`ums.access_token` / `ums.refresh_token`);
`core/api/client.ts` attaches the bearer and, on a 401, performs a **single-flight**
refresh and replays the failed request. A failed refresh clears the session and
routes to `/login`. Routes are guarded in `core/router`; `meta.public: true` opts a
route out (login page, `/monitoring` TV kiosk).

## i18n notes

App locale keys: `en`, `ru`, `uz-Latn`, `uz-Cyrl`. The language switcher swaps
vue-i18n, the Element Plus component locale, and `<html lang>` together.
Uzbek-Cyrillic app strings are fully translated; Element Plus component strings
fall back to its Uzbek (Latin) pack (no Cyrillic pack shipped upstream).
