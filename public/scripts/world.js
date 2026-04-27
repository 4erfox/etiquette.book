const countries = [
  {
    id: 'kz', flag: 'kz', name: 'Казахстан', sub: 'Центральная Азия', tagline: 'Гостеприимство — закон',
    greeting: { title: 'Приветствие', value: 'Рукопожатие + имя-отчество', desc: 'Мужчины жмут руку. С женщиной — ждут её инициативы. Имя-отчество выражает уважение.' },
    distance: { title: 'Дистанция', value: 'Умеренная, тёплая', desc: 'Чрезмерная дистанция воспринимается как холодность. Личный контакт ценится.' },
    communication: { title: 'Стиль общения', value: 'Вежливый, непрямой', desc: 'Отказы смягчают. «Посмотрим» может означать «нет». Важно сохранить лицо партнёра.' },
    dos: ['Принять чай и угощение', 'Уважать старшего', 'Прийти с подарком'],
    donts: ['Отказываться от угощения', 'Торопить с решением', 'Переходить на имя сразу'],
    compare: null,
    kzSelf: [
      { label: 'Приветствие', text: 'Рукопожатие — тепло и уважение' },
      { label: 'Гостеприимство', text: 'Чай и угощение — священный ритуал' },
      { label: 'Иерархия', text: 'Уважение к старшим — базовая ценность' },
      { label: 'Время', text: 'Гибкое на неформальных встречах' }
    ]
  },
  {
    id: 'jp', flag: 'jp', name: 'Япония', sub: 'Восточная Азия', tagline: 'Ритуал важнее слов',
    greeting: { title: 'Приветствие', value: 'Поклон 15–30°', desc: 'Рукопожатие допустимо с иностранцами. Чем глубже поклон — тем больше уважения.' },
    distance: { title: 'Дистанция', value: 'Чёткая, формальная', desc: 'Физический контакт минимален. Личное пространство уважается строго.' },
    communication: { title: 'Стиль общения', value: 'Косвенный, молчание — смысл', desc: '«Немного затруднительно» — значит «нет». Пауза — знак уважения, не неловкости.' },
    dos: ['Визитку двумя руками с поклоном', 'Изучить визитку сразу', 'Приходить точно по времени'],
    donts: ['Писать на визитке', 'Убирать визитку в карман брюк', 'Перебивать собеседника'],
    compare: [
      { label: 'Приветствие', kz: 'Рукопожатие — тёплый контакт', other: 'Поклон — ритуал без касания' },
      { label: 'Пунктуальность', kz: 'Гибкая на неформальных встречах', other: 'Абсолютное правило' },
      { label: 'Подарки', kz: 'Принимают сразу и с радостью', other: 'Открывают позже, наедине' },
      { label: 'Отказ', kz: 'Могут смягчить, но сказать прямо', other: 'Никогда не говорят «нет» прямо' }
    ]
  },
  {
    id: 'us', flag: 'us', name: 'США', sub: 'Северная Америка', tagline: 'Время — деньги',
    greeting: { title: 'Приветствие', value: 'Крепкое рукопожатие', desc: 'Зрительный контакт обязателен. Улыбка — норма. Быстрый переход к имени.' },
    distance: { title: 'Дистанция', value: '60–90 см', desc: 'Личное пространство важно. Из физических контактов — только рукопожатие.' },
    communication: { title: 'Стиль общения', value: 'Прямой, оптимистичный', desc: 'Говорят то, что думают. Small talk — обязательный ритуал.' },
    dos: ['Small talk перед делом', 'Называть по имени сразу', 'Чёткая повестка встречи'],
    donts: ['Затягивать решения', 'Путать улыбку с согласием', 'Опаздывать без предупреждения'],
    compare: [
      { label: 'Small talk', kz: 'Возможен, но вторичен', other: 'Обязателен — без него нет доверия' },
      { label: 'Обращение', kz: 'Имя-отчество или титул', other: 'Имя с первой секунды' },
      { label: 'Решения', kz: 'Не торопятся, важны отношения', other: 'Быстро, чётко, по делу' },
      { label: 'Рукопожатие', kz: 'Мягкое, уважительное', other: 'Крепкое — сигнал уверенности' }
    ]
  },
  {
    id: 'de', flag: 'de', name: 'Германия', sub: 'Западная Европа', tagline: 'Порядок, точность, доверие',
    greeting: { title: 'Приветствие', value: 'Рукопожатие + Herr/Frau', desc: 'Строго по фамилии до явного разрешения. Вежливое «Sie» — обязательно.' },
    distance: { title: 'Дистанция', value: 'Чёткая, профессиональная', desc: 'Личное пространство строго соблюдается. Двойное рукопожатие — фамильярность.' },
    communication: { title: 'Стиль общения', value: 'Прямой и конкретный', desc: 'Говорят прямо. Критика — норма. Подготовленность — знак уважения.' },
    dos: ['Прийти с изученными документами', 'Придерживаться повестки', 'Подтверждать договорённости письменно'],
    donts: ['Опаздывать даже на минуту', 'Переходить на «ты» без разрешения', 'Принимать решения без подготовки'],
    compare: [
      { label: 'Пунктуальность', kz: 'Желательна, но гибкая', other: 'Абсолютный стандарт' },
      { label: 'Подготовка', kz: 'Общая, можно импровизировать', other: 'Детальная, документально' },
      { label: 'Критика', kz: 'Смягчают, берегут лицо', other: 'Прямая и конструктивная' },
      { label: 'Доверие', kz: 'Через личные отношения', other: 'Через профессионализм и точность' }
    ]
  },
  {
    id: 'ae', flag: 'ae', name: 'ОАЭ', sub: 'Ближний Восток', tagline: 'Отношения первичны',
    greeting: { title: 'Приветствие', value: 'Правая рука + взгляд', desc: 'Мужчины могут долго держать руку — это тепло. С женщиной — ждать её инициативы.' },
    distance: { title: 'Дистанция', value: 'Близкая между мужчинами', desc: 'Мужчины общаются близко. Межполовая дистанция строго соблюдается.' },
    communication: { title: 'Стиль общения', value: 'Непрямой, уважительный', desc: '«Иншаалла» может означать неопределённость. Спешить — неуважение к партнёру.' },
    dos: ['Принимать кофе и финики', 'Передавать предметы правой рукой', 'Запастись терпением'],
    donts: ['Передавать что-либо левой рукой', 'Обсуждать религию и политику', 'Торопить с ответом'],
    compare: [
      { label: 'Угощение', kz: 'Чай — священный ритуал', other: 'Кофе и финики — знак уважения' },
      { label: 'Переговоры', kz: 'Можно ускорить при доверии', other: 'Долгие — это норма' },
      { label: 'Левая рука', kz: 'Нейтральна', other: 'Табу при передаче предметов' },
      { label: 'Дресс-код', kz: 'Деловой классический', other: 'Строгий, закрытые плечи' }
    ]
  },
  {
    id: 'cn', flag: 'cn', name: 'Китай', sub: 'Восточная Азия', tagline: 'Гуаньси — связи решают всё',
    greeting: { title: 'Приветствие', value: 'Лёгкий поклон + рукопожатие', desc: 'Обращение по титулу и фамилии. Первым приветствует старший по рангу.' },
    distance: { title: 'Дистанция', value: 'Умеренная, групповая', desc: 'Личное пространство менее выражено, чем в Европе. Важен коллектив.' },
    communication: { title: 'Стиль общения', value: 'Непрямой, лицо важно', desc: 'Открытый отказ — потеря лица. Молчание и улыбка могут означать несогласие.' },
    dos: ['Визитку двумя руками', 'Дарить чай, орехи, фрукты', 'Уважать иерархию'],
    donts: ['Дарить часы — символ смерти', 'Хвалить подарок при дарящем', 'Отказываться от угощения'],
    compare: [
      { label: 'Подарки', kz: 'Ограничений меньше', other: 'Табу: часы, зелёные шляпы, груши' },
      { label: 'Банкет', kz: 'Важен, но не обязателен', other: 'Ключевая часть сделки' },
      { label: 'Отказ', kz: 'Смягчённый, но возможен', other: 'Никогда прямо — только косвенно' },
      { label: 'Визитка', kz: 'Стандартный обмен', other: 'Церемониальный ритуал двумя руками' }
    ]
  },
  {
    id: 'tr', flag: 'tr', name: 'Турция', sub: 'Евразия', tagline: 'Сначала чай, потом дело',
    greeting: { title: 'Приветствие', value: 'Тёплое рукопожатие + взгляд', desc: 'Зрительный контакт — знак честности. Чай — с первых минут встречи.' },
    distance: { title: 'Дистанция', value: 'Близкая, тёплая', desc: 'Турки общаются ближе, чем европейцы. Отодвигаться — знак холодности.' },
    communication: { title: 'Стиль общения', value: 'Эмоциональный, личный', desc: 'Бизнес строится на доверии. Сначала — личное общение, потом договор.' },
    dos: ['Принять чай обязательно', 'Интересоваться семьёй', 'Быть готовым к долгим переговорам'],
    donts: ['Переходить сразу к цифрам', 'Делать закрытые жесты', 'Критиковать Турцию'],
    compare: [
      { label: 'Чай', kz: 'Отказ — неуважение', other: 'Отказ — тоже обида' },
      { label: 'Отношения', kz: 'Через уважение к старшим', other: 'Через личное доверие и дружбу' },
      { label: 'Время', kz: 'Гибкое, терпеливое', other: 'Отношения важнее расписания' },
      { label: 'Стиль', kz: 'Формальный, уважительный', other: 'Тёплый, почти семейный' }
    ]
  },
  {
    id: 'ru', flag: 'ru', name: 'Россия', sub: 'Восточная Европа', tagline: 'Строгость снаружи, тепло внутри',
    greeting: { title: 'Приветствие', value: 'Крепкое рукопожатие', desc: 'Обращение по имени-отчеству. Первой женщине руку не протягивают — ждут.' },
    distance: { title: 'Дистанция', value: 'Умеренная, сдержанная', desc: 'Первоначальная холодность — не высокомерие. После знакомства — открытость.' },
    communication: { title: 'Стиль общения', value: 'Прямой, но формальный', desc: 'Прямолинейность не грубость. Переговоры могут быть жёсткими.' },
    dos: ['Прийти с продуманным предложением', 'Уважать иерархию', 'За столом не отказываться'],
    donts: ['Улыбаться без причины', 'Торопить с решением', 'Игнорировать ранг собеседника'],
    compare: [
      { label: 'Улыбка', kz: 'Знак тепла и гостеприимства', other: 'Сдержана, без повода неуместна' },
      { label: 'Обращение', kz: 'Имя-отчество или уважительно', other: 'Имя-отчество — строго на встрече' },
      { label: 'Застолье', kz: 'Угощение — долг хозяина', other: 'Часть переговорного процесса' },
      { label: 'Решения', kz: 'Быстрые при доверии', other: 'Осторожные, многоуровневые' }
    ]
  },
  {
    id: 'in', flag: 'in', name: 'Индия', sub: 'Южная Азия', tagline: 'Намасте и уважение к возрасту',
    greeting: { title: 'Приветствие', value: 'Намасте или рукопожатие', desc: 'В городской среде — рукопожатие. Намасте (ладони вместе) — универсально и уважительно.' },
    distance: { title: 'Дистанция', value: 'Умеренная', desc: 'Между мужчинами — близко. Физический контакт с женщинами — минимален.' },
    communication: { title: 'Стиль общения', value: 'Непрямой, уважительный', desc: '«Да» не всегда согласие. Кивок головой — часто просто «я слушаю».' },
    dos: ['Уважать старшего по возрасту', 'Принять угощение', 'Интересоваться семьёй'],
    donts: ['Торопить с ответом', 'Использовать левую руку', 'Критиковать религию'],
    compare: [
      { label: 'Приветствие', kz: 'Рукопожатие — стандарт', other: 'Намасте — универсально и безопасно' },
      { label: 'Угощение', kz: 'Мясо — часто баранина', other: 'Вегетарианство распространено, говядина — табу' },
      { label: 'Время', kz: 'Гибкое', other: 'IST — Indian Stretchable Time' },
      { label: 'Возраст', kz: 'Уважение к старшим — ценность', other: 'Старший — неоспоримый авторитет' }
    ]
  },
  {
    id: 'kr', flag: 'kr', name: 'Корея', sub: 'Восточная Азия', tagline: 'Иерархия определяет всё',
    greeting: { title: 'Приветствие', value: 'Поклон + рукопожатие', desc: 'Первым кланяется младший. Рукопожатие: левая рука поддерживает правую.' },
    distance: { title: 'Дистанция', value: 'Формальная, по рангу', desc: 'Иерархия определяет всё: кто заходит первым, кто садится, кто говорит.' },
    communication: { title: 'Стиль общения', value: 'Косвенный, по иерархии', desc: 'Младший не возражает старшему прямо. Молчание в ответ на просьбу — часто отказ.' },
    dos: ['Уточнить звания перед встречей', 'Обеими руками принимать предметы', 'Старшего пропустить вперёд'],
    donts: ['Называть по имени без разрешения', 'Наливать напиток себе самому', 'Критиковать при других'],
    compare: [
      { label: 'Иерархия', kz: 'Уважают, но менее формально', other: 'Абсолютная — определяет каждый жест' },
      { label: 'Напитки', kz: 'Наливают гостю первым', other: 'Наливают старшему, себе — после' },
      { label: 'Визитка', kz: 'Стандартный обмен', other: 'Двумя руками, изучают немедленно' },
      { label: 'Ужин', kz: 'Важен, приятен', other: 'Обязателен — часть деловой культуры' }
    ]
  }
];

