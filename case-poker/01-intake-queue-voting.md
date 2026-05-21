# Registro de Intake — Queue Voting (Fila de Votação)

## Metadados

| Campo | Valor |
|---|---|
| **ID do Registro** | INT-2026-001 |
| **Versão** | v2 |
| **Registrado por** | Ana Costa (Customer Success) |
| **Data de registro** | 2026-03-12 |
| **Status** | Aprovado — em planejamento de execução |
| **Data de triagem** | 2026-03-13 |
| **Triado por** | Lucas Mendes (PO) |
| **Readiness Package vinculado** | RP-2026-001 v2 |

## Histórico de Revisão

| Versão | Data | Evento | Resumo |
|---|---|---|---|
| v1 | 2026-03-12 | Intake registrado | CS registrou demanda a partir de chamada trimestral de revisão com Banco Meridional. |
| v1 | 2026-03-13 | Triagem concluída | PO triou como Product Ready. Readiness Package iniciado. |
| v1 | 2026-03-20 | RP-2026-001 v1 submetido | PO submeteu o primeiro Readiness Package ao PM. |
| v1 | 2026-03-22 | RP rejeitado pelo PM | PM devolveu o pacote: faltava estratégia de rollout e critérios de aceite incompletos para edge cases. |
| v2 | 2026-03-28 | RP-2026-001 v2 aprovado | PO resubmeteu com correções. PM aprovou. Demanda avança para planejamento de execução. |

---

## Origem

| Campo | Valor |
|---|---|
| **Fonte** | Cliente |
| **Cliente** | Banco Meridional (cliente enterprise, cerimônias de planejamento para 12 squads) |
| **Reportado via** | Chamada trimestral de revisão com CS |

---

## Tipo

- [x] Funcionalidade
- [ ] Bug
- [ ] Melhoria
- [ ] Compliance
- [ ] Integração
- [ ] Operacional

---

## Enunciado do Problema

Durante cerimônias de sprint planning, os times utilizam a sala de poker planning para estimar histórias de usuário. No entanto, os facilitadores atualmente não têm como controlar quais perguntas ou histórias serão votadas a seguir. Todos os participantes podem ver o backlog completo de itens simultaneamente.

A dor específica reportada: quando um facilitador compartilha uma lista de 20+ histórias com o time, os participantes pulam à frente, leem itens futuros, formam opiniões prematuras e desestabilizam o fluxo de estimativa. Não há mecanismo para enfileirar itens e revelá-los um de cada vez.

Adicionalmente, o cliente quer que os votos permaneçam ocultos até que o facilitador os revele explicitamente, prevenindo o viés de ancoragem onde participantes copiam o primeiro voto que veem.

---

## Impacto de Negócio

| Dimensão | Detalhe |
|---|---|
| **Receita** | Banco Meridional tem 3 outros squads que ainda não usam a plataforma. A adoção está bloqueada por esta lacuna de UX. ARR de expansão estimado: R$ 28.000/ano. |
| **Retenção** | CS sinalizou isso como risco de renovação. Renovação do contrato em 90 dias. |
| **Operacional** | Facilitadores estão usando workarounds (compartilhando histórias uma de cada vez via chat) que adicionam 15–20 min por cerimônia. |
| **Competitivo** | Duas ferramentas concorrentes já suportam isso. Foi mencionado como lacuna de diferenciação na chamada de renovação. |

---

## Stakeholders

| Stakeholder | Papel | Interesse | Influência |
|---|---|---|---|
| Ana Costa | Customer Success | Retenção da renovação do Banco Meridional | Alta — reportadora principal da demanda, dona do relacionamento com o cliente |
| Scrum Masters do Banco Meridional | Usuários finais (facilitadores) | Controle do fluxo da cerimônia e integridade dos votos | Alta — usuários diretos da funcionalidade |
| Desenvolvedores do Banco Meridional | Usuários finais (votantes) | Menos distração, estimativa mais focada | Média — afetados mas não tomadores de decisão |
| Lucas Mendes | PO | Alinhamento de produto e qualidade da entrega | Alta — dono da racionalização e do Readiness Package |
| PM (a definir) | Gerente de Projeto | Execução da entrega | Alta — responsável pelo prazo e capacidade |
| CEO | Sponsor executivo | Retenção de receita e crescimento da plataforma | Média — não envolvido no dia a dia, mas informado do risco de renovação |

---

## Premissas

Estas são condições assumidas como verdadeiras no intake. Se alguma premissa se provar falsa, a demanda deve ser retriada.

