# Definição de Papéis

## Propósito

Este documento estabelece os limites de cada papel no modelo operacional. Cada papel tem um ponto de início (quando se torna ativo), um ponto de término (quando faz o handoff), um escopo de autoridade e uma ownership explícita.

Ownership significa: este papel é o único responsável por este artefato, decisão ou domínio. Se algo não está listado como propriedade de um papel, esse papel não tem autoridade unilateral sobre o item.

Nenhum papel deve invadir o domínio de outro. Quando houver sobreposição, as regras abaixo a resolvem.

## Camadas organizacionais

```text
┌─────────────────────────────────────────────────────┐
│                  UPSTREAM                           │
│  CEO · Vendas · Marketing · Customer Success        │
├─────────────────────────────────────────────────────┤
│                  INTAKE LAYER                       │
│            CTO · PO (Product Owner)                 │
├─────────────────────────────────────────────────────┤
│                  DOWNSTREAM                         │
│          PM · Tech Leads · Engineers                │
└─────────────────────────────────────────────────────┘
```

## Papéis do upstream

> Os quatro papéis abaixo (CEO via canal de intake, Vendas, Marketing, CS) são, do ponto de vista do modelo de dados, instâncias de uma única persona genérica: a **Submitter**. Este documento define seus limites de autoridade individuais; [`personas/01-submitter.md`](./personas/01-submitter.md) consolida *como ela raciocina* — modelo de confiança por campo, Readiness Score e dispositions ("não sei" é uma disposição válida, não um bloqueio).

### CEO

O CEO define para onde a empresa vai e o que importa agora. Opera na camada estratégica — mercado, investidores, parcerias e decisões executivas.

**Inicia quando**
- uma nova direção estratégica está sendo definida;
- um deal ou parceria de alto valor exige envolvimento executivo;
- uma prioridade de negócio precisa ser estabelecida ou alterada.

**Termina quando**
- a direção, prioridade ou contexto foi comunicado a Vendas, CS ou diretamente ao CTO;
- o CEO sai do fluxo até que uma decisão volte a exigir autoridade executiva.

**Ownership**
- Estratégia da empresa e direção de longo prazo.
- Decisões executivas de priorização.
- Narrativa externa (investidores, parceiros, imprensa).
- Autoridade final sobre trade-offs no nível da empresa.

**Autoridade**
- Define prioridades no nível da empresa.
- Pode sobrepor a priorização de produto no nível estratégico.
- É dono da narrativa do que a empresa constrói e por quê.

**Não faz**
- Definir funcionalidades ou requisitos técnicos.
- Gerenciar backlog ou sprints.
- Especificar arquitetura ou implementação.
- Contornar o Intake Layer para empurrar demandas diretamente para a engenharia.

#### Canal de intake do CEO

Quando o CEO precisa injetar uma prioridade no processo, o caminho é:

1. O CEO comunica a prioridade ao PO, com contexto: por que agora, qual driver de negócio, como o sucesso se parece.
2. O PO registra como intake record estruturado, marcando origem como Interno e prioridade como Crítica ou Alta.
3. O PO faz a triagem contra a fila atual e produz uma avaliação de impacto de capacidade junto com o PM.
4. O resultado (caminho aprovado, compromissos afetados, prazo) volta ao CEO.

O CEO não comunica a prioridade diretamente à Engenharia, aos Tech Leads ou ao PM. Toda injeção passa pelo PO.

### Vendas

Vendas captura demanda de mercado e dor do cliente a partir de uma perspectiva comercial. Traduz conversas com clientes em oportunidades estruturadas, não em solicitações de funcionalidades.

**Inicia quando**
- um prospect ou cliente expressa dor, gap ou necessidade;
- um deal depende de uma capacidade de produto.

**Termina quando**
- a demanda foi registrada no Intake com contexto estruturado (origem, tipo, problema, impacto, prioridade);
- o Intake Layer confirmou o recebimento.

**Ownership**
- Captura e registro de demandas comerciais.
- Documentação da dor do cliente do ponto de vista de vendas.
- Sinais de prioridade vinculados a receita ou risco de deal.

**Autoridade**
- Pode sinalizar prioridade com base no impacto comercial.
- Pode escalar ao CEO se um deal estiver em risco.

