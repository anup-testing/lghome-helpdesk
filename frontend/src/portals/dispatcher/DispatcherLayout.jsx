import PortalShell from '../../components/PortalShell.jsx';

const links = [
  { to: "", label: "Dashboard", end: true },
  { to: "tickets", label: "All Tickets", end: false },
  { to: "scheduling", label: "Scheduling", end: false },
  { to: "customers", label: "Customers", end: false },
];

export default function DispatcherLayout() {
  return <PortalShell title="Dispatcher Portal" links={links} />;
}
