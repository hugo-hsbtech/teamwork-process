# PRD — Queue Voting (Fila de Votação)

> O PRD (Product Requirements Document) é a **fusão** do [Readiness Package](./02-readiness-package-queue-voting.md) (produto, autoria do PO) com o Technical Assessment (técnico, autoria do CTO) — **neste caso não requisitado**. É o **único artefato que abre o downstream** — entregue ao **PM**. Cada metade mantém autoria clara: o PO não escreve a parte técnica, o CTO não reescreve o produto. Ver [`personas/02-po.md` §2, §10 e §11](../personas/02-po.md).
>
> **Neste caso, não houve escalada ao CTO:** o PRD se forma apenas a partir do RP; a Parte B referencia "sem Technical Assessment — sem impacto arquitetural".
>
> `PRD = RP (PO) [Technical Assessment: Não requisitado]`
>
> **Jornada:** [`00 Documento do Submitter`](./00-submitter-brief-queue-voting.md) → [`01 Intake Record (PO — triagem)`](./01-intake-record-queue-voting.md) → [`02 Readiness Package (PO)`](./02-readiness-package-queue-voting.md) → `03 Technical Assessment — não requisitado` → `04 PRD (PO+CTO → PM)`.

## Metadados

| Campo | Valor |
|---|---|
| **ID do PRD** | PRD-2026-001 |
| **Versão** | v1 |
| **RP vinculado** | RP-2026-001 v2 |
| **Technical Assessment vinculado** | N/A — sem escalada arquitetural |
| **Intake vinculado** | INT-2026-001 |
| **Autores** | Lucas Mendes (PO) |
| **Status** | Em revisão do PM |
| **Entregue ao PM em** | 2026-03-28 |

## Histórico de Revisão

| Versão | Data | Autor | Status | Resumo |
|---|---|---|---|---|
| v1 | 2026-03-28 | Lucas Mendes (PO) | Em revisão do PM | PRD formado a partir do RP-2026-001 v2 (aprovado). Sem Technical Assessment — sem escalada arquitetural. Entregue ao PM para abertura do downstream. |

---

## Sign-off

> A fusão só fecha com assinatura do PO. Como não houve escalada ao CTO, o campo técnico é N/A justificado.

| Papel | Nome | Veredito | Data |
|---|---|---|---|
| **PO** (produto) | Lucas Mendes | RP congelado (`freezeReady`) — v2 aprovada pelo PM | 2026-03-28 |
| **CTO** (técnico) | — | N/A — sem escalada arquitetural. Premissas técnicas validadas como razoáveis; Tech Lead confirma no breakdown. | — |

---

## Resumo Executivo Combinado

A plataforma PokerPlan não oferece ao facilitador controle sobre o fluxo de estimativas durante cerimônias de planning: todos os itens ficam expostos desde o início e os votos aparecem em tempo real. Isso gera cerimônias desgovernadas e estimativas enviesadas por ancoragem — problemas relatados diretamente pelos Scrum Masters do Banco Meridional (cliente enterprise, 4 squads ativos, renovação de contrato em ~90 dias).

Este PRD define a entrega de duas capacidades complementares: **Fila de Questões** (facilitador revela histórias sequencialmente, uma de cada vez) e **Votação Secreta** (votos ocultos até revelação deliberada pelo facilitador). Juntas, essas capacidades devolvem ao facilitador o controle do ritmo da cerimônia e eliminam o viés de ancoragem.

Do ponto de vista técnico, a demanda é inteiramente circunscrita a UI e estado de sessão — extensão da infraestrutura WebSocket existente e do schema de persistência de sessão. Não há nova infraestrutura, sem novos serviços externos, sem impacto arquitetural de plataforma. Escalada ao CTO não foi necessária; as premissas técnicas foram avaliadas como razoáveis pelo PO e serão confirmadas pelo Tech Lead no breakdown.

