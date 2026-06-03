# SLAs Operacionais e Cadências

## Propósito

Este documento define os limites de tempo e os ritmos recorrentes do modelo operacional. Sem eles, o processo existe como intenção, mas não como sistema. Cada etapa do fluxo tem uma duração máxima; cada papel tem uma obrigação recorrente.

Os SLAs aqui são metas operacionais internas, não compromissos com clientes.

## SLAs por etapa do processo

### Intake Layer

| Etapa | Responsável | SLA | O que acontece se excedido |
|---|---|---|---|
| Triagem Inicial — demanda Crítica | PO | 24 horas após o registro do intake | PO escala ao CEO e CTO. A demanda é tratada como incidente até ser triada. |
| Triagem Inicial — demanda Alta | PO | 3 dias úteis | PO sinaliza o atraso ao CEO com justificativa. |
| Triagem Inicial — demanda Média | PO | Próximo ciclo de triagem (máx. 1 semana) | Demanda aguarda a próxima sessão agendada. |
| Triagem Inicial — demanda Baixa | PO | Movida direto para o Backlog de Oportunidades | Triagem não necessária. |
| Time-box de Discovery | PO | Máx. 2 semanas por demanda | Demanda vai para o Backlog de Oportunidades com justificativa documentada. |
| Racionalização → PRD (RP congelado + Technical Assessment) | PO + CTO | Máx. 2 semanas para escopo padrão; máx. 1 semana para Crítica | Se excedido, PO sinaliza ao PM e CEO com relatório parcial de status. |
| Avaliação arquitetural do CTO | CTO | Máx. 5 dias úteis a partir da escalada do PO | PO faz follow-up. Se não resolvido, CEO é notificado. |

> **Onde o relógio da triagem começa.** Os SLAs de "Triagem Inicial" contam a partir do recebimento de um registro **pronto** (`gateReady = true`), não do primeiro rascunho. A construção da prontidão pelo Submitter — preencher requisitos, marcar premissas, abrir Discovery — acontece *antes* do handoff e não é SLA-bound: é o ritmo da própria persona, assistido pelo sistema (ver [`personas/01-submitter.md`](./personas/01-submitter.md)). O que o PO recebe já vem graduado por confiança; o timer de triagem mede a resposta do PO, não o tempo que o Submitter levou para amadurecer o registro.

### Downstream

| Etapa | Responsável | SLA | O que acontece se excedido |
|---|---|---|---|
| Avaliação de capacidade do PM | PM | Máx. 3 dias úteis após receber o PRD | PM comunica o atraso ao PO. Nenhum compromisso de execução até concluir. |
| Planejamento de execução do PM | PM | Máx. 1 semana após a avaliação de capacidade | PM sinaliza o atraso ao PO com justificativa. |
| Quebra técnica dos Tech Leads | Tech Leads | Máx. 1 semana para escopo padrão | Tech Lead sinaliza ao PM. O escopo pode precisar de faseamento. |
| Início de task pelo Engineer após atribuição | Engineers | Máx. 2 dias úteis | Tech Lead investiga o bloqueio. |
| Ciclo de validação de QA | QA | Máx. 1 semana por release candidate | QA sinaliza bloqueios ao Tech Lead e PM diariamente se houver defeitos ativos. |
| Aprovação de release ou decisão de bloqueio | QA | Máx. 2 dias úteis após o ciclo de QA | PM escala ao Tech Lead. |
| Iniciação do feedback loop | PM | Em 5 dias úteis após o release | PM inicia resumo assíncrono independentemente. Sem exceções. |

## Cadências recorrentes

### Cadências do PO

| Cadência | Frequência | Propósito |
|---|---|---|
| Revisão da fila do Intake | Semanal | Revisar todas as demandas em triagem, discovery e racionalização. Avançar, bloquear ou encerrar cada item. |
| Revisão do Backlog de Oportunidades | Quinzenal | Promover, recategorizar ou marcar itens como obsoletos. |
| Revisão de expiração do backlog | A cada 90 dias | Escalar ou encerrar itens com mais de 90 dias sem atividade. |
| Verificação de alinhamento estratégico | A cada atualização estratégica do CEO | Reavaliar o backlog completo em relação à nova direção. |

### Cadências do PM

| Cadência | Frequência | Propósito |
|---|---|---|
| Revisão de capacidade | Semanal | Atualizar o mapa de capacidade. Sinalizar conflitos futuros ou gaps de habilidade antes que virem bloqueio. |
| Atualização de status de milestones | Semanal | Comunicar o status de entrega ao PO e stakeholders upstream relevantes. |
| Verificação de dependências | Semanal | Surfaçar dependências cross-team antes que causem atraso. |
| Relatório do feedback loop | Em 5 dias de cada release | Resumo assíncrono de precisão de entrega, qualidade de estimativas e fricção de processo. |

