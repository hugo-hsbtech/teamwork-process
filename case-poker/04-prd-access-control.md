# PRD — Room Access Control (Controle de Acesso à Sala)

> O PRD (Product Requirements Document) é a **fusão** do [Readiness Package](./02-readiness-package-access-control.md) (produto, autoria do PO) com o [Technical Assessment](./03-technical-assessment-access-control.md) (técnico, autoria do CTO). É o **único artefato que abre o downstream** — entregue ao **PM**. Cada metade mantém autoria clara: o PO não escreve a parte técnica, o CTO não reescreve o produto. O PRD costura, reconcilia e expõe ao PM o que ele precisa para planejar. Ver [`personas/02-po.md` §2, §10 e §11](../personas/02-po.md).
>
> `PRD = RP-2026-002 (PO) + TA-2026-002 (CTO)`
>
> **Jornada:** [`00 Documento do Submitter`](./00-submitter-brief-access-control.md) → [`01 Intake Record (PO — triagem)`](./01-intake-record-access-control.md) → [`02 Readiness Package (PO)`](./02-readiness-package-access-control.md) → [`03 Technical Assessment (CTO)`](./03-technical-assessment-access-control.md) → `04 PRD (PO+CTO → PM)`.

## Metadados

| Campo | Valor |
|---|---|
| **ID do PRD** | PRD-2026-002 |
| **Versão** | v1 |
| **RP vinculado** | RP-2026-002 v1 |
| **Technical Assessment vinculado** | TA-2026-002 v1 |
| **Intake vinculado** | INT-2026-002 |
| **Autores** | Lucas Mendes (PO) + Rodrigo Lima (CTO) |
| **Status** | Aceito |
| **Entregue ao PM em** | 2026-03-27 |

## Histórico de Revisão

| Versão | Data | Autor | Status | Resumo |
|---|---|---|---|---|
| v1 | 2026-03-27 | Lucas Mendes (PO) + Rodrigo Lima (CTO) | Aceito | Fusão inicial RP-2026-002 + TA-2026-002. PM aprovou na primeira revisão. Demanda avança para planejamento de execução. |

---

## Sign-off

> A fusão só fecha com dupla assinatura.

| Papel | Nome | Veredito | Data |
|---|---|---|---|
| **PO** (produto) | Lucas Mendes | RP congelado (freeze) — `freezeReady = true` | 2026-03-27 |
| **CTO** (técnico) | Rodrigo Lima | Viável com ressalvas | 2026-03-27 |

---

## Resumo Executivo Combinado

A plataforma PokerPlan atualmente não oferece controle de acesso dentro de salas de planejamento. Qualquer pessoa com o link entra, vê todos os participantes e vota. Este modelo é incompatível com o perfil de segurança de clientes enterprise que operam com equipes mistas (funcionários, prestadores externos, executivos) sob políticas internas de governança de dados que restringem visibilidade cruzada de identidades — caso específico da Construtora Ágil, que condiciona o fechamento do contrato de R$ 42.000 ARR a esta funcionalidade.

Este PRD define um **sistema de Controle de Acesso à Sala** que entrega ao dono da sala: (1) controle de quem pode entrar — modos Aberto, Somente convite ou Aprovação obrigatória; (2) anonimato de identidades via modo anônimo com filtragem server-side; e (3) papéis Votante / Observador gerenciáveis em tempo real. Todas as regras de acesso são aplicadas server-side, sem confiança no cliente para estado de acesso.

O CTO avaliou a viabilidade como **Viável com ressalvas**. A integração Azure AD OIDC (group-claim) é realizável via extensão da camada de auth existente. A conformidade LGPD é endereçada pela Opção C (roteamento condicional `sa-east-1` por tenant com flag). As duas ressalvas que o PM deve monitorar: (1) procurement de instância RDS em `sa-east-1` deve ser iniciado pelo CTO antes do desenvolvimento do roteamento LGPD; e (2) a integração Azure AD depende de ação do TI da Construtora Ágil (Fernanda Ramos) para registrar a plataforma no portal Azure — dependência externa fora do nosso controle, que impacta o prazo.

