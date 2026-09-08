import PortalShell from '../../components/PortalShell.jsx';

const links = [
  { to: "", label: "Dashboard", end: true },
  { to: "appointments", label: "Appointments", end: false },
  { to: "invoices", label: "Invoices", end: false },
];

export default function CustomerLayout() {
  return <PortalShell title="Customer Portal" links={links} />;
}
