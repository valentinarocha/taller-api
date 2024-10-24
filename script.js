// Elementos del DOM.
const regionFilter = document.getElementById('regionFilter');
const languageFilter = document.getElementById('languageFilter');
const countryContainter = document.getElementById('countryContainer');

// Almacena lo que el usuario elige, inicialmente está vacía.
let selectedRegion = '';
let selectedLanguage = '';

// Función  asincrónica para obtener datos de los países.
async function fetchCountries() {

    // URL de la API que brinda los datos de los países.
    let url = 'https://restcountries.com/v3.1/all';

    const response = await fetch(url); // Realiza la solicitud a la API y espera la respuesta.
    let countries = await response.json(); // Convierte la respuesta en formato JSON.
    console.log(countries); // Muestra los datos de los países en la consola.

    // Filtro por continente.
    if (selectedRegion) {
        countries = countries.filter(country => country.region.toLowerCase() === selectedRegion);
    }

    // Filtro por idioma.
    if (selectedLanguage) {
        countries = countries.filter(country => {
            const languages = country.languages ? Object.values(country.languages).map(lang => lang.toLowerCase()) : [];
            return languages.includes(selectedLanguage);
        });
    }

    // Ordenar alfabéticamente los países.
    countries.sort((a, b) => a.name.common.localeCompare(b.name.common));

    displayCountries(countries);
}

function displayCountries(countries) {
    countryContainter.innerHTML = ''; // Limpia el contenedor.

    if (countries.length === 0) {
        const noResultsImage = `
        <div class="text-center">
                    <img src="gatotriste.jpg" alt="No se encontraron resultados"
                        style="max-width: 100%; height: auto;">
                    <p>No se encontraron países con esas características :(</p>
                </div>
        `;
        countryContainter.innerHTML = noResultsImage;
        return;
    }

    countries.forEach(country => {
        const languages = country.languages ? Object.values(country.languages).slice(0,5).join(', ') : 'Lo siento, no encontramos resultados.';
        
        const infoCountry = `
        <div class="col-md-4">
                <div class="card h-100">
                    <img src="${country.flags.svg}" class="card-img-top" alt="Bandera de ${country.name.common}">
                    <div class="card-body">
                        <h5 class="card-title">${country.name.common}</h5>
                        <p class="card-text"><strong>Continente:</strong> ${country.region}</p>
                        <p class="card-text"><strong>Idioma:</strong> ${languages}</p>
                    </div>
                </div>
            </div>
        </div>
        `;
        countryContainter.innerHTML += infoCountry;
    });
}

regionFilter.addEventListener('change', () => {
    selectedRegion = regionFilter.value.toLowerCase();
    fetchCountries();
});

languageFilter.addEventListener('change', () => {
    selectedLanguage = languageFilter.value.toLowerCase();
    fetchCountries();
});

fetchCountries(); // Llama a la función.