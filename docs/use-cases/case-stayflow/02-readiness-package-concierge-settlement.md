# Readiness Package — Concierge & Settlement

> O Readiness Package (RP) é a **definição de pronto de produto** — o output de produto do PO, escrito **sozinho**. Ele é um documento completo e auto-suficiente: visão, problema, escopo, regras, user stories, NFRs, edge cases, critérios e métricas. **O RP não contém seções de autoria do CTO.** A avaliação técnica vive em um artefato separado — o [Technical Assessment](./03-technical-assessment-concierge-settlement.md) (CTO) — que o RP apenas **referencia** (ver "Referência ao Technical Assessment"). A fusão dos dois acontece no [PRD](./04-prd-concierge-settlement.md), e é o PRD — não o RP — que abre o downstream. Ver [`personas/02-po.md` §2 e §6.2](../../../personas/02-po.md).
>
> O RP **herda a camada de confiança** do Registro de Intake vinculado ([`01-intake-record-concierge-settlement.md`](./01-intake-record-concierge-settlement.md)): o que entrou como premissa, incógnita de Discovery ou resposta delegada não desaparece na racionalização — é resolvido, ou carregado adiante explicitamente (ver "Prontidão herdada"). Os valores *projetados* (sobretudo as Métricas de Sucesso) carregam confiança e viram o baseline que [`../../../metrics.md`](../../../metrics.md) confronta com o realizado pós-entrega.
>
> **Jornada:** [`00 Documento do Submitter`](./00-submitter-brief-concierge-settlement.md) → [`01 Intake Record (PO — triagem)`](./01-intake-record-concierge-settlement.md) → `02 Readiness Package (PO)` → [`03 Technical Assessment (CTO)`](./03-technical-assessment-concierge-settlement.md) → [`04 PRD (PO+CTO → PM)`](./04-prd-concierge-settlement.md).

## Metadados

| Campo | Valor |
|---|---|
| **ID do Pacote** | RP-2026-050 |
| **Versão** | v1 |
| **Intake vinculado** | INT-2026-050 |
| **Responsável** | Rafael Souza (PO) |
| **Escalada ao CTO** | Sim — Technical Assessment TA-2026-050 |
| **Status** | Congelado (`freezeReady = true`) |
| **Data de congelamento (freeze)** | 2026-04-25 |

## Histórico de Revisão

| Versão | Data | Autor | Status | Resumo |
|---|---|---|---|---|
| v1 | 2026-04-22 | Rafael Souza (PO) | Rascunho | Início da racionalização pós-Discovery. |
| v1 | 2026-04-25 | Rafael Souza (PO) | Congelado | TA-2026-050 retornou assinado. RP congelado com `freezeReady = true`. |

---

## Prontidão herdada e dispositions em aberto

> Resumo do que o Intake entregou e do que continua *soft* na entrada da execução. Premissas, incógnitas e respostas delegadas que sobreviveram à racionalização precisam estar visíveis — não enterradas nas seções. Ver [`../../../personas/01-submitter.md` §6](../../../personas/01-submitter.md).

| Campo | Valor |
|---|---|
| **Readiness Score no handoff do Intake** | 81 % (brief 00) |
| **Premissas ainda a validar** | (1) Percentuais de comissão por hotel: cadastrados em planilha; precisam ser migrados para o banco de dados do Settlement Service antes do go-live — ação do FinOps; (2) Regra de retenção de IR: campo configurável por hotel — requer revisão contrato a contrato pelo FinOps antes do go-live |
| **Incógnitas de Discovery** | Todas as 3 resolvidas (ver Discovery Log no Intake Record) |
| **Requisitos delegados (com dono)** | Migração dos percentuais de comissão para o sistema: Bruno Takeda (FinOps) — pre-condição para go-live |

> Se uma premissa carregada aqui se provar falsa durante a execução, a demanda deve ser reavaliada — o mesmo gatilho de retriagem do intake se aplica downstream. Em particular: se a migração para Stripe Connect revelar incompatibilidade com o modelo de split por hotel (contratos antigos com regras que o Stripe não suporta), o escopo de Settlement deve ser revisitado com o CTO.

---

## Seção 1 — Resumo Executivo  ·  *(bloqueia freeze)*

A StayFlow opera hoje com dois gargalos operacionais que crescem linearmente com o volume de reservas: o atendimento ao hóspede é 100% humano mesmo para perguntas de rotina, gerando fila, custo e insatisfação; o repasse financeiro ao hotel parceiro é executado manualmente, com erros de percentual que já ameaçaram dois contratos de parceria.

Este RP define **duas capacidades que serão entregues juntas** sob o nome Concierge & Settlement:

1. **Concierge Service** — atendimento automatizado ao hóspede na 1ª camada (IA), com handoff estruturado para especialista humano quando necessário, contexto de reserva em tempo real e filas de atendimento por categoria.
2. **Settlement Service** — motor de split e repasse financeiro: cálculo automático (percentual por hotel), execução via Stripe Connect, idempotência por transação, tratamento de falhas, conciliação e exportação de dados para reconciliação contábil.

O resultado esperado: resolver o risco imediato de rescisão do parceiro Gran Vista (repasse correto e confiável), reduzir CSAT de hóspede para ≥ 4,3/5, e criar uma base operacional que suporte o crescimento sem escalar custo de atendimento ou equipe financeira proporcionalmente.

A demanda chegou como "chatbot + automação de repasse" — dois pedidos aparentemente simples. A passagem pelo intake revelou dois domínios com regras de negócio, edge cases, requisitos não-funcionais e integrações que, somados, representam esforço médio-grande. Este RP documenta o tamanho real do que precisa ser construído para que a solução seja confiável.

---

## Seção 2 — Contexto e Problema (a dor, não a solução)  ·  *(bloqueia freeze)*

> **Regra de ouro:** problema antes da solução. Se esta seção descreve uma solução em vez do problema, ela não está satisfeita — o mesmo princípio que a Submitter aplica ao requisito 1 dela.

### Cenário Atual

A StayFlow é uma OTA/marketplace: o hóspede reserva e paga pela plataforma; a StayFlow retém comissão e repassa o saldo ao hotel. Há dois fluxos operacionais que hoje são inteiramente manuais:

**Atendimento:** quando um hóspede tem dúvida ou problema (status da reserva, confirmação de check-in, política de cancelamento, problemas com o quarto), abre um ticket no canal de atendimento. Todos os tickets chegam para os agentes humanos, independentemente da complexidade. Não há triagem, categorização automática, nem resposta automatizada.

