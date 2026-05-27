// DemandOS — Protótipo Unificado (v167 + Fase2 v9 + Defensibilidade)
// Foco: experiência estado-da-arte, KPIs relevantes, momentos WOW por persona.
// Adições principais:
//   1. Trace-to-source (toda afirmação tem proveniência rastreável)
//   2. AI Impact Meter (horas economizadas / % automatizado por artefato)
//   3. KPIs pay-justifying por persona (custo de atraso, ROI realizado, reuso de ADR, etc.)

import React, { useState, useEffect, useRef, createContext, useContext, useMemo } from 'react';
import {
  Plus, FileText, Mic, Paperclip, X, Check, ChevronRight, ChevronDown,
  AlertCircle, AlertTriangle, CheckCircle2, Circle, MessageSquare, Bell,
  Home, Inbox, Archive, Settings, BookOpen, Layers, Send, Edit3,
  Sparkles, Search, ArrowRight, ArrowLeft, Clock, User, Users,
  LogOut, ChevronLeft, Loader2, Square, Play, Pause, Trash2, Eye,
  Award, Timer, Activity, AlertOctagon, GitBranch, Shield, TrendingUp,
  TrendingDown, Briefcase, DollarSign, Target, Lock, Link2, BookMarked,
  Zap, Cpu, Database, Network, Filter, Hash, ExternalLink, Info,
} from 'lucide-react';

// ============================================================
// DESIGN TOKENS
// ============================================================
const COLORS = {
  bg: '#FAFAF9',
  bgElevated: '#FFFFFF',
  bgSubtle: '#F5F5F4',
  border: '#E7E5E4',
  borderStrong: '#D6D3D1',
  textPrimary: '#1C1917',
  textSecondary: '#57534E',
  textMuted: '#A8A29E',
  textInverse: '#FAFAF9',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  ai: '#8B5CF6',
};

const PERSONAS = {
  submitter: { id: 'submitter', name: 'Carlos Silva', role: 'COO', label: 'Submitter', color: '#3B82F6', initials: 'CS', desc: 'Cria novas demandas e acompanha status' },
  po:        { id: 'po',        name: 'Marina Costa', role: 'PO',  label: 'Product Owner', color: '#F97316', initials: 'MC', desc: 'Triagem, Racionalização, Readiness Package' },
  cto:       { id: 'cto',       name: 'Rafael Lima',  role: 'CTO', label: 'CTO', color: '#8B5CF6', initials: 'RL', desc: 'Avaliação técnica, ADRs, decisões arquiteturais' },
  pm:        { id: 'pm',        name: 'Juliana Reis', role: 'PM',  label: 'Project Manager', color: '#10B981', initials: 'JR', desc: 'Recebe RP congelado, valida, aceita ou devolve' },
  viewer:    { id: 'viewer',    name: 'Ana Santos',   role: 'CFO', label: 'Viewer (CFO)', color: '#6B7280', initials: 'AS', desc: 'Lê RPs, comenta, acompanha investimento e ROI' },
};

// ============================================================
// DATA: DEM-2026-001 (caso vivo do fluxo)
// ============================================================
const INITIAL_CAPTURE_PENDENCIES = [
  { id: 'cap-1', q: 'Qual problema essa demanda resolve?', a: 'A plataforma cobra clientes via boleto/transferência com processo manual de reconciliação. O modelo precisa migrar para cartão de crédito recorrente para reduzir esforço operacional e inadimplência.', confidence: 94, source: 'PDF estrategia-monetizacao.pdf p.2-3', status: 'resolved' },
  { id: 'cap-2', q: 'Quem é o originador e em que contexto?', a: 'Carlos Silva, COO. Reunião de planejamento estratégico do Q2 2026.', confidence: 100, source: 'Submitter direto', status: 'resolved' },
  { id: 'cap-3', q: 'Quem é impactado?', a: 'Clientes pagantes ativos e time financeiro', confidence: 72, source: 'PDF estrategia-monetizacao.pdf p.4', status: 'low_confidence', hint: 'A confiança ficou baixa porque o documento não citou explicitamente o time de CS, que pode ser impactado por suporte de cobrança.' },
  { id: 'cap-4', q: 'Qual a urgência e por quê?', a: '90 dias. Meta de operacionalizar até fim do trimestre para reduzir esforço manual de cobrança.', confidence: 92, source: 'PDF + texto Submitter', status: 'resolved' },
  { id: 'cap-5', q: 'Existem restrições conhecidas? (prazo, regulatório, orçamento)', a: '', confidence: 0, source: '', status: 'empty' },
  { id: 'cap-6', q: 'Há expectativa de receita ou economia mensurável?', a: 'Redução de ~30h/mês em reconciliação', confidence: 68, source: 'PDF + estimativa', status: 'low_confidence', hint: 'A confiança ficou baixa porque o impacto em inadimplência foi mencionado mas não quantificado no documento original.' },
  { id: 'cap-7', q: 'Existe algum documento ou conversa anterior sobre isso?', a: 'PDF de estratégia anexado: estrategia-monetizacao.pdf', confidence: 100, source: 'Anexo', status: 'resolved' },
  { id: 'cap-8', q: 'Quem precisa estar a par desta demanda? (stakeholders)', a: '', confidence: 0, source: '', status: 'empty' },
];

const INITIAL_ATTACHMENTS = [
  { id: 'att-1', name: 'estrategia-monetizacao.pdf', size: '2.3 MB', type: 'pdf', pages: 8 },
];

const INITIAL_TRIAGE_ITEMS = [
  { id: 'tri-1', q: 'Demanda é real e tem evidência?', suggestion: 'Sim. PDF de estratégia do COO + meta declarada em comitê + economia operacional mensurável.', confidence: 92, decision: null, justification: '' },
  { id: 'tri-2', q: 'Alinhada com roadmap?', suggestion: 'Sim. Está no pilar "Eficiência Operacional" do roadmap Q2-Q3 2026, com prioridade declarada do COO.', confidence: 88, decision: null, justification: '' },
  { id: 'tri-3', q: 'Há incógnitas bloqueantes?', suggestion: 'Não bloqueantes. Há decisão técnica em aberto (qual gateway), mas é resolvível no Discovery do PO.', confidence: 85, decision: null, justification: '' },
  { id: 'tri-4', q: 'Premissas a validar?', suggestion: 'Sim, 2 premissas críticas: (1) % de clientes que aceitam migrar opt-in; (2) viabilidade técnica de chargeback no parceiro escolhido.', confidence: 90, decision: null, justification: '' },
  { id: 'tri-5', q: 'Caminho da demanda', suggestion: 'Recomendação: Product Ready. Contexto é claro, incógnitas são resolvíveis no Discovery do PO.', confidence: 87, decision: null, justification: '', isPath: true },
];

const INITIAL_RATIONALIZATION_PENDENCIES = [
  { id: 'rac-1',  q: 'Definição clara do problema',           section: 'Contexto',      a: 'Cobrança por boleto gera ~30h/mês de reconciliação manual e inadimplência de 18%. Problema operacional + impacto financeiro.', confidence: 90, status: 'low_confidence', hint: 'Falta quantificar impacto em NPS dos clientes.' },
  { id: 'rac-2',  q: 'Objetivos de negócio mensuráveis',      section: 'Contexto',      a: '', confidence: 0, status: 'empty' },
  { id: 'rac-3',  q: 'Personas impactadas',                   section: 'Contexto',      a: 'Clientes pagantes (B2B), time financeiro, CS, jurídico.', confidence: 75, status: 'low_confidence', hint: 'Não está claro se inclui clientes pessoa física do plano free.' },
  { id: 'rac-4',  q: 'Premissas a validar',                   section: 'Contexto',      a: 'Premissa: 40% dos clientes aceitam migração opt-in nos primeiros 6 meses.', confidence: 60, status: 'low_confidence', hint: 'O número 40% precisa ser validado com CS antes do congelamento.' },
  { id: 'rac-5',  q: 'Escopo: o que ENTRA na entrega',        section: 'Escopo',        a: '', confidence: 0, status: 'empty' },
  { id: 'rac-6',  q: 'Escopo: o que NÃO entra',               section: 'Escopo',        a: '', confidence: 0, status: 'empty' },
  { id: 'rac-7',  q: 'Regras de negócio',                     section: 'Regras',        a: '', confidence: 0, status: 'empty' },
  { id: 'rac-8',  q: 'Critérios de aceite',                   section: 'Validação',     a: '', confidence: 0, status: 'empty' },
  { id: 'rac-9',  q: 'Critérios de sucesso (métricas)',       section: 'Validação',     a: '', confidence: 0, status: 'empty' },
  { id: 'rac-10', q: 'Riscos de produto',                     section: 'Riscos',        a: '', confidence: 0, status: 'empty' },
  { id: 'rac-11', q: 'Stakeholders e responsabilidades',      section: 'Stakeholders',  a: '', confidence: 0, status: 'empty' },
  { id: 'rac-12', q: 'Dependências externas',                 section: 'Dependências',  a: '', confidence: 0, status: 'empty' },
];

const TRIAGE_QUEUE = [
  { id: 'DEM-2026-001', title: 'Gateway de Pagamento Recorrente',     from: 'Carlos Silva (COO)', priority: 'Crítica', priorityColor: '#EF4444', arrived: 'há 3h',   sla: '21h restantes',  preview: 'Plataforma precisa receber pagamento por cartão recorrente. Hoje é tudo boleto...', isMain: true,  impact: 'R$ 78k/ano' },
  { id: 'DEM-2026-002', title: 'Integração SAP enterprise',           from: 'Carlos Silva (COO)', priority: 'Alta',    priorityColor: '#F97316', arrived: 'há 1 dia', sla: '2 dias restantes', preview: 'Cliente Acme pediu integração com SAP deles',                                            impact: 'R$ 145k de deal' },
  { id: 'DEM-2026-003', title: 'Filtro de exportação no relatório',   from: 'Maria Pereira (CS)', priority: 'Média',   priorityColor: '#F59E0B', arrived: 'há 2 dias', sla: '5 dias restantes', preview: 'CS precisa filtrar relatório por data customizada',                                       impact: '8h/mês CS' },
  { id: 'DEM-2026-004', title: 'Renomear campos no dashboard',        from: 'João Reis (Sales)',  priority: 'Baixa',   priorityColor: '#6B7280', arrived: 'há 3 dias', sla: '7 dias restantes', preview: 'Os nomes atuais confundem o time comercial',                                              impact: 'UX' },
];

const ACTIVE_RATIONALIZATIONS = [
  { id: 'DEM-2025-099', title: 'Sistema de notificações push',  score: 65 },
  { id: 'DEM-2025-098', title: 'Refatoração do módulo de billing', score: 30 },
  { id: 'DEM-2025-097', title: 'Onboarding de novos usuários',  score: 80 },
];

const INITIAL_TECH_PENDENCIES = [
  { id: 'tech-1',  q: 'Impacto arquitetural',                     section: 'Arquitetura',   a: '', confidence: 0, status: 'empty' },
  { id: 'tech-2',  q: 'ADRs necessárias',                         section: 'Arquitetura',   a: '', confidence: 0, status: 'empty', isAdrs: true },
  { id: 'tech-3',  q: 'Sistemas afetados',                        section: 'Arquitetura',   a: '', confidence: 0, status: 'empty' },
  { id: 'tech-4',  q: 'Componentes a criar/modificar',            section: 'Arquitetura',   a: '', confidence: 0, status: 'empty' },
  { id: 'tech-5',  q: 'Dependências técnicas',                    section: 'Dependências',  a: '', confidence: 0, status: 'empty' },
  { id: 'tech-6',  q: 'Riscos técnicos identificados',            section: 'Riscos',        a: '', confidence: 0, status: 'empty' },
  { id: 'tech-7',  q: 'Considerações de segurança',               section: 'Segurança',     a: '', confidence: 0, status: 'empty' },
  { id: 'tech-8',  q: 'Considerações de performance',             section: 'Performance',   a: '', confidence: 0, status: 'empty' },
  { id: 'tech-9',  q: 'Considerações de escalabilidade',          section: 'Performance',   a: '', confidence: 0, status: 'empty' },
  { id: 'tech-10', q: 'Estratégia de testes',                     section: 'Validação',     a: '', confidence: 0, status: 'empty' },
  { id: 'tech-11', q: 'Estratégia de rollout',                    section: 'Operação',      a: '', confidence: 0, status: 'empty' },
  { id: 'tech-12', q: 'Plano de rollback',                        section: 'Operação',      a: '', confidence: 0, status: 'empty' },
  { id: 'tech-13', q: 'Observabilidade necessária',               section: 'Operação',      a: '', confidence: 0, status: 'empty' },
  { id: 'tech-14', q: 'Estimativa de esforço (dias úteis)',       section: 'Esforço',       a: '', confidence: 0, status: 'empty' },
  { id: 'tech-15', q: 'Time recomendado',                         section: 'Esforço',       a: '', confidence: 0, status: 'empty' },
];

const TECH_SUGGESTIONS = {
  'tech-1':  { text: 'Médio. Introduz dependência externa nova (Stripe) e novo subsistema de cobrança recorrente. Toca Billing Service, Customer API, Notification Service.', confidence: 88 },
  'tech-3':  { text: 'Billing Service (refactor), Customer API (novo endpoint /payment-methods), Notification Service (templates), Audit Log (eventos PCI).', confidence: 92 },
  'tech-4':  { text: 'NOVO: PaymentProvider interface + StripeAdapter + WebhookHandler. MODIFICAR: BillingService (orquestração), CustomerProfile (campo payment_method).', confidence: 86 },
  'tech-5':  { text: 'Stripe SDK (node), Vault interno tokenizado, Audit Log v2, Feature Flag service.', confidence: 90 },
  'tech-6':  { text: '(1) Chargeback inesperado em 30d. (2) Latência webhook em pico. (3) Falha conciliação ERP em estorno. (4) Resistência clientes enterprise.', confidence: 87 },
  'tech-7':  { text: 'PCI-DSS via tokenização (nenhum PAN persiste). LGPD: consentimento explícito + DPA assinado com Stripe.', confidence: 94 },
  'tech-8':  { text: 'Webhook deve processar 99,9% em <5s. Cobrança batch noturna processa até 10k cobranças em <30min.', confidence: 82 },
  'tech-9':  { text: 'Stripe escala automaticamente. Internamente: queue assíncrona para webhook (Bull/Redis), batch processing com worker pool.', confidence: 88 },
  'tech-10': { text: 'Unit ≥80% PaymentService. Integração com Stripe sandbox. E2E fluxo opt-in. Load test 10x picos atuais.', confidence: 90 },
  'tech-11': { text: 'Canário 5% → 25% → 50% → 100% em 3 semanas, com kill-switch por feature flag.', confidence: 95 },
  'tech-12': { text: 'Feature flag global por cliente. Em incidente: desativar flag, clientes voltam a boleto, eventos pending re-enfileirados.', confidence: 93 },
  'tech-13': { text: 'Dashboards: latência webhook, taxa falha cobrança, distribuição chargeback, % migração por cohort. Alertas: webhook offline >1min, falha >5% em 5min.', confidence: 91 },
  'tech-14': { text: '34 dias úteis. Breakdown: 12d backend, 8d frontend, 6d integração, 5d rollout, 3d buffer (20%).', confidence: 86 },
  'tech-15': { text: '2 backend sêniors + 1 frontend pleno. Revisão pontual do CTO em decisões críticas (ADR review, code review de pontos PCI).', confidence: 89 },
};

const SUGGESTED_ADRS = [
  { id: 'ADR-100', title: 'Camada de abstração de Payment Provider', context: 'Precisamos suportar troca de provider sem reescrita.', decision: 'Criar interface PaymentProvider e implementar StripeAdapter.', alternatives: 'Acoplar Stripe diretamente (rejeitado: lock-in).', consequences: 'Custo inicial maior, flexibilidade longa.', category: 'Arquitetura' },
  { id: 'ADR-101', title: 'Webhook handler idempotente com retry exponencial', context: 'Garantir entrega de eventos do gateway sem duplicar cobrança.', decision: 'Implementar handler idempotente com chave única + retry exponencial.', alternatives: 'Processar inline sem retry (rejeitado: perde eventos).', consequences: 'Latência maior em primeira tentativa, mas resiliência.', category: 'Arquitetura' },
  { id: 'ADR-102', title: 'Vault tokenizado para dados de cartão', context: 'PCI-DSS exige não armazenar PAN.', decision: 'Tokenizar via Stripe Vault, armazenar só payment_method_id.', alternatives: 'Cofre próprio (rejeitado: complexidade PCI).', consequences: 'Zero dados sensíveis localmente, dependência forte do Stripe.', category: 'Segurança' },
  { id: 'ADR-103', title: 'Estratégia de migração opt-in', context: 'Clientes em boleto precisam consentir migração.', decision: 'Feature flag por cliente + UI de consentimento explícito + grace period 30d.', alternatives: 'Migração forçada (rejeitado: risco contratual).', consequences: 'Migração mais lenta, mas zero risco legal.', category: 'Operação' },
];

const OTHER_DEMANDS = [
  { id: 'DEM-2026-002', title: 'Integração SAP enterprise',   state: 'Em Triagem',        updated: 'há 1 dia' },
  { id: 'DEM-2025-099', title: 'Sistema de notificações push', state: 'Em Racionalização', updated: 'há 3 dias', score: 65 },
  { id: 'DEM-2025-095', title: 'Migração de auth',            state: 'Em Execução',       updated: 'há 18 dias' },
];

// ============================================================
// SHOWCASE: RP-2026-000 (caso "pronto" pra demonstração)
// ============================================================
const SHOWCASE_RP = {
  id: 'RP-2026-000',
  demandId: 'DEM-2026-000',
  version: 'v1.0',
  title: 'Notificações em tempo real via WebSocket',
  status: 'RP Congelado',
  frozenAt: 'há 4 dias',
  po: 'Marina Costa', cto: 'Rafael Lima', pm: 'Juliana Reis', submitter: 'Carlos Silva (COO)',
  scoreGeral: 100, confidence: 96, estimateDays: 28,
  stakeholders: ['Ana Santos (CFO)', 'Pedro Costa (Head Eng)', 'Lucia Mendes (CS Lead)'],
  // AI Impact por demanda
  aiImpact: {
    hoursSaved: 31, // h de trabalho que IA fez ao invés do humano
    automatedPct: 87, // % das pendências auto-respondidas
    discoveries: 2,
    adrsReusedFromKB: 2, // ADRs sugeridos da base, adaptados
    similarDemandsFound: 3,
  },
  sections: [
    { id: 'sumario',   title: 'Sumário Executivo',           confidence: 100, content: 'Implementar sistema de notificações em tempo real para o produto principal, substituindo o polling atual (a cada 30s) por WebSocket. Reduzir custo de infra em ~R$ 18k/mês e melhorar percepção de "produto vivo" pelo cliente. Stack: Socket.io + Redis pub/sub. Estimativa: 28 dias úteis. 5 ADRs registradas, 4 riscos mapeados, rollout canário em 3 semanas.' },
    { id: 'contexto',  title: '1. Contexto e Problema',     confidence: 98,  content: 'Hoje o frontend faz polling a cada 30s para checar atualizações de status (pedidos, mensagens, alertas). Isso gera ~12M requests/dia de baixa eficiência (95% retornam vazio), causando picos no banco e custo de infra desnecessário. Clientes enterprise reclamam que mudanças "demoram a aparecer" — péssima percepção de produto.' },
    { id: 'objetivos', title: '2. Objetivos de Negócio',    confidence: 95,  content: 'Em 6 meses pós-rollout: (1) reduzir requests/dia de 12M para ≤500k; (2) reduzir custo de infra em R$ 18k/mês; (3) tempo de propagação de status de 30s para <2s p99; (4) reduzir reclamações de "demora" no NPS qualitativo em 50%.' },
    { id: 'escopo',    title: '3. Escopo (IN / OUT)',       confidence: 98,  content: 'IN: gateway WebSocket com Socket.io, Redis pub/sub para fanout, fallback automático para long-polling em browsers antigos, autenticação via JWT existente, reconexão automática com backoff exponencial, métricas e dashboards. OUT: notificações push mobile (já existem via Firebase), reescrita do cliente mobile (escopo separado), notificações por email (já existem via Sendgrid).' },
    { id: 'personas',  title: '4. Personas Impactadas',     confidence: 92,  content: 'Usuários finais de todos os planos (free, pro, enterprise — total ~28k MAU). Time de engenharia (operação). Time de infra (custos). CS (suporte responde menos tickets de "não atualiza").' },
    { id: 'regras',    title: '5. Regras de Negócio',       confidence: 94,  content: '1) Eventos críticos (pagamento, status de pedido) garantem entrega via fallback para polling se WS falhar. 2) Cliente pode receber até 50 eventos/min antes de throttle. 3) Conexões idle por mais de 5min são fechadas. 4) Reconexão automática até 5 tentativas antes de fallback. 5) Auditoria de todos eventos via log estruturado.' },
    { id: 'aceite',    title: '6. Critérios de Aceite',     confidence: 96,  content: 'Conexão estabelecida em <1s p95. Evento entregue em <2s p99. Reconexão transparente para o usuário (sem reload). Fallback ativo automaticamente se WS indisponível. Load test com 10k conexões simultâneas sem degradação. Cobertura de testes ≥80% no gateway.' },
    { id: 'sucesso',   title: '7. Critérios de Sucesso',    confidence: 94,  content: 'Métricas medidas 30/60/90d pós-rollout: % requests reduzidos, R$ economia de infra, tempo médio propagação, NPS qualitativo. Critério de "sucesso completo": atingir 3 das 4 metas em 90 dias.' },
    { id: 'riscos-p',  title: '8. Riscos de Produto',       confidence: 90,  content: '4 riscos: (1) clientes em corporate firewalls bloqueiam WS — mitigado por fallback automático; (2) carga inesperada em horário de pico — mitigado por load test prévio; (3) bug em reconexão drena bateria mobile — mitigado por backoff exponencial; (4) custos de Redis subestimados — mitigado por revisão pós-piloto.' },
    { id: 'adrs',      title: '9. ADRs (Decisões Arquiteturais)', confidence: 100, content: 'adrs' },
    { id: 'sistemas',  title: '10. Sistemas Afetados',      confidence: 100, content: 'API Gateway (nova rota /ws), Notification Service (refactor de publisher), Frontend Web (novo client SDK), Frontend Mobile (delegado pra v2), Redis (nova instância dedicada pub/sub), Monitoring (novos dashboards e alertas).' },
    { id: 'seguranca', title: '11. Segurança e LGPD',       confidence: 96,  content: 'Autenticação JWT já existente reaproveitada — sem novo escopo. Mensagens não contêm PII (apenas IDs de recurso + tipo de evento). Cliente busca dados sensíveis via API REST tradicional após receber notificação. LGPD: nada novo a tratar. Auditoria via log estruturado já está em conformidade.' },
    { id: 'riscos-t',  title: '12. Riscos Técnicos',        confidence: 92,  content: 'Latência variável em regiões com conexão móvel ruim — mitigado por fallback. Memory leak em conexões antigas — testado em load test prévio. Race condition em fanout multi-instância — resolvido pelo design Redis pub/sub. Limite de file descriptors no host — instâncias dimensionadas com folga 3x.' },
    { id: 'rollout',   title: '13. Estratégia de Rollout',  confidence: 100, content: 'Semana 1: 5% dos usuários (cohort interno + free tier). Semana 2: 25%. Semana 3: 50%. Semana 4: 100%. Kill-switch global por feature flag. Em incidente: desativar flag, frontend volta a polling automaticamente, sem interrupção visível.' },
    { id: 'testes',    title: '14. Estratégia de Testes',   confidence: 95,  content: 'Unitários: cobertura ≥80% no gateway WS e Notification Service. Integração: cenários de conexão/reconexão/fallback com Redis real. E2E: jornada completa do usuário pelo frontend. Load test: 10k conexões simultâneas, ramp-up de 1h. Chaos test: Redis fora do ar, instâncias derrubadas.' },
    { id: 'observ',    title: '15. Observabilidade',        confidence: 94,  content: 'Dashboards: conexões ativas/instância, eventos publicados/s, latência p95/p99, taxa de fallback, taxa de reconexão. Alertas críticos: conexões totais >80% do limite, latência p99 >5s por 2min, taxa de erro >2% em 5min, Redis CPU >70%.' },
    { id: 'rollback',  title: '16. Plano de Rollback',      confidence: 98,  content: 'Feature flag por usuário e global. Em incidente crítico: desativar flag global, frontend cai em polling automaticamente em <30s. Sem perda de eventos pendentes (Redis persiste e re-entrega). RTO: <1min. RPO: zero.' },
    { id: 'estimativa',title: '17. Estimativa de Esforço',  confidence: 88,  content: '28 dias úteis. Breakdown: 10d backend (gateway WS + Redis pub/sub + auth), 6d frontend (client SDK + integração + fallback), 4d testes/integração, 5d rollout/observabilidade, 3d buffer. Time: 2 backend sêniors + 1 frontend pleno + revisão pontual do CTO.' },
  ],
  adrs: [
    { id: 'ADR-091', title: 'Socket.io como protocolo de WebSocket',     context: 'Precisamos suportar fallback automático para browsers e firewalls corporativos restritos.', decision: 'Adotar Socket.io que negocia automaticamente entre WS, long-polling e outros transports.', alternatives: 'WebSocket nativo (rejeitado: sem fallback). SignalR (rejeitado: stack majoritariamente Node).', consequences: 'Cliente JS oficial maduro. Trade-off: overhead leve do protocol de negociação inicial.', category: 'Arquitetura' },
    { id: 'ADR-092', title: 'Redis Pub/Sub para fanout multi-instância', context: 'Múltiplas instâncias do gateway precisam entregar evento ao usuário, esteja conectado a qualquer uma.', decision: 'Publicar todo evento no Redis. Cada instância subscreve e entrega aos clientes locais.', alternatives: 'Kafka (rejeitado: overkill para o caso). Tabela DB com polling (rejeitado: contradiz o objetivo).', consequences: 'Latência mínima adicional (~1ms). Dependência forte de Redis — mitigada com cluster.', category: 'Arquitetura' },
    { id: 'ADR-093', title: 'JWT existente para autenticação WS',        context: 'Cliente já autentica via JWT em chamadas REST.', decision: 'Reaproveitar JWT no handshake WS via query string ou header. Verificar a cada conexão.', alternatives: 'Token dedicado para WS (rejeitado: complexidade desnecessária).', consequences: 'Zero impacto em flow de auth existente. JWT expirado força reconexão.', category: 'Segurança' },
    { id: 'ADR-094', title: 'Fallback automático para polling em caso de falha', context: 'Alguns clientes corporativos bloqueiam WS por firewall.', decision: 'Cliente detecta falha de upgrade e cai em long-polling automaticamente, sem interação do usuário.', alternatives: 'Forçar WS e ignorar clientes incompatíveis (rejeitado: viola SLA enterprise).', consequences: 'UX preservada. Cliente em fallback tem latência maior mas funciona.', category: 'Operação' },
    { id: 'ADR-095', title: 'Throttling por usuário em 50 eventos/min',  context: 'Evitar abuso ou bug do publisher inundando cliente.', decision: 'Rate limiter no gateway: 50 eventos/min por conexão. Excedente é descartado com log.', alternatives: 'Sem limite (rejeitado: risco operacional). Limite global (rejeitado: penaliza usuários legítimos).', consequences: 'Eventos excedentes são perdidos mas logados. Usuário normal nunca atinge o limite.', category: 'Operação' },
  ],
  comments: [
    { id: 'sc-1', sectionId: 'objetivos', author: 'Ana Santos',   authorRole: 'CFO',      authorColor: '#6B7280', text: 'A meta de R$ 18k/mês de economia foi validada com infra?',     type: 'question', resolved: true,  response: 'Sim, infra validou. Estimativa baseada no atual gasto Redis + DB queries.' },
    { id: 'sc-2', sectionId: 'rollout',   author: 'Juliana Reis', authorRole: 'PM',       authorColor: '#10B981', text: 'Plano de comunicação com clientes enterprise durante rollout?', type: 'comment',  resolved: true,  response: 'CS preparou email + post no status page. Anexado no apêndice.' },
    { id: 'sc-3', sectionId: 'riscos-t',  author: 'Pedro Costa',  authorRole: 'Head Eng', authorColor: '#8B5CF6', text: 'O load test cobre cenário de 10k conexões com 100 eventos/s cada?', type: 'question', resolved: false },
  ],
  timeline: [
    { event: 'Demanda criada',                            by: 'Carlos Silva (COO)',  when: 'há 14 dias', icon: 'plus' },
    { event: 'Captura concluída (Score 100%)',            by: 'Carlos Silva',         when: 'há 13 dias', icon: 'check' },
    { event: 'Triagem — Product Ready',                   by: 'Marina Costa (PO)',    when: 'há 12 dias', icon: 'check' },
    { event: 'Discovery: pesquisa Socket.io vs WS nativo',by: 'Marina Costa',         when: 'há 10 dias', icon: 'search' },
    { event: 'Racionalização concluída',                  by: 'Marina Costa',         when: 'há 7 dias',  icon: 'layers' },
    { event: 'Avaliação técnica concluída (5 ADRs)',      by: 'Rafael Lima (CTO)',    when: 'há 5 dias',  icon: 'settings' },
    { event: 'RP v1.0 congelado',                         by: 'Marina Costa',         when: 'há 4 dias',  icon: 'check' },
  ],
};

// ============================================================
// PROVENANCE — origem rastreável por seção do RP
// (Cada seção do RP referencia: capture pendencies, discoveries, attachments, ADRs)
// Este é o pilar de DEFENSIBILIDADE: clique numa seção, veja de onde tudo veio.
// ============================================================
const PROVENANCE = {
  // Caso vivo: DEM-2026-001
  'live-contexto':   { capture: ['cap-1', 'cap-3'], attachments: ['att-1'], pages: 'p.2-4', discoveries: [], adrs: [], rationale: 'Capturado de PDF + complemento Submitter' },
  'live-objetivos':  { capture: ['cap-1', 'cap-4', 'cap-6'], attachments: ['att-1'], pages: 'p.5-6', discoveries: [], adrs: [], rationale: 'Meta do COO + estimativa do PDF' },
  'live-escopo':     { capture: ['cap-1'], attachments: ['att-1'], discoveries: ['disc-stripe'], adrs: ['ADR-100', 'ADR-103'], rationale: 'Discovery validou viabilidade Stripe + ADRs definiram limites' },
  'live-adrs':       { capture: [], attachments: [], discoveries: ['disc-stripe'], adrs: ['ADR-100', 'ADR-101', 'ADR-102', 'ADR-103'], rationale: 'Decisões registradas pelo CTO' },
  'live-riscos':     { capture: [], attachments: [], discoveries: ['disc-stripe'], adrs: ['ADR-102'], rationale: 'Riscos mapeados em avaliação técnica' },
  'live-rollout':    { capture: [], attachments: [], discoveries: [], adrs: ['ADR-103'], rationale: 'ADR de migração opt-in definiu estratégia' },
  'live-estimativa': { capture: [], attachments: [], discoveries: [], adrs: [], rationale: 'Estimativa do CTO (15 pendências técnicas + breakdown)' },

  // Showcase: RP-2026-000
  'show-contexto':  { capture: ['cap-X1'], attachments: ['att-X1'], pages: 'p.1-3', discoveries: ['disc-ws'],     adrs: [],                rationale: '12M req/dia validado em métricas; reclamações em tickets CS' },
  'show-objetivos': { capture: ['cap-X1'], attachments: [],          pages: '',     discoveries: ['disc-ws'],     adrs: [],                rationale: 'Metas calibradas com benchmark Discord/Notion' },
  'show-escopo':    { capture: [],         attachments: [],          discoveries: ['disc-ws-kb'], adrs: ['ADR-091', 'ADR-092', 'ADR-094'],            rationale: 'KB confirmou padrões; ADRs fecharam escopo' },
  'show-adrs':      { capture: [],         attachments: [],          discoveries: [],              adrs: ['ADR-091', 'ADR-092', 'ADR-093', 'ADR-094', 'ADR-095'], rationale: 'Avaliação técnica do CTO' },
  'show-rollout':   { capture: [],         attachments: [],          discoveries: [],              adrs: ['ADR-094'],            rationale: 'Estratégia de canário derivada da ADR-094' },
  'show-estimativa':{ capture: [],         attachments: [],          discoveries: [],              adrs: [],                     rationale: '17 pendências técnicas + breakdown do CTO' },
};

// Discoveries usados no caso (referenciados por PROVENANCE)
const DISCOVERIES_DB = {
  'disc-stripe': { id: 'disc-stripe', type: 'Pesquisa externa', title: 'Stripe / Pagar.me / Mercado Pago — comparativo', summary: '5 fontes, 6 critérios. Stripe vence em docs (EN+PT), chargeback avançado, LGPD com DPA. Custo: 3,99% + R$0,39.', date: 'há 5 dias', sources: 5 },
  'disc-ws':     { id: 'disc-ws',     type: 'Pesquisa externa', title: 'Socket.io vs WebSocket nativo vs SignalR', summary: 'Socket.io vence por fallback automático e maturidade do client.', date: 'há 11 dias', sources: 4 },
  'disc-ws-kb':  { id: 'disc-ws-kb',  type: 'Base de conhecimento', title: 'Padrões internos para pub/sub', summary: 'Encontradas 2 demandas similares (DEM-2025-040 e DEM-2025-067) com decisões análogas.', date: 'há 12 dias', sources: 2 },
};

// ============================================================
// AI IMPACT (por persona — quanto a plataforma economiza)
// ============================================================
const AI_IMPACT_PER_PERSONA = {
  submitter: {
    autoExtracted: 6,         // de 8 pendências de captura
    totalPendencies: 8,
    timeWithoutAI: '~3h',     // tempo médio que levaria sem AI (digitar tudo do zero)
    timeWithAI: '12min',      // tempo gasto agora (só completar lacunas)
    hoursSavedYTD: 27,        // demandas submetidas YTD * economia média
  },
  po: {
    avgTriageWithoutAI: '~45min', avgTriageWithAI: '~6min',   // por demanda
    avgRacWithoutAI:    '~6h',    avgRacWithAI:    '~1.2h',   // por demanda
    discoveriesAcceleradas: 14,
    hoursSavedYTD: 168,
  },
  cto: {
    avgEvalWithoutAI: '~8h', avgEvalWithAI: '~1.8h',
    adrsReusedFromKB: 8,     // ADRs que o sistema sugeriu da base e foram adaptados
    timeSavedPerADR: '~45min',
    hoursSavedYTD: 142,
  },
  pm: {
    avgRPReviewWithoutAI: '~3h', avgRPReviewWithAI: '~30min',
    gapsFoundByAI: 11,            // gaps que AI ajudou a identificar
    hoursSavedYTD: 87,
  },
  viewer: {
    rolesNotInRPMeetings: '~9 reuniões/mês evitadas',
    timeSavedYTD: 36,           // horas
  },
};

