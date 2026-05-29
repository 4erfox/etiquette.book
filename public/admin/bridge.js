/**
 * bridge.js — REST-клиент для работы с API сервера
 * Все запросы к серверу из админ-панели проходят через этот файл
 * Используются относительные пути — работает и локально, и на Render
 */

// Пустая строка означает что запросы идут на тот же хост и порт что открыт в браузере
const API_BASE = '';
// Ключ под которым JWT-токен хранится в localStorage браузера
const TOKEN_KEY = 'adm_jwt';

// Токен авторизации — загружается из localStorage при открытии страницы
let _token = localStorage.getItem(TOKEN_KEY) || null;
// Флаг авторизации — true если токен прошёл проверку на сервере
let _authed = false;
// Набор колбэков которые вызываются при изменении состояния авторизации
let _authCbs = new Set();
// Текущий статус соединения с сервером: connected / connecting / disconnected / error
let _status = 'connected';
// Набор колбэков которые вызываются при изменении статуса соединения
let _statusCbs = new Set();

// Обновляет флаг авторизации и уведомляет всех подписчиков
function setAuth(ok) {
  _authed = ok;
  _authCbs.forEach(fn => fn(ok));
}

// Обновляет статус соединения и уведомляет всех подписчиков
function setStatus(status) {
  _status = status;
  _statusCbs.forEach(fn => fn(status));
}

// Универсальная функция для HTTP-запросов к API
// Автоматически добавляет токен в заголовок и обрабатывает ошибки авторизации
async function apiFetch(method, path, body) {
  const headers = { 'Content-Type': 'application/json' };
  // Добавляем токен только если он есть — GET-запросы без авторизации работают без него
  if (_token) headers['Authorization'] = `Bearer ${_token}`;

  try {
    setStatus('connecting');

    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    // Парсим JSON-ответ — если сервер вернул не JSON, подставляем описание ошибки
    const data = await res.json().catch(() => ({
      ok: false,
      error: 'PARSE_ERROR',
      message: 'Ответ сервера не является JSON',
    }));

    if (!res.ok) {
      // 401 означает что токен истёк или неверный — очищаем сессию и разлогиниваем
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
    // Если fetch вообще не смог достучаться до сервера — помечаем как disconnected
    if (err.message === 'Failed to fetch' || err.code === 'FETCH_ERROR') {
      setStatus('disconnected');
    } else if (err.status !== 401) {
      setStatus('error');
    }
    throw err;
  }
}

// При загрузке страницы проверяем сохранённый токен — вдруг сессия ещё активна
(async () => {
  if (!_token) return;
  try {
    await apiFetch('POST', '/api/auth/verify', { token: _token });
    setAuth(true);
    setStatus('connected');
  } catch {
    // Токен устарел или недействителен — очищаем и показываем форму входа
    localStorage.removeItem(TOKEN_KEY);
    _token = null;
    setAuth(false);
    setStatus('disconnected');
  }
})();

// Подписка на изменения состояния авторизации
// Колбэк вызывается сразу с текущим значением и затем при каждом изменении
export function onAuthChange(fn) {
  _authCbs.add(fn);
  fn(_authed);
  return () => _authCbs.delete(fn);
}

// Подписка на изменения статуса соединения с сервером
export function onStatusChange(fn) {
  _statusCbs.add(fn);
  fn(_status);
  return () => _statusCbs.delete(fn);
}

// Геттеры текущего состояния — используются при открытии панели
export const isAuthenticated = () => _authed;
export const getStatus = () => _status;

// Вход в систему — отправляет логин и пароль, сохраняет полученный токен
export async function login(username, password) {
  const data = await apiFetch('POST', '/api/auth/login', { username, password });
  if (data.token) {
    _token = data.token;
    // Сохраняем токен в localStorage чтобы сессия сохранялась между перезагрузками
    localStorage.setItem(TOKEN_KEY, _token);
    setAuth(true);
    setStatus('connected');
  }
  return data;
}

// Выход из системы — удаляет токен и сбрасывает состояние авторизации
export function logout() {
  _token = null;
  localStorage.removeItem(TOKEN_KEY);
  setAuth(false);
  setStatus('connected');
}

// Объект bridge — единая точка доступа ко всем API-методам из других модулей панели
export const bridge = {
  // Работа со статьями: список, чтение, запись, создание, удаление
  listDocs:  ()           => apiFetch('GET',    '/api/docs'),
  readDoc:   slug         => apiFetch('GET',    `/api/docs/${encodeURIComponent(slug)}`),
  writeDoc:  (slug, c)    => apiFetch('POST',   `/api/docs/${encodeURIComponent(slug)}`, { content: c }),
  createDoc: (slug, c, t) => apiFetch('POST',   '/api/docs', { slug, content: c, title: t }),
  deleteDoc: slug         => apiFetch('DELETE', `/api/docs/${encodeURIComponent(slug)}`),

  // Работа с навигацией — структура меню в nav.json
  listNav:   ()    => apiFetch('GET',  '/api/nav'),
  saveNav:   nav   => apiFetch('POST', '/api/nav', { nav }),

  // Работа с произвольными файлами на сервере
  readFile:   fp       => apiFetch('GET',    `/api/files?path=${encodeURIComponent(fp)}`),
  writeFile:  (fp, c)  => apiFetch('POST',   '/api/files', { filePath: fp, content: c }),
  deleteFile: fp       => apiFetch('DELETE', '/api/files', { filePath: fp }),

  // Работа с контактами — хранятся в public/data/contacts.json
  readContacts:  ()  => apiFetch('GET',  '/api/contacts'),
  writeContacts: c   => apiFetch('POST', '/api/contacts', { content: c }),

  // Работа с изображениями — загрузка в base64, просмотр списка, замена favicon
  listAssets:    ()        => apiFetch('GET',  '/api/assets'),
  uploadAsset:   (n, b, m) => apiFetch('POST', '/api/assets', { filename: n, base64: b, mimeType: m }),
  uploadFavicon: (b, m)    => apiFetch('POST', '/api/assets/favicon', { base64: b, mimeType: m }),

  // Работа с настройками сайта — заголовок и описание из admin-config.json
  readSiteConfig:  ()    => apiFetch('GET',  '/api/config'),
  writeSiteConfig: cfg   => apiFetch('POST', '/api/config', { config: cfg }),
};