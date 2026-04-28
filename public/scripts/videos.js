const videos = [
  {
    topic: 'Деловое приветствие',
    title: 'Приветствие в деловом общении',
    desc: 'Основные правила первого впечатления: приветствие, представление, форма обращения и правильное начало делового разговора.',
    id: '-VWu9rKH_WE',
  },
  {
    topic: 'Деловые встречи',
    title: 'Поведение на деловой встрече',
    desc: 'Как правильно вести себя на встречах и переговорах, соблюдать деловую дистанцию и выстраивать профессиональное общение.',
    id: 'LBsxB31I9mQ',
  },
  {
    topic: 'Деловой обед',
    title: 'Этикет делового обеда',
    desc: 'Правила поведения за столом, деловое общение во время обеда и важные элементы делового этикета вне офиса.',
    id: '32Lt1df3ots',
  },
  {
    topic: 'Навыки делового общения',
    title: 'Основы делового общения',
    desc: 'Ключевые навыки профессионального общения: уважение к собеседнику, грамотная речь и уверенное поведение.',
    id: 'UKW5OfcmSJE',
  },
  {
    topic: 'Деловой стиль',
    title: 'Деловой стиль и поведение',
    desc: 'Требования к внешнему виду, официальному стилю общения и соблюдению норм профессионального поведения.',
    id: 'MVcV0jo3tWA',
  },
  {
    topic: 'Международный этикет',
    title: 'Зарубежный деловой этикет',
    desc: 'Правила и особенности международного этикета в деловой среде разных стран.',
    id: '70K-NZb-5cs',
    start: 65,
  },
  {
    topic: 'Протокол и деловой этикет',
    title: 'Основы делового протокола',
    desc: 'Правила официального общения, соблюдение субординации и нормы поведения в профессиональной среде.',
    id: 'S-H1ZC6i6lM',
  },
  {
    topic: 'Деловая переписка',
    title: 'Электронная деловая переписка',
    desc: 'Правила оформления деловых писем, корректное общение по email и ошибки, которых следует избегать.',
    id: 'dWdKGJlITSY',
  },
];

function getEmbedUrl(v) {
  // Используем обычное сложение строк, чтобы избежать ошибок с обратными кавычками
  var url = "https://www.youtube.com/embed/" + v.id + "?rel=0&modestbranding=1";
  if (v.start) {
    url += "&start=" + v.start;
  }
  return url;
}

function getWatchUrl(v) {
  var url = "https://www.youtube.com/watch?v=" + v.id;
  if (v.start) {
    url += "&t=" + v.start + "s";
  }
  return url;
}

function render() {
  const grid = document.getElementById('videos-grid');
  grid.innerHTML = videos.map(v => `
    <div class="video-card">
      <div class="video-frame">
        <iframe
          src="${getEmbedUrl(v)}"
          title="${v.title}"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          loading="lazy">
        </iframe>
      </div>
      <div class="video-body">
        <div class="video-topic">${v.topic}</div>
        <div class="video-title">${v.title}</div>
        <div class="video-desc">${v.desc}</div>
        <a class="video-link" href="${getWatchUrl(v)}" target="_blank" rel="noopener">
          Открыть на YouTube
          <svg viewBox="0 0 24 24"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
        </a>
      </div>
    </div>
  `).join('');
}

render();