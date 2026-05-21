# Do Pedido do Cliente à Execução com Excelência

> Processo operacional padronizado para transformar demandas em entregas de valor.

---

## 1. Visão Geral — As Três Camadas

```mermaid
flowchart LR
    subgraph UP ["🔼 UPSTREAM — Geração da Demanda"]
        direction TB
        CEO["👤 CEO\nVisão, estratégia\ne prioridades"]
        SALES["📣 Vendas / Marketing\nOportunidades,\ndeals, feedbacks"]
    end

    subgraph IL ["⚙️ INTAKE LAYER — Porta Controlada"]
        direction TB
        CTOPO["🔧 CTO / PO\nRacionalizam, priorizam\ne preparam os artefatos\ncom visão de produto\ne tecnologia"]
    end

    subgraph DS ["🔽 DOWNSTREAM — Execução"]
        direction TB
        PM["📋 PM\nPlaneja execução,\ngerencia prioridades\ne acompanha entregas"]
        TL["💻 Tech Leads\nQuebra técnica,\narquitetura, estimativas\ne coordenação da equipe"]
        ENG["⌨️ Engineers\nDesenvolvimento,\ntestes e entrega\ncontínua"]
    end

    UP --> IL
    IL --> DS

    style UP fill:#e8f4f8,stroke:#2196F3,color:#000
    style IL fill:#fff8e1,stroke:#FF9800,color:#000
    style DS fill:#e8f5e9,stroke:#4CAF50,color:#000
```

---

## 2. Fluxo Completo — Do Sinal à Entrega

```mermaid
flowchart TD
    SIGNAL([Cliente / Mercado / Sinal Interno])

    subgraph UP ["🔼 UPSTREAM"]
        A[Vendas / CS / Marketing / CEO\ncaptura a demanda]
        B[Formulário de intake estruturado\nsubmetido ao PO]
    end

    subgraph IL ["⚙️ INTAKE LAYER"]
        C[PO — Triagem Inicial\nÉ real? Recorrente? Alinhado?]
        D{Decisão de Triagem}
        REJ[🚫 REJEITADO\nFora da estratégia]
        OPP[📦 BACKLOG DE OPORTUNIDADE\nValioso, mas não agora]
        DISC[🔍 DISCOVERY\nPrecisa investigar mais]
        PR[✅ PRODUCT READY\nPode ser racionalizado]
        E[PO — Racionalização\nTransforma dor em contexto de produto]
        F{Impacto Arquitetural?}
        CTO_A[CTO — Avaliação Técnica\nConstraints · Arquitetura · Riscos]
        RP[📄 Readiness Package Completo\nAssinado por PO + CTO se aplicável]
    end

    subgraph DS ["🔽 DOWNSTREAM"]
        PM_R[PM — Recebe o Readiness Package\nValida completude]
        PM_P[PM — Planejamento de Execução\nRoadmap · Milestones · Capacidade]
        TL_B[Tech Leads — Quebra Técnica\nArquitetura · Épicos · Histórias · Tasks]
        ENG_I[Engineers — Implementação\nDesenvolvimento · Testes · Code Review]
        QA[QA / UAT\nValidação de Critérios de Aceite]
        REL[🚀 Release]
    end

    subgraph FB ["🔁 FEEDBACK LOOP"]
        FB1[PM + CS — Coleta de Resultados\nOutcomes · Satisfação · Fricção]
        FB2[PO — Aprende e Atualiza\nBacklog · Prioridades · Visão]
    end

    SIGNAL --> A
    A --> B
    B --> C
    C --> D
    D -- Rejeitado --> REJ
    D -- Oportunidade --> OPP
    D -- Discovery --> DISC
    DISC -.->|Após investigação| C
    D -- Product Ready --> PR
    PR --> E
    E --> F
    F -- Não --> RP
    F -- Sim --> CTO_A
    CTO_A --> RP
    RP --> PM_R
    PM_R --> PM_P
    PM_P --> TL_B
    TL_B --> ENG_I
    ENG_I --> QA
    QA --> REL
    REL --> FB1
    FB1 --> FB2
    FB2 --> SIGNAL

    style UP fill:#e8f4f8,stroke:#2196F3,color:#000
    style IL fill:#fff8e1,stroke:#FF9800,color:#000
    style DS fill:#e8f5e9,stroke:#4CAF50,color:#000
    style FB fill:#f3e5f5,stroke:#9C27B0,color:#000
    style REJ fill:#f8d7da,stroke:#dc3545,color:#000
    style OPP fill:#fff3cd,stroke:#ffc107,color:#000
    style DISC fill:#cce5ff,stroke:#004085,color:#000
    style PR fill:#d4edda,stroke:#28a745,color:#000
```

