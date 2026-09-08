import { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicHeader from './components/PublicHeader.jsx';
import StarRating from './components/StarRating.jsx';
import { apiClient } from './lib/apiClient.js';
import { formatTicketNumber } from './lib/formatTicketNumber.js';

const SOLVED_STATUSES = ['COMPLETED', 'CLOSED'];

export default function TrackPage() {
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
      const result = await apiClient.get(`/tickets/${encodeURIComponent(id)}`);
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
    <>
      <PublicHeader />

      <main className="hero">
        <div className="wrap page-narrow">
          <Link to="/" className="page-back">
            &larr; Back to Portal
          </Link>
          <h1 className="page-title">Track a Concern</h1>
          <p className="lede page-lede">Check the live status of your open request.</p>

          <div className="panel">
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
                {loading ? 'Checking...' : 'Check status'}
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
                <div className="ticket-id">{formatTicketNumber(ticket.ticketNumber)}</div>
                <ul className="steps">
                  <li className="done">
                    <span className="dot">✓</span>
                    <span>
                      <strong>Issue created</strong>
                      <span>{ticket.title}</span>
                    </span>
                  </li>
                  <li className="done">
                    <span className="dot">✓</span>
                    <span>
                      <strong>LG Team Investigates</strong>
                      <span>Status: {ticket.status}</span>
                    </span>
                  </li>
                  <li className={solved ? 'done' : ''}>
                    <span className="dot">{solved ? '✓' : ''}</span>
                    <span>
                      <strong>Issue solved?</strong>
                      <span>{solved ? `Yes - ${ticket.status}` : 'No - still in progress'}</span>
                    </span>
                  </li>
                </ul>

                {solved && <FeedbackForm ticket={ticket} onSubmitted={setTicket} />}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

function FeedbackForm({ ticket, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const alreadySubmitted = Boolean(ticket.feedbackRating);

  if (alreadySubmitted) {
    return (
      <div className="feedback">
        <p className="hint">Thanks for your feedback - you rated this {ticket.feedbackRating}/5.</p>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!rating) return setError('Pick a star rating');

    setSubmitting(true);
    setError(null);
    try {
      const updated = await apiClient.put(`/tickets/${encodeURIComponent(ticket.id)}`, {
        feedbackRating: rating,
        feedbackComment: comment,
      });
      onSubmitted(updated);
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
        {submitting ? 'Sending...' : 'Submit feedback'}
      </button>
    </form>
  );
}
