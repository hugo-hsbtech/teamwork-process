# Intake Record — Room Access Control (Controle de Acesso à Sala)

> **Este é o Intake Record — o artefato formal da camada de intake, de autoria do PO.** Ele recebe o [`00 Documento do Submitter`](./00-submitter-brief-access-control.md) (`gateReady = true`), atribui o ID oficial `INT-2026-002` e registra o **primeiro ato do PO: a triagem** — a decisão de roteamento com justificativa rastreável. Ver [`personas/02-po.md` §3 e §6.1](../personas/02-po.md).
>
> **Ele não reescreve a captura do Submitter** — **referencia** o brief 00 e o consolida. O aprofundamento de produto (visão, escopo, regras, métricas) é o **segundo ato** do PO e vive no [`02 Readiness Package`](./02-readiness-package-access-control.md).
>
> **Jornada:** [`00 Documento do Submitter`](./00-submitter-brief-access-control.md) → `01 Intake Record (PO — triagem)` → [`02 Readiness Package (PO)`](./02-readiness-package-access-control.md) → [`03 Technical Assessment (CTO)`](./03-technical-assessment-access-control.md) → [`04 PRD (PO+CTO → PM)`](./04-prd-access-control.md).

## Metadados

| Campo | Valor |
|---|---|
| **ID do Registro** | INT-2026-002 |
| **Versão** | v1 |
| **Documento do Submitter (origem)** | [`00-submitter-brief-access-control.md`](./00-submitter-brief-access-control.md) |
| **Registrado por (Submitter)** | Rafael Souza (Vendas) |
| **Triado por (PO)** | Lucas Mendes (PO) |
| **Data de registro** | 2026-03-15 |
| **Data de triagem** | 2026-03-17 |
| **Status** | Triado — Product Ready (pós-Discovery) |
| **Readiness Package vinculado** | RP-2026-002 |

## Histórico de Revisão

| Versão | Data | Evento | Resumo |
|---|---|---|---|
| v1 | 2026-03-15 | Intake formalizado | Vendas (Rafael Souza) registrou demanda imediatamente após chamada de pré-fechamento com Construtora Ágil. |
| v1 | 2026-03-17 | Triagem concluída | PO (Lucas Mendes) triou. Três incógnitas de integração identificadas. Decisão de caminho: Discovery. |
| v1 | 2026-03-18 | Discovery aberto | PO abriu Discovery Brief. CTO notificado para spikes técnicos (Azure AD, LGPD). Vendas notificado para agendar chamada com o cliente (Jira). |
| v1 | 2026-03-25 | Discovery encerrado | Todas as 3 incógnitas resolvidas dentro do time-box de 7 dias. Demanda retriada como Product Ready. |
| v1 | 2026-03-27 | RP-2026-002 v1 aprovado | PO e CTO submeteram o Readiness Package. PM aprovou na primeira revisão. |

---

## Prontidão recebida do Submitter

> Snapshot herdado do brief 00 no handoff. O PO não recalcula a captura — registra o que recebeu e o que segue *soft*.

| Campo | Valor |
|---|---|
| **Readiness Score no handoff** | 84 % |
| **Requisitos bloqueantes** | Todos resolvidos por disposição honesta (`gateReady`) — Sim |
| **Dispositions em aberto** | 4 premissas a validar · 3 discovery (incógnitas de integração) · 0 delegados |

---

## Demanda consolidada

> Resumo validado pelo PO contra o brief 00. O detalhe completo, com confiança por campo, está no [`00`](./00-submitter-brief-access-control.md).

| Dimensão | Síntese | Confiança herdada |
|---|---|---|
| **Problema** (a dor, não a solução) | A plataforma não oferece controle de entrada, anonimato de participantes nem distinção de papéis dentro de uma sala. Clientes enterprise com equipes mistas (internos + prestadores) não conseguem operar dentro de suas políticas internas de governança de dados. | 92 |
| **Alcance** (quem é impactado) | Scrum Masters (facilitadores), prestadores externos, observadores (PM/executivos) da Construtora Ágil. Pipeline: 2 deals enterprise com requisito similar. | 88 |
| **Impacto de negócio** | R$ 42.000 ARR bloqueado (deal condicionado à funcionalidade). Potencial de R$ 84.000+ adicional via pipeline. Requisito LGPD não negociável para onboarding. | 90 |
| **Urgência** (por que agora) | Compromisso informal de Vendas de 60 dias. Sem a funcionalidade, o deal não fecha e o cliente pode buscar alternativa. | 80 |
| **Prioridade declarada** | Alta | — |

