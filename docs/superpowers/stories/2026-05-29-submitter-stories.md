# Submitter Journey Stories

> **Status:** v2 (flow validated 2026-05-29) · **Date:** 2026-05-29 · **Author:** hugo (+ Claude)
> **Companion to:** [`specs/2026-05-27-submitter-figma-prototype-design.md`](../specs/2026-05-27-submitter-figma-prototype-design.md) (the WHAT) and [`plans/2026-05-27-submitter-figma-prototype.md`](../plans/2026-05-27-submitter-figma-prototype.md) (the HOW it was built).
> **Live Figma:** `Intake-Platform` · fileKey `6Yfv523dlb2bfZS9zWGJly` · Submitter journeys page `2:789`.

> **v2 revision (2026-05-29 tarde):** Walk-through validation done. Lane C merged into B (became "ENRICH · INPUTS" — voice + file converge). Several lanes reordered for narrative clarity (D, F, H, M). Alt-variants moved to slots BELOW their primary screen (B2 voz in A, Fontes-sem-chat in E, rails in G). Reason modal (universal) lifted to new Lane Z · REUSABLE PATTERNS. Arrows added for B/L which start mid-flow.

## Purpose

The prototype now contains ~54 Submitter screens. The spec describes the design contract; the plan tracks build tasks. **Neither tells the journey stories.** This doc fills that gap: each story is a single user intent, told as a narrative arc with the screens that materialize it.

## Reading the canvas

The canvas is laid out in **15 horizontal lanes** (Story 0 + A→N + Z). Each lane has a big letter label at the left (x=-900) and screens stacked left → right by narrative beat. Lanes are spaced 2800px vertically; screens 1740px horizontally.

**Reading conventions:**
- Primary beats are on the main row (y = lane_y).
- **Alt-variants and rails** sit on a row 1400px BELOW the main row (still inside the same lane). They are paths the user CAN take but aren't sequential beats.
- **Lane Z** at the bottom contains reusable patterns referenced by multiple stories (currently: Reason modal).
- Lanes that start mid-flow (B, L) have a text arrow at the far left pointing to the lane they depend on.

To trace a story: find its letter on the left of the canvas, then read left → right on the main row.

## Seed scenario (used across every story)

**Submitter:** Hugo Seabra · COO · Pagamentos
**Demand:** `INT-2026-015` — *"Autenticação SSO/SAML para parceiros B2B"*
**Why this matters:** Parceiros B2B não conseguem autenticar no portal porque o SAML deles não bate com o nosso. ~18% de perda no onboarding. Q3 fecha em 8 semanas.
**Stake:** R$ 412k YTD em impacto financeiro acumulado pelo portfolio do Hugo.

---

## Story 0 · Intro · Auth

**Intent:** Entrar no produto.

Hugo abre o produto. Vê uma landing focada — eyebrow + display + quote de outro time — e o card de autenticação à direita com SSO (Google + Microsoft + SAML), divider e link "Solicitar acesso". Não é um formulário. É uma porta de entrada que sinaliza pra quem o produto é.

**Beats:**
1. **B0 · Sign in** (`439:2`) — Tide mark · "Sua próxima decisão começa aqui." · três botões SSO · "Em uso por times de Pagamentos, Receita, Discovery e Comercial."

---

## Story A · First create

**Intent:** Capturar uma nova demanda, do clique inicial até a primeira tela onde ela ganha forma.

Hugo está em Demandas, vê o portfolio (8 ativas), clica em **+ Nova demanda**. A tela de captura **não pede que ele pense como engenheiro**: pede título, descrição na linguagem dele (com mic se preferir falar), evidências (arquivo ou áudio) e — opcional — tags/urgência/prazo/pessoas. Continua → cai no **Demand Panel** (B4), onde a demanda agora existe como objeto com seu próprio readiness, perguntas pendentes, fontes e abas. O modal de **Readiness breakdown** mostra o que falta pra 80% (gate de Discovery) com CTAs inline pra preencher.

