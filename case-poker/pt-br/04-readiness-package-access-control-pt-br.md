# Readiness Package — Room Access Control (Controle de Acesso à Sala)

## Metadados

| Campo | Valor |
|---|---|
| **ID do Pacote** | RP-2024-002 |
| **Versão** | v1 |
| **Intake vinculado** | INT-2024-002 |
| **Responsável** | Lucas Mendes (PO) |
| **Contribuição do CTO** | Sim — avaliação arquitetural sobre o modelo de dados de participantes e membership de sessão em tempo real |
| **Status** | Aprovado — aguardando planejamento de execução pelo PM |
| **Data de aprovação da versão atual** | 2024-03-27 |

## Histórico de Revisão

| Versão | Data | Autor | Status | Resumo |
|---|---|---|---|---|
| v1 | 2024-03-27 | Lucas Mendes (PO) + Rodrigo Lima (CTO) | Aprovado | Submissão inicial. Pacote incluiu findings completos do Discovery (Azure AD OIDC, LGPD Opção C). PM aprovou na primeira revisão. |

---

## Seção 1 — Resumo Executivo

A plataforma atualmente não oferece controle de acesso dentro de uma sala de planejamento. Qualquer pessoa com o link da sala pode entrar, ver todos os participantes e votar. Esse modelo é insuficiente para clientes enterprise operando com equipes mistas internas/externas ou sob políticas de governança de dados que restringem a visibilidade dos participantes.

Este pacote define um sistema de **Controle de Acesso à Sala** que permite ao dono da sala:

1. Controlar quem pode entrar (acesso somente por convite ou com aprovação obrigatória)
2. Controlar a visibilidade dos participantes (modo anônimo — votantes não podem ver as identidades uns dos outros)
3. Atribuir papéis dentro da sala (votante vs. observador)

Esta funcionalidade é um bloqueador pré-fechamento para a Construtora Ágil (R$ 42.000 ARR) e foi sinalizada como necessidade em outros 2 deals em pipeline. O CTO avaliou que isso requer uma mudança no modelo de dados de participantes com implicações de multi-tenancy que devem ser tratadas com cuidado.

---

## Seção 2 — Contexto e Problema

### Cenário Atual

O acesso à sala é inteiramente baseado em link: quem tem a URL entra. Uma vez dentro, todos os participantes são visíveis uns para os outros por nome ou usuário. Não há distinção entre votantes e observadores. O dono da sala não tem controle sobre quem entra ou o que os outros podem ver.

### Limitações

- Sem portão de acesso: qualquer pessoa com o link entra imediatamente.
- Sem anonimato: identidades dos participantes são totalmente visíveis a todos os outros.
- Sem diferenciação de papéis: todos que entram são votantes por padrão.
- Sem mecanismo para remover ou restringir um participante durante a sessão.

### Dor do Cliente

Os Scrum Masters da Construtora Ágil realizam cerimônias que incluem prestadores externos. Sua política interna de governança de dados proíbe visibilidade de identidade entre prestadores. Adicionalmente, querem que gerentes de produto participem como observadores sem poder votar ou influenciar estimativas.

### Impacto de Negócio

- Bloqueador de deal: R$ 42.000 ARR condicionado a esta funcionalidade
- Sinal de pipeline: outros 2 deals enterprise com o mesmo requisito
- Compliance: Construtora Ágil não pode fazer onboarding sem isso — sign-off legal/governance necessário no lado deles

---

## Seção 3 — Objetivos

1. Permitir que o dono da sala defina o modo de acesso: aberto (comportamento atual), somente convite ou aprovação obrigatória.
2. Permitir que o dono da sala ative o modo anônimo, ocultando as identidades dos participantes uns dos outros (o facilitador mantém visibilidade completa).
3. Permitir que o dono da sala atribua papéis de votante ou observador antes ou durante uma sessão.
4. Permitir que o dono da sala remova um participante de uma sessão ativa.
5. Fechar o deal da Construtora Ágil entregando um modelo de controle de acesso em conformidade dentro de 60 dias da aprovação do pacote.

---

## Seção 4 — Escopo

### Incluído

- Configurações da sala: seletor de modo de acesso (Aberto / Somente convite / Aprovação obrigatória)
- Modo somente convite: dono da sala gera links de convite ou envia convites por email; usuários não convidados são bloqueados
- Modo aprovação obrigatória: qualquer usuário com o link da sala pode solicitar entrada; dono da sala aprova ou nega em tempo real
- Modo anônimo: nomes dos participantes substituídos por aliases randomizados (ex.: "Participante A", "Participante B") para participantes não-dono; dono vê nomes reais
- Atribuição de papel: dono da sala atribui papel Votante ou Observador por participante antes ou durante a sessão
- Experiência do observador: observadores veem a sessão em tempo real mas não têm controles de votação
- Dono da sala pode remover um participante a qualquer momento durante uma sessão ativa
- Configurações de acesso são configuráveis por sala (não configurações padrão a nível de conta neste release)