---

## Triagem — decisão de roteamento  ·  *(Ato 1 do PO)*

> PO avaliou todos os critérios antes de concluir a triagem. Ver [`personas/02-po.md` §6.1](../personas/02-po.md).

### Critérios avaliados

| # | Critério | Veredito | Justificativa (rationale) | Base / Fonte |
|---|---|---|---|---|
| 1 | É um problema real (não sintoma isolado)? | Sim | A dor é estrutural: o modelo de acesso aberto da plataforma é incompatível com o perfil de segurança de clientes enterprise com equipes mistas. Não é sintoma — é limitação de produto. | Brief 00, seção Enunciado do Problema |
| 2 | É recorrente / tem volume? | Sim | O requisito surgiu em outros 2 deals enterprise em pipeline no Q1 — sinaliza necessidade de segmento, não caso isolado. | Brief 00, Impacto de Negócio; sinalizações de Vendas |
| 3 | Encaixa na visão do produto? | Sim | A plataforma precisa amadurecer o modelo de acesso para atender o segmento enterprise. Controle de acesso, anonimato e papéis são requisitos naturais de maturidade de produto para uma ferramenta de colaboração corporativa. | Estratégia de produto — PO |
| 4 | Qual o impacto técnico e de negócio? | Alto | R$ 42.000 ARR direto + 2 deals em pipeline. CTO sinalizou impacto arquitetural no modelo de dados de participantes. Três integrações de incógnita identificadas na captura (Azure AD, Jira, LGPD). | Brief 00; sinalização prévia do CTO |
| 5 | Urgência e impacto justificam agora? | Sim | Bloqueador pré-fechamento com prazo informal. Custo de não fazer: perda do deal. No entanto, as incógnitas de integração impedem que a racionalização comece — é necessário Discovery primeiro. | Brief 00, Urgência |

### Decisão de caminho

| Campo | Valor |
|---|---|
| **Decisão** | Discovery (caminho inicial) → Product Ready (após encerramento do Discovery) |
| **Justificativa** | Três incógnitas de integração identificadas na captura impedem a definição de escopo: (1) viabilidade da integração Azure AD OIDC, (2) se a integração Jira é requisito obrigatório, e (3) postura atual de residência de dados para conformidade LGPD. A demanda não pode ser escopada até que essas incógnitas sejam resolvidas. O impacto e a urgência justificam tratar com prioridade máxima no Discovery. |
| **Reversível?** | Sim — Discovery abre porta lateral; se as incógnitas não resolverem dentro do time-box, o PO escala ao CEO. |
| **Submitter notificado** | Sim — 2026-03-17 |

> **Gate da triagem:** todos os critérios avaliados — decisão informada. O Discovery foi aberto com time-box definido; ao encerrar, a demanda foi retriada como Product Ready, abrindo o Ato 2 (racionalização → RP).

---

## Escalada arquitetural ao CTO

**Necessária:** Sim — o impacto arquitetural é múltiplo: (1) mudança no modelo de dados de participantes (novos campos, máquina de estado), (2) filtragem server-side de eventos WebSocket para modo anônimo, (3) integração de group-claim OIDC com Azure AD, e (4) roteamento de residência de dados LGPD (`sa-east-1`). Qualquer um desses pontos individualmente já justificaria a escalada; os quatro juntos tornam o Technical Assessment indispensável.

> O Technical Assessment aconteceu durante o Discovery (spikes técnicos do CTO) e foi formalizado no RP. Ver [`03 Technical Assessment`](./03-technical-assessment-access-control.md) e [`interactions/05-po-to-cto.md`](../interactions/05-po-to-cto.md).

---

## Premissas validadas na triagem

> Quais premissas do brief 00 o PO revisou e o veredito de cada uma.

