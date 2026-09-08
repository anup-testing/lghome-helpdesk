# frontend

Custom React (Vite) app for the LG Home Comfort ops platform - replaces the
Frappe-facing `portal-frontend`. Four portals, one router, one codebase:

- `/customer`   - Dashboard, Create Ticket, My Tickets, Ticket Details, Appointments, Invoices
- `/technician` - Dashboard, Today's Jobs, Assigned Tickets, Work Order, Equipment, Service History
- `/dispatcher` - Dashboard, All Tickets, Assign Technician, Scheduling, Customers
- `/admin`      - Users, Technicians, Customers, Reports, Settings, Billing

All pages are placeholder stubs for now - wire them up to `backend/` module
by module via `src/lib/apiClient.js`.

## Getting started

```bash
cp .env.example .env
npm install
npm run dev   # http://localhost:5174
```
