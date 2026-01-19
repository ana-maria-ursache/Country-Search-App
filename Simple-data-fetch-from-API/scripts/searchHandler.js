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

export async function showSearchSuggestions(input, output) {
    const searchTerm = input.value.trim().toLowerCase();
    
    if (!searchTerm) {
        renderToElement(output, document.createElement('div'));
        return;
    }

    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${searchTerm}`);
        
        if (!response.ok) {
            renderToElement(output, document.createElement('div'));
            return;
        }

        const countries = await response.json();
        
        const filtered = countries.filter(c => 
            c.name.common.toLowerCase().includes(searchTerm)
        );
        
        if (filtered.length === 0) {
            renderToElement(output, document.createElement('div'));
            return;
        }

        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.style.cssText = 'background: #fff0f6; border: 1px solid #fce4ec; border-radius: 8px; padding: 10px; max-height: 300px; overflow-y: auto;';

        filtered.forEach(country => {
            const suggestionItem = document.createElement('div');
            suggestionItem.style.cssText = 'padding: 8px; cursor: pointer; border-bottom: 1px solid #fce4ec; transition: 0.2s;';
            suggestionItem.innerHTML = `<strong>${country.name.common}</strong>`;
            
            suggestionItem.addEventListener('mouseover', () => {
                suggestionItem.style.backgroundColor = '#e25aa4';
                suggestionItem.style.color = 'white';
            });
            
            suggestionItem.addEventListener('mouseout', () => {
                suggestionItem.style.backgroundColor = 'transparent';
                suggestionItem.style.color = 'black';
            });
            
            suggestionItem.addEventListener('click', async () => {
                input.value = country.name.common;
                await handleSearch(input, document.getElementById('output'));
                renderToElement(output, document.createElement('div'));
            });

            suggestionsContainer.appendChild(suggestionItem);
        });

        renderToElement(output, suggestionsContainer);

    } catch (error) {
        renderToElement(output, document.createElement('div'));
    }
}