O resultado esperado de negócio: retenção de R$ 84.000 ARR (renovação do Banco Meridional) + desbloqueio de R$ 28.000 ARR de expansão (3 squads pendentes). Esforço estimado: 14 dias. Prazo: funcionalidade em produção antes da conversa de renovação (~90 dias a partir de março de 2026).

---

## Parte A — Definição de Produto (do Readiness Package · PO)

> Síntese das seções-chave do RP. O documento-fonte completo é [`RP-2026-001 v2`](./02-readiness-package-queue-voting.md); aqui fica o que o PM precisa para planejar, sem reescrever o RP inteiro.

### A.1 Objetivos e Resultado Esperado

1. Permitir que facilitadores carreguem uma lista de itens e os revelem sequencialmente, um de cada vez, com controles para avançar, pular e retornar.
2. Ocultar os votos de todos os participantes até que o facilitador acione a revelação de forma explícita e deliberada.
3. Reduzir o tempo médio de cerimônia em pelo menos 20% para sessões com 10+ itens (mensurável via telemetria de duração de sessão).
4. Remover o bloqueador de adoção para os 3 squads pendentes no Banco Meridional — desbloqueando R$ 28.000 ARR de expansão.

### A.2 Escopo (final)

**Incluído:**
- UI do facilitador: fila de itens com controles de adicionar, revelar próximo, pular, retornar
- UI do participante: apenas o item ativo visível (sem visibilidade da fila)
- Ocultação de votos até revelação explícita; revelação simultânea para todos os participantes
- Persistência de estado através de reconexões (período de graça de 5 min para o facilitador)
- Controles básicos: pular item, retornar ao item anterior, encerrar sessão
- Telemetria de duração de sessão e por item

**Excluído:**
- Timer por item com avanço automático
- Revelação automática após todos os votos submetidos
- Co-facilitação / controle multi-facilitador
- Redesign mobile; integração Jira/Linear; relatórios de analytics

**Adiado (Fase 2+):**
- Toggle de auto-revelação; reuso de template de fila; modo co-facilitador; dashboard de analytics; integração Jira/Linear

### A.3 Personas / Jobs-to-be-done

| Persona | Job | Impacto |
|---|---|---|
| Scrum Master / Facilitador | Conduzir cerimônia de planning com ritmo controlado e estimativas sem viés, sem workarounds manuais | Usuário primário: ganha controle total de quando cada item é apresentado e quando votos são revelados |
| Desenvolvedor / Votante | Estimar cada história de forma independente, sem ver estimativas dos colegas antes de votar | Vê apenas o item ativo; voto oculto até revelação; menos distração |

### A.4 Regras de Negócio e Fluxos

Regras completas em [`RP-2026-001 v2 — Seção 6`](./02-readiness-package-queue-voting.md). Resumo para o PM:

- Apenas o facilitador controla a fila (adicionar, reordenar, revelar, pular, retornar).
- Itens na fila são invisíveis para participantes até revelados.
- Votos exibidos como "Votou" (sem valor) até o facilitador acionar "Revelar votos".
- Revelação é server-side: valores não trafegam em payloads WebSocket antes do evento `votes_revealed`.
- Participantes sem voto no momento da revelação recebem "Não votou" — sem bloqueio do fluxo.
- Máximo de 100 itens por fila (a confirmar pelo Tech Lead).

Fluxo de estado: Sessão criada → Fila carregada → Item revelado → Votos submetidos (ocultos) → Votos revelados → Avançar / Re-votar / Encerrar.

### A.5 User Stories + Critérios de Aceite

| ID | História | Critério de aceite principal |
|---|---|---|
| ST-001 | Como facilitador, quero gerenciar a fila de itens (adicionar, revelar um a um, pular, retornar) para conduzir o planning no meu ritmo | Dado que sou facilitador, quando aciono "Revelar próximo item", então o próximo item torna-se ativo e é exibido a todos; os demais itens da fila permanecem ocultos aos participantes |
| ST-002 | Como facilitador, quero que os votos fiquem ocultos até que eu os revele explicitamente, para eliminar viés de ancoragem | Dado que um participante vota, quando outro verifica a tela, então vê "Votou" — sem o valor; quando o facilitador aciona "Revelar votos", todos os valores aparecem simultaneamente em ≤ 500ms |
| ST-003 | Como facilitador ou participante, quero que o estado da sessão seja restaurado após uma desconexão temporária | Dado que o facilitador reconecta em até 5 min, então fila, item ativo e votos são restaurados; após 5 min, sessão encerra limpa com notificação |