**Beats (main row):**
1. **C1 · Demandas** (`548:2298`) — Lista de portfolio · row 1 highlighted INT-2026-015 · clica "+ Nova demanda" no topo direito.
2. **B2 · Nova demanda** (`835:3979`) — Form rico: Título · Descrição (textarea + mic inline) · Evidências (Anexar arquivo · Gravar áudio) · Contexto opcional (Tags · Urgência · Prazo · Pessoas) · Continuar →.
3. **B4 · Demand Panel — drafting** (`478:703`) — A demanda nasceu. Readiness 24% Em Captura · aba Adicionar informação ativa · "Foque aqui · 10 itens precisam de você" com lista priorizada.
4. **B4 · Readiness breakdown (modal)** (`963:5649`) — "Para abrir Discovery, falta…" com artefatos vazios e perguntas pendentes · cada um com CTA inline "Preencher →" / "Responder →".

**Alt-below (sobre B2 base):**
- **B2 · Gravando áudio** (`850:4010`) — Alt da B2: textarea vira waveform live · ⏱ 00:42 · "Parar e transcrever" → volta com texto preenchido.

---

## Story B · Enrich · Inputs

**Intent:** Adicionar informação ao Demand Panel — por voz OU por arquivo — gerando uma contribuição aprovada.

*(Esta lane parte do Demand Panel já aberto — vem da lane A.)*

Hugo abre uma demanda existente, está no composer (aba Adicionar informação). Dois caminhos disponíveis: **falar** (mic morfa o composer em waveform inline) ou **anexar arquivo** (modal centralizado pra escolher arquivos ou colar URL). Qualquer um dos dois acaba no mesmo destino: o feed mostra a **Contribuição aprovada** com banner "IA extraiu · atualizou ALCANCE · atualizou URGÊNCIA". Cada extração tem source rastreável de volta ao input original.

**Beats (main row):**
1. **B4 · Gravando áudio (inline composer)** (`949:4132`) — Composer expandiu em waveform · ⏱ contador · "Parar e transcrever" preto · resto da tela inalterada. *(Caminho voz)*
2. **B4 · Anexar arquivo (modal)** (`945:4039`) — Modal centralizado · "Anexar arquivos à demanda" · dois quadrantes (Anexar arquivos · Fonte web) · Cancelar · Anexar. *(Caminho arquivo)*
3. **B4 · Contribuição aprovada** (`949:4464`) — Feed atualizado · banner "IA extraiu · atualizou ALCANCE (parceiros B2B) · atualizou URGÊNCIA" · CTAs Aprovar/Discutir inline. *(Convergência — destino dos dois caminhos)*

---

## Story D · Resolver pendência

**Intent:** Responder uma das perguntas pendentes que bloqueiam o avanço da demanda.

A aba **Perguntas** lista o que a IA ainda precisa saber. Hugo filtra por **Vazias** pra atacar o que mais bloqueia — vê "Quantos parceiros B2B na fila de onboarding hoje?" no topo (Bloqueia). Clica → modal **Responder pendência** com a pergunta em destaque, campo de resposta + opções de disposition (Responder · Premissa · Discovery · Delegar). Hugo responde "47, com 31 em backlog ≥30 dias." Salva. Volta na aba Perguntas — pergunta foi pra **Confirmar** filter (resposta dada, IA quer validar). Em paralelo, ele pode olhar a aba **Artefatos** pra ver o quadro completo das 8 dimensões, e abrir um **Artefato detail** modal pra ver o que já foi preenchido.

**Beats (main row):**
1. **B4 · Perguntas (alt)** (`919:3560`) — Aba Perguntas · lista priorizada · chips de filter (Todas · Vazias · Confirmar) · "+5 respondidas" collapsed.
2. **B4 · Perguntas filter: Vazias** (`953:4874`) — Filter aplicado · só perguntas sem resposta · empty state quando esgota.
3. **B4 · Perguntas filter: Confirmar** (`953:5321`) — Filter aplicado · perguntas que já tem resposta da IA aguardando confirmação do Submitter.
4. **B4 · Responder pendência (modal)** (`922:3738`) — Pergunta em destaque · textarea · pill picker de disposition · "Salvar e seguir" / "Salvar e fechar".
5. **B4 · Artefatos (alt)** (`918:3471`) — Aba Artefatos · 8 cards (Problema · Originador · Alcance · Impacto · Urgência · Evidência · Constraints · Stakeholders) com readiness/status indicators. *(Visão paralela)*
6. **B4 · Artefato detail (modal)** (`954:4819`) — Drawer/modal mostrando um artefato completo (ex: "Empresas afetadas") com source trail + edit affordances.

