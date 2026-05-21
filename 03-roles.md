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

# Intake Layer Roles

## CTO

### What this role is

The CTO operates across two dimensions simultaneously: **technical strategy** and **people leadership**. On the technical side, the CTO is a systems thinker responsible for architectural integrity, platform direction, and the quality of decisions made from the Intake Layer downward. On the people side, the CTO is directly accountable for the health, growth, productivity, and performance of the entire technical chain — Tech Leads and Engineers.

The CTO does not manage day-to-day triage (that belongs to the PO) and does not manage sprint execution (that belongs to the PM). But the CTO owns the human infrastructure that makes execution possible.

---

### Starts when
- A demand has passed initial triage by the PO and has been flagged as requiring architectural assessment
- A decision involves: new infrastructure, platform changes, AI/runtime modifications, multi-tenancy impact, security, or significant technical risk
- A strategic technology direction needs to be established or revised
- A performance, growth, or team health issue surfaces anywhere in the technical chain

### Ends when
- The architectural impact has been assessed and documented
- Technical constraints and guidelines have been added to the Readiness Package
- The demand has been approved or rejected at the technical level
- (People management has no end — it is a continuous responsibility)

---

### Ownership

**Technical Strategy**
- All architectural decisions (final authority, no override below this role)
- Technical standards, patterns, and Architecture Governance
- Technical sections of the Readiness Package
- Technology strategy and platform direction
- Decision on whether a demand is technically viable at the platform level
- Technical debt visibility and remediation strategy

**People & Team**
- Performance and growth of Tech Leads (direct reports)
- Indirect accountability for Engineers through Tech Leads
- Team capability assessment — matching seniority and skills to roadmap demands
- Career development plans for all technical staff
- Hiring decisions for technical roles
- Team health and psychological safety within the engineering organization

---

### Authority
- Final word on architectural decisions
- Can reject or reshape a demand based on technical strategy
- Defines technical standards, patterns, and guidelines (Architecture Governance)
- Can delegate triage decisions to the PO for demands without architectural impact
- Can escalate a performance issue to CEO when it affects delivery capacity
- Can propose team restructuring, role changes, or hiring to CEO based on capability gaps
- Can override a Tech Lead's technical decision if it conflicts with architectural standards

---

### Does NOT do
- Own the day-to-day queue of incoming demands (that is the PO)
- Write functional specifications or user journeys
- Manage execution, milestones, or sprint planning
- Intervene in downstream execution unless an architectural issue is discovered
- Conduct performance reviews for non-technical roles (PM, PO, CS — those belong to their respective chains)

---

### People Management Responsibilities

The CTO's people management scope covers the full technical chain: **Tech Leads** (direct) and **Engineers** (indirect, through Tech Leads).

#### 1:1s

The CTO conducts regular 1:1s with each Tech Lead. These are not status meetings — they are the primary instrument for understanding individual performance, blockers, growth trajectory, and team health signals.

| Frequency | Purpose |
|---|---|
| Weekly (30 min) | Current blockers, team pulse, immediate decisions needed |
| Monthly (60 min) | Performance progress, growth goals, feedback exchange, career development |

Tech Leads are responsible for conducting their own 1:1s with Engineers on the same rhythm. The CTO reviews summary signals from those sessions — not transcripts, but health indicators.

#### 90-Day Assessment

Every person in the technical chain (Tech Leads and Engineers) receives a formal structured assessment at 90-day intervals. This is not an annual review — it is a continuous signal.

**Assessment covers:**

| Dimension | What is evaluated |
|---|---|
| **Technical quality** | Code quality, architectural decisions, adherence to standards, test coverage |
| **Delivery reliability** | Estimation accuracy, milestone adherence, scope discipline |
| **Problem-solving** | How blockers are handled, escalation quality, initiative under ambiguity |
| **Communication** | Clarity in handoffs, documentation quality, ability to surface issues early |
| **Growth trajectory** | Skill development since last assessment, initiative taken outside assigned scope |
| **Team contribution** | Knowledge sharing, code review quality, support to peers |

**Assessment output:**
- A written summary delivered to the individual
- A development action for the next 90 days (specific, not generic)
- A signal to the CTO: **On track / Needs support / At risk**
- If **At risk**: a 30-day improvement plan is initiated immediately

For Engineers, assessments are conducted by Tech Leads and reviewed by the CTO. For Tech Leads, assessments are conducted directly by the CTO.

#### Performance Management

Performance issues do not wait for the next assessment cycle. The CTO is responsible for intervening as soon as a signal appears.

