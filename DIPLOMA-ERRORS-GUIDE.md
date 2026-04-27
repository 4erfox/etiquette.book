# Руководство по типичным ошибкам при разработке проекта "Книга этикета"
## Полный цикл разработки: от инициализации до деплоя

---

## Часть 1️⃣: ИНИЦИАЛИЗАЦИЯ ПРОЕКТА

### ❌ Ошибка 1.1 – Несовместимая версия Node.js

**Описание:** При попытке установки зависимостей появляется ошибка несовместимости.

#### 📸 Скрин ошибки (терминал):
```
Terminal: PowerShell
> npm install

npm ERR! The engines in this package require node >=18.0.0
npm ERR! You are currently using node 16.14.2
npm ERR! This package.json requires a newer version of node to use successfully.

npm ERR! A complete log of this run is available in: C:\...\npm-debug.log
```

#### ✅ Исправление:

**Шаг 1:** Проверить текущую версию Node.js
```bash
node --version
```

**Шаг 2:** Если версия < 18, обновить Node.js:
- Скачать с https://nodejs.org/ (LTS версию 20 или 22)
- Переустановить Node.js
- Перезагрузить терминал

**Шаг 3:** Проверить обновленную версию:
```bash
node --version
# Должно быть: v20.x.x или v22.x.x ✅
```

**Шаг 4:** Повторить установку зависимостей:
```bash
npm install
```

---

### ❌ Ошибка 1.2 – Файл package-lock.json повреждён

**Описание:** После неудачной установки появляются странные ошибки модулей.

#### 📸 Скрин ошибки (терминал):
```
Terminal: PowerShell
> npm install

npm ERR! Unexpected end of JSON input while parsing...
npm ERR! File: C:\Project\node_modules\...\package.json
npm ERR! Failed to parse package.json data.

npm ERR! A complete log of this run is available in: C:\...\npm-debug.log
```

#### ✅ Исправление:

```bash
# Шаг 1: Удалить повреждённые файлы
rm -r node_modules
rm package-lock.json

# Шаг 2: Очистить кэш npm
npm cache clean --force

# Шаг 3: Переустановить все зависимости
npm install
```

---

## Часть 2️⃣: КОНФИГУРАЦИЯ И ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ

### ❌ Ошибка 2.1 – JWT_SECRET не установлена

**Описание:** При запуске сервера приложение завершает работу с ошибкой аутентификации.

#### 📸 Скрин ошибки (терминал):
```
Terminal: PowerShell
> npm run server

> etiquette-book@1.0.0 server
> node server.js

❌  Задай JWT_SECRET в переменных окружения Render!

(node:8392) ExitCode: 1
```

#### ✅ Исправление:

**Вариант 1: Локальная разработка (через admin.env)**

1. Открыть файл `admin.env`:
```env
JWT_SECRET=8d887319bfff286678fdc534d5da0cbdeb8b36e689b2b809ea182aab5d0a8331
ADMIN_USERNAME=admin123
ADMIN_PASSWORD_HASH=$2b$10$c6Dm8gZ/A4AghtEEtF6qPeTuXuxfSgGOaJAUXelH5cQ.2CB.Txpem
JWT_EXPIRES_IN=8h
```

2. **Убедиться, что `admin.env` в `.gitignore`:**
```bash
echo "admin.env" >> .gitignore
git add .gitignore
git commit -m "Add admin.env to gitignore"
```

**Вариант 2: Генерация нового JWT_SECRET**

Если хотите изменить ключ:
```bash
# Генерировать новый случайный ключ (32 байта)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Вывод:
# a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e
```

Скопировать вывод и вставить в `admin.env`:
```env
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e
```

---

### ❌ Ошибка 2.2 – ADMIN_PASSWORD_HASH не установлена

**Описание:** Невозможно войти в админ-панель, даже если пароль казался правильным.

#### 📸 Скрин ошибки (браузер консоль):
```
POST /api/auth/login 401 Unauthorized

Response:
{
  "error": "Invalid credentials"
}
```

#### 📸 Скрин ошибки (терминал сервера):
```
Terminal: PowerShell
[AUTH] Login attempt: admin123
[AUTH] Password hash not configured in environment
```

#### ✅ Исправление:

