// Данные о стилях одежды
const stylesData = [
  {
    number: "01 / 05",
    title: "Business Formal",
    en: "Строгий официальный стиль",
    desc: "Наивысший уровень делового дресс-кода. Используется там, где статус и протокол стоят на первом месте.",
    tags: ["Переговоры высокого уровня", "Государственные структуры", "Дипломатические встречи", "Официальные мероприятия"],
    feeling: "Статус · Строгость · Высокий уровень",
    img: "/images/style-formal.png",
    direction: "normal",
    type: "normal"
  },
  {
    number: "02 / 05",
    title: "Business Professional",
    en: "Классический деловой стиль",
    desc: "Стандарт корпоративной среды. Подходит для ежедневной офисной работы, деловых встреч и руководящих позиций.",
    tags: ["Офис и корпоративная среда", "Руководители", "Деловые встречи", "Собеседования"],
    feeling: "Профессионализм · Уверенность · Аккуратность",
    img: "/images/style-professional.png",
    direction: "reverse",
    type: "normal"
  },
  {
    number: "03 / 05",
    title: "Business Casual",
    en: "Повседневный деловой стиль",
    desc: "Баланс между профессиональным видом и комфортом. Допустим в современных офисах с неформальной культурой.",
    tags: ["Рабочие будни", "Внутренние встречи", "Творческая среда", "Корпоративы"],
    feeling: "Комфорт · Деловой вид · Баланс",
    img: "/images/style-casual.png",
    direction: "normal",
    type: "normal"
  },
  {
    number: "04 / 05",
    title: "Национальный деловой стиль",
    en: "Казахстан · Деловой этикет",
    desc: "Сочетание классического делового костюма с элементами казахской культуры. Выражает уважение к национальной идентичности в профессиональном контексте.",
    tags: ["Государственные мероприятия", "Дипломатические встречи", "Культурные форумы", "Национальные праздники", "Международные делегации"],
    feeling: "Культура · Достоинство · Официальность",
    img: "/images/style-national.png",
    direction: "reverse",
    type: "kz"
  }
];

// Данные для блока "Недопустимый стиль"
const wrongStyle = {
  number: "05 / 05",
  title: "Недопустимый стиль",
  en: "Как не нужно выглядеть",
  desc: "Спортивная одежда, яркие принты, неаккуратный вид — всё это разрушает первое впечатление и сигнализирует о неуважении к деловой среде.",
  tags: ["Спортивная одежда", "Яркие кричащие цвета", "Открытая одежда", "Рваные джинсы", "Пляжная обувь"],
  feeling: "Несерьёзно · Непрофессионально · Неуместно",
  img: "/images/style-wrong.png",
  direction: "normal",
  type: "wrong"
};

// Функция создания карточки
function createCard(data, index) {
  const card = document.createElement('div');
  card.className = `style-card ${data.direction}`;
  if (data.type === 'wrong') card.classList.add('wrong');
  if (data.type === 'kz') card.classList.add('kz');

  card.innerHTML = `
    <div class="card-photo">
      <img src="${data.img}" alt="${data.title}" onerror="this.src='/images/placeholder.png'">
    </div>
    <div class="card-info">
      <div class="card-number">${data.number}</div>
      <div>
        <div class="card-title">${data.title}</div>
        <div class="card-en">${data.en}</div>
      </div>
      <p class="card-desc">${data.desc}</p>
      <div class="card-tags">
        ${data.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
      </div>
      <div class="card-feeling">
        <div class="feeling-dot"></div>
        <span class="feeling-text">${data.feeling}</span>
      </div>
    </div>
  `;

  return card;
}

// Рендер всей страницы
function renderPage() {
  const container = document.getElementById('styles-wrap');
  if (!container) return;

  // Очищаем контейнер
  container.innerHTML = '';

  // Добавляем основные карточки
  stylesData.forEach((data, index) => {
    container.appendChild(createCard(data, index));
  });

  // Добавляем разделитель
  const divider = document.createElement('div');
  divider.className = 'section-divider';
  divider.innerHTML = '<span>Пример нарушения дресс-кода</span>';
  container.appendChild(divider);

  // Добавляем карточку с недопустимым стилем
  container.appendChild(createCard(wrongStyle, stylesData.length));
}

// Запускаем рендер после загрузки страницы
document.addEventListener('DOMContentLoaded', renderPage);