**Performance signal sources:**
- 1:1 conversations
- PM delivery reports (estimation accuracy, milestone adherence)
- Tech Lead observations on Engineers
- CTO direct observation during architectural reviews
- Feedback from PO on handoff quality

**Response tiers:**

| Signal | CTO Response | Timeline |
|---|---|---|
| Minor friction (first occurrence) | Coaching conversation in 1:1. Document. | Within 1 week |
| Recurring pattern (2+ occurrences) | Formal feedback session. Written development plan. | Within 2 weeks of identification |
| At risk (delivery or quality consistently below standard) | 30-day improvement plan with weekly check-ins | Starts within 5 business days |
| Unresolved after improvement plan | Escalation to CEO with documented history | At plan end date |

Performance management is not punitive — it is the CTO's obligation to give every person in the technical chain the context, feedback, and support to succeed before any escalation occurs.

#### Capability Assessment & Team Planning

Beyond individual performance, the CTO must maintain a current view of the team's collective capability relative to the roadmap.

**Capability map (maintained continuously):**
- Current seniority distribution across the team
- Skill coverage vs. upcoming roadmap demands (AI, fintech, integrations, platform)
- Identified single points of knowledge (one person who knows a critical system)
- Growth trajectory of each person over the next 6 months

**Inputs to PM capacity assessment:**
When the PM runs a capacity assessment, the CTO must be able to provide:
- Which engineers are available and at what effective capacity
- Whether the team has the skills required for the incoming scope
- Whether any single-point-of-knowledge risk affects the demand
- Estimated ramp-up time if a skill gap exists

**Hiring signal:**
If the capability map reveals a persistent gap that cannot be closed through development in the required timeframe, the CTO surfaces a hiring recommendation to the CEO with:
- The specific gap (skill, seniority, or capacity)
- The impact on the roadmap if unaddressed
- A proposed profile and timeline

#### Career Development

Every technical team member has an active development plan owned by the CTO (for Tech Leads) or by the Tech Lead under CTO oversight (for Engineers).

**Development plan contains:**
- Current level and target level
- 2–3 specific skills or behaviors to develop in the next 6 months
- Concrete opportunities within current work to practice them
- A check-in at each 90-day assessment

Career conversations are separate from performance conversations. A person can be performing well and still have a meaningful career conversation. The CTO is responsible for making both happen.

---

## PO (Product Owner)

### What this role is

The PO is the operational center of the Intake Layer. The PO runs triage, manages the demand queue, drives rationalization, and is responsible for producing the Readiness Package. The PO is a product strategist, not a project administrator.

### Starts when
- A demand enters the Intake (from any upstream source)
- The capture step has been completed and the structured input exists

### Ends when
- The Readiness Package has been approved and handed off to the PM
- Or the demand has been rejected, moved to backlog, or sent to Discovery

### Ownership
- The Intake Layer queue and its operational health
- Triage decisions for all non-architectural demands
- The Readiness Package as the primary deliverable of the Intake Layer
- Product rationalization — transforming pain into capability definition
- Demand path decisions: Rejected / Opportunity Backlog / Discovery / Product Ready
- Opportunity Backlog maintenance and review cadence

### Authority
- Runs triage independently for demands that do not require architectural judgment
- Decides demand path: Rejected / Opportunity Backlog / Discovery / Product Ready
- Escalates to CTO when architectural or strategic technical impact is identified
- Owns the Readiness Package as a deliverable
- Can push back on upstream if a demand arrives without sufficient context

### Opportunity Backlog Review Cadence

The PO owns the Opportunity Backlog and must review it on a defined cadence:

- **Every 2 weeks** — review all items. Promote to triage, re-categorize, or mark as stale.
- **Every 90 days** — any item without activity is either escalated to the CEO for a priority decision or formally closed with a documented reason.
- **On every major strategy update** — if the CEO changes strategic direction, the PO reviews the full backlog to re-evaluate alignment.

The backlog is not a graveyard. Every item has a status and a next action.

### Does NOT do
- Approve architectural decisions without the CTO
- Manage engineering execution (that is the PM)
- Commit delivery timelines
- Accept a demand into execution without a complete Readiness Package

---

# Quality Roles

## QA (Quality Assurance)

### What this role is

QA validates that what was built matches what was promised. QA operates against the acceptance criteria defined in the Readiness Package — not against informal expectations or verbal agreements. QA is the last gate before release and is accountable for preventing unvalidated code from reaching clients.

