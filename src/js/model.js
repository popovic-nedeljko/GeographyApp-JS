'use strict';

const API_KEY = 'rc_live_db0c2985df924cff99f42fef72cb1dc0';
const API_BASE = 'https://api.restcountries.com/countries/v5';
const API_HEADERS = { Authorization: `Bearer ${API_KEY}` };

const unwrap = json => {
  const list = json?.data?.objects ?? json?.data ?? json;
  return Array.isArray(list) ? list[0] : list;
};

export const getCountryByName = async function (name) {
  const res = await fetch(`${API_BASE}/name?q=${encodeURIComponent(name)}`, {
    headers: API_HEADERS,
  });
  if (!res.ok) throw new Error('Country not found (404)');
  return unwrap(await res.json());
};

export const getCountryByCode = async function (code) {
  const res = await fetch(`${API_BASE}/codes.alpha_3/${code}`, {
    headers: API_HEADERS,
  });
  if (!res.ok) return null;
  return unwrap(await res.json());
};

const getPosition = () =>
  new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject)
  );

export const getCountryByLocation = async function () {
  const pos = await getPosition();
  const { latitude: lat, longitude: lng } = pos.coords;

  const resGeo = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
    { headers: { 'Accept-Language': 'en' } }
  );
  if (!resGeo.ok) throw new Error(`Geocoding failed (${resGeo.status})`);

  const dataGeo = await resGeo.json();
  if (!dataGeo.address?.country)
    throw new Error('Country data unavailable for your coordinates.');

  return getCountryByName(dataGeo.address.country);
};