**Não faz**
- Definir a solução ou abordagem técnica.
- Comprometer esforço de engenharia com clientes.
- Contornar a triagem indo direto ao CTO ou Tech Leads.
- Priorizar o backlog.

### Marketing

Marketing traz percepção externa: tendências de mercado, posicionamento competitivo e sinais de product-market fit. O foco é em padrões entre segmentos, não em solicitações individuais.

**Inicia quando**
- inteligência de mercado identifica um gap ou tendência relevante;
- uma campanha ou esforço de posicionamento revela necessidade não atendida.

**Termina quando**
- o insight foi registrado no Intake com contexto suficiente para triagem.

**Ownership**
- Inteligência de mercado e sinais competitivos.
- Identificação de padrões no nível de segmento.
- Input de posicionamento e percepção para a estratégia de produto.

**Autoridade**
- Pode surfaçar oportunidades estratégicas a partir de dados de mercado.
- Pode influenciar o input de posicionamento ao CTO/PO durante a racionalização.

**Não faz**
- Registrar bugs individuais ou tickets de suporte (isso é CS/Suporte).
- Definir o roadmap de produto.
- Representar pedido de cliente único como sinal de mercado.

### Customer Success (CS)

CS é o papel mais próximo do cliente pós-venda. Captura fricção real de uso, riscos de retenção, gaps de adoção e dor operacional. O input do CS é o sinal mais concreto do sistema, porque vem de uso em produção.

**Inicia quando**
- um cliente reporta fricção, confusão ou workaround recorrente;
- um risco de retenção é identificado;
- um cliente solicita uma capacidade que está faltando ou quebrada.

**Termina quando**
- a demanda foi registrada no Intake com contexto: qual cliente, frequência, impacto na retenção ou uso, severidade.

**Ownership**
- Relacionamento pós-venda e monitoramento de saúde do cliente.
- Reporte de fricção e gaps de adoção.
- Sinais de risco de retenção e evidências de churn.
- Dados de satisfação alimentando o feedback loop.

**Autoridade**
- Pode sinalizar riscos de saúde do cliente que elevam a urgência de uma demanda.
- Pode fornecer evidências de impacto (dados de uso, NPS, sinais de churn).

**Não faz**
- Prometer funcionalidades ou prazos de produto a clientes.
- Contornar o Intake e ir direto à Engenharia.
- Definir como a solução deve ser.

## Papéis do Intake Layer

### CTO

O CTO opera em duas dimensões ao mesmo tempo: estratégia técnica e liderança de pessoas.

No lado técnico, é pensador sistêmico responsável pela integridade arquitetural, direção da plataforma e qualidade das decisões tomadas a partir do Intake Layer para baixo. No lado de pessoas, é responsável pela saúde, crescimento, produtividade e performance de toda a cadeia técnica — Tech Leads e Engineers.

O CTO não gerencia a triagem do dia a dia (isso é do PO) nem a execução de sprints (isso é do PM). É dono da infraestrutura humana que torna a execução possível.

**Inicia quando**
- uma demanda passou pela triagem inicial do PO e foi sinalizada para avaliação arquitetural;
- uma decisão envolve nova infraestrutura, mudanças de plataforma, IA/runtime, multi-tenancy, segurança ou risco técnico significativo;
- uma direção tecnológica precisa ser estabelecida ou revisada;
- um problema de performance, crescimento ou saúde do time surge em qualquer ponto da cadeia técnica.

**Termina quando**
- o impacto arquitetural foi avaliado e documentado;
- o **Technical Assessment** (artefato próprio — viabilidade, constraints, arquitetura, riscos técnicos, ADRs) foi produzido; o CTO **nunca edita o RP**, apenas é referenciado por ele e fundido no PRD;
- a demanda foi aprovada ou rejeitada no nível técnico.

A gestão de pessoas não tem fim — é responsabilidade contínua.

**Ownership — Estratégia Técnica**
- Todas as decisões arquiteturais (autoridade final, sem override abaixo deste papel).
- Padrões técnicos, patterns e Architecture Governance.
- O **Technical Assessment** (artefato separado; o CTO nunca edita o RP).
- Estratégia de tecnologia e direção da plataforma.
- Decisão sobre viabilidade técnica no nível da plataforma.
- Visibilidade da dívida técnica e estratégia de remediação.

