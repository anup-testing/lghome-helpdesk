import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../../../components/PageHeader.jsx';
import { apiClient } from '../../../lib/apiClient.js';
import { formatTicketNumber } from '../../../lib/formatTicketNumber.js';
import Button from '../../../components/ui/Button.jsx';

const STATUS_OPTIONS = ['OPEN', 'IN_PROGRESS', 'SCHEDULED', 'COMPLETED', 'CLOSED', 'CANCELLED'];

export default function WorkOrder() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [status, setStatus] = useState('OPEN');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    apiClient.get(`/tickets/${encodeURIComponent(id)}`).then((data) => {
      setTicket(data);
      setStatus(data.status);
      setLoading(false);
    }).catch((err) => {
      setError(err);
      setLoading(false);
    });
  }, [id]);

  async function saveStatus(event) {
    event.preventDefault();
    setSaving(true);
    setNotice(null);
    try {
      const updated = await apiClient.put(`/tickets/${encodeURIComponent(id)}`, { status });
      setTicket(updated);
      setNotice('Ticket status updated.');
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="hint">Loading ticket...</p>;
  if (error) return <p className="error-text">{error.message}</p>;
  if (!ticket) return null;

  return (
    <>
      <Link className="page-back" to="/technician/tickets">&larr; Back to assigned tickets</Link>
      <PageHeader title={`${formatTicketNumber(ticket.ticketNumber)} ${ticket.title}`} description="Review the ticket and keep its work status up to date." />
      <div className="ticket-detail-grid">
        <section className="ticket-detail-section">
          <h3>Service request</h3>
          <dl className="ticket-facts">
            <div><dt>Customer</dt><dd>{ticket.customer?.user?.name ?? '-'}</dd></div>
            <div><dt>Phone</dt><dd>{ticket.customer?.user?.phone ?? '-'}</dd></div>
            <div><dt>Service type</dt><dd>{ticket.serviceType}</dd></div>
            <div><dt>Priority</dt><dd>{ticket.priority}</dd></div>
            <div><dt>Address</dt><dd>{ticket.property ? `${ticket.property.address}, ${ticket.property.city}` : '-'}</dd></div>
            <div><dt>Created</dt><dd>{new Date(ticket.createdAt).toLocaleString()}</dd></div>
          </dl>
          <div className="ticket-description"><h4>Issue</h4><p>{ticket.description}</p></div>
        </section>
        <form className="ticket-detail-section ticket-workflow" onSubmit={saveStatus}>
          <h3>Work status</h3>
          <div className="field"><label htmlFor="work-status">Update status</label><select id="work-status" value={status} onChange={(event) => setStatus(event.target.value)}>{STATUS_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}</select></div>
          <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save status'}</Button>
          {notice && <p className="success-text">{notice}</p>}
          {error && <p className="error-text">{error.message}</p>}
        </form>
      </div>
    </>
  );
}
