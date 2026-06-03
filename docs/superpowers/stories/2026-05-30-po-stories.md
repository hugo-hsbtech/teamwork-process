# PO Journey Stories

> **Status:** v1 · **Date:** 2026-05-30 · **Author:** hugo (+ Claude)
> **Companion to:** [`specs/2026-05-30-po-figma-prototype-design.md`](../specs/2026-05-30-po-figma-prototype-design.md) (the WHAT) and [`plans/2026-05-30-po-figma-prototype.md`](../plans/2026-05-30-po-figma-prototype.md) (the HOW it is built).
> **Conceptual ground truth:** [`personas/03-po.md`](../../../personas/03-po.md). **Engine inherited from:** [`personas/01-submitter.md`](../../../personas/01-submitter.md).

## Purpose

The spec describes the design contract; the plan tracks build tasks. **Neither tells the journey stories.** This doc fills that gap for the PO: each story is a single user intent, told as a narrative arc with the screens that materialize it. It mirrors the Submitter stories doc one-to-one in form, instantiated for the **translation layer**.

The PO's whole experience turns on one principle: **decision is first-class** — the exact analog of the Submitter's confidence layer. Where the Submitter *captures* a pain honestly, the PO *decides* — first the demand's path (triage), then the product's form (rationalization). Every passage of a demand through the PO is a decision, justified and traceable.

## Reading the canvas

Laid out in **horizontal lanes** (Story 0 + A→M + Z), same convention as the Submitter canvas. Each lane has a big letter at the left; screens stacked left → right by narrative beat. Alt-variants and rails sit on a row below the main row. Lane Z holds reusable patterns. Lanes that start mid-flow have a text arrow pointing to the lane they depend on. Frame IDs use the **`P`** prefix (PO) to stay separate from the Submitter's `J` frames.

## Seed scenario (used across every story)

**PO:** Marina Costa · Product Owner · accent laranja.
**Demand:** `DEM-2026-001` — *"Gateway de Pagamento Recorrente"* (de Carlos Silva, COO).
**Why it matters:** Cobrança por boleto gera ~30h/mês de reconciliação manual e inadimplência de 18%. Crítica · SLA 21h restantes · custo de atraso **R$ 2,6k/dia** · impacto **R$ 78k/ano**.
**Cast:** CTO Rafael Lima · PM Juliana Reis · Submitter Carlos Silva (COO) · Viewer Ana Santos (CFO).
**Portfolio stake:** **9 RPs congelados/mês**, **89%** aceitos na 1ª versão pela PM (era 64%).

---

## Story 0 · Intro · Auth

**Intent:** Entrar no produto como PO.

Marina abre o produto. A mesma porta de entrada do Submitter, mas o que vem depois aponta pra dentro — pra engenharia. Ela faz login.

**Beats:**
1. **P1.1 · Sign in** — reaproveita a chrome do Submitter (Tide mark · SSO · "em uso por times de Produto e Engenharia").

---

## Story A · Painel do PO

**Intent:** Ter a visão de portfólio antes de mergulhar em qualquer demanda — o PO trabalha a fila, não uma demanda.

Marina cai no **Painel do PO**. Diferente do Submitter (cujo número-rei é impacto financeiro), o número-rei dela é **throughput de RPs congelados (9 este mês)** — o contexto executável que ela produz. Acima dele, o `AIImpactBanner` mostra quanto a IA adiantou (168h YTD · triagem 6min vs 45min). Abaixo, o grid de `CompactKPI` orbita: custo de atraso evitado (R$ 47k/mês), **aceite na 1ª versão (89%, +25pp vs 64%)** — o espelho dela sobre si mesma —, tempo médio em racionalização (2,4d, −1,8d com IA), e o contra-indicador honesto (PRDs devolvidos pela PM, 11%).

**Beats (main row):**
1. **P1.2 · Painel do PO** — Header "Bom dia, Marina · 4 em triagem · 4 em racionalização" · AIImpactBanner (po-portfolio) · HeroMetric "9 RPs congelados" + sparkline · CompactKPI 3×2 · Showcase RP-2026-000 · Demandas recentes.

**Alt-below:**
- **P1.3 · Painel vazio** — HeroMetric em "—" · helper "Triage sua primeira demanda para começar a produzir RPs" · CTA central "Ir para triagem".

---

## Story B · Triagem · decidir o caminho

**Intent:** Pegar uma demanda crua da fila e decidir, com justificativa, por qual caminho ela segue.