**Шаг 1:** Сгенерировать хэш для вашего пароля

```bash
node -e "const b=require('bcryptjs');console.log(b.hashSync('ваш_пароль', 10))"
```

Пример (пароль: `securePass123`):
```bash
node -e "const b=require('bcryptjs');console.log(b.hashSync('securePass123', 10))"

# Вывод:
# $2b$10$XyZ1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z
```

**Шаг 2:** Обновить `admin.env`:
```env
ADMIN_PASSWORD_HASH=$2b$10$XyZ1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z
```

**Шаг 3:** Перезапустить сервер:
```bash
npm run server
```

**⚠️ ВАЖНО:** Никогда не коммитьте хэши в git! `admin.env` должен быть в `.gitignore`.

---

### ❌ Ошибка 2.3 – Отсутствует файл admin.env

**Описание:** При клонировании проекта с GitHub файл переменных окружения отсутствует.

#### 📸 Скрин ошибки (терминал):
```
Terminal: PowerShell
> npm run server

> etiquette-book@1.0.0 server
> node server.js

❌  Задай JWT_SECRET в переменных окружения Render!
```

#### ✅ Исправление:

**Шаг 1:** Создать `admin.env` из шаблона

Если есть `admin.env.example`:
```bash
cp admin.env.example admin.env
```

Если его нет, создать вручную:
```bash
touch admin.env
```

**Шаг 2:** Заполнить переменные:
```env
JWT_SECRET=8d887319bfff286678fdc534d5da0cbdeb8b36e689b2b809ea182aab5d0a8331
ADMIN_USERNAME=admin123
ADMIN_PASSWORD_HASH=$2b$10$c6Dm8gZ/A4AghtEEtF6qPeTuXuxfSgGOaJAUXelH5cQ.2CB.Txpem
JWT_EXPIRES_IN=8h
```

---

## Часть 3️⃣: УСТАНОВКА ЗАВИСИМОСТЕЙ И КОНФЛИКТЫ

### ❌ Ошибка 3.1 – Конфликт версий npm пакетов

**Описание:** При установке зависимостей npm предупреждает о несовместимых версиях.

#### 📸 Скрин ошибки (терминал):
```
Terminal: PowerShell
> npm install

npm warn deprecated express-validator@6.14.2: ...
npm ERR! Could not resolve dependency:
npm ERR! peer express@"^4.16.0" npm@"^7.0.0"

npm ERR! A complete log of this run is available in: C:\...\npm-debug.log
```

#### ✅ Исправление:

**Вариант 1: Принудительная установка (если вы уверены)**
```bash
npm install --legacy-peer-deps
```

**Вариант 2: Обновить конфликтующие пакеты**
```bash
# Обновить всё до последних версий
npm update

# Или обновить конкретный пакет
npm install express@latest --save
```

**Вариант 3: Очистить кэш и переустановить**
```bash
npm cache clean --force
rm -r node_modules
npm install --legacy-peer-deps
```

**Результат успешной установки:**
```
added 245 packages from 198 contributors in 45s
```

---

### ❌ Ошибка 3.2 – Недостаточно памяти при установке

**Описание:** На старых ПК установка падает с ошибкой памяти.

#### 📸 Скрин ошибки (терминал):
```
Terminal: PowerShell
> npm install

[#########################---] 87 packages, 2.1s

FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory
```

#### ✅ Исправление:

```bash
# Увеличить выделяемую память Node.js
node --max-old-space-size=4096 ./node_modules/.bin/npm install

# Или для PowerShell:
$env:NODE_OPTIONS = "--max-old-space-size=4096"
npm install
```

---

## Часть 4️⃣: ЗАПУСК СЕРВЕРА

### ❌ Ошибка 4.1 – Порт 7778 уже занят

**Описание:** При запуске сервера ошибка: порт уже используется другим приложением.

#### 📸 Скрин ошибки (терминал):
```
Terminal: PowerShell
> npm run server

> etiquette-book@1.0.0 server
> node server.js

Error: listen EADDRINUSE: address already in use :::7778
    at Server.setupListenHandle [as _listen2] (net.js:1058:13)
```

#### ✅ Исправление:

**Вариант 1: Найти и завершить процесс на порту 7778**