---

## 3. Intake Layer — Como Funciona em Detalhe

```mermaid
flowchart LR
    subgraph S1 ["1 - Captura"]
        direction TB
        C1["Origem: Sales,\nMarketing, CS,\nSupporte, CEO,\nInterno"]
        C2["Registra a dor /\noportunidade sem\ndefinir solução"]
        C3["Formulário ou\nregistro padronizado"]
        C4["Foco no problema,\nnão na implementação"]
    end

    subgraph S2 ["2 - Triagem Inicial"]
        direction TB
        T1["Responsável: CTO/PO"]
        T2["É um problema real?"]
        T3["É recorrente?"]
        T4["Encaixa na visão\ndo produto?"]
        T5["Qual impacto técnico\ne de negócio?"]
        T6["Urgência e impacto?"]
    end

    subgraph S3 ["3 - Decisão de Caminho"]
        direction TB
        D1["🚫 REJEITADO\nFora da estratégia ou\nbaixo valor"]
        D2["📦 BACKLOG DE\nOPORTUNIDADE\nInteressante, mas\nnão prioritário agora"]
        D3["🔍 DISCOVERY\nPrecisa investigar\nmelhor com cliente,\nmercado, fluxos e\ndados"]
        D4["✅ PRODUCT READY\nDemanda validada e\npronta para preparação\nde artefatos"]
    end

    subgraph S4 ["4 - Racionalização"]
        direction TB
        R1["Responsável: CTO/PO"]
        R2["Entende o negócio\ne objetivo"]
        R3["Define escopo inicial\ne regras"]
        R4["Mapeia impacto técnico,\nintegrações e riscos"]
        R5["Define critérios\nde sucesso"]
    end

    subgraph S5 ["5 - Readiness Package"]
        direction TB
        RP1["Artefatos prontos\npara execução"]
        RP2["Entrega ao PM com tudo\nnecessário para\nplanejamento e quebra\ntécnica"]
        RP3["✅ Demanda sai do Intake\nsomente quando está\nPRONTA para execução"]
    end

    subgraph S6 ["6 - Feedback Loop"]
        direction TB
        F1["Aprendizado contínuo"]
        F2["Após entrega, coleta\nresultados, aprendizado\ne satisfação para\nalimentar prioridades\ne melhorar o processo"]
    end

    S1 --> S2 --> S3 --> S4 --> S5 --> S6

    style S1 fill:#e8f4f8,stroke:#2196F3,color:#000
    style S2 fill:#fff8e1,stroke:#FF9800,color:#000
    style S3 fill:#f3e5f5,stroke:#9C27B0,color:#000
    style S4 fill:#fff8e1,stroke:#FF9800,color:#000
    style S5 fill:#d4edda,stroke:#28a745,color:#000
    style S6 fill:#f3e5f5,stroke:#9C27B0,color:#000
```

---

## 4. O que o Intake Produz — Readiness Package

```mermaid
mindmap
  root((Readiness Package))
    Contexto
      1 - Resumo Executivo
      2 - Contexto e Problema
      3 - Objetivos e Resultado Esperado
    Escopo
      4 - Escopo Incluído e Excluído
      5 - Personas Impactadas
      6 - Regras de Negócio e Fluxos
    Técnico
      7 - Integrações Necessárias
      8 - Impacto Técnico e Arquitetura
    Riscos
      9 - Riscos e Dependências
    Recursos
      10 - Avaliação Interna de Esforço e Custo
    Critérios
      11 - Critérios de Sucesso e Aceite
      12 - Roadmap Sugerido
```

---

## 5. Entrega para o Downstream

