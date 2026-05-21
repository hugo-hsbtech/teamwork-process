# Definição de Papéis

## Propósito

Este documento estabelece os limites explícitos de cada papel no modelo operacional.
Todo papel tem um ponto de início definido (quando se torna ativo), um ponto de término definido (quando faz o handoff), um escopo claro de autoridade e uma ownership explícita.

**Ownership** significa: este papel é o único responsável por este artefato, decisão ou domínio. Se não estiver listado como de propriedade de um papel, esse papel não tem autoridade unilateral sobre ele.

Nenhum papel deve invadir o domínio de outro. Quando houver sobreposição, as regras abaixo a resolvem.

---

# Camadas Organizacionais

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

---

# Papéis do Upstream

## CEO

### O que é este papel

O CEO define para onde a empresa vai e o que importa agora. Este papel opera na camada estratégica — mercado, investidores, parcerias e decisões executivas.

### Inicia quando
- Uma nova direção estratégica está sendo definida
- Um deal ou parceria de alto valor requer envolvimento executivo
- Uma prioridade de negócio precisa ser estabelecida ou alterada

### Termina quando
- A direção estratégica, prioridade ou contexto do deal foi comunicado a Vendas, CS ou diretamente ao CTO
- O CEO não tem mais envolvimento até que uma decisão exija autoridade executiva

### Ownership
- Estratégia da empresa e direção de longo prazo
- Decisões executivas de priorização
- Narrativa externa (investidores, parceiros, imprensa)
- Autoridade final sobre trade-offs no nível da empresa

### Autoridade
- Define prioridades no nível da empresa
- Pode sobrepor a priorização de produto no nível estratégico
- É dono da narrativa do que a empresa constrói e por quê

### Não faz
- Definir funcionalidades ou requisitos técnicos
- Gerenciar backlog ou sprints
- Especificar arquitetura ou implementação
- Contornar o Intake Layer para empurrar demandas diretamente para a engenharia

### Canal de Intake do CEO

Quando o CEO precisa injetar uma prioridade estratégica no processo, segue este caminho:

1. O CEO comunica a prioridade diretamente ao PO — com contexto: por que agora, qual driver de negócio, como o sucesso se parece.
2. O PO a registra como um intake record estruturado, marcando a origem como Interno e a prioridade como Crítica ou Alta.
3. O PO a triaja contra a fila atual e produz uma avaliação de impacto de capacidade em parceria com o PM.
4. O resultado (caminho aprovado, compromissos existentes afetados, prazo) é comunicado de volta ao CEO.

O CEO não comunica a prioridade diretamente à Engenharia, aos Tech Leads ou ao PM. Todas as injeções passam pelo PO.

---

## Vendas

### O que é este papel

Vendas captura a demanda de mercado e a dor do cliente a partir de uma perspectiva comercial. Traduz conversas com clientes em oportunidades estruturadas, não em solicitações de funcionalidades.

### Inicia quando
- Um prospect ou cliente expressa uma dor, gap ou necessidade
- Um deal depende de uma capacidade de produto

### Termina quando
- A demanda foi registrada no Intake com contexto estruturado (origem, tipo, problema, impacto de negócio, prioridade)
- O Intake Layer confirmou o recebimento

### Ownership
- Captura e registro de demandas comerciais
- Documentação da dor do cliente a partir da perspectiva de vendas
- Sinais de prioridade vinculados a receita ou risco de deal

### Autoridade
- Pode sinalizar a prioridade de uma demanda com base no impacto comercial
- Pode escalar ao CEO se um deal estiver em risco

### Não faz
- Definir a solução ou abordagem técnica
- Comprometer esforço de engenharia com clientes
- Contornar a triagem indo diretamente ao CTO ou Tech Leads
- Priorizar o backlog

---

## Marketing

### O que é este papel

Marketing traz percepção externa: tendências de mercado, posicionamento competitivo e sinais de product-market fit. Identifica padrões entre segmentos, não solicitações individuais de clientes.

