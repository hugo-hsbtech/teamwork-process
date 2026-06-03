# Technical Assessment — Room Access Control (Controle de Acesso à Sala)

> O Technical Assessment (TA) é o **output do CTO** — viabilidade, constraints, arquitetura, integrações, riscos técnicos, ADRs e custo firme. É escrito **sozinho** pelo CTO, **em paralelo** ao Readiness Package, e **responde** a ele: o CTO **nunca edita o RP**. O TA não redefine o produto — pode **vetar** a viabilidade do escopo, e nesse caso o PO revisa o escopo do RP.
>
> A fusão do RP (produto) com este TA (técnico) acontece no [PRD](./04-prd-access-control.md), e é o PRD que abre o downstream. Ver [`personas/02-po.md` §2 e §10](../personas/02-po.md) e [`interactions/05-po-to-cto.md`](../interactions/05-po-to-cto.md).
>
> **Jornada:** [`00 Documento do Submitter`](./00-submitter-brief-access-control.md) → [`01 Intake Record (PO — triagem)`](./01-intake-record-access-control.md) → [`02 Readiness Package (PO)`](./02-readiness-package-access-control.md) → `03 Technical Assessment (CTO)` → [`04 PRD (PO+CTO → PM)`](./04-prd-access-control.md).

## Metadados

| Campo | Valor |
|---|---|
| **ID do Assessment** | TA-2026-002 |
| **Versão** | v1 |
| **RP vinculado** | RP-2026-002 v1 |
| **Intake vinculado** | INT-2026-002 |
| **Responsável** | Rodrigo Lima (CTO) |
| **Status** | Assinado |
| **Veredito de viabilidade** | Viável com ressalvas |
| **Data de sign-off** | 2026-03-27 |

## Histórico de Revisão

| Versão | Data | Autor | Status | Resumo |
|---|---|---|---|---|
| v1 | 2026-03-20 a 2026-03-25 | Rodrigo Lima (CTO) | Assinado | Spikes técnicos de Azure AD (2026-03-20) e residência de dados LGPD (2026-03-21) executados durante o Discovery. Assessment formalizado e assinado em 2026-03-27 junto ao RP. |

---

## Veredito de Viabilidade

> A decisão de primeira classe do CTO.

| Campo | Valor |
|---|---|
| **Veredito** | Viável com ressalvas |
| **Justificativa** | O escopo de produto definido no RP-2026-002 é tecnicamente realizável com a stack atual. A integração Azure AD OIDC pode ser implementada via extensão da camada de auth existente, sem novo provedor de identidade. A conformidade LGPD pode ser atingida com a Opção C (roteamento condicional por cliente). As ressalvas são: (1) nova instância RDS em `sa-east-1` pode ser necessária e seu procurement precisa ser iniciado antes do desenvolvimento da Opção C; (2) a dependência de ação do cliente para registro Azure AD é externa e não está sob controle da plataforma. |
| **Ressalvas (se aplicável)** | (1) Procurement de instância RDS em `sa-east-1` deve ser iniciado pelo CTO antes do início do trabalho de roteamento LGPD. Se o ambiente não estiver disponível na janela certa, essa parte do escopo atrasa. (2) A integração Azure AD só pode ser completada após a Construtora Ágil registrar a plataforma no portal Azure AD deles — dependência externa fora do nosso controle. (3) O esforço firmado assume senioridade sênior nas áreas de backend crítico (auth, roteamento LGPD) — rebaixar senioridade nessas tarefas invalida a estimativa. |

---

## Perguntas do PO Endereçadas

> Incógnitas técnicas específicas escaladas pelo PO durante o Discovery — e a resposta de cada uma.

