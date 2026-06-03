# Readiness Package — Room Access Control (Controle de Acesso à Sala)

> O Readiness Package (RP) é a **definição de pronto de produto** — o output de produto do PO, escrito **sozinho**. Ele é um documento completo e auto-suficiente: visão, problema, escopo, regras, user stories, NFRs, edge cases, critérios e métricas. **O RP não contém seções de autoria do CTO.** A avaliação técnica vive em um artefato separado — o [Technical Assessment](./03-technical-assessment-access-control.md) (CTO) — que o RP apenas **referencia** (ver "Referência ao Technical Assessment"). A fusão dos dois acontece no [PRD](./04-prd-access-control.md), e é o PRD — não o RP — que abre o downstream. Ver [`personas/02-po.md` §2 e §6.2](../../../personas/02-po.md).
>
> O RP **herda a camada de confiança** do Intake Record vinculado ([`01-intake-record-access-control.md`](./01-intake-record-access-control.md)): o que entrou como premissa, incógnita de Discovery ou resposta delegada não desaparece na racionalização — é resolvido, ou carregado adiante explicitamente.
>
> **Jornada:** [`00 Documento do Submitter`](./00-submitter-brief-access-control.md) → [`01 Intake Record (PO — triagem)`](./01-intake-record-access-control.md) → `02 Readiness Package (PO)` → [`03 Technical Assessment (CTO)`](./03-technical-assessment-access-control.md) → [`04 PRD (PO+CTO → PM)`](./04-prd-access-control.md).

## Metadados

| Campo | Valor |
|---|---|
| **ID do Pacote** | RP-2026-002 |
| **Versão** | v1 |
| **Intake vinculado** | INT-2026-002 |
| **Responsável** | Lucas Mendes (PO) |
| **Escalada ao CTO** | Sim — Technical Assessment TA-2026-002 |
| **Status** | Congelado (freeze) |
| **Data de congelamento (freeze)** | 2026-03-27 |

## Histórico de Revisão

| Versão | Data | Autor | Status | Resumo |
|---|---|---|---|---|
| v1 | 2026-03-27 | Lucas Mendes (PO) | Congelado | Submissão inicial. Inclui findings completos do Discovery (Azure AD OIDC, LGPD Opção C). Technical Assessment TA-2026-002 assinado pelo CTO. |

---

## Prontidão herdada e dispositions em aberto

> Resumo do que o Intake entregou e do que continua *soft* na entrada da execução.

| Campo | Valor |
|---|---|
| **Readiness Score no handoff do Intake** | 84 % |
| **Premissas ainda a validar** | (1) Equipe de TI da Construtora Ágil completa registro Azure AD dentro da janela de entrega — dono: Fernanda Ramos, acompanhar no início do projeto; (2) A integração Azure AD não exige reescrita da camada de auth — confirmado pelo CTO no Discovery ✓ |
| **Incógnitas de Discovery** | Todas resolvidas: Azure AD via OIDC (viável), Jira (removido do escopo), LGPD Opção C (adicionado ao escopo) |
| **Requisitos delegados (com dono)** | — |

> A premissa sobre o registro Azure AD pelo cliente permanece como o principal risco externo de prazo. Se o TI da Construtora Ágil atrasar, o prazo de entrega escorrega sem possibilidade de mitigação técnica interna.

---

## Seção 1 — Resumo Executivo  ·  *(bloqueia freeze)*

A plataforma atualmente não oferece controle de acesso dentro de uma sala de planejamento. Qualquer pessoa com o link da sala entra, vê os nomes de todos os participantes e pode votar. Esse modelo é insuficiente para clientes enterprise que operam com equipes mistas — internos, prestadores externos e gestores — sob políticas de governança de dados que restringem visibilidade cruzada de identidades.

Este Readiness Package define um sistema de **Controle de Acesso à Sala** que permite ao dono da sala: (1) controlar quem pode entrar (acesso aberto, somente convite, ou aprovação obrigatória); (2) controlar a visibilidade dos participantes via modo anônimo; e (3) atribuir e gerenciar papéis Votante/Observador em tempo real. Todas as regras de acesso são aplicadas server-side — sem confiança no cliente para estado de acesso.

