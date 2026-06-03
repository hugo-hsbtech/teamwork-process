# Casos de uso

Exemplos trabalhados de ponta a ponta do modelo operacional — demandas reais (fictícias, auto-contidas) atravessando a **cadeia de artefatos** da camada de intake: **00 Documento do Submitter** (captura) → **01 Intake Record** (PO — triagem) → **02 Readiness Package** (PO — racionalização) → **03 Technical Assessment** (CTO — só quando há escalada arquitetural) → **04 PRD** (fusão RP + TA, abre o downstream).

Cada caso instancia os [`templates`](../../templates/README.md) por demanda e serve de calibração de qualidade para o que "pronto" significa em cada etapa.

## Casos

| Caso | Cenário | O que ilustra |
|---|---|---|
| [`case-poker`](./case-poker/README.md) | **PokerPlan** — SaaS B2B de Planning Poker | Duas demandas concorrentes (Queue Voting e Room Access Control) — uma sem e outra com escalada arquitetural ao CTO + Discovery — mostrando os dois caminhos da triagem e a fusão RP + Technical Assessment no PRD. |
| [`case-stayflow`](./case-stayflow/README.md) | **StayFlow** — plataforma B2B2C de hospedagem (OTA/marketplace) | Como uma demanda aparentemente pequena (atendimento por IA + split de pagamento) revela escopo considerável — Discovery, escalada ao CTO e a explosão de regras, edge cases e ADRs ao longo da cadeia 00→04. |

## Convenção

Cada caso vive em sua própria pasta e mantém o prefixo da jornada com o nome da demanda: `00-submitter-brief-[nome].md`, `01-intake-record-[nome].md`, `02-readiness-package-[nome].md`, `03-technical-assessment-[nome].md`, `04-prd-[nome].md` — além dos artefatos downstream (execution plan, product/tech backlog) quando o caso os exercita. Ver a jornada completa em [`templates/README.md`](../../templates/README.md).