Este é o **Ato 1** — uma decisão de **roteamento**: rápida, pontuável, descartável. Marina abre a **Fila de Triagem** e vê 4 demandas ordenadas por prioridade e SLA. DEM-2026-001 está no topo: Crítica, **21h restantes**, **R$ 2,6k/dia** de custo de atraso — os sinais que dizem "decide isto primeiro". Ela abre o detalhe (tela cheia). A IA **já pré-avaliou os 5 critérios** com sugestão + confiança, cada um rastreável ao Intake Record do Submitter. O trabalho de Marina não é digitar — é **decidir**: para cada critério ela confirma ou ajusta o veredito e escreve a justificativa (obrigatória). O `TriageScoreMeter` sobe a cada decisão. Em 100% (todo critério avaliado — o gate não força um veredito, força uma decisão *informada*), o `PathDecisionPicker` libera. A IA recomenda **Product Ready**; Marina concorda, justifica, confirma. Esse veredito é um **filtro de esforço** — *vale racionalizar esta demanda agora* —, não um carimbo de "pronta": o fim do Ato 2 (o RP congelado) é o **commitment point**, e a prontidão de verdade (a Definition of Ready, *Ready for Development*) só nasce downstream. A demanda vira "Em Racionalização" e abre o Ato 2.

**Beats (main row):**
1. **P2.1 · Fila de Triagem** — 4 `TriageQueueCard`s (Crítica→Baixa) · SLAChip + DelayCostChip visíveis · clica DEM-2026-001.
2. **P2.2 · Triagem — detalhe** — tela cheia · Intake Record read-only (com fontes) · AIImpactBanner (po-triage) · 5 `TriageCriterionRow`s pré-avaliados · isPath com `PathDecisionPicker` (desabilitado até 100%).
3. **P2.3 · Critério decidido** — uma `DecisionCard` vai de undecided→decided · TriageScoreMeter 20%.
4. **P2.4 · Score 100%** — 5 decididos · PathDecisionPicker liberado.
5. **P2.5 · Product Ready (confirma)** — `DecisionCard kind=path` (rationale "Vale o esforço: contexto suficiente para investir, sem incógnitas que travem o início; premissas tratáveis em Discovery", basis=Intake Record) → demanda "Em Racionalização" → cai em P3.1.

---

## Story C · Os outros três caminhos

**Intent:** Mostrar que a triagem tem quatro portas — só uma abre a racionalização; as outras encerram a passagem pelo PO naquele momento.

A decisão de caminho é um **filtro de esforço**: para onde vale concentrar energia agora. Só `Product Ready` abre o Ato 2 — e mesmo ela não declara a demanda "pronta" (o congelamento do RP é o *commitment point*; a Definition of Ready / *Ready for Development* é downstream). As outras três encerram a passagem pelo PO neste momento. **Discovery** (investigar antes de racionalizar — time-box de 2 semanas) e **Backlog** (boa demanda, não é prioridade agora) saem por portas laterais recuperáveis. **Rejeitar** (fora da estratégia ou baixo valor) fecha a porta — com justificativa obrigatória, e o Submitter é notificado. Cada uma é uma `DecisionCard kind=path` defensável.

**Beats (main row):**
1. **P2.6 · Discovery** — modal de time-box ("Investigar até: 13 jun") · demanda → "Em Discovery" (lateral, recuperável).
2. **P2.7 · Backlog** — demanda → "Backlog (Opportunity)" (lateral, recuperável).
3. **P2.8 · Rejeitar** — modal de justificativa obrigatória · demanda → "Rejeitada" (fecha) · Submitter notificado.

---

## Story D · Racionalização · o WOW da IA

**Intent:** Abrir a demanda Product Ready e descobrir que o RP **já está pré-redigido** — o trabalho vira julgamento, não digitação.

Este é o **Ato 2** — uma decisão de **construção**: profunda, acumulativa. Marina entra no **Canvas de Racionalização** (tela cheia) e o medo do README — "PO vira anotador de reunião" — não acontece: a IA **já leu o Intake Record e a triagem e redigiu 9 de 14 seções**. À esquerda, a conversa abre com "Já redigi 9 de 14 seções a partir do PDF e da triagem. Comecei pelo Escopo — confira o que marquei como fora." No centro, as `RPSectionCard`s estão agrupadas por urgência de congelamento: **"Bloqueiam congelamento · 7"** (seções vazias/baixa confiança), o `SemanticReflectionCard` ancorando o significado ("risco operacional + financeiro, não pedido de feature"), **"Em discovery / premissa · 1"** (a premissa dos 40% opt-in, com time-box), e **"Resolvidas · 3"** (colapsado). Cada seção mostra origem (`ai_drafted`/`inherited`), confiança contra a rubrica `satisfiedWhen`, e é rastreável à fonte. À direita, as fontes e o `TechAssessmentRefCard` (ainda `not_requested`). No rodapé, a `FreezeToolbar` explica por que ainda não dá pra congelar.