Esta funcionalidade é o bloqueador pré-fechamento para a Construtora Ágil (R$ 42.000 ARR) e foi sinalizada como requisito por outros 2 deals enterprise em pipeline no Q1. O Discovery de 7 dias (2026-03-18 a 2026-03-25) resolveu as três incógnitas de integração: integração Azure AD OIDC (viável), requisito Jira (removido do escopo) e residência de dados LGPD (Opção C — roteamento `sa-east-1` para clientes com flag LGPD). O conteúdo técnico (modelo de dados, multi-tenancy, Azure AD, LGPD, esforço e custo firme) vive no Technical Assessment TA-2026-002 e é referenciado via `TechAssessmentRef` ao final deste documento.

---

## Seção 2 — Contexto e Problema (a dor, não a solução)  ·  *(bloqueia freeze)*

### Cenário Atual

O acesso à sala é inteiramente baseado em link: quem tem a URL entra imediatamente. Uma vez dentro, todos os participantes são visíveis uns para os outros por nome ou usuário. Não há distinção entre votantes e observadores. O dono da sala não tem controle sobre quem entra nem sobre o que os outros podem ver.

### Limitações

- Sem portão de acesso: qualquer pessoa com o link entra sem aprovação.
- Sem anonimato: identidades dos participantes são totalmente visíveis a todos.
- Sem diferenciação de papéis: todos que entram são votantes por padrão.
- Sem mecanismo para remover ou restringir um participante durante a sessão.

### Dor do Cliente

Os Scrum Masters da Construtora Ágil realizam cerimônias que incluem prestadores externos. A política interna de governança de dados da empresa proíbe visibilidade de identidade entre prestadores e funcionários em sessões de planejamento. Adicionalmente, gerentes de produto e executivos querem participar como observadores sem poder votar nem influenciar estimativas. O resultado é que a empresa não consegue usar a plataforma para suas cerimônias reais — apenas para equipes puramente internas, que são minoritárias no seu modelo operacional.

### Impacto de Negócio

- Bloqueador de deal: R$ 42.000 ARR condicionado a esta funcionalidade. Contrato não fecha sem ela.
- Sinal de pipeline: 2 deals enterprise adicionais com o mesmo requisito identificados em Q1.
- Compliance: a Construtora Ágil não pode fazer onboarding sem confirmação de conformidade LGPD. Sign-off da TI Lead (Fernanda Ramos) é gate de go-live.

---

## Seção 3 — Objetivos e Resultado Esperado  ·  *(bloqueia freeze)*

1. Permitir que o dono da sala defina o modo de acesso: Aberto (comportamento atual), Somente convite ou Aprovação obrigatória — configurável por sala.
2. Permitir que o dono da sala ative o modo anônimo, ocultando as identidades dos participantes uns dos outros (o dono mantém visibilidade completa de nomes reais).
3. Permitir que o dono da sala atribua papéis de Votante ou Observador a qualquer participante, antes ou durante uma sessão.
4. Permitir que o dono da sala remova um participante de uma sessão ativa com efeito imediato.
5. Fechar o deal da Construtora Ágil entregando um modelo de controle de acesso em conformidade com os requisitos declarados no prazo viabilizado pelo PM.

---

## Seção 4 — Personas Impactadas / Jobs-to-be-done  ·  *(bloqueia freeze)*

| Persona | Job-to-be-done | Impacto |
|---|---|---|
| **Dono da Sala (Scrum Master / Tech Lead)** | Realizar cerimônias de planejamento com equipes mistas de forma controlada e em conformidade com políticas internas | Novo: configura modo de acesso, gerencia convites/aprovações, atribui papéis, ativa modo anônimo |
| **Votante (Desenvolvedor / Membro do Time)** | Estimar itens do backlog colaborativamente | Experiência de votação inalterada. Em modo anônimo, vê aliases dos colegas em vez de nomes reais. |
| **Observador (Product Manager / Executivo)** | Acompanhar a cerimônia e obter visibilidade sobre as estimativas sem interferir no processo | Novo papel: entra na sala, vê tudo em tempo real (itens, votos revelados), não tem controles de votação |
| **Usuário Não Convidado / Não Aprovado** | (tenta entrar na sala) | Novo: vê tela de espera ou bloqueio em vez de entrar diretamente |

