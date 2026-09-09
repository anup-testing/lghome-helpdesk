import PortalShell from '../../components/PortalShell.jsx';

const links = [

  { to: "technicians", label: "Technicians", end: false },
  { to: "customers", label: "Customers", end: false },
  { to: "tickets", label: "Tickets", end: false },
  { to: "settings", label: "Settings", end: false },
  { to: "billing", label: "Billing", end: false },
];

export default function AdminLayout() {
  return <PortalShell title="Admin Portal" links={links} />;
}
