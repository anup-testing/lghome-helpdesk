import PageHeader from '../../../components/PageHeader.jsx';
import EmptyState from '../../../components/EmptyState.jsx';

export default function Settings() {
  return (
    <>
      <PageHeader title="Settings" description="Platform-wide configuration." />
      <EmptyState label="This view isn't wired up yet - it will populate once the matching backend module is built." />
    </>
  );
}