---

## Seção 5 — Escopo Incluído e Excluído  ·  *(bloqueia freeze)*

> Protege o downstream de scope creep.

### Incluído

- Configurações da sala: seletor de modo de acesso (Aberto / Somente convite / Aprovação obrigatória)
- Modo Somente convite: dono da sala gera links de convite ou envia convites por email; usuários não convidados são bloqueados
- Modo Aprovação obrigatória: usuário com URL solicita entrada; dono aprova ou nega em tempo real; solicitação expira em 5 min sem resposta
- Modo anônimo: nomes de participantes substituídos por aliases randomizados para participantes não-dono; dono vê nomes reais
- Atribuição de papel: dono da sala atribui Votante ou Observador por participante antes ou durante a sessão
- Experiência do Observador: vê a sessão em tempo real, sem controles de votação
- Remoção de participante: dono pode remover qualquer participante a qualquer momento; votos do item atual são anulados; participante removido não pode re-entrar na mesma sessão pelo mesmo link
- Configurações de acesso são por sala (não padrão a nível de conta neste release)

### Excluído

- Configurações padrão de acesso a nível de conta (fase futura)
- Integração SSO / SAML enterprise (item separado no roadmap)
- Audit log de quem entrou, quando e o que votou (fase futura de compliance)
- Guest access sem registro de conta
- Proteção de sala com senha
- Integração Jira para pré-população de participantes (`BACKLOG-2026-007`)

### Adiado (fases futuras)

- Convite em massa via CSV ou roster de equipe
- Atribuição automática de Observador por papel organizacional
- Exportação de compliance para governança
- Configurações padrão de acesso a nível de organização — alimenta Fase 2

---

## Seção 6 — Regras de Negócio e Fluxos  ·  *(bloqueia freeze)*

### Regras de Modo de Acesso

**Aberto (padrão)**
- Comportamento inalterado em relação ao atual. Salas existentes com link aberto não são afetadas pela entrega desta funcionalidade.

**Somente convite**
1. Dono da sala gera links de convite individuais ou envia convites por email pelo painel de configurações da sala.
2. Apenas usuários que receberam um convite válido podem entrar.
3. Usuário sem convite que tenta entrar via URL da sala vê: "Esta sala requer um convite."
4. O dono da sala pode revogar um convite antes que seja usado.
5. Tokens de convite são criptograficamente seguros (128 bits), de uso único e expiram ao fim da sessão.

**Aprovação obrigatória**
1. Qualquer usuário com a URL da sala pode solicitar entrada.
2. O dono recebe notificação em tempo real: "Usuário X está solicitando entrada."
3. Dono aprova ou nega. Aprovados entram imediatamente. Negados veem: "Sua solicitação não foi aprovada."
4. Se o dono não responder em 5 minutos, a solicitação expira: "Solicitação expirada. Entre em contato com o dono da sala."

### Regras do Modo Anônimo

1. O modo anônimo pode ser ativado pelo dono a qualquer momento antes dos votos serem revelados.
2. Quando ativo: nomes de todos os participantes são substituídos por aliases para participantes não-dono. A ordem dos aliases é randomizada por sessão.
3. O dono da sala **sempre** vê os nomes reais, independentemente do modo anônimo.
4. Os aliases são consistentes dentro de uma sessão — "Participante C" é a mesma pessoa durante toda a sessão.
5. O modo anônimo **não pode ser desativado** durante a sessão uma vez ativado, para prevenir tentativas de desmascaramento.
6. A filtragem de identidade é feita server-side: o cliente nunca recebe o nome real de outro participante em payloads de modo anônimo.

### Regras de Atribuição de Papéis

1. Papel padrão para qualquer participante que entrou: Votante.
2. O dono da sala pode alterar o papel de um participante para Observador antes da sessão começar ou entre itens de votação.
3. Observadores veem a sessão completa (itens, votos após revelação), mas não têm controles de votação.
4. Um Votante rebaixado para Observador durante a sessão tem seus votos do item atual anulados.
5. Um Observador não pode ser promovido para Votante após o início da votação para o item atual.

