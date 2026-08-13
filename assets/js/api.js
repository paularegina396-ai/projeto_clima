/**
 * Arquitetura Sênior:
 * 1. Separação de estado (DOM vs Dados)
 * 2. Mapeamento de domínios (Dicionário de códigos climáticos WMO)
 * 3. Tratamento granular de erros (Rede vs API vs Input do Usuário)
 */

/**
 * @fileoverview Lógica principal para o aplicativo de Previsão do Tempo.
 * Consome a API Open-Meteo para geocodificação e dados meteorológicos.
 */

// --- CONFIGURAÇÕES DE CACHE ---
const CACHE_KEY = 'weatherAppData';
const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutos (em milissegundos)

/**
 * Salva os dados da busca no Local Storage do navegador.
 * @param {string} city - Nome da cidade.
 * @param {Object} geoData - Coordenadas geográficas.
 * @param {Object} weatherData - Dados climáticos.
 */
function saveToCache(city, geoData, weatherData) {
    const dataToSave = {
        city: city.toLowerCase(),
        timestamp: Date.now(), // Grava o momento exato da busca
        geo: geoData,
        weather: weatherData
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(dataToSave));
}

/**
 * Recupera os dados do cache se forem da mesma cidade e ainda estiverem recentes.
 * @param {string} city - Nome da cidade buscada.
 * @returns {Object|null} Retorna os dados se o cache for válido, ou null se estiver expirado/vazio.
 */
function getValidCache(city) {
    const cachedString = localStorage.getItem(CACHE_KEY);
    if (!cachedString) return null;

    const cachedData = JSON.parse(cachedString);
    const isSameCity = cachedData.city === city.toLowerCase();
    const isRecent = (Date.now() - cachedData.timestamp) < CACHE_DURATION_MS;

    if (isSameCity && isRecent) {
        console.log('📦 Retornando dados do Cache (sem gastar API)!');
        return cachedData;
    }

    return null; // Cache expirado ou cidade diferente
}

// --- MAPEAMENTO DE DOMÍNIO (WMO Weather Interpretation Codes) ---
const weatherDictionary = {
    0: { desc: 'Céu limpo', iconDay: 'wi-day-sunny.svg', iconNight: 'wi-night-clear.svg' },
    1: { desc: 'Predominantemente limpo', iconDay: 'wi-day-cloudy.svg', iconNight: 'wi-night-alt-cloudy.svg' },
    2: { desc: 'Parcialmente nublado', iconDay: 'wi-day-cloudy.svg', iconNight: 'wi-night-alt-cloudy.svg' },
    3: { desc: 'Nublado', iconDay: 'wi-cloudy.svg', iconNight: 'wi-cloudy.svg' },
    45: { desc: 'Nevoeiro', iconDay: 'wi-fog.svg', iconNight: 'wi-fog.svg' },
    48: { desc: 'Nevoeiro com geada', iconDay: 'wi-fog.svg', iconNight: 'wi-fog.svg' },
    51: { desc: 'Garoa leve', iconDay: 'wi-day-sprinkle.svg', iconNight: 'wi-night-alt-sprinkle.svg' },
    53: { desc: 'Garoa moderada', iconDay: 'wi-day-sprinkle.svg', iconNight: 'wi-night-alt-sprinkle.svg' },
    61: { desc: 'Chuva leve', iconDay: 'wi-day-rain.svg', iconNight: 'wi-night-alt-rain.svg' },
    63: { desc: 'Chuva moderada', iconDay: 'wi-rain.svg', iconNight: 'wi-rain.svg' },
    71: { desc: 'Neve leve', iconDay: 'wi-day-snow.svg', iconNight: 'wi-night-alt-snow.svg' },
    95: { desc: 'Tempestade', iconDay: 'wi-thunderstorm.svg', iconNight: 'wi-thunderstorm.svg' },
    default: { desc: 'Clima indefinido', iconDay: 'wi-na.svg', iconNight: 'wi-na.svg' }
};

// --- SELETORES DO DOM ---
const elements = {
    input: document.getElementById('cityInput'),
    btn: document.getElementById('searchBtn'),
    result: document.getElementById('weatherResult'),
    error: document.getElementById('errorMessage'),
    loading: document.getElementById('loadingState'),
    cityName: document.getElementById('cityName'),
    date: document.getElementById('currentDate'),
    temp: document.getElementById('temperature'),
    desc: document.getElementById('weatherDescription'),
    icon: document.getElementById('weatherIcon')
};

// --- LISTENERS ---
if (elements.btn) elements.btn.addEventListener('click', handleSearch);
if (elements.input) elements.input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

/**
 * Valida o nome da cidade inserido pelo usuário.
 * 
 * @param {string} city - O nome da cidade capturado do campo de input.
 * @returns {boolean} Retorna true se a validação for bem-sucedida.
 * @throws {Error} Lança 'EMPTY_INPUT' se o campo estiver vazio ou 'INVALID_CITY_NAME' se contiver números.
 * 
 * @example
 * validateCityInput("São Paulo"); // Retorna true
 * validateCityInput("SP 123"); // Lança Error('INVALID_CITY_NAME')
 */
function validateCityInput(city) {
    if (!city || city.trim() === '') throw new Error('EMPTY_INPUT');
    if (/\d/.test(city)) throw new Error('INVALID_CITY_NAME');
    return true;
}

