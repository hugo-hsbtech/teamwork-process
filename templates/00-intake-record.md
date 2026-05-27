# Registro de Intake — [Nome da Demanda]

> **Este é o template em branco.** Instâncias usam prefixo de arquivo `01-`/`02-` (ver [`README.md`](./README.md)).
> O Registro de Intake é um **output**: um artefato preenchido e congelado no handoff ao PO. Cada resposta carrega o quão sólida ela é e de onde veio — a camada de confiança viaja *com* o registro. O raciocínio do modelo (requisitos de compliance, geração de ToDos, fórmula de score) vive em [`personas/01-submitter.md`](../personas/01-submitter.md); este registro apenas o **instancia**.

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

## Resumo de Prontidão (Readiness)

> Snapshot no handoff. O score é derivado dos requisitos abaixo; `low_confidence` conta como parcial. A demanda só sai do Intake quando todos os requisitos bloqueantes estão resolvidos (`gateReady = Sim`).

| Campo | Valor |
|---|---|
| **Readiness Score** | __ % |
| **Gate liberado (gateReady)** | Sim / Não |
| **Requisitos bloqueantes pendentes** | [lista ou — ] |
| **Dispositions** | __ respondidos · __ inferidos · __ premissas · __ discovery · __ delegados |

### Legenda de confiança (aplica-se a cada seção respondida)

Cada seção substantiva traz uma faixa de metadados:

| Atributo | Valores |
|---|---|
| **Confiança** | 0–100 |
| **Fonte** | Submitter direto · Documento anexo (p.X) · Inferido · Premissa · Outro stakeholder |
| **Status** | Vazio · Baixa confiança · Resolvido |
| **Disposição** | Respondido · Inferido · Premissa (a validar) · Discovery (a investigar) · Delegado (dono: __) |
| **Hint** | Por que a confiança está baixa / o que a elevaria |

> **"Não sei" não bloqueia.** Um requisito atinge prontidão por qualquer disposição honesta — inclusive "ninguém sabe ainda, e este é o plano" (Discovery) ou "estamos assumindo X" (Premissa). Ver [`personas/01-submitter.md` §6](../personas/01-submitter.md).

---

## Origem  ·  *(Requisito 2 — Originador e contexto)*

| Campo | Valor |
|---|---|
| **Fonte** | Cliente / Interno / Mercado / Suporte |
| **Cliente / Solicitante** | [Nome] |
| **Originador e contexto** | [Quem levantou e em que situação — ex.: "COO, reunião de planejamento Q2"] |
| **Reportado via** | [Canal — chamada, email, ticket de suporte, etc.] |

`Confiança:` __ · `Fonte:` __ · `Status:` __ · `Disposição:` __ · `Hint:` __

---

## Tipo

- [ ] Funcionalidade
- [ ] Bug
- [ ] Melhoria
- [ ] Compliance
- [ ] Integração
- [ ] Operacional

---

## Enunciado do Problema  ·  *(Requisito 1 — bloqueia gate)*

> Qual a dor existente? Descreva o problema, não a solução. Se o enunciado contém solução proposta, ele volta para reformulação.

[Descreva o problema aqui]

`Confiança:` __ · `Fonte:` __ · `Status:` __ · `Disposição:` __ · `Hint:` __

---

## Quem é Impactado (Alcance)  ·  *(Requisito 3 — bloqueia gate)*

> Personas, segmentos ou times que sentem essa dor. É o "Reach" dos indicadores de valor.

| Persona / Segmento | Como é impactado |
|---|---|
| [Persona] | [Impacto] |

`Confiança:` __ · `Fonte:` __ · `Status:` __ · `Disposição:` __ · `Hint:` __

---

## Impacto de Negócio  ·  *(Requisito 4 — bloqueia gate)*

> Use as dimensões aplicáveis. Receita, Retenção, Operacional, Competitivo, Compliance, Mercado são os mais comuns. Não force dimensões irrelevantes. Quantifique quando possível.

| Dimensão | Detalhe |
|---|---|
| **Receita** | [Quantifique — ARR de expansão, deal bloqueado, etc.] |
| **Retenção** | [Risco de churn ou impacto em renovação] |
| **Operacional** | [Impacto em workarounds, tempo, eficiência] |
| **Competitivo** | [Lacuna ou diferencial perdido] |
| **Compliance** | [Requisitos legais ou regulatórios] |

