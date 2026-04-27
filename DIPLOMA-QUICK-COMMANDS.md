# ⚡ БЫСТРАЯ КОМАНДА: ВОСПРОИЗВЕДЕНИЕ ОШИБОК ДЛЯ ДИПЛОМА

**Для нетерпеливых: все команды для создания ошибок в одном файле**

---

## 🚀 ИНСТРУКЦИЯ: КАК ИСПОЛЬЗОВАТЬ

1. Скопируйте команду из нужной секции
2. Вставьте в PowerShell/Terminal
3. Должна появиться ошибка
4. Заскринить (Win + Shift + S)
5. Выполнить команду исправления
6. Заскринить успех

---

## 1️⃣ ОШИБКА: ВЕРСИЯ NODE.JS < 18

```bash
# Проверить текущую версию
node --version

# Если >= 18, эмулировать ошибку:
# Отредактировать package.json:
#   "engines": { "node": ">=22.0.0" }

# Попытаться установить:
npm install

# ❌ ОШИБКА: npm ERR! The engines in this package require node >=22.0.0
```

### Исправление:
```bash
# Вернуть package.json
# "engines": { "node": ">=18.0.0" }

npm install
# ✅ ГОТОВО
```

---

## 2️⃣ ОШИБКА: ПОВРЕЖДЁННЫЙ PACKAGE-LOCK.JSON

```bash
# Создать ошибку: удалить и переустановить
rm -r node_modules
rm package-lock.json
npm install --no-save some-random-package

# Внутри процесса может появиться ошибка синтаксиса JSON

# Исправить:
rm -r node_modules
rm package-lock.json
npm cache clean --force
npm install

# ✅ ГОТОВО
```

---

## 3️⃣ ОШИБКА: JWT_SECRET НЕ УСТАНОВЛЕНА

```bash
# Создать ошибку: отредактировать admin.env
# JWT_SECRET=        (пусто)

# Запустить сервер:
npm run server

# ❌ ОШИБКА в терминале: "❌  Задай JWT_SECRET в переменных окружения Render!"

# Исправление: сгенерировать ключ
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Скопировать вывод в admin.env:
# JWT_SECRET=<вставить_вывод_выше>

npm run server
# ✅ ГОТОВО
```

---

## 4️⃣ ОШИБКА: ADMIN_PASSWORD_HASH НЕ ПРАВИЛЬНА

```bash
# Создать ошибку: установить неправильный хэш
# В admin.env:
# ADMIN_PASSWORD_HASH=$2b$10$INVALID_HASH_12345

npm run server

# Открыть браузер: http://localhost:7778/admin
# Попытаться залогиниться: admin123 / admin123
# ❌ ОШИБКА: "Invalid credentials"

# Исправление: сгенерировать хэш
node -e "const b=require('bcryptjs');console.log(b.hashSync('admin123', 10))"

# Скопировать в admin.env:
# ADMIN_PASSWORD_HASH=<вставить_выше>

npm run server
# Заново залогиниться
# ✅ ГОТОВО
```

---

## 5️⃣ ОШИБКА: КОНФЛИКТ ВЕРСИЙ NPM

```bash
# Создать ошибку: установить несовместимые версии
npm install express@4.16.0 --save

# ❌ ОШИБКА: "peer express@..." несовместимость

# Исправления (выбрать один):

# Вариант 1: Легкое исправление
npm install --legacy-peer-deps

# Вариант 2: Обновить пакеты
npm update
npm install express@latest --save

# Вариант 3: Полная переустановка
npm cache clean --force
rm -r node_modules
npm install --legacy-peer-deps

# ✅ ГОТОВО
```

---

## 6️⃣ ОШИБКА: ПОРТ УЖЕ ЗАНЯТ

```bash
# Создать ошибку: запустить сервер дважды

# Терминал 1:
npm run server

# Терминал 2 (пока первый запущен):
npm run server

# ❌ ОШИБКА: "Error: listen EADDRINUSE: address already in use :::7778"

# Исправление вариант 1 (завершить процесс):

# Windows PowerShell:
netstat -ano | findstr :7778
# Найти PID (например 5234)
taskkill /PID 5234 /F

# macOS/Linux:
lsof -i :7778
kill -9 12345

# Запустить снова:
npm run server
# ✅ ГОТОВО

# Исправление вариант 2 (другой порт):
# В admin.env:
# PORT=7779

PORT=7779 npm run server
# ✅ ГОТОВО
```

---

## 7️⃣ ОШИБКА: МОДУЛЬ EXPRESS НЕ НАЙДЕН

```bash
# Создать ошибку: удалить node_modules
rm -r node_modules

# Запустить сервер:
npm run server

# ❌ ОШИБКА: "Error: Cannot find module 'express'"

# Исправление:
npm install

# Проверить:
npm run server
# ✅ ГОТОВО
```

---

## 8️⃣ ОШИБКА: СИНТАКСИЧЕСКАЯ ОШИБКА В КОДЕ

```bash
# Создать ошибку: отредактировать public/scripts/index.js
# Добавить ошибку:
# console.log('test'  // забыли закрыть скобку

# Запустить build:
npm run build

# ❌ ОШИБКА: "Parse error" или "Expected ')'"

# Исправление:
# Открыть файл и исправить:
# console.log('test')  // ✅ закрыли скобку

# Проверить синтаксис:
node -c public/scripts/index.js
# Если нет ошибок — ничего не выведет

# Build:
npm run build
# ✅ ГОТОВО
```

---

## 9️⃣ ОШИБКА: CORS БЛОКИРУЕТ ЗАПРОС

