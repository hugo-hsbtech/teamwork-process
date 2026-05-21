# Operational SLAs & Cadences

## Purpose

This document defines the time boundaries and recurring rhythms of the operational model. Without these, the process exists as intention but not as a system. Every step in the flow has a maximum duration. Every role has a recurring obligation.

SLAs here are internal operational targets, not client-facing commitments.

---

# SLAs by Process Step

## Intake Layer

| Step | Owner | SLA | What happens if exceeded |
|---|---|---|---|
| Initial Triage — Critical demand | PO | 24 hours from intake registration | PO escalates to CEO and CTO. The demand is treated as an incident until triaged. |
| Initial Triage — High demand | PO | 3 business days | PO flags delay to CEO with reason. |
| Initial Triage — Medium demand | PO | Next triage cycle (max 1 week) | Demand waits for next scheduled triage session. |
| Initial Triage — Low demand | PO | Moved directly to Opportunity Backlog | No triage required. |
| Discovery time-box | PO | Max 2 weeks per demand | Demand is moved to Opportunity Backlog with documented reason. |
| Rationalization & Readiness Package | PO + CTO | Max 2 weeks for standard scope; max 1 week for Critical | If exceeded, PO flags to PM and CEO with a partial status report. |
| CTO architectural assessment | CTO | Max 5 business days from PO escalation | PO follows up. If unresolved, CEO is notified. |

---

## Downstream

| Step | Owner | SLA | What happens if exceeded |
|---|---|---|---|
| PM capacity assessment | PM | Max 3 business days from Readiness Package receipt | PM communicates delay to PO. No execution commitment until complete. |
| PM execution planning | PM | Max 1 week from capacity assessment completion | PM flags delay to PO with reason. |
| Tech Lead technical breakdown | Tech Leads | Max 1 week for standard scope | Tech Lead flags to PM. Scope may need phasing. |
| Engineer task start after assignment | Engineers | Max 2 business days | Tech Lead investigates blocker. |
| QA validation cycle | QA | Max 1 week per release candidate | QA flags blockers to Tech Lead and PM daily if active defects exist. |
| Release approval or block decision | QA | Max 2 business days after QA cycle completes | PM escalates to Tech Lead. |
| Feedback loop initiation | PM | Within 5 business days of release | PM initiates async summary regardless. No exceptions. |

---

# Recurring Cadences

## PO Cadences

| Cadence | Frequency | Purpose |
|---|---|---|
| Intake queue review | Weekly | Review all demands in triage, discovery, and rationalization. Advance, block, or close each item. |
| Opportunity Backlog review | Bi-weekly | Promote, re-categorize, or mark items as stale. |
| Backlog expiry review | Every 90 days | Escalate or close items older than 90 days without activity. |
| Strategy alignment check | On every CEO strategy update | Re-evaluate full backlog against new strategic direction. |

---

## PM Cadences

| Cadence | Frequency | Purpose |
|---|---|---|
| Capacity review | Weekly | Update capacity map. Flag upcoming conflicts or skill gaps before they become blockers. |
| Milestone status update | Weekly | Communicate delivery status to PO and relevant upstream stakeholders. |
| Dependency check | Weekly | Surface cross-team dependencies before they cause delays. |
| Feedback loop report | Within 5 days of each release | Async summary of delivery accuracy, estimation quality, and process friction. |

---

## CTO Cadences

### Technical Strategy

| Cadence | Frequency | Purpose |
|---|---|---|
| PO sync | Weekly (15–30 min) | Review flagged architectural demands in the Intake queue. Prevent escalation backlog. |
| Architecture Governance review | Monthly | Review and update technical standards, patterns, and architectural decision log. |
| Technical debt assessment | Quarterly | Evaluate accumulated technical decisions and flag risks to roadmap. Produce remediation plan. |
| Capability map update | Monthly | Update seniority distribution, skill coverage, and single-point-of-knowledge risks against upcoming roadmap. |

### People Management

| Cadence | Frequency | Purpose |
|---|---|---|
| 1:1 with each Tech Lead — pulse | Weekly (30 min) | Blockers, team pulse, immediate decisions. Not a status meeting. |
| 1:1 with each Tech Lead — deep | Monthly (60 min) | Performance progress, growth goals, feedback exchange, career development. |
| 90-day assessment — Tech Leads | Every 90 days | Structured written assessment across 6 dimensions. Output: On track / Needs support / At risk. |
| 90-day assessment — Engineers (review) | Every 90 days | Tech Leads conduct; CTO reviews all assessments and countersigns. |
| 30-day improvement plan check-in | Weekly (when active) | For any person flagged At risk. Structured check-in against improvement plan goals. |
| Capability planning review | Quarterly | Full review of team capability map vs. 6-month roadmap. Hiring signals surfaced to CEO. |
| Career development check-in | Every 90 days (with assessment) | Separate from performance. Review development plan progress and update next 90-day targets. |
| Team health pulse | Monthly | CTO-initiated async or sync check with the full technical team. Psychological safety, workload, morale. |

---

## CS Cadences

| Cadence | Frequency | Purpose |
|---|---|---|
| Client health review | Weekly | Review retention signals, NPS trends, and active friction reports. |
| Intake registration | Ongoing | Any client signal meeting the intake criteria is registered within 2 business days. |
| Post-release feedback contribution | Within 2 weeks of each release | CS submits adoption and satisfaction data to the PM-initiated feedback loop. |

---

# Escalation Timers

When a step is blocked or an SLA is about to be exceeded, the following escalation path applies:

| Situation | First escalation | Second escalation | Time limit before second |
|---|---|---|---|
| Demand stuck in PO triage | PO flags to CEO | CEO and CTO align on priority | 48h after first escalation |
| Readiness Package rejected by PM | PM returns to PO with documented gaps | PO escalates to CTO if gaps are technical | 3 business days |
| Capacity conflict unresolved | PM escalates to PO | PO and CEO make priority trade-off decision | 3 business days |
| CTO not available for architectural review | PO escalates to CEO | CEO defines interim path | 5 business days |
| QA blocking defect not resolved | QA escalates to Tech Lead | Tech Lead escalates to CTO if architectural | 2 business days |
| Feedback loop not initiated | PM reminder auto-triggers | PO follows up with PM | 5 business days after release |

---

# SLA Principles

1. **SLAs are internal commitments, not client-facing promises** — they exist to keep the system moving, not to create liability.
2. **Exceeding an SLA is not a failure — not surfacing it is** — every breach must be documented with a reason.
3. **Critical demands override all other SLAs** — when a Critical demand enters the queue, all non-critical timers pause for the relevant roles.
4. **SLAs apply to the step, not the person** — if the step is blocked by an external dependency, the SLA clock pauses and the blocker must be documented.
5. **Cadences are non-negotiable rhythms** — they do not require a specific trigger. They happen on schedule regardless of current workload.
