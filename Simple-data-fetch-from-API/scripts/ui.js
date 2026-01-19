import { addToFavorites, isFavorited, toggleFavorite } from './manageLocalStorage.js';

import { handleSearch } from './searchHandler.js';
import { fetchCountryData } from './api.js';

export async function refreshFavoritesTab() {
    const favoritesContainer = document.getElementById('favorites');
    if (favoritesContainer) {
        const savedFavorites = JSON.parse(localStorage.getItem('favCountries')) || [];
        if (savedFavorites.length > 0) {
            const favoriteCards = await createFavoriteCards(savedFavorites);
            favoritesContainer.innerHTML = '';
            favoritesContainer.appendChild(favoriteCards);
        } else {
            favoritesContainer.innerHTML = '';
        }
    }
}

export function createCountryCard(country) {
    const article = document.createElement('article');
    article.classList.add('country-card-wrapper');
    
    const section = document.createElement('section');
    section.classList.add('country-card');

    section.innerHTML = `
        <img src="${country.flags.svg}" alt="Flag" width="200">
        <h2>${country.name.common}</h2>
        <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Subregion:</strong> ${country.subregion}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Area:</strong> ${country.area} km</p>
        <p><strong>Map:</strong> <a href="${country.maps.googleMaps}"> Google Maps</a></p>
    `;

    const isFav = isFavorited(country.name.common);
    const starIcon = isFav ? 'Delete from favorites' : 'Add to favorites';

    const aside = document.createElement('aside');
    aside.classList.add('fave-button-container');
    const button = document.createElement('button');
    button.className = 'add-to-fave-btn';
    button.textContent = starIcon;
    aside.appendChild(button);

    button.addEventListener('click', () => {
        toggleFavorite(country.name.common);
        button.textContent = isFavorited(country.name.common) ? 'Delete from favorites' : 'Add to favorites';
        refreshFavoritesTab();
    });

    article.appendChild(section);
    article.appendChild(aside);

    return article;
}

export function createSearchCards(searches) {
    const nav = document.createElement('nav');
    nav.classList.add('search-card');

    const searchesArray = Array.isArray(searches) ? searches : [searches];
    const recent = searchesArray.slice(-5).reverse();
    recent.forEach(c => {
        const button = document.createElement('button');
        button.className = 'search-item';
        button.textContent = c;
        button.addEventListener('click', async () => {
            const input = document.getElementById('country-input');
            const output = document.getElementById('output');
            input.value = c;
            await handleSearch(input, output);
        });
        nav.appendChild(button);
    });

    return nav;
}

export async function getMoreData(countryName) {
    try {
        const countryData = await fetchCountryData(countryName);
        return countryData;
    } catch (error) {
        console.error('Error fetching country data:', error);
        return null;
    }
}

export async function createFavoriteCards(favorites) {
    const section = document.createElement('section');
    section.classList.add('favorite-card');

    for (const countryName of favorites) {
        const countryData = await getMoreData(countryName);
        
        if (countryData) {
            const article = document.createElement('article');
            article.className = 'favorite-item';
            article.innerHTML = `
                <section class="favorite-item-content">
                    <img src="${countryData.flags.svg}" alt="Flag" width="80">
                    <h3>${countryData.name.common}</h3>
                    <p><strong>Capital:</strong> ${countryData.capital ? countryData.capital[0] : 'N/A'}</p>
                    <p><strong>Region:</strong> ${countryData.region}</p>
                    <p><strong>Subregion:</strong> ${countryData.subregion}</p>
                    <p><strong>Population:</strong> ${countryData.population.toLocaleString()}</p>
                    <p><strong>Currency:</strong> ${countryData.currencies ? Object.values(countryData.currencies).map(c => c.name).join(', ') : 'N/A'}</p>
                    <p><strong>Neighbors:</strong> ${countryData.borders ? countryData.borders.join(', ') : 'N/A'}</p>
                    <p><strong>Timezone:</strong> ${countryData.timezones ? countryData.timezones.join(', ') : 'N/A'}</p>
                </section>
                <button class="delete-fave-btn" data-country="${countryName}">★</button>
            `;
            section.appendChild(article);
        } else {
            const article = document.createElement('article');
            article.className = 'favorite-item';
            article.innerHTML = `<p>${countryName} (data unavailable)</p>`;
            section.appendChild(article);
        }
    }

    const deleteButtons = section.querySelectorAll('.delete-fave-btn');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const countryToRemove = btn.getAttribute('data-country');
            toggleFavorite(countryToRemove);
            btn.closest('.favorite-item').remove();
            await refreshFavoritesTab();
        });
    });

    return section;
}

export function renderToElement(parent, childElement) {
    parent.innerHTML = '';
    parent.appendChild(childElement);
}