---

## Story E · Adicionar fonte

**Intent:** Vincular um documento ou link como fonte de evidência pra demanda.

Aba **Fontes** mostra o que já está vinculado (deck CISO · transcrição Stone · pipeline data). Hugo precisa adicionar a apresentação interna que mostra a perda mês a mês. Clica "+ Adicionar fonte" → modal igual ao de Anexar arquivo, mas com semântica "fonte estruturada" (terá source citation, será citada nos artefatos derivados). Salva. Lista cresce. A IA passa a citá-la nos próximos artefatos.

**Beats (main row):**
1. **B4 · Fontes (alt)** (`920:3649`) — Aba Fontes · lista vertical · cada item com title · tipo (📎/🎙/🔗) · "extraído por IA" trail.
2. **B4 · Adicionar fonte (modal)** (`953:4552`) — Modal igual ao Anexar arquivo mas semantizado como Fonte · campos extras (Tipo · Tags · Descrição opcional).

**Alt-below:**
- **B4 · Fontes (sem chat — visão arquivos)** (`1019:4815`) — Mesma aba mas chat panel fechado · usado quando o foco é só nas fontes.

---

## Story F · Discutir com IA · Chat

**Intent:** Tirar uma dúvida ou refinar entendimento com a IA, sem sair do Demand Panel.

Hugo clica o ícone de chat no canto. **Side panel** abre à direita (Demand Panel continua visível à esquerda). Ele digita livre ("ainda não sei o ROI") → bubble user aparece · banner "pensando…" · após 1.5s, **resposta da IA** chega com chips de ação ("Ver Artefato Alcance" · "Adicionar como premissa"). Como alternativa de entrada, ele pode usar o **Chat picker** pra escolher contexto antes (qual pergunta, qual artefato discutir). Ou pode falar a mensagem usando o **modo voz inline** do chat.

**Beats (main row):**
1. **B4 · Chat aberto (alt)** (`923:3827`) — Side panel chat aberto · histórico vazio · composer no rodapé · Demand Panel à esquerda intacta.
2. **B4 · Chat com nova msg enviada** (`951:4624`) — User bubble enviada · IA "pensando…" com 3-dots animado · AFTER_TIMEOUT 1.5s pra próxima beat.
3. **B4 · Chat com resposta da IA** (`963:5280`) — Resposta IA com chips de ação ("Ver Alcance" · "Revisar texto" · "Enviar direto") · loop conversacional completo.
4. **B4 · Chat picker (modal)** (`951:4314`) — *Alt entry.* Picker modal · "Discutir o quê?" · lista (Perguntas · Artefatos · Fontes · A demanda) com chip filter.
5. **B4 · Chat com voz inline (alt)** (`939:3946`) — *Alt input.* Composer chat morfou em waveform inline (mesma pattern do composer principal).

---

## Story G · Voice mode fullscreen

**Intent:** Falar com a IA por longos minutos sem distração visual.

Do chat side panel, Hugo clica expandir → **Chat fullscreen** (tela inteira, sidebar escondida automaticamente). Clica mic → **Voice mode**: waveform centralizada, IA escutando, contador. Hugo pausa pra pensar — **Voice paused**: mostra "Pausado · 1:23 gravados" + opções (Retomar · Parar e enviar · Descartar). Opcionalmente, pode ativar um rail à direita: **+Contribuições** (mostra o que ele já contribuiu) ou **+Artefatos** (mostra estado dos 8 artefatos) — visíveis em paralelo à conversa.

