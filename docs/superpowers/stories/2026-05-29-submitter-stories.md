# Submitter Journey Stories

> **Status:** v1 · **Date:** 2026-05-29 · **Author:** hugo (+ Claude)
> **Companion to:** [`specs/2026-05-27-submitter-figma-prototype-design.md`](../specs/2026-05-27-submitter-figma-prototype-design.md) (the WHAT) and [`plans/2026-05-27-submitter-figma-prototype.md`](../plans/2026-05-27-submitter-figma-prototype.md) (the HOW it was built).
> **Live Figma:** `Intake-Platform` · fileKey `6Yfv523dlb2bfZS9zWGJly` · Submitter journeys page `2:789`.

## Purpose

The prototype now contains ~54 Submitter screens. The spec describes the design contract; the plan tracks build tasks. **Neither tells the journey stories.** This doc fills that gap: each story is a single user intent, told as a narrative arc with the screens that materialize it.

## Reading the canvas

The canvas is laid out in **15 horizontal lanes**, one per story (Story 0 + A→N). Each lane has a big letter label at the left (x=-900) and screens stacked left → right by narrative beat. Lanes are spaced 2800px vertically; screens 1740px horizontally.

To trace a story: find its letter on the left of the canvas, then read left → right.

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

Hugo está em Demandas, vê o portfolio (8 ativas), clica em **+ Nova demanda**. A tela de captura **não pede que ele pense como engenheiro**: pede título curto, descrição na linguagem dele (com mic se preferir falar), evidências (arquivo ou áudio) e — opcional — tags/urgência/prazo/pessoas. Continua → cai no **Demand Panel** (B4), onde a demanda agora existe como objeto com seu próprio readiness, perguntas pendentes, fontes e abas. O modal de **Readiness breakdown** mostra o que falta pra 80% (gate de Discovery) com CTAs inline pra preencher.

**Beats:**
1. **C1 · Demandas** (`548:2298`) — Lista de portfolio · row 1 highlighted INT-2026-015 · clica "+ Nova demanda" no topo direito.
2. **B2 · Nova demanda** (`835:3979`) — Form rico: Título · Descrição (textarea + mic inline) · Evidências (Anexar arquivo · Gravar áudio) · Contexto opcional (Tags · Urgência · Prazo · Pessoas) · Continuar →.
3. **B2 · Gravando áudio** (`850:4010`) — Alt da B2: textarea vira waveform live · ⏱ 00:42 · "Parar e transcrever" → volta com texto preenchido.
4. **B4 · Demand Panel — drafting** (`478:703`) — A demanda nasceu. Readiness 24% Em Captura · aba Adicionar informação ativa · "Foque aqui · 10 itens precisam de você" com lista priorizada.
5. **B4 · Readiness breakdown (modal)** (`963:5649`) — "Para abrir Discovery, falta…" com artefatos vazios e perguntas pendentes · cada um com CTA inline "Preencher →" / "Responder →".

---

## Story B · Enrich · Voz

**Intent:** Falar dentro do Demand Panel ao invés de digitar — o áudio vira contribuição estruturada.

Hugo abre uma demanda existente, está no composer (aba Adicionar informação), clica no mic. O composer **morfa em waveform inline** — não muda de tela, não rouba o foco. Ele fala 40 segundos sobre quantos parceiros estão na fila e qual o impacto. Para. O feed mostra a **Contribuição aprovada**: a IA extraiu de fala → atualizou Alcance ("parceiros B2B") + atualizou Urgência. Cada extração tem source rastreável de volta ao áudio.

**Beats:**
1. **B4 · Gravando áudio (inline composer)** (`949:4132`) — Composer expandiu em waveform · ⏱ contador · "Parar e transcrever" preto · resto da tela inalterada.
2. **B4 · Contribuição aprovada** (`949:4464`) — Feed atualizado · banner "IA extraiu · atualizou ALCANCE (parceiros B2B) · atualizou URGÊNCIA" · CTAs Aprovar/Discutir inline.

---

## Story C · Enrich · Arquivo

**Intent:** Anexar deck ou transcrição que ele já tem em mãos — IA processa.

Hugo arrasta (ou clica) o botão Anexar arquivo. **Modal** com dois quadrantes: Anexar arquivos (drop zone, formatos aceitos) e Fonte web (URL). Hugo solta o deck da CISO. Modal fecha. Volta no Demand Panel — feed mostra "Contribuição aprovada" igual à Story B (IA já processou o deck).