Critérios de aceite completos (Given/When/Then para todos os casos) em [`RP-2026-001 v2 — Seção 7`](./02-readiness-package-queue-voting.md).

### A.6 Requisitos Não-Funcionais (NFRs)

| Dimensão | Requisito | Verificação |
|---|---|---|
| Performance | Revelação de votos propagada a todos em ≤ 500ms | Load test com 30+ participantes concorrentes antes do release |
| Confiabilidade | Estado de sessão restaurado após reconexão do facilitador em até 5 min | Teste de reconexão forçada em QA |
| Segurança | Valores de votos ausentes nos payloads WebSocket antes de `votes_revealed`; ocultação server-side | Teste de penetração no fluxo de revelação; inspeção de payloads |
| Usabilidade | Facilitador opera fila e revelação sem treinamento | Validação com ≥ 1 Scrum Master do Banco Meridional antes do release |
| Compatibilidade | Funcional nos browsers e dispositivos já suportados; layout mobile existente se aplica | Regressão no smoke test atual |
| Manutenibilidade | Deploy sem downtime de sessões ativas; telemetria disponível desde o 1º deploy | Estratégia de rollout no Tech Backlog; verificação pós-deploy |

### A.7 Edge Cases e Modos de Falha

- **Participante entra durante item ativo:** vê item ativo, pode votar. Fila não exposta.
- **Facilitador desconecta:** sessão pausa. Período de graça 5 min; após isso, encerra limpa com notificação.
- **Todos votaram antes da revelação:** sem auto-revelação — facilitador controla o timing.
- **Votos parciais na revelação:** participantes sem voto recebem "Não votou". Fluxo não bloqueado.
- **Fila vazia ao avançar:** controle desabilitado; indicação visual "Todos os itens concluídos".
- **Reconexão de participante:** retoma item ativo; voto anterior preservado se já havia votado.
- **Migração de schema com sessões ativas:** migração roda apenas em sessões encerradas.

Edge cases completos com comportamento esperado em [`RP-2026-001 v2 — Seção 9`](./02-readiness-package-queue-voting.md).

---

## Parte B — Definição Técnica (do Technical Assessment · CTO)

> Technical Assessment **não requisitado** para esta demanda — sem escalada arquitetural. A demanda é circunscrita a UI e extensão de estado de sessão dentro da infraestrutura existente. As premissas técnicas foram avaliadas como razoáveis na triagem e serão validadas pelo Tech Lead durante o breakdown técnico.

### B.1 Veredito de Viabilidade

| Campo | Valor |
|---|---|
| **Veredito** | N/A — sem escalada arquitetural |
| **Ressalvas** | Sem escalada ao CTO. Tech Lead valida premissas técnicas (WebSocket + schema de sessão) no breakdown. Se uma premissa for falsa, a demanda é retriada — gatilho de retriagem downstream. |

### B.2 Impacto Arquitetural e Integrações

| Área / Sistema | Impacto | Nota |
|---|---|---|
| Camada WebSocket / sessão em tempo real | Novos tipos de evento (`item_revealed`, `votes_revealed`, `item_skipped`) na infraestrutura existente | Sem novo broker ou camada de mensageria — premissa a confirmar com Tech Lead |
| Persistência de sessão | Extensão de schema para suportar fila ordenada, estado de revelação por item e flag de ocultação de votos | Premissa: migração incremental, sem migração completa — a confirmar com Tech Lead |
| Frontend do facilitador | Novo componente UI de gerenciamento de fila e controles de revelação | — |
| Frontend do participante | Mudança na lógica de exibição de votos (oculto → revelado) | — |
| Observabilidade | Novos eventos de telemetria: duração de sessão, tempo por item, lag de revelação | Necessário para medir objetivos da Seção 3 |
| Multi-tenancy | Sem impacto — escopo de sessão já isolado por tenant | — |