// ============================================================
// DRILL-DOWN DATA (KPI clicáveis)
// ============================================================
const DRILLDOWN_DATA = {
  // Submitter
  'submitter-impacto': {
    title: 'Impacto projetado das suas demandas em execução',
    columns: ['Demanda', 'Estado', 'Impacto anual', 'Status realização'],
    rows: [
      ['DEM-2026-001 — Gateway Pagamento',    'Em Racionalização', 'R$ 78k',  'Projetado'],
      ['DEM-2025-095 — Migração auth',        'Em Execução',       'R$ 142k', '74% no caminho'],
      ['DEM-2025-088 — Cobrança PIX',         'Em Execução',       'R$ 192k', '110% (excedeu)'],
    ],
  },
  'submitter-total': {
    title: 'Total de demandas submetidas (YTD)',
    columns: ['Demanda', 'Submetida em', 'Estado atual'],
    rows: [
      ['DEM-2026-001 — Gateway Pagamento',     'há 6 dias',   'Em Racionalização'],
      ['DEM-2026-002 — Integração SAP',        'há 8 dias',   'Em Triagem'],
      ['DEM-2025-099 — Notificações push',     'há 32 dias',  'Em Racionalização'],
      ['DEM-2025-098 — Refator billing',       'há 45 dias',  'Em Racionalização'],
      ['DEM-2025-097 — Onboarding',            'há 60 dias',  'Em Racionalização'],
      ['DEM-2025-095 — Migração auth',         'há 80 dias',  'Em Execução'],
      ['DEM-2025-094 — Performance dashboard', 'há 92 dias',  'Em Execução'],
      ['DEM-2025-088 — Cobrança PIX',          'há 120 dias', 'Em Execução'],
      ['DEM-2025-080 — Webhook customizado',   'há 130 dias', 'Rejeitada'],
      ['DEM-2025-077 — Onboarding mobile',     'há 135 dias', 'Backlog'],
      ['DEM-2025-070 — Múltiplas moedas',      'há 150 dias', 'Backlog'],
      ['DEM-2025-067 — Cobrança PIX v1',       'há 180 dias', 'Concluída'],
      ['DEM-2025-050 — Dashboard churn',       'há 200 dias', 'Arquivada'],
      ['DEM-2025-040 — Export relatórios',     'há 220 dias', 'Concluída'],
    ],
  },
  'submitter-execucao': {
    title: 'Demandas em execução',
    columns: ['Demanda', 'PM', 'Início', 'Previsão entrega'],
    rows: [
      ['DEM-2025-095 — Migração auth',          'Juliana Reis', 'há 18 dias', 'em 12 dias'],
      ['DEM-2025-094 — Performance dashboard',  'Juliana Reis', 'há 25 dias', 'em 5 dias'],
      ['DEM-2025-088 — Cobrança PIX',           'Juliana Reis', 'há 40 dias', 'concluída em 3d'],
    ],
  },
  'submitter-aieconomia': {
    title: 'Horas economizadas por IA nas suas demandas (YTD)',
    columns: ['Demanda', 'Horas s/ IA', 'Horas c/ IA', 'Economia'],
    rows: [
      ['DEM-2026-001 — Gateway Pagamento',     '3h',  '12min', '2h48min'],
      ['DEM-2026-002 — Integração SAP',        '4h',  '18min', '3h42min'],
      ['DEM-2025-099 — Notificações push',     '2.5h','10min', '2h20min'],
      ['DEM-2025-098 — Refator billing',       '4h',  '22min', '3h38min'],
      ['Total nas 14 demandas YTD',            '42h', '4h32min','37h28min'],
    ],
  },
  // PO
  'po-throughput': {
    title: 'RPs congelados este mês',
    columns: ['RP', 'Congelado em', 'Status'],
    rows: [
      ['RP-2026-008 — Cache distribuído',     'há 2 dias',  'Aceito PM'],
      ['RP-2026-007 — Refator pagamentos',    'há 5 dias',  'Em execução'],
      ['RP-2026-006 — Audit log v2',          'há 7 dias',  'Aceito PM'],
      ['RP-2026-005 — Migração auth',         'há 10 dias', 'Em execução'],
      ['RP-2026-004 — Performance dashboard', 'há 14 dias', 'Em execução'],
      ['RP-2026-003 — Notificações email',    'há 18 dias', 'Aceito PM'],
      ['RP-2026-002 — Onboarding',            'há 22 dias', 'v1.1 em revisão'],
      ['RP-2026-001 — Cobrança PIX',          'há 25 dias', 'Em execução'],
      ['RP-2025-099 — Filtros relatório',     'há 28 dias', 'Aceito PM'],
    ],
  },
  'po-triagem': { title: 'Demandas em triagem', columns: ['Demanda', 'Prioridade', 'SLA'], rows: TRIAGE_QUEUE.map(d => [`${d.id} — ${d.title}`, d.priority, d.sla]) },
  'po-rac': {
    title: 'Racionalizações em andamento',
    columns: ['Demanda', 'Score atual', 'Última atualização'],
    rows: [
      ['DEM-2026-001 — Gateway Pagamento',  '25%', 'agora'],
      ['DEM-2025-099 — Notificações push',  '65%', 'há 1 dia'],
      ['DEM-2025-098 — Refator billing',    '30%', 'há 2 dias'],
      ['DEM-2025-097 — Onboarding',         '80%', 'há 3 dias'],
    ],
  },
  'po-sla': {
    title: 'Demandas com SLA vencendo em 24h (custo de atraso)',
    columns: ['Demanda', 'Prioridade', 'Tempo restante', 'Custo de atraso'],
    rows: [
      ['DEM-2026-001 — Gateway Pagamento',   'Crítica', '21h', 'R$ 2.6k/dia'],
      ['DEM-2026-005 — Bug crítico no login','Crítica', '8h',  'R$ 18k/dia'],
    ],
  },
  'po-aceite': {
    title: 'RPs aceitos na 1ª versão (YTD)',
    columns: ['RP', 'PM', 'Tempo até aceite'],
    rows: [
      ['RP-2026-008 — Cache distribuído',     'Juliana Reis', '1.5d'],
      ['RP-2026-006 — Audit log v2',          'Juliana Reis', '2d'],
      ['RP-2026-005 — Migração auth',         'Juliana Reis', '1d'],
      ['RP-2026-004 — Performance dashboard', 'Juliana Reis', '3d'],
      ['RP-2026-003 — Notificações email',    'Juliana Reis', '2.5d'],
      ['RP-2026-001 — Cobrança PIX',          'Juliana Reis', '1.5d'],
    ],
  },
  'po-discovery': {
    title: 'Discoveries ativos',
    columns: ['Discovery', 'Tipo', 'Aberto há'],
    rows: [
      ['Stripe vs Pagar.me — DEM-2026-001',     'Pesquisa externa',     '1 dia'],
      ['Coleta com Carlos (COO) — DEM-2026-001','Coleta',               '4 horas'],
      ['Histórico billing — DEM-2025-098',      'Base de conhecimento', '3 dias'],
    ],
  },
  'po-aieconomia': {
    title: 'Tempo economizado por IA na sua produção (YTD)',
    columns: ['Etapa', 'Horas sem IA', 'Horas com IA', 'Economia / mês'],
    rows: [
      ['Triagem (28 demandas)',         '21h',  '2.8h',  '18.2h'],
      ['Racionalização (18 demandas)',  '108h', '21.6h', '86.4h'],
      ['Discoveries (14)',              '42h',  '14h',   '28h'],
      ['Total mensal médio',            '171h', '38.4h', '132.6h'],
    ],
  },
  // CTO
  'cto-backlog': {
    title: 'Esforço técnico em backlog',
    columns: ['Demanda', 'Estimativa', 'Status'],
    rows: [
      ['DEM-2026-001 — Gateway Pagamento',     '34d', 'Em avaliação'],
      ['DEM-2025-099 — Notificações push',     '21d', 'Av. concluída'],
      ['DEM-2025-098 — Refator billing',       '45d', 'Aguardando PO'],
      ['DEM-2025-097 — Onboarding',            '18d', 'Av. concluída'],
      ['DEM-2025-095 — Migração auth',         '28d', 'Em execução'],
      ['DEM-2025-094 — Performance dashboard', '14d', 'Em execução'],
      ['DEM-2025-088 — Cobrança PIX',          '27d', 'Em execução'],
    ],
  },
  'cto-pendentes': { title: 'Escalas técnicas pendentes', columns: ['Demanda', 'PO', 'Aguardando há'], rows: [['DEM-2026-001 — Gateway Pagamento', 'Marina Costa', '1 dia']] },
  'cto-andamento': {
    title: 'Avaliações em andamento',
    columns: ['Demanda', 'Score técnico', 'PO'],
    rows: [
      ['DEM-2025-095 — Migração auth',         '70%', 'Marina Costa'],
      ['DEM-2025-094 — Performance dashboard', '45%', 'Marina Costa'],
    ],
  },
  'cto-bloq': {
    title: 'Bloqueadores críticos sinalizados (YTD)',
    columns: ['Demanda', 'Quando', 'Resolução'],
    rows: [
      ['DEM-2025-080 — Webhook customizado', 'há 18d', 'Rejeitada na triagem'],
      ['DEM-2025-072 — IE11 legado',         'há 60d', 'Rejeitada'],
      ['DEM-2025-058 — Sync offline',        'há 90d', 'Backlog (re-design)'],
    ],
  },
  'cto-adrs': {
    title: 'ADRs criadas este mês',
    columns: ['ADR', 'Demanda', 'Categoria'],
    rows: [
      ['ADR-098 — Cache Redis Cluster',     'DEM-2025-094', 'Performance'],
      ['ADR-099 — JWT assimétrico',         'DEM-2025-095', 'Segurança'],
      ['ADR-100 — Provider abstrato',       'DEM-2026-001', 'Arquitetura'],
      ['ADR-101 — Webhook idempotente',     'DEM-2026-001', 'Arquitetura'],
      ['ADR-102 — Vault tokenizado',        'DEM-2026-001', 'Segurança'],
      ['ADR-103 — Migração opt-in',         'DEM-2026-001', 'Operação'],
      ['ADR-104 — Pool conexões',           'DEM-2025-094', 'Performance'],
      ['ADR-105 — Event sourcing audit',    'DEM-2026-006', 'Dados'],
      ['ADR-106 — Feature flag global',     'DEM-2026-007', 'Operação'],
      ['ADR-107 — RBAC granular',           'DEM-2026-008', 'Segurança'],
      ['ADR-108 — Saga payment',            'DEM-2026-001', 'Arquitetura'],
    ],
  },
  'cto-reuso': {
    title: 'ADRs reutilizadas (YTD) — IA encontrou similar e adaptou',
    columns: ['ADR original', 'Reusada em', 'Categoria', 'Tempo economizado'],
    rows: [
      ['ADR-067 — Event sourcing audit',  '3 demandas', 'Dados',       '~2h cada'],
      ['ADR-091 — Socket.io',             '2 demandas', 'Arquitetura', '~3h cada'],
      ['ADR-099 — JWT assimétrico',       '2 demandas', 'Segurança',   '~1.5h cada'],
      ['Total economizado YTD',           '8 reusos',   '—',           '~16h'],
    ],
  },
  'cto-retrabalho': {
    title: 'Re-trabalho v1.1 por questão técnica (YTD)',
    columns: ['RP', 'Motivo', 'Custo'],
    rows: [
      ['RP-2026-002 — Onboarding v1.1', 'Risco PCI não mapeado',    '4d'],
      ['RP-2025-099 — Push v1.1',       'Latência subestimada',     '2d'],
      ['RP-2025-095 — Auth v1.1',       'Cobertura de testes',      '3d'],
    ],
  },
  // PM
  'pm-aceite': {
    title: 'RPs aceitos na 1ª revisão',
    columns: ['RP', 'Categoria', 'Tempo até aceite'],
    rows: [
      ['RP-2026-008 — Cache distribuído',     'Performance',  '1.5d'],
      ['RP-2026-007 — Refator pagamentos',    'Arquitetura',  '2d'],
      ['RP-2026-006 — Audit log v2',          'Segurança',    '2d'],
      ['RP-2026-005 — Migração auth',         'Segurança',    '1d'],
      ['RP-2026-004 — Performance dashboard', 'Performance',  '3d'],
      ['RP-2026-003 — Notificações email',    'Produto',      '2.5d'],
      ['RP-2026-001 — Cobrança PIX',          'Produto',      '1.5d'],
    ],
  },
  'pm-aguardando': { title: 'RPs aguardando sua avaliação', columns: ['RP', 'Estimativa', 'Congelado há'], rows: [['RP-2026-001 v1.0 — Gateway Pagamento', '34d', 'agora']] },
  'pm-execucao': {
    title: 'Demandas em execução',
    columns: ['Demanda', 'Início', 'Previsão entrega'],
    rows: [
      ['DEM-2025-095 — Migração auth',         'há 18d', 'em 12d'],
      ['DEM-2025-094 — Performance dashboard', 'há 25d', 'em 5d'],
      ['DEM-2025-088 — Cobrança PIX',          'há 40d', 'concluída em 3d'],
    ],
  },
  'pm-gaps': {
    title: 'Gaps apontados (YTD) — acurácia 91%',
    columns: ['RP', 'Tipo de gap', 'Bloqueante?', 'Impacto na v1.1'],
    rows: [
      ['RP-2026-002 v1.0 — Onboarding',  'Escopo ambíguo',         'Sim', 'Conf. +24%'],
      ['RP-2026-002 v1.0 — Onboarding',  'Dados insuficientes',    'Sim', 'Conf. +18%'],
      ['RP-2025-099 v1.0 — Push',        'Estimativa irreal',      'Sim', 'Reestimado -3d'],
      ['RP-2025-097 v1.0 — Auth',        'Critério aceite vago',   'Não', 'Conf. +12%'],
      ['RP-2025-094 v1.0 — Performance', 'Risco técnico ausente',  'Não', 'ADR adicionada'],
    ],
  },
  // CFO (Viewer)
  'cfo-investimento': {
    title: 'Investimento total comprometido em RPs ativos',
    columns: ['RP', 'Categoria', 'Valor'],
    rows: [
      ['RP-2026-001 — Gateway Pagamento',     'CAPEX', 'R$ 340k'],
      ['RP-2026-008 — Notificações push',     'OPEX',  'R$ 280k'],
      ['RP-2026-007 — Refator billing',       'CAPEX', 'R$ 250k'],
      ['RP-2026-006 — Onboarding refeito',    'OPEX',  'R$ 220k'],
      ['RP-2026-005 — Migração auth',         'CAPEX', 'R$ 195k'],
      ['RP-2026-004 — Performance dashboard', 'OPEX',  'R$ 165k'],
      ['RP-2026-003 — Integração SAP',        'CAPEX', 'R$ 145k'],
      ['RP-2026-002 — Notificações email',    'OPEX',  'R$ 135k'],
      ['RP-2026-009 — Audit log v2',          'OPEX',  'R$ 110k'],
    ],
  },
  'cfo-roi': {
    title: 'ROI projetado total',
    columns: ['RP', 'Categoria de retorno', 'R$ anual'],
    rows: [
      ['RP-2026-001 — Gateway Pagamento',  'Redução inadimplência', 'R$ 78k'],
      ['RP-2025-088 — Cobrança PIX',       'Redução custo op.',     'R$ 142k'],
      ['RP-2025-095 — Migração auth',      'Ganho produtividade',   'R$ 35k'],
      ['RP-2025-094 — Performance',        'Aumento receita',       'R$ 49k'],
      ['RP-2026-006 — Onboarding',         'Redução custo op.',     'R$ 38k'],
      ['RP-2026-002 — Email',              'Ganho produtividade',   'R$ 43k'],
      ['RP-2026-008 — Push',               'Aumento receita',       'R$ 27k'],
    ],
  },
  'cfo-capex': {
    title: 'RPs que afetam CAPEX',
    columns: ['RP', 'Valor', 'Justificativa'],
    rows: [
      ['RP-2026-001 — Gateway Pagamento', 'R$ 340k', 'Infra de payment + integração'],
      ['RP-2026-007 — Refator billing',   'R$ 250k', 'Refactoring estrutural'],
      ['RP-2026-005 — Migração auth',     'R$ 195k', 'Nova arquitetura'],
      ['RP-2026-003 — Integração SAP',    'R$ 145k', 'Dev de conector'],
    ],
  },
  'cfo-realizado': {
    title: 'ROI realizado vs projetado (demandas concluídas YTD)',
    columns: ['RP', 'Projetado', 'Realizado', 'Δ'],
    rows: [
      ['RP-2025-067 — Cobrança PIX v1', 'R$ 120k', 'R$ 142k', '+18%'],
      ['RP-2025-040 — Export relatórios','R$ 25k',  'R$ 31k',  '+24%'],
      ['RP-2025-095 — Migração auth (parcial)','R$ 80k','R$ 76k','-5%'],
      ['RP-2025-094 — Performance dash.', 'R$ 40k',  'R$ 38k',  '-5%'],
      ['Total realizado',                 'R$ 265k', 'R$ 287k', '+8%'],
    ],
  },
};

// ============================================================
// CONTEXT + APP PROVIDER (estado completo unificado)
// ============================================================
const AppContext = createContext(null);
const useApp = () => useContext(AppContext);

function AppProvider({ children }) {
  const [persona, setPersona] = useState(null);
  const [route, setRoute] = useState({ screen: 'login' });
  const [capturePendencies, setCapturePendencies] = useState(INITIAL_CAPTURE_PENDENCIES);
  const [attachments, setAttachments] = useState(INITIAL_ATTACHMENTS);
  const [demandTitle] = useState('Gateway de Pagamento Recorrente');
  const [demandState, setDemandState] = useState('Em Captura');
  const [toast, setToast] = useState(null);
  const [triageItems, setTriageItems] = useState(INITIAL_TRIAGE_ITEMS);
  const [racPendencies, setRacPendencies] = useState(INITIAL_RATIONALIZATION_PENDENCIES);
  const [discoveryResults, setDiscoveryResults] = useState({});
  const [rpVersion, setRpVersion] = useState(null);
  const [techPendencies, setTechPendencies] = useState(INITIAL_TECH_PENDENCIES);
  const [adrs, setAdrs] = useState([]);
  const [rpComments, setRpComments] = useState([]);
  const [returnedGaps, setReturnedGaps] = useState([]);
  const [v11Changes, setV11Changes] = useState({});
  const [seenTours, setSeenTours] = useState(new Set());
  const [drilldown, setDrilldown] = useState(null);
  const [provenancePopup, setProvenancePopup] = useState(null); // { key }
  const [notifications, setNotifications] = useState([]);
  const [pendingCollects, setPendingCollects] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [racDraftSavedAt, setRacDraftSavedAt] = useState(null);
  const [triageDraftSavedAt, setTriageDraftSavedAt] = useState(null);
  const [techDraftSavedAt, setTechDraftSavedAt] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const addNotification = (notif) => {
    setNotifications(prev => [{ id: `n-${Date.now()}`, timestamp: new Date(), read: false, ...notif }, ...prev]);
  };

  const selectPersona = (id) => { setPersona(PERSONAS[id]); setRoute({ screen: 'dashboard' }); };
  const navigate = (screen, params = {}) => setRoute({ screen, ...params });

  const updatePendency      = (id, u) => setCapturePendencies(prev => prev.map(p => p.id === id ? { ...p, ...u } : p));
  const updateTriageItem    = (id, u) => setTriageItems(prev => prev.map(p => p.id === id ? { ...p, ...u } : p));
  const updateRacPendency   = (id, u) => setRacPendencies(prev => prev.map(p => p.id === id ? { ...p, ...u } : p));
  const updateTechPendency  = (id, u) => setTechPendencies(prev => prev.map(p => p.id === id ? { ...p, ...u } : p));

  const captureScore = useMemo(() => {
    const done = capturePendencies.filter(p => ['resolved', 'manually_accepted', 'not_applicable'].includes(p.status)).length;
    return Math.round((done / capturePendencies.length) * 100);
  }, [capturePendencies]);

  const captureStats = useMemo(() => ({
    total: capturePendencies.length,
    resolved: capturePendencies.filter(p => ['resolved', 'manually_accepted'].includes(p.status)).length,
    empty: capturePendencies.filter(p => p.status === 'empty').length,
    lowConf: capturePendencies.filter(p => p.status === 'low_confidence').length,
    na: capturePendencies.filter(p => p.status === 'not_applicable').length,
  }), [capturePendencies]);

  const triageScore = useMemo(() => {
    const decided = triageItems.filter(t => t.decision !== null).length;
    return Math.round((decided / triageItems.length) * 100);
  }, [triageItems]);

  const racScore = useMemo(() => {
    const done = racPendencies.filter(p => ['resolved', 'manually_accepted', 'not_applicable'].includes(p.status)).length;
    return Math.round((done / racPendencies.length) * 100);
  }, [racPendencies]);

  const racStats = useMemo(() => ({
    total: racPendencies.length,
    resolved: racPendencies.filter(p => ['resolved', 'manually_accepted'].includes(p.status)).length,
    empty: racPendencies.filter(p => p.status === 'empty').length,
    lowConf: racPendencies.filter(p => p.status === 'low_confidence').length,
    na: racPendencies.filter(p => p.status === 'not_applicable').length,
  }), [racPendencies]);

  const techScore = useMemo(() => {
    const done = techPendencies.filter(p => ['resolved', 'manually_accepted', 'not_applicable'].includes(p.status)).length;
    return Math.round((done / techPendencies.length) * 100);
  }, [techPendencies]);

  const techStats = useMemo(() => ({
    total: techPendencies.length,
    resolved: techPendencies.filter(p => ['resolved', 'manually_accepted'].includes(p.status)).length,
    empty: techPendencies.filter(p => p.status === 'empty').length,
    lowConf: techPendencies.filter(p => p.status === 'low_confidence').length,
    na: techPendencies.filter(p => p.status === 'not_applicable').length,
  }), [techPendencies]);

  return (
    <AppContext.Provider value={{
      persona, setPersona, selectPersona,
      route, navigate,
      capturePendencies, updatePendency, captureScore, captureStats, setCapturePendencies,
      attachments, setAttachments,
      demandTitle, demandState, setDemandState,
      toast, showToast,
      triageItems, updateTriageItem, triageScore, setTriageItems, triageDraftSavedAt, setTriageDraftSavedAt,
      racPendencies, updateRacPendency, racScore, racStats, setRacPendencies, racDraftSavedAt, setRacDraftSavedAt,
      discoveryResults, setDiscoveryResults,
      rpVersion, setRpVersion,
      techPendencies, setTechPendencies, updateTechPendency, techScore, techStats, techDraftSavedAt, setTechDraftSavedAt,
      adrs, setAdrs,
      rpComments, setRpComments,
      returnedGaps, setReturnedGaps,
      v11Changes, setV11Changes,
      seenTours, setSeenTours,
      drilldown, setDrilldown,
      provenancePopup, setProvenancePopup,
      notifications, setNotifications, addNotification,
      pendingCollects, setPendingCollects,
      chatOpen, setChatOpen,
      chatMessages, setChatMessages,
    }}>
      {children}
    </AppContext.Provider>
  );
}

// ============================================================
// UI ATOMS
// ============================================================
function Button({ children, variant = 'primary', size = 'md', onClick, disabled, className = '', icon: Icon, fullWidth }) {
  const { persona } = useApp();
  const personaColor = persona?.color || COLORS.info;
  const sizes = { sm: 'px-2.5 py-1.5 text-xs', md: 'px-3.5 py-2 text-sm', lg: 'px-4 py-2.5 text-sm' };
  const variants = {
    primary:   { backgroundColor: disabled ? COLORS.bgSubtle : personaColor, color: disabled ? COLORS.textMuted : 'white', borderColor: 'transparent' },
    secondary: { backgroundColor: 'transparent', color: disabled ? COLORS.textMuted : COLORS.textPrimary, borderColor: COLORS.borderStrong },
    danger:    { backgroundColor: COLORS.danger, color: 'white', borderColor: 'transparent' },
    ghost:     { backgroundColor: 'transparent', color: COLORS.textSecondary, borderColor: 'transparent' },
  };
  return (
    <button onClick={onClick} disabled={disabled}
      className={`inline-flex items-center gap-1.5 rounded-md font-medium border transition-all hover:opacity-90 ${sizes[size]} ${fullWidth ? 'w-full justify-center' : ''} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      style={variants[variant]}>
      {Icon && <Icon size={size === 'sm' ? 12 : 14} />}
      {children}
    </button>
  );
}

function ScoreRing({ score, size = 64, strokeWidth = 6, label, sublabel }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 90 ? COLORS.success : score >= 60 ? COLORS.warning : COLORS.danger;
  return (
    <div className="relative inline-flex flex-col items-center" style={{ width: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} stroke={COLORS.bgSubtle} strokeWidth={strokeWidth} fill="none" />
        <circle cx={size/2} cy={size/2} r={radius} stroke={color} strokeWidth={strokeWidth} fill="none"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ top: 0 }}>
        <div style={{ fontSize: size * 0.32, fontWeight: 700, color: COLORS.textPrimary, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{score}</div>
        {size >= 60 && <div className="text-xs mt-0.5" style={{ color: COLORS.textMuted }}>%</div>}
      </div>
      {label && <div className="text-xs mt-1.5 text-center" style={{ color: COLORS.textSecondary }}>{label}</div>}
      {sublabel && <div className="text-xs text-center" style={{ color: COLORS.textMuted }}>{sublabel}</div>}
    </div>
  );
}

function ConfidenceBar({ value, compact = false }) {
  const color = value >= 90 ? COLORS.success : value >= 70 ? COLORS.warning : COLORS.danger;
  return (
    <div className="flex items-center gap-2">
      <div className={`${compact ? 'w-12' : 'w-20'} h-1.5 rounded-full overflow-hidden`} style={{ backgroundColor: COLORS.bgSubtle }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-mono font-semibold tabular-nums" style={{ color, fontVariantNumeric: 'tabular-nums' }}>{value}%</span>
    </div>
  );
}

function KPICard({ label, value, suffix, trend, trendDir, sub, accent, icon: Icon, large, drilldownKey }) {
  const { setDrilldown } = useApp();
  const trendColor = trendDir === 'up' ? COLORS.success : trendDir === 'down' ? COLORS.danger : COLORS.textMuted;
  const trendIcon = trendDir === 'up' ? '↑' : trendDir === 'down' ? '↓' : '→';
  const clickable = !!drilldownKey;
  return (
    <div onClick={clickable ? () => setDrilldown(drilldownKey) : undefined}
      className={`border rounded-lg p-5 hover-lift relative ${clickable ? 'cursor-pointer' : ''}`}
      style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.textMuted }}>{label}</div>
        {Icon && (
          <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: `${accent || COLORS.info}15`, color: accent || COLORS.info }}>
            <Icon size={12} />
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-1.5 mb-1">
        <div className={`font-bold tracking-tight ${large ? 'text-5xl' : 'text-3xl'}`}
          style={{ color: COLORS.textPrimary, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
        {suffix && <div className="text-sm font-medium" style={{ color: COLORS.textMuted }}>{suffix}</div>}
        {trend !== undefined && <div className="text-xs font-semibold ml-1.5" style={{ color: trendColor }}>{trendIcon} {trend}</div>}
      </div>
      {sub && <div className="text-xs" style={{ color: COLORS.textMuted }}>{sub}</div>}
    </div>
  );
}

function CompactKPI({ label, value, suffix, trend, trendDir, accent, icon: Icon, sub, drilldownKey }) {
  const { setDrilldown } = useApp();
  const trendColor = trendDir === 'up' ? COLORS.success : trendDir === 'down' ? COLORS.danger : COLORS.textMuted;
  const trendIcon = trendDir === 'up' ? '↑' : trendDir === 'down' ? '↓' : '→';
  const clickable = !!drilldownKey;
  return (
    <div onClick={clickable ? () => setDrilldown(drilldownKey) : undefined}
      className={`border rounded-lg p-3.5 hover-lift ${clickable ? 'cursor-pointer' : ''}`}
      style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
      <div className="flex items-start justify-between mb-1.5">
        <div className="text-xs font-medium" style={{ color: COLORS.textMuted }}>{label}</div>
        {Icon && (
          <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${accent || COLORS.info}15`, color: accent || COLORS.info }}>
            <Icon size={10} />
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <div className="text-xl font-bold tracking-tight" style={{ color: COLORS.textPrimary, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
        {suffix && <div className="text-xs font-medium" style={{ color: COLORS.textMuted }}>{suffix}</div>}
        {trend !== undefined && <div className="text-xs font-semibold ml-auto" style={{ color: trendColor }}>{trendIcon}{trend}</div>}
      </div>
      {sub && <div className="text-xs mt-1" style={{ color: COLORS.textMuted }}>{sub}</div>}
    </div>
  );
}

function HeroMetric({ label, value, suffix, trend, trendDir, sub, sparklineData, sparklineLabel, accent, drilldownKey, badge }) {
  const { setDrilldown } = useApp();
  const trendColor = trendDir === 'up' ? COLORS.success : trendDir === 'down' ? COLORS.danger : COLORS.textMuted;
  const clickable = !!drilldownKey;
  return (
    <div onClick={clickable ? () => setDrilldown(drilldownKey) : undefined}
      className={`border rounded-xl p-6 mb-6 ${clickable ? 'cursor-pointer hover-lift' : ''}`}
      style={{ background: `linear-gradient(135deg, ${accent}0C 0%, ${COLORS.bgElevated} 100%)`, borderColor: COLORS.border }}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.textMuted }}>{label}</div>
            {badge && <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: `${accent}20`, color: accent, fontWeight: 600 }}>{badge}</span>}
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <div className="text-5xl font-bold tracking-tight" style={{ color: COLORS.textPrimary, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
            {suffix && <div className="text-lg font-medium" style={{ color: COLORS.textMuted }}>{suffix}</div>}
            {trend && (
              <div className="text-sm font-semibold ml-2" style={{ color: trendColor }}>
                {trendDir === 'up' ? '↑' : trendDir === 'down' ? '↓' : '→'} {trend}
              </div>
            )}
          </div>
          {sub && <div className="text-xs" style={{ color: COLORS.textSecondary }}>{sub}</div>}
        </div>
        {sparklineData && (
          <div className="text-right">
            <Sparkline data={sparklineData} color={accent} width={160} height={48} />
            {sparklineLabel && <div className="text-xs mt-1" style={{ color: COLORS.textMuted }}>{sparklineLabel}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children, action }) {
  return (
    <div className="border rounded-lg p-5 h-full" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm font-semibold" style={{ color: COLORS.textPrimary }}>{title}</div>
          {subtitle && <div className="text-xs" style={{ color: COLORS.textMuted }}>{subtitle}</div>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function Sparkline({ data, color = COLORS.info, height = 28, width = 100 }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`).join(' ');
  return (
    <svg width={width} height={height}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BarMini({ data, color = COLORS.info, height = 36, labels }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data);
  return (
    <div>
      <div className="flex items-end gap-0.5" style={{ height }}>
        {data.map((v, i) => (
          <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${(v / max) * 100}%`, minHeight: '2px', backgroundColor: i === data.length - 1 ? color : `${color}80` }} />
        ))}
      </div>
      {labels && (
        <div className="flex justify-between text-xs mt-1" style={{ color: COLORS.textMuted }}>
          <span>{labels[0]}</span><span>{labels[labels.length - 1]}</span>
        </div>
      )}
    </div>
  );
}

