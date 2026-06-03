# Technical Assessment — Concierge & Settlement

> O Technical Assessment (TA) é o **output do CTO** — viabilidade, constraints, arquitetura, integrações, riscos técnicos, ADRs e custo firme. É escrito **sozinho** pelo CTO, **em paralelo** ao Readiness Package, e **responde** a ele: o CTO **nunca edita o RP**. O TA não redefine o produto — pode **vetar** a viabilidade do escopo, e nesse caso o PO revisa o escopo do RP.
>
> A fusão do RP (produto) com este TA (técnico) acontece no [PRD](./04-prd-concierge-settlement.md), e é o PRD que abre o downstream. Ver [`personas/02-po.md` §2 e §10](../../../personas/02-po.md) e [`interactions/05-po-to-cto.md`](../../../interactions/05-po-to-cto.md).
>
> **Jornada:** [`00 Documento do Submitter`](./00-submitter-brief-concierge-settlement.md) → [`01 Intake Record (PO — triagem)`](./01-intake-record-concierge-settlement.md) → [`02 Readiness Package (PO)`](./02-readiness-package-concierge-settlement.md) → `03 Technical Assessment (CTO)` → [`04 PRD (PO+CTO → PM)`](./04-prd-concierge-settlement.md).

## Metadados

| Campo | Valor |
|---|---|
| **ID do Assessment** | TA-2026-050 |
| **Versão** | v1 |
| **RP vinculado** | RP-2026-050 v1 |
| **Intake vinculado** | INT-2026-050 |
| **Responsável** | Davi Lima (CTO) |
| **Status** | **Assinado** |
| **Veredito de viabilidade** | **Viável com ressalvas** |
| **Data de sign-off** | 2026-04-25 |

## Histórico de Revisão

| Versão | Data | Autor | Status | Resumo |
|---|---|---|---|---|
| v1 | 2026-04-22 | Davi Lima (CTO) | Em andamento | Iniciado em paralelo ao RP, pós-Discovery. |
| v1 | 2026-04-25 | Davi Lima (CTO) | Assinado | Assessment finalizado. Ressalva principal: migração de PSP no caminho crítico. |

---

## Veredito de Viabilidade

> A decisão de primeira classe do CTO. Carrega justificativa — nunca um carimbo.

| Campo | Valor |
|---|---|
| **Veredito** | **Viável com ressalvas** |
| **Justificativa** | Ambos os domínios (Concierge e Settlement) são tecnicamente viáveis dentro do escopo definido no RP. A arquitetura é bem estabelecida — orquestração de IA com handoff e split de pagamento com ledger são padrões conhecidos. A ressalva principal é **operacional e de cronograma**: a migração de Pagar.me para Stripe Connect é uma pré-condição não-negociável do Settlement Service, e essa migração envolve criação de connected accounts para todos os hotéis parceiros, testes de integração ponta-a-ponta e uma janela de corte sem downtime nas reservas ativas. Essa migração **é o item com maior risco de prazo** — pode ser o gargalo que determina a data de go-live do Settlement. O Concierge Service não tem dependência do PSP e pode ser entregue independentemente. |
| **Ressalvas** | (1) Migração de PSP (Pagar.me → Stripe Connect) é pré-condição do Settlement — sem ela o serviço não pode ir a produção. A migração exige coordenação com hotéis parceiros para criação de contas Stripe; (2) O LLM provider deve ser selecionado e contratado antes do desenvolvimento do Concierge — custo recorrente por token; (3) O ledger financeiro deve ser implementado com garantias de imutabilidade desde o início — não é algo que pode ser adicionado depois sem migração de dados; (4) PCI DSS scope: a solução deve ser projetada para que dados de cartão nunca toquem os sistemas da StayFlow — exclusivamente via Stripe. |

---

## Perguntas do PO Endereçadas

> *Trace-to-source.* As incógnitas técnicas específicas que o PO escalou — e a resposta de cada uma.

