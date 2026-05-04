const books = [
  {
    title: 'Международный деловой этикет на примере 22 стран',
    author: 'Елена Игнатьева',
    image: '/images/book-1.jpg',
    href: 'https://loveread.ec/read_book.php?id=94443&p=2',
    external: true,
  },
  {
    title: 'Манеры для карьеры. Деловой протокол и этикет',
    author: 'Ольга Шевелёва',
    image: '/images/book-2.jpg',
    href: 'https://loveread.ec/read_book.php?id=83298&p=1',
    external: true,
  },
  {
    title: 'Этикет делового письма',
    author: 'Олег Давтян',
    image: '/images/book-3.jpg',
    href: 'https://loveread.ec/read_book.php?id=66471&p=1',
    external: true,
  },
  {
    title: 'Слова назидания (Қара сөздер)',
    author: 'Абай Кунанбаев',
    image: null,
    href: '/materials/abay.pdf',
    external: true,
    pdf: true,
  },
];

function render() {
  const grid = document.getElementById('books-grid');
  grid.innerHTML = books.map(b => `
    <a class="book-card"
       href="${b.href}"
       ${b.external ? 'target="_blank" rel="noopener"' : ''}>
      <div class="book-cover${b.image ? '' : ' no-photo'}">
        ${b.image
          ? `<img src="${b.image}" alt="${b.title}" loading="lazy">`
          : `<span class="cover-ornament">☽</span>
             <span class="cover-title">Слова назидания</span>
             <span class="cover-subtitle">Қара сөздер</span>`
        }
        ${b.pdf ? '<span class="pdf-badge">PDF</span>' : ''}
      </div>
      <div class="book-meta">
        <div class="book-title">${b.title}</div>
        <div class="book-author">Автор: ${b.author}</div>
      </div>
    </a>
  `).join('');
}

render();