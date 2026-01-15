import { fetchCountryData } from './api.js';
import { createCountryCard, renderToElement } from './ui.js';

function saveToLocalStorage(countryName) {
    let searches = JSON.parse(localStorage.getItem('searches')) || [];

    if (!searches.includes(countryName)) {
        searches.push(countryName);
        localStorage.setItem('searches', JSON.stringify(searches));
    }
}

export async function handleSearch(input, output, message) {
    const countryName = input.value.trim();
    
    if (!countryName) {
        const errorEl = document.createElement('p');
        errorEl.className = 'error';
        errorEl.textContent = message || 'Please try again.';
        renderToElement(output, errorEl);
        return;
    }

    try {
        const country = await fetchCountryData(countryName);
        console.log(country);
        saveToLocalStorage(country.name.official);
        const cardHtml = createCountryCard(country);
        renderToElement(output, cardHtml);
    } catch (error) {
        const errorOnSearch = document.createElement('p');
        errorOnSearch.className = 'error';
        errorOnSearch.textContent = error.message;
        renderToElement(output, errorOnSearch);
    }

}