1. A infraestrutura WebSocket existente suporta novos tipos de eventos sem requerer um novo broker ou camada de mensageria.
2. A persistência de estado de sessão já está implementada e pode ser estendida com novos campos (ordem da fila, estado de revelação) sem uma migração completa de schema.
3. Os Scrum Masters do Banco Meridional têm autoridade para adotar novos recursos da plataforma sem requerer aprovação de TI de sua organização.
4. A funcionalidade se aplica igualmente a todos os tipos de sala — sem tratamento especial necessário para diferentes formatos de cerimônia.
5. Um único facilitador por sessão permanece o modelo (co-facilitação não é necessária neste release).

---

## Constraints

Condições que limitam o espaço de solução e devem ser respeitadas independentemente do que for construído.

| Constraint | Tipo | Detalhe |
|---|---|---|
| Prazo de renovação | Tempo | Renovação do contrato em 90 dias. A funcionalidade deve estar em produção antes da conversa de renovação. |
| Sem redesign mobile | Escopo | O layout mobile existente se aplica. Sem investimento em UI mobile neste release. |
| Modelo de facilitador único | Escopo | Co-facilitação está explicitamente fora do escopo. A arquitetura não deve impossibilitá-la, mas não precisa implementá-la. |
| Deploy sem downtime | Técnico | A funcionalidade deve ser implantável sem interrupção de sessão para clientes ativos. |
| Sem novos serviços externos | Orçamento | A funcionalidade deve ser construída na infraestrutura existente. Nenhum novo serviço de terceiros pode ser contratado. |

---

## Riscos Preliminares

Riscos identificados no intake — antes da avaliação técnica. Não é um registro completo de riscos (isso pertence ao Readiness Package).

| Risco | Categoria | Avaliação Inicial |
|---|---|---|
| Inconsistências de ordenação de eventos WebSocket sob carga | Técnico | Desconhecido — necessita load testing durante QA |
| Bypass de ocultação de votos via inspeção client-side | Segurança | Provavelmente mitigável — servidor deve aplicar, não o cliente |
| Perda de estado de sessão durante reconexão do facilitador | Técnico | Requer design de resiliência — período de graça ou snapshot de sessão |
| Viés de ancoragem não totalmente eliminado (participantes ainda podem compartilhar verbalmente) | Produto | Aceito — a plataforma só pode controlar a visibilidade digital |
| Prazo de renovação não cumprido se discovery revelar bloqueadores arquiteturais | Prazo | Baixa probabilidade com base na avaliação inicial, mas não zero |

---

## Limite de Escopo de Alto Nível

**Dentro:** Gerenciamento de fila pelo facilitador, revelação sequencial de itens, ocultação de votos, revelação de votos controlada pelo facilitador, persistência de estado de sessão.

**Fora:** Temporizadores por item, gatilhos de revelação automática, controle multi-facilitador, redesign mobile, relatórios/analytics, integração Jira/Linear.

**Adiado:** Toggle de preferência de revelação automática, reuso de template de fila, dashboard de analytics de cerimônias.

---

## Prioridade

**Nível:** Alta

**Motivo:** Renovação do contrato em 90 dias. CS sinalizou como potencial risco de churn se não resolvido.

---

## Critérios de Sucesso

Indicadores de alto nível que definem como é "concluído e valioso" para esta demanda. Metas mensuráveis detalhadas pertencem ao Readiness Package — estes são os sinais no nível do intake.

| Critério | Tipo | Indicador |
|---|---|---|
| Contrato do Banco Meridional renovado | Negócio | Renovação assinada antes da data de expiração |
| 3 squads pendentes integrados | Negócio | Contagem de ativação de squads no dashboard da conta em até 60 dias do release |
| Duração das cerimônias reduzida | Operacional | Tempo médio de sessão para cerimônias com 10+ itens cai ≥ 20% vs. baseline |
| Workaround do facilitador eliminado | Operacional | Sem tickets de CS reportando workaround de compartilhamento manual de histórias pós-release |
| Zero reclamações de ancoragem de votos | Qualidade | Sem tickets de CS citando visibilidade de votos antes da revelação como problema |
| Funcionalidade adotada sem treinamento | UX | Facilitadores ativam controles de fila e revelação sem requerer intervenção de suporte |

---

## Notas de Triagem do PO

Esta demanda é real, recorrente em outros 3 clientes enterprise (CS tem registros informais), e está alinhada com o roadmap da plataforma em direção ao controle do facilitador e qualidade das cerimônias. O escopo está delimitado e não parece requerer mudanças arquiteturais a nível de plataforma — sem nova infraestrutura, sem impacto em IA/runtime.

**Caminho de decisão:** Product Ready → Racionalização

**Escalada arquitetural ao CTO:** Não. Apenas mudanças de UI e estado de sessão. A confirmar durante a racionalização.

**Premissas validadas na triagem:** Todas as cinco premissas acima são consideradas razoáveis. Sem red flags imediatos.

**Constraints reconhecidos:** O prazo de renovação é o constraint de tempo vinculante. O PM deve considerar isso na avaliação de capacidade desde o primeiro dia.
