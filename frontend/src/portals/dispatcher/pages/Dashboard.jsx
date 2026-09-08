import PageHeader from '../../../components/PageHeader.jsx';
import EmptyState from '../../../components/EmptyState.jsx';

export default function Dashboard() {
  return (
    <>
      <PageHeader title="Dashboard" description="Unassigned tickets, technician availability, and today schedule." />
      <EmptyState label="This view isn't wired up yet - it will populate once the matching backend module is built." />
    </>
  );
}
