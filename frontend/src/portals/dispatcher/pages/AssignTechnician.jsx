import PageHeader from '../../../components/PageHeader.jsx';
import EmptyState from '../../../components/EmptyState.jsx';

export default function AssignTechnician() {
  return (
    <>
      <PageHeader title="Assign Technician" description="Match this ticket to an available technician." />
      <EmptyState label="This view isn't wired up yet - it will populate once the matching backend module is built." />
    </>
  );
}
