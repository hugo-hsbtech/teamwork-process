# Technical Assessment — [Nome da Demanda]

> O Technical Assessment (TA) é o **output do CTO** — e vai **além da arquitetura**: estabelece o **terreno técnico** sobre o qual a engenharia decide. Porque a camada de execução (humana ou agente de IA) **não tem conhecimento implícito do código-fonte**, o TA precisa tornar explícito o que normalmente fica subentendido: a natureza da demanda (software novo vs existente), o estado atual ou a fundação a ser criada, a base de conhecimento, a viabilidade de cada NFR, as alternativas descartadas, testabilidade e observabilidade — não só o impacto arquitetural. É escrito **sozinho** pelo CTO, **em paralelo** ao Readiness Package, e **responde** a ele: o CTO **nunca edita o RP**. O TA não redefine o produto — pode **vetar** a viabilidade do escopo, e nesse caso o PO revisa o escopo do RP.
>
> **Dois caminhos, um template.** A seção *Classificação técnica* abaixo determina qual caminho preencher: **Greenfield** (software/módulo novo → o TA *define* a fundação: stack, ADRs, estrutura) ou **Brownfield/Híbrido** (altera software existente → o TA *descobre e documenta* o sistema atual). Preencha o caminho que se aplica; pule o outro. O contrato é teto, não piso. Inspirado nas trilhas greenfield/brownfield do BMAD Method, nas lentes do arc42 (contexto, *solution strategy*, *quality scenarios*) e em design docs de engenharia (alternativas consideradas, *goals/non-goals*).
>
> A fusão do RP (produto) com este TA (técnico) acontece no [PRD](./04-prd.md), e é o PRD que abre o downstream. Ver [`personas/02-po.md` §2 e §10](../personas/02-po.md) e [`interactions/05-po-to-cto.md`](../interactions/05-po-to-cto.md).
>
> **Quando NÃO existe TA:** se a demanda não tem impacto arquitetural (sem escalada), não há Technical Assessment — o PRD se forma apenas a partir do RP, e a referência no RP fica `Status: Não requisitado`.

## Metadados

| Campo | Valor |
|---|---|
| **ID do Assessment** | TA-AAAA-NNN |
| **Versão** | v1 |
| **RP vinculado** | RP-AAAA-NNN vX |
| **Intake vinculado** | INT-AAAA-NNN |
| **Responsável** | [Nome] (CTO) |
| **Status** | Solicitado / Em andamento / Assinado / Vetado |
| **Veredito de viabilidade** | Viável / Viável com ressalvas / Inviável como escopado |
| **Data de sign-off** | — |

## Histórico de Revisão

| Versão | Data | Autor | Status | Resumo |
|---|---|---|---|---|
| v1 | AAAA-MM-DD | [Nome] (CTO) | Em andamento | Avaliação inicial. |

---

## Veredito de Viabilidade

> A decisão de primeira classe do CTO. Carrega justificativa — nunca um carimbo.

| Campo | Valor |
|---|---|
| **Veredito** | Viável / Viável com ressalvas / Inviável como escopado |
| **Justificativa** | [Por quê — defensável] |
| **Ressalvas (se aplicável)** | [O que precisa ser verdadeiro para o veredito se sustentar] |

> Se **Inviável como escopado**: o CTO devolve com veto + justificativa; o PO revisa o escopo do RP e re-escala. O CTO não redefine o produto. Ver [`interactions/06-cto-to-po.md`](../interactions/06-cto-to-po.md).

---

## Classificação técnica e Base de Conhecimento

> **A decisão que governa o resto do documento.** Herda a Natureza da demanda do [Intake](./01-intake-record.md) e a confirma sob a lente técnica. Define qual caminho preencher (greenfield vs brownfield) e ancora o TA na base de conhecimento — o que existe, o que falta, o que será criado.

| Campo | Valor |
|---|---|
| **Natureza (confirmada pelo CTO)** | Greenfield (novo) · Brownfield (existente) · Híbrido (novo dentro de existente) |
| **Caminho a preencher** | Fundação técnica (greenfield) · Estado atual (brownfield) · Ambos (híbrido) |
| **Base de Conhecimento (KB)** | Existe → referência · Parcial → referência + lacunas · Não existe → criar (Discovery) |
| **Referência da KB** | [`tech-landscape-[sistema].md`](./tech-landscape.md) · link · — |

> **Se a KB não existe ou está incompleta (brownfield):** documentar o sistema atual é **pré-requisito** do assessment — registre como spike no *Caminho de Discovery* (fim do documento) e produza/atualize a [`tech-landscape`](./tech-landscape.md). Não se avalia viabilidade sobre um terreno desconhecido.
> **Se greenfield:** os ADRs fundacionais (abaixo) **semeiam** uma nova [`tech-landscape`](./tech-landscape.md) — o assessment é a origem da KB, não consumidor dela.

