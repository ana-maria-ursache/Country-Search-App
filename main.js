import { handleSearch } from './scripts/searchHandler.js';
import { createSearchCards, createFavoriteCards, renderToElement, createTraveledCards } from './scripts/ui.js';
import { cycleTheme } from './scripts/themes.js';
import { exportLocalStorage } from './scripts/manageLocalStorage.js';

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('country-input');
    const button = document.getElementById('fetch-data-btn');
    const output = document.getElementById('output');
    const searchesContainer = document.getElementById('searches');
    const favoritesContainer = document.getElementById('favorites');
    const traveledContainer = document.getElementById('traveled');
    const traveledPage = document.getElementById('traveled-page');
    const exportBtn = document.querySelector('.export-button'); 
    const favoritesPage = document.getElementById('favorites-page');
    const savedHistory = JSON.parse(localStorage.getItem('searches')) || [];

    if (savedHistory.length > 0) {
        const historyCard = createSearchCards(savedHistory);
        renderToElement(searchesContainer, historyCard); 
    }

    const savedFavorites = JSON.parse(localStorage.getItem('favCountries')) || [];
    
    if (savedFavorites.length > 0) {
        createFavoriteCards(savedFavorites).then(favoriteCards => {
            renderToElement(favoritesContainer, favoriteCards);
        });
        favoritesPage.style.display = 'block';
        favoritesPage.classList.add('active');
    }

    const savedTraveled = JSON.parse(localStorage.getItem('traveled')) || [];
    
    if (savedTraveled.length > 0) {
        createTraveledCards(savedTraveled).then(traveledCards => {
            renderToElement(traveledContainer, traveledCards);
        });
        traveledPage.style.display = 'block';
        traveledPage.classList.add('active');
    }
    
    button.addEventListener('click', async () => handleSearch(input, output, 'Please enter a country name.'));

    input.addEventListener('keypress', async (event) => {
        if (event.key === 'Enter') {
            await handleSearch(input, output, 'Please enter a country name.');
        }
    });

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', cycleTheme);
    }

    if (exportBtn) {
    exportBtn.addEventListener('click', exportLocalStorage);
}

});

