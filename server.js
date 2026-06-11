/**
 * server.js — Express REST API + статика
 * Управляет админ-панелью: авторизация, редактирование страниц, контактов, ассетов
 * Деплой: Render.com (используются env variables вместо локального admin.env)
 *
 * Запуск локально:  node server.js (загружает admin.env)
 * Запуск на Render: Env переменные в Dashboard → PORT, JWT_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD_HASH, JWT_EXPIRES_IN
 * Порт по умолчанию: 7778 (localhost) или от Render
 */

'use strict';

// - Встроенные модули
const path    = require('path');      // работа с путями файлов
const fs      = require('fs');        // чтение/запись файлов
const crypto  = require('crypto');    // криптография (timingSafeEqual для защиты)

// - NPM пакеты
const express = require('express');        // веб-фреймворк
const cors    = require('cors');           // разрешение кросс-доменных запросов
const helmet  = require('helmet');         // заголовки безопасности
const rateLimit = require('express-rate-limit');  // защита от брутфорса
const jwt     = require('jsonwebtoken');   // создание и проверка токенов
const bcrypt  = require('bcryptjs');       // хэширование паролей

// - Загрузка конфигурации из окружения

// Парсит и загружает переменные из admin.env файла (только локально)
// На Render переменные уже установлены в Dashboard, этот файл не нужен
// Пропускает комментарии (строки начинающиеся с #) и пустые строки
function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return;  // если нет файла — ничего не делаем
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;  // пропускаем комментарии и пустые строки
    const idx = t.indexOf('=');
    if (idx < 1) continue;  // пропускаем строки без =
    const key = t.slice(0, idx).trim();
    const val = t.slice(idx + 1).trim();
    // Не переопределяем переменные которые уже установлены (приоритет: env > admin.env)
    if (!process.env[key]) process.env[key] = val;
  }
}
loadEnv(path.join(__dirname, 'admin.env'));

// - Переменные конфигурации

// Секретный ключ для подписи JWT-токенов — КРИТИЧНЫЙ! Никогда не коммитить в git
const JWT_SECRET  = process.env.JWT_SECRET;
// Имя администратора из env или дефолт 'admin'
const ADMIN_USER  = process.env.ADMIN_USERNAME      || 'admin';
// Хэш пароля администратора (bcrypt, никогда не коммитить в git)
const ADMIN_HASH  = process.env.ADMIN_PASSWORD_HASH;
// Время жизни JWT-токена (по умолчанию 8 часов)
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN      || '8h';
// Порт: на Render даётся переменная PORT, локально используем 7778
const PORT        = process.env.PORT                || 7778;
// Слушаем на 0.0.0.0 чтобы Render мог подключиться (не только localhost)
const HOST        = '0.0.0.0';

// - Валидация конфигурации

// Проверяем что указаны критичные переменные окружения
if (!JWT_SECRET || JWT_SECRET.includes('ЗАМЕНИ')) {
  console.error('\n❌  Задай JWT_SECRET в переменных окружения Render!\n');
  process.exit(1);
}
if (!ADMIN_HASH) {
  console.error('\n❌  Задай ADMIN_PASSWORD_HASH в переменных окружения Render!\n');
  process.exit(1);
}

// - Пути к файлам и папкам

// Главная папка с фронтенд-статикой (HTML, CSS, JS, изображения)
const PUBLIC_DIR    = path.join(__dirname, 'public');
// Папка со страницами сайта (HTML файлы для маршрутизации)
const PAGES_DIR     = path.join(PUBLIC_DIR, 'pages');
// Папка с документацией (MD файлы, редактируются в админ-панели)
const DOCS_DIR      = path.join(PUBLIC_DIR, 'docs');
// Папка с загруженными ассетами (изображения, логотипы)
const ASSETS_DIR    = path.join(PUBLIC_DIR, 'assets');
// JSON с контактной информацией компании
const CONTACTS_PATH = path.join(PUBLIC_DIR, 'data', 'contacts.json');
// JSON с навигацией меню сайта
const NAV_PATH      = path.join(PUBLIC_DIR, 'data', 'nav.json');
// JSON с конфигурацией сайта (заголовок, описание)
const SITE_CONFIG   = path.join(__dirname, 'admin-config.json');

