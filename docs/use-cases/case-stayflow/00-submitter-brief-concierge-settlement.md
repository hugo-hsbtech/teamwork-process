# Documento do Submitter — Concierge & Settlement

> **Este é o documento do Submitter** — o primeiro artefato da jornada (`00`) e o entregável da persona Submitter. Ele **tangibiliza** o modelo de [`personas/01-submitter.md`](../../../personas/01-submitter.md): o raciocínio (requisitos de compliance, geração de ToDos, fórmula de score) vive na persona; este documento o **instancia** por demanda, na **linguagem do Submitter** — problema, valor, dor, oportunidade. Cada resposta carrega o quão sólida ela é e de onde veio: a camada de confiança viaja *com* a captura.
>
> **Jornada:** `00 Documento do Submitter` → [`01 Intake Record (PO — triagem)`](./01-intake-record-concierge-settlement.md) → [`02 Readiness Package (PO)`](./02-readiness-package-concierge-settlement.md) → [`03 Technical Assessment (CTO)`](./03-technical-assessment-concierge-settlement.md) → [`04 PRD (PO+CTO → PM)`](./04-prd-concierge-settlement.md). Ver [`README.md`](./README.md).
>
> **Nada antecede este documento como artefato.** O que vem antes é **sinal cru** — uma chamada, um ticket, um e-mail, um áudio, uma conversa de deal — que **não é artefato** (ver [`../../../README.md`](../../../README.md)). Esse sinal entra *aqui* como evidência/fonte (disposição `inferred`, com `source`); é a **captura** que o transforma neste primeiro documento formal.
>
> **Handoff:** congela quando `gateReady = true` (todo requisito bloqueante resolvido por uma disposição honesta) e é entregue ao **PO**, que o formaliza e tria no [`01 Intake Record`](./01-intake-record-concierge-settlement.md).

## As duas lentes (toda demanda é lida pelas duas ao mesmo tempo)

> Ver [`personas/01-submitter.md` §2](../../../personas/01-submitter.md). Os ToDos vivem onde as lentes se cruzam: "dado o que *esta* demanda significa, o que o contrato ainda precisa?"

| Lente | O que é | Onde aparece neste documento |
|---|---|---|
| **Contrato** (determinístico) | Os requisitos fixos de compliance que toda demanda precisa satisfazer para avançar | **Resumo de Prontidão** + os requisitos numerados (score + pendências) |
| **Semântica** (contextual) | O que *esta* demanda significa: a dor real, seu tipo, sua tese de valor, suas incógnitas | **Enunciado do Problema**, **Impacto**, **Indicadores de Valor** e suas tensões |

## Metadados

| Campo | Valor |
|---|---|
| **Demanda** | Concierge & Settlement — Atendimento automatizado ao hóspede + repasse financeiro ao hotel parceiro |
| **Registrado por** | Camila Rocha (Líder de CS/Operações) |
| **Data de captura** | 2026-04-07 |
| **Status** | Pronto para handoff (`gateReady = true`) |
| **Intake Record vinculado** | INT-2026-050 (atribuído pelo PO na triagem) |

## Histórico de Revisão

| Versão | Data | Evento | Resumo |
|---|---|---|---|
| v1 | 2026-04-07 | Captura iniciada | Camila registra a demanda após reunião de planejamento operacional Q2. |
| v1 | 2026-04-07 | `gateReady = true` | Todos os requisitos bloqueantes resolvidos. Handoff ao PO. |

---

## Resumo de Prontidão (Readiness)

> Snapshot da captura. O score é derivado dos requisitos abaixo; `low_confidence` conta como parcial. A demanda só é entregue ao PO quando todos os requisitos bloqueantes estão resolvidos (`gateReady = Sim`).

| Campo | Valor |
|---|---|
| **Readiness Score** | 81 % |
| **Gate liberado (gateReady)** | Sim |
| **Requisitos bloqueantes pendentes** | — (todos resolvidos por disposição honesta) |
| **Dispositions** | 5 respondidos · 2 inferidos · 3 premissas · 1 discovery · 0 delegados |