| # | Pergunta do PO | Resposta do CTO |
|---|---|---|
| 1 | Integração Azure AD requer SSO completo, validação de group-claim OIDC ou sincronização via webhook? | Validação de group-claim OIDC. A camada de auth existente (OAuth2) suporta extensão para OIDC sem reescrita. A plataforma solicita o claim `groups` no login e mapeia grupos AD para papéis da plataforma no momento de entrada. SSO completo e webhook não são necessários para este escopo. |
| 2 | A postura atual de residência de dados dos registros de sessão está em conformidade com LGPD para clientes brasileiros? | Não. O cluster primário está em `us-east-1`. Registros de participantes (nomes, emails, metadados de sessão) estão armazenados fora do Brasil. A Opção C — roteamento condicional com armazenamento em `sa-east-1` apenas para tenants com flag LGPD — é a abordagem recomendada para este release. Opções A e B (migração global) são decisões estratégicas de plataforma que requerem alinhamento com o CEO e não podem ser comprometidas para um único deal. |
| 3 | Integração Jira API está dentro do escopo técnico deste assessment? | Não — encerrado por chamada com o cliente em 2026-03-22. Fernanda Ramos confirmou que não é obrigatório. Registrado como `BACKLOG-2026-007`. |

---

## Sistemas e Componentes Afetados

| Sistema / Componente | Natureza do impacto |
|---|---|
| **Modelo de dados de participantes** | Modificado — novos campos (`role`, `access_mode`, `anonymous_alias`, `invite_token`), nova máquina de estado |
| **Camada de autenticação / auth backend** | Modificado — extensão para solicitar claim `groups` no fluxo OIDC + lógica de mapeamento grupo AD → papel de sala |
| **Camada WebSocket / eventos de sessão em tempo real** | Modificado — novos tipos de evento (`join_request`, `join_approved`, `join_denied`, `role_changed`, `participant_removed`); filtragem server-side de payload por destinatário em modo anônimo |
| **Camada de persistência de sessão** | Modificado — schema migration aditiva; novos campos nullable com defaults compatíveis com comportamento atual |
| **Roteamento de dados por região** | Novo — lógica de roteamento condicional `us-east-1` / `sa-east-1` baseada em flag LGPD do tenant |
| **Infraestrutura de banco de dados** | Possivelmente novo — instância RDS (ou read-write endpoint) em `sa-east-1` dependendo do estado atual de provisionamento |
| **Serviço de email transacional** | Somente consumido — sem modificação no provedor existente; novo template de convite por email |

---

## Impacto Arquitetural

> Território exclusivo do CTO. Conteúdo migrado e expandido do antigo RP (antigas Seções 7 e 8) para este artefato.

