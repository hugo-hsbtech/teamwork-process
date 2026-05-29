# Persona: Submitter (Originador da Demanda)

> Primeiro documento da série de personas. Mapeia uma persona de ponta a ponta: quem ela é, como ela raciocina, o que ela faz, o que ela entrega — e a **estrutura de dados** que torna esse raciocínio operável em tela.

---

## Propósito deste documento

Os documentos atuais ([`01-roles.md`](../01-roles.md), [`interactions/`](../interactions/), [`templates/00-intake-record.md`](../templates/00-intake-record.md)) definem a Submitter de forma **fragmentada**: seus limites estão nos papéis, seu handoff nas interações, e a forma do entregável no template. Nenhum lugar reúne isso em uma visão única de persona.

Além disso, os [protótipos](../prototypes/) — construídos aprendendo diretamente com a persona — codificaram conhecimento que os documentos **ainda não têm**: um modelo de confiança por campo, um score de prontidão como gate quantitativo, indicadores de valor e métricas de portfólio.

Este documento **consolida as duas fontes** e assume que os docs estão imaturos em relação ao que aprendemos. Ele é, ao mesmo tempo:

- **Documentação** da persona (evolui os docs existentes);
- **Especificação** da abstração que deve virar valor em tela.

O princípio que atravessa tudo: **confiança é de primeira classe.** Cada informação carrega o quão sólida ela é e de onde veio.

---

## 1. Quem é a Submitter

A Submitter é a **persona de fronteira** — a única cujo rosto aponta para fora, em direção a clientes, usuários finais e mercado. Sua língua nativa é **problema, valor, oportunidade, relacionamento** — não funcionalidade, não arquitetura.

Ela vende, encanta e cria o vínculo entre empresa e cliente. Ela conhece (ou tenta descobrir) dores, ideias, mercado e oportunidades. Ela se preocupa com **valor de negócio**.

> **Restrição central de design:** ela não é técnica, não é desenvolvedora de produto. Ela quer o trabalho feito e o que pediu, entregue.

Isso significa que **não podemos pedir que ela pense como engenheira.** O modelo precisa encontrá-la na linguagem dela e fazer a tradução *por* ela — extraindo estrutura suficiente para que a demanda tenha sucesso no downstream.

No exemplo dos protótipos ela é Hugo Seabra, COO. Na vida real, pode ser qualquer origem upstream: CEO/COO, Vendas, Marketing ou CS. **"Submitter" é a abstração genérica** desses papéis (definidos individualmente em [`01-roles.md`](../01-roles.md)).

---

## 2. As duas lentes de toda demanda

Toda demanda é lida por **duas lentes ao mesmo tempo**. Elas coexistem — nenhuma substitui a outra.

| Lente | Natureza | O que é | Como aparece em tela |
|---|---|---|---|
| **Contrato** | Determinística · compartilhada por todas as demandas | O conjunto fixo de **requisitos de compliance** que uma demanda precisa satisfazer para estar "pronta para avançar" | **Prontidão** — o quanto falta, o que está fraco (score + pendências) |
| **Semântica** | Contextual · única por demanda | O que *esta* demanda específica **significa**: a dor real sob o pedido, seu tipo, sua tese de valor, suas incógnitas | **Significado** — a demanda refletida de volta para ela, na linguagem dela |

O contrato é o mesmo para um gateway de pagamento e uma integração SAP. A semântica é completamente diferente.

> **A lista de ToDos vive exatamente onde as duas lentes se encontram:** "dado o que *esta* demanda significa, o que o contrato ainda precisa?" Por isso os ToDos se regeneram — não porque o contrato mudou (ele nunca muda), mas porque a **leitura semântica** da demanda ficou mais nítida.

---

## 3. O modelo de confiança (núcleo)

Confiança é o eixo que sustenta todo o resto. Cada informação capturada — seja resposta a um requisito, seja um indicador de valor — carrega:

| Atributo | Significado |
|---|---|
| `confidence` | 0–100 — o quão sólida é a informação |
| `source` | de onde veio (ex.: "PDF p.4", "Submitter direto", "inferido", "premissa") |
| `status` | `empty` · `low_confidence` · `resolved` |
| `hint` | *por que* a confiança está baixa / o que a elevaria |