**Beats:**
1. **B4 · Anexar arquivo (modal)** (`945:4039`) — Modal centralizado · "Anexar arquivos à demanda" · dois quadrantes (Anexar arquivos · Fonte web) · Cancelar · Anexar.

> A contribuição aprovada resultante é a mesma da Story B (`949:4464`), na lane acima.

---

## Story D · Resolver pendência

**Intent:** Responder uma das perguntas pendentes que bloqueiam o avanço da demanda.

A aba **Perguntas** lista o que a IA ainda precisa saber. Hugo filtra por **Vazias** pra atacar o que mais bloqueia — vê "Quantos parceiros B2B na fila de onboarding hoje?" no topo (Bloqueia). Clica → modal **Responder pendência** com a pergunta em destaque, campo de resposta + opções de disposition (Responder · Premissa · Discovery · Delegar). Hugo responde "47, com 31 em backlog ≥30 dias." Salva. Volta na aba Perguntas — pergunta foi pra **Confirmar** filter (resposta dada, IA quer validar). Em paralelo, ele pode abrir um **Artefato detail** modal pra ver o que já foi preenchido em "Empresas afetadas".

**Beats:**
1. **B4 · Artefatos (alt)** (`918:3471`) — Aba Artefatos · 8 cards (Problema · Originador · Alcance · Impacto · Urgência · Evidência · Constraints · Stakeholders) com readiness/status indicators.
2. **B4 · Perguntas (alt)** (`919:3560`) — Aba Perguntas · lista priorizada · chips de filter (Todas · Vazias · Confirmar) · "+5 respondidas" collapsed.
3. **B4 · Perguntas filter: Vazias** (`953:4874`) — Filter aplicado · só perguntas sem resposta · empty state quando esgota.
4. **B4 · Perguntas filter: Confirmar** (`953:5321`) — Filter aplicado · perguntas que já tem resposta da IA aguardando confirmação do Submitter.
5. **B4 · Responder pendência (modal)** (`922:3738`) — Pergunta em destaque · textarea · pill picker de disposition · "Salvar e seguir" / "Salvar e fechar".
6. **B4 · Artefato detail (modal)** (`954:4819`) — Drawer/modal mostrando um artefato completo (ex: "Empresas afetadas") com source trail + edit affordances.

---

## Story E · Adicionar fonte

**Intent:** Vincular um documento ou link como fonte de evidência pra demanda.

Aba **Fontes** mostra o que já está vinculado (deck CISO · transcrição Stone · pipeline data). Hugo precisa adicionar a apresentação interna que mostra a perda mês a mês. Clica "+ Adicionar fonte" → modal igual ao de Anexar arquivo, mas com semântica "fonte estruturada" (terá source citation, será citada nos artefatos derivados). Salva. Lista cresce. A IA passa a citá-la nos próximos artefatos.

**Beats:**
1. **B4 · Fontes (alt)** (`920:3649`) — Aba Fontes · lista vertical · cada item com title · tipo (📎/🎙/🔗) · "extraído por IA" trail.
2. **B4 · Fontes (sem chat — visão arquivos)** (`1019:4815`) — Mesma aba mas chat panel fechado · usado quando o foco é só nas fontes.
3. **B4 · Adicionar fonte (modal)** (`953:4552`) — Modal igual ao Anexar arquivo mas semantizado como Fonte · campos extras (Tipo · Tags · Descrição opcional).

---

## Story F · Discutir com IA · Chat

**Intent:** Tirar uma dúvida ou refinar entendimento com a IA, sem sair do Demand Panel.

Hugo clica o ícone de chat no canto. **Side panel** abre à direita (Demand Panel continua visível à esquerda). Ele pode digitar livre ("ainda não sei o ROI") ou clicar **Discutir com IA** no chip-action de uma pergunta — abre o **Chat picker** pra escolher contexto (qual pergunta, qual artefato). Hugo manda mensagem → bubble user aparece · banner "pensando…" · após 1.5s, **resposta da IA** chega com chips de ação ("Ver Artefato Alcance" · "Adicionar como premissa"). Hugo clica "Ver X" → navega pra aba destino com o artefato em foco. O chat tem também um **modo voz inline** se Hugo preferir falar a resposta.

