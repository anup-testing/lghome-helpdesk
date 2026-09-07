import PageHeader from '../../../components/PageHeader.jsx';
import EmptyState from '../../../components/EmptyState.jsx';

export default function Dashboard() {
  return (
    <>
      <PageHeader title="Dashboard" description="Your day at a glance: jobs, hours, and open work orders." />
      <EmptyState label="This view isn't wired up yet - it will populate once the matching backend module is built." />
    </>
  );
}
