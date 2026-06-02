# Readiness Package — Queue Voting (Fila de Votação)

> O Readiness Package (RP) é a **definição de pronto de produto** — o output de produto do PO, escrito **sozinho**. Ele é um documento completo e auto-suficiente: visão, problema, escopo, regras, user stories, NFRs, edge cases, critérios e métricas. **O RP não contém seções de autoria do CTO.** A avaliação técnica vive em um artefato separado — o Technical Assessment (não requisitado neste caso) (CTO) — que o RP apenas **referencia** (ver "Referência ao Technical Assessment"). A fusão dos dois acontece no [PRD](./04-prd-queue-voting.md), e é o PRD — não o RP — que abre o downstream. Ver [`personas/02-po.md` §2 e §6.2](../personas/02-po.md).
>
> O RP **herda a camada de confiança** do Registro de Intake vinculado ([`01-intake-record-queue-voting.md`](./01-intake-record-queue-voting.md)): o que entrou como premissa não desaparece na racionalização — é resolvido, ou carregado adiante explicitamente (ver "Prontidão herdada"). Os valores *projetados* (sobretudo as Métricas de Sucesso) carregam confiança e viram o baseline que [`../metrics.md`](../metrics.md) confronta com o realizado pós-entrega.
>
> **Jornada:** [`00 Documento do Submitter`](./00-submitter-brief-queue-voting.md) → [`01 Intake Record (PO — triagem)`](./01-intake-record-queue-voting.md) → `02 Readiness Package (PO)` → `03 Technical Assessment — não requisitado` → [`04 PRD (PO+CTO → PM)`](./04-prd-queue-voting.md).

## Metadados

| Campo | Valor |
|---|---|
| **ID do Pacote** | RP-2026-001 |
| **Versão** | v2 |
| **Intake vinculado** | INT-2026-001 |
| **Responsável** | Lucas Mendes (PO) |
| **Escalada ao CTO** | Não necessária — sem impacto arquitetural |
| **Status** | Aprovado — aguardando planejamento de execução pelo PM |
| **Data de congelamento (freeze)** | 2026-03-28 |

## Histórico de Revisão

| Versão | Data | Autor | Status | Resumo |
|---|---|---|---|---|
| v1 | 2026-03-20 | Lucas Mendes (PO) | Rejeitado pelo PM | Submissão inicial. PM devolveu o pacote citando falta de estratégia de rollout e critérios de aceite indefinidos para edge cases de ocultação de votos. |
| v2 | 2026-03-28 | Lucas Mendes (PO) | Aprovado (`freezeReady`) | Adicionada estratégia de rollout; definidos critérios de aceite para todos os edge cases (desconexão do facilitador, votos parciais no momento do reveal, reconexão de participante durante item ativo). PM aprovou. |

---

## Prontidão herdada e dispositions em aberto

> Resumo do que o Intake entregou e do que continua *soft* na entrada da execução. Premissas e respostas delegadas que sobreviveram à racionalização precisam estar visíveis — não enterradas nas seções.

| Campo | Valor |
|---|---|
| **Readiness Score no handoff do Intake** | 87 % |
| **Premissas ainda a validar** | (1) Autonomia de adoção dos Scrum Masters sem aprovação de TI do cliente — a validar com CS antes da entrega; (2) Ticket por squad dos squads pendentes equivale ao dos ativos — a validar com Finance/CS |
| **Incógnitas de Discovery** | — (nenhuma aberta; não houve fase de Discovery) |
| **Requisitos delegados (com dono)** | — |

> As premissas técnicas sobre WebSocket e schema de sessão foram tratadas durante a racionalização: o Tech Lead confirmou na abertura do breakdown que a infraestrutura existente absorve a extensão sem migração completa. Essas premissas estão resolvidas e não viajam mais como abertas.

---

## Seção 1 — Resumo Executivo  ·  *(bloqueia freeze)*