O esforço firme é de **25 dias** (conforme TA-2026-002), distribuídos entre backend sênior (auth, controle de acesso, Azure AD OIDC, roteamento LGPD) e frontend mid. A estimativa de esforço não inclui avaliação de capacidade do PM — o PM é responsável por mapear esses dias no calendário e confirmar o prazo antes de Vendas comunicar qualquer data ao cliente.

---

## Parte A — Definição de Produto (do Readiness Package · PO)

> Síntese das seções-chave do RP. O documento-fonte completo é [`RP-2026-002`](./02-readiness-package-access-control.md); aqui fica o que o PM precisa para planejar.

### A.1 Objetivos e Resultado Esperado

1. Permitir que o dono da sala defina o modo de acesso: Aberto (padrão), Somente convite ou Aprovação obrigatória — configurável por sala, sem impactar salas existentes.
2. Permitir que o dono da sala ative o modo anônimo, ocultando identidades dos participantes uns dos outros (o dono mantém visibilidade completa).
3. Permitir que o dono da sala atribua e altere papéis Votante / Observador a qualquer participante, antes ou durante a sessão.
4. Permitir que o dono da sala remova um participante da sessão ativa com efeito imediato.
5. Fechar o deal da Construtora Ágil com um modelo de controle de acesso em conformidade, no prazo confirmado pelo PM.

### A.2 Escopo (final)

**Incluído:**
- Seletor de modo de acesso por sala (Aberto / Somente convite / Aprovação obrigatória)
- Geração e revogação de links de convite individuais (tokens 128 bits, uso único)
- Fluxo de aprovação em tempo real com TTL de 5 min para solicitações sem resposta
- Modo anônimo: aliases server-side por sessão; dono sempre vê nomes reais; não desativável durante a sessão
- Atribuição de papel Votante / Observador (antes ou durante a sessão, com regras de proteção durante votação ativa)
- Remoção de participante com anulação de voto e bloqueio de re-entrada
- Aplicação server-side de todas as regras de acesso (sem confiança no cliente)
- Integração Azure AD OIDC group-claim para mapeamento automático de papéis na entrada
- Roteamento de residência de dados LGPD (Opção C): dados de participantes de tenants com flag em `sa-east-1`

**Excluído:**
- SSO / SAML enterprise, audit logs, integração Jira, guest access sem registro, proteção por senha, configurações padrão a nível de conta

**Adiado:**
- Convite em massa via CSV, atribuição automática de Observador por papel organizacional, exportação de compliance, configurações padrão a nível de organização

### A.3 Personas / Jobs-to-be-done

| Persona | Job | Impacto |
|---|---|---|
| **Dono da Sala (Scrum Master / Tech Lead)** | Realizar cerimônias com equipes mistas de forma controlada e conforme política interna | Novo: configura modo de acesso, gerencia convites/aprovações, atribui papéis, ativa anonimato |
| **Votante (Dev / Membro do Time)** | Estimar itens colaborativamente | Experiência inalterada; em modo anônimo, vê aliases dos colegas |
| **Observador (PM / Executivo)** | Acompanhar a cerimônia sem influenciar estimativas | Novo papel: visibilidade completa da sessão, sem controles de votação |
| **Usuário Não Convidado / Não Aprovado** | (tenta entrar) | Novo: tela de espera ou bloqueio em vez de entrada direta |

### A.4 Regras de Negócio e Fluxos

Regras detalhadas em [`RP-2026-002, Seção 6`](./02-readiness-package-access-control.md). Resumo para o PM:

- **Aberto:** sem mudança de comportamento (salas existentes preservadas).
- **Somente convite:** tokens de uso único, revogáveis antes do uso; usuário sem convite é bloqueado.
- **Aprovação obrigatória:** fila de solicitações com TTL de 5 min; dono aprova/nega em tempo real.
- **Modo anônimo:** ativado pelo dono; não desativável na sessão; filtragem server-side obrigatória.
- **Papéis:** Votante é default; Observador pode ser atribuído entre itens; promoção bloqueada durante votação ativa.
- **Remoção:** efeito imediato; votos do item atual anulados; re-entrada bloqueada na mesma sessão.

