import PortalShell from '../../components/PortalShell.jsx';

const links = [
  { to: "", label: "Dashboard", end: true },
  { to: "jobs/today", label: "Today's Jobs", end: false },
  { to: "tickets", label: "Assigned Tickets", end: false },
  { to: "equipment", label: "Equipment", end: false },
  { to: "history", label: "Service History", end: false },
];

export default function TechnicianLayout() {
  return <PortalShell title="Technician Portal" links={links} />;
}