A plataforma de planning poker atualmente não oferece ao facilitador controle sobre o fluxo de estimativas: todos os itens do backlog ficam visíveis desde o início e os votos aparecem em tempo real conforme são submetidos. Isso gera dois problemas distintos — cerimônias desgovernadas, com participantes formando opiniões fora de ordem, e estimativas enviesadas por ancoragem, onde votantes tardios copiam votos já visíveis.

Este pacote define a adição de duas capacidades complementares: (1) **Fila de Questões** — o facilitador carrega uma lista de histórias e as revela sequencialmente, uma de cada vez, com controles de avançar, pular e retornar; (2) **Votação Secreta** — os votos ficam ocultos de todos os participantes até que o facilitador acione a revelação de forma deliberada.

O gatilho imediato é o risco de renovação do Banco Meridional (R$ 84.000 ARR, vencimento em ~90 dias a partir de março de 2026). A entrega desbloqueará também a adoção de 3 squads adicionais na mesma conta (R$ 28.000 ARR de expansão). A demanda é limitada a UI e estado de sessão — sem nova infraestrutura, sem impacto arquitetural de plataforma.

---

## Seção 2 — Contexto e Problema (a dor, não a solução)  ·  *(bloqueia freeze)*

### Cenário Atual

Quando um facilitador cria uma sala de planning e adiciona itens para estimativa, todos os participantes podem ver a lista completa imediatamente. Os votos são exibidos em tempo real conforme cada participante os submete. O facilitador não tem mecanismo nativo para controlar o ritmo de exposição das histórias nem o timing da revelação dos votos.

### Limitações

- **Sem controle sequencial:** participantes leem à frente e formam opiniões ancoradas antes de o item ser discutido pelo grupo.
- **Sem ocultação de votos:** votantes iniciais influenciam votantes tardios; viés de ancoragem degrada a precisão das estimativas.
- **Facilitador sem controle de fluxo:** o ritmo da cerimônia é ditado pelo votante mais lento, sem mecanismo para o facilitador avançar deliberadamente.

### Dor do Cliente

Os Scrum Masters do Banco Meridional relatam que cerimônias com 10+ histórias levam 40–60% mais tempo do que o esperado. O workaround atual — compartilhar uma história por vez via chat do room — adiciona 15–20 minutos de overhead por cerimônia e coloca o facilitador em modo de operação manual durante toda a sessão.

### Impacto de Negócio

- **Risco de renovação:** R$ 84.000 ARR (4 squads × R$ 21.000). Renovação em ~90 dias. CS sinalizou como risco de churn se a lacuna não for endereçada.
- **Expansão bloqueada:** 3 squads adicionais dentro do Banco Meridional não integrados. A lacuna é o bloqueador de adoção explicitamente citado.
- **Lacuna competitiva:** sinalizada contra 2 ferramentas concorrentes durante a conversa de renovação. Cliente tem alternativas viáveis no mercado.

---

## Seção 3 — Objetivos e Resultado Esperado  ·  *(bloqueia freeze)*

1. Permitir que facilitadores carreguem uma lista de itens e os revelem sequencialmente, um de cada vez, com controles para avançar, pular e retornar.
2. Ocultar os votos de todos os participantes até que o facilitador acione a revelação de forma explícita e deliberada.
3. Reduzir o tempo médio de cerimônia em pelo menos 20% para sessões com 10+ itens (mensurável via telemetria de duração de sessão).
4. Remover o bloqueador de adoção para os 3 squads pendentes no Banco Meridional — desbloqueando R$ 28.000 ARR de expansão.

---

## Seção 4 — Personas Impactadas / Jobs-to-be-done  ·  *(bloqueia freeze)*

