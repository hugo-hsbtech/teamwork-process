# PRD — Concierge & Settlement

> O PRD (Product Requirements Document) é a **fusão** do [Readiness Package](./02-readiness-package-concierge-settlement.md) (produto, autoria do PO) com o [Technical Assessment](./03-technical-assessment-concierge-settlement.md) (técnico, autoria do CTO). É o **único artefato que abre o downstream** — entregue ao **PM**. Cada metade mantém autoria clara: o PO não escreve a parte técnica, o CTO não reescreve o produto. O PRD costura, reconcilia e expõe ao PM o que ele precisa para planejar. Ver [`personas/02-po.md` §2, §10 e §11](../personas/02-po.md).
>
> `PRD = RP (PO) + Technical Assessment (CTO)`
>
> **Jornada:** [`00 Documento do Submitter`](./00-submitter-brief-concierge-settlement.md) → [`01 Intake Record (PO — triagem)`](./01-intake-record-concierge-settlement.md) → [`02 Readiness Package (PO)`](./02-readiness-package-concierge-settlement.md) → [`03 Technical Assessment (CTO)`](./03-technical-assessment-concierge-settlement.md) → `04 PRD (PO+CTO → PM)`.

## Metadados

| Campo | Valor |
|---|---|
| **ID do PRD** | PRD-2026-050 |
| **Versão** | v1 |
| **RP vinculado** | RP-2026-050 v1 |
| **Technical Assessment vinculado** | TA-2026-050 v1 |
| **Intake vinculado** | INT-2026-050 |
| **Autores** | Rafael Souza (PO) + Davi Lima (CTO) |
| **Status** | Entregue ao PM |
| **Entregue ao PM em** | 2026-04-28 |

## Histórico de Revisão

| Versão | Data | Autor | Status | Resumo |
|---|---|---|---|---|
| v1 | 2026-04-26 | Rafael Souza (PO) + Davi Lima (CTO) | Rascunho | Fusão inicial RP-2026-050 + TA-2026-050. |
| v1 | 2026-04-28 | Rafael Souza (PO) + Davi Lima (CTO) | Entregue ao PM | PRD revisado e assinado. Entregue ao PM para planejamento. |

---

## Sign-off

> A fusão só fecha com dupla assinatura. O veredito de viabilidade vem do Technical Assessment.

| Papel | Nome | Veredito | Data |
|---|---|---|---|
| **PO** (produto) | Rafael Souza | RP congelado (`freezeReady = true`) | 2026-04-25 |
| **CTO** (técnico) | Davi Lima | **Viável com ressalvas** — migração de PSP no caminho crítico; ver TA-2026-050 | 2026-04-25 |

---

## Resumo Executivo Combinado

> 2–4 parágrafos: o problema, o que será construído, a viabilidade técnica e o resultado esperado de negócio. A visão de uma página para CEO/CFO/PM.

A StayFlow opera hoje com dois gargalos operacionais críticos que crescem com o volume de reservas: o atendimento de 1ª camada ao hóspede é 100% humano mesmo para perguntas de rotina (CSAT 3,8/5; SLA furado em 34% dos tickets; fila de 4h+ nos picos), e o repasse financeiro aos hotéis parceiros é calculado e executado manualmente, com erros de percentual em 3 incidentes nos últimos 6 meses — dois parceiros em risco de rescisão e um chargeback absorvido sem cobertura. A demanda chegou como "chatbot + automação de repasse", mas a passagem pelo intake revelou dois domínios técnicos distintos com regras de negócio, edge cases financeiros e requisitos de segurança que configuram uma entrega de médio-grande porte.

Este PRD define **Concierge & Settlement**, duas capacidades entregues em conjunto: (1) **Concierge Service** — atendimento automatizado por IA na 1ª camada, com handoff estruturado para especialista humano (contexto completo viajando com o ticket), base de conhecimento sobre reservas da StayFlow, e regras de escalonamento configuráveis pelo gestor de CS sem código; (2) **Settlement Service** — motor de split e repasse automatizado: calcula o valor por reserva (percentual por hotel, retenção de IR configurável), executa via Stripe Connect, garante idempotência por transação, trata falhas com retentativas automáticas, concilia automaticamente e exporta dados para o hotel e para a contabilidade.

