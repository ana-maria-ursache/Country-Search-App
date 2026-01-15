export function createCountryCard(country) {
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
    return card;
}

export function renderToElement(parent, childElement) {
    parent.innerHTML = '';
    parent.appendChild(childElement);
}