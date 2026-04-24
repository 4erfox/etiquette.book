# Архитектура проекта etiquette-book

## 📋 Обзор
Это полнофункциональный гайд по деловому этикету в Казахстане с админ-панелью для управления контентом. Система построена на:
- **Frontend**: Vite + vanilla JS (React Components, framer-motion для анимаций)
- **Backend**: Node.js + WebSocket (real-time синхронизация с админ-панелью)
- **Deploy**: Vercel

---

## 🏗️ Структура проекта

```
📦 Root
├── 📄 package.json              # Основные зависимости (Vite, React, WebSocket)
├── 📄 vite.config.js            # Конфиг Vite с кастомным плагином для .md файлов
├── 📄 admin-server.js           # WebSocket сервер для админ-панели (Node.js)
├── 📄 generate-pages.js         # Генератор HTML заглушек из .md файлов
├── 📄 admin-config.json         # Конфиг админ панели
├── 📄 vercel.json               # Конфиг для деплоя на Vercel
│
├── 📁 public/                   # Статика (раздача через Vite)
│   ├── 📄 index.html            # Главная страница
│   ├── 📄 page.html             # Шаблон для всех страниц контента
│   ├── 📁 data/                 # JSON данные
│   │   ├── 📄 nav.json          # Структура навигации
│   │   └── 📄 contacts.json     # Контакты (управляется админкой)
│   ├── 📁 docs/                 # Markdown исходники
│   │   ├── 📄 why-needed.md
│   │   ├── 📄 greetings-introductions.md
│   │   ├── 📄 business-attire.md
│   │   ├── 📄 email-etiquette.md
│   │   └── ... (16 статей итого)
│   ├── 📁 pages/                # Сгенерированные HTML страницы
│   │   ├── 📄 why-needed.html
│   │   ├── 📄 greetings-introductions.html
│   │   └── ... (автогенерация из docs/)
│   ├── 📁 images/               # Статические изображения
│   ├── 📁 styles/
│   │   ├── 📄 index.css         # Главные стили
│   │   └── 📄 layout.css        # Раскладка
│   ├── 📁 scripts/
│   │   ├── 📄 index.js          # Инициализация: menu, контакты, конфиг, тема
│   │   ├── 📄 md-renderer.js    # Парсинг и рендер MD → HTML
│   │   └── 📄 pages.js          # Динамическая маршрутизация
│   └── 📁 admin/                # Админ-панель (отдельное React приложение)
│       ├── 📄 admin-panel.js    # Главный компонент админки
│       ├── 📄 bridge.js         # WebSocket клиент для связи с сервером
│       ├── 📄 theme.js          # Темизация админ интерфейса
│       ├── 📄 toast.js          # Уведомления
│       ├── 📄 package.json      # Зависимости админ части
│       ├── 📁 panels/           # React компоненты админки
│       │   ├── 📄 SitePanel.js  # Редактирование конфига сайта
│       │   ├── 📄 ContactsPanel.js  # Управление контактами
│       │   ├── 📄 PagesPanel.js     # Редактирование MD файлов
│       │   └── 📄 AssetsPanel.js    # Управление статикой
│       ├── 📁 public/
│       │   └── 📁 data/
│       │       └── 📄 contacts.json # Данные для админки
│       └── 📄 README.md
```

---

## 🔄 Поток данных

### 1️⃣ **Build & Generation Phase** (Разработка)
```
.md файлы в docs/
    ↓
generate-pages.js (node generate-pages.js)
    ↓
генерирует тонкие HTML заглушки в pages/
    (каждая заглушка подключает md-renderer.js и передает slug)
```

### 2️⃣ **Frontend Rendering** (Клиент)
```
page.html загружается
    ↓
md-renderer.js:
  • Извлекает slug из URL (?p=onepage или /pages/onepage.html)
  • Компилирует .md файл
  • Парсит front matter (title, description, toc)
  • Рендерит HTML + обновляет meta-теги
  ↓
index.js:
  • Загружает nav.json (структура меню)
  • Загружает contacts.json (контакты)
  • Загружает admin-config.json (заголовок, описание)
  • Инициализирует sidebar, поиск, тему
```

### 3️⃣ **Admin Panel** (WebSocket real-time)
```
Админ обновляет контент
    ↓
admin-panel.js → bridge.js (WebSocket отправка)
    ↓
admin-server.js обрабатывает команду:
  • Обновляет .md файл в docs/
  • Обновляет contacts.json
  • Обновляет admin-config.json
  ↓
WebSocket ответ клиенту
    ↓
Фронтенд пересчитывает (fetch с ?t=timestamp для cache-busting)
```

---

## 🎯 Ключевые компоненты

### **Frontend Components**

#### `page.html`
- Универсальный шаблон для всех страниц контента
- Подключає `md-renderer.js`
- Имеет площадку для:
  - TOC (Table of Contents)
  - Контента
  - Боковой панели

#### `md-renderer.js` (50+ строк)
- Парсер markdown → HTML
- Извлекает front matter (`title`, `description`, `toc`)
- Обновляет `document.title` и мета-теги
- Обрабатывает ошибки загрузки с понятными сообщениями

#### `index.js` (40+ строк)
- Инициализация интерфейса при загрузке страницы
- Меню/сайдбар:
  - Открытие/закрытие по клику кнопки
  - Поиск по названиям страниц
- Загрузка контактов из `/data/contacts.json`
- Загрузка конфига из `/admin/admin-config.json`
- Переключение темы (light/dark)

#### `pages.js`
- Динамическая маршрутизация между страницами
- Обработка переходов без перезагрузки (if SPA mode)

### **Admin Panel** (React Components)

#### `admin-panel.js`
- Главный компонент админ-панели
- Управление разными "панелями" (вкладки)