### Inicia quando
- A inteligência de mercado identifica um gap ou tendência relevante
- Uma campanha ou esforço de posicionamento revela necessidades não atendidas

### Termina quando
- O insight foi registrado no Intake com contexto suficiente para triagem

### Ownership
- Inteligência de mercado e sinais competitivos
- Identificação de padrões no nível de segmento
- Input de posicionamento e percepção para a estratégia de produto

### Autoridade
- Pode surfaçar oportunidades estratégicas a partir de dados de mercado
- Pode influenciar o input de posicionamento ao CTO/PO durante a racionalização

### Não faz
- Registrar bugs individuais de clientes ou tickets de suporte (isso é CS/Suporte)
- Definir o roadmap de produto
- Representar a solicitação de um único cliente como um sinal de mercado

---

## Customer Success (CS)

### O que é este papel

CS é o papel mais próximo do cliente pós-venda. Captura fricção real de uso, riscos de retenção, gaps de adoção e dor operacional de clientes existentes. O input do CS é o sinal mais concreto do sistema.

### Inicia quando
- Um cliente reporta fricção, confusão ou uma solução paliativa recorrente
- Um risco de retenção é identificado
- Um cliente solicita uma capacidade que está faltando ou quebrada

### Termina quando
- A demanda foi registrada no Intake com contexto: qual cliente, frequência, impacto na retenção ou uso, severidade

### Ownership
- Relacionamento pós-venda com o cliente e monitoramento de saúde
- Reporte de fricção real de uso e gaps de adoção
- Sinais de risco de retenção e evidências de churn
- Dados de satisfação do cliente alimentando o feedback loop

### Autoridade
- Pode sinalizar riscos de saúde do cliente que elevam a urgência de uma demanda
- Pode fornecer evidências de impacto (dados de uso, NPS, sinais de churn)

### Não faz
- Prometer funcionalidades ou prazos de produto a clientes
- Contornar o Intake e ir diretamente à Engenharia
- Definir como a solução deve ser

---

# Papéis do Intake Layer

## CTO

### O que é este papel

O CTO opera em duas dimensões simultaneamente: **estratégia técnica** e **liderança de pessoas**. No lado técnico, o CTO é um pensador sistêmico responsável pela integridade arquitetural, direção da plataforma e pela qualidade das decisões tomadas a partir do Intake Layer para baixo. No lado de pessoas, o CTO é diretamente responsável pela saúde, crescimento, produtividade e performance de toda a cadeia técnica — Tech Leads e Engineers.

O CTO não gerencia a triagem do dia a dia (isso é do PO) e não gerencia a execução de sprints (isso é do PM). Mas o CTO é dono da infraestrutura humana que torna a execução possível.

---

### Inicia quando
- Uma demanda passou pela triagem inicial do PO e foi sinalizada como necessitando de avaliação arquitetural
- Uma decisão envolve: nova infraestrutura, mudanças de plataforma, modificações de IA/runtime, impacto em multi-tenancy, segurança ou risco técnico significativo
- Uma direção tecnológica estratégica precisa ser estabelecida ou revisada
- Um problema de performance, crescimento ou saúde do time surge em qualquer ponto da cadeia técnica

### Termina quando
- O impacto arquitetural foi avaliado e documentado
- Constraints técnicos e diretrizes foram adicionados ao Readiness Package
- A demanda foi aprovada ou rejeitada no nível técnico
- (Gestão de pessoas não tem fim — é uma responsabilidade contínua)

---

### Ownership

**Estratégia Técnica**
- Todas as decisões arquiteturais (autoridade final, sem override abaixo deste papel)
- Padrões técnicos, patterns e Architecture Governance
- Seções técnicas do Readiness Package
- Estratégia de tecnologia e direção da plataforma
- Decisão sobre se uma demanda é tecnicamente viável no nível da plataforma
- Visibilidade da dívida técnica e estratégia de remediação