| # | Pergunta do PO | Resposta do CTO |
|---|---|---|
| 1 | O Pagar.me (PSP atual) suporta split de pagamento de forma adequada para o modelo da StayFlow? | Não adequadamente. O Pagar.me tem "Split Rules" mas sem idempotency key por repasse (risco de duplicidade em retentativas) e sem webhook de confirmação por beneficiário. Recomendo migração para **Stripe Connect** — split nativo, idempotency key por transação, webhooks por connected account, PCI Level 1 absorvido pelo Stripe. Avaliação de Adyen Marketplace também foi feita — Stripe Connect é a escolha por documentação superior e ecossistema no Brasil. |
| 2 | A API interna de reservas tem endpoints de contexto consumíveis pelo Concierge Service? | Sim. O endpoint `/reservations/{id}/context` existe, retorna os dados necessários (confirmado no spike do Discovery), latência ~140ms p95. Sem mudanças necessárias na API de reservas. Será consumido pelo Concierge Service via HTTP com autenticação JWT. |
| 3 | Qual LLM provider usar para o Concierge? Quais são os riscos de vendor lock-in? | Recomendo **OpenAI GPT-4o-mini** como provider principal, com fallback para **Anthropic Claude Haiku** para resiliência. A arquitetura deve usar uma camada de abstração (interface de LLM) para não aclopar o código ao provider — permite troca sem refatoração. O custo por token (GPT-4o-mini) para o volume estimado de tickets é ~R$ 1.200/mês. |
| 4 | Como garantir que o Concierge e o Settlement não se afetem mutuamente em caso de falha? | Os dois serviços devem ser deployados e escalados **independentemente**. Cada serviço tem seu próprio banco de dados, seu próprio serviço de monitoramento e seus próprios alertas. O Concierge consome a API de reservas e o Zendesk; o Settlement consome o Stripe. Não há chamada direta entre Concierge e Settlement. A falha de um não propaga para o outro. |
| 5 | Como garantir imutabilidade do ledger financeiro? Isso é constraint de design ou pode ser adicionado depois? | É **constraint de design** — não pode ser adicionado depois sem migração. O ledger deve ser uma tabela append-only desde a criação: sem UPDATE, sem DELETE, com triggers de banco que impeçam modificação de registros existentes. Ajustes são feitos via lançamentos de crédito/débito com referência ao registro original. Isso é o que torna o ledger auditável e confiável como evidência financeira. |
| 6 | PCI DSS: qual o escopo de compliance da StayFlow com a solução proposta? | Com o Stripe absorvendo o processamento de cartão (SAQ A), o escopo de PCI da StayFlow é mínimo: a StayFlow não armazena, processa nem transmite dados de cartão — apenas recebe confirmações de pagamento via webhook assinado. O fluxo de cobrança do hóspede usa Stripe Elements (frontend) ou Stripe Checkout — o número do cartão nunca toca os servidores da StayFlow. Esse design é não-negociável: qualquer desvio expande o escopo de PCI para SAQ D ou auditoria QSA, que é proibitivo para o tamanho atual da empresa. |

---

## Sistemas e Componentes Afetados

