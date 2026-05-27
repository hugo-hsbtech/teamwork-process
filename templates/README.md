# Templates

Templates em branco para cada artefato do processo operacional.

## Como usar

1. Copie o arquivo de template para a pasta do caso ou projeto correspondente
2. Renomeie seguindo a convenção de prefixo numérico: `01-intake-[nome].md`, `03-readiness-package-[nome].md`, etc.
3. Preencha todos os campos obrigatórios antes de avançar para o próximo estágio
4. Nenhum artefato avança sem seus campos obrigatórios preenchidos (gate)

> **Camada de confiança.** O Registro de Intake e o Readiness Package carregam uma camada de confiança por campo (`confidence / source / status / hint`) e dispositions. O gate do intake é quantitativo (`gateReady = true`, via Readiness Score), não um simples "todos os campos preenchidos" — "não sei, e este é o plano" é prontidão válida. Ver [`../personas/01-submitter.md`](../personas/01-submitter.md) e [`../metrics.md`](../metrics.md).

## Artefatos e seus donos

| Template | Dono | Quando usar |
|---|---|---|
| `00-intake-record.md` | Vendas / CS / CEO / Marketing | Ao capturar qualquer nova demanda |
| `readiness-package.md` | PO + CTO | Após triagem Product Ready, antes de entregar ao PM — herda a camada de confiança do intake |
| `execution-plan.md` | PM | Após receber e aprovar o Readiness Package |
| `product-backlog.md` | PO | Em paralelo ao Execution Plan — o quê construir |
| `tech-backlog.md` | Tech Lead | Após Product Backlog baselined — como construir |

## Convenção de IDs

| Artefato | Prefixo | Exemplo |
|---|---|---|
| Registro de Intake | INT-AAAA-NNN | INT-2024-001 |
| Readiness Package | RP-AAAA-NNN | RP-2024-001 |
| Plano de Execução | EP-AAAA-NNN | EP-2024-001 |
| Product Backlog | PB-AAAA-NNN | PB-2024-001 |
| Tech Backlog | TB-AAAA-NNN | TB-2024-001 |

## Prefixos de arquivo

| Artefato | Prefixo de arquivo |
|---|---|
| Registro de Intake | `01-` ou `02-` |
| Readiness Package | `03-` ou `04-` |
| Plano de Execução | `05-` |
| Product Backlog demanda 1 | `06.1-` |
| Tech Backlog demanda 1 | `06.2-` |
| Product Backlog demanda 2 | `07.1-` |
| Tech Backlog demanda 2 | `07.2-` |