```mermaid
flowchart LR
    RP["📄 Readiness Package\nAprovado"]

    subgraph EP ["Execution Plan - PM"]
        EP1["Avaliação de capacidade"]
        EP2["Sequenciamento de demandas"]
        EP3["Mapa de milestones"]
        EP4["Estrutura de sprints"]
        EP5["Gatilhos de escalação"]
    end

    subgraph PB ["Product Backlog - PO"]
        PB1["Épicos"]
        PB2["Histórias de usuário"]
        PB3["Critérios de aceite"]
        PB4["Edge cases"]
        PB5["Jornadas do usuário"]
    end

    subgraph TB ["Tech Backlog - Tech Lead"]
        TB1["ADRs - Decisões arquiteturais"]
        TB2["Tasks técnicas por história"]
        TB3["Estimativas refinadas"]
        TB4["Definition of Done"]
        TB5["Estratégia de rollout"]
    end

    RP --> EP
    RP --> PB
    PB --> TB

    style EP fill:#e8f4f8,stroke:#2196F3,color:#000
    style PB fill:#fff8e1,stroke:#FF9800,color:#000
    style TB fill:#e8f5e9,stroke:#4CAF50,color:#000
```

---

## 6. Gestão de Riscos

```mermaid
quadrantChart
    title Matriz de Risco — Probabilidade vs Impacto
    x-axis Baixa Probabilidade --> Alta Probabilidade
    y-axis Baixo Impacto --> Alto Impacto
    quadrant-1 Mitigar Ativamente
    quadrant-2 Monitorar
    quadrant-3 Aceitar
    quadrant-4 Plano de Contingência
    Bloqueador externo Azure AD: [0.5, 0.85]
    Atraso infraestrutura sa-east-1: [0.35, 0.9]
    Conflito de schema entre demandas: [0.4, 0.7]
    Rejeição do PM no RP: [0.3, 0.5]
    Atraso de QA: [0.3, 0.4]
    Baixa adoção pós-release: [0.25, 0.6]
```

---

## 7. Quem Faz o Quê — Matriz de Responsabilidades

```mermaid
block-beta
  columns 6
  block:roles:1
    R["Papel"]
  end
  block:intake:1
    I["Intake"]
  end
  block:triage:1
    T["Triagem"]
  end
  block:rational:1
    RA["Racionalização"]
  end
  block:plan:1
    P["Planejamento"]
  end
  block:exec:1
    E["Execução"]
  end

  block:ceo_r:1
    CEO["CEO"]
  end
  block:ceo_i:1
    CI["✅ Origina"]
  end
  block:ceo_t:1
    CT["—"]
  end
  block:ceo_ra:1
    CRA["—"]
  end
  block:ceo_p:1
    CP["—"]
  end
  block:ceo_e:1
    CE["—"]
  end
```

---

## 8. Sequência de Handoffs

```mermaid
sequenceDiagram
    participant UP as Upstream
    participant PO as PO
    participant CTO as CTO
    participant PM as PM
    participant TL as Tech Leads
    participant ENG as Engineers
    participant QA as QA

    UP->>PO: Intake estruturado
    PO->>PO: Triagem inicial
    alt Architectural impact
        PO->>CTO: Escalada técnica
        CTO-->>PO: Constraints e avaliação
    end
    PO->>PM: Readiness Package completo
    PM->>PM: Avaliação de capacidade
    PM->>TL: Plano de execução + RP
    TL->>TL: Quebra técnica
    TL->>ENG: Tasks definidas + contexto
    ENG->>QA: Implementação completa
    QA-->>PM: Release aprovado
    PM-->>UP: Entrega completa + feedback coletado
```

---

## 9. Estados de uma Demanda

```mermaid
stateDiagram-v2
    [*] --> Capturada : Intake registrado

    Capturada --> EmTriagem : PO recebe

    EmTriagem --> Rejeitada : Fora da estratégia
    EmTriagem --> BacklogOportunidade : Valioso, mas não agora
    EmTriagem --> Discovery : Informações insuficientes
    EmTriagem --> ProductReady : Contexto suficiente

    Discovery --> EmTriagem : Findings documentados
    Discovery --> BacklogOportunidade : Não foi possível validar

    ProductReady --> EmRacionalização : PO inicia preparo

    EmRacionalização --> AvaliacaoCTO : Impacto arquitetural identificado
    AvaliacaoCTO --> EmRacionalização : CTO entrega assessment

    EmRacionalização --> ReadinessPackagePronto : Todas as 12 seções completas

    ReadinessPackagePronto --> EmRevisaoPM : Enviado ao PM
    EmRevisaoPM --> ReadinessPackagePronto : PM rejeita - retorna ao PO
    EmRevisaoPM --> EmPlanejamento : PM aprova

    EmPlanejamento --> EmQuebraTecnica : Tech Leads recebem
    EmQuebraTecnica --> EmDesenvolvimento : Tasks definidas
    EmDesenvolvimento --> EmQA : Implementação completa
    EmQA --> Entregue : Release aprovado

    Entregue --> FeedbackLoop : PM inicia em 5 dias úteis
    FeedbackLoop --> [*] : Aprendizados incorporados ao backlog

    Rejeitada --> [*]
    BacklogOportunidade --> EmTriagem : Revisão de backlog
```

