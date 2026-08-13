# ⚖️ Relatório de Auditoria de Licenciamento e Conformidade

**Projeto:** Previsão do Tempo API  
**Data da Auditoria:** Agosto de 2026  

## 1. Objetivo
Avaliar o licenciamento das bibliotecas de terceiros, APIs e dependências utilizadas no ecossistema JavaScript/Node.js do projeto, garantindo compatibilidade para uso educacional, de portfólio ou comercial.

## 2. Inventário de Dependências e Licenças

| Componente / Dependência | Tipo | Licença | Compatibilidade | Restrições / Obrigações |
| :--- | :--- | :--- | :--- | :--- |
| **Open-Meteo API** | Serviço Externo | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | ✅ Sim | Exige atribuição clara (créditos) ao provedor na interface. |
| **Weather Icons** | Assets (Imagens/SVG) | SIL OFL 1.1 / MIT | ✅ Sim | Livre para uso comercial, exige manutenção dos avisos de direitos autorais originais. |
| **Jest** | Dependência de Dev (npm) | MIT | ✅ Sim | Nenhuma restrição impeditiva. |

## 3. Ações de Conformidade Implementadas

Para garantir total conformidade técnica e ética, as seguintes etapas foram concluídas:

1. **Licença do Projeto (LICENSE):** 
   Criado o arquivo `LICENSE` na raiz do repositório contendo a **Licença MIT** (com versão em Inglês e Português-BR). Esta licença permite que outras pessoas usem, copiem e modifiquem o código do projeto, resguardando o autor original contra passivos (Cláusula de Isenção de Responsabilidade).

2. **Atribuições de Terceiros (NOTICE.md):** 
   Criado o arquivo `NOTICE.md` centralizando todos os créditos das tecnologias gratuitas que possibilitaram o projeto (Open-Meteo e Weather Icons).

3. **Atribuição Visível no Front-end:** 
   O requisito da licença *CC BY 4.0* da API foi cumprido com a inserção de um hiperlink fixo no rodapé do arquivo `index.html`:
   > "Dados meteorológicos fornecidos por Open-Meteo.com sob licença CC BY 4.0"

## 4. Conclusão
Não foram encontrados conflitos de licenciamento. O projeto atual encontra-se 100% em conformidade com as diretrizes de código aberto e pode ser distribuído ou hospedado publicamente sem riscos legais associados a direitos autorais de terceiros.