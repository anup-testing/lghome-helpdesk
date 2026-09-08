import PageHeader from '../../../components/PageHeader.jsx';
import EmptyState from '../../../components/EmptyState.jsx';

export default function Dashboard() {
  return (
    <>
      <PageHeader title="Dashboard" description="Overview of your open tickets, upcoming appointments, and recent invoices." />
      <EmptyState label="This view isn't wired up yet - it will populate once the matching backend module is built." />
    </>
  );
}
