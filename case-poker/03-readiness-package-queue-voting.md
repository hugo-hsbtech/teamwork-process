# Readiness Package — Queue Voting (Fila de Votação)

## Metadados

| Campo | Valor |
|---|---|
| **ID do Pacote** | RP-2024-001 |
| **Versão** | v2 |
| **Intake vinculado** | INT-2024-001 |
| **Responsável** | Lucas Mendes (PO) |
| **Contribuição do CTO** | Não necessária — sem escalada arquitetural |
| **Status** | Aprovado — aguardando planejamento de execução pelo PM |
| **Data de aprovação da versão atual** | 2024-03-28 |

## Histórico de Revisão

| Versão | Data | Autor | Status | Resumo |
|---|---|---|---|---|
| v1 | 2024-03-20 | Lucas Mendes (PO) | Rejeitado pelo PM | Submissão inicial. PM devolveu o pacote citando falta de estratégia de rollout e critérios de aceite indefinidos para edge cases de ocultação de votos. |
| v2 | 2024-03-28 | Lucas Mendes (PO) | Aprovado | Adicionada estratégia de rollout, definidos critérios de aceite para todos os edge cases (desconexão do facilitador, votos parciais no momento do reveal, reconexão de participante durante item). PM aprovou. |

---

## Seção 1 — Resumo Executivo

A plataforma atualmente não possui mecanismo para os facilitadores controlarem o fluxo de estimativas de histórias durante cerimônias de planejamento. Todos os itens ficam visíveis simultaneamente e todos os votos aparecem em tempo real conforme são submetidos.

Este pacote define a adição de duas capacidades:

1. **Fila de Questões** — facilitadores podem carregar uma lista de histórias/questões e revelá-las uma de cada vez aos participantes, controlando a sequência de estimativas.
2. **Votação Secreta** — os votos dos participantes ficam ocultos de todos os outros participantes até que o facilitador os revele explicitamente.

Essas capacidades tratam um risco de retenção com o Banco Meridional (renovação em 90 dias) e desbloqueiam a adoção por mais 3 squads dentro da mesma conta.

---

## Seção 2 — Contexto e Problema

### Cenário Atual

Quando um facilitador cria uma sala de planejamento e adiciona itens para estimativa, todos os participantes podem ver a lista completa imediatamente. Os votos são exibidos em tempo real conforme cada participante os submete.

### Limitações

- Sem controle sequencial: participantes leem à frente e formam opiniões ancoradas antes do item ser discutido.
- Sem ocultação de votos: votantes iniciais influenciam votantes tardios, criando viés de ancoragem e estimativas menos precisas.
- Facilitador sem controle de fluxo: o ritmo da cerimônia é ditado pelo votante mais lento em cada item, sem mecanismo para avançar deliberadamente.

### Dor do Cliente

Os Scrum Masters do Banco Meridional relatam que cerimônias com 10+ histórias levam 40–60% mais tempo do que o esperado, devido a participantes debatendo itens fora de ordem e re-estimando com base em votos de colegas visíveis. O workaround (enviar uma história por vez via chat) adiciona 15–20 min de overhead por cerimônia.

### Impacto de Negócio

- Risco de renovação: R$ 84.000 ARR (4 squads × R$ 21.000)
- Expansão bloqueada: 3 squads adicionais não integrados
- Lacuna competitiva: sinalizada contra 2 ferramentas concorrentes na conversa de renovação

---

## Seção 3 — Objetivos

1. Permitir que facilitadores carreguem uma lista de itens e os revelem sequencialmente, um de cada vez.
2. Ocultar os votos dos participantes até que o facilitador acione a revelação.
3. Reduzir o tempo médio de cerimônia em pelo menos 20% para cerimônias com 10+ itens (mensurável via telemetria de duração de sessão).
4. Remover o bloqueador de adoção para os 3 squads pendentes no Banco Meridional.

---

## Seção 4 — Escopo

### Incluído

- UI do facilitador: capacidade de adicionar uma lista de itens à fila antes ou durante uma sessão
- UI do facilitador: controle "Revelar próximo item" para avançar a fila um item de cada vez
- UI do participante: visualização apenas do item ativo atual (sem visibilidade dos itens na fila)
- Ocultação de votos: todos os votos dos participantes ficam ocultos até o facilitador acionar "Revelar votos"
- UI do facilitador: controle "Revelar votos", disponível após todos os participantes votarem ou após um timer expirar
- Estado de sessão: persistência da ordem da fila e estado de revelação através de reconexões
- Controles básicos do facilitador: pular item, retornar ao item anterior, encerrar sessão

### Excluído