### A.5 User Stories + Critérios de Aceite

> Histórias completas com critérios Given/When/Then em [`RP-2026-002, Seção 7`](./02-readiness-package-access-control.md). Resumo para o PM:

| ID | História | Critério de aceite (resumo) |
|---|---|---|
| ST-001 | Como Dono da Sala, quero escolher o modo de acesso | Modo salvo imediatamente; novo modo bloqueia ou libera entradas conforme esperado; salas existentes em modo Aberto sem alteração |
| ST-002 | Como Dono da Sala, quero gerar e revogar convites | Token único de 128 bits gerado; token revogado fica inválido imediatamente; token é de uso único |
| ST-003 | Como participante, quero solicitar entrada em sala com aprovação | Tela de espera exibida; entrada confirmada em ≤ 2s após aprovação; mensagem de negação; expiração em 5 min |
| ST-004 | Como Dono da Sala, quero ativar modo anônimo | Aliases exibidos para não-donos; dono vê nomes reais; payload WebSocket sem nomes reais; não desativável na sessão |
| ST-005 | Como Dono da Sala, quero atribuir papéis Votante/Observador | Controles de votação desaparecem imediatamente ao rebaixar para Observador; votos do item atual anulados; promoção bloqueada durante votação ativa |
| ST-006 | Como Dono da Sala, quero remover um participante | Desconectado em ≤ 2s; voto anulado; re-entrada bloqueada na mesma sessão |

### A.6 Requisitos Não-Funcionais (NFRs)

> Completo em [`RP-2026-002, Seção 8`](./02-readiness-package-access-control.md). Dimensões principais:

| Dimensão | Requisito | Verificação |
|---|---|---|
| Performance | Eventos de aprovação, remoção e mudança de papel propagam em ≤ 2 segundos | Telemetria de latência WebSocket em testes de carga (20 participantes) |
| Segurança | Controle de acesso aplicado server-side em cada request e mensagem WebSocket; payload anônimo sem nomes reais | Testes de segurança: replay após remoção, inspeção de payload, acesso sem membership |
| Segurança | Tokens de convite 128 bits, uso único, expiram no fim da sessão | Revisão de código + teste de reutilização de token |
| Conformidade | Dados de participantes de tenants com flag LGPD apenas em `sa-east-1` | Verificação de residência de dados pelo CTO; confirmação por Fernanda Ramos antes do go-live |
| Manutenibilidade | Feature flag desligável sem redesenvolvimento; telemetria de produto adicionada antes do go-live | Verificação em staging + pipeline de dados |

### A.7 Edge Cases e Modos de Falha

- Dono desconecta com aprovações pendentes → TTL 5 min persiste no servidor; fila apresentada na reconexão.
- Dono não pode ser removido (nem por ele mesmo) → bloqueio server-side.
- Modo anônimo ativado com votação em andamento → aliases atribuídos imediatamente; histórico anterior não retroativamente ocultado (comportamento aceito).
- Bypass via API direta → membership validada em cada request; não há confiança no cliente para estado de acesso.
- Token de convite usado por terceiro → uso único invalida o token; convidado original recebe erro "Convite já utilizado."

---

## Parte B — Definição Técnica (do Technical Assessment · CTO)

> Síntese do TA. O documento-fonte completo é [`TA-2026-002`](./03-technical-assessment-access-control.md).

### B.1 Veredito de Viabilidade

| Campo | Valor |
|---|---|
| **Veredito** | Viável com ressalvas |
| **Ressalvas** | (1) Instância RDS `sa-east-1` pode precisar ser provisionada — procurement deve ser iniciado pelo CTO imediatamente; (2) integração Azure AD só é concluída após ação do TI da Construtora Ágil (Fernanda Ramos) — dependência externa que impacta prazo; (3) senioridade sênior nas áreas críticas de backend (auth, roteamento LGPD) é premissa da estimativa firme de 25 dias |

