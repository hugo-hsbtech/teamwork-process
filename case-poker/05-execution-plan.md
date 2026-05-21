# Plano de Execução — Ciclo de Sprint 2026-Q2

## Metadados

| Campo | Valor |
|---|---|
| **ID do Plano** | EP-2026-001 |
| **Versão** | v1 |
| **Responsável** | Carla Ribeiro (PM) |
| **Cobre demandas** | INT-2026-001 (Queue Voting, RP v2) · INT-2026-002 (Access Control, RP v1) |
| **Status** | Ativo |
| **Data do plano** | 2026-03-29 |
| **Janela de execução** | 2026-04-01 → 2026-05-31 |

## Histórico de Revisão

| Versão | Data | Autor | Resumo |
|---|---|---|---|
| v1 | 2026-03-29 | Carla Ribeiro (PM) | Plano inicial. Avaliação de capacidade concluída. Demandas sequenciadas. Compartilhado com PO e CTO. |

---

## 1. Avaliação de Capacidade

> Somente uso interno. Esta seção não deve ser compartilhada com clientes ou stakeholders externos.

### Composição da Equipe (em 2026-03-29)

| Pessoa | Papel | Senioridade | Alocação atual | Disponível a partir de |
|---|---|---|---|---|
| Diego Alves | Engenheiro Backend | Senior | 100% — manutenção contínua da plataforma | 2026-04-01 (ciclo de manutenção encerra) |
| Priya Nair | Engenheira Backend | Mid-senior | 100% — manutenção contínua da plataforma | 2026-04-01 |
| Camila Torres | Engenheira Frontend | Mid | 20% — correções de bugs menores | 2026-04-01 (totalmente disponível) |
| Lucas Park | Engenheiro Frontend | Mid | 20% — correções de bugs menores | 2026-04-01 (totalmente disponível) |
| Fernanda Lima | QA | QA | 30% — manutenção do regression suite | 2026-04-08 (totalmente disponível) |

### Cobertura de Skills

| Skill necessária | Demanda | Disponível? | Quem |
|---|---|---|---|
| WebSocket / estado de sessão | INT-2026-001 | Sim | Diego Alves |
| Componente frontend (UI do facilitador) | INT-2026-001 | Sim | Camila Torres |
| Componente frontend (UI do participante) | INT-2026-001 | Sim | Lucas Park |
| Camada de auth / OAuth2 / OIDC | INT-2026-002 | Sim — com ramp-up | Diego Alves (3 dias de ramp em group claims OIDC) |
| Migração do modelo de dados de participantes | INT-2026-002 | Sim | Priya Nair |
| Roteamento de BD multi-região (sa-east-1) | INT-2026-002 | Parcial — spike do CTO necessário primeiro | Diego Alves + orientação do CTO |
| QA — carga + segurança + multi-tenant | Ambas | Sim | Fernanda Lima |

### Mapa de Conflitos

Ambas as demandas tocam sistemas sobrepostos:

| Sistema compartilhado | INT-2026-001 | INT-2026-002 | Risco |
|---|---|---|---|
| Camada de event bus WebSocket | Novos tipos de evento (item_revealed, votes_revealed) | Novos tipos de evento (join_request, join_approved, role_changed) | Mudanças paralelas no mesmo event bus — devem ser coordenadas |
| Schema de estado de sessão | Campos de fila + estado de revelação | Campos de papel do participante, access_mode, invite_token | Ambas requerem migrações de schema — devem ser sequenciadas, não paralelizadas |
| Modelo de participante | Lógica de exibição de ocultação de votos | Reescrita completa da máquina de estado do participante | INT-2026-002 muda o modelo de participante; INT-2026-001 depende dele — backend de INT-2026-002 deve ir primeiro |

### Decisão de Capacidade

Esforço total estimado: 14 dias (INT-2026-001) + 41 dias (INT-2026-002) = **55 dias úteis**.

Capacidade disponível da equipe a partir de 2026-04-01 (2 backend + 2 frontend + 1 QA):
- Backend: 2 engenheiros × ~45 dias úteis na janela = ~90 dias-backend disponíveis
- Frontend: 2 engenheiros × ~45 dias úteis = ~90 dias-frontend disponíveis
- QA: 1 × ~42 dias úteis (inicia 2026-04-08) = ~42 dias-QA disponíveis

Avaliação: a capacidade é suficiente para absorver ambas as demandas sequencialmente dentro da janela.

Constraint crítico: INT-2026-002 tem dependência externa (registro Azure AD pelo TI da Construtora Ágil). Isso deve ser acompanhado como bloqueador de milestone. Se não resolvido até 2026-04-14, o trabalho de auth backend da INT-2026-002 fica bloqueado e o cronograma muda.

### Recomendação do PM

