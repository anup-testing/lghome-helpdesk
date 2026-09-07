import { useEffect, useState } from 'react';
import PageHeader from '../../../components/PageHeader.jsx';
import EmptyState from '../../../components/EmptyState.jsx';
import { useApiList } from '../../../lib/useApiList.js';
import { apiClient } from '../../../lib/apiClient.js';
import { formatTicketNumber } from '../../../lib/formatTicketNumber.js';

export default function Tickets() {
  const { data: technicians } = useApiList('/technicians');
  const [tickets, setTickets] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    apiClient
      .get('/tickets')
      .then((data) => {
        if (!cancelled) {
          setTickets(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function assignTechnician(ticketId, technicianId) {
    setSavingId(ticketId);
    setError(null);
    try {
      const updated = await apiClient.put(`/tickets/${ticketId}`, { technicianId: technicianId || null });
      setTickets((prev) => prev.map((t) => (t.id === ticketId ? updated : t)));
    } catch (err) {
      setError(err);
    } finally {
      setSavingId(null);
    }
  }

  return (
    <>
      <PageHeader title="Tickets" description="Track every ticket and assign a technician." />

      {loading && <p className="hint">Loading...</p>}
      {error && <p className="error-text">{error.message}</p>}

      {tickets && tickets.length === 0 && <EmptyState label="No tickets yet." />}

      {tickets && tickets.length > 0 && (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Title</th>
                <th>Customer</th>
                <th>Service Type</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Technician</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{formatTicketNumber(ticket.ticketNumber)}</td>
                  <td>{ticket.title}</td>
                  <td>{ticket.customer?.user?.name ?? '-'}</td>
                  <td>{ticket.serviceType}</td>
                  <td>{ticket.status}</td>
                  <td>{ticket.priority}</td>
                  <td>
                    <select
                      value={ticket.technicianId ?? ''}
                      disabled={savingId === ticket.id}
                      onChange={(e) => assignTechnician(ticket.id, e.target.value)}
                    >
                      <option value="">Unassigned</option>
                      {(technicians ?? []).map((tech) => (
                        <option key={tech.id} value={tech.id}>
                          {tech.user?.name ?? tech.id}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{new Date(ticket.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