**Repasse:** ao final de cada período (quinzena ou mês, conforme o contrato com o hotel), a equipe de FinOps exporta as reservas do período, consulta a planilha de percentuais de comissão por hotel, calcula o valor líquido, executa a TED manualmente e registra o pagamento em outra planilha. Cada hotel tem seu percentual de comissão e, em alguns casos, retenção de IR na fonte.

### Limitações

- **Sem triagem automática de atendimento:** qualquer pergunta vai para um agente humano. Perguntas de FAQ consomem o mesmo tempo de atendente que casos de cancelamento ou disputa financeira.
- **Sem handoff com contexto:** quando um ticket é escalado de um canal para um especialista humano, o hóspede começa do zero — sem histórico da conversa, sem dados da reserva exibidos para o atendente.
- **Sem persistência de contexto entre canais:** se o hóspede tentou resolver por e-mail antes de ligar, o agente não tem acesso a esse histórico.
- **Cálculo de repasse 100% manual:** a lógica de split (percentual por hotel, retenção de IR) é executada por humanos em planilha a cada ciclo. Qualquer erro de digitação gera um repasse incorreto.
- **Sem idempotência:** se um repasse for iniciado e falhar, não há garantia de que a retentativa não vai gerar um pagamento duplicado.
- **Sem reconciliação automatizada:** não há cruzamento automático entre o valor esperado do repasse (com base nas reservas do período) e o valor efetivamente enviado.
- **Sem tratamento de falha de pagamento:** quando uma TED falha, o processo de retentativa é manual e não estruturado.

### Dor do Cliente

**Hóspede:** espera em fila por até 4h nos picos de demanda para obter informações que estão disponíveis no sistema. Quando é transferido para um especialista, precisa repetir todo o histórico da ocorrência. CSAT médio de 3,8/5 reflete a frustração com o processo.

**Hotel parceiro:** recebe repasses que, em 12% dos ciclos, têm valor diferente do esperado (erro de percentual ou cálculo). Sem um portal de transparência ou conciliação automática, o hotel só descobre o erro quando compara com seu próprio controle. Dois parceiros já ameaçaram rescisão; um chargeback foi absorvido pela StayFlow por ausência de cobertura contratual clara.

**FinOps interno:** dedica ~18 horas por semana a tarefas mecânicas (exportar, calcular, executar TED, registrar). Com o crescimento de reservas, esse tempo crescerá linearmente — a menos que o processo seja automatizado.

### Impacto de Negócio

- Risco de perda de parceiros: estimativa de ~R$ 140k GMV/ano se os dois parceiros em risco rescindirem.
- Custo crescente de atendimento: R$ 28k+/mês atual; escala com volume de reservas.
- Exposição a penalidades contratuais: cláusula de 2% sobre valor de repasse incorreto em pelo menos um contrato.
- CSAT de hóspede correlaciona com taxa de recompra — queda de satisfação compromete crescimento orgânico.

---

## Seção 3 — Objetivos e Resultado Esperado  ·  *(bloqueia freeze)*

Objetivos numerados que esta entrega deve alcançar. Cada objetivo deve ser observável após o release.

1. **Desafogar o time de atendimento** na 1ª camada: resolver automaticamente pelo menos 55% dos tickets de hóspedes sem intervenção humana, reduzindo fila e custo.
2. **Melhorar CSAT de hóspede** para ≥ 4,3/5 em 60 dias pós-release, por meio de respostas mais rápidas e contextualizadas.
3. **Zerar erros de percentual de repasse**: nenhum repasse executado com percentual diferente do contratado — taxa de repasse correto ≥ 99,5%.
4. **Eliminar o risco de duplicidade de repasse** via idempotência por transação: zero casos de repasse duplicado em operação normal.
5. **Reduzir carga manual do FinOps** no ciclo de repasse para < 4 horas/semana (de ~18h atual).
6. **Proteger a confiança dos hotéis parceiros**: nenhuma rescisão por motivo de erro de repasse nos 90 dias pós-release.
7. **Habilitar handoff com contexto completo**: quando um ticket for escalado do Concierge para um especialista, o especialista deve receber o histórico completo da conversa e os dados da reserva sem solicitar ao hóspede.

---

## Seção 4 — Personas Impactadas / Jobs-to-be-done  ·  *(bloqueia freeze)*

| Persona | Job-to-be-done | Impacto |
|---|---|---|
| **Hóspede** | Obter resposta rápida para dúvidas sobre sua reserva (status, check-in, cancelamento, problemas) sem esperar em fila. | Usuário primário do Concierge. Espera que o sistema entenda o contexto da *sua* reserva, não apenas responda FAQs genéricos. |
| **Atendente especialista (CS)** | Focar nos casos que genuinamente precisam de julgamento humano (disputas, casos complexos, reclamações sérias) sem perder tempo em perguntas de rotina; receber o contexto completo quando o hóspede chegar escalado. | Usuário do sistema de filas + handoff. Precisa ver o histórico da conversa anterior e os dados da reserva do hóspede ao assumir o ticket. |
| **Hotel parceiro** | Receber o valor correto do repasse, no prazo, com previsibilidade — e poder verificar o cálculo. | Beneficiário final do Settlement Service. Não interage diretamente com a plataforma (portal do parceiro está adiado), mas sente diretamente se o repasse for errado ou atrasado. |
| **FinOps (StayFlow)** | Encerrar o ciclo de repasse de cada período com confiança de que todos os hotéis foram pagos corretamente, sem deduzir horas para tarefa manual. | Operador do Settlement Service. Precisa de visibilidade dos repasses executados, status por hotel, e exportação para reconciliação. |
| **Gestor de CS / Operações** | Monitorar o desempenho do Concierge (taxa de resolução 1ª camada, CSAT, volume de escalações) e ajustar regras de escalonamento sem envolver engenharia. | Usuário do painel de gestão do Concierge (configuração de regras de escalonamento e relatórios). |

---

## Seção 5 — Escopo Incluído e Excluído  ·  *(bloqueia freeze)*

> Protege o downstream de scope creep.

### Incluído

**Concierge Service:**
- Chatbot de 1ª camada alimentado por LLM, com base de conhecimento da StayFlow (FAQs, políticas de cancelamento, instruções de check-in, status de reservas)
- Integração com API interna de reservas (`/reservations/{id}/context`) para responder com dados reais da reserva do hóspede
- Regras de escalonamento configuráveis (por tipo de pergunta, por palavras-chave, por número de tentativas sem resolução, por solicitação explícita do hóspede)
- Handoff para Zendesk: abertura automática de ticket com histórico completo da conversa + dados da reserva + categoria inferida
- Filas de atendimento por categoria (financeiro, check-in/out, problemas com quarto, cancelamento) — atendentes especialistas recebem tickets já triados
- CSAT coletado ao final de cada interação (Concierge e especialista)
- Painel de gestão: taxa de resolução 1ª camada, volume de tickets por categoria, escalações por regra, CSAT por canal
- Configuração de regras de escalonamento via interface (sem deploy de código)