Sequenciar INT-2026-001 primeiro — menor risco, entrega mais curta, e resolve um prazo de renovação (90 dias a partir de 2026-03-12 = até 2026-06-10). INT-2026-002 começa em paralelo em trilhas não conflitantes, com foco total após o ship da INT-2026-001.

---

## 2. Sequenciamento de Demandas

```
ABRIL                          MAIO
Sem 1    Sem 2    Sem 3    Sem 4    Sem 1    Sem 2    Sem 3    Sem 4
[01/abr] [08/abr] [15/abr] [22/abr] [29/abr] [06/mai] [13/mai] [20/mai]

INT-2026-001 (Queue Voting — 14 dias)
├── Backend ──────────────┤
               ├── Frontend ───────┤
                            ├─ QA ─┤
                                   [RELEASE: 26/abr]

INT-2026-002 (Access Control — 41 dias)
├── Migração do modelo de participantes ──────────────────────────────┤
     ├── Azure AD OIDC (bloqueado até cliente registrar app) ──────────┤
               ├── Modos de acesso + modo anônimo ─────────────────────────────┤
                         ├── Frontend painel de config + UI participante ──────────────┤
                                                        ├── QA ─────────────────────────┤
                                                                          [RELEASE: 30/mai]
```

---

## 3. Mapa de Milestones

### INT-2026-001 — Queue Voting

| Milestone | Responsável | Data alvo | Gate |
|---|---|---|---|
| M1 — Breakdown Package completo | Tech Lead | 2026-04-03 | PM confirma que Tech Lead tem contexto suficiente |
| M2 — Backend completo (estado de sessão + eventos WebSocket) | Diego Alves | 2026-04-12 | Code review aprovado, testes unitários verdes |
| M3 — Frontend completo (UI facilitador + participante) | Camila Torres / Lucas Park | 2026-04-19 | Revisão do Tech Lead aprovada |
| M4 — Ciclo de QA completo | Fernanda Lima | 2026-04-24 | Todos os critérios de aceite validados |
| M5 — Release | PM + Tech Lead | 2026-04-26 | Aprovação de release pelo QA emitida |
| M6 — Feedback loop iniciado | PM | 2026-05-03 | Resumo assíncrono entregue ao PO + CS |

### INT-2026-002 — Room Access Control

| Milestone | Responsável | Data alvo | Gate |
|---|---|---|---|
| M1 — Breakdown Package completo | Tech Lead | 2026-04-05 | PM confirma que Tech Lead tem contexto suficiente |
| M2 — Migração do modelo de participantes completa | Priya Nair | 2026-04-19 | Schema aplicado em staging, compatibilidade retroativa verificada |
| M3 — Integração Azure AD OIDC completa | Diego Alves | 2026-04-26 | Bloqueado até Construtora Ágil registrar app no portal Azure (dependência externa — alvo: 2026-04-14) |
| M4 — Modos de acesso + modo anônimo completos | Priya Nair + Diego Alves | 2026-05-09 | Code review aprovado, aplicação server-side verificada |
| M5 — Roteamento LGPD sa-east-1 completo | Diego Alves | 2026-05-14 | CTO confirma postura de residência de dados. Validação em staging com dados de tenant brasileiro. |
| M6 — Frontend completo | Camila Torres / Lucas Park | 2026-05-20 | Revisão do Tech Lead aprovada |
| M7 — Ciclo de QA completo | Fernanda Lima | 2026-05-27 | Todos os critérios de aceite validados, testes de segurança + multi-tenant aprovados |
| M8 — Sign-off LGPD pela Construtora Ágil TI | Fernanda Ramos (cliente) | 2026-05-28 | Cliente confirma requisito de residência de dados atendido |
| M9 — Release | PM + Tech Lead | 2026-05-30 | Aprovação de release pelo QA + sign-off LGPD do cliente |
| M10 — Feedback loop iniciado | PM | 2026-06-06 | Resumo assíncrono entregue ao PO + CS |

---

## 4. Mapa de Dependências Cross-Demanda

| Dependência | De | Para | Tipo | Risco se não cumprida |
|---|---|---|---|---|
| Schema de estado de sessão deve estar estável antes da migração do modelo de participantes da INT-2026-002 | Backend INT-2026-001 | Backend INT-2026-002 | Sequencial obrigatório | Migração da INT-2026-002 conflita com mudanças de schema da INT-2026-001 — risco de corrupção de dados |
| Mudanças no event bus WebSocket não devem conflitar | INT-2026-001 (eventos de item) | INT-2026-002 (eventos de membership) | Coordenação | Mergeados no mesmo ciclo de PR review — Tech Lead é dono da resolução de conflitos |
| Registro Azure AD pelo cliente | Externo (TI Construtora Ágil) | M3 da INT-2026-002 | Bloqueador externo | Se não feito até 2026-04-14, M3 muda 1 semana por dia de atraso |
| Confirmação de infraestrutura sa-east-1 pelo CTO | CTO | M5 da INT-2026-002 | Bloqueador interno | Se instância RDS não provisionada, M5 e todos os milestones subsequentes mudam |