**На Windows (PowerShell):**
```powershell
# Найти процесс на порту 7778
netstat -ano | findstr :7778

# Вывод пример:
# TCP    0.0.0.0:7778    0.0.0.0:0    LISTENING    5234

# Завершить процесс по PID
taskkill /PID 5234 /F
```

**На macOS/Linux:**
```bash
# Найти процесс
lsof -i :7778

# Вывод:
# COMMAND   PID   FD   TYPE DEVICE SIZE/OFF NODE NAME
# node    12345   19u  IPv4   0x1234      0t0  TCP *:7778

# Завершить процесс
kill -9 12345
```

**Вариант 2: Использовать другой порт**

В `admin.env`:
```env
PORT=7779
```

Или через переменную окружения:
```bash
PORT=7779 npm run server
```

---

### ❌ Ошибка 4.2 – Модуль express не найден

**Описание:** Забыли установить зависимости перед запуском.

#### 📸 Скрин ошибки (терминал):
```
Terminal: PowerShell
> npm run server

> etiquette-book@1.0.0 server
> node server.js

Error: Cannot find module 'express'
Require stack:
- E:\Проект123\админ панель вместе\server.js

    at Module._load (internal/modules/commonjs/loader.js:724:13)
```

#### ✅ Исправление:

```bash
# Установить все зависимости
npm install

# Проверить, что папка node_modules создана
ls node_modules/express

# Запустить сервер
npm run server
```

---

### ❌ Ошибка 4.3 – Ошибка синтаксиса в server.js

**Описание:** Случайно отредактировали файл и допустили синтаксическую ошибку.

#### 📸 Скрин ошибки (терминал):
```
Terminal: PowerShell
> npm run server

> etiquette-book@1.0.0 server
> node server.js

/home/server.js:42
    const PORT = process.env.PORT || 7778
                                      ^^^^
SyntaxError: Unexpected token }
    at wrapSyntaxError (internal/errors.js:...)
```

#### ✅ Исправление:

**Шаг 1:** Открыть `server.js` и найти ошибку (строка 42)

```javascript
// ❌ ОШИБКА: закрывающая скобка не совпадает
const PORT = process.env.PORT || 7778
}

// ✅ ИСПРАВЛЕНИЕ: удалить лишнюю скобку
const PORT = process.env.PORT || 7778;
```

**Шаг 2:** Проверить синтаксис перед запуском:
```bash
node -c server.js
# Если ошибок нет, вывода не будет. Если есть — покажет ошибку.
```

**Шаг 3:** Запустить сервер:
```bash
npm run server
```

---

## Часть 5️⃣: РАЗРАБОТКА И VITE

### ❌ Ошибка 5.1 – Порт 5173 для Vite уже занят

**Описание:** При одновременном запуске сервера и Vite конфликт портов.

#### 📸 Скрин ошибки (терминал 1):
```
Terminal: PowerShell
> npm run dev

  VITE v7.3.1  ready in 234 ms

Port 5173 is already in use, trying another one...
Port 5174 is already in use, trying another one...

➜  Local:   http://localhost:5175/
➜  press h + enter to show help
```

#### ✅ Исправление:

**Вариант 1: Позволить Vite выбрать другой порт**

Это нормально! Vite автоматически выберет свободный порт (5174, 5175 и т.д.).

**Вариант 2: Явно указать порт в vite.config.js**

```javascript
// vite.config.js
export default {
  server: {
    port: 5175,  // Явно указать порт
    host: 'localhost'
  }
}
```

**Вариант 3: Использовать `npm start` для запуска обоих одновременно**

```bash
npm start
# Запустит и сервер и Vite через concurrently
```

---

### ❌ Ошибка 5.2 – CORS ошибка между фронтом и сервером

**Описание:** Фронтенд на `localhost:5173` не может обратиться к серверу на `localhost:7778`.

#### 📸 Скрин ошибки (браузер консоль):
```
GET http://localhost:7778/api/pages 

CORS error: 
Access to XMLHttpRequest at 'http://localhost:7778/api/pages' 
from origin 'http://localhost:5173' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

#### ✅ Исправление:

**Шаг 1:** Проверить, что CORS настроен в `server.js`:

```javascript
// server.js
const cors = require('cors');
const app = express();