Do ponto de vista técnico, a solução é **viável com ressalvas**: a migração do PSP atual (Pagar.me) para Stripe Connect é pré-condição não-negociável do Settlement Service — o Pagar.me não oferece as garantias de idempotência e split necessárias. Essa migração é o item com maior risco de cronograma e exige coordenação com todos os hotéis parceiros (criação de connected accounts). O CTO estimou **89 dias de engenharia** no total (vs. ~70 dias preliminares do PO), com paralelismo de equipe resultando em ~10 semanas de desenvolvimento. O Concierge Service não depende da migração de PSP e pode ser entregue independentemente — o PM pode avaliar uma entrega faseada.

O resultado esperado: nenhuma rescisão de parceiro por erro de repasse nos 90 dias pós-release, CSAT de hóspede ≥ 4,3/5 em 60 dias, ≥ 55% dos tickets resolvidos pelo Concierge sem intervenção humana, e carga do FinOps reduzida de ~18h/semana para < 4h. A base criada — Stripe Connect com ledger imutável e Concierge com RAG — é reutilizável para as fases seguintes (portal do parceiro, WhatsApp, analytics).

---

## Parte A — Definição de Produto (do Readiness Package · PO)

> Síntese das seções-chave do RP. O documento-fonte completo é [`RP-2026-050`](./02-readiness-package-concierge-settlement.md); aqui fica o que o PM precisa para planejar, sem reescrever o RP inteiro.

### A.1 Objetivos e Resultado Esperado

1. Desafogar o time de atendimento na 1ª camada: ≥ 55% dos tickets resolvidos pelo Concierge sem humano.
2. Melhorar CSAT de hóspede para ≥ 4,3/5 em 60 dias pós-release.
3. Zerar erros de percentual de repasse: taxa de repasse correto ≥ 99,5%.
4. Eliminar risco de repasse duplicado via idempotência — zero duplicatas.
5. Reduzir carga manual do FinOps para < 4h/semana (de ~18h atual).
6. Proteger confiança dos parceiros: nenhuma rescisão por erro de repasse nos 90 dias pós-release.
7. Habilitar handoff com contexto completo: especialista recebe histórico + dados de reserva ao assumir ticket.

### A.2 Escopo (final)

**Incluído:**
- Concierge Service: chatbot 1ª camada (canal web), integração com API de reservas, regras de escalonamento configuráveis, handoff para Zendesk com contexto, CSAT, painel de gestão.
- Settlement Service: motor de split por hotel, Stripe Connect, idempotência, tratamento de falha (retentativa + alerta), ledger imutável, conciliação automática, exportação de dados, painel FinOps.
- Migração de PSP: Pagar.me → Stripe Connect para fluxo de repasse (não afeta cobrança do hóspede na Fase 1).

**Excluído:**
- Portal do hotel parceiro (autoatendimento); integração com emissão de NF do hotel; chatbot em canais adicionais (WhatsApp); substituição do Zendesk; multi-moeda; BI avançado.

**Adiado para Fase 2:**
- Portal do parceiro com extrato e autoatendimento; notificação proativa ao hotel sobre repasse; chatbot em WhatsApp; integração com emissor de NF; analytics avançado; emissão de comprovante de repasse por e-mail.

### A.3 Personas / Jobs-to-be-done

| Persona | Job | Impacto |
|---|---|---|
| **Hóspede** | Obter resposta rápida sobre sua reserva sem esperar em fila | Usuário primário do Concierge — toda a base de hóspedes ativos |
| **Atendente especialista (CS)** | Receber tickets já triados com contexto completo; focar em casos que precisam de julgamento humano | Usuário do handoff + filas. Ganha eficiência sem processar perguntas de rotina |
| **Hotel parceiro** | Receber repasse correto, no prazo, com previsibilidade | Beneficiário final do Settlement. Não interage diretamente (portal adiado para Fase 2) |
| **FinOps (StayFlow)** | Encerrar ciclo de repasse sem tarefa manual; ter visibilidade de status e conciliação | Operador do painel FinOps — ganha tempo e elimina erro humano |
| **Gestor de CS/Operações** | Monitorar qualidade do Concierge e ajustar regras sem engenharia | Usuário do painel de gestão — autonomia operacional |

