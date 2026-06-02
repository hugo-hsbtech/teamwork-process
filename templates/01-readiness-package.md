# Readiness Package — [Nome da Demanda]

> O Readiness Package (RP) é a **definição de pronto de produto** — o output de produto do PO, escrito **sozinho**. Ele é um documento completo e auto-suficiente: visão, problema, escopo, regras, user stories, NFRs, edge cases, critérios e métricas. **O RP não contém seções de autoria do CTO.** A avaliação técnica vive em um artefato separado — o [Technical Assessment](./02-technical-assessment.md) (CTO) — que o RP apenas **referencia** (ver "Referência ao Technical Assessment"). A fusão dos dois acontece no [PRD](./03-prd.md), e é o PRD — não o RP — que abre o downstream. Ver [`personas/02-po.md` §2 e §6.2](../personas/02-po.md).
>
> O RP **herda a camada de confiança** do Registro de Intake vinculado ([`00-intake-record.md`](./00-intake-record.md)): o que entrou como premissa, incógnita de Discovery ou resposta delegada não desaparece na racionalização — é resolvido, ou carregado adiante explicitamente (ver "Prontidão herdada"). Os valores *projetados* (sobretudo as Métricas de Sucesso) carregam confiança e viram o baseline que [`../metrics.md`](../metrics.md) confronta com o realizado pós-entrega.

## Metadados

| Campo | Valor |
|---|---|
| **ID do Pacote** | RP-AAAA-NNN |
| **Versão** | v1 |
| **Intake vinculado** | INT-AAAA-NNN |
| **Responsável** | [Nome] (PO) |
| **Escalada ao CTO** | Não necessária — sem impacto arquitetural / Sim — Technical Assessment TA-AAAA-NNN |
| **Status** | Rascunho |
| **Data de congelamento (freeze)** | — |

## Histórico de Revisão

| Versão | Data | Autor | Status | Resumo |
|---|---|---|---|---|
| v1 | AAAA-MM-DD | [Nome] (PO) | Rascunho | Submissão inicial. |

---

## Prontidão herdada e dispositions em aberto

> Resumo do que o Intake entregou e do que continua *soft* na entrada da execução. Premissas, incógnitas e respostas delegadas que sobreviveram à racionalização precisam estar visíveis — não enterradas nas seções. Ver [`../personas/01-submitter.md` §6](../personas/01-submitter.md).

| Campo | Valor |
|---|---|
| **Readiness Score no handoff do Intake** | __ % |
| **Premissas ainda a validar** | [lista ou —] |
| **Incógnitas de Discovery** | [resolvidas / ainda abertas — ] |
| **Requisitos delegados (com dono)** | [lista ou —] |

> Se uma premissa carregada aqui se provar falsa durante a execução, a demanda deve ser reavaliada — o mesmo gatilho de retriagem do intake se aplica downstream.

---

## Seção 1 — Resumo Executivo  ·  *(bloqueia freeze)*

> 2–4 parágrafos curtos. Qual é o problema, o que será construído e qual é o resultado esperado de negócio.

[Resumo aqui]

---

## Seção 2 — Contexto e Problema (a dor, não a solução)  ·  *(bloqueia freeze)*

> **Regra de ouro:** problema antes da solução. Se esta seção descreve uma solução em vez do problema, ela não está satisfeita — o mesmo princípio que a Submitter aplica ao requisito 1 dela.

### Cenário Atual

[Como o sistema/produto se comporta hoje]

### Limitações

- [Limitação 1]
- [Limitação 2]

### Dor do Cliente

[Quem sente a dor, como é vivida no dia a dia]

### Impacto de Negócio

- [Impacto quantificado — receita, retenção, eficiência, etc.]

---

## Seção 3 — Objetivos e Resultado Esperado  ·  *(bloqueia freeze)*

Objetivos numerados que esta entrega deve alcançar. Cada objetivo deve ser observável após o release.

1. [Objetivo 1]
2. [Objetivo 2]
3. [Objetivo 3]

---

## Seção 4 — Personas Impactadas / Jobs-to-be-done  ·  *(bloqueia freeze)*

| Persona | Job-to-be-done | Impacto |
|---|---|---|
| [Persona 1] | [O que está tentando realizar] | [Como é impactado] |

---

## Seção 5 — Escopo Incluído e Excluído  ·  *(bloqueia freeze)*

> Protege o downstream de scope creep.

### Incluído

- [Item 1]
- [Item 2]

### Excluído

- [Item 1 — com motivo, se útil]
- [Item 2]

### Adiado (fases futuras)

- [Item 1 — alimenta o Roadmap, Seção 14]

---

## Seção 6 — Regras de Negócio e Fluxos  ·  *(bloqueia freeze)*

Descreva as regras, validações e transições de estado que governam esta funcionalidade. Use subseções por bloco de regras quando útil.

### [Bloco de Regras 1]

1. [Regra 1]
2. [Regra 2]

### Fluxo de Transição de Estado

```text
[Diagrama textual ou referência a diagrama]
```

---

## Seção 7 — User Stories + Critérios de Aceite  ·  *(bloqueia freeze)*

> Uma história por bloco de valor. Critério de aceite **verificável por não-dev**, no formato Given/When/Then, com limites específicos (não "deve funcionar bem"). É o contrato de comportamento que o QA valida.

### ST-001 — [Nome da História]

**Como** [persona],
**quero** [ação],
**para que** [benefício].

**Critérios de Aceite:**

