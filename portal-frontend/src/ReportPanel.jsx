import { useState } from 'react';
import { submitTicket } from './api.js';

const SERVICE_TYPES = [
  'Heating',
  'Cooling',
  'Water Solutions',
  'Air Quality',
  'Generators',
  'Security',
  'Other',
];

const INITIAL_FORM_DATA = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  serviceType: '',
  message: '',
};

function validate(formData) {
  if (!formData.firstName.trim()) return 'First name is required';
  if (!formData.lastName.trim()) return 'Last name is required';
  if (!formData.phone.trim()) return 'Phone is required';
  if (!formData.email.trim()) return 'Email is required';
  if (!/^\S+@\S+\.\S+$/.test(formData.email)) return 'Enter a valid email';
  if (!formData.serviceType) return 'Select what needs attention';
  if (!formData.message.trim()) return 'Describe the issue';
  return null;
}

export default function ReportPanel({ onDone }) {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState(null);

  function updateField(field) {
    return (e) => setFormData({ ...formData, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationError = validate(formData);
    if (validationError) return setError(validationError);

    setSubmitting(true);
    setError(null);
    try {
      const { ticketId: newTicketId } = await submitTicket(formData);
      setTicketId(newTicketId);
      onDone?.(newTicketId);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="panel" id="p-report" role="region">
      <h3>Tell us what happened</h3>
      <form onSubmit={handleSubmit} noValidate>
        <div className="inline">
          <div className="field">
            <label htmlFor="rFirst">First name</label>
            <input id="rFirst" value={formData.firstName} onChange={updateField('firstName')} placeholder="Liam" />
          </div>
          <div className="field">
            <label htmlFor="rLast">Last name</label>
            <input id="rLast" value={formData.lastName} onChange={updateField('lastName')} placeholder="Tremblay" />
          </div>
        </div>
        <div className="inline">
          <div className="field">
            <label htmlFor="rPhone">Phone</label>
            <input id="rPhone" value={formData.phone} onChange={updateField('phone')} placeholder="(416) 555-0123" />
          </div>
          <div className="field">
            <label htmlFor="rEmail">Email</label>
            <input id="rEmail" type="email" value={formData.email} onChange={updateField('email')} placeholder="liam.tremblay@example.ca" />
          </div>
        </div>
        <div className="field">
          <label htmlFor="rType">What needs attention?</label>
          <select id="rType" value={formData.serviceType} onChange={updateField('serviceType')}>
            <option value="">Select…</option>
            {SERVICE_TYPES.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="rNotes">Describe the issue</label>
          <textarea
            id="rNotes"
            value={formData.message}
            onChange={updateField('message')}
            placeholder="When did it start? Any noises, leaks or error codes?"
          />
        </div>
        <button className="submit" type="submit" disabled={submitting}>
          {submitting ? 'Sending…' : 'Send my report'}
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}

      {ticketId && (
        <div className="result show">
          <p style={{ margin: '0 0 6px' }}>
            Thanks, {formData.firstName}. Your reference number is:
          </p>
          <div className="ticket-id">{ticketId}</div>
          <ul className="steps">
            <li className="done">
              <span className="dot">✓</span>
              <span><strong>Report received</strong><span>We've logged your request.</span></span>
            </li>
            <li>
              <span className="dot" />
              <span><strong>Routed to the right team</strong><span>A coordinator will follow up.</span></span>
            </li>
          </ul>
          <p className="hint">Use this reference number under "Track a Concern" to check status anytime.</p>
        </div>
      )}
    </div>
  );
}