### Excluído

- Configurações padrão de acesso a nível de conta (fase futura)
- Integração SSO / SAML para gerenciamento de identidade enterprise (item separado no roadmap)
- Audit log de quem entrou, quando e o que votou (fase futura de compliance)
- Guest access sem registro de conta (permanece fora do escopo)
- Proteção de sala com senha (modos de acesso acima são suficientes para este release)

---

## Seção 5 — Personas Impactadas

| Persona | Papel | Impacto |
|---|---|---|
| **Dono da Sala (Scrum Master / Tech Lead)** | Cria e gerencia a sala | Novo: configura modo de acesso, gerencia convites/aprovações, atribui papéis, ativa modo anônimo |
| **Votante (Desenvolvedor / Membro do Time)** | Estima itens | Experiência de votação inalterada. Em modo anônimo, vê aliases dos colegas em vez de nomes. |
| **Observador (Product Manager / Executivo)** | Acompanha a cerimônia | Novo papel: entra na sala, vê tudo em tempo real, não pode votar |
| **Usuário Não Convidado / Não Aprovado** | Tenta entrar | Novo: vê tela de espera/bloqueio em vez de entrar diretamente |

---

## Seção 6 — Regras de Negócio e Fluxos

### Regras de Modo de Acesso

**Aberto (padrão)**
- Comportamento inalterado em relação ao atual.

**Somente convite**
1. Dono da sala gera links de convite ou envia convites por email pelo painel de configurações da sala.
2. Apenas usuários que receberam um convite podem entrar.
3. Um usuário sem convite que tenta entrar via URL da sala vê: "Esta sala requer um convite."
4. O dono da sala pode revogar um convite antes que seja usado.

**Aprovação obrigatória**
1. Qualquer usuário com a URL da sala pode solicitar entrada.
2. O dono da sala recebe notificação em tempo real: "Usuário X está solicitando entrada."
3. Dono aprova ou nega. Usuários aprovados entram imediatamente. Usuários negados veem: "Sua solicitação não foi aprovada."
4. Se o dono da sala não responder em 5 minutos, a solicitação expira e o usuário vê: "Solicitação expirada. Entre em contato com o dono da sala."

### Regras do Modo Anônimo

1. O modo anônimo pode ser ativado pelo dono da sala a qualquer momento antes dos votos serem revelados.
2. Quando ativo: todos os nomes dos participantes são substituídos por aliases para participantes não-dono. A ordem dos aliases é randomizada por sessão.
3. O dono da sala sempre vê os nomes reais independentemente do modo anônimo.
4. Os aliases são consistentes dentro de uma sessão — "Participante C" é a mesma pessoa durante toda a sessão.
5. O modo anônimo não pode ser desativado durante a sessão uma vez ativado (previne tentativas de desmascaramento).

### Regras de Atribuição de Papéis

1. Papel padrão para qualquer participante que entrou: Votante.
2. O dono da sala pode alterar o papel de um participante para Observador antes da sessão começar ou entre itens.
3. Observadores veem a sessão completa (itens, votos após revelação) mas não têm controles de votação.
4. Um Votante pode ser rebaixado para Observador durante a sessão — seus votos já submetidos para o item atual são anulados.
5. Um Observador não pode ser promovido para Votante após o início da votação para o item atual.

### Regras de Remoção de Participante

1. O dono da sala pode remover qualquer participante a qualquer momento.
2. Participante removido vê: "Você foi removido desta sessão."
3. Quaisquer votos submetidos pelo participante removido no item atual são anulados.
4. Participantes removidos não podem re-entrar pelo mesmo link na mesma sessão.

### Transição de Estado — Fluxo de Aprovação

```text
Usuário solicita entrada
    ↓
Dono da sala recebe notificação
    ↓
    ├── Aprovado → Usuário entra na sessão
    ├── Negado → Usuário vê mensagem de negação
    └── Sem resposta em 5 min → Solicitação expira
```

---

## Seção 7 — Integrações Necessárias

| Sistema | Tipo | Detalhe |
|---|---|---|
| **WebSocket / camada de sessão em tempo real** | Interno | Novos tipos de evento necessários: `join_request`, `join_approved`, `join_denied`, `role_changed`, `participant_removed`. Infraestrutura WebSocket existente se aplica. |
| **Camada de persistência de sessão** | Interno | Registros de participantes agora devem carregar: access_mode, role, anonymous_alias, invite_token. Extensão de schema necessária — CTO sinalizou implicações de multi-tenancy (ver Seção 8). |
| **Serviço de email (opcional)** | Interno/Externo | Se convite por email for incluído no MVP, o provedor de email transacional existente é usado. Sem novo provedor necessário. |
| **Camada de autenticação** | Interno | Modos somente convite e aprovação requerem que a identidade do participante seja verificável no momento da entrada. Validação de token de auth na entrada da sala deve ser aplicada. |