> **Nota:** as áreas acima são avaliação do PO com base no conhecimento do sistema. Não substituem o Technical Assessment do CTO. O Tech Lead confirma durante o breakdown; se encontrar bloqueador, retriagem downstream é acionada.

### B.3 Constraints Rígidas

| Constraint | Efeito no escopo |
|---|---|
| Deploy sem downtime | Rollout incremental obrigatório. Estratégia de rollout documentada no Tech Backlog antes do início do desenvolvimento. |
| Sem novos serviços externos | Funcionalidade construída integralmente na infraestrutura existente. Nenhum procurement. |
| Máx. 100 itens por fila | Limite operacional a confirmar com Tech Lead. Se inviável, reduzir para 50 sem impacto funcional para o caso de uso do Banco Meridional. |

### B.4 ADRs (nível arquitetural)

| # | Decisão | Sign-off |
|---|---|---|
| — | Sem ADRs de nível arquitetural — sem escalada ao CTO. ADRs técnicos serão registrados pelo Tech Lead no Tech Backlog (06.2) durante o breakdown. | N/A |

---

## Reconciliação de Escopo

> Escopo do RP mantido integralmente. Sem Technical Assessment — nenhum veto ou constraint técnico de CTO alterou o escopo definido no RP-2026-001 v2.

| Item original (RP) | Mudança após Technical Assessment | Motivo |
|---|---|---|
| — | Escopo do RP mantido integralmente | Sem escalada ao CTO; sem conflito técnico a reconciliar |

---

## Visão Consolidada de Riscos e Dependências

> Riscos de produto/negócio (do RP, Seção 12) + avaliação técnica preliminar do PO — o PM planeja contra esta visão.

| Risco | Origem | Tipo | Probabilidade | Impacto | Mitigação |
|---|---|---|---|---|---|
| Prazo de renovação não cumprido se esforço real superar o estimado | RP | Prazo | Baixa | Alto | PM avalia capacidade na abertura do planejamento. Corte de escopo (telemetria avançada) tem precedência sobre extensão de prazo. |
| Premissa técnica de WebSocket ou schema falsa — identificada no breakdown | RP/TA | Técnico | Baixa | Alto | Tech Lead valida na abertura. Se bloqueador: retriagem imediata com PO. |
| Scrum Masters sem autonomia de adoção (premissa não validada) | RP | Externo | Baixa | Médio | CS valida com o cliente antes da entrega. |
| Viés de ancoragem residual (comunicação verbal) | RP | Produto | Alta | Baixo | Aceito — plataforma controla apenas visibilidade digital. |
| Adoção dos squads pendentes mais lenta que o esperado | RP | Adoção | Média | Médio | CS coordena onboarding ativo pós-release. Meta de 60 dias é conservadora. |
| Bypass de ocultação de votos via inspeção client-side | RP | Segurança | Baixa | Alto | Ocultação server-side (sem valor nos payloads antes de `votes_revealed`). Teste de penetração no fluxo de revelação. |
| Ordenação de eventos WebSocket inconsistente sob carga | RP | Técnico | Média | Médio | Load test com 30+ participantes antes do release. Revelação idempotente por design. |

**Dependências externas conhecidas:**

- CS (Ana Costa): validação de autonomia de adoção com o cliente + coordenação de onboarding pós-release
- PM: avaliação de capacidade da equipe e planejamento dentro do prazo de 90 dias
- Tech Lead: confirmação das premissas técnicas na abertura do breakdown

---

## Esforço e Custo

> Estimativa preliminar do PO (sem Technical Assessment firme). O número firme vem do Tech Lead no breakdown (Tech Backlog 06.2). Somente uso interno — não é compromisso contratual.