// - Функции безопасности

// Безопасное разрешение пути — защита от Path Traversal атак
// Пример атаки: slug = "../../etc/passwd" → должна быть заблокирована
// Решение: проверяем что итоговый путь начинается с baseDir
function safeResolve(baseDir, ...parts) {
  const abs = path.resolve(baseDir, ...parts);
  // Если путь вышел за пределы baseDir — это атака, блокируем
  if (!abs.startsWith(path.resolve(baseDir) + path.sep) &&
      abs !== path.resolve(baseDir)) {
    const err = new Error('Path traversal denied');
    err.status = 400;
    throw err;
  }
  return abs;
}

// Проверяет что slug содержит только безопасные символы (без специальных символов)
// slug используется как имя файла: /api/docs/:slug → public/docs/:slug.md
function isValidSlug(slug) {
  return typeof slug === 'string' &&  // должен быть строкой
         /^[a-zA-Z0-9_-]+$/.test(slug) &&  // только буквы, цифры, дефис, подчёркивание
         slug.length <= 200;  // максимум 200 символов
}

// - JWT токены

// Создаёт подписанный JWT-токен для администратора
// Payload: { sub: username, role: 'admin', iat, exp }
// Подпись: HMAC-SHA256(header.payload, JWT_SECRET)
function signToken(sub) {
  return jwt.sign(
    { sub, role: 'admin' },  // payload: кому выдан токен и его роль
    JWT_SECRET,              // secret: ключ для подписи (должен быть в переменной окружения)
    { expiresIn: JWT_EXPIRES }  // опции: время жизни токена (8h)
  );
}

// Проверяет и декодирует JWT-токен
// Возвращает payload если валидный, null если истёк или поддельный
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);  // проверяет подпись и время жизни
  } catch {
    return null;  // токен невалидный/истёк/поддельный
  }
}

// Express middleware для проверки авторизации
// Извлекает token из заголовка Authorization: Bearer <token>
// Если токен невалидный — возвращает 401 ошибку
function requireAuth(req, res, next) {
  const header = req.headers['authorization'] || '';  // читаем заголовок
  const [scheme, token] = header.split(' ');  // парсим "Bearer <token>"
  
  // Проверяем формат: должен быть "Bearer" и сам токен
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ ok: false, error: 'AUTH_REQUIRED', message: 'Необходима авторизация' });
  }
  
  // Проверяем валидность токена
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ ok: false, error: 'TOKEN_INVALID', message: 'Токен недействителен или истёк' });
  }
  
  // Сохраняем распакованный токен в req.user для использования в роутах
  req.user = decoded;
  next();  // продолжаем обработку запроса
}

// - Навигационные утилиты

function htmlTitle(filename) {
  const fp = path.join(PAGES_DIR, filename);
  if (!fs.existsSync(fp)) return filename.replace('.html', '').replace(/-/g, ' ');
  const m = fs.readFileSync(fp, 'utf8').match(/<title[^>]*>([^<]+)<\/title>/i);
  return m ? m[1].split(/[—–]/)[0].trim() : filename.replace('.html','').replace(/-/g,' ');
}

function getNav() {
  if (fs.existsSync(NAV_PATH)) {
    try {
      const s = JSON.parse(fs.readFileSync(NAV_PATH, 'utf8'));
      if (Array.isArray(s) && s.length) return s;
    } catch {}
  }
  const files = fs.existsSync(PAGES_DIR)
    ? fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('.html'))
    : [];
  return [{ id: 'pages', title: 'Страницы', pages: files.map(f => ({ name: f, href: `/pages/${f}`, title: htmlTitle(f) })) }];
}

function persistNav(nav) {
  fs.mkdirSync(path.dirname(NAV_PATH), { recursive: true });
  fs.writeFileSync(NAV_PATH, JSON.stringify(nav, null, 2), 'utf8');
}