### A.4 Regras de Negócio e Fluxos

Ver detalhamento completo no [RP-2026-050, Seção 6](./02-readiness-package-concierge-settlement.md). Resumo das regras críticas para o PM:

**Concierge (regras de negócio chave):**
- RN-C03: Escalonamento obrigatório em 4 condições (solicitação do hóspede, 2 tentativas sem resolução, palavras-chave de urgência, categoria de disputa financeira).
- RN-C04: Handoff para Zendesk deve incluir transcrição completa + dados de reserva + categoria + motivo.
- RN-C07: O Concierge **não executa ações transacionais** — informa e orienta. Ações (cancelamento, reembolso) são sempre escaladas.

**Settlement (regras de negócio chave):**
- RN-S01: `valor_repasse = valor_total × (1 - percentual_comissão) - IR_retido`. Percentual é o do cadastro no momento do cálculo.
- RN-S03: Idempotência via `idempotency_key = hotel_id + período + hash(reservas)` — duplicatas são rejeitadas pelo Stripe.
- RN-S09: Repasse com percentual diferente do cadastro bloqueia e alerta o FinOps — sem auto-correção.
- RN-S10: Ledger imutável — sem DELETE/UPDATE. Correções via lançamentos de ajuste.

### A.5 User Stories + Critérios de Aceite

Histórias completas com Dado/Quando/Então no [RP-2026-050, Seção 7](./02-readiness-package-concierge-settlement.md). Resumo para o PM:

| ID | História | Critério de aceite resumido |
|---|---|---|
| ST-001 | Como hóspede, quero resposta contextualizada sobre minha reserva | Resposta com dados reais em < 5s; modo degradado se API de reservas indisponível |
| ST-002 | Como atendente, quero ticket de Concierge com histórico e dados da reserva | Zendesk recebe transcrição + dados + categoria + motivo de escalonamento |
| ST-003 | Como gestor de CS, quero CSAT separado por canal (Concierge e especialista) | CSAT coletado ao encerrar; disponível no painel em < 5min |
| ST-004 | Como gestor, quero configurar regras de escalonamento sem deploy de código | Regra salva entra em vigor na próxima conversa sem deploy |
| ST-005 | Como FinOps, quero cálculo automático do repasse por hotel | Cálculo verificável e exportável; IR retido registrado separadamente |
| ST-006 | Como FinOps, quero garantia de que nenhum repasse seja duplicado | Stripe rejeita duplicate idempotency key; 2 disparos simultâneos resultam em 1 repasse |
| ST-007 | Como FinOps, quero alerta quando repasse falhar após todas as retentativas | Alerta com hotel + valor + motivo após 3 falhas; ação manual disponível no painel |
| ST-008 | Como FinOps, quero relatório de conciliação automático por ciclo | Relatório gerado ao final do ciclo; divergência > 0,01% alerta e destaca |
| ST-009 | Como FinOps, quero exportar dados do ciclo por hotel | CSV/XLSX por hotel/período; com IR e penalidade discriminados |

### A.6 Requisitos Não-Funcionais (NFRs)

