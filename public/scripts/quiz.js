// ═══════════════════════════════════════════
// QUESTIONS BANK
// ═══════════════════════════════════════════

const allQuestions = [

  // ── ПРАВДА ИЛИ МИФ ──
  {
    type:'myth', typeLabel:'Правда или миф',
    q:'Отказаться от чая на деловой встрече в Казахстане — нормально, если вы не хотите пить.',
    opts:['Правда','Миф'], correct:1,
    explanation:'Отказ от чая воспринимается как неуважение к хозяину. Даже символический глоток — знак уважения.',
  },
  {
    type:'myth', typeLabel:'Правда или миф',
    q:'На деловых встречах в Казахстане принято обращаться по имени-отчеству при первом знакомстве.',
    opts:['Правда','Миф'], correct:0,
    explanation:'Да, обращение по имени-отчеству — стандарт уважения на официальных и деловых встречах.',
  },
  {
    type:'myth', typeLabel:'Правда или миф',
    q:'Прийти на 10–15 минут позже на неформальную встречу в Казахстане считается грубым нарушением.',
    opts:['Правда','Миф'], correct:1,
    explanation:'На неформальных встречах небольшое опоздание допустимо. На официальных переговорах нужно приходить вовремя.',
  },
  {
    type:'myth', typeLabel:'Правда или миф',
    q:'В казахской деловой культуре личные отношения важнее формальных договорённостей.',
    opts:['Правда','Миф'], correct:0,
    explanation:'Именно так. Доверие и личные связи — основа казахского бизнеса. Без отношений сделка маловероятна.',
  },
  {
    type:'myth', typeLabel:'Правда или миф',
    q:'Прийти на деловую встречу в Казахстане без подарка — нарушение этикета.',
    opts:['Правда','Миф'], correct:1,
    explanation:'Подарок — приятный жест, но не обязательный. Главное — уважение, внимание и готовность к диалогу.',
  },
  {
    type:'myth', typeLabel:'Правда или миф',
    q:'Громко говорить по телефону во время деловой встречи допустимо, если звонок важный.',
    opts:['Правда','Миф'], correct:1,
    explanation:'Телефонные разговоры во время встречи — грубое нарушение. Телефон лучше перевести в беззвучный режим.',
  },
  {
    type:'myth', typeLabel:'Правда или миф',
    q:'Старший по возрасту или рангу первым начинает разговор на деловой встрече в Казахстане.',
    opts:['Правда','Миф'], correct:0,
    explanation:'Уважение к иерархии — важная часть казахской деловой культуры. Младший ждёт инициативы от старшего.',
  },
  {
    type:'myth', typeLabel:'Правда или миф',
    q:'«Нет» в казахской деловой беседе часто звучит как «мне нужно подумать» или «посмотрим».',
    opts:['Правда','Миф'], correct:0,
    explanation:'Именно так. Прямой отказ нарушает гармонию общения. Косвенные формулировки — способ вежливо сказать «нет».',
  },
  {
    type:'myth', typeLabel:'Правда или миф',
    q:'В Казахстане деловые переговоры принято начинать строго по повестке без лишних слов.',
    opts:['Правда','Миф'], correct:1,
    explanation:'Неверно. Установление личного контакта, разговор о жизни — важная часть начала переговоров.',
  },
  {
    type:'myth', typeLabel:'Правда или миф',
    q:'Пригласить делового партнёра домой в Казахстане — высший знак доверия и уважения.',
    opts:['Правда','Миф'], correct:0,
    explanation:'Да, дом в казахской культуре — сакральное пространство. Приглашение означает, что вас считают своим человеком.',
  },

  // ── УГАДАЙ ОШИБКУ ──
  {
    type:'mistake', typeLabel:'Угадай ошибку',
    q:'Алексей пришёл вовремя, поздоровался за руку, но сразу обратился к партнёру по имени — «Ермек». В чём ошибка?',
    opts:['Опоздал на встречу','Обратился по имени без отчества','Не принёс подарок','Пожал руку первым'],
    correct:1,
    explanation:'При первом знакомстве «Ермек» без отчества — фамильярность. Правильно — «Ермек Асанович» или по полному имени-отчеству.',
  },
  {
    type:'mistake', typeLabel:'Угадай ошибку',
    q:'На встрече хозяин предложил гостю чай. Гость вежливо ответил: «Спасибо, я не хочу». В чём проблема?',
    opts:['Нужно было встать при ответе','Отказ от чая воспринимается как неуважение','Следовало попросить кофе','Ошибки нет'],
    correct:1,
    explanation:'Отказ от угощения — нарушение гостеприимства. Нужно принять чай, даже если не хочется пить.',
  },
  {
    type:'mistake', typeLabel:'Угадай ошибку',
    q:'Менеджер Дана сразу перешла к условиям сделки без предварительного разговора. Партнёры выглядели напряжёнными. Почему?',
    opts:['Говорила слишком громко','Пропустила small talk и установление контакта','Не принесла документы','Неправильно одета'],
    correct:1,
    explanation:'В казахской деловой культуре важно сначала установить личный контакт. Переход сразу к делу воспринимается как холодность.',
  },
  {
    type:'mistake', typeLabel:'Угадай ошибку',
    q:'Во время делового обеда Тимур положил локти на стол и начал просматривать телефон. Сколько ошибок?',
    opts:['Одна — телефон','Одна — локти','Две: локти + телефон','Ошибок нет'],
    correct:2,
    explanation:'Обе позиции нарушают деловой этикет. Локти на столе — некультурно, телефон — неуважение к собеседнику.',
  },
  {
    type:'mistake', typeLabel:'Угадай ошибку',
    q:'Принимающая сторона сразу перешла к повестке, не предложив гостю чай и не спросив о поездке. Что не так?',
    opts:['Не уточнили дату встречи','Нарушили нормы гостеприимства','Начали с повестки — это правильно','Встреча должна быть в ресторане'],
    correct:1,
    explanation:'Гостеприимство — базовая ценность. Сначала — чай, вопрос о дороге, внимание к гостю. Потом — дело.',
  },
  {
    type:'mistake', typeLabel:'Угадай ошибку',
    q:'Арман дал резкий ответ на критику партнёра, «поставив его в неловкое положение» при коллегах. Что нарушено?',
    opts:['Превышение полномочий','Принцип «сохранения лица» партнёра','Нарушение дресс-кода','Правила переговоров'],
    correct:1,
    explanation:'Публичная критика — серьёзное нарушение в казахской деловой культуре. Сложные вопросы решают приватно.',
  },
  {
    type:'mistake', typeLabel:'Угадай ошибку',
    q:'Партнёр подарил красивые часы руководителю-казаху. Руководитель заметно напрягся. В чём дело?',
    opts:['Слишком дорогой подарок','В тюркской культуре часы — плохая примета','Нужно было дарить торжественно','Всё нормально'],
    correct:1,
    explanation:'В тюркских культурах часы могут ассоциироваться с концом чего-либо. Безопаснее выбрать другой подарок.',
  },
  {
    type:'mistake', typeLabel:'Угадай ошибку',
    q:'Иностранный партнёр сразу предложил перейти на «ты» и называть друг друга по именам. Как казахская сторона это восприняла?',
    opts:['Как знак дружелюбия','Как излишнюю фамильярность','Абсолютно нейтрально','Как нарушение договора'],
    correct:1,
    explanation:'Быстрый переход на «ты» с незнакомым человеком в деловой среде — фамильярность. Формальное обращение — стандарт до сближения.',
  },

  // ── ЧТО ЛИШНЕЕ ──
  {
    type:'odd', typeLabel:'Что лишнее',
    q:'Какой из вариантов НЕ является нормой делового этикета в Казахстане?',
    opts:['Принять чай от хозяина','Обратиться по имени-отчеству','Прийти в джинсах на официальные переговоры','Уступить место старшему'],
    correct:2,
    explanation:'Джинсы неуместны на официальных переговорах. Деловой этикет требует соответствующей одежды.',
  },
  {
    type:'odd', typeLabel:'Что лишнее',
    q:'Что из этого НЕ подходит как тема для small talk на деловой встрече в Казахстане?',
    opts:['Погода и природа региона','Новости о семье и детях','Размер зарплаты собеседника','Общие знакомые'],
    correct:2,
    explanation:'Вопросы о зарплате — табу. Личные финансы не обсуждаются в светской беседе.',
  },
  {
    type:'odd', typeLabel:'Что лишнее',
    q:'Какой подарок НЕ будет уместен для делового партнёра в Казахстане?',
    opts:['Качественный чай','Книга по искусству','Алкоголь незнакомому человеку','Национальные сладости'],
    correct:2,
    explanation:'Алкоголь незнакомому партнёру — рискованный выбор: он может не пить по религиозным или личным причинам.',
  },
  {
    type:'odd', typeLabel:'Что лишнее',
    q:'Что из этого НЕУМЕСТНО в деловом образе для официальных переговоров?',
    opts:['Аккуратная, чистая одежда','Соответствие уровню встречи','Одежда с яркими принтами и надписями','Закрытая обувь'],
    correct:2,
    explanation:'Яркие принты и крупные надписи — casual стиль, неуместный на официальных переговорах.',
  },
  {
    type:'odd', typeLabel:'Что лишнее',
    q:'Что из этого НЕДОПУСТИМО во время деловой встречи?',
    opts:['Записывать ключевые моменты','Задавать уточняющие вопросы','Отвечать на все звонки подряд','Поддерживать зрительный контакт'],
    correct:2,
    explanation:'Постоянные звонки во время встречи — неуважение к собеседнику. Телефон переводят в беззвучный режим.',
  },
  {
    type:'odd', typeLabel:'Что лишнее',
    q:'Что из этого НЕ соответствует деловому этикету при знакомстве?',
    opts:['Твёрдое рукопожатие','Зрительный контакт','Представиться по имени-отчеству','Обнять малознакомого партнёра'],
    correct:3,
    explanation:'Объятия при первом знакомстве — избыточный контакт. Рукопожатие — стандарт для деловой среды.',
  },
  {
    type:'odd', typeLabel:'Что лишнее',
    q:'Что из этого НАРУШАЕТ этикет за деловым столом?',
    opts:['Попробовать предложенные блюда','Дождаться, пока пригласят садиться','Сидеть прямо','Говорить с полным ртом'],
    correct:3,
    explanation:'Говорить с едой во рту — грубое нарушение этикета в любой культуре.',
  },
  {
    type:'odd', typeLabel:'Что лишнее',
    q:'Что из этого НЕ стоит обсуждать на первой деловой встрече в Казахстане?',
    opts:['Цели сотрудничества','Репутацию компании','Политические взгляды партнёра','Общие интересы'],
    correct:2,
    explanation:'Политика и религия — темы, которых избегают на первых встречах. Они могут создать напряжение.',
  },
];

