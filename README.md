# 🌤️ Projeto Clima — Previsão do Tempo com JavaScript Vanilla

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

Uma aplicação web moderna, responsiva e performática de previsão do tempo, desenvolvida sem o uso de frameworks adicionais no Front-end. O projeto demonstra boas práticas de engenharia de software, consumo assíncrono de APIs externas, tratamento resiliente de exceções, persistência em cache e testes automatizados com Jest.

---

## 📌 Índice
- [Visão Geral](#-visão-geral)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Arquitetura & Boas Práticas](#-arquitetura--boas-práticas)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Como Executar o Projeto](#-como-executar-o-projeto)
- [Suíte de Testes](#-suíte-de-testes)
- [Licença](#-licença)

---

## 📖 Visão Geral

O **Projeto Clima** permite consultar dados meteorológicos em tempo real de qualquer cidade do mundo. A aplicação realiza uma requisição dupla e orquestrada à API gratuita **Open-Meteo**:
1. Converte o nome da cidade em coordenadas geográficas (Latitude e Longitude) via API de Geocodificação.
2. Obtém a temperatura e as condições climáticas atuais utilizando essas coordenadas.

---

## ⚡ Funcionalidades Principais

- **Busca por Cidade:** Consulta de dados meteorológicos de qualquer localização.
- **Validação Antecipada (Sanitização de Input):** Bloqueio instantâneo de nomes vazios ou com caracteres numéricos (ex: "São Paulo 123"), evitando requisições desnecessárias.
- **Cache de Dados (LocalStorage):** Armazenamento temporário dos dados da consulta por até 10 minutos. Se a mesma cidade for pesquisada dentro do prazo, os dados são carregados do navegador sem consumir a rede.
- **Tema Dinâmico (Dia/Noite):** Alternância automática do visual da página (cores e fundo) com base no horário do local pesquisado (`is_day`).
- **Mapeamento de Clima Visual:** Tradução técnica dos códigos WMO da API para descrições em Português e exibição dos ícones correspondentes (Weather Icons).
- **Interface Responsiva:** Layout adaptável para dispositivos móveis e desktops utilizando CSS puro.

---

## 📐 Arquitetura & Boas Práticas

- **Single Responsibility Principle (SRP):** Funções pequenas e com responsabilidades bem isoladas (Validação, Fetching, UI, Cache).
- **Tratamento Granular de Erros:** Respostas visuais amigáveis para falhas de rede, limites de requisições (429), respostas nulas e erros internos de servidor (500).
- **Documentação com JSDoc:** Código inteiramente documentado indicando parâmetros (`@param`), tipos de retornos (`@returns`), exceções lançadas (`@throws`) e exemplos práticos (`@example`).

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Finalidade |
| :--- | :--- |
| **HTML5** | Estruturação semântica da interface web |
| **CSS3** | Estilização, variáveis CSS nativas e responsividade |
| **JavaScript (ES6+)** | Lógica de programação, consumo de APIs (Fetch) e manipulação do DOM |
| **Jest** | Framework de testes unitários em JavaScript |
| **Open-Meteo API** | Provedor externo de geolocalização e dados meteorológicos |

---

## 📁 Estrutura de Pastas

```text
PROJETO_CLIMA/
│
├── assets/
│   ├── css/
│   │   └── styles.css      # Estilização global e temas Dia/Noite
│   ├── icons/              # Ícones meteorológicos em formato SVG
│   └── js/
│       └── api.js          # Lógica principal, requisições e Cache
│
├── tests/
│   └── api.test.js         # Suíte de testes unitários com Jest
│
├── .gitignore              # Arquivos ignorados pelo Versionamento Git
├── index.html              # Interface estrutural principal
├── package.json            # Configurações do projeto Node e scripts de teste
└── README.md               # Documentação completa do projeto


🚀 Como Executar o Projeto
Pré-requisitos
Para apenas utilizar a aplicação, basta ter um navegador web atualizado (Chrome, Edge, Firefox, Safari).

Para rodar a suíte de testes unitários, é necessário ter o Node.js instalado em sua máquina.

Passo a Passo
Clonar o Repositório:

Bash
git clone [https://github.com/SEU_USUARIO/projeto_clima.git](https://github.com/SEU_USUARIO/projeto_clima.git)
cd projeto_clima
Abrir a Aplicação:

Basta dar um duplo clique no arquivo index.html ou abri-lo utilizando a extensão Live Server no VS Code.

Testar o Cache no Navegador:

Digite uma cidade (ex: Ubatuba) e clique em Buscar.

Abra o Console do Desenvolvedor (F12 -> Console).

Recarregue a página (F5) e digite a mesma cidade novamente.

Veja a mensagem: 📦 Retornando dados do Cache (sem gastar API)!

🧪 Suíte de Testes
Os testes unitários foram construídos com Jest para garantir que todas as funções funcionem isoladamente e com simulações de cenários de erro (Mocks).

Executando os Testes
Instale as dependências de desenvolvimento e rode os testes no terminal:

Bash
# Instalar dependências
npm install

# Executar a suíte de testes
npm test
Cenários Cobertos nos Testes
✅ Validação de entradas vazias ou contendo dígitos/números.

✅ Retorno de dados em buscas bem-sucedidas.

✅ Lançamento de exceção tratada para cidades inexistentes.

✅ Tratamento de falhas de servidor (Erro 500) e erro de limite de requisições (Status 429).

✅ Simulação de falhas de conexão/rede (Network Error).

✅ Validação e expiração do Cache no LocalStorage (Tempo Limite de 10 minutos).

📄 Licença
Este projeto está sob a licença MIT — sinta-se livre para utilizar, estudar e aprimorar o código.


---

### Passos Finais no Git (Branch `05_nova_feature` ou `06_readme`)

Com o `README.md` atualizado e todos os testes do Jest passando (após a limpeza da duplicação), versione as alterações finais no Git:

```bash
# 1. Adiciona o README atualizado
git add README.md

# 2. Faz o commit registrando a finalização da documentação
git commit -m "docs: atualiza o README.md com estrutura completa, guia de execução e testes"

# 3. Envia as alterações para o repositório remoto
git push origin 05_nova_feature