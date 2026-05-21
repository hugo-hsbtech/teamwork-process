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

> Este documento define **como** as histórias em PB-AAAA-NNN serão construídas.
> Decisões de escopo, critérios de aceite e intenção de produto pertencem ao Product Backlog. Este Tech Backlog não os redefine.

## Histórico de Revisão

| Versão | Data | Autor | Resumo |
|---|---|---|---|
| v1 | AAAA-MM-DD | [Nome] (Tech Lead) | Breakdown inicial. ADRs documentados, tarefas definidas, estimativas refinadas. |

---

## Decisões de Arquitetura (ADRs)

> Uma linha por decisão. Justificativa curta. Quando há escalada arquitetural, incluir coluna de Sign-off do CTO.

| # | Decisão | Justificativa | Sign-off do CTO |
|---|---|---|---|
| ADR-001 | [Decisão] | [Por que esta abordagem foi escolhida] | ✓ / N/A |

---

## Breakdown de Tarefas por História

> Uma subseção por história do Product Backlog. As tarefas devem ser pequenas o suficiente para um pull request por tarefa (idealmente ≤ 1 dia).

---

### ST-001 — [Nome da História]

| ID | Tarefa | Responsável | Estimativa |
|---|---|---|---|
| T-001 | [Descrição da tarefa] | [Nome] | [X dias] |

---

### ST-002 — [Nome da História]

> Para histórias com dependências externas ou bloqueadores, marcar no topo da subseção:
>
> Bloqueado até: [condição]. Alvo: AAAA-MM-DD.

| ID | Tarefa | Responsável | Estimativa |
|---|---|---|---|
| T-XXX | [Descrição da tarefa] | [Nome] | [X dias] |

---

## Estimativa de Esforço Refinada

> Somente uso interno.

| Área | Estimativa no RP | Estimativa refinada | Delta | Observação |
|---|---|---|---|---|
| Backend — [tema] | [X dias] | [Y dias] | [+/− Z dias] | [Por que mudou] |
| Frontend — [tema] | [X dias] | [Y dias] | [+/− Z dias] | [Por que mudou] |
| QA | [X dias] | [Y dias] | — | [No alvo / observação] |
| **Total** | **X dias** | **Y dias** | **+/− Z dias** | |

> PM notificado em AAAA-MM-DD. [Impacto em milestones — manter / revisar release para AAAA-MM-DD].

---

## Definição de Pronto (DoD)

Uma história está pronta quando **todos** os itens abaixo são verdadeiros:

- [ ] Todos os critérios de aceite definidos na história do Product Backlog foram atendidos e verificados pelo QA
- [ ] Aplicação server-side confirmada para todos os comportamentos com sensibilidade de segurança — sem confiança no cliente
- [ ] Testes unitários cobrem o happy path e todos os edge cases da história
- [ ] Código revisado e aprovado pelo Tech Lead
- [ ] Sem regressões no fluxo existente — regression suite do QA aprovado
- [ ] Eventos de telemetria confirmados recebidos no pipeline de staging
- [ ] [Critério adicional específico da demanda — ex.: ADRs revisados pelo CTO, residência de dados validada, etc.]
- [ ] Tech Lead encerra a história no backlog

---

## Estratégia de Rollout

1. **Feature flag** `feature_[nome]` — desabilitada por padrão para todos os tenants no deploy
2. **Gates de pré-requisito** — [infraestrutura, integrações externas, dependências do cliente] confirmados antes da flag ser habilitada
3. **Validação interna** — flag habilitada na conta de teste interna; PM + CS executam simulação completa end-to-end
4. **Acesso antecipado [Cliente alvo]** — flag habilitada para o cliente piloto N dias úteis antes do release geral; CS acompanha primeira cerimônia/uso ao vivo
5. **Disponibilidade geral** — flag habilitada para todos os tenants após cliente piloto confirmar sem problemas
6. **Rollback** — desabilitar flag `feature_[nome]`; mudanças de schema são aditivas e nullable — nenhuma migração de rollback necessária