| Sistema / Componente | Natureza do impacto |
|---|---|
| **PSP / Gateway de Pagamento (Pagar.me)** | Substituído por Stripe Connect para o fluxo de repasse aos hotéis. O Pagar.me pode permanecer para cobranças do hóspede na fase 1 (cobrança e repasse são fluxos diferentes). Decisão: migrar cobrança do hóspede para Stripe na Fase 2 para unificar o PSP. |
| **Stripe Connect** | Novo — plataforma de split de pagamento e repasse. Requer criação de connected accounts por hotel parceiro. Integração via API REST com SDK oficial. |
| **API interna de Reservas** | Apenas consumida — sem modificações. Endpoint `/reservations/{id}/context` existente. |
| **Zendesk** | Integrado pelo Concierge Service para criação de tickets com contexto. API pública do Zendesk (ticket creation, custom fields, routing rules). Sem mudança no Zendesk existente — apenas novos campos e regras de roteamento por categoria. |
| **Concierge Service** | Novo serviço — orquestrador de atendimento de IA. Componentes: motor de LLM (OpenAI + fallback), base de conhecimento (RAG), motor de regras de escalonamento, integração com API de reservas, integração com Zendesk. |
| **Settlement Service** | Novo serviço — motor de split e repasse. Componentes: calculadora de repasse, motor de idempotência, ledger financeiro, integrador Stripe Connect, motor de conciliação, painel FinOps. |
| **Banco de Dados — Ledger** | Novo banco dedicado (PostgreSQL) para o ledger financeiro — tabela append-only, com triggers de imutabilidade. Separado do banco principal para isolar o dado financeiro. |
| **Banco de Dados — Regras de Escalonamento** | Extensão do banco existente ou banco do Concierge Service — armazena as regras de escalonamento configuráveis. |
| **Infraestrutura de LLM** | Novo — API key de OpenAI (provider principal) e Anthropic (fallback). Custo recorrente por token. |
| **Painel de Gestão (Concierge)** | Nova interface web: visualização de CSAT, taxa de resolução, volume de tickets, configuração de regras de escalonamento. |
| **Painel FinOps (Settlement)** | Nova interface web: status do ciclo de repasse, conciliação, histórico por hotel, exportação de dados. |

---

## Impacto Arquitetural

> Território exclusivo do CTO.

| Área | Impacto | Nota arquitetural |
|---|---|---|
| **Modelo de dados** | Dois bancos adicionais: (1) Ledger (PostgreSQL append-only, imutável); (2) Concierge DB (regras de escalonamento, histórico de conversas, CSAT). O banco principal não é alterado. | O ledger financeiro **nunca** compartilha banco com outros domínios — isolamento por design para garantir integridade e facilitar auditoria. |
| **Eventos / mensageria** | Settlement Service: eventos de ciclo de repasse publicados em fila (ex.: SQS ou equivalente) para desacoplar o trigger do processamento. Permite retentativas e processamento assíncrono sem bloquear o caller. Concierge Service: conversas podem ser processadas em stream (SSE ou WebSocket) para melhorar UX de resposta do LLM. | Evitar chamada síncrona bloqueante no fluxo de repasse — o ciclo pode processar N hotéis em paralelo via workers assíncronos. |
| **Frontend** | Widget do Concierge: componente React embutível na plataforma StayFlow (não uma página separada). Deve funcionar em mobile via CSS responsivo. Painel de Gestão e Painel FinOps: SPAs com autenticação SSO. | O widget do Concierge deve ser carregável de forma lazy (não bloquear o carregamento da página de reservas). |
| **Segurança** | PCI DSS scope mínimo (SAQ A) via Stripe Elements — dados de cartão nunca tocam os servidores da StayFlow. Webhooks do Stripe devem ser validados via assinatura HMAC. Acesso ao Painel FinOps restrito por role (somente FinOps + Admin). Ledger: somente INSERT permitido na tabela de transações (triggers de banco). | A assinatura de webhook do Stripe é validada em cada recebimento — sem isso, um atacante pode injetar webhooks falsos de confirmação de pagamento. |
| **Multi-tenancy** | Sem impacto no modelo de multi-tenancy existente. Os hotéis são entidades no domínio da StayFlow — não são tenants da plataforma. O Settlement Service opera sobre o modelo de dados de hotéis/contratos existente. | — |
| **Performance / Escalabilidade** | Concierge Service: dimensionado para volume de atendimento atual (estimativa: 500–800 conversas/dia). Pode escalar horizontalmente. Settlement Service: processamento de repasse é batch (ciclo por hotel) — não requer alta escala, mas deve completar o ciclo de todos os hotéis em < 30 min. | O Settlement Service deve implementar rate limiting nas chamadas ao Stripe (limite da API: 100 req/s por conta). Com N hotéis em paralelo, garantir que não ultrapassa o rate limit. |
| **Observabilidade** | Dois novos serviços exigem: traces distribuídos (OpenTelemetry), logs estruturados, métricas de negócio (taxa de resolução Concierge, taxa de repasse correto, latência por etapa). Alertas específicos: LLM provider indisponível, falha de repasse, divergência de conciliação. | Usar o stack de observabilidade existente (se houver). Se não, provisionar Datadog ou Grafana Cloud — custo a incluir no TCO. |