**Pessoas e Time**
- Performance e crescimento dos Tech Leads (subordinados diretos)
- Responsabilidade indireta pelos Engineers através dos Tech Leads
- Avaliação de capacidade do time — correspondência de senioridade e habilidades às demandas do roadmap
- Planos de desenvolvimento de carreira para toda a equipe técnica
- Decisões de contratação para papéis técnicos
- Saúde do time e segurança psicológica dentro da organização de engenharia

---

### Autoridade
- Palavra final sobre decisões arquiteturais
- Pode rejeitar ou reformular uma demanda com base na estratégia técnica
- Define padrões técnicos, patterns e diretrizes (Architecture Governance)
- Pode delegar decisões de triagem ao PO para demandas sem impacto arquitetural
- Pode escalar um problema de performance ao CEO quando afeta a capacidade de entrega
- Pode propor reestruturação do time, mudanças de papel ou contratações ao CEO com base em gaps de capacidade
- Pode sobrepor a decisão técnica de um Tech Lead se conflitar com os padrões arquiteturais

---

### Não faz
- Ser dono da fila diária de demandas entrantes (isso é do PO)
- Escrever especificações funcionais ou jornadas do usuário
- Gerenciar execução, milestones ou planejamento de sprint
- Intervir na execução downstream a menos que um problema arquitetural seja descoberto
- Conduzir avaliações de performance para papéis não técnicos (PM, PO, CS — esses pertencem às suas respectivas cadeias)

---

### Responsabilidades de Gestão de Pessoas

O escopo de gestão de pessoas do CTO cobre toda a cadeia técnica: **Tech Leads** (diretos) e **Engineers** (indiretos, através dos Tech Leads).

#### 1:1s

O CTO conduz 1:1s regulares com cada Tech Lead. Estas não são reuniões de status — são o principal instrumento para entender performance individual, bloqueios, trajetória de crescimento e sinais de saúde do time.

| Frequência | Propósito |
|---|---|
| Semanal (30 min) | Bloqueios atuais, pulso do time, decisões imediatas necessárias |
| Mensal (60 min) | Progresso de performance, metas de crescimento, troca de feedback, desenvolvimento de carreira |

Os Tech Leads são responsáveis por conduzir seus próprios 1:1s com os Engineers no mesmo ritmo. O CTO revisa sinais resumidos dessas sessões — não transcrições, mas indicadores de saúde.

#### Avaliação de 90 Dias

Toda pessoa na cadeia técnica (Tech Leads e Engineers) recebe uma avaliação estruturada formal a cada 90 dias. Não é uma revisão anual — é um sinal contínuo.

**A avaliação cobre:**

| Dimensão | O que é avaliado |
|---|---|
| **Qualidade técnica** | Qualidade de código, decisões arquiteturais, aderência a padrões, cobertura de testes |
| **Confiabilidade de entrega** | Precisão de estimativas, aderência a milestones, disciplina de escopo |
| **Resolução de problemas** | Como bloqueios são tratados, qualidade da escalada, iniciativa sob ambiguidade |
| **Comunicação** | Clareza nos handoffs, qualidade da documentação, capacidade de surfaçar problemas cedo |
| **Trajetória de crescimento** | Desenvolvimento de habilidades desde a última avaliação, iniciativa fora do escopo atribuído |
| **Contribuição ao time** | Compartilhamento de conhecimento, qualidade do code review, suporte aos pares |

**Output da avaliação:**
- Um resumo escrito entregue ao indivíduo
- Uma ação de desenvolvimento para os próximos 90 dias (específica, não genérica)
- Um sinal ao CTO: **No caminho / Precisa de suporte / Em risco**
- Se **Em risco**: um plano de melhoria de 30 dias é iniciado imediatamente

Para Engineers, as avaliações são conduzidas pelos Tech Leads e revisadas pelo CTO. Para Tech Leads, as avaliações são conduzidas diretamente pelo CTO.

#### Gestão de Performance

Problemas de performance não esperam o próximo ciclo de avaliação. O CTO é responsável por intervir assim que um sinal aparecer.