| Persona | Job-to-be-done | Impacto |
|---|---|---|
| **Scrum Master / Facilitador** | Conduzir uma cerimônia de planning com ritmo controlado e estimativas sem viés, sem precisar de workarounds manuais | Usuário primário dos novos controles. Ganha controle total do fluxo: quando cada item é apresentado e quando os votos são revelados. |
| **Desenvolvedor / Votante** | Estimar cada história de forma independente, sem ver a estimativa dos colegas antes de votar | Vê apenas o item ativo. Voto registrado, mas valor oculto até a revelação. Menos distração, estimativa mais focada. |
| **Observador** *(papel futuro — fora deste escopo)* | Acompanhar a cerimônia sem participar da votação | Não impactado neste release. |

---

## Seção 5 — Escopo Incluído e Excluído  ·  *(bloqueia freeze)*

### Incluído

- UI do facilitador: capacidade de adicionar uma lista de itens à fila antes ou durante uma sessão
- UI do facilitador: controle "Revelar próximo item" para avançar a fila um item de cada vez
- UI do participante: visualização apenas do item ativo atual (sem visibilidade dos itens na fila)
- Ocultação de votos: todos os votos ficam ocultos até o facilitador acionar "Revelar votos"
- UI do facilitador: controle "Revelar votos", disponível a qualquer momento após o início da votação
- Estado de sessão: persistência da ordem da fila e do estado de revelação através de reconexões
- Controles básicos do facilitador: pular item, retornar ao item anterior, encerrar sessão
- Telemetria de sessão: duração por item e por sessão (necessário para medir os objetivos)

### Excluído

- Timer por item com avanço automático (backlog separado)
- Revelação automática após todos os votos submetidos (poderia ser toggle de preferência — fase futura)
- Exportação ou relatórios de resultados de votação (funcionalidade existente, sem alterações)
- Redesign específico para mobile (layout mobile existente se aplica)
- Co-controle multi-facilitador (modelo de facilitador único por sessão permanece neste release)
- Integração Jira/Linear para importação direta de histórias para a fila

### Adiado (fases futuras)

- Auto-revelação após todos os participantes votarem (toggle opcional) → alimenta Fase 2 do Roadmap
- Reuso de template de fila entre sessões → alimenta Fase 2
- Timer por item → alimenta Fase 2
- Modo co-facilitador → alimenta Fase 2
- Dashboard de analytics de cerimônias → alimenta Fase 3

---

## Seção 6 — Regras de Negócio e Fluxos  ·  *(bloqueia freeze)*

### Regras de Gerenciamento da Fila

1. Apenas o facilitador pode adicionar, reordenar ou remover itens da fila.
2. Os itens na fila não são visíveis para os participantes até serem explicitamente revelados pelo facilitador.
3. O facilitador pode revelar itens em sequência ou pular à frente — mas não pode "des-revelar" um item já revelado sem encerrar e reiniciar a sessão para aquele item.
4. Uma sessão pode ter no máximo 100 itens enfileirados (limite operacional — a confirmar com Tech Lead no breakdown).
5. O facilitador pode retornar a um item já revelado para re-votação; ao retornar, o estado de votos do item anterior é preservado no histórico da sessão.

### Regras de Ocultação de Votos

1. Uma vez que um participante submete um voto, ele é registrado e exibido apenas como "Votou" (indicador binário — sem o valor) para todos os outros participantes.
2. O facilitador vê a contagem de votos submetidos, mas não os valores, até acionar a revelação.
3. O facilitador aciona "Revelar votos" a qualquer momento — isso exibe todos os votos submetidos simultaneamente a todos os participantes.
4. A ocultação é aplicada **server-side**: os valores dos votos não são incluídos nos payloads de broadcast do WebSocket para participantes antes do evento de revelação. O cliente não é responsável pela ocultação — é o servidor.
5. Participantes que não votaram quando a revelação é acionada terão seu espaço exibido como "Não votou" — sem bloqueio do fluxo.
6. Após a revelação, o facilitador pode avançar para o próximo item ou solicitar re-votação do item atual.

### Fluxo de Transição de Estado

