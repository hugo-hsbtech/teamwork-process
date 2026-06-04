# Role Definitions

## Purpose

This document establishes the boundaries of each role in the operational model. Each role has a starting point (when it becomes active), an ending point (when it hands off), a scope of authority, and explicit ownership.

Ownership means: this role is the sole accountable party for this artifact, decision, or domain. If something is not listed as owned by a role, that role has no unilateral authority over it.

No role should encroach on another's domain. When overlap occurs, the rules below resolve it.

## Organizational layers

```text
┌─────────────────────────────────────────────────────┐
│                  UPSTREAM                           │
│  CEO · Sales · Marketing · Customer Success        │
├─────────────────────────────────────────────────────┤
│                  INTAKE LAYER                       │
│            CTO · PO (Product Owner)                 │
├─────────────────────────────────────────────────────┤
│                  DOWNSTREAM                         │
│          PM · Tech Leads · Engineers                │
└─────────────────────────────────────────────────────┘
```

## Upstream roles

> The four roles below (CEO via intake channel, Sales, Marketing, CS) are, from a data-model perspective, instances of a single generic persona: the **Submitter**. This document defines their individual authority boundaries; [`personas/01-submitter.md`](./personas/01-submitter.md) consolidates *how she reasons* — the per-field trust model, the Readiness Score, and dispositions ("I don't know" is a valid disposition, not a blocker).

### CEO

The CEO defines where the company is going and what matters now. Operates at the strategic layer — market, investors, partnerships, and executive decisions.

**Starts when**
- a new strategic direction is being set;
- a high-value deal or partnership requires executive involvement;
- a business priority needs to be established or changed.

**Ends when**
- the direction, priority, or context has been communicated to Sales, CS, or directly to the CTO;
- the CEO exits the flow until a decision again requires executive authority.

**Ownership**
- Company strategy and long-term direction.
- Executive prioritization decisions.
- External narrative (investors, partners, press).
- Final authority over company-level trade-offs.

**Authority**
- Sets priorities at the company level.
- Can override product prioritization at the strategic level.
- Owns the narrative of what the company builds and why.

**Does not**
- Define features or technical requirements.
- Manage backlogs or sprints.
- Specify architecture or implementation.
- Bypass the Intake Layer to push demands directly to Engineering.

#### CEO intake channel

When the CEO needs to inject a priority into the process, the path is:

1. The CEO communicates the priority to the PO, with context: why now, what business driver, what success looks like.
2. The PO records it as a structured intake record, marking origin as Internal and priority as Critical or High.
3. The PO triages against the current queue and produces a capacity impact assessment together with the PM.
4. The outcome (approved path, affected commitments, deadline) is returned to the CEO.

The CEO does not communicate the priority directly to Engineering, Tech Leads, or the PM. Every injection goes through the PO.

### Sales

Sales captures market demand and customer pain from a commercial perspective. Translates customer conversations into structured opportunities — not feature requests.

**Starts when**
- a prospect or customer expresses pain, a gap, or a need;
- a deal depends on a product capability.

**Ends when**
- the demand has been recorded in the Intake with structured context (origin, type, problem, impact, priority);
- the Intake Layer has confirmed receipt.

**Ownership**
- Capture and recording of commercial demands.
- Documentation of customer pain from a sales perspective.
- Priority signals tied to revenue or deal risk.

**Authority**
- Can signal priority based on commercial impact.
- Can escalate to the CEO if a deal is at risk.

**Does not**
- Define the solution or technical approach.
- Commit engineering effort to customers.
- Bypass triage by going directly to the CTO or Tech Leads.
- Prioritize the backlog.

### Marketing

Marketing brings external perception: market trends, competitive positioning, and product-market fit signals. The focus is on patterns across segments, not individual requests.

**Starts when**
- market intelligence identifies a relevant gap or trend;
- a campaign or positioning effort reveals an unmet need.

**Ends when**
- the insight has been recorded in the Intake with sufficient context for triage.

**Ownership**
- Market intelligence and competitive signals.
- Identification of segment-level patterns.
- Positioning and perception input for product strategy.

**Authority**
- Can surface strategic opportunities from market data.
- Can influence positioning input to the CTO/PO during rationalization.

**Does not**
- Log individual bugs or support tickets (that is CS/Support).
- Define the product roadmap.
- Present a single customer request as a market signal.

### Customer Success (CS)

CS is the role closest to the post-sale customer. Captures real usage friction, retention risks, adoption gaps, and operational pain. CS input is the most concrete signal in the system because it comes from production use.