function getAllPages() {
  if (!fs.existsSync(PAGES_DIR)) return [];
  return fs.readdirSync(PAGES_DIR)
    .filter(f => f.endsWith('.html'))
    .map(f => ({ name: f, href: `/pages/${f}`, title: htmlTitle(f), path: `public/pages/${f}` }));
}

// - Инициализация Express приложения

// Создаём Express приложение
const app = express();
// На Render используется reverse proxy → доверяем IP из заголовка X-Forwarded-For
app.set('trust proxy', 1); 

// - Безопасность: заголовки и CORS

// Helmet: добавляет заголовки безопасности (X-Frame-Options, Content-Security-Policy и т.д.)
// Отключаем CSP, COEP, CORP чтобы админ-панель могла загружать ассеты
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: false,
}));

// Список разрешённых источников для CORS запросов
const allowedOrigins = [
  'http://localhost:3000',    // фронтенд локально на порте 3000
  'http://localhost:7778',    // то же приложение на порте 7778
  process.env.RENDER_EXTERNAL_URL,  // production домен на Render
].filter(Boolean);  // удаляем undefined

// CORS: разрешаем запросы с указанных источников
app.use(cors({
  origin: (origin, callback) => {
    // Разрешаем запросы без origin (curl, Postman, мобильные приложения)
    // и запросы из whitelisted доменов
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // На Render все запросы с одного домена — разрешаем
      callback(null, true);
    }
  },
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],  // разрешённые HTTP методы
  allowedHeaders: ['Content-Type', 'Authorization'],  // разрешённые заголовки
  credentials: true,  // разрешаем отправку cookies если нужны
}));

// Middleware для парсинга JSON в теле запроса (максимум 10MB)
app.use(express.json({ limit: '10mb' }));

// - Защита от DDoS и перебора паролей

// Строгий лимит на /api/auth (логин, проверка токена)
// 100 запросов за 15 минут — защита от перебора паролей (brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // окно: 15 минут
  max: 100,  // максимум 100 запросов за окно
  standardHeaders: true,  // возвращать RateLimit-* заголовки
  legacyHeaders: false,
  message: { ok: false, error: 'TOO_MANY_REQUESTS', message: 'Слишком много попыток. Попробуй через 15 минут.' },
});

// Мягче для остальных API (может быть много легитимных запросов)
// 1000 запросов за минуту — защита от DDoS
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,  // окно: 1 минута
  max: 1000,  // максимум 1000 запросов за окно
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'TOO_MANY_REQUESTS', message: 'Слишком много запросов.' },
});

// Применяем лимиты к роутам
app.use('/api/auth', authLimiter);  // строгий лимит на аутентификацию
app.use('/api',      apiLimiter);   // общий лимит на все остальные API

// - Статика и порядок маршрутов

// ⚠️ ВАЖНО: API маршруты должны быть выше staticа, иначе статика перехватит /api запросы
// Раздаём папку public/ как статику (HTML, CSS, JS, изображения клиента)
app.use(express.static(PUBLIC_DIR));

// - Вспомогательные функции

// Обёртка для async route handlers — ловит ошибки и передаёт их в глобальный обработчик
// Позволяет не писать try-catch в каждом роуте
function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

// - Роуты: аутентификация

app.post('/api/auth/login', asyncHandler(async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ ok: false, error: 'MISSING_FIELDS', message: 'Укажите username и password' });
  }

  let userOk = false;
  try {
    userOk = crypto.timingSafeEqual(
      Buffer.from(username.padEnd(ADMIN_USER.length)),
      Buffer.from(ADMIN_USER.padEnd(username.length))
    ) && username.length === ADMIN_USER.length;
  } catch { /* разная длина → false */ }

  if (!userOk) {
    await bcrypt.compare('dummy', '$2b$10$aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    return res.status(401).json({ ok: false, error: 'INVALID_CREDENTIALS', message: 'Неверный логин или пароль' });
  }

  const passOk = await bcrypt.compare(password, ADMIN_HASH);
  if (!passOk) {
    return res.status(401).json({ ok: false, error: 'INVALID_CREDENTIALS', message: 'Неверный логин или пароль' });
  }

  const token = signToken(username);
  console.log(`  ✓ Вход: ${username} [${new Date().toISOString()}]`);
  res.json({ ok: true, token, expiresIn: JWT_EXPIRES });
}));