**Beats:**
1. **B4 · Chat aberto (alt)** (`923:3827`) — Side panel chat aberto · histórico vazio · composer no rodapé · Demand Panel à esquerda intacta.
2. **B4 · Chat picker (modal)** (`951:4314`) — Picker modal · "Discutir o quê?" · lista (Perguntas · Artefatos · Fontes · A demanda) com chip filter.
3. **B4 · Chat com nova msg enviada** (`951:4624`) — User bubble enviada · IA "pensando…" com 3-dots animado · AFTER_TIMEOUT 1.5s pra próxima beat.
4. **B4 · Chat com resposta da IA** (`963:5280`) — Resposta IA com chips de ação ("Ver Alcance" · "Revisar texto" · "Enviar direto") · loop conversacional completo.
5. **B4 · Chat com voz inline (alt)** (`939:3946`) — Composer chat morfou em waveform inline (mesma pattern do composer principal).

---

## Story G · Voice mode fullscreen

**Intent:** Falar com a IA por longos minutos sem distração visual.

Do chat side panel, Hugo clica expandir → **Chat fullscreen** (tela inteira, sidebar escondida automaticamente). Tem dois rails opcionais: **+Contribuições** (mostra o que ele já contribuiu em paralelo ao chat) ou **+Artefatos** (mostra o estado dos 8 artefatos em paralelo). Hugo clica mic → **Voice mode**: waveform centralizada, IA escutando, contador. Hugo pausa pra pensar — **Voice paused**: mostra "Pausado · 1:23 gravados" + opções (Retomar · Parar e enviar · Descartar). Retomar → volta gravando. Stop → transcrição volta no chat normal.

**Beats:**
1. **B4 · Chat fullscreen** (`933:3927`) — Chat ocupa tela inteira · sidebar global escondida · breadcrumb topo "Demandas > INT-2026-015 > Chat".
2. **B4 · Chat fullscreen + Contribuições rail** (`952:4599`) — Rail à direita mostra o que Hugo contribuiu (transcrições · arquivos) como referência durante a conversa.
3. **B4 · Chat fullscreen + Artefatos rail** (`952:4814`) — Mesma estrutura mas rail mostra os 8 artefatos · útil pra "completar o quadro" enquanto conversa.
4. **B4 · Chat voice mode** (`936:3946`) — Waveform centralizado · IA "escutando" indicator · pausar · parar · descartar.
5. **B4 · Voice mode paused** (`952:4500`) — Waveform congelado · banner "Pausado · 1:23 gravados" · Retomar (primary) · Parar e enviar · Descartar.

---

## Story H · Editar metadata

**Intent:** Mudar título, atribuir responsável, ver quem está envolvido.

Hugo clica nos **três pontinhos** no header da demanda → menu de ações (Editar título e descrição · Atribuir · Adiar · Pedir revisão · Histórico · …). Clica **Editar título** → modal com dois campos pré-preenchidos. Salva. Em outro momento, **Atribuir demanda** → modal com avatar picker (lista do time + busca). Após escolher, o header passa a mostrar **avatar do assignee + deadline chip + version chip** (v0 DRAFT, vai virar v1 PUBLICADA depois). Em hover no avatar, **popover** mostra responsável + revisor + última atualização.

**Beats:**
1. **B4 · Menu de ações** (`910:3397`) — Demand Panel com menu "..." aberto · lista de actions ordenada por uso.
2. **B4 · Editar título e descrição (modal)** (`904:3285`) — Modal com Input "Título" pré-preenchido + Textarea "Descrição" expandido · Salvar / Cancelar.
3. **B4 · Atribuir demanda (modal)** (`974:4077`) — Modal com avatar grid · busca · seleção single (responsável) + multi (revisores) · Confirmar.
4. **B4 · Header com assignee + deadline + version** (`974:4389`) — Header completo final: avatar HS + nome · ⏱ 11 DIAS · 12 JUN · v0 DRAFT chip.
5. **B4 · Hover popover · responsável + revisor** (`976:4296`) — Popover sobre avatar stack · "Responsável: Hugo Seabra (COO) · Revisor: Ana Costa (PO)" + última atualização timestamp.

---

## Story I · Adiar

**Intent:** Pausar a demanda com motivo registrado — não dá pra avançar agora.