**Beats (main row):**
1. **B4 · Chat fullscreen** (`933:3927`) — Chat ocupa tela inteira · sidebar global escondida · breadcrumb topo "Demandas > INT-2026-015 > Chat".
2. **B4 · Chat voice mode** (`936:3946`) — Waveform centralizado · IA "escutando" indicator · pausar · parar · descartar.
3. **B4 · Voice mode paused** (`952:4500`) — Waveform congelado · banner "Pausado · 1:23 gravados" · Retomar (primary) · Parar e enviar · Descartar.

**Alt-below (rails):**
- **B4 · Chat fullscreen + Contribuições rail** (`952:4599`) — Rail à direita mostra o que Hugo contribuiu (transcrições · arquivos) como referência durante a conversa.
- **B4 · Chat fullscreen + Artefatos rail** (`952:4814`) — Mesma estrutura mas rail mostra os 8 artefatos · útil pra "completar o quadro" enquanto conversa.

---

## Story H · Editar metadata

**Intent:** Atribuir responsável e ver quem está envolvido (principal); editar título/descrição (alt).

Hugo clica nos **três pontinhos** no header da demanda → menu de ações. Path principal: **Atribuir** → modal com avatar picker (lista do time + busca). Após escolher, o header passa a mostrar **avatar do assignee + deadline chip + version chip** (v0 DRAFT). Em hover no avatar, **popover** mostra responsável + revisor + última atualização. Path alternativo do mesmo menu: **Editar título e descrição** → modal com dois campos pré-preenchidos.

**Beats (main row):**
1. **B4 · Menu de ações** (`910:3397`) — Demand Panel com menu "..." aberto · lista de actions ordenada por uso.
2. **B4 · Atribuir demanda (modal)** (`974:4077`) — Modal com avatar grid · busca · seleção single (responsável) + multi (revisores) · Confirmar.
3. **B4 · Header com assignee + deadline + version** (`974:4389`) — Header completo final: avatar HS + nome · ⏱ 11 DIAS · 12 JUN · v0 DRAFT chip.
4. **B4 · Hover popover · responsável + revisor** (`976:4296`) — Popover sobre avatar stack · "Responsável: Hugo Seabra (COO) · Revisor: Ana Costa (PO)" + última atualização timestamp.
5. **B4 · Editar título e descrição (modal)** (`904:3285`) — *Alt action.* Modal com Input "Título" pré-preenchido + Textarea "Descrição" expandido · Salvar / Cancelar.

---

## Story I · Adiar

**Intent:** Pausar a demanda com motivo registrado — não dá pra avançar agora.

Hugo decide adiar (CISO viaja, vai voltar daqui 3 semanas). Menu "..." → **Adiar**. Modal pede motivo (textarea livre + chips de razão comum: "Aguardando stakeholder" · "Re-priorização" · "Falta evidência crítica") + data de retomada. Confirma. Demand Panel volta com **banner amber** no topo ("Adiada · há 1 min · você"), header com **left-strip 4px amber** + StateBadge "Adiada", "Desfazer" ghost button no banner pra reverter rápido. Toda a aba Adicionar informação fica acinzentada — sinaliza pause.

*(O modal de razão é um pattern reusable em Lane Z — ver Reason modal.)*

**Beats:**
1. **B4 · Adiar (modal)** (`954:5177`) — Versão especializada do Reason modal · chips de razões pra adiar · campo "Voltar a falar disso em" (date picker).
2. **B4 · Adiada** (`955:5094`) — Demand Panel pós-Adiar · banner amber · header strip amber · StateBadge "Adiada" · "Desfazer" disponível.

---

## Story J · Pedir revisão

**Intent:** Quero ajuda de alguém mais experiente antes de mandar adiante.

Demanda fica num limbo — Hugo escreveu, mas quer sanidade de outro PO. Menu "..." → **Pedir revisão** → modal com picker de revisor + motivo. Confirma. Header agora tem **left-strip 4px violet** + StateBadge "Em revisão" + banner violet "Em revisão · você pediu pra Ana Costa". Demand Panel fica em **modo read-only** (Hugo não edita, só vê).

**Beats:**
1. **B4 · Pedir revisão (modal)** (`954:5363`) — Reason modal com picker de revisor + motivo livre + checkbox "permitir edição".
2. **B4 · Em revisão** (`955:5352`) — Demand Panel pós-Pedir revisão · banner violet · header strip violet · StateBadge "Em revisão" · campos read-only.

