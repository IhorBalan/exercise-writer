# Exercise Writer

A mobile-first tracker for [Convict Conditioning](https://en.wikipedia.org/wiki/Convict_Conditioning) training: log your Big Six sessions (movement, step, level, reps per set) and follow your progress on a dashboard.

Live app: https://exercise-writer.vercel.app

## Tech stack

- **Framework:** Next.js 16 (App Router, TypeScript), frontend and backend in one app
- **UI:** shadcn/ui (new-york style) + Tailwind CSS v4, lucide icons
- **Database:** Neon Postgres via `@neondatabase/serverless`, Drizzle ORM
- **Auth:** Neon Auth (`@neondatabase/auth`)
- **Hosting:** Vercel, Preview environment only, deployed by git tag

## Getting started

Prerequisites: Node.js 22+ and npm.

```bash
git clone https://github.com/IhorBalan/exercise-writer.git
cd exercise-writer
npm install

# Pull the Neon variables from Vercel (Preview environment).
# Sensitive values cannot be pulled, so you may need to copy DATABASE_URL
# from the Neon console into .env.local yourself. See .env.example.
npx vercel link
npx vercel env pull .env.local --environment=preview

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

## Releasing

Vercel's git integration is turned off in `vercel.json`, so pushes and pull requests never deploy. To release:

```bash
git checkout main && git pull
git tag v0.1.0
git push origin v0.1.0
```

The `Release` GitHub Action deploys the tag to Vercel's Preview environment (Vercel runs the database migrations and then `next build`) and points https://exercise-writer.vercel.app at the new deployment.

The action needs one repository secret, `VERCEL_TOKEN` (Settings > Secrets and variables > Actions). Create the token at https://vercel.com/account/tokens.

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
