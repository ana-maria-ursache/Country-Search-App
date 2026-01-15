import { handleSearch } from './scripts/searchHandler.js';

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('country-input');
    const button = document.getElementById('fetch-data-btn');
    const output = document.getElementById('output');

    button.addEventListener('click', async () => handleSearch(input, output, 'Please enter a country name.'));

    input.addEventListener('keypress', async (event) => {
        if (event.key === 'Enter') {
            await handleSearch(input, output, 'Please enter a country name.');
        }
    });
});