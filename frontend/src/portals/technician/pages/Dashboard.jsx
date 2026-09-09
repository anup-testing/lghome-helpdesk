import { Link } from 'react-router-dom';
import PageHeader from '../../../components/PageHeader.jsx';
import { useAuth } from '../../../lib/auth.jsx';
import { useApiList } from '../../../lib/useApiList.js';
import { formatTicketNumber } from '../../../lib/formatTicketNumber.js';
import Badge from '../../../components/ui/Badge.jsx';
import Card from '../../../components/ui/Card.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const { data, loading, error } = useApiList('/tickets');
  const tickets = user?.role === 'ADMIN' ? data : data?.filter((ticket) => ticket.technician?.userId === user?.id);
  const openTickets = tickets?.filter((ticket) => !['COMPLETED', 'CLOSED', 'CANCELLED'].includes(ticket.status)) ?? [];
  const urgentTickets = openTickets.filter((ticket) => ['HIGH', 'URGENT'].includes(ticket.priority));

  return (
    <>
      <PageHeader title="Dashboard" description="Your assigned tickets, current priorities, and work in progress." />
      {loading && <p className="hint">Loading tickets...</p>}
      {error && <p className="error-text">{error.message}</p>}
      {tickets && <>
        <div className="stat-grid">
          <Card className="stat-card"><span>Open tickets</span><strong>{openTickets.length}</strong></Card>
          <Card className="stat-card"><span>High priority</span><strong>{urgentTickets.length}</strong></Card>
          <Card className="stat-card"><span>Completed</span><strong>{tickets.filter((ticket) => ticket.status === 'COMPLETED').length}</strong></Card>
        </div>
        <div className="dashboard-section-heading"><h3>Current workload</h3><Link to="tickets">View all tickets</Link></div>
        {openTickets.length === 0 ? <p className="hint">No active tickets are assigned to you.</p> : <div className="ticket-workload-list">
          {openTickets.slice(0, 5).map((ticket) => <Link className="ticket-workload-item" to={`/technician/work-orders/${ticket.id}`} key={ticket.id}>
            <span><strong>{formatTicketNumber(ticket.ticketNumber)} · {ticket.title}</strong><small>{ticket.customer?.user?.name ?? 'Customer'} · {ticket.serviceType}</small></span>
            <Badge type="status" value={ticket.status} />
          </Link>)}
        </div>}
      </>}
    </>
  );
}
