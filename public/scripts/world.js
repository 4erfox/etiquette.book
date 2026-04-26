const countries = [
{
  id:'kz',
  name:'Казахстан',
  flag:'https://flagcdn.com/w40/kz.png'
},
{
  id:'jp',
  name:'Япония',
  flag:'https://flagcdn.com/w40/jp.png'
},
{
  id:'us',
  name:'США',
  flag:'https://flagcdn.com/w40/us.png'
},
{
  id:'de',
  name:'Германия',
  flag:'https://flagcdn.com/w40/de.png'
},
{
  id:'cn',
  name:'Китай',
  flag:'https://flagcdn.com/w40/cn.png'
}
];

let active = null;

function renderGrid(){
  const grid = document.getElementById('country-grid');

  grid.innerHTML = countries.map(c => `
    <div class="country-card" onclick="selectCountry('${c.id}')">
      <img class="flag" src="${c.flag}">
      <div>${c.name}</div>
    </div>
  `).join('');
}

function selectCountry(id){
  const country = countries.find(c => c.id === id);

  document.getElementById('empty-state').style.display = 'none';
  document.getElementById('detail-panel').classList.add('show');

  document.getElementById('detail-inner').innerHTML = `
    <h2>
      <img class="flag-sm" src="${country.flag}">
      ${country.name}
    </h2>

    <div class="compare-item">
      <img class="flag-sm" src="https://flagcdn.com/w20/kz.png">
      Казахстан vs 
      <img class="flag-sm" src="${country.flag}">
      ${country.name}
    </div>
  `;
}

renderGrid();