| Premissa (do brief 00) | Veredito do PO | A validar com |
|---|---|---|
| A Construtora Ágil está disposta e é capaz de registrar a plataforma no Azure AD | Aceita — confirmada na chamada de pré-fechamento | Fernanda Ramos (TI Lead) — checklist de registro no início do projeto |
| A equipe de TI pode completar o registro Azure AD dentro da janela de entrega | A validar — depende da disponibilidade da equipe de TI do cliente | Fernanda Ramos — a confirmar após Discovery técnico |
| A camada de auth existente pode ser estendida para group-claim OIDC sem reescrita | A validar — Discovery técnico do CTO resolverá | CTO (spike técnico Azure AD) |
| Conformidade LGPD pode ser alcançada com roteamento por tenant sem migração da plataforma | A validar — Discovery técnico do CTO resolverá | CTO (revisão de infraestrutura) |
| Integração Jira não é obrigatória para fechar o deal | A validar — chamada com o cliente resolverá | Construtora Ágil via Vendas (chamada agendada) |
| Aliases anônimos são suficientes para compliance sem mascaramento adicional de banco de dados | Aceita provisoriamente — plausível como escopo mínimo | PO + CTO na racionalização |
| Escopo do controle de acesso é por sala, não por conta de organização | Aceita — confirmada na descrição da dor | Brief 00 — sem conflito na triagem |

---

## Constraints reconhecidos

> Constraints que o PM deve considerar desde o primeiro dia.

| Constraint | Tipo | Nota do PO |
|---|---|---|
| Prazo do deal (informal, 60 dias) | Tempo | Nenhuma data pode ser comunicada ao cliente antes da avaliação de capacidade do PM. PO é dono deste gate. |
| Conformidade LGPD (`sa-east-1`) | Legal / Regulatório | Inegociável para este cliente. CTO confirmou necessidade de roteamento condicional (Opção C). Adiciona ~2 semanas ao esforço. |
| Dependência Azure AD (lado do cliente) | Externo | Integração não pode ser concluída sem ação do TI da Construtora Ágil. Prazo parcialmente fora do nosso controle. Spec técnica deve ser entregue ao cliente cedo. |
| Sem SSO enterprise completo | Escopo | Apenas validação de group-claim OIDC neste release. SSO/SAML é item separado do roadmap. |
| Compatibilidade retroativa com salas existentes | Técnico | Controle de acesso é opt-in por sala. Salas abertas existentes não devem ser afetadas. CTO confirmou viabilidade. |
| Sem novos provedores de auth externos | Orçamento | Apenas extensão da camada de auth existente. Nenhum novo provedor (Okta, Auth0, etc.) pode ser contratado. |

---

## Discovery Brief

> Preenchido porque a decisão de caminho inicial foi **Discovery**. Encerrado em 2026-03-25.

### O que estava faltando

| # | Incógnita | Quem pode responder | Método |
|---|---|---|---|
| 1 | Integração Azure AD: SSO completo vs. validação de group-claim OIDC vs. sincronização via webhook | CTO | Spike técnico (2–3 dias máx.) |
| 2 | Integração Jira: requisito obrigatório ou desejável para fechar o deal | Construtora Ágil (via Vendas) | Chamada com cliente — Vendas agenda em 3 dias |
| 3 | Residência de dados LGPD: postura atual dos registros de sessão de participantes | CTO | Revisão de infraestrutura (1 dia) |

**Time-box do Discovery:** 7 dias (2026-03-18 → 2026-03-25) — dentro do time-box de 2 semanas.

---

### Log do Discovery

#### 2026-03-18 — PO abre o Discovery

Demanda movida para Discovery. Três incógnitas registradas. PO notificou Rafael Souza (Vendas) para agendar chamada de follow-up com a TI Lead da Construtora Ágil para esclarecer o requisito Jira. CTO Rodrigo Lima notificado para spikes técnicos sobre Azure AD e residência de dados.

---

#### 2026-03-20 — Spike Técnico do CTO: Azure AD

**Finding:** Integração Azure AD via OIDC é viável usando a camada de auth existente (que já suporta OAuth2). Implementação SSO completa não é necessária. A plataforma pode solicitar o claim `groups` no login e mapear grupos AD para papéis da plataforma no momento de entrada na sessão.