const FLAGS = {
  kz: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 500"><rect width="900" height="500" fill="#00AFCA"/><circle cx="382" cy="250" r="75" fill="#FFD700" stroke="#FFD700"/><circle cx="382" cy="250" r="60" fill="#00AFCA"/><g fill="#FFD700"><circle cx="382" cy="160" r="12"/><circle cx="382" cy="340" r="12"/><circle cx="292" cy="250" r="12"/><circle cx="472" cy="250" r="12"/><circle cx="319" cy="187" r="12"/><circle cx="445" cy="313" r="12"/><circle cx="445" cy="187" r="12"/><circle cx="319" cy="313" r="12"/></g><rect x="820" y="0" width="80" height="500" fill="#FFD700"/><path d="M820 0 Q780 62.5 820 125 Q780 187.5 820 250 Q780 312.5 820 375 Q780 437.5 820 500" stroke="#00AFCA" stroke-width="8" fill="none"/></svg>`,
  jp: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600"><rect width="900" height="600" fill="#fff"/><circle cx="450" cy="300" r="180" fill="#BC002D"/></svg>`,
  us: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 100"><rect width="190" height="100" fill="#B22234"/><rect y="7.7" width="190" height="7.7" fill="#fff"/><rect y="23.1" width="190" height="7.7" fill="#fff"/><rect y="38.5" width="190" height="7.7" fill="#fff"/><rect y="53.8" width="190" height="7.7" fill="#fff"/><rect y="69.2" width="190" height="7.7" fill="#fff"/><rect y="84.6" width="190" height="7.7" fill="#fff"/><rect width="76" height="53.8" fill="#3C3B6E"/><g fill="#fff" font-size="9" text-anchor="middle"><text x="7.6" y="9">★</text><text x="22.8" y="9">★</text><text x="38" y="9">★</text><text x="53.2" y="9">★</text><text x="68.4" y="9">★</text><text x="15.2" y="18">★</text><text x="30.4" y="18">★</text><text x="45.6" y="18">★</text><text x="60.8" y="18">★</text><text x="7.6" y="27">★</text><text x="22.8" y="27">★</text><text x="38" y="27">★</text><text x="53.2" y="27">★</text><text x="68.4" y="27">★</text><text x="15.2" y="36">★</text><text x="30.4" y="36">★</text><text x="45.6" y="36">★</text><text x="60.8" y="36">★</text><text x="7.6" y="45">★</text><text x="22.8" y="45">★</text><text x="38" y="45">★</text><text x="53.2" y="45">★</text><text x="68.4" y="45">★</text></g></svg>`,
  de: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 3"><rect width="5" height="1" fill="#000"/><rect y="1" width="5" height="1" fill="#D00"/><rect y="2" width="5" height="1" fill="#FFCE00"/></svg>`,
  ae: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"><rect width="600" height="133" fill="#00732F"/><rect y="133" width="600" height="134" fill="#fff"/><rect y="267" width="600" height="133" fill="#000"/><rect width="200" height="400" fill="#FF0000"/></svg>`,
  cn: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600"><rect width="900" height="600" fill="#DE2910"/><polygon points="150,60 177,145 255,145 192,195 215,280 150,232 85,280 108,195 45,145 123,145" fill="#FFDE00"/><g fill="#FFDE00"><polygon points="270,30 280,62 312,62 287,80 296,112 270,94 244,112 253,80 228,62 260,62" transform="rotate(20,270,71)"/><polygon points="330,100 340,132 372,132 347,150 356,182 330,164 304,182 313,150 288,132 320,132" transform="rotate(10,330,141)"/><polygon points="330,200 340,232 372,232 347,250 356,282 330,264 304,282 313,250 288,232 320,232" transform="rotate(-10,330,241)"/><polygon points="270,270 280,302 312,302 287,320 296,352 270,334 244,352 253,320 228,302 260,302" transform="rotate(-20,270,311)"/></g></svg>`,
  tr: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="#E30A17"/><circle cx="425" cy="400" r="160" fill="#fff"/><circle cx="475" cy="400" r="130" fill="#E30A17"/><polygon points="583,400 612,490 695,430 695,370 612,310" fill="#fff"/></svg>`,
  ru: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 6"><rect width="9" height="2" fill="#fff"/><rect y="2" width="9" height="2" fill="#003DA5"/><rect y="4" width="9" height="2" fill="#CC0000"/></svg>`,
  in: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600"><rect width="900" height="200" fill="#FF9933"/><rect y="200" width="900" height="200" fill="#fff"/><rect y="400" width="900" height="200" fill="#138808"/><circle cx="450" cy="300" r="60" fill="none" stroke="#000080" stroke-width="5"/><circle cx="450" cy="300" r="8" fill="#000080"/><g stroke="#000080" stroke-width="1.5" fill="none"><line x1="450" y1="240" x2="450" y2="360"/><line x1="390" y1="300" x2="510" y2="300"/><line x1="407" y1="257" x2="493" y2="343"/><line x1="407" y1="343" x2="493" y2="257"/><line x1="390" y1="279" x2="510" y2="321"/><line x1="390" y1="321" x2="510" y2="279"/><line x1="429" y1="244" x2="471" y2="356"/><line x1="429" y1="356" x2="471" y2="244"/><line x1="444" y1="240" x2="456" y2="360"/><line x1="444" y1="360" x2="456" y2="240"/><line x1="440" y1="241" x2="460" y2="359"/></g></svg>`,
  kr: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600"><rect width="900" height="600" fill="#fff"/><circle cx="450" cy="300" r="120" fill="#CD2E3A"/><path d="M450,180 a120,120 0 0,1 0,240 a60,60 0 0,1 0,-120 a60,60 0 0,0 0,-120z" fill="#003478"/><g stroke="#000" stroke-width="12" fill="none"><g transform="translate(217,133) rotate(-45)"><line x1="-60" y1="-20" x2="60" y2="-20"/><line x1="-60" y1="0" x2="60" y2="0"/><line x1="-60" y1="20" x2="60" y2="20"/></g><g transform="translate(683,133) rotate(45)"><line x1="-60" y1="-20" x2="60" y2="-20"/><line x1="-60" y1="20" x2="60" y2="20"/><line x1="-30" y1="0" x2="30" y2="0"/></g><g transform="translate(217,467) rotate(45)"><line x1="-60" y1="-20" x2="60" y2="-20"/><line x1="-60" y1="20" x2="60" y2="20"/></g><g transform="translate(683,467) rotate(-45)"><line x1="-60" y1="-20" x2="60" y2="-20"/><line x1="-60" y1="0" x2="60" y2="0"/><line x1="-60" y1="20" x2="60" y2="20"/></g></g></svg>`,
};

