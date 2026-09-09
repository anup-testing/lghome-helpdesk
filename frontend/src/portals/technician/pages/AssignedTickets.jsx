import { Link } from 'react-router-dom';
import PageHeader from '../../../components/PageHeader.jsx';
import DataTable from '../../../components/DataTable.jsx';
import { useAuth } from '../../../lib/auth.jsx';
import { useApiList } from '../../../lib/useApiList.js';
import { formatTicketNumber } from '../../../lib/formatTicketNumber.js';
import Badge from '../../../components/ui/Badge.jsx';

const COLUMNS = [
  { key: 'ticketNumber', label: 'Reference', render: (row) => <Link className="ticket-reference" to={`/technician/work-orders/${row.id}`}>{formatTicketNumber(row.ticketNumber)}</Link> },
  { key: 'title', label: 'Ticket' },
  { key: 'customer', label: 'Customer', render: (row) => row.customer?.user?.name ?? '-' },
  { key: 'serviceType', label: 'Service type' },
  { key: 'status', label: 'Status', render: (row) => <Badge type="status" value={row.status} /> },
  { key: 'priority', label: 'Priority', render: (row) => <Badge type="priority" value={row.priority} /> },
  { key: 'createdAt', label: 'Created', render: (row) => new Date(row.createdAt).toLocaleString() },
];

export default function AssignedTickets() {
  const { user } = useAuth();
  const { data, loading, error } = useApiList('/tickets');
  const tickets = user?.role === 'ADMIN' ? data : data?.filter((ticket) => ticket.technician?.userId === user?.id);

  return (
    <>
      <PageHeader title="Assigned Tickets" description="See every ticket you are responsible for and open the work details." />
      <DataTable columns={COLUMNS} rows={tickets} loading={loading} error={error} emptyLabel="No tickets are assigned to you yet." />
    </>
  );
}
