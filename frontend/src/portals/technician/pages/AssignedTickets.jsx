import PageHeader from '../../../components/PageHeader.jsx';
import EmptyState from '../../../components/EmptyState.jsx';

export default function AssignedTickets() {
  return (
    <>
      <PageHeader title="Assigned Tickets" description="All tickets currently assigned to you." />
      <EmptyState label="This view isn't wired up yet - it will populate once the matching backend module is built." />
    </>
  );
}