**Estimativa de esforço:** 4–6 dias (extensão do auth backend + lógica de mapeamento de papéis).

**Dependência do cliente:** A Construtora Ágil deve fornecer o ID do tenant Azure AD e registrar a plataforma como aplicação permitida no portal Azure. Esta é uma ação do lado do cliente — o prazo depende da equipe de TI deles.

**Recomendação do CTO:** Viável e sem necessidade de nova infraestrutura. Introduz novo fluxo de auth que afeta o modelo de participantes — escalada arquitetural se mantém.

---

#### 2026-03-21 — Revisão de Infraestrutura do CTO: Residência de Dados LGPD

**Finding:** A plataforma usa cluster primário em `us-east-1`. Registros de participantes de sessão (nomes, emails, metadados) estão armazenados neste cluster. Sem replicação para `sa-east-1`.

**Implicação LGPD:** Dados de identidade de participantes de clientes brasileiros estão fora do Brasil. Entregar a funcionalidade à Construtora Ágil sem tratar isso expõe a empresa a risco LGPD.

**Opções identificadas pelo CTO:**

| Opção | Descrição | Esforço | Risco |
|---|---|---|---|
| A | Migrar tabela de participantes para `sa-east-1` para todos os tenants | Alto (3–4 semanas) | Interrompe todos os clientes |
| B | Roteamento de residência de dados por tenant (dados armazenados na região declarada do tenant) | Muito alto (6–8 semanas) | Mudança de plataforma, nova complexidade |
| C | Armazenar dados de sessão de participantes em `sa-east-1` apenas para clientes com flag LGPD | Médio (~2 semanas) | Adiciona lógica de roteamento condicional, mas escopada |

**Recomendação do CTO:** Opção C para este release. Opções A e B são decisões estratégicas de plataforma que requerem alinhamento com o CEO.

**Nota do PO:** A Opção C adiciona ~2 semanas ao esforço total. Deve ser considerado na avaliação de capacidade do PM e comunicado a Vendas antes de qualquer compromisso com o cliente.

---

#### 2026-03-22 — Chamada com o Cliente: Requisito de Integração Jira

**Participantes:** Rafael Souza (Vendas), Ana Costa (CS), Fernanda Ramos (TI Lead — Construtora Ágil)

**Finding:** Integração Jira **não é requisito obrigatório** para fechar o deal. Fernanda confirmou que atribuição de votantes e observadores via mapeamento de grupos Azure AD é aceitável para a Fase 1. Pré-população baseada em Jira é um desejo futuro, não um bloqueador.

**Impacto no escopo:** Integração Jira removida desta demanda. Registrada como item de backlog separado: `BACKLOG-2026-007 — Integração Jira Sprint para Pré-população de Sala`.

---

### Resultado do Discovery

**Todas as três incógnitas resolvidas.**

| # | Incógnita | Resolução | Impacto no escopo |
|---|---|---|---|
| 1 | Integração Azure AD / OIDC | Viável via group-claim OIDC. 4–6 dias de esforço. Cliente deve registrar app no portal Azure. | Adicionado ao escopo |
| 2 | Integração Jira | Não obrigatório para fechar o deal. Movido para backlog. | Removido do escopo |
| 3 | Residência de dados LGPD | Não conforme atualmente. Opção C: flag LGPD por cliente com roteamento `sa-east-1`. ~2 semanas de esforço. | Adicionado ao escopo |

**Novo caminho de decisão:** Discovery → **Product Ready**

**Complexidade revisada:** Significativamente maior do que estimada no intake. O Readiness Package deve refletir o trabalho de integração Azure AD e residência de dados LGPD. O esforço total revisado foi de 25 dias (conforme Technical Assessment — TA-2026-002).

**Discovery encerrado:** 2026-03-25 (7 dias — dentro do time-box de 2 semanas ✓)

---

## Handoff

- `Product Ready` (pós-Discovery): PO iniciou a **racionalização** → [`02 Readiness Package`](./02-readiness-package-access-control.md).
- Technical Assessment formalizado em paralelo → [`03 Technical Assessment`](./03-technical-assessment-access-control.md).
- PRD produzido pela fusão → [`04 PRD`](./04-prd-access-control.md) — entregue ao PM.
