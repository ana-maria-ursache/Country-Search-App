import { fetchCountryData } from './api.js';
import { createCountryCard, createSearchCards, renderToElement } from './ui.js';
import {saveSearchToLocalStorage } from './manageLocalStorage.js';


export async function handleSearch(input, output, message) {
    const countryName = input.value.trim();
    const searchesContainer = document.getElementById('searches');
    
    if (!countryName) {
        const errorEl = document.createElement('p');
        errorEl.className = 'error';
        errorEl.textContent = message || 'Please try again.';
        renderToElement(output, errorEl);
        return;
    }

    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        
        if (!response.ok) {
            throw new Error('The country is not in out system:(!');
        }

        const countries = await response.json();

        const filtered = countries.filter(c => 
            c.name.common.toLowerCase().includes(countryName.toLowerCase())
        );

        if (filtered.length === 0) {
            throw new Error('The country is not in out system:(!');
        }

        saveSearchToLocalStorage(filtered[0].name.common);

        const updatedHistory = JSON.parse(localStorage.getItem('searches')) || [];
        const historyCard = createSearchCards(updatedHistory);
        renderToElement(searchesContainer, historyCard);

        const resultsContainer = document.createElement('div');
        
        filtered.forEach(country => {
            const cardNode = createCountryCard(country);
            resultsContainer.appendChild(cardNode);
        });

        renderToElement(output, resultsContainer);

    } catch (error) {
        const errorOnSearch = document.createElement('p');
        errorOnSearch.className = 'error';
        errorOnSearch.textContent = error.message;
        renderToElement(output, errorOnSearch);
    }

}