**Ownership — Pessoas e Time**
- Performance e crescimento dos Tech Leads (subordinados diretos).
- Responsabilidade indireta pelos Engineers, através dos Tech Leads.
- Avaliação de capacidade do time — correspondência de senioridade e habilidades às demandas do roadmap.
- Planos de desenvolvimento de carreira da equipe técnica.
- Decisões de contratação para papéis técnicos.
- Saúde do time e segurança psicológica dentro da organização de engenharia.

**Autoridade**
- Palavra final sobre decisões arquiteturais.
- Pode rejeitar ou reformular uma demanda com base na estratégia técnica.
- Define padrões, patterns e diretrizes (Architecture Governance).
- Pode delegar decisões de triagem ao PO para demandas sem impacto arquitetural.
- Pode escalar problema de performance ao CEO quando afeta a capacidade de entrega.
- Pode propor reestruturação do time, mudanças de papel ou contratações ao CEO com base em gaps de capacidade.
- Pode sobrepor decisão técnica de um Tech Lead se conflitar com os padrões arquiteturais.

**Não faz**
- Ser dono da fila diária do Intake (isso é do PO).
- Escrever especificações funcionais ou jornadas do usuário.
- Gerenciar execução, milestones ou planejamento de sprint.
- Intervir na execução downstream a menos que apareça um problema arquitetural.
- Conduzir avaliações de performance para papéis não técnicos (PM, PO, CS — esses pertencem às suas cadeias).

#### Gestão de pessoas — 1:1s

O CTO conduz 1:1s regulares com cada Tech Lead. Estas não são reuniões de status — são o instrumento principal para entender performance individual, bloqueios, trajetória de crescimento e sinais de saúde do time.

| Frequência | Propósito |
|---|---|
| Semanal (30 min) | Bloqueios atuais, pulso do time, decisões imediatas |
| Mensal (60 min) | Progresso de performance, metas de crescimento, troca de feedback, desenvolvimento de carreira |

Os Tech Leads são responsáveis por conduzir os próprios 1:1s com os Engineers no mesmo ritmo. O CTO revisa sinais resumidos dessas sessões — não transcrições, mas indicadores de saúde.

#### Avaliação de 90 dias

Toda pessoa na cadeia técnica (Tech Leads e Engineers) recebe uma avaliação estruturada a cada 90 dias. Não é uma revisão anual — é um sinal contínuo.

A avaliação cobre seis dimensões:

| Dimensão | O que é avaliado |
|---|---|
| Qualidade técnica | Qualidade de código, decisões arquiteturais, aderência a padrões, cobertura de testes |
| Confiabilidade de entrega | Precisão de estimativas, aderência a milestones, disciplina de escopo |
| Resolução de problemas | Como bloqueios são tratados, qualidade da escalada, iniciativa sob ambiguidade |
| Comunicação | Clareza nos handoffs, qualidade da documentação, capacidade de surfaçar problemas cedo |
| Trajetória de crescimento | Desenvolvimento de habilidades desde a última avaliação, iniciativa fora do escopo atribuído |
| Contribuição ao time | Compartilhamento de conhecimento, qualidade do code review, suporte aos pares |

Output da avaliação:

- um resumo escrito entregue ao indivíduo;
- uma ação de desenvolvimento para os próximos 90 dias (específica, não genérica);
- um sinal ao CTO: No caminho / Precisa de suporte / Em risco;
- se Em risco, um plano de melhoria de 30 dias é iniciado imediatamente.

Para Engineers, as avaliações são conduzidas pelos Tech Leads e revisadas pelo CTO. Para Tech Leads, as avaliações são conduzidas diretamente pelo CTO.

#### Gestão de performance

Problema de performance não espera o próximo ciclo de avaliação. O CTO intervém assim que um sinal aparecer.

Fontes de sinal:

- conversas de 1:1;
- relatórios de entrega do PM (precisão de estimativas, aderência a milestones);
- observações dos Tech Leads sobre os Engineers;
- observação direta do CTO durante revisões arquiteturais;
- feedback do PO sobre a qualidade dos handoffs.

Níveis de resposta:

