// ═══════════════════════════════════════════
// QUESTIONS BANK
// ═══════════════════════════════════════════

// ═══════════════════════════════════════════
// QUESTIONS BANK (упрощённая версия для взрослой аудитории)
// ═══════════════════════════════════════════

const allQuestions = [

  // ── ПРАВДА ИЛИ МИФ ──
  {
    type:'myth', typeLabel:'Правда или миф',
    q:'На деловой встрече в Казахстане принято здороваться за руку.',
    opts:['Правда','Миф'], correct:0,
    explanation:'Да, рукопожатие — стандартная форма приветствия в деловой среде Казахстана.',
  },
  {
    type:'myth', typeLabel:'Правда или миф',
    q:'Если вас пригласили на деловой обед, можно отказаться от угощения, если не голодны.',
    opts:['Правда','Миф'], correct:1,
    explanation:'Отказ от угощения может быть воспринят как неуважение к хозяину. Лучше попробовать хотя бы немного.',
  },
  {
    type:'myth', typeLabel:'Правда или миф',
    q:'В Казахстане на деловых встречах принято обращаться по имени и отчеству.',
    opts:['Правда','Миф'], correct:0,
    explanation:'Да, обращение по имени-отчеству — важный элемент уважения в казахстанской деловой культуре.',
  },
  {
    type:'myth', typeLabel:'Правда или миф',
    q:'Во время деловых переговоров допустимо отвечать на телефонные звонки.',
    opts:['Правда','Миф'], correct:1,
    explanation:'Нет, телефонные разговоры во время встречи отвлекают и демонстрируют неуважение к собеседнику.',
  },
  {
    type:'myth', typeLabel:'Правда или миф',
    q:'Для деловой встречи подойдёт любая чистая одежда, даже спортивный костюм.',
    opts:['Правда','Миф'], correct:1,
    explanation:'Деловая встреча требует соответствующего дресс-кода — костюм, рубашка, классическая обувь.',
  },
  {
    type:'myth', typeLabel:'Правда или миф',
    q:'На деловую встречу лучше прийти за 5–10 минут до назначенного времени.',
    opts:['Правда','Миф'], correct:0,
    explanation:'Пунктуальность — признак уважения к партнёру. Лучше прийти немного раньше, чем опоздать.',
  },
  {
    type:'myth', typeLabel:'Правда или миф',
    q:'В деловой переписке можно использовать смайлики и сокращения вроде «ок», «спс».',
    opts:['Правда','Миф'], correct:1,
    explanation:'Деловая переписка требует официального стиля. Смайлики и сокращения неуместны.',
  },
  {
    type:'myth', typeLabel:'Правда или миф',
    q:'Если партнёр предложил чай, нужно обязательно согласиться.',
    opts:['Правда','Миф'], correct:0,
    explanation:'Чай — символ гостеприимства. Отказ может быть воспринят как неуважение.',
  },
  {
    type:'myth', typeLabel:'Правда или миф',
    q:'В Казахстане деловые переговоры начинают сразу с обсуждения условий сделки.',
    opts:['Правда','Миф'], correct:1,
    explanation:'Сначала принято установить личный контакт, обсудить нейтральные темы, а потом переходить к делу.',
  },
  {
    type:'myth', typeLabel:'Правда или миф',
    q:'Критиковать партнёра при других сотрудниках — допустимо, если вы правы.',
    opts:['Правда','Миф'], correct:1,
    explanation:'Публичная критика нарушает принцип сохранения лица. Сложные вопросы решают наедине.',
  },

  // ── УГАДАЙ ОШИБКУ ──
  {
    type:'mistake', typeLabel:'Угадай ошибку',
    q:'На встречу с партнёром Иван опоздал на 20 минут, не предупредив. В чём ошибка?',
    opts:['Слишком рано пришёл','Опоздал и не предупредил','Плохо выглядел','Не принёс документы'],
    correct:1,
    explanation:'Опоздание без предупреждения — неуважение к партнёру. Нужно предупредить о задержке.',
  },
  {
    type:'mistake', typeLabel:'Угадай ошибку',
    q:'Во время переговоров Алия проверяла сообщения в телефоне. В чём ошибка?',
    opts:['Слишком громко говорила','Пользовалась телефоном во время встречи','Не смотрела на партнёра','Мало задавала вопросов'],
    correct:1,
    explanation:'Телефон во время встречи отвлекает и показывает неуважение к собеседнику.',
  },
  {
    type:'mistake', typeLabel:'Угадай ошибку',
    q:'Марат пришёл на деловую встречу в джинсах и футболке. В чём ошибка?',
    opts:['Слишком яркая одежда','Не подходящий дресс-код','Забыл галстук','Обувь не начищена'],
    correct:1,
    explanation:'Для деловых встреч требуется официальный или деловой стиль одежды.',
  },
  {
    type:'mistake', typeLabel:'Угадай ошибку',
    q:'На деловом обеде Гульнара сразу начала обсуждать цены и условия контракта. В чём ошибка?',
    opts:['Слишком громко говорила','Пропустила неформальное общение','Мало ела','Сидела не на том месте'],
    correct:1,
    explanation:'Сначала нужно уделить внимание неформальному общению, а потом переходить к делам.',
  },
  {
    type:'mistake', typeLabel:'Угадай ошибку',
    q:'В деловом письме Ерлан написал: «Привет! Как дела? Отправь отчёт пж». В чём ошибка?',
    opts:['Слишком вежливо','Неформальный стиль','Слишком длинное письмо','Много ошибок'],
    correct:1,
    explanation:'Деловая переписка требует официального стиля, правильного обращения и грамотности.',
  },
  {
    type:'mistake', typeLabel:'Угадай ошибку',
    q:'На встрече с руководством Аслан перебивал старшего коллегу. В чём ошибка?',
    opts:['Говорил слишком тихо','Перебивал старшего','Мало улыбался','Смотрел в телефон'],
    correct:1,
    explanation:'В казахстанской деловой культуре старшего не перебивают. Нужно дождаться паузы.',
  },
  {
    type:'mistake', typeLabel:'Угадай ошибку',
    q:'При знакомстве с партнёром Дмитрий сказал: «Здарова, Серёга!». В чём ошибка?',
    opts:['Слишком громко','Панибратское обращение','Не пожал руку','Не представился'],
    correct:1,
    explanation:'При деловом знакомстве нужно обращаться по имени-отчеству и соблюдать официальный тон.',
  },
  {
    type:'mistake', typeLabel:'Угадай ошибку',
    q:'На переговорах Айнур сразу сказала: «Ваши условия нас не устраивают». В чём ошибка?',
    opts:['Слишком мягко','Прямой и резкий отказ','Слишком долго думала','Говорила шёпотом'],
    correct:1,
    explanation:'В казахской культуре принято смягчать отказы, избегать прямых и резких формулировок.',
  },

  // ── ЧТО ЛИШНЕЕ ──
  {
    type:'odd', typeLabel:'Что лишнее',
    q:'Что НЕ является нормой делового этикета в Казахстане?',
    opts:['Приветствовать рукопожатием','Соблюдать пунктуальность','Игнорировать партнёра','Обращаться по имени-отчеству'],
    correct:2,
    explanation:'Игнорирование партнёра противоречит всем нормам делового этикета.',
  },
  {
    type:'odd', typeLabel:'Что лишнее',
    q:'Что НЕ стоит делать во время деловой встречи?',
    opts:['Слушать собеседника','Записывать важное','Смотреть в телефон','Задавать вопросы'],
    correct:2,
    explanation:'Телефон на встрече отвлекает и демонстрирует неуважение к партнёру.',
  },
  {
    type:'odd', typeLabel:'Что лишнее',
    q:'Что НЕ подходит для делового обеда с партнёром?',
    opts:['Обсуждать дела после еды','Пробовать угощение','Отказываться от всего','Благодарить хозяина'],
    correct:2,
    explanation:'Отказ от угощения может быть воспринят как неуважение. Нужно попробовать хотя бы немного.',
  },
  {
    type:'odd', typeLabel:'Что лишнее',
    q:'Что НЕ следует делать в деловой переписке?',
    opts:['Использовать смайлики','Проверять грамматику','Кратко излагать мысли','Указывать тему письма'],
    correct:0,
    explanation:'Смайлики и неформальные символы неуместны в деловой переписке.',
  },
  {
    type:'odd', typeLabel:'Что лишнее',
    q:'Что НЕ является признаком уважения к партнёру?',
    opts:['Приходить вовремя','Слушать внимательно','Перебивать','Готовиться к встрече'],
    correct:2,
    explanation:'Перебивание собеседника — признак неуважения и плохого тона.',
  },
  {
    type:'odd', typeLabel:'Что лишнее',
    q:'Что НЕ нужно делать перед важными переговорами?',
    opts:['Изучить информацию о партнёре','Подготовить документы','Прийти в спортивном костюме','Продумать вопросы'],
    correct:2,
    explanation:'Спортивная одежда неуместна на деловых переговорах. Требуется деловой стиль.',
  },
  {
    type:'odd', typeLabel:'Что лишнее',
    q:'Что НЕ принято обсуждать на первой деловой встрече?',
    opts:['Условия сотрудничества','Опыт компании','Зарплату партнёра','Сроки проекта'],
    correct:2,
    explanation:'Личные финансы и зарплата — темы, которых избегают в деловом общении.',
  },
  {
    type:'odd', typeLabel:'Что лишнее',
    q:'Что НЕ является частью делового этикета?',
    opts:['Пунктуальность','Уважение к старшим','Критика при всех','Конфиденциальность'],
    correct:2,
    explanation:'Критиковать партнёра при других людях — грубое нарушение этикета.',
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