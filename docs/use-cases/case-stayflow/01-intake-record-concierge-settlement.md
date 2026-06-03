# Intake Record — Concierge & Settlement

> **Este é o Intake Record — o artefato formal da camada de intake, de autoria do PO.** Ele recebe o [`00 Documento do Submitter`](./00-submitter-brief-concierge-settlement.md) (`gateReady = true`), atribui o ID oficial `INT-AAAA-NNN` e registra o **primeiro ato do PO: a triagem** — a decisão de roteamento (Product Ready / Discovery / Backlog / Rejeitar) com justificativa rastreável. Ver [`personas/02-po.md` §3 e §6.1](../../../personas/02-po.md).
>
> **Ele não reescreve a captura do Submitter** — **referencia** o brief 00 e o consolida. O aprofundamento de produto (visão, escopo, regras, métricas) é o **segundo ato** do PO e vive no [`02 Readiness Package`](./02-readiness-package-concierge-settlement.md).
>
> **Jornada:** [`00 Documento do Submitter`](./00-submitter-brief-concierge-settlement.md) → `01 Intake Record (PO — triagem)` → [`02 Readiness Package (PO)`](./02-readiness-package-concierge-settlement.md) → [`03 Technical Assessment (CTO)`](./03-technical-assessment-concierge-settlement.md) → [`04 PRD (PO+CTO → PM)`](./04-prd-concierge-settlement.md).

## Metadados

| Campo | Valor |
|---|---|
| **ID do Registro** | INT-2026-050 |
| **Versão** | v2 (pós-Discovery) |
| **Documento do Submitter (origem)** | [`00-submitter-brief-concierge-settlement.md`](./00-submitter-brief-concierge-settlement.md) |
| **Registrado por (Submitter)** | Camila Rocha (CS/Operações) |
| **Triado por (PO)** | Rafael Souza (PO) |
| **Data de registro** | 2026-04-08 |
| **Data de triagem inicial** | 2026-04-09 |
| **Data de triagem final (pós-Discovery)** | 2026-04-22 |
| **Status** | Triado — Product Ready (pós-Discovery) |
| **Readiness Package vinculado** | RP-2026-050 |

## Histórico de Revisão

| Versão | Data | Evento | Resumo |
|---|---|---|---|
| v1 | 2026-04-08 | Intake formalizado | Brief 00 recebido com `gateReady = true`. PO iniciou triagem. |
| v1 | 2026-04-09 | Triagem inicial concluída | Decisão: Discovery. 3 incógnitas identificadas. Discovery Brief aberto. |
| v2 | 2026-04-22 | Discovery encerrado | Todas as incógnitas resolvidas. Decisão revista: Product Ready. Escalada ao CTO confirmada. |

---

## Prontidão recebida do Submitter

> Snapshot herdado do brief 00 no handoff. O PO não recalcula a captura — registra o que recebeu e o que segue *soft*.

| Campo | Valor |
|---|---|
| **Readiness Score no handoff** | 81 % |
| **Requisitos bloqueantes** | Todos resolvidos por disposição honesta (`gateReady`) — **Sim** |
| **Dispositions em aberto** | 3 premissas a validar · 1 discovery (PSP/fiscal) · 0 delegados |

---

## Demanda consolidada

> Resumo de uma tela, validado pelo PO contra o brief 00 (não é re-digitação — é a leitura do PO). O detalhe completo, com confiança por campo, está no [`00`](./00-submitter-brief-concierge-settlement.md).

| Dimensão | Síntese | Confiança herdada |
|---|---|---|
| **Problema** (a dor, não a solução) | **Dois problemas distintos:** (A) atendimento de 1ª camada ao hóspede é 100% humano, com SLA furado em 34% e CSAT em queda (3,8/5); transferência entre atendentes perde contexto. (B) repasse financeiro ao hotel parceiro é calculado e executado manualmente, com erros de percentual em 3 incidentes nos últimos 6 meses; dois parceiros em risco de rescisão. | 88 |
| **Alcance** (quem é impactado) | Todos os hóspedes da plataforma (canal de atendimento); todos os hotéis parceiros (ciclo de repasse); time de CS e FinOps internamente. | 85 |
| **Impacto de negócio** | Risco de perda de ~R$ 140k GMV/ano (2 parceiros em rescisão); custo de atendimento em escala (R$ 28k+/mês + contratações futuras); carga manual financeira de 18h/semana; exposição a multas contratuais. | 72 (estimativas, não calculadas) |
| **Urgência** (por que agora) | Hotel Gran Vista com prazo informal de ~60 dias para ver progresso antes de avaliar rescisão. Volume de reservas crescendo — cada ciclo sem automação amplifica o risco. | 75 (prazo informal, não documentado) |
| **Prioridade declarada** | Alto | — |