// Включить CORS для всех происхождений (локально)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

**Шаг 2:** Убедиться, что CORS подключен до других middleware:

```javascript
// ✅ ПРАВИЛЬНО
app.use(cors(...));
app.use(helmet());
app.use(express.json());

// ❌ НЕПРАВИЛЬНО
app.use(helmet());
app.use(express.json());
app.use(cors(...));  // Слишком поздно!
```

**Шаг 3:** Перезапустить сервер:

```bash
npm run server
```

---

### ❌ Ошибка 5.3 – Изменения в коде не отражаются (HMR не работает)

**Описание:** Отредактировали файл, но изменения не видны в браузере.

#### 📸 Скрин ошибки (браузер консоль):
```
Vite client warning:
[vite] connection lost and attempting to reconnect...

Network request failed: http://localhost:5173/@vite/client
(The server is probably down)
```

#### ✅ Исправление:

**Вариант 1: Перезагрузить браузер**
```
Ctrl + Shift + R  (полная очистка кэша браузера)
```

**Вариант 2: Перезапустить Vite**
```bash
# В терминале где запущен Vite:
# Нажать: q, затем Enter

# Затем снова:
npm run dev
```

**Вариант 3: Проверить firewall**

Убедиться, что firewall не блокирует WebSocket соединение на порту 5173.

---

## Часть 6️⃣: ПРОБЛЕМЫ С API И АУТЕНТИФИКАЦИЕЙ

### ❌ Ошибка 6.1 – JWT токен истёк (Unauthorized)

**Описание:** После некоторого времени вы вышли из админ-панели.

#### 📸 Скрин ошибки (браузер консоль):
```
POST /api/pages 401 Unauthorized

{
  "error": "Token expired"
}

[AdminPanel] Redirecting to login...
```

#### ✅ Исправление:

Это нормальное поведение! Токен действует 8 часов (JWT_EXPIRES_IN=8h).

**Решение:** Переlogиниться в админ-панель:

```bash
# В браузере:
1. Откройте http://localhost:7778/admin
2. Нажмите "Logout" (если нужно вернуться в начало)
3. Заново введите пароль администратора
4. Получите новый токен
```

**Для тестирования длинных сессий**, изменить время в `admin.env`:

```env
JWT_EXPIRES_IN=24h  # Вместо 8h
```

---

### ❌ Ошибка 6.2 – Неверный пароль при входе в админ

**Описание:** Пароль не подходит, хотя вы уверены в его правильности.

#### 📸 Скрин ошибки (браузер консоль):
```
POST /api/auth/login 401 Unauthorized

{
  "error": "Invalid credentials"
}
```

#### ✅ Исправление:

**Шаг 1:** Сбросить пароль

Пароль по умолчанию в проекте: `admin123`

```bash
# Если забыли пароль, сгенерировать новый хэш
node -e "const b=require('bcryptjs');console.log(b.hashSync('новый_пароль', 10))"
```

**Шаг 2:** Обновить `admin.env`:

```env
ADMIN_PASSWORD_HASH=$2b$10$XyZ1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z
```

**Шаг 3:** Перезапустить сервер:

```bash
npm run server
```

**Шаг 4:** Войти с новым пассом в браузере:

```
Username: admin123
Password: новый_пароль
```

---

### ❌ Ошибка 6.3 – 404 ошибка при запросе к API

**Описание:** Эндпоинт `/api/pages` возвращает 404.

#### 📸 Скрин ошибки (браузер консоль):
```
GET /api/pages 404 Not Found

{
  "error": "Not Found"
}
```

#### ✅ Исправление:

**Шаг 1:** Проверить, запущен ли сервер

```bash
# В отдельном терминале:
curl http://localhost:7778/api/pages

# Если ошибка "Connection refused" — сервер не запущен!
npm run server
```

**Шаг 2:** Проверить правильность URL

В браузере перейти на:
```
http://localhost:7778/api/pages
```

**Шаг 3:** Если эндпоинт существует, проверить маршруты в `server.js`

```javascript
// server.js
app.get('/api/pages', (req, res) => {
  // Эндпоинт должен быть определён
  res.json({ pages: [] });
});
```

---