Hugo decide adiar (CISO viaja, vai voltar daqui 3 semanas). Menu "..." → **Adiar**. Modal pede motivo (textarea livre + chips de razão comum: "Aguardando stakeholder" · "Re-priorização" · "Falta evidência crítica") + data de retomada. Confirma. Demand Panel volta com **banner amber** no topo ("Adiada · há 1 min · você"), header com **left-strip 4px amber** + StateBadge "Adiada", "Desfazer" ghost button no banner pra reverter rápido. Toda a aba Adicionar informação fica acinzentada — sinaliza pause.

> O **Reason modal** (`969:3430`) é universal — usado por Adiar, Pedir revisão e outros (devolver pro PO, arquivar). Padrão consistente: textarea + chips de razão + data condicional.

**Beats:**
1. **B4 · Reason modal (universal · transition why)** (`969:3430`) — Modal genérico de "por quê?" · textarea · chips · CTA contextual ("Adiar" · "Pedir revisão" · "Arquivar").
2. **B4 · Adiar (modal)** (`954:5177`) — Instância do Reason modal especializada pra Adiar · chips de razões · campo "Voltar a falar disso em" (date picker).
3. **B4 · Adiada** (`955:5094`) — Demand Panel pós-Adiar · banner amber · header strip amber · StateBadge "Adiada" · "Desfazer" disponível.

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

Hugo abre a demanda já publicada. Vê o estado v1 frozen. Clica **"Editar nova versão"** → cria v2 draft. Header agora mostra **dois chips: v1 PUBLICADA + v2 DRAFT** (lado a lado). Os campos voltam a ser editáveis (mas em uma camada v2). Quando ele faz uma edição, **Diff modal** abre opcionalmente mostrando v1 → v2 inline (campo por campo, com strikethrough/insertion). Versão **v2 enxuta** = visão pós-publicação onde só TODOs novos são mostrados (não revisita tudo).

**Beats:**
1. **B4 · v1 publicada + v2 draft (editando)** (`1008:5141`) — Header com dois chips · campos editáveis · banner "Editando v2 · v1 continua publicada".
2. **B4 · Diff modal v1 → v2 (draft)** (`998:4640`) — Modal lado-a-lado · "Resumo das mudanças" · campos com strikethrough/insertion · CTA "Voltar a editar" / "Pronto pra v2 publicar".
3. **B4 v2 — enxuta** (`1005:4631`) — Visão pós-v1 simplificada · só TODOs novos (não revisita 8 artefatos) · readiness compact · pagination.

---

## Story M · Outcomes pós-handoff

**Intent:** O que o Submitter vê depois que entrega — diferentes destinos da demanda no funil.

Após handoff, a demanda passa por estados controlados pelo PO/Discovery. Submitter **não edita**, mas precisa **saber onde está**. Cinco estados terminais ou interimediários:

- **Sent**: PO recebeu e está triando. Banner tide neutro.
- **Returned**: PO devolveu pedindo mais info ("Faltou cenário de fallback"). Banner amber crítico. Hugo precisa agir.
- **Archived**: PO arquivou (não é prioridade ou foi rejeitada). Banner stone. Histórico preservado.
- **Late**: passou o deadline sem progresso. Banner red. Alarme suave pra Submitter renegociar prazo.

E o **Histórico/Auditoria tab** mostra todo o histórico de transições (event log: quem fez o quê e quando). E o **Status Journey + Events downstream** (970:3895) é a tela "expandida" mostrando todo o caminho da demanda no funil (Sent → Discovery → RP-Congelado → Em Execução → Entregue) com events do downstream visíveis.

**Beats:**
1. **B4 · Histórico / Auditoria (tab)** (`972:3988`) — Tab Histórico · event log vertical · cada evento com timestamp + ator + ação ("Hugo congelou v1" · "Ana abriu Discovery" · …).
2. **B4 · Sent (status)** (`969:3615`) — Demand Panel pós-handoff · banner tide "Enviada · aguardando PO".
3. **B4 · Returned (status)** (`969:3873`) — Banner amber "Devolvida pelo PO · 'Falta cenário de fallback'" + CTA "Responder devolução" primary.
4. **B4 · Archived (status)** (`969:4128`) — Banner stone "Arquivada · 28 mai 2026 · por Ana Costa" · campos frozen.
5. **B4 · Late (status)** (`969:4387`) — Banner red "Atrasada · prazo era 12 jun" · CTA "Renegociar prazo".
6. **B4 · Status Journey + Events downstream** (`970:3895`) — Tela alta (2134h) · timeline horizontal do funil completo · events do downstream (Discovery iniciou · RP versionado · etc).

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
