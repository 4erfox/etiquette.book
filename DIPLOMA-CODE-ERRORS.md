# 💻 ОШИБКИ В КОДЕ: ПРИМЕРЫ ДЛЯ ДИПЛОМА

**Практические примеры типичных ошибок в JavaScript с полным разбором**

---

## ПРИМЕР 1: СИНТАКСИЧЕСКАЯ ОШИБКА — ЗАБЫЛИ СКОБКУ

### 1️⃣ НОРМАЛЬНЫЙ КОД (✅ Работает)

```javascript
// public/scripts/index.js

function loadPages() {
  fetch('/api/pages')
    .then(response => response.json())
    .then(data => {
      console.log('Pages loaded:', data);
      displayPages(data);
    })
    .catch(error => {
      console.error('Error loading pages:', error);
    });
}

loadPages();
```

### 2️⃣ СЛОМАННЫЙ КОД (❌ Ошибка)

```javascript
// public/scripts/index.js

function loadPages() {
  fetch('/api/pages')
    .then(response => response.json())
    .then(data => {
      console.log('Pages loaded:', data  // ← ЗАБЫЛИ ЗАКРЫТЬ СКОБКУ!
      displayPages(data);
    })
    .catch(error => {
      console.error('Error loading pages:', error);
    });
}

loadPages();
```

**Ошибка:** Отсутствует закрывающая скобка `)` в `console.log()`

### 3️⃣ КАК СЛОМАТЬ СИСТЕМУ

```bash
# Отредактировать файл public/scripts/index.js
# Удалить закрывающую скобку на строке console.log

# Попытаться запустить
npm run dev

# ❌ ОШИБКА В КОНСОЛИ:
# Parse error in 'public/scripts/index.js'
# Expected ')'
```

### 4️⃣ ЧТО СКРИНИТЬ

**Скрин 1: Ошибка в терминале**
```
Заскринить область:
├─ Название ошибки: "Parse error"
├─ Файл: public/scripts/index.js
├─ Строка с проблемой: console.log('Pages loaded:', data
└─ Сообщение: "Expected ')'"
```

**Скрин 2: Ошибка в браузере (F12)**
```
Заскринить консоль браузера:
├─ Красная ошибка с указанием на синтаксис
├─ Файл и строка кода
└─ Приложение не работает
```

### 5️⃣ ИСПРАВЛЕНИЕ

```javascript
// public/scripts/index.js — ПРАВИЛЬНО

function loadPages() {
  fetch('/api/pages')
    .then(response => response.json())
    .then(data => {
      console.log('Pages loaded:', data);  // ✅ ЗАКРЫЛИ СКОБКУ
      displayPages(data);
    })
    .catch(error => {
      console.error('Error loading pages:', error);
    });
}

loadPages();
```

### 6️⃣ ПРОВЕРКА СИНТАКСИСА

```bash
# Проверить код перед запуском
node -c public/scripts/index.js

# Если ошибок нет — ничего не выведет (молчит = хорошо!)
# Если есть ошибки — выведет сообщение об ошибке

# Запустить приложение
npm run dev

# ✅ РАБОТАЕТ БЕЗ ОШИБОК
```

### 7️⃣ СКРИН ИСПРАВЛЕНИЯ

**Скрин 1: Исправленный код в редакторе**
```
Заскринить VS Code:
├─ Открыт файл public/scripts/index.js
├─ На строке console.log видна правильная скобка
├─ Синтаксис подсвечен правильно (зелёный)
└─ Ошибок в указателе нет
```

**Скрин 2: Успешный запуск**
```
Заскринить терминал:
├─ npm run dev
├─ ✓ Vite запущен
├─ ✓ No syntax errors
└─ ✓ http://localhost:5173
```

---

## ПРИМЕР 2: ОШИБКА ТИПОВ — UNDEFINED МЕТОД

### 1️⃣ НОРМАЛЬНЫЙ КОД (✅ Работает)

