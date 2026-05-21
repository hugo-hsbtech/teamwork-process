# Registro de Intake — Room Access Control (Controle de Acesso à Sala)

## Metadados

| Campo | Valor |
|---|---|
| **ID do Registro** | INT-2024-002 |
| **Versão** | v1 |
| **Registrado por** | Rafael Souza (Vendas) |
| **Data de registro** | 2024-03-15 |
| **Status** | Aprovado — em planejamento de execução |
| **Data de triagem** | 2024-03-17 |
| **Triado por** | Lucas Mendes (PO) |
| **Readiness Package vinculado** | RP-2024-002 v1 |

## Histórico de Revisão

| Versão | Data | Evento | Resumo |
|---|---|---|---|
| v1 | 2024-03-15 | Intake registrado | Vendas registrou demanda a partir de chamada pré-fechamento com Construtora Ágil. |
| v1 | 2024-03-17 | Triagem concluída | PO triou. Três incógnitas de integração identificadas. Demanda enviada para Discovery. |
| v1 | 2024-03-18 | Discovery aberto | PO abriu Discovery para incógnitas de Azure AD, Jira e LGPD. CTO notificado. |
| v1 | 2024-03-25 | Discovery encerrado | Todas as incógnitas resolvidas dentro do time-box. Demanda retriada como Product Ready. |
| v1 | 2024-03-27 | RP-2024-002 v1 aprovado | PO + CTO submeteram Readiness Package. PM aprovou na primeira revisão. Demanda avança para planejamento de execução. |

---

## Origem

| Campo | Valor |
|---|---|
| **Fonte** | Cliente |
| **Cliente** | Construtora Ágil (mid-market, onboarding em andamento) |
| **Reportado via** | Chamada pré-fechamento de Vendas |

---

## Tipo

- [x] Funcionalidade
- [ ] Bug
- [ ] Melhoria
- [x] Compliance
- [x] Integração
- [ ] Operacional

---

## Enunciado do Problema

A Construtora Ágil realiza cerimônias de planejamento com participação mista: algumas sessões incluem prestadores externos e consultores que não devem ter visibilidade sobre todas as estimativas ou identidades dos participantes. O dono da sala (Scrum Master ou Tech Lead) precisa de controle sobre:

1. **Quem pode ver a lista de participantes** na sala — em algumas sessões, o anonimato entre votantes é obrigatório.
2. **Quem pode entrar na sala** — atualmente qualquer pessoa com o link pode entrar. O cliente precisa de acesso somente por convite ou baseado em aprovação.
3. **Distinção observador vs. votante** — alguns participantes devem poder acompanhar a cerimônia sem votar (ex.: product managers, executivos observando o processo).

O modelo atual é completamente aberto: qualquer pessoa com o link entra, vê todos e vota. Não há diferenciação de papéis ou controle de visibilidade dentro da sala.

---

## Impacto de Negócio

| Dimensão | Detalhe |
|---|---|
| **Receita** | Este é um bloqueador para fechar o contrato da Construtora Ágil (R$ 42.000/ano). O deal está condicionado a esta funcionalidade. Vendas fez uma expectativa informal de 60 dias — PO deve esclarecer isso com Vendas. |
| **Retenção** | Não aplicável (cliente ainda não integrado). |
| **Mercado** | Vendas relata que este pedido surgiu em outros 2 deals em pipeline no Q1. Provável necessidade a nível de segmento para ambientes enterprise e regulados. |
| **Compliance** | A Construtora Ágil opera sob políticas internas de governança de dados que restringem a visibilidade de dados de participantes entre prestadores. |

---

## Stakeholders

