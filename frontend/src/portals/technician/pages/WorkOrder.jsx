import PageHeader from '../../../components/PageHeader.jsx';
import EmptyState from '../../../components/EmptyState.jsx';

export default function WorkOrder() {
  return (
    <>
      <PageHeader title="Work Order" description="Job details, parts used, and completion notes." />
      <EmptyState label="This view isn't wired up yet - it will populate once the matching backend module is built." />
    </>
  );
}