```javascript
// public/scripts/search.js

function searchPages(query) {
  if (!query || query.trim() === '') {
    return [];
  }

  const results = pages.filter(page => 
    page.title.toLowerCase().includes(query.toLowerCase())
  );

  return results;
}

const searchInput = document.getElementById('search');
searchInput.addEventListener('input', (e) => {
  const query = e.target.value;
  const results = searchPages(query);
  console.log('Search results:', results);
});
```

### 2️⃣ СЛОМАННЫЙ КОД (❌ Ошибка)

```javascript
// public/scripts/search.js

function searchPages(query) {
  // ❌ ПРОБЛЕМА: не проверяем, что pages существует
  const results = pages.filter(page => 
    page.title.toLowerCase().includes(query.toLowerCase())
  );
  
  return results;
}

// ❌ ПРОБЛЕМА: searchInput может быть null
const searchInput = document.getElementById('wrong-id');
searchInput.addEventListener('input', (e) => {  // ← ОШИБКА здесь!
  const query = e.target.value;
  const results = searchPages(query);
  console.log('Search results:', results);
});
```

**Ошибка:** `searchInput` равен `null`, потому что элемента с `wrong-id` не существует

### 3️⃣ КАК СЛОМАТЬ СИСТЕМУ

```bash
# Отредактировать public/scripts/search.js
# Изменить getElementById на неправильный ID
# Или удалить элемент из HTML

# Открыть браузер
# Открыть консоль (F12)

# ❌ ОШИБКА:
# Uncaught TypeError: Cannot read property 'addEventListener' of null
#   at search.js:15:5
```

### 4️⃣ ЧТО СКРИНИТЬ

**Скрин 1: Ошибка в консоли браузера (F12)**
```
Заскринить:
├─ Красная ошибка в консоли
├─ "TypeError: Cannot read property 'addEventListener' of null"
├─ Файл: search.js, строка 15
└─ Приложение ломается при загрузке
```

**Скрин 2: Code в редакторе**
```
Заскринить VS Code:
├─ Вот код с неправильным ID
├─ Подчеркивание красной линией (if Pylance включен)
└─ Объяснение в комментариях
```

### 5️⃣ ИСПРАВЛЕНИЕ

```javascript
// public/scripts/search.js — ПРАВИЛЬНО

function searchPages(query) {
  // ✅ Проверяем, что pages существует и это массив
  if (!Array.isArray(pages)) {
    console.warn('Pages not loaded yet');
    return [];
  }

  if (!query || query.trim() === '') {
    return [];
  }

  const results = pages.filter(page => 
    page.title.toLowerCase().includes(query.toLowerCase())
  );
  
  return results;
}

// ✅ Проверяем, что элемент существует
const searchInput = document.getElementById('search');
if (searchInput) {  // ← ПРОВЕРКА!
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value;
    const results = searchPages(query);
    console.log('Search results:', results);
  });
} else {
  console.warn('Search input element not found');
}
```

### 6️⃣ ПРОВЕРКА

```bash
# Обновить браузер (Ctrl + F5 или Cmd + Shift + R)
# Открыть консоль (F12)

# ✅ БЕЗ ОШИБОК
# ✅ Поиск работает
# ✅ При вводу текста видны результаты
```

### 7️⃣ СКРИН ИСПРАВЛЕНИЯ

**Скрин 1: Исправленный код**
```
Заскринить VS Code:
├─ Строка: const searchInput = document.getElementById('search');
├─ Строка: if (searchInput) {
├─ Проверка существования элемента
└─ Правильная обработка null
```

**Скрин 2: Консоль без ошибок**
```
Заскринить браузер F12:
├─ Нет красных ошибок
├─ Console чистая
├─ При вводу работает поиск
└─ Результаты выводятся
```

---

## ПРИМЕР 3: ОШИБКА ASYNC/AWAIT — ЗАБЫЛИ AWAIT