```bash
# Создать ошибку: отредактировать server.js
# Закомментировать:
# // app.use(cors({...}));

npm run server

# Открыть браузер http://localhost:5173
# Открыть консоль (F12)
# Выполнить:
// fetch('http://localhost:7778/api/pages')
//   .then(r => r.json())

# ❌ ОШИБКА в консоли: "CORS error: No 'Access-Control-Allow-Origin' header"

# Исправление: раскомментировать CORS
# В server.js найти и раскомментировать:
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

npm run server

# Повторить запрос в консоли:
// fetch('http://localhost:7778/api/pages')
//   .then(r => r.json())
//   .then(d => console.log(d))

# ✅ Данные загрузились!
```

---

## 🔟 ОШИБКА: JWT ТОКЕН ИСТЁК

```bash
# Это естественное поведение!
# Токен действует 8 часов (JWT_EXPIRES_IN=8h)

# Чтобы заскринить:

# Шаг 1: Залогиниться в админ-панели
# http://localhost:7778/admin
# admin123 / admin123

# Скрин 1: Админ-панель работает ✅

# Шаг 2 (дождаться или изменить настройку):
# Для быстрого тестирования, изменить в admin.env:
# JWT_EXPIRES_IN=1m  (вместо 8h)

npm run server

# Заново залогиниться
# Подождать 1 минуту...

# Попытаться выполнить действие:
# Например, отправить форму

# ❌ ОШИБКА: "Token expired" в консоли браузера

# Скрин 3: Показать, что сессия завершилась

# Исправление:
# Переlogиниться (введите пароль снова)

# Вернуть нормальное время в admin.env:
# JWT_EXPIRES_IN=8h

npm run server
```

---

## 🆘 ОШИБКА: BUILD НЕ РАБОТАЕТ (dist не создаётся)

```bash
# Создать ошибку: удалить файл для build
rm public/index.html

npm run build

# ❌ ОШИБКА: "Entry point '/public/index.html' does not exist"

# Исправление:
git checkout public/index.html

npm run build

# ✅ ГОТОВО, dist/ создана
```

---

## 🎬 ОШИБКА: НЕДОСТАТОЧНО ПАМЯТИ ПРИ npm install

```bash
# Создать ошибку (на слабых ПК):
npm install

# ❌ ОШИБКА: "FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed"

# Исправление:
# Windows PowerShell:
$env:NODE_OPTIONS = "--max-old-space-size=4096"
npm install

# macOS/Linux:
export NODE_OPTIONS="--max-old-space-size=4096"
npm install

# Или напрямую:
node --max-old-space-size=4096 ./node_modules/.bin/npm install

# ✅ ГОТОВО
```

---

## 📦 ОШИБКА: ПРОБЛЕМА НА RENDER.COM (деплой)

```bash
# Создать сценарий:

# Шаг 1: Убедиться, что public/ в git
git ls-files | grep "public/"
# Должно быть много файлов

# Если нет:
git add public/
git commit -m "Add public folder"
git push

# Шаг 2: На Render.com Dashboard добавить переменные:
# JWT_SECRET = (сгенерировать новый)
# ADMIN_USERNAME = admin123
# ADMIN_PASSWORD_HASH = (скопировать из admin.env)
# JWT_EXPIRES_IN = 8h

# Шаг 3: Нажать "Deploy" на Render

# ❌ ОШИБКА (если есть):
# - "listen EACCES" → PORT не установлена (но Render сама её устанавливает)
# - "404 Not Found" → public/ не в git
# - "Invalid credentials" → PASSWORD_HASH неверна

# Исправления:
# 1. Проверить public/ в git
# 2. Проверить переменные в Render Dashboard
# 3. Нажать "Manual Restart" на Render

# ✅ ГОТОВО
```

---

## 🎓 ИТОГОВЫЙ ЧЕКЛИСТ

Для полного набора ошибок выполнить:

```bash
# Инициализация (посмотреть версию)
node --version

# Конфигурация
# Отредактировать admin.env (разные варианты)

# Установка зависимостей
npm install
npm install --legacy-peer-deps

# Запуск сервера (разные ошибки)
npm run server

# Запуск фронтенда
npm run dev

# Build
npm run build

# API тестирование (в браузере F12)
fetch('http://localhost:7778/api/pages')

# Деплой (если нужно)
# Push в GitHub
# Render.com Dashboard
```

---

## 💾 СОХРАНЕНИЕ СКРИНШОТОВ

**Структура для сохранения:**

```
DIPLOMA-SCREENSHOTS/
├── 01-node-version-error.png
├── 01-node-version-fixed.png
├── 02-jwt-secret-error.png
├── 02-jwt-secret-fixed.png
├── 03-port-busy-error.png
├── 03-port-busy-fixed.png
├── 04-express-not-found-error.png
├── 04-express-not-found-fixed.png
├── 05-cors-error.png
├── 05-cors-fixed.png
├── 06-password-error.png
├── 06-password-fixed.png
├── 07-build-error.png
├── 07-build-fixed.png
├── 08-render-error.png
└── 08-render-fixed.png
```

---

## 📝 ГОТОВЫЙ МИНИМУМ ДЛЯ ДИПЛОМА

**Минимум 8-12 ошибок:**

1. ✅ Версия Node.js
2. ✅ JWT_SECRET
3. ✅ Пароль администратора
4. ✅ Порт занят
5. ✅ Модуль не найден
6. ✅ CORS ошибка
7. ✅ Build не работает
8. ✅ Деплой на Render

**Для каждой:**
- Ошибка (скрин терминала или браузера)
- Исправление (код или команда)
- Успешный результат (скрин)

**Время на весь процесс:** ~2-3 часа (создание скриншотов и документирование)

---

**Этот файл — быстрая справка для воспроизведения всех ошибок.**

Удачи! 🚀
