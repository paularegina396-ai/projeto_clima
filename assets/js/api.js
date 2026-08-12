/**
 * Arquitetura Sênior:
 * 1. Separação de estado (DOM vs Dados)
 * 2. Mapeamento de domínios (Dicionário de códigos climáticos WMO)
 * 3. Tratamento granular de erros (Rede vs API vs Input do Usuário)
 */

// --- MAPEAMENTO DE DOMÍNIO (WMO Weather Interpretation Codes) ---
// Traduz o código numérico da API para descrições legíveis e ícones específicos.
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
    // Fallback genérico para códigos não mapeados
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

// --- LISTENERS DE EVENTOS ---
elements.btn.addEventListener('click', handleSearch);
elements.input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

// --- FUNÇÃO PRINCIPAL ORQUESTRADORA ---
async function handleSearch() {
    const city = elements.input.value.trim();
    
    // 1. Validação de campo vazio
    if (!city) {
        showError('Por favor, informe o nome de uma cidade válida.');
        return;
    }

    // 2. NOVA VALIDAÇÃO: Bloqueia qualquer número na string
    // A regex /\d/ procura por dígitos (0-9). O test() retorna true se achar algum.
    const containsNumber = /\d/.test(city);
    if (containsNumber) {
        showError('Nomes de cidades não contêm números. Digite novamente.');
        return;
    }

    setLoadingState(true);

    try {
        // 1. Busca as coordenadas
        const geoData = await fetchCoordinates(city);
        if (!geoData) throw new Error('CITY_NOT_FOUND');

        // 2. Com as coordenadas, busca o clima atual
        const weatherData = await fetchWeather(geoData.latitude, geoData.longitude);

        // 3. Atualiza a Interface do Usuário
        updateUI(geoData, weatherData);

    } catch (error) {
        handleError(error);
    } finally {
        setLoadingState(false);
    }
}

// --- SERVIÇOS DE API ---
// Isolamos a lógica de requisição para facilitar futuros testes unitários (Mocking).
async function fetchCoordinates(city) {
    try {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('API_ERROR'); // Erro 500 ou 400 da API
        
        const data = await response.json();
        return data.results ? data.results[0] : null;
    } catch (err) {
        // Se falhar no fetch (ex: sem internet), o erro original é capturado aqui
        if (err.message === 'API_ERROR') throw err;
        throw new Error('NETWORK_ERROR');
    }
}

async function fetchWeather(lat, lon) {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('API_ERROR');
        
        return await response.json();
    } catch (err) {
        if (err.message === 'API_ERROR') throw err;
        throw new Error('NETWORK_ERROR');
    }
}

// --- ATUALIZAÇÃO DA INTERFACE ---
function updateUI(geoInfo, weatherInfo) {
    const current = weatherInfo.current_weather;
    const isDay = current.is_day === 1;
    
    // Obtém os dados do dicionário (ou fallback se o código for muito raro)
    const weatherDetails = weatherDictionary[current.weathercode] || weatherDictionary.default;
    const iconFileName = isDay ? weatherDetails.iconDay : weatherDetails.iconNight;

    // Atualiza Textos
    elements.cityName.textContent = `${geoInfo.name}, ${geoInfo.admin1 || geoInfo.country}`;
    elements.temp.textContent = Math.round(current.temperature);
    elements.desc.textContent = weatherDetails.desc;
    
    // Atualiza Ícone
    elements.icon.src = `assets/icons/${iconFileName}`;
    
    // Gera a data e hora formatada
    elements.date.textContent = generateFormattedDate();

    // Altera o tema Dia/Noite
    document.body.className = isDay ? 'theme-day' : 'theme-night';

    // Exibe o card
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
    console.error('[WeatherApp Error]:', error); // Log técnico para debug

    let userMessage = 'Ocorreu um erro inesperado. Tente novamente.';
    
    // Tradução do erro técnico para uma mensagem amigável ao usuário (UX)
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