# Referências e Frameworks de Apoio

> O processo descrito neste repositório não foi inventado do zero. Cada decisão estrutural tem ancoragem em algum framework já testado em produto e engenharia. Este documento faz o mapeamento explícito para qualquer pessoa que queira entender de onde vem cada peça.

---

## Sumário

O processo opera na interseção de:

1. Stage-Gate (Cooper) — governança de portões entre fases
2. Dual-Track Development (Patton, Cagan) — descoberta e entrega em paralelo
3. Continuous Discovery (Torres) — validação contínua de oportunidades
4. Lean Startup (Ries) — aprendizado validado e Build-Measure-Learn
5. Lean Software Development (Poppendieck) — eliminação de desperdício
6. Theory of Constraints (Goldratt) — gestão de gargalos
7. Principles of Product Development Flow (Reinertsen) — teoria de filas aplicada
8. Team Topologies (Skelton & Pais) — desenho organizacional por fluxo
9. Product Operations (Perri & Tilles, Cagan) — operações de produto

As seções abaixo descrevem como cada um aparece no modelo deste repositório.

---

## Mapeamento Consolidado

| Elemento do Processo | Framework | Autor(es) de Referência | Obra Canônica |
|---|---|---|---|
| Upstream vs. Downstream | Dual-Track Agile / Continuous Discovery & Delivery | Jeff Patton, Marty Cagan, Teresa Torres | *INSPIRED* (Cagan, 2008/2017); *Continuous Discovery Habits* (Torres, 2021) |
| Intake Layer com gates | Stage-Gate System | Robert G. Cooper | *Winning at New Products* (Cooper, 1986/2017) |
| Readiness Package | Stage-Gate deliverables + Definition of Ready | Cooper; Schwaber & Sutherland | Cooper (1986); *The Scrum Guide* |
| Seções do Readiness Package (gate `freezeReady`) | Validated Learning + Opportunity Solution Tree | Eric Ries, Teresa Torres | *The Lean Startup* (2011); *Continuous Discovery Habits* (2021) |
| Feedback Loop | Build-Measure-Learn / PDCA | Eric Ries, W. Edwards Deming | *The Lean Startup* (2011); *Out of the Crisis* (Deming, 1986) |
| CTO/PO como gargalo gerenciado | Theory of Constraints | Eliyahu M. Goldratt | *The Goal* (1984) |
| Estados explícitos da demanda | Kanban — "make process policies explicit" | David J. Anderson | *Kanban* (Anderson, 2010) |
| WIP / fila / lote pequeno | Principles of Product Development Flow | Donald G. Reinertsen | *The Principles of Product Development Flow* (2009) |
| Papéis (stream-aligned + enabling) | Team Topologies | Matthew Skelton & Manuel Pais | *Team Topologies* (2019) |
| "Problema antes da solução" | Lean Software Development — delay commitment | Mary & Tom Poppendieck | *Lean Software Development* (2003) |
| Matriz Probabilidade x Impacto | PMBOK / ISO 31000 | Project Management Institute / ISO | *PMBOK Guide* (PMI); *ISO 31000:2018* |
| Critérios de Sucesso explícitos | Outcome-based Product Management | Melissa Perri, Marty Cagan | *Escaping the Build Trap* (Perri, 2018) |
| Intake / Triagem / Product Ops | Product Operations | Melissa Perri & Denise Tilles; Marty Cagan | *Product Operations* (Perri & Tilles, 2023) |
| Commitment point (Discovery → Delivery) | Upstream Kanban | David J. Anderson; Klaus Leopold | *Kanban* (Anderson, 2010); *Practical Kanban* (Leopold, 2017) |
| Readiness Score (gate quantitativo) | Definition of Ready scorada + gate decision do Stage-Gate | Robert G. Cooper; Schwaber & Sutherland | Cooper (1986); *The Scrum Guide* |
| Confiança por campo + dispositions ("não sei" honesto) | Assumption Mapping + Validated Learning | Teresa Torres; David Bland & Alex Osterwalder; Eric Ries | *Continuous Discovery Habits* (2021); *Testing Business Ideas* (2019); *The Lean Startup* (2011) |
| Indicadores de valor (RICE-lite) | RICE scoring | Sean McBride / Intercom | *Intercom on Product Management* (2016) |

