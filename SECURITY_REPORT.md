# 🛡️ Relatório de Auditoria de Segurança e Privacidade

**Projeto:** Previsão do Tempo API  
**Data da Auditoria:** Agosto de 2026  
**Escopo:** Análise de vulnerabilidades do Front-end (HTML/CSS/JS) e comunicação com a API Open-Meteo.

## 1. Visão Geral
Este documento detalha as medidas de segurança e as políticas de privacidade implementadas na aplicação para garantir a integridade da comunicação, a proteção contra ataques de injeção e o respeito à privacidade dos usuários.

## 2. Análise de Riscos e Mitigações Aplicadas

### 2.1. Armazenamento e Exposição de Chaves (API Keys)
- **Risco:** Exposição de credenciais ou tokens de acesso no lado do cliente (Front-end).
- **Status:** Seguro.
- **Mitigação:** A aplicação consome exclusivamente a API pública da [Open-Meteo](https://open-meteo.com/), que não requer autenticação via tokens (API Keys) para consultas básicas. Portanto, não há risco de vazamento de credenciais no código-fonte.

### 2.2. Injeção de Código (XSS - Cross-Site Scripting)
- **Risco:** Execução de scripts maliciosos injetados pelo usuário no campo de busca.
- **Status:** Mitigado.
- **Mitigação:** 
  1. O input do usuário passa por validação via Expressões Regulares (Regex), bloqueando a submissão de caracteres numéricos.
  2. A renderização dos resultados no DOM utiliza a propriedade `textContent` ao invés de `innerHTML`, impedindo que eventuais tags HTML ou scripts inseridos sejam interpretados pelo navegador.

### 2.3. Privacidade e Armazenamento Local
- **Risco:** Coleta excessiva de dados pessoais ou retenção de histórico de localização de forma insegura.
- **Status:** Mitigado.
- **Mitigação:** O projeto não coleta nenhum Dado Pessoal Identificável (PII). A funcionalidade de cache utiliza o `localStorage` do navegador estritamente para salvar o nome da última cidade pesquisada e seus dados climáticos genéricos, com uma política de expiração automática (TTL) de 10 minutos.

## 3. Alertas de Privacidade na Interface
Para garantir transparência, foram adicionados avisos visuais no rodapé da aplicação contendo as seguintes informações:
> "Esta aplicação não coleta, armazena ou compartilha dados pessoais. As buscas são processadas em tempo real e não são registradas."

## 4. Recomendações para o Ambiente de Produção
Para que o projeto seja executado de forma 100% segura quando hospedado (ex: GitHub Pages, Vercel, Netlify), recomenda-se:
1. **Forçar HTTPS:** Garantir que o ambiente de hospedagem redirecione todas as conexões HTTP para HTTPS, prevenindo ataques *Man-in-the-Middle (MitM)*.
2. **Content Security Policy (CSP):** Implementar cabeçalhos de segurança (HTTP Headers) limitando de quais domínios a aplicação pode baixar imagens e scripts externos.