---

## Seção 8 — Impacto Técnico

*Avaliação arquitetural do CTO concluída em 2024-03-25. Notas abaixo são da revisão do CTO.*

| Área | Impacto | Nota do CTO |
|---|---|---|
| **Modelo de dados de participantes** | Significativo. O modelo atual de participante é um registro plano com escopo de sessão. Adicionar role, access_mode, anonymous_alias e invite_token requer migração de schema e uma nova máquina de estado do participante. | A migração deve ser retrocompatível. Sessões abertas existentes não devem ser afetadas. |
| **Multi-tenancy** | Médio. Aliases anônimos devem ter escopo de sessão, não de conta. Tokens de convite devem ser não-adivinháveis e com escopo para a sala+sessão específica. | Geração de tokens deve usar valores aleatórios criptograficamente seguros. Tokens devem expirar após o primeiro uso ou fim da sessão. |
| **Membership em tempo real** | Médio. A camada WebSocket atualmente transmite a lista de participantes a todos os membros. Com modo anônimo, o servidor deve filtrar o payload da lista de participantes por destinatário — dono da sala recebe nomes reais, outros recebem aliases. | Filtragem server-side é obrigatória. O cliente nunca deve receber o nome real de outro participante em payloads de modo anônimo. |
| **Segurança** | Alto. O modelo de controle de acesso deve ser aplicado server-side. Um participante que foi negado ou removido não deve conseguir re-entrar ou acessar o estado da sessão via chamadas diretas de API. | O servidor deve validar a membership da sala em cada mensagem WebSocket e requisição REST. Sem confiança no cliente para estado de acesso. |
| **Performance** | Baixo. Notificações de aprovação e mudanças de papel são eventos de baixa frequência. Sem preocupações de escalabilidade nos volumes atuais de sessão. | Monitorar com 10x o pico atual se a adoção enterprise acelerar. |
| **Observabilidade** | Adicionar telemetria: distribuição de modo de acesso, taxa de aprovação, proporção observador/votante. | Necessário para decisões de produto na Fase 2. |

---

## Seção 9 — Riscos e Dependências

| Risco | Tipo | Probabilidade | Impacto | Mitigação |
|---|---|---|---|---|
| Migração do modelo de dados de participantes quebra sessões ativas | Técnico | Baixa | Alto | Estratégia de migração: mudança aditiva de schema apenas. Novos campos são nullable com defaults correspondendo ao comportamento atual. Sessões existentes não afetadas. |
| Colisão de alias anônimo (dois participantes recebem o mesmo alias) | Técnico | Baixa | Médio | Atribuição de alias é determinística por índice de participante na sessão. Sem colisão possível dentro de uma sessão. |
| Força bruta de token de convite | Segurança | Baixa | Alto | Tokens são 128-bit criptograficamente aleatórios. Expiram no primeiro uso. Rate limiting no endpoint de entrada. |
| Dono da sala desconecta durante aprovações pendentes | Técnico | Média | Médio | Aprovações pendentes persistem por 5 min. Se dono da sala reconectar, fila é apresentada. Se não, solicitações expiram limpo. |
| Conflito de compromisso de prazo de Vendas | Operacional | Alta | Alto | Vendas comprometeu informalmente entrega em 60 dias ao cliente. PM deve executar avaliação de capacidade e confirmar prazo ao PO antes de Vendas comunicar qualquer coisa adicional ao cliente. |
| Pressão de expansão de escopo (SSO, audit logs) | Operacional | Média | Médio | Limite de escopo é explícito neste pacote. Qualquer adição requer um novo registro de intake. |

**Dependências:**
- Disponibilidade do CTO para revisar plano de migração do modelo de participantes antes do início do breakdown do Tech Lead
- Time de auth (ou Tech Lead com ownership de auth) para trabalho de token de convite e validação de sessão
- Ambiente de QA com simulação de sessão multi-tenant

---

## Seção 10 — Avaliação Interna de Esforço e Custo