- Timer por item (fora do escopo deste release — item de backlog separado)
- Revelação automática após todos os votos submetidos (poderia ser um toggle de preferência — fase futura)
- Exportação ou relatórios de resultados de votação (funcionalidade existente, sem alterações)
- Redesign específico para mobile (layout mobile existente se aplica)
- Co-controle multi-facilitador (modelo de facilitador único por sessão permanece)

---

## Seção 5 — Personas Impactadas

| Persona | Papel na Sessão | Impacto |
|---|---|---|
| **Scrum Master / Facilitador** | Cria e controla a sala | Usuário primário dos controles de fila e revelação. Ganha controle do fluxo da cerimônia. |
| **Desenvolvedor / Votante** | Estima itens | Vê apenas o item ativo. Votos ficam ocultos até a revelação. Mudança de experiência: menos distração, estimativa mais focada. |
| **Observador** (papel futuro, fora deste escopo) | Assiste sem votar | Não impactado neste release. |

---

## Seção 6 — Regras de Negócio e Fluxos

### Regras de Gerenciamento da Fila

1. Apenas o facilitador pode adicionar, reordenar ou remover itens da fila.
2. Os itens na fila não são visíveis para os participantes até serem revelados.
3. O facilitador pode revelar itens em ordem ou pular à frente — mas não pode "des-revelar" um item já revelado sem encerrar a sessão para aquele item.
4. Uma sessão pode ter no máximo 100 itens enfileirados (limite técnico, não uma regra de negócio — a confirmar pelo CTO se necessário).

### Regras de Ocultação de Votos

1. Uma vez que um participante submete um voto, ele é registrado mas exibido apenas como "Votou" (não o valor) para os outros participantes.
2. O facilitador pode ver a contagem de votos submetidos, mas não os valores até a revelação.
3. O facilitador aciona "Revelar votos" a qualquer momento — isso mostra todos os votos submetidos simultaneamente a todos os participantes.
4. Participantes que não votaram quando a revelação é acionada verão seu espaço como "Não votou" — sem bloqueio.
5. Após a revelação, o facilitador pode avançar para o próximo item da fila ou re-votar o item atual.

### Fluxo de Transição de Estado

```text
Sessão criada
    ↓
Facilitador carrega a fila (1..N itens)
    ↓
Facilitador revela o item 1
    ↓
Participantes votam (votos ocultos)
    ↓
Facilitador aciona "Revelar votos"
    ↓
Todos os votos exibidos simultaneamente
    ↓
Facilitador avança para o item 2 (ou encerra sessão)
    ↓
[repetição]
```

### Edge Cases (no escopo)

- **Participante entra durante um item**: vê o item ativo e pode votar. A posição na fila não é exibida.
- **Facilitador desconecta**: sessão pausa. Se o facilitador reconectar em até 5 min, o estado é restaurado. Após 5 min, a sessão encerra.
- **Todos os participantes votam antes da revelação**: o facilitador ainda controla o timing da revelação — sem auto-revelação.
- **Facilitador pula um item**: item é marcado como pulado no histórico da sessão. Pode ser retornado.

---

## Seção 7 — Integrações Necessárias

| Sistema | Tipo | Detalhe |
|---|---|---|
| **WebSocket / camada de sessão em tempo real** | Interno | Eventos de estado da fila e revelação de votos devem ser transmitidos a todos os participantes da sessão em tempo real. Infraestrutura WebSocket existente se aplica. |
| **Camada de persistência de sessão** | Interno | Ordem da fila, estado de revelação e votos devem persistir através de reconexões. Armazenamento de sessão existente se aplica — extensão de schema necessária. |

Nenhuma integração de terceiros externos é necessária para esta funcionalidade.

---

## Seção 8 — Impacto Técnico

*Escalada ao CTO: não necessária. Notas fornecidas pelo PO com base no conhecimento do sistema existente. Tech Leads devem validar durante o breakdown.*

| Área | Impacto |
|---|---|
| **Modelo de estado de sessão** | Extensão de schema para suportar fila (lista ordenada de itens + estado de revelação por item) e flag de ocultação de votos por sessão. |
| **Eventos WebSocket** | Novos tipos de evento: `item_revealed`, `votes_revealed`, `item_skipped`. Event bus existente se aplica. |
| **Frontend (facilitador)** | Novo componente UI de gerenciamento de fila. Novos controles de revelação. |
| **Frontend (participante)** | Mudança na lógica de exibição de votos: mostrar "Votou" em vez do valor até receber evento de revelação. |
| **Segurança** | Valores de votos não devem ser expostos em payloads WebSocket para participantes antes da revelação — o servidor deve aplicar a ocultação, não apenas o cliente. |
| **Multi-tenancy** | Sem impacto — escopo de sessão já é isolado por tenant. |
| **Observabilidade** | Adicionar telemetria: duração de sessão, tempo por item, lag de revelação. Necessário para medição das métricas de sucesso. |
| **Escalabilidade** | Sem novas preocupações — a fila tem escopo de sessão e é limitada (máx. 100 itens). |