---

## Perguntas do PO Endereçadas

> *Trace-to-source.* As incógnitas técnicas específicas que o PO escalou — e a resposta de cada uma. Mantém o assessment ancorado no que foi perguntado.

| # | Pergunta do PO | Resposta do CTO |
|---|---|---|
| 1 | [Incógnita técnica] | [Resposta] |

---

## Caminho BROWNFIELD — Estado atual / Panorama técnico  ·  *(preencher se a demanda altera software existente)*

> **Documente o sistema antes de mudá-lo.** Em brownfield, a decisão de implementação depende do que já existe — padrões, convenções, integrações, dívida. Esta seção é o equivalente ao *document-project* do BMAD: torna o terreno explícito para quem não conhece o código. Quando há uma [`tech-landscape`](./tech-landscape.md) atualizada, **referencie-a** e registre aqui apenas o que é específico desta demanda. Pular inteiramente se greenfield.

### Padrões e convenções existentes a respeitar

| Aspecto | Como é hoje | Implicação para esta demanda |
|---|---|---|
| **Estrutura / organização do código** | [Onde mora o quê] | [O que seguir] |
| **Padrões de dados / persistência** | [Modelo, migrations] | |
| **Padrões de API / contratos** | [REST/eventos, versionamento] | |
| **Autenticação / autorização** | [Como é aplicado] | |

### Pontos de integração tocados

| Ponto de integração | Sistema/módulo | Natureza do acoplamento | Risco de mexer |
|---|---|---|---|
| [Interface/serviço] | [Quem] | [Síncrono / evento / BD compartilhado] | Alto / Médio / Baixo |

### Dívida técnica e risco de regressão

| Área | Dívida / fragilidade conhecida | Risco de regressão | Cobertura de testes atual |
|---|---|---|---|
| [Módulo] | [O que está frágil] | Alto / Médio / Baixo | [Boa / parcial / inexistente] |

---

## Caminho GREENFIELD — Fundação técnica  ·  *(preencher se a demanda constrói software/módulo novo)*

> **Decida a fundação — com critérios, não por reflexo.** Em greenfield não há terreno a descobrir: o TA o **cria**. Registre as escolhas de base e o *porquê*, para que sustentem ADRs e sejam o ponto de partida da nova [`tech-landscape`](./tech-landscape.md). Pular inteiramente se brownfield puro.

### Seleção de stack (com critérios)

| Camada | Escolha | Critério de decisão | Alternativa descartada |
|---|---|---|---|
| **Linguagem / runtime** | [Escolha] | [Por quê — equipe, ecossistema, performance] | [O que e por que não] |
| **Framework / app** | | | |
| **Persistência / dados** | | | |
| **Infra / deploy** | | | |

### Arquitetura-alvo

> Diagrama de contexto e de contêiner (estilo C4 — só os níveis que agregam valor). Texto ou referência a diagrama.

```text
[Diagrama de contexto/contêiner — sistemas, usuários, contêineres e como se comunicam]
```

### Convenções de estrutura e repositório

- **Organização de pastas / módulos:** [padrão a adotar]
- **Convenções de nomeação / lint / testes:** [padrão a adotar]
- **Estratégia de branching / CI:** [padrão a adotar]

---

## Sistemas e Componentes Afetados

| Sistema / Componente | Natureza do impacto |
|---|---|
| [Serviço / módulo] | [Novo / modificado / só consumido] |

---

## Impacto Arquitetural

> Migrado da antiga Seção 8 do RP. Território exclusivo do CTO.

| Área | Impacto | Nota arquitetural |
|---|---|---|
| **Modelo de dados** | [Descrição] | [Padrão a seguir/evitar] |
| **Eventos / mensageria** | [Descrição] | |
| **Frontend** | [Descrição] | |
| **Segurança** | [Descrição] | |
| **Multi-tenancy** | [Descrição] | |
| **Performance / Escalabilidade** | [Descrição] | |
| **Observabilidade** | [Descrição] | |

---

## Integrações Necessárias

> Migrado da antiga Seção 7 do RP — agora com a lente de viabilidade técnica.

| Sistema | Tipo | Protocolo | Viabilidade / Riscos conhecidos |
|---|---|---|---|
| [Sistema 1] | Interno / Externo / API / Evento / Webhook / BD | [REST / OIDC / gRPC / …] | [Viável / limitações de terceiros / risco] |

---

## Build vs Buy

> Para cada capacidade não-trivial: construir, comprar/integrar terceiro, ou reusar algo existente? A decisão tem efeito direto em custo, prazo e risco. Pular se não há decisão relevante de make-or-buy.

| Capacidade | Decisão | Justificativa | Efeito em custo/prazo |
|---|---|---|---|
| [Capacidade] | Build / Buy / Reusar | [Por quê] | [Resumo] |