| Área | Impacto | Nota arquitetural |
|---|---|---|
| **Modelo de dados de participantes** | Significativo. O modelo atual de participante é um registro plano com escopo de sessão. Adicionar `role`, `access_mode`, `anonymous_alias` e `invite_token` requer schema migration e uma nova máquina de estado do participante. | A migração deve ser estritamente aditiva (novos campos nullable com defaults que reproduzem o comportamento atual). Sessões existentes com link aberto não devem ser afetadas. Sem migração de dados existentes — apenas novos campos opcionais. |
| **Multi-tenancy** | Médio. Aliases anônimos devem ter escopo de sessão, não de conta. Tokens de convite devem ser não-adivinháveis e escopados para a sala+sessão específica. | Geração de tokens: 128 bits criptograficamente aleatórios (ex.: `crypto.randomBytes(16).toString('hex')`). Tokens expiram no primeiro uso ou ao fim da sessão — o que ocorrer primeiro. Rate limiting no endpoint de entrada para mitigar força bruta. |
| **Membership em tempo real (WebSocket)** | Médio. A camada WebSocket atual transmite a lista de participantes a todos os membros. Com modo anônimo, o servidor deve filtrar o payload da lista de participantes por destinatário. | Filtragem server-side é obrigatória e inegociável. O cliente nunca deve receber o nome real de outro participante em payloads de modo anônimo. A filtragem deve ser aplicada no momento do envio, por conexão de destinatário — não no cliente. |
| **Segurança** | Alto. O modelo de controle de acesso deve ser aplicado server-side. Um participante negado, removido ou não convidado não deve conseguir acessar o estado da sessão via chamadas diretas de API ou WebSocket. | O servidor deve validar a membership da sala em **cada** mensagem WebSocket e **cada** requisição REST que toca o estado da sessão. Token de sessão válido não é suficiente — a membership da sala específica deve ser verificada. Sem confiança no cliente para estado de acesso. |
| **Performance / Escalabilidade** | Baixo. Notificações de aprovação e mudanças de papel são eventos de baixa frequência. Sem preocupações de escalabilidade nos volumes atuais de sessão. | Monitorar com 10× o pico atual se a adoção enterprise acelerar de forma significativa. A filtragem de payload WebSocket por destinatário adiciona CPU marginal no servidor de eventos — irrelevante nos volumes atuais. |
| **Observabilidade** | Adição obrigatória. Telemetria de produto deve ser adicionada: distribuição de modo de acesso por sala, taxa de aprovação/negação, proporção Observador/Votante, uso de modo anônimo por sessão enterprise, latência de eventos de aprovação. | Necessário para decisões de produto na Fase 2 e para monitoramento de segurança. Os eventos devem ser emitidos antes do go-live — não retro-ativados. |
| **Roteamento de residência de dados (LGPD)** | Alto. Novo padrão arquitetural: roteamento condicional de escrita/leitura por tenant baseado em flag LGPD. Para tenants com flag, dados de participantes são escritos e lidos de `sa-east-1`. Para os demais, comportamento atual (`us-east-1`) preservado. | Implementar via camada de abstração de acesso a dados (DAL) que resolve o endpoint de banco correto baseado no flag do tenant no contexto de request. Não vazar a lógica de roteamento para a camada de negócio. Uma vez que o padrão esteja estabelecido, torna-se reutilizável para qualquer requisito futuro de região de compliance. |

---

## Integrações Necessárias

> Agora com a lente de viabilidade técnica.

| Sistema | Tipo | Protocolo | Viabilidade / Riscos conhecidos |
|---|---|---|---|
| **Azure AD (Entra ID) da Construtora Ágil** | Externo | OIDC (OpenID Connect) — claim `groups` | Viável via extensão da camada de auth existente. A plataforma solicita claim `groups` no fluxo OIDC; grupos AD são mapeados para papéis de sala no momento de entrada. **Risco:** a integração só pode ser completada após a Construtora Ágil registrar a plataforma no portal Azure AD deles (ação do cliente, fora do nosso controle). Spec técnica de registro (redirect URIs, scopes necessários, tenant ID) deve ser entregue ao TI do cliente (Fernanda Ramos) o mais cedo possível. |
| **Camada WebSocket (interna)** | Interno | WebSocket / eventos de sessão | Infraestrutura existente se aplica. Novos tipos de evento a implementar: `join_request`, `join_approved`, `join_denied`, `role_changed`, `participant_removed`. Filtragem de payload por destinatário para modo anônimo é a adição mais sensível. |
| **Banco de dados — endpoint `sa-east-1`** | Infraestrutura | PostgreSQL (RDS) | Viável com provisionamento. Verificar se já existe instância em `sa-east-1` ou se procurement é necessário. Iniciar procurement imediatamente se ausente — não bloqueia o desenvolvimento paralelo das demais partes, mas bloqueia o merge do roteamento LGPD. |
| **Serviço de email transacional** | Interno/Externo | SMTP / API do provedor existente | Somente consumido — sem mudança no provedor. Novo template de convite por email a ser criado. |
| **Camada de autenticação existente** | Interno | OAuth2 / extensão OIDC | Modificado. A extensão para OIDC com claim `groups` é aditiva — o fluxo OAuth2 existente para usuários sem Azure AD não é alterado. Os dois fluxos coexistem. |

---

## Constraints Rígidas

> Condições não-negociáveis que limitam o espaço de solução.