**Settlement Service:**
- Motor de split: cálculo automático por reserva com base no percentual de comissão cadastrado por hotel
- Campo de retenção de IR na fonte: configurável por hotel (sim/não + alíquota)
- Integração com Stripe Connect: criação de connected accounts por hotel, execução do repasse, webhook de confirmação
- Idempotência por transação: cada repasse tem uma chave de idempotência única — retentativas não geram duplicidade
- Tratamento de falha de pagamento: retentativa automática (até 3 tentativas com backoff exponencial), alerta para FinOps após falha persistente
- Ledger de transações: registro imutável de cada repasse (valor bruto, comissão retida, IR retido, valor líquido, status, timestamp)
- Conciliação automática: cruzamento entre repasses esperados (reservas encerradas no período) e repasses executados, com relatório de divergências
- Exportação de dados por hotel/período para reconciliação contábil (CSV/XLSX)
- Painel FinOps: status de repasses do período corrente, hotéis com falha, histórico por hotel

### Excluído

- Portal do hotel parceiro (autoatendimento do hotel para consultar seus repasses e emitir NF) — adiado para Fase 2
- Integração com emissão de NF do hotel — adiado para Fase 2 (cada hotel tem seu sistema fiscal)
- Chatbot em canais adicionais (WhatsApp, app mobile) — Fase 1 foca no canal web (widget na plataforma StayFlow)
- Substituição do Zendesk por outro sistema de helpdesk — fora de escopo
- Multi-moeda — fora de escopo (operação 100% em BRL no momento)
- Relatórios de BI avançados (dashboards históricos, análise de tendência, benchmarking) — Fase 2
- Emissão automática de comprovante de repasse por e-mail ao hotel — Fase 2 (simples de fazer, mas adiado para não complicar o MVP)

### Adiado (fases futuras)

- Portal do parceiro com extrato de repasses e autoatendimento — Fase 2
- Integração com emissor de NF do hotel (por CNPJ/regime tributário) — Fase 2
- Chatbot em WhatsApp e app mobile — Fase 2
- Analytics avançado de atendimento e financeiro — Fase 2
- Notificação proativa ao hotel sobre repasse agendado — Fase 2

---

## Seção 6 — Regras de Negócio e Fluxos  ·  *(bloqueia freeze)*

### Bloco 1 — Regras do Concierge Service

**RN-C01.** O Concierge responde a perguntas de categoria: status de reserva, políticas de cancelamento, check-in/check-out, problemas com quarto, dúvidas de pagamento. Perguntas fora dessas categorias são escaladas automaticamente para o especialista.

**RN-C02.** Para perguntas sobre reserva específica, o Concierge deve identificar o hóspede (via login ou token de sessão) e consumir a API de contexto antes de responder. Sem contexto, a resposta não pode ser personalizada — o sistema deve informar ao hóspede e oferecer escalação.

**RN-C03.** Escalonamento obrigatório quando: (a) o hóspede solicitar explicitamente falar com humano; (b) a mesma intenção não for resolvida após 2 tentativas do Concierge; (c) o conteúdo contiver palavras-chave de urgência (emergência, acidente, quarto invadido, criança, perigo); (d) a categoria inferida for "disputa financeira" ou "cancelamento com penalidade".

**RN-C04.** No handoff para especialista: o Concierge fecha a conversa no canal do bot e abre um ticket no Zendesk contendo: (a) transcrição completa da conversa com timestamps; (b) dados da reserva via API de contexto (guest_name, hotel_name, check_in, check_out, status, booking_id, room_type); (c) categoria inferida; (d) motivo de escalonamento; (e) identificador do hóspede.

**RN-C05.** Filas de Zendesk por categoria: Financeiro, Hospedagem (check-in/out), Problemas com Quarto, Cancelamento, Geral. A categoria inferida pelo Concierge determina a fila de destino. O gestor de CS pode reconfigurar as regras de categorização via interface de gestão sem deploy de código.

**RN-C06.** CSAT é coletado ao final de toda interação — tanto do Concierge (bot) quanto do especialista (Zendesk). A nota do Concierge é separada da nota do especialista. Interações de handoff geram dois registros de CSAT separados.

**RN-C07.** O Concierge não tem autoridade para executar ações transacionais (cancelar reserva, emitir reembolso, alterar datas). Para todas essas ações, escala para especialista. O Concierge informa, explica e orienta — nunca executa.

**RN-C08.** Se a API de contexto de reservas estiver indisponível (timeout > 2s ou erro 5xx), o Concierge responde com as informações que tiver (sem personalização de reserva) e informa o hóspede da limitação temporária. Não bloqueia a conversa.

### Bloco 2 — Regras do Settlement Service

**RN-S01.** Cada repasse é calculado por reserva: `valor_repasse = valor_total_reserva × (1 - percentual_comissão_hotel) - IR_retido (se aplicável)`. O percentual de comissão é o registrado no cadastro do hotel no momento do cálculo — não é retroativo.

**RN-S02.** O repasse é executado somente para reservas com status `check-out concluído` e `pagamento do hóspede confirmado`. Reservas canceladas com reembolso integral não geram repasse. Cancelamentos com penalidade geram repasse proporcional à penalidade cobrada.

**RN-S03.** Cada repasse tem uma `idempotency_key` gerada a partir de `hotel_id + periodo + hash(reservas)`. A mesma chave em tentativas repetidas garante exatamente um repasse executado — o Stripe Connect rejeitará a duplicata.

**RN-S04.** Ciclo de repasse: configurável por hotel (quinzenal ou mensal). O trigger pode ser automático (data do ciclo) ou manual (FinOps). O disparo manual sempre exige confirmação explícita do operador antes da execução.

**RN-S05.** Tratamento de falha de repasse: retentativa automática em 1h, 4h e 24h (backoff exponencial). Após 3 falhas, o repasse é marcado como `falha_persistente` e o FinOps recebe alerta com detalhes da falha. O hotel não é notificado automaticamente sobre a falha — isso é feito pelo FinOps após triagem.

**RN-S06.** Retenção de IR na fonte: se o hotel tiver o campo `retencao_ir = true` + `aliquota_ir`, o valor retido é calculado sobre o valor do repasse líquido e registrado no ledger. O FinOps é responsável por recolher o IR. O sistema calcula e registra — não recolhe.

