# Readiness Package — [Nome da Demanda]

## Metadados

| Campo | Valor |
|---|---|
| **ID do Pacote** | RP-AAAA-NNN |
| **Versão** | v1 |
| **Intake vinculado** | INT-AAAA-NNN |
| **Responsável** | [Nome] (PO) |
| **Contribuição do CTO** | Sim — [escopo da avaliação] / Não necessária — sem escalada arquitetural |
| **Status** | Rascunho |
| **Data de aprovação da versão atual** | — |

## Histórico de Revisão

| Versão | Data | Autor | Status | Resumo |
|---|---|---|---|---|
| v1 | AAAA-MM-DD | [Nome] (PO) | Rascunho | Submissão inicial. |

---

## Seção 1 — Resumo Executivo

> 2–4 parágrafos curtos. Qual é o problema, o que será construído e qual é o resultado esperado de negócio.

[Resumo aqui]

---

## Seção 2 — Contexto e Problema

### Cenário Atual

[Como o sistema/produto se comporta hoje]

### Limitações

- [Limitação 1]
- [Limitação 2]

### Dor do Cliente

[Quem sente a dor, como é vivida no dia a dia]

### Impacto de Negócio

- [Impacto quantificado — receita, retenção, eficiência, etc.]

---

## Seção 3 — Objetivos

Objetivos numerados que esta entrega deve alcançar. Cada objetivo deve ser observável após o release.

1. [Objetivo 1]
2. [Objetivo 2]
3. [Objetivo 3]

---

## Seção 4 — Escopo

### Incluído

- [Item 1]
- [Item 2]

### Excluído

- [Item 1 — com motivo, se útil]
- [Item 2]

---

## Seção 5 — Personas Impactadas

| Persona | Papel | Impacto |
|---|---|---|
| [Persona 1] | [Papel] | [Como é impactado] |

---

## Seção 6 — Regras de Negócio e Fluxos

Descreva as regras, validações e transições de estado que governam esta funcionalidade. Use subseções por bloco de regras quando útil.

### [Bloco de Regras 1]

1. [Regra 1]
2. [Regra 2]

### Fluxo de Transição de Estado

```text
[Diagrama textual ou referência a diagrama]
```

### Edge Cases (no escopo)

- **[Edge case 1]**: [comportamento esperado]
- **[Edge case 2]**: [comportamento esperado]

---

## Seção 7 — Integrações Necessárias

| Sistema | Tipo | Detalhe |
|---|---|---|
| [Sistema 1] | Interno / Externo / API / Evento / Webhook / BD | [Detalhe da integração] |

---

## Seção 8 — Impacto Técnico

> Preenchida pelo PO com input do Tech Lead, ou pelo CTO quando há escalada arquitetural.
> Quando CTO contribui, marcar a coluna **Nota do CTO** explicitamente.

| Área | Impacto | Nota do CTO (se aplicável) |
|---|---|---|
| [Modelo de dados] | [Descrição] | [Validação ou nota arquitetural] |
| [Eventos / mensageria] | [Descrição] | |
| [Frontend] | [Descrição] | |
| [Segurança] | [Descrição] | |
| [Multi-tenancy] | [Descrição] | |
| [Performance / Escalabilidade] | [Descrição] | |
| [Observabilidade] | [Descrição] | |

---

## Seção 9 — Riscos e Dependências

| Risco | Tipo | Probabilidade | Impacto | Mitigação |
|---|---|---|---|---|
| [Risco 1] | Técnico / Negócio / Externo / Segurança / Operacional / Compliance | Alta / Média / Baixa | Alto / Médio / Baixo | [Mitigação] |

**Dependências:**
- [Dependência 1]
- [Dependência 2]

---

## Seção 10 — Avaliação Interna de Esforço e Custo

> Somente uso interno. Esta seção é instrumento de planejamento operacional. As estimativas abaixo não são compromissos nem obrigações contratuais e não devem ser compartilhadas com clientes, prospects ou stakeholders externos. Existem para suportar planejamento de capacidade, trade-offs de priorização e alocação de recursos dentro da empresa.
>
> As estimativas são baseadas na senioridade atual da equipe e no estado conhecido do sistema no momento da racionalização. Serão revisadas pelo Tech Lead durante o breakdown técnico.

### Esforço de Desenvolvimento

| Área | Estimativa | Senioridade |
|---|---|---|
| [Backend / Frontend / QA / etc.] | [X dias] | Senior / Mid-senior / Mid / Junior / QA |
| **Total** | **X dias** | |

### Impacto de Infraestrutura

[Descreva se há necessidade de novo provisionamento, mudanças de cluster, regiões adicionais, etc.]

### Impacto de Custo com Terceiros

[Novos provedores, licenças, APIs pagas — ou explicitamente "Nenhum"]

### Impacto de Custo Operacional Recorrente

[Aumento de armazenamento, observabilidade, banda, etc. — quantificar se possível]

### Avaliação de TCO

[Avaliação qualitativa do custo total de propriedade: a funcionalidade é neutra, adiciona linhas de custo recorrente, cria base reutilizável para fases futuras?]

---

## Seção 11 — Critérios de Sucesso

| Métrica | Meta | Medição |
|---|---|---|
| [Métrica 1] | [Meta] | [Como medir e quem mede] |

---

## Seção 12 — Roadmap Sugerido

### MVP (este release)

- [Item 1]
- [Item 2]

### Fase 2 (backlog futuro)

- [Item 1]

### Fase 3 (backlog futuro)

- [Item 1]