| Stakeholder | Papel | Interesse | Influência |
|---|---|---|---|
| Rafael Souza | Vendas | Fechar o contrato da Construtora Ágil | Alta — reportador da demanda, dono do relacionamento com o deal |
| Scrum Masters da Construtora Ágil | Usuários finais (facilitadores) | Acesso controlado e em conformidade às cerimônias | Alta — operadores primários da funcionalidade |
| TI Lead da Construtora Ágil (Fernanda Ramos) | Autoridade técnica do cliente | Integração Azure AD e conformidade LGPD | Alta — deve aprovar e configurar o registro no Azure AD |
| Prestadores Externos da Construtora Ágil | Usuários finais (observadores restritos) | Participar de sessões com visibilidade limitada | Média — usuários afetados, sem poder de decisão sobre produto |
| Ana Costa | Customer Success | Onboarding tranquilo e saúde pós-venda | Média — será dona do relacionamento pós-fechamento |
| Lucas Mendes | PO | Alinhamento de produto, definição de escopo | Alta — dono da racionalização e do Readiness Package |
| Rodrigo Lima | CTO | Integridade arquitetural, conformidade LGPD, viabilidade Azure AD | Alta — necessário para avaliação técnica e decisão de residência de dados |
| CEO | Sponsor executivo | Receita (novo contrato) e postura de compliance | Média — deve ser informado do risco LGPD antes do escopo ser comprometido |

---

## Premissas

Estas são condições assumidas como verdadeiras no intake. Se alguma premissa se provar falsa, a demanda deve ser retriada.

1. A Construtora Ágil está disposta e é capaz de registrar a plataforma como aplicação aprovada no seu tenant Azure AD.
2. A equipe de TI do cliente pode completar o registro no Azure AD dentro da janela de entrega após as especificações técnicas serem fornecidas.
3. A camada de autenticação existente (OAuth2) pode ser estendida para suportar validação de group-claim OIDC sem substituir ou reescrever o serviço de autenticação.
4. A conformidade LGPD para este cliente pode ser alcançada definindo residência de dados por tenant (Opção C), sem requerer migração completa da plataforma.
5. A integração Jira não é um requisito obrigatório para o deal fechar (a confirmar no Discovery).
6. Aliases de modo anônimo são suficientes para conformidade — sem necessidade de mascaramento adicional de dados a nível de banco de dados além do que é exibido.
7. O escopo do controle de acesso é por sala, não por conta de organização. Configurações padrão a nível de organização estão fora do escopo deste release.

---

## Constraints

Condições que limitam o espaço de solução e devem ser respeitadas independentemente do que for construído.

| Constraint | Tipo | Detalhe |
|---|---|---|
| Prazo do deal | Tempo | Vendas fez um compromisso informal de 60 dias. Nenhuma data é confirmada até que a avaliação de capacidade do PM seja concluída. |
| Conformidade LGPD | Legal / Regulatório | Dados de identidade de participantes de clientes brasileiros devem ser armazenados no Brasil (`sa-east-1`). Inegociável para este cliente. |
| Dependência Azure AD | Externa | A Construtora Ágil controla seu próprio tenant Azure AD. A plataforma não pode completar a integração sem ação do TI deles. O prazo está parcialmente fora do nosso controle. |
| Sem implementação SSO completa | Escopo | SSO enterprise completo está fora do escopo. Apenas validação de group-claim OIDC para este release. |
| Compatibilidade retroativa | Técnico | Salas com link aberto existentes devem continuar funcionando sem alterações. Controle de acesso é opt-in por sala, não uma mudança breaking a nível de plataforma. |
| Sem novos provedores de auth externos | Orçamento | Nenhum novo provedor de identidade (Okta, Auth0, etc.) pode ser contratado. Apenas extensão da camada de auth existente. |

---

## Riscos Preliminares

Riscos identificados no intake — antes da avaliação técnica. Atualizados após Discovery. Não é um registro completo de riscos (isso pertence ao Readiness Package).

