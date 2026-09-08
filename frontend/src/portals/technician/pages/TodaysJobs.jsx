import PageHeader from '../../../components/PageHeader.jsx';
import EmptyState from '../../../components/EmptyState.jsx';

export default function TodaysJobs() {
  return (
    <>
      <PageHeader title="Today's Jobs" description="Appointments scheduled for you today, in route order." />
      <EmptyState label="This view isn't wired up yet - it will populate once the matching backend module is built." />
    </>
  );
}