Esse é o **camada de honestidade**: o downstream não recebe só respostas, recebe respostas **graduadas por confiança**, sabendo o que é firme e o que precisa de Discovery. O `hint` é o que transforma "está fraco" em "está fraco *por isso*, e *isto* resolveria".

> O RICE clássico trata "confiança" como um único número genérico. Aqui ela é **por campo e por indicador** — essa granularidade é a principal contribuição nova que o protótipo nos ensinou.

---

## 4. Estrutura de dados — determinística na forma, não-determinística no conteúdo

A frase-guia: **a estrutura é fixa; o conteúdo varia.** O modelo de dados é conhecido de antemão; o que preenche cada campo (e quais ToDos surgem) é gerado a partir do conteúdo de cada demanda.

```
ComplianceRequirement   (DETERMINÍSTICO — o contrato fixo)
  id                chave estável
  label             "Impacto no negócio quantificado"
  dimension         Problem | Reach | Impact | Constraints | Stakeholders | Evidence | …
  why               por que a prontidão exige isso
  satisfiedWhen     rubrica: o que é "bom o suficiente" (orienta o julgamento de IA)
  weight            contribuição para o readiness score
  blocksGate        true = não pode avançar até resolver

SubmissionEntry         (conteúdo NÃO-DETERMINÍSTICO, envelope determinístico)
  requirementId     → qual requisito esta entrada responde
  content           texto livre, na linguagem dela
  confidence        0–100, avaliado contra satisfiedWhen
  source            origem da informação
  status            empty | low_confidence | resolved
  hint              por que está fraco / o que o elevaria
  disposition       answered | inferred | assumption | discovery | deferred   (ver §6)

ValueIndicator          (RICE-lite — o espelho, ver §7)
  id                impacto | alcance | urgencia
  score             baixo | médio | alto  (ou 1–3)
  confidence        0–100  (reusa a camada de confiança — não duplica)
  rationale         por que ela pontuou assim

— DERIVADO, regenerado a cada mudança (o motor, não verdade armazenada) —
  todos[]           = requisitos cujo status ≠ resolved   ← o guia dinâmico
  readinessScore    = f(weights, statuses)  (low_confidence conta como parcial)
  gateReady         = todos os requisitos com blocksGate estão resolvidos
```

A linha limpa: **`ComplianceRequirement` é o contrato determinístico; tudo abaixo de `SubmissionEntry.content` é gerado; `todos`/`readinessScore`/`gateReady` são funções puras do que está acima.** Esse mesmo motor é reutilizável para *cada* persona futura (cada uma tem seu próprio conjunto de requisitos, mesmo motor).

---

## 5. Requisitos de compliance — o contrato da Submitter

Conjunto fixo derivado do [`00-intake-record.md`](../templates/00-intake-record.md) e das pendências de captura do protótipo. Cada requisito tem uma dimensão, uma razão e uma rubrica do que o satisfaz. `blocksGate` marca o que impede o avanço.

| # | Requisito (`label`) | Dimensão | Satisfeito quando… | Bloqueia gate? |
|---|---|---|---|---|
| 1 | Enunciado do problema (não a solução) | Problem | A dor está descrita sem propor implementação | ✅ |
| 2 | Originador e contexto | Evidence | Quem levantou e em que situação está claro | ✅ |
| 3 | Quem é impactado | Reach | Personas/segmentos afetados nomeados | ✅ |
| 4 | Impacto de negócio | Impact | Valor descrito (R$, retenção, horas, risco) — quantificado quando possível | ✅ |
| 5 | Urgência e porquê | Impact | "Por que agora" e o custo de esperar estão claros | — |
| 6 | Evidência / documentos anteriores | Evidence | Anexos ou conversas que embasam a demanda | — |
| 7 | Restrições conhecidas | Constraints | Prazo, regulatório, orçamento sinalizados (ou "nenhuma conhecida") | — |
| 8 | Stakeholders | Stakeholders | Quem precisa estar a par / decidir está nomeado | — |

