/**
 * Arquivo: api.test.js
 * Suíte de testes para a API de Clima utilizando Jest.
 */

// Simulando a importação das funções (No JS puro, você exportaria via module.exports)
// const { fetchCoordinates, fetchWeather, validateCityInput } = require('./api');

// Ambiente de simulação para o seu estudo, 

function validateCityInput(city) {
    if (!city || city.trim() === '') throw new Error('EMPTY_INPUT');
    if (/\d/.test(city)) throw new Error('INVALID_CITY_NAME');
    return true;
}

async function fetchCoordinates(city) {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
    
    if (response.status === 429) throw new Error('RATE_LIMIT_EXCEEDED');
    if (!response.ok) throw new Error('API_ERROR');
    
    const data = await response.json();
    if (!data || !data.results) throw new Error('MALFORMED_DATA');
    if (data.results.length === 0) throw new Error('CITY_NOT_FOUND');
    
    return data.results[0];
}

// --- INÍCIO DA SUÍTE DE TESTES ---

describe('Sistema de Previsão do Tempo', () => {
    
    // Limpa os mocks do fetch antes de cada teste para evitar vazamento de dados
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // ==========================================
    // 3.6. TESTES BÁSICOS
    // ==========================================
    describe('Testes Básicos', () => {
        
        test('Deve retornar erro de validação para entrada vazia', () => {
            expect(() => validateCityInput('')).toThrow('EMPTY_INPUT');
            expect(() => validateCityInput('   ')).toThrow('EMPTY_INPUT');
        });

        test('Deve retornar erro de validação se a cidade contiver números', () => {
            expect(() => validateCityInput('São Paulo 123')).toThrow('INVALID_CITY_NAME');
        });

        test('Deve retornar dados meteorológicos para um nome de cidade válido', async () => {
            // Mock da resposta de sucesso da API
            const mockResponse = { results: [{ name: 'São Paulo', latitude: -23.55, longitude: -46.63 }] };
            global.fetch.mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: async () => mockResponse,
            });

            const data = await fetchCoordinates('São Paulo');
            expect(data.name).toBe('São Paulo');
            expect(global.fetch).toHaveBeenCalledTimes(1);
        });

        test('Deve lançar exceção CITY_NOT_FOUND para cidade inexistente', async () => {
            // Mock de uma busca que não encontrou nada
            global.fetch.mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: async () => ({ results: [] }), // Array vazio
            });

            await expect(fetchCoordinates('CidadeFalsaXZY')).rejects.toThrow('CITY_NOT_FOUND');
        });

        test('Deve gerar erro API_ERROR em caso de falha no servidor (ex: erro 500)', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: false,
                status: 500,
            });

            await expect(fetchCoordinates('São Paulo')).rejects.toThrow('API_ERROR');
        });
    });

    // ==========================================
    // 3.7. CASOS EXTREMOS (Edge Cases)
    // ==========================================
    describe('Casos Extremos', () => {
        
        test('Deve lançar RATE_LIMIT_EXCEEDED se o limite da API for atingido (Status 429)', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: false,
                status: 429,
            });

            await expect(fetchCoordinates('São Paulo')).rejects.toThrow('RATE_LIMIT_EXCEEDED');
        });

        test('Deve tratar conexão de rede lenta, instável ou offline (Network Error)', async () => {
            // Mock de uma falha de rede (ex: cabo desconectado, DNS falhou)
            global.fetch.mockRejectedValueOnce(new Error('Network Error'));

            await expect(fetchCoordinates('São Paulo')).rejects.toThrow('Network Error');
        });

        test('Deve lançar MALFORMED_DATA se o JSON retornar com estrutura inesperada', async () => {
            // Mock de uma resposta da API que quebrou e não trouxe a chave "results"
            const unexpectedJson = { unexpected_key: 'alguma_coisa' };
            global.fetch.mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: async () => unexpectedJson,
            });

            await expect(fetchCoordinates('São Paulo')).rejects.toThrow('MALFORMED_DATA');
        });
    });

    // ==========================================
    // ETAPA 5: TESTES DE CACHE (Local Storage)
    // ==========================================
    describe('Sistema de Cache (Local Storage)', () => {
        
        // MOCK DO LOCAL STORAGE PARA O JEST (NODE.JS)
        const localStorageMock = (() => {
            let store = {};
            return {
                getItem: (key) => store[key] || null,
                setItem: (key, value) => { store[key] = value.toString(); },
                clear: () => { store = {}; }
            };
        })();
        Object.defineProperty(global, 'localStorage', { value: localStorageMock });

        beforeEach(() => {
            // Agora isso vai funcionar perfeitamente!
            localStorage.clear();
            jest.spyOn(Date, 'now').mockImplementation(() => 1000000);
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        test('Deve validar o cache como verdadeiro se a busca for recente (menos de 10 min)', () => {
            const mockData = {
                city: 'são paulo',
                timestamp: 1000000, 
                geo: { lat: 10, lon: 20 },
                weather: { temp: 25 }
            };
            localStorage.setItem('weatherAppData', JSON.stringify(mockData));

            const cachedString = localStorage.getItem('weatherAppData');
            const cachedData = JSON.parse(cachedString);
            
            const isRecent = (Date.now() - cachedData.timestamp) < (10 * 60 * 1000);
            expect(isRecent).toBe(true);
        });

        test('Deve invalidar o cache se passaram mais de 10 minutos', () => {
            const mockData = {
                city: 'são paulo',
                timestamp: 1000000 - (15 * 60 * 1000), 
                geo: { lat: 10, lon: 20 },
                weather: { temp: 25 }
            };
            localStorage.setItem('weatherAppData', JSON.stringify(mockData));

            const cachedString = localStorage.getItem('weatherAppData');
            const cachedData = JSON.parse(cachedString);
            
            const isRecent = (Date.now() - cachedData.timestamp) < (10 * 60 * 1000);
            expect(isRecent).toBe(false); 
        });
    });

});