```text
Sessão criada
    ↓
Facilitador carrega a fila (1..N itens, máx. 100)
    ↓
Facilitador revela o item 1  →  [Item ativo: votação aberta]
    ↓
Participantes votam  →  cada voto exibido como "Votou" (valor oculto)
    ↓
Facilitador aciona "Revelar votos"
    ↓
Todos os votos exibidos simultaneamente  →  [Item ativo: votos revelados]
    ↓
Facilitador: avançar para item 2  |  re-votar item atual  |  pular  |  encerrar sessão
    ↓
[repetição para cada item da fila]
    ↓
Sessão encerrada  →  histórico de resultados disponível
```

---

## Seção 7 — User Stories + Critérios de Aceite  ·  *(bloqueia freeze)*

### ST-001 — Carregar e Gerenciar a Fila de Itens

**Como** facilitador,
**quero** adicionar uma lista de histórias/questões à fila da sessão e controlá-la durante a cerimônia,
**para que** eu possa conduzir o planning em ordem e no meu ritmo, sem expor itens futuros.

**Critérios de Aceite:**

- [ ] **Dado** que sou o facilitador de uma sessão ativa, **quando** acesso o painel de controle, **então** vejo um campo para adicionar itens à fila (texto livre, um por linha ou um de cada vez).
- [ ] **Dado** que adicionei itens à fila, **quando** verifico a visão dos participantes, **então** os itens na fila não aparecem para nenhum participante — apenas o item ativo é visível.
- [ ] **Dado** que a fila tem itens pendentes, **quando** aciono "Revelar próximo item", **então** o próximo item da fila passa a ser o item ativo e é exibido para todos os participantes.
- [ ] **Dado** que sou o facilitador, **quando** aciono "Pular item", **então** o item atual é marcado como pulado no histórico e o próximo item torna-se ativo.
- [ ] **Dado** que sou o facilitador, **quando** aciono "Retornar ao item anterior", **então** o item precedente torna-se ativo novamente com seu histórico de votos preservado.

### ST-002 — Ocultação e Revelação de Votos

**Como** facilitador,
**quero** que os votos dos participantes fiquem ocultos até que eu os revele,
**para que** cada votante forme sua estimativa de forma independente, sem ser influenciado pelos colegas.

**Critérios de Aceite:**

- [ ] **Dado** que um participante submete um voto, **quando** outro participante verifica a tela, **então** vê "Votou" ao lado do nome do colega — sem o valor da estimativa.
- [ ] **Dado** que o facilitador olha o painel antes da revelação, **quando** verifica os votos, **então** vê a contagem de participantes que votaram, mas não os valores individuais.
- [ ] **Dado** que o facilitador aciona "Revelar votos", **quando** o evento é processado, **então** todos os votos submetidos são exibidos simultaneamente para todos os participantes em ≤ 500ms.
- [ ] **Dado** que um participante não votou quando o facilitador aciona a revelação, **quando** a revelação ocorre, **então** o espaço desse participante é exibido como "Não votou" — sem bloqueio do fluxo.
- [ ] **Dado** que a revelação ocorreu, **quando** um participante tenta inspecionar os payloads WebSocket recebidos antes da revelação, **então** os valores dos votos não estão presentes nesses payloads (verificação: teste de penetração no fluxo de revelação).

### ST-003 — Persistência de Estado na Reconexão

**Como** facilitador ou participante,
**quero** que o estado da sessão (fila, item ativo, votos) seja restaurado se eu me desconectar temporariamente,
**para que** uma queda de conexão não destrua o progresso da cerimônia.

**Critérios de Aceite:**

- [ ] **Dado** que o facilitador se desconecta, **quando** reconecta em até 5 minutos, **então** o estado da fila, o item ativo e todos os votos submetidos são restaurados exatamente como estavam.
- [ ] **Dado** que o facilitador se desconecta e não reconecta em 5 minutos, **quando** o período de graça expira, **então** a sessão é encerrada de forma limpa e os participantes recebem notificação de encerramento.
- [ ] **Dado** que um participante se desconecta durante uma votação ativa e reconecta, **quando** retorna à sessão, **então** vê o item ativo atual e pode votar normalmente; se já havia votado, seu voto está preservado.

