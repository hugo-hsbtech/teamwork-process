# Use Cases

End-to-end worked examples of the operating model — real (fictional, self-contained) demands moving through the **artifact chain** of the intake layer: **00 Submitter Brief** (capture) → **01 Intake Record** (PO — triage) → **02 Readiness Package** (PO — rationalization) → **03 Technical Assessment** (CTO — only when there is an architectural escalation) → **04 PRD** (RP + TA merge, opens the downstream).

Each case instantiates the [`templates`](../../templates/README.md) per demand and serves as a quality calibration for what "done" means at each stage.

## Cases

| Case | Scenario | What it illustrates |
|---|---|---|
| [`case-poker`](./case-poker/README.md) | **PokerPlan** — B2B SaaS Planning Poker | Two concurrent demands (Queue Voting and Room Access Control) — one without and one with architectural escalation to the CTO + Discovery — showing both triage paths and the RP + Technical Assessment merge in the PRD. |
| [`case-stayflow`](./case-stayflow/README.md) | **StayFlow** — B2B2C lodging platform (OTA/marketplace) | How an apparently small demand (AI-assisted concierge + payment split) reveals considerable scope — Discovery, escalation to the CTO, and the explosion of rules, edge cases, and ADRs along the chain 00→04. |

## Convention

Each case lives in its own folder and maintains the journey prefix with the demand name: `00-submitter-brief-[name].md`, `01-intake-record-[name].md`, `02-readiness-package-[name].md`, `03-technical-assessment-[name].md`, `04-prd-[name].md` — plus downstream artifacts (execution plan, product/tech backlog) when the case exercises them. See the full journey in [`templates/README.md`](../../templates/README.md).