function flagImg(code, w, h) {
  w = w || 40; h = h || 30;
  const svg = FLAGS[code] || '';
  return '<span style="display:inline-flex;align-items:center;justify-content:center;width:' + w + 'px;height:' + h + 'px;overflow:hidden;border-radius:3px;flex-shrink:0;">' + svg.replace('<svg ', '<svg width="' + w + '" height="' + h + '" ') + '</span>';
}

let activeId = null;

function renderGrid() {
  document.getElementById('country-grid').innerHTML = countries.map(c => `
    <div class="country-card${activeId === c.id ? ' active' : ''}" onclick="selectC('${c.id}')">
      <span class="flag">${flagImg(c.flag, 48, 32)}</span>
      <div class="c-name">${c.name}</div>
      <div class="c-sub">${c.sub}</div>
    </div>`).join('');
}

function selectC(id) {
  if (activeId === id) {
    activeId = null;
    document.getElementById('detail-panel').classList.remove('show');
    document.getElementById('empty-state').style.display = 'block';
    renderGrid();
    return;
  }
  activeId = id;
  renderGrid();
  const c = countries.find(x => x.id === id);
  renderDetail(c);
  document.getElementById('empty-state').style.display = 'none';
  document.getElementById('detail-panel').classList.add('show');
  setTimeout(() => document.getElementById('detail-panel').scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
}

function renderDetail(c) {
  const isKz = c.id === 'kz';
  const compareHtml = isKz ? `
    <div class="kz-block">
      <span class="section-label">Казахстан — точка отсчёта</span>
      <div class="kz-grid">
        ${c.kzSelf.map(i => `<div class="kz-item"><div class="ki-label">${i.label}</div><div class="ki-text">${i.text}</div></div>`).join('')}
      </div>
    </div>` : `
    <div class="compare-block">
      <div class="compare-header">
        <span class="flag-pair">${flagImg('kz', 24, 16)} ↔ ${flagImg(c.flag, 24, 16)}</span>
        <h3>Казахстан ↔ ${c.name}</h3>
      </div>
      <div class="compare-grid">
        ${c.compare.map(i => `
          <div class="compare-item">
            <div class="ci-label">${i.label}</div>
            <div class="ci-row">
              <div class="ci-entry"><span class="flag-sm">${flagImg('kz', 18, 14)}</span>${i.kz}</div>
              <div class="ci-entry"><span class="flag-sm">${flagImg(c.flag, 18, 14)}</span>${i.other}</div>
            </div>
          </div>`).join('')}
      </div>
    </div>`;

  document.getElementById('detail-inner').innerHTML = `
    <div class="detail-header">
      <div class="dh-left">
        <span class="detail-flag">${flagImg(c.flag, 48, 36)}</span>
        <div>
          <div class="detail-title">${c.name}</div>
          <div class="detail-tagline">${c.tagline}</div>
        </div>
      </div>
      <button class="close-btn" onclick="selectC('${c.id}')">
        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="info-row">
      ${[c.greeting, c.distance, c.communication].map(card => `
        <div class="info-card">
          <div class="ic-label">${card.title}</div>
          <div class="ic-value">${card.value}</div>
          <div class="ic-desc">${card.desc}</div>
        </div>`).join('')}
    </div>
    <div class="tags-row">
      <span class="tags-group-label">Можно</span>
      ${c.dos.map(d => `<span class="tag do">${d}</span>`).join('')}
      <span class="tags-group-label second">Нельзя</span>
      ${c.donts.map(d => `<span class="tag dont">${d}</span>`).join('')}
    </div>
    ${compareHtml}`;
}

renderGrid();