### Regras de Remoção de Participante

1. O dono da sala pode remover qualquer participante a qualquer momento durante a sessão.
2. Participante removido recebe: "Você foi removido desta sessão."
3. Quaisquer votos submetidos pelo participante removido no item atual são anulados.
4. Participantes removidos não podem re-entrar pelo mesmo link na mesma sessão.

### Fluxo de Transição de Estado — Aprovação de Entrada

```text
Usuário solicita entrada (modo Aprovação obrigatória)
    ↓
Servidor persiste solicitação pendente (TTL: 5 min)
    ↓
Dono da sala recebe notificação em tempo real (WebSocket)
    ↓
    ├── Aprovado  → Usuário entra na sessão com papel Votante (padrão)
    ├── Negado    → Usuário vê mensagem de negação; solicitação encerrada
    └── Sem resposta em 5 min → Solicitação expira; usuário vê mensagem de expiração
```

### Fluxo de Remoção de Participante

```text
Dono aciona remoção de participante X
    ↓
Servidor invalida a membership de sessão de X imediatamente
    ↓
Votos pendentes de X no item atual são anulados
    ↓
Participante X recebe notificação e é desconectado
    ↓
Tentativas futuras de re-entrada pelo mesmo link são bloqueadas server-side
```

---

## Seção 7 — User Stories + Critérios de Aceite  ·  *(bloqueia freeze)*

### ST-001 — Configurar Modo de Acesso da Sala

**Como** Scrum Master (dono da sala),
**quero** escolher o modo de acesso da sala antes da sessão começar,
**para que** eu possa controlar quem pode entrar de acordo com o perfil da cerimônia.

**Critérios de Aceite:**

- [ ] **Dado** que estou na tela de configurações da sala, **quando** seleciono "Somente convite", **então** o modo é salvo e novas tentativas de entrada sem convite são bloqueadas imediatamente.
- [ ] **Dado** que estou na tela de configurações da sala, **quando** seleciono "Aprovação obrigatória", **então** o modo é salvo e novas tentativas de entrada disparam uma solicitação de aprovação para mim.
- [ ] **Dado** que uma sala está em modo "Somente convite" ou "Aprovação obrigatória", **quando** o altero para "Aberto", **então** as restrições são removidas e o acesso por link volta a funcionar sem bloqueio.
- [ ] **Dado** que uma sala foi criada antes desta funcionalidade, **quando** ela é acessada, **então** seu modo de acesso é "Aberto" por padrão, sem quebrar o comportamento atual.

---

### ST-002 — Gerar e Revogar Convite

**Como** Scrum Master (dono da sala em modo Somente convite),
**quero** gerar links de convite individuais e poder revogá-los,
**para que** eu controle precisamente quem tem acesso.

**Critérios de Aceite:**

- [ ] **Dado** que a sala está em modo Somente convite, **quando** gero um convite, **então** recebo um link único e não-adivinhávelcom validade até o fim da sessão.
- [ ] **Dado** um convite gerado, **quando** revogo esse convite antes de ele ser usado, **então** o link fica inválido e quem tentar usá-lo vê "Este convite não é mais válido."
- [ ] **Dado** um convite utilizado (entrada confirmada), **quando** o participante entra, **então** o token é invalidado e não pode ser reutilizado por outro usuário.

---

### ST-003 — Solicitar Entrada com Aprovação Obrigatória

**Como** participante (convidado sem convite explícito),
**quero** solicitar entrada em uma sala com aprovação obrigatória,
**para que** o dono da sala possa me autorizar a participar.

**Critérios de Aceite:**

- [ ] **Dado** que a sala está em modo Aprovação obrigatória, **quando** acesso a URL da sala sem convite, **então** vejo uma tela de espera com mensagem "Aguardando aprovação do dono da sala."
- [ ] **Dado** uma solicitação pendente, **quando** o dono da sala aprova, **então** entro na sessão com papel Votante em menos de 2 segundos.
- [ ] **Dado** uma solicitação pendente, **quando** o dono da sala nega, **então** vejo "Sua solicitação não foi aprovada."
- [ ] **Dado** uma solicitação pendente sem resposta por 5 minutos, **quando** o TTL expira, **então** vejo "Solicitação expirada. Entre em contato com o dono da sala."