function Funnel({ steps }) {
  const max = steps[0]?.value || 1;
  return (
    <div className="space-y-2">
      {steps.map((step, i) => {
        const pct = (step.value / max) * 100;
        return (
          <div key={i} className="flex items-center gap-3">
            <div className="w-28 text-xs font-medium flex-shrink-0" style={{ color: COLORS.textSecondary }}>{step.label}</div>
            <div className="flex-1 relative">
              <div className="h-7 rounded-md flex items-center px-3"
                style={{ width: `${pct}%`, minWidth: '60px', backgroundColor: step.color || COLORS.info }}>
                <span className="text-xs font-semibold text-white">{step.value}</span>
              </div>
            </div>
            <div className="w-12 text-xs text-right" style={{ color: COLORS.textMuted, fontVariantNumeric: 'tabular-nums' }}>
              {i === 0 ? '100%' : `${Math.round(pct)}%`}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DonutChart({ segments, size = 120, strokeWidth = 18, centerLabel, centerValue }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  let offset = 0;
  return (
    <div className="flex items-center gap-5">
      <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {segments.map((seg, i) => {
            const len = (seg.value / total) * circumference;
            const el = <circle key={i} cx={size/2} cy={size/2} r={radius} stroke={seg.color} strokeWidth={strokeWidth} fill="none" strokeDasharray={`${len} ${circumference}`} strokeDashoffset={-offset} />;
            offset += len;
            return el;
          })}
        </svg>
        {centerValue && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-xl font-bold tracking-tight" style={{ color: COLORS.textPrimary, fontVariantNumeric: 'tabular-nums' }}>{centerValue}</div>
            {centerLabel && <div className="text-xs" style={{ color: COLORS.textMuted }}>{centerLabel}</div>}
          </div>
        )}
      </div>
      <div className="flex-1 space-y-1.5 text-xs">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: seg.color }} />
              <span className="truncate" style={{ color: COLORS.textSecondary }}>{seg.label}</span>
            </div>
            <span className="font-semibold tabular-nums" style={{ color: COLORS.textPrimary, fontVariantNumeric: 'tabular-nums' }}>{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HorizontalBars({ items, max, formatValue }) {
  const actualMax = max || Math.max(...items.map(i => i.value));
  return (
    <div className="space-y-2">
      {items.map((item, i) => {
        const pct = (item.value / actualMax) * 100;
        return (
          <div key={i}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span style={{ color: COLORS.textSecondary }}>{item.label}</span>
              <span className="font-semibold tabular-nums" style={{ color: COLORS.textPrimary, fontVariantNumeric: 'tabular-nums' }}>
                {formatValue ? formatValue(item.value) : item.value}
              </span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: COLORS.bgSubtle }}>
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: item.color || COLORS.info }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    'Em Captura':              { color: COLORS.info,    icon: Edit3 },
    'Em Triagem':              { color: '#F97316',      icon: Inbox },
    'Em Discovery':            { color: COLORS.warning, icon: Search },
    'Em Racionalização':       { color: '#8B5CF6',      icon: Layers },
    'Em Avaliação Técnica':    { color: '#7C3AED',      icon: Settings },
    'Pronto para Congelamento':{ color: '#4338CA',      icon: Check },
    'Devolvido pelo PM':       { color: COLORS.warning, icon: AlertTriangle },
    'RP Congelado':            { color: COLORS.success, icon: Layers },
    'Em Execução':             { color: COLORS.success, icon: Play },
    'Backlog':                 { color: COLORS.textMuted, icon: Archive },
    'Arquivada':               { color: COLORS.textMuted, icon: Archive },
    'Rejeitada':               { color: COLORS.danger,  icon: X },
  };
  const cfg = map[status] || { color: COLORS.textMuted, icon: Circle };
  const Icon = cfg.icon;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: `${cfg.color}15`, color: cfg.color }}>
      <Icon size={11} /> {status}
    </span>
  );
}

function PendencyCard({ pendency, onClick }) {
  const isEmpty = pendency.status === 'empty';
  const isLowConf = pendency.status === 'low_confidence';
  const isResolved = pendency.status === 'resolved' || pendency.status === 'manually_accepted';
  const isNA = pendency.status === 'not_applicable';
  const borderColor = isEmpty ? `${COLORS.danger}30` : isLowConf ? `${COLORS.warning}30` : isResolved ? `${COLORS.success}30` : COLORS.border;
  const bgColor = isEmpty ? `${COLORS.danger}05` : isLowConf ? `${COLORS.warning}05` : isResolved ? `${COLORS.success}03` : COLORS.bgSubtle;
  return (
    <div onClick={onClick} className="border rounded-lg p-3 cursor-pointer hover:shadow-sm transition-all" style={{ backgroundColor: bgColor, borderColor }}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {isEmpty && <AlertCircle size={16} style={{ color: COLORS.danger }} />}
          {isLowConf && <AlertTriangle size={16} style={{ color: COLORS.warning }} />}
          {isResolved && <CheckCircle2 size={16} style={{ color: COLORS.success }} />}
          {isNA && <Circle size={16} style={{ color: COLORS.textMuted }} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>{pendency.q}</div>
          {pendency.a && !isEmpty && (
            <div className="text-xs mt-1 line-clamp-2" style={{ color: COLORS.textSecondary }}>{pendency.a}</div>
          )}
          {!pendency.a && isEmpty && (
            <div className="text-xs italic mt-1" style={{ color: COLORS.textMuted }}>Aguardando resposta…</div>
          )}
          <div className="flex items-center gap-3 mt-2">
            {pendency.confidence > 0 && <ConfidenceBar value={pendency.confidence} compact />}
            {pendency.source && (
              <div className="text-xs flex items-center gap-1" style={{ color: COLORS.textMuted }}>
                <Link2 size={10} /> {pendency.source}
              </div>
            )}
            {isNA && pendency.naReason && (
              <div className="text-xs italic" style={{ color: COLORS.textMuted }}>N/A: {pendency.naReason.slice(0, 40)}…</div>
            )}
          </div>
        </div>
        <ChevronRight size={14} className="flex-shrink-0 mt-1" style={{ color: COLORS.textMuted }} />
      </div>
    </div>
  );
}

// ============================================================
// NEW: TRACEABILITY / PROVENANCE
// Faz a defensibilidade do RP visível: cada seção/afirmação aponta
// fontes (captura, anexos, discoveries, ADRs) — clique pra inspecionar.
// ============================================================
function TraceBadge({ provenanceKey, compact }) {
  const { setProvenancePopup } = useApp();
  const prov = PROVENANCE[provenanceKey];
  if (!prov) return null;
  const totalSources = (prov.capture?.length || 0) + (prov.attachments?.length || 0) + (prov.discoveries?.length || 0) + (prov.adrs?.length || 0);
  if (totalSources === 0) return null;
  return (
    <button onClick={(e) => { e.stopPropagation(); setProvenancePopup(provenanceKey); }}
      className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded hover:bg-stone-100 transition-colors"
      style={{ color: COLORS.ai, backgroundColor: `${COLORS.ai}10`, border: `1px solid ${COLORS.ai}30` }}
      title="Ver origem rastreável">
      <Link2 size={10} />
      {!compact && <span className="font-medium">{totalSources} {totalSources === 1 ? 'fonte' : 'fontes'}</span>}
    </button>
  );
}

function ProvenanceModal() {
  const { provenancePopup, setProvenancePopup, capturePendencies, attachments, discoveryResults } = useApp();
  if (!provenancePopup) return null;
  const prov = PROVENANCE[provenancePopup];
  if (!prov) return null;
  const isShow = provenancePopup.startsWith('show-');
  const adrsForShow = SHOWCASE_RP.adrs;
  const adrsForLive = SUGGESTED_ADRS;
  const adrPool = isShow ? adrsForShow : adrsForLive;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40" onClick={() => setProvenancePopup(null)}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-2xl rounded-xl shadow-2xl border max-h-[85vh] overflow-hidden flex flex-col"
        style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: COLORS.border, backgroundColor: `${COLORS.ai}05` }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: COLORS.ai, color: 'white' }}>
              <Link2 size={16} />
            </div>
            <div>
              <div className="font-semibold text-base" style={{ color: COLORS.textPrimary }}>Origem desta seção</div>
              <div className="text-xs" style={{ color: COLORS.textMuted }}>Toda afirmação tem proveniência rastreável</div>
            </div>
          </div>
          <button onClick={() => setProvenancePopup(null)} className="p-1 hover:bg-stone-100 rounded"><X size={18} style={{ color: COLORS.textMuted }} /></button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          <div className="p-3 rounded-md" style={{ backgroundColor: COLORS.bgSubtle }}>
            <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>Por quê?</div>
            <div className="text-sm" style={{ color: COLORS.textPrimary }}>{prov.rationale}</div>
          </div>

          {prov.capture?.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: COLORS.info }}>
                <Edit3 size={12} /> Captura ({prov.capture.length})
              </div>
              <div className="space-y-2">
                {prov.capture.map(capId => {
                  const cap = capturePendencies.find(p => p.id === capId);
                  if (!cap) return (
                    <div key={capId} className="border rounded p-2.5 text-xs" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}>
                      <div className="font-medium" style={{ color: COLORS.textPrimary }}>{capId}</div>
                      <div style={{ color: COLORS.textMuted }}>(referência externa)</div>
                    </div>
                  );
                  return (
                    <div key={cap.id} className="border rounded p-2.5" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}>
                      <div className="text-xs font-semibold mb-1" style={{ color: COLORS.textPrimary }}>{cap.q}</div>
                      <div className="text-xs mb-1.5" style={{ color: COLORS.textSecondary }}>{cap.a || '—'}</div>
                      <div className="flex items-center gap-2 text-xs" style={{ color: COLORS.textMuted }}>
                        <ConfidenceBar value={cap.confidence} compact />
                        {cap.source && <span>· {cap.source}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {prov.attachments?.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: COLORS.warning }}>
                <Paperclip size={12} /> Anexos ({prov.attachments.length})
              </div>
              <div className="space-y-1.5">
                {prov.attachments.map(attId => {
                  const att = attachments.find(a => a.id === attId);
                  return (
                    <div key={attId} className="flex items-center gap-2 p-2 rounded border text-xs" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}>
                      <FileText size={12} style={{ color: COLORS.warning }} />
                      <span className="font-medium" style={{ color: COLORS.textPrimary }}>{att?.name || attId}</span>
                      {prov.pages && <span style={{ color: COLORS.textMuted }}>· {prov.pages}</span>}
                      {att?.size && <span style={{ color: COLORS.textMuted }}>· {att.size}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {prov.discoveries?.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: COLORS.info }}>
                <Search size={12} /> Discoveries ({prov.discoveries.length})
              </div>
              <div className="space-y-2">
                {prov.discoveries.map(discId => {
                  const disc = DISCOVERIES_DB[discId];
                  if (!disc) return null;
                  return (
                    <div key={discId} className="border rounded p-2.5" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs font-semibold" style={{ color: COLORS.textPrimary }}>{disc.title}</div>
                        <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: `${COLORS.info}15`, color: COLORS.info }}>{disc.type}</span>
                      </div>
                      <div className="text-xs mb-1" style={{ color: COLORS.textSecondary }}>{disc.summary}</div>
                      <div className="text-xs" style={{ color: COLORS.textMuted }}>{disc.sources} fontes · {disc.date}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {prov.adrs?.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: COLORS.ai }}>
                <BookMarked size={12} /> ADRs ({prov.adrs.length})
              </div>
              <div className="space-y-2">
                {prov.adrs.map(adrId => {
                  const adr = adrPool.find(a => a.id === adrId);
                  if (!adr) return (
                    <div key={adrId} className="border rounded p-2.5 text-xs" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}>
                      <div className="font-medium" style={{ color: COLORS.textPrimary }}>{adrId}</div>
                    </div>
                  );
                  return (
                    <div key={adrId} className="border rounded p-2.5" style={{ borderColor: COLORS.border, backgroundColor: `${COLORS.ai}05` }}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs font-semibold" style={{ color: COLORS.textPrimary }}>{adr.id} — {adr.title}</div>
                        {adr.category && <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: `${COLORS.ai}15`, color: COLORS.ai }}>{adr.category}</span>}
                      </div>
                      <div className="text-xs" style={{ color: COLORS.textSecondary }}>{adr.decision}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-3 border-t flex items-center justify-between" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
          <div className="text-xs flex items-center gap-1.5" style={{ color: COLORS.textMuted }}>
            <Info size={12} /> Toda afirmação no RP pode ser auditada até a fonte original.
          </div>
          <Button variant="secondary" size="sm" onClick={() => setProvenancePopup(null)}>Fechar</Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// NEW: AI IMPACT METER (mostra valor da plataforma por artefato)
// ============================================================
function AIImpactBanner({ hoursSaved, automatedPct, label, persona }) {
  const accent = persona?.color || COLORS.ai;
  return (
    <div className="border rounded-lg p-3 mb-4 flex items-center gap-3"
      style={{ borderColor: `${COLORS.ai}30`, background: `linear-gradient(90deg, ${COLORS.ai}08 0%, ${accent}05 100%)` }}>
      <div className="w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor: COLORS.ai, color: 'white' }}>
        <Zap size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.ai }}>IA Impact</div>
        <div className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>
          {label || `${hoursSaved}h economizadas · ${automatedPct}% automatizado neste artefato`}
        </div>
      </div>
      {hoursSaved !== undefined && (
        <div className="flex items-center gap-4 text-xs flex-shrink-0" style={{ color: COLORS.textSecondary }}>
          <div className="text-right">
            <div className="font-bold text-lg" style={{ color: COLORS.ai, fontVariantNumeric: 'tabular-nums' }}>{hoursSaved}h</div>
            <div style={{ color: COLORS.textMuted }}>economizadas</div>
          </div>
          {automatedPct !== undefined && (
            <div className="text-right pl-4 border-l" style={{ borderColor: COLORS.border }}>
              <div className="font-bold text-lg" style={{ color: COLORS.ai, fontVariantNumeric: 'tabular-nums' }}>{automatedPct}%</div>
              <div style={{ color: COLORS.textMuted }}>automatizado</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// DRILL-DOWN MODAL (KPI clicáveis abrem tabela)
// ============================================================
function DrillDownModal() {
  const { drilldown, setDrilldown } = useApp();
  if (!drilldown) return null;
  const data = DRILLDOWN_DATA[drilldown];
  if (!data) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setDrilldown(null)}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-3xl rounded-xl shadow-2xl border max-h-[85vh] overflow-hidden flex flex-col"
        style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: COLORS.border }}>
          <div>
            <div className="font-semibold text-base" style={{ color: COLORS.textPrimary }}>{data.title}</div>
            <div className="text-xs mt-1" style={{ color: COLORS.textMuted }}>{data.rows.length} {data.rows.length === 1 ? 'item' : 'itens'}</div>
          </div>
          <button onClick={() => setDrilldown(null)} className="p-1 hover:bg-stone-100 rounded"><X size={18} style={{ color: COLORS.textMuted }} /></button>
        </div>
        <div className="overflow-auto flex-1">
          <table className="w-full text-sm">
            <thead className="sticky top-0" style={{ backgroundColor: COLORS.bgSubtle }}>
              <tr>
                {data.columns.map((col, i) => (
                  <th key={i} className="text-left p-3 font-semibold text-xs uppercase tracking-wider border-b" style={{ color: COLORS.textMuted, borderColor: COLORS.border }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, i) => (
                <tr key={i} className="hover:bg-stone-50 border-b" style={{ borderColor: COLORS.border }}>
                  {row.map((cell, j) => (
                    <td key={j} className="p-3" style={{ color: j === 0 ? COLORS.textPrimary : COLORS.textSecondary, fontWeight: j === 0 ? 500 : 400 }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t flex justify-end gap-2" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
          <Button variant="secondary" size="sm" onClick={() => setDrilldown(null)}>Fechar</Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// LAYOUT
// ============================================================
function TopBar() {
  const { persona, setPersona, route, navigate, notifications, setNotifications } = useApp();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const myNotifs = notifications.filter(n => n.forPersona === persona?.id);
  const unread = myNotifs.filter(n => !n.read).length;

  if (!persona) return null;

  const breadcrumb = (() => {
    const map = {
      'dashboard':       'Dashboard',
      'new-demand':      'Demandas / Nova',
      'capture-queue':   'Demandas / DEM-2026-001 / Captura',
      'capture-review':  'Demandas / DEM-2026-001 / Revisão',
      'triage-queue':    'Triagem / Fila',
      'triage-detail':   'Triagem / DEM-2026-001',
      'rationalizations':'Racionalizações',
      'rationalization': 'Racionalização / DEM-2026-001',
      'rp-freeze':       'Congelamento / DEM-2026-001',
      'tech-evaluation': 'Av. Técnica / DEM-2026-001',
      'rp-view':         'RP / DEM-2026-001',
      'rp-revision':     'RP / DEM-2026-001 / v1.1',
      'showcase-rp':     'RP exemplo / RP-2026-000',
      'adrs':            'ADRs',
      'timeline':        'Histórico / DEM-2026-001',
      'notifications':   'Notificações',
      'my-demands':      'Minhas Demandas',
      'collect-inbox':   'Coleta',
    };
    return map[route.screen] || route.screen;
  })();

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-1 z-50" style={{ backgroundColor: persona.color }} />
      <div className="sticky top-1 z-40 h-14 border-b flex items-center justify-between px-6"
        style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="flex items-center gap-8">
          <div className="font-mono font-bold text-base" style={{ color: COLORS.textPrimary }}>DemandOS</div>
          <span className="text-xs font-medium px-2 py-0.5 rounded uppercase tracking-wider" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>Demo</span>
          <div className="text-xs" style={{ color: COLORS.textMuted }}>{breadcrumb}</div>
        </div>
        <div className="flex items-center gap-2">
          {/* Notifications bell */}
          <div className="relative">
            <button onClick={() => setNotifOpen(!notifOpen)} className="p-2 rounded-md hover:bg-stone-100 relative">
              <Bell size={16} style={{ color: COLORS.textSecondary }} />
              {unread > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold text-white" style={{ backgroundColor: COLORS.danger }}>{unread}</span>
              )}
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-full mt-1 w-96 rounded-lg border shadow-lg overflow-hidden z-50 max-h-[500px] flex flex-col"
                style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
                <div className="px-3 py-2 border-b flex items-center justify-between" style={{ borderColor: COLORS.border }}>
                  <div className="text-xs font-semibold" style={{ color: COLORS.textPrimary }}>Notificações ({myNotifs.length})</div>
                  {unread > 0 && (
                    <button onClick={() => setNotifications(notifications.map(n => n.forPersona === persona.id ? { ...n, read: true } : n))} className="text-xs underline" style={{ color: COLORS.textMuted }}>
                      Marcar tudo lido
                    </button>
                  )}
                </div>
                <div className="overflow-y-auto flex-1">
                  {myNotifs.length === 0 ? (
                    <div className="text-xs text-center py-8" style={{ color: COLORS.textMuted }}>Sem notificações ainda</div>
                  ) : myNotifs.slice(0, 10).map(n => (
                    <button key={n.id}
                      onClick={() => {
                        setNotifications(notifications.map(x => x.id === n.id ? { ...x, read: true } : x));
                        setNotifOpen(false);
                        if (n.actionScreen) navigate(n.actionScreen);
                      }}
                      className="w-full text-left px-3 py-2.5 border-b hover:bg-stone-50"
                      style={{ borderColor: COLORS.border, backgroundColor: n.read ? 'transparent' : `${persona.color}05` }}>
                      <div className="flex items-start gap-2">
                        {!n.read && <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: persona.color }} />}
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold" style={{ color: COLORS.textPrimary }}>{n.title}</div>
                          <div className="text-xs mt-0.5" style={{ color: COLORS.textSecondary }}>{n.body}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <button onClick={() => { setNotifOpen(false); navigate('notifications'); }} className="text-xs font-medium px-3 py-2 border-t hover:bg-stone-50" style={{ borderColor: COLORS.border, color: persona.color }}>
                  Ver tudo →
                </button>
              </div>
            )}
          </div>

          {/* Persona dropdown */}
          <div className="relative">
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-stone-100">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white" style={{ backgroundColor: persona.color }}>{persona.initials}</div>
              <div className="text-left">
                <div className="text-xs font-medium" style={{ color: COLORS.textPrimary }}>{persona.name}</div>
                <div className="text-xs" style={{ color: COLORS.textMuted }}>{persona.label}</div>
              </div>
              <ChevronDown size={14} style={{ color: COLORS.textMuted }} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-72 rounded-lg border shadow-lg overflow-hidden z-50"
                style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
                <div className="px-3 py-2 text-xs font-semibold border-b" style={{ color: COLORS.textMuted, borderColor: COLORS.border }}>Trocar de persona</div>
                {Object.values(PERSONAS).map(p => (
                  <button key={p.id} onClick={() => { setPersona(p); setDropdownOpen(false); navigate('dashboard'); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-stone-50 text-left"
                    style={{ backgroundColor: p.id === persona.id ? COLORS.bgSubtle : 'transparent' }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white" style={{ backgroundColor: p.color }}>{p.initials}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>{p.name}</div>
                      <div className="text-xs" style={{ color: COLORS.textMuted }}>{p.role} · {p.label}</div>
                    </div>
                    {p.id === persona.id && <Check size={14} style={{ color: p.color }} />}
                  </button>
                ))}
                <button onClick={() => { setPersona(null); setDropdownOpen(false); navigate('login'); }} className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-stone-50 text-left border-t" style={{ borderColor: COLORS.border }}>
                  <LogOut size={14} style={{ color: COLORS.textMuted }} />
                  <span className="text-sm" style={{ color: COLORS.textSecondary }}>Sair</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Sidebar() {
  const { persona, route, navigate, pendingCollects, returnedGaps } = useApp();
  if (!persona) return null;

  const collectsCount = pendingCollects.filter(c => c.status === 'pending').length;

  const menus = {
    submitter: [
      { icon: Home, label: 'Dashboard', screen: 'dashboard' },
      { icon: Plus, label: 'Nova Demanda', screen: 'new-demand' },
      { icon: FileText, label: 'Minhas Demandas', screen: 'my-demands' },
      ...(collectsCount > 0 ? [{ icon: MessageSquare, label: 'Coleta', screen: 'collect-inbox', badge: collectsCount }] : []),
    ],
    po: [
      { icon: Home, label: 'Dashboard', screen: 'dashboard' },
      { icon: Inbox, label: 'Fila de Triagem', screen: 'triage-queue', badge: 4 },
      { icon: Layers, label: 'Racionalizações', screen: 'rationalizations', badge: 1 + (returnedGaps.length > 0 ? 1 : 0) },
    ],
    cto: [
      { icon: Home, label: 'Dashboard', screen: 'dashboard' },
      { icon: Inbox, label: 'Escalas Técnicas', screen: 'tech-evaluation', badge: 1 },
      { icon: BookOpen, label: 'ADRs', screen: 'adrs' },
    ],
    pm: [
      { icon: Home, label: 'Dashboard', screen: 'dashboard' },
      { icon: Inbox, label: 'RPs Aguardando', screen: 'rp-view', badge: 1 },
    ],
    viewer: [
      { icon: Home, label: 'Dashboard', screen: 'dashboard' },
      { icon: FileText, label: 'RPs Publicados', screen: 'rp-view' },
    ],
  };
  const items = menus[persona.id] || [];

  return (
    <div className="w-60 border-r flex flex-col flex-shrink-0" style={{ backgroundColor: COLORS.bgSubtle, borderColor: COLORS.border }}>
      <div className="p-3 flex-1 overflow-y-auto">
        {items.map(item => {
          const Icon = item.icon;
          const isActive = route.screen === item.screen;
          return (
            <button key={item.screen} onClick={() => navigate(item.screen)}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md mb-0.5 text-left hover:bg-stone-200/60"
              style={{ backgroundColor: isActive ? COLORS.bgElevated : 'transparent', color: isActive ? COLORS.textPrimary : COLORS.textSecondary }}>
              <div className="flex items-center gap-2.5">
                <Icon size={15} />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: persona.color, color: 'white' }}>{item.badge}</span>
              )}
            </button>
          );
        })}
      </div>
      <div className="p-3 border-t text-xs" style={{ borderColor: COLORS.border, color: COLORS.textMuted }}>v1.0 · Unificado</div>
    </div>
  );
}

function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  const config = { success: { color: COLORS.success, icon: CheckCircle2 }, warning: { color: COLORS.warning, icon: AlertTriangle }, error: { color: COLORS.danger, icon: AlertCircle } };
  const c = config[toast.type] || config.success;
  const Icon = c.icon;
  return (
    <div className="fixed top-20 right-6 z-[100]">
      <div className="flex items-center gap-3 pl-3 pr-4 py-3 rounded-lg shadow-lg border" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border, borderLeftWidth: '3px', borderLeftColor: c.color }}>
        <Icon size={16} style={{ color: c.color }} />
        <span className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>{toast.message}</span>
      </div>
    </div>
  );
}

function TourBanner({ personaId, title, items }) {
  const { seenTours, setSeenTours } = useApp();
  const tourKey = `tour-${personaId}`;
  if (seenTours.has(tourKey)) return null;
  return (
    <div className="mb-6 p-4 rounded-lg border" style={{ borderColor: '#FCD34D', backgroundColor: '#FFFBEB' }}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={16} style={{ color: '#92400E' }} />
          <div className="font-semibold text-sm" style={{ color: '#78350F' }}>{title}</div>
        </div>
        <button onClick={() => { const next = new Set(seenTours); next.add(tourKey); setSeenTours(next); }} className="text-xs underline hover:opacity-70" style={{ color: '#92400E' }}>
          Entendi, ocultar
        </button>
      </div>
      <ul className="space-y-1.5 ml-6">
        {items.map((item, i) => (
          <li key={i} className="text-sm flex items-start gap-2" style={{ color: '#78350F' }}>
            <span className="font-mono text-xs mt-0.5">{i + 1}.</span><span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================================
// LOGIN
// ============================================================
function LoginScreen() {
  const { selectPersona } = useApp();
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: COLORS.bg }}>
      <div className="max-w-3xl w-full">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: COLORS.textPrimary }}>
              <Layers size={22} style={{ color: COLORS.bgElevated }} />
            </div>
            <div className="text-3xl font-bold" style={{ color: COLORS.textPrimary }}>DemandOS</div>
          </div>
          <div className="text-sm" style={{ color: COLORS.textSecondary }}>
            Plataforma de gestão de demandas com IA — protótipo unificado v1.0
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {Object.values(PERSONAS).map(p => (
            <button
              key={p.id}
              onClick={() => selectPersona(p.id)}
              className="p-5 rounded-lg border bg-white text-left transition-all hover:shadow-md hover:-translate-y-0.5"
              style={{ borderColor: COLORS.border }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3 text-white font-bold text-sm" style={{ backgroundColor: p.color }}>
                {p.initials}
              </div>
              <div className="font-semibold text-sm mb-0.5" style={{ color: COLORS.textPrimary }}>{p.name}</div>
              <div className="text-xs mb-2" style={{ color: COLORS.textSecondary }}>{p.label}</div>
              <div className="text-xs leading-snug" style={{ color: COLORS.textMuted }}>{p.desc}</div>
            </button>
          ))}
        </div>
        <div className="text-xs text-center mt-6" style={{ color: COLORS.textMuted }}>
          5 personas · 30+ telas · workflow completo + dashboards densos + showcase de RP congelado
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CHAT PANEL — Sidesheet AI contextual
// ============================================================
function ChatPanel() {
  const { chatOpen, setChatOpen, chatMessages, setChatMessages, persona } = useApp();
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chatMessages, chatOpen]);

  if (!chatOpen) return null;

  const send = () => {
    if (!input.trim()) return;
    const userMsg = { id: `m-${Date.now()}`, role: 'user', text: input };
    setChatMessages(prev => [...prev, userMsg]);
    const q = input.toLowerCase();
    setInput('');
    setTimeout(() => {
      let reply = 'Posso ajudar com mais detalhes. Você pode reformular ou perguntar sobre um item específico do RP, ADRs, ou status da demanda.';
      if (q.includes('rp') || q.includes('congel')) reply = 'O RP congelado v1.0 contém 17 seções derivadas de Captura + Racionalização + ADRs do CTO. Cada afirmação tem proveniência rastreável — clique no badge de origem em qualquer seção.';
      else if (q.includes('adr')) reply = 'A demanda tem 4 ADRs sugeridos: ADR-100 (provider abstrato), ADR-101 (webhook idempotente), ADR-102 (vault tokenizado), ADR-103 (migração opt-in). 2 deles reaproveitados de DEM-2025-088.';
      else if (q.includes('prazo') || q.includes('sla')) reply = 'SLA atual: 21h restantes na fase de Triagem. Caso aprovado, Racionalização tem janela típica de 4-7 dias úteis.';
      else if (q.includes('roi') || q.includes('econom')) reply = 'Estimativa atual: R$ 78k/ano em economia operacional + redução de inadimplência de 18% para 6%. ROI projetado: 4.2x em 12 meses.';
      setChatMessages(prev => [...prev, { id: `m-${Date.now()}-ai`, role: 'ai', text: reply }]);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setChatOpen(false)}>
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative w-[420px] h-full bg-white flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: COLORS.border }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F3E8FF' }}>
              <Sparkles size={16} style={{ color: COLORS.ai }} />
            </div>
            <div>
              <div className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>Assistente IA</div>
              <div className="text-xs" style={{ color: COLORS.textMuted }}>Contexto: DEM-2026-001</div>
            </div>
          </div>
          <button onClick={() => setChatOpen(false)} className="p-1.5 rounded hover:bg-stone-100">
            <X size={16} style={{ color: COLORS.textSecondary }} />
          </button>
        </div>
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-3">
          {chatMessages.length === 0 && (
            <div className="text-center py-12">
              <Sparkles size={32} style={{ color: COLORS.ai }} className="mx-auto mb-3" />
              <div className="text-sm font-medium mb-2" style={{ color: COLORS.textPrimary }}>Como posso ajudar?</div>
              <div className="text-xs mb-4" style={{ color: COLORS.textMuted }}>Tenho contexto completo desta demanda.</div>
              <div className="space-y-2">
                {['Resuma o status da demanda', 'Quais ADRs estão envolvidos?', 'Qual o ROI estimado?'].map((s, i) => (
                  <button key={i} onClick={() => setInput(s)} className="block w-full text-left text-xs px-3 py-2 rounded border hover:bg-stone-50" style={{ borderColor: COLORS.border, color: COLORS.textSecondary }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {chatMessages.map(m => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-[85%] px-3 py-2 rounded-lg text-sm" style={{
                backgroundColor: m.role === 'user' ? COLORS.textPrimary : '#F3E8FF',
                color: m.role === 'user' ? COLORS.textInverse : COLORS.textPrimary,
              }}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t" style={{ borderColor: COLORS.border }}>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Pergunte qualquer coisa..."
              className="flex-1 px-3 py-2 text-sm rounded border outline-none focus:ring-1"
              style={{ borderColor: COLORS.border, color: COLORS.textPrimary }}
            />
            <button onClick={send} disabled={!input.trim()} className="px-3 py-2 rounded text-white disabled:opacity-40" style={{ backgroundColor: COLORS.ai }}>
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DASHBOARD — SUBMITTER (COO Carlos Silva)
// Pay-justifying KPI: Valor de impacto gerado pelas demandas ativas
// ============================================================
function SubmitterDashboard() {
  const { navigate, setDemandState, demandState, captureScore, rpVersion } = useApp();
  const ai = AI_IMPACT_PER_PERSONA.submitter;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <TourBanner
        personaId="submitter"
        title="Bem-vindo, Carlos. Você é o originador da demanda."
        items={[
          'Você cria demandas e acompanha o impacto. O sistema cuida do resto.',
          'O Hero Metric abaixo mostra o valor gerado pelas suas demandas em produção.',
          'Clique em "Mostre o exemplo" para ver um RP congelado completo (referência de qualidade).',
          'Você não precisa preencher formulários — a IA captura tudo via texto, PDF ou áudio.',
        ]}
      />

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-xs uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>Painel do Submitter</div>
          <div className="text-2xl font-bold" style={{ color: COLORS.textPrimary }}>Bom dia, Carlos</div>
          <div className="text-sm mt-1" style={{ color: COLORS.textSecondary }}>Você tem 1 demanda ativa, 8 entregues no ano.</div>
        </div>
        <Button icon={Plus} onClick={() => navigate('newDemand')}>Nova Demanda</Button>
      </div>

      <AIImpactBanner hoursSaved={ai.hoursSaved} automatedPct={ai.automatedPct} label={ai.label} persona="submitter" />

      <HeroMetric
        label="Impacto financeiro das suas demandas em produção (YTD)"
        value="R$ 412k"
        trend="+R$ 78k projetados nesta demanda"
        trendDir="up"
        sub="8 demandas entregues · 3 com ROI confirmado · 1 em andamento"
        sparklineData={[120, 145, 180, 230, 270, 340, 380, 412]}
        sparklineLabel="Acumulado mensal"
        accent={PERSONAS.submitter.color}
        drilldownKey="submitter-impact"
        badge="Pay-justifying KPI"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        <CompactKPI label="Demandas ativas" value={1} icon={Activity} sub="DEM-2026-001" drilldownKey="submitter-active" />
        <CompactKPI label="Aceitas no ano" value={8} suffix="/14" icon={CheckCircle2} sub="57% de aceite" accent={COLORS.success} drilldownKey="submitter-accepted" />
        <CompactKPI label="Tempo médio até congelamento" value="6.2" suffix="dias" icon={Timer} trend="-2.1d vs média do mercado" trendDir="up" drilldownKey="submitter-time" />
        <CompactKPI label="Horas que você não gastou" value={ai.hoursSaved} suffix="h" icon={Sparkles} sub="vs preencher formulários" accent={COLORS.ai} drilldownKey="submitter-aieconomia" />
        <CompactKPI label="ROI médio realizado" value="4.2" suffix="x" icon={TrendingUp} sub="entre 8 entregas" accent={COLORS.success} drilldownKey="submitter-roi" />
        <CompactKPI label="Inadimplência (proj. desta demanda)" value="-67" suffix="%" icon={Target} sub="de 18% para 6%" accent={COLORS.success} drilldownKey="submitter-inadimp" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Suas demandas — funil deste ano" subtitle="14 originadas · 8 aceitas · 6 entregues">
          <Funnel steps={[
            { label: 'Originadas', value: 14, color: PERSONAS.submitter.color },
            { label: 'Triadas', value: 12, color: '#60A5FA' },
            { label: 'Racionalizadas', value: 10, color: '#34D399' },
            { label: 'Congeladas', value: 9, color: '#A78BFA' },
            { label: 'Aceitas', value: 8, color: COLORS.success },
          ]} />
        </ChartCard>

        <ChartCard title="Distribuição por área de impacto" subtitle="14 demandas YTD">
          <DonutChart segments={[
            { label: 'Eficiência operacional', value: 5, color: PERSONAS.submitter.color },
            { label: 'Receita', value: 4, color: COLORS.success },
            { label: 'Compliance', value: 3, color: COLORS.warning },
            { label: 'Produto', value: 2, color: COLORS.ai },
          ]} centerLabel="Total" centerValue={14} />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="p-5 rounded-lg border bg-white" style={{ borderColor: COLORS.border }}>
          <div className="flex items-center justify-between mb-4">
            <div className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>Sua demanda ativa</div>
            <button onClick={() => navigate('myDemands')} className="text-xs underline" style={{ color: COLORS.textSecondary }}>Ver todas (14)</button>
          </div>
          <div className="p-4 rounded border" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-xs font-mono mb-1" style={{ color: COLORS.textMuted }}>DEM-2026-001 · há 3 dias</div>
                <div className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>Gateway de Pagamento Recorrente</div>
              </div>
              <StatusPill status={demandState} />
            </div>
            <div className="text-xs mb-3" style={{ color: COLORS.textSecondary }}>
              {demandState === 'Em Captura' && 'Aguardando você responder pendências de captura.'}
              {demandState === 'Pronta para Triagem' && 'Aguardando triagem do PO.'}
              {demandState === 'Em Triagem' && 'PO está triando.'}
              {demandState === 'Em Racionalização' && 'PO está racionalizando.'}
              {demandState === 'RP Congelado' && 'RP congelado v1.0. Aguardando avaliação técnica.'}
              {demandState === 'Em Avaliação Técnica' && 'CTO está avaliando tecnicamente.'}
              {demandState === 'Devolvido pelo PM' && 'PM apontou gaps. PO está revisando.'}
              {demandState === 'Aceito pelo PM' && 'PM aceitou. Aguardando entrega.'}
            </div>
            <div className="flex items-center gap-2">
              {captureScore < 100 && demandState === 'Em Captura' && (
                <Button size="sm" onClick={() => navigate('captureQueue')}>Responder pendências ({captureScore}%)</Button>
              )}
              {captureScore === 100 && demandState === 'Em Captura' && (
                <Button size="sm" onClick={() => { setDemandState('Pronta para Triagem'); navigate('captureReview'); }}>Revisar e enviar</Button>
              )}
              <Button size="sm" variant="ghost" onClick={() => rpVersion ? navigate('rpView', { version: rpVersion }) : null} disabled={!rpVersion}>
                Ver RP {rpVersion ? `v${rpVersion}` : '(em construção)'}
              </Button>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md" style={{ borderColor: COLORS.ai, background: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)' }} onClick={() => navigate('showcaseRP')}>
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FFFFFF' }}>
              <Award size={20} style={{ color: COLORS.ai }} />
            </div>
            <div className="flex-1">
              <div className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: COLORS.ai }}>Veja um RP completo</div>
              <div className="font-semibold text-sm mb-1" style={{ color: COLORS.textPrimary }}>RP-2026-000 · Notificações WebSocket</div>
              <div className="text-xs leading-relaxed" style={{ color: COLORS.textSecondary }}>
                Exemplo entregue de outro Submitter: 17 seções, 5 ADRs, score 96%, NPS 9.4. <strong>Cada afirmação tem origem rastreável</strong>.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: COLORS.ai }}>
            Mostre o exemplo <ArrowRight size={12} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DASHBOARD — PO (Marina)
// Pay-justifying KPI: Throughput de RPs/semana + custo de atraso evitado
// ============================================================
function PODashboard() {
  const { navigate, demandState, racScore } = useApp();
  const ai = AI_IMPACT_PER_PERSONA.po;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <TourBanner
        personaId="po"
        title="Bem-vinda, Marina. Você converte demandas em RPs prontos para execução."
        items={[
          'Seu fluxo é Triagem → Racionalização → RP Congelado.',
          'A IA pré-preenche todas as pendências — você só revisa, edita e justifica.',
          'O Hero Metric mostra quantos RPs você congela por semana (throughput).',
          'Você pode escalar uma decisão precoce para o CTO sem esperar o RP terminar.',
        ]}
      />

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-xs uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>Painel do PO</div>
          <div className="text-2xl font-bold" style={{ color: COLORS.textPrimary }}>Bom dia, Marina</div>
          <div className="text-sm mt-1" style={{ color: COLORS.textSecondary }}>4 demandas na fila de triagem · 3 em racionalização ativa.</div>
        </div>
        <Button icon={Inbox} variant="secondary" onClick={() => navigate('triageQueue')}>Fila de Triagem (4)</Button>
      </div>

      <AIImpactBanner hoursSaved={ai.hoursSaved} automatedPct={ai.automatedPct} label={ai.label} persona="po" />

      <HeroMetric
        label="Throughput de RPs congelados"
        value={9}
        suffix=" / sem"
        trend="+3 vs sem. passada"
        trendDir="up"
        sub="Meta: 8/sem · Você está acima da meta há 4 semanas consecutivas"
        sparklineData={[4, 5, 6, 5, 7, 8, 8, 9]}
        sparklineLabel="Últimas 8 semanas"
        accent={PERSONAS.po.color}
        drilldownKey="po-throughput"
        badge="Pay-justifying KPI"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        <CompactKPI label="Custo de atraso evitado" value="R$ 47k" icon={DollarSign} sub="SLAs respeitados este mês" accent={COLORS.success} drilldownKey="po-sla" />
        <CompactKPI label="Aceite no PM (1ª vez)" value="89" suffix="%" icon={CheckCircle2} sub="vs 64% antes do DemandOS" accent={COLORS.success} drilldownKey="po-aceite" />
        <CompactKPI label="Tempo médio em Racionalização" value="2.4" suffix="dias" icon={Timer} trend="-1.8d com IA" trendDir="up" drilldownKey="po-tempo" />
        <CompactKPI label="Horas economizadas (você)" value={ai.hoursSaved} suffix="h" icon={Sparkles} sub="por semana · semanal" accent={COLORS.ai} drilldownKey="po-aieconomia" />
        <CompactKPI label="Discoveries automáticos" value={23} icon={Search} sub="este mês · 87% acertos" drilldownKey="po-discoveries" />
        <CompactKPI label="RPs devolvidos pelo PM" value="2" icon={AlertCircle} sub="de 18 congelados · 11%" accent={COLORS.warning} drilldownKey="po-devolvidos" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Funil deste mês" subtitle="18 originadas · 12 congeladas · 10 aceitas">
          <Funnel steps={[
            { label: 'Originadas', value: 18, color: '#60A5FA' },
            { label: 'Triadas', value: 16, color: PERSONAS.po.color },
            { label: 'Racionalizadas', value: 14, color: '#FBBF24' },
            { label: 'Congeladas', value: 12, color: '#A78BFA' },
            { label: 'Aceitas no PM', value: 10, color: COLORS.success },
          ]} />
        </ChartCard>

        <ChartCard title="Tempo por etapa (dias) — sua média YTD" subtitle="Menor é melhor">
          <HorizontalBars
            max={5}
            items={[
              { label: 'Captura', value: 0.8, color: '#60A5FA' },
              { label: 'Triagem', value: 0.5, color: PERSONAS.po.color },
              { label: 'Racionalização', value: 2.4, color: '#FBBF24' },
              { label: 'Avaliação Técnica', value: 1.8, color: COLORS.ai },
              { label: 'Aceite PM', value: 0.4, color: COLORS.success },
            ]}
            formatValue={v => `${v}d`}
          />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 p-5 rounded-lg border bg-white" style={{ borderColor: COLORS.border }}>
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>Demandas que precisam de você</div>
            <button onClick={() => navigate('triageQueue')} className="text-xs underline" style={{ color: COLORS.textSecondary }}>Ver tudo</button>
          </div>
          <div className="space-y-2">
            {demandState === 'Pronta para Triagem' && (
              <button onClick={() => navigate('triageQueue')} className="w-full text-left p-3 rounded border-2 hover:shadow-sm transition-all" style={{ borderColor: COLORS.danger, backgroundColor: '#FEF2F2' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono mb-0.5" style={{ color: COLORS.danger }}>DEM-2026-001 · CHEGOU HÁ 3h</div>
                    <div className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>Gateway de Pagamento Recorrente</div>
                    <div className="text-xs mt-1" style={{ color: COLORS.textSecondary }}>Prioridade: Crítica · SLA: 21h restantes</div>
                  </div>
                  <ChevronRight size={16} style={{ color: COLORS.danger }} />
                </div>
              </button>
            )}
            {demandState === 'Em Racionalização' && (
              <button onClick={() => navigate('rationalization')} className="w-full text-left p-3 rounded border-2 hover:shadow-sm transition-all" style={{ borderColor: COLORS.warning, backgroundColor: '#FFFBEB' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono mb-0.5" style={{ color: COLORS.warning }}>DEM-2026-001 · EM RACIONALIZAÇÃO</div>
                    <div className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>Gateway de Pagamento Recorrente</div>
                    <div className="text-xs mt-1" style={{ color: COLORS.textSecondary }}>Progresso: {racScore}% · {racScore < 100 ? 'Continue de onde parou' : 'Pronto para congelar'}</div>
                  </div>
                  <ChevronRight size={16} style={{ color: COLORS.warning }} />
                </div>
              </button>
            )}
            {demandState === 'Devolvido pelo PM' && (
              <button onClick={() => navigate('rpRevision')} className="w-full text-left p-3 rounded border-2 hover:shadow-sm transition-all" style={{ borderColor: COLORS.danger, backgroundColor: '#FEF2F2' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono mb-0.5" style={{ color: COLORS.danger }}>DEM-2026-001 · DEVOLVIDO PELO PM</div>
                    <div className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>Gateway de Pagamento Recorrente — gaps apontados</div>
                    <div className="text-xs mt-1" style={{ color: COLORS.textSecondary }}>Revisar e gerar v1.1</div>
                  </div>
                  <ChevronRight size={16} style={{ color: COLORS.danger }} />
                </div>
              </button>
            )}
            {ACTIVE_RATIONALIZATIONS.map(d => (
              <div key={d.id} className="p-3 rounded border" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono mb-0.5" style={{ color: COLORS.textMuted }}>{d.id}</div>
                    <div className="text-sm" style={{ color: COLORS.textPrimary }}>{d.title}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-xs" style={{ color: COLORS.textSecondary }}>{d.score}%</div>
                    <ChevronRight size={14} style={{ color: COLORS.textMuted }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-lg border bg-white" style={{ borderColor: COLORS.border }}>
          <div className="font-semibold text-sm mb-3" style={{ color: COLORS.textPrimary }}>SLA neste mês</div>
          <div className="text-3xl font-bold mb-1" style={{ color: COLORS.success }}>98%</div>
          <div className="text-xs mb-4" style={{ color: COLORS.textSecondary }}>1 demanda fora de SLA este mês (de 47)</div>
          <BarMini
            color={COLORS.success}
            data={[100, 100, 96, 100, 100, 98, 100, 98]}
            labels={['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8']}
          />
          <div className="mt-3 pt-3 border-t text-xs" style={{ borderColor: COLORS.border, color: COLORS.textMuted }}>Limite operacional: 95%</div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DASHBOARD — CTO (Rafael)
// Pay-justifying KPI: Backlog técnico controlado + reuso de ADRs (decisões reaproveitadas)
// ============================================================
function CTODashboard() {
  const { navigate, demandState } = useApp();
  const ai = AI_IMPACT_PER_PERSONA.cto;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <TourBanner
        personaId="cto"
        title="Bem-vindo, Rafael. Você decide o que é tecnicamente exequível."
        items={[
          'Cada RP que chega já vem com 4 ADRs sugeridos pela IA — você só aprova, ajusta ou rejeita.',
          'O Hero Metric mostra seu backlog técnico em dias — quanto mais baixo, melhor.',
          'KPI "Reuso de ADR" mostra quantas decisões você reaproveitou de outros projetos (cada reuso = ~6h salvas).',
          'Se algo bloqueia, use "Marcar Blocker" para escalar antes do RP avançar.',
        ]}
      />

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-xs uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>Painel do CTO</div>
          <div className="text-2xl font-bold" style={{ color: COLORS.textPrimary }}>Bom dia, Rafael</div>
          <div className="text-sm mt-1" style={{ color: COLORS.textSecondary }}>1 RP aguardando avaliação · 47 ADRs ativos · 3 blockers nesta semana.</div>
        </div>
        {demandState === 'RP Congelado' && (
          <Button icon={Cpu} onClick={() => navigate('techEval')}>Avaliar RP-2026-001</Button>
        )}
      </div>

      <AIImpactBanner hoursSaved={ai.hoursSaved} automatedPct={ai.automatedPct} label={ai.label} persona="cto" />

      <HeroMetric
        label="Backlog técnico em dias"
        value="187"
        suffix="d"
        trend="-43d vs trimestre passado"
        trendDir="up"
        sub="Sob controle · meta < 240d · ADRs aceleram decisões em ~38%"
        sparklineData={[270, 254, 232, 226, 218, 205, 195, 187]}
        sparklineLabel="Últimos 8 meses"
        accent={PERSONAS.cto.color}
        drilldownKey="cto-backlog"
        badge="Pay-justifying KPI"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        <CompactKPI label="Reuso de ADR" value="63" suffix="%" icon={GitBranch} sub="42 ADRs reaproveitados em 67 demandas" accent={COLORS.success} drilldownKey="cto-reuso" />
        <CompactKPI label="Horas economizadas (você)" value={ai.hoursSaved} suffix="h" icon={Sparkles} sub="por semana" accent={COLORS.ai} drilldownKey="cto-aieconomia" />
        <CompactKPI label="Blockers ativos" value={3} icon={AlertOctagon} sub="2 em escalada" accent={COLORS.danger} drilldownKey="cto-blockers" />
        <CompactKPI label="Custo de retrabalho evitado" value="R$ 89k" icon={Shield} sub="trimestre · ADRs preveniram" accent={COLORS.success} drilldownKey="cto-retrabalho" />
        <CompactKPI label="Dívida técnica YTD" value="-22" suffix="%" icon={TrendingDown} sub="Refactors planejados em ADR" accent={COLORS.success} drilldownKey="cto-divida" />
        <CompactKPI label="ADRs criados (mês)" value={11} icon={BookMarked} sub="6 reuso · 5 novos" drilldownKey="cto-novos-adrs" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="ADRs por categoria — KB ativa" subtitle="47 ADRs · clique para drill-down">
          <DonutChart segments={[
            { label: 'Pagamentos', value: 12, color: PERSONAS.cto.color },
            { label: 'Notificações', value: 9, color: '#60A5FA' },
            { label: 'Auth', value: 8, color: COLORS.success },
            { label: 'Dados', value: 11, color: COLORS.warning },
            { label: 'UI/UX', value: 7, color: '#EC4899' },
          ]} centerLabel="ADRs" centerValue={47} />
        </ChartCard>

        <ChartCard title="Decisões por mês" subtitle="Reuso × Novas">
          <HorizontalBars
            max={15}
            items={[
              { label: 'Jan', value: 12, color: PERSONAS.cto.color },
              { label: 'Fev', value: 11, color: PERSONAS.cto.color },
              { label: 'Mar', value: 14, color: PERSONAS.cto.color },
              { label: 'Abr', value: 13, color: PERSONAS.cto.color },
              { label: 'Mai', value: 11, color: PERSONAS.cto.color },
            ]}
            formatValue={v => v}
          />
        </ChartCard>
      </div>

      <div className="p-5 rounded-lg border bg-white" style={{ borderColor: COLORS.border }}>
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>Aguardando sua avaliação</div>
          <button onClick={() => navigate('adrLibrary')} className="text-xs underline" style={{ color: COLORS.textSecondary }}>Ver Biblioteca de ADRs</button>
        </div>
        {demandState === 'RP Congelado' || demandState === 'Em Avaliação Técnica' ? (
          <button onClick={() => navigate('techEval')} className="w-full text-left p-4 rounded border-2 hover:shadow-sm transition-all" style={{ borderColor: PERSONAS.cto.color, backgroundColor: '#FAF5FF' }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-mono mb-0.5" style={{ color: PERSONAS.cto.color }}>RP-2026-001 v1.0 · CONGELADO</div>
                <div className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>Gateway de Pagamento Recorrente</div>
                <div className="text-xs mt-1" style={{ color: COLORS.textSecondary }}>4 ADRs pré-sugeridos · 15 pendências técnicas pré-preenchidas pela IA</div>
              </div>
              <ChevronRight size={16} style={{ color: PERSONAS.cto.color }} />
            </div>
          </button>
        ) : (
          <div className="text-center py-10 text-sm" style={{ color: COLORS.textMuted }}>Nenhum RP congelado aguardando.</div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// DASHBOARD — PM (Juliana)
// Pay-justifying KPI: Aceite na 1ª vez + acurácia dos gaps apontados
// ============================================================
function PMDashboard() {
  const { navigate, demandState, rpVersion } = useApp();
  const ai = AI_IMPACT_PER_PERSONA.pm;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <TourBanner
        personaId="pm"
        title="Bem-vinda, Juliana. Você é a última linha de defesa antes da execução."
        items={[
          'Você recebe RPs congelados e decide se eles estão prontos para execução.',
          'O Hero Metric mostra sua taxa de aceite na primeira vez (quanto mais alta, menos retrabalho).',
          'Você pode selecionar trecho do RP para apontar gap, comentar ou perguntar.',
          'Cada gap que você aponta vira card de revisão para o PO (que gera v1.1 do RP).',
        ]}
      />

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-xs uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>Painel do PM</div>
          <div className="text-2xl font-bold" style={{ color: COLORS.textPrimary }}>Bom dia, Juliana</div>
          <div className="text-sm mt-1" style={{ color: COLORS.textSecondary }}>1 RP para avaliar · 8 projetos em execução.</div>
        </div>
      </div>

      <AIImpactBanner hoursSaved={ai.hoursSaved} automatedPct={ai.automatedPct} label={ai.label} persona="pm" />

      <HeroMetric
        label="Aceite de RP na 1ª vez"
        value="74"
        suffix="%"
        trend="+15pp vs trimestre passado"
        trendDir="up"
        sub="Meta: 70% · Cada RP devolvido custa ~3 dias de retrabalho ao PO"
        sparklineData={[55, 58, 62, 65, 68, 70, 72, 74]}
        sparklineLabel="Últimos 8 meses"
        accent={PERSONAS.pm.color}
        drilldownKey="pm-aceite"
        badge="Pay-justifying KPI"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        <CompactKPI label="Acurácia dos gaps apontados" value="92" suffix="%" icon={Target} sub="gaps que viraram melhoria real" accent={COLORS.success} drilldownKey="pm-gaps" />
        <CompactKPI label="Projetos em execução" value={8} icon={Briefcase} sub="3 no prazo · 4 alerta · 1 atrasado" drilldownKey="pm-execucao" />
        <CompactKPI label="Horas economizadas (você)" value={ai.hoursSaved} suffix="h" icon={Sparkles} sub="por semana" accent={COLORS.ai} drilldownKey="pm-aieconomia" />
        <CompactKPI label="Tempo de análise por RP" value="38" suffix="min" icon={Timer} trend="-22min com IA" trendDir="up" drilldownKey="pm-analise" />
        <CompactKPI label="RPs avaliados (mês)" value={12} icon={CheckCircle2} sub="9 aceitos · 2 devolvidos · 1 em análise" drilldownKey="pm-avaliados" />
        <CompactKPI label="Comentários públicos" value={47} icon={MessageSquare} sub="reaproveitamento por outros PMs" drilldownKey="pm-comentarios" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Razão dos gaps apontados" subtitle="92 gaps YTD · clique para detalhe">
          <DonutChart segments={[
            { label: 'Critérios incompletos', value: 32, color: PERSONAS.pm.color },
            { label: 'Riscos não cobertos', value: 24, color: COLORS.warning },
            { label: 'Premissas não validadas', value: 18, color: COLORS.danger },
            { label: 'Dependências não mapeadas', value: 18, color: '#60A5FA' },
          ]} centerLabel="Gaps" centerValue={92} />
        </ChartCard>

        <ChartCard title="Aceites do mês" subtitle="9 aceitos · 2 devolvidos · 1 em análise">
          <BarMini
            color={COLORS.success}
            data={[3, 2, 4, 3, 2, 4, 3, 2]}
            labels={['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8']}
          />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-lg border bg-white" style={{ borderColor: COLORS.border }}>
          <div className="font-semibold text-sm mb-3" style={{ color: COLORS.textPrimary }}>Aguardando sua avaliação</div>
          {demandState === 'Em Avaliação Técnica' && rpVersion ? (
            <button onClick={() => navigate('rpView', { version: rpVersion })} className="w-full text-left p-4 rounded border-2 hover:shadow-sm transition-all" style={{ borderColor: PERSONAS.pm.color, backgroundColor: '#ECFDF5' }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono mb-0.5" style={{ color: PERSONAS.pm.color }}>RP-2026-001 v{rpVersion} · AVALIAÇÃO TÉCNICA OK</div>
                  <div className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>Gateway de Pagamento Recorrente</div>
                  <div className="text-xs mt-1" style={{ color: COLORS.textSecondary }}>17 seções · 4 ADRs · score 91%</div>
                </div>
                <ChevronRight size={16} style={{ color: PERSONAS.pm.color }} />
              </div>
            </button>
          ) : (
            <div className="text-center py-8 text-sm" style={{ color: COLORS.textMuted }}>Nenhum RP aguardando.</div>
          )}
        </div>

        <div className="p-5 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md" style={{ borderColor: COLORS.ai, background: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)' }} onClick={() => navigate('showcaseRP')}>
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FFFFFF' }}>
              <Award size={20} style={{ color: COLORS.ai }} />
            </div>
            <div className="flex-1">
              <div className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: COLORS.ai }}>Benchmark de qualidade</div>
              <div className="font-semibold text-sm mb-1" style={{ color: COLORS.textPrimary }}>RP-2026-000 · WebSocket Notifications</div>
              <div className="text-xs leading-relaxed" style={{ color: COLORS.textSecondary }}>
                RP entregue há 2 semanas. Score 96%, NPS 9.4, aceite na 1ª vez. Cada seção tem proveniência rastreável.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: COLORS.ai }}>
            Estudar referência <ArrowRight size={12} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DASHBOARD — VIEWER / CFO (Ana)
// Pay-justifying KPI: ROI realizado vs projetado + visibilidade de cada R$ investido
// ============================================================
function ViewerDashboard() {
  const { navigate } = useApp();
  const ai = AI_IMPACT_PER_PERSONA.viewer;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <TourBanner
        personaId="viewer"
        title="Bem-vinda, Ana. Você acompanha cada R$ investido em produto."
        items={[
          'Você não edita demandas — apenas lê RPs, comenta e questiona.',
          'O Hero Metric mostra ROI realizado vs projetado em todas as entregas.',
          'Você pode selecionar trecho do RP para perguntar ou comentar (visível a todos).',
          'Cada decisão tem proveniência rastreável — clique no badge ao lado de qualquer afirmação.',
        ]}
      />

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-xs uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>Painel do CFO</div>
          <div className="text-2xl font-bold" style={{ color: COLORS.textPrimary }}>Bom dia, Ana</div>
          <div className="text-sm mt-1" style={{ color: COLORS.textSecondary }}>R$ 1.84M investidos YTD · 8 entregas com ROI confirmado.</div>
        </div>
      </div>

      <AIImpactBanner hoursSaved={ai.hoursSaved} automatedPct={ai.automatedPct} label={ai.label} persona="viewer" />

      <HeroMetric
        label="ROI realizado vs projetado (YTD)"
        value="3.8"
        suffix="x"
        trend="+0.4x acima do projetado"
        trendDir="up"
        sub="R$ 6.99M de retorno · R$ 1.84M investido · 8 demandas mensuradas"
        sparklineData={[2.2, 2.6, 3.0, 3.2, 3.4, 3.5, 3.7, 3.8]}
        sparklineLabel="Acumulado mensal"
        accent={COLORS.success}
        drilldownKey="cfo-realizado"
        badge="Pay-justifying KPI"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        <CompactKPI label="Investimento YTD" value="R$ 1.84M" icon={DollarSign} sub="14 demandas · média R$ 131k" drilldownKey="cfo-investimento" />
        <CompactKPI label="Retorno confirmado" value="R$ 6.99M" icon={TrendingUp} sub="8 demandas com ROI mensurado" accent={COLORS.success} drilldownKey="cfo-retorno" />
        <CompactKPI label="Custo de demandas canceladas" value="R$ 47k" icon={TrendingDown} sub="2 paradas no Discovery · economia" accent={COLORS.warning} drilldownKey="cfo-cancelado" />
        <CompactKPI label="Defensibilidade" value="100" suffix="%" icon={Shield} sub="cada R$ tem RP rastreável" accent={COLORS.success} drilldownKey="cfo-defensibilidade" />
        <CompactKPI label="Acurácia da previsão" value="86" suffix="%" icon={Target} sub="custo real vs estimativa" drilldownKey="cfo-acuracia" />
        <CompactKPI label="Decisões reaproveitadas" value="42" icon={GitBranch} sub="custo evitado: R$ 268k" accent={COLORS.success} drilldownKey="cfo-reuso" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Distribuição do investimento (R$)" subtitle="por área de impacto">
          <DonutChart segments={[
            { label: 'Eficiência operacional', value: 620, color: PERSONAS.submitter.color },
            { label: 'Receita', value: 580, color: COLORS.success },
            { label: 'Compliance', value: 380, color: COLORS.warning },
            { label: 'Produto', value: 260, color: COLORS.ai },
          ]} centerLabel="K R$" centerValue={1840} />
        </ChartCard>

        <ChartCard title="ROI por demanda entregue (top 8)" subtitle="x = múltiplo do investido">
          <HorizontalBars
            max={10}
            items={[
              { label: 'DEM-2025-099', value: 9.2, color: COLORS.success },
              { label: 'DEM-2025-088', value: 5.4, color: COLORS.success },
              { label: 'DEM-2025-072', value: 4.7, color: COLORS.success },
              { label: 'DEM-2025-061', value: 4.1, color: COLORS.success },
              { label: 'DEM-2025-055', value: 3.2, color: COLORS.warning },
              { label: 'DEM-2025-041', value: 2.8, color: COLORS.warning },
              { label: 'DEM-2025-027', value: 1.9, color: COLORS.danger },
              { label: 'DEM-2025-019', value: 1.3, color: COLORS.danger },
            ]}
            formatValue={v => `${v}x`}
          />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-lg border bg-white" style={{ borderColor: COLORS.border }}>
          <div className="font-semibold text-sm mb-3" style={{ color: COLORS.textPrimary }}>RPs disponíveis para leitura</div>
          <div className="space-y-2">
            {OTHER_DEMANDS.map(d => (
              <div key={d.id} className="p-3 rounded border flex items-center justify-between" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
                <div>
                  <div className="text-xs font-mono mb-0.5" style={{ color: COLORS.textMuted }}>{d.id}</div>
                  <div className="text-sm" style={{ color: COLORS.textPrimary }}>{d.title}</div>
                </div>
                <StatusPill status={d.state} />
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md" style={{ borderColor: COLORS.ai, background: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)' }} onClick={() => navigate('showcaseRP')}>
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FFFFFF' }}>
              <Award size={20} style={{ color: COLORS.ai }} />
            </div>
            <div className="flex-1">
              <div className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: COLORS.ai }}>Defensibilidade do investimento</div>
              <div className="font-semibold text-sm mb-1" style={{ color: COLORS.textPrimary }}>RP-2026-000 · WebSocket Notifications</div>
              <div className="text-xs leading-relaxed" style={{ color: COLORS.textSecondary }}>
                R$ 142k investidos · R$ 580k de receita projetada · cada afirmação rastreável. Veja como o investimento é defendido.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: COLORS.ai }}>
            Ver exemplo completo <ArrowRight size={12} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const { persona } = useApp();
  if (!persona) return null;
  if (persona.id === 'submitter') return <SubmitterDashboard />;
  if (persona.id === 'po')        return <PODashboard />;
  if (persona.id === 'cto')       return <CTODashboard />;
  if (persona.id === 'pm')        return <PMDashboard />;
  if (persona.id === 'viewer')    return <ViewerDashboard />;
  return null;
}

// ============================================================
// NEW DEMAND
// ============================================================
function ProcessStep({ done, active, text }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      {done ? <Check size={16} style={{ color: COLORS.success }} /> :
       active ? <Loader2 size={16} className="animate-spin" style={{ color: COLORS.info }} /> :
       <Circle size={16} style={{ color: COLORS.textMuted }} />}
      <span style={{ color: done || active ? COLORS.textPrimary : COLORS.textMuted }}>{text}</span>
    </div>
  );
}

function NewDemandScreen() {
  const { navigate, showToast, setAttachments } = useApp();
  const [text, setText] = useState('A gente precisa começar a receber pagamento por cartão recorrente. Hoje é tudo boleto e isso tá nos atrasando — o time financeiro perde umas 30 horas por mês reconciliando manualmente, e a inadimplência tá em 18%. Anexei o doc de estratégia.');
  const [files, setFiles] = useState([{ id: 1, name: 'estrategia-monetizacao.pdf', size: '2.3 MB' }]);
  const [audio, setAudio] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [processStage, setProcessStage] = useState(0);

  useEffect(() => {
    if (!recording) return;
    const t = setInterval(() => setRecordTime(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [recording]);

  const handleContinue = () => {
    if (audio) setAttachments(prev => [...prev.filter(a => a.type !== 'audio'), { id: `att-audio-${Date.now()}`, name: `audio-demanda-${audio.duration}s.mp3`, size: `${(audio.duration * 0.08).toFixed(1)} MB`, type: 'audio', duration: audio.duration }]);
    setProcessing(true);
    setProcessStage(0);
    setTimeout(() => setProcessStage(1), 800);
    setTimeout(() => setProcessStage(2), 1800);
    setTimeout(() => setProcessStage(3), 3000);
  };

  if (processing) {
    return (
      <div className="max-w-2xl mx-auto pt-16 p-8">
        <div className="border rounded-lg p-12" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
          {processStage < 3 ? (
            <>
              <div className="flex flex-col items-center mb-8">
                <Loader2 size={32} className="animate-spin mb-3" style={{ color: COLORS.info }} />
                <div className="text-xl font-semibold" style={{ color: COLORS.textPrimary }}>Processando...</div>
              </div>
              <div className="space-y-3 max-w-md mx-auto">
                <ProcessStep done={processStage >= 1} active={processStage === 0} text="Lendo seu texto" />
                <ProcessStep done={processStage >= 2} active={processStage === 1} text="Analisando estrategia-monetizacao.pdf" />
                <ProcessStep done={processStage >= 3} active={processStage === 2} text="Identificando informações úteis para a demanda..." />
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${COLORS.success}20` }}>
                <Check size={32} style={{ color: COLORS.success }} />
              </div>
              <div className="text-xl font-semibold mb-2" style={{ color: COLORS.textPrimary }}>Processamento concluído</div>
              <div className="text-sm mb-6 max-w-md mx-auto" style={{ color: COLORS.textSecondary }}>
                Li seu documento e identifiquei 5 informações úteis. Vou usar para adiantar o preenchimento. Faltam apenas 3 pendências pra você responder.
              </div>
              <Button size="lg" icon={ArrowRight} onClick={() => { navigate('captureQueue'); showToast('Demanda DEM-2026-001 criada'); }}>Continuar</Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl p-8">
      <button onClick={() => navigate('dashboard')} className="flex items-center gap-1 text-sm mb-4 hover:opacity-70" style={{ color: COLORS.textSecondary }}>
        <ChevronLeft size={14} /> Voltar
      </button>

      <h1 className="text-2xl font-bold mb-2" style={{ color: COLORS.textPrimary }}>Nova Demanda</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.textSecondary }}>
        Conte como se estivesse falando com um colega. A plataforma estrutura o resto.
      </p>

      <div className="border rounded-lg p-6" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: COLORS.textMuted }}>O que aconteceu?</label>
        <textarea value={text} onChange={e => setText(e.target.value)} rows={8} className="w-full p-3 text-sm rounded-md border focus:outline-none focus:ring-2 resize-none" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg, color: COLORS.textPrimary }} />

        <div className="mt-4">
          <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: COLORS.textMuted }}>Ou anexe algo que ajude</label>
          <div className="flex gap-2 mb-3">
            <Button variant="secondary" size="sm" icon={Paperclip} onClick={() => setFiles(prev => [...prev, { id: Date.now(), name: 'documento-extra.pdf', size: '1.1 MB' }])}>Subir documento</Button>
            {!recording && !audio && (
              <Button variant="secondary" size="sm" icon={Mic} onClick={() => { setRecording(true); setRecordTime(0); }}>Gravar áudio</Button>
            )}
            {recording && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border" style={{ borderColor: COLORS.danger, backgroundColor: `${COLORS.danger}10` }}>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: COLORS.danger }} />
                <span className="text-xs font-medium" style={{ color: COLORS.danger }}>Gravando {Math.floor(recordTime/60)}:{String(recordTime%60).padStart(2,'0')}</span>
                <button onClick={() => { setRecording(false); setAudio({ duration: recordTime }); }} className="ml-1 p-0.5 rounded hover:bg-red-100"><Square size={12} fill={COLORS.danger} style={{ color: COLORS.danger }} /></button>
              </div>
            )}
          </div>

          {files.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-xs font-medium" style={{ color: COLORS.textMuted }}>Documentos anexados:</div>
              {files.map(f => (
                <div key={f.id} className="flex items-center justify-between px-3 py-2 rounded-md border" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
                  <div className="flex items-center gap-2"><FileText size={14} style={{ color: COLORS.textSecondary }} /><span className="text-sm" style={{ color: COLORS.textPrimary }}>{f.name}</span><span className="text-xs" style={{ color: COLORS.textMuted }}>({f.size})</span></div>
                  <button onClick={() => setFiles(files.filter(x => x.id !== f.id))} className="p-1 hover:bg-stone-200 rounded"><X size={12} style={{ color: COLORS.textMuted }} /></button>
                </div>
              ))}
            </div>
          )}
          {audio && (
            <div className="mt-2 flex items-center justify-between px-3 py-2 rounded-md border" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
              <div className="flex items-center gap-2"><Mic size={14} style={{ color: COLORS.textSecondary }} /><span className="text-sm" style={{ color: COLORS.textPrimary }}>Áudio gravado: {Math.floor(audio.duration/60)}:{String(audio.duration%60).padStart(2,'0')}</span></div>
              <button onClick={() => setAudio(null)} className="p-1 hover:bg-stone-200 rounded"><X size={12} style={{ color: COLORS.textMuted }} /></button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="secondary" onClick={() => navigate('dashboard')}>Cancelar</Button>
        <Button icon={ArrowRight} disabled={!text.trim() && files.length === 0 && !audio} onClick={handleContinue}>Continuar</Button>
      </div>
    </div>
  );
}

// ============================================================
// CAPTURE QUEUE
// ============================================================
function ModeButton({ active, icon: Icon, label, onClick }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm font-medium" style={{
      backgroundColor: active ? COLORS.bgElevated : 'transparent',
      borderColor: active ? COLORS.borderStrong : COLORS.border,
      color: active ? COLORS.textPrimary : COLORS.textSecondary,
    }}>
      <Icon size={14} />{label}
    </button>
  );
}

function CaptureQueueScreen() {
  const { capturePendencies, captureScore, captureStats, navigate, demandTitle, attachments } = useApp();
  const [selected, setSelected] = useState(null);
  const [showResolved, setShowResolved] = useState(false);

  const emptyOnes = capturePendencies.filter(p => p.status === 'empty');
  const lowConfOnes = capturePendencies.filter(p => p.status === 'low_confidence');
  const resolvedOnes = capturePendencies.filter(p => ['resolved', 'manually_accepted'].includes(p.status));
  const naOnes = capturePendencies.filter(p => p.status === 'not_applicable');
  const canSend = captureScore === 100;

  return (
    <div className="max-w-5xl mx-auto p-8">
      <button onClick={() => navigate('dashboard')} className="flex items-center gap-1 text-sm mb-4 hover:opacity-70" style={{ color: COLORS.textSecondary }}>
        <ChevronLeft size={14} /> Dashboard
      </button>

      <div className="flex items-center gap-3 mb-2">
        <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: COLORS.bgSubtle, color: COLORS.textSecondary }}>DEM-2026-001</span>
        <StatusPill status="Em Captura" />
        <button onClick={() => navigate('timeline')} className="ml-auto text-xs flex items-center gap-1 px-2 py-1 rounded hover:bg-stone-100" style={{ color: COLORS.textSecondary }}>
          <Clock size={12} /> Histórico
        </button>
      </div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: COLORS.textPrimary }}>{demandTitle}</h1>

      <div className="border rounded-lg p-6 mb-8 flex items-center gap-8" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <ScoreRing score={captureScore} size={96} strokeWidth={8} />
        <div className="flex-1">
          <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>Próximo passo</div>
          <div className="text-base font-semibold mb-1" style={{ color: COLORS.textPrimary }}>
            {captureScore === 100 ? 'Tudo pronto! Envie para Triagem do PO.' : `Responder ${captureStats.empty + captureStats.lowConf} pendência${captureStats.empty + captureStats.lowConf > 1 ? 's' : ''}`}
          </div>
          {captureScore < 100 && (
            <div className="text-sm" style={{ color: COLORS.textSecondary }}>{captureStats.empty} {captureStats.empty === 1 ? 'vazia' : 'vazias'}, {captureStats.lowConf} com baixa confiança</div>
          )}
          <div className="mt-3 flex items-center gap-4 text-xs" style={{ color: COLORS.textMuted }}>
            <span>{captureStats.resolved} de {captureStats.total} resolvidas</span>
            <span>·</span>
            <span>{attachments.length} {attachments.length === 1 ? 'anexo' : 'anexos'}</span>
          </div>
        </div>
      </div>

      {emptyOnes.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.danger }} />
            <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.danger }}>Precisam de você · {emptyOnes.length} {emptyOnes.length === 1 ? 'vazia' : 'vazias'}</h2>
          </div>
          <div className="space-y-2">{emptyOnes.map(p => <PendencyCard key={p.id} pendency={p} onClick={() => setSelected(p)} />)}</div>
        </section>
      )}

      {lowConfOnes.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.warning }} />
            <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.warning }}>Precisam de confirmação · {lowConfOnes.length} com baixa confiança</h2>
          </div>
          <div className="space-y-2">{lowConfOnes.map(p => <PendencyCard key={p.id} pendency={p} onClick={() => setSelected(p)} />)}</div>
        </section>
      )}

      <section className="mb-8">
        <button onClick={() => setShowResolved(!showResolved)} className="flex items-center gap-2 mb-3 hover:opacity-80">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.success }} />
          <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.success }}>Já resolvidas · {resolvedOnes.length}</h2>
          {showResolved ? <ChevronDown size={14} style={{ color: COLORS.textMuted }} /> : <ChevronRight size={14} style={{ color: COLORS.textMuted }} />}
        </button>
        {showResolved && <div className="space-y-2">{resolvedOnes.map(p => <PendencyCard key={p.id} pendency={p} onClick={() => setSelected(p)} />)}</div>}
      </section>

      {naOnes.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.textMuted }} />
            <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.textMuted }}>Não aplicáveis · {naOnes.length}</h2>
          </div>
          <div className="space-y-2">{naOnes.map(p => <PendencyCard key={p.id} pendency={p} onClick={() => setSelected(p)} />)}</div>
        </section>
      )}

      <div className="border rounded-lg p-4 flex items-center justify-between sticky bottom-4 shadow-md" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="text-xs" style={{ color: COLORS.textMuted }}>{canSend ? 'Pronto pra enviar' : `Faltam ${100 - captureScore}% pra liberar envio`}</div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate('captureReview')}>Revisar tudo</Button>
          <Button icon={Send} disabled={!canSend} onClick={() => navigate('captureReview')}>Enviar para Triagem</Button>
        </div>
      </div>

      {selected && <PendencyAnswerModal pendency={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function PendencyAnswerModal({ pendency, onClose }) {
  const { updatePendency, showToast } = useApp();
  const [mode, setMode] = useState('text');
  const [text, setText] = useState(pendency.a || '');
  const [audioStage, setAudioStage] = useState('idle');
  const [audioTime, setAudioTime] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [showNA, setShowNA] = useState(false);
  const [naReason, setNaReason] = useState('');

  const isLowConf = pendency.status === 'low_confidence';
  const isResolved = pendency.status === 'resolved';
  const isEmpty = pendency.status === 'empty';

  const MOCK_TRANSCRIPTIONS = {
    'cap-5': {
      transcription: 'A gente não pode mexer no contrato dos clientes existentes que pagam via boleto. Só novos clientes e quem topar migrar. Sobre orçamento, o custo de integração precisa caber no budget de eng do trimestre. E temos um compromisso de LGPD compliance no contrato com 2 clientes enterprise.',
      structured: ['Clientes em boleto existente: migração opt-in apenas', 'Orçamento: dentro do trimestre de engenharia', 'LGPD compliance é compromisso contratual com 2 clientes enterprise']
    },
    'cap-8': {
      transcription: 'Precisa avisar a CFO Ana, o head de eng Pedro, a Lucia que é CS lead e o Roberto do jurídico.',
      structured: ['CFO Ana Santos', 'Head de Eng Pedro Costa', 'CS Lead Lucia Mendes', 'Jurídico Roberto Lima']
    }
  };

  useEffect(() => {
    if (audioStage !== 'recording') return;
    const t = setInterval(() => setAudioTime(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [audioStage]);

  const startRecording = () => { setAudioStage('recording'); setAudioTime(0); };
  const stopRecording = () => { setAudioStage('transcribing'); setTimeout(() => setAudioStage('done'), 1800); };

  const handleSave = () => {
    const newAnswer = text.trim();
    if (!newAnswer) return;
    if (isLowConf || isResolved) {
      setAnalyzing(true);
      setTimeout(() => {
        const changed = newAnswer !== pendency.a;
        const newConfidence = changed ? Math.min(98, pendency.confidence + 22) : pendency.confidence;
        updatePendency(pendency.id, { a: newAnswer, confidence: newConfidence, status: newConfidence >= 90 ? 'resolved' : 'low_confidence' });
        showToast(changed ? `Re-analisado! Confiança subiu para ${newConfidence}%` : 'Resposta confirmada');
        onClose();
      }, 1200);
    } else {
      updatePendency(pendency.id, { a: newAnswer, confidence: 95, status: 'resolved' });
      showToast('Pendência respondida');
      onClose();
    }
  };

  const acceptAsIs = () => { updatePendency(pendency.id, { a: pendency.a, confidence: pendency.confidence, status: 'manually_accepted' }); showToast('Resposta aceita manualmente'); onClose(); };
  const markNotApplicable = (reason) => { updatePendency(pendency.id, { a: '', confidence: 0, status: 'not_applicable', naReason: reason }); showToast('Pendência marcada como N/A'); onClose(); };

  const useAudioTranscription = () => {
    const mock = MOCK_TRANSCRIPTIONS[pendency.id];
    if (mock) { setText(mock.structured.map((s, i) => `${i + 1}. ${s}`).join('\n')); setAudioStage('idle'); setMode('text'); }
  };

  const transcription = MOCK_TRANSCRIPTIONS[pendency.id];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-2xl rounded-xl shadow-2xl border max-h-[90vh] overflow-y-auto" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: COLORS.border }}>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>{isEmpty ? 'Responder pendência' : isLowConf ? 'Revisar resposta' : 'Editar resposta'}</div>
            <div className="font-semibold text-base" style={{ color: COLORS.textPrimary }}>{pendency.q}</div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-stone-100 rounded"><X size={18} style={{ color: COLORS.textMuted }} /></button>
        </div>

        <div className="p-6">
          {isLowConf && (
            <div className="mb-5">
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>Resposta sugerida ({pendency.confidence}% de confiança)</div>
              <div className="border rounded-md p-3 mb-2" style={{ backgroundColor: `${COLORS.warning}10`, borderColor: `${COLORS.warning}40` }}>
                <div className="text-sm" style={{ color: COLORS.textPrimary }}>{pendency.a}</div>
              </div>
              <div className="text-xs" style={{ color: COLORS.textMuted }}>Origem: {pendency.source}</div>
              {pendency.hint && (
                <div className="flex gap-2 mt-3 p-3 rounded-md border" style={{ backgroundColor: `${COLORS.info}10`, borderColor: `${COLORS.info}30` }}>
                  <Sparkles size={14} className="flex-shrink-0 mt-0.5" style={{ color: COLORS.info }} />
                  <div className="text-xs" style={{ color: COLORS.textPrimary }}><span className="font-semibold">Dica:</span> {pendency.hint}</div>
                </div>
              )}
            </div>
          )}

          {isEmpty && (
            <div className="mb-4">
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>Como você quer responder?</div>
              <div className="flex gap-2">
                <ModeButton active={mode === 'text'} icon={Edit3} label="Texto" onClick={() => setMode('text')} />
                <ModeButton active={mode === 'audio'} icon={Mic} label="Áudio" onClick={() => setMode('audio')} />
                <ModeButton active={mode === 'file'} icon={Paperclip} label="Anexar arquivo" onClick={() => setMode('file')} />
              </div>
            </div>
          )}

          {(mode === 'text' || isLowConf || isResolved) && (
            <>
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>{isLowConf ? 'Edite se necessário' : 'Sua resposta'}</div>
              <textarea value={text} onChange={e => setText(e.target.value)} rows={6} className="w-full p-3 text-sm rounded-md border focus:outline-none focus:ring-2 resize-none" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg, color: COLORS.textPrimary }} />
            </>
          )}

          {mode === 'audio' && isEmpty && (
            <div className="border rounded-lg p-6 text-center" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
              {audioStage === 'idle' && (<>
                <Mic size={32} className="mx-auto mb-3" style={{ color: COLORS.textSecondary }} />
                <div className="text-sm mb-4" style={{ color: COLORS.textPrimary }}>Pressione para começar a gravar</div>
                <Button icon={Mic} onClick={startRecording}>Gravar</Button>
              </>)}
              {audioStage === 'recording' && (<>
                <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center animate-pulse" style={{ backgroundColor: `${COLORS.danger}20` }}>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.danger }} />
                </div>
                <div className="text-base font-semibold mb-1" style={{ color: COLORS.danger }}>Gravando {Math.floor(audioTime/60)}:{String(audioTime%60).padStart(2,'0')}</div>
                <Button variant="danger" icon={Square} onClick={stopRecording}>Parar</Button>
              </>)}
              {audioStage === 'transcribing' && (<>
                <Loader2 size={32} className="animate-spin mx-auto mb-3" style={{ color: COLORS.info }} />
                <div className="text-sm" style={{ color: COLORS.textPrimary }}>Áudio gravado. Transcrevendo...</div>
              </>)}
              {audioStage === 'done' && transcription && (
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <Check size={16} style={{ color: COLORS.success }} />
                    <div className="text-sm font-semibold" style={{ color: COLORS.textPrimary }}>Transcrito:</div>
                  </div>
                  <div className="text-sm mb-4 p-3 rounded-md border" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border, color: COLORS.textSecondary, fontStyle: 'italic' }}>"{transcription.transcription}"</div>
                  <div className="text-sm font-medium mb-2" style={{ color: COLORS.textPrimary }}>A plataforma identificou {transcription.structured.length} {transcription.structured.length === 1 ? 'item' : 'itens'} estruturados:</div>
                  <div className="space-y-1.5 mb-4">
                    {transcription.structured.map((s, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm"><span className="text-xs font-mono mt-0.5" style={{ color: COLORS.textMuted }}>{i + 1}.</span><span style={{ color: COLORS.textPrimary }}>{s}</span></div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => setAudioStage('idle')}>Gravar de novo</Button>
                    <Button size="sm" onClick={useAudioTranscription}>Usar essa transcrição</Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {mode === 'file' && isEmpty && (
            <div className="border-2 border-dashed rounded-lg p-8 text-center" style={{ borderColor: COLORS.border }}>
              <Paperclip size={28} className="mx-auto mb-2" style={{ color: COLORS.textMuted }} />
              <div className="text-sm mb-2" style={{ color: COLORS.textPrimary }}>Anexar arquivo de referência</div>
              <Button variant="secondary" size="sm" icon={Paperclip}>Escolher arquivo</Button>
            </div>
          )}

          {analyzing && (
            <div className="mt-4 flex items-center gap-2 p-3 rounded-md" style={{ backgroundColor: `${COLORS.info}10` }}>
              <Loader2 size={14} className="animate-spin" style={{ color: COLORS.info }} />
              <span className="text-sm" style={{ color: COLORS.info }}>Re-analisando confiança...</span>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t flex justify-between items-center gap-2" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
          <button onClick={() => setShowNA(!showNA)} className="text-xs underline hover:opacity-70" style={{ color: COLORS.textMuted }}>
            {showNA ? 'Cancelar N/A' : 'Não se aplica a esta demanda'}
          </button>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose} disabled={analyzing}>Cancelar</Button>
            {isLowConf && <Button variant="secondary" onClick={acceptAsIs} disabled={analyzing}>Confirmar como está</Button>}
            <Button onClick={handleSave} disabled={!text.trim() || analyzing}>{isLowConf ? 'Salvar edição' : 'Salvar resposta'}</Button>
          </div>
        </div>

        {showNA && (
          <div className="px-6 py-4 border-t" style={{ borderColor: COLORS.border, backgroundColor: '#FAFAF9' }}>
            <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>Justificativa de N/A (obrigatória)</div>
            <textarea value={naReason} onChange={e => setNaReason(e.target.value)} rows={2} className="w-full p-2.5 text-sm rounded-md border focus:outline-none resize-none mb-2" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgElevated, color: COLORS.textPrimary }} placeholder="Ex: Esta demanda não tem dependências externas..." />
            <div className="flex justify-end">
              <Button size="sm" disabled={!naReason.trim()} onClick={() => markNotApplicable(naReason)}>Marcar como N/A</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// CAPTURE REVIEW
// ============================================================
function CaptureReviewScreen() {
  const { capturePendencies, attachments, navigate, showToast, setDemandState } = useApp();
  const resolved = capturePendencies.filter(p => ['resolved', 'manually_accepted'].includes(p.status));
  const na = capturePendencies.filter(p => p.status === 'not_applicable');

  return (
    <div className="max-w-4xl mx-auto p-8">
      <button onClick={() => navigate('captureQueue')} className="flex items-center gap-1 text-sm mb-4 hover:opacity-70" style={{ color: COLORS.textSecondary }}>
        <ChevronLeft size={14} /> Voltar
      </button>
      <h1 className="text-2xl font-bold mb-2" style={{ color: COLORS.textPrimary }}>Revisar antes de enviar</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.textSecondary }}>Esta é a versão final que o PO Marina receberá para triagem.</p>

      <div className="border rounded-lg p-6 mb-6" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: COLORS.textMuted }}>Captura · DEM-2026-001</div>
        <div className="space-y-4">
          {resolved.map(p => (
            <div key={p.id} className="pb-4 border-b" style={{ borderColor: COLORS.border }}>
              <div className="text-xs font-medium mb-1" style={{ color: COLORS.textMuted }}>{p.q}</div>
              <div className="text-sm" style={{ color: COLORS.textPrimary }}>{p.a}</div>
              <div className="text-xs mt-1" style={{ color: COLORS.textMuted }}>Origem: {p.source}</div>
            </div>
          ))}
          {na.map(p => (
            <div key={p.id} className="pb-4 border-b" style={{ borderColor: COLORS.border }}>
              <div className="text-xs font-medium mb-1" style={{ color: COLORS.textMuted }}>{p.q}</div>
              <div className="text-sm italic" style={{ color: COLORS.textMuted }}>N/A — {p.naReason || 'sem justificativa'}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="border rounded-lg p-6 mb-6" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: COLORS.textMuted }}>Anexos · {attachments.length}</div>
        <div className="space-y-2">
          {attachments.map(a => (
            <div key={a.id} className="flex items-center gap-2 text-sm">
              <FileText size={14} style={{ color: COLORS.textSecondary }} /><span style={{ color: COLORS.textPrimary }}>{a.name}</span><span className="text-xs" style={{ color: COLORS.textMuted }}>({a.size})</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={() => navigate('captureQueue')}>Voltar e editar</Button>
        <Button icon={Send} onClick={() => { setDemandState('Pronta para Triagem'); showToast('Enviado para PO Marina — Triagem'); navigate('dashboard'); }}>Enviar para Triagem</Button>
      </div>
    </div>
  );
}

// ============================================================
// TRIAGE QUEUE
// ============================================================
function TriageQueueScreen() {
  const { navigate, demandState } = useApp();
  const [filter, setFilter] = useState('Todas');
  const filtered = filter === 'Todas' ? TRIAGE_QUEUE : TRIAGE_QUEUE.filter(d => d.priority === filter);

  return (
    <div className="max-w-5xl mx-auto p-8">
      <button onClick={() => navigate('dashboard')} className="flex items-center gap-1 text-sm mb-4 hover:opacity-70" style={{ color: COLORS.textSecondary }}>
        <ChevronLeft size={14} /> Dashboard
      </button>
      <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.textPrimary }}>Fila de Triagem</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.textSecondary }}>{TRIAGE_QUEUE.length} demandas aguardando sua decisão</p>

      <div className="flex gap-1 mb-6">
        {['Todas', 'Crítica', 'Alta', 'Média', 'Baixa'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className="px-3 py-1.5 rounded-md text-xs font-medium" style={{
            backgroundColor: filter === f ? COLORS.bgElevated : 'transparent',
            border: `1px solid ${filter === f ? COLORS.borderStrong : COLORS.border}`,
            color: filter === f ? COLORS.textPrimary : COLORS.textSecondary,
          }}>{f}</button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map(d => {
          const isMain = d.isMain && demandState === 'Pronta para Triagem';
          const isAlreadyTriaged = d.isMain && demandState !== 'Pronta para Triagem';
          return (
            <div key={d.id} onClick={() => isMain ? navigate('triageDetail') : null} className={`border rounded-lg p-4 transition-all ${isMain ? 'cursor-pointer hover:shadow-sm' : 'opacity-60'}`} style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
              <div className="flex items-start gap-3">
                <span className="text-xs font-semibold px-2 py-0.5 rounded flex-shrink-0 mt-0.5" style={{ backgroundColor: `${d.priorityColor}15`, color: d.priorityColor }}>{d.priority}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>{d.title}</span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: COLORS.bgSubtle, color: COLORS.textSecondary }}>{d.id}</span>
                    {isAlreadyTriaged && <StatusPill status={demandState} />}
                  </div>
                  <div className="flex items-center gap-2 text-xs mb-2" style={{ color: COLORS.textMuted }}>
                    <span>De: {d.from}</span><span>·</span><span>{d.arrived}</span><span>·</span><span>SLA: {d.sla}</span>
                    {d.impact && (<><span>·</span><span style={{ color: COLORS.success, fontWeight: 600 }}>Impacto: {d.impact}</span></>)}
                  </div>
                  <div className="text-sm" style={{ color: COLORS.textSecondary }}>"{d.preview}"</div>
                </div>
                {isMain && <Button size="sm" icon={ArrowRight} onClick={(e) => { e?.stopPropagation?.(); navigate('triageDetail'); }}>Triar agora</Button>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// TRIAGE DETAIL
// ============================================================
function TriageDetailScreen() {
  const { navigate, capturePendencies, attachments, demandTitle, triageItems, updateTriageItem, triageScore, setDemandState, showToast, triageDraftSavedAt, setTriageDraftSavedAt, addNotification } = useApp();
  const [selected, setSelected] = useState(null);
  const [done, setDone] = useState(false);
  const [finalDecision, setFinalDecision] = useState(null);
  const canConclude = triageScore === 100;

  if (done) {
    return (
      <div className="max-w-2xl mx-auto pt-16 p-8">
        <div className="border rounded-lg p-12 text-center" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${COLORS.success}20` }}>
            <Check size={32} style={{ color: COLORS.success }} />
          </div>
          <div className="text-xl font-semibold mb-2" style={{ color: COLORS.textPrimary }}>Triagem concluída</div>
          <div className="text-base font-medium mb-1" style={{ color: COLORS.textPrimary }}>Decisão: <span style={{ color: COLORS.success }}>{finalDecision}</span></div>
          <div className="text-sm mb-6 max-w-md mx-auto" style={{ color: COLORS.textSecondary }}>
            {finalDecision === 'Product Ready' && 'A demanda passa para Racionalização. Carlos foi notificado.'}
            {finalDecision === 'Discovery' && 'Discovery aberto com time-box de 2 semanas.'}
            {finalDecision === 'Backlog' && 'Demanda movida para o Backlog.'}
            {finalDecision === 'Rejeitar' && 'Submitter foi notificado da decisão.'}
          </div>
          <div className="flex gap-2 justify-center">
            <Button variant="secondary" onClick={() => navigate('dashboard')}>Voltar ao Dashboard</Button>
            {finalDecision === 'Product Ready' && <Button icon={ArrowRight} onClick={() => navigate('rationalization')}>Ir para Racionalização</Button>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <button onClick={() => navigate('triageQueue')} className="flex items-center gap-1 text-sm mb-4 hover:opacity-70" style={{ color: COLORS.textSecondary }}>
        <ChevronLeft size={14} /> Fila
      </button>
      <div className="flex items-center gap-3 mb-2">
        <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: COLORS.bgSubtle, color: COLORS.textSecondary }}>DEM-2026-001</span>
        <StatusPill status="Em Triagem" />
        <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: '#FEF2F2', color: COLORS.danger }}>Crítica</span>
      </div>
      <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.textPrimary }}>{demandTitle}</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.textSecondary }}>De: Carlos Silva (COO)</p>

      <div className="grid grid-cols-2 gap-4 mb-20">
        <div className="border rounded-lg overflow-hidden" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.textMuted }}>Captura</div>
            <span className="text-xs" style={{ color: COLORS.textMuted }}>read-only</span>
          </div>
          <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
            {capturePendencies.map(p => (
              <div key={p.id}>
                <div className="text-xs font-semibold mb-1" style={{ color: COLORS.textMuted }}>{p.q}</div>
                <div className="text-sm" style={{ color: COLORS.textPrimary }}>{p.a || '—'}</div>
              </div>
            ))}
            <div className="pt-2 border-t" style={{ borderColor: COLORS.border }}>
              <div className="text-xs font-semibold mb-2" style={{ color: COLORS.textMuted }}>Anexos</div>
              {attachments.map(a => (
                <div key={a.id} className="flex items-center gap-2 text-sm" style={{ color: COLORS.textSecondary }}>
                  <FileText size={12} /> {a.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.textMuted }}>Sua decisão</div>
            <ScoreRing score={triageScore} size={32} strokeWidth={4} />
          </div>
          <div className="p-4 space-y-2">
            {triageItems.map(item => {
              const isDecided = item.decision !== null;
              const decisionLabel = isDecided ? (item.isPath ? item.decision : { yes: 'Sim', no: 'Não', partial: 'Parcial' }[item.decision]) : null;
              return (
                <div key={item.id} onClick={() => setSelected(item)} className="border rounded-md p-3 cursor-pointer hover:shadow-sm transition-all" style={{
                  backgroundColor: isDecided ? `${COLORS.success}08` : COLORS.bg,
                  borderColor: isDecided ? `${COLORS.success}40` : COLORS.border,
                }}>
                  <div className="flex items-start gap-2">
                    {isDecided ? <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" style={{ color: COLORS.success }} /> : <AlertCircle size={16} className="mt-0.5 flex-shrink-0" style={{ color: COLORS.danger }} />}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>{item.q}</div>
                      {isDecided && (
                        <div className="text-xs mt-1" style={{ color: COLORS.textSecondary }}>
                          <span className="font-medium" style={{ color: COLORS.success }}>{decisionLabel}</span>
                          {item.justification && ` · ${item.justification.slice(0, 60)}${item.justification.length > 60 ? '...' : ''}`}
                        </div>
                      )}
                    </div>
                    <ChevronRight size={14} style={{ color: COLORS.textMuted }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 left-72 right-4 max-w-6xl mx-auto border rounded-lg p-4 flex items-center justify-between shadow-md" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="text-xs" style={{ color: COLORS.textMuted }}>
          {canConclude ? 'Pronto pra concluir' : `Score: ${triageScore}% — avalie todos os itens`}
          {triageDraftSavedAt && <span className="ml-2">· Rascunho salvo {triageDraftSavedAt}</span>}
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => {
            const now = new Date();
            setTriageDraftSavedAt(`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`);
            showToast('Rascunho salvo');
          }}>Salvar rascunho</Button>
          <Button size="sm" disabled={!canConclude} onClick={() => {
            const pathItem = triageItems.find(t => t.isPath);
            const decision = pathItem?.decision || 'Product Ready';
            setFinalDecision(decision);
            if (decision === 'Product Ready') setDemandState('Em Racionalização');
            else if (decision === 'Backlog') setDemandState('Backlog');
            else if (decision === 'Rejeitar') setDemandState('Rejeitada');
            else if (decision === 'Discovery') setDemandState('Em Discovery');
            addNotification({ forPersona: 'submitter', type: 'triage-done', title: `Triagem: ${decision}`, body: `Marina Costa concluiu a triagem de "Gateway de Pagamento Recorrente"`, demandId: 'DEM-2026-001' });
            setDone(true);
            showToast(`Triagem concluída: ${decision}`);
          }}>Concluir Triagem</Button>
        </div>
      </div>

      {selected && <TriageItemModal item={selected} onClose={() => setSelected(null)} onSave={(decision, justification) => { updateTriageItem(selected.id, { decision, justification }); setSelected(null); showToast('Item avaliado'); }} />}
    </div>
  );
}

function TriageItemModal({ item, onClose, onSave }) {
  const [decision, setDecision] = useState(item.decision);
  const [justification, setJustification] = useState(item.justification || '');
  const isPath = item.isPath;
  const options = isPath
    ? [
        { value: 'Product Ready', label: 'Product Ready', desc: 'Vai direto para Racionalização. Contexto claro, sem incógnitas bloqueantes.' },
        { value: 'Discovery', label: 'Discovery', desc: 'Investigar antes de racionalizar. Time-box de 2 semanas.' },
        { value: 'Backlog', label: 'Backlog', desc: 'Boa demanda, mas não é prioridade agora.' },
        { value: 'Rejeitar', label: 'Rejeitar', desc: 'Não vai pra frente.' },
      ]
    : [
        { value: 'yes', label: 'Sim', color: COLORS.success },
        { value: 'no', label: 'Não', color: COLORS.danger },
        { value: 'partial', label: 'Parcialmente', color: COLORS.warning },
      ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-2xl rounded-xl shadow-2xl border max-h-[90vh] overflow-y-auto" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: COLORS.border }}>
          <div className="font-semibold text-base" style={{ color: COLORS.textPrimary }}>{item.q}</div>
          <button onClick={onClose} className="p-1 hover:bg-stone-100 rounded"><X size={18} style={{ color: COLORS.textMuted }} /></button>
        </div>
        <div className="p-6">
          {!isPath && (
            <div className="mb-5">
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>Sugestão da IA ({item.confidence}% de confiança)</div>
              <div className="border rounded-md p-3" style={{ backgroundColor: `${COLORS.info}10`, borderColor: `${COLORS.info}30` }}>
                <div className="text-sm" style={{ color: COLORS.textPrimary }}>{item.suggestion}</div>
              </div>
            </div>
          )}
          <div className="mb-5">
            <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>{isPath ? 'Escolha o caminho' : 'Sua avaliação'}</div>
            <div className={isPath ? 'space-y-2' : 'flex gap-2'}>
              {options.map(opt => (
                <button key={opt.value} onClick={() => setDecision(opt.value)} className={`${isPath ? 'w-full text-left p-3' : 'flex-1 p-2.5'} rounded-md border transition-all`} style={{
                  borderColor: decision === opt.value ? (opt.color || COLORS.info) : COLORS.border,
                  backgroundColor: decision === opt.value ? `${opt.color || COLORS.info}10` : COLORS.bg,
                }}>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: decision === opt.value ? (opt.color || COLORS.info) : COLORS.borderStrong }}>
                      {decision === opt.value && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: opt.color || COLORS.info }} />}
                    </div>
                    <div className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>{opt.label}</div>
                  </div>
                  {opt.desc && <div className="text-xs mt-1 ml-6" style={{ color: COLORS.textSecondary }}>{opt.desc}</div>}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-2">
            <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>Justificativa</div>
            <textarea value={justification} onChange={e => setJustification(e.target.value)} rows={3} className="w-full p-3 text-sm rounded-md border focus:outline-none resize-none" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg, color: COLORS.textPrimary }} />
          </div>
        </div>
        <div className="px-6 py-4 border-t flex justify-end gap-2" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button disabled={!decision} onClick={() => onSave(decision, justification)}>Confirmar</Button>
        </div>
      </div>
    </div>
  );
}

function RationalizationsListScreen() {
  const { navigate, racScore, demandState } = useApp();
  const demandInRac = demandState === 'Em Racionalização' || demandState === 'RP Congelado';
  return (
    <div className="max-w-5xl mx-auto p-8">
      <button onClick={() => navigate('dashboard')} className="flex items-center gap-1 text-sm mb-4 hover:opacity-70" style={{ color: COLORS.textSecondary }}>
        <ChevronLeft size={14} /> Dashboard
      </button>
      <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.textPrimary }}>Racionalizações Ativas</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.textSecondary }}>{ACTIVE_RATIONALIZATIONS.length + (demandInRac ? 1 : 0)} demandas em racionalização</p>
      <div className="space-y-2">
        {demandInRac && (
          <div onClick={() => navigate('rationalization')} className="border rounded-lg p-4 cursor-pointer hover:shadow-sm transition-all" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText size={14} style={{ color: COLORS.textMuted }} />
                <span className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>Gateway de Pagamento Recorrente</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: COLORS.bgSubtle, color: COLORS.textSecondary }}>DEM-2026-001</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium" style={{ color: COLORS.textSecondary }}>Score: {racScore}%</span>
                <ChevronRight size={16} style={{ color: COLORS.textMuted }} />
              </div>
            </div>
          </div>
        )}
        {ACTIVE_RATIONALIZATIONS.map(d => (
          <div key={d.id} className="border rounded-lg p-4" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText size={14} style={{ color: COLORS.textMuted }} />
                <span className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>{d.title}</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: COLORS.bgSubtle, color: COLORS.textSecondary }}>{d.id}</span>
              </div>
              <span className="text-xs font-medium" style={{ color: COLORS.textSecondary }}>Score: {d.score}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// RATIONALIZATION SCREEN (3-column)
// ============================================================
function RationalizationScreen() {
  const { navigate, racPendencies, racScore, racStats, demandTitle, capturePendencies, attachments, showToast, setDemandState, setRacPendencies, discoveryResults, racDraftSavedAt, setRacDraftSavedAt, addNotification, setRpVersion } = useApp();
  const [selected, setSelected] = useState(null);
  const [contextOpen, setContextOpen] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customQ, setCustomQ] = useState('');
  const [customSection, setCustomSection] = useState('Contexto');
  const [showEscalate, setShowEscalate] = useState(false);

  const empty = racPendencies.filter(p => p.status === 'empty');
  const lowConf = racPendencies.filter(p => p.status === 'low_confidence');
  const resolved = racPendencies.filter(p => ['resolved', 'manually_accepted'].includes(p.status));
  const naItems = racPendencies.filter(p => p.status === 'not_applicable');

  if (completed) {
    return (
      <div className="max-w-2xl mx-auto pt-16 p-8">
        <div className="border rounded-lg p-12 text-center" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${COLORS.success}20` }}>
            <Check size={32} style={{ color: COLORS.success }} />
          </div>
          <div className="text-xl font-semibold mb-2" style={{ color: COLORS.textPrimary }}>Racionalização concluída</div>
          <div className="text-sm mb-6 max-w-md mx-auto" style={{ color: COLORS.textSecondary }}>
            Próximo passo: congelar o RP v1.0 para que o CTO possa avaliar tecnicamente.
          </div>
          <div className="flex gap-2 justify-center">
            <Button variant="secondary" onClick={() => navigate('dashboard')}>Voltar ao Dashboard</Button>
            <Button icon={ArrowRight} onClick={() => navigate('rpFreeze')}>Ir para Congelamento do RP</Button>
          </div>
        </div>
      </div>
    );
  }

  const addCustomPendency = () => {
    if (!customQ.trim()) return;
    setRacPendencies(prev => [...prev, { id: `rac-custom-${Date.now()}`, q: customQ.trim(), section: customSection, a: '', confidence: 0, status: 'empty', custom: true }]);
    setCustomQ('');
    setShowAddCustom(false);
    showToast('Pendência customizada adicionada');
  };

  return (
    <div className="max-w-[1400px] mx-auto p-8">
      <button onClick={() => navigate('dashboard')} className="flex items-center gap-1 text-sm mb-4 hover:opacity-70" style={{ color: COLORS.textSecondary }}>
        <ChevronLeft size={14} /> Dashboard
      </button>

      <div className="flex items-center gap-3 mb-2">
        <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: COLORS.bgSubtle, color: COLORS.textSecondary }}>DEM-2026-001</span>
        <StatusPill status="Em Racionalização" />
        <button onClick={() => navigate('timeline')} className="ml-auto text-xs flex items-center gap-1 px-2 py-1 rounded hover:bg-stone-100" style={{ color: COLORS.textSecondary }}>
          <Clock size={12} /> Histórico
        </button>
      </div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: COLORS.textPrimary }}>{demandTitle}</h1>

      <div className="border rounded-lg p-5 mb-6 flex items-center gap-6" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <ScoreRing score={racScore} size={80} strokeWidth={7} />
        <div className="flex-1">
          <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>Racionalização</div>
          <div className="text-base font-semibold mb-1" style={{ color: COLORS.textPrimary }}>
            {racScore === 100 ? 'Tudo pronto para congelar o RP' : `${racStats.empty + racStats.lowConf} pendência${racStats.empty + racStats.lowConf > 1 ? 's' : ''} restante${racStats.empty + racStats.lowConf > 1 ? 's' : ''}`}
          </div>
          <div className="text-sm" style={{ color: COLORS.textSecondary }}>
            {racStats.resolved} de {racStats.total} resolvidas · {Object.keys(discoveryResults).length} discovery{Object.keys(discoveryResults).length !== 1 ? 's' : ''} feito{Object.keys(discoveryResults).length !== 1 ? 's' : ''}
          </div>
        </div>
        {racScore === 100 && (
          <Button icon={Lock} onClick={() => navigate('rpFreeze')}>Ir para Congelamento</Button>
        )}
      </div>

      <div className="grid grid-cols-12 gap-4 mb-24">
        <div className="col-span-3">
          <button onClick={() => setContextOpen(!contextOpen)} className="w-full border rounded-lg p-3 mb-2 flex items-center justify-between hover:shadow-sm transition-all" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.textMuted }}>Contexto</div>
            {contextOpen ? <ChevronDown size={14} style={{ color: COLORS.textMuted }} /> : <ChevronRight size={14} style={{ color: COLORS.textMuted }} />}
          </button>
          {contextOpen && (
            <div className="border rounded-lg p-4 space-y-4 max-h-[600px] overflow-y-auto" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
              <div>
                <div className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: COLORS.textMuted }}>Captura</div>
                {capturePendencies.slice(0, 5).map(p => (
                  <div key={p.id} className="mb-3">
                    <div className="text-xs font-semibold mb-0.5" style={{ color: COLORS.textSecondary }}>{p.q}</div>
                    <div className="text-xs" style={{ color: COLORS.textPrimary }}>{p.a || '—'}</div>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t" style={{ borderColor: COLORS.border }}>
                <div className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: COLORS.textMuted }}>Triagem</div>
                <div className="text-xs flex items-center gap-1.5" style={{ color: COLORS.textPrimary }}>
                  <Check size={12} style={{ color: COLORS.success }} /> Product Ready
                </div>
              </div>
              <div className="pt-2 border-t" style={{ borderColor: COLORS.border }}>
                <div className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: COLORS.textMuted }}>Anexos</div>
                {attachments.map(a => (
                  <div key={a.id} className="text-xs flex items-center gap-1.5" style={{ color: COLORS.textSecondary }}>
                    <FileText size={11} /> {a.name}
                  </div>
                ))}
                {Object.keys(discoveryResults).length > 0 && (
                  <>
                    <div className="text-xs font-semibold mt-3 mb-2 uppercase tracking-wider" style={{ color: COLORS.textMuted }}>Discoveries</div>
                    {Object.entries(discoveryResults).map(([pid, r]) => (
                      <div key={pid} className="text-xs mb-1.5 p-1.5 rounded" style={{ backgroundColor: COLORS.bgSubtle }}>
                        <div className="flex items-center gap-1.5" style={{ color: COLORS.textPrimary }}>
                          <Search size={10} style={{ color: COLORS.info }} />
                          <span className="font-medium">{r.type}</span>
                        </div>
                        <div className="ml-4 mt-0.5" style={{ color: COLORS.textSecondary }}>{r.summary}</div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="col-span-6">
          {empty.length > 0 && (
            <section className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.danger }} />
                <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.danger }}>Vazias · {empty.length}</h2>
              </div>
              <div className="space-y-2">{empty.map(p => <PendencyCard key={p.id} pendency={p} onClick={() => setSelected(p)} />)}</div>
            </section>
          )}
          {lowConf.length > 0 && (
            <section className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.warning }} />
                <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.warning }}>Baixa confiança · {lowConf.length}</h2>
              </div>
              <div className="space-y-2">{lowConf.map(p => <PendencyCard key={p.id} pendency={p} onClick={() => setSelected(p)} />)}</div>
            </section>
          )}
          {resolved.length > 0 && (
            <section className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.success }} />
                <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.success }}>Resolvidas · {resolved.length}</h2>
              </div>
              <div className="space-y-2">{resolved.map(p => <PendencyCard key={p.id} pendency={p} onClick={() => setSelected(p)} />)}</div>
            </section>
          )}
          {naItems.length > 0 && (
            <section className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.textMuted }} />
                <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.textMuted }}>Não aplicáveis · {naItems.length}</h2>
              </div>
              <div className="space-y-2">{naItems.map(p => <PendencyCard key={p.id} pendency={p} onClick={() => setSelected(p)} />)}</div>
            </section>
          )}

          {showAddCustom ? (
            <div className="border rounded-lg p-4" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: COLORS.textMuted }}>Nova pendência customizada</div>
              <input value={customQ} onChange={e => setCustomQ(e.target.value)} className="w-full p-2.5 text-sm rounded-md border focus:outline-none mb-3" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }} placeholder="Ex: Como tratamos casos de retry após falha no cartão?" />
              <div className="flex gap-2 mb-3 flex-wrap">
                {['Contexto', 'Escopo', 'Regras', 'Validação', 'Riscos', 'Stakeholders', 'Dependências'].map(s => (
                  <button key={s} onClick={() => setCustomSection(s)} className="px-2.5 py-1 rounded-md text-xs font-medium" style={{
                    backgroundColor: customSection === s ? COLORS.ai : 'transparent',
                    color: customSection === s ? 'white' : COLORS.textSecondary,
                    border: `1px solid ${customSection === s ? COLORS.ai : COLORS.border}`,
                  }}>{s}</button>
                ))}
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="secondary" size="sm" onClick={() => { setShowAddCustom(false); setCustomQ(''); }}>Cancelar</Button>
                <Button size="sm" disabled={!customQ.trim()} onClick={addCustomPendency}>Adicionar</Button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowAddCustom(true)} className="w-full border-2 border-dashed rounded-lg p-4 flex items-center justify-center gap-2 text-sm font-medium hover:bg-stone-50" style={{ borderColor: COLORS.border, color: COLORS.textSecondary }}>
              <Plus size={14} /> Adicionar pendência customizada
            </button>
          )}
        </div>

        <div className="col-span-3">
          <InlineChat context="Racionalização — DEM-2026-001" />
        </div>
      </div>

      <div className="fixed bottom-4 left-72 right-4 max-w-[1400px] mx-auto border rounded-lg p-4 flex items-center justify-between shadow-md" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="text-xs" style={{ color: COLORS.textMuted }}>
          {racScore === 100 ? 'Pronto para congelar o RP' : `Faltam ${100 - racScore}% para liberar o congelamento`}
          {racDraftSavedAt && <span className="ml-2">· Rascunho salvo {racDraftSavedAt}</span>}
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => { const now = new Date(); setRacDraftSavedAt(`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`); showToast('Rascunho salvo'); }}>Salvar rascunho</Button>
          <Button variant="secondary" size="sm" onClick={() => setShowEscalate(true)}>Escalar para CTO antes do tempo</Button>
          <Button size="sm" icon={Lock} disabled={racScore !== 100} onClick={() => navigate('rpFreeze')}>Congelar RP</Button>
        </div>
      </div>

      {selected && <RacPendencyModal pendency={selected} onClose={() => setSelected(null)} />}
      {showEscalate && (
        <EscalateEarlyModal score={racScore} onClose={() => setShowEscalate(false)} onConfirm={() => { setShowEscalate(false); setCompleted(true); setDemandState('Em Avaliação Técnica'); setRpVersion('1.0-parcial'); showToast('Escalada antecipada enviada ao CTO'); }} />
      )}
    </div>
  );
}

// ============================================================
// INLINE CHAT
// ============================================================
function InlineChat({ context }) {
  const { persona, racPendencies } = useApp();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (messages.length === 0) {
      const emptyCount = racPendencies.filter(p => p.status === 'empty').length;
      setMessages([{
        from: 'bot',
        text: `Olá ${persona?.name?.split(' ')[0]}. Você tem ${emptyCount} ${emptyCount === 1 ? 'pendência vazia' : 'pendências vazias'}. Posso ajudar a destravar alguma específica?`,
        suggestions: ['Ajude com Objetivos', 'Ajude com Critérios de sucesso', 'Mostre demandas similares'],
      }]);
    }
  }, []);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);

  const send = (text) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { from: 'user', text }]);
    setInput('');
    setTimeout(() => {
      let resp;
      const l = text.toLowerCase();
      if (l.includes('objetivo')) resp = { from: 'bot', text: 'Para objetivos SMART, trabalho com 3 dimensões: redução de custo, aumento de receita, melhoria de experiência. Qual a meta de % de migração nos primeiros 6 meses?', suggestions: ['20%', '40%', '60%'] };
      else if (l.includes('critério') || l.includes('sucesso')) resp = { from: 'bot', text: 'Critérios de sucesso devem ser quantitativos:\n• % de migração\n• Redução de horas em reconciliação\n• Redução de inadimplência\n• NPS dos clientes migrados' };
      else if (l.includes('similar')) resp = { from: 'bot', text: '2 demandas similares:\n• DEM-2025-067 — Cobrança PIX (concluída)\n• DEM-2025-089 — Migração billing (em execução)' };
      else if (['20%', '40%', '60%'].includes(text)) resp = { from: 'bot', text: `Boa. Com meta de ${text} de migração em 6 meses:\n1. Migrar ${text} da base ativa em boleto para cartão\n2. Reduzir 30h/mês em reconciliação\n3. Diminuir inadimplência de 18% para ≤10%` };
      else resp = { from: 'bot', text: 'Posso te ajudar de 3 formas: 1) Estruturar uma resposta, 2) Buscar referências externas, 3) Buscar demandas similares na base.' };
      setMessages(prev => [...prev, resp]);
    }, 700);
  };

  return (
    <div className="border rounded-lg flex flex-col h-[600px]" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
      <div className="px-3 py-2.5 border-b flex items-center gap-2" style={{ borderColor: COLORS.border }}>
        <Sparkles size={14} style={{ color: persona?.color }} />
        <div>
          <div className="text-xs font-semibold" style={{ color: COLORS.textPrimary }}>Chat</div>
          <div className="text-xs" style={{ color: COLORS.textMuted }}>{context}</div>
        </div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg, i) => (
          <div key={i}>
            {msg.from === 'bot' && <div className="text-xs font-semibold mb-1" style={{ color: COLORS.textMuted }}>Plataforma</div>}
            {msg.from === 'user' && <div className="text-xs font-semibold mb-1 text-right" style={{ color: persona?.color }}>Você</div>}
            <div className={`text-xs whitespace-pre-wrap rounded-lg px-2.5 py-2 ${msg.from === 'user' ? 'ml-4' : 'mr-4'}`} style={{
              backgroundColor: msg.from === 'user' ? `${persona?.color}15` : COLORS.bgSubtle,
              color: COLORS.textPrimary,
            }}>{msg.text}</div>
            {msg.suggestions && (
              <div className="flex flex-wrap gap-1 mt-2 mr-4">
                {msg.suggestions.map((s, j) => (
                  <button key={j} onClick={() => send(s)} className="text-xs px-2 py-0.5 rounded-full border hover:bg-stone-50" style={{ borderColor: COLORS.border, color: COLORS.textSecondary }}>{s}</button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="p-2 border-t" style={{ borderColor: COLORS.border }}>
        <div className="flex gap-1">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send(input)} placeholder="Pergunte ou peça ajuda..." className="flex-1 px-2 py-1.5 text-xs rounded-md border focus:outline-none" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }} />
          <button onClick={() => send(input)} className="p-1.5 rounded-md" style={{ backgroundColor: persona?.color, color: 'white' }}><Send size={12} /></button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL: Escalate Early
// ============================================================
function EscalateEarlyModal({ score, onClose, onConfirm }) {
  const [reason, setReason] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-md rounded-xl shadow-2xl border p-6" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="font-semibold text-lg mb-1" style={{ color: COLORS.textPrimary }}>Escalar ao CTO antes do tempo?</div>
        <div className="text-sm mb-4" style={{ color: COLORS.textSecondary }}>
          Score atual: <strong>{score}%</strong>. Use quando precisar de validação técnica para destravar pendências do produto.
        </div>
        <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>Motivo da escalada (obrigatório)</div>
        <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3} className="w-full p-3 text-sm rounded-md border focus:outline-none resize-none mb-4" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }} placeholder="Ex: Preciso da decisão técnica sobre payment provider antes de fechar Escopo IN." />
        <div className="text-xs mb-5 p-3 rounded-md" style={{ backgroundColor: `${COLORS.warning}10`, color: COLORS.textSecondary }}>
          ⚠️ A escalada antecipada notifica o CTO. Ele pode ajudar, devolver para mais discovery, ou aceitar tocar em paralelo.
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button disabled={!reason.trim()} onClick={() => onConfirm(reason)}>Confirmar escalada</Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL: RAC PENDENCY (Discovery: external/collect/kb)
// ============================================================
function RacPendencyModal({ pendency, onClose }) {
  const { updateRacPendency, showToast, discoveryResults, setDiscoveryResults, setPendingCollects, addNotification } = useApp();
  const [text, setText] = useState(pendency.a || '');
  const [discoveryStage, setDiscoveryStage] = useState('idle');
  const [discoveryType, setDiscoveryType] = useState(null);
  const [discoveryQuery, setDiscoveryQuery] = useState('Stripe, Pagar.me e Mercado Pago para recorrência. Comparar taxa, integração, LGPD, chargeback e qualidade de docs.');
  const [analyzing, setAnalyzing] = useState(false);
  const [showNA, setShowNA] = useState(false);
  const [naReason, setNaReason] = useState('');

  const existingResult = discoveryResults[pendency.id];
  const isLowConf = pendency.status === 'low_confidence';

  const handleSave = () => {
    if (!text.trim()) return;
    setAnalyzing(true);
    setTimeout(() => {
      const newConfidence = isLowConf ? (text !== pendency.a ? Math.min(98, pendency.confidence + 25) : pendency.confidence) : 92;
      updateRacPendency(pendency.id, { a: text.trim(), confidence: newConfidence, status: newConfidence >= 90 ? 'resolved' : 'low_confidence' });
      showToast('Resposta salva');
      onClose();
    }, 1000);
  };

  const acceptAsIs = () => { updateRacPendency(pendency.id, { status: 'manually_accepted' }); showToast('Resposta aceita manualmente'); onClose(); };
  const markNotApplicable = () => { updateRacPendency(pendency.id, { a: '', confidence: 0, status: 'not_applicable', naReason }); showToast('Pendência marcada como N/A'); onClose(); };

  const runDiscovery = () => {
    setDiscoveryStage('querying');
    setTimeout(() => {
      setDiscoveryStage('results');
      setDiscoveryResults({ ...discoveryResults, [pendency.id]: { type: 'Pesquisa externa', summary: 'Stripe / Pagar.me / Mercado Pago — comparativo', date: new Date().toISOString() } });
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-3xl rounded-xl shadow-2xl border max-h-[90vh] overflow-y-auto" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: COLORS.border }}>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>{pendency.section}</div>
            <div className="font-semibold text-base" style={{ color: COLORS.textPrimary }}>{pendency.q}</div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-stone-100 rounded"><X size={18} style={{ color: COLORS.textMuted }} /></button>
        </div>

        <div className="p-6">
          {isLowConf && (
            <div className="mb-5">
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>Resposta atual ({pendency.confidence}% de confiança)</div>
              <div className="border rounded-md p-3 mb-2" style={{ backgroundColor: `${COLORS.warning}10`, borderColor: `${COLORS.warning}40` }}>
                <div className="text-sm" style={{ color: COLORS.textPrimary }}>{pendency.a}</div>
              </div>
              {pendency.hint && (
                <div className="flex gap-2 p-3 rounded-md border" style={{ backgroundColor: `${COLORS.info}10`, borderColor: `${COLORS.info}30` }}>
                  <Sparkles size={14} className="flex-shrink-0 mt-0.5" style={{ color: COLORS.info }} />
                  <div className="text-xs" style={{ color: COLORS.textPrimary }}><span className="font-semibold">Dica:</span> {pendency.hint}</div>
                </div>
              )}
            </div>
          )}

          {discoveryStage === 'idle' && !existingResult && (
            <div className="border rounded-md p-4 mb-5" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
              <div className="flex items-start gap-3">
                <Search size={16} className="mt-0.5" style={{ color: COLORS.info }} />
                <div className="flex-1">
                  <div className="text-sm font-semibold mb-1" style={{ color: COLORS.textPrimary }}>Está com dúvida? Inicie um Discovery.</div>
                  <div className="text-xs mb-3" style={{ color: COLORS.textSecondary }}>A plataforma busca, traz comparativos, e você valida.</div>
                  <Button variant="secondary" size="sm" icon={Search} onClick={() => setDiscoveryStage('choosing')}>Iniciar Discovery</Button>
                </div>
              </div>
            </div>
          )}

          {discoveryStage === 'idle' && existingResult && (
            <div className="border rounded-md p-4 mb-5" style={{ borderColor: `${COLORS.success}40`, backgroundColor: `${COLORS.success}08` }}>
              <div className="flex items-start gap-3">
                <Check size={16} className="mt-0.5" style={{ color: COLORS.success }} />
                <div className="flex-1">
                  <div className="text-sm font-semibold mb-1" style={{ color: COLORS.textPrimary }}>Discovery realizado: {existingResult.type}</div>
                  <div className="text-xs mb-3" style={{ color: COLORS.textSecondary }}>{existingResult.summary}</div>
                  <Button variant="ghost" size="sm" icon={Search} onClick={() => setDiscoveryStage('choosing')}>Refazer ou adicionar outro</Button>
                </div>
              </div>
            </div>
          )}

          {discoveryStage === 'choosing' && (
            <div className="mb-5">
              <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: COLORS.textMuted }}>Que tipo de Discovery?</div>
              <div className="space-y-2">
                {[
                  { id: 'external', icon: '🌐', title: 'Pesquisa em fontes externas', desc: 'A plataforma busca, traz comparativos, você valida.' },
                  { id: 'collect', icon: '💬', title: 'Coleta com originador / cliente', desc: 'Dispara perguntas estruturadas pro Submitter ou stakeholder.' },
                  { id: 'kb', icon: '📚', title: 'Base de conhecimento interna', desc: 'Decisões anteriores, projetos similares, ADRs registrados.' },
                ].map(opt => (
                  <button key={opt.id} onClick={() => {
                    setDiscoveryType(opt.id);
                    if (opt.id === 'external') setDiscoveryStage('querying-form');
                    else {
                      setDiscoveryStage('querying');
                      setTimeout(() => {
                        setDiscoveryStage('results-other');
                        setDiscoveryResults({ ...discoveryResults, [pendency.id]: { type: opt.id === 'collect' ? 'Coleta com originador' : 'Base de conhecimento', summary: opt.id === 'collect' ? '3 perguntas estruturadas enviadas' : '2 demandas similares encontradas', date: new Date().toISOString() } });
                      }, 2000);
                    }
                  }} className="w-full text-left p-3 rounded-md border hover:shadow-sm transition-all" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}>
                    <div className="flex items-start gap-3">
                      <span className="text-xl">{opt.icon}</span>
                      <div>
                        <div className="text-sm font-semibold" style={{ color: COLORS.textPrimary }}>{opt.title}</div>
                        <div className="text-xs mt-0.5" style={{ color: COLORS.textSecondary }}>{opt.desc}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <button onClick={() => setDiscoveryStage('idle')} className="mt-3 text-xs underline" style={{ color: COLORS.textMuted }}>Cancelar Discovery</button>
            </div>
          )}

          {discoveryStage === 'querying-form' && (
            <div className="mb-5 border rounded-md p-4" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>O que você quer pesquisar?</div>
              <textarea value={discoveryQuery} onChange={e => setDiscoveryQuery(e.target.value)} rows={3} className="w-full p-3 text-sm rounded-md border focus:outline-none resize-none mb-3" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgElevated, color: COLORS.textPrimary }} />
              <div className="flex gap-2 justify-end">
                <Button variant="secondary" size="sm" onClick={() => setDiscoveryStage('choosing')}>Voltar</Button>
                <Button size="sm" icon={Search} onClick={runDiscovery}>Pesquisar</Button>
              </div>
            </div>
          )}

          {discoveryStage === 'querying' && (
            <div className="mb-5 border rounded-md p-6 text-center" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
              <Loader2 size={28} className="animate-spin mx-auto mb-3" style={{ color: COLORS.info }} />
              <div className="text-sm font-semibold mb-1" style={{ color: COLORS.textPrimary }}>
                {discoveryType === 'external' && 'Pesquisando fontes externas...'}
                {discoveryType === 'collect' && 'Preparando coleta com stakeholders...'}
                {discoveryType === 'kb' && 'Buscando na base de conhecimento...'}
              </div>
              <div className="text-xs" style={{ color: COLORS.textMuted }}>Aguarde uns segundos</div>
            </div>
          )}

          {discoveryStage === 'results' && (
            <div className="mb-5 border rounded-md p-4" style={{ borderColor: COLORS.border, backgroundColor: `${COLORS.success}05` }}>
              <div className="flex items-center gap-2 mb-3">
                <Check size={14} style={{ color: COLORS.success }} />
                <div className="text-sm font-semibold" style={{ color: COLORS.textPrimary }}>Discovery concluído — 5 fontes encontradas</div>
              </div>
              <div className="overflow-x-auto mb-3">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr style={{ backgroundColor: COLORS.bgSubtle }}>
                      <th className="text-left p-2 border" style={{ borderColor: COLORS.border, color: COLORS.textPrimary }}>Critério</th>
                      <th className="text-left p-2 border" style={{ borderColor: COLORS.border, color: COLORS.textPrimary }}>Stripe</th>
                      <th className="text-left p-2 border" style={{ borderColor: COLORS.border, color: COLORS.textPrimary }}>Pagar.me</th>
                      <th className="text-left p-2 border" style={{ borderColor: COLORS.border, color: COLORS.textPrimary }}>Mercado Pago</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Taxa cartão recorrente', '3,99% +R$0,39', '3,79% +R$0,50', '4,99%'],
                      ['Docs e SDKs', 'Excelente (EN/PT)', 'Boa (PT)', 'Razoável (PT)'],
                      ['LGPD', 'Sim + DPA', 'Sim BR', 'Sim BR'],
                      ['Chargeback', 'Avançado', 'Padrão', 'Padrão'],
                      ['Webhooks', 'Robustos', 'Bons', 'Limitados'],
                      ['Integração', '2-3 semanas', '2-4 semanas', '3-5 semanas'],
                    ].map((row, i) => (
                      <tr key={i}>
                        {row.map((cell, j) => (
                          <td key={j} className="p-2 border" style={{ borderColor: COLORS.border, color: j === 0 ? COLORS.textPrimary : COLORS.textSecondary, fontWeight: j === 0 ? 600 : 400 }}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-xs font-semibold mb-1" style={{ color: COLORS.textMuted }}>Fontes:</div>
              <div className="text-xs space-y-0.5 mb-3" style={{ color: COLORS.textSecondary }}>
                <div>• Stripe Documentation</div>
                <div>• Pagar.me Developer Center</div>
                <div>• Mercado Pago Devs</div>
                <div>• TechCrunch BR — Comparativo independente</div>
                <div>• Adyen Benchmark 2025</div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button variant="secondary" size="sm" icon={Paperclip} onClick={() => showToast('Discovery anexado à pendência')}>Anexar à pendência</Button>
                <Button size="sm" onClick={() => {
                  setText(`Escopo IN: Integração via Stripe (taxa 3,99% + R$0,39, melhor doc, chargeback avançado, LGPD com DPA, integração em 2-3 semanas). Implementar fluxo opt-in para clientes em boleto, webhook robusto, retry automático em falhas.`);
                  setDiscoveryStage('idle');
                }}>Usar como base</Button>
              </div>
            </div>
          )}

          {discoveryStage === 'results-other' && (
            <div className="mb-5 border rounded-md p-4" style={{ borderColor: COLORS.border, backgroundColor: `${COLORS.success}05` }}>
              <div className="flex items-center gap-2 mb-3">
                <Check size={14} style={{ color: COLORS.success }} />
                <div className="text-sm font-semibold" style={{ color: COLORS.textPrimary }}>
                  {discoveryType === 'collect' && 'Coleta preparada'}
                  {discoveryType === 'kb' && 'Encontrado na base de conhecimento'}
                </div>
              </div>
              {discoveryType === 'collect' && (
                <div>
                  <div className="text-sm mb-3" style={{ color: COLORS.textPrimary }}>Vou enviar 3 perguntas estruturadas a Carlos (COO):</div>
                  <ul className="text-sm space-y-1.5 mb-3 ml-4" style={{ color: COLORS.textSecondary }}>
                    <li>1. Qual a meta de % de migração nos primeiros 6 meses?</li>
                    <li>2. Há incentivo para clientes que migrarem?</li>
                    <li>3. Quem assina a decisão de cancelar contratos de clientes que não migrarem?</li>
                  </ul>
                  <Button size="sm" onClick={() => {
                    const collectId = `col-${Date.now()}`;
                    setPendingCollects(prev => [...prev, {
                      id: collectId, demandId: 'DEM-2026-001', demandTitle: 'Gateway de Pagamento Recorrente', pendencyContext: pendency.q, askedBy: 'Marina Costa (PO)',
                      questions: ['Qual a meta de % de migração nos primeiros 6 meses?', 'Há incentivo para clientes que migrarem?', 'Quem assina a decisão de cancelar contratos?'],
                      status: 'pending', timestamp: new Date(),
                    }]);
                    addNotification({ forPersona: 'submitter', type: 'collect-request', title: 'Marina precisa de mais informações', body: '3 perguntas sobre "Gateway de Pagamento Recorrente"', demandId: 'DEM-2026-001', actionScreen: 'collectInbox' });
                    showToast('Coleta enviada ao Submitter');
                    setDiscoveryStage('idle');
                  }}>Enviar coleta</Button>
                </div>
              )}
              {discoveryType === 'kb' && (
                <div>
                  <div className="text-sm mb-3" style={{ color: COLORS.textPrimary }}>2 demandas similares encontradas:</div>
                  <div className="space-y-2 mb-3">
                    <div className="p-2 border rounded text-xs" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}>
                      <div className="font-semibold" style={{ color: COLORS.textPrimary }}>DEM-2025-067 — Cobrança PIX (concluída)</div>
                      <div style={{ color: COLORS.textSecondary }}>Critérios de aceite registrados, 3 ADRs documentadas</div>
                    </div>
                    <div className="p-2 border rounded text-xs" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}>
                      <div className="font-semibold" style={{ color: COLORS.textPrimary }}>DEM-2025-089 — Migração billing (em execução)</div>
                      <div style={{ color: COLORS.textSecondary }}>Mesma abstração de Payment Provider proposta</div>
                    </div>
                  </div>
                  <Button size="sm" variant="secondary" onClick={() => setDiscoveryStage('idle')}>Fechar</Button>
                </div>
              )}
            </div>
          )}

          <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>Sua resposta</div>
          <textarea value={text} onChange={e => setText(e.target.value)} rows={6} placeholder="Pode escrever livremente. A plataforma vai estruturar pra você." className="w-full p-3 text-sm rounded-md border focus:outline-none resize-none" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg, color: COLORS.textPrimary }} />

          {analyzing && (
            <div className="mt-4 flex items-center gap-2 p-3 rounded-md" style={{ backgroundColor: `${COLORS.info}10` }}>
              <Loader2 size={14} className="animate-spin" style={{ color: COLORS.info }} />
              <span className="text-sm" style={{ color: COLORS.info }}>Re-analisando confiança...</span>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t flex justify-between items-center gap-2" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
          <button onClick={() => setShowNA(!showNA)} className="text-xs underline hover:opacity-70" style={{ color: COLORS.textMuted }}>{showNA ? 'Cancelar N/A' : 'Não se aplica'}</button>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose} disabled={analyzing}>Cancelar</Button>
            {isLowConf && <Button variant="secondary" onClick={acceptAsIs} disabled={analyzing}>Confirmar como está</Button>}
            <Button onClick={handleSave} disabled={!text.trim() || analyzing}>Salvar resposta</Button>
          </div>
        </div>

        {showNA && (
          <div className="px-6 py-4 border-t" style={{ borderColor: COLORS.border, backgroundColor: '#FAFAF9' }}>
            <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>Justificativa de N/A (obrigatória)</div>
            <textarea value={naReason} onChange={e => setNaReason(e.target.value)} rows={2} className="w-full p-2.5 text-sm rounded-md border focus:outline-none resize-none mb-2" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgElevated, color: COLORS.textPrimary }} placeholder="Ex: Esta demanda não tem dependências externas." />
            <div className="flex justify-end"><Button size="sm" disabled={!naReason.trim()} onClick={markNotApplicable}>Marcar como N/A</Button></div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// SCREEN: RP FREEZE — congelar v1.0 (com AIImpactBanner)
// ============================================================
function RPFreezeScreen() {
  const { navigate, capturePendencies, demandTitle, showToast, setDemandState, setRpVersion, adrs: realAdrs, addNotification } = useApp();
  const [activeSection, setActiveSection] = useState('contexto');
  const [showFreezeModal, setShowFreezeModal] = useState(false);
  const [frozen, setFrozen] = useState(false);

  const adrsToUse = realAdrs && realAdrs.length > 0 ? realAdrs : [
    { id: 'ADR-100', title: 'Payment Provider abstrato', summary: 'Interface unificada para trocar de provider sem reescrita.' },
    { id: 'ADR-101', title: 'Webhook idempotente', summary: 'Entrega de eventos com retry exponencial e dedup.' },
    { id: 'ADR-102', title: 'Vault tokenizado', summary: 'PCI-DSS compliance via tokenização no provider.' },
    { id: 'ADR-103', title: 'Migração opt-in', summary: 'Feature flag por cliente + consentimento explícito.' },
  ];

  const ctoOutput = {
    adrs: adrsToUse.map(a => ({ id: a.id, title: a.title, summary: a.summary || a.decision?.slice(0, 120) || '' })),
    systemsAffected: ['Billing Service', 'Customer API', 'Notification Service', 'Audit Log'],
    risks: [
      'Chargeback inesperado em primeiros 30 dias',
      'Latência de webhook do provider em pico',
      'Falha de conciliação com ERP em estornos',
      'Resistência enterprise ao opt-in',
      'Auditoria PCI-DSS pendente para Q3',
    ],
    estimateDays: 34,
    rollout: 'Canário 5% → 25% → 50% → 100% em 3 semanas, com kill-switch por feature flag.',
  };

  const sections = [
    { id: 'sumario', label: 'Sumário', confidence: 100, provKey: 'live-sumario' },
    { id: 'contexto', label: 'Contexto', confidence: 96, provKey: 'live-contexto' },
    { id: 'objetivos', label: 'Objetivos', confidence: 92, provKey: 'live-objetivos' },
    { id: 'escopo', label: 'Escopo (IN/OUT)', confidence: 95, provKey: 'live-escopo' },
    { id: 'personas', label: 'Personas', confidence: 90, provKey: 'live-personas' },
    { id: 'regras', label: 'Regras', confidence: 94, provKey: 'live-regras' },
    { id: 'aceite', label: 'Aceite', confidence: 96, provKey: 'live-aceite' },
    { id: 'sucesso', label: 'Sucesso', confidence: 93, provKey: 'live-sucesso' },
    { id: 'riscos-p', label: 'Riscos produto', confidence: 88, provKey: 'live-riscos-p' },
    { id: 'adrs', label: 'ADRs', confidence: 100, provKey: 'live-adrs' },
    { id: 'sistemas', label: 'Sistemas', confidence: 100, provKey: 'live-sistemas' },
    { id: 'seguranca', label: 'Segurança', confidence: 95, provKey: 'live-seguranca' },
    { id: 'riscos-t', label: 'Riscos técnicos', confidence: 90, provKey: 'live-riscos-t' },
    { id: 'rollout', label: 'Rollout', confidence: 98, provKey: 'live-rollout' },
    { id: 'testes', label: 'Testes', confidence: 95, provKey: 'live-testes' },
    { id: 'observ', label: 'Observabilidade', confidence: 92, provKey: 'live-observ' },
    { id: 'rollback', label: 'Rollback', confidence: 96, provKey: 'live-rollback' },
    { id: 'estimativa', label: 'Estimativa', confidence: 87, provKey: 'live-estimativa' },
  ];

  const avgConfidence = Math.round(sections.reduce((s, x) => s + x.confidence, 0) / sections.length);

  if (frozen) {
    return (
      <div className="max-w-2xl mx-auto pt-16">
        <div className="border rounded-lg p-12 text-center" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${COLORS.success}20` }}>
            <Check size={32} style={{ color: COLORS.success }} />
          </div>
          <div className="text-xl font-semibold mb-2" style={{ color: COLORS.textPrimary }}>RP-2026-001 v1.0 congelado</div>
          <div className="text-sm mb-6 max-w-md mx-auto" style={{ color: COLORS.textSecondary }}>
            5 stakeholders notificados. Juliana (PM) já pode avaliar e dar prosseguimento.
          </div>
          <Button variant="secondary" onClick={() => navigate('dashboard')}>Voltar ao Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px]">
      <button onClick={() => navigate('dashboard')} className="flex items-center gap-1 text-sm mb-4 hover:opacity-70" style={{ color: COLORS.textSecondary }}>
        <ChevronLeft size={14} /> Dashboard
      </button>
      <div className="flex items-center gap-3 mb-2">
        <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: COLORS.bgSubtle, color: COLORS.textSecondary }}>DEM-2026-001</span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: '#E0E7FF', color: '#4338CA' }}>Pronto para Congelamento</span>
        <button onClick={() => navigate('timeline')} className="ml-auto text-xs flex items-center gap-1 px-2 py-1 rounded hover:bg-stone-100" style={{ color: COLORS.textSecondary }}>
          <Clock size={12} /> Histórico
        </button>
      </div>
      <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.textPrimary }}>{demandTitle}</h1>
      <p className="text-sm mb-4" style={{ color: COLORS.textSecondary }}>CTO Rafael devolveu a avaliação técnica. Revise e congele a v1.0.</p>

      {/* AI Impact Banner */}
      <AIImpactBanner hoursSaved={28} automatedPct={84} label="Construção deste RP" persona="po" />

      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Score Geral', value: '100%', color: COLORS.success },
          { label: 'Confiança média', value: `${avgConfidence}%`, color: COLORS.info },
          { label: 'ADRs', value: ctoOutput.adrs.length, color: COLORS.ai },
          { label: 'Estimativa', value: `${ctoOutput.estimateDays} dias`, color: COLORS.textPrimary },
        ].map(s => (
          <div key={s.label} className="border rounded-lg p-3" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
            <div className="text-xs uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>{s.label}</div>
            <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-4 mb-24">
        <div className="col-span-3">
          <div className="border rounded-lg overflow-hidden sticky top-20" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
            <div className="px-3 py-2 border-b text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.textMuted, borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>Índice</div>
            <div className="p-1 max-h-[600px] overflow-y-auto">
              {sections.map(s => (
                <button key={s.id} onClick={() => { setActiveSection(s.id); document.getElementById(`section-${s.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} className="w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between hover:bg-stone-50" style={{ backgroundColor: activeSection === s.id ? COLORS.bgSubtle : 'transparent', color: activeSection === s.id ? COLORS.textPrimary : COLORS.textSecondary }}>
                  <span className={activeSection === s.id ? 'font-semibold' : ''}>{s.label}</span>
                  <span className="text-xs font-mono" style={{ color: s.confidence >= 90 ? COLORS.success : s.confidence >= 70 ? COLORS.warning : COLORS.danger }}>{s.confidence}%</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-9">
          <div className="border rounded-lg" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
            <div className="p-8 space-y-8">
              <DocSection id="sumario" title="Sumário Executivo" confidence={100} provKey="live-sumario">
                <p>Gateway de pagamento recorrente via cartão, opt-in para clientes em boleto. Reduzir 30h/mês de reconciliação e levar inadimplência de 18% para ≤10%. Stripe (3,99% + R$0,39) com camada de abstração. Estimativa: {ctoOutput.estimateDays} dias. {ctoOutput.adrs.length} ADRs, {ctoOutput.risks.length} riscos.</p>
              </DocSection>
              <DocSection id="contexto" title="1. Contexto e Problema" confidence={96} provKey="live-contexto">
                <p>{capturePendencies[0]?.a || 'Hoje 100% das cobranças B2B saem por boleto.'}</p>
                <p className="mt-2">{capturePendencies[3]?.a || 'Volume mensal R$ 4,2M; inadimplência 18%; 30h/mês de reconciliação manual.'}</p>
              </DocSection>
              <DocSection id="objetivos" title="2. Objetivos" confidence={92} provKey="live-objetivos">
                <ul className="list-disc ml-5 space-y-1">
                  <li>Migrar 40% da base de boleto para cartão recorrente em 6 meses</li>
                  <li>Reduzir reconciliação de ~30h/mês para ≤5h/mês</li>
                  <li>Levar inadimplência de 18% para ≤10%</li>
                </ul>
              </DocSection>
              <DocSection id="escopo" title="3. Escopo (IN / OUT)" confidence={95} provKey="live-escopo">
                <div className="mb-3">
                  <div className="font-semibold mb-1" style={{ color: COLORS.success }}>IN</div>
                  <ul className="list-disc ml-5 space-y-1">
                    <li>Integração Stripe via SDK</li>
                    <li>Fluxo opt-in com consentimento</li>
                    <li>Webhook idempotente com retry</li>
                    <li>UI de gerenciamento de cartão</li>
                  </ul>
                </div>
                <div>
                  <div className="font-semibold mb-1" style={{ color: COLORS.danger }}>OUT</div>
                  <ul className="list-disc ml-5 space-y-1">
                    <li>Migração forçada</li>
                    <li>Outros gateways (v2)</li>
                    <li>PIX recorrente</li>
                  </ul>
                </div>
              </DocSection>
              <DocSection id="personas" title="4. Personas Impactadas" confidence={90} provKey="live-personas">
                <p>Clientes B2B (550 contas), Financeiro (3), CS (8), Jurídico (parecer obtido).</p>
              </DocSection>
              <DocSection id="regras" title="5. Regras de Negócio" confidence={94} provKey="live-regras">
                <ul className="list-disc ml-5 space-y-1">
                  <li>Cobrança em D+1 do vencimento</li>
                  <li>3 tentativas com intervalo de 24h</li>
                  <li>Notificação após 1ª falha, bloqueio após 3ª</li>
                  <li>Troca de cartão preserva histórico</li>
                </ul>
              </DocSection>
              <DocSection id="aceite" title="6. Critérios de Aceite" confidence={96} provKey="live-aceite">
                <ul className="list-disc ml-5 space-y-1">
                  <li>Cliente cadastra cartão em &lt; 60s</li>
                  <li>Cobrança falhada gera evento auditável</li>
                  <li>Webhook processa 99,9% em &lt; 5s</li>
                  <li>UI desktop e mobile</li>
                </ul>
              </DocSection>
              <DocSection id="sucesso" title="7. Critérios de Sucesso" confidence={93} provKey="live-sucesso">
                <p>Métricas em 30/60/90 dias: % migração, h/mês reconciliação, % inadimplência, NPS dos migrados.</p>
              </DocSection>
              <DocSection id="riscos-p" title="8. Riscos de Produto" confidence={88} provKey="live-riscos-p">
                <ul className="list-disc ml-5 space-y-1">
                  <li>Adesão abaixo se incentivo for fraco</li>
                  <li>Resistência cultural enterprise</li>
                  <li>Suporte sobrecarregado em 30 dias</li>
                </ul>
              </DocSection>
              <DocSection id="adrs" title="9. ADRs (Decisões Arquiteturais)" confidence={100} provKey="live-adrs">
                <div className="space-y-2">
                  {ctoOutput.adrs.map(adr => (
                    <div key={adr.id} className="p-3 rounded-md border" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
                      <div className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>{adr.id} — {adr.title}</div>
                      <div className="text-xs mt-1" style={{ color: COLORS.textSecondary }}>{adr.summary}</div>
                    </div>
                  ))}
                </div>
              </DocSection>
              <DocSection id="sistemas" title="10. Sistemas Afetados" confidence={100} provKey="live-sistemas">
                <ul className="list-disc ml-5 space-y-1">{ctoOutput.systemsAffected.map(s => <li key={s}>{s}</li>)}</ul>
              </DocSection>
              <DocSection id="seguranca" title="11. Segurança (PCI / LGPD)" confidence={95} provKey="live-seguranca">
                <p>Tokenização no provider (ADR-102), zero PAN local. LGPD: consentimento + DPA Stripe. Auditoria PCI-DSS Q3.</p>
              </DocSection>
              <DocSection id="riscos-t" title="12. Riscos Técnicos" confidence={90} provKey="live-riscos-t">
                <ul className="list-disc ml-5 space-y-1">{ctoOutput.risks.map((r, i) => <li key={i}>{r}</li>)}</ul>
              </DocSection>
              <DocSection id="rollout" title="13. Estratégia de Rollout" confidence={98} provKey="live-rollout">
                <p>{ctoOutput.rollout}</p>
              </DocSection>
              <DocSection id="testes" title="14. Testes" confidence={95} provKey="live-testes">
                <p>Unitários (≥80%), integração com Stripe sandbox, E2E no opt-in, load com 10x picos.</p>
              </DocSection>
              <DocSection id="observ" title="15. Observabilidade" confidence={92} provKey="live-observ">
                <p>Dashboards: latência webhook, taxa de falha, chargeback, migração por cohort. Alertas: webhook off &gt; 1min, falha &gt; 5% em 5min.</p>
              </DocSection>
              <DocSection id="rollback" title="16. Rollback" confidence={96} provKey="live-rollback">
                <p>Feature flag global. Incidente: desativar flag, clientes voltam a boleto, eventos re-enfileirados.</p>
              </DocSection>
              <DocSection id="estimativa" title="17. Estimativa" confidence={87} provKey="live-estimativa">
                <p>{ctoOutput.estimateDays} dias úteis (2 backend + 1 frontend). Buffer de 20% incluso.</p>
              </DocSection>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 left-64 right-4 max-w-[1400px] mx-auto border rounded-lg p-4 flex items-center justify-between shadow-md" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="text-xs" style={{ color: COLORS.textMuted }}>
          Score Geral: <strong style={{ color: COLORS.success }}>100%</strong> · Confiança: <strong>{avgConfidence}%</strong> · {ctoOutput.adrs.length} ADRs
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">Revisar &lt;90%</Button>
          <Button variant="secondary" size="sm">Devolver ao CTO</Button>
          <Button size="sm" icon={Check} onClick={() => setShowFreezeModal(true)}>Congelar e Enviar ao PM</Button>
        </div>
      </div>

      {showFreezeModal && (
        <FreezeConfirmModal
          onClose={() => setShowFreezeModal(false)}
          onConfirm={() => {
            setShowFreezeModal(false);
            setRpVersion('v1.0');
            setDemandState('RP Congelado');
            setFrozen(true);
            addNotification({ forPersona: 'pm', type: 'rp-frozen', title: 'Novo RP aguardando avaliação', body: 'Marina congelou RP-2026-001 v1.0 — 34 dias, 4 ADRs', demandId: 'DEM-2026-001', icon: 'layers' });
            addNotification({ forPersona: 'viewer', type: 'rp-published', title: 'RP publicado: você é stakeholder', body: 'RP-2026-001 v1.0 — Gateway Recorrente', demandId: 'DEM-2026-001', icon: 'layers' });
            addNotification({ forPersona: 'submitter', type: 'rp-frozen', title: 'Sua demanda virou um RP', body: 'RP-2026-001 v1.0 congelado. PM Juliana vai planejar.', demandId: 'DEM-2026-001', icon: 'check' });
            showToast('RP-2026-001 v1.0 congelado!');
          }}
        />
      )}
    </div>
  );
}

function DocSection({ id, title, confidence, children, provKey }) {
  const color = confidence >= 90 ? COLORS.success : confidence >= 70 ? COLORS.warning : COLORS.danger;
  return (
    <section id={`section-${id}`} className="scroll-mt-24">
      <div className="flex items-center justify-between mb-3 pb-2 border-b" style={{ borderColor: COLORS.border }}>
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold" style={{ color: COLORS.textPrimary }}>{title}</h3>
          {provKey && <TraceBadge provenanceKey={provKey} compact />}
        </div>
        <span className="text-xs font-medium" style={{ color }}>Confiança {confidence}%</span>
      </div>
      <div className="text-sm leading-relaxed" style={{ color: COLORS.textSecondary }}>{children}</div>
    </section>
  );
}

function FreezeConfirmModal({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-lg rounded-xl shadow-2xl border p-6" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="font-semibold text-lg mb-3" style={{ color: COLORS.textPrimary }}>Congelar Readiness Package?</div>
        <div className="text-sm mb-4" style={{ color: COLORS.textSecondary }}>Ao congelar:</div>
        <ul className="space-y-2 mb-5">
          {['Vira versão 1.0 imutável', 'PM (Juliana) recebe notificação', 'Stakeholders são notificados', 'Edições futuras geram v1.1, v1.2 com diff visível', 'Mudanças técnicas em v1.1 exigem re-avaliação'].map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <Check size={14} className="mt-0.5 flex-shrink-0" style={{ color: COLORS.success }} />
              <span style={{ color: COLORS.textSecondary }}>{s}</span>
            </li>
          ))}
        </ul>
        <div className="border rounded-md p-3 mb-5" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
          <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>Stakeholders notificados</div>
          <ul className="text-xs space-y-1" style={{ color: COLORS.textSecondary }}>
            <li>• Carlos Silva (COO, originador)</li>
            <li>• Ana Santos (CFO)</li>
            <li>• Pedro Costa (Head de Eng)</li>
            <li>• Lucia Mendes (CS Lead)</li>
            <li>• Roberto Lima (Jurídico)</li>
          </ul>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button onClick={onConfirm}>Congelar v1.0</Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SCREEN: TECH EVALUATION (CTO) + modais
// ============================================================
function TechEvaluationScreen() {
  const { navigate, demandTitle, racPendencies, capturePendencies, attachments, techPendencies, techScore, techStats, showToast, setDemandState, adrs, techDraftSavedAt, setTechDraftSavedAt, addNotification } = useApp();
  const [selected, setSelected] = useState(null);
  const [showAdrModal, setShowAdrModal] = useState(false);
  const [showBlockerModal, setShowBlockerModal] = useState(false);
  const [proposeScopeChange, setProposeScopeChange] = useState(false);
  const [scopeChangeText, setScopeChangeText] = useState('');
  const [done, setDone] = useState(false);
  const [blockerSent, setBlockerSent] = useState(false);

  const empty = techPendencies.filter(p => p.status === 'empty');
  const lowConf = techPendencies.filter(p => p.status === 'low_confidence');
  const resolved = techPendencies.filter(p => ['resolved', 'manually_accepted'].includes(p.status));
  const naItems = techPendencies.filter(p => p.status === 'not_applicable');
  const canConclude = techScore === 100;

  if (done) {
    return (
      <div className="max-w-2xl mx-auto pt-16">
        <div className="border rounded-lg p-12 text-center" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${COLORS.success}20` }}>
            <Check size={32} style={{ color: COLORS.success }} />
          </div>
          <div className="text-xl font-semibold mb-2" style={{ color: COLORS.textPrimary }}>Avaliação técnica concluída</div>
          <div className="text-sm mb-4 max-w-md mx-auto" style={{ color: COLORS.textSecondary }}>
            Anexada ao Readiness Package. Marina (PO) recebe agora para congelamento.
          </div>
          <div className="text-xs mb-6 inline-flex gap-4 px-4 py-2 rounded-md" style={{ backgroundColor: COLORS.bgSubtle, color: COLORS.textSecondary }}>
            <span>ADRs: <strong>{adrs.length || 4}</strong></span>
            <span>·</span>
            <span>Score técnico: <strong style={{ color: COLORS.success }}>100%</strong></span>
          </div>
          <div className="flex gap-2 justify-center">
            <Button variant="secondary" onClick={() => navigate('dashboard')}>Dashboard</Button>
            <Button icon={ArrowRight} onClick={() => navigate('timeline')}>Ver histórico</Button>
          </div>
        </div>
      </div>
    );
  }

  if (blockerSent) {
    return (
      <div className="max-w-2xl mx-auto pt-16">
        <div className="border rounded-lg p-12 text-center" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${COLORS.danger}20` }}>
            <AlertCircle size={32} style={{ color: COLORS.danger }} />
          </div>
          <div className="text-xl font-semibold mb-2" style={{ color: COLORS.textPrimary }}>Bloqueador crítico sinalizado</div>
          <div className="text-sm mb-6 max-w-md mx-auto" style={{ color: COLORS.textSecondary }}>
            A demanda volta para Marina (PO) com sua justificativa.
          </div>
          <Button variant="secondary" onClick={() => navigate('dashboard')}>Voltar ao Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px]">
      <button onClick={() => navigate('dashboard')} className="flex items-center gap-1 text-sm mb-4 hover:opacity-70" style={{ color: COLORS.textSecondary }}>
        <ChevronLeft size={14} /> Dashboard
      </button>
      <div className="flex items-center gap-3 mb-2">
        <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: COLORS.bgSubtle, color: COLORS.textSecondary }}>DEM-2026-001</span>
        <StatusPill status="Em Avaliação Técnica" />
        <span className="text-xs" style={{ color: COLORS.textMuted }}>Escalado por Marina · há 1 dia</span>
        <button onClick={() => navigate('timeline')} className="ml-auto text-xs flex items-center gap-1 px-2 py-1 rounded hover:bg-stone-100" style={{ color: COLORS.textSecondary }}>
          <Clock size={12} /> Histórico
        </button>
      </div>
      <h1 className="text-2xl font-bold mb-4" style={{ color: COLORS.textPrimary }}>{demandTitle}</h1>

      <AIImpactBanner hoursSaved={5.5} automatedPct={68} label="Sugestões de ADR e respostas técnicas" persona="cto" />

      <div className="border rounded-lg p-5 mb-6 flex items-center gap-6" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <ScoreRing score={techScore} size={80} strokeWidth={7} />
        <div className="flex-1">
          <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>Avaliação Técnica</div>
          <div className="text-base font-semibold mb-1" style={{ color: COLORS.textPrimary }}>
            {techScore === 100 ? 'Tudo pronto pra anexar ao RP' : `${techStats.empty + techStats.lowConf} pendência${techStats.empty + techStats.lowConf !== 1 ? 's' : ''} restante${techStats.empty + techStats.lowConf !== 1 ? 's' : ''}`}
          </div>
          <div className="text-sm" style={{ color: COLORS.textSecondary }}>
            {techStats.resolved} de {techStats.total} resolvidas · {adrs.length} ADR{adrs.length !== 1 ? 's' : ''}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>Score do PO</div>
          <div className="text-xl font-bold" style={{ color: COLORS.success }}>100%</div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 mb-24">
        <div className="col-span-5">
          <div className="border rounded-lg overflow-hidden" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
            <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.textMuted }}>Pacote do PO</div>
              <span className="text-xs" style={{ color: COLORS.textMuted }}>read-only</span>
            </div>
            <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
              <div>
                <div className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: COLORS.textMuted }}>Contexto</div>
                {capturePendencies.slice(0, 4).map(p => (
                  <div key={p.id} className="mb-3">
                    <div className="text-xs font-semibold mb-0.5" style={{ color: COLORS.textSecondary }}>{p.q}</div>
                    <div className="text-xs" style={{ color: COLORS.textPrimary }}>{p.a || '—'}</div>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t" style={{ borderColor: COLORS.border }}>
                <div className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: COLORS.textMuted }}>Racionalização</div>
                {racPendencies.filter(p => p.a).map(p => (
                  <div key={p.id} className="mb-3">
                    <div className="text-xs font-semibold mb-0.5" style={{ color: COLORS.textSecondary }}>{p.q}</div>
                    <div className="text-xs" style={{ color: COLORS.textPrimary }}>{p.a}</div>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t" style={{ borderColor: COLORS.border }}>
                <div className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: COLORS.textMuted }}>Anexos</div>
                {attachments.map(a => (
                  <div key={a.id} className="text-xs flex items-center gap-1.5 mb-1" style={{ color: COLORS.textSecondary }}>
                    {a.type === 'audio' ? <Mic size={11} /> : <FileText size={11} />}
                    {a.name}
                  </div>
                ))}
              </div>
            </div>
            <div className="px-4 py-2 border-t flex gap-2" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
              <button onClick={() => setProposeScopeChange(!proposeScopeChange)} className="text-xs underline hover:opacity-70" style={{ color: COLORS.textMuted }}>
                {proposeScopeChange ? 'Cancelar' : '⚠️ Propor mudança de escopo ao PO'}
              </button>
            </div>
            {proposeScopeChange && (
              <div className="px-4 py-3 border-t" style={{ borderColor: COLORS.border, backgroundColor: '#FFFBEB' }}>
                <textarea value={scopeChangeText} onChange={e => setScopeChangeText(e.target.value)} rows={3} placeholder="Ex: Sugiro mover X para fora do escopo da v1 porque exige refactor de Y..." className="w-full p-2 text-xs rounded-md border focus:outline-none resize-none mb-2" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgElevated, color: COLORS.textPrimary }} />
                <Button size="sm" disabled={!scopeChangeText.trim()} onClick={() => { showToast('Proposta enviada ao PO'); setScopeChangeText(''); setProposeScopeChange(false); }}>Enviar proposta</Button>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-7">
          <div className="border rounded-lg p-3 mb-4 flex items-center justify-between" style={{ backgroundColor: '#F5F3FF', borderColor: '#DDD6FE' }}>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#6D28D9' }}>ADRs criadas</div>
              <div className="text-sm" style={{ color: COLORS.textPrimary }}>
                {adrs.length === 0 ? 'Nenhuma ADR — registre decisões' : `${adrs.length} ADR${adrs.length !== 1 ? 's' : ''} registrada${adrs.length !== 1 ? 's' : ''}`}
              </div>
            </div>
            <Button variant="secondary" size="sm" icon={Plus} onClick={() => setShowAdrModal(true)}>Adicionar ADR</Button>
          </div>

          {empty.length > 0 && (
            <section className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.danger }} />
                <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.danger }}>Vazias · {empty.length}</h2>
              </div>
              <div className="space-y-2">
                {empty.map(p => <PendencyCard key={p.id} pendency={p} onClick={() => p.isBlocker ? setShowBlockerModal(true) : setSelected(p)} />)}
              </div>
            </section>
          )}

          {lowConf.length > 0 && (
            <section className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.warning }} />
                <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.warning }}>Baixa confiança · {lowConf.length}</h2>
              </div>
              <div className="space-y-2">
                {lowConf.map(p => <PendencyCard key={p.id} pendency={p} onClick={() => setSelected(p)} />)}
              </div>
            </section>
          )}

          {resolved.length > 0 && (
            <section className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.success }} />
                <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.success }}>Resolvidas · {resolved.length}</h2>
              </div>
              <div className="space-y-2">
                {resolved.map(p => <PendencyCard key={p.id} pendency={p} onClick={() => p.isBlocker ? setShowBlockerModal(true) : setSelected(p)} />)}
              </div>
            </section>
          )}

          {naItems.length > 0 && (
            <section className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.textMuted }} />
                <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.textMuted }}>N/A · {naItems.length}</h2>
              </div>
              <div className="space-y-2">
                {naItems.map(p => <PendencyCard key={p.id} pendency={p} onClick={() => setSelected(p)} />)}
              </div>
            </section>
          )}
        </div>
      </div>

      <div className="fixed bottom-4 left-64 right-4 max-w-[1400px] mx-auto border rounded-lg p-4 flex items-center justify-between shadow-md" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="text-xs" style={{ color: COLORS.textMuted }}>
          {canConclude ? 'Pronto pra anexar ao RP' : `Score: ${techScore}%`}
          {techDraftSavedAt && <span className="ml-2">· Rascunho salvo {techDraftSavedAt}</span>}
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => {
            const now = new Date();
            const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            setTechDraftSavedAt(hhmm);
            showToast('Rascunho salvo');
          }}>Salvar rascunho</Button>
          <Button size="sm" icon={Send} disabled={!canConclude} onClick={() => {
            setDone(true);
            setDemandState('Pronto para Congelamento');
            addNotification({ forPersona: 'po', type: 'tech-eval-done', title: 'Avaliação técnica concluída', body: `Rafael devolveu com ${adrs.length} ADRs e 34 dias estimados`, demandId: 'DEM-2026-001', icon: 'check' });
            showToast('Avaliação anexada — PO notificada');
          }}>Anexar ao RP</Button>
        </div>
      </div>

      {selected && <TechPendencyModal pendency={selected} onClose={() => setSelected(null)} />}
      {showAdrModal && <ADRModal onClose={() => setShowAdrModal(false)} />}
      {showBlockerModal && (
        <BlockerModal
          onClose={() => setShowBlockerModal(false)}
          onConfirmBlocker={() => { setShowBlockerModal(false); setBlockerSent(true); setDemandState('Em Racionalização'); showToast('Bloqueador sinalizado, demanda volta ao PO'); }}
          onConfirmNoBlocker={() => { setSelected(null); setShowBlockerModal(false); showToast('Sem bloqueador crítico'); }}
        />
      )}
    </div>
  );
}

function TechPendencyModal({ pendency, onClose }) {
  const { updateTechPendency, showToast } = useApp();
  const [text, setText] = useState(pendency.a || '');
  const [analyzing, setAnalyzing] = useState(false);
  const [showNA, setShowNA] = useState(false);
  const [naReason, setNaReason] = useState('');
  const suggestion = TECH_SUGGESTIONS[pendency.id];

  const useSuggestion = () => { if (suggestion) setText(suggestion); };
  const handleSave = () => {
    if (!text.trim()) return;
    setAnalyzing(true);
    setTimeout(() => {
      const matchesSuggestion = suggestion && text.trim() === suggestion;
      const newConfidence = matchesSuggestion ? 95 : 92;
      updateTechPendency(pendency.id, { a: text.trim(), confidence: newConfidence, status: 'resolved' });
      showToast('Resposta salva');
      onClose();
    }, 800);
  };
  const markNotApplicable = () => {
    updateTechPendency(pendency.id, { a: '', confidence: 0, status: 'not_applicable', naReason });
    showToast('Marcada como N/A');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-3xl rounded-xl shadow-2xl border max-h-[90vh] overflow-y-auto" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: COLORS.border }}>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>{pendency.section}</div>
            <div className="font-semibold text-base" style={{ color: COLORS.textPrimary }}>{pendency.q}</div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-stone-100 rounded"><X size={18} style={{ color: COLORS.textMuted }} /></button>
        </div>
        <div className="p-6">
          {suggestion && (
            <div className="border rounded-md p-3 mb-4" style={{ backgroundColor: `${COLORS.ai}10`, borderColor: `${COLORS.ai}30` }}>
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: COLORS.ai }}>
                  <Sparkles size={12} /> Sugestão da plataforma
                </div>
                <Button variant="ghost" size="sm" onClick={useSuggestion}>Usar essa sugestão</Button>
              </div>
              <div className="text-sm" style={{ color: COLORS.textPrimary }}>{suggestion}</div>
            </div>
          )}
          <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>Sua resposta técnica</div>
          <textarea value={text} onChange={e => setText(e.target.value)} rows={7} placeholder="Detalhe a decisão, riscos, alternativas..." className="w-full p-3 text-sm rounded-md border focus:outline-none resize-none" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg, color: COLORS.textPrimary }} />
          {analyzing && (
            <div className="mt-4 flex items-center gap-2 p-3 rounded-md" style={{ backgroundColor: `${COLORS.info}10` }}>
              <Loader2 size={14} className="animate-spin" style={{ color: COLORS.info }} />
              <span className="text-sm" style={{ color: COLORS.info }}>Validando resposta...</span>
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t flex justify-between items-center" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
          <button onClick={() => setShowNA(!showNA)} className="text-xs underline hover:opacity-70" style={{ color: COLORS.textMuted }}>{showNA ? 'Cancelar N/A' : 'Não se aplica'}</button>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose} disabled={analyzing}>Cancelar</Button>
            <Button onClick={handleSave} disabled={!text.trim() || analyzing}>Salvar</Button>
          </div>
        </div>
        {showNA && (
          <div className="px-6 py-4 border-t" style={{ borderColor: COLORS.border, backgroundColor: '#FAFAF9' }}>
            <textarea value={naReason} onChange={e => setNaReason(e.target.value)} rows={2} placeholder="Justificativa..." className="w-full p-2.5 text-sm rounded-md border focus:outline-none resize-none mb-2" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgElevated, color: COLORS.textPrimary }} />
            <div className="flex justify-end"><Button size="sm" disabled={!naReason.trim()} onClick={markNotApplicable}>Marcar N/A</Button></div>
          </div>
        )}
      </div>
    </div>
  );
}

function ADRModal({ onClose }) {
  const { adrs, setAdrs, showToast, updateTechPendency, techPendencies } = useApp();
  const [form, setForm] = useState({ title: '', context: '', decision: '', alternatives: '', consequences: '' });

  const addAdr = (adr) => {
    const id = adr.id || `ADR-${String(adrs.length + 1).padStart(3, '0')}`;
    setAdrs(prev => [...prev, { ...adr, id }]);
    const adrsPendency = techPendencies.find(p => p.isAdrs);
    if (adrsPendency) {
      const allAdrs = [...adrs, { ...adr, id }];
      updateTechPendency(adrsPendency.id, { a: `${allAdrs.length} ADRs: ${allAdrs.map(a => a.title).join(', ')}`, confidence: 95, status: 'resolved' });
    }
    showToast(`${id} adicionada`);
  };

  const addFromSuggested = (sugg) => addAdr({ id: sugg.id, title: sugg.title, context: sugg.context, decision: sugg.decision, alternatives: sugg.alternatives, consequences: sugg.consequences });
  const addAllSuggested = () => {
    const newAdrs = SUGGESTED_ADRS.filter(s => !adrs.find(a => a.id === s.id));
    setAdrs(prev => [...prev, ...newAdrs]);
    const adrsPendency = techPendencies.find(p => p.isAdrs);
    if (adrsPendency) {
      const allAdrs = [...adrs, ...newAdrs];
      updateTechPendency(adrsPendency.id, { a: `${allAdrs.length} ADRs: ${allAdrs.map(a => a.title).join(', ')}`, confidence: 95, status: 'resolved' });
    }
    showToast(`${newAdrs.length} ADRs adicionadas`);
  };
  const addCustom = () => {
    if (!form.title.trim() || !form.decision.trim()) return;
    addAdr(form);
    setForm({ title: '', context: '', decision: '', alternatives: '', consequences: '' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-3xl rounded-xl shadow-2xl border max-h-[90vh] overflow-y-auto" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: COLORS.border }}>
          <div>
            <div className="font-semibold text-base" style={{ color: COLORS.textPrimary }}>Decisões Arquiteturais (ADRs)</div>
            <div className="text-xs mt-0.5" style={{ color: COLORS.textMuted }}>{adrs.length} registrada{adrs.length !== 1 ? 's' : ''}</div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-stone-100 rounded"><X size={18} style={{ color: COLORS.textMuted }} /></button>
        </div>
        <div className="p-6">
          {adrs.length > 0 && (
            <div className="mb-6">
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>ADRs registradas</div>
              <div className="space-y-2">
                {adrs.map(adr => (
                  <div key={adr.id} className="border rounded-md p-3" style={{ backgroundColor: COLORS.bgSubtle, borderColor: COLORS.border }}>
                    <div className="font-semibold text-sm mb-1" style={{ color: COLORS.textPrimary }}>{adr.id} — {adr.title}</div>
                    <div className="text-xs" style={{ color: COLORS.textSecondary }}>{adr.decision?.slice(0, 120)}{adr.decision?.length > 120 ? '...' : ''}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {SUGGESTED_ADRS.some(s => !adrs.find(a => a.id === s.id)) && (
            <div className="mb-6 border rounded-md p-4" style={{ borderColor: `${COLORS.ai}30`, backgroundColor: `${COLORS.ai}08` }}>
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: COLORS.ai }}>
                  <Sparkles size={12} /> Sugestões da plataforma · com base em 12 RPs anteriores
                </div>
                <Button variant="ghost" size="sm" onClick={addAllSuggested}>Adicionar todas</Button>
              </div>
              <div className="space-y-2">
                {SUGGESTED_ADRS.filter(s => !adrs.find(a => a.id === s.id)).map(sugg => (
                  <div key={sugg.id} className="flex items-start justify-between gap-3 p-3 rounded border" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>{sugg.id} — {sugg.title}</div>
                      <div className="text-xs mt-0.5" style={{ color: COLORS.textSecondary }}>{sugg.decision.slice(0, 100)}...</div>
                    </div>
                    <Button size="sm" variant="secondary" onClick={() => addFromSuggested(sugg)}>Adicionar</Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="border-t pt-5" style={{ borderColor: COLORS.border }}>
            <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: COLORS.textMuted }}>Adicionar ADR customizada</div>
            <div className="space-y-3">
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Título da decisão" className="w-full p-2.5 text-sm rounded-md border focus:outline-none" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg, color: COLORS.textPrimary }} />
              <textarea value={form.context} onChange={e => setForm({ ...form, context: e.target.value })} placeholder="Contexto" rows={2} className="w-full p-2.5 text-sm rounded-md border focus:outline-none resize-none" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg, color: COLORS.textPrimary }} />
              <textarea value={form.decision} onChange={e => setForm({ ...form, decision: e.target.value })} placeholder="Decisão" rows={2} className="w-full p-2.5 text-sm rounded-md border focus:outline-none resize-none" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg, color: COLORS.textPrimary }} />
              <textarea value={form.alternatives} onChange={e => setForm({ ...form, alternatives: e.target.value })} placeholder="Alternativas" rows={2} className="w-full p-2.5 text-sm rounded-md border focus:outline-none resize-none" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg, color: COLORS.textPrimary }} />
              <textarea value={form.consequences} onChange={e => setForm({ ...form, consequences: e.target.value })} placeholder="Consequências" rows={2} className="w-full p-2.5 text-sm rounded-md border focus:outline-none resize-none" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg, color: COLORS.textPrimary }} />
              <div className="flex justify-end"><Button size="sm" icon={Plus} disabled={!form.title.trim() || !form.decision.trim()} onClick={addCustom}>Adicionar</Button></div>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t flex justify-end" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </div>
    </div>
  );
}

function BlockerModal({ onClose, onConfirmBlocker, onConfirmNoBlocker }) {
  const [choice, setChoice] = useState(null);
  const [reason, setReason] = useState('');
  const { updateTechPendency, techPendencies } = useApp();
  const handleNoBlocker = () => {
    const blockerP = techPendencies.find(p => p.isBlocker);
    if (blockerP) updateTechPendency(blockerP.id, { a: 'Sem bloqueador. Demanda viável.', confidence: 95, status: 'resolved' });
    onConfirmNoBlocker();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-lg rounded-xl shadow-2xl border" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: COLORS.border }}>
          <div className="font-semibold text-base" style={{ color: COLORS.textPrimary }}>Bloqueador técnico crítico?</div>
          <div className="text-xs mt-0.5" style={{ color: COLORS.textMuted }}>Decisão final da avaliação</div>
        </div>
        <div className="p-6 space-y-3">
          <button onClick={() => setChoice('no')} className="w-full text-left p-4 rounded-md border transition-all" style={{ borderColor: choice === 'no' ? COLORS.success : COLORS.border, backgroundColor: choice === 'no' ? `${COLORS.success}10` : COLORS.bg }}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: choice === 'no' ? COLORS.success : COLORS.borderStrong }}>
                {choice === 'no' && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.success }} />}
              </div>
              <div className="text-sm font-semibold" style={{ color: COLORS.textPrimary }}>Não há bloqueador crítico</div>
            </div>
            <div className="text-xs ml-6" style={{ color: COLORS.textSecondary }}>Demanda viável. Avaliação prossegue.</div>
          </button>
          <button onClick={() => setChoice('yes')} className="w-full text-left p-4 rounded-md border transition-all" style={{ borderColor: choice === 'yes' ? COLORS.danger : COLORS.border, backgroundColor: choice === 'yes' ? `${COLORS.danger}10` : COLORS.bg }}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: choice === 'yes' ? COLORS.danger : COLORS.borderStrong }}>
                {choice === 'yes' && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.danger }} />}
              </div>
              <div className="text-sm font-semibold" style={{ color: COLORS.textPrimary }}>Sim, há bloqueador crítico</div>
            </div>
            <div className="text-xs ml-6" style={{ color: COLORS.textSecondary }}>Volta ao PO com sua justificativa.</div>
          </button>
          {choice === 'yes' && (
            <div className="pt-2">
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>Justificativa (obrigatória)</div>
              <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3} placeholder="Ex: Integração com SAP exige nova auth..." className="w-full p-2.5 text-sm rounded-md border focus:outline-none resize-none" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg, color: COLORS.textPrimary }} />
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t flex justify-end gap-2" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button variant={choice === 'yes' ? 'danger' : 'primary'} disabled={!choice || (choice === 'yes' && !reason.trim())} onClick={() => choice === 'yes' ? onConfirmBlocker(reason) : handleNoBlocker()}>Confirmar</Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SCREEN: RP VIEW (PM/Viewer) com TraceBadge + text-selection
// ============================================================
function RPViewScreen() {
  const { navigate, persona, demandTitle, demandState, rpVersion, rpComments, setRpComments, capturePendencies, showToast, setDemandState, setReturnedGaps, adrs, v11Changes, addNotification } = useApp();
  const [activeSection, setActiveSection] = useState('contexto');
  const [selection, setSelection] = useState(null);
  const [showGapModal, setShowGapModal] = useState(false);
  const [commentTrecho, setCommentTrecho] = useState('');
  const [showAcceptConfirm, setShowAcceptConfirm] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [showDiff, setShowDiff] = useState(true);

  const isPM = persona?.id === 'pm';
  const isViewer = persona?.id === 'viewer';
  const isV11 = rpVersion === 'v1.1';
  const hasChanges = Object.keys(v11Changes).length > 0;

  if (demandState !== 'RP Congelado' && !rpVersion) {
    return (
      <div className="max-w-2xl mx-auto pt-16">
        <div className="border rounded-lg p-12 text-center" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
          <Layers size={32} className="mx-auto mb-3" style={{ color: COLORS.textMuted }} />
          <div className="text-lg font-semibold mb-2" style={{ color: COLORS.textPrimary }}>Nenhum RP congelado ainda</div>
          <div className="text-sm mb-6 max-w-md mx-auto" style={{ color: COLORS.textSecondary }}>Para ver, troque para Marina (PO), finalize a Racionalização e congele.</div>
          <Button variant="secondary" onClick={() => navigate('dashboard')}>Voltar ao Dashboard</Button>
        </div>
      </div>
    );
  }

  if (accepted) {
    return (
      <div className="max-w-2xl mx-auto pt-16">
        <div className="border rounded-lg p-12 text-center" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${COLORS.success}20` }}>
            <Check size={32} style={{ color: COLORS.success }} />
          </div>
          <div className="text-xl font-semibold mb-2" style={{ color: COLORS.textPrimary }}>RP aceito e em execução</div>
          <div className="text-sm mb-6 max-w-md mx-auto" style={{ color: COLORS.textSecondary }}>O time de engenharia foi notificado e pode começar.</div>
          <Button variant="secondary" onClick={() => navigate('dashboard')}>Voltar ao Dashboard</Button>
        </div>
      </div>
    );
  }

  const sections = [
    { id: 'sumario', label: 'Sumário', confidence: 100, provKey: 'live-sumario' },
    { id: 'contexto', label: 'Contexto', confidence: 96, provKey: 'live-contexto' },
    { id: 'objetivos', label: 'Objetivos', confidence: 92, provKey: 'live-objetivos' },
    { id: 'escopo', label: 'Escopo', confidence: 95, provKey: 'live-escopo' },
    { id: 'adrs', label: 'ADRs', confidence: 100, provKey: 'live-adrs' },
    { id: 'riscos', label: 'Riscos', confidence: 90, provKey: 'live-riscos-t' },
    { id: 'rollout', label: 'Rollout', confidence: 98, provKey: 'live-rollout' },
    { id: 'estimativa', label: 'Estimativa', confidence: 87, provKey: 'live-estimativa' },
  ];

  const handleTextSelection = (sectionId) => {
    setTimeout(() => {
      const sel = window.getSelection?.();
      if (sel && sel.toString().trim().length > 5) {
        const text = sel.toString().trim();
        const rect = sel.getRangeAt(0).getBoundingClientRect();
        setSelection({ text, sectionId, rect });
      } else { setSelection(null); }
    }, 10);
  };

  const addComment = (_type) => {
    if (!selection) return;
    setCommentTrecho(selection.text);
    setShowGapModal(true);
  };

  const submitComment = (text, type, blocking = false) => {
    const newComment = {
      id: `c-${Date.now()}`, sectionId: selection?.sectionId, trecho: commentTrecho,
      author: persona.name, authorRole: persona.label, authorColor: persona.color,
      text, type, blocking, timestamp: new Date(), resolved: false,
    };
    setRpComments(prev => [...prev, newComment]);
    setSelection(null); setShowGapModal(false); setCommentTrecho('');
    showToast(type === 'gap' ? 'Gap apontado' : 'Comentário adicionado');
  };

  return (
    <div className="max-w-[1400px]">
      <button onClick={() => navigate('dashboard')} className="flex items-center gap-1 text-sm mb-4 hover:opacity-70" style={{ color: COLORS.textSecondary }}>
        <ChevronLeft size={14} /> Dashboard
      </button>
      {isViewer && (
        <div className="mb-4 p-3 rounded-md border flex items-center gap-2 text-sm" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle, color: COLORS.textSecondary }}>
          <Eye size={14} /> Você está visualizando como <strong>Viewer</strong> (read-only + comentários)
        </div>
      )}
      <div className="flex items-center gap-3 mb-2">
        <Layers size={16} style={{ color: persona.color }} />
        <span className="font-semibold text-base" style={{ color: COLORS.textPrimary }}>RP-2026-001 {rpVersion || 'v1.0'}</span>
        <StatusPill status="RP Congelado" />
        <button onClick={() => navigate('timeline')} className="ml-auto text-xs flex items-center gap-1 px-2 py-1 rounded hover:bg-stone-100" style={{ color: COLORS.textSecondary }}>
          <Clock size={12} /> Histórico
        </button>
      </div>
      <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.textPrimary }}>{demandTitle}</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.textSecondary }}>
        Congelado por Marina · PO: Marina · CTO: Rafael · {rpComments.length} comentário{rpComments.length !== 1 ? 's' : ''}
      </p>

      {isPM && <AIImpactBanner hoursSaved={2.3} automatedPct={71} label="Análise prévia do RP" persona="pm" />}

      {isV11 && hasChanges && (
        <div className="mb-6 p-4 rounded-lg border flex items-center justify-between" style={{ borderColor: `${COLORS.info}40`, backgroundColor: `${COLORS.info}08` }}>
          <div className="flex items-center gap-3">
            <Layers size={18} style={{ color: COLORS.info }} />
            <div>
              <div className="text-sm font-semibold" style={{ color: COLORS.textPrimary }}>v1.1 — {Object.keys(v11Changes).length} mudança{Object.keys(v11Changes).length !== 1 ? 's' : ''} desde v1.0</div>
              <div className="text-xs" style={{ color: COLORS.textSecondary }}>Marina endereçou os gaps. Seções modificadas mostram diff.</div>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={showDiff} onChange={e => setShowDiff(e.target.checked)} />
            <span style={{ color: COLORS.textPrimary }}>Mostrar diff</span>
          </label>
        </div>
      )}

      <div className="grid grid-cols-12 gap-4 mb-24">
        <div className="col-span-3">
          <div className="border rounded-lg overflow-hidden sticky top-20" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
            <div className="px-3 py-2 border-b text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.textMuted, borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>Índice</div>
            <div className="p-1">
              {sections.map(s => {
                const sectionComments = rpComments.filter(c => c.sectionId === s.id);
                return (
                  <button key={s.id} onClick={() => { setActiveSection(s.id); document.getElementById(`rpv-${s.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} className="w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between hover:bg-stone-50" style={{ backgroundColor: activeSection === s.id ? COLORS.bgSubtle : 'transparent', color: activeSection === s.id ? COLORS.textPrimary : COLORS.textSecondary }}>
                    <span className={activeSection === s.id ? 'font-semibold' : ''}>{s.label}</span>
                    <div className="flex items-center gap-1.5">
                      {sectionComments.length > 0 && (
                        <span className="text-xs font-medium px-1.5 py-0.5 rounded-full" style={{ backgroundColor: persona.color, color: 'white' }}>{sectionComments.length}</span>
                      )}
                      <span className="text-xs font-mono" style={{ color: s.confidence >= 90 ? COLORS.success : s.confidence >= 70 ? COLORS.warning : COLORS.danger }}>{s.confidence}%</span>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="px-3 py-3 border-t" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>Meta</div>
              <div className="text-xs space-y-1" style={{ color: COLORS.textSecondary }}>
                <div>Score: <strong style={{ color: COLORS.success }}>100%</strong></div>
                <div>Conf. média: <strong>97%</strong></div>
                <div>ADRs: <strong>{adrs.length || 4}</strong></div>
                <div>Estim.: <strong>34 dias</strong></div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-6">
          <div className="border rounded-lg" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
            <div className="p-8 space-y-8">
              <RPViewSection id="sumario" title="Sumário Executivo" confidence={100} provKey="live-sumario" onSelect={handleTextSelection} changes={isV11 && showDiff ? Object.values(v11Changes).filter(c => c.sectionId === 'sumario') : []}>
                <p>Gateway de pagamento recorrente, opt-in para clientes em boleto. Reduzir 30h/mês de reconciliação e levar inadimplência de 18% para ≤10%.</p>
              </RPViewSection>
              <RPViewSection id="contexto" title="1. Contexto e Problema" confidence={96} provKey="live-contexto" onSelect={handleTextSelection} changes={isV11 && showDiff ? Object.values(v11Changes).filter(c => c.sectionId === 'contexto') : []}>
                <p>{capturePendencies[0]?.a || 'Hoje 100% das cobranças B2B saem por boleto.'}</p>
              </RPViewSection>
              <RPViewSection id="objetivos" title="2. Objetivos" confidence={92} provKey="live-objetivos" onSelect={handleTextSelection} changes={isV11 && showDiff ? Object.values(v11Changes).filter(c => c.sectionId === 'objetivos') : []}>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Migrar 40% da base de boleto em 6 meses</li>
                  <li>Reduzir reconciliação de ~30h/mês para ≤5h/mês</li>
                  <li>Levar inadimplência de 18% para ≤10%</li>
                </ul>
              </RPViewSection>
              <RPViewSection id="escopo" title="3. Escopo" confidence={95} provKey="live-escopo" onSelect={handleTextSelection} changes={isV11 && showDiff ? Object.values(v11Changes).filter(c => c.sectionId === 'escopo') : []}>
                <div className="mb-3">
                  <div className="font-semibold mb-1" style={{ color: COLORS.success }}>IN</div>
                  <ul className="list-disc ml-5 space-y-1"><li>Stripe SDK</li><li>Opt-in com consentimento</li><li>Webhook idempotente</li></ul>
                </div>
                <div>
                  <div className="font-semibold mb-1" style={{ color: COLORS.danger }}>OUT</div>
                  <ul className="list-disc ml-5 space-y-1"><li>Migração forçada</li><li>Outros gateways (v2)</li></ul>
                </div>
              </RPViewSection>
              <RPViewSection id="adrs" title="4. ADRs" confidence={100} provKey="live-adrs" onSelect={handleTextSelection} changes={isV11 && showDiff ? Object.values(v11Changes).filter(c => c.sectionId === 'adrs') : []}>
                <div className="space-y-2">
                  {(adrs.length > 0 ? adrs : SUGGESTED_ADRS).map(adr => (
                    <div key={adr.id} className="p-3 rounded-md border" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
                      <div className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>{adr.id} — {adr.title}</div>
                      <div className="text-xs mt-1" style={{ color: COLORS.textSecondary }}>{adr.decision?.slice(0, 150)}{adr.decision?.length > 150 ? '...' : ''}</div>
                    </div>
                  ))}
                </div>
              </RPViewSection>
              <RPViewSection id="riscos" title="5. Riscos Técnicos" confidence={90} provKey="live-riscos-t" onSelect={handleTextSelection} changes={isV11 && showDiff ? Object.values(v11Changes).filter(c => c.sectionId === 'riscos') : []}>
                <ul className="list-disc ml-5 space-y-1"><li>Chargeback em 30 dias</li><li>Latência webhook em pico</li><li>Falha conciliação ERP em estornos</li><li>Resistência enterprise ao opt-in</li></ul>
              </RPViewSection>
              <RPViewSection id="rollout" title="6. Rollout" confidence={98} provKey="live-rollout" onSelect={handleTextSelection} changes={isV11 && showDiff ? Object.values(v11Changes).filter(c => c.sectionId === 'rollout') : []}>
                <p>Canário 5% → 25% → 50% → 100% em 3 semanas, kill-switch global.</p>
              </RPViewSection>
              <RPViewSection id="estimativa" title="7. Estimativa" confidence={87} provKey="live-estimativa" onSelect={handleTextSelection} changes={isV11 && showDiff ? Object.values(v11Changes).filter(c => c.sectionId === 'estimativa') : []}>
                <p>34 dias úteis. Breakdown: 12d backend, 8d frontend, 6d integração, 5d rollout, 3d buffer.</p>
              </RPViewSection>
            </div>
          </div>
        </div>

        <div className="col-span-3">
          <div className="border rounded-lg sticky top-20" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
            <div className="px-3 py-2 border-b text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.textMuted, borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>Comentários ({rpComments.length})</div>
            <div className="p-3 max-h-[600px] overflow-y-auto space-y-3">
              {rpComments.length === 0 ? (
                <div className="text-xs text-center py-6" style={{ color: COLORS.textMuted }}>Selecione um trecho para comentar</div>
              ) : (
                rpComments.map(c => (
                  <div key={c.id} className="border rounded-md p-2.5" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0" style={{ backgroundColor: c.authorColor }}>
                        {c.author.split(' ').map(p => p[0]).join('').slice(0, 2)}
                      </div>
                      <span className="text-xs font-semibold" style={{ color: COLORS.textPrimary }}>{c.author.split(' ')[0]}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: c.type === 'gap' ? `${COLORS.danger}15` : `${COLORS.info}15`, color: c.type === 'gap' ? COLORS.danger : COLORS.info }}>
                        {c.type === 'gap' ? 'Gap' : c.type === 'question' ? 'Pergunta' : 'Coment.'}
                      </span>
                      {c.blocking && <span className="text-xs" title="Bloqueante">🔒</span>}
                    </div>
                    <div className="text-xs italic mb-1.5 line-clamp-2 px-1.5 py-1 rounded" style={{ color: COLORS.textMuted, backgroundColor: COLORS.bgSubtle, fontSize: '11px' }}>
                      "{c.trecho.slice(0, 80)}{c.trecho.length > 80 ? '...' : ''}"
                    </div>
                    <div className="text-xs" style={{ color: COLORS.textPrimary }}>{c.text}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {selection && (
        <div className="fixed z-50 flex gap-1 p-1 rounded-md border shadow-lg" style={{ left: `${selection.rect.left + selection.rect.width / 2 - 80}px`, top: `${selection.rect.top - 44}px`, backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
          <button onClick={() => addComment('comment')} className="px-2 py-1 text-xs rounded hover:bg-stone-100 flex items-center gap-1" style={{ color: COLORS.textPrimary }}>
            <MessageSquare size={11} /> Comentar
          </button>
          <button onClick={() => addComment('question')} className="px-2 py-1 text-xs rounded hover:bg-stone-100 flex items-center gap-1" style={{ color: COLORS.textPrimary }}>
            ❓ Perguntar
          </button>
          {isPM && (
            <button onClick={() => addComment('gap')} className="px-2 py-1 text-xs rounded hover:bg-stone-100 flex items-center gap-1" style={{ color: COLORS.danger }}>
              <AlertTriangle size={11} /> Apontar gap
            </button>
          )}
        </div>
      )}

      {isPM && (
        <div className="fixed bottom-4 left-64 right-4 max-w-[1400px] mx-auto border rounded-lg p-4 flex items-center justify-between shadow-md" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
          <div className="text-xs" style={{ color: COLORS.textMuted }}>
            {rpComments.filter(c => c.blocking).length > 0
              ? `${rpComments.filter(c => c.blocking).length} gap${rpComments.filter(c => c.blocking).length !== 1 ? 's' : ''} bloqueante${rpComments.filter(c => c.blocking).length !== 1 ? 's' : ''}`
              : 'Sem gaps bloqueantes — pronto para aceitar'}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" disabled={rpComments.filter(c => c.blocking).length === 0} onClick={() => {
              const blockingGaps = rpComments.filter(c => c.blocking);
              setReturnedGaps(blockingGaps);
              setDemandState('Devolvido pelo PM');
              addNotification({ forPersona: 'po', type: 'rp-returned', title: 'RP devolvido pelo PM', body: `Juliana apontou ${blockingGaps.length} gap(s) bloqueante(s).`, demandId: 'DEM-2026-001', icon: 'alert' });
              showToast(`${blockingGaps.length} gap(s) devolvido(s) — v1.1 será gerada`);
              navigate('dashboard');
            }}>⚠️ Devolver com gaps</Button>
            <Button size="sm" icon={Check} onClick={() => setShowAcceptConfirm(true)}>Aceitar e planejar</Button>
          </div>
        </div>
      )}

      {showGapModal && (
        <CommentModal trecho={commentTrecho} allowGap={isPM} onClose={() => { setShowGapModal(false); setSelection(null); }} onSubmit={submitComment} />
      )}

      {showAcceptConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowAcceptConfirm(false)}>
          <div onClick={e => e.stopPropagation()} className="w-full max-w-md rounded-xl shadow-2xl border p-6" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
            <div className="font-semibold text-lg mb-2" style={{ color: COLORS.textPrimary }}>Aceitar RP?</div>
            <div className="text-sm mb-5" style={{ color: COLORS.textSecondary }}>A demanda passa para "Em Execução". Time de eng. notificado.</div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setShowAcceptConfirm(false)}>Cancelar</Button>
              <Button onClick={() => {
                setAccepted(true); setDemandState('Em Execução'); setShowAcceptConfirm(false);
                addNotification({ forPersona: 'po', type: 'rp-accepted', title: 'RP aceito pelo PM', body: 'Juliana aceitou. Demanda em execução.', demandId: 'DEM-2026-001', icon: 'check' });
                addNotification({ forPersona: 'submitter', type: 'rp-accepted', title: 'Sua demanda está em execução! 🎉', body: 'PM aceitou. Time começou.', demandId: 'DEM-2026-001', icon: 'check' });
              }}>Aceitar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RPViewSection({ id, title, confidence, children, onSelect, changes, provKey }) {
  const color = confidence >= 90 ? COLORS.success : confidence >= 70 ? COLORS.warning : COLORS.danger;
  const hasChanges = changes && changes.length > 0;
  return (
    <section id={`rpv-${id}`} className="scroll-mt-24" onMouseUp={() => onSelect(id)}>
      <div className="flex items-center justify-between mb-3 pb-2 border-b" style={{ borderColor: COLORS.border }}>
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold" style={{ color: COLORS.textPrimary }}>{title}</h3>
          {provKey && <TraceBadge provenanceKey={provKey} compact />}
          {hasChanges && (
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: `${COLORS.info}15`, color: COLORS.info }}>Modificada em v1.1</span>
          )}
        </div>
        <span className="text-xs font-medium" style={{ color }}>{confidence}%</span>
      </div>
      {hasChanges && (
        <div className="mb-4 space-y-2">
          {changes.map((change, i) => (
            <div key={i} className="border rounded-md overflow-hidden">
              <div className="px-3 py-2 text-xs border-b flex items-center gap-2" style={{ backgroundColor: COLORS.bgSubtle, borderColor: COLORS.border, color: COLORS.textMuted }}>
                <Layers size={11} /> Diff endereçando gap de {change.addressedBy?.split(' ')[0] || 'PO'}
              </div>
              <div className="p-3 text-sm" style={{ backgroundColor: '#FEF2F2' }}>
                <span className="text-xs font-mono mr-2" style={{ color: COLORS.danger }}>−</span>
                <span style={{ color: COLORS.textPrimary, textDecoration: 'line-through', opacity: 0.7 }}>{change.before}</span>
              </div>
              <div className="p-3 text-sm" style={{ backgroundColor: `${COLORS.success}10` }}>
                <span className="text-xs font-mono mr-2" style={{ color: COLORS.success }}>+</span>
                <span style={{ color: COLORS.textPrimary, fontWeight: 500 }}>{change.after}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="text-sm leading-relaxed select-text" style={{ color: COLORS.textSecondary }}>{children}</div>
    </section>
  );
}

function CommentModal({ trecho, allowGap, onClose, onSubmit }) {
  const [text, setText] = useState('');
  const [type, setType] = useState('comment');
  const [blocking, setBlocking] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-lg rounded-xl shadow-2xl border" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: COLORS.border }}>
          <div className="font-semibold text-base" style={{ color: COLORS.textPrimary }}>
            {type === 'gap' ? 'Apontar gap' : type === 'question' ? 'Perguntar' : 'Comentar'}
          </div>
        </div>
        <div className="p-6">
          <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>Trecho selecionado</div>
          <div className="border rounded-md p-3 mb-4 text-sm italic" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle, color: COLORS.textPrimary }}>"{trecho}"</div>
          <div className="flex gap-2 mb-3">
            <button onClick={() => setType('comment')} className="px-3 py-1.5 text-xs font-medium rounded-md border" style={{ backgroundColor: type === 'comment' ? COLORS.bgSubtle : 'transparent', borderColor: type === 'comment' ? COLORS.borderStrong : COLORS.border, color: COLORS.textPrimary }}>💬 Comentário</button>
            <button onClick={() => setType('question')} className="px-3 py-1.5 text-xs font-medium rounded-md border" style={{ backgroundColor: type === 'question' ? COLORS.bgSubtle : 'transparent', borderColor: type === 'question' ? COLORS.borderStrong : COLORS.border, color: COLORS.textPrimary }}>❓ Pergunta</button>
            {allowGap && <button onClick={() => setType('gap')} className="px-3 py-1.5 text-xs font-medium rounded-md border" style={{ backgroundColor: type === 'gap' ? `${COLORS.danger}10` : 'transparent', borderColor: type === 'gap' ? COLORS.danger : COLORS.border, color: type === 'gap' ? COLORS.danger : COLORS.textPrimary }}>⚠️ Gap</button>}
          </div>
          <textarea value={text} onChange={e => setText(e.target.value)} rows={4} placeholder={type === 'gap' ? 'O que está faltando?' : 'Sua observação...'} className="w-full p-3 text-sm rounded-md border focus:outline-none resize-none" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg, color: COLORS.textPrimary }} />
          {type === 'gap' && (
            <div className="mt-3">
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>Esse gap exige:</div>
              <div className="space-y-2">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="radio" name="blocking" checked={!blocking} onChange={() => setBlocking(false)} className="mt-0.5" />
                  <div><div className="text-sm" style={{ color: COLORS.textPrimary }}>Resposta no comentário (não bloqueante)</div><div className="text-xs" style={{ color: COLORS.textMuted }}>Pode ser respondido sem nova versão</div></div>
                </label>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="radio" name="blocking" checked={blocking} onChange={() => setBlocking(true)} className="mt-0.5" />
                  <div><div className="text-sm" style={{ color: COLORS.textPrimary }}>Nova versão do RP (v1.1 obrigatória)</div><div className="text-xs" style={{ color: COLORS.textMuted }}>RP volta ao PO para revisão</div></div>
                </label>
              </div>
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t flex justify-end gap-2" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button disabled={!text.trim()} onClick={() => onSubmit(text, type, blocking)}>Enviar</Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SCREEN: RP REVISION (PO endereça gaps, gera v1.1)
// ============================================================
function RPRevisionScreen() {
  const { navigate, demandTitle, returnedGaps, setReturnedGaps, showToast, setDemandState, setRpVersion, v11Changes, setV11Changes, addNotification } = useApp();
  const [selectedGap, setSelectedGap] = useState(null);
  const [v11Frozen, setV11Frozen] = useState(false);

  const allAddressed = returnedGaps.every(g => v11Changes[g.id]);

  const addressGap = (gap, newText) => {
    setV11Changes(prev => ({ ...prev, [gap.id]: { gapId: gap.id, sectionId: gap.sectionId, before: gap.trecho, after: newText, addressedBy: 'Marina Costa' } }));
    setSelectedGap(null);
    showToast('Gap endereçado');
  };

  const freezeV11 = () => {
    setRpVersion('v1.1');
    setDemandState('RP Congelado');
    setReturnedGaps([]);
    setV11Frozen(true);
    addNotification({ forPersona: 'pm', type: 'rp-v11-frozen', title: 'RP v1.1 disponível', body: `Marina endereçou ${Object.keys(v11Changes).length} gap(s). Veja o diff.`, demandId: 'DEM-2026-001', icon: 'layers' });
    showToast('RP v1.1 congelado — PM notificado');
  };

  if (v11Frozen) {
    return (
      <div className="max-w-2xl mx-auto pt-16">
        <div className="border rounded-lg p-12 text-center" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${COLORS.success}20` }}>
            <Check size={32} style={{ color: COLORS.success }} />
          </div>
          <div className="text-xl font-semibold mb-2" style={{ color: COLORS.textPrimary }}>RP-2026-001 v1.1 congelado</div>
          <div className="text-sm mb-6 max-w-md mx-auto" style={{ color: COLORS.textSecondary }}>
            PM Juliana foi notificada. Os {Object.keys(v11Changes).length} {Object.keys(v11Changes).length === 1 ? 'gap endereçado vai' : 'gaps endereçados vão'} aparecer como diff sobre a v1.0.
          </div>
          <Button variant="secondary" onClick={() => navigate('dashboard')}>Voltar ao Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      <button onClick={() => navigate('dashboard')} className="flex items-center gap-1 text-sm mb-4 hover:opacity-70" style={{ color: COLORS.textSecondary }}>
        <ChevronLeft size={14} /> Dashboard
      </button>
      <div className="flex items-center gap-3 mb-2">
        <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: COLORS.bgSubtle, color: COLORS.textSecondary }}>DEM-2026-001</span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: `${COLORS.warning}15`, color: COLORS.warning }}>Devolvido pelo PM · v1.0 → v1.1</span>
        <button onClick={() => navigate('timeline')} className="ml-auto text-xs flex items-center gap-1 px-2 py-1 rounded hover:bg-stone-100" style={{ color: COLORS.textSecondary }}>
          <Clock size={12} /> Histórico
        </button>
      </div>
      <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.textPrimary }}>{demandTitle}</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.textSecondary }}>PM apontou {returnedGaps.length} gap{returnedGaps.length !== 1 ? 's' : ''} bloqueante{returnedGaps.length !== 1 ? 's' : ''}. Enderece cada um pra liberar a v1.1.</p>

      <div className="border rounded-lg p-5 mb-6 flex items-center gap-6" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <ScoreRing score={Math.round((Object.keys(v11Changes).length / Math.max(returnedGaps.length, 1)) * 100)} size={64} strokeWidth={6} />
        <div className="flex-1">
          <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>v1.1 em construção</div>
          <div className="text-base font-semibold" style={{ color: COLORS.textPrimary }}>{Object.keys(v11Changes).length} de {returnedGaps.length} gaps endereçados</div>
        </div>
      </div>

      <div className="space-y-3 mb-24">
        {returnedGaps.map(gap => {
          const addressed = v11Changes[gap.id];
          return (
            <div key={gap.id} onClick={() => setSelectedGap(gap)} className="border rounded-lg p-4 cursor-pointer hover:shadow-sm transition-all" style={{ backgroundColor: addressed ? `${COLORS.success}05` : COLORS.bgElevated, borderColor: addressed ? `${COLORS.success}40` : COLORS.border }}>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0">{addressed ? <CheckCircle2 size={18} style={{ color: COLORS.success }} /> : <AlertTriangle size={18} style={{ color: COLORS.danger }} />}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ backgroundColor: `${COLORS.danger}15`, color: COLORS.danger }}>Gap bloqueante</span>
                    <span className="text-xs" style={{ color: COLORS.textMuted }}>seção: {gap.sectionId}</span>
                    <span className="text-xs" style={{ color: COLORS.textMuted }}>· por {gap.author.split(' ')[0]}</span>
                  </div>
                  <div className="text-xs italic mb-2 p-2 rounded" style={{ backgroundColor: COLORS.bgSubtle, color: COLORS.textSecondary }}>"{gap.trecho.slice(0, 120)}{gap.trecho.length > 120 ? '...' : ''}"</div>
                  <div className="text-sm mb-2" style={{ color: COLORS.textPrimary }}>{gap.text}</div>
                  {addressed && (
                    <div className="border-l-2 pl-3 mt-2" style={{ borderColor: COLORS.success }}>
                      <div className="text-xs font-semibold mb-1" style={{ color: COLORS.success }}>Endereçado:</div>
                      <div className="text-sm" style={{ color: COLORS.textPrimary }}>{addressed.after}</div>
                    </div>
                  )}
                </div>
                <ChevronRight size={14} style={{ color: COLORS.textMuted }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-4 left-64 right-4 max-w-5xl mx-auto border rounded-lg p-4 flex items-center justify-between shadow-md" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="text-xs" style={{ color: COLORS.textMuted }}>{allAddressed ? 'Todos os gaps endereçados — pronto para v1.1' : `Faltam ${returnedGaps.length - Object.keys(v11Changes).length} gap(s)`}</div>
        <Button size="sm" icon={Layers} disabled={!allAddressed} onClick={freezeV11}>Congelar v1.1</Button>
      </div>

      {selectedGap && (
        <AddressGapModal gap={selectedGap} existing={v11Changes[selectedGap.id]} onClose={() => setSelectedGap(null)} onSubmit={(newText) => addressGap(selectedGap, newText)} />
      )}
    </div>
  );
}

function AddressGapModal({ gap, existing, onClose, onSubmit }) {
  const [text, setText] = useState(existing?.after || '');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-2xl rounded-xl shadow-2xl border" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: COLORS.border }}>
          <div className="font-semibold text-base" style={{ color: COLORS.textPrimary }}>Endereçar gap</div>
          <div className="text-xs mt-0.5" style={{ color: COLORS.textMuted }}>Seção: {gap.sectionId} · por {gap.author}</div>
        </div>
        <div className="p-6">
          <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>Trecho original (v1.0)</div>
          <div className="border rounded-md p-3 mb-4 text-sm" style={{ borderColor: COLORS.border, backgroundColor: '#FEF2F2' }}>
            <div className="text-xs font-mono mb-1" style={{ color: COLORS.danger }}>− removido</div>
            <div style={{ color: COLORS.textPrimary, textDecoration: 'line-through', opacity: 0.7 }}>{gap.trecho}</div>
          </div>
          <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>Gap apontado</div>
          <div className="text-sm mb-4 p-3 rounded-md" style={{ backgroundColor: `${COLORS.warning}10`, color: COLORS.textPrimary }}>{gap.text}</div>
          <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>Nova versão para v1.1</div>
          <div className="border rounded-md p-3" style={{ borderColor: `${COLORS.success}40`, backgroundColor: `${COLORS.success}05` }}>
            <div className="text-xs font-mono mb-1" style={{ color: COLORS.success }}>+ adicionado</div>
            <textarea value={text} onChange={e => setText(e.target.value)} rows={4} placeholder="Escreva o trecho corrigido que vai entrar na v1.1..." className="w-full p-2 text-sm rounded border focus:outline-none resize-none bg-transparent" style={{ borderColor: COLORS.border, color: COLORS.textPrimary }} />
          </div>
        </div>
        <div className="px-6 py-4 border-t flex justify-end gap-2" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button disabled={!text.trim()} onClick={() => onSubmit(text)}>{existing ? 'Atualizar' : 'Endereçar gap'}</Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SCREEN: SHOWCASE RP — WOW (RP-2026-000 com TraceBadge + AIImpactBanner)
// ============================================================
function ShowcaseRPScreen() {
  const { navigate, persona } = useApp();
  const rp = SHOWCASE_RP;
  const [activeSection, setActiveSection] = useState('sumario');

  // Provenance key map: maps section.id → show-{id} (with fallback)
  const provKeyFor = (sectionId) => {
    const keyMap = {
      sumario: 'show-contexto',
      contexto: 'show-contexto',
      objetivos: 'show-objetivos',
      escopo: 'show-escopo',
      adrs: 'show-adrs',
      rollout: 'show-rollout',
      estimativa: 'show-estimativa',
    };
    return keyMap[sectionId] || null;
  };

  return (
    <div className="max-w-[1400px]">
      <button onClick={() => navigate('dashboard')} className="flex items-center gap-1 text-sm mb-4 hover:opacity-70" style={{ color: COLORS.textSecondary }}>
        <ChevronLeft size={14} /> Dashboard
      </button>

      <div className="mb-4 p-3 rounded-md border flex items-center gap-2 text-sm" style={{ borderColor: '#FCD34D', backgroundColor: '#FFFBEB' }}>
        <Sparkles size={14} style={{ color: '#92400E' }} />
        <span style={{ color: '#78350F' }}>
          <strong>Case real:</strong> este é um RP já concluído, congelado e em execução — veja como fica um Readiness Package final, com cada decisão rastreada à fonte.
        </span>
      </div>

      <div className="flex items-center gap-3 mb-2">
        <Layers size={16} style={{ color: persona.color }} />
        <span className="font-semibold text-base" style={{ color: COLORS.textPrimary }}>{rp.id} {rp.version}</span>
        <StatusPill status="RP Congelado" />
        <span className="text-xs" style={{ color: COLORS.textMuted }}>· congelado {rp.frozenAt}</span>
      </div>
      <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.textPrimary }}>{rp.title}</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.textSecondary }}>
        Originador: {rp.submitter} · PO: {rp.po} · CTO: {rp.cto} · PM: {rp.pm}
      </p>

      {/* WOW: AI Impact Banner com hoursSaved=31 */}
      <div className="border rounded-lg p-5 mb-6" style={{ background: `linear-gradient(135deg, ${COLORS.ai}10, ${COLORS.info}08)`, borderColor: `${COLORS.ai}40` }}>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} style={{ color: COLORS.ai }} />
          <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.ai }}>
            Impacto da plataforma neste RP
          </div>
        </div>
        <div className="grid grid-cols-5 gap-4">
          <div>
            <div className="text-3xl font-bold" style={{ color: COLORS.ai }}>{rp.aiImpact.hoursSaved}h</div>
            <div className="text-xs" style={{ color: COLORS.textSecondary }}>economizadas vs. processo manual</div>
          </div>
          <div>
            <div className="text-3xl font-bold" style={{ color: COLORS.info }}>{rp.aiImpact.automatedPct}%</div>
            <div className="text-xs" style={{ color: COLORS.textSecondary }}>das pendências auto-respondidas</div>
          </div>
          <div>
            <div className="text-3xl font-bold" style={{ color: COLORS.success }}>{rp.aiImpact.discoveries}</div>
            <div className="text-xs" style={{ color: COLORS.textSecondary }}>discoveries executadas</div>
          </div>
          <div>
            <div className="text-3xl font-bold" style={{ color: COLORS.ai }}>{rp.aiImpact.adrsReusedFromKB}</div>
            <div className="text-xs" style={{ color: COLORS.textSecondary }}>ADRs reaproveitadas da KB</div>
          </div>
          <div>
            <div className="text-3xl font-bold" style={{ color: COLORS.warning }}>{rp.aiImpact.similarDemandsFound}</div>
            <div className="text-xs" style={{ color: COLORS.textSecondary }}>demandas similares encontradas</div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t text-xs" style={{ borderColor: `${COLORS.ai}30`, color: COLORS.textSecondary }}>
          <strong style={{ color: COLORS.textPrimary }}>Defensibilidade:</strong> cada seção abaixo tem rastro até áudio, anexo ou discovery original. Clique em <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs" style={{ backgroundColor: `${COLORS.ai}15`, color: COLORS.ai }}><Sparkles size={9} /> origem</span> para ver.
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3 mb-6">
        <div className="border rounded-lg p-3" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
          <div className="text-xs uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>Score</div>
          <div className="text-xl font-bold" style={{ color: COLORS.success }}>{rp.scoreGeral}%</div>
        </div>
        <div className="border rounded-lg p-3" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
          <div className="text-xs uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>Confiança</div>
          <div className="text-xl font-bold" style={{ color: COLORS.info }}>{rp.confidence}%</div>
        </div>
        <div className="border rounded-lg p-3" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
          <div className="text-xs uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>ADRs</div>
          <div className="text-xl font-bold" style={{ color: COLORS.ai }}>{rp.adrs.length}</div>
        </div>
        <div className="border rounded-lg p-3" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
          <div className="text-xs uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>Estimativa</div>
          <div className="text-xl font-bold" style={{ color: COLORS.textPrimary }}>{rp.estimateDays}d</div>
        </div>
        <div className="border rounded-lg p-3" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
          <div className="text-xs uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>Comentários</div>
          <div className="text-xl font-bold" style={{ color: COLORS.warning }}>{rp.comments.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3">
          <div className="border rounded-lg overflow-hidden sticky top-20" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
            <div className="px-3 py-2 border-b text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.textMuted, borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>Índice</div>
            <div className="p-1 max-h-[600px] overflow-y-auto">
              {rp.sections.map(s => (
                <button key={s.id} onClick={() => { setActiveSection(s.id); document.getElementById(`rp-sec-${s.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} className="w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between hover:bg-stone-50" style={{ backgroundColor: activeSection === s.id ? COLORS.bgSubtle : 'transparent', color: activeSection === s.id ? COLORS.textPrimary : COLORS.textSecondary }}>
                  <span className={activeSection === s.id ? 'font-semibold' : ''}>{s.title}</span>
                  <span className="text-xs font-mono" style={{ color: s.confidence >= 90 ? COLORS.success : s.confidence >= 70 ? COLORS.warning : COLORS.danger }}>{s.confidence}%</span>
                </button>
              ))}
            </div>
            <div className="px-3 py-3 border-t" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>Stakeholders</div>
              <div className="space-y-1 text-xs" style={{ color: COLORS.textSecondary }}>
                {rp.stakeholders.map((s, i) => <div key={i}>· {s}</div>)}
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-6">
          <div className="border rounded-lg" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
            <div className="p-8 space-y-8">
              {rp.sections.map(s => {
                const color = s.confidence >= 90 ? COLORS.success : s.confidence >= 70 ? COLORS.warning : COLORS.danger;
                const isAdrs = s.content === 'adrs';
                const provKey = provKeyFor(s.id);
                return (
                  <section key={s.id} id={`rp-sec-${s.id}`} className="scroll-mt-24">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b" style={{ borderColor: COLORS.border }}>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold" style={{ color: COLORS.textPrimary }}>{s.title}</h3>
                        {provKey && <TraceBadge provenanceKey={provKey} compact />}
                      </div>
                      <span className="text-xs font-medium" style={{ color }}>Confiança {s.confidence}%</span>
                    </div>
                    {isAdrs ? (
                      <div className="space-y-3">
                        {rp.adrs.map(adr => (
                          <div key={adr.id} className="p-4 rounded-md border" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
                            <div className="font-semibold text-sm mb-2" style={{ color: COLORS.textPrimary }}>{adr.id} — {adr.title}</div>
                            <div className="space-y-1.5 text-xs">
                              <div><span className="font-semibold" style={{ color: COLORS.textMuted }}>Contexto:</span> <span style={{ color: COLORS.textSecondary }}>{adr.context}</span></div>
                              <div><span className="font-semibold" style={{ color: COLORS.textMuted }}>Decisão:</span> <span style={{ color: COLORS.textPrimary }}>{adr.decision}</span></div>
                              <div><span className="font-semibold" style={{ color: COLORS.textMuted }}>Alternativas:</span> <span style={{ color: COLORS.textSecondary }}>{adr.alternatives}</span></div>
                              <div><span className="font-semibold" style={{ color: COLORS.textMuted }}>Consequências:</span> <span style={{ color: COLORS.textSecondary }}>{adr.consequences}</span></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed" style={{ color: COLORS.textSecondary }}>{s.content}</p>
                    )}
                  </section>
                );
              })}
            </div>
          </div>
        </div>

        <div className="col-span-3 space-y-4">
          <div className="border rounded-lg overflow-hidden" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
            <div className="px-3 py-2 border-b text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.textMuted, borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>Comentários ({rp.comments.length})</div>
            <div className="p-3 space-y-3 max-h-[400px] overflow-y-auto">
              {rp.comments.map(c => (
                <div key={c.id} className="border rounded-md p-2.5" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0" style={{ backgroundColor: c.authorColor }}>
                      {c.author.split(' ').map(p => p[0]).join('').slice(0, 2)}
                    </div>
                    <span className="text-xs font-semibold" style={{ color: COLORS.textPrimary }}>{c.author.split(' ')[0]}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: c.type === 'question' ? `${COLORS.info}15` : `${COLORS.textSecondary}15`, color: c.type === 'question' ? COLORS.info : COLORS.textSecondary }}>
                      {c.type === 'question' ? 'Pergunta' : 'Coment.'}
                    </span>
                    {c.resolved && <CheckCircle2 size={11} style={{ color: COLORS.success }} />}
                  </div>
                  <div className="text-xs mb-1.5" style={{ color: COLORS.textPrimary }}>{c.text}</div>
                  {c.response && (
                    <div className="text-xs italic pl-2 border-l-2 mt-1" style={{ color: COLORS.textSecondary, borderColor: COLORS.success }}>
                      Marina: {c.response}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
            <div className="px-3 py-2 border-b text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.textMuted, borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>Histórico</div>
            <div className="p-3 space-y-2 max-h-[300px] overflow-y-auto">
              {rp.timeline.slice().reverse().map((ev, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: i === 0 ? COLORS.success : COLORS.textMuted }} />
                  <div className="flex-1 min-w-0">
                    <div style={{ color: COLORS.textPrimary }}>{ev.event}</div>
                    <div style={{ color: COLORS.textMuted }}>{ev.by} · {ev.when}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SCREEN: ADR LIBRARY (CTO)
// ============================================================
function ADRLibraryScreen() {
  const { navigate, adrs } = useApp();
  const [selected, setSelected] = useState(null);
  const allAdrs = [
    ...adrs.map(a => ({ ...a, demand: 'DEM-2026-001', date: 'agora' })),
    { id: 'ADR-099', title: 'JWT com refresh assimétrico', demand: 'DEM-2025-095', date: 'há 12 dias', decision: 'Usar RS256 com chave pública distribuída via JWKS.', context: 'Migração de auth precisa escalar para múltiplos serviços.', alternatives: 'HS256 (rejeitado: segredo compartilhado).', consequences: 'Rotação de chave mais complexa, mas maior segurança.' },
    { id: 'ADR-098', title: 'Cache distribuído via Redis Cluster', demand: 'DEM-2025-094', date: 'há 20 dias', decision: 'Adotar Redis Cluster ao invés de standalone.', context: 'Performance do dashboard exige cache distribuído com HA.', alternatives: 'Memcached (rejeitado: sem persistência).', consequences: 'Maior complexidade operacional, mas escala horizontal.' },
    { id: 'ADR-095', title: 'Throttling por usuário em 50 eventos/min', demand: 'DEM-2026-000', date: 'há 4 dias', decision: 'Rate limiter no gateway WS.', context: 'Evitar abuso ou bug do publisher inundando cliente.', alternatives: 'Sem limite (rejeitado: risco operacional).', consequences: 'Eventos excedentes são perdidos mas logados.' },
    { id: 'ADR-094', title: 'Fallback automático para polling', demand: 'DEM-2026-000', date: 'há 4 dias', decision: 'Cliente detecta falha de upgrade e cai em long-polling.', context: 'Firewalls corporativos bloqueiam WS.', alternatives: 'Forçar WS (rejeitado: viola SLA enterprise).', consequences: 'UX preservada. Latência maior em fallback.' },
    { id: 'ADR-067', title: 'Event sourcing para auditoria PIX', demand: 'DEM-2025-067', date: 'há 60 dias', decision: 'Append-only log com replay.', context: 'Auditoria de cobrança PIX exige rastro imutável.', alternatives: 'CRUD com soft-delete (rejeitado: violação de imutabilidade).', consequences: 'Storage maior, mas compliance pleno.' },
  ];

  return (
    <div className="max-w-5xl">
      <button onClick={() => navigate('dashboard')} className="flex items-center gap-1 text-sm mb-4 hover:opacity-70" style={{ color: COLORS.textSecondary }}>
        <ChevronLeft size={14} /> Dashboard
      </button>
      <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.textPrimary }}>Biblioteca de ADRs</h1>
      <p className="text-sm mb-4" style={{ color: COLORS.textSecondary }}>Todas as decisões arquiteturais registradas pela engenharia. <strong>Reuso médio:</strong> 63% — economiza ~4h de pesquisa por nova demanda.</p>
      <div className="mb-6 p-3 rounded-lg border flex items-center gap-3" style={{ borderColor: `${COLORS.ai}30`, backgroundColor: `${COLORS.ai}08` }}>
        <Sparkles size={16} style={{ color: COLORS.ai }} />
        <div className="text-xs" style={{ color: COLORS.textSecondary }}>
          <strong style={{ color: COLORS.ai }}>{allAdrs.length} ADRs registradas</strong> · A IA sugere automaticamente as mais relevantes durante a avaliação técnica de cada nova demanda.
        </div>
      </div>
      <div className="space-y-2">
        {allAdrs.map(adr => (
          <div key={adr.id} onClick={() => setSelected(adr)} className="border rounded-lg p-4 cursor-pointer hover:shadow-sm transition-all" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: '#F5F3FF', color: '#6D28D9' }}>{adr.id}</span>
                  <span className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>{adr.title}</span>
                </div>
                <div className="flex items-center gap-3 text-xs mb-2" style={{ color: COLORS.textMuted }}>
                  <span>{adr.demand}</span><span>·</span><span>{adr.date}</span>
                </div>
                <div className="text-sm overflow-hidden" style={{ color: COLORS.textSecondary, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{adr.decision}</div>
              </div>
              <ChevronRight size={16} className="flex-shrink-0 mt-1" style={{ color: COLORS.textMuted }} />
            </div>
          </div>
        ))}
      </div>
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setSelected(null)}>
          <div onClick={e => e.stopPropagation()} className="w-full max-w-2xl rounded-xl shadow-2xl border max-h-[90vh] overflow-y-auto" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
            <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: COLORS.border }}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: '#F5F3FF', color: '#6D28D9' }}>{selected.id}</span>
                  <span className="text-xs" style={{ color: COLORS.textMuted }}>{selected.demand} · {selected.date}</span>
                </div>
                <div className="font-semibold text-base" style={{ color: COLORS.textPrimary }}>{selected.title}</div>
              </div>
              <button onClick={() => setSelected(null)} className="p-1 hover:bg-stone-100 rounded"><X size={18} style={{ color: COLORS.textMuted }} /></button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              {selected.context && (<div><div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>Contexto</div><div style={{ color: COLORS.textPrimary }}>{selected.context}</div></div>)}
              <div><div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>Decisão</div><div style={{ color: COLORS.textPrimary }}>{selected.decision}</div></div>
              {selected.alternatives && (<div><div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>Alternativas</div><div style={{ color: COLORS.textPrimary }}>{selected.alternatives}</div></div>)}
              {selected.consequences && (<div><div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>Consequências</div><div style={{ color: COLORS.textPrimary }}>{selected.consequences}</div></div>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// SCREEN: MY DEMANDS (Submitter)
// ============================================================
function MyDemandsScreen() {
  const { navigate, demandTitle, demandState, captureScore } = useApp();
  const allMine = [
    { id: 'DEM-2026-001', title: demandTitle, state: demandState, score: captureScore, updated: 'há 1 dia', isMain: true },
    ...OTHER_DEMANDS.map(d => ({ ...d, isMain: false })),
  ];
  return (
    <div className="max-w-5xl">
      <button onClick={() => navigate('dashboard')} className="flex items-center gap-1 text-sm mb-4 hover:opacity-70" style={{ color: COLORS.textSecondary }}>
        <ChevronLeft size={14} /> Dashboard
      </button>
      <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.textPrimary }}>Minhas Demandas</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.textSecondary }}>Todas as demandas que você criou.</p>
      <div className="space-y-2">
        {allMine.map(d => (
          <div key={d.id} onClick={() => d.isMain && navigate('captureQueue')} className={`border rounded-lg p-4 ${d.isMain ? 'cursor-pointer hover:shadow-sm' : ''} transition-all`} style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <FileText size={14} style={{ color: COLORS.textMuted }} />
                  <span className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>{d.title}</span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: COLORS.bgSubtle, color: COLORS.textSecondary }}>{d.id}</span>
                </div>
                <div className="flex items-center gap-3 text-xs mb-2">
                  <StatusPill status={d.state} />
                  {d.score !== undefined && <span style={{ color: COLORS.textMuted }}>Score: {d.score}%</span>}
                  <span style={{ color: COLORS.textMuted }}>{d.updated}</span>
                </div>
                {d.preview && <div className="text-sm" style={{ color: COLORS.textSecondary }}>"{d.preview}"</div>}
              </div>
              {d.isMain && <ChevronRight size={16} style={{ color: COLORS.textMuted }} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// SCREEN: TIMELINE (eventos derivados condicionalmente)
// ============================================================
function TimelineScreen() {
  const { navigate, demandTitle, demandState, captureScore, rpVersion, discoveryResults } = useApp();
  const events = [];
  events.push({ icon: Plus, color: COLORS.info, title: 'Captura criada', by: 'Carlos Silva (COO)', when: 'há 6 dias', desc: 'Demanda registrada com texto livre + PDF de estratégia.' });
  if (captureScore === 100 || ['Em Triagem', 'Em Racionalização', 'Em Avaliação Técnica', 'RP Congelado'].includes(demandState)) {
    events.push({ icon: CheckCircle2, color: COLORS.info, title: 'Captura concluída (Score 100%)', by: 'Carlos Silva', when: 'há 6 dias', desc: '8 pendências respondidas, 1 áudio, 1 PDF.' });
  }
  if (['Em Racionalização', 'Em Avaliação Técnica', 'RP Congelado'].includes(demandState)) {
    events.push({ icon: CheckCircle2, color: '#F97316', title: 'Triagem — Product Ready', by: 'Marina Costa (PO)', when: 'há 5 dias', desc: 'Demanda real, alinhada com roadmap.' });
  }
  if (['Em Avaliação Técnica', 'RP Congelado'].includes(demandState)) {
    const dCount = Object.keys(discoveryResults).length;
    events.push({ icon: CheckCircle2, color: '#8B5CF6', title: 'Racionalização concluída', by: 'Marina Costa', when: 'há 3 dias', desc: `12 pendências resolvidas${dCount > 0 ? `, ${dCount} discovery${dCount > 1 ? 's' : ''}` : ''}.` });
    events.push({ icon: CheckCircle2, color: '#7C3AED', title: 'Avaliação técnica concluída', by: 'Rafael Lima (CTO)', when: 'há 1 dia', desc: '4 ADRs criadas, 5 riscos, 34 dias.' });
  }
  if (rpVersion) {
    events.push({ icon: Layers, color: COLORS.success, title: `RP ${rpVersion} congelado`, by: 'Marina Costa (PO)', when: 'agora', desc: '5 stakeholders notificados. PM Juliana pode avaliar.', isCurrent: true });
  }
  return (
    <div className="max-w-3xl">
      <button onClick={() => navigate('dashboard')} className="flex items-center gap-1 text-sm mb-4 hover:opacity-70" style={{ color: COLORS.textSecondary }}>
        <ChevronLeft size={14} /> Voltar
      </button>
      <div className="flex items-center gap-3 mb-2">
        <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: COLORS.bgSubtle, color: COLORS.textSecondary }}>DEM-2026-001</span>
        <StatusPill status={demandState} />
      </div>
      <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.textPrimary }}>Histórico</h1>
      <p className="text-sm mb-8" style={{ color: COLORS.textSecondary }}>{demandTitle}</p>
      <div className="relative">
        <div className="absolute left-[15px] top-2 bottom-2 w-0.5" style={{ backgroundColor: COLORS.border }} />
        {events.slice().reverse().map((event, i) => {
          const Icon = event.icon;
          return (
            <div key={i} className="relative pl-12 pb-6 last:pb-0">
              <div className="absolute left-0 w-8 h-8 rounded-full border-4 flex items-center justify-center" style={{ backgroundColor: COLORS.bgElevated, borderColor: event.color, boxShadow: event.isCurrent ? `0 0 0 4px ${event.color}30` : 'none' }}>
                <Icon size={14} style={{ color: event.color }} />
              </div>
              <div className="border rounded-lg p-4" style={{ backgroundColor: COLORS.bgElevated, borderColor: event.isCurrent ? event.color : COLORS.border }}>
                <div className="flex items-center justify-between mb-1">
                  <div className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>{event.title}</div>
                  <div className="text-xs" style={{ color: COLORS.textMuted }}>{event.when}</div>
                </div>
                <div className="text-xs mb-2" style={{ color: COLORS.textMuted }}>por {event.by}</div>
                <div className="text-sm" style={{ color: COLORS.textSecondary }}>{event.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
      {events.length === 1 && (
        <div className="mt-4 p-4 rounded-lg border" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
          <div className="text-sm" style={{ color: COLORS.textSecondary }}>💡 <strong>Dica:</strong> avance no fluxo e veja a timeline crescer.</div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// SCREEN: NOTIFICATIONS
// ============================================================
function NotificationsScreen() {
  const { navigate, notifications, setNotifications, persona } = useApp();
  const mine = notifications.filter(n => n.forPersona === persona?.id);
  const unread = mine.filter(n => !n.read);
  const read = mine.filter(n => n.read);
  const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setNotifications(prev => prev.map(n => n.forPersona === persona?.id ? { ...n, read: true } : n));
  const goToNotif = (n) => {
    markRead(n.id);
    if (persona?.id === 'submitter') navigate('myDemands');
    else if (persona?.id === 'po') navigate('dashboard');
    else if (persona?.id === 'cto') navigate('dashboard');
    else if (persona?.id === 'pm' || persona?.id === 'viewer') navigate('rpView');
  };
  const formatTime = (ts) => {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'agora';
    if (mins < 60) return `há ${mins}min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `há ${hours}h`;
    return `há ${Math.floor(hours / 24)}d`;
  };
  const iconFor = (type) => ({ inbox: Inbox, check: CheckCircle2, alert: AlertTriangle, layers: Layers, message: MessageSquare })[type] || Bell;

  return (
    <div className="max-w-3xl">
      <button onClick={() => navigate('dashboard')} className="flex items-center gap-1 text-sm mb-4 hover:opacity-70" style={{ color: COLORS.textSecondary }}>
        <ChevronLeft size={14} /> Dashboard
      </button>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: COLORS.textPrimary }}>Notificações</h1>
          <p className="text-sm mt-1" style={{ color: COLORS.textSecondary }}>{unread.length > 0 ? `${unread.length} não lida${unread.length !== 1 ? 's' : ''}` : 'Tudo em dia'}</p>
        </div>
        {unread.length > 0 && <Button variant="secondary" size="sm" onClick={markAllRead}>Marcar todas como lidas</Button>}
      </div>
      {mine.length === 0 ? (
        <div className="border rounded-lg p-12 text-center" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border, borderStyle: 'dashed' }}>
          <Bell size={32} className="mx-auto mb-3" style={{ color: COLORS.textMuted }} />
          <div className="font-semibold mb-1" style={{ color: COLORS.textPrimary }}>Sem notificações ainda</div>
          <div className="text-sm" style={{ color: COLORS.textSecondary }}>Avance no fluxo e você receberá notificações relevantes.</div>
        </div>
      ) : (
        <div className="space-y-2">
          {unread.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>Não lidas · {unread.length}</h2>
              <div className="space-y-2">
                {unread.map(n => {
                  const Icon = iconFor(n.icon);
                  return (
                    <div key={n.id} onClick={() => goToNotif(n)} className="border rounded-lg p-4 cursor-pointer hover:shadow-sm transition-all relative" style={{ backgroundColor: COLORS.bgElevated, borderColor: persona?.color, borderLeftWidth: '3px' }}>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${persona?.color}15`, color: persona?.color }}>
                          <Icon size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>{n.title}</div>
                            <div className="text-xs flex-shrink-0" style={{ color: COLORS.textMuted }}>{formatTime(n.timestamp)}</div>
                          </div>
                          <div className="text-sm mt-1" style={{ color: COLORS.textSecondary }}>{n.body}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
          {read.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>Lidas · {read.length}</h2>
              <div className="space-y-2 opacity-60">
                {read.map(n => {
                  const Icon = iconFor(n.icon);
                  return (
                    <div key={n.id} onClick={() => goToNotif(n)} className="border rounded-lg p-4 cursor-pointer hover:shadow-sm transition-all" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: COLORS.bgSubtle, color: COLORS.textMuted }}><Icon size={14} /></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="font-medium text-sm" style={{ color: COLORS.textPrimary }}>{n.title}</div>
                            <div className="text-xs flex-shrink-0" style={{ color: COLORS.textMuted }}>{formatTime(n.timestamp)}</div>
                          </div>
                          <div className="text-sm mt-1" style={{ color: COLORS.textSecondary }}>{n.body}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// SCREEN: COLLECT INBOX (Submitter responde coletas do PO)
// ============================================================
function CollectInboxScreen() {
  const { navigate, pendingCollects, setPendingCollects, showToast, addNotification } = useApp();
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState({});
  const pending = pendingCollects.filter(c => c.status === 'pending');
  const answered = pendingCollects.filter(c => c.status === 'answered');

  const submitAnswers = () => {
    if (!selected) return;
    const allAnswered = selected.questions.every((_, i) => answers[i]?.trim());
    if (!allAnswered) { showToast('Responda todas as perguntas', 'warning'); return; }
    setPendingCollects(prev => prev.map(c => c.id === selected.id ? { ...c, status: 'answered', answers: selected.questions.map((q, i) => ({ q, a: answers[i] })) } : c));
    addNotification({ forPersona: 'po', type: 'collect-answered', title: 'Coleta respondida', body: `Carlos respondeu ${selected.questions.length} perguntas sobre "${selected.demandTitle}"`, demandId: selected.demandId, icon: 'message' });
    showToast('Respostas enviadas à PO');
    setSelected(null); setAnswers({});
  };

  return (
    <div className="max-w-3xl">
      <button onClick={() => navigate('dashboard')} className="flex items-center gap-1 text-sm mb-4 hover:opacity-70" style={{ color: COLORS.textSecondary }}>
        <ChevronLeft size={14} /> Dashboard
      </button>
      <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.textPrimary }}>Coletas pendentes</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.textSecondary }}>Perguntas que o PO precisa que você responda para destravar sua demanda.</p>
      {pending.length === 0 && answered.length === 0 ? (
        <div className="border rounded-lg p-12 text-center" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border, borderStyle: 'dashed' }}>
          <MessageSquare size={32} className="mx-auto mb-3" style={{ color: COLORS.textMuted }} />
          <div className="font-semibold mb-1" style={{ color: COLORS.textPrimary }}>Nenhuma coleta pendente</div>
          <div className="text-sm" style={{ color: COLORS.textSecondary }}>Quando o PO precisar de mais info, aparecerá aqui.</div>
        </div>
      ) : (
        <>
          {pending.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.danger }}>Aguardando você · {pending.length}</h2>
              <div className="space-y-2">
                {pending.map(c => (
                  <div key={c.id} onClick={() => setSelected(c)} className="border rounded-lg p-4 cursor-pointer hover:shadow-sm transition-all" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border, borderLeftWidth: '3px', borderLeftColor: COLORS.danger }}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <MessageSquare size={14} style={{ color: COLORS.danger }} />
                          <span className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>{c.demandTitle}</span>
                        </div>
                        <div className="text-xs mb-2" style={{ color: COLORS.textMuted }}>De: {c.askedBy} · contexto: {c.pendencyContext}</div>
                        <div className="text-sm" style={{ color: COLORS.textSecondary }}>{c.questions.length} pergunta{c.questions.length !== 1 ? 's' : ''} estruturada{c.questions.length !== 1 ? 's' : ''}</div>
                      </div>
                      <Button size="sm" icon={ArrowRight}>Responder</Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
          {answered.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.success }}>Respondidas · {answered.length}</h2>
              <div className="space-y-2 opacity-70">
                {answered.map(c => (
                  <div key={c.id} className="border rounded-lg p-4" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 size={14} style={{ color: COLORS.success }} />
                      <span className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>{c.demandTitle}</span>
                    </div>
                    <div className="text-xs" style={{ color: COLORS.textMuted }}>Respondida · {c.questions.length} pergunta{c.questions.length !== 1 ? 's' : ''}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setSelected(null)}>
          <div onClick={e => e.stopPropagation()} className="w-full max-w-2xl rounded-xl shadow-2xl border max-h-[90vh] overflow-y-auto" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
            <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: COLORS.border }}>
              <div>
                <div className="text-xs uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>Coleta</div>
                <div className="font-semibold text-base" style={{ color: COLORS.textPrimary }}>{selected.demandTitle}</div>
                <div className="text-xs mt-1" style={{ color: COLORS.textMuted }}>De: {selected.askedBy}</div>
              </div>
              <button onClick={() => setSelected(null)} className="p-1 hover:bg-stone-100 rounded"><X size={18} style={{ color: COLORS.textMuted }} /></button>
            </div>
            <div className="p-6 space-y-5">
              {selected.questions.map((q, i) => (
                <div key={i}>
                  <div className="text-sm font-medium mb-2" style={{ color: COLORS.textPrimary }}>
                    <span className="text-xs font-mono mr-2" style={{ color: COLORS.textMuted }}>{i + 1}.</span>{q}
                  </div>
                  <textarea value={answers[i] || ''} onChange={e => setAnswers({ ...answers, [i]: e.target.value })} rows={2} placeholder="Sua resposta..." className="w-full p-2.5 text-sm rounded-md border focus:outline-none resize-none" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg, color: COLORS.textPrimary }} />
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-2" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
              <Button variant="secondary" onClick={() => setSelected(null)}>Cancelar</Button>
              <Button onClick={submitAnswers}>Enviar respostas</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// SCREEN: GENERIC PLACEHOLDER
// ============================================================
function PlaceholderScreen({ title }) {
  const { navigate } = useApp();
  return (
    <div className="max-w-3xl">
      <button onClick={() => navigate('dashboard')} className="flex items-center gap-1 text-sm mb-4 hover:opacity-70" style={{ color: COLORS.textSecondary }}>
        <ChevronLeft size={14} /> Dashboard
      </button>
      <h1 className="text-2xl font-bold mb-2" style={{ color: COLORS.textPrimary }}>{title}</h1>
      <div className="border rounded-lg p-12 text-center mt-6" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border, borderStyle: 'dashed' }}>
        <Layers size={32} className="mx-auto mb-3" style={{ color: COLORS.textMuted }} />
        <div className="font-semibold mb-1" style={{ color: COLORS.textPrimary }}>Tela em construção</div>
        <div className="text-sm" style={{ color: COLORS.textSecondary }}>Será implementada na próxima iteração.</div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP — Router + Layout + Animations
// ============================================================
function AppInner() {
  const { persona, route } = useApp();
  if (!persona || route.screen === 'login') return <LoginScreen />;

  // Normalize route keys: aceita camelCase E kebab-case
  const normalize = (k) => ({
    'new-demand': 'newDemand',
    'capture-queue': 'captureQueue',
    'capture-review': 'captureReview',
    'my-demands': 'myDemands',
    'collect-inbox': 'collectInbox',
    'triage-queue': 'triageQueue',
    'triage-detail': 'triageDetail',
    'rationalizations': 'rationalizationsList',
    'rp-freeze': 'rpFreeze',
    'tech-evaluation': 'techEval',
    'rp-view': 'rpView',
    'rp-revision': 'rpRevision',
    'showcase-rp': 'showcaseRP',
    'adrs': 'adrLibrary',
  })[k] || k;

  const screen = normalize(route.screen);

  const renderScreen = () => {
    switch (screen) {
      case 'dashboard': return <Dashboard />;
      case 'newDemand': return <NewDemandScreen />;
      case 'captureQueue': return <CaptureQueueScreen />;
      case 'captureReview': return <CaptureReviewScreen />;
      case 'myDemands': return <MyDemandsScreen />;
      case 'collectInbox': return <CollectInboxScreen />;
      case 'notifications': return <NotificationsScreen />;
      case 'triageQueue': return <TriageQueueScreen />;
      case 'triageDetail': return <TriageDetailScreen />;
      case 'rationalizationsList': return <RationalizationsListScreen />;
      case 'rationalization': return <RationalizationScreen />;
      case 'rpFreeze': return <RPFreezeScreen />;
      case 'techEval': return <TechEvaluationScreen />;
      case 'rpView': return <RPViewScreen />;
      case 'rpRevision': return <RPRevisionScreen />;
      case 'showcaseRP': return <ShowcaseRPScreen />;
      case 'adrLibrary': return <ADRLibraryScreen />;
      case 'timeline': return <TimelineScreen />;
      case 'backlog': return <PlaceholderScreen title="Backlog" />;
      case 'archived': return <PlaceholderScreen title="Demandas Arquivadas" />;
      case 'techQueue': return <PlaceholderScreen title="Escalas Técnicas" />;
      case 'techActive': return <PlaceholderScreen title="Avaliações em Andamento" />;
      case 'kb': return <PlaceholderScreen title="Base de Conhecimento" />;
      case 'rpsPending': return <PlaceholderScreen title="RPs Aguardando" />;
      case 'rpsPublished': return <PlaceholderScreen title="RPs Publicados" />;
      case 'myComments': return <PlaceholderScreen title="Meus Comentários" />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: COLORS.bg }}>
      <TopBar />
      <div className="flex flex-1 pt-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">
          {renderScreen()}
        </main>
      </div>
      <Toast />
      <ChatPanel />
      <DrillDownModal />
      <ProvenanceModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <style>{`
        @keyframes slide-in { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slide-in-right { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes pulse-slow { 0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); } 50% { box-shadow: 0 0 0 6px rgba(59, 130, 246, 0); } }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes float-up { 0% { opacity: 0; transform: translateY(0); } 20% { opacity: 1; } 100% { opacity: 0; transform: translateY(-30px); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .animate-slide-in { animation: slide-in 0.25s ease-out; }
        .animate-slide-in-right { animation: slide-in-right 0.3s ease-out; }
        .animate-pulse-slow { animation: pulse-slow 2s infinite; }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.35s ease-out backwards; }
        .animate-float-up { animation: float-up 1.2s ease-out forwards; }
        .shimmer-bg { background: linear-gradient(90deg, #F5F5F4 0%, #FAFAF9 50%, #F5F5F4 100%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
        .stagger-1 { animation-delay: 0.05s; } .stagger-2 { animation-delay: 0.1s; }
        .stagger-3 { animation-delay: 0.15s; } .stagger-4 { animation-delay: 0.2s; } .stagger-5 { animation-delay: 0.25s; }
        .hover-lift { transition: transform 0.15s ease, box-shadow 0.15s ease; }
        .hover-lift:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
      `}</style>
      <AppInner />
    </AppProvider>
  );
}