---

## 1. Separação upstream / downstream → Dual-Track Development

A divisão entre "descobrir o que fazer" (CEO, Sales, CS, Intake) e "executar com qualidade" (PM, Tech Leads, Engineers) é o Dual-Track Agile, termo cunhado por Jeff Patton e popularizado por Marty Cagan (Silicon Valley Product Group).

Os princípios principais:

- A Discovery Track gera itens de backlog validados; a Delivery Track gera software entregável.
- Os dois trilhos rodam em paralelo, validando riscos antes de uma linha de código de produção.
- Discovery enfrenta quatro riscos: valor, usabilidade, viabilidade técnica e viabilidade de negócio.

A partir do INSPIRED v2, Cagan abandonou o termo "Dual-Track Agile" e passou a usar Continuous Discovery / Continuous Delivery, para evitar que virasse conversa de processo em vez de princípio.

No projeto. Ver [README › A camada de tradução: CTO + PO](./README.md#a-camada-de-tradução-cto--po) e [README › 1. As três camadas](./README.md#1-as-três-camadas). A camada CTO + PO é o que SVPG chama de empowered product team: o time racionaliza o problema antes de pedir execução. O downstream não recebe "ideia solta, call gravada, mensagem Slack ou áudio" — recebe artefatos.

**Fontes.**

- [Dual-Track Agile — Silicon Valley Product Group](https://www.svpg.com/dual-track-agile/)
- [Beyond Lean and Agile — SVPG](https://www.svpg.com/beyond-lean-and-agile/)
- [Process vs. Model — SVPG](https://www.svpg.com/process-vs-model/)

---

## 2. Intake Layer com gates → Stage-Gate (Cooper)

A "Porta Controlada" CTO/PO é uma implementação de Stage-Gate, criado por Robert G. Cooper (ISBM Distinguished Research Fellow, Penn State; Professor Emeritus, McMaster).

O modelo nasceu de um estudo de 252 históricos de novos produtos em 123 empresas (Cooper & Kleinschmidt). Hoje, cerca de 80% das empresas norte-americanas usam alguma variação dele.

A estrutura clássica é Discover → Scoping → Build Business Case → Development → Testing & Validation → Launch, com gates entre cada estágio.

No projeto. Ver [README › 3. Intake Layer em detalhe](./README.md#3-intake-layer-em-detalhe) e [README › 4. O que o intake produz — Readiness Package](./README.md#4-o-que-o-intake-produz--readiness-package). A regra "demanda só sai do Intake quando está PRONTA para execução" é o gate decision do Cooper. O Readiness Package é o conjunto de deliverables exigidos no gate.

Vale lembrar que Cooper evoluiu o modelo para Next Generation Stage-Gate, adaptativo, com gates "fuzzy" e iteração dentro de fases. Útil para responder à crítica de "gate rígido".

**Fontes.**

- [Stage-Gate International — Our Story](https://www.stage-gate.com/about/our-story-2/)
- [Stage-Gate Systems: A New Tool for Managing New Products (ResearchGate)](https://www.researchgate.net/publication/4883499_Stage-Gate_Systems_A_New_Tool_for_Managing_New_Products)
- [Next Generation Stage-Gate® — Bob Cooper](https://www.bobcooper.ca/articles/next-generation-stage-gate-and-whats-next-after-stage-gate)
- [The Stage-Gate Model: An Overview — Stage-Gate International](https://www.stage-gate.com/blog/the-stage-gate-model-an-overview/)

---

## 3. Readiness Package + "Problema antes da Solução" → Lean Startup + Continuous Discovery

Ver [README › 4. O que o intake produz — Readiness Package](./README.md#4-o-que-o-intake-produz--readiness-package) e [README › 10. Regras de ouro do intake](./README.md#10-regras-de-ouro-do-intake) (regra 1: "PROBLEMA ANTES DA SOLUÇÃO").

As seções do Readiness Package operacionalizam três princípios complementares:

### 3.1 Validated Learning (Eric Ries)

O *Build-Measure-Learn* exige hipóteses explícitas antes do compromisso de recursos. As seções "Objetivos e Resultado Esperado" e "Critérios de Sucesso e Aceite" do RP forçam essa explicitação.

> "Validated learning is the process of demonstrating empirically that a team has discovered valuable truths about a startup's present and future business prospects." — Eric Ries

### 3.2 Opportunity Solution Tree (Teresa Torres, 2016)

A OST parte de um *outcome desejado* → mapeia *oportunidades* (dores) → testa *soluções* com *assumption tests*. As seções "Contexto e Problema", "Personas Impactadas" e "Regras de Negócio" do RP implementam essa árvore.

### 3.3 Delay Commitment (Poppendieck)

O princípio "comprometer-se o mais tarde possível, com a informação mais completa possível" justifica diretamente o gate do Intake: nenhum compromisso de roadmap antes do RP estar completo.

**Fontes.**

- [The Lean Startup — Principles (Eric Ries)](https://theleanstartup.com/principles)
- [Opportunity Solution Trees — Teresa Torres / Product Talk](https://www.producttalk.org/opportunity-solution-trees/)
- [Build-Measure-Learn feedback loop (Ries 2011) — ResearchGate](https://www.researchgate.net/figure/Build-measure-learn-feedback-loop-Ries-2011-p-75_fig2_308870019)
- [The 7 Principles of Lean Software Development (Poppendieck)](https://www.netsolutions.com/insights/7-principles-of-lean-software-development/)

---

## 4. Feedback Loop → Build-Measure-Learn + PDCA + Post-Launch Review

Ver [README › 2. Fluxo completo — do sinal à entrega](./README.md#2-fluxo-completo--do-sinal-à-entrega) (subgrafo "🔁 FEEDBACK LOOP") e [README › 9. Estados de uma demanda](./README.md#9-estados-de-uma-demanda) (estado `FeedbackLoop`).

O loop "PM + CS coleta resultados → PO aprende e atualiza → realimenta SIGNAL" tem três ancoragens:

- **PDCA — Plan, Do, Check, Act** (Deming, anos 1950): base de todo ciclo de melhoria contínua.
- **Build-Measure-Learn** (Ries, 2011): aplicação do PDCA a startups, com foco em *pivot or persevere*.
- **Post-Launch Review** (Stage-Gate): gate final que mede outcomes contra os Critérios de Sucesso definidos no RP.

**Fontes.**

- [Build-Measure-Learn — Verticode Insights](https://www.verticode.co.uk/blog/build-measure-learn-feedback-loop)
- [Lean Startup Methodology — Stratrix](https://www.stratrix.com/learn/frameworks/lean-startup-methodology)

---

## 5. CTO/PO como gargalo gerenciado → Theory of Constraints (Goldratt)

Ver [README › A camada de tradução: CTO + PO](./README.md#a-camada-de-tradução-cto--po). O texto reconhece: "sem uma camada de intake antes do CTO/PO, o CTO vira gargalo". Esse é o ponto de partida da Theory of Constraints, formulada por Eliyahu M. Goldratt em *The Goal* (1984).

Os cinco passos focais:

1. Identificar o gargalo (CTO/PO).
2. Explorar — o Intake Layer existe para extrair eficiência dele.
3. Subordinar — os outros papéis (PM, TL, Eng) trabalham em função do output dele; o **PRD** — a fusão do Readiness Package (PO) com o Technical Assessment (CTO) — é o output que governa o ritmo do downstream.
4. Elevar — quando saturar, adicionar Product Ops, Chief of Staff ou Founder Associate (o `README.md` já antecipa).
5. Repetir — após elevar, o gargalo muda de lugar; repete o ciclo.

A literatura moderna (DZone, Splunk, Pragmatic Engineer) mostra que ToC se aplica a desenvolvimento de software, não só a manufatura.

**Fontes.**

- [Theory of Constraints — Wikipedia](https://en.wikipedia.org/wiki/Theory_of_constraints)
- [The Theory of Constraints — Splunk](https://www.splunk.com/en_us/blog/learn/theory-of-constraints.html)
- [Applying Theory of Constraints to Software Development — DZone](https://dzone.com/articles/apply-theory-constraints-software-development-bottlenecks)
- [The Pragmatic Engineer's Guide to the Theory of Constraints](https://www.morethanmonkeys.co.uk/article/the-pragmatic-engineers-guide-to-the-theory-of-constraints/)

---

## 6. Gestão de fluxo e WIP → Reinertsen (Product Development Flow)

Donald G. Reinertsen (*The Principles of Product Development Flow*, 2009) é a referência mais rigorosa em teoria de filas aplicada a produto. O livro reúne 175 princípios em oito áreas: decisões econômicas, gestão de filas, redução de batch, WIP constraints, feedback acelerado, fluxo sob variabilidade e controle descentralizado.

No projeto:

- WIP limits no Intake — a capacidade do PO precisa ser visível e respeitada.
- Visualização de filas invisíveis — o [stateDiagram em README › 9. Estados de uma demanda](./README.md#9-estados-de-uma-demanda) torna explícitos estados (`Capturada → EmTriagem → Discovery → ProductReady…`) que normalmente ficam ocultos.
- Batch size pequeno — cada demanda atravessa sozinha, não em lote anual.

A frase de Reinertsen que mais resume o livro: *"Queues are the most important factor in maintaining optimal product development flow, and product development queues are more insidious because they tend to be invisible."*

Reinertsen é crítico de gates rígidos porque eles bloqueiam fluxo e geram filas. Por isso este modelo precisa de métricas de lead time no Intake para não cair nessa armadilha. Ver `03-slas.md` e a seção 8 abaixo.

**Fontes.**

- [The Principles of Product Development Flow — Reinertsen (Amazon)](https://www.amazon.com/Principles-Product-Development-Flow-Generation/dp/1935401009)
- [The 175 flow principles — Systems Engineering Trends](https://www.se-trends.de/en/the-175-flow-principles-why-product-development-is-often-slower-than-necessary/)
- [Principles of Product Development Flow — BPTrends](https://bptrends.info/principles-of-product-development-flow-second-generation-lean-product-development-by-donald-g-reinertsten/)

---

## 7. Estrutura de papéis → Team Topologies

Ver [README › 1. As três camadas](./README.md#1-as-três-camadas) e [README › 7. Matriz de responsabilidades](./README.md#7-matriz-de-responsabilidades).

Matthew Skelton & Manuel Pais (*Team Topologies*, 2019) dão nome aos papéis do downstream:

- Stream-aligned team — o downstream (PM, TLs, Engs e QA) entrega um fluxo de valor end-to-end. Típico: 5 a 9 engenheiros donos do ciclo completo (design, build, deploy, operar, suportar).
- Enabling team — CTO e PO atuam como enabling: não executam, capacitam, removem fricção e transferem contexto.
- Cognitive load — o Readiness Package reduz a carga cognitiva do time de execução. O downstream não precisa "descobrir o problema": recebe-o consolidado.

A leitura moderna da Lei de Conway: a estrutura do software replica a estrutura de comunicação da organização. Por isso o desenho organizacional vem do fluxo de valor, não dos componentes técnicos.

**Fontes.**

- [Team Topologies — site oficial](https://teamtopologies.com/)
- [Team Topologies — Martin Fowler](https://martinfowler.com/bliki/TeamTopologies.html)
- [Team Topologies — Atlassian](https://www.atlassian.com/devops/frameworks/team-topologies)

---

## 8. Definition of Ready e commitment point → Scrum + Upstream Kanban

Ver [README › 4. O que o intake produz — Readiness Package](./README.md#4-o-que-o-intake-produz--readiness-package) e [README › 10. Regras de ouro do intake](./README.md#10-regras-de-ouro-do-intake) (regra 4: "DISCIPLINA DE PORTA").

O Readiness Package é uma versão mais robusta da Definition of Ready do Scrum e do commitment point do Upstream Kanban.

- Definition of Ready (Scrum) — acordo leve sobre quando um item está pronto para entrar na sprint.
- Commitment point (Upstream Kanban) — linha que separa "discovery" (incerto, opcional, descartável) de "delivery" (comprometido, com prazo, com SLA). Antes da linha: opções. Depois da linha: compromissos.

Mike Cohn (Mountain Goat Software) alerta que a DoR pode degenerar em mecanismo de espera e aprovação que reduz agilidade. Por isso este projeto define SLAs explícitos em `03-slas.md`: o gate do RP não pode virar burocracia indefinida.

**Fontes.**

- [Definition of Ready — Atlassian](https://www.atlassian.com/agile/project-management/definition-of-ready)
- [Definition of Ready — Scrum Inc.](https://www.scruminc.com/definition-of-ready/)
- [The Definition of Ready and Its Dangers — Mountain Goat Software](https://www.mountaingoatsoftware.com/blog/the-dangers-of-a-definition-of-ready)
- [Upstream Kanban: The 5-Step Process — Nave](https://getnave.com/blog/upstream-kanban/)
- [Discovery Kanban — Aktia Solutions](https://aktiasolutions.com/discovery-kanban-upstream-kanban/)

---

## 9. Product Operations → Perri & Tilles, Cagan

Melissa Perri & Denise Tilles (*Product Operations*, 2023) e Marty Cagan (SVPG) descrevem Product Ops como uma função operando em quatro pilares:

1. Dados — infraestrutura analítica para o PO/PM.
2. Compreensão de usuários — operacionaliza pesquisa contínua.
3. Team ownership — governança de processo e ferramentas.
4. Comunicação interdepartamental — o que o Intake Layer faz neste projeto.

A função "Intake / Product Operations" descrita em [README › A camada de tradução: CTO + PO](./README.md#a-camada-de-tradução-cto--po) é o pilar 4. Quando o volume crescer, pode evoluir para um time de Product Ops dedicado.

**Fontes.**

- [Product Ops Overview — SVPG (Cagan)](https://www.svpg.com/product-ops-overview/)
- [Product Operations — Melissa Perri & Denise Tilles (Amazon)](https://www.amazon.com/Product-Operations-successful-companies-products/dp/B0CK3HL4WF)
- [Good Product Ops, Bad Product Ops — Dragonboat](https://dragonboat.io/blog/good-product-ops-bad-product-ops/)
- [7 Habits of Highly Effective Product Operations — Mind the Product](https://www.mindtheproduct.com/7-habits-of-highly-effective-product-ops/)

---

## 10. Lean Software Development → Poppendieck

Mary & Tom Poppendieck (*Lean Software Development*, 2003) traduziram o Toyota Production System para software. Os sete princípios e os sete desperdícios sustentam o desenho do Intake.

Sete princípios:

1. Eliminar desperdício
2. Amplificar aprendizado
3. Adiar compromisso
4. Entregar rápido
5. Construir integridade no produto
6. Engajar a inteligência dos executores
7. Otimizar o sistema inteiro

Sete desperdícios em software:

| Desperdício | Como o Intake Layer combate |
|---|---|
| Partial work | RP exige suas seções bloqueantes resolvidas (`freezeReady`) antes de seguir |
| Extra features | "Problema antes da solução" elimina features especulativas |
| Relearning | Contexto consolidado evita que downstream "descubra de novo" |
| Handoffs | RP transfere contexto completo, não fragmentado |
| Task switching | WIP limits no PO previnem multitasking |
| Delays | SLAs explícitos atacam esperas |
| Defects | Critérios de Aceite no RP previnem retrabalho |

**Fontes.**

- [The 7 Principles of Lean Software Development — NetSolutions](https://www.netsolutions.com/insights/7-principles-of-lean-software-development/)
- [Lean Software Development — Wikipedia](https://en.wikipedia.org/wiki/Lean_software_development)
- [7 Wastes of Software Development — Medium (Milan Milanović)](https://medium.com/@techworldwithmilan/7-wastes-of-software-development-8febe264c5a8)

---

## 11. Confiança de primeira classe, Readiness Score e RICE-lite

> Esta seção ancora as mecânicas que o mapeamento da persona Submitter ([`personas/01-submitter.md`](./personas/01-submitter.md)) e o template de intake ([`templates/00-submitter-brief.md`](./templates/00-submitter-brief.md)) introduziram, e que [`metrics.md`](./metrics.md) generaliza. Foram aprendidas com os protótipos e amadurecem o modelo descrito acima — não o substituem.

### 11.1 Readiness Score → Definition of Ready scorada + gate do Stage-Gate

O Readiness Score é a versão *quantitativa* do gate decision (§2, Cooper) e da Definition of Ready (§8). Em vez de um "pronto / não pronto" subjetivo, cada requisito de compliance tem um peso e um status; o score é uma função desses pesos, e `low_confidence` conta como parcial. A demanda só sai do Intake quando `gateReady = true` (todo requisito bloqueante resolvido). Isso responde diretamente à crítica de "DoR vira mecanismo de espera" (Crítica 2): o gate é uma rubrica objetiva, não uma aprovação de comitê.

### 11.2 Confiança por campo + dispositions → Assumption Mapping + Validated Learning

O RICE clássico trata "confiança" como um único número genérico. Aqui ela é **por campo e por indicador** (`confidence / source / status / hint`) — a camada de honestidade que viaja com o artefato. As **dispositions** (`answered · inferred · assumption · discovery · deferred`) operacionalizam o princípio de que uma premissa explícita é melhor que uma certeza falsa:

- `assumption` é exatamente o *assumption mapping* de Bland & Osterwalder (*Testing Business Ideas*) e os *assumption tests* da Opportunity Solution Tree de Torres (§3.2);
- `discovery` time-boxed é o *validated learning* de Ries (§3.1) — "não sabemos ainda, e este é o plano para descobrir" é uma forma válida de prontidão;
- a graduação por confiança realiza o *delay commitment* de Poppendieck (§3.3) no nível do campo, não só no nível do gate.

### 11.3 Indicadores de valor (RICE-lite) → RICE scoring (Intercom)

Os indicadores Impacto / Alcance / Urgência são uma versão enxuta do RICE (Reach, Impact, Confidence, Effort), criado por Sean McBride na Intercom. Duas adaptações conscientes:

- **Confiança não é re-pontuada** como no RICE original — ela reusa a camada de confiança de §11.2, evitando duplicação;
- **Esforço fica *soft*** (chute da Submitter, firmado depois pelo CTO), porque a persona de fronteira não é técnica.

O ponto crucial: RICE-lite **não** é usado como fórmula de ranking automático. É um espelho que desafia o pensamento — a tensão entre indicadores (ex.: Impacto alto + confiança baixa) é uma provocação, não um número de priorização. Isso preserva o princípio de Reinertsen (§6) de que decisões econômicas são contextuais, não mecânicas.

**Fontes.**

- [RICE Scoring Model — Intercom (Sean McBride)](https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/)
- [Testing Business Ideas — Bland & Osterwalder (Strategyzer)](https://www.strategyzer.com/library/testing-business-ideas)
- [Assumptions Mapping — Product Talk (Teresa Torres)](https://www.producttalk.org/2021/06/assumption-testing/)

---

## Críticas honestas e mitigações

Toda escolha estrutural tem trade-off. Vale antecipar as críticas mais comuns.

### Crítica 1: "Stage-Gate é pesado e burocrático"

A versão clássica de 1986 pode ser, sim. Cooper evoluiu para Next Generation Stage-Gate (adaptativo, com gates fuzzy).

Mitigação no projeto: o Readiness Package tem deliverables fixos e SLAs claros (`03-slas.md`). Gates são revisões de evidência, não comitês.

### Crítica 2: "Definition of Ready vira mecanismo de espera"

Mike Cohn alerta que a DoR pode degenerar em "não posso começar até ser aprovado".

Mitigação no projeto: SLAs explícitos por estado da demanda e critérios objetivos (gate `freezeReady` do RP) em vez de aprovação subjetiva.

### Crítica 3: "Gates criam filas invisíveis"

Reinertsen mostra que gates bloqueiam fluxo se o WIP não for gerenciado.

Mitigação no projeto: estados explícitos (`stateDiagram-v2` em `README.md`) tornam filas visíveis. Próximo passo: instrumentar lead time por estado.

### Crítica 4: "Dual-Track Agile virou anti-padrão na própria SVPG"

Cagan abandonou o termo porque virou conversa de processo.

Mitigação no projeto: adotar a terminologia atual — Continuous Discovery / Continuous Delivery — em comunicação externa e onboarding.

### Crítica 5: "Modelo pesado para uma startup pequena"

O peso real está em fazer mal, não em fazer. O custo de retrabalho de uma feature mal especificada é maior que o custo do Intake.

Mitigação no projeto: o Intake pode começar enxuto (CTO e PO acumulando o papel) e crescer para Product Ops quando o volume justificar — como descrito no `README.md`.

---

## Bibliografia Recomendada

### Livros (ordem cronológica)

- **Goldratt, E. M.** (1984). *The Goal: A Process of Ongoing Improvement*. North River Press.
- **Cooper, R. G.** (1986/2017). *Winning at New Products: Creating Value Through Innovation* (5ª ed.). Basic Books.
- **Poppendieck, M., & Poppendieck, T.** (2003). *Lean Software Development: An Agile Toolkit*. Addison-Wesley.
- **Cagan, M.** (2008/2017). *INSPIRED: How to Create Tech Products Customers Love* (2ª ed.). Wiley.
- **Reinertsen, D. G.** (2009). *The Principles of Product Development Flow: Second Generation Lean Product Development*. Celeritas Publishing.
- **Anderson, D. J.** (2010). *Kanban: Successful Evolutionary Change for Your Technology Business*. Blue Hole Press.
- **Ries, E.** (2011). *The Lean Startup: How Today's Entrepreneurs Use Continuous Innovation to Create Radically Successful Businesses*. Crown Business.
- **McBride, S., et al.** (2016). *Intercom on Product Management*. Intercom Inc. (origem do modelo RICE).
- **Leopold, K.** (2017). *Practical Kanban: From Team Focus to Creating Value*. LEANability Press.
- **Perri, M.** (2018). *Escaping the Build Trap: How Effective Product Management Creates Real Value*. O'Reilly.
- **Bland, D. J., & Osterwalder, A.** (2019). *Testing Business Ideas*. Wiley / Strategyzer.
- **Skelton, M., & Pais, M.** (2019). *Team Topologies: Organizing Business and Technology Teams for Fast Flow*. IT Revolution Press.
- **Torres, T.** (2021). *Continuous Discovery Habits: Discover Products That Create Customer Value and Business Value*. Product Talk LLC.
- **Perri, M., & Tilles, D.** (2023). *Product Operations: How Successful Companies Build Better Products at Scale*. Product Institute.

### Padrões e Normas

- **PMI** (2021). *A Guide to the Project Management Body of Knowledge (PMBOK Guide)* — 7ª edição.
- **ISO** (2018). *ISO 31000:2018 — Risk management — Guidelines*.

### Artigos e Recursos Online

- [Stage-Gate International — Knowledge Center](https://www.stage-gate.com)
- [Silicon Valley Product Group — Articles](https://www.svpg.com)
- [Product Talk — Teresa Torres](https://www.producttalk.org)
- [Team Topologies — Resources](https://teamtopologies.com)
- [Reinertsen & Associates](http://reinertsenassociates.com)

---

## Conclusão

Este processo não é invenção paralela à literatura. É uma síntese dos frameworks mais validados em gestão de produto em software dos últimos 40 anos. Para situar:

- Cooper tem estudo empírico de 252 produtos em 123 empresas.
- Lean Startup é ensinado em Stanford, Harvard Business School e LSE.
- Team Topologies é adotado em ING, Spotify, Amazon e Bosch.
- ToC é aplicado de manufatura (Toyota, Boeing) a software (Microsoft, Atlassian).
- Continuous Discovery é padrão de fato em produtos B2B SaaS modernos.

O que este repositório faz é operacionalizar a interseção desses frameworks num processo executável, com artefatos concretos (`templates/`), papéis claros (`01-roles.md`), interações documentadas (`interactions/`) e SLAs mensuráveis (`03-slas.md`).

Quando alguém perguntar "isso segue alguma referência?", este documento é a resposta.