### Legenda de confiança (aplica-se a cada seção respondida)

| Atributo | Valores |
|---|---|
| **Confiança** | 0–100 |
| **Fonte** | Submitter direto · Documento anexo (p.X) · Inferido · Premissa · Outro stakeholder |
| **Status** | Vazio · Baixa confiança · Resolvido |
| **Disposição** | Respondido · Inferido · Premissa (a validar) · Discovery (a investigar) · Delegado (dono: __) |
| **Hint** | Por que a confiança está baixa / o que a elevaria |

> **"Não sei" não bloqueia.** Um requisito atinge prontidão por qualquer disposição honesta — inclusive "ninguém sabe ainda, e este é o plano" (Discovery) ou "estamos assumindo X" (Premissa). Ver [`personas/01-submitter.md` §6](../../../personas/01-submitter.md).

---

## Origem  ·  *(Requisito 2 — Originador e contexto)*

| Campo | Valor |
|---|---|
| **Fonte** | Interno — time de CS/Operações |
| **Cliente / Solicitante** | Camila Rocha, Líder de CS/Operações |
| **Originador e contexto** | Camila levantou as duas dores na reunião de planejamento operacional Q2 (2026-04-07), após o time de CS identificar deterioração acelerada do CSAT e três incidentes de repasse financeiro incorreto nos últimos 90 dias. A reunião incluiu a Diretora de Operações e o CFO. |
| **Reportado via** | Reunião presencial + slide de indicadores operacionais compartilhado no Notion |

`Confiança:` 92 · `Fonte:` Submitter direto · `Status:` Resolvido · `Disposição:` Respondido · `Hint:` —

---

## Tipo

- [ ] Funcionalidade
- [ ] Bug
- [x] Melhoria
- [ ] Compliance
- [x] Integração
- [x] Operacional

---

## Enunciado do Problema  ·  *(Requisito 1 — bloqueia gate)*

> Qual a dor existente? Descreva o problema, não a solução. Se o enunciado contém solução proposta, ele volta para reformulação.

**Problema A — Atendimento ao hóspede:**
O atendimento de 1ª camada ao hóspede é 100% humano. Com o aumento de volume de reservas, o time de atendimento não acompanhou o crescimento: o SLA de primeira resposta é furado em 34% dos tickets, a fila de atendimento chega a 4h+ nos picos, e o CSAT médio caiu para 3,8/5 (meta: 4,5). As perguntas mais frequentes (status de reserva, confirmação de check-in, política de cancelamento) poderiam ser resolvidas sem intervenção humana, mas hoje consomem o mesmo tempo de atendente que casos complexos. Quando o hóspede precisa de um especialista, não há mecanismo de transferência com contexto — o hóspede repete todo o problema do zero para o novo atendente.

**Problema B — Repasse financeiro ao hotel parceiro:**
O cálculo e a execução do repasse aos hotéis parceiros é feito manualmente: a equipe financeira consulta a planilha de contratos (percentuais de comissão por hotel), calcula o valor líquido, emite a transferência via TED e registra numa segunda planilha. Sem automação e sem validação cruzada, erros de percentual ocorrem. Nos últimos 6 meses: 3 repasses com valor incorreto, 2 hotéis parceiros ameaçando rescisão, 1 chargeback que a StayFlow absorveu por ausência de cobertura contratual clara. A equipe financeira dedica ~18h/semana a essa operação — tempo que cresce linearmente com o volume de reservas.

`Confiança:` 88 · `Fonte:` Submitter direto + slide de indicadores (Notion, reunião 2026-04-07) · `Status:` Resolvido · `Disposição:` Respondido · `Hint:` Os dados de CSAT e SLA estão no dashboard do Zendesk (exportação disponível). Os incidentes de repasse estão no log financeiro — acesso pode ser fornecido ao PO.

---

## Quem é Impactado (Alcance)  ·  *(Requisito 3 — bloqueia gate)*

