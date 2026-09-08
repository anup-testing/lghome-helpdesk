import PageHeader from '../../../components/PageHeader.jsx';
import EmptyState from '../../../components/EmptyState.jsx';

export default function TicketDetails() {
  return (
    <>
      <PageHeader title="Ticket Details" description="Full history, technician notes, and status for a single ticket." />
      <EmptyState label="This view isn't wired up yet - it will populate once the matching backend module is built." />
    </>
  );
}