**Beats (main row):**
1. **P3.1 · Canvas de Racionalização** — RPReadinessRing 25% · AIImpactBanner (po-rationalization: "RP pré-redigido · 9 de 14 seções · 3 ADRs reaproveitados") · três zonas · FreezeToolbar pendente (N=7).
2. **P3.5 · Contrato do RP (commitment point)** — especificação das 14 seções agrupadas + a linha-ponte do Technical Assessment · seção 7 com exemplo Given/When/Then · seção 8 com checklist NFR (ISO/IEC 25010) · seção 10 com tabela primária·secundária·guardrail.

**Alt-below:**
- **P3.2 · Estados da RPSectionCard** — empty · ai_drafted · editing · low_confidence · resolved · discovery.

---

## Story E · Resolver uma seção

**Intent:** Exercer julgamento sobre uma seção pré-redigida — revisar, editar, justificar — e vê-la migrar para resolvida.

Marina ataca a seção **Escopo (IN/OUT)**, que está vazia (bloqueia). Ela usa o composer/chat pra refinar com a IA ("o que NÃO entra?"), edita o conteúdo, e registra a `DecisionCard kind=section` com a justificativa. A seção migra do grupo "Bloqueiam congelamento" para "Resolvidas"; a contagem cai de 7 para 6; o `RPReadinessRing` sobe com um delta. É o mesmo motor da Submitter (requisito fixo → entrada graduada → score derivado), instanciado para decisões de produto.

**Beats (main row):**
1. **P3.3 · Seção resolvida** — Escopo IN/OUT editado + justificado · card migra blocking→resolvidas · contagem 7→6 · RPReadinessRing delta.

---

## Story F · "Ainda não dá pra decidir"

**Intent:** Tratar uma incógnita de produto sem travar o fluxo — incerteza é uma disposição estruturada, não paralisia.

Assim como o "não sei" do Submitter nunca bloqueia, a incerteza de Marina nunca trava. A premissa dos **40% de opt-in** precisa ser validada com CS antes do congelamento. Em vez de chutar, Marina marca a seção como **`discovery`** (com time-box) — conta como *resolvido-como-incógnita*. Outras seções podem ser `inherited` (vêm prontas do intake, com source) ou `ai_drafted` (a IA redigiu, ela confirma). O gate não é "Marina sabe tudo" — é "toda seção bloqueante tem uma disposição honesta". Note que **não há `escalated`**: escalar ao CTO não é uma seção que outro preenche dentro do RP — é uma dependência de outro artefato (Story G).

**Beats (main row):**
1. **P3.4 · Disposição honesta** — RPDispositionPicker → frames: `discovery` (time-box "validar 40% com CS até 13 jun") · `inherited` (do intake + source) · `ai_drafted` (confirmar).

---

## Story G · Escalar ao CTO · Avaliação Técnica

**Intent:** Quando a demanda toca infra/PCI/IA, pedir uma avaliação técnica ao CTO — sem entregar seções vazias pra ele preencher.

DEM-2026-001 toca PCI, Stripe e webhooks. Marina **escala ao CTO**: entrega o **RP** (a visão de produto) + perguntas específicas. O CTO **não edita o RP** — ele produz um **artefato próprio, a Avaliação Técnica**, com viabilidade, constraints, sistemas afetados, riscos técnicos e ADRs (incluindo dois reaproveitados da base de conhecimento — a alavanca de velocidade). No canvas de Marina, o `TechAssessmentRefCard` evolui `requested → in_progress → signed` (veredito "viável-com-ressalvas", esforço firme 34 dias úteis). Se o CTO **vetar** a viabilidade, Marina revisa o escopo do RP — mas o CTO nunca redefine o produto. É a correção estrutural do projeto, em dados: o RP *referencia* a avaliação, não a absorve.

