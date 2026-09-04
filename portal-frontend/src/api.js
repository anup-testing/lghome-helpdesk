const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';

async function request(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? `Request failed: ${res.status}`);
  return data;
}

export const submitTicket = (fields) => request('/tickets', { method: 'POST', body: fields });
export const lookupStatus = (params) => request('/status/lookup', { method: 'POST', body: params });
export const escalateTicket = (ticketId, reason) =>
  request(`/tickets/${encodeURIComponent(ticketId)}/escalate`, { method: 'POST', body: { reason } });
export const submitFeedback = (ticketId, rating, comment) =>
  request(`/tickets/${encodeURIComponent(ticketId)}/feedback`, { method: 'POST', body: { rating, comment } });
