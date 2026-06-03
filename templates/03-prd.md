# PRD — [Nome da Demanda]

> O PRD (Product Requirements Document) é a **fusão** do [Readiness Package](./01-readiness-package.md) (produto, autoria do PO) com o [Technical Assessment](./02-technical-assessment.md) (técnico, autoria do CTO). É o **único artefato que abre o downstream** — entregue ao **PM**. Cada metade mantém autoria clara: o PO não escreve a parte técnica, o CTO não reescreve o produto. O PRD costura, reconcilia e expõe ao PM o que ele precisa para planejar. Ver [`personas/02-po.md` §2, §10 e §11](../personas/02-po.md).
>
> **Quando não houve escalada ao CTO:** o PRD se forma apenas a partir do RP; a Parte B referencia "sem Technical Assessment — sem impacto arquitetural".
>
> `PRD = RP (PO) + Technical Assessment (CTO)`

## Metadados

| Campo | Valor |
|---|---|
| **ID do PRD** | PRD-AAAA-NNN |
| **Versão** | v1 |
| **RP vinculado** | RP-AAAA-NNN vX |
| **Technical Assessment vinculado** | TA-AAAA-NNN vX / N/A — sem escalada |
| **Intake vinculado** | INT-AAAA-NNN |
| **Autores** | [Nome] (PO) + [Nome] (CTO) |
| **Status** | Rascunho / Em revisão do PM / Aceito / Devolvido |
| **Entregue ao PM em** | — |

## Histórico de Revisão

| Versão | Data | Autor | Status | Resumo |
|---|---|---|---|---|
| v1 | AAAA-MM-DD | PO + CTO | Rascunho | Fusão inicial RP + TA. |

---

## Sign-off

> A fusão só fecha com dupla assinatura. O veredito de viabilidade vem do Technical Assessment.

| Papel | Nome | Veredito | Data |
|---|---|---|---|
| **PO** (produto) | [Nome] | RP congelado (freeze) | AAAA-MM-DD |
| **CTO** (técnico) | [Nome] | Viável / Viável com ressalvas / N/A | AAAA-MM-DD |

---

## Resumo Executivo Combinado

> 2–4 parágrafos: o problema, o que será construído, a viabilidade técnica e o resultado esperado de negócio. A visão de uma página para CEO/CFO/PM.

[Resumo aqui]

---

## Parte A — Definição de Produto (do Readiness Package · PO)

> Síntese das seções-chave do RP. O documento-fonte completo é [`RP-AAAA-NNN`](./01-readiness-package.md); aqui fica o que o PM precisa para planejar, sem reescrever o RP inteiro.

### A.1 Objetivos e Resultado Esperado

1. [Objetivo 1]

### A.2 Escopo (final)

**Incluído:** [itens]
**Excluído:** [itens]
**Adiado:** [itens]

### A.3 Personas / Jobs-to-be-done

| Persona | Job | Impacto |
|---|---|---|
| [Persona] | [Job] | [Impacto] |

### A.4 Regras de Negócio e Fluxos

[Resumo ou referência às seções do RP]

### A.5 User Stories + Critérios de Aceite

| ID | História | Critério de aceite (Given/When/Then) |
|---|---|---|
| ST-001 | [Como… quero… para…] | [Dado/Quando/Então] |

### A.6 Requisitos Não-Funcionais (NFRs)

| Dimensão | Requisito | Verificação |
|---|---|---|
| [Performance / Segurança / …] | [Requisito] | [Como] |

### A.7 Edge Cases e Modos de Falha

- [Edge case / falha → comportamento esperado]

---

## Parte B — Definição Técnica (do Technical Assessment · CTO)

> Síntese do TA. O documento-fonte completo é [`TA-AAAA-NNN`](./02-technical-assessment.md). Preencher "N/A — sem escalada arquitetural" quando não houve CTO.

### B.1 Veredito de Viabilidade

