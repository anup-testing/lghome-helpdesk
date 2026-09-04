# portal-frontend

The customer-facing Customer Care Portal for **LG Home Comfort** — a landing
page with three actions (Report a Concern, Track a Concern, Give Feedback),
each its own real page. React + Vite, no state management library, no CSS
framework — plain CSS matching a supplied brand reference.

Talks only to `portal-backend` (see [`../portal-backend/README.md`](../portal-backend/README.md)).
Has no knowledge of Frappe.

## Setup

```bash
npm install
npm run dev       # http://localhost:5173
npm run build      # production build to dist/
```

No `.env` is required for local dev — `api.js` defaults to
`http://localhost:4000`. Copy `.env.example` to `.env` and set
`VITE_API_BASE_URL` if the backend runs somewhere else.

## Routes / Pages

| Path | Component | Purpose |
|---|---|---|
| `/` | `LandingPage.jsx` | Hero, rating badge, 3 action cards, phone/email contact row |
| `/report` | `ReportPage.jsx` → `ReportPanel.jsx` | Create a new ticket (`POST /tickets`) |
| `/track` | `TrackPage.jsx` → `TrackPanel.jsx` | Look up a ticket by reference number, shows a 3-stage pipeline (Issue created → LG Team Investigates → Issue solved?); if solved, shows an inline feedback form |
| `/feedback` | `FeedbackPage.jsx` → `FeedbackPanel.jsx` | Standalone feedback form (reference number + star rating + comment), independent of the Track flow |

Routing is real client-side routing via `react-router-dom` (`BrowserRouter`,
mounted in `main.jsx`) — every path is bookmarkable and survives a hard
refresh, not just in-page state.

## Component structure

```
src/
├── App.jsx              # <Routes> definitions
├── main.jsx              # ReactDOM root + <BrowserRouter>
├── Header.jsx             # Logo (links home), nav, call button, mobile burger menu — shared by every page
├── LandingPage.jsx         # Home page
├── ReportPage.jsx / ReportPanel.jsx
├── TrackPage.jsx / TrackPanel.jsx
├── FeedbackPage.jsx / FeedbackPanel.jsx
├── StarRating.jsx           # Shared 5-star picker (used by TrackPanel's post-resolution
│                             prompt and the standalone FeedbackPanel)
├── api.js                  # Every fetch() call to portal-backend lives here
├── App.css                 # All component styling
├── index.css                # Font-face declarations, CSS variables (brand palette), resets
└── assets/
    ├── logo.svg              # Real LG Home Comfort logo
    ├── hero-products.png      # Real product lineup photo (landing page hero)
    └── fonts/                # Satoshi variable font (self-hosted, no Google Fonts dependency)
```

## Design system

- **Font:** Satoshi (variable, self-hosted via `@font-face` in `index.css`)
- **Brand color:** `--cyan: #19b0d8`, plus `--lilac` / `--peach` accents and a
  `--cream` background — all defined as CSS custom properties in `index.css`
- **Favicon:** `public/favicon.svg` — outline house icon on a solid brand-color
  background (kept simple/high-contrast for legibility at 16px)

## `api.js` — the backend contract

```js
submitTicket(fields)                    // POST /tickets
lookupStatus({ ticketId })              // POST /status/lookup
escalateTicket(ticketId, reason)        // POST /tickets/:id/escalate
submitFeedback(ticketId, rating, comment) // POST /tickets/:id/feedback
```

`escalateTicket` exists and works but isn't wired into any current page — an
earlier design had an "Escalate" action; it was replaced by "Give Feedback"
per product direction. The backend route is still live if you want to add an
escalation UI back later (e.g. as a 4th action card, or inside `TrackPanel`
for concerns that are taking too long).

## Known placeholders / things to swap before going live

- **Support email** (`support@lghomecomfort.ca`) shown on the landing page is
  a placeholder — only the phone number (1-866-438-5442) is verified from the
  real site.
- **Nav links** ("Services", "Book a Visit", "Financing") in the header are
  decorative (`href="#"`) — this portal doesn't have those pages.