| Constraint | Tipo | Detalhe | Efeito no escopo |
|---|---|---|---|
| LGPD: dados de participantes de clientes com flag em `sa-east-1` | Segurança / Compliance / Legal | Dados de identidade de participantes (nomes, emails, metadados de sessão) de tenants com flag LGPD devem ser escritos e lidos exclusivamente de `sa-east-1`. Inegociável para onboarding da Construtora Ágil. | Adiciona ~2 semanas de esforço (roteamento condicional + provisionamento de infraestrutura). Não pode ser feito após o go-live — é pré-requisito. |
| Provisionamento RDS `sa-east-1` necessário | Infraestrutura | Se a instância em `sa-east-1` não existir, deve ser provisionada antes do desenvolvimento do roteamento LGPD. Procurement leva tempo. | O CTO deve verificar o estado atual e iniciar procurement imediatamente se ausente. Não bloqueia desenvolvimento paralelo de outras partes. |
| Integração Azure AD: group-claim OIDC apenas (sem SSO completo) | Escopo / Externo | O escopo é restrito à validação de group-claim OIDC para mapeamento de papéis na entrada da sala. SSO/SAML completo e sincronização de usuários estão fora do escopo deste release. | Limita a complexidade da integração de auth. Qualquer pressão para expandir para SSO completo deve ser triada como nova demanda. |
| Migração de schema estritamente aditiva | Técnico | Novos campos no modelo de participantes devem ser nullable com defaults que reproduzem o comportamento atual. Sem DROP de colunas, sem mudanças de tipo. Sessões existentes não devem ser afetadas. | Preserva compatibilidade retroativa. Limita o design de alguns campos (ex.: `access_mode` não pode ser NOT NULL sem default). |
| Sem novos provedores de identidade externos | Orçamento / Escopo | Nenhum novo provedor (Okta, Auth0, Cognito, etc.) pode ser contratado. Apenas extensão da camada de auth existente. | Confirma a abordagem de extensão OIDC aditiva. |
| Filtragem de payload em modo anônimo: server-side obrigatória | Segurança | O cliente nunca deve receber o nome real de outro participante em payloads de modo anônimo. A filtragem é no servidor, no momento do envio, por destinatário. | Afeta o design da camada de eventos WebSocket — a filtragem deve ser centralizada no servidor de eventos, não delegada ao cliente. |

---

## Riscos Técnicos e Mitigações

> Riscos **técnicos** vivem aqui. Riscos de produto/negócio estão no RP-2026-002, Seção 12.

| Risco | Categoria | Probabilidade | Impacto | Mitigação |
|---|---|---|---|---|
| Migração do modelo de dados de participantes quebra sessões ativas | Dados | Baixa | Alto | Migração estritamente aditiva — novos campos nullable com defaults. Deploy em janela de baixo tráfego. Rollback testado antes do deploy de produção. Sessões existentes não afetadas por design. |
| Colisão de alias anônimo (dois participantes com o mesmo alias) | Técnico | Baixa | Médio | Atribuição de alias é determinística por índice ordinal de participante na sessão. Sem colisão possível dentro de uma sessão por construção. |
| Força bruta de token de convite | Segurança | Baixa | Alto | Tokens são 128 bits criptograficamente aleatórios. Expiram no primeiro uso. Rate limiting no endpoint de entrada da sala. Sem exposição de IDs sequenciais. |
| Dono da sala desconecta com aprovações pendentes em fila | Técnico | Média | Médio | Aprovações pendentes persistem no servidor com TTL de 5 min. Se o dono reconectar dentro do TTL, a fila é apresentada. Se não, solicitações expiram. Design stateful no servidor (não no cliente). |
| Instância RDS `sa-east-1` não provisionada na janela necessária | Infraestrutura | Média | Alto | Verificar imediatamente o estado do ambiente. Se não existir, iniciar procurement antes do kick-off do desenvolvimento. Desenvolvimento paralelo das demais partes pode ocorrer sem bloquear — mas o merge do roteamento LGPD fica bloqueado. |
| Claim `groups` não disponível no fluxo OIDC do tenant do cliente | Integração | Baixa | Alto | A spec técnica de registro (incluindo o scope `groups`) deve ser entregue ao TI da Construtora Ágil cedo. Fernanda Ramos deve confirmar que o tenant Azure AD expõe o claim `groups` e que os grupos `pokerplan-voters` e `pokerplan-observers` existem no tenant. Testar em ambiente de staging com tenant de teste antes do go-live. |
| Lógica de roteamento LGPD vaza para a camada de negócio | Arquitetural | Média | Médio | Implementar roteamento via DAL (Data Access Layer) com abstração de endpoint. A lógica de resolução de region/endpoint é interna à DAL — a camada de negócio não conhece nem decide a region. Code review obrigatório antes do merge. |
| Bypass de controle de acesso via chamada API direta | Segurança | Baixa | Alto | Validação de membership da sala em **cada** requisição (REST e WebSocket). Testes de segurança automáticos cobrindo: replay de mensagem após remoção, tentativa de entrada sem convite via API, acesso a payload de sessão sem membership válida. |

