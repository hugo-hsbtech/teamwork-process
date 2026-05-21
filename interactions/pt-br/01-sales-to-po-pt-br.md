# Interação 01 — Vendas → PO

**Direção:** Vendas inicia. PO recebe.
**Camada:** Upstream → Camada de Intake

---

## Gatilho

Um prospect ou cliente existente expressa uma dor, lacuna ou necessidade vinculada a um deal ou renovação.

---

## O que Vendas Deve Fornecer

- Registro de intake estruturado com: origem, tipo, descrição do problema, impacto de negócio, prioridade
- Contexto comercial: qual cliente, estágio do deal, receita em risco, sensibilidade de prazo
- Stakeholders: quem no lado do cliente se importa, quem tem autoridade de decisão
- Limite preliminar de escopo: o que o cliente descreveu como necessidade (não uma solução)

---

## O que o PO Faz Com Isso

- Revisa o registro quanto à completude antes de aceitá-lo
- Faz a triagem dentro do SLA definido pelo nível de prioridade
- Responde com um dos seguintes: Product Ready, Discovery, Opportunity Backlog, Rejeitado — com justificativa

---

## Transferência de Ownership

**De Vendas:** A responsabilidade pelo sinal de demanda termina aqui. Vendas não tem mais ação até que o resultado da triagem seja comunicado.
**Para o PO:** Detém o registro de intake a partir deste ponto — decisão de triagem, roteamento e comunicação do resultado de volta para Vendas.
**Artefato transferido:** Registro de intake completo.

---

## Gate

O PO não aceita registros de intake sem descrição do problema, impacto de negócio ou justificativa de prioridade. Espera-se que Vendas complete o registro antes de submetê-lo — não depois.

---

## Caminho de Falha

Se o intake estiver incompleto, o PO o devolve para Vendas com os campos específicos faltantes anotados. Vendas não recebe um reconhecimento verbal como substituto a um registro completo.

---

## O que Vendas NÃO Deve Fazer

- Comunicar compromissos de solução ou prazos ao cliente antes que a triagem seja concluída
- Escalar diretamente para CTO, Tech Leads ou Engenharia para "andar mais rápido"
- Submeter a mesma demanda múltiplas vezes para aumentar a urgência

---

## Sequência

```mermaid
sequenceDiagram
    actor S as Vendas
    actor PO as PO

    S->>PO: Registro de intake estruturado
    PO->>PO: Verifica completude

    alt Registro incompleto
        PO-->>S: Devolve com campos faltantes listados
        S->>PO: Resubmete com correções
    end

    PO->>PO: Triagem (dentro do SLA)
    PO-->>S: Resultado da triagem + justificativa
    Note over S,PO: Product Ready / Discovery / Backlog / Rejeitado
```
