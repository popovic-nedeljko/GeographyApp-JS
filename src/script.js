'use strict';

const btnSearch = document.querySelector('.btn-country');
const btnLocation = document.querySelector('.btn-location');
const countriesContainer = document.querySelector('.countries');
const countrySearch = document.querySelector('.search__field');

///////////////////////////////////////////////////////////////////////////
// SVG icons matching the design
const icons = {
  population: {
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="#2563EB"/>
    </svg>`,
    bg: '#EFF6FF',
  },
  language: {
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="4" fill="#475569"/>
      <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke="#475569" stroke-width="1.8" stroke-linecap="round" fill="none"/>
    </svg>`,
    bg: '#F1F5F9',
  },
  currency: {
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#FBBF24" opacity="0.25"/>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="#D97706" stroke-width="1.6"/>
      <path d="M14.5 9a2.5 2.5 0 0 0-5 0c0 1.38 1.12 2 2.5 2s2.5.62 2.5 2a2.5 2.5 0 0 1-5 0M12 6.5V7M12 17v.5" stroke="#D97706" stroke-width="1.6" stroke-linecap="round"/>
    </svg>`,
    bg: '#FFFBEB',
  },
  capital: {
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="12" width="18" height="9" rx="1" stroke="#2563EB" stroke-width="1.6"/>
      <path d="M9 21v-5h6v5" stroke="#2563EB" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M8 12V8l4-4 4 4v4" stroke="#2563EB" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="12" y1="4" x2="12" y2="4" stroke="#2563EB" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    bg: '#EFF6FF',
  },
};

const formatPopulation = n => new Intl.NumberFormat('de-DE').format(n);

const fadeOut = () =>
  new Promise(resolve => {
    countriesContainer.style.opacity = '0';
    setTimeout(resolve, 350);
  });

const fadeIn = () => { countriesContainer.style.opacity = '1'; };

///////////////////////////////////////////////////////////////////////////
const renderCard = function (data, isNeighbour = false) {
  const language = Object.values(data.languages ?? {})[0] ?? 'N/A';
  const currency = Object.values(data.currencies ?? {})[0]?.name ?? 'N/A';
  const capital  = data.capital?.[0] ?? 'N/A';

  const rows = [
    { icon: icons.population, value: formatPopulation(data.population), label: 'Population' },
    { icon: icons.language,   value: language,                          label: 'Official language' },
    { icon: icons.currency,   value: currency,                          label: 'Currency' },
    { icon: icons.capital,    value: capital,                           label: 'Capital' },
  ];

  const infoHtml = rows.map(r => `
    <li class="country-card__info-item">
      <span class="country-card__info-icon" style="background-color:${r.icon.bg}">
        ${r.icon.svg}
      </span>
      <div class="country-card__info-text">
        <span class="country-card__info-value">${r.value}</span>
        <span class="country-card__info-label">${r.label}</span>
      </div>
    </li>`).join('');

  const card = `
    <article class="country-card">
      <img class="country-card__flag" src="${data.flags.svg}" alt="Flag of ${data.name.common}" />
      <div class="country-card__body">
        <h3 class="country-card__name">${data.name.common}</h3>
        <span class="country-card__region">${data.region}</span>
        <ul class="country-card__info">${infoHtml}</ul>
      </div>
    </article>`;

  if (isNeighbour) {
    const wrap = document.createElement('div');
    wrap.className = 'neighbour-wrap';
    wrap.innerHTML = `<span class="neighbour-label">Neighbour country</span>${card}`;
    countriesContainer.appendChild(wrap);
  } else {
    countriesContainer.insertAdjacentHTML('beforeend', card);
  }
};

const renderPlaceholders = function () {
  const infoRows = [
    icons.population,
    icons.language,
    icons.currency,
    icons.capital,
  ].map(icon => `
    <li class="country-card__info-item">
      <span class="country-card__info-icon" style="background-color:${icon.bg}">${icon.svg}</span>
      <div class="country-card__info-text">
        <div class="skeleton skeleton--value"></div>
        <div class="skeleton skeleton--label"></div>
      </div>
    </li>`).join('');

  const makeCard = iconSvg => `
    <article class="country-card">
      <div class="country-card__flag-ph">${iconSvg}</div>
      <div class="country-card__body">
        <div class="skeleton skeleton--name"></div>
        <div class="skeleton skeleton--region"></div>
        <ul class="country-card__info">${infoRows}</ul>
      </div>
    </article>`;

  const flagIcon = `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="14" y1="6" x2="14" y2="43" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M14 9 L40 17 L14 27 Z" fill="white" opacity="0.88"/>
  </svg>`;

  const globeIcon = `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="17" stroke="white" stroke-width="2"/>
    <path d="M24 7c-5 7-7 12-7 17s2 10 7 17M24 7c5 7 7 12 7 17s-2 10-7 17M7 24h34" stroke="white" stroke-width="2"/>
    <path d="M11 16a33 33 0 0 1 26 0M11 32a33 33 0 0 0 26 0" stroke="white" stroke-width="1.5"/>
  </svg>`;

  countriesContainer.innerHTML = makeCard(flagIcon);

  const wrap = document.createElement('div');
  wrap.className = 'neighbour-wrap';
  wrap.innerHTML = `<span class="neighbour-label">Neighbour country</span>${makeCard(globeIcon)}`;
  countriesContainer.appendChild(wrap);

  countriesContainer.style.opacity = 1;
};

const renderError = function (msg) {
  countriesContainer.innerHTML = `<p class="error-msg">${msg}</p>`;
};

///////////////////////////////////////////////////////////////////////////////
const getCountryData = async function (country) {
  try {
    if (!country) return;

    // Skeleton cards: add pulse to signal loading; real cards: just keep visible
    countriesContainer.classList.add('countries--loading');

    const resCountry = await fetch(`https://restcountries.com/v3.1/name/${country}`);
    if (!resCountry.ok)
      throw new Error(`Country not found (${resCountry.status})`);
    const data = await resCountry.json();

    // Fetch neighbour in parallel with processing
    let dataNeighbour = null;
    const neighbour = data[0].borders?.[0];
    if (neighbour) {
      const resNeighbour = await fetch(`https://restcountries.com/v3.1/alpha/${neighbour}`);
      if (resNeighbour.ok) dataNeighbour = await resNeighbour.json();
    }

    await fadeOut();
    countriesContainer.classList.remove('countries--loading');
    countriesContainer.innerHTML = '';
    renderCard(data[0]);
    if (dataNeighbour) renderCard(dataNeighbour[0], true);
    fadeIn();

  } catch (err) {
    countriesContainer.classList.remove('countries--loading');
    await fadeOut();
    renderError(`Something went wrong: ${err.message}. Please enter a correct country name.`);
    fadeIn();
    console.log(err.message);
  }
  countrySearch.value = '';
};