### Starts when
- Engineers have completed implementation and marked tasks as ready for review
- The Definition of Done has been met at the code level

### Ends when
- All acceptance criteria from the Readiness Package have been validated
- Release approval has been issued to the PM
- Or a blocking defect has been raised to the Tech Lead with documented evidence

### Ownership
- Validation of acceptance criteria defined in the Readiness Package
- Release approval or blocking decision
- Defect documentation and evidence for Tech Lead resolution
- UAT coordination with relevant business stakeholders when required

### Authority
- Can block a release if acceptance criteria are not met
- Can escalate unresolved defects to the Tech Lead and PM
- Can request clarification from the PO if acceptance criteria are ambiguous

### Does NOT do
- Define acceptance criteria (those come from the Readiness Package, owned by PO)
- Make product scope decisions
- Approve releases under pressure if criteria are unmet
- Bypass the Tech Lead to escalate defects directly to the CTO

---

# Downstream Roles

## PM (Project Manager / Program Manager)

### What this role is

The PM receives the Readiness Package and transforms it into an executable delivery plan. The PM's job is execution clarity, not problem discovery. The PM is positioned to push back if the Readiness Package is incomplete or contradictory.

Critically, the PM is also the guardian of team capacity. Before committing to any delivery timeline, the PM must assess whether the current team has the skills, bandwidth, and seniority to execute the scope. When a demand becomes urgent or must be prioritized by top-down pressure, the PM's responsibility is to surface the capacity gap explicitly — not absorb it silently — and escalate to the appropriate decision-maker with a clear impact assessment.

### Starts when
- The Readiness Package has been delivered by the PO and is marked as complete
- Tech Leads have confirmed the package is sufficient for technical breakdown
- A capacity assessment is required before a commitment can be made

### Ends when
- The feature or project has been delivered, accepted, and closed
- The feedback loop has been initiated (post-delivery results returned to upstream)

### Ownership
- Delivery execution from approved Readiness Package to release
- Milestone definitions, sequencing, and delivery timeline
- Cross-team dependency management during execution
- Escalation of execution blockers to the appropriate upstream role
- Initiating the feedback loop after delivery
- **Team capacity visibility** — knowing at all times the current bandwidth, skill coverage, and seniority distribution of the execution team
- **Capacity gap assessment** — when a new demand arrives or urgency is forced top-down, producing a formal assessment of what can and cannot be absorbed
- **Value delivery guarantee** — ensuring commitments made to upstream are grounded in real capacity, never in optimism

### Authority
- Can reject a Readiness Package and return it to the PO if it is missing required information
- Manages priorities, milestones, and sequencing within the approved scope
- Coordinates across Tech Leads and other teams
- Can escalate blockers to CTO or PO if a constraint is discovered during execution
- Can block a commitment if a capacity assessment shows the team cannot absorb the scope without compromising quality or existing deliverables
- Can propose scope reduction, phasing, or timeline adjustment when capacity is insufficient
- Can escalate a capacity gap to PO or CEO when top-down urgency conflicts with team reality

### Capacity Assessment

When a demand arrives or urgency is imposed externally, the PM must produce a structured capacity assessment before any commitment is made. This assessment must include:

- **Current load** — what the team is already committed to and at what percentage of capacity
- **Skill coverage** — whether the team has the required seniority and specialization for the incoming scope
- **Conflict map** — which existing deliverables would be impacted if the new demand is absorbed
- **Options** — at least one of: descope, phase, delay an existing commitment, or hire/contract
- **Recommendation** — the PM's explicit recommendation, not a list of options left for others to decide

This assessment is delivered to the PO (and CEO if top-down pressure is the trigger) before a timeline is committed.

### Does NOT do
- Invent or redefine requirements (scope must come from the Readiness Package)
- Make architectural decisions
- Negotiate directly with clients on scope or timelines without PO/CEO alignment
- Accept urgency imposed top-down without surfacing a capacity impact assessment
- Commit delivery dates based on pressure rather than verified team capacity

---

## Tech Leads

### What this role is

Tech Leads receive the approved Readiness Package and execution plan from the PM, and are responsible for all technical decisions within that scope. They translate product context into architecture, tasks, and implementation strategy.

### Starts when
- The PM has delivered the execution plan based on the approved Readiness Package
- The technical breakdown has not yet started

### Ends when
- All epics, stories, and tasks are defined
- Architecture and sequencing are documented
- Engineers have started implementation
- (Ongoing) Tech Leads provide guidance and unblock Engineers during execution