**Fontes de sinal de performance:**
- Conversas de 1:1
- Relatórios de entrega do PM (precisão de estimativas, aderência a milestones)
- Observações dos Tech Leads sobre os Engineers
- Observação direta do CTO durante revisões arquiteturais
- Feedback do PO sobre a qualidade dos handoffs

**Níveis de resposta:**

| Sinal | Resposta do CTO | Prazo |
|---|---|---|
| Fricção menor (primeira ocorrência) | Conversa de coaching no 1:1. Documentar. | Dentro de 1 semana |
| Padrão recorrente (2+ ocorrências) | Sessão formal de feedback. Plano de desenvolvimento escrito. | Dentro de 2 semanas da identificação |
| Em risco (entrega ou qualidade consistentemente abaixo do padrão) | Plano de melhoria de 30 dias com check-ins semanais | Inicia dentro de 5 dias úteis |
| Não resolvido após o plano de melhoria | Escalada ao CEO com histórico documentado | Na data de término do plano |

A gestão de performance não é punitiva — é a obrigação do CTO de dar a cada pessoa da cadeia técnica o contexto, feedback e suporte para ter sucesso antes de qualquer escalada.

#### Avaliação de Capacidade e Planejamento de Time

Além da performance individual, o CTO deve manter uma visão atual da capacidade coletiva do time em relação ao roadmap.

**Mapa de capacidade (mantido continuamente):**
- Distribuição atual de senioridade no time
- Cobertura de habilidades vs. demandas futuras do roadmap (IA, fintech, integrações, plataforma)
- Pontos únicos de conhecimento identificados (uma pessoa que conhece um sistema crítico)
- Trajetória de crescimento de cada pessoa nos próximos 6 meses

**Inputs para a avaliação de capacidade do PM:**
Quando o PM executa uma avaliação de capacidade, o CTO deve ser capaz de fornecer:
- Quais engineers estão disponíveis e com qual capacidade efetiva
- Se o time tem as habilidades necessárias para o escopo entrante
- Se algum risco de ponto único de conhecimento afeta a demanda
- Tempo estimado de rampa se existir um gap de habilidade

**Sinal de contratação:**
Se o mapa de capacidade revelar um gap persistente que não pode ser fechado por desenvolvimento no prazo necessário, o CTO surfaça uma recomendação de contratação ao CEO com:
- O gap específico (habilidade, senioridade ou capacidade)
- O impacto no roadmap se não for endereçado
- Um perfil proposto e prazo

#### Desenvolvimento de Carreira

Todo membro técnico da equipe tem um plano de desenvolvimento ativo, de propriedade do CTO (para Tech Leads) ou do Tech Lead sob supervisão do CTO (para Engineers).

**O plano de desenvolvimento contém:**
- Nível atual e nível alvo
- 2–3 habilidades ou comportamentos específicos a desenvolver nos próximos 6 meses
- Oportunidades concretas dentro do trabalho atual para praticá-los
- Um check-in a cada avaliação de 90 dias

Conversas de carreira são separadas de conversas de performance. Uma pessoa pode estar com boa performance e ainda ter uma conversa de carreira significativa. O CTO é responsável por fazer ambas acontecerem.

---

## PO (Product Owner)

### O que é este papel

O PO é o centro operacional do Intake Layer. O PO conduz a triagem, gerencia a fila de demandas, dirige a racionalização e é responsável por produzir o Readiness Package. O PO é um estrategista de produto, não um administrador de projetos.

### Inicia quando
- Uma demanda entra no Intake (de qualquer fonte upstream)
- A etapa de captura foi concluída e o input estruturado existe

### Termina quando
- O Readiness Package foi aprovado e entregue ao PM
- Ou a demanda foi rejeitada, movida para o backlog ou enviada para Discovery

### Ownership
- A fila do Intake Layer e sua saúde operacional
- Decisões de triagem para todas as demandas não arquiteturais
- O Readiness Package como entregável primário do Intake Layer
- Racionalização de produto — transformando dor em definição de capacidade
- Decisões de caminho da demanda: Rejeitado / Backlog de Oportunidades / Discovery / Product Ready
- Manutenção do Backlog de Oportunidades e cadência de revisão