// POST /api/auth/verify — проверка токена
// Используется при загрузке админ-панели чтобы проверить что токен ещё активен
app.post('/api/auth/verify', asyncHandler(async (req, res) => {
  const { token } = req.body || {};
  
  if (!token) {
    return res.status(400).json({ ok: false, error: 'MISSING_TOKEN', message: 'Токен не передан' });
  }
  
  // Проверяем подпись и время жизни токена
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ ok: false, error: 'TOKEN_INVALID', message: 'Токен недействителен или истёк' });
  }
  
  // Если токен валиден — возвращаем username (sub в JWT payload)
  res.json({ ok: true, username: decoded.sub });
}));

// - Роуты: документация

// GET /api/docs — получить список всех документов
// Требует авторизации (requireAuth)
app.get('/api/docs', requireAuth, asyncHandler(async (req, res) => {
  if (!fs.existsSync(DOCS_DIR)) return res.json({ ok: true, docs: [] });
  
  // Сканируем папку docs и создаём метаинформацию о каждом документе
  const docs = fs.readdirSync(DOCS_DIR)
    .filter(f => f.endsWith('.md'))  // только .md файлы
    .map(f => {
      const slug = f.replace('.md', '');  // имя файла без расширения используется как slug
      const text = fs.readFileSync(path.join(DOCS_DIR, f), 'utf8');
      // Ищет в начале файла строку: title: "название"
      const title = text.match(/^title:\s*["']?(.+?)["']?\s*$/m)?.[1] || slug;
      // Время последнего изменения файла
      const updatedAt = fs.statSync(path.join(DOCS_DIR, f)).mtime.toISOString();
      return { slug, title, updatedAt };
    });
  
  res.json({ ok: true, docs });
}));

// GET /api/docs/:slug — получить содержимое одного документа
// slug = имя файла без расширения (например: "first-impression")
app.get('/api/docs/:slug', requireAuth, asyncHandler(async (req, res) => {
  const { slug } = req.params;
  
  // Проверяем что slug содержит только безопасные символы (защита от Path Traversal)
  if (!isValidSlug(slug)) {
    return res.status(400).json({ ok: false, error: 'INVALID_SLUG', message: 'Недопустимые символы в slug' });
  }
  
  // Получаем безопасный путь к файлу (проверяет что файл внутри DOCS_DIR)
  const filePath = safeResolve(DOCS_DIR, slug + '.md');
  
  // Проверяем что файл существует
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Документ не найден: ${slug}` });
  }
  
  // Читаем содержимое и время изменения
  const content   = fs.readFileSync(filePath, 'utf8');
  const updatedAt = fs.statSync(filePath).mtime.toISOString();
  
  res.json({ ok: true, slug, content, updatedAt });
}));

// POST /api/docs/:slug — обновить существующий документ
app.post('/api/docs/:slug', requireAuth, asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { content } = req.body || {};
  
  // Проверяем что slug безопасен
  if (!isValidSlug(slug)) {
    return res.status(400).json({ ok: false, error: 'INVALID_SLUG', message: 'Недопустимые символы в slug' });
  }
  
  // Проверяем что передано содержимое
  if (typeof content !== 'string') {
    return res.status(400).json({ ok: false, error: 'MISSING_CONTENT', message: 'Поле content обязательно' });
  }
  
  // Получаем безопасный путь и сохраняем файл
  const filePath = safeResolve(DOCS_DIR, slug + '.md');
  fs.mkdirSync(DOCS_DIR, { recursive: true });  // создаём папку если её нет
  fs.writeFileSync(filePath, content, 'utf8');  // перезаписываем файл
  
  // Логируем изменение с указанием администратора
  console.log(`  ✎ writeDoc: ${slug} [${req.user.sub}]`);
  res.json({ ok: true, slug, message: 'Документ сохранён' });
}));

// POST /api/docs — создать новый документ
// Если slug не передан — автогенерируется из title или из timestamp
app.post('/api/docs', requireAuth, asyncHandler(async (req, res) => {
  let { slug, content, title } = req.body || {};
  
  // Если slug не передан — генерируем из title
  if (!slug) {
    slug = title
      ? title.toLowerCase()  // приводим к нижнему регистру
        .replace(/[^a-z0-9]+/g, '-')  // заменяем спецсимволы на дефис
        .replace(/^-|-$/g, '')  // удаляем дефисы в начале/конце
        .slice(0, 80)  // максимум 80 символов
      : `doc-${Date.now()}`;  // или генерируем из timestamp
  }
  
  // Проверяем что slug безопасен
  if (!isValidSlug(slug)) {
    return res.status(400).json({ ok: false, error: 'INVALID_SLUG', message: 'Недопустимые символы в slug' });
  }
  
  // Получаем безопасный путь
  const filePath = safeResolve(DOCS_DIR, slug + '.md');
  
  // Проверяем что документ с таким slug ещё не существует (409 Conflict)
  if (fs.existsSync(filePath)) {
    return res.status(409).json({ ok: false, error: 'ALREADY_EXISTS', message: `Документ уже существует: ${slug}` });
  }
  
  // Если content не передан — создаём шаблон с заголовком
  if (typeof content !== 'string') {
    content = `---\ntitle: ${title || slug}\n---\n\n# ${title || slug}\n`;
  }
  
  // Сохраняем новый документ
  fs.mkdirSync(DOCS_DIR, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log(`  ✚ createDoc: ${slug} [${req.user.sub}]`);
  res.status(201).json({ ok: true, slug, message: 'Документ создан' });
}));

// DELETE /api/docs/:slug — удалить документ
app.delete('/api/docs/:slug', requireAuth, asyncHandler(async (req, res) => {
  const { slug } = req.params;
  
  // Проверяем что slug безопасен
  if (!isValidSlug(slug)) {
    return res.status(400).json({ ok: false, error: 'INVALID_SLUG', message: 'Недопустимые символы в slug' });
  }
  
  // Получаем безопасный путь
  const filePath = safeResolve(DOCS_DIR, slug + '.md');
  
  // Проверяем что файл существует
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Документ не найден: ${slug}` });
  }
  
  // Удаляем файл
  fs.unlinkSync(filePath);
  res.json({ ok: true, slug, message: 'Документ удалён' });
}));

// - Роуты: навигация

// GET /api/nav — получить текущую навигацию и список всех страниц
app.get('/api/nav', requireAuth, asyncHandler(async (req, res) => {
  res.json({ ok: true, nav: getNav(), pages: getAllPages() });
}));

// POST /api/nav — сохранить структуру навигации (порядок и группировка страниц)
app.post('/api/nav', requireAuth, asyncHandler(async (req, res) => {
  const { nav } = req.body || {};
  
  // Проверяем что nav — это массив
  if (!Array.isArray(nav)) {
    return res.status(400).json({ ok: false, error: 'INVALID_NAV', message: 'nav должен быть массивом' });
  }
  
  // Сохраняем в JSON файл
  persistNav(nav);
  res.json({ ok: true, message: 'Навигация сохранена' });
}));

// - Роуты: файлы

// GET /api/files?path=... — получить содержимое файла
app.get('/api/files', requireAuth, asyncHandler(async (req, res) => {
  // Получаем безопасный путь от запроса
  const filePath = safeResolve(__dirname, req.query.path || '');
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: 'Файл не найден' });
  }
  
  // Читаем и возвращаем содержимое
  res.json({ ok: true, content: fs.readFileSync(filePath, 'utf8') });
}));

// POST /api/files — сохранить/перезаписать файл
app.post('/api/files', requireAuth, asyncHandler(async (req, res) => {
  const { filePath, content } = req.body || {};
  
  if (!filePath || typeof content !== 'string') {
    return res.status(400).json({ ok: false, error: 'MISSING_FIELDS', message: 'filePath и content обязательны' });
  }
  
  // Получаем безопасный абсолютный путь
  const abs = safeResolve(__dirname, filePath);
  
  // Создаём папку если нужно
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  
  // Сохраняем файл
  fs.writeFileSync(abs, content, 'utf8');
  res.json({ ok: true, message: 'Файл сохранён', path: filePath });
}));

// DELETE /api/files — удалить файл или папку
app.delete('/api/files', requireAuth, asyncHandler(async (req, res) => {
  const { filePath } = req.body || {};
  
  if (!filePath) {
    return res.status(400).json({ ok: false, error: 'MISSING_FIELD', message: 'filePath обязателен' });
  }
  
  const abs = safeResolve(__dirname, filePath);
  
  if (!fs.existsSync(abs)) {
    return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: 'Файл не найден' });
  }
  
  // Удаляем файл или рекурсивно удаляем папку
  fs.statSync(abs).isDirectory()
    ? fs.rmSync(abs, { recursive: true })
    : fs.unlinkSync(abs);
  
  res.json({ ok: true, message: 'Файл удалён', path: filePath });
}));

// - Роуты: контакты

// GET /api/contacts — получить контактную информацию (НЕ требует авторизации!)
// Контакты видны публично на сайте
app.get('/api/contacts', asyncHandler(async (req, res) => {
  // Читаем JSON с контактами или возвращаем пустой массив если файла нет
  const content = fs.existsSync(CONTACTS_PATH)
    ? fs.readFileSync(CONTACTS_PATH, 'utf8')
    : '[]';
  
  res.json({ ok: true, content });
}));

// POST /api/contacts — обновить контактную информацию (требует авторизации)
app.post('/api/contacts', requireAuth, asyncHandler(async (req, res) => {
  const { content } = req.body || {};
  
  if (typeof content !== 'string') {
    return res.status(400).json({ ok: false, error: 'MISSING_CONTENT', message: 'content обязателен' });
  }
  
  // Проверяем что content — валидный JSON перед сохранением
  try { JSON.parse(content); } catch {
    return res.status(400).json({ ok: false, error: 'INVALID_JSON', message: 'content должен быть валидным JSON' });
  }
  
  // Сохраняем контакты
  fs.mkdirSync(path.dirname(CONTACTS_PATH), { recursive: true });
  fs.writeFileSync(CONTACTS_PATH, content, 'utf8');
  
  res.json({ ok: true, message: 'Контакты сохранены' });
}));

// - Роуты: ассеты

// GET /api/assets — получить список всех загруженных ассетов
app.get('/api/assets', requireAuth, asyncHandler(async (req, res) => {
  if (!fs.existsSync(ASSETS_DIR)) return res.json({ ok: true, assets: [] });
  
  // Сканируем папку assets и фильтруем только изображения
  const assets = fs.readdirSync(ASSETS_DIR)
    .filter(f => /\.(png|jpg|jpeg|gif|svg|webp|ico)$/i.test(f))  // только картинки
    .map(f => ({
      name: f,  // имя файла
      path: `/assets/${f}`,  // URL для доступа
      size: fs.statSync(path.join(ASSETS_DIR, f)).size,  // размер файла в байтах
    }));
  
  res.json({ ok: true, assets });
}));

// POST /api/assets — загрузить новый ассет (изображение)
app.post('/api/assets', requireAuth, asyncHandler(async (req, res) => {
  const { filename, base64, mimeType } = req.body || {};
  
  // Проверяем что переданы необходимые поля
  if (!filename || !base64) {
    return res.status(400).json({ ok: false, error: 'MISSING_FIELDS', message: 'filename и base64 обязательны' });
  }
  
  // Проверяем что имя файла безопасное (защита от Path Traversal)
  if (!/^[a-zA-Z0-9_.-]+$/.test(filename) || filename.includes('..')) {
    return res.status(400).json({ ok: false, error: 'INVALID_FILENAME', message: 'Недопустимое имя файла' });
  }
  
  // Создаём папку если нужно и сохраняем файл из base64
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
  fs.writeFileSync(path.join(ASSETS_DIR, filename), Buffer.from(base64, 'base64'));
  
  res.json({ ok: true, path: `/assets/${filename}` });
}));

// POST /api/assets/favicon — загрузить фавикон сайта
app.post('/api/assets/favicon', requireAuth, asyncHandler(async (req, res) => {
  const { base64 } = req.body || {};
  
  if (!base64) {
    return res.status(400).json({ ok: false, error: 'MISSING_BASE64', message: 'base64 обязателен' });
  }
  
  // Сохраняем фавикон в корень public/ папки
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.png'), Buffer.from(base64, 'base64'));
  
  res.json({ ok: true, path: '/favicon.png' });
}));

// - Роуты: конфигурация сайта

// GET /api/health — проверка статуса сервера (для мониторинга)
// НЕ требует авторизации
app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'etiquette-book', time: new Date().toISOString() });
});

// GET /api/config — получить конфигурацию сайта (заголовок, описание)
// НЕ требует авторизации (видно публично)
app.get('/api/config', asyncHandler(async (req, res) => {
  // Читаем конфиг или используем пустой объект если файла нет
  const config = fs.existsSync(SITE_CONFIG)
    ? JSON.parse(fs.readFileSync(SITE_CONFIG, 'utf8'))
    : {};
  
  res.json({ ok: true, config: {
    siteTitle: config.siteTitle || '',  // название сайта
    siteDescription: config.siteDescription || '',  // описание
  }});
}));

// POST /api/config — обновить конфигурацию сайта
// Требует авторизации (может менять только администратор)
app.post('/api/config', requireAuth, asyncHandler(async (req, res) => {
  const { siteTitle, siteDescription } = req.body || {};
  
  // Проверяем что оба поля — строки
  if (typeof siteTitle !== 'string' || typeof siteDescription !== 'string') {
    return res.status(400).json({ ok: false, error: 'INVALID_CONFIG', message: 'siteTitle и siteDescription должны быть строками' });
  }
  
  // Сохраняем конфиг в JSON
  fs.writeFileSync(SITE_CONFIG, JSON.stringify({ siteTitle, siteDescription }, null, 2), 'utf8');
  
  res.json({ ok: true, message: 'Настройки сохранены' });
}));

// - Маршруты: 404 и fallback

// 404 для API запросов — если ничего из вышеперечисленного не совпадает
app.use('/api', (req, res) => {
  res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Эндпоинт не найден: ${req.method} ${req.path}` });
});

// SPA fallback — все остальные маршруты (не /api) отдают index.html
// Это позволяет фронтенду обработать роутинг самостоятельно (Vue Router)
// Express 5 требует именованный wildcard (*path) вместо старого синтаксиса ('*')
app.get('*path', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

// - Глобальный обработчик ошибок

// Ловит все ошибки которые возникли в роутах (благодаря asyncHandler)
// Сигнатура (err, req, res, next) обязательна для Express
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // Используем переданный статус или 500 по умолчанию
  const status  = err.status || 500;
  // Не показываем детали внутренних ошибок клиентам (status >= 500)
  const message = status < 500 ? err.message : 'Внутренняя ошибка сервера';
  
  // Логируем серьёзные ошибки в консоль для отладки
  if (status >= 500) console.error('Server error:', err);
  
  // Возвращаем JSON с информацией об ошибке
  res.status(status).json({ 
    ok: false, 
    error: err.code || 'SERVER_ERROR', 
    message 
  });
});

// - Запуск сервера

// Запускаем сервер на указанном PORT и HOST
// PORT: от Render (для production) или 7778 (локально)
// HOST: 0.0.0.0 чтобы слушать все IP адреса (необходимо для Render)
app.listen(PORT, HOST, () => {
  console.log(`\n✅ Сервер запущен`);
});

// Экспортируем приложение для тестирования
module.exports = app;