**Beats (main row):**
1. **P4.1 · Escalar ao CTO (modal)** — entrega o RP + perguntas (PCI/Stripe/webhooks) · helper "o CTO produz uma Avaliação Técnica separada".
2. **P4.2 · TechAssessmentRef** — `requested` → `in_progress` → `signed` (veredito + link).
3. **P4.3 · Avaliação Técnica (CTO)** — artefato do Rafael Lima: viabilidade, 4 `ADRSuggestionCard`s (ADR-100..103, 2 reaproveitados), esforço 34 dias, PCI/LGPD · caption "referenciado pelo RP, fundido no PRD · NÃO faz parte do RP".

**Alt-below:**
- **P4.2 · TechAssessmentRef vetoed** — callout de revisão de escopo (CTO vetou viabilidade → Marina ajusta o RP).

---

## Story H · Congelar o RP

**Intent:** O RP está pronto para congelar — cruzar o **commitment point** (não a DoR, que é downstream).

Todas as seções bloqueantes têm disposição honesta, e o Technical Assessment voltou assinado. O `RPReadinessRing` chega em freezeReady e a `FreezeToolbar` muda de "Faltam N seções…" para "Pronto para congelar — todas as seções bloqueantes têm disposição honesta e o Technical Assessment voltou assinado." Marina clica **Congelar RP** → modal de consequências (o RP vira imutável e cruza o **commitment point**; funde-se no PRD que segue ao PM; **aqui termina o arco do PO** — a Definition of Ready e a escrita de épicos/histórias acontecem downstream). Confirma. O RP-2026-001 está congelado — o **commitment point** do Upstream Kanban e o *gate deliverable* do Stage-Gate virados número.

**Beats (main row):**
1. **P5.1 · Congelar RP (modal)** — freezeReady=true · consequências explicadas · Confirmar.

---

## Story I · A costura do PRD · handoff à PM

**Intent:** Fundir o RP (PO) com a Avaliação Técnica (CTO) num PRD e entregar à PM — a autoria de cada metade fica visível.

O entregável que abre o downstream **não é o RP** — é o **PRD**. Marina vê a **costura**: à esquerda o RP (autoria dela, PO), à direita a Avaliação Técnica (autoria do Rafael, CTO), unidos sob o cabeçalho `PRD-2026-001` por uma costura central visível. Cada metade com seu autor claro, sem que uma escreva sobre a outra. Ela entrega o **PRD** à PM (Juliana Reis). A partir daqui Marina não conduz mais a demanda no dia a dia — mas continua dona do Backlog de Oportunidades e do ponto onde o feedback loop fecha.

**Beats (main row):**
1. **P5.2 · PRD (costura)** — tela cheia · `PRD-2026-001` · RP (Marina/PO) | Avaliação Técnica (Rafael/CTO) · costura central · AIImpactBanner (po-prd: "cada afirmação rastreável").
2. **P5.3 · Handoff do PRD à PM (modal)** — entrega o PRD a Juliana Reis · notificar · sucesso.

---

## Story J · Pós-handoff · devolução e aceite

**Intent:** O que o PO vê depois de entregar — a PM aceita, ou devolve com gaps específicos.

A PM tem **autoridade explícita para rejeitar** e devolver com gaps específicos. Quatro destinos: **Enviado** (PM recebeu, está validando) → **Devolvido** (PM apontou "Falta cenário de fallback nos critérios de aceite") → **Aceito** (abre execução). Quando devolvido, Marina **trata só os gaps** e incrementa a versão (v1.1) — o gap é roteado pra ela ou pro CTO conforme a natureza. O contra-indicador do dashboard (PRDs devolvidos, 11%) é exatamente este loop, medido.

**Beats (main row):**
1. **P6.1 · Enviado ao PM** — banner tide "aguardando aceite da PM".
2. **P6.2 · Devolvido pela PM** — banner amber "Falta cenário de fallback nos critérios de aceite" + CTA "Tratar gaps".
3. **P6.3 · Tratar gaps + nova versão** — só a seção do gap editável · v1.1 · gap roteado a PO/CTO.
4. **P6.4 · Aceito pela PM** — banner emerald · PRD abre execução.

---

## Story K · Capacidade e feedback loop

**Intent:** Receber de volta a PM em dois momentos — escalada de capacidade e fechamento do loop.

O PO **recebe de volta** a PM além da devolução: quando a PM sinaliza **escalada de capacidade** (não cabe no trimestre), Marina re-sequencia o portfólio; e quando a entrega gera **feedback**, o loop fecha de volta no Backlog de Oportunidades pra atualizar prioridades. É o que mantém o PO como dono da visão de produto mesmo depois do handoff.