| Sinal | Resposta do CTO | Prazo |
|---|---|---|
| Fricção menor (primeira ocorrência) | Coaching no 1:1. Documentar. | 1 semana |
| Padrão recorrente (2+ ocorrências) | Sessão formal de feedback. Plano de desenvolvimento escrito. | 2 semanas da identificação |
| Em risco (entrega ou qualidade abaixo do padrão de forma consistente) | Plano de melhoria de 30 dias com check-ins semanais | Inicia em 5 dias úteis |
| Não resolvido após o plano | Escalada ao CEO com histórico documentado | Na data de término do plano |

A gestão de performance não é punitiva. É a obrigação do CTO de dar a cada pessoa da cadeia técnica o contexto, feedback e suporte para ter sucesso antes de qualquer escalada.

#### Avaliação de capacidade e planejamento de time

Além da performance individual, o CTO mantém uma visão atual da capacidade coletiva do time em relação ao roadmap.

Mapa de capacidade (atualizado continuamente):

- distribuição atual de senioridade no time;
- cobertura de habilidades vs. demandas futuras (IA, fintech, integrações, plataforma);
- pontos únicos de conhecimento (uma única pessoa que conhece um sistema crítico);
- trajetória de crescimento de cada pessoa nos próximos 6 meses.

Quando o PM executa uma avaliação de capacidade, o CTO precisa conseguir responder:

- quais engineers estão disponíveis e com qual capacidade efetiva;
- se o time tem as habilidades para o escopo entrante;
- se existe risco de ponto único de conhecimento na demanda;
- tempo estimado de rampa se houver gap de habilidade.

Sinal de contratação: se o mapa revela um gap persistente que não pode ser fechado por desenvolvimento dentro do prazo necessário, o CTO leva uma recomendação ao CEO com o gap específico (habilidade, senioridade ou capacidade), o impacto no roadmap se nada for feito, e um perfil proposto com prazo.

#### Desenvolvimento de carreira

Todo membro da cadeia técnica tem um plano de desenvolvimento ativo, de propriedade do CTO (para Tech Leads) ou do Tech Lead sob supervisão do CTO (para Engineers).

O plano contém:

- nível atual e nível alvo;
- 2 a 3 habilidades ou comportamentos para desenvolver nos próximos 6 meses;
- oportunidades concretas dentro do trabalho atual para praticá-los;
- check-in a cada avaliação de 90 dias.

Conversa de carreira é separada de conversa de performance. Uma pessoa pode estar com boa performance e ainda ter uma conversa de carreira significativa. O CTO faz as duas acontecerem.

### PO (Product Owner)

O PO é o centro operacional do Intake Layer. Conduz a triagem, gerencia a fila de demandas, dirige a racionalização e é responsável por produzir o Readiness Package. É um estrategista de produto, não um administrador de projetos.

**Inicia quando**
- uma demanda entra no Intake (de qualquer fonte upstream);
- a etapa de captura foi concluída e o input estruturado existe.

**Termina quando**
- o RP foi congelado (`freezeReady = true`) e, fundido ao Technical Assessment do CTO, entregue ao PM como **PRD** — o **commitment point** que encerra o arco do PO;
- ou a demanda foi rejeitada, movida para o backlog ou enviada para Discovery.

**Ownership**
- A fila do Intake Layer e sua saúde operacional.
- Decisões de triagem para todas as demandas não arquiteturais.
- O Readiness Package como entregável de produto do PO — fundido no PRD que abre o downstream.
- Racionalização de produto — transformar dor em definição de capacidade.
- Decisão de caminho: Rejeitado / Backlog de Oportunidades / Discovery / Product Ready.
- Manutenção do Backlog de Oportunidades e cadência de revisão.
- O contrato de compliance do intake (requisitos, pesos, o que bloqueia o gate) e a aplicação do Readiness Score na triagem — ver [`personas/01-submitter.md`](./personas/01-submitter.md).

**Autoridade**
- Conduz triagem de forma independente para demandas que não exigem julgamento arquitetural.
- Decide o caminho da demanda.
- Escala ao CTO quando há impacto arquitetural ou técnico estratégico.
- É dono do Readiness Package como entregável.
- Pode devolver ao upstream se a demanda chegar sem contexto suficiente.

#### Cadência de revisão do Backlog de Oportunidades

