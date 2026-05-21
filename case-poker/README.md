# Caso: PokerPlan — Plataforma SaaS de Planning Poker

## Cenário

PokerPlan é uma plataforma B2B SaaS para cerimônias de planejamento ágil. A plataforma já possui clientes pagantes e está em fase de crescimento. Este caso ilustra duas demandas concorrentes fluindo pelo modelo operacional — desde a captura no intake até um Readiness Package completo pronto para handoff ao PM.

---

## Demandas neste caso

### Demanda 1 — Queue Voting (Fila de Votação)

**Cliente:** Banco Meridional (cliente enterprise existente, renovação em 90 dias)
**Dor:** Sem mecanismo para controlar a sequência de estimativas de histórias ou ocultar votos até a revelação.
**Prioridade:** Alta
**Escalada arquitetural:** Não

| Documento | Descrição |
|---|---|
| `01-intake-queue-voting.md` | Registro de intake estruturado registrado pelo CS |
| `03-readiness-package-queue-voting.md` | Readiness Package completo com 12 seções — pronto para o PM |

---

### Demanda 2 — Room Access Control (Controle de Acesso à Sala)

**Cliente:** Construtora Ágil (pré-fechamento, deal condicionado à funcionalidade)
**Dor:** Sem controle de acesso, anonimato ou diferenciação de papéis dentro de uma sala de planejamento.
**Prioridade:** Alta
**Escalada arquitetural:** Sim — CTO revisou o modelo de dados de participantes e implicações de multi-tenancy.

| Documento | Descrição |
|---|---|
| `02-intake-access-control.md` | Registro de intake estruturado registrado por Vendas |
| `04-readiness-package-access-control.md` | Readiness Package completo com 12 seções e notas arquiteturais do CTO |

---

## Artefatos downstream

| Documento | Responsável | Descrição |
|---|---|---|
| `05-execution-plan.md` | PM | Avaliação de capacidade, sequenciamento de demandas, mapa de milestones, estrutura de sprints, gatilhos de escalada |
| `06.1-product-backlog-queue-voting.md` | PO | Épicos + histórias + critérios de aceite para Queue Voting — o que construir e para quem |
| `06.2-tech-backlog-queue-voting.md` | Tech Lead | ADRs, tasks, estimativas refinadas, DoD, estratégia de rollout para Queue Voting — como construir |
| `07.1-product-backlog-access-control.md` | PO | Épicos + histórias + critérios de aceite para Access Control — o que construir e para quem |
| `07.2-tech-backlog-access-control.md` | Tech Lead | ADRs, tasks, estimativas refinadas, DoD, estratégia de rollout para Access Control — como construir |

---

## Estado do processo

Ambas as demandas completaram o Intake Layer e estão aprovadas para handoff ao PM.

```text
[INT-2026-001] Queue Voting (RP v2 — rejeitado uma vez, resubmetido)
  Intake → Triagem → Racionalização → RP v1 rejeitado → RP v2 aprovado
    → Plano de Execução ✓ → Breakdown Package ✓ → Em desenvolvimento (Sprint 1–2)
    → Previsão de release: 2026-04-26

[INT-2026-002] Room Access Control (RP v1 — aprovado diretamente após Discovery)
  Intake → Triagem → Discovery [7 dias] → Avaliação CTO → Racionalização → RP v1 aprovado
    → Plano de Execução ✓ → Breakdown Package ✓ → Em desenvolvimento (Sprint 1–5)
    → Previsão de release: 2026-06-05 (revisada de 2026-05-30 após refinamento do Tech Lead)
```

**INT-2026-002 passou por Discovery** antes de poder ser racionalizada. Três incógnitas de integração foram identificadas no intake e precisaram ser resolvidas antes que o escopo pudesse ser definido:

| Incógnita | Resolvida por | Resultado |
|---|---|---|
| Viabilidade de integração Azure AD / OIDC | Spike técnico do CTO | Viável — adicionado ao escopo |
| Requisito de integração Jira | Chamada com o cliente | Não obrigatório — movido para o backlog |
| Postura de residência de dados LGPD | Revisão de infraestrutura pelo CTO | Não conforme — Opção C adicionada ao escopo |

---

## Principais diferenças entre os dois casos

| Dimensão | Queue Voting | Room Access Control |
|---|---|---|
| Escalada ao CTO | Não | Sim |
| Passou por Discovery | Não | Sim — 3 incógnitas de integração |
| Complexidade arquitetural | Baixa | Alta |
| Estimativa de esforço | 14 dias | 25 dias (revisado para cima da estimativa inicial) |
| Considerações de segurança | Ocultação de votos (aplicada pelo servidor) | Modelo de acesso completo + auth OIDC + roteamento LGPD |
| Perfil de risco | Baixo | Alto |
| Tipo de deal | Retenção de renovação | Bloqueador pré-fechamento |
| Risco de escopo | Baixo | Alto (LGPD + dependência de ação do cliente para Azure AD) |
| Dependências externas | Nenhuma | Cliente deve registrar app no portal Azure AD |