---

### ST-004 — Ativar Modo Anônimo

**Como** Scrum Master (dono da sala),
**quero** ativar o modo anônimo antes da revelação dos votos,
**para que** os participantes não saibam quem votou o quê e a política de privacidade do cliente seja atendida.

**Critérios de Aceite:**

- [ ] **Dado** que ativo o modo anônimo, **quando** qualquer participante não-dono visualiza a lista de participantes, **então** vê apenas aliases ("Participante A", "Participante B", etc.) — nunca nomes reais.
- [ ] **Dado** que o modo anônimo está ativo, **quando** visualizo a lista como dono da sala, **então** vejo os nomes reais de todos os participantes.
- [ ] **Dado** que o modo anônimo está ativo, **quando** inspeciono o payload WebSocket recebido pelo cliente de um participante não-dono, **então** o payload contém apenas aliases — nenhum nome real está presente na resposta.
- [ ] **Dado** que o modo anônimo foi ativado, **quando** tento desativá-lo durante a mesma sessão, **então** a ação é bloqueada com mensagem "O modo anônimo não pode ser desativado após a sessão iniciar."
- [ ] **Dado** que o modo anônimo está ativo, **quando** o mesmo participante é observado em momentos diferentes da sessão, **então** seu alias permanece o mesmo durante toda a sessão.

---

### ST-005 — Atribuir Papel Votante / Observador

**Como** Scrum Master (dono da sala),
**quero** atribuir ou alterar o papel de participantes entre Votante e Observador,
**para que** gerentes de produto e executivos possam acompanhar sem influenciar as estimativas.

**Critérios de Aceite:**

- [ ] **Dado** que um participante está com papel Votante, **quando** o altero para Observador entre itens de votação, **então** os controles de votação desaparecem da interface dele imediatamente.
- [ ] **Dado** que estou no meio de uma votação e rebaixo um Votante para Observador, **quando** a alteração é aplicada, **então** os votos já submetidos por ele no item atual são anulados e ele não aparece nos resultados do item.
- [ ] **Dado** que um participante está com papel Observador após o início da votação de um item, **quando** tento promovê-lo para Votante, **então** a ação é bloqueada com mensagem "Não é possível promover para Votante durante a votação de um item."
- [ ] **Dado** que sou Observador, **quando** a sessão está ativa, **então** vejo todos os itens, votos revelados e o painel da sessão, mas minha interface não tem controles de votação.

---

### ST-006 — Remover Participante da Sessão

**Como** Scrum Master (dono da sala),
**quero** remover um participante da sessão ativa,
**para que** eu possa lidar com entradas indevidas ou problemas de comportamento durante a cerimônia.

**Critérios de Aceite:**

- [ ] **Dado** que aciono a remoção de um participante, **quando** a ação é confirmada, **então** ele é desconectado em menos de 2 segundos e vê "Você foi removido desta sessão."
- [ ] **Dado** que o participante removido era Votante com voto submetido no item atual, **quando** a remoção ocorre, **então** o voto é anulado nos resultados do item atual.
- [ ] **Dado** que um participante foi removido, **quando** ele tenta re-entrar pela mesma URL na mesma sessão, **então** vê "Você não tem permissão para entrar nesta sessão."

---

## Seção 8 — Requisitos Não-Funcionais (NFRs)  ·  *(bloqueia freeze)*

> O PO descreve o **requisito de qualidade**; a viabilidade e o *como* são do Technical Assessment.

