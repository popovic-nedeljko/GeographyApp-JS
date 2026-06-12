'use strict';

const btnSearch = document.querySelector('.btn-country');
const btnLocation = document.querySelector('.btn-location');
const countrySearch = document.querySelector('.search__field');

export const getQuery = () => countrySearch.value.trim();

export const clearInput = () => {
  countrySearch.value = '';
};

export const addHandlerSearch = function (handler) {
  btnSearch.addEventListener('click', function (e) {
    e.preventDefault();
    handler(getQuery());
  });

  countrySearch.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handler(getQuery());
    }
  });
};

export const addHandlerLocation = function (handler) {
  btnLocation.addEventListener('click', function (e) {
    e.preventDefault();
    handler();
  });
};