**RN-S07.** Reconciliação automática: após cada ciclo de repasse, o sistema compara o total de repasses esperados (soma das reservas encerradas no período × percentual por hotel) com o total de repasses executados confirmados. Qualquer divergência > 0,01% do valor total gera um alerta automático para o FinOps.

**RN-S08.** Repasse parcial: não permitido. Se uma reserva tiver disputa aberta (chargeback em andamento), ela não entra no ciclo de repasse até resolução da disputa. O FinOps recebe alerta de reservas bloqueadas no ciclo.

**RN-S09.** Se o percentual de comissão cadastrado diferir do percentual no contrato do hotel (detectado por auditoria manual ou por reclamação do hotel), o repasse não pode ser reprocessado retroativamente de forma automática — exige aprovação do FinOps com registro de justificativa. O sistema expõe a divergência, mas não corrige automaticamente.

**RN-S10.** O ledger é imutável: nenhum registro pode ser editado ou excluído após a inserção. Correções são feitas via lançamentos de ajuste com referência ao registro original.

### Fluxo de Transição de Estado — Concierge

```text
Hóspede inicia contato
    ↓
Concierge identifica o hóspede (token de sessão ou login)
    ↓
Concierge consulta API de contexto (/reservations/{id}/context)
    ↓ (se disponível)
Concierge categoriza a intenção da pergunta
    ↓
[Resolução direta]
  Concierge responde com base no contexto + base de conhecimento
    ↓
  Hóspede satisfeito? → CSAT coletado → Conversa encerrada
    ↓ (se não resolvido após 2 tentativas ou regra de escalonamento)
[Escalonamento]
  Concierge abre ticket no Zendesk (transcrição + contexto + categoria + motivo)
    ↓
  Ticket roteado para fila correta (por categoria)
    ↓
  Especialista assume o ticket com contexto completo
    ↓
  Especialista resolve → CSAT coletado → Ticket encerrado
```

### Fluxo de Transição de Estado — Settlement

```text
Trigger do ciclo de repasse (automático ou manual)
    ↓
Sistema busca reservas com check-out no período E pagamento confirmado
    ↓
Para cada hotel: calcula repasse = reservas × (1 - comissão) - IR retido
    ↓
Gera idempotency_key por hotel + período
    ↓
Executa via Stripe Connect (connected account do hotel)
    ↓
[Sucesso] → Webhook de confirmação → Ledger atualizado → Status: repasse_confirmado
    ↓
[Falha] → Retentativa 1h / 4h / 24h
    ↓ (se 3 falhas)
Status: falha_persistente → Alerta FinOps
    ↓
Reconciliação: total esperado vs. total confirmado
    ↓ (se divergência > 0,01%)
Alerta de divergência → FinOps revisa
    ↓
Exportação de dados do período por hotel (CSV/XLSX)
```

---

## Seção 7 — User Stories + Critérios de Aceite  ·  *(bloqueia freeze)*

> Uma história por bloco de valor. Critério de aceite **verificável por não-dev**, no formato Given/When/Then, com limites específicos.

### ST-001 — Resposta contextualizada do Concierge

**Como** hóspede com uma reserva ativa,  
**quero** receber uma resposta sobre minha reserva específica (status, check-in, etc.) sem precisar repetir meus dados,  
**para que** eu resolva minha dúvida sem esperar em fila de atendimento humano.

**Critérios de Aceite:**
- [ ] **Dado** que um hóspede autenticado inicia uma conversa no Concierge, **quando** ele pergunta sobre o status da sua reserva, **então** o Concierge responde com os dados reais da reserva (nome do hotel, data de check-in/out, status) buscados via API de contexto em até 3 segundos.
- [ ] **Dado** que o Concierge recebe uma pergunta sobre política de cancelamento, **quando** a reserva do hóspede está a mais de 48h do check-in, **então** o Concierge informa a política de cancelamento sem penalidade e os passos para solicitar, sem escalar para humano.
- [ ] **Dado** que a API de contexto retorna erro 5xx, **quando** o hóspede pergunta sobre sua reserva, **então** o Concierge informa que não consegue acessar os dados no momento e oferece escalonamento para especialista ou contato posterior — sem travar a conversa ou apresentar mensagem de erro técnico.

### ST-002 — Escalonamento com contexto para especialista

**Como** atendente especialista de CS,  
**quero** receber um ticket de Concierge já com o histórico da conversa e os dados da reserva do hóspede,  
**para que** eu possa retomar o caso sem pedir ao hóspede que repita o histórico.

**Critérios de Aceite:**
- [ ] **Dado** que o Concierge escala um ticket para o Zendesk, **quando** o atendente abre o ticket, **então** ele deve ver: (a) transcrição completa da conversa com timestamps, (b) dados da reserva (nome do hóspede, hotel, check-in/out, status, booking_id, tipo de quarto), (c) categoria inferida pelo Concierge, (d) motivo do escalonamento.
- [ ] **Dado** que o ticket é criado com categoria "Financeiro", **quando** ele chega ao Zendesk, **então** ele é roteado automaticamente para a fila de Financeiro — sem ação manual do operador.
- [ ] **Dado** que o hóspede solicitou explicitamente falar com um humano, **quando** o ticket é criado, **então** o campo "motivo_escalonamento" deve registrar "solicitação_do_hóspede" (não "não_resolvido").

### ST-003 — Coleta de CSAT pós-atendimento

**Como** gestor de CS/Operações,  
**quero** que o CSAT seja coletado ao final de cada interação (Concierge e especialista),  
**para que** eu possa monitorar a qualidade separadamente por canal e identificar onde a experiência está falhando.

**Critérios de Aceite:**
- [ ] **Dado** que uma conversa do Concierge é encerrada (resolvida ou escalada), **quando** o encerramento ocorre, **então** o hóspede recebe uma mensagem de CSAT com escala de 1 a 5 — e a nota fica disponível no painel de gestão em até 5 minutos.
- [ ] **Dado** que um ticket do Zendesk é encerrado pelo especialista, **quando** o status muda para "Resolvido", **então** o Zendesk dispara a pesquisa de CSAT do especialista — nota separada da do Concierge para o mesmo caso.
- [ ] **Dado** que um hóspede não responde à pesquisa de CSAT em 24h, **então** o caso é contabilizado como "sem resposta" — não como zero — no painel de gestão.

### ST-004 — Configuração de regras de escalonamento pelo gestor

**Como** gestor de CS/Operações,  
**quero** ajustar as regras que definem quando o Concierge escala para um especialista (palavras-chave, número de tentativas, categorias),  
**para que** eu possa refinar o comportamento sem precisar acionar engenharia para cada ajuste.