**Starts when**
- a customer reports recurring friction, confusion, or a workaround;
- a retention risk is identified;
- a customer requests a capability that is missing or broken.

**Ends when**
- the demand has been recorded in the Intake with context: which customer, frequency, impact on retention or usage, severity.

**Ownership**
- Post-sale relationship and customer health monitoring.
- Reporting of friction and adoption gaps.
- Retention risk signals and churn evidence.
- Satisfaction data feeding the feedback loop.

**Authority**
- Can flag customer health risks that raise the urgency of a demand.
- Can provide impact evidence (usage data, NPS, churn signals).

**Does not**
- Promise product features or deadlines to customers.
- Bypass the Intake and go directly to Engineering.
- Define what the solution should look like.

## Intake Layer roles

### CTO

The CTO operates on two dimensions simultaneously: technical strategy and people leadership.

On the technical side, the CTO is a systems thinker responsible for architectural integrity, platform direction, and the quality of decisions made from the Intake Layer downward. On the people side, the CTO is responsible for the health, growth, productivity, and performance of the entire technical chain — Tech Leads and Engineers.

The CTO does not manage day-to-day triage (that is the PO's job) nor sprint execution (that is the PM's job). The CTO owns the human infrastructure that makes execution possible.

**Starts when**
- a demand has passed the PO's initial triage and has been flagged for architectural assessment;
- a decision involves new infrastructure, platform changes, AI/runtime, multi-tenancy, security, or significant technical risk;
- a technology direction needs to be established or revisited;
- a performance, growth, or team health issue emerges at any point in the technical chain.

**Ends when**
- the architectural impact has been assessed and documented;
- the **Technical Assessment** (a standalone artifact — feasibility, constraints, architecture, technical risks, ADRs) has been produced; the CTO **never edits the RP**, which only references it and feeds into the PRD;
- the demand has been approved or rejected at the technical level.

People management has no end — it is a continuous responsibility.

**Ownership — Technical Strategy**
- All architectural decisions (final authority, no override below this role).
- Technical standards, patterns, and Architecture Governance.
- The **Technical Assessment** (a separate artifact; the CTO never edits the RP).
- Technology strategy and platform direction.
- Platform-level technical feasibility decisions.
- Visibility into technical debt and remediation strategy.

**Ownership — People and Team**
- Performance and growth of Tech Leads (direct reports).
- Indirect accountability for Engineers, through Tech Leads.
- Team capacity assessment — matching seniority and skills to roadmap demands.
- Career development plans for the technical team.
- Hiring decisions for technical roles.
- Team health and psychological safety within the engineering organization.

**Authority**
- Final say on architectural decisions.
- Can reject or reshape a demand based on technical strategy.
- Defines standards, patterns, and guidelines (Architecture Governance).
- Can delegate triage decisions to the PO for demands with no architectural impact.
- Can escalate performance issues to the CEO when they affect delivery capacity.
- Can propose team restructuring, role changes, or hiring to the CEO based on capacity gaps.
- Can override a Tech Lead's technical decision if it conflicts with architectural standards.

**Does not**
- Own the Intake's daily queue (that is the PO's job).
- Write functional specifications or user journeys.
- Manage execution, milestones, or sprint planning.
- Intervene in downstream execution unless an architectural issue surfaces.
- Conduct performance reviews for non-technical roles (PM, PO, CS — those belong to their own chains).

#### People management — 1:1s

The CTO holds regular 1:1s with each Tech Lead. These are not status meetings — they are the primary instrument for understanding individual performance, blockers, growth trajectory, and team health signals.

| Frequency | Purpose |
|---|---|
| Weekly (30 min) | Current blockers, team pulse, immediate decisions |
| Monthly (60 min) | Performance progress, growth goals, feedback exchange, career development |

Tech Leads are responsible for holding their own 1:1s with Engineers at the same cadence. The CTO reviews summarized signals from those sessions — not transcripts, but health indicators.

#### 90-day review

Every person in the technical chain (Tech Leads and Engineers) receives a structured review every 90 days. It is not an annual review — it is a continuous signal.

The review covers six dimensions:

| Dimension | What is evaluated |
|---|---|
| Technical quality | Code quality, architectural decisions, standards adherence, test coverage |
| Delivery reliability | Estimate accuracy, milestone adherence, scope discipline |
| Problem-solving | How blockers are handled, escalation quality, initiative under ambiguity |
| Communication | Clarity in handoffs, documentation quality, ability to surface problems early |
| Growth trajectory | Skill development since last review, initiative beyond assigned scope |
| Team contribution | Knowledge sharing, code review quality, peer support |

Review output:

