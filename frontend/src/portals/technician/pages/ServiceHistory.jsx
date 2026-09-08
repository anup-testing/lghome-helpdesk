import PageHeader from '../../../components/PageHeader.jsx';
import EmptyState from '../../../components/EmptyState.jsx';

export default function ServiceHistory() {
  return (
    <>
      <PageHeader title="Service History" description="Your completed jobs and past service records." />
      <EmptyState label="This view isn't wired up yet - it will populate once the matching backend module is built." />
    </>
  );
}
