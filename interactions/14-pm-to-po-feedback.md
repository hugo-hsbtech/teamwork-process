# Interaction 14 — PM → PO (Feedback Loop Closure)

**Direction:** PM initiates. PO receives.
**Layer:** Post-Delivery

> This interaction **instantiates layer 3 of [`../metrics.md`](../metrics.md)** (business outcome: projected vs. actual). The delta between the *projected* Success Criteria in the intake/RP — which carry confidence levels — and the *measured* outcome calibrates the confidence of the Submitter's future projections. Over time, projection accuracy becomes a quality metric for the persona itself, analogous to "accepted on first version."

---

## Trigger

Feedback has been collected from CS and internal delivery metrics are available.

---

## What the PM Provides

- Delivery accuracy report: milestones met, scope changes, estimate accuracy
- Process friction points: where the model slowed down or broke
- CS feedback summary: customer outcome vs. success criteria

---

## What the PO Does With This

- Updates the product vision and backlog based on outcomes
- Documents learnings that affect future triage decisions
- Identifies any new demands that emerged from the delivery
- Feeds insights back into the opportunity backlog for the next cycle

---

## Ownership Transfer

**From the PM:** Delivery metrics and CS feedback are compiled and transferred. The PM's responsibility for this demand cycle ends when the PO acknowledges and closes the loop.
**To the PO:** Owns learning integration — backlog updates, documented lessons, and any new demands that emerged from the delivery. The loop is not closed until the PO has recorded the learnings, not merely received the report.
**Artifact transferred:** Delivery accuracy report + process friction points + CS feedback summary.

---

## Gate

The feedback loop is not closed until the PO has acknowledged the findings and documented the learnings. An unacknowledged feedback delivery is an open loop.

---

## Failure Path

If the PO does not acknowledge within the expected window, the PM escalates. Open feedback loops spanning multiple delivery cycles degrade the quality of future triage decisions.

---

## What the PO Must NOT Do

- Acknowledge receipt without documenting the learnings
- Dismiss process friction points without noting them for review
- Leave the loop open without responding to the PM's report

---

## Sequence

```mermaid
sequenceDiagram
    actor PM as PM
    actor CS as CS
    actor PO as PO

    PM->>CS: Delivery summary + success criteria to validate
    CS->>CS: Collects customer signals
    CS-->>PM: Structured feedback (against success criteria)

    PM->>PM: Compiles delivery accuracy report + process friction

    PM->>PO: Complete feedback loop report
    PO->>PO: Updates backlog + documents learnings
    PO-->>PM: Loop acknowledged — learnings recorded
```