`Confiança:` __ · `Fonte:` __ · `Status:` __ · `Disposição:` __ · `Hint:` __

---

## Indicadores de Valor (RICE-lite)

> Espelho para desafiar o pensamento — **não** ranking automático. Pontue cada um (Baixo / Médio / Alto). A confiança reusa a coluna acima — não se pontua de novo. O Esforço fica *soft* (chute da Submitter, firmado depois pelo CTO).

| Indicador | Score | Justificativa (na linguagem dela) | Confiança |
|---|---|---|---|
| **Impacto** ("quanto move o negócio?") | B / M / A | [por quê] | __ |
| **Alcance** ("quantos sentem isso?") | B / M / A | [por quê] | __ |
| **Urgência** ("por que agora? custo de esperar?") | B / M / A | [por quê] | __ |
| **Esforço** *(soft — adiado ao CTO)* | B / M / A | [chute inicial] | low_confidence |

> **Tensões a registrar** (desafiam a coerência do pensamento): Impacto alto + confiança baixa? Urgência alta + Impacto baixo? Alcance alto + impacto-por-usuário fino? Anote a resolução de cada tensão — afiar a resposta também eleva a prontidão.

---

## Urgência  ·  *(Requisito 5)*

**Prazo / janela:** [Quando e por quê]

**Custo de esperar:** [O que acontece se não for agora]

`Confiança:` __ · `Fonte:` __ · `Status:` __ · `Disposição:` __ · `Hint:` __

---

## Evidência e Documentos  ·  *(Requisito 6)*

> Anexos ou conversas anteriores que embasam a demanda. Fonte de pré-preenchimento por IA.

| Documento / Conversa | Tipo | Relevância |
|---|---|---|
| [Nome] | [PDF / call / thread] | [O que embasa] |

`Confiança:` __ · `Fonte:` __ · `Status:` __ · `Disposição:` __ · `Hint:` __

---

## Stakeholders  ·  *(Requisito 8)*

| Stakeholder | Papel | Interesse | Influência |
|---|---|---|---|
| [Nome] | [Sponsor, Usuário Final, Time Impactado, Tomador de Decisão] | [O que quer] | Alta / Média / Baixa |

`Confiança:` __ · `Fonte:` __ · `Status:` __ · `Disposição:` __ · `Hint:` __

---

## Premissas

Condições assumidas como verdadeiras no intake. Se uma premissa se provar falsa, a demanda deve ser retriada. Premissas são uma **disposição válida** para requisitos sem resposta direta.

1. [Premissa 1] — `a validar com:` __
2. [Premissa 2] — `a validar com:` __

---

## Constraints  ·  *(Requisito 7)*

Condições que limitam o espaço de solução, a respeitar independentemente do que for construído.

| Constraint | Tipo | Detalhe |
|---|---|---|
| [Constraint 1] | Tempo / Orçamento / Legal / Técnico / Escopo / Externo | [Detalhe] |

`Confiança:` __ · `Fonte:` __ · `Status:` __ · `Disposição:` __ · `Hint:` __

---

## Riscos Preliminares

Riscos identificados no intake — antes da avaliação técnica. Registro completo pertence ao Readiness Package.

| Risco | Categoria | Avaliação Inicial |
|---|---|---|
| [Risco 1] | Técnico / Negócio / Externo / Segurança / Prazo / Produto | [Alto / Médio / Baixo + nota] |

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

Indicadores de alto nível que definem "concluído e valioso". Metas mensuráveis detalhadas pertencem ao Readiness Package; estes são os sinais no nível do intake. **Servem de baseline projetado** para o acompanhamento pós-handoff (ver [`metrics.md`](../metrics.md)).

| Critério | Tipo | Indicador | Valor projetado |
|---|---|---|---|
| [Critério 1] | Negócio / Operacional / Qualidade / UX / Segurança / Compliance / Processo | [Como observar] | [Meta — ex.: R$ 78k/ano] |

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

> Preencher apenas se a demanda for enviada para Discovery (disposição "Discovery" em qualquer requisito). Caso contrário, remover esta seção.

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