| Dimensão | Requisito | Como será verificado |
|---|---|---|
| **Performance / Eficiência** | Notificação de solicitação de entrada, aprovação/negação e remoção de participante propagam em ≤ 2 segundos para todos os clientes conectados na sala | Medição via telemetria de latência de eventos WebSocket em testes de carga com sessões de 20 participantes |
| **Confiabilidade** | Solicitações de aprovação pendentes persistem no servidor por 5 minutos mesmo se o dono reconectar durante esse período | Teste de reconexão: desconectar e reconectar o dono durante aprovação pendente e verificar que a fila é apresentada na reconexão |
| **Segurança** | Modelo de acesso (modo de acesso, papel, remoção) é aplicado server-side. O cliente nunca recebe nomes reais em payloads de modo anônimo. Participantes removidos não acessam estado da sessão via chamadas diretas de API ou WebSocket. | Testes de segurança: replay de mensagens WebSocket após remoção deve ser rejeitado com erro de autorização; inspeção de payloads em modo anônimo não deve conter nomes reais |
| **Segurança** | Tokens de convite são de 128 bits criptograficamente aleatórios, de uso único, expiram ao fim da sessão. | Revisão de código + teste de tentativa de reutilização de token após primeiro uso |
| **Usabilidade** | Dono da sala consegue configurar o modo de acesso, ativar modo anônimo e atribuir papéis sem treinamento ou consulta à documentação | Teste de usabilidade com um Scrum Master da Construtora Ágil antes do go-live |
| **Compatibilidade** | A funcionalidade opera nos mesmos navegadores e dispositivos suportados pela plataforma atual | Smoke test nos ambientes de suporte atuais (Chrome, Firefox, Safari, Edge — última versão estável) |
| **Manutenibilidade** | Controle de acesso é opt-in por sala via feature flag desligável sem redesenvolvimento | Verificação em staging com flag desligada: comportamento de sala aberta preservado; com flag ligada: novo comportamento ativo |
| **Manutenibilidade** | Telemetria de produto adicionada: distribuição de modo de acesso, taxa de aprovação/negação, proporção Observador/Votante, uso de modo anônimo por sessão enterprise | Verificar presença dos eventos no pipeline de dados antes do go-live |
| **Conformidade** | Dados de identidade de participantes de clientes com flag LGPD são armazenados e processados apenas em `sa-east-1` | Verificação de residência de dados pelo CTO antes do go-live com a Construtora Ágil; confirmação com Fernanda Ramos (TI Lead) |

---

## Seção 9 — Edge Cases e Modos de Falha  ·  *(bloqueia freeze)*

- **Dono da sala desconecta com aprovações pendentes:** Aprovações pendentes persistem no servidor por 5 min. Se o dono reconectar dentro do TTL, a fila é apresentada. Se o TTL expirar, as solicitações expiram e os usuários recebem mensagem de expiração.
- **Dono da sala é removido da própria sala (erro de implementação):** O sistema não deve permitir que o dono da sala seja removido por nenhum participante, incluindo ele mesmo. A ação de remoção deve ser bloqueada pelo servidor se o alvo for o dono.
- **Dois donos simultâneos aprovam/negam a mesma solicitação:** O servidor processa a primeira resposta e ignora a segunda (idempotência). O participante não entra duas vezes nem recebe mensagens conflitantes.
- **Participante em votação ativa tem papel alterado para Observador:** Votos submetidos no item atual são anulados. Implementação deve garantir que a anulação seja atômica com a mudança de papel — sem estado inconsistente onde o voto persiste mas o papel é Observador.
- **Modo anônimo ativado com votação já em andamento:** Aliases são atribuídos imediatamente para todos os participantes. Nomes reais que possam ter sido visíveis antes da ativação não são retroativamente ocultados em histórico de chat ou notificações já enviadas — este é um comportamento aceito e esperado.
- **Colisão de alias anônimo:** A atribuição de alias é determinística por índice de participante na sessão. Colisão dentro de uma sessão é impossível por design.
- **Token de convite vazado (forwarded para terceiro):** O token é de uso único — a primeira entrada o invalida. Se o link for usado por um terceiro antes do convidado original, o convidado original verá erro "Convite já utilizado." O dono deve gerar um novo convite.
- **Tentativa de bypass via API direta (chamada REST ou WebSocket sem membership):** O servidor valida a membership da sala em cada mensagem WebSocket e em cada requisição REST. Sem membership válida, a requisição é rejeitada com erro de autorização (401/403). Sem confiança no cliente para estado de acesso.
- **Sessão ativa em modo Aberto migrada para modo Somente convite ou Aprovação:** Participantes já dentro da sala não são afetados (não são removidos). Apenas novas tentativas de entrada são bloqueadas.

---