### 1️⃣ НОРМАЛЬНЫЙ КОД (✅ Работает)

```javascript
// public/admin/bridge.js

async function loadAdminData() {
  try {
    const token = localStorage.getItem('admin_token');
    
    // ✅ Ждём ответа с await
    const response = await fetch('/api/admin/data', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // ✅ Ждём JSON парсирования с await
    const data = await response.json();
    console.log('Admin data loaded:', data);
    
    return data;
  } catch (error) {
    console.error('Error loading admin data:', error);
    return null;
  }
}

// Использование
loadAdminData().then(data => {
  if (data) {
    console.log('Data received:', data);
  }
});
```

### 2️⃣ СЛОМАННЫЙ КОД (❌ Ошибка)

```javascript
// public/admin/bridge.js

async function loadAdminData() {
  try {
    const token = localStorage.getItem('admin_token');
    
    // ❌ ЗАБЫЛИ await — получим Promise вместо данных!
    const response = fetch('/api/admin/data', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    // ❌ response это Promise, не Response объект!
    if (!response.ok) {  // ← ОШИБКА: undefined свойство
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = response.json();  // ❌ Тоже без await
    console.log('Admin data loaded:', data);  // ← Выведет Promise, не данные!
    
    return data;  // ← Вернёт Promise, не данные
  } catch (error) {
    console.error('Error loading admin data:', error);
    return null;
  }
}

loadAdminData().then(data => {
  // ❌ data это Promise, не объект с данными!
  console.log('Data received:', data);
});
```

**Ошибка:** Забыли `await`, получили Promise вместо значения

### 3️⃣ КАК СЛОМАТЬ СИСТЕМУ

```bash
# Отредактировать public/admin/bridge.js
# Удалить await перед fetch
# Удалить await перед response.json()

# Открыть админ-панель
npm run server

# Открыть браузер
# Консоль (F12)

# ❌ ОШИБКА:
# TypeError: Cannot read property 'ok' of Promise
# Promise { <pending> }
```

### 4️⃣ ЧТО СКРИНИТЬ

**Скрин 1: Ошибка в консоли**
```
Заскринить браузер F12:
├─ Красная ошибка: "TypeError"
├─ "Cannot read property 'ok' of Promise"
├─ Вместо данных выводится: Promise { <pending> }
└─ Админ-панель не загружает данные
```

**Скрин 2: Console вывод**
```
Заскринить вывод console.log:
├─ console.log('Admin data loaded:', data)
├─ Вывод: Promise { <pending> }  (не данные!)
└─ Объяснение: забыли await
```

### 5️⃣ ИСПРАВЛЕНИЕ

```javascript
// public/admin/bridge.js — ПРАВИЛЬНО

async function loadAdminData() {
  try {
    const token = localStorage.getItem('admin_token');
    
    // ✅ ДОБАВИЛИ await — теперь получим Response объект
    const response = await fetch('/api/admin/data', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    // ✅ Теперь response.ok работает
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // ✅ ДОБАВИЛИ await — теперь получим объект данных
    const data = await response.json();
    console.log('Admin data loaded:', data);  // ← Выведет реальные данные
    
    return data;  // ← Вернёт реальные данные
  } catch (error) {
    console.error('Error loading admin data:', error);
    return null;
  }
}

// Использование
loadAdminData().then(data => {
  if (data) {
    // ✅ data это реальный объект с данными
    console.log('Data received:', data);
  }
});
```

### 6️⃣ ПРОВЕРКА

```bash
# Обновить страницу (F5)
# Открыть консоль (F12)

# ✅ БЕЗ ОШИБОК
# ✅ Данные загружаются
# ✅ Админ-панель работает
```

### 7️⃣ СКРИН ИСПРАВЛЕНИЯ

**Скрин 1: Исправленный код**
```
Заскринить VS Code:
├─ Строка: const response = await fetch(...)
├─ Строка: const data = await response.json()
├─ Оба await на месте
└─ Синтаксис правильный (Pylance зелёный)
```

