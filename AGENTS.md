# AGENTS.md — Base44 dev setup notes

## App overview
Horizon Estates — a Vite + React 19 + TypeScript luxury real estate frontend.
- Package manager: **bun** (repo has `bun.lock`). `package.json` lists vite in both deps and devDeps (harmless duplicate warning).
- Dev server: `bun run dev` → `vite --port=3000 --host=0.0.0.0` (already binds 0.0.0.0).
- No backend server. Data/auth via **Firebase** (Firestore + Auth). Firebase config is baked into the committed `firebase-applet-config.json` — no Firebase credentials needed from the user.
- `GEMINI_API_KEY` / `APP_URL` from `.env.example` are **not referenced anywhere in `src/`**; the AI capability is declared in `metadata.json` but unused in the UI. The app boots fine without them.

## Running here
`docker compose -f docker-compose.base44.yml up -d` — node:22 image, installs bun, `bun install --frozen-lockfile`, then `bun run dev`. Source is bind-mounted; edits hot-reload via Vite HMR.

## Verify it's up
- `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/` → 200
- `/src/main.tsx` returns 200 (confirms live source, not a prebuilt bundle).

## Notes / quirks
- `vite.config.ts` disables HMR + file watching when `DISABLE_HMR=true`. We leave it unset so live reload works.
- Vite >= 6.1 host allowlist handled via `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` env (platform-provided).
- Firestore security rules live in `firestore.rules`; seed data (`INITIAL_PROPERTIES`) is defined in `src/lib/firebase.ts`.
