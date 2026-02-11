function isLoggedIn() {
  return !!localStorage.getItem('token');
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
}

function setAuth(data) {
  if (data.token) localStorage.setItem('token', data.token);
  if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
}

function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

function logout() {
  clearAuth();
  window.location.href = '/index.html';
}

function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = '/login.html?redirect=' + encodeURIComponent(window.location.pathname + window.location.search);
    return false;
  }
  return true;
}

function redirectIfLoggedIn() {
  if (isLoggedIn()) {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect') || '/dashboard.html';
    window.location.href = redirect;
    return true;
  }
  return false;
}