---

## Integrações Necessárias

> Com a lente de viabilidade técnica.

| Sistema | Tipo | Protocolo | Viabilidade / Riscos conhecidos |
|---|---|---|---|
| **Stripe Connect** | Externo / PSP | REST (SDK oficial) + Webhooks (HTTPS) | Viável. Documentação excelente. Risco: criação de connected accounts para todos os hotéis exige e-mail e dados fiscais de cada parceiro — coordenação com FinOps e comunicação com hotéis necessária. Custo: ~0.5% adicional por repasse + taxa de transferência (~R$ 0,70/transferência). |
| **OpenAI API (GPT-4o-mini)** | Externo / LLM | REST (HTTPS) | Viável. Custo estimado: ~R$ 1.200/mês para o volume de atendimento projetado. Risco: latência variável do provider (p99 pode ser > 5s em picos). Fallback para Anthropic Claude Haiku mitiga a dependência de provider único. |
| **Anthropic Claude Haiku (fallback)** | Externo / LLM | REST (HTTPS) | Viável — fallback apenas. Ativado se OpenAI retornar erro 5xx ou timeout > 5s. |
| **Zendesk API** | Externo / Helpdesk | REST (HTTPS) | Viável. API pública bem documentada. Risco: rate limits do Zendesk podem ser atingidos se o volume de escalonamentos for alto no lançamento. Monitorar e implementar circuit breaker. |
| **API interna de Reservas** | Interno | REST (HTTPS, JWT) | Viável — confirmado no Discovery. Sem mudanças na API. Risco: se a API de reservas sofrer indisponibilidade, o Concierge opera em modo degradado (ver edge case no RP). |
| **Gateway Bancário (PIX/TED)** | Via Stripe Connect | API Stripe | O repasse aos hotéis é executado via Stripe Connect — o Stripe lida com a integração bancária (PIX ou transferência). A StayFlow não tem integração direta com banco para o repasse. Sem risco direto de integração bancária para a StayFlow. |

---

## Constraints Rígidas

> Condições não-negociáveis que limitam o espaço de solução. O PO não suaviza nem reinterpreta.

| Constraint | Tipo | Detalhe | Efeito no escopo |
|---|---|---|---|
| **Migração para Stripe Connect é pré-condição do Settlement** | Técnico / Externo | O Pagar.me não oferece as garantias necessárias (idempotência, webhooks por beneficiário). O Settlement Service não pode ir a produção com o Pagar.me atual. | A migração de PSP entra no escopo e no cronograma. O go-live do Settlement não pode ocorrer antes da migração estar completa e testada. |
| **Ledger imutável por design desde o início** | Técnico | Tabela append-only com triggers de banco. Não é possível "adicionar imutabilidade depois" sem migração de dados e risco de corrupção de histórico. | Design do banco de dados do Settlement Service deve contemplar isso desde o sprint 1. Não é opcional. |
| **PCI DSS — dados de cartão nunca tocam os servidores da StayFlow** | Segurança / Legal | A StayFlow deve usar Stripe Elements/Checkout para manter o escopo PCI no mínimo (SAQ A). Qualquer integração que faça o número de cartão do hóspede trafegar pelos servidores da StayFlow expande o escopo PCI dramaticamente. | O design do frontend de pagamento deve usar Stripe Elements ou Stripe Checkout — sem formulário de pagamento próprio que capture o número do cartão diretamente. |
| **Concierge e Settlement são serviços independentes** | Técnico / Produto | Nenhuma chamada síncrona direta entre os dois serviços. Falha de um não propaga para o outro. Deploy independente. | Cada serviço tem seu próprio repositório (ou módulo), banco e pipeline de deploy. Não pode ser um monólito conjunto. |
| **Webhooks do Stripe validados via HMAC por signing secret** | Segurança | Sem validação de assinatura HMAC no recebimento de webhooks, um atacante pode injetar webhooks falsos de confirmação de pagamento — o sistema marcaria repasses como executados sem que tenham ocorrido. | A implementação do webhook receiver é uma das primeiras peças a serem desenvolvidas e revisadas em code review de segurança. |

