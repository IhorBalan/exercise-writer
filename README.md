# Exercise Writer

A mobile-first tracker for [Convict Conditioning](https://en.wikipedia.org/wiki/Convict_Conditioning) training: log your Big Six sessions (movement, step, level, reps per set) and follow your progress on a dashboard.

Live app: https://exercise-writer.vercel.app

## Features

- Accounts (email + password via Neon Auth); every user sees only their own data
- Log a session: movement, step, level and reps per set, plus an optional note
- Two warm-up sets before each movement's working sets, prefilled with easier steps; they never count toward standards or charts
- Settings: pick a Convict Conditioning routine (New Blood, Good Behavior, Veterano, Solitary Confinement, Supermax, or a three-day split); its weekly schedule shows on Log and Programs as a reference
- History with edit and delete; feedback when a standard is met or you're ready to move up a step
- Dashboard: where you are on each ladder, step progression, weekly volume, training-day heatmap, week streak
- Per-movement page with the current step's standards and best set per session
- Programs reference: all 60 steps with beginner / intermediate / progression standards, and a collapsed "How to do it" summary per step (also on the Log form)
- Dark mode (follows the device, or toggle in the header) and CSV export from History

## Tech stack

- **Framework:** Next.js 16 (App Router, TypeScript), frontend and backend in one app
- **UI:** shadcn/ui (new-york style) + Tailwind CSS v4, lucide icons
- **Database:** Neon Postgres via `@neondatabase/serverless`, Drizzle ORM
- **Auth:** Neon Auth (`@neondatabase/auth`)
- **Hosting:** Vercel, auto-deployed from `main`

## Getting started

Prerequisites: Node.js 22+ and npm.

```bash
git clone https://github.com/IhorBalan/exercise-writer.git
cd exercise-writer
npm install

# Pull the Neon variables from Vercel.
# Sensitive values cannot be pulled, so you may need to copy DATABASE_URL
# from the Neon console into .env.local yourself. See .env.example.
npx vercel link
npx vercel env pull .env.local --environment=production

npm run dev
```

Open http://localhost:3000. `GET /api/health` reports whether the database is reachable.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generate route types and run `tsc` |
| `npm test` | Unit tests (Vitest) |
| `npm run db:generate` | Generate a SQL migration from `src/db/schema.ts` |
| `npm run db:migrate` | Apply migrations (skips when no database URL is set) |

## Deploying

Merging to `main` deploys automatically: Vercel's git integration builds `main` as a Production deployment at https://exercise-writer.vercel.app. During the build Vercel runs the database migrations and upserts the Big Six program data (`src/lib/program-data.ts`), then `next build`.

Other branches and pull requests are skipped by the `ignoreCommand` in `vercel.json`, so only `main` ever builds. All environments share one Neon database, which is why previews are off: an unmerged migration must never touch it.

## CI

`.github/workflows/ci.yml` runs lint, typecheck, tests and build on every pull request and on pushes to `main`.

## Project structure

```
src/
  app/            routes (App Router); api/ holds route handlers
  components/     app components; ui/ holds shadcn/ui components
  db/             Drizzle client and schema
  lib/            shared helpers
scripts/          one-off scripts (migrations, seed)
drizzle/          generated SQL migrations
```
