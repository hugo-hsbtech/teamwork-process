# Referências — Evolução dos Templates (jornada, greenfield/brownfield, base de conhecimento, TA enriquecido)

> **O que é este documento.** Uma base de referências que **justifica as mudanças introduzidas nos templates** desta pasta — para que, ao portá-las para o repositório original da documentação, cada decisão tenha lastro rastreável, no mesmo padrão do [`../references.md`](../references.md). Este arquivo **estende** o `references.md` (que ancora o processo upstream→downstream original); aqui ficam só as âncoras das adições.
>
> **As mudanças cobertas.** (1) Classificação **greenfield vs brownfield** na triagem; (2) **Jornada do usuário ponta-a-ponta** no Readiness Package (Seção 6.5); (3) **Base de Conhecimento técnica persistente** (`tech-landscape.md`); (4) **Technical Assessment além da arquitetura** (viabilidade dos NFRs, alternativas consideradas, build vs buy, testabilidade/observabilidade); (5) a meta-justificativa da **era da IA** (Spec-Driven Development e *context engineering*); (6) **EARS** como suporte para critérios testáveis.
>
> **Princípio que atravessa todas.** O upstream precisa carregar **contexto suficiente para decisão de implementação** — porque a camada de execução (engenheiro recém-chegado ou agente de IA) **não tem conhecimento implícito do código-fonte**. Cada adição fecha uma lacuna desse contexto, mantendo a regra do repo: *"o contrato é teto, não piso"*.

---

## Por que estas mudanças, agora

O processo original (ver [`../references.md`](../references.md)) já era sólido em **governança** (Stage-Gate), **descoberta** (Continuous Discovery), **fluxo** (Reinertsen) e **papéis** (Team Topologies). O que a auditoria dos templates revelou foram lacunas no **terreno técnico-de-produto** que a definição entrega ao downstream:

- a jornada ponta-a-ponta existia só no Product Backlog downstream, não na definição de produto upstream;
- o Technical Assessment era quase só arquitetura, sem o panorama que um implementador precisa;
- não havia distinção entre **construir software novo** e **alterar software existente** — decisões opostas;
- não havia o conceito de **base de conhecimento prévia** do sistema, que pode existir ou não.

Essas quatro lacunas são exatamente as que a literatura de 2024–2026 sobre **desenvolvimento assistido por IA** tornou críticas: sem terreno explícito, o agente (e o humano) adivinha. As âncoras abaixo são as que sustentam o fechamento de cada uma.

---

## Mapeamento Consolidado

| Mudança no template | Onde | Framework / Literatura | Fonte canônica |
|---|---|---|---|
| Classificação Greenfield vs Brownfield | `01-intake-record` · `03-technical-assessment` | Trilhas greenfield/brownfield; estudos de campo brownfield | BMAD Method (2024–25); Feathers, *Working Effectively with Legacy Code* (2004) |
| Documentar o sistema antes de mudá-lo (caminho brownfield) | `03-technical-assessment` (Estado atual) | `document-project` / análise de sistema existente | BMAD *working-in-the-brownfield*; arc42 §3 (Context & Scope) |
| Definir a fundação com critérios (caminho greenfield) | `03-technical-assessment` (Fundação técnica) | Solution Strategy + Architecture Decisions | arc42 §4 e §9; Nygard, ADRs (2011) |
| Jornada do usuário ponta-a-ponta | `02-readiness-package` §6.5 | Journey Mapping; Mapping Experiences | Nielsen Norman Group; Kalbach, *Mapping Experiences* (2016) |
| Service blueprint opcional | `02-readiness-package` §6.5 | Service Blueprinting | Nielsen Norman Group; Bitner et al. (2008) |
| Base de Conhecimento técnica persistente | `tech-landscape.md` (novo) | *Steering docs* / contexto persistente; `project-context` | Kiro (AWS); BMAD Method |
| TA: viabilidade dos NFRs (mapeada ao RP §8) | `03-technical-assessment` | Quality requirements as scenarios | arc42 §10; ISO/IEC 25010 |
| TA: alternativas consideradas | `03-technical-assessment` · `04-prd` | Design Docs / RFC (alternatives considered) | Google Design Docs; Pragmatic Engineer (RFCs) |
| TA: build vs buy | `03-technical-assessment` | Scoping / Business Case do Stage-Gate | Cooper, *Winning at New Products* |
| TA: testabilidade & observabilidade | `03-technical-assessment` | Design para testabilidade; observabilidade | Google Design Docs; práticas SRE |
| Diagramas de contexto/contêiner | `03-technical-assessment` · `tech-landscape` | C4 model (system context / landscape / container) | Simon Brown, c4model.com |
| Critérios de aceite testáveis para IA | (suporte ao RP §7 / TA) | EARS — Easy Approach to Requirements Syntax | Mavin et al., IEEE RE 2009 |
| Meta: contexto suficiente p/ decisão de implementação | toda a cadeia → `04-prd` | Spec-Driven Development; Context Engineering | GitHub Spec Kit; Kiro; Thoughtworks (2025) |

