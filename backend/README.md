# backend

Custom Node/Express + PostgreSQL (Prisma) backend for the LG Home Comfort ops
platform - replaces the Frappe-based `portal-backend`. Lives alongside the
old `portal-backend`/`portal-frontend`/Frappe stack until this one is proven.

## Modules

Each domain under `src/<module>/` follows the same shape:
`<module>.routes.js` -> `<module>.controller.js` -> `<module>.service.js`.
Every service function currently throws a 501 "Not implemented" - this is a
scaffold, business logic still needs to be filled in module by module.

`auth/` is the one non-CRUD module (register/login/refresh/logout/me).

## Getting started

```bash
npm install
cp .env.local.example .env.local
docker compose up -d          # postgres on :5432
npm run db:local              # apply migrations to the local lgcare database
npm run dev                    # http://localhost:4100
```

Copy `.env.local.example` to `.env.local` before starting the backend. `npm run
dev` automatically uses that local configuration when it exists, so it takes
precedence over any Supabase URL in `.env`. Use `npm run db:local` whenever you
need to apply the checked-in Prisma migrations to your local database.