### Cadências do CTO — estratégia técnica

| Cadência | Frequência | Propósito |
|---|---|---|
| Sync com o PO | Semanal (15–30 min) | Revisar demandas arquiteturais sinalizadas na fila do Intake. Prevenir backlog de escaladas. |
| Revisão de Architecture Governance | Mensal | Revisar e atualizar padrões técnicos, patterns e log de decisões arquiteturais. |
| Avaliação de dívida técnica | Trimestral | Avaliar decisões técnicas acumuladas e sinalizar riscos ao roadmap. Produzir plano de remediação. |
| Atualização do mapa de capacidade | Mensal | Atualizar distribuição de senioridade, cobertura de habilidades e riscos de ponto único de conhecimento em relação ao roadmap futuro. |

### Cadências do CTO — gestão de pessoas

| Cadência | Frequência | Propósito |
|---|---|---|
| 1:1 com cada Tech Lead — pulso | Semanal (30 min) | Bloqueios, pulso do time, decisões imediatas. Não é reunião de status. |
| 1:1 com cada Tech Lead — profundo | Mensal (60 min) | Progresso de performance, metas de crescimento, troca de feedback, desenvolvimento de carreira. |
| Avaliação de 90 dias — Tech Leads | A cada 90 dias | Avaliação escrita em 6 dimensões. Output: No caminho / Precisa de suporte / Em risco. |
| Avaliação de 90 dias — Engineers (revisão) | A cada 90 dias | Tech Leads conduzem; CTO revisa e co-assina. |
| Check-in do plano de melhoria de 30 dias | Semanal (quando ativo) | Para qualquer pessoa sinalizada como Em risco. Check-in estruturado contra as metas do plano. |
| Revisão de planejamento de capacidade | Trimestral | Revisão completa do mapa de capacidade vs. roadmap de 6 meses. Sinais de contratação levados ao CEO. |
| Check-in de desenvolvimento de carreira | A cada 90 dias (com a avaliação) | Separado de performance. Revisar progresso do plano e atualizar metas dos próximos 90 dias. |
| Pulso de saúde do time | Mensal | Check assíncrono ou síncrono iniciado pelo CTO com todo o time técnico. Segurança psicológica, carga de trabalho, moral. |

### Cadências do CS

| Cadência | Frequência | Propósito |
|---|---|---|
| Revisão de saúde do cliente | Semanal | Revisar sinais de retenção, tendências de NPS e relatórios de fricção ativos. |
| Registro no Intake | Contínuo | Qualquer sinal de cliente que atenda aos critérios do intake é registrado em 2 dias úteis. |
| Contribuição de feedback pós-release | Em 2 semanas de cada release | CS submete dados de adoção e satisfação ao feedback loop iniciado pelo PM. |

## Timers de escalada

Quando uma etapa está bloqueada ou um SLA está prestes a ser excedido, o caminho de escalada é:

| Situação | Primeira escalada | Segunda escalada | Prazo antes da segunda |
|---|---|---|---|
| Demanda presa na triagem do PO | PO sinaliza ao CEO | CEO e CTO alinham sobre prioridade | 48h após a primeira escalada |
| PRD rejeitado pelo PM | PM devolve ao PO com gaps documentados | PO escala ao CTO se os gaps forem técnicos | 3 dias úteis |
| Conflito de capacidade não resolvido | PM escala ao PO | PO e CEO tomam decisão de trade-off de prioridade | 3 dias úteis |
| CTO indisponível para revisão arquitetural | PO escala ao CEO | CEO define caminho interino | 5 dias úteis |
| Defeito bloqueador de QA não resolvido | QA escala ao Tech Lead | Tech Lead escala ao CTO se for arquitetural | 2 dias úteis |
| Feedback loop não iniciado | Lembrete automático do PM | PO faz follow-up com o PM | 5 dias úteis após o release |

## Princípios dos SLAs

1. **SLAs são compromissos internos, não promessas para clientes** — existem para manter o sistema em movimento, não para criar responsabilidade externa.
2. **Exceder um SLA não é falha — não surfaçá-lo é** — toda violação precisa ser documentada com justificativa.
3. **Demandas Críticas sobrepõem os outros SLAs** — quando uma Crítica entra na fila, os timers não críticos pausam para os papéis envolvidos.
4. **SLAs se aplicam à etapa, não à pessoa** — se a etapa está bloqueada por dependência externa, o timer pausa e o bloqueio é documentado.
5. **Cadências são ritmos não negociáveis** — não dependem de gatilho específico. Acontecem no cronograma, independentemente da carga de trabalho atual.
