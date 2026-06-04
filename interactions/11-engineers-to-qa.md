# Interaction 11 — Engineers → QA (Testing Handoff)

**Direction:** Engineers initiate. QA receives.
**Layer:** Within the Downstream

---

## Trigger

All acceptance criteria for a story or defined set of tasks are implemented, unit tests pass, and code review is complete.

---

## What Engineers Must Provide

- Implementation summary: what was built, what was changed, what was not implemented and why
- Test coverage summary: unit and integration tests written
- Known limitations or deferred edge cases (if any, they must be documented — not silently omitted)
- Environment and configuration instructions if the feature requires specific setup to test

---

## What QA Produces

- Validation against each acceptance criterion defined in the Product Backlog story
- Edge case tests based on the edge cases defined per story
- Regression suite pass confirmation
- Release approval (go) or rejection (no-go) with failing criteria specifically listed

---

## Ownership Transfer

**From the Engineers:** Implementation is complete and transferred. Engineers do not make further changes to the feature unless a QA bug report initiates them — no unsolicited modifications during QA.
**To QA:** Owns the validation cycle — acceptance criteria traceability, edge case testing, regression, and the release go/no-go decision. QA is the sole issuer of release approval.
**Artifact transferred:** Implementation + test coverage summary + known limitations.

---

## Gate

QA does not issue a release approval without explicitly validating all acceptance criteria. A "looks good" without traceability to the defined criteria is not a valid gate pass.

---

## Failure Path

If QA finds a failing acceptance criterion, it is returned to the Engineer with a bug report tracing the failure to the specific criterion. Engineers fix and resubmit to QA — they do not renegotiate the acceptance criterion.

---

## What Engineers Must NOT Do

- Hand off without a complete code review
- Omit known limitations or deferred edge cases from the summary
- Submit to QA before unit tests pass

---

## Sequence

```mermaid
sequenceDiagram
    actor ENG as Engineer
    actor QA as QA

    ENG->>QA: Implementation + test coverage summary + known limitations
    QA->>QA: Validates each acceptance criterion

    loop For each failing criterion
        QA-->>ENG: Bug report (criterion + observed vs expected)
        ENG->>ENG: Fixes
        ENG->>QA: Resubmits
    end

    QA-->>PM: Release approval (go/no-go) with criteria traceability
```