**Скрин 2: Консоль с данными**
```
Заскринить браузер F12:
├─ Нет ошибок
├─ console.log вывел реальный объект
├─ Data received: {pages: Array(17), ...}
└─ Админ-панель загрузила данные успешно
```

---

## ПРИМЕР 4: ОШИБКА ОБРАБОТКИ ОШИБОК — Missing .catch()

### 1️⃣ НОРМАЛЬНЫЙ КОД (✅ Работает)

```javascript
// public/scripts/pages.js

function getPageContent(slug) {
  return fetch(`/api/pages/${slug}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Page not found: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error fetching page:', error);
      return {
        title: 'Error',
        content: 'Page could not be loaded'
      };
    });
}

// Использование с обработкой ошибок
getPageContent('business-etiquette')
  .then(data => {
    console.log('Page loaded:', data.title);
    displayPage(data);
  })
  .catch(error => {
    console.error('Unhandled error:', error);
  });
```

### 2️⃣ СЛОМАННЫЙ КОД (❌ Ошибка)

```javascript
// public/scripts/pages.js

function getPageContent(slug) {
  // ❌ Нет обработки ошибок!
  return fetch(`/api/pages/${slug}`)
    .then(response => response.json());
  // Missing .catch()!
}

// Использование БЕЗ обработки ошибок
getPageContent('non-existent-page')
  .then(data => {
    console.log('Page loaded:', data.title);
    displayPage(data);
  });
  // ❌ Нет .catch() — unhandled promise rejection!
```

**Ошибка:** Сетевая ошибка или 404 вызовет необработанный exception

### 3️⃣ КАК СЛОМАТЬ СИСТЕМУ

```bash
# Вариант 1: Запросить несуществующую страницу
# Отредактировать код выше

# Вариант 2: Отключить интернет и обновить страницу
# (Для локальной разработки выключить сервер)

# Открыть консоль браузера (F12)

# ❌ ОШИБКА:
# Uncaught (in promise) TypeError: Cannot read property 'title' of undefined
# Unhandled Promise rejection
```

### 4️⃣ ЧТО СКРИНИТЬ

**Скрин 1: Unhandled Promise Rejection**
```
Заскринить браузер F12:
├─ Вкладка "Console"
├─ Красная ошибка: "Unhandled Promise rejection"
├─ TypeError: Cannot read property 'title' of undefined
└─ На странице ничего не отображается
```

**Скрин 2: Network ошибка**
```
Заскринить вкладку Network (F12):
├─ GET /api/pages/non-existent-page
├─ Status: 404 Not Found
├─ Response пустой или с ошибкой
└─ Приложение не обрабатывает эту ошибку
```

### 5️⃣ ИСПРАВЛЕНИЕ

```javascript
// public/scripts/pages.js — ПРАВИЛЬНО

