import { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicHeader from './components/PublicHeader.jsx';
import { apiClient } from './lib/apiClient.js';
import { formatTicketNumber } from './lib/formatTicketNumber.js';

const SERVICE_TYPES = ['Heating', 'Cooling', 'Water Solutions', 'Air Quality', 'Generators', 'Security', 'Other'];
const STEPS = ['Basic details', 'Product', 'Address', 'Issue and photo'];
const MAX_IMAGE_SIZE = 20 * 1024;

const INITIAL_FORM = {
  firstName: '', lastName: '', phone: '', email: '', invoiceNumber: '', purchaseDate: '', address: '', city: '', province: '', postalCode: '',
  serviceType: '', productDetails: '', message: '',
};

function validate(form, step) {
  if (step === 1) {
    if (!form.firstName.trim()) return 'First name is required';
    if (!form.lastName.trim()) return 'Last name is required';
    if (!form.phone.trim()) return 'Phone is required';
    if (!form.email.trim()) return 'Email is required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Enter a valid email';
    if (!form.invoiceNumber.trim()) return 'Invoice number is required';
    if (!form.purchaseDate) return 'Purchase date is required';
  }
  if (step === 2 && !form.serviceType) return 'Select what needs attention';
  if (step === 3) {
    if (!form.address.trim()) return 'Address is required';
    if (!form.city.trim()) return 'City is required';
  }
  if (step === 4 && !form.message.trim()) return 'Describe the issue';
  return null;
}

export default function ReportPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState(null);
  const [attachment, setAttachment] = useState(null);
  const [fileError, setFileError] = useState(null);

  function updateField(field) {
    return (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  }

  function chooseImage(file) {
    setFileError(null);
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setAttachment(null);
      setFileError('Please choose an image file.');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setAttachment(null);
      setFileError('Image must be 20 KB or smaller.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAttachment({ filename: file.name, mimeType: file.type, url: reader.result });
    reader.onerror = () => setFileError('Unable to read this image.');
    reader.readAsDataURL(file);
  }

  function handleDrop(event) {
    event.preventDefault();
    chooseImage(event.dataTransfer.files?.[0]);
  }

  function handleNext() {
    const validationError = validate(form, step);
    if (validationError) return setError(validationError);
    setError(null);
    setStep((current) => current + 1);
  }

  function handleBack() {
    setError(null);
    setStep((current) => current - 1);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationError = validate(form, 4);
    if (validationError) return setError(validationError);
    setSubmitting(true);
    setError(null);
    try {
      const purchaseContext = [
        `Invoice number: ${form.invoiceNumber.trim()}`,
        `Purchase date: ${form.purchaseDate}`,
      ].join('\n');
      const productContext = form.productDetails.trim() ? `Product details: ${form.productDetails.trim()}` : '';
      const ticket = await apiClient.post('/tickets', {
        ...form,
        message: [purchaseContext, productContext, form.message.trim()].filter(Boolean).join('\n\n'),
        attachment,
      });
      setTicketId(formatTicketNumber(ticket.ticketNumber));
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
          <Link to="/" className="page-back">&larr; Back to Portal</Link>
          <h1 className="page-title">Report a Concern</h1>
          <p className="lede page-lede">Tell us what went wrong and we'll get it moving.</p>
          <div className="panel">
            <h3>Tell us what happened</h3>
            <div className="form-steps" aria-label="Report steps">
              {STEPS.map((label, index) => {
                const number = index + 1;
                return <div key={label} className={`form-step${number === step ? ' is-active' : ''}${number < step ? ' is-complete' : ''}`} aria-current={number === step ? 'step' : undefined}><span>{number < step ? '✓' : number}</span><strong>{label}</strong></div>;
              })}
            </div>
            <form onSubmit={handleSubmit} noValidate>
              {step === 1 && <>
                <div className="inline">
                  <div className="field"><label htmlFor="rFirst">First name</label><input id="rFirst" value={form.firstName} onChange={updateField('firstName')} placeholder="Liam" /></div>
                  <div className="field"><label htmlFor="rLast">Last name</label><input id="rLast" value={form.lastName} onChange={updateField('lastName')} placeholder="Tremblay" /></div>
                </div>
                <div className="inline">
                  <div className="field"><label htmlFor="rPhone">Phone</label><input id="rPhone" value={form.phone} onChange={updateField('phone')} placeholder="(416) 555-0123" /></div>
                  <div className="field"><label htmlFor="rEmail">Email</label><input id="rEmail" type="email" value={form.email} onChange={updateField('email')} placeholder="liam.tremblay@example.ca" /></div>
                </div>
                <div className="inline">
                  <div className="field"><label htmlFor="rInvoice">Invoice number</label><input id="rInvoice" value={form.invoiceNumber} onChange={updateField('invoiceNumber')} placeholder="INV-000123" /></div>
                  <div className="field"><label htmlFor="rPurchaseDate">Purchase date</label><input id="rPurchaseDate" type="date" value={form.purchaseDate} onChange={updateField('purchaseDate')} /></div>
                </div>
              </>}
              {step === 2 && <>
                <div className="field"><label htmlFor="rType">What needs attention?</label><select id="rType" value={form.serviceType} onChange={updateField('serviceType')}><option value="">Select...</option>{SERVICE_TYPES.map((option) => <option key={option} value={option}>{option}</option>)}</select></div>
                <div className="field"><label htmlFor="rProductDetails">Product or system details (optional)</label><input id="rProductDetails" value={form.productDetails} onChange={updateField('productDetails')} placeholder="Brand, model, or equipment type" /></div>
              </>}
              {step === 3 && <>
                <div className="field"><label htmlFor="rAddress">Service address</label><input id="rAddress" value={form.address} onChange={updateField('address')} placeholder="123 Main Street" /></div>
                <div className="inline">
                  <div className="field"><label htmlFor="rCity">City</label><input id="rCity" value={form.city} onChange={updateField('city')} placeholder="Toronto" /></div>
                  <div className="field"><label htmlFor="rProvince">Province</label><input id="rProvince" value={form.province} onChange={updateField('province')} placeholder="ON" /></div>
                  <div className="field"><label htmlFor="rPostalCode">Postal code</label><input id="rPostalCode" value={form.postalCode} onChange={updateField('postalCode')} placeholder="M5V 2T6" /></div>
                </div>
              </>}
              {step === 4 && <>
                <div className="field"><label htmlFor="rNotes">Describe the issue</label><textarea id="rNotes" value={form.message} onChange={updateField('message')} placeholder="When did it start? Any noises, leaks or error codes?" /></div>
                <div className="field">
                  <label>Photo of the issue (optional)</label>
                  <label className="image-dropzone" htmlFor="report-image" onDragOver={(event) => event.preventDefault()} onDrop={handleDrop}>
                    <input id="report-image" type="file" accept="image/*" onChange={(event) => chooseImage(event.target.files?.[0])} />
                    <strong>{attachment ? attachment.filename : 'Drop image here or choose a file'}</strong><span>Image files only, up to 20 KB</span>
                  </label>
                  {fileError && <p className="error-text">{fileError}</p>}
                </div>
              </>}
              <div className="step-actions">
                {step > 1 && <button className="secondary-button" type="button" onClick={handleBack}>Back</button>}
                {step < STEPS.length ? <button className="submit" type="button" onClick={handleNext}>Next</button> : <button className="submit" type="submit" disabled={submitting}>{submitting ? 'Sending...' : 'Send my report'}</button>}
              </div>
            </form>
            {error && <p className="error-text">{error}</p>}
            {ticketId && <div className="result show"><p style={{ margin: '0 0 6px' }}>Thanks, {form.firstName}. Your reference number is:</p><div className="ticket-id">{ticketId}</div><ul className="steps"><li className="done"><span className="dot">✓</span><span><strong>Report received</strong><span>We've logged your request.</span></span></li><li><span className="dot" /><span><strong>Routed to the right team</strong><span>A coordinator will follow up.</span></span></li></ul><p className="hint">Use this reference number under "Track a Concern" to check status anytime.</p></div>}
          </div>
        </div>
      </main>
    </>
  );
}
