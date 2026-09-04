import { useState } from 'react';
import { lookupStatus, submitFeedback } from './api.js';
import StarRating from './StarRating.jsx';

const SOLVED_STATUSES = ['Resolved', 'Closed'];

function plainTextPreview(html, maxLength = 240) {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}

export default function TrackPanel() {
  const [ticketId, setTicketId] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [notFound, setNotFound] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const id = ticketId.trim();
    if (!id) return setError('Enter your reference number');

    setLoading(true);
    setError(null);
    setNotFound(false);
    setTicket(null);
    try {
      const result = await lookupStatus({ ticketId: id });
      setTicket(result);
    } catch (err) {
      setNotFound(true);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const solved = ticket && SOLVED_STATUSES.includes(ticket.status);

  return (
    <div className="panel" id="p-track" role="region">
      <h3>Look up your request</h3>
      <form className="inline" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="tId">Reference number</label>
          <input
            id="tId"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            placeholder="e.g. 0042"
            autoComplete="off"
          />
        </div>
        <button className="submit" type="submit" disabled={loading}>
          {loading ? 'Checking…' : 'Check status'}
        </button>
      </form>
      <p className="hint">Use the reference number from a report you just sent.</p>

      {notFound && (
        <div className="result">
          <p style={{ margin: 0 }}>
            No request found for <strong>{ticketId}</strong>. Check the reference on your
            confirmation, or call 1-866-438-5442.
          </p>
        </div>
      )}

      {ticket && (
        <div className="result show">
          <div className="ticket-id">{ticket.name}</div>
          <ul className="steps">
            <li className="done">
              <span className="dot">✓</span>
              <span><strong>Issue created</strong><span>{ticket.subject}</span></span>
            </li>
            <li className="done">
              <span className="dot">✓</span>
              <span><strong>LG Team Investigates</strong><span>Status: {ticket.status}</span></span>
            </li>
            <li className={solved ? 'done' : ''}>
              <span className="dot">{solved ? '✓' : ''}</span>
              <span>
                <strong>Issue solved?</strong>
                <span>{solved ? `Yes - ${ticket.status}` : 'No - still in progress'}</span>
              </span>
            </li>
          </ul>

          <div className="activity">
            <p className="hint">
              Team: {ticket.agent_group || 'Not yet assigned to a team'}
            </p>
            {ticket.lastUpdate ? (
              <p className="hint">
                Latest update ({new Date(ticket.lastUpdate.creation).toLocaleString()}
                {ticket.lastUpdate.sender ? ` from ${ticket.lastUpdate.sender}` : ''}):{' '}
                {plainTextPreview(ticket.lastUpdate.content)}
              </p>
            ) : (
              <p className="hint">No updates yet.</p>
            )}
          </div>

          {solved && <FeedbackForm ticket={ticket} onSubmitted={(t) => setTicket(t)} />}
        </div>
      )}
    </div>
  );
}

function FeedbackForm({ ticket, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const alreadySubmitted = ticket.feedback_rating > 0;

  if (alreadySubmitted) {
    return (
      <div className="feedback">
        <p className="hint">
          Thanks for your feedback - you rated this {Math.round(ticket.feedback_rating * 5)}/5.
        </p>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!rating) return setError('Pick a star rating');

    setSubmitting(true);
    setError(null);
    try {
      await submitFeedback(ticket.name, rating, comment);
      onSubmitted({ ...ticket, feedback_rating: rating / 5, feedback: comment });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="feedback" onSubmit={handleSubmit} noValidate>
      <h3>How did we do?</h3>
      <StarRating value={rating} onChange={setRating} />
      <div className="field">
        <label htmlFor="fbComment">Anything you'd like to add? (optional)</label>
        <textarea id="fbComment" value={comment} onChange={(e) => setComment(e.target.value)} />
      </div>

      {error && <p className="error-text">{error}</p>}

      <button className="submit" type="submit" disabled={submitting}>
        {submitting ? 'Sending…' : 'Submit feedback'}
      </button>
    </form>
  );
}