| Dimensão | Requisito | Verificação |
|---|---|---|
| Performance | Concierge: primeira resposta < 5s (com API de reservas); Settlement: repasse por hotel < 10s (ex-Stripe) | Testes de carga em staging |
| Confiabilidade | Concierge: ≥ 99,5% disponibilidade; Settlement: ≥ 99,9% nos dias de ciclo; serviços independentes | Monitoramento + alertas de downtime |
| Segurança | PCI DSS SAQ A — dados de cartão nunca tocam servidores da StayFlow; webhooks Stripe validados via HMAC; ledger imutável; painel FinOps com MFA | Code review de segurança; pen test no fluxo de pagamento |
| **Idempotência** (requisito de produto) | Toda transação do Settlement é idempotente — mesmo resultado N vezes | Testes de idempotência com chaves duplicadas; simulação de falhas parciais |
| Usabilidade | Gestor configura regra de escalonamento em ≤ 10 min; FinOps dispara ciclo em ≤ 3 cliques | Teste de usabilidade antes do release |
| Auditabilidade | Toda operação financeira registrada no ledger com timestamp, operador e referência cruzada | Revisão do ledger após simulação de ciclo completo |

### A.7 Edge Cases e Modos de Falha

Ver listagem completa no [RP-2026-050, Seção 9](./02-readiness-package-concierge-settlement.md). Edge cases críticos para o PM estar ciente:

- **Repasse fora do percentual esperado**: bloqueado e alerta ao FinOps — não executado automaticamente.
- **Hotel sem dados bancários no Stripe Connect**: repasse bloqueado; acúmulo para próximo ciclo após resolução.
- **Chargeback após repasse executado**: não há estorno automático; FinOps trata manualmente.
- **Reembolso parcial após repasse executado**: alerta ao FinOps para verificar ajuste com o hotel.
- **LLM provider indisponível**: Concierge em modo degradado (respostas pré-definidas para top 10 perguntas + escalonamento de todo o resto).
- **Ciclo disparado em paralelo por dois operadores**: somente um é processado — idempotência por chave.

---

## Parte B — Definição Técnica (do Technical Assessment · CTO)

> Síntese do TA. O documento-fonte completo é [`TA-2026-050`](./03-technical-assessment-concierge-settlement.md).

### B.1 Veredito de Viabilidade

| Campo | Valor |
|---|---|
| **Veredito** | **Viável com ressalvas** |
| **Ressalvas** | (1) Migração para Stripe Connect é pré-condição do Settlement — sem ela, o serviço não vai a produção. Exige coordenação com todos os hotéis parceiros. Este é o item de maior risco de cronograma. (2) LLM provider deve ser contratado antes do desenvolvimento. (3) Ledger imutável por design desde o início — não é retroativo. (4) PCI DSS scope mínimo exige que dados de cartão nunca toquem os servidores da StayFlow. |

### B.2 Impacto Arquitetural e Integrações

| Área / Sistema | Impacto | Nota |
|---|---|---|
| **Stripe Connect** | Novo PSP para repasse — substitui Pagar.me no fluxo de split. Pagar.me permanece para cobrança do hóspede na Fase 1. | Requer criação de connected accounts por hotel parceiro antes do go-live |
| **Ledger (PostgreSQL append-only)** | Novo banco dedicado para o Settlement Service. Tabela imutável com triggers de banco. | Isolado do banco principal para integridade financeira |
| **Concierge Service** | Novo serviço: orquestração de LLM (OpenAI + fallback Anthropic), RAG com pgvector, motor de regras de escalonamento, integração Zendesk e API de reservas | Deployado e escalado independentemente do Settlement |
| **Settlement Service** | Novo serviço: calculadora de split, motor de idempotência, integrador Stripe Connect, motor de conciliação | Processamento assíncrono via fila de mensagens (SQS ou equivalente) |
| **OpenAI API + Anthropic (fallback)** | Novos provedores externos de LLM | Custo recorrente por token; camada de abstração para evitar vendor lock-in |
| **Zendesk** | Integrado (não substituído) — novos campos e regras de roteamento | Sem mudança no helpdesk existente |
| **API interna de Reservas** | Apenas consumida — sem modificações. Endpoint `/reservations/{id}/context` existente | — |

### B.3 Constraints Rígidas

