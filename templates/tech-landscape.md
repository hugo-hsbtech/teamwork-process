# Base de Conhecimento Técnica (Tech Landscape) — [Nome do Sistema]

> **O que é.** Um documento **persistente, por sistema** (não por demanda) que descreve o terreno técnico sobre o qual as demandas são avaliadas e construídas. É a "base de conhecimento prévia" que o [Technical Assessment](./03-technical-assessment.md) **referencia** (brownfield) ou **semeia** (greenfield, a partir dos ADRs fundacionais). Existe porque a camada de execução — engenheiro recém-chegado ou **agente de IA** — **não tem conhecimento implícito do código**; este arquivo torna explícito o que normalmente vive só na cabeça do time.
>
> **Inspiração.** *Steering docs* do Kiro (`product.md` / `tech.md` / `structure.md`) e o `document-project` / `project-context.md` do BMAD Method — consolidados em um único documento por sistema. É conhecimento de **contexto persistente**, não de uma feature.
>
> **Ciclo de vida.** Criado quando um sistema nasce (greenfield) ou quando a primeira demanda brownfield exige documentá-lo (Discovery). **Vivo:** cada demanda que muda o terreno atualiza este arquivo. Pode estar **completo, parcial ou ausente** — a Seção 6 registra honestamente as lacunas (mesma filosofia de confiança do resto do processo).
>
> **Uso:** um arquivo por sistema/serviço. Nomear `tech-landscape-[sistema].md`.

## Metadados

| Campo | Valor |
|---|---|
| **Sistema / Serviço** | [Nome] |
| **Dono técnico** | [Nome / time] |
| **Origem** | Greenfield (semeado pelo TA TA-AAAA-NNN) / Brownfield (documentado em INT-AAAA-NNN) |
| **Status da KB** | Completa · Parcial · Stub (esqueleto inicial) |
| **Última atualização** | AAAA-MM-DD — [por quem, por qual demanda] |

## Histórico de Atualização

| Data | Demanda | O que mudou no terreno |
|---|---|---|
| AAAA-MM-DD | [INT/PRD-ID] | [Criação / mudança de stack / nova integração / dívida resolvida] |

---

## 1. Produto / Domínio  ·  *(o "porquê" — estilo `product.md`)*

> Para que este sistema existe, quem usa, e quais capacidades ele entrega. Ancora decisões técnicas no propósito de produto.

- **Propósito:** [O problema que este sistema resolve]
- **Usuários / personas:** [Quem depende dele]
- **Capacidades principais:** [O que faz, em 3–7 itens]
- **Limites do sistema:** [O que NÃO é responsabilidade dele]

---

## 2. Stack & Ferramentas  ·  *(o "com quê" — estilo `tech.md`)*

> O que o time **já usa** — para que novas implementações prefiram o estabelecido em vez de reinventar.

| Camada | Tecnologia | Versão / nota |
|---|---|---|
| **Linguagem(ns) / runtime** | [ex.: TypeScript / Node 20] | |
| **Framework / app** | [ex.: NestJS] | |
| **Persistência / dados** | [ex.: PostgreSQL + Prisma] | |
| **Mensageria / eventos** | [ex.: Kafka — ou N/A] | |
| **Frontend** | [ex.: React] | |
| **Infra / deploy** | [ex.: Kubernetes / AWS] | |
| **Testes** | [ex.: Jest, Playwright] | |
| **Observabilidade** | [ex.: OpenTelemetry, Grafana] | |

---

## 3. Estrutura & Convenções  ·  *(o "como organizamos" — estilo `structure.md`)*

> Onde o código mora e as regras que o novo código deve seguir para encaixar sem atrito.

- **Organização de pastas / módulos:** [Padrão — ex.: por domínio, por camada]
- **Convenções de nomeação:** [Arquivos, classes, endpoints]
- **Padrões de código relevantes:** [ex.: injeção de dependência, repository pattern]
- **Padrões de API / contratos:** [REST/eventos, versionamento, autenticação]
- **Padrões de dados:** [Migrations, soft-delete, multi-tenancy]
- **Branching / CI:** [Fluxo de branches, gates de pipeline]

---

## 4. Integrações & Dependências

> Com quem este sistema conversa. Mapa de contexto (estilo C4 — *system context / landscape*).

| Sistema / Serviço | Direção | Protocolo | Natureza do acoplamento |
|---|---|---|---|
| [Nome] | Consome / É consumido / Bidirecional | [REST / evento / BD] | [Síncrono / assíncrono / forte / fraco] |

---

## 5. Constraints & Dívida Conhecida

> Restrições não-negociáveis e fragilidades que toda demanda precisa respeitar/evitar.

| Item | Tipo | Detalhe | Implicação |
|---|---|---|---|
| [Constraint / dívida] | Constraint / Dívida técnica | [O que é] | [O que evitar ou cuidar] |

---

## 6. Lacunas da KB  ·  *(honestidade sobre o que ainda não sabemos)*

> O que **ainda não está documentado** ou tem baixa confiança. Mesma lógica de dispositions do resto do processo: "não documentado ainda, e este é o plano" é um estado válido — melhor que silêncio. Uma demanda brownfield que toca uma área listada aqui deve documentá-la antes de avançar.

| Área não documentada | Por que importa | Como/quando preencher |
|---|---|---|
| [Área] | [Risco de não saber] | [Discovery / próxima demanda que tocar] |

---

## 7. Glossário  *(opcional)*

> Termos de domínio e técnicos que o time usa ao falar deste sistema (estilo arc42 §12). Reduz ambiguidade para quem chega.

| Termo | Definição |
|---|---|
| [Termo] | [Definição] |
