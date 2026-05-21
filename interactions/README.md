# Índice de Interações

Cada arquivo nesta pasta documenta uma interação bilateral entre dois papéis.

## Mapa de Interações

```mermaid
flowchart LR
    CEO -->|Direção estratégica| CTO
    SALES -->|Registro de intake| PO
    MKTG -->|Registro de intake| PO
    CS -->|Registro de intake| PO
    CS -->|Sinal de feedback| PM

    PO -->|Solicitação de discovery| CTO
    PO -->|Escalada arquitetural| CTO
    CTO -->|Avaliação técnica| PO

    PO -->|Readiness Package| PM
    PM -->|Escalada de capacidade| PO

    PM -->|Plano de Execução + RP| TL
    TL -->|Confirmação de contexto / bloqueio de escopo| PM

    TL -->|Tarefas definidas| ENG
    ENG -->|Discovery de escopo| TL

    ENG -->|Implementação concluída| QA
    QA -->|Aprovação / rejeição de release| PM

    PM -->|Resumo de entrega| CS
    PM -->|Relatório de feedback| PO

    style CEO fill:#e8f4f8,stroke:#2196F3,color:#000
    style SALES fill:#e8f4f8,stroke:#2196F3,color:#000
    style MKTG fill:#e8f4f8,stroke:#2196F3,color:#000
    style CS fill:#e8f4f8,stroke:#2196F3,color:#000
    style PO fill:#fff8e1,stroke:#FF9800,color:#000
    style CTO fill:#fff8e1,stroke:#FF9800,color:#000
    style PM fill:#e8f5e9,stroke:#4CAF50,color:#000
    style TL fill:#e8f5e9,stroke:#4CAF50,color:#000
    style ENG fill:#e8f5e9,stroke:#4CAF50,color:#000
    style QA fill:#e8f5e9,stroke:#4CAF50,color:#000
```

## Índice de Arquivos

| # | Arquivo | Interação | Camada |
|---|---|---|---|
| 01 | `01-sales-to-po-pt-br.md` | Vendas → PO | Upstream → Intake |
| 02 | `02-cs-to-po-pt-br.md` | CS → PO | Upstream → Intake |
| 03 | `03-marketing-to-po-pt-br.md` | Marketing → PO | Upstream → Intake |
| 04 | `04-ceo-to-cto-pt-br.md` | CEO → CTO | Executivo → Liderança Técnica |
| 05 | `05-po-to-cto-pt-br.md` | PO → CTO | Dentro do Intake |
| 06 | `06-cto-to-po-pt-br.md` | CTO → PO | Dentro do Intake |
| 07 | `07-po-to-pm-pt-br.md` | PO → PM | Intake → Downstream |
| 08 | `08-pm-to-po-capacity-pt-br.md` | PM → PO (Escalada de Capacidade) | Dentro do Downstream |
| 09 | `09-pm-to-tech-leads-pt-br.md` | PM → Tech Leads | Dentro do Downstream |
| 10 | `10-tech-leads-to-engineers-pt-br.md` | Tech Leads → Engenheiros | Dentro do Downstream |
| 11 | `11-engineers-to-qa-pt-br.md` | Engenheiros → QA | Dentro do Downstream |
| 12 | `12-qa-to-pm-pt-br.md` | QA → PM | Dentro do Downstream |
| 13 | `13-pm-to-cs-pt-br.md` | PM → CS | Pós-Entrega |
| 14 | `14-pm-to-po-feedback-pt-br.md` | PM → PO (Fechamento do Loop de Feedback) | Pós-Entrega |

## Resumo das Regras de Rejeição

| Interação | Pode ser rejeitada? | Responsável pela rejeição |
|---|---|---|
| Vendas → PO | Sim — intake incompleto | PO devolve para Vendas |
| CS → PO | Sim — evidência insuficiente | PO abre Discovery |
| Marketing → PO | Sim — não é padrão de segmento | PO redireciona para CS/Vendas |
| CEO → CTO | Não — mas gera trade-off | CTO apresenta o custo ao CEO |
| PO → CTO | Sim — escopo inviável | CTO devolve com veto + justificativa |
| CTO → PO | Não — PO deve integrar | PO escala discordância explicitamente |
| PO → PM | Sim — RP incompleto | PM devolve com gaps específicos |
| PM → PO (capacidade) | Não — dispara decisão | PO decide o trade-off |
| PM → Tech Leads | Sim — contexto faltando | TL devolve gaps específicos |
| Tech Leads → Engenheiros | Sim — tarefa indefinida | Eng devolve pergunta específica |
| Engenheiros → QA | Sim — no-go | QA devolve critérios com falha |
| QA → PM | Não — PM não pode sobrepor | PM escala apenas o prazo |
| PM → CS | Não — CS deve coletar | CS devolve feedback estruturado |
| PM → PO (feedback) | Não — PO deve reconhecer | PO fecha o loop explicitamente |
