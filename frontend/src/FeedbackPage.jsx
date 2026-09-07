import { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicHeader from './components/PublicHeader.jsx';
import StarRating from './components/StarRating.jsx';
import { apiClient } from './lib/apiClient.js';

export default function FeedbackPage() {
  const [ticketId, setTicketId] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!ticketId.trim()) return setError('Enter your reference number');
    if (!rating) return setError('Pick a star rating');

    setSubmitting(true);
    setError(null);
    try {
      await apiClient.put(`/tickets/${encodeURIComponent(ticketId.trim())}`, {
        feedbackRating: rating,
        feedbackComment: comment,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PublicHeader />

      <main className="hero">
        <div className="wrap page-narrow">
          <Link to="/" className="page-back">
            &larr; Back to Portal
          </Link>
          <h1 className="page-title">Give Feedback</h1>
          <p className="lede page-lede">Tell us how we did - share feedback about LG Home Comfort services.</p>

          {submitted ? (
            <div className="panel">
              <h3>Thanks for your feedback</h3>
              <p className="hint">We appreciate you taking the time to help us improve.</p>
            </div>
          ) : (
            <form className="panel" onSubmit={handleSubmit} noValidate>
              <h3>How are we doing?</h3>
              <div className="field">
                <label htmlFor="fbTicketId">Reference number</label>
                <input
                  id="fbTicketId"
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  placeholder="e.g. 0042"
                  autoComplete="off"
                />
              </div>

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
          )}
        </div>
      </main>
    </>
  );
}
