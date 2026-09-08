import PageHeader from '../../../components/PageHeader.jsx';
import DataTable from '../../../components/DataTable.jsx';
import { useApiList } from '../../../lib/useApiList.js';
import { formatTicketNumber } from '../../../lib/formatTicketNumber.js';

const COLUMNS = [
  { key: 'ticketNumber', label: 'Reference', render: (row) => formatTicketNumber(row.ticketNumber) },
  { key: 'title', label: 'Title' },
  { key: 'customer', label: 'Customer', render: (row) => row.customer?.user?.name ?? '-' },
  { key: 'serviceType', label: 'Service Type' },
  { key: 'status', label: 'Status' },
  { key: 'priority', label: 'Priority' },
  { key: 'createdAt', label: 'Created', render: (row) => new Date(row.createdAt).toLocaleString() },
];

export default function AllTickets() {
  const { data, loading, error } = useApiList('/tickets');

  return (
    <>
      <PageHeader title="All Tickets" description="Every open ticket across all customers." />
      <DataTable columns={COLUMNS} rows={data} loading={loading} error={error} emptyLabel="No tickets yet." />
    </>
  );
}
