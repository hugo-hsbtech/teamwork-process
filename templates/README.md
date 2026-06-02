# Templates

Templates em branco para cada artefato do processo operacional.

## A jornada da demanda — quatro artefatos

A demanda atravessa quatro documentos formais, cada um com **um único dono**. A correção estrutural amadurecida nas personas ([`personas/02-po.md` §2](../personas/02-po.md)) é que o **RP e o Technical Assessment são artefatos separados**, de autores diferentes, que se **fundem no PRD** — e é o **PRD**, não o RP, que abre o downstream.

```
00 Intake Record   →   01 Readiness Package   →   03 PRD                →   downstream (PM)
   (Submitter)            (PO, sozinho)              (RP + Technical Assessment)
                          02 Technical Assessment ┘  └── junção PO + CTO ──┘
                          (CTO, sozinho)
```

| # | Template | Dono | O que é | Entrega para |
|---|---|---|---|---|
| 00 | [`00-intake-record.md`](./00-intake-record.md) | **Submitter** (Vendas / CS / CEO / Marketing) | A dor capturada com honestidade — camada de confiança por campo + RICE-lite + dispositions + readiness score | PO |
| 01 | [`01-readiness-package.md`](./01-readiness-package.md) | **PO** (sozinho) | A definição de pronto de **produto**: visão, problema, escopo, regras, user stories, NFRs, edge cases, métricas | funde no PRD |
| 02 | [`02-technical-assessment.md`](./02-technical-assessment.md) | **CTO** (sozinho) | Viabilidade, constraints, arquitetura, integrações, riscos técnicos, ADRs, custo firme | funde no PRD |
| 03 | [`03-prd.md`](./03-prd.md) | **PO + CTO** (fusão) | `RP + Technical Assessment` combinados — o documento que abre o downstream | **PM** |

> **O Technical Assessment só existe quando há escalada arquitetural.** Sem impacto técnico, o PRD se forma só a partir do RP, e a referência no RP fica `Status: Não requisitado`.

### Artefatos downstream (após o PRD)

| Template | Dono | Quando usar |
|---|---|---|
| [`execution-plan.md`](./execution-plan.md) | PM | Após receber e aceitar o PRD |
| [`product-backlog.md`](./product-backlog.md) | PO | Em paralelo ao Execution Plan — o quê construir |
| [`tech-backlog.md`](./tech-backlog.md) | Tech Lead | Após Product Backlog baselined — como construir |

## Como usar

1. Copie o template para a pasta do caso ou projeto correspondente
2. Renomeie mantendo o prefixo da jornada e o nome da demanda: `00-intake-[nome].md`, `01-readiness-package-[nome].md`, etc.
3. Preencha os campos antes de avançar para o próximo estágio
4. Cada artefato avança por um **gate** (não é só "campos preenchidos")

> **Camada de confiança e gates.** O Intake carrega confiança por campo (`confidence / source / status / hint`) e dispositions; seu gate é quantitativo (`gateReady = true`, via Readiness Score) — "não sei, e este é o plano" é prontidão válida. O RP congela (`freezeReady`) quando suas seções bloqueantes estão resolvidas **e**, se o CTO foi requisitado, o Technical Assessment voltou assinado. Ver [`../personas/01-submitter.md`](../personas/01-submitter.md), [`../personas/02-po.md`](../personas/02-po.md) e [`../metrics.md`](../metrics.md).

## Regra de ouro — problema antes da solução

Se o Intake (requisito 1) ou o RP (Seção 2) descreve uma **solução** em vez do **problema**, o requisito não é satisfeito e volta para reformulação. O upstream não define API, banco, arquitetura ou tasks — isso é território do Technical Assessment (CTO) e do downstream. Ver [`../README.md` › Regra do upstream](../README.md).

## Convenção de IDs

| Artefato | Prefixo | Exemplo |
|---|---|---|
| Intake Record | INT-AAAA-NNN | INT-2026-001 |
| Readiness Package | RP-AAAA-NNN | RP-2026-001 |
| Technical Assessment | TA-AAAA-NNN | TA-2026-001 |
| PRD | PRD-AAAA-NNN | PRD-2026-001 |
| Execution Plan | EP-AAAA-NNN | EP-2026-001 |
| Product Backlog | PB-AAAA-NNN | PB-2026-001 |
| Tech Backlog | TB-AAAA-NNN | TB-2026-001 |

## Prefixos de arquivo (instâncias)

A jornada upstream → PRD usa o prefixo numérico do estágio; múltiplas demandas num mesmo caso se distinguem pelo nome (`-queue-voting`, `-access-control`).

| Artefato | Prefixo de arquivo |
|---|---|
| Intake Record | `00-` |
| Readiness Package | `01-` |
| Technical Assessment | `02-` |
| PRD | `03-` |
| Execution Plan | `05-` |
| Product Backlog | `06.1-` / `07.1-` (por demanda) |
| Tech Backlog | `06.2-` / `07.2-` (por demanda) |