> Personas, segmentos ou times que sentem essa dor. É o "Reach" dos indicadores de valor.

| Persona / Segmento | Como é impactado |
|---|---|
| **Hóspede** | Espera mais de 4h por resposta em pico; repete contexto ao mudar de atendente; CSAT baixo reflete frustração. Toda a base de hóspedes da plataforma é afetada. |
| **Hotel parceiro** | Recebe repasses com valor incorreto ou fora do prazo; falta de previsibilidade financeira; dois parceiros em risco de rescisão. Afeta toda a rede de hotéis (dezenas de parceiros ativos). |
| **Time de atendimento (CS)** | Sobrecarregado com tickets que poderiam ser resolvidos automaticamente; sem ferramenta de triagem ou handoff estruturado; atende casos simples junto com casos complexos sem diferenciação. |
| **Time financeiro (FinOps)** | Gasta ~18h/semana em tarefa manual repetitiva; expostos a erro humano em cada ciclo de repasse; sem auditoria automática dos valores. |
| **StayFlow (negócio)** | Risco de churn de hotéis parceiros (receita e rede); crescimento de custo operacional de atendimento não sustentável; risco reputacional e legal com erros de repasse. |

`Confiança:` 85 · `Fonte:` Submitter direto + inferido do slide de indicadores · `Status:` Resolvido · `Disposição:` Respondido · `Hint:` Volume exato de hóspedes ativos e hotéis parceiros não foi compartilhado neste brief — PO pode solicitar ao FinOps para quantificar Reach com precisão.

---

## Impacto de Negócio  ·  *(Requisito 4 — bloqueia gate)*

> Use as dimensões aplicáveis. Receita, Retenção, Operacional, Competitivo, Compliance, Mercado são os mais comuns. Não force dimensões irrelevantes. Quantifique quando possível.

| Dimensão | Detalhe |
|---|---|
| **Retenção** | Dois hotéis parceiros em risco de rescisão. Se ambos saírem, estimativa de perda de ~R$ 140k em GMV/ano (premissa: média de ~R$ 70k GMV por hotel × 2). Adicionalmente, CSAT de hóspede abaixo de 4 correlaciona com menor recorrência de reserva — impacto difuso mas real. |
| **Operacional** | Custo do time de atendimento: ~R$ 28k/mês (3 atendentes × salário + encargos). Com o crescimento esperado de volume, sem automação o time precisará de 2 contratações adicionais nos próximos 6 meses (~R$ 19k/mês adicionais). Custo do time financeiro: ~18h/semana × custo hora → economizável com automação. |
| **Compliance / Legal** | Os erros de repasse criam exposição a multas contratuais. Um contrato de hotel já tem cláusula de penalidade de 2% do valor do repasse por erro. Com volumes crescentes, a exposição cresce proporcionalmente. |
| **Competitivo** | OTAs concorrentes oferecem portal do parceiro com conciliação automatizada. A StayFlow está em desvantagem na atração de novos hotéis parceiros por não ter essa funcionalidade. |

`Confiança:` 72 · `Fonte:` Inferido a partir de dados operacionais do slide + estimativas da própria Camila · `Status:` Baixa confiança (números são estimativas, não calculados) · `Disposição:` Inferido · `Hint:` Para elevar: solicitar ao FinOps o GMV por hotel nos últimos 12 meses; solicitar ao RH o custo real do time de atendimento; revisar contratos dos hotéis para identificar cláusulas de penalidade. Números serão refinados no RP.

---

## Indicadores de Valor (RICE-lite)

> Espelho para desafiar o pensamento — **não** ranking automático. Pontue cada um (Baixo / Médio / Alto). A confiança reusa a coluna acima — não se pontua de novo. O Esforço fica *soft* (chute do Submitter, firmado depois pelo CTO).