---

## Seção 9 — Riscos e Dependências

| Risco | Tipo | Probabilidade | Impacto | Mitigação |
|---|---|---|---|---|
| Problemas de ordenação de eventos WebSocket com alta contagem de participantes | Técnico | Média | Médio | Load test com 30+ participantes concorrentes antes do release. |
| Bypass de ocultação de votos via inspeção client-side | Segurança | Baixa | Alto | Servidor aplica a ocultação. Votos não incluídos nos payloads de broadcast até o evento de revelação. Teste de penetração no fluxo de revelação. |
| Perda de estado de sessão na reconexão do facilitador | Técnico | Baixa | Alto | Período de graça de 5 min com restauração de estado. Fallback: sessão encerra limpa com notificação. |
| Conflitos de migração de schema com sessões ativas | Técnico | Baixa | Médio | Migração roda apenas em sessões com status = encerrado. Sessões ativas usam schema antigo até encerramento natural. |

**Dependências:**
- Disponibilidade da equipe de infraestrutura WebSocket para revisão do schema de eventos
- Ambiente de QA com capacidade de simulação multi-participante

---

## Seção 10 — Avaliação Interna de Esforço e Custo

> Somente uso interno. As estimativas abaixo não são compromissos nem obrigações contratuais e não devem ser compartilhadas com clientes, prospects ou stakeholders externos. Existem para suportar planejamento de capacidade, trade-offs de priorização e alocação de recursos dentro da empresa.
>
> As estimativas são baseadas na senioridade atual da equipe e no estado conhecido do sistema no momento da racionalização. Serão revisadas pelo Tech Lead durante o breakdown técnico.

### Esforço de Desenvolvimento

| Área | Estimativa | Senioridade |
|---|---|---|
| Backend (estado de sessão + eventos WebSocket) | 5 dias | Mid-senior |
| Frontend — UI do facilitador | 4 dias | Mid |
| Frontend — UI do participante | 2 dias | Mid |
| QA (funcional + segurança + carga) | 3 dias | QA |
| **Total** | **14 dias** | |

### Impacto de Infraestrutura

Sem nova infraestrutura necessária. A infraestrutura WebSocket e de armazenamento de sessão existente absorve esta funcionalidade dentro da capacidade atual. Sem ações de procurement ou provisionamento necessárias.

### Impacto de Custo com Terceiros

Nenhum. Sem novos serviços externos, APIs ou licenças necessárias.

### Impacto de Custo Operacional Recorrente

Mínimo. Eventos de telemetria adicionais aumentam o armazenamento de observabilidade em aproximadamente 2–3% no volume de sessões atual. Sem ação de orçamento necessária.

### Avaliação de TCO

A funcionalidade é operacionalmente neutra — sem novos serviços, sem novas dependências externas. O impacto no custo total de propriedade é limitado ao tempo de desenvolvimento. Nenhuma nova linha de custo recorrente é adicionada ao orçamento operacional da empresa.

---

## Seção 11 — Critérios de Sucesso

| Métrica | Meta | Medição |
|---|---|---|
| Duração média de cerimônia (10+ itens) | Redução de ≥ 20% vs. baseline atual | Telemetria de duração de sessão — comparar antes/depois para coorte do Banco Meridional |
| Renovação do Banco Meridional | Confirmada antes da data do contrato | CS acompanha resultado da renovação |
| Adoção de squads adicionais | 3 novos squads ativados em até 60 dias do release | Dashboard da conta — contagem de ativação de squads |
| Incidentes de ancoragem de votos reportados | Zero tickets de CS sobre viés de ancoragem pós-release | Tagueamento de tickets de CS |
| Satisfação reportada pelo facilitador | ≥ 4,5/5 em pesquisa pós-cerimônia (se pesquisa existir) | Acompanhamento CS com a conta |

---

## Seção 12 — Roadmap Sugerido

### MVP (este release)

- Gerenciamento de fila (adicionar, ordenar, revelar um de cada vez)
- Ocultação de votos com revelação controlada pelo facilitador
- Persistência de estado de sessão através de reconexões
- Controles básicos do facilitador (pular, retornar, encerrar)

### Fase 2 (backlog futuro)

- Auto-revelação após todos os participantes votarem (toggle de preferência opcional)
- Timer por item com avanço automático opcional
- Reuso de template de fila entre sessões
- Modo co-facilitador (múltiplos facilitadores compartilhando controle)

### Fase 3 (backlog futuro)

- Dashboard de analytics de cerimônias (tempo por item, taxa de consenso, frequência de revisão)
- Integração com Jira/Linear para importação direta de histórias para a fila