---

## Triagem — decisão de roteamento  ·  *(Ato 1 do PO)*

> O PO avalia cada critério (todos avaliados = pode concluir a triagem) e então toma **uma** decisão de caminho, com justificativa obrigatória. Ver [`personas/02-po.md` §6.1](../../../personas/02-po.md).

### Critérios avaliados

| # | Critério | Veredito | Justificativa (rationale) | Base / Fonte |
|---|---|---|---|---|
| 1 | É um problema real (não sintoma isolado)? | **Sim** | Os dois problemas têm evidência concreta: dados de CSAT e SLA no Zendesk, 3 incidentes de repasse documentados no log financeiro, e-mails de reclamação de parceiros. Não são hipóteses — são fatos operacionais. | Brief 00, slide de indicadores Q1-2026, log de incidentes |
| 2 | É recorrente / tem volume? | **Sim** | O problema de atendimento ocorre em cada ticket — estrutural, não episódico. O problema de repasse ocorre em cada ciclo (mensal) — e os erros são 3 em 6 meses, com tendência de piora conforme o volume cresce. | Brief 00, dados de Zendesk |
| 3 | Encaixa na visão do produto? | **Sim** | A StayFlow é um marketplace de reservas — o atendimento ao hóspede e a integridade do repasse ao parceiro são operações core, não periféricas. Automatizar ambas está diretamente alinhado com a escalabilidade do modelo de negócio. | Alinhamento estratégico verificado com Diretora de Operações (presente na reunião Q2) |
| 4 | Qual o impacto técnico e de negócio? | **Alto** | Impacto de negócio: risco de rescisão de parceiros, custo operacional em escala, exposição legal. Impacto técnico: split de pagamento, idempotência, integração com PSP, conciliação — domínio com complexidade arquitetural não trivial. Necessita avaliação do CTO. | Brief 00, avaliação preliminar do PO |
| 5 | Urgência e impacto justificam agora? | **Sim** | Prazo de 60 dias do Gran Vista é real (mesmo que informal). Custo de esperar cresce linearmente com o volume. | Brief 00 — urgência e risco de rescisão |

### Decisão de caminho (inicial — 2026-04-09)

| Campo | Valor |
|---|---|
| **Decisão** | **Discovery** |
| **Justificativa** | Três incógnitas críticas impedem o escopo de ser fechado com confiança: (1) o PSP atual suporta split de pagamento nativo? (2) quais são os requisitos fiscais do repasse (retenção de IR, NF)? (3) a API do sistema de reservas tem endpoints de contexto consumíveis pelo atendimento? Sem essas respostas, o RP pode ser fechado sobre premissas erradas — especialmente a do PSP, que é crítica para o domínio de Settlement. | — |
| **Reversível?** | Sim — Discovery → Product Ready após resolução das incógnitas |
| **Submitter notificado** | Sim — 2026-04-09 (Camila informada por e-mail sobre o Discovery e o time-box de 14 dias) |

### Decisão de caminho (revista — 2026-04-22, pós-Discovery)

| Campo | Valor |
|---|---|
| **Decisão** | **Product Ready** |
| **Justificativa** | As três incógnitas foram resolvidas no Discovery (ver Log e Resultado abaixo). O escopo pode ser fechado. A migração de PSP foi confirmada como necessária e entra no escopo. Os requisitos fiscais básicos foram mapeados (com parte adiada para Fase 2). A API de contexto é viável. | — |
| **Reversível?** | N/A — abertura do Ato 2 (racionalização → RP) |
| **Submitter notificado** | Sim — 2026-04-22 (Camila informada do resultado do Discovery e início do RP) |

---

## Escalada arquitetural ao CTO

**Necessária:** **Sim** — A demanda toca split de pagamento, idempotência de transações financeiras, integração com PSP/gateway, conciliação contábil e orquestração de IA. Todos esses domínios requerem avaliação de viabilidade, escolha de arquitetura e definição de constraints pelo CTO antes de o escopo de produto poder ser congelado.

> A escalada será formalizada durante a racionalização (RP). O CTO produzirá o Technical Assessment TA-2026-050 em paralelo ao RP. Ver [`interactions/05-po-to-cto.md`](../../../interactions/05-po-to-cto.md).

---

## Premissas validadas na triagem