- a written summary delivered to the individual;
- a development action for the next 90 days (specific, not generic);
- a signal to the CTO: On track / Needs support / At risk;
- if At risk, a 30-day improvement plan is started immediately.

For Engineers, reviews are conducted by Tech Leads and reviewed by the CTO. For Tech Leads, reviews are conducted directly by the CTO.

#### Performance management

Performance issues do not wait for the next review cycle. The CTO intervenes as soon as a signal appears.

Signal sources:

- 1:1 conversations;
- PM delivery reports (estimate accuracy, milestone adherence);
- Tech Lead observations about Engineers;
- Direct CTO observation during architectural reviews;
- PO feedback on handoff quality.

Response levels:

| Signal | CTO response | Timeline |
|---|---|---|
| Minor friction (first occurrence) | Coaching in the 1:1. Document. | 1 week |
| Recurring pattern (2+ occurrences) | Formal feedback session. Written development plan. | 2 weeks from identification |
| At risk (delivery or quality consistently below standard) | 30-day improvement plan with weekly check-ins | Starts within 5 business days |
| Unresolved after the plan | Escalation to CEO with documented history | On plan end date |

Performance management is not punitive. It is the CTO's obligation to give every person in the technical chain the context, feedback, and support to succeed before any escalation.

#### Capacity assessment and team planning

Beyond individual performance, the CTO maintains a current view of the team's collective capacity relative to the roadmap.

Capacity map (updated continuously):

- current seniority distribution on the team;
- skills coverage vs. future demands (AI, fintech, integrations, platform);
- single points of knowledge (a single person who knows a critical system);
- each person's growth trajectory over the next 6 months.

When the PM runs a capacity assessment, the CTO must be able to answer:

- which engineers are available and at what effective capacity;
- whether the team has the skills for the incoming scope;
- whether there is a single-point-of-knowledge risk in the demand;
- estimated ramp time if there is a skills gap.

Hiring signal: if the map reveals a persistent gap that cannot be closed through development within the required timeline, the CTO brings a recommendation to the CEO with the specific gap (skill, seniority, or capacity), the roadmap impact if nothing is done, and a proposed profile with a timeline.

#### Career development

Every member of the technical chain has an active development plan, owned by the CTO (for Tech Leads) or by the Tech Lead under the CTO's supervision (for Engineers).

The plan contains:

- current level and target level;
- 2 to 3 skills or behaviors to develop over the next 6 months;
- concrete opportunities within current work to practice them;
- check-in at every 90-day review.

Career conversations are separate from performance conversations. A person can be performing well and still have a meaningful career conversation. The CTO makes both happen.

### PO (Product Owner)

The PO is the operational center of the Intake Layer. Conducts triage, manages the demand queue, drives rationalization, and is responsible for producing the Readiness Package. The PO is a product strategist, not a project administrator.

**Starts when**
- a demand enters the Intake (from any upstream source);
- the capture step has been completed and structured input exists.

**Ends when**
- the **PRD** (the merge of the Readiness Package with the Technical Assessment, when present) has been delivered to the PM;
- or the demand has been rejected, moved to the backlog, or sent to Discovery.

**Ownership**
- The Intake Layer queue and its operational health.
- Triage decisions for all non-architectural demands.
- The Readiness Package as the PO's product deliverable — merged into the PRD that opens downstream.
- Product rationalization — transforming pain into capability definition.
- Path decision: Rejected / Opportunity Backlog / Discovery / Product Ready.
- Maintenance of the Opportunity Backlog and review cadence.
- The intake compliance contract (requirements, weights, what blocks the gate) and application of the Readiness Score in triage — see [`personas/01-submitter.md`](./personas/01-submitter.md).

**Authority**
- Conducts triage independently for demands that do not require architectural judgment.
- Decides the demand's path.
- Escalates to the CTO when there is architectural or strategic technical impact.
- Owns the Readiness Package as a deliverable.
- Can return to upstream if a demand arrives without sufficient context.

#### Opportunity Backlog review cadence

The PO owns the Opportunity Backlog and reviews it on a defined cadence:

- **Every 2 weeks** — review all items. Promote to triage, re-categorize, or mark as stale.
- **Every 90 days** — any item with no activity is escalated to the CEO for a priority decision or formally closed with a documented reason.
- **At every major strategic update** — if the CEO changes direction, the PO reviews the entire backlog to reassess alignment.

The backlog is not a graveyard. Every item has a status and a next action.

