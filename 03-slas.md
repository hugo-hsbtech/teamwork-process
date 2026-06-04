# Operational SLAs and Cadences

## Purpose

This document defines the time limits and recurring rhythms of the operational model. Without them, the process exists as intention, not as a system. Each step of the flow has a maximum duration; each role has a recurring obligation.

The SLAs here are internal operational targets, not commitments to customers.

## SLAs by process step

### Intake Layer

| Step | Owner | SLA | What happens if exceeded |
|---|---|---|---|
| Initial Triage — Critical demand | PO | 24 hours after intake record | PO escalates to CEO and CTO. The demand is treated as an incident until triaged. |
| Initial Triage — High demand | PO | 3 business days | PO flags the delay to the CEO with justification. |
| Initial Triage — Medium demand | PO | Next triage cycle (max. 1 week) | Demand waits for the next scheduled session. |
| Initial Triage — Low demand | PO | Moved directly to the Opportunity Backlog | Triage not required. |
| Discovery time-box | PO | Max. 2 weeks per demand | Demand goes to the Opportunity Backlog with documented justification. |
| Rationalization → PRD (RP frozen + Technical Assessment) | PO + CTO | Max. 2 weeks for standard scope; max. 1 week for Critical | If exceeded, PO flags PM and CEO with a partial status report. |
| CTO architectural assessment | CTO | Max. 5 business days from PO escalation | PO follows up. If unresolved, CEO is notified. |

> **Where the triage clock starts.** The "Initial Triage" SLAs count from the receipt of a **ready** record (`gateReady = true`), not from the first draft. The Submitter's readiness building — filling requirements, marking assumptions, opening Discovery — happens *before* the handoff and is not SLA-bound: it runs at the persona's own pace, assisted by the system (see [`personas/01-submitter.md`](./personas/01-submitter.md)). What the PO receives already arrives confidence-graded; the triage timer measures the PO's response, not the time the Submitter took to mature the record.

### Downstream

| Step | Owner | SLA | What happens if exceeded |
|---|---|---|---|
| PM capacity assessment | PM | Max. 3 business days after receiving the PRD | PM communicates the delay to the PO. No execution commitment until complete. |
| PM execution planning | PM | Max. 1 week after capacity assessment | PM flags the delay to the PO with justification. |
| Tech Leads technical breakdown | Tech Leads | Max. 1 week for standard scope | Tech Lead flags PM. Scope may need phasing. |
| Engineer task start after assignment | Engineers | Max. 2 business days | Tech Lead investigates the blocker. |
| QA validation cycle | QA | Max. 1 week per release candidate | QA flags blockers to Tech Lead and PM daily if active defects exist. |
| Release approval or blocking decision | QA | Max. 2 business days after the QA cycle | PM escalates to Tech Lead. |
| Feedback loop initiation | PM | Within 5 business days of release | PM initiates async summary regardless. No exceptions. |

## Recurring cadences

### PO cadences

| Cadence | Frequency | Purpose |
|---|---|---|
| Intake queue review | Weekly | Review all demands in triage, discovery, and rationalization. Advance, block, or close each item. |
| Opportunity Backlog review | Bi-weekly | Promote, re-categorize, or mark items as stale. |
| Backlog expiration review | Every 90 days | Escalate or close items with more than 90 days of inactivity. |
| Strategic alignment check | At every CEO strategic update | Reassess the full backlog against the new direction. |

### PM cadences

| Cadence | Frequency | Purpose |
|---|---|---|
| Capacity review | Weekly | Update the capacity map. Flag upcoming conflicts or skills gaps before they become blockers. |
| Milestone status update | Weekly | Communicate delivery status to the PO and relevant upstream stakeholders. |
| Dependency check | Weekly | Surface cross-team dependencies before they cause delay. |
| Feedback loop report | Within 5 days of each release | Async summary of delivery accuracy, estimate quality, and process friction. |

### CTO cadences — technical strategy

| Cadence | Frequency | Purpose |
|---|---|---|
| Sync with PO | Weekly (15–30 min) | Review architectural demands flagged in the Intake queue. Prevent escalation backlog. |
| Architecture Governance review | Monthly | Review and update technical standards, patterns, and the architectural decision log. |
| Technical debt assessment | Quarterly | Evaluate accumulated technical decisions and flag roadmap risks. Produce remediation plan. |
| Capacity map update | Monthly | Update seniority distribution, skills coverage, and single-point-of-knowledge risks against the future roadmap. |

### CTO cadences — people management

| Cadence | Frequency | Purpose |
|---|---|---|
| 1:1 with each Tech Lead — pulse | Weekly (30 min) | Blockers, team pulse, immediate decisions. Not a status meeting. |
| 1:1 with each Tech Lead — deep | Monthly (60 min) | Performance progress, growth goals, feedback exchange, career development. |
| 90-day review — Tech Leads | Every 90 days | Written review across 6 dimensions. Output: On track / Needs support / At risk. |
| 90-day review — Engineers (review) | Every 90 days | Tech Leads conduct; CTO reviews and co-signs. |
| 30-day improvement plan check-in | Weekly (when active) | For anyone flagged as At risk. Structured check-in against plan goals. |
| Capacity planning review | Quarterly | Full review of capacity map vs. 6-month roadmap. Hiring signals brought to CEO. |
| Career development check-in | Every 90 days (with review) | Separate from performance. Review plan progress and update goals for the next 90 days. |
| Team health pulse | Monthly | Async or sync check initiated by CTO with the full technical team. Psychological safety, workload, morale. |

### CS cadences

| Cadence | Frequency | Purpose |
|---|---|---|
| Customer health review | Weekly | Review retention signals, NPS trends, and active friction reports. |
| Intake registration | Ongoing | Any customer signal meeting intake criteria is recorded within 2 business days. |
| Post-release feedback contribution | Within 2 weeks of each release | CS submits adoption and satisfaction data to the feedback loop initiated by the PM. |

## Escalation timers

When a step is blocked or an SLA is about to be exceeded, the escalation path is:

| Situation | First escalation | Second escalation | Time before second |
|---|---|---|---|
| Demand stuck in PO triage | PO flags CEO | CEO and CTO align on priority | 48h after first escalation |
| PRD rejected by PM | PM returns to PO with documented gaps | PO escalates to CTO if gaps are technical | 3 business days |
| Unresolved capacity conflict | PM escalates to PO | PO and CEO make priority trade-off decision | 3 business days |
| CTO unavailable for architectural review | PO escalates to CEO | CEO defines interim path | 5 business days |
| Blocking QA defect unresolved | QA escalates to Tech Lead | Tech Lead escalates to CTO if architectural | 2 business days |
| Feedback loop not initiated | Automatic PM reminder | PO follows up with PM | 5 business days after release |

## SLA principles

1. **SLAs are internal commitments, not customer promises** — they exist to keep the system moving, not to create external accountability.
2. **Exceeding an SLA is not a failure — failing to surface it is** — every violation must be documented with justification.
3. **Critical demands override all other SLAs** — when a Critical enters the queue, non-critical timers pause for the roles involved.
4. **SLAs apply to the step, not the person** — if the step is blocked by an external dependency, the timer pauses and the blocker is documented.
5. **Cadences are non-negotiable rhythms** — they do not depend on a specific trigger. They happen on schedule regardless of current workload.