**Critérios de Aceite:**
- [ ] **Dado** que o gestor acessa o painel de gestão do Concierge, **quando** ele edita uma regra de escalonamento (ex.: adiciona uma palavra-chave de urgência), **então** a regra passa a valer na próxima conversa — sem necessidade de deploy de código.
- [ ] **Dado** que o gestor define que "categoria: disputa financeira" sempre escala imediatamente, **quando** o Concierge categoriza uma pergunta como "disputa financeira", **então** o escalonamento ocorre sem tentar resolver na 1ª camada.
- [ ] **Dado** que uma configuração inválida é submetida (ex.: número de tentativas = 0), **quando** o gestor tenta salvar, **então** o sistema exibe mensagem de validação e não salva a configuração inválida.

### ST-005 — Cálculo automático do repasse

**Como** FinOps,  
**quero** que o sistema calcule o repasse de cada hotel automaticamente com base nas reservas encerradas no período e no percentual de comissão do contrato,  
**para que** eu não precise calcular manualmente e o risco de erro humano seja eliminado.

**Critérios de Aceite:**
- [ ] **Dado** que o ciclo de repasse é disparado (automático ou manual), **quando** o sistema processa as reservas do período de um hotel, **então** o valor calculado por reserva deve ser exatamente `valor_total × (1 - percentual_comissão) - IR_retido` — verificável via relatório de cálculo exportável.
- [ ] **Dado** que o percentual de comissão de um hotel é 15% e a reserva foi de R$ 1.000,00, **quando** o repasse é calculado (sem IR), **então** o valor do repasse deve ser exatamente R$ 850,00 — sem arredondamentos incorretos.
- [ ] **Dado** que um hotel tem `retencao_ir = true` com alíquota de 1,5%, **quando** o repasse de R$ 850,00 é calculado, **então** o IR retido deve ser R$ 12,75 e o repasse líquido R$ 837,25 — ambos registrados no ledger com itens separados.

### ST-006 — Idempotência do repasse

**Como** FinOps,  
**quero** que um repasse executado nunca seja duplicado, mesmo em caso de falha e retentativa,  
**para que** um hotel nunca receba o mesmo repasse duas vezes.

**Critérios de Aceite:**
- [ ] **Dado** que um repasse foi executado com sucesso e confirmado pelo webhook do Stripe, **quando** o mesmo ciclo é disparado novamente (por erro ou retentativa manual), **então** o sistema identifica a `idempotency_key` duplicada e retorna o resultado do repasse original — sem executar novo pagamento.
- [ ] **Dado** que um repasse falhou na primeira tentativa e a retentativa é disparada em 1h, **quando** a retentativa usa a mesma `idempotency_key`, **então** o Stripe Connect trata como a mesma transação — sem pagamento duplicado, mesmo se a primeira tentativa tiver sido parcialmente processada.
- [ ] **Dado** que dois operadores disparam manualmente o ciclo do mesmo hotel no mesmo período simultaneamente, **quando** ambas as requisições chegam, **então** somente uma é processada — a segunda retorna erro de conflito com referência ao repasse original.

### ST-007 — Tratamento de falha de repasse

**Como** FinOps,  
**quero** ser alertado quando um repasse falhar após todas as retentativas,  
**para que** eu possa intervir manualmente e resolver antes que o hotel seja prejudicado.

**Critérios de Aceite:**
- [ ] **Dado** que um repasse falha na execução, **quando** a falha ocorre, **então** o sistema agenda automaticamente retentativas em 1h, 4h e 24h — sem intervenção manual.
- [ ] **Dado** que as 3 retentativas automáticas falharam, **quando** a terceira falha ocorre, **então** o FinOps recebe alerta (e-mail + notificação no painel) com: hotel, período, valor esperado, motivo da falha, e link para ação manual.
- [ ] **Dado** que um repasse está em status `falha_persistente`, **quando** o FinOps aciona o repasse manual pelo painel com confirmação explícita, **então** uma nova tentativa é executada com nova `idempotency_key` baseada no timestamp da ação manual — registrada no ledger como "repasse_manual" com identificação do operador.

### ST-008 — Conciliação automática

**Como** FinOps,  
**quero** que o sistema compare automaticamente o total de repasses esperados com o total executado após cada ciclo,  
**para que** eu identifique rapidamente qualquer divergência sem precisar fazer a conferência manualmente.

**Critérios de Aceite:**
- [ ] **Dado** que o ciclo de repasse é concluído, **quando** todos os repasses do período foram processados (ou marcados como `falha_persistente`), **então** o sistema gera automaticamente o relatório de conciliação com: total esperado por hotel, total executado por hotel, divergência em R$ e %, status por hotel.
- [ ] **Dado** que a divergência de um hotel supera 0,01% do valor esperado, **quando** o relatório é gerado, **então** o sistema destaca a linha e envia alerta ao FinOps — independente do valor absoluto.
- [ ] **Dado** que a conciliação está 100% correta (sem divergências), **quando** o relatório é gerado, **então** ele exibe "sem divergências" de forma clara — e o FinOps pode exportar como evidência de auditoria.

### ST-009 — Exportação de dados por hotel

**Como** FinOps,  
**quero** exportar os dados do ciclo de repasse por hotel e por período em formato estruturado,  
**para que** eu possa fornecer os dados para a contabilidade e para que o hotel possa emitir as NFs correspondentes.

**Critérios de Aceite:**
- [ ] **Dado** que o FinOps seleciona um hotel e um período no painel, **quando** solicita a exportação, **então** o sistema gera um arquivo CSV/XLSX com: booking_id, valor_total_reserva, percentual_comissão, valor_comissão, IR_retido, valor_repasse_líquido, data_repasse, status_repasse — uma linha por reserva.
- [ ] **Dado** que o hotel tem reservas canceladas com penalidade no período, **quando** os dados são exportados, **então** as reservas canceladas com penalidade aparecem com o valor proporcional à penalidade cobrada — distintas das reservas sem penalidade.
- [ ] **Dado** que uma exportação é solicitada para um período sem repasses executados, **quando** o sistema processa a solicitação, **então** retorna arquivo vazio com cabeçalho (não erro) e exibe mensagem "sem repasses para o período selecionado".

---

## Seção 8 — Requisitos Não-Funcionais (NFRs)  ·  *(bloqueia freeze)*

> A lacuna nº 1 que causa retrabalho. Preencher apenas as dimensões aplicáveis. Aqui o PO descreve o **requisito de qualidade**; a viabilidade e o *como* são do Technical Assessment.