// ═══════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════
const QUIZ_LENGTH = 10;
let mode = 'mix';
let questions = [];
let current = 0;
let score = 0;
let answered = false;

// ═══════════════════════════════════════════
// MODE SELECT
// ═══════════════════════════════════════════
function selectMode(el) {
  document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  mode = el.dataset.mode;
}

// ═══════════════════════════════════════════
// START
// ═══════════════════════════════════════════
function startQuiz() {
  let pool = mode === 'mix'
    ? allQuestions
    : allQuestions.filter(q => q.type === mode);

  if (pool.length < 5) pool = allQuestions;

  questions = shuffle([...pool]).slice(0, Math.min(QUIZ_LENGTH, pool.length));
  current = 0;
  score = 0;
  answered = false;

  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('result-screen').classList.remove('show');
  document.getElementById('quiz-screen').classList.add('show');

  renderQuestion();
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ═══════════════════════════════════════════
// RENDER QUESTION
// ═══════════════════════════════════════════
function renderQuestion() {
  answered = false;
  const q = questions[current];
  const total = questions.length;
  const pct = (current / total) * 100;

  document.getElementById('progress-label').textContent = `Вопрос ${current + 1} из ${total}`;
  document.getElementById('progress-score').textContent = `${score} правильных`;
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('q-type-label').textContent = q.typeLabel;
  document.getElementById('q-text').textContent = q.q;

  const letters = ['А','Б','В','Г'];
  document.getElementById('options').innerHTML = q.opts.map((opt, i) => `
    <button class="opt" onclick="checkAnswer(${i})">
      <span class="opt-letter">${letters[i]}</span>
      ${opt}
    </button>
  `).join('');

  const fb = document.getElementById('feedback');
  fb.className = 'feedback';
  fb.style.display = 'none';

  const nb = document.getElementById('next-btn');
  nb.className = 'next-btn';
  nb.textContent = current < questions.length - 1 ? 'Следующий вопрос →' : 'Посмотреть результат →';

  const card = document.getElementById('q-card');
  card.style.animation = 'none';
  card.offsetHeight;
  card.style.animation = '';
}

// ═══════════════════════════════════════════
// CHECK ANSWER
// ═══════════════════════════════════════════
function checkAnswer(idx) {
  if (answered) return;
  answered = true;

  const q = questions[current];
  const isCorrect = idx === q.correct;
  if (isCorrect) score++;

  const opts = document.querySelectorAll('.opt');
  opts.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add('correct');
    else if (i === idx && !isCorrect) btn.classList.add('wrong');
    else btn.classList.add('dimmed');
  });

  const fb = document.getElementById('feedback');
  document.getElementById('fb-title').textContent = isCorrect ? 'Правильно!' : 'Не совсем...';
  document.getElementById('fb-text').textContent = q.explanation;
  fb.className = 'feedback show ' + (isCorrect ? 'correct' : 'wrong');
  fb.style.display = 'block';

  document.getElementById('progress-score').textContent = `${score} правильных`;
  document.getElementById('next-btn').classList.add('show');
}