**Beats (main row):**
1. **P6.5 · Escalada de capacidade (da PM)** — PO re-sequencia a fila.
2. **P6.6 · Feedback loop fechado** — outcome → atualização de prioridade no Product Backlog.

---

## Story L · Sequenciar o portfólio

**Intent:** Decidir a ordem da fila — a tensão produtiva do PO é *entre* demandas, não dentro de uma.

Diferente do Submitter (cujo espelho RICE-lite afia *uma* demanda), o espelho do PO é a fila inteira. Os `SequencingTensionCallout`s provocam: **custo de atraso alto + esforço alto** → "Caro de esperar e caro de fazer — esta é a próxima, ou fatiar?"; **SLA estourando + impacto baixo** → "Vai furar o SLA, mas vale o esforço, ou é Backlog honesto?"; **demanda nova muito parecida com RP recente** → "Já racionalizamos algo assim — reusar o contexto?". Cada provocação que afia o sequenciamento melhora o throughput.

**Beats (main row):**
1. **P7.1 · Sequenciamento** — a fila com `SequencingTensionCallout`s ativos · custo de atraso + SLA + esforço + reuso como sinais.

---

## Story M · Visibilidade cross-demanda

**Intent:** O que o PO olha fora de uma demanda específica — portfólio, notificações, atividade, pendências.

Surfaces reaproveitadas do Submitter, com copy de PO:

- **Painel** (Story A) — o número-rei do throughput + KPIs pay-justifying.
- **Notificações** — TopBar bell · PM perguntou, RP congelado, CTO assinou avaliação.
- **Atividade** — log cross-demand: "PM devolveu PRD-2026-002" · "CTO assinou avaliação de DEM-2026-001" · "RP-2026-008 aceito na 1ª versão".
- **Pendências** — visão cross-demand do que bloqueia o PO (seções sem disposição, avaliações técnicas pendentes), agrupadas por demanda + SLA.

**Beats (main row):**
1. **P7.2 · Notificações** — dropdown + tela "ver todas".
2. **P7.3 · Chat global sobre o Painel** — GlobalChatSheet aberto sobre P1.2.
3. **P7.4 · Atividade / Pendências cross-demand** — feed + lista priorizada por SLA.

---

## Lane Z · Reusable patterns

**Intent:** Patterns referenciados por múltiplas stories, mantidos centralizados.

**Beats:**
1. **DecisionCard (universal · defensabilidade)** — `verdict · rationale · basis · source · reversible`. Usado por: triagem (cada critério, lane B), caminho (lane B/C), seção do RP (lanes E/F). É a camada de primeira classe do PO — análoga ao ConfidenceBar do Submitter.
2. **Reason modal (universal · transition why)** — reaproveitado do Submitter; especializado em Rejeitar (lane C) e Devolver-gaps (lane J).

---

## Master gaps surfaced (carry forward)

Carrega adiante os gaps já registrados pela Submitter (Button leadingIcon como INSTANCE_SWAP, DateField, Tag/picked, MultiSelect). Novos, específicos do PO, a observar durante o build:

1. **DecisionCard precisa forçar `rationale` não-vazio visualmente** — o estado "veredito sem justificativa" deve ser claramente inválido (state/error hint), não só um campo vazio aceitável.
2. **TriageScoreMeter vs ReadinessRing** — reusar o mesmo gauge com semântica diferente (gate de "pode concluir" vs score de prontidão); confirmar que a diferença de significado fica clara em tela.
3. **PRDSeam é um layout novo de duas autorias** — validar que a costura central comunica "um documento, dois autores" sem parecer duas telas lado a lado.

## Próximas personas

CTO e PM entram no protótipo no mesmo molde (ver a nota final de [`personas/03-po.md`](../../../personas/03-po.md)):
- O **CTO** assume o **Technical Assessment** como entregável de primeira classe (viabilidade como o seu modelo de primeira classe) e a fusão no PRD como handoff — as telas P4.3 e P5.2 deste protótipo já são o ponto de partida dele.
- O **PM** recebe o **PRD** e tem autoridade de aceitar/devolver — as telas P6.1–P6.4 já mostram o lado do PO desse loop.
- Repetir: definir intents (uma por story) · categorizar screens em lanes · escrever narrativa · aplicar os princípios de `03-po.md` (dois atos, decisão de primeira classe, dispositions, cadeia RP→PRD).