### B.2 Impacto Arquitetural e Integrações

> Detalhado em [`TA-2026-002`](./03-technical-assessment-access-control.md).

| Área / Sistema | Impacto | Nota |
|---|---|---|
| Modelo de dados de participantes | Significativo — novos campos + máquina de estado | Schema migration aditiva; campos nullable com defaults; sem migração de dados existentes |
| Camada WebSocket / eventos de sessão | Modificado — novos eventos + filtragem por destinatário (modo anônimo) | Filtragem obrigatoriamente server-side — cliente nunca recebe nome real em modo anônimo |
| Camada de autenticação | Modificado — extensão para OIDC group-claim (Azure AD) | Fluxo OAuth2 existente preservado; coexistência dos dois fluxos |
| Roteamento de residência de dados | Novo — DAL com roteamento condicional `us-east-1` / `sa-east-1` por flag de tenant | Lógica de roteamento encapsulada na DAL; reutilizável para requisitos futuros de compliance regional |
| Infraestrutura RDS `sa-east-1` | Possivelmente novo — confirmar estado atual | Procurement iniciado pelo CTO; sem bloqueio para desenvolvimento paralelo das demais partes |
| Azure AD (Entra ID) — externo | Integração via OIDC group-claim | Spec técnica de registro entregue ao TI do cliente cedo; dependência fora do nosso controle |

### B.3 Constraints Rígidas

| Constraint | Efeito no escopo |
|---|---|
| LGPD: dados de participantes de tenants com flag devem residir em `sa-east-1` | Adiciona ~2 semanas; não pode ser feito pós go-live; é pré-requisito para onboarding da Construtora Ágil |
| Integração Azure AD: group-claim OIDC apenas (sem SSO completo) | Limita complexidade; qualquer expansão para SSO requer nova demanda |
| Schema migration estritamente aditiva | Preserva compatibilidade retroativa; limita design de campos novos |
| Filtragem de payload anônimo: server-side obrigatória | Afeta design da camada de eventos WebSocket |
| Sem novos provedores de identidade externos | Confirma abordagem de extensão aditiva da camada de auth existente |

### B.4 ADRs (nível arquitetural)

> Justificativas completas em [`TA-2026-002`](./03-technical-assessment-access-control.md).

| # | Decisão | Sign-off CTO |
|---|---|---|
| ADR-001 | Integração Azure AD via OIDC group-claim, sem SSO completo | ✓ |
| ADR-002 | Conformidade LGPD via Opção C: roteamento condicional por flag de tenant (`sa-east-1`) | ✓ |
| ADR-003 | Filtragem de payload WebSocket em modo anônimo: server-side, por destinatário, no momento do envio | ✓ |
| ADR-004 | Schema migration estritamente aditiva para o modelo de participantes | ✓ |
| ADR-005 | Tokens de convite 128 bits criptograficamente aleatórios, uso único, expiram no primeiro uso ou fim da sessão | ✓ |
| ADR-006 | Roteamento de residência de dados implementado na DAL, não na camada de negócio | ✓ |

---

## Reconciliação de Escopo

> O Technical Assessment não vetou nenhum item do RP. As ressalvas do CTO adicionaram dois itens de escopo que não estavam no intake original (Azure AD OIDC e LGPD Opção C) — ambos foram incorporados durante o Discovery e estão no RP final.

| Item original (RP) | Mudança após Technical Assessment | Motivo |
|---|---|---|
| Controle de acesso (modos, anonimato, papéis, remoção) | Mantido integralmente | Sem veto técnico |
| Integração Azure AD (adicionado no Discovery) | Mantido — escopo confirmado como group-claim OIDC apenas | ADR-001: SSO completo fora do escopo; group-claim é suficiente |
| Roteamento LGPD `sa-east-1` (adicionado no Discovery) | Mantido — Opção C confirmada | ADR-002: opções A e B são decisões estratégicas de plataforma para outra rodada |
| Integração Jira (removida no Discovery) | Removida — `BACKLOG-2026-007` | Chamada com cliente: não obrigatório para fechar o deal |
| Procurement RDS `sa-east-1` | Nova ação adicionada | CTO deve verificar estado e iniciar procurement antes do desenvolvimento da Opção C |

