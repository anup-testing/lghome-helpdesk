# portal-backend

A thin, stateless Express API sitting between `portal-frontend` and Frappe.
It exists so the frontend never needs to know Frappe's API shape, doctype
names, or hold Frappe credentials in the browser.

`src/services/frappe.js` is the **only** file that talks to Frappe. Every
route handler goes through it — nothing else in this project makes a Frappe
API call directly.

See the [root README](../README.md) for how Frappe itself is set up (Docker,
custom fields, API credentials).

## Setup

```bash
cp .env.example .env   # fill in FRAPPE_API_KEY / FRAPPE_API_SECRET
npm install
npm run dev             # node --watch, http://localhost:4000
# or: npm start
```

## Environment variables

| Variable | Description |
|---|---|
| `FRAPPE_URL` | Base URL of the Frappe site (`http://localhost:8000` locally) |
| `FRAPPE_API_KEY` | From Administrator (or a dedicated API user) → API Access |
| `FRAPPE_API_SECRET` | Same as above — shown only once when generated |
| `PORT` | Port this server listens on (default `4000`) |

The server logs a warning on boot for any of `FRAPPE_URL` / `FRAPPE_API_KEY` /
`FRAPPE_API_SECRET` that aren't set — it still starts, but every Frappe-backed
route will fail with a `502` until they're filled in.

## Routes

| Method | Path | Body | Response |
|---|---|---|---|
| `GET` | `/health` | — | `{ ok: true }` |
| `POST` | `/tickets` | `firstName, lastName, phone, email, serviceType, message` (required), `city, invoiceNo` (optional) | `201 { ticketId }` |
| `POST` | `/tickets/:id/escalate` | `{ reason }` | `{ ticketId, priority }` — sets priority to `Urgent` |
| `POST` | `/tickets/:id/feedback` | `{ rating: 1-5, comment? }` | `{ ticketId }` — writes `feedback_rating` (as a 0–1 fraction) and `feedback_extra` |
| `POST` | `/status/lookup` | `{ ticketId }` **or** `{ mobile, invoiceNo }` | Full ticket doc (ticketId lookup) or `{ name, status, subject, modified, feedback_rating, feedback_extra }` (mobile+invoice lookup) |

All error responses are `{ error: string }`. Frappe-side failures (bad
credentials, ticket not found on write, validation errors) surface as `502`
with Frappe's own error message passed through — useful for debugging but
you may want to sanitize this before a public-facing deployment.

## File structure

```
src/
├── server.js              # Express app, route mounting, env checks
├── routes/
│   ├── tickets.js          # POST /tickets, /:id/escalate, /:id/feedback
│   └── status.js           # POST /status/lookup
└── services/
    └── frappe.js            # All Frappe REST calls live here
```

## Notes

- No database, no sessions, no auth on the portal-backend side — it's a pure
  pass-through. Anyone who can reach it can create tickets. Fine for an
  internal/dev deployment; add rate-limiting or a CAPTCHA before putting this
  on the open internet.
- CORS is wide open (`app.use(cors())`) since the frontend can be served from
  any origin during development. Lock this down to the real frontend origin
  in production.
- `HD Ticket` names are plain incrementing numbers by default (`0001`, `0002`,
  ...) — that's what customers see as their "reference number" in the
  frontend, not a custom ticket ID scheme.
