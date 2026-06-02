# Intake Record — Queue Voting (Fila de Votação)

> **Este é o Intake Record — o artefato formal da camada de intake, de autoria do PO.** Ele recebe o [`00 Documento do Submitter`](./00-submitter-brief-queue-voting.md) (`gateReady = true`), atribui o ID oficial `INT-2026-001` e registra o **primeiro ato do PO: a triagem** — a decisão de roteamento (Product Ready / Discovery / Backlog / Rejeitar) com justificativa rastreável. Ver [`personas/02-po.md` §3 e §6.1](../personas/02-po.md).
>
> **Ele não reescreve a captura do Submitter** — **referencia** o brief 00 e o consolida. O aprofundamento de produto (visão, escopo, regras, métricas) é o **segundo ato** do PO e vive no [`02 Readiness Package`](./02-readiness-package-queue-voting.md).
>
> **Jornada:** [`00 Documento do Submitter`](./00-submitter-brief-queue-voting.md) → `01 Intake Record (PO — triagem)` → [`02 Readiness Package (PO)`](./02-readiness-package-queue-voting.md) → `03 Technical Assessment — não requisitado` → [`04 PRD (PO+CTO → PM)`](./04-prd-queue-voting.md).

## Metadados

| Campo | Valor |
|---|---|
| **ID do Registro** | INT-2026-001 |
| **Versão** | v1 |
| **Documento do Submitter (origem)** | [`00-submitter-brief-queue-voting.md`](./00-submitter-brief-queue-voting.md) |
| **Registrado por (Submitter)** | Ana Costa (Customer Success) |
| **Triado por (PO)** | Lucas Mendes (PO) |
| **Data de registro** | 2026-03-12 |
| **Data de triagem** | 2026-03-13 |
| **Status** | Triado — Product Ready |
| **Readiness Package vinculado** | RP-2026-001 |

## Histórico de Revisão

| Versão | Data | Evento | Resumo |
|---|---|---|---|
| v1 | 2026-03-12 | Intake formalizado | CS (Ana Costa) entregou o brief 00 com `gateReady = true` após chamada trimestral de revisão com Banco Meridional. PO recebeu e iniciou triagem. |
| v1 | 2026-03-13 | Triagem concluída | Lucas Mendes triou como Product Ready. Escalada arquitetural não necessária. Racionalização iniciada. |

---

## Prontidão recebida do Submitter

> Snapshot herdado do brief 00 no handoff. O PO não recalcula a captura — registra o que recebeu e o que segue *soft*.

| Campo | Valor |
|---|---|
| **Readiness Score no handoff** | 87 % |
| **Requisitos bloqueantes** | Todos resolvidos por disposição honesta (`gateReady`) — Sim |
| **Dispositions em aberto** | 3 premissas a validar (infraestrutura WebSocket, migração de schema, autonomia de adoção do cliente) · 0 discovery · 0 delegados |

---

## Demanda consolidada

> Resumo de uma tela, validado pelo PO contra o brief 00 (não é re-digitação — é a leitura do PO). O detalhe completo, com confiança por campo, está no [`00-submitter-brief-queue-voting.md`](./00-submitter-brief-queue-voting.md).

| Dimensão | Síntese | Confiança herdada |
|---|---|---|
| **Problema** (a dor, não a solução) | Facilitadores do Banco Meridional não conseguem controlar a sequência de exposição de histórias nem ocultar votos durante cerimônias de planning. Todos os participantes veem o backlog completo e os votos em tempo real, gerando viés de ancoragem e perda de cadência. O workaround manual (chat história a história) custa 15–20 min por cerimônia. | 92 |
| **Alcance** (quem é impactado) | Scrum Masters e desenvolvedores do Banco Meridional (4 squads ativos, 3 squads bloqueados de adotar a plataforma por esta lacuna). | 88 |
| **Impacto de negócio** | R$ 84k ARR em risco de renovação (90 dias); R$ 28k ARR de expansão bloqueada; lacuna competitiva confirmada contra 2 ferramentas rivais. | 80 |
| **Urgência** (por que agora) | Renovação em ~90 dias. A funcionalidade precisa estar em produção antes da conversa de renovação. Custo de não entregar: perda ou redução do contrato — cliente tem alternativas. | 90 |
| **Prioridade declarada** | Alta | — |

---

## Triagem — decisão de roteamento  ·  *(Ato 1 do PO)*

> O PO avalia cada critério (todos avaliados = pode concluir a triagem) e então toma **uma** decisão de caminho, com justificativa obrigatória. Ver [`personas/02-po.md` §6.1](../personas/02-po.md).

### Critérios avaliados