---

## Seção 8 — Requisitos Não-Funcionais (NFRs)  ·  *(bloqueia freeze)*

> A lacuna nº 1 que causa retrabalho. Preenchidas as dimensões aplicáveis. O PO descreve o **requisito de qualidade**; a viabilidade e o *como* são do Technical Assessment (não requisitado neste caso — Tech Lead valida no breakdown).

| Dimensão | Requisito | Como será verificado |
|---|---|---|
| **Performance / Eficiência** | Revelação de votos (`votes_revealed`) propagada para todos os participantes da sala em ≤ 500ms em condições normais de uso | Teste de carga com 30+ participantes concorrentes antes do release |
| **Confiabilidade** | Estado de sessão (fila + item ativo + votos) restaurado integralmente após reconexão do facilitador em até 5 minutos | Teste de reconexão forçada em ambiente de QA; verificação de estado antes e depois |
| **Segurança** | Valores dos votos não incluídos nos payloads WebSocket de broadcast para participantes antes do evento `votes_revealed`. Ocultação aplicada server-side, sem dependência de lógica do cliente | Teste de penetração no fluxo de revelação; inspeção de payloads de WebSocket |
| **Usabilidade** | Facilitador consegue configurar e operar a fila + revelação de votos sem treinamento prévio nem apoio de suporte | Validação com ao menos 1 Scrum Master do Banco Meridional antes do release (CS coordena) |
| **Compatibilidade** | Funcionalidade operacional nos navegadores e dispositivos já suportados pela plataforma. Layout mobile existente se aplica sem ajustes. | Testes de regressão nos browsers do smoke test atual |
| **Manutenibilidade** | Feature implantável sem downtime de sessões ativas (deploy incremental). Novos eventos de telemetria (duração por item) disponíveis desde o primeiro deploy. | Estratégia de rollout validada no Tech Backlog; verificação de métricas pós-deploy |

---

## Seção 9 — Edge Cases e Modos de Falha  ·  *(bloqueia freeze)*

- **Participante entra durante item ativo:** vê o item ativo atual e pode votar normalmente. A posição na fila (quantos itens restam) não é exibida ao participante.
- **Participante entra após revelação de votos de um item:** vê o item ativo com votos já revelados. Pode iniciar o próximo item normalmente.
- **Facilitador desconecta durante votação ativa:** sessão pausa automaticamente (sem avançar). Período de graça de 5 minutos para reconexão com restauração de estado. Após 5 min, sessão encerra limpa com notificação a todos os participantes.
- **Todos os participantes votam antes da revelação:** o facilitador ainda controla o timing da revelação. Sem auto-revelação neste release (é comportamento esperado, não um bug).
- **Facilitador pula um item:** item marcado como "Pulado" no histórico da sessão. Pode ser retomado com "Retornar ao item anterior" se for o item imediatamente anterior.
- **Votos parciais no momento da revelação:** participantes que não votaram têm seu espaço exibido como "Não votou". O fluxo não é bloqueado. O facilitador decide se re-vota o item ou avança.
- **Reconexão de participante durante item ativo:** participante reconecta, vê o item ativo, e pode votar se ainda não votou. Se já havia votado, o voto está preservado e exibido como "Votou".
- **Fila vazia ao acionar "Revelar próximo item":** controle desabilitado quando não há próximo item. Facilitador vê indicação visual de "Todos os itens concluídos".
- **Conflito de migração de schema com sessões ativas:** migração de schema roda apenas em sessões com status `encerrado`. Sessões ativas usam schema anterior até encerramento natural.
- **Ordenação de eventos WebSocket sob carga (30+ participantes):** comportamento esperado é consistência eventual — a revelação de votos é idempotente (revelar duas vezes o mesmo item é inócuo). Load test antes do release verifica que não há divergência de estado entre participantes após revelação.

