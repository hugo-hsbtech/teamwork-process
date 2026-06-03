# Interação 09 — PM → Tech Leads (Handoff do Plano de Execução)

**Direção:** PM inicia. Tech Leads recebem.
**Camada:** Dentro do Downstream

---

## Gatilho

O Plano de Execução está completo e o PM verificou que a capacidade é suficiente para começar.

---

## O que o PM Deve Fornecer

- Plano de Execução completo: marcos, estrutura de sprint, mapa de dependências, gatilhos de escalada
- PRD (repassado — Tech Leads precisam do contexto completo de produto e técnico: RP + Technical Assessment)
- Perguntas específicas para os Tech Leads responderem antes do breakdown começar (se houver)
- Prazo de dependências externas: quaisquer ações necessárias de fora do time (registros de clientes, procurement, provisionamento de infraestrutura pelo CTO)

---

## O que os Tech Leads Produzem

- Confirmação de que têm contexto suficiente para iniciar o breakdown técnico
- Product Backlog: épicos, histórias e tasks com critérios de aceite (escritos e estimados pelos Tech Leads — derivados das user stories de produto do PRD; é aqui que se atinge a **Definition of Ready**)
- Tech Backlog: ADRs, breakdown de tarefas, estimativas refinadas, Definição de Pronto, estratégia de rollout
- Escalada ao PM se qualquer item de escopo for tecnicamente impossível ou requerer uma decisão

---

## Transferência de Ownership

**Do PM:** O planejamento de execução está completo e transferido. O PM permanece responsável pelos marcos e gatilhos de escalada, mas a execução técnica no dia a dia está agora nas mãos dos Tech Leads.
**Para os Tech Leads:** Detêm o breakdown técnico — ADRs, definição de tarefas, refinamento de esforço, o Product Backlog e o Tech Backlog. Escrevem e estimam épicos, histórias e tasks a partir das user stories de produto do PRD.
**Artefato transferido:** Plano de Execução + PRD completo.

---

## Gate

Os Tech Leads não começam o breakdown antes de confirmar que têm contexto suficiente. Se o PRD estiver faltando detalhe técnico de que precisam, eles apresentam ao PM — não trabalham silenciosamente em torno disso.

---

## Caminho de Falha

Se os Tech Leads identificarem um item de escopo tecnicamente inviável ou que requer uma decisão fora de sua autoridade, devolvem ao PM com uma descrição escrita. O PM escala ao PO. O PO revisa o escopo ou escala ao CTO.

---

## O que o PM NÃO Deve Fazer

- Fazer o handoff sem passar o PRD completo
- Definir um prazo para o breakdown antes que os Tech Leads tenham confirmado contexto suficiente
- Absorver relatórios de inviabilidade de escopo sem escalar ao PO

---

## Sequência

```mermaid
sequenceDiagram
    actor PM as PM
    actor TL as Tech Leads
    actor PO as PO

    PM->>TL: Plano de Execução + PRD
    TL->>TL: Revisão de contexto

    alt Contexto técnico insuficiente
        TL-->>PM: Gaps específicos listados
        PM->>PO: Repassa os gaps
        PO-->>PM: Preenche gaps ou abre escalada ao CTO
        PM->>TL: Contexto atualizado
    end

    TL-->>PM: Contexto confirmado — breakdown inicia
    TL->>TL: Escreve e estima Product Backlog + Tech Backlog (atinge a DoR)

    alt Item de escopo tecnicamente inviável
        TL-->>PM: Relatório de inviabilidade escrito
        PM->>PO: Decisão de escopo necessária
        PO-->>PM: Escopo revisado
        PM->>TL: Atualização de escopo
    end

    TL-->>PM: Tech Backlog completo — pronto para engenheiros
```