---

## Decisões de Arquitetura (ADRs)

> Direção arquitetural no nível do CTO. Breakdown fino e ADRs de implementação pertencem ao Tech Backlog (TB) do Tech Lead.

| # | Decisão | Justificativa | Sign-off do CTO |
|---|---|---|---|
| ADR-001 | Integração Azure AD via OIDC group-claim, sem SSO completo | A camada de auth existente (OAuth2) suporta extensão aditiva para OIDC. SSO completo requer mais esforço, infraestrutura de metadados e está fora do escopo declarado pelo cliente. Group-claim é suficiente para o requisito de mapeamento de papéis. | ✓ |
| ADR-002 | Conformidade LGPD via Opção C: roteamento condicional por flag de tenant, armazenamento em `sa-east-1` apenas para tenants com flag | Opção A (migração global) interrompe todos os clientes. Opção B (roteamento geral) é decisão estratégica de plataforma que requer alinhamento com o CEO. Opção C é escopada, entregável para este deal e reutilizável como padrão para futuros requisitos de compliance regional. | ✓ |
| ADR-003 | Filtragem de payload WebSocket em modo anônimo: server-side, por destinatário, no momento do envio | Segurança não pode depender do cliente para ocultar dados. Qualquer abordagem que envie o nome real ao cliente (mesmo que "oculto" via CSS/JS) é vetada. O servidor emite payloads diferentes para cada destinatário baseado no papel. | ✓ |
| ADR-004 | Schema migration estritamente aditiva para o modelo de participantes | Preserva compatibilidade retroativa sem interromper sessões existentes. Campos novos são nullable com defaults que reproduzem o comportamento atual. Elimina o risco de migração de dados existentes. | ✓ |
| ADR-005 | Tokens de convite: 128 bits criptograficamente aleatórios, uso único, expiram no primeiro uso ou fim da sessão | Previne força bruta (espaço de 2^128), replay (uso único) e tokens órfãos (expiração por sessão). Não usa IDs sequenciais nem derivados de dados da sala. | ✓ |
| ADR-006 | Roteamento de residência de dados implementado na DAL (Data Access Layer), não na camada de negócio | A lógica de resolução de endpoint/region é interna à DAL. A camada de negócio passa apenas o contexto do tenant; a DAL resolve o endpoint correto. Mantém separação de preocupações e torna o padrão reutilizável sem acoplamento. | ✓ |

---

## Avaliação de Esforço e Custo (firme)

> Somente uso interno. Estas são as estimativas **firmes** do CTO — substituem a estimativa preliminar do PO (RP Seção 13). Serão refinadas pelo Tech Lead no Tech Backlog. Não são compromisso contratual nem material para cliente.

### Esforço de Desenvolvimento