| Área | Estimativa preliminar | Senioridade |
|---|---|---|
| Backend (estado de sessão + eventos WebSocket) | 5 dias | Mid-senior |
| Frontend — UI do facilitador | 4 dias | Mid |
| Frontend — UI do participante | 2 dias | Mid |
| QA (funcional + segurança + carga) | 3 dias | QA |
| **Total preliminar** | **14 dias** | |

**Infra / Terceiros / Opex recorrente:** Nenhum. Sem nova infraestrutura, sem serviços externos, sem procurement. Impacto de opex: aumento de ~2–3% no armazenamento de observabilidade (eventos de telemetria adicionais) — sem ação de orçamento necessária.

---

## Prontidão Herdada e Dispositions em Aberto

> O que o PM precisa enxergar antes de planejar: premissas ainda a validar que sobreviveram até aqui. Se uma premissa se provar falsa na execução, a demanda é reavaliada.

| Campo | Valor |
|---|---|
| **Premissas ainda a validar** | (1) Scrum Masters do Banco Meridional têm autonomia de adoção sem aprovação de TI — validar com CS antes da entrega; (2) Ticket por squad dos squads pendentes equivale ao dos ativos — validar com Finance/CS para firmar ARR de expansão |
| **Incógnitas de Discovery** | — (nenhuma; não houve fase de Discovery) |
| **Requisitos delegados (com dono)** | — |

> As premissas técnicas (WebSocket e schema de sessão) foram tratadas durante a racionalização e confirmadas como razoáveis. Serão validadas definitivamente pelo Tech Lead no breakdown — se uma delas for falsa, o PO é notificado e a demanda é retriada.

---

## Critérios de Sucesso e Métricas (projetados)

> Baseline projetado que [`../metrics.md`](../metrics.md) confronta com o medido pós-rollout.

| Tipo | Métrica | Meta (projetada) | Janela | Confiança |
|---|---|---|---|---|
| **Primária** | Duração média de cerimônia com 10+ itens (coorte Banco Meridional) | Redução ≥ 20% vs. baseline pré-release | 30 dias pós-release | 75 |
| **Primária** | Renovação do Banco Meridional | Contrato renovado antes de ~2026-06-10 | Até a data de expiração | 85 |
| **Secundária** | Adoção de squads adicionais no Banco Meridional | 3 novos squads ativados | 60 dias pós-release | 70 |
| **Guardrail** | Tickets de CS sobre viés de ancoragem / visibilidade prematura de votos | Zero | Contínuo pós-release | 90 |
| **Guardrail** | Taxa de erros de WebSocket nas sessões | Não aumenta vs. baseline | 30 dias pós-release | 80 |

---

## Handoff ao PM — Gate de Aceite

> O PM tem **autoridade explícita para rejeitar** o PRD e devolvê-lo com gaps específicos (não um genérico "precisa de mais detalhes"). A rejeição e o motivo entram no Histórico de Revisão; o PO trata só os gaps e incrementa a versão. Ver [`interactions/07-po-to-pm.md`](../interactions/07-po-to-pm.md).

| Checklist de entrega | OK? |
|---|---|
| RP congelado (`freezeReady`) e referenciado | ☑ |
| Technical Assessment assinado (ou N/A justificado) | ☑ — N/A: sem escalada arquitetural |
| Reconciliação de escopo registrada | ☑ — escopo do RP mantido integralmente |
| Riscos e dependências consolidados | ☑ |
| Dependências externas explícitas | ☑ |
| Dispositions em aberto visíveis | ☑ |

**Prioridade e contexto de negócio:** demanda de prioridade Alta. Renovação do Banco Meridional (maior conta enterprise) em ~90 dias. O prazo não é negociável — é o constraint de corte de escopo, não de adiamento. PM deve avaliar capacidade da equipe na abertura do planejamento e, se necessário, cortar itens de telemetria avançada antes de cortar funcionalidade de fila ou revelação de votos.