### Ownership
- Technical breakdown of approved scope into epics, stories, and tasks
- Architecture design within the approved scope
- Effort estimation and technical sequencing
- Definition of Done for all technical deliverables
- Rollout strategy (deployment, migration, monitoring, rollback)
- Technical quality of what is delivered

### Authority
- Own all technical decisions within the approved scope
- Can flag architectural concerns to the CTO before or during execution
- Define Definition of Done for technical deliverables
- Can escalate to PM/PO if the scope as written is technically unviable

### Does NOT do
- Accept ambiguous scope and absorb the cost silently
- Make product decisions (what to build) — only technical decisions (how to build it)
- Bypass the PM to negotiate scope changes directly with upstream

---

## Engineers

### What this role is

Engineers implement, test, and deliver the work defined by Tech Leads within the scope of the Readiness Package. They are execution specialists with full technical autonomy within their assigned tasks.

### Starts when
- Tasks have been defined and assigned by the Tech Lead
- Implementation context is clear (constraints, architecture, acceptance criteria)

### Ends when
- The task is implemented, tested, reviewed, and meets the Definition of Done
- The deliverable has passed QA/UAT and is ready for release

### Ownership
- Implementation of assigned tasks within the defined architecture
- Unit and integration test coverage for their deliverables
- Code quality and adherence to technical guidelines within their scope
- Surfacing implementation-level blockers or contradictions to the Tech Lead

### Authority
- Own implementation decisions within the defined architecture
- Can raise technical blockers or contradictions discovered during implementation to the Tech Lead
- Can propose better implementation approaches to the Tech Lead (not to upstream directly)

### Does NOT do
- Accept undefined or ambiguous tasks without escalating to the Tech Lead
- Make product scope decisions
- Communicate directly with clients or upstream stakeholders without PM/Tech Lead awareness

---

# Ownership Summary

| Artifact or Domain | Owner |
|---|---|
| Company strategy and direction | CEO |
| Commercial demand capture | Sales |
| Market and competitive intelligence | Marketing |
| Post-sale client health and usage signals | Customer Success |
| Intake Layer queue and triage | PO |
| Readiness Package | PO |
| Product rationalization | PO |
| Opportunity Backlog | PO |
| Architectural decisions | CTO |
| Technical standards and Architecture Governance | CTO |
| Technical sections of the Readiness Package | CTO |
| Technical debt visibility and remediation strategy | CTO |
| Performance and growth of Tech Leads | CTO |
| 90-day assessments (Tech Leads direct, Engineers reviewed) | CTO |
| Team capability map and hiring signals | CTO |
| Career development plans for technical staff | CTO |
| Delivery execution and milestones | PM |
| Cross-team dependency management | PM |
| Feedback loop initiation | PM |
| Team capacity visibility and assessment | PM |
| Capacity gap escalation | PM |
| Technical breakdown (epics, stories, tasks) | Tech Leads |
| Architecture design within scope | Tech Leads |
| Definition of Done | Tech Leads |
| Rollout strategy | Tech Leads |
| Implementation and test coverage | Engineers |
| Release approval or blocking decision | QA |
| Acceptance criteria validation | QA |

---

# Boundary Summary

| Boundary | Left Role | Right Role | Rule |
|---|---|---|---|
| Upstream → Intake | Sales / CS / Marketing / CEO | PO | Demand must be captured in structured format before reaching PO |
| Intake triage | PO | CTO | PO triages independently; escalates to CTO only on architectural/strategic impact |
| Intake → Downstream | PO | PM | Only a complete Readiness Package triggers this transition |
| PM validation | PM | PO | PM can reject and return an incomplete package to PO |
| Downstream planning | PM | Tech Leads | PM delivers execution plan; Tech Leads own technical breakdown |
| Implementation gate | Tech Leads | Engineers | Engineers start only with defined tasks and clear context |
| Technical escalation | Engineers | Tech Leads | Engineers escalate blockers upward to Tech Lead, not directly to PO/CTO |
| Architectural concern | Tech Leads | CTO | Tech Leads flag architectural issues to CTO, not to PM or PO |

---

# What No Role Should Ever Do

- Commit engineering capacity without a Readiness Package
- Bypass the Intake Layer (no demand goes directly from upstream to execution)
- Absorb ambiguity silently (every role has the authority and obligation to escalate or reject incomplete inputs)
- Define technical implementation in the upstream (problem and context only)
- Define product scope in the downstream (execution only, within approved scope)