| Risco | Categoria | Probabilidade | Impacto | Avaliação Inicial |
|---|---|---|---|---|
| Registro Azure AD atrasado pelo TI do cliente | Externo / Prazo | Média | Alto | Dependência do lado do cliente fora do nosso controle. Mitigação: fornecer spec e checklist ao TI do cliente cedo. |
| Postura LGPD requer trabalho de infraestrutura além da Opção C | Compliance | Baixa | Alto | CTO deve confirmar escopo da Opção C antes do compromisso. Se for mais amplo, CEO deve decidir. |
| Compromisso de prazo de Vendas conflita com capacidade real | Operacional | Alta | Alto | PM deve executar avaliação de capacidade antes de qualquer data ser comunicada externamente. PO é dono deste gate. |
| Migração do modelo de dados de participantes quebra sessões ativas | Técnico | Baixa | Alto | Estratégia de mudança aditiva de schema deve ser confirmada pelo CTO. |
| Pressão de expansão de escopo (audit logs, SSO, guest access) | Escopo | Média | Médio | Exclusões explícitas documentadas no limite de escopo abaixo. PO aplica o limite. |
| Integração Jira escalada para requisito obrigatório durante a entrega | Escopo | Baixa | Médio | A ser definitivamente encerrado na chamada de Discovery com o cliente. |
| Bypass do modo anônimo (cliente infere identidade pelo padrão de votos) | Segurança / Produto | Baixa | Baixo | Risco aceito — a plataforma controla apenas a exibição digital, não inferência comportamental. |

---

## Limite de Escopo de Alto Nível

**Dentro:** Modos de acesso (Aberto / Somente convite / Aprovação obrigatória), modo anônimo, atribuição de papel Votante/Observador, remoção de participante, mapeamento de group-claim Azure AD OIDC, residência de dados em conformidade com LGPD (Opção C — roteamento `sa-east-1` por cliente).

**Fora:** SSO / SAML completo, audit logs, integração Jira, guest access sem registro, configurações padrão a nível de organização, senhas de sala.

**Adiado:** Convite em massa via CSV, atribuição automática de observador por papel organizacional, exportação de compliance para governança.

---

## Desafios de integração identificados no intake

Durante a chamada de intake, Vendas trouxe três dependências de integração que não estavam previstas e bloqueiam a racionalização até serem investigadas:

### 1. Microsoft Azure Active Directory (Azure AD / Entra ID)

A Construtora Ágil gerencia todas as identidades de funcionários e prestadores via Azure AD. Eles esperam que a plataforma valide o acesso à sala em relação aos seus grupos Azure AD existentes — não via links de convite ou aprovação manual. Especificamente:

- Funcionários internos pertencem ao grupo AD `pokerplan-voters`
- Prestadores externos pertencem a `pokerplan-observers`
- O dono da sala não deve precisar atribuir papéis manualmente — papéis devem ser derivados do grupo AD do usuário no momento de entrada

**Incógnita:** A plataforma atualmente não tem integração OAuth/OIDC com Azure AD. Não está claro se isso requer uma implementação SSO completa, uma validação leve de group-claim, ou uma sincronização via webhook. Necessita um spike técnico antes do escopo poder ser definido.

### 2. Integração Jira para Resolução de Identidade de Participantes

A Construtora Ágil usa o Jira como fonte de verdade para membros de squad por equipe. Eles relataram que no fluxo ideal, quando uma sala é criada para um sprint Jira específico, a plataforma deveria automaticamente puxar os participantes do sprint do Jira e pré-popular a lista de votantes aprovados da sala.

**Incógnita:** A plataforma atualmente não tem integração Jira. Uma conexão de leitura via API do Jira seria necessária. Não está claro se isso está dentro do escopo desta demanda ou é uma iniciativa de integração separada. PO precisa avaliar se este é um requisito obrigatório ou desejável para o deal fechar.

### 3. Requisito de Residência de Dados do Cliente

Durante a discussão de compliance, a equipe de TI da Construtora Ágil mencionou que dados de identidade de participantes (nomes, emails, memberships de grupo AD) devem ser armazenados no Brasil (conformidade LGPD). A infraestrutura atual da plataforma usa uma configuração de cloud multi-região — não se sabe se os registros de sessão de participantes estão armazenados em uma região brasileira ou não.

**Incógnita:** O CTO deve confirmar a postura atual de residência de dados do modelo de participante de sessão. Se os dados estão armazenados fora do Brasil, isso pode requerer mudanças de infraestrutura antes que a funcionalidade possa ser entregue a este cliente.

---

## Prioridade

**Nível:** Alta