---

## Alternativas Consideradas

> **O racional, não só a conclusão.** Padrão de design doc (Google/RFC): registrar o que foi avaliado e **por que foi descartado** dá ao downstream o contexto para decidir implementação — e evita que a mesma alternativa seja re-litigada depois. Uma linha por alternativa significativa.

| Alternativa | Prós | Contras | Por que NÃO foi escolhida |
|---|---|---|---|
| [Abordagem A] | [Prós] | [Contras] | [Motivo da rejeição] |

---

## Viabilidade dos NFRs  ·  *(mapeamento ao RP, Seção 8)*

> **Fecha o loop produto ↔ técnico.** O PO declarou requisitos de qualidade no RP (Seção 8); aqui o CTO responde, NFR por NFR, se são **viáveis** e **como** — os *quality scenarios* do arc42. Um NFR inviável é um sinal de veto ou de re-escopo, não um detalhe.

| NFR (do RP §8) | Viável? | Como será atingido / abordagem | Risco / ressalva |
|---|---|---|---|
| [ex.: propagação < 500ms] | Sim / Com ressalvas / Não | [Mecanismo técnico] | [O que ameaça] |

---

## Testabilidade e Observabilidade

> Como se **prova** que funciona e como se **enxerga** em produção. Sem isto, o critério de aceite do RP não tem como ser verificado nem o comportamento monitorado.

| Dimensão | Abordagem |
|---|---|
| **Estratégia de teste** | [Unit / integração / e2e — o que cobre o quê; áreas de risco de regressão] |
| **Dados / ambiente de teste** | [Como reproduzir cenários, incluindo edge cases do RP §9] |
| **Telemetria / métricas técnicas** | [O que instrumentar para observar a feature] |
| **Logs / alertas** | [Sinais de falha e como serão detectados] |

---

## Constraints Rígidas

> Condições não-negociáveis que limitam o espaço de solução. O PO não suaviza nem reinterpreta — se discordar, escala explicitamente. Ver [`interactions/06-cto-to-po.md`](../interactions/06-cto-to-po.md).

| Constraint | Tipo | Detalhe | Efeito no escopo |
|---|---|---|---|
| [Constraint 1] | Técnico / Plataforma / Segurança / Multi-tenancy / Externo | [Detalhe] | [O que muda no RP, se algo] |

---

## Riscos Técnicos e Mitigações

> Os riscos **técnicos** vivem aqui (migrados do RP). Riscos de produto/negócio permanecem no RP, Seção 12.

| Risco | Categoria | Probabilidade | Impacto | Mitigação |
|---|---|---|---|---|
| [Risco 1] | Técnico / Segurança / Infra / Integração / Dados | Alta / Média / Baixa | Alto / Médio / Baixo | [Mitigação] |

---

## Decisões de Arquitetura (ADRs)

> Direção arquitetural no nível do CTO. A IA pode chegar com ADRs sugeridos (e reusados da base) — o CTO aprova/ajusta. O breakdown fino e ADRs de implementação pertencem ao Tech Backlog (TB) do Tech Lead.

| # | Decisão | Justificativa | Sign-off do CTO |
|---|---|---|---|
| ADR-001 | [Decisão] | [Por que esta abordagem] | ✓ |

---

## Avaliação de Esforço e Custo (firme)

> Somente uso interno. Estas são as estimativas **firmes** do CTO — substituem a estimativa preliminar do PO (RP Seção 13). Serão refinadas pelo Tech Lead no Tech Backlog. Não são compromisso contratual nem material para cliente.

### Esforço de Desenvolvimento

| Área | Estimativa | Senioridade |
|---|---|---|
| [Backend / Frontend / QA] | [X dias] | Senior / Mid / Junior / QA |
| **Total** | **X dias** | |

### Impacto de Infraestrutura

[Novo provisionamento, mudanças de cluster, regiões adicionais — ou "Nenhum"]

### Impacto de Custo com Terceiros

[Novos provedores, licenças, APIs pagas — ou "Nenhum"]

### Impacto de Custo Operacional Recorrente

[Armazenamento, observabilidade, banda — quantificar se possível]

### Avaliação de TCO

[A feature é neutra, adiciona custo recorrente, ou cria base reutilizável para fases futuras?]

---

## Caminho de Discovery (se incógnita técnica bloqueia)

> Preencher apenas se uma incógnita técnica impede o assessment de fechar. O CTO define o spike/investigação; o PO determina o time-box. A demanda volta para Discovery. Ver [`interactions/05-po-to-cto.md`](../interactions/05-po-to-cto.md).

| Incógnita | Spike / Investigação | Quem | Time-box sugerido |
|---|---|---|---|
| [Incógnita técnica] | [O que investigar] | [CTO / time] | [N dias] |