O PO é dono do Backlog de Oportunidades e revisa em cadência definida:

- **A cada 2 semanas** — revisar todos os itens. Promover para triagem, recategorizar ou marcar como obsoleto.
- **A cada 90 dias** — qualquer item sem atividade é escalado ao CEO para decisão de prioridade ou encerrado formalmente com razão documentada.
- **A cada grande atualização estratégica** — se o CEO mudar a direção, o PO revisa o backlog inteiro para reavaliar alinhamento.

O backlog não é cemitério. Todo item tem status e próxima ação.

**Não faz**
- Aprovar decisões arquiteturais sem o CTO.
- Gerenciar a execução de engenharia (isso é do PM).
- Comprometer prazos de entrega.
- Encaminhar demanda ao downstream sem PRD completo (RP congelado + Technical Assessment).

## Papéis de qualidade

### QA (Quality Assurance)

QA valida que o que foi construído corresponde ao que foi prometido. Opera contra os critérios de aceite definidos no Readiness Package — não contra expectativas informais ou acordos verbais. É o último gate antes do release e impede que código não validado chegue aos clientes.

**Inicia quando**
- os Engineers concluíram a implementação e marcaram tasks como prontas para revisão;
- a Definition of Done foi cumprida no nível de código.

**Termina quando**
- todos os critérios de aceite do Readiness Package foram validados;
- a aprovação de release foi emitida ao PM;
- ou um defeito bloqueador foi levantado ao Tech Lead com evidências documentadas.

**Ownership**
- Validação dos critérios de aceite do Readiness Package.
- Aprovação de release ou decisão de bloqueio.
- Documentação de defeitos e evidências para resolução pelo Tech Lead.
- Coordenação de UAT com stakeholders de negócio quando necessário.

**Autoridade**
- Pode bloquear release se os critérios de aceite não forem atendidos.
- Pode escalar defeitos não resolvidos ao Tech Lead e PM.
- Pode pedir esclarecimento ao PO se critérios de aceite estiverem ambíguos.

**Não faz**
- Definir critérios de aceite (vêm do Readiness Package, de propriedade do PO).
- Tomar decisões de escopo de produto.
- Aprovar releases sob pressão se os critérios não forem atendidos.
- Contornar o Tech Lead para escalar defeitos direto ao CTO.

## Papéis do downstream

### PM (Project Manager / Program Manager)

O PM recebe o **PRD** (o RP do PO fundido ao Technical Assessment do CTO) e o transforma em um plano de entrega executável. O trabalho do PM é clareza na execução, não descoberta de problemas. Se o pacote vier incompleto ou contraditório, o PM devolve.

O PM também é o guardião da capacidade do time. Antes de comprometer qualquer prazo, avalia se o time atual tem as habilidades, disponibilidade e senioridade para executar o escopo. Se uma demanda vira urgente ou desce por pressão top-down, a obrigação do PM é surfaçar o gap de capacidade — não absorvê-lo silenciosamente — e escalar ao tomador de decisão certo com uma avaliação clara de impacto.

**Inicia quando**
- o PRD foi entregue pelo PO e marcado como completo (commitment point cruzado);
- os Tech Leads confirmaram que o pacote é suficiente para a quebra técnica;
- uma avaliação de capacidade é necessária antes que um compromisso possa ser feito.

**Termina quando**
- a funcionalidade ou projeto foi entregue, aceito e encerrado;
- o feedback loop foi iniciado (resultados pós-entrega retornados ao upstream).

**Ownership**
- Execução da entrega, do PRD aprovado ao release.
- Definição de milestones, sequenciamento e prazo de entrega.
- Gestão de dependências cross-team durante a execução.
- Escalada de bloqueios de execução ao papel upstream apropriado.
- Iniciação do feedback loop após a entrega.
- **Visibilidade de capacidade do time** — saber a todo momento a disponibilidade atual, cobertura de habilidades e distribuição de senioridade do time de execução.
- **Avaliação de gap de capacidade** — quando uma nova demanda chega ou urgência é imposta top-down, produzir uma avaliação formal do que pode e não pode ser absorvido.
- **Garantia de entrega de valor** — garantir que compromissos com o upstream estejam baseados em capacidade real, não em otimismo.