- [ ] **Dado** [contexto], **quando** [ação], **então** [resultado observável e específico]
- [ ] **Dado** [contexto], **quando** [ação], **então** [resultado observável e específico]

---

## Seção 8 — Requisitos Não-Funcionais (NFRs)  ·  *(bloqueia freeze)*

> A lacuna nº 1 que causa retrabalho. Preencher apenas as dimensões aplicáveis (checklist tipo ISO/IEC 25010) — não forçar as irrelevantes. Aqui o PO descreve o **requisito de qualidade**; a viabilidade e o *como* são do Technical Assessment.

| Dimensão | Requisito | Como será verificado |
|---|---|---|
| **Performance / Eficiência** | [ex.: revelação de votos propaga em < 500ms para todos na sala] | [Medição] |
| **Confiabilidade** | [ex.: disponibilidade alvo, comportamento sob falha] | |
| **Segurança** | [ex.: voto oculto aplicado server-side, sem confiança no cliente] | |
| **Usabilidade** | [ex.: fluxo concluído sem treinamento] | |
| **Compatibilidade** | [ex.: navegadores, dispositivos, integrações] | |
| **Manutenibilidade** | [ex.: feature flag, observabilidade mínima] | |

---

## Seção 9 — Edge Cases e Modos de Falha  ·  *(bloqueia freeze)*

> Estados de erro, timeouts, permissões, concorrência. Para features de IA: comportamento do modelo e baixa-confiança. Primeira classe — não rodapé.

- **[Edge case 1]**: [comportamento esperado]
- **[Modo de falha 1]**: [o que acontece, como o sistema degrada]
- **[Caso de concorrência]**: [resolução esperada]

---

## Seção 10 — Métricas de Sucesso (primária · secundária · guardrail)  ·  *(bloqueia freeze)*

> Estes são os valores **projetados** — o baseline que [`../metrics.md`](../metrics.md) (camada 3, projetado vs. realizado) confronta com o medido pós-rollout. Inclua indicadores *leading* e *lagging* e ao menos um **guardrail** (a métrica que não pode piorar). Cada meta carrega a confiança da projeção.

| Tipo | Métrica | Meta (projetada) | Janela de medição | Medição (quem/como) | Confiança |
|---|---|---|---|---|---|
| **Primária** | [Métrica] | [Meta] | [ex.: 30 dias pós-release] | [Quem mede e como] | __ |
| **Secundária** | [Métrica] | [Meta] | | | __ |
| **Guardrail** | [Métrica que não pode piorar] | [Limite] | | | __ |

---

## Seção 11 — Critérios de Sucesso e Aceite (do release)  ·  *(bloqueia freeze)*

Indicadores de alto nível que definem "concluído e valioso" para **este release** — distintos das métricas contínuas da Seção 10.

| Critério | Tipo | Indicador | Valor alvo |
|---|---|---|---|
| [Critério 1] | Negócio / Operacional / Qualidade / UX / Segurança / Compliance | [Como observar] | [Meta] |

---

## Seção 12 — Riscos e Dependências (de produto e negócio)  ·  *(bloqueia freeze)*

> Riscos **técnicos** migram para o Technical Assessment do CTO. Aqui ficam os riscos de produto, negócio, adoção, externos e de compliance.

| Risco | Tipo | Probabilidade | Impacto | Mitigação |
|---|---|---|---|---|
| [Risco 1] | Negócio / Produto / Adoção / Externo / Compliance | Alta / Média / Baixa | Alto / Médio / Baixo | [Mitigação] |

**Dependências (de produto/negócio):**
- [Dependência 1]
- [Dependência 2]

---

## Seção 13 — Avaliação Preliminar de Esforço e Custo

> Somente uso interno. **Preliminar** — o chute do PO para sustentar sequenciamento. O número **firme** vem do CTO no Technical Assessment e, depois, do Tech Lead no Tech Backlog. Não é compromisso contratual nem material para cliente.

| Área | Estimativa preliminar | Confiança |
|---|---|---|
| [Backend / Frontend / QA] | [X dias] | __ |
| **Total preliminar** | **X dias** | |

**Sinais de custo a confirmar pelo CTO:** [infra nova, terceiros pagos, opex recorrente — ou "nenhum aparente"]

---

## Seção 14 — Roadmap Sugerido

### MVP (este release)

- [Item 1]
- [Item 2]

### Fase 2 (backlog futuro)

- [Item 1]

### Fase 3 (backlog futuro)

- [Item 1]

---

## Referência ao Technical Assessment  ·  *(bloqueia freeze se requisitado)*

> Esta é a **ponte** (`TechAssessmentRef`), não conteúdo. O RP referencia o veredito do CTO — não o absorve. A fusão acontece no [PRD](./03-prd.md). Ver [`personas/02-po.md` §5 e §10](../personas/02-po.md).

| Campo | Valor |
|---|---|
| **Status** | Não requisitado / Requisitado / Em andamento / Assinado / Vetado |
| **Veredito de viabilidade** | Viável / Viável com ressalvas / Inviável como escopado / — |
| **Technical Assessment vinculado** | TA-AAAA-NNN vX / N/A |
| **Constraints rígidas que afetam o escopo** | [resumo ou —] |

> **Gate de congelamento (freeze):** o RP congela quando toda seção `bloqueia freeze` está resolvida **e**, se o CTO foi requisitado, `Status = Assinado`. Não congela com assessment pendente quando foi requisitado. Para uma melhoria pequena, o RP comprime para a espinha (Problema → Métrica-objetivo → Escopo in/out → 3–5 critérios de aceite → NFRs em risco) — o contrato é teto, não piso.
