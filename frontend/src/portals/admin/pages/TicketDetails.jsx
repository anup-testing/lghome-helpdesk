import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../../components/PageHeader.jsx';
import { apiClient } from '../../../lib/apiClient.js';
import { useAuth } from '../../../lib/auth.jsx';
import { formatTicketNumber } from '../../../lib/formatTicketNumber.js';
import { useApiList } from '../../../lib/useApiList.js';
import Button from '../../../components/ui/Button.jsx';

const STATUSES = ['OPEN', 'IN_PROGRESS', 'SCHEDULED', 'COMPLETED', 'CLOSED', 'CANCELLED'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
const MAX_IMAGE_SIZE = 20 * 1024;

function formatEnumLabel(value) {
  return String(value ?? '')
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatTicketDate(value) {
  const date = new Date(value);
  const day = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
  const time = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
  return `${day} · ${time}`;
}

export default function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: technicians } = useApiList('/technicians');
  const { data: messages, loading: messagesLoading } = useApiList(`/tickets/${id}/messages`);
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [reply, setReply] = useState('');
  const [messageItems, setMessageItems] = useState([]);
  const [sendingReply, setSendingReply] = useState(false);
  const [replyError, setReplyError] = useState(null);

  useEffect(() => {
    if (messages) setMessageItems(messages);
  }, [messages]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    apiClient
      .get(`/tickets/${encodeURIComponent(id)}`)
      .then((data) => {
        if (!cancelled) {
          setTicket(data);
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
  }, [id]);

  function updateField(field, value) {
    setTicket((current) => ({ ...current, [field]: value }));
    setNotice(null);
  }

  async function saveChanges(event) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const updated = await apiClient.put(`/tickets/${encodeURIComponent(id)}`, {
        status: ticket.status,
        priority: ticket.priority,
        technicianId: ticket.technicianId || null,
      });
      setTicket(updated);
      setNotice('Ticket updated.');
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  }

  async function uploadImage(file) {
    setFileError(null);
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setFileError('Please choose an image file.');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setFileError('Image must be 20 KB or smaller.');
      return;
    }

    setUploadingFile(true);
    try {
      const url = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Unable to read this image.'));
        reader.readAsDataURL(file);
      });
      const uploaded = await apiClient.post('/files', {
        ticketId: ticket.id,
        uploadedById: user.id,
        filename: file.name,
        url,
        mimeType: file.type,
      });
      setTicket((current) => ({ ...current, files: [uploaded, ...(current.files ?? [])] }));
      setNotice('Image attached to this ticket.');
    } catch (err) {
      setFileError(err.message);
    } finally {
      setUploadingFile(false);
    }
  }

  function handleDrop(event) {
    event.preventDefault();
    uploadImage(event.dataTransfer.files?.[0]);
  }

  async function sendReply(event) {
    event.preventDefault();
    if (!reply.trim()) return;
    setSendingReply(true);
    setReplyError(null);
    try {
      const created = await apiClient.post(`/tickets/${encodeURIComponent(id)}/messages`, { message: reply });
      setMessageItems((current) => [...current, created]);
      setReply('');
      setSendingReply(false);
    } catch (err) {
      setReplyError(err.message);
      setSendingReply(false);
    }
  }

  if (loading) return <p className="hint">Loading ticket...</p>;
  if (error && !ticket) return <p className="error-text">{error.message}</p>;
  if (!ticket) return null;

  return (
    <>
      <Link className="page-back" to="/admin/tickets">&larr; Back to tickets</Link>
      <PageHeader
        title={`${formatTicketNumber(ticket.ticketNumber)} ${ticket.title}`}
        description="Review the request, update its workflow state, and assign the responsible technician."
      />

      <div className="ticket-detail-grid">
        <section className="ticket-detail-section">
          <h3>Request</h3>
          <dl className="ticket-facts">
            <div><dt>Customer</dt><dd>{ticket.customer?.user?.name ?? '-'}</dd></div>
            <div><dt>Service type</dt><dd>{formatEnumLabel(ticket.serviceType)}</dd></div>
            <div><dt>Created</dt><dd><time dateTime={ticket.createdAt}>{formatTicketDate(ticket.createdAt)}</time></dd></div>
            <div><dt>Last updated</dt><dd><time dateTime={ticket.updatedAt}>{formatTicketDate(ticket.updatedAt)}</time></dd></div>
          </dl>
          <div className="ticket-description">
            <h4>Description</h4>
            <p>{ticket.description}</p>
          </div>
          {ticket.customer?.user?.email && (
            <a
              className="email-customer"
              href={`mailto:${ticket.customer.user.email}?subject=${encodeURIComponent(`Ticket ${formatTicketNumber(ticket.ticketNumber)}: ${ticket.title}`)}`}
            >
              Email customer
            </a>
          )}
        </section>

        <form className="ticket-detail-section ticket-workflow" onSubmit={saveChanges}>
          <h3>Workflow</h3>
          <div className="field">
            <label htmlFor="ticket-status">Status</label>
            <select id="ticket-status" value={ticket.status} onChange={(event) => updateField('status', event.target.value)}>
              {STATUSES.map((status) => <option key={status} value={status}>{formatEnumLabel(status)}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="ticket-priority">Priority</label>
            <select id="ticket-priority" value={ticket.priority} onChange={(event) => updateField('priority', event.target.value)}>
              {PRIORITIES.map((priority) => <option key={priority} value={priority}>{formatEnumLabel(priority)}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="ticket-technician">Technician</label>
            <select id="ticket-technician" value={ticket.technicianId ?? ''} onChange={(event) => updateField('technicianId', event.target.value)}>
              <option value="">Unassigned</option>
              {(technicians ?? []).map((technician) => (
                <option key={technician.id} value={technician.id}>{technician.user?.name ?? technician.id}</option>
              ))}
            </select>
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save changes'}
          </Button>
          {notice && <p className="success-text">{notice}</p>}
          {error && <p className="error-text">{error.message}</p>}
        </form>
      </div>

      <section className="ticket-detail-section ticket-conversation">
        <h3>Conversation</h3>
        {messagesLoading && <p className="hint">Loading messages...</p>}
        {!messagesLoading && messages?.length === 0 && <p className="hint">No replies yet.</p>}
        <div className="message-list">
          {messageItems.map((item) => (
            <article className="ticket-message" key={item.id}>
              <div className="message-meta"><strong>{item.author?.name ?? 'User'}</strong><span>{new Date(item.createdAt).toLocaleString()}</span></div>
              <p>{item.message}</p>
            </article>
          ))}
        </div>
        <form className="reply-form" onSubmit={sendReply}>
          <label htmlFor="ticket-reply">Reply to this ticket</label>
          <textarea id="ticket-reply" value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Write an update for the customer..." />
          <Button type="submit" disabled={sendingReply || !reply.trim()}>{sendingReply ? 'Sending...' : 'Send reply'}</Button>
          {replyError && <p className="error-text">{replyError}</p>}
        </form>
      </section>

      <section className="ticket-detail-section ticket-attachments">
        <div className="section-heading-row">
          <div>
            <h3>Images and attachments</h3>
            <p className="hint">Drop an image below or choose one from your device. Maximum size: 20 KB.</p>
          </div>
        </div>
        <label
          className="image-dropzone"
          htmlFor="ticket-image"
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
        >
          <input
            id="ticket-image"
            type="file"
            accept="image/*"
            onChange={(event) => uploadImage(event.target.files?.[0])}
            disabled={uploadingFile}
          />
          <strong>{uploadingFile ? 'Uploading image...' : 'Drop image here or choose a file'}</strong>
          <span>Image files only, up to 20 KB</span>
        </label>
        {fileError && <p className="error-text">{fileError}</p>}
        {ticket.files?.length > 0 && (
          <div className="attachment-list">
            {ticket.files.map((file) => (
              <a key={file.id} href={file.url} target="_blank" rel="noreferrer" className="attachment-item">
                <span>{file.filename}</span>
                <small>{file.mimeType ?? 'Image'}</small>
              </a>
            ))}
          </div>
        )}
      </section>

      <button className="text-button" type="button" onClick={() => navigate('/admin/tickets')}>
        Return to ticket list
      </button>
    </>
  );
}
