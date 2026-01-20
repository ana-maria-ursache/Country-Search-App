import { handleSearch } from './scripts/searchHandler.js';
import { createSearchCards, createFavoriteCards, renderToElement } from './scripts/ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('country-input');
    const button = document.getElementById('fetch-data-btn');
    const output = document.getElementById('output');
    const searchesContainer = document.getElementById('searches');
    const favoritesContainer = document.getElementById('favorites');

    const mainTab = document.getElementById('main-tab');
    const favoritesTab = document.getElementById('favorites-tab');
    const mainPage = document.getElementById('main-page');
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
        favoritesTab.style.display = 'inline-block';
    }
    
    mainTab.addEventListener('click', () => {
        mainPage.style.display = 'block';
        mainPage.classList.add('active');
        favoritesPage.style.display = 'none';
        favoritesPage.classList.remove('active');
        mainTab.classList.add('active');
        favoritesTab.classList.remove('active');
    });
    
    favoritesTab.addEventListener('click', () => {
        favoritesPage.style.display = 'block';
        favoritesPage.classList.add('active');
        mainPage.style.display = 'none';
        mainPage.classList.remove('active');
        favoritesTab.classList.add('active');
        mainTab.classList.remove('active');
    });

    button.addEventListener('click', async () => handleSearch(input, output, 'Please enter a country name.'));

    input.addEventListener('keypress', async (event) => {
        if (event.key === 'Enter') {
            await handleSearch(input, output, 'Please enter a country name.');
        }
    });
});