---

## 1. Classificação Greenfield vs Brownfield → trilhas distintas

**O que mudou.** O Intake (`01`) passa a classificar a demanda como **greenfield** (software/módulo novo), **brownfield** (altera existente) ou **híbrido**; o Technical Assessment (`03`) bifurca em dois caminhos a partir disso.

**Por quê.** São raciocínios opostos. Greenfield *decide* a fundação (não há terreno a respeitar); brownfield *descobre e respeita* o que já existe — padrões, integrações, dívida, risco de regressão. Tratá-los com o mesmo template produz, em greenfield, decisões não registradas e, em brownfield, mudanças que quebram o sistema por desconhecimento do existente.

**Âncora.** O **BMAD Method** formaliza a distinção com trilhas e templates separados: greenfield segue "project brief → PRD → arquitetura → dev" em folha limpa; brownfield exige **documentar o sistema existente primeiro** (`document-project`), então `brownfield-prd` e `brownfield-architecture`, com atenção a pontos de integração e constraints legados. A literatura clássica de código legado (Michael Feathers) e os estudos de greenfield vs brownfield em engenharia sustentam que a primeira tarefa brownfield é **entender o existente**, não codar.

**Fontes.**
- [BMAD Method — Working in the Brownfield (GitHub)](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/docs/working-in-the-brownfield.md)
- [BMAD Method — Brownfield Development (DeepWiki)](https://deepwiki.com/bmad-code-org/BMAD-METHOD/4.9-brownfield-development)
- [BMAD Method — Established Projects](https://docs.bmad-method.org/how-to/established-projects/)
- [Brownfield vs. Greenfield Development in Software — Synoptek](https://synoptek.com/insights/it-blogs/greenfield-vs-brownfield-software-development/)

---

## 2. Jornada do Usuário ponta-a-ponta → Journey Mapping (RP §6.5)

**O que mudou.** O Readiness Package ganha a **Seção 6.5 — Jornada(s) do usuário ponta-a-ponta** (happy path + caminhos alternativos + service blueprint opcional), de autoria do PO, posicionada antes das User Stories — que passam a **derivar** dela.

**Por quê.** Uma definição de produto precisa da noção do que o usuário faz **de ponta a ponta**, não de histórias soltas. Sem o fluxo completo, o downstream (humano ou agente) não enxerga a sequência que precisa implementar, e edge cases ficam órfãos. No modelo original, "jornadas do usuário" viviam só no Product Backlog downstream — tarde demais para informar a definição.

**Âncora.** A **Nielsen Norman Group** define journey map como "a visualização do processo que uma pessoa percorre para alcançar um objetivo" — actor, cenário, expectativas, fases, ações, emoções. O **service blueprint** é a "parte dois" do journey map: expõe pessoas, evidências e processos de bastidor ligados aos touchpoints — ideal quando a experiência é omnichannel ou exige esforço cross-funcional (por isso o tornamos **opcional**). Jim Kalbach (*Mapping Experiences*) é a obra canônica que reúne as duas técnicas como alinhamento entre valor de negócio e experiência.

**Fontes.**
- [Journey Mapping 101 — Nielsen Norman Group](https://www.nngroup.com/articles/journey-mapping-101/)
- [Service Blueprints: Definition — Nielsen Norman Group](https://www.nngroup.com/articles/service-blueprints-definition/)
- [When to Use Journey Maps vs Service Blueprints — Miro](https://miro.com/customer-journey-map/service-blueprint-vs-journey-map/)
- Kalbach, J. (2016). *Mapping Experiences*. O'Reilly.

---

## 3. Base de Conhecimento técnica persistente → Steering Docs / `document-project`

**O que mudou.** Novo template `tech-landscape.md`: documento **persistente, por sistema** (não por demanda) — produto/domínio, stack & ferramentas, estrutura & convenções, integrações, constraints & dívida, lacunas. O Technical Assessment o **referencia** (brownfield) ou o **semeia** (greenfield).

**Por quê.** É a "base de conhecimento prévia, que pode existir ou não" que faltava. A camada de execução não tem conhecimento implícito do código; sem um lugar persistente para esse contexto, cada demanda **re-descobre** o sistema (o desperdício de *relearning* da Lean Software Development — ver [`../references.md` §10](../references.md)). Quando não existe, criá-la vira a primeira tarefa (Discovery).

**Âncora.** O **Kiro (AWS)** materializa exatamente isto com *steering docs*: `product.md` (propósito, usuários, features — o "porquê"), `tech.md` (stack, ferramentas, constraints — o "com quê") e `structure.md` (organização, convenções — o "como"), incluídos como conhecimento persistente em toda interação do agente. O **BMAD** gera `project-context.md` para capturar padrões e convenções do código existente "para garantir que agentes de IA sigam as práticas estabelecidas". Conecta também a **Team Topologies** (reduzir carga cognitiva do time de execução — ver [`../references.md` §7](../references.md)) e a **arc42 §12** (glossário de domínio).

**Fontes.**
- [Kiro — Steering Docs](https://kiro.dev/docs/steering/)
- [Master Kiro Steering Docs in Minutes — AWS Builder Center](https://builder.aws.com/content/32ocJQtMKLT0I8zUp3Kg8C3eAkJ/master-kiro-steering-docs-in-minutes)
- [BMAD Method — Working in the Brownfield (`document-project`, `project-context`)](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/docs/working-in-the-brownfield.md)

---

## 4. Technical Assessment além da arquitetura → Design Docs + arc42 + C4

**O que mudou.** O TA (`03`) deixa de ser quase-só-arquitetura e passa a cobrir: **viabilidade dos NFRs** (mapeada NFR-a-NFR ao RP §8), **alternativas consideradas**, **build vs buy**, **testabilidade e observabilidade**, além de diagramas de contexto/contêiner.

**Por quê.** Um implementador (e um agente) decide a partir do *racional*, não só da conclusão. "Por que NÃO a alternativa X" evita re-litígio downstream; a viabilidade de cada NFR fecha o loop produto↔técnico (um NFR inviável é veto, não nota de rodapé); testabilidade/observabilidade tornam os critérios de aceite verificáveis e o comportamento monitorável.

**Âncora.**
- **Design Docs do Google / RFCs** prescrevem: contexto, goals/non-goals, solução proposta com diagramas, **alternativas consideradas**, riscos — exatamente as seções adicionadas.
- **arc42** dá as lentes: §3 Context & Scope (estado atual), §4 Solution Strategy (fundação greenfield), §9 Architecture Decisions (ADRs), §10 **Quality Requirements as scenarios** (a viabilidade dos NFRs), §11 Risks & Technical Debt.
- **C4 model** (Simon Brown) fornece os níveis de diagrama — *system context* e *container* bastam para a maioria; *system landscape* para o panorama de um sistema existente.
- **ISO/IEC 25010** segue como o checklist de dimensões de qualidade (já usado no RP §8), agora *respondido* no TA.
- **Stage-Gate** (Cooper) ancora o **build vs buy** como parte do *scoping/business case* (ver [`../references.md` §2](../references.md)).

**Fontes.**
- [Design Docs at Google — Industrial Empathy](https://www.industrialempathy.com/posts/design-docs-at-google/)
- [Companies Using RFCs or Design Docs — The Pragmatic Engineer](https://blog.pragmaticengineer.com/rfcs-and-design-docs/)
- [arc42 — Overview](https://arc42.org/overview) · [arc42 Documentation](https://docs.arc42.org/home/)
- [C4 model](https://c4model.com/) · [System landscape diagram](https://c4model.com/diagrams/system-landscape)
- [Documenting Architecture Decisions — Michael Nygard (2011)](https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions) · [adr.github.io](https://adr.github.io/)

---

## 5. Meta-justificativa: era da IA → Spec-Driven Development e Context Engineering

**O que sustenta tudo acima.** A prática que consolidou em 2025–2026, **Spec-Driven Development (SDD)**, coloca a especificação no centro: `Specify → Plan → Tasks → Implement` (GitHub Spec Kit) / `Requirements → Design → Tasks` (Kiro). A premissa: o agente só implementa bem se a spec carregar **contexto suficiente para as decisões** — o que Thoughtworks e a comunidade chamam de *context engineering* ("otimizar a interação agente-LLM", em oposição a *prompt engineering*).

**Por que importa para estes templates.** O **PRD é o ponto onde esse contexto precisa estar verdadeiro**. As quatro adições (natureza, jornada, base de conhecimento, panorama técnico) são, somadas, o *contexto de implementação* que faltava — entregável tanto a um engenheiro humano sem familiaridade com o código quanto a um agente. Isto não substitui os frameworks do `references.md`; **opera sobre eles**, tornando o output executável na era assistida por IA.

**Fontes.**
- [Spec-driven development with AI — GitHub Blog](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/)
- [GitHub Spec Kit — Documentation](https://github.github.com/spec-kit/)
- [Understanding Spec-Driven Development: Kiro, spec-kit, Tessl — Martin Fowler](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)
- [Spec-driven development: unpacking 2025's new engineering practices — Thoughtworks](https://www.thoughtworks.com/en-us/insights/blog/agile-engineering-practices/spec-driven-development-unpacking-2025-new-engineering-practices)
- [Diving Into Spec-Driven Development with Spec Kit — Microsoft for Developers](https://developer.microsoft.com/blog/spec-driven-development-spec-kit)

---

## 6. EARS → critérios de aceite menos ambíguos (suporte ao RP §7 e ao TA)

**O que é.** **EARS (Easy Approach to Requirements Syntax)** — padrões estruturais (`Ubiquitous`, `Event-driven` "When…", `State-driven` "While…", `Optional` "Where…") no formato *"WHEN [condição], THE SYSTEM SHALL [comportamento]"*. Não substitui o Given/When/Then do RP, mas é uma referência útil: requisitos em EARS são mais fáceis de **decompor por agentes de IA** e de testar, cobrindo edge cases por construção. Kiro adota EARS nativamente.

**Por quê citar.** Justifica a ênfase, nos templates, em critérios **verificáveis e específicos** (não "deve funcionar bem") — e dá um padrão pronto caso o time queira endurecer os critérios de aceite para consumo por IA.

**Fontes.**
- [EARS — Guia oficial (Alistair Mavin)](https://alistairmavin.com/ears/)
- Mavin, A., Wilkinson, P., Harwood, A., Novak, M. (2009). *Easy Approach to Requirements Syntax (EARS)*. 17th IEEE International Requirements Engineering Conference (RE'09), pp. 317–322. [University of Manchester Research](https://research.manchester.ac.uk/en/publications/easy-approach-to-requirements-syntax-ears/)
- [Adopting EARS Notation — Jama Software](https://www.jamasoftware.com/requirements-management-guide/writing-requirements/adopting-the-ears-notation-to-improve-requirements-engineering/)

---

## Críticas honestas e mitigações

Mantendo o padrão de honestidade do [`../references.md`](../references.md):

### Crítica 1: "Mais seções = mais burocracia no upstream"
Adições podem inflar o que o repo deliberadamente manteve enxuto.
**Mitigação:** toda seção nova é **condicional** (greenfield *ou* brownfield) e tem **regra de compressão** explícita; segue o princípio "contrato é teto, não piso". A jornada pequena é 3–5 passos; o service blueprint é opcional; a KB pode ser um *stub* honesto.

### Crítica 2: "Referenciar BMAD/Kiro/Spec-Kit é ancorar em ferramentas, não em teoria"
São produtos, podem mudar.
**Mitigação:** as ferramentas são *instâncias* de princípios mais antigos — Stage-Gate scoping, Lean (relearning/handoffs), Team Topologies (carga cognitiva), arc42, C4, ADRs de Nygard, journey mapping da NN/g. O documento cita as duas camadas; se a ferramenta sumir, a âncora teórica permanece.

### Crítica 3: "Base de conhecimento vira documentação que apodrece"
Docs desatualizadas enganam mais que ausência.
**Mitigação:** a `tech-landscape` tem **Histórico de Atualização** e **Seção 6 — Lacunas da KB** (honestidade sobre o não-documentado, mesma lógica de *dispositions* do processo); cada demanda que toca o terreno atualiza o arquivo. É um documento **vivo**, não um one-shot.

### Crítica 4: "Greenfield/brownfield é binário demais"
Sistemas reais são híbridos.
**Mitigação:** a classificação inclui **Híbrido** explicitamente (módulo novo dentro de sistema existente), com caminho "Ambos" no TA.

---

## Bibliografia

### Livros
- **Feathers, M.** (2004). *Working Effectively with Legacy Code*. Prentice Hall. *(base do raciocínio brownfield: entender antes de mudar.)*
- **Kalbach, J.** (2016). *Mapping Experiences: A Complete Guide to Creating Value through Journeys, Blueprints, and Diagrams*. O'Reilly.
- **Brown, S.** (2018). *Software Architecture for Developers* (C4 model). Leanpub.
- **Starke, G., & Hruschka, P.** — *arc42* (template e documentação de arquitetura).
- *(Complementam a bibliografia do [`../references.md`](../references.md): Cooper, Poppendieck, Skelton & Pais, Cagan, Torres, Reinertsen.)*

### Papers e Normas
- **Mavin, A., et al.** (2009). *Easy Approach to Requirements Syntax (EARS)*. IEEE RE'09, pp. 317–322.
- **Nygard, M.** (2011). *Documenting Architecture Decisions*.
- **ISO/IEC 25010** — *Systems and software Quality Requirements and Evaluation (SQuaRE)*.

### Recursos online (verificados)
- BMAD Method — [working-in-the-brownfield](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/docs/working-in-the-brownfield.md) · [established-projects](https://docs.bmad-method.org/how-to/established-projects/)
- Kiro — [Steering Docs](https://kiro.dev/docs/steering/)
- GitHub — [Spec Kit](https://github.github.com/spec-kit/) · [Spec-driven development (blog)](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/)
- Thoughtworks — [Spec-driven development (2025)](https://www.thoughtworks.com/en-us/insights/blog/agile-engineering-practices/spec-driven-development-unpacking-2025-new-engineering-practices)
- Nielsen Norman Group — [Journey Mapping 101](https://www.nngroup.com/articles/journey-mapping-101/) · [Service Blueprints: Definition](https://www.nngroup.com/articles/service-blueprints-definition/)
- arc42 — [arc42.org](https://arc42.org/overview) · C4 — [c4model.com](https://c4model.com/) · ADRs — [adr.github.io](https://adr.github.io/)
- Google Design Docs — [Industrial Empathy](https://www.industrialempathy.com/posts/design-docs-at-google/) · RFCs — [The Pragmatic Engineer](https://blog.pragmaticengineer.com/rfcs-and-design-docs/)

---

## Como usar ao portar para o repositório original

1. **Levar este arquivo junto** com os templates — ele é a defesa das mudanças quando alguém perguntar "por que isto entrou?".
2. **Fundir com o `references.md` original**: as âncoras aqui são **aditivas**. Sugestão de novas linhas no *Mapeamento Consolidado* daquele arquivo — Jornada (NN/g), Greenfield/Brownfield (BMAD/Feathers), Base de Conhecimento (Kiro/BMAD), TA enriquecido (arc42/C4/Design Docs), SDD/Context Engineering (Spec Kit/Thoughtworks).
3. **Reconciliar a fronteira de papéis**: registrar que a **jornada de produto ponta-a-ponta é do PO (no RP)**; os fluxos de UX detalhados seguem downstream (Product Backlog). Isso não conflita com "o PM não escreve jornadas" — apenas explicita quem escreve qual jornada.
4. **Atualizar diagramas/tabelas** do README do processo para incluir a classificação, a jornada e o artefato de apoio `tech-landscape`.
