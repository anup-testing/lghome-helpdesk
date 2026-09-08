# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository overview

This repo is a customer-care / field-service platform for **LG Home Comfort** (an HVAC/home-services company). It currently contains **two independent, parallel stacks** for the same domain — a legacy Frappe-backed one and a newer custom one that is replacing it. They do not share code, a database, or a deploy pipeline; treat them as separate projects that happen to live in one repo.

| | Legacy stack | New stack |
|---|---|---|
| Frontend | `portal-frontend/` (customer-facing only) | `frontend/` ("Ops Platform" — customer, technician, dispatcher, admin portals) |
| Backend | `portal-backend/` (thin Frappe proxy) | `backend/` (real REST API + Postgres) |
| Data store | Frappe Helpdesk (`HD Ticket` doctype) | Postgres via Prisma (hosted on Supabase) |
| Auth | none (fully public, ticket-number based) | JWT (email/password) |

`backend/README.md` states its intent explicitly: it "replaces the Frappe-based `portal-backend`" and lives alongside the old stack "until this one is proven." When making changes, confirm which stack a request is actually about — `frontend`/`backend` vs `portal-frontend`/`portal-backend` — since they're easy to conflate by name.

## Legacy stack: portal-frontend / portal-backend / Frappe

```
Browser → portal-frontend (Vite/React, :5173) → portal-backend (Express, :4000) → Frappe Helpdesk (Docker, :8000)
```

- Frappe is the system of record — every ticket, status, and feedback rating lives on the `HD Ticket` doctype. `portal-backend` is a stateless proxy (`portal-backend/src/services/frappe.js`) that translates plain REST calls into token-authenticated Frappe REST API calls (`Authorization: token <key>:<secret>`); it stores nothing itself.
- `portal-backend/src/routes/{tickets,status}.js` are the only two route files — ticket creation, escalation, feedback, and status lookup (by ticket ID or by mobile+invoice number pair).
- Ticket creation depends on custom fields that must already exist on `HD Ticket` in Frappe (`custom_mobile`, `custom_city`, `custom_invoice_no`, `custom_service_type`, `custom_escalation_reason`) — see README for how to add them via the Frappe UI. A stray trailing space in a custom field's Label silently produces a broken fieldname.
- Feedback writes to Frappe's built-in `feedback_rating` (stored as a 0–1 fraction, so `rating / 5`) and `feedback_extra` fields — never the `feedback` field, which is a Link restricted to canned phrases.
- Running locally: `docker compose up -d` at the repo root starts Frappe (mariadb + redis + frappe container; `init.sh` bootstraps the bench/site on first boot). Then `portal-backend`: `cp .env.example .env` (fill in `FRAPPE_API_KEY`/`FRAPPE_API_SECRET` generated from the Frappe Administrator user), `npm install`, `npm run dev`. Then `portal-frontend`: `npm install`, `npm run dev`.
- Local Frappe credentials: site `helpdesk.localhost`, `Administrator`/`admin`, MariaDB root password `123`. Helpdesk UI at `:8000/helpdesk`, desk at `:8000/app`.

## New stack: backend / frontend

```
Browser → frontend (Vite/React, "Ops Platform") → backend (Express + Prisma, :4100) → Postgres (Supabase-hosted)
```

- `backend` is a scaffold: every domain module under `src/<module>/` follows `<module>.routes.js → <module>.controller.js → <module>.service.js`, mounted under `/api/<module>` in `src/app.js`. Most service functions currently throw 501 "Not implemented" — business logic is filled in module by module. `auth/` (register/login/refresh/logout/me) is the one fully-implemented, non-CRUD module.
- Auth: `POST /api/auth/register` and `/login` issue a JWT (`jsonwebtoken`, 2h TTL, `sub`/`role`/`email` claims) signed with `JWT_SECRET`. `src/middleware/auth.js#requireAuth` verifies the `Authorization: Bearer <token>` header and sets `req.user`; `src/middleware/roleGuard.js#requireRole(...roles)` gates by `req.user.role`. Passwords are hashed with `bcryptjs`.
- Domain model (`prisma/schema.prisma`) centers on `Ticket`, linked to `Customer` (→ `User`), optional `Property`/`Equipment`, and an assigned `Technician` (→ `User`). Downstream of a ticket: `Appointment`, `WorkOrder` (with `WorkOrderPart` → `Part` inventory), `Invoice` → `Payment`. `Role` enum (`CUSTOMER`/`TECHNICIAN`/`DISPATCHER`/`ADMIN`) drives both the Prisma relations and the frontend's route protection. `File` stores only upload metadata (filename/url/mimeType) — actual bytes are expected to live in external storage, not on the backend's disk.
- `frontend` mirrors the `Role` enum with four portal route trees (`/customer`, `/technician`, `/dispatcher`, `/admin`), each wrapped in `RequireAuth roles={[...]}` (`src/components/RequireAuth.jsx`) and each portal's pages living under `src/portals/<role>/pages/`. `/staff` is the portal-picker landing page for internal roles; `/login` is shared by all roles and redirects post-login based on `user.role` (`PORTAL_HOME` map in `src/lib/auth.jsx`).
- `src/lib/auth.jsx#AuthProvider` stores the JWT + user in `localStorage` (keys `lgcare_token`/`lgcare_user`); `src/lib/apiClient.js` reads the same `localStorage` key directly (not via React context, since it's a plain module) and attaches `Authorization: Bearer <token>` to every request automatically.
- Deployment: `backend` deploys to Render via `backend/render.yaml` (Blueprint — `buildCommand` runs `prisma generate && prisma migrate deploy` on every deploy, so schema changes ship automatically; health check at `GET /health`). The Postgres database is hosted on Supabase — `DATABASE_URL` is the pooled/pgbouncer connection (port 6543, used at runtime) and `DIRECT_URL` is the direct connection (port 5432, required by Prisma for migrations since pgbouncer's transaction mode doesn't support them). `frontend` deploys to Vercel; `frontend/vercel.json` adds a catch-all SPA rewrite to `index.html` — without it, Vercel 404s on any hard-refreshed client-side route (e.g. `/admin`) since `BrowserRouter` routing only exists client-side. `VITE_API_URL` (Vite build-time env var) points the deployed frontend at the deployed backend's `/api` base.

## Commands

Each subproject is independent — there is no root-level build/lint/test orchestration. Run commands from inside the relevant directory. **No test runner is configured anywhere in this repo.**

**`backend/`** (Node/Express + Prisma):
```bash
npm install
npx prisma migrate dev --name <name>   # create + apply a migration locally
npx prisma migrate deploy              # apply existing migrations without prompting (use against shared/remote DBs)
npx prisma generate                    # regenerate the Prisma client after schema.prisma changes
npx prisma studio                      # GUI browser for the connected database
npm run dev                            # node --watch src/server.js, http://localhost:4100
npm start                              # node src/server.js (no watch)
```

**`frontend/`** and **`portal-frontend/`** (Vite + React, identical scripts):
```bash
npm install
npm run dev       # vite dev server
npm run build     # vite build
npm run lint       # oxlint
npm run preview   # serve the production build locally
```

**`portal-backend/`** (Node/Express, no Prisma):
```bash
npm install
npm run dev    # node --watch src/server.js, http://localhost:4000
npm start
```

**Frappe** (root-level, only needed for the legacy stack):
```bash
docker compose up -d              # first boot: runs init.sh (bench init, install apps, create site)
docker compose start               # restart after a stop, without re-running init
docker compose logs -f frappe      # watch bench startup
```

Each subproject's real config lives in its own `.env` (gitignored) — copy from that directory's `.env.example` before running it.
