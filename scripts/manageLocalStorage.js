export function saveSearchToLocalStorage(countryName) {
    let searches = JSON.parse(localStorage.getItem('searches')) || [];

    if (!searches.includes(countryName)) {
        searches.push(countryName);
        localStorage.setItem('searches', JSON.stringify(searches));
    }
    else if (searches.includes(countryName)) {
        const index = searches.indexOf(countryName);
        searches.splice(index, 1);
        searches.push(countryName);
        localStorage.setItem('searches', JSON.stringify(searches));
    }
}

export function toggleFavorite(countryCommonName) {
    let favorites = JSON.parse(localStorage.getItem('favCountries')) || [];

    const index = favorites.indexOf(countryCommonName);
    
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(countryCommonName);
    }
    
    localStorage.setItem('favCountries', JSON.stringify(favorites));
    return favorites;
}

export function isFavorited(countryCommonName) {
    let favorites = JSON.parse(localStorage.getItem('favCountries')) || [];
    return favorites.includes(countryCommonName);
}

export function addToFavorites(country) {
    return toggleFavorite(country.name.common);
}

export function getCachedCountry(countryName) {
    const cache = JSON.parse(localStorage.getItem('countriesCache')) || {};
    return cache[countryName.toLowerCase()] || null;
}

export function saveCountryToCache(countryName, countryData) {
    const cache = JSON.parse(localStorage.getItem('countriesCache')) || {};
    cache[countryName.toLowerCase()] = countryData;
    localStorage.setItem('countriesCache', JSON.stringify(cache));
}