---

## Story K · Handoff · Congelar v1

**Intent:** A demanda atingiu 100% readiness — congelar e publicar pra PO assumir.

Readiness Ring atinge 100%. CTA primário no rodapé muda pra **"Congelar e publicar v1"**. Hugo clica → modal de confirmação (consequências: vira v1 imutável, PO recebe handoff, posso ainda criar v2 draft em paralelo). Confirma. Demand Panel volta como **B4 · Handoff publicada v1**: header com chip **v1 PUBLICADA · CONGELADA**, banner emerald de sucesso ("Publicada · Ana Costa foi notificada"), todos os campos em estado frozen (cinza, hover mostra "v1 está congelada — crie v2 pra editar").

**Beats:**
1. **B4 · Congelar e publicar v1 (modal)** (`998:4445`) — Modal "Congelar v1" · consequências explicadas · checkbox "Notificar Ana Costa (PO)" pré-marcado · Cancelar / Confirmar.
2. **B4 · Handoff publicada v1 (frozen)** (`1008:4720`) — Demand Panel em modo frozen · v1 PUBLICADA chip · header strip emerald · banner sucesso · campos read-only.

---

## Story L · V2 draft

**Intent:** A v1 já saiu, mas Hugo descobriu mais info — quer atualizar.

*(Esta lane parte de Handoff publicada — vem da lane K.)*

Hugo abre a demanda já publicada. Vê o estado v1 frozen. Clica **"Editar nova versão"** → cria v2 draft. Header agora mostra **dois chips: v1 PUBLICADA + v2 DRAFT** (lado a lado). Os campos voltam a ser editáveis (mas em uma camada v2). Quando ele faz uma edição, **Diff modal** abre opcionalmente mostrando v1 → v2 inline (campo por campo, com strikethrough/insertion). Versão **v2 enxuta** = visão pós-publicação onde só TODOs novos são mostrados (não revisita tudo).

**Beats:**
1. **B4 · v1 publicada + v2 draft (editando)** (`1008:5141`) — Header com dois chips · campos editáveis · banner "Editando v2 · v1 continua publicada".
2. **B4 · Diff modal v1 → v2 (draft)** (`998:4640`) — Modal lado-a-lado · "Resumo das mudanças" · campos com strikethrough/insertion · CTA "Voltar a editar" / "Pronto pra v2 publicar".
3. **B4 v2 — enxuta** (`1005:4631`) — Visão pós-v1 simplificada · só TODOs novos (não revisita 8 artefatos) · readiness compact · pagination.

---

## Story M · Outcomes pós-handoff

**Intent:** O que o Submitter vê depois que entrega — diferentes destinos da demanda no funil.

Após handoff, a demanda passa por estados controlados pelo PO/Discovery. Submitter **não edita**, mas precisa **saber onde está**. Quatro estados terminais ou intermediários (em ordem do mais comum/positivo ao mais crítico): **Sent** (PO recebeu, está triando) → **Returned** (PO devolveu pedindo mais info) → **Late** (passou o deadline) → **Archived** (terminou, rejeitada ou de-priorizada). Em qualquer momento o **Histórico/Auditoria** tab mostra o event log completo, e o **Status Journey + Events downstream** é a visão expandida do funil inteiro (Sent → Discovery → RP-Congelado → Em Execução → Entregue).

**Beats (main row):**
1. **B4 · Sent (status)** (`969:3615`) — Banner tide "Enviada · aguardando PO" · estado natural pós-handoff.
2. **B4 · Returned (status)** (`969:3873`) — Banner amber "Devolvida pelo PO · 'Falta cenário de fallback'" + CTA "Responder devolução" primary.
3. **B4 · Late (status)** (`969:4387`) — Banner red "Atrasada · prazo era 12 jun" · CTA "Renegociar prazo".
4. **B4 · Archived (status)** (`969:4128`) — Banner stone "Arquivada · 28 mai 2026 · por Ana Costa" · campos frozen.
5. **B4 · Histórico / Auditoria (tab)** (`972:3988`) — Tab Histórico · event log vertical · cada evento com timestamp + ator + ação ("Hugo congelou v1" · "Ana abriu Discovery" · …).
6. **B4 · Status Journey + Events downstream** (`970:3895`) — Tela alta (2134h) · timeline horizontal do funil completo · events do downstream visíveis.