> Quais premissas do brief 00 o PO revisou e o veredito de cada uma. Premissas que sobrevivem viajam adiante explicitamente.

| Premissa (do brief 00) | Veredito do PO | A validar com |
|---|---|---|
| Percentuais de comissão por hotel estão cadastrados em planilha ou sistema consultável | **A validar** — confirmado que existem, mas o formato (planilha vs. sistema) define a dificuldade de integração | Bruno Takeda (FinOps) — no Discovery |
| Gateway atual tem API de criação e consulta de transações | **A validar no Discovery** — o PSP atual pode não suportar split; isso define boa parte do escopo de Settlement | CTO — spike técnico no Discovery |
| Time de atendimento usa ferramenta de helpdesk (Zendesk) integrável | **Aceita** — Camila confirmou que usam Zendesk. API do Zendesk é pública e bem documentada. | — |
| Plataforma de reservas tem API com dados de contexto de reserva | **A validar no Discovery** — crítico para o Concierge Service ser contextualizado | CTO — revisão de API interna no Discovery |

---

## Constraints reconhecidos

> Constraints que o PM deve considerar desde o primeiro dia (herdados do brief, validados aqui).

| Constraint | Tipo | Nota do PO |
|---|---|---|
| Prazo informal de 60 dias do Gran Vista | Tempo | Informal mas real. PM deve considerar ao planejar capacidade. Se o esforço técnico firme (TA) exceder o prazo, é decisão de negócio comunicar ao parceiro. |
| PCI DSS — conformidade em pagamentos | Legal / Técnico | O fluxo de cobrança do hóspede e repasse toca dados de cartão. A solução deve ser PCI-compliant ou usar PSP que absorva o escopo. CTO confirmará no TA. |
| Percentuais individuais por hotel | Escopo | Cada hotel tem percentual próprio. O motor de split deve suportar configuração por parceiro — não um percentual global. |
| Não interromper reservas em andamento | Técnico | Qualquer mudança no PSP ou gateway deve ser feita sem downtime nas reservas existentes. Estratégia de migração necessária. |
| Zendesk como sistema de atendimento existente | Técnico / Escopo | A automação de atendimento deve integrar com o Zendesk existente — substituir o sistema de helpdesk está fora do escopo. |

---

## Discovery Brief

> Preencher apenas se a decisão de caminho for **Discovery**. Caso contrário, remover esta seção.

### O que estava faltando

| # | Incógnita | Quem pode responder | Método |
|---|---|---|---|
| 1 | O PSP/gateway atual (integração de pagamento existente) suporta split de pagamento nativo entre StayFlow e hotel? Se não, quais as opções (migrar para PSP com split, arquitetura de múltiplos PSPs, split manual via ledger)? | CTO (Davi Lima) | Spike técnico — revisar documentação do PSP atual e avaliar Stripe Connect / Adyen Marketplace / Pagar.me como alternativas |
| 2 | Quais os requisitos fiscais e contábeis do repasse ao hotel parceiro? Há retenção de IR na fonte? A StayFlow emite NF sobre o repasse? O hotel emite NF para a StayFlow? Como a conciliação deve ser estruturada contabilmente? | Jurídico/Contábil (Isabela Ramos) + FinOps (Bruno Takeda) | Reunião com as duas áreas; revisão dos contratos dos hotéis parceiros |
| 3 | A API interna do sistema de reservas da StayFlow expõe dados de contexto (status de reserva, hóspede, check-in/out, detalhes do hotel) de forma consumível pelo Concierge Service? Qual o formato, latência esperada e eventuais limitações? | CTO (Davi Lima) | Revisão da documentação da API interna; spike de consumo do endpoint relevante |

**Time-box do Discovery:** 14 dias corridos (2026-04-09 → 2026-04-22)

---

### Log do Discovery

#### 2026-04-11 — Spike técnico: PSP atual

Rafael e Davi revisaram a documentação da integração atual com o Pagar.me (PSP em uso). Resultado: Pagar.me tem suporte a split via "Split Rules", mas com limitações: (a) o split é configurado no momento da transação, não programaticamente depois; (b) não há garantia de idempotência nativa — uma transação duplicada pode gerar dois repasses; (c) a API de split não tem webhook de confirmação por beneficiário.

**Decisão parcial:** o PSP atual não é adequado para o modelo de Settlement sem um ledger de idempotência próprio. Davi iniciou avaliação de Stripe Connect e Adyen Marketplace como alternativas.

#### 2026-04-14 — Reunião com FinOps e Jurídico