/**
 * Busca as coordenadas geográficas de uma cidade utilizando a API de Geocodificação Open-Meteo.
 * 
 * @async
 * @param {string} city - O nome da cidade a ser pesquisada.
 * @returns {Promise<Object>} Um objeto contendo os dados geográficos, incluindo latitude e longitude.
 * @throws {Error} Lança 'RATE_LIMIT_EXCEEDED' se houver muitas requisições ou 'CITY_NOT_FOUND' se a cidade não existir.
 * 
 * @example
 * const coordenadas = await fetchCoordinates("Curitiba");
 * console.log(coordenadas.latitude); // Retorna a latitude em formato numérico
 */
async function fetchCoordinates(city) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt`;
    const response = await fetch(url);
    
    if (response.status === 429) throw new Error('RATE_LIMIT_EXCEEDED');
    if (!response.ok) throw new Error('API_ERROR');
    
    const data = await response.json();
    if (!data.results || data.results.length === 0) throw new Error('CITY_NOT_FOUND');
    
    return data.results[0];
}

/**
 * Busca os dados meteorológicos atuais baseados em coordenadas geográficas.
 * 
 * @async
 * @param {number} lat - A latitude do local (ex: -23.55).
 * @param {number} lon - A longitude do local (ex: -46.63).
 * @returns {Promise<Object>} Objeto JSON com as condições climáticas atuais, como temperatura e direção do vento.
 * @throws {Error} Lança 'API_ERROR' caso a API falhe ou ocorra um problema no servidor remoto.
 * 
 * @example
 * const clima = await fetchWeather(-23.55, -46.63);
 * console.log(clima.current_weather.temperature); // Exibe a temperatura atual
 */
async function fetchWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;
    const response = await fetch(url);
    
    if (!response.ok) throw new Error('API_ERROR');
    return await response.json();
}

/**
 * Orquestra o fluxo de busca, chamando as validações, APIs e atualizações de UI.
 * Implementa validação de Local Storage para evitar chamadas duplicadas.
 * 
 * @async
 * @returns {Promise<void>}
 */
async function handleSearch() {
    const city = elements.input.value.trim();
    
    try {
        validateCityInput(city);
        
        // 1. TENTA BUSCAR NO CACHE PRIMEIRO
        const cachedInfo = getValidCache(city);
        if (cachedInfo) {
            updateUI(cachedInfo.geo, cachedInfo.weather);
            return;
        }

        // 2. SE NÃO TEM CACHE, FAZ A REQUISIÇÃO REAL
        setLoadingState(true);

        const geoData = await fetchCoordinates(city);
        const weatherData = await fetchWeather(geoData.latitude, geoData.longitude);

        // 3. SALVA O RESULTADO NO CACHE PARA A PRÓXIMA VEZ
        saveToCache(city, geoData, weatherData);

        updateUI(geoData, weatherData);

    } catch (error) {
        handleError(error);
    } finally {
        setLoadingState(false);
    }
}

// --- ATUALIZAÇÃO DA INTERFACE ---
function updateUI(geoInfo, weatherInfo) {
    const current = weatherInfo.current_weather;
    const isDay = current.is_day === 1;
    
    const weatherDetails = weatherDictionary[current.weathercode] || weatherDictionary.default;
    const iconFileName = isDay ? weatherDetails.iconDay : weatherDetails.iconNight;

    elements.cityName.textContent = `${geoInfo.name}, ${geoInfo.admin1 || geoInfo.country}`;
    elements.temp.textContent = Math.round(current.temperature);
    elements.desc.textContent = weatherDetails.desc;
    elements.icon.src = `assets/icons/${iconFileName}`;
    elements.date.textContent = generateFormattedDate();

    document.body.className = isDay ? 'theme-day' : 'theme-night';
    elements.result.classList.remove('hidden');
}

// --- UTILS & TRATAMENTO DE ERROS ---
function generateFormattedDate() {
    const options = { 
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    };
    return new Intl.DateTimeFormat('pt-BR', options).format(new Date());
}

function handleError(error) {
    console.error('[WeatherApp Error]:', error); 

    let userMessage = 'Ocorreu um erro inesperado. Tente novamente.';
    
    switch(error.message) {
        case 'CITY_NOT_FOUND':
            userMessage = 'Cidade não encontrada. Verifique a ortografia e tente novamente.';
            break;
        case 'NETWORK_ERROR':
            userMessage = 'Sem conexão com a internet ou falha de rede. Verifique seu Wi-Fi.';
            break;
        case 'API_ERROR':
            userMessage = 'O serviço de clima está temporariamente indisponível.';
            break;
        case 'INVALID_CITY_NAME':
            userMessage = 'Nomes de cidades não contêm números. Digite novamente.';
            break;
        case 'EMPTY_INPUT':
            userMessage = 'Por favor, informe o nome de uma cidade válida.';
            break;
    }
    
    showError(userMessage);
}

function showError(msg) {
    elements.error.textContent = msg;
    elements.error.classList.remove('hidden');
    elements.result.classList.add('hidden');
}

function setLoadingState(isLoading) {
    if (isLoading) {
        elements.error.classList.add('hidden');
        elements.result.classList.add('hidden');
        elements.loading.classList.remove('hidden');
        elements.btn.disabled = true;
    } else {
        elements.loading.classList.add('hidden');
        elements.btn.disabled = false;
    }
}