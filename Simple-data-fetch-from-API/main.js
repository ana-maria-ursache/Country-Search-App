import { fetchCountryData } from './scripts/api.js';
import { createCountryCard, renderToElement } from './scripts/ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('country-input');
    const button = document.getElementById('fetch-data-btn');
    const output = document.getElementById('output');

    button.addEventListener('click', async () => {
        const countryName = input.value.trim();
        
        if (!countryName) {
            const errorEl = document.createElement('p');
            errorEl.className = 'error';
            errorEl.textContent = 'Please enter a country name.';
            renderToElement(output, errorEl);
            return;
        }

        try {
            const country = await fetchCountryData(countryName);
            const cardHtml = createCountryCard(country);
            renderToElement(output, cardHtml);
        } catch (error) {
            alert(error.message);
        }
    });
});