## Seção 10 — Métricas de Sucesso (primária · secundária · guardrail)  ·  *(bloqueia freeze)*

> Valores projetados — o baseline que `metrics.md` confronta com o medido pós-rollout.

| Tipo | Métrica | Meta (projetada) | Janela de medição | Medição (quem/como) | Confiança |
|---|---|---|---|---|---|
| **Primária** | Contrato da Construtora Ágil fechado | Contrato assinado | Até 30 dias do release | CRM de Vendas (Rafael Souza) | 85 |
| **Primária** | Adoção do modo anônimo em sessões enterprise | ≥ 30% das sessões de nível enterprise | 60 dias pós-release | Telemetria de sessões (filtro por tier enterprise) | 65 |
| **Secundária** | Taxa de sucesso de entrada no modo Aprovação obrigatória | ≥ 95% das solicitações válidas aprovadas em ≤ 2 min | 30 dias pós-release | Telemetria: latência solicitação-para-aprovação | 70 |
| **Secundária** | Deals adicionais em pipeline desbloqueados | ≥ 1 dos 2 deals sinalizados avança para fechamento | 90 dias pós-release | CRM de Vendas | 60 |
| **Guardrail** | Incidentes de acesso não autorizado após go-live | 0 incidentes reportados | Contínuo, a partir do release | Tickets de CS + monitoramento de segurança | 90 |
| **Guardrail** | Latência de votação em salas abertas (não afetadas) | Sem degradação medível vs. baseline pré-release | 30 dias pós-release | Telemetria de performance das sessões de votação | 85 |

---

## Seção 11 — Critérios de Sucesso e Aceite (do release)  ·  *(bloqueia freeze)*

| Critério | Tipo | Indicador | Valor alvo |
|---|---|---|---|
| Contrato da Construtora Ágil fechado | Negócio | Contrato assinado após o release | R$ 42.000 ARR |
| Conformidade LGPD confirmada pelo cliente | Compliance | Fernanda Ramos (TI Lead) confirma residência de dados antes do go-live | Sign-off formal |
| Mapeamento Azure AD end-to-end funcionando | Técnico | Funcionários e prestadores recebem papéis corretos automaticamente via group-claim | 100% em homologação com a Construtora Ágil |
| Zero incidentes de acesso não autorizado | Segurança | Sem casos reportados de participantes removidos/bloqueados acessando dados de sessão | 0 incidentes nos primeiros 30 dias |
| Compatibilidade retroativa preservada | Qualidade | Salas abertas existentes funcionam sem alterações após o release | Confirmado em testes de regressão |

---

## Seção 12 — Riscos e Dependências (de produto e negócio)  ·  *(bloqueia freeze)*

> Riscos **técnicos** vivem no Technical Assessment TA-2026-002. Aqui ficam os riscos de produto, negócio, adoção e compliance.

| Risco | Tipo | Probabilidade | Impacto | Mitigação |
|---|---|---|---|---|
| Registro Azure AD atrasado pelo TI da Construtora Ágil | Externo | Média | Alto | Entregar spec técnica e checklist de registro ao TI do cliente (Fernanda Ramos) logo no início do projeto. Incluir data de fechamento do registro como milestone externo no plano de execução. |
| Compromisso informal de prazo de Vendas conflita com capacidade real | Operacional | Alta | Alto | PM executa avaliação de capacidade antes de qualquer data ser comunicada externamente. PO é dono deste gate. Vendas foi notificado: nenhuma data pode ser confirmada antes da avaliação do PM. |
| Pressão de expansão de escopo (SSO, audit logs, guest access) | Produto / Escopo | Média | Médio | Limite de escopo explícito neste pacote. Qualquer adição requer novo registro de intake com PO. |
| Modo anônimo adotado abaixo do esperado (30%) | Adoção | Baixa | Baixo | Acompanhar telemetria nos primeiros 60 dias. Se abaixo da meta, investigar com CS e Construtora Ágil antes de concluir sobre o gap. |
| Integração Jira pressiona de desejo para obrigatório durante a entrega | Escopo | Baixa | Médio | Definido como backlog (`BACKLOG-2026-007`) em chamada com o cliente. Qualquer escalada deve ser triada novamente pelo PO. |