**Does not**
- Approve architectural decisions without the CTO.
- Manage engineering execution (that is the PM's job).
- Commit to delivery deadlines.
- Route a demand downstream without a complete PRD (RP frozen + Technical Assessment).

## Quality roles

### QA (Quality Assurance)

QA validates that what was built matches what was promised. Operates against the acceptance criteria defined in the Readiness Package — not against informal expectations or verbal agreements. QA is the last gate before release and prevents unvalidated code from reaching customers.

**Starts when**
- Engineers have completed implementation and marked tasks as ready for review;
- the Definition of Done has been met at the code level.

**Ends when**
- all acceptance criteria in the Readiness Package have been validated;
- release approval has been issued to the PM;
- or a blocking defect has been raised to the Tech Lead with documented evidence.

**Ownership**
- Validation of the Readiness Package acceptance criteria.
- Release approval or blocking decision.
- Defect documentation and evidence for resolution by the Tech Lead.
- Coordination of UAT with business stakeholders when required.

**Authority**
- Can block release if acceptance criteria are not met.
- Can escalate unresolved defects to the Tech Lead and PM.
- Can request clarification from the PO if acceptance criteria are ambiguous.

**Does not**
- Define acceptance criteria (these come from the Readiness Package, owned by the PO).
- Make product scope decisions.
- Approve releases under pressure if criteria are not met.
- Bypass the Tech Lead to escalate defects directly to the CTO.

## Downstream roles

### PM (Project Manager / Program Manager)

The PM receives the **PRD** (the merge of the Readiness Package with the Technical Assessment) and transforms it into an executable delivery plan. The PM's job is clarity in execution, not problem discovery. If the PRD arrives incomplete or contradictory, the PM returns it.

The PM is also the guardian of team capacity. Before committing to any deadline, the PM assesses whether the current team has the skills, availability, and seniority to execute the scope. If a demand becomes urgent or is pushed down top-down, the PM's obligation is to surface the capacity gap — not absorb it silently — and escalate to the right decision-maker with a clear impact assessment.

**Starts when**
- the PRD has been delivered by the PO and marked as complete;
- Tech Leads have confirmed the PRD is sufficient for technical breakdown;
- a capacity assessment is needed before any commitment can be made.

**Ends when**
- the feature or project has been delivered, accepted, and closed;
- the feedback loop has been initiated (post-delivery outcomes returned upstream).

**Ownership**
- Delivery execution, from the approved PRD to release.
- Definition of milestones, sequencing, and delivery deadlines.
- Cross-team dependency management during execution.
- Escalation of execution blockers to the appropriate upstream role.
- Initiation of the feedback loop after delivery.
- **Team capacity visibility** — knowing at all times the current availability, skills coverage, and seniority distribution of the execution team.
- **Capacity gap assessment** — when a new demand arrives or urgency is imposed top-down, produce a formal assessment of what can and cannot be absorbed.
- **Value delivery assurance** — ensuring commitments to upstream are based on real capacity, not optimism.

**Authority**
- Can reject a PRD and return it to the PO if required information is missing (technical gaps go to the CTO).
- Manages priorities, milestones, and sequencing within the approved scope.
- Coordinates between Tech Leads and other teams.
- Can escalate blockers to the CTO or PO if a constraint is discovered during execution.
- Can block a commitment if the capacity assessment shows the team cannot absorb the scope without compromising quality or existing deliverables.
- Can propose scope reduction, phasing, or deadline adjustment when capacity is insufficient.
- Can escalate a capacity gap to the PO or CEO when top-down urgency conflicts with team reality.

#### Capacity assessment

When a demand arrives or urgency is imposed externally, the PM produces a structured capacity assessment before any commitment. It includes:

- **Current load** — what the team is already committed to and at what capacity percentage.
- **Skills coverage** — whether the team has the seniority and expertise for the incoming scope.
- **Conflict map** — which existing deliverables would be impacted if the new demand is absorbed.
- **Options** — at least one of: descoping, phasing, deferring an existing commitment, or hiring.
- **Recommendation** — the PM's explicit recommendation, not a list of options left for others to decide.

The assessment goes to the PO (and to the CEO if top-down pressure is the trigger) before any deadline is committed.

**Does not**
- Invent or redefine requirements (scope comes from the PRD).
- Make architectural decisions.
- Negotiate directly with customers about scope or deadlines without alignment with PO/CEO.
- Accept top-down urgency without surfacing a capacity impact assessment.
- Commit dates based on pressure rather than verified capacity.

### Tech Leads

Tech Leads receive the approved PRD and the PM's execution plan, and are responsible for all technical decisions within that scope. They translate product context into architecture, tasks, and implementation strategy.

**Starts when**
- the PM has delivered the execution plan based on the approved PRD;
- technical breakdown has not yet begun.

**Ends when**
- epics, stories, and tasks are written and estimated — the demand reaches **Definition of Ready** (*Ready for Development*: only coding remains);
- architecture and sequencing are documented;
- Engineers have started implementation.

During execution, Tech Leads continue providing guidance and unblocking Engineers.

**Ownership**
- Technical breakdown of the approved scope into epics, stories, and tasks.
- Architecture design within the approved scope.
- Effort estimation and technical sequencing.
- Definition of Done for all technical deliverables.
- Rollout strategy (deploy, migration, monitoring, rollback).
- Technical quality of what is delivered.

**Authority**
- Own all technical decisions within the approved scope.
- Can flag architectural concerns to the CTO before or during execution.
- Define the Definition of Done for technical deliverables.
- Can escalate to the PM/PO if the scope as written is technically infeasible.

**Does not**
- Accept ambiguous scope and absorb the cost silently.
- Make product decisions (what to build) — only technical decisions (how to build).
- Bypass the PM to negotiate scope changes directly with upstream.

### Engineers

Engineers implement, test, and deliver the work defined by Tech Leads, within the PRD's scope. They are execution specialists with full technical autonomy within their assigned tasks.

**Starts when**
- tasks have been defined and assigned by the Tech Lead;
- implementation context is clear (constraints, architecture, acceptance criteria).

**Ends when**
- the task is implemented, tested, reviewed, and meets the Definition of Done;
- the deliverable has passed QA/UAT and is ready for release.

**Ownership**
- Implementation of assigned tasks within the defined architecture.
- Unit and integration test coverage for their deliverables.
- Code quality and adherence to technical guidelines within their scope.
- Surfacing blockers or contradictions at the implementation level to the Tech Lead.

**Authority**
- Own implementation decisions within the defined architecture.
- Can raise technical blockers or contradictions discovered during implementation to the Tech Lead.
- Can propose better implementation approaches to the Tech Lead (not directly to upstream).

**Does not**
- Accept undefined or ambiguous tasks without escalating to the Tech Lead.
- Make product scope decisions.
- Communicate directly with customers or upstream stakeholders without the PM/Tech Lead's knowledge.

## Ownership summary

| Artifact or domain | Owner |
|---|---|
| Company strategy and direction | CEO |
| Capture of commercial demands | Sales |
| Market and competitive intelligence | Marketing |
| Post-sale customer health and usage signals | Customer Success |
| Intake Layer queue and triage | PO |
| Intake compliance contract and readiness gate (Readiness Score) | PO |
| Readiness Package (sole author) | PO |
| PRD (RP + Technical Assessment merge) | PO + CTO |
| Product rationalization | PO |
| Opportunity Backlog | PO |
| Architectural decisions | CTO |
| Technical standards and Architecture Governance | CTO |
| Technical Assessment (separate artifact; the CTO never edits the RP) | CTO |
| Technical debt visibility and remediation strategy | CTO |
| Performance and growth of Tech Leads | CTO |
| 90-day reviews (Tech Leads directly, Engineers reviewed) | CTO |
| Team capacity map and hiring signals | CTO |
| Career development plans for the technical team | CTO |
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

## Boundary summary

| Boundary | Left role | Right role | Rule |
|---|---|---|---|
| Upstream → Intake | Sales / CS / Marketing / CEO | PO | The demand must be captured in structured format before reaching the PO |
| Intake triage | PO | CTO | PO triages independently; escalates to CTO only on architectural/strategic impact |
| Intake → Downstream | PO | PM | Only a complete PRD (RP frozen + Technical Assessment) triggers this transition — the commitment point |
| PM validation | PM | PO | PM can reject and return an incomplete PRD to the PO (technical gaps go to the CTO) |
| Downstream planning | PM | Tech Leads | PM delivers the execution plan; Tech Leads own the technical breakdown |
| Implementation gate | Tech Leads | Engineers | Engineers start only with defined tasks and clear context |
| Technical escalation | Engineers | Tech Leads | Engineers escalate blockers to the Tech Lead, not directly to PO/CTO |
| Architectural concern | Tech Leads | CTO | Tech Leads flag architectural issues to the CTO, not to the PM or PO |

## What no role should do

- Commit engineering capacity without a PRD.
- Bypass the Intake Layer (no demand goes directly from upstream to execution).
- Absorb ambiguity silently — every role has the authority and obligation to escalate or reject incomplete inputs.
- Define technical implementation upstream (only problem and context).
- Define product scope downstream (only execution, within the approved scope).