function getPageContent(slug) {
  // ✅ ДОБАВИЛИ полную обработку ошибок
  return fetch(`/api/pages/${slug}`)
    .then(response => {
      // ✅ Проверяем статус ответа
      if (!response.ok) {
        throw new Error(`Page not found: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      // ✅ Ловим и обрабатываем ошибку
      console.error('Error fetching page:', error);
      // ✅ Возвращаем fallback данные
      return {
        title: 'Error',
        content: 'Page could not be loaded. Please try again later.'
      };
    });
}

// Использование С обработкой ошибок
getPageContent('non-existent-page')
  .then(data => {
    console.log('Page result:', data.title);  // ✅ Либо реальная страница, либо error fallback
    displayPage(data);
  })
  .catch(error => {
    // ✅ Двойная защита от ошибок
    console.error('Critical error:', error);
    showErrorMessage('Failed to load page');
  });
```

### 6️⃣ ПРОВЕРКА

```bash
# Обновить страницу (F5)
# Открыть несуществующую страницу

# ✅ БЕЗ ОШИБОК
# ✅ Показывает сообщение об ошибке (fallback)
# ✅ Приложение не падает
```

### 7️⃣ СКРИН ИСПРАВЛЕНИЯ

**Скрин 1: Исправленный код**
```
Заскринить VS Code:
├─ .then(response => {...})
├─ if (!response.ok) { throw new Error(...) }
├─ .catch(error => {...})
├─ return {...} (fallback данные)
└─ Полная обработка ошибок
```

**Скрин 2: Graceful error handling**
```
Заскринить браузер:
├─ Нет ошибок в консоли
├─ На странице показано: "Error: Page could not be loaded"
├─ Пользователь видит понятное сообщение
└─ Приложение работает стабильно
```

---

## ПРИМЕР 5: ЛОГИЧЕСКАЯ ОШИБКА — Неправильное условие

### 1️⃣ НОРМАЛЬНЫЙ КОД (✅ Работает)

```javascript
// public/admin/AdminPanel.js

function checkUserPermission(role) {
  const adminRoles = ['admin', 'superadmin'];
  
  // ✅ Правильная проверка: включён ли роль в массив
  if (adminRoles.includes(role)) {
    return true;
  }
  
  return false;
}

// Использование
const userRole = 'admin';
if (checkUserPermission(userRole)) {
  console.log('✅ Access granted');
  showAdminPanel();
} else {
  console.log('❌ Access denied');
  showLoginPage();
}
```

### 2️⃣ СЛОМАННЫЙ КОД (❌ Ошибка)

```javascript
// public/admin/AdminPanel.js

function checkUserPermission(role) {
  const adminRoles = ['admin', 'superadmin'];
  
  // ❌ ОШИБКА: используем == вместо includes
  // Это никогда не будет true (role это строка, adminRoles это массив)
  if (role == adminRoles) {
    return true;
  }
  
  return false;
  
  // ИЛИ вариант 2 - неправильная логика:
  // ❌ if (role === 'admin' && role === 'superadmin')  // Никогда не true!
  // Должно быть: if (role === 'admin' || role === 'superadmin')
}

// Использование
const userRole = 'admin';
if (checkUserPermission(userRole)) {  // ← Всегда false!
  console.log('✅ Access granted');
  showAdminPanel();
} else {
  console.log('❌ Access denied');  // ← Всегда выполняется
  showLoginPage();
}
```

**Ошибка:** Неверная логика сравнения — роль никогда не совпадает с массивом

### 3️⃣ КАК СЛОМАТЬ СИСТЕМУ

```bash
# Отредактировать public/admin/AdminPanel.js
# Заменить includes() на ==
# Или изменить логику с || на &&

# Попытаться залогиниться в админ-панель
# http://localhost:7778/admin

# ❌ ОШИБКА:
# Даже с правильным пассом → "Access denied"
# Админ-панель не открывается
```

### 4️⃣ ЧТО СКРИНИТЬ

**Скрин 1: Неправильное поведение**
```
Заскринить браузер:
├─ Форма входа в админ
├─ Ввод: admin / admin123
├─ Нажимаем "Login"
├─ Вместо админ-панели → "Access denied"
└─ Но логи показывают что роль = 'admin'
```

**Скрин 2: Console логи**
```
Заскринить браузер F12:
├─ console.log('userRole:', 'admin')
├─ console.log('checkUserPermission:', false)
├─ console.log('Comparison: role == adminRoles', false)
├─ 'admin' == ['admin', 'superadmin'] → false (неправильно!)
└─ Логика ошибка очевидна
```

### 5️⃣ ИСПРАВЛЕНИЕ

```javascript
// public/admin/AdminPanel.js — ПРАВИЛЬНО

function checkUserPermission(role) {
  const adminRoles = ['admin', 'superadmin'];
  
  // ✅ Правильное сравнение: includes() для массива
  if (adminRoles.includes(role)) {
    return true;
  }
  
  return false;
  
  // ИЛИ более краткий вариант:
  // return adminRoles.includes(role);
}

// Использование
const userRole = 'admin';
if (checkUserPermission(userRole)) {  // ← Теперь true!
  console.log('✅ Access granted');
  showAdminPanel();  // ← Это выполнится
} else {
  console.log('❌ Access denied');
  showLoginPage();
}
```

### 6️⃣ ПРОВЕРКА

```bash
# Обновить страницу (F5)
# Попытаться залогиниться: admin / admin123

# ✅ БЕЗ ОШИБОК
# ✅ Админ-панель открывается
# ✅ Проверка прав работает
```

### 7️⃣ СКРИН ИСПРАВЛЕНИЯ

**Скрин 1: Исправленный код**
```
Заскринить VS Code:
├─ const adminRoles = ['admin', 'superadmin'];
├─ if (adminRoles.includes(role)) {
├─ return true;
└─ Логика правильная
```

**Скрин 2: Успешный вход**
```
Заскринить браузер:
├─ Форма входа
├─ Ввод: admin / admin123
├─ Нажимаем Login
├─ ✅ Админ-панель открывается успешно
└─ Все работает как надо
```

---

## ПРИМЕР 6: ОШИБКА ПЕРЕМЕННЫХ — Undefined переменная

### 1️⃣ НОРМАЛЬНЫЙ КОД (✅ Работает)

```javascript
// server.js

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_HASH = process.env.ADMIN_PASSWORD_HASH;

// ✅ Проверяем перед использованием
if (!JWT_SECRET) {
  console.error('❌ JWT_SECRET не установлена!');
  process.exit(1);
}

if (!ADMIN_HASH) {
  console.error('❌ ADMIN_PASSWORD_HASH не установлена!');
  process.exit(1);
}

console.log('✅ Все переменные окружения установлены');
app.listen(PORT);
```

### 2️⃣ СЛОМАННЫЙ КОД (❌ Ошибка)

```javascript
// server.js

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_HASH = process.env.ADMIN_PASSWORD_HASH;

// ❌ БЕЗ ПРОВЕРОК — используем неинициализированные переменные
console.log('Переменные:', JWT_SECRET, ADMIN_HASH);
// Вывод: undefined undefined

// ❌ Дальше ломается при использовании
const token = jwt.sign(
  { user: ADMIN_USER },
  JWT_SECRET  // ← undefined! Ошибка здесь
);

app.listen(PORT);
```

**Ошибка:** Переменные `undefined`, не проверяют перед использованием

### 3️⃣ КАК СЛОМАТЬ СИСТЕМУ

```bash
# Отредактировать server.js
# Удалить проверки if (!JWT_SECRET)
# Оставить использование undefined переменных

# Запустить сервер
npm run server

# ❌ ОШИБКА:
# Error: Cannot use undefined as secret
# jwt.sign requires non-empty string secret
```

### 4️⃣ ЧТО СКРИНИТЬ

**Скрин 1: Ошибка при запуске**
```
Заскринить терминал:
├─ npm run server
├─ console.log('Переменные:', undefined, undefined)
├─ Error: Cannot use undefined as secret
└─ Сервер не запущен
```

### 5️⃣ ИСПРАВЛЕНИЕ

```javascript
// server.js — ПРАВИЛЬНО

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_HASH = process.env.ADMIN_PASSWORD_HASH;

// ✅ ПРОВЕРЯЕМ все критические переменные
if (!JWT_SECRET || JWT_SECRET.includes('ЗАМЕНИ')) {
  console.error('❌ Задай JWT_SECRET в переменных окружения!');
  process.exit(1);
}

if (!ADMIN_HASH) {
  console.error('❌ Задай ADMIN_PASSWORD_HASH в переменных окружения!');
  process.exit(1);
}

console.log('✅ Все переменные окружения установлены');

// ✅ Теперь безопасно использовать
const token = jwt.sign(
  { user: ADMIN_USER },
  JWT_SECRET
);

app.listen(PORT);
```

### 6️⃣ ПРОВЕРКА

```bash
# Убедиться что admin.env заполнена
cat admin.env

# Должно быть:
# JWT_SECRET=<значение>
# ADMIN_PASSWORD_HASH=<хэш>

# Запустить сервер
npm run server

# ✅ БЕЗ ОШИБОК
# ✅ ✅ Все переменные окружения установлены
```

### 7️⃣ СКРИН ИСПРАВЛЕНИЯ

**Скрин 1: Исправленный код**
```
Заскринить VS Code:
├─ if (!JWT_SECRET) { ... exit(1) }
├─ if (!ADMIN_HASH) { ... exit(1) }
├─ Проверки на месте
└─ Безопасное использование
```

**Скрин 2: Успешный запуск**
```
Заскринить терминал:
├─ npm run server
├─ ✅ Все переменные окружения установлены
├─ ✅ Server running at http://0.0.0.0:7778
└─ Сервер работает нормально
```

---

## 📋 ЧЕКЛИСТ ДЛЯ СКРИНШОТИРОВАНИЯ

Для каждой ошибки скринить:

- [ ] **Исходный нормальный код** (в VS Code)
- [ ] **Сломанный код** (в VS Code с ошибкой)
- [ ] **Ошибка в терминале** (красное сообщение об ошибке)
- [ ] **Ошибка в браузере** (F12 консоль, если применимо)
- [ ] **Исправленный код** (в VS Code)
- [ ] **Успешный запуск** (в терминале или браузере)

---

## 🎬 ПОРЯДОК СОЗДАНИЯ МАТЕРИАЛА

### Шаг 1: Создание ошибки
```bash
1. Открыть файл (например public/scripts/index.js)
2. Скопировать нормальный код из примера
3. Сломать код так как описано
4. Заскринить ошибку в терминале (Ctrl + Shift + X)
```

### Шаг 2: Исправление
```bash
1. Отредактировать файл (исправить ошибку)
2. Сохранить (Ctrl + S)
3. Проверить что ошибка исчезла
4. Заскринить успех
```

### Шаг 3: Документирование
```bash
1. Создать MD файл с примером
2. Вставить скриншоты ошибки
3. Вставить скриншоты исправления
4. Написать объяснение
```

---

## 💡 СОВЕТЫ ПО СОЗДАНИЮ ОШИБОК

✅ **Делайте так:**
- Создавайте реальные ошибки, которые легко воспроизвести
- Показывайте точное сообщение об ошибке
- Объясняйте почему произошла ошибка
- Показывайте несколько способов исправления

❌ **Не делайте так:**
- Не выдумывайте ошибки, которых не будет
- Не обрезайте сообщения об ошибках
- Не показывайте только исправление без объяснения
- Не создавайте слишком сложные примеры

---

## 📸 ИНСТРУМЕНТЫ ДЛЯ СКРИНШОТОВ

**Быстро:**
- `Win + Shift + S` — встроенный инструмент Windows
- `Alt + Print Screen` — скопировать окно в буфер

**С аннотациями:**
- [Greenshot](https://getgreenshot.org/) — бесплатно, с стрелками и текстом
- [ShareX](https://getsharex.com/) — продвинуто, для профессионалов

**В VS Code:**
- `Ctrl + K Ctrl + I` — скрин целого файла или `Ctrl + Shift + P` → "Screenshot"

---

## ✨ ФИНАЛЬНЫЙ СОВЕТ

Каждая ошибка должна рассказывать историю:

1. **Проблема:** "Забыли скобку"
2. **Проявление:** "Синтаксическая ошибка в консоли"
3. **Анализ:** "Почему это произошло"
4. **Решение:** "Как исправить"
5. **Результат:** "Теперь все работает"

Это создаёт полный образовательный цикл для диплома! 🎓

---

**Используйте эти примеры как шаблоны для создания своих ошибок!**

Удачи! 🚀