| Indicador | Score | Justificativa (na linguagem dela) | Confiança |
|---|---|---|---|
| **Impacto** ("quanto move o negócio?") | Alto | Dois parceiros em risco de rescisão. Se perdermos, não é só dinheiro — é sinal para o mercado de que a StayFlow não honra o repasse. O risco reputacional me preocupa mais que o financeiro. No atendimento, com CSAT caindo, a taxa de recompra do hóspede vai junto. | 70 |
| **Alcance** ("quantos sentem isso?") | Alto | Todo hóspede que abre ticket sente o problema de atendimento. Todo hotel parceiro que recebe repasse sente o problema financeiro. Não é nicho — é o core do modelo. | 85 |
| **Urgência** ("por que agora? custo de esperar?") | Alto | Um dos hotéis parceiros tem prazo informal de 60 dias para ver melhora antes de acionar a cláusula de rescisão. No atendimento, o volume de reservas cresce mês a mês — cada semana que passa sem automação é mais um ticket manual. | 80 |
| **Esforço** *(soft — adiado ao CTO)* | Médio | Acho que o chatbot em si não é tão complicado — existem plataformas prontas. O repasse me parece mais trabalhoso por causa das regras de percentual por hotel. Mas honestamente não faço ideia do que está envolvido tecnicamente. | low_confidence |

> **Tensões registradas:**
> - Impacto alto + confiança 70: o risco de rescisão do parceiro é real, mas o valor exato (GMV que seria perdido) é estimado. Resolução: aceitar como premissa; PO quantifica no RP com dados do FinOps.
> - Urgência alta + Esforço incerto: se o esforço for muito alto (CTO confirma), o prazo de 60 dias do parceiro pode não ser alcançável. Resolução: essa tensão precisa ser explicitada ao PO — se o esforço firme > 60 dias, há uma decisão de negócio sobre comunicar ao parceiro.

---

## Urgência  ·  *(Requisito 5)*

**Prazo / janela:** Um dos hotéis parceiros (Hotel Gran Vista, maior parceiro em GMV) comunicou informalmente que tem 60 dias para ver progresso antes de avaliar rescisão. Prazo informal: até 2026-06-07.

**Custo de esperar:** Cada semana sem automação no atendimento = mais tickets manuais, mais custo, mais CSAT ruim. Cada ciclo de repasse sem automação = mais risco de erro financeiro. Se o Gran Vista rescindir, é o maior parceiro — sinal negativo forte para novos hotéis entrarem na rede.

`Confiança:` 75 · `Fonte:` Submitter direto (informação verbal do Gran Vista em chamada de relacionamento) · `Status:` Baixa confiança (prazo informal, não documentado) · `Disposição:` Respondido · `Hint:` O prazo do Gran Vista foi comunicado verbalmente — vale formalizar por e-mail para ter registro. CS pode fazer isso. Se o prazo for mais curto do que 60 dias, a prioridade sobe ainda mais.

---

## Evidência e Documentos  ·  *(Requisito 6)*

> Anexos ou conversas anteriores que embasam a demanda. Fonte de pré-preenchimento por IA.

| Documento / Conversa | Tipo | Relevância |
|---|---|---|
| Slide de indicadores operacionais Q1-2026 | Apresentação (Notion) | Contém dados de CSAT (3,8/5), SLA de primeira resposta (furado em 34%), volume de tickets por categoria |
| Log de incidentes de repasse (últimos 6 meses) | Planilha financeira interna | Registra os 3 incidentes de repasse incorreto: data, hotel, valor errado, valor correto, diferença |
| E-mails de reclamação dos hotéis | Thread de e-mail | Hotel Gran Vista e Hotel Pousada Serrana enviaram e-mails formais de reclamação sobre os repasses |
| Relatório de custo do time de atendimento (Q1) | Planilha RH | Custo mensal do time de 3 atendentes + encargos |
| Contratos dos hotéis parceiros (amostra) | PDF (acesso restrito — FinOps) | Detalha percentuais de comissão e cláusulas de penalidade por erro de repasse |

`Confiança:` 82 · `Fonte:` Submitter direto · `Status:` Resolvido · `Disposição:` Respondido · `Hint:` Contratos dos hotéis estão com o FinOps — PO deve solicitar acesso para revisar as cláusulas de penalidade antes de finalizar o RP.