**Escopo final reconciliado:** RP-2026-002 mantido integralmente. Sem itens vetados pelo CTO. Duas ações de preparação adicionadas pelo CTO: (1) entrega de spec técnica de registro Azure AD à Construtora Ágil; (2) verificação e eventual procurement de instância RDS em `sa-east-1`.

---

## Visão Consolidada de Riscos e Dependências

> Riscos de produto/negócio (do RP-2026-002, Seção 12) + riscos técnicos (do TA-2026-002) em uma tabela única — o PM planeja contra esta visão.

| Risco | Origem | Tipo | Probabilidade | Impacto | Mitigação |
|---|---|---|---|---|---|
| Registro Azure AD atrasado pelo TI da Construtora Ágil | RP + TA | Externo | Média | Alto | Spec técnica entregue ao cliente cedo; data de fechamento do registro como milestone externo no plano de execução |
| Instância RDS `sa-east-1` não provisionada na janela necessária | TA | Infraestrutura | Média | Alto | CTO verifica imediatamente; procurement iniciado antes do kick-off; desenvolvimento paralelo das outras partes preservado |
| Compromisso informal de prazo de Vendas conflita com capacidade real | RP | Operacional | Alta | Alto | PM executa avaliação de capacidade antes de qualquer comunicação externa; PO é dono do gate |
| Schema migration quebra sessões ativas | TA | Dados | Baixa | Alto | Migration aditiva; deploy em janela de baixo tráfego; rollback testado previamente |
| Bypass de controle de acesso via API direta | TA | Segurança | Baixa | Alto | Validação de membership em cada request; testes de segurança automáticos antes do go-live |
| Claim `groups` não disponível no tenant Azure AD do cliente | TA | Integração | Baixa | Alto | Spec técnica confirma requisito; Fernanda Ramos confirma existência dos grupos antes do desenvolvimento |
| Pressão de expansão de escopo (SSO, audit logs) | RP | Produto / Escopo | Média | Médio | Limite de escopo explícito no RP; qualquer adição requer nova demanda triada pelo PO |
| Tokens de convite em força bruta | TA | Segurança | Baixa | Alto | 128 bits; uso único; rate limiting no endpoint de entrada |
| Modo anônimo adotado abaixo de 30% em sessões enterprise | RP | Adoção | Baixa | Baixo | Acompanhar telemetria nos primeiros 60 dias; investigar com CS se abaixo da meta |
| Integração Jira escalada de desejo para obrigatório durante entrega | RP | Escopo | Baixa | Médio | Confirmado como backlog; qualquer escalada retriada pelo PO |

**Dependências externas conhecidas:**
- **Construtora Ágil (Fernanda Ramos — TI Lead):** registro da plataforma no portal Azure AD do tenant do cliente. Milestone externo crítico de prazo — o PM deve incluir no plano de execução com data-alvo e ponto de escalada se atrasado.
- **PM:** avaliação de capacidade antes de qualquer comunicação de prazo a Vendas ou ao cliente (inegociável — PO é dono deste gate).

---

## Esforço e Custo (firme)

> Do Technical Assessment TA-2026-002 (substitui o preliminar do RP). Somente uso interno — não é compromisso contratual nem material para cliente.

