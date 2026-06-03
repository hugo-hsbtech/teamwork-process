# Orchestration — phases, agents, and the single-writer guarantee

This skill is a **multi-agent pipeline**. The conversation you (the orchestrator)
run is **Layer 0** — the only layer that talks to the human. Everything else is a
**specialized subagent** you spawn with a focused prompt and tear down. This file
is the authoritative spec for *who runs when, who may write what, and what runs
in parallel*.

## The one rule that makes parallelism safe

**Every mutable file has exactly one writer agent.** Every other agent is
**read-only** and returns *proposals / findings / verdicts* to you (the
orchestrator), and **you** route them to the single writer. Two agents never hold
the pen on the same file, so concurrent writes are impossible by construction.

| Artifact | Sole writer | Everyone else |
|---|---|---|
| `contract.lock.md` | Template Analyst | read-only |
| `sources/`, `sources-index.md` | Source Indexer | read-only |
| `qa-log.md` | Ledger Writer | read-only |
| `target-document.md` | Doc Updater | read-only |
| `output/humanized.md` | Humanizer | read-only |
| `output/translated.<lang>.md` | Translator | read-only |
| `output/enriched.md` | Visual Enricher | read-only |
| `output/manifest.md` | Packager | read-only |

## Paths are passed in, never hardcoded (portability)

The skill is **user-scoped and repo-independent**. It may live at
`~/.claude/skills/intake-brainstorm/` or `<project>/.claude/skills/...`. So you
inject paths into every agent's spawn prompt — never let an agent assume a
location:

- `SKILL_DIR` — this skill's base directory (you are told it at launch).
- `SESSION_DIR` — `<cwd>/intake/<demand-slug>/` for this run.
- `TEMPLATE` — the target template file (default: `SKILL_DIR/assets/target-template.intake-record.md`, or a user-supplied template).

## The session folder

Create once, at the start of a run:

```
<cwd>/intake/<demand-slug>/
├── contract.lock.md          # Template Analyst
├── sources-index.md          # Source Indexer
├── sources/                  # Source Indexer (copies/links of inputs)
├── qa-log.md                 # Ledger Writer
├── target-document.md        # Doc Updater
└── output/                   # Humanizer · Translator · Enricher · Packager
```

## Phase 0 — Intake (you + the human)

Collect, in the human's language: the opening statement, any **file references**,
the **desired output language(s)**, and (optional) a custom `TEMPLATE`. Decide the
**mode**: *fresh* (no `target-document.md` yet) or *revisit* (one exists — re-score
it). Slugify the demand, create `SESSION_DIR`. Do not ask a wall of questions yet.

## Phase 1 — Setup (parallel, then gate)

Spawn **in the same turn** (independent → parallel):
- **Source Indexer** — only if files were referenced. Normalizes them into
  `sources/` and writes `sources-index.md`.
- **Template Analyst** — validates the template's annotations, derives
  `contract.lock.md` (sections, rubrics, `blocks`, `min-confidence`), and records
  the **template hash**. If a prior `contract.lock.md` exists with a *different*
  hash → it restarts analysis (see `contract-and-template.md` § Restart).

Gate: `contract.lock.md` must exist before looping.

## Phase 2 — Capture loop (iterate until the gate clears)

Each iteration:

1. Spawn **in the same turn** (both read-only proposers → parallel):
   - **Question Strategist** — reads contract + `qa-log.md` + `target-document.md`,
     returns the next batch of questions (≈1–3, one theme) each with rationale and
     the section it targets, aimed at the lowest-confidence **blocking** gaps.
   - **File Extraction** — reads `sources/` + `qa-log.md` + contract, returns
     *proposed answers* to open questions it can satisfy from the files
     (`inferred`, with `source` + confidence).
2. **Ledger Writer** (serial) commits: the new questions+rationale, and any
   file-derived proposed answers.
3. **You** present to the human only the questions *not* already satisfied by File
   Extraction. Collect answers. Hand them to the **Ledger Writer** to record. An
   answer may spawn follow-up questions → Strategist proposes, Ledger Writer
   records them with `spawned-by`.
4. **Doc Updater** (serial) fills/updates `target-document.md` from the committed
   answers, preserving each section's confidence/disposition line.
5. **Confidence Auditor** (read-only) re-scores every section against its rubric,
   reconciles source-vs-human and source-vs-source conflicts, and returns the
   **gap verdict** + readiness score.
6. Gate check: **stop** when every `blocks=true` section is either ≥ its
   `min-confidence` *or* honestly disposed (`assumption`/`discovery`/`deferred`).
   Otherwise loop — Strategist's next batch targets the Auditor's flagged gaps.

Parallelism inside the loop: Strategist ∥ Extraction (read-only). Ledger Writer →
Doc Updater run **serially** (each is a single-writer). Auditor is read-only after.

## Phase 3 — Production (isolated context, parallel variants)

Once the gate clears, hand off to isolated agents that need only the final doc —
this keeps your context lean ("isolate when satisfied"):

1. **Humanizer** writes `output/humanized.md` (must finish first — it is the
   canonical clean copy the others read).
2. Then spawn **in the same turn** (parallel variants, distinct files):
   - **Translator** → `output/translated.<lang>.md` for each requested language.
   - **Visual Enricher** → `output/enriched.md`.

   *(Per project choice: translated and enriched are independent variants; they do
   not combine into one file.)*

## Phase 4 — Wrap

- **Packager** assembles `output/`, writes `output/manifest.md` (artifact index,
  readiness score, open dispositions, template hash/version).
- You report to the human: what was produced, the readiness score, and every item
  still parked as assumption/discovery/deferred.

## Folded responsibilities (named, not separate spawns)

To avoid agent sprawl that fragments context without adding parallelism:
- **Template validation** is the Analyst's first step.
- **Conflict reconciliation** and **readiness scoring** live in the Auditor.
- **Terminology consistency** lives in the Humanizer (and is respected by the
  Translator).

If a future need is genuinely independent and parallelizable, add it as its own
agent under the same single-writer rule.