---

## Riscos Técnicos e Mitigações

> Os riscos **técnicos** vivem aqui. Riscos de produto/negócio permanecem no RP, Seção 12.

| Risco | Categoria | Probabilidade | Impacto | Mitigação |
|---|---|---|---|---|
| **Migração de PSP sem downtime falha em produção** | Integração / Infra | Média | Alto | Estratégia de migração em modo dual-write: Pagar.me e Stripe coexistem por 1 sprint, com todos os novos repasses no Stripe. Rollback disponível. Testes de ponta-a-ponta obrigatórios em staging com dados reais de teste de cada hotel antes da migração de produção. |
| **Criação de connected accounts Stripe para hotéis falha por dados incompletos** | Integração / Dados | Média | Alto | FinOps deve coletar e validar dados dos hotéis (CNPJ, dados bancários, e-mail) antes da migração. O processo de onboarding de hotéis no Stripe Connect deve ser automatizado no painel FinOps — não manual. Hotéis com conta não criada ficam bloqueados para repasse (ver edge case no RP). |
| **Latência do LLM provider excede 5s em pico (degradação de experiência do Concierge)** | Infra / Externo | Média | Médio | Fallback para Anthropic Claude Haiku com timeout de 5s. Streaming de resposta (SSE) para reduzir a percepção de latência: o texto começa a aparecer antes de estar completo. Monitoramento de latência p95/p99 por provider — alertar se p99 > 7s. |
| **Inconsistência de cálculo de split (bug de arredondamento ou regra)** | Dados / Financeiro | Baixa | Alto | Testes unitários exaustivos no motor de cálculo com casos extremos (percentuais fracionados, IR, reservas com cancelamento parcial). Validação dupla: o sistema calcula E o FinOps valida o primeiro ciclo manualmente antes de remover o check manual. |
| **Rate limit do Stripe API atingido em ciclos grandes** | Infra / Integração | Baixa | Médio | Implementar queue de processamento de repasses com worker pool limitado (ex.: max 50 req/s). Monitorar rate limit headers da API do Stripe e implementar backoff quando próximo do limite. |
| **Falha silenciosa de webhook do Stripe (webhook entregue mas não processado)** | Integração | Baixa | Alto | Idempotência na recepção de webhooks: processar o mesmo evento duas vezes deve ser seguro. Polling de status via API do Stripe como fallback se o webhook não for recebido em X minutos. Fila de dead-letter para eventos de webhook que falharam no processamento. |
| **Base de conhecimento do Concierge desatualizada (resposta incorreta sobre política que mudou)** | Produto / IA | Média | Médio | Processo de atualização da base de conhecimento deve ser operacionalmente simples (painel de gestão). Alertas quando hóspedes reportam resposta incorreta (flag de insatisfação + escalonamento). Revisão quinzenal da base de conhecimento pelos gestores de CS. |
| **Dados sensíveis de reserva expostos em logs do Concierge** | Segurança | Baixa | Alto | Sanitização de logs: CPF, e-mail, número de cartão e dados pessoais sensíveis devem ser mascarados antes de gravação em log. Revisão de segurança obrigatória no módulo de logging antes do go-live. |
| **Inconsistência entre cálculo de IR retido e regra fiscal real** | Compliance | Baixa | Médio | A regra de IR no sistema é configurada manualmente pelo FinOps. O sistema calcula e registra — o FinOps é responsável pela acurácia da alíquota cadastrada. Jurídico revisa as alíquotas antes do go-live. |

---

## Decisões de Arquitetura (ADRs)

> Direção arquitetural no nível do CTO. O breakdown fino e ADRs de implementação pertencem ao Tech Backlog (TB) do Tech Lead.

