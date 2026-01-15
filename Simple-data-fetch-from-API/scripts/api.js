export async function fetchCountryData(countryName) {
    const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
    if (!response.ok) {
        throw new Error('The country is not in out system:(!');
    }
    const data = await response.json();
    return data[0];
}