> 🔒 **Somente uso interno.** Esta seção é um instrumento de planejamento operacional para tomada de decisão interna. As estimativas abaixo não são compromissos, não são obrigações contratuais, e nunca devem ser compartilhadas com clientes, prospects ou stakeholders externos em qualquer forma. Existem para suportar planejamento de capacidade, trade-offs de priorização e alocação administrativa de recursos dentro da empresa.
>
> As estimativas são baseadas na senioridade atual da equipe e no estado conhecido do sistema no momento da racionalização. Serão revisadas pelo Tech Lead durante o breakdown técnico. A inclusão do trabalho de residência de dados LGPD (Opção C) e integração Azure AD aumenta significativamente a estimativa original do que foi inicialmente escopado no intake.

### Esforço de Desenvolvimento

| Área | Estimativa | Senioridade |
|---|---|---|
| Backend — migração do modelo de participantes + máquina de estado | 6 dias | Senior |
| Backend — filtragem de eventos WebSocket (modo anônimo) | 3 dias | Senior |
| Backend — aplicação de modo de acesso (convite, aprovação, remoção) | 5 dias | Mid-senior |
| Backend — integração de group-claim OIDC do Azure AD | 5 dias | Senior |
| Backend — roteamento de residência de dados LGPD (Opção C, `sa-east-1`) | 10 dias | Senior |
| Frontend — painel de configurações de acesso do dono da sala | 4 dias | Mid |
| Frontend — UI do participante (aliases anônimos, view do observador, tela de aprovação) | 3 dias | Mid |
| QA (funcional + segurança + multi-tenant + validação LGPD) | 5 dias | QA |
| **Total** | **41 dias** | |

> ⚠️ **Nota sobre a estimativa:** A estimativa original no nível do intake (25 dias) não incluía integração Azure AD ou trabalho de residência de dados LGPD. Ambos foram adicionados ao escopo durante o Discovery. O total revisado reflete o escopo completo pós-Discovery.

### Impacto de Infraestrutura

Sem novos serviços de infraestrutura. Migração de schema de banco de dados no cluster existente. O roteamento condicional `sa-east-1` requer uma read-replica ou write endpoint na região do Brasil — CTO deve confirmar se já está provisionado ou se requer uma nova instância RDS. Se nova instância for necessária, o procurement deve ser iniciado pelo CTO antes do início do desenvolvimento.

### Impacto de Custo com Terceiros

Nenhum além dos serviços existentes. Provedor de email já está contratado. A integração Azure AD é do lado do cliente — sem custo para a plataforma.

### Impacto de Custo Operacional Recorrente

Baixo a médio. A residência de dados `sa-east-1` adiciona um endpoint de banco de dados na região do Brasil. Aumento de custo mensal estimado: a definir pela revisão de infraestrutura do CTO. Deve ser considerado na precificação para tenants com flag LGPD no planejamento comercial futuro.

### Avaliação de TCO

Esta funcionalidade adiciona complexidade significativa e duradoura ao modelo de participantes e à camada de infraestrutura. Funcionalidades futuras que tocam membership de sessão (SSO, audit logs, guest access) e residência de dados multi-região construirão sobre esta base — o investimento aqui reduz o custo marginal dessas fases. O padrão de roteamento LGPD, uma vez estabelecido, torna-se reutilizável para qualquer requisito futuro de região de compliance.

---

## Seção 11 — Critérios de Sucesso

| Métrica | Meta | Medição |
|---|---|---|
| Deal da Construtora Ágil fechado | Contrato assinado em até 30 dias do release | CRM de Vendas |
| Adoção do modo anônimo | Usado em ≥ 30% das sessões enterprise em até 60 dias | Telemetria de sessões |
| Taxa de sucesso de entrada em modo aprovação | ≥ 95% das solicitações válidas aprovadas em até 2 min | Telemetria: latência solicitação-para-aprovação |
| Zero incidentes de acesso não autorizado | Sem casos reportados de participantes removidos/bloqueados acessando dados de sessão | Tickets de CS + monitoramento de segurança |
| Deals adicionais em pipeline desbloqueados | Pelo menos 1 dos 2 deals em pipeline sinalizados avança para fechamento em até 90 dias | CRM de Vendas |

---

## Seção 12 — Roadmap Sugerido

### MVP (este release)

- Modos de acesso: Aberto / Somente convite / Aprovação obrigatória
- Modo anônimo
- Atribuição de papel Votante / Observador
- Remoção de participante
- Aplicação server-side de todas as regras de acesso

### Fase 2 (backlog futuro)

- Configurações padrão de acesso a nível de conta
- Audit log: quem entrou, quando, papel, votos submetidos
- Convite em massa via CSV ou roster de equipe
- Atribuição automática de observador para papéis não-técnicos (baseado em configuração de papel da conta)

### Fase 3 (backlog futuro)

- Integração SSO / SAML para gerenciamento de identidade enterprise
- Exportação de compliance (relatório de audit de sessão para fins de governança)
- Guest access sem registro de conta (tokens com escopo e tempo limitado)