**Motivo:** Bloqueador pré-fechamento do deal. Vendas fez um compromisso informal de prazo que precisa ser validado contra a capacidade antes de ser confirmado ao cliente.

> Nota de prioridade: apesar da urgência Alta, esta demanda não pode prosseguir para racionalização até que as três incógnitas de integração sejam resolvidas. O Discovery tem time-box de 2 semanas. Se as incógnitas não forem resolvidas nesse período, o PO escala ao CEO com avaliação de risco para o deal.

---

## Critérios de Sucesso

Indicadores de alto nível que definem como é "concluído e valioso" para esta demanda. Metas mensuráveis detalhadas pertencem ao Readiness Package — estes são os sinais no nível do intake.

| Critério | Tipo | Indicador |
|---|---|---|
| Contrato da Construtora Ágil fechado | Negócio | Contrato assinado em até 30 dias do release |
| Zero incidentes de acesso não autorizado | Segurança / Compliance | Sem casos reportados de participantes bloqueados ou removidos acessando dados da sessão |
| Conformidade LGPD confirmada | Legal | TI da Construtora Ágil confirma que o requisito de residência de dados está atendido antes do go-live |
| Mapeamento de papéis Azure AD funcionando end-to-end | Técnico | Funcionários e prestadores recebem papéis corretos na plataforma (Votante / Observador) automaticamente do grupo AD no momento de entrada |
| Pelo menos 1 deal adicional em pipeline desbloqueado | Negócio | Um dos 2 deals em pipeline sinalizados avança para fechamento em até 90 dias do release |
| Modo anônimo adotado em sessões enterprise | Produto | Usado em ≥ 30% das sessões de nível enterprise em até 60 dias do release |
| Vendas não fazendo mais compromissos informais de prazo | Processo | PO e Vendas alinham uma regra formal de gate de intake antes do próximo deal enterprise |

---

## Notas de Triagem do PO

Esta demanda está estrategicamente alinhada — a plataforma precisa amadurecer seu modelo de acesso para segmentos enterprise. No entanto, três incógnitas de integração surgiram durante o intake que impedem a racionalização de começar. A demanda não pode ser escopada até que estas sejam resolvidas.

**Caminho de decisão:** ~~Product Ready~~ → **Discovery**

**Escalada arquitetural ao CTO:** Sim — ampliada. Originalmente sinalizada para o modelo de dados de participantes. Agora também requer input do CTO em: (1) viabilidade OIDC Azure AD, (2) escopo de integração Jira API, (3) postura de residência de dados para conformidade LGPD.

**Time-box do Discovery:** 2 semanas (2024-03-18 → 2024-04-01)

**Sinalização de risco:** Vendas fez um compromisso informal de prazo ao cliente. Nenhuma data externa pode ser confirmada até que o Discovery conclua e o PM execute uma avaliação de capacidade.

---

## Discovery Brief

### O que está faltando

| # | Incógnita | Quem pode responder | Método |
|---|---|---|---|
| 1 | Integração Azure AD: SSO completo vs. validação de group-claim vs. sincronização via webhook | CTO | Spike técnico (2–3 dias máx.) |
| 2 | Integração Jira: requisito obrigatório ou desejável para fechar o deal | Construtora Ágil (via Vendas) | Chamada com cliente — Vendas deve agendar em 3 dias |
| 3 | Residência de dados: postura atual dos registros de sessão de participantes | CTO | Revisão de infraestrutura (1 dia) |

---

### Log do Discovery

#### 2024-03-18 — PO abre o Discovery

Demanda movida para Discovery. Três incógnitas registradas acima. PO notificou Vendas (Rafael Souza) para agendar chamada de acompanhamento com a equipe de TI da Construtora Ágil para esclarecer o requisito Jira. CTO (Rodrigo Lima) notificado para spike técnico sobre Azure AD e residência de dados.

---

#### 2024-03-20 — Spike Técnico do CTO: Azure AD

**Finding:** Integração Azure AD via OIDC é viável usando a camada de auth existente (que já suporta OAuth2). Uma implementação SSO completa não é necessária. A plataforma pode solicitar o claim `groups` no login e mapear grupos AD para papéis da plataforma no momento de entrada na sessão.

