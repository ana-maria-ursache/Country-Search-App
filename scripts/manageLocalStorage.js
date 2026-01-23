export function saveSearchToLocalStorage(countryName) {
    let searches = JSON.parse(localStorage.getItem('searches')) || [];

    if (!searches.includes(countryName)) {
        searches.push(countryName);
        localStorage.setItem('searches', JSON.stringify(searches));
    }
    else if (searches.includes(countryName)) {
        const index = searches.indexOf(countryName);
        searches.splice(index, 1);
        searches.push(countryName);
        localStorage.setItem('searches', JSON.stringify(searches));
    }
}

// favorite countries management

export function toggleFavorite(countryCommonName) {
    let favorites = JSON.parse(localStorage.getItem('favCountries')) || [];

    const index = favorites.indexOf(countryCommonName);
    
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(countryCommonName);
    }
    
    localStorage.setItem('favCountries', JSON.stringify(favorites));
    return favorites;
}

export function isFavorited(countryCommonName) {
    let favorites = JSON.parse(localStorage.getItem('favCountries')) || [];
    return favorites.includes(countryCommonName);
}

export function addToFavorites(country) {
    return toggleFavorite(country.name.common);
}

export function getCachedCountry(countryName) {
    const cache = JSON.parse(localStorage.getItem('countriesCache')) || {};
    return cache[countryName.toLowerCase()] || null;
}

export function saveCountryToCache(countryName, countryData) {
    const cache = JSON.parse(localStorage.getItem('countriesCache')) || {};
    cache[countryName.toLowerCase()] = countryData;
    localStorage.setItem('countriesCache', JSON.stringify(cache));
}

// traveled countries management    
export function toggleTraveled(countryCommonName) {
    let traveled = JSON.parse(localStorage.getItem('traveled')) || [];

    const index = traveled.indexOf(countryCommonName);
    
    if (index > -1) {
        traveled.splice(index, 1);
    } else {
        traveled.push(countryCommonName);
    }
    
    localStorage.setItem('traveled', JSON.stringify(traveled));
    return traveled;
}

export function isTraveled(countryCommonName) {
    let traveled = JSON.parse(localStorage.getItem('traveled')) || [];
    return traveled.includes(countryCommonName);
}

export function addToTraveled(country) {
    return toggleTraveled(country.name.common);
}


// export localStorage data as JSON file
export function exportLocalStorage() {
    const searches = JSON.parse(localStorage.getItem('searches')) || [];
    const favCountries = JSON.parse(localStorage.getItem('favCountries')) || [];
    const traveled = JSON.parse(localStorage.getItem('traveled')) || [];

    const formatList = (list) => {
        if (list.length === 0) return "---> No items found";
        return list.map(item => `---> ${item}`).join('\n');
    };

    let readableContent = "\n\n";

    readableContent = "Recent searches:\n";
    readableContent += formatList(searches) + "\n\n";

    readableContent += "Favorite countries:\n";
    readableContent += formatList(favCountries) + "\n\n";

    readableContent += "Countries you have traveled to:\n";
    readableContent += formatList(traveled);

    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(readableContent);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "exportData.txt");
    document.body.appendChild(downloadAnchorNode); 
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
