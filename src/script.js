'use strict';

const btnSearch = document.querySelector('.btn-country');
const btnLocation = document.querySelector('.btn-location');
const countriesContainer = document.querySelector('.countries');
const countrySearch = document.querySelector('.search__field');
///////////////////////////////////////////////////////////////////////////
const renderCountry = function (data, className = '') {
  const html = `<article class="country ${className} ">
  <img class="country__img" src="${data.flag}" />
  <div class="country__data">
    <h3 class="country__name">${data.name}</h3>
    <h4 class="country__region">${data.region}</h4>
    <p class="country__row"><span>👫</span>${+data.population / 1000000}</p>
    <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
    <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
    <p class="country__row"><span>🌇</span>${data.capital}</p>
  </div>
</article>`;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1;
};

///////////////////////////////////////////////////////////////////////////////
//--------------------Buttons for search and your location--------------------
//BTN SEARCH COUNTRY
btnSearch.addEventListener('click', function (e) {
  e.preventDefault();
  const countryName = countrySearch.value;

  const getCountryData = async function (country) {
    try {
      if (!country) return;

      const getCountry = await fetch(
        `https://restcountries.com/v2/name/${country}`
      );
      const data = await getCountry.json();
      renderCountry(data[0]);

      const neighbour = data[0].borders[0];
      if (!neighbour) throw new Error(`no neighbour found`);

      //neigbour country
      const neighbourCountry = await fetch(
        `https://restcountries.com/v2/alpha/${neighbour}`
      );
      const dataNeibour = await neighbourCountry.json();
      renderCountry(dataNeibour, 'neighbour');
    } catch (err) {
      renderError(
        `somthing went wrong${err.message}. Please enter correct country name`
      );
      console.log(`${err.message}`);
    }
    countrySearch.value = '';
  };
  countriesContainer.innerHTML = '';
  getCountryData(countryName);
});

//BTN YOUR LOCATION
const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

btnLocation.addEventListener('click', function (e) {
  e.preventDefault();
  countriesContainer.innerHTML = '';

  const whereAmI = async function () {
    try {
      const pos = await getPosition();
      const { latitude: lat, longitude: lng } = pos.coords;

      const resGeo = await fetch(
        `https://geocode.xyz/${lat},${lng}?geoit=json`
      );
      const dataGeo = await resGeo.json();

      const getCountry = await fetch(
        `https://restcountries.com/v2/name/${dataGeo.country}`
      );
      const data = await getCountry.json();
      renderCountry(data[0]);
    } catch (err) {
      renderError(
        `Something went wront,could not load your location, please try again!`
      );
    }
  };
  whereAmI();
});
