'use strict';

import * as model from './model.js';
import * as countryView from './views/countryView.js';
import * as searchView from './views/searchView.js';

const controlSearch = async function (query) {
  if (!query) return;
  try {
    countryView.setLoading(true);

    const country = await model.getCountryByName(query);
    const neighbour = country.borders?.[0]
      ? await model.getCountryByCode(country.borders[0])
      : null;

    await countryView.fadeOut();
    countryView.setLoading(false);
    countryView.clear();
    countryView.renderCard(country);
    if (neighbour) countryView.renderCard(neighbour, true);
    countryView.fadeIn();
  } catch (err) {
    countryView.setLoading(false);
    await countryView.fadeOut();
    const msg =
      err.message === 'Failed to fetch'
        ? 'Could not reach the countries API. Check your connection or try again later.'
        : `${err.message}. Please enter a correct country name.`;
    countryView.renderError(msg);
    countryView.fadeIn();
  }
  searchView.clearInput();
};

const controlLocation = async function () {
  try {
    countryView.setLoading(true);

    const country = await model.getCountryByLocation();

    await countryView.fadeOut();
    countryView.setLoading(false);
    countryView.clear();
    countryView.renderCard(country);
    countryView.fadeIn();
  } catch (err) {
    countryView.setLoading(false);
    await countryView.fadeOut();
    const msg =
      err.message === 'Failed to fetch'
        ? 'Could not reach the API. Check your connection or try again later.'
        : `Something went wrong: ${err.message}`;
    countryView.renderError(msg);
    countryView.fadeIn();
  }
};

const init = function () {
  countryView.renderPlaceholders();
  searchView.addHandlerSearch(controlSearch);
  searchView.addHandlerLocation(controlLocation);
};

init();