> **Regra de ouro herdada do modelo:** se o registro contém solução proposta em vez de problema, o requisito 1 não é satisfeito e a demanda volta para reformulação (ver [`README.md` › Regra do upstream](../README.md#regra-do-upstream)).

O conteúdo de cada requisito é não-determinístico (varia por demanda). A **existência e a forma** dos requisitos é determinística.

---

## 6. As perguntas que guiam o "mergulho"

A unidade de trabalho é **a pergunta**. Cada pergunta:

- mira um requisito de compliance **e/ou** uma lacuna semântica desta demanda;
- é feita em **linguagem de negócio** (clientes, valor, dor, dinheiro — nunca "qual o modelo de dados");
- existe para **elevar a prontidão**, progressivamente — o "mergulho" aprofunda conforme as respostas revelam onde está a substância (ou a névoa).

### "Não sei" não é beco sem saída — é uma disposição estruturada

Porque ela é de negócio e pode genuinamente não ter a resposta, um requisito não tem só dois estados (respondido / faltando). Ele tem **vários caminhos até "resolvido o suficiente para avançar"**, cada um com sua própria confiança e origem (`SubmissionEntry.disposition`):

| Disposição | O que significa | Efeito na prontidão |
|---|---|---|
| `answered` | Ela responde diretamente | confiança cheia |
| `inferred` | Sistema extrai dos artefatos dela (PDF/deck anexado) | confiança parcial + `source` registrada |
| `assumption` | "Estamos assumindo 40% de opt-in" | conta, mas marcada *a validar* |
| `discovery` | "Ninguém sabe ainda — eis como vamos descobrir" | conta como *resolvido-como-incógnita*, time-boxed |
| `deferred` | Outro stakeholder é dono da resposta | conta, com um dono anexado |

> O gate **não** é "ela sabe tudo". O gate é **"todo requisito tem uma disposição honesta"**. "Não sabemos ainda, e este é o plano para descobrir" é uma forma perfeitamente válida de atingir prontidão — é exatamente o que o **Discovery Brief** e as **Premissas** do template já codificam.

Isso é o que mantém a tela como **parceira de brainstorming**: ela nunca diz "você está faltando isto". Ela diz *"me ajuda a entender X — ou, se você não tem certeza, a gente assume, ou manda pra Discovery?"* O sistema carrega o fardo de transformar a névoa de linguagem de negócio em uma disposição estruturada e graduada por confiança.

---

## 7. Indicadores (RICE-lite) — o espelho que desafia o pensamento

Não é RICE-a-fórmula (Reach × Impact × Confidence ÷ Effort → um número de ranking). É **um punhado de indicadores de negócio, cada um com um score leve, usados como espelho para desafiar o raciocínio** — não para priorizar automaticamente.

Ela pontua cada um de forma simples (Baixo / Médio / Alto, ou 1–3). Ela **fornece a informação**, e o score é só um gatilho para raciocinar:

| Indicador | A pergunta dela, na linguagem dela | Nota |
|---|---|---|
| **Impacto** | "Quanto isso move o negócio?" (R$, retenção, horas de operação) | a tese de valor |
| **Alcance** | "Quantos clientes / usuários / segmentos sentem isso?" | reach |
| **Urgência** | "Por que agora — e o que acontece se a gente esperar?" | sensibilidade ao tempo |
| ~~Confiança~~ | *já coberta* | é a camada de confiança que já temos — não se adiciona de novo |
| **Esforço** | *(deixado soft / adiado)* | ela não é técnica; firma depois com o CTO. Pode dar um chute, marcado `low_confidence` |

### O mecanismo de "desafiar o pensamento"

O valor não está nos scores em si — está na **tensão entre eles**, exibida em tela como uma provocação gentil:

- **Impacto alto + confiança baixa** → *"Você vê valor grande aqui — que evidência te deixaria seguro?"*
- **Urgência alta + Impacto baixo** → *"Parece urgente — é de fato agora, ou só barulhento?"*
- **Alcance alto + Impacto-por-usuário fino** → *"Muita gente, efeito pequeno em cada — esse é o ganho real?"*

Cada desafio que afia uma resposta **também eleva a prontidão** — espelho e gate puxam na mesma direção. A confiança (§3) é o que torna a tensão visível: ela é a coordenada que cruza com cada indicador.

---

## 8. Como ela é medida — visão de portfólio

O protótipo deu à Submitter um dashboard que os docs nunca imaginaram. Essas métricas *são* como ela raciocina sobre o próprio trabalho:

| Métrica | O que diz | Origem |
|---|---|---|
| **Impacto anual** (R$/ano por demanda) | Ela pensa em dinheiro | drill-down do protótipo |
| **Taxa de conversão demanda → RP** (ex.: 64%) | Quantas das demandas dela sobrevivem ao gate | KPI do protótipo |
| **Lead time submissão → congelado** (ex.: 8,5 dias) | Quão rápido o input dela é racionalizado | KPI do protótipo |
| **Aceite na 1ª versão** (ex.: 78%) | Qualidade do material *bruto dela* (o RP foi aceito de primeira) | KPI do protótipo |

> **Insight silencioso:** "aceite na 1ª versão" é um *score de qualidade sobre a própria Submitter* — diz se ela está alimentando bem a máquina, sem exigir que ela seja técnica.

---

## 9. O entregável e o handoff

- **Entregável:** o **Intake Record** (`INT-AAAA-NNN`) — ver [`templates/00-intake-record.md`](../templates/00-intake-record.md).
- **Gate:** a demanda só sai quando `gateReady = true` (todos os requisitos `blocksGate` resolvidos). O **Readiness Score** é a versão quantitativa do gate decision do Stage-Gate (ver [`references.md` § 2](../references.md)).
- **Handoff:** entregue ao **PO** (camada de Intake). O handoff só se completa quando "o Intake Layer confirmou o recebimento" (ver [`interactions/01-sales-to-po.md`](../interactions/01-sales-to-po.md)).

---

## 10. Valor na tela

A tela **não** deve parecer um formulário sendo validado. Deve parecer que o sistema **entendeu a demanda** e está fazendo brainstorming dela com ela.

- A **lente de contrato** renderiza como *prontidão*: o quão perto estou, o que falta, o que está fraco.
- A **lente semântica** renderiza como *significado*: eis o que esta demanda **é** — seu problema, seu valor, sua forma — refletida na linguagem dela, para que ela veja que o sistema *a entendeu*, não só a avaliou.

---

## 11. O que o protótipo ensinou (e os docs ainda não têm)

1. **Confiança por campo** (`confidence/source/status/hint`) — a camada de honestidade.
2. **Readiness Score** — o gate do Stage-Gate virado número com regra (`low_confidence` conta parcial; 100% para avançar).
3. **Pré-preenchimento por IA** — o sistema extrai dos artefatos dela e só pergunta as lacunas ("li seu documento, identifiquei 5 infos, faltam 3 pendências").
4. **Indicadores de valor + tensões** (RICE-lite) — o espelho que desafia o pensamento.
5. **Métricas de portfólio** — incluindo "aceite na 1ª versão" como score de qualidade da própria persona.

---

## 12. Relação com os documentos existentes

| Documento | Relação |
|---|---|
| [`01-roles.md`](../01-roles.md) | Define os papéis upstream individuais (CEO, Vendas, Marketing, CS). Este doc os **abstrai** na persona genérica Submitter. |
| [`templates/00-intake-record.md`](../templates/00-intake-record.md) | A forma do entregável. Os **requisitos de compliance** (§5) derivam dele e o tornam graduável por confiança. |
| [`interactions/01-sales-to-po.md`](../interactions/01-sales-to-po.md) (e demais upstream→PO) | Descrevem o handoff. Este doc adiciona o **gate quantitativo** (Readiness Score) sobre ele. |
| [`prototypes/`](../prototypes/) | Pesquisa primária. As mecânicas de confiança, score, indicadores e métricas (§3, §7, §8, §11) vêm daqui. |

---

> **Próximas personas** seguem este mesmo molde: quem é · duas lentes · modelo de confiança · estrutura de dados · requisitos de compliance · perguntas/dispositions · indicadores · métricas · handoff · valor em tela.