| Área | Estimativa | Senioridade |
|---|---|---|
| Backend — schema migration + máquina de estado do participante | 6 dias | Senior |
| Backend — filtragem server-side de eventos WebSocket (modo anônimo) | 3 dias | Senior |
| Backend — lógica de controle de acesso (convite, aprovação, remoção, validação por request) | 5 dias | Mid-Senior |
| Backend — extensão de auth para OIDC group-claim (Azure AD) | 5 dias | Senior |
| Backend — roteamento de residência de dados LGPD (Opção C, `sa-east-1`) + DAL | 10 dias | Senior |
| Frontend — painel de configurações de acesso do dono da sala | 4 dias | Mid |
| Frontend — UI do participante (aliases anônimos, view do Observador, tela de aprovação/espera) | 3 dias | Mid |
| QA — funcional + segurança + multi-tenant + validação LGPD | 5 dias | QA |
| **Total firme** | **25 dias** | |

> **Nota sobre discrepância em relação ao intake original:** a estimativa original no nível do intake (antes do Discovery) era de 25 dias para o core da funcionalidade, sem considerar Azure AD nem LGPD. O número firme do CTO coincide numericamente (25 dias), mas com composição diferente: o core de acesso foi ajustado para baixo (maior precisão após Discovery), enquanto o trabalho de Azure AD (5 dias) e LGPD Opção C (10 dias) foram adicionados. A estimativa preliminar do PO era ~29 dias. A diferença reflete a granularidade técnica aplicada pelo CTO na separação das áreas.

### Impacto de Infraestrutura

Sem novos serviços de aplicação. Schema migration no cluster existente (`us-east-1`). O roteamento condicional `sa-east-1` requer um write endpoint ou instância RDS na região do Brasil:

- **Se já provisionada:** sem impacto de procurement. Configurar endpoint na DAL.
- **Se não provisionada:** iniciar procurement imediatamente. Instância RDS `db.t3.medium` estimada para a carga inicial — verificar com DevOps o tier correto. O desenvolvimento das demais partes pode ocorrer em paralelo, mas o merge e os testes do roteamento LGPD ficam bloqueados até o ambiente estar disponível.

### Impacto de Custo com Terceiros

Nenhum além dos serviços existentes. A integração Azure AD é do lado do cliente (sem custo para a plataforma). O provedor de email transacional já está contratado — apenas novo template.

### Impacto de Custo Operacional Recorrente

Baixo a médio. O endpoint de banco de dados em `sa-east-1` adiciona custo de infraestrutura recorrente (estimado: a definir pela revisão de infraestrutura com DevOps). Este custo deve ser considerado na precificação de tenants com flag LGPD no planejamento comercial futuro — o padrão de roteamento, uma vez estabelecido, se torna base para todos os requisitos futuros de compliance regional.

### Avaliação de TCO

Esta funcionalidade adiciona complexidade significativa e duradoura ao modelo de participantes (máquina de estado) e à camada de infraestrutura (roteamento multi-região). Funcionalidades futuras que tocam membership de sessão (SSO/SAML, audit logs, guest access com tokens) e residência de dados multi-região construirão sobre esta base — o investimento aqui reduz o custo marginal dessas fases. O padrão de roteamento LGPD via DAL, uma vez estabelecido, torna-se reutilizável para qualquer requisito futuro de compliance regional sem acoplamento com a lógica de negócio.

---

## Caminho de Discovery (se incógnita técnica bloqueia)

> Não aplicável — todas as incógnitas técnicas foram resolvidas durante o Discovery (2026-03-18 a 2026-03-25). Os spikes técnicos estão documentados no log do Discovery do Intake Record ([`01-intake-record-access-control.md`](./01-intake-record-access-control.md)).

| Incógnita | Spike / Investigação | Quem | Resultado |
|---|---|---|---|
| Integração Azure AD: SSO vs. OIDC group-claim vs. webhook | Spike técnico de 1 dia | Rodrigo Lima (CTO) | Resolvido: OIDC group-claim viável (ADR-001) |
| Postura de residência de dados LGPD | Revisão de infraestrutura de 1 dia | Rodrigo Lima (CTO) | Resolvido: Opção C recomendada e adotada (ADR-002) |
| Integração Jira: obrigatória ou desejável | Chamada com o cliente | Vendas + Construtora Ágil | Resolvido: não obrigatório, movido para backlog |
