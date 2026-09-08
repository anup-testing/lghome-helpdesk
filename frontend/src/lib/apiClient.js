const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4100/api';
const TOKEN_KEY = 'lgcare_token';

async function request(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? `Request to ${path} failed with ${res.status}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const apiClient = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (path) => request(path, { method: 'DELETE' }),
};