| Constraint | Efeito no escopo |
|---|---|
| **Migração para Stripe Connect é pré-condição do Settlement** | Settlement não vai a produção sem a migração completa e testada. PM deve planejar a migração como marco do cronograma. |
| **Ledger financeiro imutável por design desde o início** | Sprint 1 do Settlement deve incluir o design e implementação do ledger — não pode ser postergado. |
| **PCI DSS: dados de cartão nunca tocam os servidores da StayFlow** | Frontend de pagamento do hóspede usa Stripe Elements/Checkout. Sem formulário de pagamento próprio. |
| **Concierge e Settlement como serviços independentes** | Dois deployments, dois bancos, dois pipelines. Nenhuma chamada síncrona direta entre os serviços. |
| **Webhooks do Stripe validados via HMAC** | A implementação do webhook receiver é early scope — code review de segurança obrigatório antes do primeiro ciclo de repasse. |

### B.4 ADRs (nível arquitetural)

| # | Decisão | Sign-off CTO |
|---|---|---|
| ADR-001 | Stripe Connect como PSP de repasse (em substituição ao Pagar.me) | ✓ |
| ADR-002 | Ledger financeiro: tabela append-only com triggers de banco (PostgreSQL) | ✓ |
| ADR-003 | LLM provider abstrato com interface (OpenAI + fallback Anthropic) para evitar vendor lock-in | ✓ |
| ADR-004 | Concierge e Settlement como serviços independentes (não monólito) | ✓ |
| ADR-005 | Fila de mensagens para processamento assíncrono do ciclo de repasse (SQS ou equivalente) | ✓ |
| ADR-006 | RAG com pgvector para base de conhecimento do Concierge | ✓ |

---

## Reconciliação de Escopo

> O CTO não vetou nenhum item do RP. As ressalvas geraram adições ao escopo e restrições de design, não cortes.

| Item original (RP) | Mudança após Technical Assessment | Motivo |
|---|---|---|
| "Motor de split com Pagar.me" (implícito na demanda original) | **Reescopado**: migração para Stripe Connect como pré-condição do Settlement | Pagar.me não oferece idempotência garantida nem webhooks por beneficiário |
| "Ledger de transações" | **Reforçado com constraint de design**: imutável por design desde Sprint 1, com triggers de banco | A imutabilidade não pode ser adicionada retroativamente |
| "Integração com LLM" | **Adicionado ADR**: camada de abstração (interface LLMClient) + fallback para Anthropic | Evitar vendor lock-in e risco de downtime total do Concierge |
| "Repasse via integração bancária" | **Clarificado**: o Stripe Connect é quem faz a integração bancária — a StayFlow não tem integração direta com banco | Simplifica o escopo da StayFlow e mantém PCI scope mínimo |
| Estimativa de esforço (PO: ~70 dias) | **Revisada para cima**: 89 dias de engenharia (~10 semanas com equipe paralela) | Migração de PSP e testes financeiros foram subestimados no RP |

**Resultado:** Escopo do RP mantido integralmente. Nenhum item foi removido — a reconciliação adicionou clareza arquitetural e uma constraint de design (imutabilidade do ledger) que o RP não havia explicitado.

---

## Visão Consolidada de Riscos e Dependências

> Riscos de produto/negócio (RP, Seção 12) + riscos técnicos (TA) em uma tabela única — o PM planeja contra esta visão.

