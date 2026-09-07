import PageHeader from '../../../components/PageHeader.jsx';
import DataTable from '../../../components/DataTable.jsx';
import { useApiList } from '../../../lib/useApiList.js';

const COLUMNS = [
  { key: 'ticket', label: 'Ticket', render: (row) => row.ticket?.title ?? '-' },
  { key: 'technician', label: 'Technician', render: (row) => row.technician?.user?.name ?? '-' },
  { key: 'scheduledStart', label: 'Start', render: (row) => new Date(row.scheduledStart).toLocaleString() },
  { key: 'scheduledEnd', label: 'End', render: (row) => new Date(row.scheduledEnd).toLocaleString() },
  { key: 'status', label: 'Status' },
];

export default function Scheduling() {
  const { data, loading, error } = useApiList('/appointments');

  return (
    <>
      <PageHeader title="Scheduling" description="Every scheduled appointment across the team." />
      <DataTable columns={COLUMNS} rows={data} loading={loading} error={error} emptyLabel="No appointments scheduled yet." />
    </>
  );
}