### Autoridade
- Conduz a triagem de forma independente para demandas que não requerem julgamento arquitetural
- Decide o caminho da demanda: Rejeitado / Backlog de Oportunidades / Discovery / Product Ready
- Escala ao CTO quando impacto arquitetural ou técnico estratégico é identificado
- É dono do Readiness Package como entregável
- Pode devolver ao upstream se uma demanda chegar sem contexto suficiente

### Cadência de Revisão do Backlog de Oportunidades

O PO é dono do Backlog de Oportunidades e deve revisá-lo em uma cadência definida:

- **A cada 2 semanas** — revisar todos os itens. Promover para triagem, re-categorizar ou marcar como obsoleto.
- **A cada 90 dias** — qualquer item sem atividade é escalado ao CEO para uma decisão de prioridade ou encerrado formalmente com razão documentada.
- **A cada grande atualização estratégica** — se o CEO mudar a direção estratégica, o PO revisa o backlog completo para reavaliar o alinhamento.

O backlog não é um cemitério. Todo item tem um status e uma próxima ação.

### Não faz
- Aprovar decisões arquiteturais sem o CTO
- Gerenciar a execução de engenharia (isso é do PM)
- Comprometer prazos de entrega
- Aceitar uma demanda para execução sem um Readiness Package completo

---

# Papéis de Qualidade

## QA (Quality Assurance)

### O que é este papel

QA valida que o que foi construído corresponde ao que foi prometido. QA opera contra os critérios de aceite definidos no Readiness Package — não contra expectativas informais ou acordos verbais. QA é o último gate antes do release e é responsável por impedir que código não validado chegue aos clientes.

### Inicia quando
- Os Engineers concluíram a implementação e marcaram as tasks como prontas para revisão
- A Definition of Done foi cumprida no nível de código

### Termina quando
- Todos os critérios de aceite do Readiness Package foram validados
- A aprovação de release foi emitida ao PM
- Ou um defeito bloqueador foi levantado ao Tech Lead com evidências documentadas

### Ownership
- Validação dos critérios de aceite definidos no Readiness Package
- Aprovação de release ou decisão de bloqueio
- Documentação de defeitos e evidências para resolução pelo Tech Lead
- Coordenação de UAT com stakeholders de negócio relevantes quando necessário

### Autoridade
- Pode bloquear um release se os critérios de aceite não forem atendidos
- Pode escalar defeitos não resolvidos ao Tech Lead e ao PM
- Pode solicitar esclarecimento ao PO se os critérios de aceite estiverem ambíguos

### Não faz
- Definir critérios de aceite (esses vêm do Readiness Package, de propriedade do PO)
- Tomar decisões de escopo de produto
- Aprovar releases sob pressão se os critérios não forem atendidos
- Contornar o Tech Lead para escalar defeitos diretamente ao CTO

---

# Papéis do Downstream

## PM (Project Manager / Program Manager)

### O que é este papel

O PM recebe o Readiness Package e o transforma em um plano de entrega executável. O trabalho do PM é clareza na execução, não descoberta de problemas. O PM está posicionado para devolver se o Readiness Package estiver incompleto ou contraditório.

Criticamente, o PM também é o guardião da capacidade do time. Antes de se comprometer com qualquer prazo de entrega, o PM deve avaliar se o time atual tem as habilidades, disponibilidade e senioridade para executar o escopo. Quando uma demanda se torna urgente ou deve ser priorizada por pressão top-down, a responsabilidade do PM é surfaçar o gap de capacidade explicitamente — não absorvê-lo silenciosamente — e escalar ao tomador de decisão apropriado com uma avaliação clara de impacto.

### Inicia quando
- O Readiness Package foi entregue pelo PO e está marcado como completo
- Os Tech Leads confirmaram que o pacote é suficiente para a quebra técnica
- Uma avaliação de capacidade é necessária antes que um compromisso possa ser feito

### Termina quando
- A funcionalidade ou projeto foi entregue, aceito e encerrado
- O feedback loop foi iniciado (resultados pós-entrega retornados ao upstream)