| Risco | Origem | Tipo | Probabilidade | Impacto | Mitigação |
|---|---|---|---|---|---|
| Migração de PSP sem downtime falha em produção | TA | Técnico / Integração | Média | Alto | Dual-write (Pagar.me + Stripe coexistindo por 1 sprint); testes ponta a ponta em staging com dados reais antes da produção; rollback disponível |
| Hotel Gran Vista rescindir antes do go-live do Settlement | RP | Externo / Negócio | Média | Alto | CS comunica proativamente o cronograma; se prazo não for atingível, decidir entre comunicar ao parceiro ou priorizar MVP mínimo de Settlement primeiro |
| Chatbot piora CSAT na fase inicial (respostas inadequadas) | RP | Produto | Média | Alto | Rollout gradual: 20% do tráfego nas primeiras 2 semanas; guardrail explícito — se CSAT cair < 3,8, desligar e retornar ao atendimento humano |
| Criação de connected accounts Stripe para hotéis com dados incompletos | TA | Integração / Dados | Média | Alto | FinOps coleta dados dos hotéis antes da migração; onboarding automatizado no painel FinOps; hotéis sem conta ficam bloqueados para repasse (não aborta o ciclo dos demais) |
| Inconsistência de cálculo de split (bug de arredondamento ou regra) | TA | Dados / Financeiro | Baixa | Alto | Testes unitários exaustivos com casos extremos; validação manual do FinOps no primeiro ciclo antes de remover o check humano |
| Percentuais de comissão no sistema divergem dos contratos | RP | Negócio | Média | Alto | FinOps (Bruno Takeda) valida e migra os percentuais da planilha para o sistema antes do go-live — pré-condição bloqueante |
| Falha silenciosa de webhook do Stripe | TA | Integração | Baixa | Alto | Idempotência na recepção; polling de status como fallback; dead-letter queue para eventos não processados |
| Regra de IR configurada incorretamente por hotel | RP / TA | Compliance | Baixa | Alto | Jurídico revisa as alíquotas antes do go-live; campo configurado manualmente pelo FinOps com confirmação explícita |
| Latência do LLM excede 5s em pico | TA | Infra / Externo | Média | Médio | Fallback para Anthropic com timeout de 5s; streaming de resposta (SSE) para reduzir percepção de latência |
| Adoção do painel FinOps lenta (uso paralelo da planilha) | RP | Adoção | Média | Médio | Treinamento antes do go-live; data de "desativação da planilha" estabelecida com o FinOps |
| Base de conhecimento do Concierge desatualizada | TA | Produto / IA | Média | Médio | Processo simples de atualização pelo gestor de CS (painel); revisão quinzenal; flag de insatisfação como sinal de resposta incorreta |

**Dependências externas conhecidas:**
- **Bruno Takeda (FinOps)** deve migrar percentuais de comissão para o sistema antes do go-live do Settlement — pré-condição bloqueante.
- **Todos os hotéis parceiros** devem ter conta Stripe Connect criada antes do primeiro ciclo de repasse automatizado — coordenação entre FinOps e CTO.
- **Time de CS** precisa de treinamento no fluxo de handoff antes do go-live do Concierge.
- **LLM provider** deve ser contratado e configurado antes do início do desenvolvimento do Concierge Service.

---

## Esforço e Custo (firme)

> Do Technical Assessment (substitui o preliminar do RP). Somente uso interno — não é compromisso contratual nem material para cliente.

| Área | Estimativa firme | Senioridade |
|---|---|---|
| Backend — Concierge Service | 18 dias | Senior |
| Backend — Settlement Service | 22 dias | Senior |
| Backend — Migração de PSP | 10 dias | Senior |
| Frontend — Widget do Concierge | 8 dias | Mid-Senior |
| Frontend — Painel de Gestão (Concierge) | 6 dias | Mid |
| Frontend — Painel FinOps (Settlement) | 6 dias | Mid |
| QA — Concierge | 6 dias | QA |
| QA — Settlement (inclui testes de idempotência e financeiros) | 8 dias | QA |
| DevOps / Infra | 5 dias | DevOps |
| **Total** | **89 dias** | |

> Com equipe paralela (2 Seniors + 1 Mid-Senior + 1 Mid + 1 QA + 1 DevOps): **~10 semanas de desenvolvimento**. Estimativa do PO (~70 dias) subestimou em ~27%, principalmente pela migração de PSP e pelos testes financeiros.

**Infra / Terceiros / Opex recorrente:**
- OpenAI API (GPT-4o-mini): ~R$ 1.200/mês
- Anthropic Claude Haiku (fallback): ~R$ 150/mês
- Stripe Connect: ~0.5% por repasse + ~R$ 0,70/transferência (variável com GMV)
- Observabilidade (Datadog/Grafana Cloud, se não existir stack): R$ 800–2.000/mês
- Novo banco de dados para ledger: marginal (~R$ 50/mês)