| Área | Estimativa firme | Senioridade |
|---|---|---|
| Backend — schema migration + máquina de estado | 6 dias | Senior |
| Backend — filtragem WebSocket (modo anônimo) | 3 dias | Senior |
| Backend — lógica de controle de acesso (convite, aprovação, remoção) | 5 dias | Mid-Senior |
| Backend — OIDC group-claim Azure AD | 5 dias | Senior |
| Backend — roteamento LGPD Opção C + DAL | 10 dias | Senior |
| Frontend — painel de configurações do dono | 4 dias | Mid |
| Frontend — UI do participante (aliases, Observador, aprovação) | 3 dias | Mid |
| QA (funcional + segurança + multi-tenant + LGPD) | 5 dias | QA |
| **Total firme** | **25 dias** | |

**Infra / Terceiros / Opex recorrente:** Possível nova instância RDS em `sa-east-1` (CTO verificando estado; procurement a iniciar se ausente). Custo mensal recorrente do endpoint `sa-east-1` a definir após revisão de infraestrutura com DevOps — deve ser considerado na precificação de tenants com flag LGPD. Sem novos provedores de terceiros.

---

## Prontidão Herdada e Dispositions em Aberto

> O que o PM precisa enxergar antes de planejar.

| Campo | Valor |
|---|---|
| **Premissas ainda a validar** | Equipe de TI da Construtora Ágil completa registro Azure AD dentro da janela de entrega (dono: Fernanda Ramos; milestone no plano do PM). Instância RDS `sa-east-1` disponível antes do desenvolvimento do roteamento LGPD (dono: CTO). |
| **Incógnitas de Discovery** | Todas resolvidas: Azure AD (viável via OIDC), Jira (removido), LGPD (Opção C adicionada ao escopo). |
| **Requisitos delegados (com dono)** | — |

> Se a Construtora Ágil atrasar o registro Azure AD, a funcionalidade de mapeamento de papéis via Azure AD não pode ser homologada com o cliente antes do go-live. O PM deve incluir este milestone como bloqueador de aceite para o cliente, não para o desenvolvimento interno.

---

## Critérios de Sucesso e Métricas (projetados)

> Baseline projetado que `metrics.md` confronta com o medido pós-rollout.

| Tipo | Métrica | Meta (projetada) | Janela | Confiança |
|---|---|---|---|---|
| **Primária** | Contrato da Construtora Ágil fechado | Contrato assinado | Até 30 dias do release | 85 |
| **Primária** | Adoção do modo anônimo em sessões enterprise | ≥ 30% das sessões enterprise | 60 dias pós-release | 65 |
| **Secundária** | Taxa de sucesso de entrada em modo Aprovação | ≥ 95% das solicitações válidas aprovadas em ≤ 2 min | 30 dias pós-release | 70 |
| **Secundária** | Deals adicionais em pipeline desbloqueados | ≥ 1 dos 2 deals sinalizados avança | 90 dias pós-release | 60 |
| **Guardrail** | Incidentes de acesso não autorizado | 0 incidentes reportados | Contínuo a partir do release | 90 |
| **Guardrail** | Latência de votação em salas abertas (não afetadas) | Sem degradação vs. baseline pré-release | 30 dias pós-release | 85 |

---

## Handoff ao PM — Gate de Aceite

> O PM tem **autoridade explícita para rejeitar** o PRD e devolvê-lo com gaps específicos. Ver [`interactions/07-po-to-pm.md`](../interactions/07-po-to-pm.md).

| Checklist de entrega | OK? |
|---|---|
| RP congelado (freeze) e referenciado | ☑ |
| Technical Assessment assinado (ou N/A justificado) | ☑ |
| Reconciliação de escopo registrada | ☑ |
| Riscos e dependências consolidados | ☑ |
| Dependências externas explícitas | ☑ |
| Dispositions em aberto visíveis | ☑ |

**Prioridade e contexto de negócio:** Alta — bloqueador pré-fechamento da Construtora Ágil (R$ 42.000 ARR) com deal condicionado à funcionalidade. Sinalização de requisito análogo em 2 deals enterprise adicionais em pipeline. Sem avaliação de capacidade do PM, nenhuma data pode ser confirmada a Vendas ou ao cliente. A dependência crítica de prazo externo (registro Azure AD pelo TI do cliente) deve ser tratada como milestone explícito no plano de execução.
