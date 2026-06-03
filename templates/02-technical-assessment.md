# Technical Assessment — [Nome da Demanda]

> O Technical Assessment (TA) é o **output do CTO** — viabilidade, constraints, arquitetura, integrações, riscos técnicos, ADRs e custo firme. É escrito **sozinho** pelo CTO, **em paralelo** ao Readiness Package, e **responde** a ele: o CTO **nunca edita o RP**. O TA não redefine o produto — pode **vetar** a viabilidade do escopo, e nesse caso o PO revisa o escopo do RP.
>
> A fusão do RP (produto) com este TA (técnico) acontece no [PRD](./03-prd.md), e é o PRD que abre o downstream. Ver [`personas/02-po.md` §2 e §10](../personas/02-po.md) e [`interactions/05-po-to-cto.md`](../interactions/05-po-to-cto.md).
>
> **Quando NÃO existe TA:** se a demanda não tem impacto arquitetural (sem escalada), não há Technical Assessment — o PRD se forma apenas a partir do RP, e a referência no RP fica `Status: Não requisitado`.

## Metadados

| Campo | Valor |
|---|---|
| **ID do Assessment** | TA-AAAA-NNN |
| **Versão** | v1 |
| **RP vinculado** | RP-AAAA-NNN vX |
| **Intake vinculado** | INT-AAAA-NNN |
| **Responsável** | [Nome] (CTO) |
| **Status** | Solicitado / Em andamento / Assinado / Vetado |
| **Veredito de viabilidade** | Viável / Viável com ressalvas / Inviável como escopado |
| **Data de sign-off** | — |

## Histórico de Revisão

| Versão | Data | Autor | Status | Resumo |
|---|---|---|---|---|
| v1 | AAAA-MM-DD | [Nome] (CTO) | Em andamento | Avaliação inicial. |

---

## Veredito de Viabilidade

> A decisão de primeira classe do CTO. Carrega justificativa — nunca um carimbo.

| Campo | Valor |
|---|---|
| **Veredito** | Viável / Viável com ressalvas / Inviável como escopado |
| **Justificativa** | [Por quê — defensável] |
| **Ressalvas (se aplicável)** | [O que precisa ser verdadeiro para o veredito se sustentar] |

> Se **Inviável como escopado**: o CTO devolve com veto + justificativa; o PO revisa o escopo do RP e re-escala. O CTO não redefine o produto. Ver [`interactions/06-cto-to-po.md`](../interactions/06-cto-to-po.md).

---

## Perguntas do PO Endereçadas

> *Trace-to-source.* As incógnitas técnicas específicas que o PO escalou — e a resposta de cada uma. Mantém o assessment ancorado no que foi perguntado.

| # | Pergunta do PO | Resposta do CTO |
|---|---|---|
| 1 | [Incógnita técnica] | [Resposta] |

---

## Sistemas e Componentes Afetados

| Sistema / Componente | Natureza do impacto |
|---|---|
| [Serviço / módulo] | [Novo / modificado / só consumido] |

---

## Impacto Arquitetural

> Migrado da antiga Seção 8 do RP. Território exclusivo do CTO.

| Área | Impacto | Nota arquitetural |
|---|---|---|
| **Modelo de dados** | [Descrição] | [Padrão a seguir/evitar] |
| **Eventos / mensageria** | [Descrição] | |
| **Frontend** | [Descrição] | |
| **Segurança** | [Descrição] | |
| **Multi-tenancy** | [Descrição] | |
| **Performance / Escalabilidade** | [Descrição] | |
| **Observabilidade** | [Descrição] | |

---

## Integrações Necessárias

> Migrado da antiga Seção 7 do RP — agora com a lente de viabilidade técnica.

| Sistema | Tipo | Protocolo | Viabilidade / Riscos conhecidos |
|---|---|---|---|
| [Sistema 1] | Interno / Externo / API / Evento / Webhook / BD | [REST / OIDC / gRPC / …] | [Viável / limitações de terceiros / risco] |

---

## Constraints Rígidas

> Condições não-negociáveis que limitam o espaço de solução. O PO não suaviza nem reinterpreta — se discordar, escala explicitamente. Ver [`interactions/06-cto-to-po.md`](../interactions/06-cto-to-po.md).

| Constraint | Tipo | Detalhe | Efeito no escopo |
|---|---|---|---|
| [Constraint 1] | Técnico / Plataforma / Segurança / Multi-tenancy / Externo | [Detalhe] | [O que muda no RP, se algo] |

---

## Riscos Técnicos e Mitigações

> Os riscos **técnicos** vivem aqui (migrados do RP). Riscos de produto/negócio permanecem no RP, Seção 12.

| Risco | Categoria | Probabilidade | Impacto | Mitigação |
|---|---|---|---|---|
| [Risco 1] | Técnico / Segurança / Infra / Integração / Dados | Alta / Média / Baixa | Alto / Médio / Baixo | [Mitigação] |

---

## Decisões de Arquitetura (ADRs)

> Direção arquitetural no nível do CTO. A IA pode chegar com ADRs sugeridos (e reusados da base) — o CTO aprova/ajusta. O breakdown fino e ADRs de implementação pertencem ao Tech Backlog (TB) do Tech Lead.

| # | Decisão | Justificativa | Sign-off do CTO |
|---|---|---|---|
| ADR-001 | [Decisão] | [Por que esta abordagem] | ✓ |

---

## Avaliação de Esforço e Custo (firme)

> Somente uso interno. Estas são as estimativas **firmes** do CTO — substituem a estimativa preliminar do PO (RP Seção 13). Serão refinadas pelo Tech Lead no Tech Backlog. Não são compromisso contratual nem material para cliente.

### Esforço de Desenvolvimento

| Área | Estimativa | Senioridade |
|---|---|---|
| [Backend / Frontend / QA] | [X dias] | Senior / Mid / Junior / QA |
| **Total** | **X dias** | |

### Impacto de Infraestrutura

[Novo provisionamento, mudanças de cluster, regiões adicionais — ou "Nenhum"]

### Impacto de Custo com Terceiros

[Novos provedores, licenças, APIs pagas — ou "Nenhum"]

### Impacto de Custo Operacional Recorrente

[Armazenamento, observabilidade, banda — quantificar se possível]

### Avaliação de TCO

[A feature é neutra, adiciona custo recorrente, ou cria base reutilizável para fases futuras?]

---

## Caminho de Discovery (se incógnita técnica bloqueia)

> Preencher apenas se uma incógnita técnica impede o assessment de fechar. O CTO define o spike/investigação; o PO determina o time-box. A demanda volta para Discovery. Ver [`interactions/05-po-to-cto.md`](../interactions/05-po-to-cto.md).

| Incógnita | Spike / Investigação | Quem | Time-box sugerido |
|---|---|---|---|
| [Incógnita técnica] | [O que investigar] | [CTO / time] | [N dias] |