---

## Prontidão Herdada e Dispositions em Aberto

> O que o PM precisa enxergar antes de planejar: premissas a validar, incógnitas de Discovery e respostas delegadas que sobreviveram até aqui. Se uma premissa se provar falsa na execução, a demanda é reavaliada.

| Campo | Valor |
|---|---|
| **Premissas ainda a validar** | (1) Percentuais de comissão por hotel serão migrados da planilha para o sistema pelo FinOps antes do go-live — pré-condição bloqueante para o Settlement; (2) Regra de IR de cada hotel será revisada e configurada pelo FinOps/Jurídico antes do primeiro ciclo automatizado |
| **Incógnitas de Discovery** | Todas resolvidas (ver [Intake Record — Log do Discovery](./01-intake-record-concierge-settlement.md)) |
| **Requisitos delegados (com dono)** | Migração dos percentuais e configuração do IR por hotel: **Bruno Takeda (FinOps)** — must be done antes do go-live do Settlement. Criação de contas Stripe para hotéis: **FinOps + CTO** — coordenação necessária durante o desenvolvimento. Treinamento do time de CS no handoff: **Gestor de CS (Camila Rocha)** — before go-live do Concierge. |

---

## Critérios de Sucesso e Métricas (projetados)

> Baseline projetado para confronto pós-rollout com o realizado.

| Tipo | Métrica | Meta (projetada) | Janela | Confiança |
|---|---|---|---|---|
| **Primária** | Taxa de resolução na 1ª camada (Concierge) | ≥ 55% das conversas resolvidas sem escalonamento | 30 dias pós-release | 70 |
| **Primária** | Taxa de repasse correto | ≥ 99,5% dos repasses com valor dentro de ±0,5% do esperado | Por ciclo | 85 |
| **Secundária** | CSAT médio de hóspede | ≥ 4,3/5 | 60 dias pós-release | 65 |
| **Secundária** | Horas/semana do FinOps no ciclo de repasse | < 4h/semana | 60 dias pós-release | 60 |
| **Guardrail** | CSAT médio geral de atendimento não cai | ≥ 3,8/5 (baseline atual) durante rollout do Concierge | Primeiros 30 dias | 90 |
| **Guardrail** | Zero repasses duplicados | 0 ocorrências de pagamento duplicado | Em todo tempo de vida | 95 |
| **Guardrail** | Disponibilidade do Settlement nos dias de ciclo | ≥ 99,9% | Por ciclo | 80 |

---

## Handoff ao PM — Gate de Aceite

> O PM tem **autoridade explícita para rejeitar** o PRD e devolvê-lo com gaps específicos (não um genérico "precisa de mais detalhes"). A rejeição e o motivo entram no Histórico de Revisão; o PO (ou o CTO, conforme o gap) trata só os gaps e incrementa a versão. Ver [`interactions/07-po-to-pm.md`](../interactions/07-po-to-pm.md).

| Checklist de entrega | OK? |
|---|---|
| RP congelado (`freezeReady = true`) e referenciado | ☑ |
| Technical Assessment assinado (TA-2026-050 v1) | ☑ |
| Reconciliação de escopo registrada | ☑ |
| Riscos e dependências consolidados | ☑ |
| Dependências externas explícitas (FinOps, hotéis, CS, LLM provider) | ☑ |
| Dispositions em aberto visíveis (percentuais de comissão, IR, treinamento de CS) | ☑ |

**Prioridade e contexto de negócio:** alto. Esta é a demanda operacional mais urgente da StayFlow no Q2-2026. O Hotel Gran Vista tem prazo informal de ~60 dias a partir de 2026-04-07 para ver progresso. O PM deve avaliar se uma entrega faseada (Concierge primeiro, Settlement depois da migração de PSP) é mais segura para o prazo do que uma entrega única. A decisão de comunicar ao parceiro sobre o cronograma realista é do CS/Operações — mas o PM precisa confirmar se o prazo de ~10 semanas de desenvolvimento é compatível com o risco de negócio.
