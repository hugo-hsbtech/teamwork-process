# Caso: StayFlow — Concierge & Settlement

## Cenário

**StayFlow** é uma plataforma B2B2C de hospedagem que opera como OTA (Online Travel Agency) / marketplace de reservas. O hóspede pesquisa, compara e reserva diretamente pela StayFlow; a StayFlow cobra o hóspede, **retém uma comissão (split)** e **repassa o restante ao hotel parceiro**. A rede já conta com dezenas de hotéis parceiros e cresce em volume de reservas mês a mês.

O modelo de negócio tem três partes com interesses distintos:
- **Hóspedes**: querem reservar com facilidade, pagar com segurança e ser atendidos rapidamente quando algo dá errado.
- **Hotéis parceiros**: querem receber o repasse correto, no prazo, com previsibilidade — e confiam na StayFlow para honrar o contrato financeiro.
- **StayFlow**: precisa escalar o atendimento sem escalar custo, manter confiança dos hotéis e garantir integridade financeira dos repasses.

---

## A demanda

**Originada por:** Camila Rocha, Líder de CS/Operações  
**Data da captura:** 2026-04-07  
**Como chegou:** Reunião de planejamento de Q2 — a Camila apresentou duas dores operacionais que, na linguagem dela, vieram como uma solução: *"Precisamos de um chatbot que faça o primeiro atendimento ao hóspede e, quando necessário, transfira para um especialista humano; e precisamos automatizar o repasse do pagamento aos hotéis."*

A dor real por trás:

| Dor | Manifestação | Impacto |
|---|---|---|
| **Atendimento caro e lento na 1ª camada** | 100% dos atendimentos são tratados por agentes humanos, mesmo os que se resolvem com informação básica (status de reserva, confirmação de check-in, política de cancelamento). | CSAT abaixo da meta (3,8/5), custo operacional em alta com crescimento de volume, SLA de primeira resposta furado em 34% dos tickets. |
| **Repasse manual com risco financeiro e operacional** | O repasse aos hotéis é calculado manualmente em planilha, com verificação campo a campo do percentual de comissão por hotel. Transferências via TED manual. Sem reconciliação automática. | 3 incidentes de repasse com valor errado nos últimos 6 meses. Dois hotéis ameaçaram rescindir o contrato. 1 chargeback sem cobertura do hotel. Equipe financeira gasta ~18h/semana nessa operação. |

---

## Por que esta demanda parece pequena — e não é

A formulação original ("um chatbot + automatizar o repasse") sugere dois projetos pequenos, cada um de escopo limitado. A passagem pelo intake revelou o tamanho real:

**No atendimento:**
- "Um chatbot" implica: definição da camada de IA (LLM, base de conhecimento, fallback), regras de escalonamento para humano (quando transferir? com qual contexto? para qual fila?), filas de atendimento, SLAs por tipo de ticket, gestão de contexto entre camadas, CSAT por canal.
- A integração com o sistema de reservas é necessária para que o atendimento seja contextualizado (o hóspede quer saber o status da *sua* reserva, não um FAQ genérico).

**No repasse:**
- "Automatizar o repasse" implica: modelo de split por hotel (percentuais diferentes por parceiro), cobrança do hóspede (PSP/gateway), retenção da comissão, repasse ao hotel (integração bancária ou PIX), idempotência (o repasse não pode acontecer duas vezes), reconciliação contábil, tratamento de falha de pagamento, tratamento de chargeback, reembolso parcial, ledger de transações.
- O percentual de repasse incorreto tem impacto financeiro e jurídico direto — não é só um bug operacional.

**A escalada arquitetural foi inevitável:** split de pagamento, idempotência, conciliação, PCI DSS, integração com PSP/gateway, ledger financeiro — tudo isso exigiu avaliação do CTO antes de o escopo poder ser congelado.

---

## Documentos deste caso

| Artefato | ID | Arquivo | Responsável | Status |
|---|---|---|---|---|
| Documento do Submitter | — | [`00-submitter-brief-concierge-settlement.md`](./00-submitter-brief-concierge-settlement.md) | Camila Rocha (CS/Ops) | `gateReady = true` |
| Intake Record | INT-2026-050 | [`01-intake-record-concierge-settlement.md`](./01-intake-record-concierge-settlement.md) | Rafael Souza (PO) | Triado — Discovery |
| Readiness Package | RP-2026-050 | [`02-readiness-package-concierge-settlement.md`](./02-readiness-package-concierge-settlement.md) | Rafael Souza (PO) | `freezeReady = true` |
| Technical Assessment | TA-2026-050 | [`03-technical-assessment-concierge-settlement.md`](./03-technical-assessment-concierge-settlement.md) | Davi Lima (CTO) | Assinado |
| PRD | PRD-2026-050 | [`04-prd-concierge-settlement.md`](./04-prd-concierge-settlement.md) | Rafael Souza (PO) + Davi Lima (CTO) | Entregue ao PM |