---

## 5. Estrutura de Sprints

### Sprint 1 — 2026-04-01 a 2026-04-12

**Foco:** Backend INT-2026-001 + breakdown da INT-2026-002 e início do modelo de participantes

| Tarefa | Responsável | Demanda |
|---|---|---|
| Backend: extensão do schema de estado de sessão (fila + estado de revelação) | Diego Alves | INT-2026-001 |
| Backend: tipos de evento WebSocket (item_revealed, votes_revealed, item_skipped) | Diego Alves | INT-2026-001 |
| Backend: aplicação server-side de ocultação de votos | Priya Nair | INT-2026-001 |
| Modelo de participantes: design do schema + plano de migração | Priya Nair | INT-2026-002 |
| Tech Lead: breakdown package completo para ambas as demandas | Tech Lead | Ambas |
| PM: enviar spec de registro Azure AD ao TI da Construtora Ágil | PM | INT-2026-002 |

### Sprint 2 — 2026-04-15 a 2026-04-26

**Foco:** Frontend INT-2026-001 + QA · migração de participantes da INT-2026-002 + início OIDC

| Tarefa | Responsável | Demanda |
|---|---|---|
| Frontend: UI de gerenciamento de fila do facilitador | Camila Torres | INT-2026-001 |
| Frontend: exibição de ocultação de votos do participante | Lucas Park | INT-2026-001 |
| QA: INT-2026-001 funcional + segurança + carga | Fernanda Lima | INT-2026-001 |
| Backend: migração do modelo de participantes (staging) | Priya Nair | INT-2026-002 |
| Backend: integração de group-claim OIDC do Azure AD (se registro do cliente completo) | Diego Alves | INT-2026-002 |
| **RELEASE: INT-2026-001** | PM + Tech Lead | INT-2026-001 |

### Sprint 3 — 2026-04-29 a 2026-05-10

**Foco:** Modos de acesso + modo anônimo da INT-2026-002

| Tarefa | Responsável | Demanda |
|---|---|---|
| Backend: modos de acesso somente convite e aprovação obrigatória | Priya Nair + Diego Alves | INT-2026-002 |
| Backend: atribuição de alias server-side e filtragem de payload do modo anônimo | Diego Alves | INT-2026-002 |
| Backend: remoção de participante + atribuição de papéis | Priya Nair | INT-2026-002 |

### Sprint 4 — 2026-05-13 a 2026-05-24

**Foco:** Roteamento LGPD + frontend da INT-2026-002

| Tarefa | Responsável | Demanda |
|---|---|---|
| Backend: roteamento LGPD sa-east-1 (Opção C) | Diego Alves | INT-2026-002 |
| Frontend: painel de configurações de acesso do dono da sala | Camila Torres | INT-2026-002 |
| Frontend: UI do participante (aliases, view do observador, tela de aprovação) | Lucas Park | INT-2026-002 |
| CTO: confirmar instância RDS sa-east-1 provisionada | CTO | INT-2026-002 |

### Sprint 5 — 2026-05-27 a 2026-05-31

**Foco:** QA + release da INT-2026-002

| Tarefa | Responsável | Demanda |
|---|---|---|
| QA: ciclo completo (funcional + segurança + multi-tenant + validação LGPD) | Fernanda Lima | INT-2026-002 |
| Sign-off LGPD do cliente | TI Construtora Ágil (Fernanda Ramos) | INT-2026-002 |
| **RELEASE: INT-2026-002** | PM + Tech Lead | INT-2026-002 |

---

## 6. Gatilhos de Escalada

| Condição | Ação do PM | Destino da escalada |
|---|---|---|
| Registro Azure AD não confirmado até 2026-04-14 | PM notifica PO. PO aciona Vendas para pressionar TI do cliente. | PO → Vendas → Construtora Ágil |
| Instância RDS sa-east-1 não provisionada até 2026-05-05 | PM escala ao CTO. CTO escala ao CEO se aprovação de procurement for necessária. | CTO → CEO |
| QA da INT-2026-001 revela bloqueador antes do release | PM segura o release. Tech Lead faz triagem. Se > 2 dias, PM notifica PO do risco de renovação. | PO → CS → Banco Meridional |
| Qualquer milestone atrasado > 3 dias úteis | PM produz mapa de milestones revisado e comunica ao PO. Sem absorção silenciosa. | PO |
| Solicitação de adição de escopo chega durante a execução | PM rejeita. Qualquer adição requer um novo registro de intake. | PO |