---

## Seção 10 — Métricas de Sucesso (primária · secundária · guardrail)  ·  *(bloqueia freeze)*

> Estes são os valores **projetados** — o baseline que [`../metrics.md`](../metrics.md) confronta com o medido pós-rollout. Inclui indicadores *leading* e *lagging* e dois **guardrails** (métricas que não podem piorar).

| Tipo | Métrica | Meta (projetada) | Janela de medição | Medição (quem/como) | Confiança |
|---|---|---|---|---|---|
| **Primária** | Duração média de cerimônia com 10+ itens (coorte Banco Meridional) | Redução ≥ 20% vs. baseline pré-release | 30 dias pós-release | Telemetria de duração de sessão — comparação antes/depois para a conta | 75 |
| **Primária** | Renovação do Banco Meridional | Contrato renovado antes da data de expiração | Até ~2026-06-10 | CS acompanha resultado da renovação | 85 |
| **Secundária** | Adoção de squads adicionais no Banco Meridional | 3 novos squads ativados em até 60 dias do release | 60 dias pós-release | Dashboard da conta — contagem de ativação de squads | 70 |
| **Secundária** | Satisfação do facilitador | ≥ 4,5/5 em pesquisa pós-cerimônia | 30 dias pós-release | Acompanhamento CS com a conta (se pesquisa for ativada) | 55 |
| **Guardrail** | Tickets de CS sobre viés de ancoragem / visibilidade prematura de votos | Zero tickets sobre este tema pós-release | Contínuo pós-release | Tagueamento de tickets de CS | 90 |
| **Guardrail** | Taxa de erros de WebSocket nas sessões | Não aumenta vs. baseline pré-release | 30 dias pós-release | Observabilidade / APM da plataforma | 80 |

---

## Seção 11 — Critérios de Sucesso e Aceite (do release)  ·  *(bloqueia freeze)*

Indicadores de alto nível que definem "concluído e valioso" para **este release** — distintos das métricas contínuas da Seção 10.

| Critério | Tipo | Indicador | Valor alvo |
|---|---|---|---|
| Contrato do Banco Meridional renovado | Negócio | Renovação assinada antes da data de expiração | R$ 84.000 ARR retido |
| 3 squads pendentes integrados | Negócio | Ativação confirmada no dashboard da conta | R$ 28.000 ARR desbloqueado (em até 60 dias do release) |
| Duração de cerimônia reduzida | Operacional | Queda ≥ 20% no tempo médio de sessão para sessões com 10+ itens | ≥ 20% redução (medida via telemetria) |
| Workaround manual eliminado | Operacional | Zero tickets de CS reportando compartilhamento manual de histórias pós-release | 0 tickets |
| Zero incidentes de ancoragem de votos | Qualidade | Zero tickets de CS sobre votos visíveis antes da revelação | 0 tickets |
| Funcionalidade adotada sem treinamento | UX | Facilitadores operam fila e revelação sem intervenção de suporte | 0 chamados de onboarding sobre esta feature |
| Deploy sem impacto em sessões ativas | Operacional | Zero sessões interrompidas pelo deploy | 0 incidentes de downtime relacionados ao release |

---

## Seção 12 — Riscos e Dependências (de produto e negócio)  ·  *(bloqueia freeze)*

> Riscos técnicos pertencem ao Technical Assessment do CTO (não requisitado neste caso — validados pelo Tech Lead no breakdown). Aqui ficam os riscos de produto, negócio, adoção e externos.

