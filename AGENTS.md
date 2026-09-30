# AGENTS.md — Base44 dev setup notes

## App overview
Horizon Estates — a Vite + React 19 + TypeScript luxury real estate site for the Indian market.
- Package manager: **bun** (repo has `bun.lock`). `package.json` lists vite in both deps and devDeps (harmless duplicate warning).
- Dev server: `bun run dev` → `vite --port=3000 --host=0.0.0.0` (already binds 0.0.0.0).
- **Multi-page** app: `react-router-dom` (BrowserRouter). Routes live in `src/App.tsx`, shared shell in `src/components/layout/SiteLayout.tsx`.
- No backend server. Data/auth via **Firebase** (Firestore + Auth). Firebase config is baked into the committed `firebase-applet-config.json` — no Firebase credentials needed from the user.
- `GEMINI_API_KEY` / `APP_URL` from `.env.example` are **not referenced anywhere in `src/`**; the AI capability is declared in `metadata.json` but unused in the UI. The app boots fine without them.

## Structure
- `src/pages/*` — Home, Properties, PropertyDetail (`/properties/:id`), About, Services, Agents, Insights, Contact, NotFound.
- `src/context/SiteContext.tsx` — all shared state (properties, favorites, filters) + renders the modals (booking, add/edit, dashboard, auth).
- `src/data/properties.ts` — curated launch catalog (`INITIAL_PROPERTIES`) + `CATALOG_VERSION`.
- `src/data/site.ts` — contact details, stats, testimonials, services, agents, insights, FAQs, nav links.
- `src/lib/format.ts` — INR formatting (`formatPropertyPrice`, `formatINR`, `formatINRCompact`).

## Currency & catalog versioning
- All pricing is **INR**; display goes through `formatPropertyPrice` (rentals show the full figure, sale/commercial use `₹ Cr` / `₹ L`).
- Listings carry a `catalogVersion`. Only documents matching `CATALOG_VERSION` are shown, so the original USD demo listings in Firestore are ignored. **Bump `CATALOG_VERSION` in `src/data/properties.ts` whenever the curated catalog changes.**
- Seeding uses deterministic doc ids (`horizon-listing-01`…) so React StrictMode double-invocation cannot create duplicates.

## Running here
`docker compose -f docker-compose.base44.yml up -d` — node:22 image, installs bun, `bun install --frozen-lockfile`, then `bun run dev`. Source is bind-mounted; edits hot-reload via Vite HMR.
After adding/removing a dependency run it inside the container (`docker compose -f docker-compose.base44.yml exec -T web bun add <pkg>`) so `bun.lock` stays in sync with the `--frozen-lockfile` install.

## Verify it's up
- `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/` → 200 (all SPA routes return 200)
- `/src/main.tsx` returns 200 (confirms live source, not a prebuilt bundle).
- Type-check: `docker compose -f docker-compose.base44.yml exec -T web bun run lint`
- Production build: `docker compose -f docker-compose.base44.yml exec -T web bun run build`

## Notes / quirks
- `vite.config.ts` disables HMR + file watching when `DISABLE_HMR=true`. We leave it unset so live reload works.
- Vite >= 6.1 host allowlist handled via `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` env (platform-provided).
- Firestore security rules live in `firestore.rules`. Note: the deployed rules let anyone **read** properties and **create** docs with `ownerId == 'system_admin'`, but legacy seed docs cannot be updated or deleted — which is why the catalog is versioned instead of migrated in place.
- Some remote Unsplash images are flaky; the DOM renders regardless.