---

## 10. Regras de Ouro do Intake

```mermaid
flowchart TD
    R1["1 - PROBLEMA ANTES DA SOLUÇÃO\nEntendemos profundamente o problema\nantes de propor qualquer solução"]
    R2["2 - VALOR ESTRATÉGICO\nFocamos no que gera impacto para\nclientes, negócio e produto"]
    R3["3 - CONTEXTO COMPLETO\nSó avançamos quando temos contexto\nsuficiente para decidir com qualidade"]
    R4["4 - DISCIPLINA DE PORTA\nCada fase só avança quando estiver\npronto (readiness package)"]
    R5["5 - TRANSPARÊNCIA TOTAL\nRiscos, integrações e custos sempre\nidentificados antes de compromissos"]
    R6["6 - APRENDIZADO CONTÍNUO\nCada ciclo gera aprendizado que\nmelhora nossas decisões futuras"]

    R1 --> R2 --> R3 --> R4 --> R5 --> R6

    style R1 fill:#e8f4f8,stroke:#2196F3,color:#000
    style R2 fill:#fff8e1,stroke:#FF9800,color:#000
    style R3 fill:#e8f5e9,stroke:#4CAF50,color:#000
    style R4 fill:#f3e5f5,stroke:#9C27B0,color:#000
    style R5 fill:#fce4ec,stroke:#E91E63,color:#000
    style R6 fill:#e0f2f1,stroke:#009688,color:#000
```

---

## 11. Fluxo Resumido do Processo

```mermaid
flowchart LR
    D(["📥 Demanda\nCliente, mercado,\nideia ou dado"])
    CA["📝 Captura\nRegistro estruturado\nno intake"]
    TR["🔍 Triagem\nCTO/PO avalia\ne define caminho"]
    RA["📦 Racionalização\nCriação dos artefatos\ne visão de produto"]
    RP(["📄 Readiness Package\nPronto para\nplanejamento"])
    PL["📋 Planejamento\nPM organiza execução\ne roadmap"]
    QB["⚙️ Quebra Técnica\nTech Leads definem\ne estimam"]
    EX["👨‍💻 Execução\nEngenharia entrega\nvalor ao cliente"]
    FB["🔁 Feedback\nMede resultado\ne alimenta o ciclo"]

    D --> CA --> TR --> RA --> RP --> PL --> QB --> EX --> FB --> D

    style D fill:#e8f4f8,stroke:#2196F3,color:#000
    style RP fill:#d4edda,stroke:#28a745,color:#000
    style FB fill:#f3e5f5,stroke:#9C27B0,color:#000
```

---

## 12. Índice de Artefatos

| Artefato | Dono | Quando é criado | Arquivo de referência |
|---|---|---|---|
| Intake Record | Sales / CS / CEO | No momento da captura | `01-intake-*.md` |
| Readiness Package | PO + CTO | Após triagem Product Ready | `03-readiness-package-*.md` / `04-readiness-package-*.md` |
| Execution Plan | PM | Após aprovação do RP | `05-execution-plan.md` |
| Product Backlog | PO | Após aprovação do RP | `06.1-product-backlog-*.md` / `07.1-product-backlog-*.md` |
| Tech Backlog | Tech Lead | Após Product Backlog baselined | `06.2-tech-backlog-*.md` / `07.2-tech-backlog-*.md` |

---

## 13. Resultado Esperado

> **Equipes alinhadas, decisões melhores, entregas mais rápidas e clientes mais satisfeitos.**