| # | Critério | Veredito | Justificativa (rationale) | Base / Fonte |
|---|---|---|---|---|
| 1 | É um problema real (não sintoma isolado)? | Sim | A dor foi relatada espontaneamente pelos Scrum Masters na chamada de renovação, não como solicitação de feature. É a causa raiz do workaround de 15–20 min e do risco de ancoragem — não apenas um sintoma. | Brief 00 — Enunciado do Problema |
| 2 | É recorrente / tem volume? | Sim | CS registra que outros 3 clientes enterprise relataram dor similar de forma informal. O padrão aparece sempre que um facilitador tem 10+ itens em uma sessão. | Brief 00 — Evidências; notas informais de CS |
| 3 | Encaixa na visão do produto? | Sim | A plataforma tem roadmap explícito de fortalecer o controle do facilitador e a qualidade das cerimônias. Esta funcionalidade é extensão natural da mecânica de sessão existente — não diverge da direção do produto. | Roadmap interno (PO) |
| 4 | Qual o impacto técnico e de negócio? | Alto (negócio) · Baixo (técnico) | Negócio: R$ 112k ARR combinado (retenção + expansão) + lacuna competitiva. Técnico: extensão de UI e estado de sessão — sem nova infraestrutura, sem impacto arquitetural de plataforma. | Brief 00 — Impacto de Negócio; avaliação inicial do PO |
| 5 | Urgência e impacto justificam agora? | Sim | Prazo de renovação de 90 dias é janela não-negociável. Com estimativa de ~14 dias de desenvolvimento, há margem. O custo de não agir é concreto e imediato. | Brief 00 — Urgência + Constraints |

### Decisão de caminho

| Campo | Valor |
|---|---|
| **Decisão** | Product Ready |
| **Justificativa** | Todos os critérios satisfeitos. Problema real e recorrente, alinhado com a visão do produto, impacto financeiro significativo, prazo concreto. Sem incógnitas que exijam Discovery — as premissas técnicas são razoáveis e serão validadas durante a racionalização. Escopo delimitado e não requer avaliação arquitetural pelo CTO. |
| **Reversível?** | Sim — se uma premissa técnica se provar falsa durante a racionalização, a demanda pode ser retriada |
| **Submitter notificado** | Sim — 2026-03-13 |

> **Gate da triagem:** todos os critérios avaliados e a decisão é **informada**. `Product Ready` abre o Ato 2 (racionalização → RP).

---

## Escalada arquitetural ao CTO

**Necessária:** Não — a demanda envolve extensão de UI e estado de sessão dentro da infraestrutura existente. Nenhuma mudança arquitetural de plataforma identificada. Sem impacto em modelo de dados de multi-tenancy, autenticação, camadas de integração externas ou runtime de IA. As premissas sobre WebSocket e persistência de sessão serão validadas pelo Tech Lead durante o breakdown técnico.

---

## Premissas validadas na triagem

> Quais premissas do brief 00 o PO revisou e o veredito de cada uma. Premissas que sobrevivem viajam adiante explicitamente.

| Premissa (do brief 00) | Veredito do PO | A validar com |
|---|---|---|
| Infraestrutura WebSocket suporta novos tipos de evento sem novo broker | Aceita — razoável com base no conhecimento do sistema. Não é bloqueador de triagem. | Tech Lead durante breakdown técnico |
| Persistência de sessão extensível sem migração completa de schema | Aceita — sem red flags. Pode implicar migração incremental, não completa. | Tech Lead durante breakdown técnico |
| Scrum Masters do Banco Meridional têm autonomia de adoção sem aprovação de TI | Aceita — cliente enterprise padrão. A validar com CS antes da entrega. | Ana Costa (CS) |
| Co-facilitação fora do escopo — facilitador único suficiente para este release | Aceita — alinhado com o briefing do cliente. Arquitetura não deve bloquear evolução futura. | — (confirmada pelo cliente na chamada) |
| Ticket por squad dos 3 squads pendentes equivale ao dos 4 ativos | Aceita como premissa de estimativa. Não afeta a decisão de roteamento. | Finance / CS antes do RP |

---

## Constraints reconhecidos

> Constraints que o PM deve considerar desde o primeiro dia (herdados do brief, validados aqui).

| Constraint | Tipo | Nota do PO |
|---|---|---|
| Prazo de renovação (~90 dias a partir de 2026-03-12) | Tempo | Constraint vinculante. PM deve avaliar capacidade da equipe na abertura do planejamento. Se o esforço real superar a margem disponível, o escopo do MVP deve ser cortado — o prazo não se move. |
| Sem redesign mobile | Escopo | Layout mobile existente se aplica. Não escalar para redesign neste release. |
| Modelo de facilitador único | Escopo | Co-facilitação fora do escopo. Arquitetura deve permitir evolução futura sem retrabalho. |
| Deploy sem downtime | Técnico | Padrão operacional da plataforma. Confirmado como obrigatório para este release. |
| Sem novos serviços externos | Orçamento | Construção dentro da infraestrutura existente. Nenhum procurement necessário. |

---

## Handoff

**Decisão: `Product Ready`** — o PO inicia a **racionalização** → [`02 Readiness Package — RP-2026-001`](./02-readiness-package-queue-voting.md).

As 3 premissas técnicas abertas viajam explicitamente para o RP, onde serão confrontadas com o conhecimento do sistema durante a racionalização. O prazo de renovação é o dado mais urgente a transmitir ao PM no momento do handoff do PRD.
