/**
 * admin/bridge.js — REST клиент с JWT аутентификацией
 * ✅ Использует относительные пути — работает и локально, и на Render
 */

// ✅ ИСПРАВЛЕНО: пустая строка = запросы идут на тот же хост/порт
const API_BASE = '';
const TOKEN_KEY = 'adm_jwt';

// ─── Внутреннее состояние ────────────────────────────────────────────────────

let _token = localStorage.getItem(TOKEN_KEY) || null;
let _authed = false;
let _authCbs = new Set();
let _status = 'connected';
let _statusCbs = new Set();

function setAuth(ok) { 
  _authed = ok; 
  _authCbs.forEach(fn => fn(ok)); 
}

function setStatus(status) { 
  _status = status; 
  _statusCbs.forEach(fn => fn(status)); 
}

// ─── HTTP-утилита ─────────────────────────────────────────────────────────────

async function apiFetch(method, path, body) {
  const headers = { 'Content-Type': 'application/json' };
  if (_token) headers['Authorization'] = `Bearer ${_token}`;

  try {
    setStatus('connecting');
    
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const data = await res.json().catch(() => ({ 
      ok: false, 
      error: 'PARSE_ERROR', 
      message: 'Ответ сервера не является JSON' 
    }));

    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        _token = null;
        setAuth(false);
      }
      const err = Object.assign(new Error(data.message || `HTTP ${res.status}`), {
        code: data.error,
        status: res.status,
      });
      setStatus('error');
      throw err;
    }

    setStatus('connected');
    return data;
  } catch (err) {
    if (err.message === 'Failed to fetch' || err.code === 'FETCH_ERROR') {
      setStatus('disconnected');
    } else if (err.status !== 401) {
      setStatus('error');
    }
    throw err;
  }
}

// ─── Инициализация: восстанавливаем сессию ────────────────────────────────────

(async () => {
  if (!_token) return;
  try {
    await apiFetch('POST', '/api/auth/verify', { token: _token });
    setAuth(true);
    setStatus('connected');
  } catch {
    localStorage.removeItem(TOKEN_KEY);
    _token = null;
    setAuth(false);
    setStatus('disconnected');
  }
})();

// ─── Публичное API ────────────────────────────────────────────────────────────

export function onAuthChange(fn) {
  _authCbs.add(fn);
  fn(_authed);
  return () => _authCbs.delete(fn);
}

export function onStatusChange(fn) {
  _statusCbs.add(fn);
  fn(_status);
  return () => _statusCbs.delete(fn);
}

export const isAuthenticated = () => _authed;
export const getStatus = () => _status;

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function login(username, password) {
  const data = await apiFetch('POST', '/api/auth/login', { username, password });
  if (data.token) {
    _token = data.token;
    localStorage.setItem(TOKEN_KEY, _token);
    setAuth(true);
    setStatus('connected');
  }
  return data;
}

export function logout() {
  _token = null;
  localStorage.removeItem(TOKEN_KEY);
  setAuth(false);
  setStatus('connected');
}

// ─── Bridge API ───────────────────────────────────────────────────────────────

export const bridge = {
  listDocs:  ()           => apiFetch('GET',    '/api/docs'),
  readDoc:   slug         => apiFetch('GET',    `/api/docs/${encodeURIComponent(slug)}`),
  writeDoc:  (slug, c)    => apiFetch('POST',   `/api/docs/${encodeURIComponent(slug)}`, { content: c }),
  createDoc: (slug, c, t) => apiFetch('POST',   '/api/docs', { slug, content: c, title: t }),
  deleteDoc: slug         => apiFetch('DELETE', `/api/docs/${encodeURIComponent(slug)}`),

  listNav:   ()    => apiFetch('GET',  '/api/nav'),
  saveNav:   nav   => apiFetch('POST', '/api/nav', { nav }),

  readFile:  fp        => apiFetch('GET',    `/api/files?path=${encodeURIComponent(fp)}`),
  writeFile: (fp, c)   => apiFetch('POST',   '/api/files', { filePath: fp, content: c }),
  deleteFile: fp       => apiFetch('DELETE', '/api/files', { filePath: fp }),

  readContacts:  ()  => apiFetch('GET',  '/api/contacts'),
  writeContacts: c   => apiFetch('POST', '/api/contacts', { content: c }),

  listAssets:    ()        => apiFetch('GET',  '/api/assets'),
  uploadAsset:   (n, b, m) => apiFetch('POST', '/api/assets', { filename: n, base64: b, mimeType: m }),
  uploadFavicon: (b, m)    => apiFetch('POST', '/api/assets/favicon', { base64: b, mimeType: m }),

  readSiteConfig:  ()    => apiFetch('GET',  '/api/config'),
  writeSiteConfig: cfg   => apiFetch('POST', '/api/config', { config: cfg }),
};