| Campo | Valor |
|---|---|
| **Veredito** | Viável / Viável com ressalvas / Inviável como escopado / N/A |
| **Ressalvas** | [—] |

### B.2 Impacto Arquitetural e Integrações

| Área / Sistema | Impacto | Nota |
|---|---|---|
| [Modelo de dados / Integração / …] | [Descrição] | |

### B.3 Constraints Rígidas

| Constraint | Efeito no escopo |
|---|---|
| [Constraint] | [O que limita] |

### B.4 ADRs (nível arquitetural)

| # | Decisão | Sign-off CTO |
|---|---|---|
| ADR-001 | [Decisão] | ✓ |

---

## Reconciliação de Escopo

> Se o CTO vetou ou impôs constraints que mudaram o escopo do RP, registre aqui o que mudou e o acordo final entre PO e CTO. Se nada mudou: "Escopo do RP mantido integralmente."

| Item original (RP) | Mudança após Technical Assessment | Motivo |
|---|---|---|
| [Item] | Adicionado / Removido / Reescopado | [Constraint ou veto] |

---

## Visão Consolidada de Riscos e Dependências

> Riscos de produto/negócio (do RP, Seção 12) + riscos técnicos (do TA) em uma tabela única — o PM planeja contra esta visão.

| Risco | Origem | Tipo | Probabilidade | Impacto | Mitigação |
|---|---|---|---|---|---|
| [Risco] | RP / TA | Produto / Negócio / Técnico / Externo / Compliance | Alta/Média/Baixa | Alto/Médio/Baixo | [Mitigação] |

**Dependências externas conhecidas:** [ação do cliente, procurement, integração de terceiros — ou "Nenhuma"]

---

## Esforço e Custo (firme)

> Do Technical Assessment (substitui o preliminar do RP). Somente uso interno — não é compromisso contratual nem material para cliente.

| Área | Estimativa firme | Senioridade |
|---|---|---|
| [Backend / Frontend / QA] | [X dias] | [Senioridade] |
| **Total** | **X dias** | |

**Infra / Terceiros / Opex recorrente:** [resumo ou "Nenhum"]

---

## Prontidão Herdada e Dispositions em Aberto

> O que o PM precisa enxergar antes de planejar: premissas a validar, incógnitas de Discovery e respostas delegadas que sobreviveram até aqui. Se uma premissa se provar falsa na execução, a demanda é reavaliada (gatilho de retriagem downstream).

| Campo | Valor |
|---|---|
| **Premissas ainda a validar** | [lista ou —] |
| **Incógnitas de Discovery** | [resolvidas / abertas] |
| **Requisitos delegados (com dono)** | [lista ou —] |

---

## Critérios de Sucesso e Métricas (projetados)

> Baseline projetado que [`../metrics.md`](../metrics.md) (camada 3, projetado vs. realizado) confronta com o medido pós-rollout.

| Tipo | Métrica | Meta (projetada) | Janela | Confiança |
|---|---|---|---|---|
| **Primária** | [Métrica] | [Meta] | [Janela] | __ |
| **Guardrail** | [Métrica que não pode piorar] | [Limite] | | __ |

---

## Handoff ao PM — Gate de Aceite

> O PM tem **autoridade explícita para rejeitar** o PRD e devolvê-lo com gaps específicos (não um genérico "precisa de mais detalhes"). A rejeição e o motivo entram no Histórico de Revisão; o PO (ou o CTO, conforme o gap) trata só os gaps e incrementa a versão. Ver [`interactions/07-po-to-pm.md`](../interactions/07-po-to-pm.md).

| Checklist de entrega | OK? |
|---|---|
| RP congelado (freeze) e referenciado | ☐ |
| Technical Assessment assinado (ou N/A justificado) | ☐ |
| Reconciliação de escopo registrada | ☐ |
| Riscos e dependências consolidados | ☐ |
| Dependências externas explícitas | ☐ |
| Dispositions em aberto visíveis | ☐ |

**Prioridade e contexto de negócio:** [por que esta demanda, agora]