| Dimensão | Requisito | Como será verificado |
|---|---|---|
| **Performance / Eficiência** | Resposta do Concierge: primeira resposta em < 3s para perguntas sem consulta à API de contexto; < 5s com consulta à API. Execução de repasse individual: < 10s por hotel por ciclo (ex-tempo de resposta do Stripe). | Testes de carga com volume simulado de tickets; medição de latência no ambiente de staging. |
| **Confiabilidade** | Concierge: disponibilidade ≥ 99,5% (exceto manutenções programadas). Settlement Service: disponibilidade ≥ 99,9% nos dias de ciclo de repasse. Falha no Concierge não deve afetar o Settlement e vice-versa. | Monitoramento com alertas de downtime; SLA medido mensalmente. |
| **Segurança** | Dados de pagamento do hóspede não são armazenados pelo Settlement Service — trafegam exclusivamente pelo Stripe (PCI DSS). Logs do Concierge não devem armazenar números de cartão, senhas ou dados sensíveis de pagamento. Acesso ao painel de gestão e ao painel FinOps por autenticação SSO/MFA. Ledger imutável — sem UPDATE/DELETE nos registros financeiros. | Auditoria de logs; revisão de código de segurança; teste de penetração no fluxo de pagamento antes do go-live. |
| **Idempotência** (requisito de produto) | Toda transação do Settlement Service deve ser idempotente: a mesma operação executada N vezes produz exatamente o mesmo resultado que 1 vez. Esse é um **requisito de produto**, não apenas técnico — a StayFlow assume contratualmente que não pagará dois vezes o mesmo repasse. | Testes de idempotência com chaves duplicadas em staging; simulação de falhas parciais. |
| **Usabilidade** | O gestor de CS deve conseguir configurar uma regra de escalonamento simples sem treinamento técnico (máx. 10 minutos da 1ª vez). O FinOps deve conseguir disparar um ciclo de repasse manual em até 3 cliques no painel. | Teste de usabilidade com o gestor de CS e com o FinOps antes do release. |
| **Compatibilidade** | Concierge: widget funcional nos navegadores Chrome, Firefox, Safari (versões dos últimos 2 anos), em desktop e mobile (layout responsivo — sem app nativo). | Testes cross-browser no ambiente de QA. |
| **Manutenibilidade** | Regras de escalonamento do Concierge devem ser configuráveis via interface (sem deploy de código). Percentuais de comissão por hotel devem ser editáveis pelo FinOps via painel administrativo (sem alterar banco de dados diretamente). Feature flags para rollout gradual de cada serviço (Concierge e Settlement independentes). | Revisão de configuração no painel de gestão; verificação de flags no deploy. |
| **Auditabilidade** | Toda operação financeira (cálculo, execução, falha, retentativa, ajuste) deve ser registrada no ledger com timestamp, operador (se humano) e referências cruzadas. Exportável para fins de auditoria. | Revisão do ledger em ambiente de staging após simulação de ciclo completo. |

---

## Seção 9 — Edge Cases e Modos de Falha  ·  *(bloqueia freeze)*

> Estados de erro, timeouts, permissões, concorrência. Primeira classe — não rodapé.

**Concierge:**

- **Hóspede não autenticado tenta usar o Concierge**: o Concierge responde apenas com FAQ genérico (sem dados de reserva). Exibe convite para login para obter resposta personalizada. Não bloqueia a conversa.
- **API de contexto de reservas indisponível (timeout ou 5xx)**: Concierge responde com o que sabe (FAQ), informa a limitação, oferece escalonamento. Não apresenta mensagem de erro técnico ao hóspede.
- **Pergunta em idioma diferente do português**: Concierge responde no idioma detectado (se o LLM suportar) ou, se não suportar, informa que o atendimento é em português e oferece escalonamento. Não trava.
- **Hóspede com múltiplas reservas ativas**: Concierge pergunta sobre qual reserva a pergunta se refere antes de consumir a API de contexto. Se o hóspede tiver apenas uma reserva, usa-a automaticamente.
- **Hóspede envia conteúdo inapropriado, ameaças ou linguagem de violência**: Concierge encerra a conversa imediatamente, registra o evento, e escala para especialista com flag de segurança. O especialista decide se aciona o protocolo de segurança.
- **LLM provider indisponível (modelo de IA fora do ar)**: o Concierge entra em modo degradado — responde apenas com respostas pré-definidas para as top 10 perguntas mais frequentes e escala todo o resto para humano. O gestor recebe alerta de degradação.
- **Ticket de Concierge não consegue abrir no Zendesk (API Zendesk com falha)**: o histórico da conversa é salvo localmente com status "pendente de envio ao Zendesk". Retentativa automática em 15 minutos. FinOps/gestor recebe alerta. O hóspede é informado de que foi colocado na fila de especialistas.
- **Hóspede reabre conversa após ticket criado no Zendesk**: o Concierge reconhece que há um ticket aberto para esse hóspede e informa que o especialista está cuidando do caso, com o número do ticket.

**Settlement:**

- **Repasse fora do percentual esperado (bug de regra)**: se o valor calculado diferir do esperado por mais de 0,5% (tolerância configurável), o sistema bloqueia a execução, registra a anomalia no ledger e alerta o FinOps para revisão manual antes de prosseguir.
- **Hotel sem dados bancários cadastrados no Stripe Connect**: o ciclo de repasse para esse hotel é marcado como `bloqueado_sem_conta` e o FinOps recebe alerta. O repasse não é tentado. As reservas ficam acumuladas para o próximo ciclo após resolução.
- **Chargeback de hóspede após repasse executado ao hotel**: o repasse já executado não pode ser estornado automaticamente. O sistema registra o chargeback vinculado à reserva e ao repasse correspondente. FinOps decide se aciona o hotel para devolução parcial (processo fora do sistema, por ora).
- **Reserva com valor zero (cortesia ou erro)**: reservas com `valor_total = 0` são incluídas no ciclo mas o repasse calculado é R$ 0,00. Registradas no ledger para fins de conciliação. Não geram transação Stripe.
- **Reembolso parcial ao hóspede após repasse ao hotel já executado**: o sistema registra o reembolso parcial vinculado à reserva. O repasse não é revertido automaticamente. FinOps recebe alerta: "reserva X teve reembolso parcial após repasse executado — verificar ajuste com o hotel".
- **Percentual de comissão não cadastrado para um hotel**: o ciclo de repasse para esse hotel é interrompido com status `percentual_ausente`. O FinOps recebe alerta antes da execução (validação pré-ciclo) — o ciclo não inicia se houver hotéis sem percentual cadastrado.
- **Ciclo disparado em data não habitual (fora do schedule)**: aceito se disparado manualmente pelo FinOps com confirmação explícita. Registrado como "ciclo manual" no ledger com identificação do operador.
- **Falha de rede durante execução do repasse (conexão com Stripe interrompida)**: o sistema detecta o timeout e aguarda o webhook de confirmação por até 30 minutos. Se o webhook não chegar, verifica o status da transação via API do Stripe. Se o Stripe confirmar o pagamento, registra como sucesso. Se não, retentativa normal.
- **Hotel com múltiplas reservas no mesmo período, uma com chargeback pendente**: as reservas sem chargeback são repassadas normalmente. A reserva com chargeback pendente é bloqueada (RN-S08) e exibida no relatório de conciliação com status `bloqueado_chargeback`.
- **Exportação de dados solicitada durante a execução de um ciclo**: o sistema exibe aviso de que o ciclo está em andamento e a exportação será dos dados do ciclo anterior (completo). A exportação do ciclo atual fica disponível após o término.
- **Ajuste retroativo de percentual de comissão**: se o percentual de um hotel for corrigido após um ciclo executado, o sistema exibe o impacto da diferença (R$ de ajuste necessário) mas não recalcula automaticamente o repasse passado. FinOps deve aprovar um lançamento de ajuste manual, registrado no ledger com referência ao ciclo original.