| Risco | Tipo | Probabilidade | Impacto | Mitigação |
|---|---|---|---|---|
| Prazo de renovação não cumprido se esforço real superar o estimado | Prazo | Baixa | Alto | PM avalia capacidade da equipe na abertura do planejamento. Se o escopo precisar ser cortado, os controles básicos do facilitador têm precedência sobre telemetria avançada. |
| Scrum Masters do Banco Meridional sem autonomia de adoção (premissa não validada) | Externo | Baixa | Médio | CS valida com o contato do cliente antes da entrega. Se falsa, envolvimento de TI do cliente pode atrasar a adoção mas não bloqueia o release. |
| Viés de ancoragem não totalmente eliminado (participantes conversam verbalmente) | Produto | Alta | Baixo | Aceito — a plataforma controla apenas a visibilidade digital. Escopo correto. |
| Adoção pelos 3 squads pendentes mais lenta que o esperado | Adoção | Média | Médio | CS coordena onboarding ativo pós-release. Meta de 60 dias é conservadora. |
| Baixa satisfação do facilitador se a UX dos controles não for intuitiva | Produto | Baixa | Médio | Validação com ao menos 1 Scrum Master do Banco Meridional antes do release. UX review com o time de design no breakdown. |

**Dependências (de produto/negócio):**

- CS (Ana Costa) disponível para validar premissa de autonomia de adoção antes da entrega
- Coordenação de CS para onboarding ativo dos 3 squads pendentes pós-release
- PM com capacidade para planejar e executar dentro do prazo de 90 dias

---

## Seção 13 — Avaliação Preliminar de Esforço e Custo

> Somente uso interno. **Preliminar** — estimativa do PO para sustentar sequenciamento. O número **firme** vem do Tech Lead no Tech Backlog. Não é compromisso contratual nem material para cliente.

| Área | Estimativa preliminar | Confiança |
|---|---|---|
| Backend (estado de sessão + eventos WebSocket) | 5 dias (mid-senior) | 65 |
| Frontend — UI do facilitador | 4 dias (mid) | 65 |
| Frontend — UI do participante | 2 dias (mid) | 70 |
| QA (funcional + segurança + carga) | 3 dias (QA) | 60 |
| **Total preliminar** | **14 dias** | |

**Sinais de custo a confirmar pelo Tech Lead:** sem nova infraestrutura, sem serviços externos, sem procurement. Impacto de opex: aumento de ~2–3% no armazenamento de observabilidade pelo volume de eventos de telemetria adicionados — nenhuma ação de orçamento necessária.

---

## Seção 14 — Roadmap Sugerido

### MVP (este release)

- Gerenciamento de fila (adicionar, ordenar, revelar um item de cada vez)
- Ocultação de votos com revelação controlada pelo facilitador
- Persistência de estado de sessão através de reconexões (período de graça de 5 min)
- Controles básicos do facilitador (pular, retornar, encerrar)
- Telemetria de duração de sessão e por item

### Fase 2 (backlog futuro)

- Auto-revelação após todos os participantes votarem (toggle de preferência opcional)
- Timer por item com avanço automático opcional
- Reuso de template de fila entre sessões
- Modo co-facilitador (múltiplos facilitadores compartilhando controle)

### Fase 3 (backlog futuro)

- Dashboard de analytics de cerimônias (tempo por item, taxa de consenso, frequência de revisão)
- Integração com Jira/Linear para importação direta de histórias para a fila

---

## Referência ao Technical Assessment  ·  *(bloqueia freeze se requisitado)*

> Esta é a **ponte** (`TechAssessmentRef`), não conteúdo. O RP referencia o veredito do CTO — não o absorve. A fusão acontece no [PRD](./04-prd-queue-voting.md).

| Campo | Valor |
|---|---|
| **Status** | Não requisitado |
| **Veredito de viabilidade** | — |
| **Technical Assessment vinculado** | N/A |
| **Constraints rígidas que afetam o escopo** | — (nenhuma identificada na triagem; premissas técnicas validadas como razoáveis pelo Tech Lead na abertura do breakdown) |

> **Gate de congelamento (`freezeReady`):** todas as seções `bloqueia freeze` estão resolvidas na v2. Technical Assessment não foi requisitado — sem dependência de assinatura do CTO. O RP está congelado a partir de 2026-03-28.
