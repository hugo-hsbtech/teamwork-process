# Caso: PokerPlan — Plataforma SaaS de Planning Poker

## Cenário

PokerPlan é uma plataforma B2B SaaS para cerimônias de planejamento ágil. A plataforma já possui clientes pagantes e está em fase de crescimento. Este caso ilustra duas demandas concorrentes fluindo pelo modelo operacional — desde a captura no intake até um **PRD** completo pronto para handoff ao PM.

> **Cadeia de artefatos (modelo maduro).** Cada demanda atravessa: **00 Documento do Submitter** (captura) → **01 Intake Record** (PO — triagem) → **02 Readiness Package** (PO — racionalização) → **03 Technical Assessment** (CTO — só quando há escalada arquitetural) → **04 PRD** (fusão RP + TA, abre o downstream). Ver [`../../../templates/README.md`](../../../templates/README.md).

---

## Demandas neste caso

### Demanda 1 — Queue Voting (Fila de Votação)

**Cliente:** Banco Meridional (cliente enterprise existente, renovação em 90 dias)
**Dor:** Sem mecanismo para controlar a sequência de estimativas de histórias ou ocultar votos até a revelação.
**Prioridade:** Alta
**Escalada arquitetural:** Não → **sem Technical Assessment** (PRD se forma só a partir do RP)

| Documento | Descrição |
|---|---|
| `00-submitter-brief-queue-voting.md` | Documento do Submitter — captura pelo CS, com confiança por campo e `gateReady` |
| `01-intake-record-queue-voting.md` | Intake Record — triagem do PO (INT-2026-001), decisão **Product Ready**, sem Discovery |
| `02-readiness-package-queue-voting.md` | Readiness Package PO-only (RP-2026-001) — `freezeReady`; `TechAssessmentRef: Não requisitado` |
| `04-prd-queue-voting.md` | PRD (PRD-2026-001) — fusão só do RP; abre o downstream |

---

### Demanda 2 — Room Access Control (Controle de Acesso à Sala)

**Cliente:** Construtora Ágil (pré-fechamento, deal condicionado à funcionalidade)
**Dor:** Sem controle de acesso, anonimato ou diferenciação de papéis dentro de uma sala de planejamento.
**Prioridade:** Alta
**Escalada arquitetural:** Sim — CTO produziu um **Technical Assessment** próprio (modelo de dados de participantes, multi-tenancy, Azure AD OIDC, roteamento LGPD).

| Documento | Descrição |
|---|---|
| `00-submitter-brief-access-control.md` | Documento do Submitter — captura por Vendas, com `gateReady` |
| `01-intake-record-access-control.md` | Intake Record — triagem do PO (INT-2026-002), **Discovery → Product Ready**, Discovery Brief preenchido |
| `02-readiness-package-access-control.md` | Readiness Package PO-only (RP-2026-002) — produto apenas; referencia o TA via `TechAssessmentRef` |
| `03-technical-assessment-access-control.md` | Technical Assessment do CTO (TA-2026-002) — viabilidade, arquitetura, ADRs, custo firme |
| `04-prd-access-control.md` | PRD (PRD-2026-002) — fusão RP + Technical Assessment; abre o downstream |

---

## Artefatos downstream

| Documento | Responsável | Descrição |
|---|---|---|
| `05-execution-plan.md` | PM | Avaliação de capacidade, sequenciamento de demandas, mapa de milestones, estrutura de sprints, gatilhos de escalada |
| `06.1-product-backlog-queue-voting.md` | Tech Leads | Épicos + histórias + critérios de aceite para Queue Voting, derivados das user stories de produto do PRD — atinge a Definition of Ready |
| `06.2-tech-backlog-queue-voting.md` | Tech Lead | ADRs, tasks, estimativas refinadas, DoD, estratégia de rollout para Queue Voting — como construir |
| `07.1-product-backlog-access-control.md` | Tech Leads | Épicos + histórias + critérios de aceite para Access Control, derivados das user stories de produto do PRD — atinge a Definition of Ready |
| `07.2-tech-backlog-access-control.md` | Tech Lead | ADRs, tasks, estimativas refinadas, DoD, estratégia de rollout para Access Control — como construir |

> Os backlogs e o plano de execução recebem o **PRD** (`PRD vinculado`), não o RP isolado.

---

## Estado do processo

Ambas as demandas completaram o Intake Layer e estão aprovadas para handoff ao PM.

```text
[INT-2026-001] Queue Voting (RP v2 — rejeitado uma vez, resubmetido)
  00 Brief (CS) → 01 Triagem [Product Ready] → 02 RP v1 rejeitado → RP v2 freezeReady
    → 04 PRD (sem TA) → 05 Plano de Execução ✓ → Backlogs ✓ → Em dev (Sprint 1–2)
    → Previsão de release: 2026-04-26

[INT-2026-002] Room Access Control (RP v1 — aprovado diretamente após Discovery)
  00 Brief (Vendas) → 01 Triagem [Discovery 7d → Product Ready] → 03 Technical Assessment (CTO)
    ‖ 02 RP → 04 PRD (RP + TA) → 05 Plano de Execução ✓ → Backlogs ✓ → Em dev (Sprint 1–5)
    → Previsão de release: 2026-06-05 (revisada de 2026-05-30 após refinamento do Tech Lead)
```

**INT-2026-002 passou por Discovery** antes de poder ser racionalizada. Três incógnitas de integração foram identificadas no intake e precisaram ser resolvidas antes que o escopo pudesse ser definido (o log completo vive no `01-intake-record-access-control.md`):

| Incógnita | Resolvida por | Resultado |
|---|---|---|
| Viabilidade de integração Azure AD / OIDC | Spike técnico do CTO | Viável — adicionado ao escopo |
| Requisito de integração Jira | Chamada com o cliente | Não obrigatório — movido para o backlog |
| Postura de residência de dados LGPD | Revisão de infraestrutura pelo CTO | Não conforme — Opção C adicionada ao escopo |

---

## Principais diferenças entre os dois casos

| Dimensão | Queue Voting | Room Access Control |
|---|---|---|
| Escalada ao CTO | Não — sem Technical Assessment | Sim — Technical Assessment próprio (TA-2026-002) |
| Passou por Discovery | Não | Sim — 3 incógnitas de integração |
| Complexidade arquitetural | Baixa | Alta |
| Estimativa de esforço | 14 dias | 25 dias (firmado pelo CTO no Technical Assessment) |
| Considerações de segurança | Ocultação de votos (aplicada pelo servidor) | Modelo de acesso completo + auth OIDC + roteamento LGPD |
| Perfil de risco | Baixo | Alto |
| Tipo de deal | Retenção de renovação | Bloqueador pré-fechamento |
| Risco de escopo | Baixo | Alto (LGPD + dependência de ação do cliente para Azure AD) |
| Dependências externas | Nenhuma | Cliente deve registrar app no portal Azure AD |
