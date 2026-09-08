import PageHeader from '../../../components/PageHeader.jsx';
import EmptyState from '../../../components/EmptyState.jsx';

export default function Appointments() {
  return (
    <>
      <PageHeader title="Appointments" description="Scheduled technician visits for your properties." />
      <EmptyState label="This view isn't wired up yet - it will populate once the matching backend module is built." />
    </>
  );
}