### Ownership
- Execução da entrega desde o Readiness Package aprovado até o release
- Definições de milestones, sequenciamento e prazo de entrega
- Gestão de dependências cross-team durante a execução
- Escalada de bloqueios de execução ao papel upstream apropriado
- Iniciação do feedback loop após a entrega
- **Visibilidade de capacidade do time** — sabendo a todo momento a disponibilidade atual, cobertura de habilidades e distribuição de senioridade do time de execução
- **Avaliação de gap de capacidade** — quando uma nova demanda chega ou urgência é imposta top-down, produzindo uma avaliação formal do que pode e não pode ser absorvido
- **Garantia de entrega de valor** — garantindo que os compromissos feitos ao upstream estejam baseados em capacidade real, nunca em otimismo

### Autoridade
- Pode rejeitar um Readiness Package e devolvê-lo ao PO se informações necessárias estiverem faltando
- Gerencia prioridades, milestones e sequenciamento dentro do escopo aprovado
- Coordena entre Tech Leads e outros times
- Pode escalar bloqueios ao CTO ou PO se um constraint for descoberto durante a execução
- Pode bloquear um compromisso se uma avaliação de capacidade mostrar que o time não pode absorver o escopo sem comprometer a qualidade ou entregas existentes
- Pode propor redução de escopo, faseamento ou ajuste de prazo quando a capacidade for insuficiente
- Pode escalar um gap de capacidade ao PO ou CEO quando urgência top-down conflitar com a realidade do time

### Avaliação de Capacidade

Quando uma demanda chega ou urgência é imposta externamente, o PM deve produzir uma avaliação de capacidade estruturada antes que qualquer compromisso seja feito. Esta avaliação deve incluir:

- **Carga atual** — no que o time já está comprometido e com qual percentual de capacidade
- **Cobertura de habilidades** — se o time tem a senioridade e especialização necessárias para o escopo entrante
- **Mapa de conflitos** — quais entregas existentes seriam impactadas se a nova demanda for absorvida
- **Opções** — ao menos uma de: descopo, faseamento, adiamento de um compromisso existente ou contratação
- **Recomendação** — a recomendação explícita do PM, não uma lista de opções deixada para outros decidirem

Esta avaliação é entregue ao PO (e ao CEO se a pressão top-down for o gatilho) antes que um prazo seja comprometido.

### Não faz
- Inventar ou redefinir requisitos (o escopo deve vir do Readiness Package)
- Tomar decisões arquiteturais
- Negociar diretamente com clientes sobre escopo ou prazos sem alinhamento com PO/CEO
- Aceitar urgência imposta top-down sem surfaçar uma avaliação de impacto de capacidade
- Comprometer datas de entrega com base em pressão em vez de capacidade verificada do time

---

## Tech Leads

### O que é este papel

Os Tech Leads recebem o Readiness Package aprovado e o plano de execução do PM, e são responsáveis por todas as decisões técnicas dentro desse escopo. Traduzem contexto de produto em arquitetura, tasks e estratégia de implementação.

### Inicia quando
- O PM entregou o plano de execução baseado no Readiness Package aprovado
- A quebra técnica ainda não começou

### Termina quando
- Todos os épicos, histórias e tasks estão definidos
- Arquitetura e sequenciamento estão documentados
- Os Engineers iniciaram a implementação
- (Contínuo) Os Tech Leads fornecem orientação e desbloqueiam os Engineers durante a execução

### Ownership
- Quebra técnica do escopo aprovado em épicos, histórias e tasks
- Design de arquitetura dentro do escopo aprovado
- Estimativa de esforço e sequenciamento técnico
- Definition of Done para todos os entregáveis técnicos
- Estratégia de rollout (deploy, migração, monitoramento, rollback)
- Qualidade técnica do que é entregue

### Autoridade
- São donos de todas as decisões técnicas dentro do escopo aprovado
- Podem sinalizar preocupações arquiteturais ao CTO antes ou durante a execução
- Definem a Definition of Done para entregáveis técnicos
- Podem escalar ao PM/PO se o escopo conforme escrito for tecnicamente inviável