| # | Decisão | Justificativa | Sign-off do CTO |
|---|---|---|---|
| **ADR-001** | **Stripe Connect como PSP de repasse (em substituição ao Pagar.me)** | Stripe Connect é a única opção avaliada que oferece: split nativo por connected account, idempotency key por transação, webhooks de confirmação por beneficiário, e PCI DSS Level 1 absorvido. O Adyen Marketplace foi considerado mas descartado por documentação inferior para o mercado brasileiro e processo de onboarding mais lento. O Pagar.me permanece para cobrança do hóspede (Fase 1) — unificação adiada para Fase 2. | ✓ |
| **ADR-002** | **Ledger financeiro: tabela append-only com triggers de banco (PostgreSQL)** | O ledger de repasses é um dado financeiro auditável — não pode ter registros editados ou excluídos após inserção. A imutabilidade via trigger de banco (em vez de apenas convenção de código) é mais robusta: impede que um bug de aplicação ou um acidente de operação corrompa o histórico. Ajustes são modelados como lançamentos de crédito/débito com referência ao original (padrão de contabilidade de entrada dupla). | ✓ |
| **ADR-003** | **LLM provider abstrato com camada de interface (OpenAI + fallback Anthropic)** | O acoplamento direto ao provider de LLM cria vendor lock-in e risco de downtime total do Concierge se o provider tiver incidente. A camada de abstração (interface `LLMClient`) permite: (a) fallback automático entre providers, (b) troca de provider sem refatoração do Concierge Service, (c) mock do LLM em testes. GPT-4o-mini é o provider principal por custo-benefício; Claude Haiku como fallback por latência similar e provedor independente. | ✓ |
| **ADR-004** | **Concierge e Settlement como serviços independentes (não um monólito)** | Os dois domínios têm padrões de carga, SLAs e dependências completamente diferentes. O Concierge é síncrono e orientado a usuário (latência importa); o Settlement é assíncrono e batch (throughput importa). Juntá-los num monólito cria acoplamento de deployment, escalabilidade e falha que não tem justificativa técnica. Cada serviço tem seu banco, seu deploy e seus alertas. | ✓ |
| **ADR-005** | **Fila de mensagens para processamento assíncrono do ciclo de repasse (SQS ou equivalente)** | O ciclo de repasse processa N hotéis — se processado sincronamente em uma única requisição HTTP, o timeout da requisição se tornaria um problema (e qualquer falha reiniciaria tudo). Com a fila, cada hotel é uma mensagem independente: processamento paralelo, retentativas por mensagem, dead-letter queue para falhas persistentes. O ciclo de repasse se torna resiliente por design. | ✓ |
| **ADR-006** | **RAG (Retrieval-Augmented Generation) para base de conhecimento do Concierge** | Em vez de incluir toda a base de conhecimento no prompt (caro e com limite de contexto), o Concierge usa RAG: a pergunta do hóspede é usada para recuperar os documentos relevantes da base, que são incluídos no prompt junto com a pergunta. Isso reduz custo por token, permite base de conhecimento grande, e facilita atualização sem retraining. O vetor de embeddings é armazenado em pgvector (extensão do PostgreSQL) para evitar um serviço adicional. | ✓ |

---

## Avaliação de Esforço e Custo (firme)

> Somente uso interno. Estas são as estimativas **firmes** do CTO — substituem a estimativa preliminar do PO (RP Seção 13). Serão refinadas pelo Tech Lead no Tech Backlog. Não são compromisso contratual nem material para cliente.

### Esforço de Desenvolvimento

| Área | Estimativa | Senioridade |
|---|---|---|
| Backend — Concierge Service (LLM, RAG, regras de escalonamento, API de reservas, Zendesk) | 18 dias | Senior |
| Backend — Settlement Service (motor de split, ledger, idempotência, Stripe Connect, ciclo, conciliação) | 22 dias | Senior |
| Backend — Migração de PSP (Pagar.me → Stripe, onboarding de hotéis, testes de ponta a ponta) | 10 dias | Senior |
| Frontend — Widget do Concierge (canal web, responsivo, SSE streaming) | 8 dias | Mid-Senior |
| Frontend — Painel de Gestão (Concierge: regras, CSAT, relatórios) | 6 dias | Mid |
| Frontend — Painel FinOps (ciclo, conciliação, exportação, alertas) | 6 dias | Mid |
| QA — Concierge (funcional, edge cases de IA, segurança de dados, carga) | 6 dias | QA |
| QA — Settlement (idempotência, cálculo de split, edge cases financeiros, carga, segurança HMAC) | 8 dias | QA |
| DevOps / Infra — provisionamento de novos serviços, ledger DB, filas, observabilidade | 5 dias | DevOps |
| **Total** | **89 dias** | |