// ═══════════════════════════════════════════
// NEXT
// ═══════════════════════════════════════════
function nextQuestion() {
  current++;
  if (current >= questions.length) {
    showResult();
  } else {
    renderQuestion();
  }
}

// ═══════════════════════════════════════════
// RESULT
// ═══════════════════════════════════════════
function showResult() {
  document.getElementById('quiz-screen').classList.remove('show');
  const rs = document.getElementById('result-screen');
  rs.classList.add('show');

  const total = questions.length;
  const pct = Math.round((score / total) * 100);
  const wrong = total - score;

  document.getElementById('result-num').textContent = score;
  document.getElementById('result-total').textContent = `из ${total}`;
  document.getElementById('rs-correct').textContent = score;
  document.getElementById('rs-wrong').textContent = wrong;
  document.getElementById('result-pct').textContent = pct + '%';

  let tier, title, sub;
  if (pct >= 80) {
    tier = 'great';
    title = 'Отлично! Вы знаток этикета';
    sub = 'Деловой этикет Казахстана вам хорошо знаком. Так держать!';
  } else if (pct >= 50) {
    tier = 'good';
    title = 'Неплохо, но есть что подтянуть';
    sub = 'Базу вы знаете, но некоторые нюансы стоит повторить.';
  } else {
    tier = 'bad';
    title = 'Стоит изучить материал';
    sub = 'Не беда — пройдите тест снова после прочтения глав книги.';
  }

  document.getElementById('result-circle').className = 'result-circle ' + tier;
  document.getElementById('result-title').textContent = title;
  document.getElementById('result-sub').textContent = sub;

  const fill = document.getElementById('result-bar-fill');
  fill.className = 'result-bar-fill ' + tier;
  setTimeout(() => { fill.style.width = pct + '%'; }, 100);
}

// ═══════════════════════════════════════════
// RESTART / GO START
// ═══════════════════════════════════════════
function restartQuiz() {
  document.getElementById('result-screen').classList.remove('show');
  startQuiz();
}

function goStart() {
  document.getElementById('result-screen').classList.remove('show');
  document.getElementById('quiz-screen').classList.remove('show');
  document.getElementById('start-screen').style.display = 'block';
}