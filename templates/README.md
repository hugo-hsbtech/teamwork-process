# Templates

Templates em branco para cada artefato do processo operacional.

## Como usar

1. Copie o arquivo de template para a pasta do caso ou projeto correspondente
2. Renomeie seguindo a convenção de prefixo numérico: `01-intake-[nome].md`, `03-readiness-package-[nome].md`, etc.
3. Preencha todos os campos obrigatórios antes de avançar para o próximo estágio
4. Nenhum artefato avança sem seus campos obrigatórios preenchidos (gate)

## Artefatos e seus donos

| Template | Dono | Quando usar |
|---|---|---|
| `intake-record.md` | Vendas / CS / CEO / Marketing | Ao capturar qualquer nova demanda |
| `readiness-package.md` | PO + CTO | Após triagem Product Ready, antes de entregar ao PM |
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
