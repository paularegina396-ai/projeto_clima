// Mapeando os elementos do DOM
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const weatherResult = document.getElementById('weatherResult');
const errorMessage = document.getElementById('errorMessage');

// Eventos de busca (Clique no botão ou tecla Enter)
searchBtn.addEventListener('click', fetchWeatherData);
cityInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        fetchWeatherData();
    }
});

async function fetchWeatherData() {
    const city = cityInput.value.trim();

    // Resetando a interface
    weatherResult.classList.add('hidden');
    errorMessage.classList.add('hidden');

    if (!city) {
        showError('Por favor, digite o nome de uma cidade.');
        return;
    }

    try {
        // 1. Obter coordenadas geográficas da cidade
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        // Verifica se a API retornou alguma cidade
        if (!geoData.results || geoData.results.length === 0) {
            showError('Cidade não encontrada. Verifique a ortografia.');
            return;
        }

        // Extrai dados da primeira cidade encontrada
        const { latitude, longitude, name, admin1, country } = geoData.results[0];

        // 2. Usar as coordenadas para buscar o clima atual
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        // 3. Atualizar o DOM com os resultados
        const region = admin1 ? `${admin1}, ` : '';
        document.getElementById('cityName').textContent = `${name} (${region}${country})`;
        document.getElementById('temperature').textContent = weatherData.current_weather.temperature;
        document.getElementById('windspeed').textContent = weatherData.current_weather.windspeed;

        // Mostrar o card de resultados
        weatherResult.classList.remove('hidden');

    } catch (error) {
        console.error('Erro na requisição:', error);
        showError('Ocorreu um erro ao buscar os dados. Tente novamente mais tarde.');
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}