**Geral:**

- **Deploy durante ciclo de repasse ativo**: o Settlement Service deve implementar graceful shutdown — repasses em andamento são finalizados antes de o serviço ser interrompido.
- **Banco de dados primário indisponível durante ciclo**: o ciclo é pausado e retomado quando o banco restaurar. Idempotência garante que repasses já executados não sejam repetidos.

---

## Seção 10 — Métricas de Sucesso (primária · secundária · guardrail)  ·  *(bloqueia freeze)*

> Valores **projetados** — o baseline para confronto pós-rollout. Indicadores *leading* e *lagging*. Pelo menos um **guardrail** (métrica que não pode piorar).

| Tipo | Métrica | Meta (projetada) | Janela de medição | Medição (quem/como) | Confiança |
|---|---|---|---|---|---|
| **Primária** | Taxa de resolução na 1ª camada (Concierge sem escalonamento) | ≥ 55% das conversas resolvidas pelo bot | 30 dias pós-release | Painel de gestão do Concierge — contagem de conversas encerradas sem escalonamento / total de conversas | 70 (benchmark de mercado; baseline real da StayFlow é zero — partindo do zero) |
| **Primária** | Taxa de repasse correto | ≥ 99,5% dos repasses executados com valor dentro da tolerância de 0,5% do esperado | Por ciclo | Settlement Service — relatório de conciliação automático | 85 (regra bem definida; risco de bug de cálculo é mitigável) |
| **Secundária** | CSAT médio de hóspede (Concierge + especialista) | ≥ 4,3/5 | 60 dias pós-release (média móvel 30 dias) | Painel de gestão — CSAT coletado ao final de cada interação | 65 (melhora de CSAT é consequência da qualidade do bot — incerteza sobre treinamento inicial) |
| **Secundária** | Tempo médio de primeira resposta (Concierge) | < 5s para 95% das conversas | 30 dias pós-release | Logs do Concierge — p95 de tempo de resposta | 80 |
| **Secundária** | Horas/semana do FinOps no ciclo de repasse | < 4h/semana | 60 dias pós-release | Auto-declarado pelo FinOps + dados de uso do painel | 60 (depende de adoção e de não haver exceções manuais constantes) |
| **Guardrail** | CSAT médio geral de atendimento não pode cair | ≥ 3,8/5 (baseline atual) durante rollout do Concierge | Durante rollout (primeiros 30 dias) | Painel de gestão — CSAT geral | 90 |
| **Guardrail** | Zero repasses duplicados | 0 ocorrências de pagamento duplicado ao mesmo hotel | Em todo tempo de vida do Settlement Service | Ledger — auditoria de `idempotency_key` duplicadas com status de execução diferente de "rejeitado" | 95 (idempotência é um requisito técnico firme, não estimado) |
| **Guardrail** | Disponibilidade do Settlement Service nos dias de ciclo | ≥ 99,9% nos dias de execução do ciclo de repasse | Por ciclo | Monitoramento de infraestrutura | 80 |

---

## Seção 11 — Critérios de Sucesso e Aceite (do release)  ·  *(bloqueia freeze)*

Indicadores de alto nível que definem "concluído e valioso" para **este release** — distintos das métricas contínuas da Seção 10.

| Critério | Tipo | Indicador | Valor alvo |
|---|---|---|---|
| Concierge em produção com resolução na 1ª camada | Operacional | Taxa de resolução do Concierge em operação (30 dias pós-release) | ≥ 55% sem escalonamento |
| Repasse automatizado sem erros de percentual | Negócio / Financeiro | Primeiro ciclo de repasse automatizado executado com 100% de acurácia | 0 divergências > 0,5% no primeiro ciclo |
| Hotel Gran Vista retido | Negócio | Nenhuma notificação de rescisão nos 90 dias pós-release do Settlement | Zero notificações de rescisão por erro de repasse |
| Idempotência comprovada | Qualidade / Segurança | Nenhum repasse duplicado detectado na auditoria dos primeiros 3 ciclos | 0 pagamentos duplicados |
| Handoff com contexto funcionando | UX / Operacional | Atendentes especialistas confirmam receber histórico e dados de reserva ao assumir tickets escalados | ≥ 90% dos tickets escalados com contexto completo (verificado por amostragem de CS) |
| FinOps usando o painel | Adoção | Time de FinOps opera o ciclo de repasse pelo painel, sem planilha manual | FinOps confirma abandono da planilha manual após 2 ciclos |
| Migração para Stripe Connect sem downtime nas reservas | Técnico | Nenhum ticket de reserva falhada durante a janela de migração | 0 reservas impactadas pela migração |

---

## Seção 12 — Riscos e Dependências (de produto e negócio)  ·  *(bloqueia freeze)*

> Riscos **técnicos** migram para o Technical Assessment do CTO. Aqui ficam os riscos de produto, negócio, adoção, externos e de compliance.

