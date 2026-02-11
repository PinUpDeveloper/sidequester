const API_BASE = '';

function getToken() {
  return localStorage.getItem('token');
}

function authHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request(url, options = {}) {
  const res = await fetch(API_BASE + url, {
    ...options,
    headers: { ...authHeaders(), ...options.headers },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || res.statusText || 'Request failed');
  return data;
}

const api = {
  get(url) {
    return request(url, { method: 'GET' });
  },
  post(url, body) {
    return request(url, { method: 'POST', body: JSON.stringify(body) });
  },
  put(url, body) {
    return request(url, { method: 'PUT', body: JSON.stringify(body) });
  },
  patch(url, body) {
    return request(url, { method: 'PATCH', body: JSON.stringify(body) });
  },
  delete(url) {
    return request(url, { method: 'DELETE' });
  },
};