---

## Stakeholders  ·  *(Requisito 8)*

| Stakeholder | Papel | Interesse | Influência |
|---|---|---|---|
| Camila Rocha | Líder CS/Operações — Submitter | Resolver o gargalo operacional do atendimento e reduzir exposição ao risco de repasse | Alta — originadora, tem acesso aos dados e ao relacionamento com os hotéis |
| Rafael Souza | PO | Definir o produto corretamente antes de construir | Alta — dono da triagem e racionalização |
| Davi Lima | CTO | Viabilidade técnica, especialmente split de pagamento e integração com PSP | Alta — decide arquitetura e integração com gateway |
| Bruno Takeda | FinOps | Integridade do repasse financeiro; auditoria; redução de carga manual | Alta — consultor crítico para as regras de split e conciliação |
| Hotel Gran Vista | Hotel parceiro (maior, em risco) | Receber repasse correto e no prazo | Alta — stakeholder externo com poder de rescisão |
| Isabela Ramos | Jurídico/Contábil | Conformidade fiscal dos repasses; retenção de IR se aplicável | Média — consultora; não bloqueia a construção mas define restrições fiscais |
| Diretora de Operações | Sponsor executivo | Escalar operação sem escalar custo; proteger parceiros | Alta — aprova orçamento e prioridade |
| CFO | Sponsor financeiro | Controle do risco de repasse; custo do time financeiro | Alta — presente na reunião de Q2; tem visibilidade do risco |

`Confiança:` 88 · `Fonte:` Submitter direto + inferido da reunião Q2 · `Status:` Resolvido · `Disposição:` Respondido · `Hint:` —

---

## Premissas

Condições assumidas como verdadeiras na captura. Se uma premissa se provar falsa, a demanda deve ser retriada. Premissas são uma **disposição válida** para requisitos sem resposta direta.

1. O percentual de comissão da StayFlow é definido no contrato com cada hotel (não é um percentual fixo para todos) e está cadastrado em algum sistema ou planilha que pode ser consultado programaticamente. — `a validar com:` FinOps (Bruno Takeda)
2. O gateway de pagamento atual (usado para cobrar o hóspede) tem API para criação e consulta de transações, e os dados de pagamento estão acessíveis para integração. — `a validar com:` CTO (Davi Lima) no Discovery
3. O time de atendimento hoje usa alguma ferramenta de helpdesk (ex.: Zendesk) que pode ser integrada para receber transferências do chatbot com contexto. — `a validar com:` Camila / time de CS
4. A plataforma de reservas tem API que expõe dados de reserva (status, hóspede, check-in/out) para que o atendimento contextualizado seja possível. — `a validar com:` CTO no Discovery

---

## Constraints  ·  *(Requisito 7)*

Condições que limitam o espaço de solução, a respeitar independentemente do que for construído.

| Constraint | Tipo | Detalhe |
|---|---|---|
| Prazo informal do parceiro Gran Vista | Tempo | ~60 dias para ver progresso (até ~2026-06-07). Não é contratual, mas é um sinal de risco. |
| Conformidade com PCI DSS | Legal / Técnico | O fluxo de pagamento (cobrança do hóspede, repasse ao hotel) toca dados de cartão — qualquer solução deve ser PCI-compliant ou usar um PSP que absorva o escopo de PCI. |
| Contratos de hotéis parceiros com percentuais individuais | Escopo | Cada hotel tem seu percentual de comissão definido no contrato. A solução deve suportar percentuais distintos por hotel (não pode ser um valor fixo global). |
| Não interromper o fluxo de reservas existente | Técnico / Escopo | A automação do repasse não pode impactar o fluxo de criação e confirmação de reservas. Mudanças no gateway devem ser não-disruptivas. |

