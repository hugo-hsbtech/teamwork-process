# Tech Backlog — [Nome da Demanda]

## Metadados

| Campo | Valor |
|---|---|
| **ID do Backlog** | TB-AAAA-NNN |
| **Versão** | v1 |
| **Product Backlog vinculado** | PB-AAAA-NNN |
| **RP vinculado** | RP-AAAA-NNN vX |
| **Plano de Execução vinculado** | EP-AAAA-NNN |
| **Responsável** | [Nome] (Tech Lead) |
| **Status** | Rascunho |
| **Data do backlog** | AAAA-MM-DD |

> Este documento define **como** as histórias em [PB-AAAA-NNN] serão construídas.
> Decisões de escopo, critérios de aceite e intenção de produto pertencem ao Product Backlog. Este Tech Backlog não os redefine.

## Histórico de Revisão

| Versão | Data | Autor | Resumo |
|---|---|---|---|
| v1 | AAAA-MM-DD | [Nome] (Tech Lead) | Breakdown inicial. |

---

## Decisões de Arquitetura (ADRs)

| # | Decisão | Justificativa | Sign-off do CTO |
|---|---|---|---|
| ADR-001 | [Decisão] | [Justificativa] | Sim / Não necessário |

---

## Breakdown de Tarefas por História

---

### ST-001 — [Nome da História]

| ID | Tarefa | Responsável | Estimativa |
|---|---|---|---|
| T-001 | [Tarefa] | [Nome] | [X dias] |

---

## Estimativa de Esforço Refinada

> 🔒 Somente uso interno.

| Área | Estimativa no RP | Estimativa refinada | Delta | Observação |
|---|---|---|---|---|
| [Área] | [X dias] | [X dias] | [+/- X] | [Observação] |
| **Total** | **X dias** | **X dias** | **+/- X** | |

---

## Definição de Pronto (DoD)

Uma história está pronta quando **todos** os itens abaixo são verdadeiros:

- [ ] Todos os critérios de aceite definidos no Product Backlog foram atendidos e verificados pelo QA
- [ ] Aplicação server-side confirmada para comportamentos com sensibilidade de segurança
- [ ] Testes unitários cobrem o happy path e todos os edge cases da história
- [ ] Código revisado e aprovado pelo Tech Lead
- [ ] Sem regressões no fluxo existente — regression suite do QA aprovado
- [ ] Tech Lead encerra a história no backlog

---

## Estratégia de Rollout

1. **Feature flag** `feature_[nome]` — desabilitada por padrão para todos os tenants no deploy
2. **Validação interna** — [passos]
3. **Disponibilidade geral** — [condição]
4. **Rollback** — [plano]