> **Nota sobre o total:** a estimativa de ~89 dias considera paralelismo de equipe (backend Senior pode trabalhar nos dois serviços em paralelo se forem dois engenheiros). Com uma equipe de 2 Seniors + 1 Mid-Senior + 1 Mid + 1 QA + 1 DevOps, o cronograma real é de **~10 semanas de desenvolvimento** (não 89 dias sequenciais). A estimativa do PO de ~70 dias estava subestimada em ~27%, principalmente pela migração de PSP e pelos testes de idempotência financeira.

### Impacto de Infraestrutura

- Dois novos serviços de backend (Concierge Service + Settlement Service) — requer provisionamento de containers/instâncias, banco de dados separado para ledger, fila de mensagens (SQS ou equivalente).
- pgvector para RAG do Concierge — extensão do PostgreSQL existente ou banco separado.
- Stripe Connect — configuração de conta de plataforma e criação de connected accounts.
- Observabilidade ampliada para dois novos serviços: traces, logs, métricas de negócio, alertas.

### Impacto de Custo com Terceiros

| Item | Estimativa Mensal |
|---|---|
| OpenAI API (GPT-4o-mini, ~500K tokens/dia para o volume de atendimento projetado) | ~R$ 1.200/mês |
| Anthropic Claude Haiku (fallback — uso baixo) | ~R$ 150/mês |
| Stripe Connect (taxa de plataforma: ~0.5% por repasse + ~R$ 0,70 por transferência) | Variável — depende do volume de repasses. Com R$ 200k GMV/mês e 30 hotéis: ~R$ 1.000 + R$ 21 = ~R$ 1.021/mês |
| Observabilidade (Datadog ou Grafana Cloud — se não houver stack existente) | R$ 800–2.000/mês dependendo do volume de logs |

### Impacto de Custo Operacional Recorrente

- Custo de LLM: cresce com o volume de atendimento — monitorar e otimizar prompts para reduzir tokens.
- Custo do Stripe: cresce com o GMV — é um custo de negócio justificado (elimina o risco de erros manuais e o custo de 18h/semana do FinOps).
- Armazenamento do ledger cresce linearmente com o volume de reservas — custo muito baixo (~R$ 0,10/GB/mês no RDS).

### Avaliação de TCO

A implementação cria **dois custos recorrentes novos** (LLM e taxa do Stripe) e elimina o custo de escala de atendimento humano e o risco de penalidades contratuais. O ROI é positivo se:
- O Concierge resolver ≥ 55% dos tickets sem humano → adiamento de 2 contratações (~R$ 19k/mês) por, pelo menos, 6 meses.
- O Settlement eliminar erros de repasse → evitar multas contratuais e rescisões de parceiros.

A base criada (Concierge Service com RAG e Settlement Service com ledger + Stripe Connect) é **reutilizável para fases futuras**: o portal do parceiro (Fase 2) consome o mesmo Settlement Service; o Concierge pode expandir para WhatsApp com mudanças mínimas na camada de canal.

---

## Caminho de Discovery (se incógnita técnica bloqueia)

> Todas as incógnitas técnicas foram resolvidas no Discovery (2026-04-09 a 2026-04-22, registrado no Intake Record). Nenhuma incógnita técnica residual bloqueia o assessment. O TA pode ser assinado.
>
> Incógnita residual de baixo risco: criação de connected accounts para hotéis com dados incompletos. Mitigação via processo operacional (FinOps coleta dados antes da migração) — não requer novo ciclo de Discovery técnico.