`Confiança:` 78 · `Fonte:` Submitter direto + inferido de contexto regulatório · `Status:` Baixa confiança (PCI é premissa do PO, não confirmada tecnicamente) · `Disposição:` Premissa (a validar) · `Hint:` O constraint de PCI precisa ser confirmado pelo CTO — se o PSP atual já absorve o escopo de PCI, a constraint técnica pode ser menor. Se não, é uma restrição severa.

---

## Riscos Preliminares

Riscos identificados na captura — antes da avaliação técnica. Registro completo pertence ao Readiness Package.

| Risco | Categoria | Avaliação Inicial |
|---|---|---|
| PSP atual não suporta split de pagamento nativo | Técnico | Alto — se confirmado, exige migração de PSP ou arquitetura adicional. Discovery técnico necessário. |
| Percentual de repasse incorreto persiste mesmo após automação (bug de regra) | Negócio | Alto — o risco que a automação busca resolver pode ser reintroduzido por um bug. Testes e validação rigorosa necessários. |
| Hotel Gran Vista rescindir antes da entrega | Externo / Prazo | Médio — prazo de 60 dias pode não ser suficiente se o esforço técnico for grande. Comunicação proativa ao parceiro necessária. |
| Requisitos fiscais (IR na fonte, NF) não mapeados | Compliance | Médio — sem entender os requisitos fiscais do repasse, a automação pode criar problema fiscal. Discovery com Jurídico necessário. |
| Chatbot com qualidade de resposta inadequada na fase inicial | Produto | Médio — LLM pode responder de forma inadequada ou imprecisa, piorando CSAT em vez de melhorar. Treinamento e guardrails de qualidade críticos. |
| Time de atendimento resistente à mudança de fluxo | Adoção | Baixo — mudança de processo para os atendentes especialistas; treinamento necessário. |

---

## Limite de Escopo de Alto Nível

**Dentro:**
- Atendimento automatizado na 1ª camada (IA) para perguntas frequentes de hóspedes
- Mecanismo de handoff para especialista humano com contexto da conversa
- Cálculo automático do repasse ao hotel (com percentual por hotel)
- Execução do repasse via integração com gateway/PSP
- Conciliação básica: registro de repasses executados e status

**Fora:**
- Portal do hotel parceiro (autoatendimento do hotel para ver seus repasses)
- Chatbot para múltiplos canais simultâneos (foco em canal principal — a definir)
- Integração fiscal para emissão de NF do repasse
- Suporte a múltiplas moedas

**Adiado:**
- Portal do parceiro com histórico de repasses e extratos
- Integração com sistema contábil do hotel
- BI e analytics de atendimento e financeiro

---

## Prioridade

**Nível:** Alto

**Motivo:** Risco de rescisão de parceiro com prazo de 60 dias; CSAT em queda com crescimento de volume; exposição legal e financeira por erros de repasse. A combinação dos dois problemas cria urgência.

---

## Critérios de Sucesso

Indicadores de alto nível que definem "concluído e valioso". Metas mensuráveis detalhadas pertencem ao Readiness Package; estes são os sinais no nível da captura. **Servem de baseline projetado** para o acompanhamento pós-handoff (ver [`metrics.md`](../../../metrics.md)).

| Critério | Tipo | Indicador | Valor projetado |
|---|---|---|---|
| CSAT do hóspede melhora | UX | CSAT médio nas interações de atendimento | ≥ 4,3/5 (de 3,8 atual) |
| SLA de primeira resposta normalizado | Operacional | % de tickets com primeira resposta dentro do SLA | ≥ 90% (de ~66% atual) |
| Taxa de resolução na 1ª camada (sem humano) | Operacional | % de tickets resolvidos pelo chatbot sem escalonamento | ≥ 55% |
| Repasses corretos | Negócio / Financeiro | % de repasses executados com valor correto | ≥ 99,5% |
| Gran Vista e parceiros retidos | Negócio | Nenhuma rescisão por motivo financeiro nos 90 dias pós-release | Zero rescisões por erro de repasse |
| Redução de carga manual no FinOps | Operacional | Horas/semana dedicadas ao ciclo de repasse manual | < 4h/semana (de ~18h atual) |