---

## Estado do processo

```text
[INT-2026-050] Concierge & Settlement — "demanda pequena que explodiu"

  Captura (Camila, 2026-04-07)
    → Handoff ao PO (2026-04-08)
    → Triagem (Rafael, 2026-04-09): Discovery requisitado
        Incógnita 1: capacidade de split do PSP atual (Stripe Connect vs alternativa)
        Incógnita 2: modelo de reconciliação contábil / requisitos fiscais do repasse
        Incógnita 3: viabilidade de integração com sistema de reservas para contexto no atendimento
    → Discovery (2026-04-09 → 2026-04-18, 7 dias úteis)
        Resultado: PSP atual não suporta split nativo → migração ou multi-PSP necessária
        Resultado: Contabilidade exige NF do repasse por hotel → escopo fiscal adicionado
        Resultado: API do sistema de reservas tem endpoint de contexto disponível → viável
    → Decisão revista: Product Ready (2026-04-18)
    → Escalada ao CTO (2026-04-18): escalada arquitetural confirmada
    → RP racionalizando em paralelo ao TA (2026-04-18 → 2026-04-25)
    → TA assinado (Davi, 2026-04-25): Viável com ressalvas (migração de PSP no caminho crítico)
    → RP congelado com TechAssessmentRef = Assinado (2026-04-25)
    → PRD fusão (2026-04-26)
    → Entregue ao PM (2026-04-28)
```

---

## Jornada resumida das incógnitas do Discovery

| Incógnita | Resolvida por | Resultado | Impacto no escopo |
|---|---|---|---|
| Capacidade de split do PSP atual | Spike técnico — CTO + Financeiro | PSP atual (Stripe básico) não suporta split nativo; migração para Stripe Connect ou Adyen Marketplace necessária | Adicionado ao escopo: migração de PSP como pré-condição do Settlement Service |
| Modelo de reconciliação e requisitos fiscais | Reunião com Contabilidade + Jurídico | Repasse a hotel parceiro exige emissão de NF de serviço (ou recibo fiscal, dependendo do regime do hotel); conciliação deve gerar relatório por hotel por período | Adicionado ao escopo: módulo de conciliação com exportação por hotel; NF adiada para Fase 2 (integração fiscal complexa) |
| Viabilidade de integração com sistema de reservas | Revisão de API (CTO) | Endpoint `/reservations/{id}/context` disponível na API interna — dados de reserva, hóspede e status retornados em < 200ms | Adicionado ao escopo: Concierge Service consome API de contexto para personalizar respostas da IA |

---

## O que a "demanda pequena" gerou — resumo pedagógico

Esta demanda chegou com **2 pedidos** e gerou:

| Dimensão | Quantidade |
|---|---|
| Artefatos formais produzidos | **5** (00 → 04) |
| Incógnitas de Discovery investigadas | **3** |
| Domínios de produto cobertos no RP | **2** (Concierge + Settlement) |
| User Stories no RP | **12** |
| Edge cases explícitos no RP | **18** |
| Regras de negócio documentadas | **21** |
| Riscos de produto/negócio no RP | **8** |
| Riscos técnicos no TA | **9** |
| ADRs arquiteturais no TA | **6** |
| Integrações externas identificadas no TA | **4** (PSP, gateway bancário, LLM provider, API de reservas) |
| Constraints rígidas (PCI DSS, idempotência, consistência financeira) | **5** |
| Estimativa de esforço total (firme, do CTO) | **~67 dias de engenharia** |
| Estimativa preliminar do Submitter | *"não faço ideia — talvez 2 semanas?"* |

> **O ponto pedagógico:** a formulação original do Submitter subestimou o escopo em ~700%. O intake não criou complexidade — ele a revelou. Sem a camada de triagem, Discovery e TA, a engenharia teria iniciado desenvolvimento de um "chatbozinho e uma automação de planilha" e encontrado, na metade do sprint, PCI DSS, split de pagamento, idempotência, falhas de conciliação e ausência de suporte no PSP.
