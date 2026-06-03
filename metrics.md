# Métricas e Observabilidade do Modelo

> O Registro de Intake ([`templates/00-submitter-brief.md`](./templates/00-submitter-brief.md)) é um **snapshot** do conteúdo de *uma* demanda no handoff. Este documento cobre o que o snapshot não captura: **medição ao longo do tempo e entre demandas**. São três camadas distintas, com donos e ciclos de vida diferentes.

| Camada | Pergunta que responde | Dono | Horizonte |
|---|---|---|---|
| **1. Métricas da demanda** | "Como *esta* demanda está evoluindo?" | PO (Intake) | Ciclo de vida de uma demanda |
| **2. Métricas do portfólio** | "Como o intake como um todo está performando?" | PO / PM | Contínuo / trimestral |
| **3. Pós-handoff e resultado** | "O que a demanda entregue *de fato* gerou de valor?" | PM + CS / PO | 30 / 60 / 90 dias pós-rollout |

> **Confiança atravessa as três.** Valores *projetados* (no intake) carregam confiança; valores *realizados* (pós-entrega) são medidos. A comparação projetado-vs-realizado é o coração da camada 3.

---

## 1. Métricas da demanda (a demanda em si)

Instrumentação do ciclo de vida de **uma** demanda — uma série temporal sobre o seu progresso, não o conteúdo estático do registro. Alimenta a visão de "como vamos" de uma demanda específica.

| Métrica | O que mede | Fonte |
|---|---|---|
| **Readiness Score (trajetória)** | Evolução do score de prontidão ao longo do tempo, não só o valor final | Derivado dos requisitos de compliance |
| **Tempo em cada estado** | Quanto tempo a demanda passou em Captura, Triagem, Discovery, Racionalização, etc. | Máquina de estados ([`README.md` §9](./README.md)) |
| **Trajetória de confiança** | Confiança média dos campos ao longo do tempo (quão sólida a demanda ficou) | Camada de confiança ([`personas/01-submitter.md` §3](./personas/01-submitter.md)) |
| **Pendências por disposição** | Quantos requisitos foram respondidos vs inferidos vs premissa vs discovery vs delegado | `SubmissionEntry.disposition` |
| **Ciclos de Discovery** | Nº de idas a Discovery e duração vs time-box | Discovery Brief |
| **Rebotes (rejeições do PM)** | Quantas vezes o RP voltou do PM ao PO | Histórico de revisão do RP |
| **Versões até o congelamento** | Nº de versões do registro / RP antes de `gateReady` | Histórico de revisão |
| **Aderência a SLA** | Tempo real vs SLA do estado | [`03-slas.md`](./03-slas.md) |

---

## 2. Métricas agregadas do portfólio (todas as demandas)

Visão de agregado entre muitas demandas. **Parcialmente coberta nos protótipos** (KPIs de dashboard) e em [`personas/01-submitter.md` §8](./personas/01-submitter.md). Consolidada aqui.

| Métrica | O que mede | Já no protótipo? |
|---|---|---|
| **Taxa de conversão demanda → RP** | % de demandas submetidas que sobrevivem ao gate | ✅ (ex.: 64%) |
| **Lead time submissão → congelado** | Tempo médio do intake até o RP congelado | ✅ (ex.: 8,5 dias) |
| **Aceite na 1ª versão** | % de RPs aceitos pelo PM sem v1.1 — *qualidade do material bruto* | ✅ (ex.: 78%) |
| **Throughput** | Demandas/RPs concluídos por período | ✅ |
| **Distribuição por estado** | Quantas demandas em cada estado agora (gargalos) | parcial |
| **Distribuição por origem / prioridade** | De onde vêm as demandas e como se distribuem | parcial |
| **Taxa de rejeição / backlog** | % rejeitadas ou enviadas a backlog de oportunidade na triagem | — |
| **Tempo médio de avaliação do CTO** | Quando há escalada arquitetural | ✅ (ex.: 3,2 dias) |

> Estas métricas existem para **gerenciar a restrição** (o CTO/PO como gargalo — Theory of Constraints, ver [`references.md` §5](./references.md)). Lead time e distribuição por estado mostram onde a fila trava.

---

## 3. Estratégia de acompanhamento pós-handoff (resultado de negócio)

A demanda não termina no release. Esta camada **acompanha a demanda entregue** e mede o **valor de negócio realizado** — fechando o feedback loop ([`README.md` §11](./README.md) e o estado `FeedbackLoop` em [`README.md` §9](./README.md)). **Parcialmente coberta no protótipo** (drill-down "Impacto anual"; métricas medidas 30/60/90d pós-rollout).

### 3.1 Acompanhamento da execução

Após o handoff, a demanda segue visível à Submitter como portfólio (ela quer ver o que pediu sendo entregue):

| Métrica | O que mede |
|---|---|
| **Estado de execução** | Em planejamento / quebra técnica / desenvolvimento / QA / entregue |
| **Previsão vs realizado** | Data prevista de entrega vs data real |
| **PM responsável** | Quem está conduzindo |

### 3.2 Resultado de negócio (projetado vs realizado)

O cerne. No intake, a Submitter *projetou* valor (Critérios de Sucesso + Indicadores de Valor). Aqui medimos o que **de fato** aconteceu.

| Dimensão | No intake (projetado) | Pós-rollout (realizado) | Janela |
|---|---|---|---|
| **Impacto anual** | R$ projetado (carrega confiança) | R$ medido | 30 / 60 / 90 d |
| **Critérios de sucesso** | Metas declaradas | % das metas atingidas | 30 / 60 / 90 d |
| **Adoção** | Expectativa de uso | Uso real | 30 / 60 / 90 d |
| **Satisfação / NPS** | Hipótese | Medido com cliente (via CS) | 60 / 90 d |

**Critério de sucesso completo** (herdado do protótipo): atingir N de M metas dentro de 90 dias.

### 3.3 Realimentação

O delta projetado-vs-realizado alimenta o aprendizado do PO ([`README.md` Feedback Loop](./README.md)): calibra a confiança de futuras projeções da Submitter e melhora a triagem. **Acerto de projeção** vira, com o tempo, mais uma métrica de qualidade da Submitter — análoga ao "aceite na 1ª versão", mas para o valor de negócio.

---

## Relação com os demais documentos

| Documento | Relação |
|---|---|
| [`templates/00-submitter-brief.md`](./templates/00-submitter-brief.md) | Fornece os valores *projetados* (Critérios de Sucesso, Indicadores de Valor) que a camada 3 confronta com o realizado |
| [`personas/01-submitter.md`](./personas/01-submitter.md) | §8 define as métricas de portfólio da Submitter; este doc generaliza para demanda, portfólio e resultado |
| [`03-slas.md`](./03-slas.md) | Define os SLAs que a camada 1 mede aderência |
| [`README.md`](./README.md) | Máquina de estados (§9) e Feedback Loop (§11) são as fontes das camadas 1 e 3 |
| [`prototypes/`](./prototypes/) | Pesquisa primária — KPIs de dashboard e drill-down de impacto anual originam as camadas 2 e 3 |
