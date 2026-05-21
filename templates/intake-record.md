# Registro de Intake — [Nome da Demanda]

## Metadados

| Campo | Valor |
|---|---|
| **ID do Registro** | INT-AAAA-NNN |
| **Versão** | v1 |
| **Registrado por** | [Nome] ([Papel]) |
| **Data de registro** | AAAA-MM-DD |
| **Status** | Novo |
| **Data de triagem** | — |
| **Triado por** | — |
| **Readiness Package vinculado** | — |

## Histórico de Revisão

| Versão | Data | Evento | Resumo |
|---|---|---|---|
| v1 | AAAA-MM-DD | Intake registrado | [Breve descrição] |

---

## Origem

| Campo | Valor |
|---|---|
| **Fonte** | Cliente / Interno / Mercado / Suporte |
| **Cliente / Solicitante** | [Nome] |
| **Reportado via** | [Canal — chamada, email, ticket de suporte, etc.] |

---

## Tipo

- [ ] Funcionalidade
- [ ] Bug
- [ ] Melhoria
- [ ] Compliance
- [ ] Integração
- [ ] Operacional

---

## Enunciado do Problema

> Qual a dor existente? Descreva o problema, não a solução.

[Descreva o problema aqui]

---

## Impacto de Negócio

> Use as dimensões aplicáveis à demanda. Receita, Retenção, Operacional, Competitivo, Compliance, Mercado são os mais comuns. Não force dimensões irrelevantes.

| Dimensão | Detalhe |
|---|---|
| **Receita** | [Quantifique se possível — ARR de expansão, deal bloqueado, etc.] |
| **Retenção** | [Risco de churn ou impacto em renovação] |
| **Operacional** | [Impacto em workarounds, tempo, eficiência] |
| **Competitivo** | [Lacuna em relação a concorrentes ou diferencial perdido] |
| **Compliance** | [Requisitos legais ou regulatórios] |

---

## Stakeholders

| Stakeholder | Papel | Interesse | Influência |
|---|---|---|---|
| [Nome] | [Papel — Sponsor, Usuário Final, Time Impactado, Tomador de Decisão] | [O que essa pessoa quer] | Alta / Média / Baixa |

---

## Premissas

Estas são condições assumidas como verdadeiras no intake. Se alguma premissa se provar falsa, a demanda deve ser retriada.

1. [Premissa 1]
2. [Premissa 2]

---

## Constraints

Condições que limitam o espaço de solução e devem ser respeitadas independentemente do que for construído.

| Constraint | Tipo | Detalhe |
|---|---|---|
| [Constraint 1] | Tempo / Orçamento / Legal / Técnico / Escopo / Externo | [Detalhe] |

---

## Riscos Preliminares

Riscos identificados no intake — antes da avaliação técnica. Não é um registro completo de riscos (isso pertence ao Readiness Package).

| Risco | Categoria | Avaliação Inicial |
|---|---|---|
| [Risco 1] | Técnico / Negócio / Externo / Segurança / Prazo / Produto | [Alto / Médio / Baixo + breve nota] |

> Para demandas que passam por Discovery, este registro pode ser expandido com colunas de Probabilidade e Impacto.

---

## Limite de Escopo de Alto Nível

**Dentro:** [O que claramente está dentro deste release.]

**Fora:** [O que claramente está fora — exclusões explícitas para prevenir scope creep.]

**Adiado:** [O que pode ser tratado em fase futura — alimenta o backlog de oportunidades.]

---

## Prioridade

**Nível:** Crítico / Alto / Médio / Baixo

**Motivo:** [Por que esse nível]

---

## Critérios de Sucesso

Indicadores de alto nível que definem como é "concluído e valioso" para esta demanda. Metas mensuráveis detalhadas pertencem ao Readiness Package — estes são os sinais no nível do intake.

| Critério | Tipo | Indicador |
|---|---|---|
| [Critério 1] | Negócio / Operacional / Qualidade / UX / Segurança / Compliance / Processo | [Como observar] |

---

## Notas de Triagem do PO

Análise do PO sobre alinhamento estratégico, escopo aparente e necessidade de Discovery.

**Caminho de decisão:** Rejeitado / Backlog de Oportunidades / Discovery / Product Ready

**Escalada arquitetural ao CTO:** Sim / Não — [breve justificativa]

**Premissas validadas na triagem:** [Quais foram revisadas e o veredito]

**Constraints reconhecidos:** [Quais o PM deve considerar desde o primeiro dia]

[Notas adicionais do PO aqui]

---

## Discovery Brief

> Preencher apenas se a demanda for enviada para Discovery. Caso contrário, remover esta seção.

### O que está faltando

| # | Incógnita | Quem pode responder | Método |
|---|---|---|---|
| 1 | [Incógnita] | [PO / CTO / Cliente / Vendas] | [Spike técnico / Chamada com cliente / Revisão de infraestrutura] |

**Time-box do Discovery:** [N dias] (AAAA-MM-DD → AAAA-MM-DD)

---

### Log do Discovery

#### AAAA-MM-DD — [Evento]

[Resumo do que foi feito, finding, decisão ou bloqueio]

---

### Resultado do Discovery

| # | Incógnita | Resolução | Impacto no escopo |
|---|---|---|---|
| 1 | [Incógnita] | [Resolução] | Adicionado / Removido / Movido para backlog |

**Novo caminho de decisão:** Discovery → Product Ready / Rejeitado / Backlog de Oportunidades

**Discovery encerrado:** AAAA-MM-DD ([N dias — dentro / fora do time-box])