const getPosition = () =>
  new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject)
  );

const whereAmI = async function () {
  try {
    countriesContainer.classList.add('countries--loading');

    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords;

    const resGeo = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
    if (!resGeo.ok) throw new Error(`Geocoding failed (${resGeo.status})`);

    const dataGeo = await resGeo.json();
    if (dataGeo.error)    throw new Error('Could not determine location. Try again later.');
    if (!dataGeo.country) throw new Error('Country data unavailable for your coordinates.');

    const resCountry = await fetch(`https://restcountries.com/v3.1/name/${dataGeo.country}`);
    if (!resCountry.ok) throw new Error(`Country not found (${resCountry.status})`);

    const data = await resCountry.json();

    await fadeOut();
    countriesContainer.classList.remove('countries--loading');
    countriesContainer.innerHTML = '';
    renderCard(data[0]);
    fadeIn();

  } catch (err) {
    countriesContainer.classList.remove('countries--loading');
    await fadeOut();
    renderError(`Something went wrong: ${err.message}`);
    fadeIn();
  }
};

///////////////////////////////////////////////////////////////////////////////
btnSearch.addEventListener('click', function (e) {
  e.preventDefault();
  getCountryData(countrySearch.value.trim());
});

btnLocation.addEventListener('click', function (e) {
  e.preventDefault();
  whereAmI();
});

countrySearch.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    getCountryData(countrySearch.value.trim());
  }
});

renderPlaceholders();