| Risco | Tipo | Probabilidade | Impacto | Mitigação |
|---|---|---|---|---|
| Hotel Gran Vista rescindir antes do go-live do Settlement | Externo / Negócio | Média | Alto | CS comunica proativamente ao Gran Vista o cronograma do projeto. Se prazo informal de 60 dias não for atingível com o esforço firme do CTO, decisão de negócio: comunicar ao parceiro ou priorizar um MVP mínimo de repasse primeiro. |
| Chatbot de 1ª camada piora CSAT na fase inicial (respostas inadequadas) | Produto | Média | Alto | Rollout gradual: iniciar com 20% do tráfego de atendimento por 2 semanas, monitorar CSAT, só ampliar se guardrail estiver sendo respeitado. Guardrail explícito: se CSAT cair abaixo de 3,8, desligar o Concierge e retornar ao atendimento 100% humano. |
| Regra de retenção de IR configurada incorretamente por hotel | Compliance | Baixa | Alto | FinOps revisará campo de IR de cada hotel antes do primeiro ciclo de repasse automatizado. Requer ação humana explícita (não é configurado automaticamente). |
| Percentuais de comissão nos contratos diferirem do cadastro em planilha | Negócio | Média | Alto | FinOps (Bruno Takeda) é responsável por validar e migrar os percentuais do planilha para o sistema antes do go-live. Pré-condição listada na prontidão herdada. |
| Atendentes especialistas ignoram o handoff do Concierge e pedem para o hóspede repetir o histórico | Adoção | Média | Médio | Treinamento do time de CS antes do go-live. A interface do Zendesk deve exibir o contexto de forma proeminente (não em aba secundária). Monitorar via CSAT dos tickets escalados vs. tickets diretos. |
| Regulamentação fiscal dos repasses muda (IR, ISS, outras) | Compliance | Baixa | Médio | Motor de IR configurável por hotel e alíquota. Mudanças regulatórias podem exigir atualização de configuração (sem código). Monitorar publicações do Jurídico. |
| Volume de tickets de atendimento cresce além do esperado, sobrecarregando os especialistas | Produto | Baixa | Médio | Se o Concierge não resolver 55% na 1ª camada, o volume de tickets escalados pode sobrecarregar o time. Plano: expandir a base de conhecimento do Concierge nas primeiras 4 semanas pós-release com base nas perguntas não resolvidas. |
| Adoção do painel FinOps lenta (equipe continua usando planilha em paralelo) | Adoção | Média | Médio | Treinamento antes do go-live. Estabelecer data de "desativação da planilha" com o FinOps (ex.: após 2 ciclos com o painel). CS/Ops acompanham adoção. |

**Dependências (de produto/negócio):**
- Bruno Takeda (FinOps) deve migrar percentuais de comissão para o sistema antes do go-live do Settlement — esta é uma pré-condição bloqueante.
- Cada hotel parceiro deve ter uma conta Stripe Connect criada antes do primeiro ciclo de repasse automatizado — responsabilidade conjunta FinOps + CTO (automação da criação de conta está no escopo do Settlement Service).
- O time de CS precisa de treinamento no fluxo de handoff antes do go-live do Concierge.

---

## Seção 13 — Avaliação Preliminar de Esforço e Custo

> Somente uso interno. **Preliminar** — o chute do PO para sustentar sequenciamento. O número **firme** vem do CTO no Technical Assessment. Não é compromisso contratual nem material para cliente.

| Área | Estimativa preliminar | Confiança |
|---|---|---|
| Backend — Concierge Service (orquestração de IA, integração Zendesk, regras de escalonamento) | ~15 dias | low_confidence |
| Backend — Settlement Service (motor de split, idempotência, ledger, Stripe Connect) | ~20 dias | low_confidence |
| Backend — migração de PSP (Pagar.me → Stripe Connect, migração de dados de hotéis) | ~8 dias | low_confidence |
| Frontend — widget do Concierge (canal web, responsivo) | ~8 dias | low_confidence |
| Frontend — painel de gestão (regras, relatórios, CSAT) | ~6 dias | low_confidence |
| Frontend — painel FinOps (ciclo, conciliação, exportação) | ~5 dias | low_confidence |
| QA (funcional + segurança + idempotência + carga) | ~8 dias | low_confidence |
| **Total preliminar** | **~70 dias** | low_confidence |

**Sinais de custo a confirmar pelo CTO:** nova infraestrutura para Concierge Service (orquestração de IA, provavelmente custo de API de LLM por token); conta Stripe Connect (taxa por repasse ~0.5%); eventual custo de provisionamento adicional de banco de dados para ledger imutável; custo de observabilidade ampliada (dois serviços novos).

---

## Seção 14 — Roadmap Sugerido

### MVP (este release — Concierge & Settlement v1)

- **Concierge Service:** chatbot 1ª camada (canal web), integração com API de reservas, regras de escalonamento configuráveis, handoff para Zendesk com contexto, CSAT, painel de gestão básico.
- **Settlement Service:** motor de split automático por hotel, Stripe Connect, idempotência, tratamento de falha (retentativa + alerta), conciliação automática, exportação de dados, painel FinOps básico.
- **Migração:** Pagar.me → Stripe Connect para o fluxo de repasse.

### Fase 2 (backlog futuro)

- Portal do hotel parceiro: extrato de repasses, histórico, download de comprovante.
- Notificação proativa ao hotel: e-mail de confirmação de repasse com detalhes.
- Integração com emissão de NF do hotel (por CNPJ e regime tributário — alta complexidade, priorizar por demanda dos parceiros).
- Concierge em canais adicionais: WhatsApp Business API.
- Analytics avançado de atendimento: tempo de resolução por categoria, volume histórico, tendência de CSAT.

### Fase 3 (backlog futuro)

- BI integrado de repasses e atendimento para a liderança.
- Motor de regras de comissão mais sofisticado (comissão variável por sazonalidade, por volume de reservas, etc.).
- Automação de reconciliação contábil com integração ERP da StayFlow.

---

## Referência ao Technical Assessment  ·  *(bloqueia freeze se requisitado)*

> Esta é a **ponte** (`TechAssessmentRef`), não conteúdo. O RP referencia o veredito do CTO — não o absorve. A fusão acontece no [PRD](./04-prd-concierge-settlement.md). Ver [`personas/02-po.md` §5 e §10](../../../personas/02-po.md).

| Campo | Valor |
|---|---|
| **Status** | **Assinado** |
| **Veredito de viabilidade** | **Viável com ressalvas** (migração de PSP no caminho crítico; prazo de migração impacta o cronograma; ver TA-2026-050 para detalhe) |
| **Technical Assessment vinculado** | [TA-2026-050 v1](./03-technical-assessment-concierge-settlement.md) |
| **Constraints rígidas que afetam o escopo** | (1) Settlement Service requer migração para Stripe Connect antes do go-live — sem o PSP correto, o serviço não pode operar; (2) Ledger financeiro deve ser imutável por design — sem UPDATE/DELETE nos registros; (3) Dados de cartão do hóspede não podem ser armazenados fora do Stripe; (4) Concierge e Settlement devem ser serviços independentes com falha isolada; (5) A migração de PSP deve ser executada com zero downtime nas reservas ativas |

> **Gate de congelamento (freeze):** todas as seções `bloqueia freeze` resolvidas ✓ e `TechAssessmentRef.status = Assinado` ✓ → `freezeReady = true` em 2026-04-25.
