# Intake Record — [Nome da Demanda]

> **Este é o Intake Record — o artefato formal da camada de intake, de autoria do PO.** Ele recebe o [`00 Documento do Submitter`](./00-submitter-brief.md) (`gateReady = true`), atribui o ID oficial `INT-AAAA-NNN` e registra o **primeiro ato do PO: a triagem** — a decisão de roteamento (Product Ready / Discovery / Backlog / Rejeitar) com justificativa rastreável. Ver [`personas/02-po.md` §3 e §6.1](../personas/02-po.md).
>
> **Ele não reescreve a captura do Submitter** — **referencia** o brief 00 e o consolida. O aprofundamento de produto (visão, escopo, regras, métricas) é o **segundo ato** do PO e vive no [`02 Readiness Package`](./02-readiness-package.md).
>
> **Jornada:** [`00 Documento do Submitter`](./00-submitter-brief.md) → `01 Intake Record (PO — triagem)` → [`02 Readiness Package (PO)`](./02-readiness-package.md) → [`03 Technical Assessment (CTO)`](./03-technical-assessment.md) → [`04 PRD (PO+CTO → PM)`](./04-prd.md).

## Metadados

| Campo | Valor |
|---|---|
| **ID do Registro** | INT-AAAA-NNN |
| **Versão** | v1 |
| **Documento do Submitter (origem)** | [`00-submitter-brief-[nome].md`](./00-submitter-brief.md) |
| **Registrado por (Submitter)** | [Nome] ([Vendas / CS / CEO / Marketing]) |
| **Triado por (PO)** | [Nome] (PO) |
| **Data de registro** | AAAA-MM-DD |
| **Data de triagem** | AAAA-MM-DD |
| **Status** | Novo / Em triagem / Triado |
| **Readiness Package vinculado** | RP-AAAA-NNN (após Product Ready) |

## Histórico de Revisão

| Versão | Data | Evento | Resumo |
|---|---|---|---|
| v1 | AAAA-MM-DD | Intake formalizado | [Breve descrição] |

---

## Prontidão recebida do Submitter

> Snapshot herdado do brief 00 no handoff. O PO não recalcula a captura — registra o que recebeu e o que segue *soft*.

| Campo | Valor |
|---|---|
| **Readiness Score no handoff** | __ % |
| **Requisitos bloqueantes** | Todos resolvidos por disposição honesta (`gateReady`) — Sim / Não |
| **Dispositions em aberto** | __ premissas a validar · __ discovery · __ delegados |

---

## Demanda consolidada

> Resumo de uma tela, validado pelo PO contra o brief 00 (não é re-digitação — é a leitura do PO). O detalhe completo, com confiança por campo, está no [`00`](./00-submitter-brief.md).

| Dimensão | Síntese | Confiança herdada |
|---|---|---|
| **Problema** (a dor, não a solução) | [Síntese] | __ |
| **Alcance** (quem é impactado) | [Personas/segmentos] | __ |
| **Impacto de negócio** | [Quantificado quando possível] | __ |
| **Urgência** (por que agora) | [Janela + custo de esperar] | __ |
| **Prioridade declarada** | Crítico / Alto / Médio / Baixo | — |

---

## Triagem — decisão de roteamento  ·  *(Ato 1 do PO)*

> O PO avalia cada critério (todos avaliados = pode concluir a triagem) e então toma **uma** decisão de caminho, com justificativa obrigatória. Ver [`personas/02-po.md` §6.1](../personas/02-po.md).

### Critérios avaliados

| # | Critério | Veredito | Justificativa (rationale) | Base / Fonte |
|---|---|---|---|---|
| 1 | É um problema real (não sintoma isolado)? | Sim / Não | [por quê] | [intake / dado] |
| 2 | É recorrente / tem volume? | Sim / Não | | |
| 3 | Encaixa na visão do produto? | Sim / Não | | |
| 4 | Qual o impacto técnico e de negócio? | Alto / Médio / Baixo | | |
| 5 | Urgência e impacto justificam agora? | Sim / Não | | |

### Decisão de caminho

| Campo | Valor |
|---|---|
| **Decisão** | Product Ready / Discovery / Backlog de Oportunidades / Rejeitar |
| **Justificativa** | [Por que esta decisão — defensável] |
| **Reversível?** | Sim (Discovery/Backlog — porta lateral) / Não (Rejeitar — fecha com justificativa) |
| **Submitter notificado** | Sim — AAAA-MM-DD |

> **Gate da triagem:** todos os critérios avaliados (não força uma decisão específica — força que a decisão seja **informada**). Só `Product Ready` abre o Ato 2 (racionalização → RP). As demais encerram a passagem pelo PO neste momento.

---

## Escalada arquitetural ao CTO

**Necessária:** Sim / Não — [breve justificativa]

> Se Sim, a escalada e o Technical Assessment acontecem durante a racionalização (RP). Ver [`interactions/05-po-to-cto.md`](../interactions/05-po-to-cto.md).

---

## Premissas validadas na triagem

> Quais premissas do brief 00 o PO revisou e o veredito de cada uma. Premissas que sobrevivem viajam adiante explicitamente.

| Premissa (do brief 00) | Veredito do PO | A validar com |
|---|---|---|
| [Premissa] | Aceita / Rejeitada / A validar | [Quem] |

---

## Constraints reconhecidos

> Constraints que o PM deve considerar desde o primeiro dia (herdados do brief, validados aqui).

| Constraint | Tipo | Nota do PO |
|---|---|---|
| [Constraint] | Tempo / Orçamento / Legal / Técnico / Escopo / Externo | [Nota] |

---

## Discovery Brief

> Preencher apenas se a decisão de caminho for **Discovery**. Caso contrário, remover esta seção.

### O que está faltando

| # | Incógnita | Quem pode responder | Método |
|---|---|---|---|
| 1 | [Incógnita] | [PO / CTO / Cliente / Vendas] | [Spike técnico / Chamada com cliente / Revisão de infraestrutura] |

**Time-box do Discovery:** [N dias] (AAAA-MM-DD → AAAA-MM-DD)

---

### Log do Discovery

#### AAAA-MM-DD — [Evento]

[Resumo do que foi feito, finding, decisão ou bloqueio]

---

### Resultado do Discovery

| # | Incógnita | Resolução | Impacto no escopo |
|---|---|---|---|
| 1 | [Incógnita] | [Resolução] | Adicionado / Removido / Movido para backlog |

**Novo caminho de decisão:** Discovery → Product Ready / Rejeitado / Backlog de Oportunidades

**Discovery encerrado:** AAAA-MM-DD ([N dias — dentro / fora do time-box])

---

## Handoff

- **Se `Product Ready`:** o PO inicia a **racionalização** → [`02 Readiness Package`](./02-readiness-package.md).
- **Se `Discovery`:** abre o Discovery Brief acima; ao encerrar, retria.
- **Se `Backlog` / `Rejeitar`:** encerra a passagem pelo PO; Submitter notificado com justificativa.
