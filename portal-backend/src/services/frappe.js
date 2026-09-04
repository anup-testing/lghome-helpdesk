const BASE = process.env.FRAPPE_URL;
const AUTH = `token ${process.env.FRAPPE_API_KEY}:${process.env.FRAPPE_API_SECRET}`;

const headers = {
  Authorization: AUTH,
  'Content-Type': 'application/json',
};

export async function createTicket(request) {
  const res = await fetch(`${BASE}/api/resource/${encodeURIComponent('HD Ticket')}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      subject: `${request.serviceType} - ${request.firstName} ${request.lastName}`,
      description: request.message,
      raised_by: request.email,
      custom_mobile: request.phone,
      custom_city: request.city,
      custom_invoice_no: request.invoiceNo,
      custom_service_type: request.serviceType,
      priority: 'Medium',
    }),
  });

  if (!res.ok) throw new Error(`Frappe ${res.status}: ${await res.text()}`);
  return (await res.json()).data; // .name is the Frappe ticket ID
}

export async function escalateTicket(ticketId, reason) {
  const res = await fetch(`${BASE}/api/resource/${encodeURIComponent('HD Ticket')}/${encodeURIComponent(ticketId)}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      priority: 'Urgent',
      custom_escalation_reason: reason,
    }),
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Frappe ${res.status}: ${await res.text()}`);
  return (await res.json()).data;
}

async function getLatestUpdate(ticketId) {
  const filters = encodeURIComponent(JSON.stringify([
    ['reference_doctype', '=', 'HD Ticket'],
    ['reference_name', '=', ticketId],
  ]));
  const fields = encodeURIComponent(JSON.stringify(['content', 'creation', 'sender', 'communication_type']));
  const res = await fetch(
    `${BASE}/api/resource/${encodeURIComponent('Communication')}?filters=${filters}&fields=${fields}&order_by=${encodeURIComponent('creation desc')}&limit_page_length=1`,
    { headers },
  );
  if (!res.ok) throw new Error(`Frappe ${res.status}: ${await res.text()}`);
  const { data } = await res.json();
  return data[0] ?? null;
}

export async function getTicketStatus({ ticketId, mobile, invoiceNo }) {
  if (ticketId) {
    const res = await fetch(`${BASE}/api/resource/${encodeURIComponent('HD Ticket')}/${encodeURIComponent(ticketId)}`, { headers });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Frappe ${res.status}: ${await res.text()}`);
    const ticket = (await res.json()).data;
    ticket.lastUpdate = await getLatestUpdate(ticket.name);
    return ticket;
  }

  const filters = encodeURIComponent(JSON.stringify([
    ['custom_mobile', '=', mobile],
    ['custom_invoice_no', '=', invoiceNo],
  ]));
  const fields = encodeURIComponent(JSON.stringify(['name', 'status', 'subject', 'modified', 'feedback_rating', 'feedback_extra', 'agent_group']));
  const res = await fetch(`${BASE}/api/resource/${encodeURIComponent('HD Ticket')}?filters=${filters}&fields=${fields}`, { headers });
  if (!res.ok) throw new Error(`Frappe ${res.status}: ${await res.text()}`);
  const { data } = await res.json();
  return data[0] ?? null;
}

export async function submitFeedback(ticketId, { rating, comment }) {
  const res = await fetch(`${BASE}/api/resource/${encodeURIComponent('HD Ticket')}/${encodeURIComponent(ticketId)}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      feedback_rating: rating / 5,
      feedback_extra: comment,
    }),
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Frappe ${res.status}: ${await res.text()}`);
  return (await res.json()).data;
}