### Não faz
- Aceitar escopo ambíguo e absorver o custo silenciosamente
- Tomar decisões de produto (o que construir) — apenas decisões técnicas (como construir)
- Contornar o PM para negociar mudanças de escopo diretamente com o upstream

---

## Engineers

### O que é este papel

Os Engineers implementam, testam e entregam o trabalho definido pelos Tech Leads dentro do escopo do Readiness Package. São especialistas de execução com total autonomia técnica dentro das tasks atribuídas.

### Inicia quando
- As tasks foram definidas e atribuídas pelo Tech Lead
- O contexto de implementação está claro (constraints, arquitetura, critérios de aceite)

### Termina quando
- A task está implementada, testada, revisada e atende à Definition of Done
- O entregável passou em QA/UAT e está pronto para release

### Ownership
- Implementação das tasks atribuídas dentro da arquitetura definida
- Cobertura de testes unitários e de integração para seus entregáveis
- Qualidade de código e aderência às diretrizes técnicas dentro do seu escopo
- Surfaçar bloqueios ou contradições no nível de implementação ao Tech Lead

### Autoridade
- São donos das decisões de implementação dentro da arquitetura definida
- Podem levantar bloqueios técnicos ou contradições descobertas durante a implementação ao Tech Lead
- Podem propor abordagens de implementação melhores ao Tech Lead (não diretamente ao upstream)

### Não faz
- Aceitar tasks indefinidas ou ambíguas sem escalar ao Tech Lead
- Tomar decisões de escopo de produto
- Comunicar-se diretamente com clientes ou stakeholders upstream sem o conhecimento do PM/Tech Lead

---

# Resumo de Ownership

| Artefato ou Domínio | Dono |
|---|---|
| Estratégia e direção da empresa | CEO |
| Captura de demandas comerciais | Vendas |
| Inteligência de mercado e competitiva | Marketing |
| Saúde do cliente pós-venda e sinais de uso | Customer Success |
| Fila do Intake Layer e triagem | PO |
| Readiness Package | PO |
| Racionalização de produto | PO |
| Backlog de Oportunidades | PO |
| Decisões arquiteturais | CTO |
| Padrões técnicos e Architecture Governance | CTO |
| Seções técnicas do Readiness Package | CTO |
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

---

# Resumo de Fronteiras

| Fronteira | Papel Esquerdo | Papel Direito | Regra |
|---|---|---|---|
| Upstream → Intake | Vendas / CS / Marketing / CEO | PO | A demanda deve ser capturada em formato estruturado antes de chegar ao PO |
| Triagem do Intake | PO | CTO | PO triaja de forma independente; escala ao CTO apenas em impacto arquitetural/estratégico |
| Intake → Downstream | PO | PM | Apenas um Readiness Package completo aciona esta transição |
| Validação do PM | PM | PO | PM pode rejeitar e devolver um pacote incompleto ao PO |
| Planejamento do Downstream | PM | Tech Leads | PM entrega o plano de execução; Tech Leads são donos da quebra técnica |
| Gate de implementação | Tech Leads | Engineers | Engineers iniciam apenas com tasks definidas e contexto claro |
| Escalada técnica | Engineers | Tech Leads | Engineers escalam bloqueios ao Tech Lead, não diretamente ao PO/CTO |
| Preocupação arquitetural | Tech Leads | CTO | Tech Leads sinalizam problemas arquiteturais ao CTO, não ao PM ou PO |

---

# O Que Nenhum Papel Deve Fazer

- Comprometer capacidade de engenharia sem um Readiness Package
- Contornar o Intake Layer (nenhuma demanda vai diretamente do upstream para a execução)
- Absorver ambiguidade silenciosamente (todo papel tem a autoridade e a obrigação de escalar ou rejeitar inputs incompletos)
- Definir implementação técnica no upstream (apenas problema e contexto)
- Definir escopo de produto no downstream (apenas execução, dentro do escopo aprovado)