## Часть 7️⃣: BUILD И PRODUCTION

### ❌ Ошибка 7.1 – Build не работает (npm run build)

**Описание:** При сборке проекта появляется ошибка компиляции.

#### 📸 Скрин ошибки (терминал):
```
Terminal: PowerShell
> npm run build

> etiquette-book@1.0.0 build
> vite build

Error [ERR_MODULE_NOT_FOUND]: Cannot find module './pages'
  at [eval]:1:25
  at ModuleLoader.load (internal/modules/esm/loader.js:...)

[ERROR] Failed to resolve entry point '/dist'.
```

#### ✅ Исправление:

**Шаг 1:** Проверить наличие исходных файлов

```bash
# Убедиться, что существуют:
ls -la public/
ls -la public/pages/

# Если файлов нет, создать их или восстановить из git:
git checkout public/
```

**Шаг 2:** Проверить vite.config.js

```javascript
// vite.config.js
export default {
  root: 'public',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  }
}
```

**Шаг 3:** Очистить кэш и повторить build

```bash
rm -r dist/
npm run build
```

**Успешный build:**
```
✓ 234 modules transformed.
✓ built in 5.23s

dist/index.html              2.34 kb
dist/assets/index-abc123.js  456.78 kb
dist/assets/index-def456.css 89.12 kb
```

---

### ❌ Ошибка 7.2 – dist папка не создаётся

**Описание:** После `npm run build` папка `dist` не появилась.

#### 📸 Скрин ошибки (терминал):
```
Terminal: PowerShell
> npm run build
> vite build

✓ built in 3.21s

> ls dist/
ls : The term 'ls' is not recognized...

# Или в PowerShell:
> Get-ChildItem dist

Get-ChildItem : Cannot find path... does not exist.
```

#### ✅ Исправление:

**Шаг 1:** Проверить, создана ли папка dist

```bash
# На Windows (PowerShell):
dir dist/

# На macOS/Linux:
ls -la dist/
```

**Шаг 2:** Если папки нет, проверить vite.config.js

```javascript
// vite.config.js — должна быть конфигурация для build
export default {
  build: {
    outDir: '../dist',  // Указываем выходную папку
    emptyOutDir: true
  }
}
```

**Шаг 3:** Убедиться, что есть файлы для сборки

```bash
# Должны быть в public/:
ls public/index.html
ls public/styles/
ls public/scripts/
```

**Шаг 4:** Пересобрать

```bash
rm -r dist/
npm run build
```

---

## Часть 8️⃣: DEPLOYMENT И ФИНАЛЬНАЯ ОТЛАДКА

### ❌ Ошибка 8.1 – Проект не работает на Render.com

**Описание:** Деплой прошёл, но приложение падает или выдаёт 500 ошку.

#### 📸 Скрин ошибки (Render логи):
```
[render.com] Build completed
[render.com] Starting service...

Error: listen EACCES: permission denied :::7778
[render.com] Service exited with status 1
```

#### ✅ Исправление:

**Причина 1: PORT не установлена в Render**

На Render.com параметр PORT устанавливается автоматически. Проверить `server.js`:

```javascript
// ✅ ПРАВИЛЬНО
const PORT = process.env.PORT || 7778;

// HOST должен быть 0.0.0.0 для публичного доступа
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
```

**Причина 2: JWT_SECRET не установлена**

В Dashboard Render.com добавить переменные окружения:

```
JWT_SECRET = <генерируем новый: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" >
ADMIN_USERNAME = admin123
ADMIN_PASSWORD_HASH = <скопировать из admin.env>
JWT_EXPIRES_IN = 8h
```

**Причина 3: Файл .gitignore исключил нужные файлы**

Убедиться, что public/ и остальные файлы НЕ в .gitignore:

```bash
# .gitignore — правильно
admin.env          # ✅ Секреты
node_modules/      # ✅ Зависимости
dist/              # ✅ Сгенерированное
.env               # ✅ Локальные переменные

# ❌ НЕПРАВИЛЬНО:
# public/          # Это исходники, нужны!
# server.js        # Это исходники, нужны!
```

---

### ❌ Ошибка 8.2 – Статические файлы не загружаются на Render

**Описание:** На Render HTML загружается, но CSS/JS не применяются (ошибка 404).