---

## Story N · Visibilidade cross-demanda

**Intent:** O que o Submitter olha fora de uma demanda específica — portfolio, atividade, pendências, alertas.

Quatro surfaces que o Submitter visita pra ter visão de alto nível:

- **Dashboard** — o número-rei do portfolio (R$ 412k YTD) + CompactKPI grid + AIImpactBanner ("18h economizadas · 65% automatizado").
- **Range aberto** (variant do Dashboard) — drill-down num range temporal específico.
- **Notifications** — TopBar bell aberto · dropdown com mentions, gates, updates, alerts triados por type.
- **Atividade** — log cross-demand: "PO perguntou em INT-015" · "INT-013 avançou pra Em Execução" · "RP-041 foi congelado".
- **Pendências** — visão cross-demand do que **bloqueia o Submitter** (perguntas pendentes em todas as demandas dele, agrupadas por demanda + urgência).

**Beats:**
1. **B1 · Dashboard** (`811:3890`) — HeroMetric "R$ 412k" + trend + sparkline · CompactKPI grid · AIImpactBanner · recent demands list.
2. **B1 · Range aberto (alt)** (`736:3640`) — Dashboard com filter de date-range expandido · KPIs recalculados pro range · curva mensal.
3. **C2 · Notifications** (`560:2492`) — Tela "ver todas" das notificações · seções (Recentes · Anteriores) · NotificationRow components.
4. **C7 · Atividade** (`752:3822`) — Activity feed cross-demand · grupos por dia · cada item linka pra demanda fonte.
5. **C8 · Pendências** (`752:4085`) — Lista priorizada de pendências do Submitter cross-demand · "X demandas com Y pendências bloqueantes" · agrupado por urgência.

---

## Lane Z · Reusable patterns

**Intent:** Patterns referenciados por múltiplas stories, mantidos centralizados pra não duplicar.

Padrões que aparecem em mais de uma story merecem visibilidade autônoma — referência única, fácil de iterar sem mexer nas stories.

**Beats:**
1. **B4 · Reason modal (universal · transition why)** (`969:3430`) — Modal genérico de "por quê?" · textarea + chips de razões comuns + data condicional. Usado por: Adiar (lane I — `954:5177` é uma versão especializada), Pedir revisão (lane J — `954:5363`), e potencialmente Arquivar / Devolver no futuro.

---

## Master gaps surfaced (carry forward)

Inconsistências do design system encontradas durante o build, registradas pra resolver antes da próxima persona:

1. **`Button` master `leadingIcon` é RECTANGLE, não INSTANCE_SWAP** — bloqueia icon swap declarativo. Resultado: ghost buttons em B2 ficaram sem icon. Action: refactor master.
2. **Sem Date field component** — Prazo em B2 é local custom. Action: criar `DateField` no design system.
3. **`Tag/selected` variant visual subtle** — pra Urgência "Alta" selecionada, o sinal visual é fraco. Action: criar `Variant=picked` com tide bg + white text.
4. **Sem `MultiSelect`/`Tag input` component** — chip-rows são compostas manualmente de Tag/removable + Tag/default. Action: criar componente dedicado.

## Open Figma comments

- `1779637369` (FILE-LEVEL) — "We also need the complete place as well." — vago, aguardando clarificação.

## Próximas personas

Quando uma próxima persona for entrar no protótipo (PO, Discovery, Execução), repetir o mesmo template:
- Definir intents (uma por story)
- Categorizar screens em lanes
- Escrever narrativa por story
- Aplicar princípios de [`personas/01-submitter.md`](../../../personas/01-submitter.md) (duas lentes, confiança, dispositions) + de `.claude/memory/intake-screen-principles.md` (form sections, list rows HUG, deep-screens fullscreen)