**Autoridade**
- Pode rejeitar um PRD e devolvê-lo ao PO se informação necessária estiver faltando (gaps técnicos seguem ao CTO).
- Gerencia prioridades, milestones e sequenciamento dentro do escopo aprovado.
- Coordena entre Tech Leads e outros times.
- Pode escalar bloqueios ao CTO ou PO se um constraint for descoberto durante a execução.
- Pode bloquear um compromisso se a avaliação de capacidade mostrar que o time não pode absorver o escopo sem comprometer qualidade ou entregas existentes.
- Pode propor redução de escopo, faseamento ou ajuste de prazo quando a capacidade for insuficiente.
- Pode escalar gap de capacidade ao PO ou CEO quando a urgência top-down conflitar com a realidade do time.

#### Avaliação de capacidade

Quando uma demanda chega ou urgência é imposta externamente, o PM produz uma avaliação de capacidade estruturada antes de qualquer compromisso. Ela inclui:

- **Carga atual** — no que o time já está comprometido e com qual percentual de capacidade.
- **Cobertura de habilidades** — se o time tem a senioridade e a especialização para o escopo entrante.
- **Mapa de conflitos** — quais entregas existentes seriam impactadas se a nova demanda for absorvida.
- **Opções** — ao menos uma de: descopo, faseamento, adiamento de um compromisso existente ou contratação.
- **Recomendação** — a recomendação explícita do PM, não uma lista de opções deixada para outros decidirem.

A avaliação vai ao PO (e ao CEO se a pressão top-down for o gatilho) antes que um prazo seja comprometido.

**Não faz**
- Inventar ou redefinir requisitos (o escopo vem do PRD).
- Tomar decisões arquiteturais.
- Negociar diretamente com clientes sobre escopo ou prazos sem alinhamento com PO/CEO.
- Aceitar urgência imposta top-down sem surfaçar uma avaliação de impacto de capacidade.
- Comprometer datas com base em pressão em vez de capacidade verificada.

### Tech Leads

Os Tech Leads recebem o PRD aprovado e o plano de execução do PM, e são responsáveis por todas as decisões técnicas dentro desse escopo. Traduzem contexto de produto em arquitetura, tasks e estratégia de implementação.

**Inicia quando**
- o PM entregou o plano de execução baseado no PRD aprovado;
- a quebra técnica ainda não começou.

**Termina quando**
- épicos, histórias e tasks estão escritos e estimados — a demanda atinge a **Definition of Ready** (*Ready for Development*: só falta codar);
- arquitetura e sequenciamento estão documentados;
- os Engineers iniciaram a implementação.

Durante a execução, os Tech Leads continuam fornecendo orientação e desbloqueando os Engineers.

**Ownership**
- Quebra técnica do escopo aprovado em épicos, histórias e tasks.
- Design de arquitetura dentro do escopo aprovado.
- Estimativa de esforço e sequenciamento técnico.
- Definition of Done para todos os entregáveis técnicos.
- Estratégia de rollout (deploy, migração, monitoramento, rollback).
- Qualidade técnica do que é entregue.

**Autoridade**
- Donos de todas as decisões técnicas dentro do escopo aprovado.
- Podem sinalizar preocupações arquiteturais ao CTO antes ou durante a execução.
- Definem a Definition of Done para entregáveis técnicos.
- Podem escalar ao PM/PO se o escopo conforme escrito for tecnicamente inviável.

**Não faz**
- Aceitar escopo ambíguo e absorver o custo silenciosamente.
- Tomar decisões de produto (o que construir) — apenas decisões técnicas (como construir).
- Contornar o PM para negociar mudanças de escopo direto com o upstream.

### Engineers

Os Engineers implementam, testam e entregam o trabalho definido pelos Tech Leads, dentro do escopo do PRD. São especialistas de execução com autonomia técnica total dentro das tasks atribuídas.

**Inicia quando**
- as tasks foram definidas e atribuídas pelo Tech Lead;
- o contexto de implementação está claro (constraints, arquitetura, critérios de aceite).

**Termina quando**
- a task está implementada, testada, revisada e atende à Definition of Done;
- o entregável passou em QA/UAT e está pronto para release.