#### 📸 Скрин ошибки (браузер):
```
GET http://example.render.com/styles/index.css 404 Not Found
GET http://example.render.com/scripts/index.js 404 Not Found

Страница выглядит сломанной, без стилей и функциональности
```

#### ✅ Исправление:

**Шаг 1:** Убедиться, что public/ папка коммитена в git

```bash
# Проверить, что файлы есть:
git ls-files | grep "public/"

# Должно быть много файлов!
# public/index.html
# public/styles/index.css
# public/scripts/index.js
# и т.д.
```

**Шаг 2:** Если файлов нет, добавить их:

```bash
# Может быть, public/ был в .gitignore?
grep "public/" .gitignore
# Если есть — удалить эту строку

# Добавить файлы:
git add public/
git commit -m "Add public folder with static files"
git push origin main
```

**Шаг 3:** На Render.com переразвернуть:

```
Dashboard → [Ваш Service] → Manual Deploy → Deploy
```

---

### ❌ Ошибка 8.3 – Администратор не может авторизоваться на Render

**Описание:** Админ-панель доступна, но пароль не подходит.

#### 📸 Скрин ошибки:
```
POST https://example.render.com/api/auth/login 401 Unauthorized

{
  "error": "Invalid credentials"
}
```

#### ✅ Исправление:

**Шаг 1:** На Render.com, в Dashboard, установить переменные:

```
ADMIN_USERNAME = admin123
ADMIN_PASSWORD_HASH = $2b$10$c6Dm8gZ/A4AghtEEtF6qPeTuXuxfSgGOaJAUXelH5cQ.2CB.Txpem
(это хэш пароля "admin123")
```

**Шаг 2:** Если забыли пароль, сгенерировать новый хэш:

**Локально:**
```bash
node -e "const b=require('bcryptjs');console.log(b.hashSync('новый_пароль', 10))"
```

Скопировать вывод и вставить в Render Dashboard.

**Шаг 3:** Restart Web Service на Render.com

```
Dashboard → [Сервис] → Manual Restart
```

---

## 📋 КРАТКАЯ ШПАРГАЛКА ПО РЕШЕНИЮ ОШИБОК

| Ошибка | Команда исправления |
|--------|-------------------|
| Node.js < 18 | Установить Node.js 20+ с nodejs.org |
| npm ошибки | `npm cache clean --force && rm -r node_modules && npm install` |
| Port занят | `netstat -ano \| findstr :7778` (Windows) → `taskkill /PID <PID> /F` |
| JWT_SECRET не установлена | Заполнить `admin.env` или переменные на Render |
| CORS ошибка | Убедиться, что `app.use(cors())` в начале `server.js` |
| Build не работает | `rm -r dist/ && npm run build` |
| Vite не обновляется | `Ctrl+Shift+R` в браузере или перезапустить `npm run dev` |
| HMR не работает | Проверить firewall блокирует ли WebSocket на порту 5173 |
| Токен истёк | Переlogиниться в админ-панель |

---

## 🎓 ИТОГОВЫЙ ПРОЦЕСС ДЛЯ ДИПЛОМА

### Шаг за шагом от начала:

1. **Инициализация:**
   ```bash
   node --version  # >= 18
   npm install
   ```

2. **Конфигурация:**
   ```bash
   # Создать/заполнить admin.env
   # JWT_SECRET, ADMIN_PASSWORD_HASH и т.д.
   ```

3. **Запуск:**
   ```bash
   npm run server        # Терминал 1
   npm run dev           # Терминал 2
   # Или: npm start      # Оба сразу
   ```

4. **Разработка:**
   - Открыть http://localhost:5173
   - Отредактировать файлы
   - Изменения должны обновиться автоматически (HMR)

5. **Тестирование:**
   - Админ-панель: http://localhost:7778/admin
   - API: http://localhost:7778/api/*

6. **Build:**
   ```bash
   npm run build
   ```

7. **Деплой на Render.com:**
   - Push в GitHub
   - Connectить репозиторий к Render
   - Установить переменные окружения
   - Render автоматически deploy-нет

---

**Документ составлен для дипломного проекта.**  
**Версия: 1.0**  
**Дата: 27.04.2026**