#### `panels/SitePanel.js`
- Редактирование конфига сайта (заголовок, описание)

#### `panels/ContactsPanel.js`
- Редактиры контактов (название, ссылка, тип)

#### `panels/PagesPanel.js`
- Редактор Markdown контента (SimpleMDE)
- Выбор и сохранение страниц

#### `panels/AssetsPanel.js`
- Загрузка статики (изображения, файлы)

#### `bridge.js`
- WebSocket client
- Отправка CRUD команд на `admin-server.js`

### **Backend Server**

#### `admin-server.js` (Node.js)
- WebSocket сервер (RFC 6455, без зависимостей)
- Обработка команд:
  - `UPDATE_MD` — редактирование .md файлов
  - `SAVE_CONTACTS` — обновление contacts.json
  - `SAVE_CONFIG` — обновление admin-config.json
  - `LIST_PAGES` — список доступных страниц
- Файловые операции (fs модуль)

---

## ⚙️ Конфигурационные файлы

### `package.json`
```json
{
  "name": "etiquette-book",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vite": "^7.3.1",
    "react-router-dom": "^7.14.0",
    "framer-motion": "^12.38.0",
    "easymde": "^2.20.0",
    "lucide-react": "^1.7.0"
  }
}
```
- **Vite**: Сборка и dev сервер
- **React Router**: Навигация
- **Framer Motion**: Анимации
- **EasyMDE**: Markdown редактор в админке
- **Lucide React**: Icons библиотека

### `vite.config.js`
- Кастомный плагин `serveMdFiles`:
  - Раздает `.md` файлы как `text/plain`
  - Необходимо для фронтенда, чтобы скачивать `.md` по HTTP
  - Добавляет `Cache-Control: no-cache` для разработки

### `vercel.json`
- Конфиг деплоя на Vercel
- Маршрутизация (rewrites для SPA)

### `admin-config.json`
```json
{
  "siteTitle": "Деловой этикет в Казахстане",
  "siteDescription": "...",
  "port": 3001
}
```

---

## 🚀 Workflow разработки

### Добавление новой страницы

1. **Создать `.md` файл** в `public/docs/`
   ```markdown
   ---
   title: "Заголовок страницы"
   description: "SEO описание"
   ---
   # Содержание
   ```

2. **Генерировать HTML** заглушку
   ```bash
   node generate-pages.js
   ```

3. **Добавить в навигацию** (`public/data/nav.json`)
   ```json
   {
     "title": "Название",
     "slug": "имя-без-расширения"
   }
   ```

4. **Запустить dev сервер**
   ```bash
   npm run dev
   ```

### Редактирование контента (через админку)

1. **Запустить WebSocket сервер**
   ```bash
   node admin-server.js
   ```

2. **Открыть админ-панель** (обычно `http://localhost:3000/admin/`)

3. **Отредактировать в PagesPanel** → сохранить

4. **Фронтенд обновляется** автоматически (WebSocket → fetch с cache-busting)

---

## 🔌 Зависимости и версии

| Пакет | Версия | Назначение |
|-------|--------|-----------|
| `vite` | ^7.3.1 | Сборка и dev сервер |
| `react-router-dom` | ^7.14.0 | Маршрутизация |
| `framer-motion` | ^12.38.0 | Анимации |
| `easymde` | ^2.20.0 | Markdown редактор |
| `lucide-react` | ^1.7.0 | Icons |
| `js-beautify` | ^1.15.4 | Форматирование кода |
| `ws` | ^8.20.0 | WebSocket (для админ-панели) |

**Node requirement**: >= 18.0.0

---

## 📝 Front Matter формат

Каждый `.md` файл начинается с front matter:
```yaml
---
title: "Заголовок страницы"
description: "Короткое описание для SEO и мета-тегов"
keywords: "ключевые,слова"
author: "Автор"
---
```

---

## 🎨 Стили и темы

- **index.css** — Основные стили (переменные CSS, reset)
- **layout.css** — Сетка, боковая панель, типография
- **theme.js** (админка) — Переключение light/dark темы

---

## 🔐 Data Flow Security

- ✅ WebSocket отправляет JSON
- ✅ admin-server.js валидирует команды перед fs операциями
- ✅ Файлы сохраняются только в `/public/docs/`, `/data/`
- ⚠️ В production нужна аутентификация перед подключением к WebSocket

---

## 📦 Build Output

```bash
npm run build
```

Генерирует:
- `dist/` с индексом HTML
- Все JS бандлы (Vite оптимизирует)
- CSS (минифицирован)
- Images (если обработаны в конфиге)

---

## 🎯 Ключевые особенности

✅ **Markdown-based CMS** — Контент в версионной системе  
✅ **Real-time sync** — WebSocket между админкой и фронтендом  
✅ **No Build on Deploy** — Вайт запускается на Vercel как обычный Node app  
✅ **SEO Friendly** — Динамические мета-теги, sitemap возможен  
✅ **Offline Ready** — Front matter парсится клиентом, может быть кэширован  
✅ **Mobile Responsive** — CSS Grid, flexbox, адаптивные шрифты  

---

## 💡 Для ИИ помощников

Когда вас попросят что-то делать в этом проекте:

1. **Добавление статей** → Создать `.md` в `docs/`, запустить `generate-pages.js`
2. **Изменение стилей** → Редактировать `index.css` или `layout.css`
3. **Новый функционал на фронте** → Добавить скрипт в `scripts/` или React компонент
4. **Новый функционал в админке** → Создать React компонент в `admin/panels/`
5. **Новую команду WebSocket** → Добавить handler в `admin-server.js` и client в `bridge.js`

**Правило**: Всегда после изменений `.md` запускать `generate-pages.js`