**Ownership**
- Implementação das tasks atribuídas dentro da arquitetura definida.
- Cobertura de testes unitários e de integração para seus entregáveis.
- Qualidade de código e aderência às diretrizes técnicas dentro do seu escopo.
- Surfaçar bloqueios ou contradições no nível de implementação ao Tech Lead.

**Autoridade**
- Donos das decisões de implementação dentro da arquitetura definida.
- Podem levantar bloqueios técnicos ou contradições descobertas durante a implementação ao Tech Lead.
- Podem propor abordagens de implementação melhores ao Tech Lead (não direto ao upstream).

**Não faz**
- Aceitar tasks indefinidas ou ambíguas sem escalar ao Tech Lead.
- Tomar decisões de escopo de produto.
- Comunicar-se direto com clientes ou stakeholders upstream sem o conhecimento do PM/Tech Lead.

## Resumo de ownership

| Artefato ou domínio | Dono |
|---|---|
| Estratégia e direção da empresa | CEO |
| Captura de demandas comerciais | Vendas |
| Inteligência de mercado e competitiva | Marketing |
| Saúde do cliente pós-venda e sinais de uso | Customer Success |
| Fila do Intake Layer e triagem | PO |
| Contrato de compliance do intake e gate de prontidão (Readiness Score) | PO |
| Readiness Package (autoria exclusiva) | PO |
| PRD (fusão RP + Technical Assessment) | PO + CTO |
| Racionalização de produto | PO |
| Backlog de Oportunidades | PO |
| Decisões arquiteturais | CTO |
| Padrões técnicos e Architecture Governance | CTO |
| Technical Assessment (artefato separado; o CTO nunca edita o RP) | CTO |
| Visibilidade da dívida técnica e estratégia de remediação | CTO |
| Performance e crescimento dos Tech Leads | CTO |
| Avaliações de 90 dias (Tech Leads direto, Engineers revisados) | CTO |
| Mapa de capacidade do time e sinais de contratação | CTO |
| Planos de desenvolvimento de carreira da equipe técnica | CTO |
| Execução de entrega e milestones | PM |
| Gestão de dependências cross-team | PM |
| Iniciação do feedback loop | PM |
| Visibilidade e avaliação de capacidade do time | PM |
| Escalada de gap de capacidade | PM |
| Quebra técnica (épicos, histórias, tasks) | Tech Leads |
| Design de arquitetura dentro do escopo | Tech Leads |
| Definition of Done | Tech Leads |
| Estratégia de rollout | Tech Leads |
| Implementação e cobertura de testes | Engineers |
| Aprovação de release ou decisão de bloqueio | QA |
| Validação dos critérios de aceite | QA |

## Resumo de fronteiras

| Fronteira | Papel esquerdo | Papel direito | Regra |
|---|---|---|---|
| Upstream → Intake | Vendas / CS / Marketing / CEO | PO | A demanda precisa ser capturada em formato estruturado antes de chegar ao PO |
| Triagem do Intake | PO | CTO | PO faz triagem independente; escala ao CTO apenas em impacto arquitetural/estratégico |
| Intake → Downstream | PO | PM | Apenas um PRD completo (RP congelado + Technical Assessment) aciona esta transição — o commitment point |
| Validação do PM | PM | PO | PM pode rejeitar e devolver um PRD incompleto ao PO (gaps técnicos seguem ao CTO) |
| Planejamento do downstream | PM | Tech Leads | PM entrega o plano de execução; Tech Leads são donos da quebra técnica |
| Gate de implementação | Tech Leads | Engineers | Engineers iniciam apenas com tasks definidas e contexto claro |
| Escalada técnica | Engineers | Tech Leads | Engineers escalam bloqueios ao Tech Lead, não direto ao PO/CTO |
| Preocupação arquitetural | Tech Leads | CTO | Tech Leads sinalizam problemas arquiteturais ao CTO, não ao PM ou PO |

## O que nenhum papel deve fazer

- Comprometer capacidade de engenharia sem um PRD.
- Contornar o Intake Layer (nenhuma demanda vai direto do upstream para a execução).
- Absorver ambiguidade silenciosamente — todo papel tem a autoridade e a obrigação de escalar ou rejeitar inputs incompletos.
- Definir implementação técnica no upstream (apenas problema e contexto).
- Definir escopo de produto no downstream (apenas execução, dentro do escopo aprovado).
