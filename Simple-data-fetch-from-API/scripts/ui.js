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
    const wrapper = document.createElement('div');
    wrapper.classList.add('country-card-wrapper');
    
    const container = document.createElement('div');
    
    const card = document.createElement('div');
    card.classList.add('country-card');

    card.innerHTML = `
        <img src="${country.flags.svg}" alt="Flag" width="200">
        <h1>${country.name.common}</h1>
        <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Subregion:</strong> ${country.subregion}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Area:</strong> ${country.area} km</p>
        <p><strong>Map:</strong> <a href="${country.maps.googleMaps}"> Google Maps</a></p>
    `;

    const isFav = isFavorited(country.name.common);
    const starIcon = isFav ? 'Delete from favorites' : 'Add to favorites';

    const favDiv = document.createElement('div');
    favDiv.classList.add('fave-button-container');
    favDiv.innerHTML = `<span class="add-to-fave-btn">${starIcon}</span>`;

    const starBtn = favDiv.querySelector('.add-to-fave-btn');
    starBtn.addEventListener('click', () => {
        toggleFavorite(country.name.common);
        starBtn.textContent = isFavorited(country.name.common) ? 'Delete from favorites' : 'Add to favorites';
        refreshFavoritesTab();
    });

    container.appendChild(card);
    container.appendChild(favDiv);
    wrapper.appendChild(container);

    return wrapper;
}

export function createSearchCards(searches) {
    const card = document.createElement('div');
    card.classList.add('search-card');

    const searchesArray = Array.isArray(searches) ? searches : [searches];
    const recent = searchesArray.slice(-5).reverse();
    recent.forEach(c => {
        const p = document.createElement('p');
        p.className = 'search-item';
        p.innerHTML = `<strong>${c}</strong>`;  
        p.style.cursor = 'pointer';
        p.addEventListener('click', async () => {
            const input = document.getElementById('country-input');
            const output = document.getElementById('output');
            input.value = c;
            await handleSearch(input, output);
        });
        card.appendChild(p);
    });

    return card;
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
    const card = document.createElement('div');
    card.classList.add('favorite-card');

    for (const countryName of favorites) {
        const countryData = await getMoreData(countryName);
        
        if (countryData) {
            const div = document.createElement('div');
            div.className = 'favorite-item';
            div.innerHTML = `
                <div class="favorite-item-content">
                    <img src="${countryData.flags.svg}" alt="Flag" width="80">
                    <h3>${countryData.name.common}</h3>
                    <p><strong>Capital:</strong> ${countryData.capital ? countryData.capital[0] : 'N/A'}</p>
                    <p><strong>Region:</strong> ${countryData.region}</p>
                    <p><strong>Subregion:</strong> ${countryData.subregion}</p>
                    <p><strong>Population:</strong> ${countryData.population.toLocaleString()}</p>
                    <p><strong>Currency:</strong> ${countryData.currencies ? Object.values(countryData.currencies).map(c => c.name).join(', ') : 'N/A'}</p>
                    <p><strong>Neighbors:</strong> ${countryData.borders ? countryData.borders.join(', ') : 'N/A'}</p>
                    <p><strong>Timezone:</strong> ${countryData.timezones ? countryData.timezones.join(', ') : 'N/A'}</p>
                </div>
                <button class="delete-fave-btn" data-country="${countryName}">★</button>
            `;
            card.appendChild(div);
        } else {
            const div = document.createElement('div');
            div.className = 'favorite-item';
            div.innerHTML = `<p>${countryName} (data unavailable)</p>`;
            card.appendChild(div);
        }
    }

    const deleteButtons = card.querySelectorAll('.delete-fave-btn');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const countryToRemove = btn.getAttribute('data-country');
            toggleFavorite(countryToRemove);
            btn.closest('.favorite-item').remove();
            await refreshFavoritesTab();
        });
    });

    return card;
}

export function renderToElement(parent, childElement) {
    parent.innerHTML = '';
    parent.appendChild(childElement);
}