**Dependências (de produto/negócio):**
- Ação do TI da Construtora Ágil: registro da plataforma no portal Azure AD do cliente. Data-alvo a ser definida no plano de execução do PM.
- Avaliação de capacidade do PM antes de qualquer comunicação de prazo a Vendas ou ao cliente.
- Disponibilidade de ambiente de QA com simulação de sessão multi-tenant para testes de modo anônimo e controle de acesso.

---

## Seção 13 — Avaliação Preliminar de Esforço e Custo

> Somente uso interno. **Preliminar** — o chute do PO para sustentar sequenciamento. O número **firme** vem do CTO no Technical Assessment TA-2026-002.

| Área | Estimativa preliminar | Confiança |
|---|---|---|
| Backend (modelo de dados, auth, acesso, Azure AD, LGPD) | ~18 dias | Baixa |
| Frontend (painel de configurações, UI de participantes) | ~6 dias | Baixa |
| QA | ~5 dias | Baixa |
| **Total preliminar** | **~29 dias** | Baixa |

**Sinais de custo a confirmar pelo CTO:** roteamento condicional `sa-east-1` (Opção C) pode exigir nova instância RDS na região do Brasil — procurement deve ser iniciado pelo CTO antes do início do desenvolvimento se confirmado como necessário.

> O número firme é **25 dias**, conforme TA-2026-002. A estimativa preliminar do PO foi de ~29 dias — diferença explicada pela granularidade adicional que o CTO aplicou na separação de esforço entre as áreas técnicas.

---

## Seção 14 — Roadmap Sugerido

### MVP (este release)

- Modos de acesso: Aberto / Somente convite / Aprovação obrigatória
- Modo anônimo com filtragem server-side
- Atribuição de papel Votante / Observador
- Remoção de participante com efeito imediato
- Aplicação server-side de todas as regras de acesso (sem confiança no cliente)

### Fase 2 (backlog futuro)

- Configurações padrão de acesso a nível de conta
- Audit log: quem entrou, quando, papel, votos submetidos
- Convite em massa via CSV ou roster de equipe
- Atribuição automática de Observador para papéis não-técnicos (baseado em configuração de papel da conta)

### Fase 3 (backlog futuro)

- Integração SSO / SAML para gerenciamento de identidade enterprise
- Exportação de compliance (relatório de audit de sessão para fins de governança)
- Guest access sem registro de conta (tokens escopados com tempo limitado)
- Integração Jira para pré-população de participantes por sprint (`BACKLOG-2026-007`)

---

## Referência ao Technical Assessment  ·  *(bloqueia freeze se requisitado)*

> Esta é a **ponte** (`TechAssessmentRef`), não conteúdo. O RP referencia o veredito do CTO — não o absorve. Todo o conteúdo arquitetural (modelo de dados de participantes, multi-tenancy, Azure AD OIDC, LGPD `sa-east-1`, riscos técnicos, ADRs e esforço firme) vive em [`03-technical-assessment-access-control.md`](./03-technical-assessment-access-control.md). A fusão acontece no [PRD](./04-prd-access-control.md). Ver [`personas/02-po.md` §5 e §10](../../../personas/02-po.md).

| Campo | Valor |
|---|---|
| **Status** | Assinado |
| **Veredito de viabilidade** | Viável com ressalvas |
| **Technical Assessment vinculado** | TA-2026-002 v1 — [`./03-technical-assessment-access-control.md`](./03-technical-assessment-access-control.md) |
| **Constraints rígidas que afetam o escopo** | (1) LGPD: dados de participantes de clientes com flag LGPD devem residir em `sa-east-1` — roteamento condicional (Opção C) está no escopo e adiciona ~2 semanas de esforço; (2) nova instância RDS em `sa-east-1` pode ser necessária — procurement iniciado pelo CTO; (3) integração Azure AD é via OIDC group-claim apenas (sem SSO completo) — escopo confirmado |

> **Gate de congelamento (freeze):** todas as seções `bloqueia freeze` estão resolvidas **e** `TechAssessmentRef.Status = Assinado`. RP-2026-002 congelado em 2026-03-27. `freezeReady = true`.