Bruno Takeda (FinOps) e Isabela Ramos (Jurídico) participaram. Resultados:
- O repasse ao hotel é financeiro (transferência bancária), não uma NF da StayFlow — é o hotel que emite a NF para seus próprios serviços prestados à StayFlow (a StayFlow é o contratante do hotel, não o contrário). Em alguns casos, a StayFlow deve reter IR na fonte (hotéis PJ com certos enquadramentos). A regra fiscal depende do CNPJ de cada hotel — campo a cadastrar.
- A conciliação hoje é manual em planilha. Não há sistema. O processo exige: registro do repasse executado, comparação com o valor esperado (comissão × reserva), e exportação mensal por hotel.
- NF emitida pelo hotel para a StayFlow: cada hotel tem seu processo. A StayFlow não emite NF sobre o repasse — ela paga, não recebe serviço. A integração com emissão de NF do hotel está fora do controle da StayFlow (cada hotel tem seu sistema fiscal).

**Decisão:** emissão de NF do hotel é responsabilidade do hotel; a StayFlow deve registrar o repasse e exportar dados para que o hotel possa emitir a NF. Automação de emissão de NF adiada para Fase 2 (exigiria integração por CNPJ/regime tributário de cada hotel — complexidade desproporcional ao MVP). Regra de retenção de IR na fonte: entra no escopo do motor de split como campo configurável por hotel.

#### 2026-04-16 — Spike técnico: API interna de reservas

Davi revisou a documentação interna. Endpoint `/reservations/{id}/context` existe e retorna dados relevantes: `guest_name`, `hotel_name`, `check_in`, `check_out`, `status`, `booking_id`, `room_type`. Latência medida em staging: ~140ms p95. Autenticação via JWT interno. Sem limitações de rate relevantes para o volume de atendimento esperado.

**Decisão:** viável. O Concierge Service pode consumir esse endpoint para personalizar respostas de IA. Nenhuma mudança necessária na API de reservas.

#### 2026-04-18 — Avaliação de PSP alternativo

Davi finalizou avaliação de Stripe Connect. Resultado: suporta split nativo via "connected accounts", com idempotency keys por transação (resolve o problema de duplicidade), webhooks de confirmação por beneficiário, e compliance PCI DSS Level 1 absorvido pelo Stripe. Custo adicional: ~0.5% por transação de repasse. Migração exige: criar accounts Stripe para cada hotel parceiro, mapear contratos de split, testar fluxo de ponta a ponta.

**Decisão do CTO (parcial):** migração para Stripe Connect é a rota recomendada. Será formalizada no TA. A migração é um item de escopo que entra no PRD.

---

### Resultado do Discovery

| # | Incógnita | Resolução | Impacto no escopo |
|---|---|---|---|
| 1 | PSP atual (Pagar.me) suporta split nativo? | **Não adequadamente.** Pagar.me tem split básico mas sem idempotência garantida. Recomendação do CTO: migrar para Stripe Connect (split nativo, idempotency keys, webhooks, PCI). | **Adicionado ao escopo:** migração para Stripe Connect como pré-condição do Settlement Service. Estimativa de migração entra no TA. |
| 2 | Requisitos fiscais do repasse | **Parcialmente mapeados.** Retenção de IR na fonte: configurável por hotel (campo a cadastrar). NF é responsabilidade do hotel; a StayFlow exporta os dados. Conciliação contábil: processo manual a ser automatizado. | **Adicionado ao escopo:** campo de retenção IR por hotel, exportação de dados para NF, módulo de conciliação. **Adiado:** integração com emissor de NF do hotel (Fase 2). |
| 3 | API interna de reservas tem endpoint de contexto? | **Sim.** Endpoint `/reservations/{id}/context` disponível, latência ~140ms p95, sem limitações relevantes. | **Adicionado ao escopo:** Concierge Service consome o endpoint para contextualizar respostas da IA. Nenhuma mudança na API de reservas. |

**Novo caminho de decisão:** Discovery → **Product Ready**

**Discovery encerrado:** 2026-04-22 (13 dias corridos — dentro do time-box de 14 dias)

---

## Handoff

- **Product Ready** confirmado (2026-04-22): PO inicia a **racionalização** → [`02 Readiness Package`](./02-readiness-package-concierge-settlement.md).
- **Escalada ao CTO** confirmada (2026-04-22): CTO produz Technical Assessment TA-2026-050 em paralelo ao RP.
- Submitter (Camila) notificada do resultado do Discovery e do início do RP — 2026-04-22.
