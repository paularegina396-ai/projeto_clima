# 🌤️ Previsão do Tempo API

Um aplicativo web rápido e responsivo de Previsão do Tempo construído para demonstrar fundamentos avançados de desenvolvimento de software e consumo de APIs externas.

## 🎯 Objetivo
O objetivo deste projeto é demonstrar proficiência em **JavaScript Vanilla**, manipulação da DOM, tratamento de erros resiliente, e chamadas assíncronas (Fetch API), tudo isso sem depender de frameworks externos. A interface foi desenhada para ser limpa e intuitiva, suportando transições de tema dinâmicas (Dia/Noite).

## 🚀 Tecnologias Utilizadas
- **HTML5:** Semântica estruturada.
- **CSS3:** Variáveis nativas (Custom Properties), layout responsivo (Flexbox) e transições suaves.
- **JavaScript (ES6+):** Async/Await, Modularidade, Tratamento de Exceções e Expressões Regulares (Regex).
- **Jest:** Suíte de testes unitários para garantir a confiabilidade das requisições e validações.
- **JSDoc:** Documentação estruturada do código-fonte.

## 🔌 APIs Externas
Este projeto consome dados da [Open-Meteo API](https://open-meteo.com/), utilizando dois endpoints distintos:
1. **Geocoding API:** Para converter o nome da cidade inserido em coordenadas (Latitude e Longitude).
2. **Weather Forecast API:** Para obter os dados climáticos em tempo real baseados nas coordenadas.

## 📁 Estrutura de Pastas
```text
PROJETO_CLIMA/
├── assets/
│   ├── css/
│   │   └── styles.css      # Estilos e temas (Dia/Noite)
│   ├── icons/              # Weather Icons (SVG)
│   └── js/
│       └── api.js          # Lógica principal documentada com JSDoc
├── tests/
│   └── api.test.js         # Suíte de testes unitários com Jest
├── index.html              # Ponto de entrada da aplicação
├── package.json            # Dependências e scripts de teste
└── README.md               # Documentação do projeto


⚙️ Como Executar o Projeto
Clone este repositório:

Bash
git clone [https://github.com/SEU-USUARIO/projeto_clima.git](https://github.com/SEU-USUARIO/projeto_clima.git)
Abra o arquivo index.html em qualquer navegador web moderno.

Para rodar a suíte de testes:

Certifique-se de ter o Node.js instalado.

Instale as dependências: npm install

Execute os testes: npm test

💡 Melhorias Implementadas
Validação de Input: Bloqueio de submissões vazias ou contendo números.

Caching: Sistema leve em memória para evitar requisições duplicadas.

Tratamento de Exceções: Respostas tratadas para erros de API (500), Rate Limits (429) e Falhas de Rede.

Testes Unitários: Cobertura de cenários ideais (Happy Path) e casos extremos (Edge Cases).


---

### 4.5. Comandos Git para Versionamento

Após revisar o código, rodar `npm test` no terminal para garantir que tudo continua passando, crie a nova branch e versione sua documentação:

```bash
# 1. Cria e muda para a nova branch de documentação
git checkout -b 04_doc_review

# 2. Adiciona o README e as atualizações do api.js
git add README.md assets/js/api.js

# 3. Registra o commit
git commit -m "docs: adiciona README padronizado, JSDoc nas funcoes e refatoracao com cache"

# 4. Envia para o repositório remoto
git push origin 04_doc_review