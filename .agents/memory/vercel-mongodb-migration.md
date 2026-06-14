---
name: Vercel + MongoDB Migration
description: How the c7-store project was restructured for Vercel deployment with MongoDB Atlas.
---

# Vercel + MongoDB Migration

## The Rule
All API endpoints live in a single file `artifacts/c7-store/api/index.ts` (Vercel serverless function). The api-server in `artifacts/api-server/` is the local dev server — both use the same MongoDB Atlas instance via `MONGODB_URI`.

**Why:** Vercel serverless functions require a single-file export per route. The monorepo's `@workspace/db` (Drizzle/PostgreSQL) was replaced with the MongoDB native driver everywhere.

## How to Apply
- Local dev: `artifacts/api-server/src/lib/mongodb.ts` handles connection + seeding; route files import from it.
- Vercel prod: `artifacts/c7-store/api/index.ts` is the single self-contained Express handler; `vercel.json` rewrites `/api/:path*` → `/api/index`.
- MONGODB_URI is stored as a Replit Secret (shared environment). MongoDB db name: `c7store`.
- Seed script: `artifacts/c7-store/scripts/seed.ts` — run with `pnpm run seed` from c7-store. Drops all collections and re-inserts 7 categories, 22 products with `/products/*.jpg|png` image URLs, 8 real CDO locations, 2 jobs.
- Product images live in `artifacts/c7-store/public/products/` and are served at `/products/<filename>` by both Vite dev server and Vercel static output.
- Auto-seeding: `seedIfEmpty()` inserts categories, products, locations, jobs on first connect (checks `categories` collection count).
- Auto-increment IDs: `nextId(db, name)` uses a `counters` collection with `$inc`.
- Vercel project root directory should be set to `artifacts/c7-store` in Vercel dashboard.
- `vercel.json` buildCommand: `cd ../.. && pnpm --filter @workspace/c7-store run build`, outputDirectory: `dist/public`.
- `vite.config.ts` was updated to make PORT and BASE_PATH optional (fallback to 5173 and `/`) so Vercel builds don't crash.