**Estimativa de esforço:** 4–6 dias (extensão do auth backend + lógica de mapeamento de papéis).

**Dependência:** A Construtora Ágil deve fornecer o ID do tenant Azure AD e registrar a plataforma como aplicação permitida no seu portal Azure. Esta é uma ação do lado do cliente — o prazo depende da equipe de TI deles.

**Recomendação do CTO:** Isto é viável e não requer nova infraestrutura. No entanto, introduz um novo fluxo de auth que afeta o modelo de participantes — a escalada arquitetural se mantém.

---

#### 2024-03-21 — Revisão de Infraestrutura do CTO: Residência de Dados

**Finding:** A plataforma atual usa um cluster de banco de dados primário em `us-east-1` (AWS). Registros de participantes de sessão — incluindo nomes, emails e metadados de sessão — estão armazenados neste cluster. Não há replicação para região do Brasil (sa-east-1) para estes dados.

**Implicação LGPD:** Dados de identidade de participantes de clientes brasileiros estão atualmente armazenados fora do Brasil. Entregar esta funcionalidade à Construtora Ágil sem tratar isso exporia a empresa a risco LGPD.

**Opções identificadas pelo CTO:**

| Opção | Descrição | Esforço | Risco |
|---|---|---|---|
| A | Migrar tabela de participantes para `sa-east-1` para todos os tenants | Alto (3–4 semanas) | Interrompe todos os clientes durante a migração |
| B | Implementar roteamento de residência de dados por tenant (dados de participantes armazenados na região declarada do tenant) | Muito Alto (6–8 semanas) | Mudança a nível de plataforma, nova complexidade |
| C | Armazenar dados de sessão de participantes em `sa-east-1` apenas para clientes que sinalizam requisito LGPD | Médio (2 semanas) | Adiciona lógica de roteamento condicional, mas escopado |

**Recomendação do CTO:** Opção C para este release. Opções A e B são decisões estratégicas de plataforma que requerem alinhamento com o CEO e não podem ser comprometidas para um único deal.

**Nota do PO:** A Opção C adiciona ~2 semanas de trabalho de infraestrutura a esta demanda. Isso deve ser considerado na avaliação de capacidade do PM e comunicado a Vendas antes de qualquer compromisso com o cliente.

---

#### 2024-03-22 — Chamada com o Cliente: Requisito de Integração Jira

**Participantes:** Rafael Souza (Vendas), Ana Costa (CS), TI Lead da Construtora Ágil (Fernanda Ramos)

**Finding:** A integração Jira **não é um requisito obrigatório** para o deal fechar. Fernanda confirmou que atribuir votantes e observadores manualmente via mapeamento de grupos Azure AD é aceitável para a Fase 1. Pré-população de sala baseada em Jira é um desejo futuro, não um bloqueador.

**Impacto no escopo:** Integração Jira é removida desta demanda. É registrada como item de backlog separado: `BACKLOG-2024-007 — Integração Jira Sprint para Pré-população de Sala`.

---

### Resultado do Discovery

**Todas as três incógnitas resolvidas.**

| # | Incógnita | Resolução | Impacto no escopo |
|---|---|---|---|
| 1 | Integração Azure AD | Viável via group-claim OIDC. 4–6 dias de esforço. Cliente deve registrar app no portal Azure. | Adicionado ao escopo |
| 2 | Integração Jira | Não obrigatório para fechar o deal. Movido para backlog. | Removido do escopo |
| 3 | Residência de dados (LGPD) | Opção C: flag LGPD por cliente com roteamento `sa-east-1`. ~2 semanas de esforço. | Adicionado ao escopo |

**Novo caminho de decisão:** Discovery → **Product Ready**

**Complexidade revisada da demanda:** Significativamente maior do que estimado originalmente. O Readiness Package deve ser atualizado para refletir o trabalho de integração Azure AD e residência de dados LGPD.

**Discovery encerrado:** 2024-03-25 (7 dias — dentro do time-box de 2 semanas ✓)
