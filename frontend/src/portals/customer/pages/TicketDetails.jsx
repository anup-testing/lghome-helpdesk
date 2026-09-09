import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../../../components/PageHeader.jsx';
import { apiClient } from '../../../lib/apiClient.js';
import { formatTicketNumber } from '../../../lib/formatTicketNumber.js';

export default function TicketDetails() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      apiClient.get(`/tickets/${encodeURIComponent(id)}`),
      apiClient.get(`/tickets/${encodeURIComponent(id)}/messages`),
    ]).then(([ticketData, messagesData]) => {
      setTicket(ticketData);
      setMessages(messagesData);
    }).catch((err) => setError(err));
  }, [id]);

  if (error) return <p className="error-text">{error.message}</p>;
  if (!ticket) return <p className="hint">Loading ticket...</p>;

  return (
    <>
      <Link className="page-back" to="/customer">&larr; Back to dashboard</Link>
      <PageHeader title={`${formatTicketNumber(ticket.ticketNumber)} ${ticket.title}`} description="Your ticket status and support conversation." />
      <section className="ticket-detail-section">
        <dl className="ticket-facts">
          <div><dt>Status</dt><dd>{ticket.status}</dd></div>
          <div><dt>Priority</dt><dd>{ticket.priority}</dd></div>
          <div><dt>Service type</dt><dd>{ticket.serviceType}</dd></div>
          <div><dt>Created</dt><dd>{new Date(ticket.createdAt).toLocaleString()}</dd></div>
        </dl>
        <div className="ticket-description"><h4>Request</h4><p>{ticket.description}</p></div>
      </section>
      <section className="ticket-detail-section ticket-conversation">
        <h3>Conversation</h3>
        {messages.length === 0 && <p className="hint">No replies yet. We will post updates here.</p>}
        <div className="message-list">
          {messages.map((item) => (
            <article className="ticket-message" key={item.id}>
              <div className="message-meta"><strong>{item.author?.name ?? 'Support'}</strong><span>{new Date(item.createdAt).toLocaleString()}</span></div>
              <p>{item.message}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
