// DemandOS — Protótipo Funcional Completo
import React, { useState, useEffect, useRef, createContext, useContext, useMemo } from 'react';
import {
  Plus, FileText, Mic, Paperclip, X, Check, ChevronRight, ChevronDown,
  AlertCircle, AlertTriangle, CheckCircle2, Circle, MessageSquare, Bell,
  Home, Inbox, Archive, Settings, BookOpen, Layers, Send, Edit3,
  Sparkles, Search, ArrowRight, Clock, Users,
  LogOut, ChevronLeft, Loader2, Square, Play, Eye,
  TrendingUp, Activity, Target, Shield, DollarSign,
  GitBranch, AlertOctagon, Award, Timer, Briefcase
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
};

const PERSONAS = {
  submitter: { id: 'submitter', name: 'Carlos Silva', role: 'COO', label: 'Submitter', color: '#3B82F6', initials: 'CS', desc: 'Cria novas demandas e acompanha status' },
  po: { id: 'po', name: 'Marina Costa', role: 'PO', label: 'Product Owner', color: '#F97316', initials: 'MC', desc: 'Triagem, Racionalização, Readiness Package' },
  cto: { id: 'cto', name: 'Rafael Lima', role: 'CTO', label: 'CTO', color: '#8B5CF6', initials: 'RL', desc: 'Avaliação técnica, ADRs, decisões arq.' },
  pm: { id: 'pm', name: 'Juliana Reis', role: 'PM', label: 'Project Manager', color: '#10B981', initials: 'JR', desc: 'Recebe RP congelado, valida, aceita ou devolve' },
  viewer: { id: 'viewer', name: 'Ana Santos', role: 'CFO', label: 'Viewer', color: '#6B7280', initials: 'AS', desc: 'Lê RPs, faz perguntas, acompanha' },
};

// ============================================================
// INITIAL DATA
// ============================================================
const INITIAL_CAPTURE_PENDENCIES = [
  { id: 'cap-1', q: 'Qual problema essa demanda resolve?', a: 'A plataforma cobra clientes via boleto/transferência com processo manual de reconciliação. O modelo precisa migrar para cartão de crédito recorrente para reduzir esforço operacional e inadimplência.', confidence: 94, source: 'PDF estrategia-monetizacao.pdf', status: 'resolved' },
  { id: 'cap-2', q: 'Quem é o originador e em que contexto?', a: 'Carlos Silva, COO. Reunião de planejamento estratégico do Q2 2026.', confidence: 100, source: 'Submitter direto', status: 'resolved' },
  { id: 'cap-3', q: 'Quem é impactado?', a: 'Clientes pagantes ativos e time financeiro', confidence: 72, source: 'PDF estrategia-monetizacao.pdf, página 4', status: 'low_confidence', hint: 'A confiança ficou baixa porque o documento não citou explicitamente o time de CS, que pode ser impactado por suporte de cobrança.' },
  { id: 'cap-4', q: 'Qual a urgência e por quê?', a: '90 dias. Meta de operacionalizar até fim do trimestre para reduzir esforço manual de cobrança.', confidence: 92, source: 'PDF + texto Submitter', status: 'resolved' },
  { id: 'cap-5', q: 'Existe alguma restrição já conhecida? (prazo, regulatório, orçamento)', a: '', confidence: 0, source: '', status: 'empty' },
  { id: 'cap-6', q: 'Há expectativa de receita ou economia mensurável?', a: 'Redução de ~30h/mês em reconciliação', confidence: 68, source: 'PDF + estimativa', status: 'low_confidence', hint: 'A confiança ficou baixa porque o impacto em inadimplência foi mencionado mas não quantificado.' },
  { id: 'cap-7', q: 'Existe algum documento ou conversa anterior sobre isso?', a: 'PDF de estratégia anexado: estrategia-monetizacao.pdf', confidence: 100, source: 'Anexo', status: 'resolved' },
  { id: 'cap-8', q: 'Quem precisa estar a par desta demanda? (stakeholders)', a: '', confidence: 0, source: '', status: 'empty' },
];

const INITIAL_ATTACHMENTS = [{ id: 'att-1', name: 'estrategia-monetizacao.pdf', size: '2.3 MB', type: 'pdf' }];

const INITIAL_TRIAGE_ITEMS = [
  { id: 'tri-1', q: 'Demanda é real e tem evidência?', suggestion: 'Sim. PDF de estratégia do COO + meta declarada em comitê + economia operacional mensurável.', confidence: 92, decision: null, justification: '' },
  { id: 'tri-2', q: 'Alinhada com roadmap?', suggestion: 'Sim. Está no pilar "Eficiência Operacional" do roadmap Q2-Q3 2026.', confidence: 88, decision: null, justification: '' },
  { id: 'tri-3', q: 'Há incógnitas bloqueantes?', suggestion: 'Não bloqueantes. Há decisão técnica em aberto (qual gateway), mas é resolvível no Discovery.', confidence: 85, decision: null, justification: '' },
  { id: 'tri-4', q: 'Premissas a validar?', suggestion: 'Sim, 2 críticas: % de clientes que aceitam migrar; viabilidade de chargeback no parceiro.', confidence: 90, decision: null, justification: '' },
  { id: 'tri-5', q: 'Caminho da demanda', suggestion: 'Recomendação: Product Ready. Contexto é claro, incógnitas resolvíveis no Discovery do PO.', confidence: 87, decision: null, justification: '', isPath: true },
];

const INITIAL_RATIONALIZATION_PENDENCIES = [
  { id: 'rac-1', q: 'Definição clara do problema', section: 'Contexto', a: 'Cobrança por boleto gera ~30h/mês de reconciliação manual e inadimplência de 18%.', confidence: 90, status: 'low_confidence', hint: 'Falta quantificar impacto em NPS.' },
  { id: 'rac-2', q: 'Objetivos de negócio mensuráveis', section: 'Contexto', a: '', confidence: 0, status: 'empty' },
  { id: 'rac-3', q: 'Personas impactadas', section: 'Contexto', a: 'Clientes pagantes (B2B), time financeiro, CS, jurídico.', confidence: 75, status: 'low_confidence', hint: 'Não está claro se inclui clientes pessoa física do plano free.' },
  { id: 'rac-4', q: 'Premissas a validar', section: 'Contexto', a: 'Premissa: 40% dos clientes aceitam migração opt-in nos primeiros 6 meses.', confidence: 60, status: 'low_confidence', hint: 'O número 40% precisa ser validado com CS.' },
  { id: 'rac-5', q: 'Escopo: o que ENTRA na entrega', section: 'Escopo', a: '', confidence: 0, status: 'empty' },
  { id: 'rac-6', q: 'Escopo: o que NÃO entra', section: 'Escopo', a: '', confidence: 0, status: 'empty' },
  { id: 'rac-7', q: 'Regras de negócio', section: 'Regras', a: '', confidence: 0, status: 'empty' },
  { id: 'rac-8', q: 'Critérios de aceite', section: 'Validação', a: '', confidence: 0, status: 'empty' },
  { id: 'rac-9', q: 'Critérios de sucesso (métricas)', section: 'Validação', a: '', confidence: 0, status: 'empty' },
  { id: 'rac-10', q: 'Riscos de produto', section: 'Riscos', a: '', confidence: 0, status: 'empty' },
  { id: 'rac-11', q: 'Stakeholders e responsabilidades', section: 'Stakeholders', a: '', confidence: 0, status: 'empty' },
  { id: 'rac-12', q: 'Dependências externas', section: 'Dependências', a: '', confidence: 0, status: 'empty' },
];

const TRIAGE_QUEUE = [
  { id: 'DEM-2026-001', title: 'Gateway de Pagamento Recorrente', from: 'Carlos Silva (COO)', priority: 'Crítica', priorityColor: '#EF4444', arrived: 'há 3h', sla: '21h restantes', preview: 'Plataforma precisa receber pagamento por cartão recorrente...', isMain: true },
  { id: 'DEM-2026-002', title: 'Integração SAP enterprise', from: 'Carlos Silva (COO)', priority: 'Alta', priorityColor: '#F97316', arrived: 'há 1 dia', sla: '2 dias restantes', preview: 'Cliente Acme pediu integração com SAP' },
  { id: 'DEM-2026-003', title: 'Filtro de exportação no relatório', from: 'Maria Pereira (CS)', priority: 'Média', priorityColor: '#F59E0B', arrived: 'há 2 dias', sla: '5 dias restantes', preview: 'CS precisa filtrar relatório por data customizada' },
  { id: 'DEM-2026-004', title: 'Renomear campos no dashboard de vendas', from: 'João Reis (Sales)', priority: 'Baixa', priorityColor: '#6B7280', arrived: 'há 3 dias', sla: '7 dias restantes', preview: 'Os nomes atuais confundem o time comercial' },
];

const ACTIVE_RATIONALIZATIONS = [
  { id: 'DEM-2025-099', title: 'Sistema de notificações push', score: 65 },
  { id: 'DEM-2025-098', title: 'Refatoração do módulo de billing', score: 30 },
  { id: 'DEM-2025-097', title: 'Onboarding de novos usuários', score: 80 },
];

const INITIAL_TECH_PENDENCIES = [
  { id: 'tech-1', q: 'Impacto arquitetural', section: 'Arquitetura', a: '', confidence: 0, status: 'empty' },
  { id: 'tech-2', q: 'ADRs necessárias', section: 'Arquitetura', a: '', confidence: 0, status: 'empty', isAdrs: true },
  { id: 'tech-3', q: 'Sistemas afetados', section: 'Arquitetura', a: '', confidence: 0, status: 'empty' },
  { id: 'tech-4', q: 'Estratégia de integração', section: 'Arquitetura', a: '', confidence: 0, status: 'empty' },
  { id: 'tech-5', q: 'Modelo de dados', section: 'Dados', a: '', confidence: 0, status: 'empty' },
  { id: 'tech-6', q: 'Segurança / PCI / LGPD', section: 'Segurança', a: '', confidence: 0, status: 'empty' },
  { id: 'tech-7', q: 'Análise de risco técnico', section: 'Riscos', a: '', confidence: 0, status: 'empty' },
  { id: 'tech-8', q: 'Estratégia de rollout', section: 'Operação', a: '', confidence: 0, status: 'empty' },
  { id: 'tech-9', q: 'Estratégia de testes', section: 'Operação', a: '', confidence: 0, status: 'empty' },
  { id: 'tech-10', q: 'Observabilidade', section: 'Operação', a: '', confidence: 0, status: 'empty' },
  { id: 'tech-11', q: 'Plano de rollback', section: 'Operação', a: '', confidence: 0, status: 'empty' },
  { id: 'tech-12', q: 'Dependências externas', section: 'Dependências', a: '', confidence: 0, status: 'empty' },
  { id: 'tech-13', q: 'Estimativa de esforço', section: 'Estimativa', a: '', confidence: 0, status: 'empty' },
  { id: 'tech-14', q: 'Perfil de time necessário', section: 'Estimativa', a: '', confidence: 0, status: 'empty' },
  { id: 'tech-15', q: 'Bloqueador crítico?', section: 'Decisão final', a: '', confidence: 0, status: 'empty', isBlocker: true },
];

const TECH_SUGGESTIONS = {
  'tech-1': 'Médio. Introduz nova camada de Payment Provider abstrata. Impacta Billing Service e exige novo Webhook handler.',
  'tech-3': 'Billing Service, Customer API, Notification Service, Audit Log.',
  'tech-4': 'SDK oficial do Stripe. Comunicação síncrona para tokenização, assíncrona via webhook. Retry exponencial com idempotency-key.',
  'tech-5': 'Nova entidade PaymentMethod (id, customer_id, provider, token, last4, expires_at). Tabela CobrancaEvento. FK em Invoice.',
  'tech-6': 'PCI-DSS: tokenização no provider, zero PAN persistido. LGPD: consentimento explícito, DPA com Stripe.',
  'tech-7': '5 riscos: chargeback alto inicial, latência webhook em pico, falha conciliação ERP, resistência enterprise, PCI audit Q3.',
  'tech-8': 'Canário 5% → 25% → 50% → 100% em 3 semanas. Kill-switch via feature flag. Por cohort de cliente.',
  'tech-9': 'Unitários ≥80% Payment Service. Integração Stripe sandbox. E2E opt-in. Load test 10x picos.',
  'tech-10': 'Dashboards: latência webhook, taxa falha, distribuição chargeback. Alertas: webhook offline >1min, falha >5%.',
  'tech-11': 'Feature flag global. Incidente: desativar flag, clientes voltam a boleto. RTO 5min, RPO zero.',
  'tech-12': 'Stripe (externo). Audit log (interno). Sendgrid (já contratado). Nenhuma bloqueante.',
  'tech-13': '34 dias úteis. 12d backend, 8d frontend, 6d integração, 5d rollout, 3d buffer.',
  'tech-14': '2 backend sêniors + 1 frontend pleno. Revisões do CTO em ADR-001 e ADR-003.',
};

const SUGGESTED_ADRS = [
  { id: 'ADR-001', title: 'Camada de abstração de Payment Provider', context: 'Precisamos integrar Stripe mas evitar lock-in.', decision: 'Criar interface PaymentProvider com implementação StripeProvider.', alternatives: 'Acoplar direto ao Stripe SDK (rejeitado: lock-in).', consequences: 'Trocar de provider exige nova implementação, mas não toca em domínio.' },
  { id: 'ADR-002', title: 'Webhook handler com retry exponencial', context: 'Eventos podem chegar duplicados ou fora de ordem.', decision: 'Handler idempotente, retry exponencial até 5 tentativas, dead letter queue.', alternatives: 'Processar inline sem retry (rejeitado).', consequences: 'Latência levemente maior em retry. Garante entrega.' },
  { id: 'ADR-003', title: 'Vault tokenizado para dados de cartão', context: 'PCI-DSS exige escopo mínimo.', decision: 'Tokenização no Stripe. Zero PAN persistido. Apenas token + last4.', alternatives: 'Vault próprio (rejeitado: aumenta escopo PCI).', consequences: 'PCI-DSS Level 4 mantido.' },
  { id: 'ADR-004', title: 'Estratégia de migração opt-in', context: 'Não podemos forçar mudança em contratos existentes.', decision: 'Feature flag por cliente + UI de consentimento.', alternatives: 'Migração forçada (rejeitado).', consequences: 'Adesão depende de incentivo e UX.' },
];

const OTHER_DEMANDS = [
  { id: 'DEM-2026-002', title: 'Integração SAP enterprise', priority: 'Alta', state: 'Em Captura', score: 60, owner: 'Carlos Silva', updated: 'há 1 dia', preview: 'Cliente Acme pediu integração com SAP' },
  { id: 'DEM-2025-090', title: 'Dashboard de churn em tempo real', priority: 'Baixa', state: 'Arquivada', owner: 'Carlos Silva', updated: 'há 12 dias' },
];

// ============================================================
// CASE COMPLETO — RP-2026-000 (mocado pronto, sem precisar avançar fluxo)
// ============================================================
const SHOWCASE_RP = {
  id: 'RP-2026-000',
  demandId: 'DEM-2026-000',
  version: 'v1.0',
  title: 'Notificações em tempo real via WebSocket',
  status: 'RP Congelado',
  frozenAt: 'há 4 dias',
  po: 'Marina Costa',
  cto: 'Rafael Lima',
  pm: 'Juliana Reis',
  submitter: 'Carlos Silva (COO)',
  scoreGeral: 100,
  confidence: 96,
  estimateDays: 28,
  stakeholders: ['Ana Santos (CFO)', 'Pedro Costa (Head Eng)', 'Lucia Mendes (CS Lead)'],
  sections: [
    {
      id: 'sumario', title: 'Sumário Executivo', confidence: 100,
      content: 'Implementar sistema de notificações em tempo real para o produto principal, substituindo o polling atual (a cada 30s) por WebSocket. Reduzir custo de infra em ~R$ 18k/mês e melhorar percepção de "produto vivo" pelo cliente. Stack: Socket.io + Redis pub/sub. Estimativa: 28 dias úteis. 5 ADRs registradas, 4 riscos mapeados, rollout canário em 3 semanas.',
    },
    {
      id: 'contexto', title: '1. Contexto e Problema', confidence: 98,
      content: 'Hoje o frontend faz polling a cada 30s para checar atualizações de status (pedidos, mensagens, alertas). Isso gera ~12M requests/dia de baixa eficiência (95% retornam vazio), causando picos no banco e custo de infra desnecessário. Clientes enterprise reclamam que mudanças "demoram a aparecer" — péssima percepção de produto.',
    },
    {
      id: 'objetivos', title: '2. Objetivos de Negócio', confidence: 95,
      content: 'Em 6 meses pós-rollout: (1) reduzir requests/dia de 12M para ≤500k; (2) reduzir custo de infra em R$ 18k/mês; (3) tempo de propagação de status de 30s para <2s p99; (4) reduzir reclamações de "demora" no NPS qualitativo em 50%.',
    },
    {
      id: 'escopo', title: '3. Escopo (IN / OUT)', confidence: 98,
      content: 'IN: gateway WebSocket com Socket.io, Redis pub/sub para fanout, fallback automático para long-polling em browsers antigos, autenticação via JWT existente, reconexão automática com backoff exponencial, métricas e dashboards. OUT: notificações push mobile (já existem via Firebase), reescrita do cliente mobile (escopo separado), notificações por email (já existem via Sendgrid).',
    },
    {
      id: 'personas', title: '4. Personas Impactadas', confidence: 92,
      content: 'Usuários finais de todos os planos (free, pro, enterprise — total ~28k MAU). Time de engenharia (operação). Time de infra (custos). CS (suporte responde menos tickets de "não atualiza").',
    },
    {
      id: 'regras', title: '5. Regras de Negócio', confidence: 94,
      content: '1) Eventos críticos (pagamento, status de pedido) garantem entrega via fallback para polling se WS falhar. 2) Cliente pode receber até 50 eventos/min antes de throttle. 3) Conexões idle por mais de 5min são fechadas. 4) Reconexão automática até 5 tentativas antes de fallback. 5) Auditoria de todos eventos via log estruturado.',
    },
    {
      id: 'aceite', title: '6. Critérios de Aceite', confidence: 96,
      content: 'Conexão estabelecida em <1s p95. Evento entregue em <2s p99. Reconexão transparente para o usuário (sem reload). Fallback ativo automaticamente se WS indisponível. Load test com 10k conexões simultâneas sem degradação. Cobertura de testes ≥80% no gateway.',
    },
    {
      id: 'sucesso', title: '7. Critérios de Sucesso', confidence: 94,
      content: 'Métricas medidas 30/60/90d pós-rollout: % requests reduzidos, R$ economia de infra, tempo médio propagação, NPS qualitativo. Critério de "sucesso completo": atingir 3 das 4 metas em 90 dias.',
    },
    {
      id: 'riscos-p', title: '8. Riscos de Produto', confidence: 90,
      content: '4 riscos: (1) clientes em corporate firewalls bloqueiam WS — mitigado por fallback automático; (2) carga inesperada em horário de pico — mitigado por load test prévio; (3) bug em reconexão drena bateria mobile — mitigado por backoff exponencial; (4) custos de Redis subestimados — mitigado por revisão pós-piloto.',
    },
    {
      id: 'adrs', title: '9. ADRs (Decisões Arquiteturais)', confidence: 100,
      content: 'adrs',
    },
    {
      id: 'sistemas', title: '10. Sistemas Afetados', confidence: 100,
      content: 'API Gateway (nova rota /ws), Notification Service (refactor de publisher), Frontend Web (novo client SDK), Frontend Mobile (delegado pra v2), Redis (nova instância dedicada pub/sub), Monitoring (novos dashboards e alertas).',
    },
    {
      id: 'seguranca', title: '11. Segurança e LGPD', confidence: 96,
      content: 'Autenticação JWT já existente reaproveitada — sem novo escopo. Mensagens não contêm PII (apenas IDs de recurso + tipo de evento). Cliente busca dados sensíveis via API REST tradicional após receber notificação. LGPD: nada novo a tratar. Auditoria via log estruturado já está em conformidade.',
    },
    {
      id: 'riscos-t', title: '12. Riscos Técnicos', confidence: 92,
      content: 'Latência variável em regiões com conexão móvel ruim — mitigado por fallback. Memory leak em conexões antigas — testado em load test prévio. Race condition em fanout multi-instância — resolvido pelo design Redis pub/sub. Limite de file descriptors no host — instâncias dimensionadas com folga 3x.',
    },
    {
      id: 'rollout', title: '13. Estratégia de Rollout', confidence: 100,
      content: 'Semana 1: 5% dos usuários (cohort interno + free tier). Semana 2: 25%. Semana 3: 50%. Semana 4: 100%. Kill-switch global por feature flag. Em incidente: desativar flag, frontend volta a polling automaticamente, sem interrupção visível.',
    },
    {
      id: 'testes', title: '14. Estratégia de Testes', confidence: 95,
      content: 'Unitários: cobertura ≥80% no gateway WS e Notification Service. Integração: cenários de conexão/reconexão/fallback com Redis real. E2E: jornada completa do usuário pelo frontend. Load test: 10k conexões simultâneas, ramp-up de 1h. Chaos test: Redis fora do ar, instâncias derrubadas.',
    },
    {
      id: 'observ', title: '15. Observabilidade', confidence: 94,
      content: 'Dashboards: conexões ativas/instância, eventos publicados/s, latência p95/p99, taxa de fallback, taxa de reconexão. Alertas críticos: conexões totais >80% do limite, latência p99 >5s por 2min, taxa de erro >2% em 5min, Redis CPU >70%.',
    },
    {
      id: 'rollback', title: '16. Plano de Rollback', confidence: 98,
      content: 'Feature flag por usuário e global. Em incidente crítico: desativar flag global, frontend cai em polling automaticamente em <30s. Sem perda de eventos pendentes (Redis persiste e re-entrega). RTO: <1min. RPO: zero.',
    },
    {
      id: 'estimativa', title: '17. Estimativa de Esforço', confidence: 88,
      content: '28 dias úteis. Breakdown: 10d backend (gateway WS + Redis pub/sub + auth), 6d frontend (client SDK + integração + fallback), 4d testes/integração, 5d rollout/observabilidade, 3d buffer. Time: 2 backend sêniors + 1 frontend pleno + revisão pontual do CTO.',
    },
  ],
  adrs: [
    { id: 'ADR-091', title: 'Socket.io como protocolo de WebSocket', context: 'Precisamos suportar fallback automático para browsers e firewalls corporativos restritos.', decision: 'Adotar Socket.io que negocia automaticamente entre WS, long-polling e outros transports.', alternatives: 'WebSocket nativo (rejeitado: sem fallback). SignalR (rejeitado: stack majoritariamente Node).', consequences: 'Cliente JS oficial maduro. Trade-off: overhead leve do protocol de negociação inicial.' },
    { id: 'ADR-092', title: 'Redis Pub/Sub para fanout multi-instância', context: 'Múltiplas instâncias do gateway precisam entregar evento ao usuário, esteja conectado a qualquer uma.', decision: 'Publicar todo evento no Redis. Cada instância subscreve e entrega aos clientes locais.', alternatives: 'Kafka (rejeitado: overkill para o caso). Tabela DB com polling (rejeitado: contradiz o objetivo).', consequences: 'Latência mínima adicional (~1ms). Dependência forte de Redis — mitigada com cluster.' },
    { id: 'ADR-093', title: 'JWT existente para autenticação WS', context: 'Cliente já autentica via JWT em chamadas REST.', decision: 'Reaproveitar JWT no handshake WS via query string ou header. Verificar a cada conexão.', alternatives: 'Token dedicado para WS (rejeitado: complexidade desnecessária).', consequences: 'Zero impacto em flow de auth existente. JWT expirado força reconexão.' },
    { id: 'ADR-094', title: 'Fallback automático para polling em caso de falha', context: 'Alguns clientes corporativos bloqueiam WS por firewall.', decision: 'Cliente detecta falha de upgrade e cai em long-polling automaticamente, sem interação do usuário.', alternatives: 'Forçar WS e ignorar clientes incompatíveis (rejeitado: viola SLA enterprise).', consequences: 'UX preservada. Cliente em fallback tem latência maior mas funciona.' },
    { id: 'ADR-095', title: 'Throttling por usuário em 50 eventos/min', context: 'Evitar abuso ou bug do publisher inundando cliente.', decision: 'Rate limiter no gateway: 50 eventos/min por conexão. Excedente é descartado com log.', alternatives: 'Sem limite (rejeitado: risco operacional). Limite global (rejeitado: penaliza usuários legítimos).', consequences: 'Eventos excedentes são perdidos mas logados. Usuário normal nunca atinge o limite.' },
  ],
  comments: [
    { id: 'sc-1', sectionId: 'objetivos', author: 'Ana Santos', authorRole: 'CFO', authorColor: '#6B7280', text: 'A meta de R$ 18k/mês de economia foi validada com infra?', type: 'question', resolved: true, response: 'Sim, infra validou. Estimativa baseada no atual gasto Redis + DB queries.' },
    { id: 'sc-2', sectionId: 'rollout', author: 'Juliana Reis', authorRole: 'PM', authorColor: '#10B981', text: 'Plano de comunicação com clientes enterprise durante rollout?', type: 'comment', resolved: true, response: 'CS preparou email + post no status page. Anexado no apêndice.' },
    { id: 'sc-3', sectionId: 'riscos-t', author: 'Pedro Costa', authorRole: 'Head Eng', authorColor: '#8B5CF6', text: 'O load test cobre cenário de 10k conexões com 100 eventos/s cada?', type: 'question', resolved: false },
  ],
  timeline: [
    { event: 'Demanda criada', by: 'Carlos Silva (COO)', when: 'há 14 dias', icon: 'plus' },
    { event: 'Captura concluída (Score 100%)', by: 'Carlos Silva', when: 'há 13 dias', icon: 'check' },
    { event: 'Triagem — Product Ready', by: 'Marina Costa (PO)', when: 'há 12 dias', icon: 'check' },
    { event: 'Discovery: pesquisa Socket.io vs WS nativo', by: 'Marina Costa', when: 'há 10 dias', icon: 'search' },
    { event: 'Racionalização concluída', by: 'Marina Costa', when: 'há 7 dias', icon: 'layers' },
    { event: 'Avaliação técnica concluída (5 ADRs)', by: 'Rafael Lima (CTO)', when: 'há 5 dias', icon: 'settings' },
    { event: 'RP v1.0 congelado', by: 'Marina Costa', when: 'há 4 dias', icon: 'check' },
  ],
};

// ============================================================
// DRILL-DOWN DATA (mocks para os modais de KPI)
// ============================================================
const DRILLDOWN_DATA = {
  // Submitter
  'submitter-impacto': {
    title: 'Impacto projetado das suas demandas em execução',
    columns: ['Demanda', 'Estado', 'Impacto anual'],
    rows: [
      ['DEM-2026-001 — Gateway Pagamento', 'Em Racionalização', 'R$ 78k'],
      ['DEM-2025-095 — Migração auth', 'Em Execução', 'R$ 142k'],
      ['DEM-2025-088 — Cobrança PIX', 'Em Execução', 'R$ 192k'],
    ],
  },
  'submitter-total': {
    title: 'Total de demandas submetidas (YTD)',
    columns: ['Demanda', 'Submetida em', 'Estado atual'],
    rows: [
      ['DEM-2026-001 — Gateway Pagamento', 'há 6 dias', 'Em Racionalização'],
      ['DEM-2026-002 — Integração SAP', 'há 8 dias', 'Em Triagem'],
      ['DEM-2025-099 — Notificações push', 'há 32 dias', 'Em Racionalização'],
      ['DEM-2025-098 — Refator billing', 'há 45 dias', 'Em Racionalização'],
      ['DEM-2025-097 — Onboarding', 'há 60 dias', 'Em Racionalização'],
      ['DEM-2025-095 — Migração auth', 'há 80 dias', 'Em Execução'],
      ['DEM-2025-094 — Performance dashboard', 'há 92 dias', 'Em Execução'],
      ['DEM-2025-088 — Cobrança PIX', 'há 120 dias', 'Em Execução'],
      ['DEM-2025-080 — Webhook customizado', 'há 130 dias', 'Rejeitada'],
      ['DEM-2025-077 — Onboarding mobile', 'há 135 dias', 'Backlog'],
      ['DEM-2025-070 — Múltiplas moedas', 'há 150 dias', 'Backlog'],
      ['DEM-2025-067 — Cobrança PIX v1', 'há 180 dias', 'Concluída'],
      ['DEM-2025-050 — Dashboard churn', 'há 200 dias', 'Arquivada'],
      ['DEM-2025-040 — Export relatórios', 'há 220 dias', 'Concluída'],
    ],
  },
  'submitter-execucao': {
    title: 'Demandas em execução',
    columns: ['Demanda', 'PM', 'Início', 'Previsão entrega'],
    rows: [
      ['DEM-2025-095 — Migração auth', 'Juliana Reis', 'há 18 dias', 'em 12 dias'],
      ['DEM-2025-094 — Performance dashboard', 'Juliana Reis', 'há 25 dias', 'em 5 dias'],
      ['DEM-2025-088 — Cobrança PIX', 'Juliana Reis', 'há 40 dias', 'concluída em 3d'],
    ],
  },
  // PO
  'po-throughput': {
    title: 'RPs congelados este mês',
    columns: ['RP', 'Congelado em', 'Status'],
    rows: [
      ['RP-2026-008 — Cache distribuído', 'há 2 dias', 'Aceito PM'],
      ['RP-2026-007 — Refator pagamentos', 'há 5 dias', 'Em execução'],
      ['RP-2026-006 — Audit log v2', 'há 7 dias', 'Aceito PM'],
      ['RP-2026-005 — Migração auth', 'há 10 dias', 'Em execução'],
      ['RP-2026-004 — Performance dashboard', 'há 14 dias', 'Em execução'],
      ['RP-2026-003 — Notificações email', 'há 18 dias', 'Aceito PM'],
      ['RP-2026-002 — Onboarding', 'há 22 dias', 'v1.1 em revisão'],
      ['RP-2026-001 — Cobrança PIX', 'há 25 dias', 'Em execução'],
      ['RP-2025-099 — Filtros relatório', 'há 28 dias', 'Aceito PM'],
    ],
  },
  'po-triagem': {
    title: 'Demandas em triagem',
    columns: ['Demanda', 'Prioridade', 'SLA'],
    rows: TRIAGE_QUEUE.map(d => [`${d.id} — ${d.title}`, d.priority, d.sla]),
  },
  'po-rac': {
    title: 'Racionalizações em andamento',
    columns: ['Demanda', 'Score atual', 'Última atualização'],
    rows: [
      ['DEM-2026-001 — Gateway Pagamento', '25%', 'agora'],
      ['DEM-2025-099 — Notificações push', '65%', 'há 1 dia'],
      ['DEM-2025-098 — Refator billing', '30%', 'há 2 dias'],
      ['DEM-2025-097 — Onboarding', '80%', 'há 3 dias'],
    ],
  },
  'po-sla': {
    title: 'Demandas com SLA vencendo em 24h',
    columns: ['Demanda', 'Prioridade', 'Tempo restante'],
    rows: [
      ['DEM-2026-001 — Gateway Pagamento', 'Crítica', '21h'],
      ['DEM-2026-005 — Bug crítico no login', 'Crítica', '8h'],
    ],
  },
  'po-aceite': {
    title: 'RPs aceitos na 1ª versão (YTD)',
    columns: ['RP', 'PM', 'Tempo até aceite'],
    rows: [
      ['RP-2026-008 — Cache distribuído', 'Juliana Reis', '1.5d'],
      ['RP-2026-006 — Audit log v2', 'Juliana Reis', '2d'],
      ['RP-2026-005 — Migração auth', 'Juliana Reis', '1d'],
      ['RP-2026-004 — Performance dashboard', 'Juliana Reis', '3d'],
      ['RP-2026-003 — Notificações email', 'Juliana Reis', '2.5d'],
      ['RP-2026-001 — Cobrança PIX', 'Juliana Reis', '1.5d'],
    ],
  },
  'po-discovery': {
    title: 'Discoveries ativos',
    columns: ['Discovery', 'Tipo', 'Aberto há'],
    rows: [
      ['Stripe vs Pagar.me — DEM-2026-001', 'Pesquisa externa', '1 dia'],
      ['Coleta com Carlos (COO) — DEM-2026-001', 'Coleta', '4 horas'],
      ['Histórico billing — DEM-2025-098', 'Base de conhecimento', '3 dias'],
    ],
  },
  // CTO
  'cto-backlog': {
    title: 'Esforço técnico em backlog',
    columns: ['Demanda', 'Estimativa', 'Status'],
    rows: [
      ['DEM-2026-001 — Gateway Pagamento', '34d', 'Em avaliação'],
      ['DEM-2025-099 — Notificações push', '21d', 'Av. concluída'],
      ['DEM-2025-098 — Refator billing', '45d', 'Aguardando PO'],
      ['DEM-2025-097 — Onboarding', '18d', 'Av. concluída'],
      ['DEM-2025-095 — Migração auth', '28d', 'Em execução'],
      ['DEM-2025-094 — Performance dashboard', '14d', 'Em execução'],
      ['DEM-2025-088 — Cobrança PIX', '27d', 'Em execução'],
    ],
  },
  'cto-pendentes': {
    title: 'Escalas técnicas pendentes',
    columns: ['Demanda', 'PO', 'Aguardando há'],
    rows: [
      ['DEM-2026-001 — Gateway Pagamento', 'Marina Costa', '1 dia'],
    ],
  },
  'cto-andamento': {
    title: 'Avaliações em andamento',
    columns: ['Demanda', 'Score técnico', 'PO'],
    rows: [
      ['DEM-2025-095 — Migração auth', '70%', 'Marina Costa'],
      ['DEM-2025-094 — Performance dashboard', '45%', 'Marina Costa'],
    ],
  },
  'cto-bloq': {
    title: 'Bloqueadores críticos sinalizados (YTD)',
    columns: ['Demanda', 'Quando', 'Resolução'],
    rows: [
      ['DEM-2025-080 — Webhook customizado', 'há 18d', 'Rejeitada na triagem'],
      ['DEM-2025-072 — IE11 legado', 'há 60d', 'Rejeitada'],
      ['DEM-2025-058 — Sync offline', 'há 90d', 'Backlog (re-design)'],
    ],
  },
  'cto-adrs': {
    title: 'ADRs criadas este mês',
    columns: ['ADR', 'Demanda', 'Categoria'],
    rows: [
      ['ADR-098 — Cache Redis Cluster', 'DEM-2025-094', 'Performance'],
      ['ADR-099 — JWT assimétrico', 'DEM-2025-095', 'Segurança'],
      ['ADR-100 — Provider abstrato', 'DEM-2026-001', 'Arquitetura'],
      ['ADR-101 — Webhook idempotente', 'DEM-2026-001', 'Arquitetura'],
      ['ADR-102 — Vault tokenizado', 'DEM-2026-001', 'Segurança'],
      ['ADR-103 — Migração opt-in', 'DEM-2026-001', 'Operação'],
      ['ADR-104 — Pool conexões', 'DEM-2025-094', 'Performance'],
      ['ADR-105 — Event sourcing audit', 'DEM-2026-006', 'Dados'],
      ['ADR-106 — Feature flag global', 'DEM-2026-007', 'Operação'],
      ['ADR-107 — RBAC granular', 'DEM-2026-008', 'Segurança'],
      ['ADR-108 — Saga payment', 'DEM-2026-001', 'Arquitetura'],
    ],
  },
  'cto-retrabalho': {
    title: 'Re-trabalho v1.1 por questão técnica (YTD)',
    columns: ['RP', 'Motivo', 'Custo'],
    rows: [
      ['RP-2026-002 — Onboarding v1.1', 'Risco PCI não mapeado', '4d'],
      ['RP-2025-099 — Push v1.1', 'Latência subestimada', '2d'],
      ['RP-2025-095 — Auth v1.1', 'Cobertura de testes', '3d'],
    ],
  },
  // PM
  'pm-aceite': {
    title: 'RPs aceitos na 1ª revisão',
    columns: ['RP', 'Categoria', 'Tempo até aceite'],
    rows: [
      ['RP-2026-008 — Cache distribuído', 'Performance', '1.5d'],
      ['RP-2026-007 — Refator pagamentos', 'Arquitetura', '2d'],
      ['RP-2026-006 — Audit log v2', 'Segurança', '2d'],
      ['RP-2026-005 — Migração auth', 'Segurança', '1d'],
      ['RP-2026-004 — Performance dashboard', 'Performance', '3d'],
      ['RP-2026-003 — Notificações email', 'Produto', '2.5d'],
      ['RP-2026-001 — Cobrança PIX', 'Produto', '1.5d'],
    ],
  },
  'pm-aguardando': {
    title: 'RPs aguardando sua avaliação',
    columns: ['RP', 'Estimativa', 'Congelado há'],
    rows: [
      ['RP-2026-001 v1.0 — Gateway Pagamento', '34d', 'agora'],
    ],
  },
  'pm-execucao': {
    title: 'Demandas em execução',
    columns: ['Demanda', 'Início', 'Previsão entrega'],
    rows: [
      ['DEM-2025-095 — Migração auth', 'há 18d', 'em 12d'],
      ['DEM-2025-094 — Performance dashboard', 'há 25d', 'em 5d'],
      ['DEM-2025-088 — Cobrança PIX', 'há 40d', 'concluída em 3d'],
    ],
  },
  'pm-gaps': {
    title: 'Gaps apontados (YTD)',
    columns: ['RP', 'Tipo de gap', 'Bloqueante?'],
    rows: [
      ['RP-2026-002 v1.0 — Onboarding', 'Escopo ambíguo', 'Sim'],
      ['RP-2026-002 v1.0 — Onboarding', 'Dados insuficientes', 'Sim'],
      ['RP-2025-099 v1.0 — Push', 'Estimativa irreal', 'Sim'],
      ['RP-2025-097 v1.0 — Auth', 'Critério aceite vago', 'Não'],
      ['RP-2025-094 v1.0 — Performance', 'Risco técnico ausente', 'Não'],
      // ... mais 9
    ],
  },
  // Viewer (CFO)
  'cfo-investimento': {
    title: 'Investimento total comprometido em RPs ativos',
    columns: ['RP', 'Categoria', 'Valor'],
    rows: [
      ['RP-2026-001 — Gateway Pagamento', 'CAPEX', 'R$ 340k'],
      ['RP-2026-008 — Notificações push', 'OPEX', 'R$ 280k'],
      ['RP-2026-007 — Refator billing', 'CAPEX', 'R$ 250k'],
      ['RP-2026-006 — Onboarding refeito', 'OPEX', 'R$ 220k'],
      ['RP-2026-005 — Migração auth', 'CAPEX', 'R$ 195k'],
      ['RP-2026-004 — Performance dashboard', 'OPEX', 'R$ 165k'],
      ['RP-2026-003 — Integração SAP', 'CAPEX', 'R$ 145k'],
      ['RP-2026-002 — Notificações email', 'OPEX', 'R$ 135k'],
      ['RP-2026-009 — Audit log v2', 'OPEX', 'R$ 110k'],
    ],
  },
  'cfo-roi': {
    title: 'ROI projetado total',
    columns: ['RP', 'Categoria de retorno', 'R$ anual'],
    rows: [
      ['RP-2026-001 — Gateway Pagamento', 'Redução inadimplência', 'R$ 78k'],
      ['RP-2025-088 — Cobrança PIX', 'Redução custo op.', 'R$ 142k'],
      ['RP-2025-095 — Migração auth', 'Ganho produtividade', 'R$ 35k'],
      ['RP-2025-094 — Performance', 'Aumento receita', 'R$ 49k'],
      ['RP-2026-006 — Onboarding', 'Redução custo op.', 'R$ 38k'],
      ['RP-2026-002 — Email', 'Ganho produtividade', 'R$ 43k'],
      ['RP-2026-008 — Push', 'Aumento receita', 'R$ 27k'],
    ],
  },
  'cfo-capex': {
    title: 'RPs que afetam CAPEX',
    columns: ['RP', 'Valor', 'Justificativa'],
    rows: [
      ['RP-2026-001 — Gateway Pagamento', 'R$ 340k', 'Infra de payment + integração'],
      ['RP-2026-007 — Refator billing', 'R$ 250k', 'Refactoring estrutural'],
      ['RP-2026-005 — Migração auth', 'R$ 195k', 'Nova arquitetura'],
      ['RP-2026-003 — Integração SAP', 'R$ 145k', 'Dev de conector'],
    ],
  },
};

// ============================================================
// CONTEXT
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

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const selectPersona = (personaId) => {
    setPersona(PERSONAS[personaId]);
    setRoute({ screen: 'dashboard' });
  };

  const navigate = (screen, params = {}) => {
    setRoute({ screen, ...params });
  };

  const updatePendency = (id, updates) => {
    setCapturePendencies(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const updateTriageItem = (id, updates) => {
    setTriageItems(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const updateRacPendency = (id, updates) => {
    setRacPendencies(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const updateTechPendency = (id, updates) => {
    setTechPendencies(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const captureScore = useMemo(() => {
    const done = capturePendencies.filter(p => ['resolved', 'manually_accepted', 'not_applicable'].includes(p.status)).length;
    return Math.round((done / capturePendencies.length) * 100);
  }, [capturePendencies]);

  const triageScore = useMemo(() => {
    const decided = triageItems.filter(t => t.decision !== null).length;
    return Math.round((decided / triageItems.length) * 100);
  }, [triageItems]);

  const techScore = useMemo(() => {
    const done = techPendencies.filter(p => ['resolved', 'manually_accepted', 'not_applicable'].includes(p.status)).length;
    return Math.round((done / techPendencies.length) * 100);
  }, [techPendencies]);

  const racScore = useMemo(() => {
    const done = racPendencies.filter(p => ['resolved', 'manually_accepted', 'not_applicable'].includes(p.status)).length;
    return Math.round((done / racPendencies.length) * 100);
  }, [racPendencies]);

  return (
    <AppContext.Provider value={{
      persona, setPersona, selectPersona,
      route, navigate,
      capturePendencies, updatePendency, captureScore, setCapturePendencies,
      attachments, setAttachments,
      demandTitle, demandState, setDemandState,
      toast, showToast,
      triageItems, updateTriageItem, triageScore, setTriageItems,
      racPendencies, updateRacPendency, racScore, setRacPendencies,
      discoveryResults, setDiscoveryResults,
      rpVersion, setRpVersion,
      techPendencies, setTechPendencies, updateTechPendency, techScore,
      adrs, setAdrs,
      rpComments, setRpComments,
      returnedGaps, setReturnedGaps,
      v11Changes, setV11Changes,
      seenTours, setSeenTours,
      drilldown, setDrilldown,
    }}>
      {children}
    </AppContext.Provider>
  );
}

// ============================================================
// UI COMPONENTS
// ============================================================

function Button({ children, variant = 'primary', size = 'md', onClick, disabled, className = '', icon: Icon, fullWidth }) {
  const { persona } = useApp();
  const personaColor = persona?.color || COLORS.info;

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  const variants = {
    primary: { backgroundColor: disabled ? COLORS.borderStrong : personaColor, color: 'white' },
    secondary: { backgroundColor: 'transparent', border: `1px solid ${COLORS.borderStrong}`, color: COLORS.textPrimary },
    ghost: { backgroundColor: 'transparent', color: COLORS.textSecondary },
    danger: { backgroundColor: disabled ? COLORS.borderStrong : COLORS.danger, color: 'white' },
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-md transition-all ${sizes[size]} ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:opacity-90 active:scale-[0.98]'} ${fullWidth ? 'w-full' : ''} ${className}`}
      style={variants[variant]}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : 16} />}
      {children}
    </button>
  );
}

function ScoreRing({ score, size = 64, strokeWidth = 6, label }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const start = displayScore;
    const diffVal = score - start;
    const duration = 500;
    const startTime = performance.now();
    let raf;
    const tick = (t) => {
      const progress = Math.min((t - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(start + diffVal * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line
  }, [score]);

  const color = displayScore === 100 ? COLORS.success : displayScore >= 71 ? COLORS.info : displayScore >= 31 ? COLORS.warning : COLORS.danger;
  const offset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} stroke={COLORS.border} strokeWidth={strokeWidth} fill="none" />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            stroke={color} strokeWidth={strokeWidth} fill="none"
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="font-semibold" style={{ fontSize: size * 0.25, color: COLORS.textPrimary }}>{displayScore}%</div>
        </div>
      </div>
      {label && <div className="text-xs font-medium" style={{ color: COLORS.textSecondary }}>{label}</div>}
    </div>
  );
}

function ConfidenceBar({ value, compact = false }) {
  const color = value >= 90 ? COLORS.success : value >= 70 ? COLORS.warning : COLORS.danger;
  const segments = 10;
  const filled = Math.round((value / 100) * segments);
  return (
    <div className="inline-flex items-center gap-2">
      <span className="text-xs font-medium" style={{ color: COLORS.textSecondary }}>Confiança: {value}%</span>
      {!compact && (
        <div className="flex gap-0.5">
          {Array.from({ length: segments }).map((_, i) => (
            <div key={i} className="w-1 h-2.5 rounded-sm" style={{ backgroundColor: i < filled ? color : COLORS.border }} />
          ))}
        </div>
      )}
    </div>
  );
}

// ===== KPI Cards (com drill-down) =====
function KPICard({ label, value, suffix, trend, trendDir, sub, accent, icon: Icon, large, drilldownKey }) {
  const { setDrilldown } = useApp();
  const trendColor = trendDir === 'up' ? COLORS.success : trendDir === 'down' ? COLORS.danger : COLORS.textMuted;
  const trendIcon = trendDir === 'up' ? '↑' : trendDir === 'down' ? '↓' : '→';
  const clickable = !!drilldownKey;
  return (
    <div
      onClick={clickable ? () => setDrilldown(drilldownKey) : undefined}
      className={`border rounded-lg p-5 hover-lift relative ${clickable ? 'cursor-pointer' : ''}`}
      style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}
    >
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
        {trend !== undefined && (
          <div className="text-xs font-semibold ml-1.5" style={{ color: trendColor }}>{trendIcon} {trend}</div>
        )}
      </div>
      {sub && <div className="text-xs" style={{ color: COLORS.textMuted }}>{sub}</div>}
      {clickable && (
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRight size={12} style={{ color: COLORS.textMuted }} />
        </div>
      )}
    </div>
  );
}

function CompactKPI({ label, value, suffix, trend, trendDir, accent, icon: Icon, sub, drilldownKey }) {
  const { setDrilldown } = useApp();
  const trendColor = trendDir === 'up' ? COLORS.success : trendDir === 'down' ? COLORS.danger : COLORS.textMuted;
  const trendIcon = trendDir === 'up' ? '↑' : trendDir === 'down' ? '↓' : '→';
  const clickable = !!drilldownKey;
  return (
    <div
      onClick={clickable ? () => setDrilldown(drilldownKey) : undefined}
      className={`border rounded-lg p-3.5 hover-lift ${clickable ? 'cursor-pointer' : ''}`}
      style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}
    >
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
        {trend !== undefined && (
          <div className="text-xs font-semibold ml-auto" style={{ color: trendColor }}>{trendIcon}{trend}</div>
        )}
      </div>
      {sub && <div className="text-xs mt-1" style={{ color: COLORS.textMuted }}>{sub}</div>}
    </div>
  );
}

function Sparkline({ data, color = COLORS.info, height = 28, width = 100 }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');
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
          <span>{labels[0]}</span>
          <span>{labels[labels.length - 1]}</span>
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
            const pct = seg.value / total;
            const len = pct * circumference;
            const el = (
              <circle
                key={i}
                cx={size / 2} cy={size / 2} r={radius}
                stroke={seg.color} strokeWidth={strokeWidth} fill="none"
                strokeDasharray={`${len} ${circumference}`}
                strokeDashoffset={-offset}
              />
            );
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
    'Em Captura': { color: COLORS.info, icon: Edit3 },
    'Em Triagem': { color: '#F97316', icon: Inbox },
    'Em Discovery': { color: COLORS.warning, icon: Search },
    'Em Racionalização': { color: '#8B5CF6', icon: Layers },
    'Em Avaliação Técnica': { color: '#7C3AED', icon: Settings },
    'Pronto para Congelamento': { color: '#4338CA', icon: Check },
    'Devolvido pelo PM': { color: COLORS.warning, icon: AlertTriangle },
    'RP Congelado': { color: COLORS.success, icon: Layers },
    'Em Execução': { color: COLORS.success, icon: Play },
    'Backlog': { color: COLORS.textMuted, icon: Archive },
    'Arquivada': { color: COLORS.textMuted, icon: Archive },
    'Rejeitada': { color: COLORS.danger, icon: X },
  };
  const s = map[status] || { color: COLORS.textMuted, icon: Circle };
  const Icon = s.icon;
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: `${s.color}15`, color: s.color }}>
      <Icon size={10} />
      {status}
    </span>
  );
}

function PendencyCard({ pendency, onClick }) {
  const config = {
    empty: { icon: AlertCircle, color: COLORS.danger, action: 'Responder' },
    low_confidence: { icon: AlertTriangle, color: COLORS.warning, action: 'Revisar' },
    resolved: { icon: CheckCircle2, color: COLORS.success, action: 'Editar' },
    manually_accepted: { icon: CheckCircle2, color: '#0891B2', action: 'Editar' },
    not_applicable: { icon: Circle, color: COLORS.textMuted, action: 'Editar' },
  };
  const c = config[pendency.status] || config.empty;
  const Icon = c.icon;

  return (
    <div
      onClick={onClick}
      className="border rounded-lg p-4 cursor-pointer hover-lift group"
      style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border, borderLeftWidth: '3px', borderLeftColor: c.color }}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex-shrink-0" style={{ color: c.color }}>
          <Icon size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium mb-2" style={{ color: COLORS.textPrimary }}>{pendency.q}</div>
          {pendency.a && (
            <div className="text-sm mb-3 overflow-hidden" style={{ color: COLORS.textSecondary, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {pendency.a}
            </div>
          )}
          <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: COLORS.border }}>
            {pendency.status === 'empty' ? (
              <span className="text-xs font-medium" style={{ color: COLORS.danger }}>Vazia</span>
            ) : pendency.status === 'not_applicable' ? (
              <span className="text-xs font-medium" style={{ color: COLORS.textMuted }}>N/A</span>
            ) : (
              <ConfidenceBar value={pendency.confidence} />
            )}
            <span className="text-xs font-medium flex items-center gap-1" style={{ color: COLORS.textSecondary }}>
              {c.action} <ChevronRight size={12} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DRILL-DOWN MODAL
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
          <button onClick={() => setDrilldown(null)} className="p-1 hover:bg-stone-100 rounded">
            <X size={18} style={{ color: COLORS.textMuted }} />
          </button>
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
                    <td key={j} className="p-3" style={{ color: j === 0 ? COLORS.textPrimary : COLORS.textSecondary, fontWeight: j === 0 ? 500 : 400 }}>
                      {cell}
                    </td>
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
  const { persona, setPersona, route, navigate } = useApp();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (!persona) return null;

  const breadcrumb = (() => {
    if (route.screen === 'dashboard') return 'Dashboard';
    if (route.screen === 'new-demand') return 'Demandas / Nova';
    if (route.screen === 'capture-queue') return 'Demandas / DEM-2026-001 / Captura';
    if (route.screen === 'triage-queue') return 'Triagem / Fila';
    if (route.screen === 'triage-detail') return 'Triagem / DEM-2026-001';
    if (route.screen === 'rationalization') return 'Racionalização / DEM-2026-001';
    if (route.screen === 'rp-freeze') return 'Congelamento / DEM-2026-001';
    if (route.screen === 'tech-evaluation') return 'Av. Técnica / DEM-2026-001';
    if (route.screen === 'rp-view') return 'RP / DEM-2026-001';
    return route.screen;
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
        <div className="relative">
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-stone-100">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white" style={{ backgroundColor: persona.color }}>
              {persona.initials}
            </div>
            <div className="text-left">
              <div className="text-xs font-medium" style={{ color: COLORS.textPrimary }}>{persona.name}</div>
              <div className="text-xs" style={{ color: COLORS.textMuted }}>{persona.label}</div>
            </div>
            <ChevronDown size={14} style={{ color: COLORS.textMuted }} />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-72 rounded-lg border shadow-lg overflow-hidden z-50"
              style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
              <div className="px-3 py-2 text-xs font-semibold border-b" style={{ color: COLORS.textMuted, borderColor: COLORS.border }}>
                Trocar de persona
              </div>
              {Object.values(PERSONAS).map(p => (
                <button
                  key={p.id}
                  onClick={() => { setPersona(p); setDropdownOpen(false); navigate('dashboard'); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-stone-50 text-left"
                  style={{ backgroundColor: p.id === persona.id ? COLORS.bgSubtle : 'transparent' }}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white" style={{ backgroundColor: p.color }}>
                    {p.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>{p.name}</div>
                    <div className="text-xs" style={{ color: COLORS.textMuted }}>{p.role} · {p.label}</div>
                  </div>
                  {p.id === persona.id && <Check size={14} style={{ color: p.color }} />}
                </button>
              ))}
              <button
                onClick={() => { setPersona(null); setDropdownOpen(false); navigate('login'); }}
                className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-stone-50 text-left border-t"
                style={{ borderColor: COLORS.border }}
              >
                <LogOut size={14} style={{ color: COLORS.textMuted }} />
                <span className="text-sm" style={{ color: COLORS.textSecondary }}>Sair</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Sidebar() {
  const { persona, route, navigate } = useApp();
  if (!persona) return null;

  const menus = {
    submitter: [
      { icon: Home, label: 'Dashboard', screen: 'dashboard' },
      { icon: Plus, label: 'Nova Demanda', screen: 'new-demand' },
      { icon: FileText, label: 'Minhas Demandas', screen: 'my-demands' },
    ],
    po: [
      { icon: Home, label: 'Dashboard', screen: 'dashboard' },
      { icon: Inbox, label: 'Fila de Triagem', screen: 'triage-queue', badge: 4 },
      { icon: Layers, label: 'Racionalizações', screen: 'rationalization', badge: 1 },
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
    <div className="w-60 border-r flex flex-col" style={{ backgroundColor: COLORS.bgSubtle, borderColor: COLORS.border }}>
      <div className="p-3 flex-1 overflow-y-auto">
        {items.map(item => {
          const Icon = item.icon;
          const isActive = route.screen === item.screen;
          return (
            <button
              key={item.screen}
              onClick={() => navigate(item.screen)}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md mb-0.5 text-left hover:bg-stone-200/60"
              style={{
                backgroundColor: isActive ? COLORS.bgElevated : 'transparent',
                color: isActive ? COLORS.textPrimary : COLORS.textSecondary,
              }}
            >
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
      <div className="p-3 border-t text-xs" style={{ borderColor: COLORS.border, color: COLORS.textMuted }}>v0.2 · Protótipo</div>
    </div>
  );
}

function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  const config = {
    success: { color: COLORS.success, icon: CheckCircle2 },
    warning: { color: COLORS.warning, icon: AlertTriangle },
    error: { color: COLORS.danger, icon: AlertCircle },
  };
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

function HeroMetric({ label, value, suffix, trend, trendDir, sub, sparklineData, sparklineLabel, accent, drilldownKey }) {
  const { setDrilldown } = useApp();
  const trendColor = trendDir === 'up' ? COLORS.success : trendDir === 'down' ? COLORS.danger : COLORS.textMuted;
  const clickable = !!drilldownKey;
  return (
    <div
      onClick={clickable ? () => setDrilldown(drilldownKey) : undefined}
      className={`border rounded-xl p-6 mb-6 ${clickable ? 'cursor-pointer hover-lift' : ''}`}
      style={{ background: `linear-gradient(135deg, ${accent}08 0%, ${COLORS.bgElevated} 100%)`, borderColor: COLORS.border }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1">
          <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>{label}</div>
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
    <div className="border rounded-lg p-5" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
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
        <button
          onClick={() => { const next = new Set(seenTours); next.add(tourKey); setSeenTours(next); }}
          className="text-xs underline hover:opacity-70" style={{ color: '#92400E' }}
        >
          Entendi, ocultar
        </button>
      </div>
      <ul className="space-y-1.5 ml-6">
        {items.map((item, i) => (
          <li key={i} className="text-sm flex items-start gap-2" style={{ color: '#78350F' }}>
            <span className="font-mono text-xs mt-0.5">{i + 1}.</span>
            <span>{item}</span>
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
    <div className="min-h-screen flex flex-col items-center justify-center p-8" style={{ backgroundColor: COLORS.bg }}>
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <div className="font-mono font-bold text-4xl mb-3 tracking-tight" style={{ color: COLORS.textPrimary }}>DemandOS</div>
          <div className="text-sm" style={{ color: COLORS.textSecondary }}>A fábrica de Readiness Packages</div>
        </div>
        <div className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: COLORS.textMuted }}>Entre como</div>
        <div className="space-y-2">
          {Object.values(PERSONAS).map(p => (
            <button
              key={p.id}
              onClick={() => selectPersona(p.id)}
              className="w-full flex items-center gap-4 p-4 rounded-lg border text-left hover-lift"
              style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-base font-semibold text-white flex-shrink-0" style={{ backgroundColor: p.color }}>
                {p.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>{p.name}</div>
                <div className="text-xs font-medium mb-1" style={{ color: p.color }}>{p.role} · {p.label}</div>
                <div className="text-xs" style={{ color: COLORS.textMuted }}>{p.desc}</div>
              </div>
              <ChevronRight size={16} style={{ color: COLORS.textMuted }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DASHBOARDS DENSOS (com drill-down)
// ============================================================
function SubmitterDashboard() {
  const { navigate, captureScore, demandTitle, demandState, persona } = useApp();
  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-bold mb-1 tracking-tight" style={{ color: COLORS.textPrimary }}>Olá, {persona.name.split(' ')[0]}.</h1>
      <p className="text-sm mb-8" style={{ color: COLORS.textSecondary }}>
        Suas demandas, o que está acontecendo, e o impacto que estão gerando.
      </p>

      <TourBanner personaId="submitter" title="Como Submitter você vai..." items={[
        'Criar uma demanda nova clicando em "+ Nova Demanda"',
        'Responder pendências que a plataforma não conseguiu extrair sozinha',
        'Clicar em qualquer número do dashboard pra ver detalhes',
      ]} />

      <HeroMetric
        label="Impacto projetado das suas demandas em execução"
        value="R$ 412k"
        sub="economia operacional + redução de inadimplência + ganhos de eficiência (anualizado)"
        trend="R$ 87k"
        trendDir="up"
        sparklineData={[280, 295, 310, 325, 340, 355, 370, 380, 395, 412]}
        sparklineLabel="últimos 10 meses"
        accent={persona.color}
        drilldownKey="submitter-impacto"
      />

      {/* Showcase RP */}
      <div onClick={() => navigate('showcase-rp')}
        className="border-2 rounded-lg p-4 mb-6 cursor-pointer hover:shadow-md"
        style={{ borderColor: '#FCD34D', backgroundColor: '#FFFBEB' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F59E0B', color: 'white' }}>
              <Sparkles size={18} />
            </div>
            <div>
              <div className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>Case de exemplo · RP-2026-000 v1.0</div>
              <div className="text-xs" style={{ color: COLORS.textSecondary }}>Veja como fica um Readiness Package final pronto (WebSocket notifications)</div>
            </div>
          </div>
          <Button size="sm" icon={ArrowRight}>Abrir exemplo</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <KPICard label="Total submetidas" value={14} sub="desde início de 2026" icon={FileText} accent={persona.color} drilldownKey="submitter-total" />
        <KPICard label="Em execução" value={3} sub="21% da base" icon={Play} accent={COLORS.success} drilldownKey="submitter-execucao" />
        <KPICard label="Taxa de conversão" value={64} suffix="%" trend="+4pp" trendDir="up" sub="demanda → RP" icon={CheckCircle2} accent={COLORS.info} />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <KPICard label="Lead time médio" value={8.5} suffix="dias" trend="-1.2d" trendDir="up" sub="submissão → congelado" icon={Clock} accent={COLORS.warning} />
        <KPICard label="Aceite 1ª versão" value={78} suffix="%" trend="+6pp" trendDir="up" sub="sem v1.1" icon={Award} accent="#8B5CF6" />
        <KPICard label="Stakeholder em" value={9} sub="RPs publicados" icon={Users} accent="#0891B2" />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="col-span-2">
          <ChartCard title="Funil das suas demandas" subtitle="Onde a base de 14 se acomoda">
            <Funnel steps={[
              { label: 'Submetidas', value: 14, color: COLORS.info },
              { label: 'Aprovadas em triagem', value: 11, color: '#F97316' },
              { label: 'RP congelado', value: 9, color: '#8B5CF6' },
              { label: 'Aceitas pelo PM', value: 7, color: COLORS.success },
              { label: 'Em execução', value: 3, color: '#059669' },
            ]} />
          </ChartCard>
        </div>
        <ChartCard title="Submissões / mês" subtitle="Últimos 12 meses">
          <BarMini data={[2, 1, 3, 2, 4, 5, 3, 6, 4, 7, 6, 8]} color={persona.color} height={80} labels={['jun/25', '', '', '', '', '', '', '', '', '', '', 'mai/26']} />
        </ChartCard>
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: COLORS.textMuted }}>Suas demandas ativas</h2>
        <Button size="sm" icon={Plus} onClick={() => navigate('new-demand')}>Nova Demanda</Button>
      </div>

      <div className="space-y-2">
        <div onClick={() => navigate('capture-queue')}
          className="border rounded-lg p-4 cursor-pointer hover-lift"
          style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <FileText size={14} style={{ color: COLORS.textMuted }} />
                <span className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>{demandTitle}</span>
              </div>
              <div className="flex items-center gap-3 text-xs mb-2">
                <StatusPill status={demandState} />
                <span style={{ color: COLORS.textMuted }}>Score: {captureScore}%</span>
                <span style={{ color: COLORS.textMuted }}>há 1 dia</span>
              </div>
            </div>
            <ChevronRight size={16} style={{ color: COLORS.textMuted }} />
          </div>
        </div>
        {OTHER_DEMANDS.map(d => (
          <div key={d.id} className="border rounded-lg p-4" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
            <div className="flex items-center gap-2 mb-1">
              <FileText size={14} style={{ color: COLORS.textMuted }} />
              <span className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>{d.title}</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <StatusPill status={d.state} />
              {d.score !== undefined && <span style={{ color: COLORS.textMuted }}>Score: {d.score}%</span>}
              <span style={{ color: COLORS.textMuted }}>{d.updated}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PODashboard() {
  const { navigate, persona, demandState } = useApp();
  const demandReadyToFreeze = demandState === 'Pronto para Congelamento';
  const demandReturned = demandState === 'Devolvido pelo PM';

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-bold mb-1 tracking-tight" style={{ color: COLORS.textPrimary }}>Bom dia, {persona.name.split(' ')[0]}.</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.textSecondary }}>Saúde do funil de produto, gargalos e o que precisa da sua atenção agora.</p>

      <TourBanner personaId="po" title="Como PO você vai..." items={[
        'Triar demandas novas (Product Ready, Discovery, Backlog ou Rejeitar)',
        'Racionalizar com 12 pendências em workspace dedicado',
        'Congelar a v1.0 do RP depois que o CTO devolver',
        'Clicar em qualquer KPI pra ver a lista que o compõe',
      ]} />

      <HeroMetric
        label="Throughput do mês — demandas que viraram RP congelado"
        value="9" suffix="RPs"
        trend="+2 vs mês anterior" trendDir="up"
        sub="média rolling de 12m: 7.3 RPs/mês · meta trimestral: 24"
        sparklineData={[5, 6, 4, 7, 8, 6, 5, 7, 9, 8, 7, 9]}
        sparklineLabel="últimos 12 meses"
        accent={persona.color}
        drilldownKey="po-throughput"
      />

      {(demandReadyToFreeze || demandReturned) && (
        <div className="mb-6 space-y-2">
          {demandReadyToFreeze && (
            <div onClick={() => navigate('rp-freeze')}
              className="border-2 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all"
              style={{ borderColor: COLORS.success, backgroundColor: `${COLORS.success}08` }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: COLORS.success, color: 'white' }}>
                    <Check size={18} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>
                      Gateway de Pagamento Recorrente · pronto para congelamento
                    </div>
                    <div className="text-xs" style={{ color: COLORS.textSecondary }}>CTO devolveu · 4 ADRs · 34 dias estimados</div>
                  </div>
                </div>
                <Button size="sm" icon={ArrowRight}>Congelar</Button>
              </div>
            </div>
          )}
          {demandReturned && (
            <div onClick={() => navigate('rp-revision')}
              className="border-2 rounded-lg p-4 cursor-pointer"
              style={{ borderColor: COLORS.warning, backgroundColor: `${COLORS.warning}08` }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: COLORS.warning, color: 'white' }}>
                    <AlertTriangle size={18} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>Devolvido pelo PM — v1.1 a gerar</div>
                    <div className="text-xs" style={{ color: COLORS.textSecondary }}>PM apontou gaps bloqueantes</div>
                  </div>
                </div>
                <Button size="sm" icon={ArrowRight}>Endereçar</Button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 mb-4">
        <CompactKPI label="Em triagem" value={4} suffix="demandas" trend={1} trendDir="up" icon={Inbox} accent={persona.color} drilldownKey="po-triagem" />
        <CompactKPI label="Em racionalização" value={4} suffix="ativas" icon={Layers} accent="#8B5CF6" drilldownKey="po-rac" />
        <CompactKPI label="SLA vencendo" value={2} suffix="<24h" trend={1} trendDir="up" icon={Timer} accent={COLORS.danger} drilldownKey="po-sla" />
      </div>
      <div className="grid grid-cols-3 gap-3 mb-8">
        <CompactKPI label="Aceite 1ª versão" value={78} suffix="%" trend="+6pp" trendDir="up" icon={Award} accent={COLORS.success} drilldownKey="po-aceite" />
        <CompactKPI label="Tempo até RP" value={6.2} suffix="dias" trend="-0.8d" trendDir="up" icon={Clock} accent={COLORS.warning} />
        <CompactKPI label="Discoveries ativos" value={3} suffix="abertos" icon={Search} accent={COLORS.info} drilldownKey="po-discovery" />
      </div>

      <div className="grid grid-cols-12 gap-4 mb-8">
        <div className="col-span-7">
          <ChartCard title="Funil de produto" subtitle="Conversão por etapa (últimos 90 dias)">
            <Funnel steps={[
              { label: 'Triagem', value: 28, color: '#F97316' },
              { label: 'Aprovadas', value: 22, color: '#FB923C' },
              { label: 'Racionalização', value: 18, color: '#8B5CF6' },
              { label: 'Av. técnica CTO', value: 14, color: '#7C3AED' },
              { label: 'RP congelado', value: 11, color: COLORS.success },
              { label: 'Aceitas PM', value: 9, color: '#059669' },
            ]} />
          </ChartCard>
        </div>
        <div className="col-span-5">
          <ChartCard title="Decisões de triagem" subtitle="Distribuição dos últimos 90 dias">
            <DonutChart
              segments={[
                { label: 'Product Ready', value: 18, color: COLORS.success },
                { label: 'Discovery', value: 5, color: COLORS.warning },
                { label: 'Backlog', value: 3, color: COLORS.textMuted },
                { label: 'Rejeitadas', value: 2, color: COLORS.danger },
              ]}
              centerValue="28" centerLabel="total"
            />
          </ChartCard>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 mb-8">
        <div className="col-span-5">
          <ChartCard title="Volume semanal" subtitle="Triagens + RPs congelados">
            <BarMini data={[3, 5, 4, 6, 7, 5, 8, 6, 7, 9, 6, 9]} color={persona.color} height={80} labels={['s1', '', '', '', '', '', '', '', '', '', '', 's12']} />
          </ChartCard>
        </div>
        <div className="col-span-7">
          <ChartCard title="Onde mais perde-se tempo" subtitle="Dias médios em cada etapa">
            <HorizontalBars
              items={[
                { label: 'Captura → Triagem', value: 0.8, color: COLORS.info },
                { label: 'Triagem (decisão)', value: 1.2, color: '#F97316' },
                { label: 'Racionalização', value: 2.4, color: '#8B5CF6' },
                { label: 'Avaliação técnica', value: 1.6, color: '#7C3AED' },
                { label: 'Congelamento', value: 0.6, color: COLORS.success },
              ]}
              max={3}
              formatValue={(v) => `${v}d`}
            />
          </ChartCard>
        </div>
      </div>

      <section className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: COLORS.textMuted }}>Fila de Triagem ({TRIAGE_QUEUE.length})</h2>
          <button onClick={() => navigate('triage-queue')} className="text-xs font-medium" style={{ color: persona.color }}>Ver todas →</button>
        </div>
        <div className="space-y-2">
          {TRIAGE_QUEUE.slice(0, 3).map(d => (
            <div key={d.id} onClick={() => navigate(d.isMain ? 'triage-detail' : 'triage-queue')}
              className="border rounded-lg p-4 cursor-pointer hover:shadow-sm"
              style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
              <div className="flex items-start gap-3">
                <span className="text-xs font-semibold px-2 py-0.5 rounded flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: `${d.priorityColor}15`, color: d.priorityColor }}>{d.priority}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm mb-1" style={{ color: COLORS.textPrimary }}>{d.title}</div>
                  <div className="flex items-center gap-2 text-xs mb-2" style={{ color: COLORS.textMuted }}>
                    <span>De: {d.from}</span><span>·</span><span>{d.arrived}</span><span>·</span><span>SLA: {d.sla}</span>
                  </div>
                  <div className="text-sm" style={{ color: COLORS.textSecondary }}>"{d.preview}"</div>
                </div>
                <ChevronRight size={16} className="flex-shrink-0 mt-1" style={{ color: COLORS.textMuted }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function CTODashboard() {
  const { navigate, persona, demandState } = useApp();
  const demandReadyForCTO = demandState === 'Em Avaliação Técnica';
  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-bold mb-1 tracking-tight" style={{ color: COLORS.textPrimary }}>Bom dia, {persona.name.split(' ')[0]}.</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.textSecondary }}>Saúde técnica, dívida arquitetural e o que está esperando sua decisão.</p>

      <TourBanner personaId="cto" title="Como CTO você vai..." items={[
        'Receber demandas escaladas pelo PO',
        'Preencher 15 pendências técnicas (cada uma com sugestão da plataforma)',
        'Registrar ADRs (4 sugeridas pré-preenchidas)',
        'Decidir se há bloqueador crítico',
      ]} />

      <HeroMetric
        label="Esforço técnico estimado em backlog ativo"
        value="187" suffix="dias úteis"
        trend="-12d vs mês anterior" trendDir="up"
        sub="distribuído em 8 avaliações abertas + 3 escaladas pendentes"
        sparklineData={[210, 218, 205, 220, 215, 212, 220, 218, 210, 200, 195, 187]}
        sparklineLabel="últimos 12 meses"
        accent={persona.color}
        drilldownKey="cto-backlog"
      />

      {demandReadyForCTO && (
        <div onClick={() => navigate('tech-evaluation')}
          className="border-2 rounded-lg p-4 mb-6 cursor-pointer hover:shadow-md"
          style={{ borderColor: persona.color, backgroundColor: `${persona.color}08` }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: persona.color, color: 'white' }}>
                <Settings size={18} />
              </div>
              <div>
                <div className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>Gateway de Pagamento Recorrente · aguardando você</div>
                <div className="text-xs" style={{ color: COLORS.textSecondary }}>Escalado por Marina · score PO 100% · há 1 dia</div>
              </div>
            </div>
            <Button size="sm" icon={ArrowRight}>Iniciar avaliação</Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 mb-4">
        <CompactKPI label="Av. pendentes" value={demandReadyForCTO ? 1 : 0} suffix="escaladas" icon={Inbox} accent={persona.color} drilldownKey="cto-pendentes" />
        <CompactKPI label="Em andamento" value={2} suffix="avaliações" icon={Activity} accent="#7C3AED" drilldownKey="cto-andamento" />
        <CompactKPI label="Bloqueadores YTD" value={3} trend="-1 vs T1" trendDir="up" icon={AlertOctagon} accent={COLORS.danger} drilldownKey="cto-bloq" />
      </div>
      <div className="grid grid-cols-3 gap-3 mb-8">
        <CompactKPI label="ADRs este mês" value={11} suffix="criadas" trend="+3" trendDir="up" icon={GitBranch} accent={COLORS.success} drilldownKey="cto-adrs" />
        <CompactKPI label="Tempo médio av." value={3.2} suffix="dias" trend="-0.4d" trendDir="up" icon={Timer} accent={COLORS.warning} />
        <CompactKPI label="Re-trabalho v1.1" value={9} suffix="%" trend="-3pp" trendDir="up" sub="por questão técnica" icon={Shield} accent={COLORS.info} drilldownKey="cto-retrabalho" />
      </div>

      <div className="grid grid-cols-12 gap-4 mb-8">
        <div className="col-span-7">
          <ChartCard title="ADRs por categoria" subtitle="Distribuição total (YTD: 47 ADRs)">
            <HorizontalBars items={[
              { label: 'Arquitetura', value: 18, color: '#8B5CF6' },
              { label: 'Segurança', value: 12, color: COLORS.danger },
              { label: 'Dados', value: 8, color: COLORS.info },
              { label: 'Operação / Rollout', value: 6, color: COLORS.warning },
              { label: 'Performance', value: 3, color: COLORS.success },
            ]} max={20} />
          </ChartCard>
        </div>
        <div className="col-span-5">
          <ChartCard title="Distribuição de risco" subtitle="Avaliações ativas">
            <DonutChart segments={[
              { label: 'Risco alto', value: 2, color: COLORS.danger },
              { label: 'Risco médio', value: 5, color: COLORS.warning },
              { label: 'Risco baixo', value: 4, color: COLORS.success },
            ]} centerValue="11" centerLabel="avaliações" />
          </ChartCard>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 mb-8">
        <div className="col-span-7">
          <ChartCard title="Velocity de avaliações" subtitle="Concluídas por semana (12 semanas)">
            <BarMini data={[2, 3, 1, 4, 3, 5, 2, 4, 3, 4, 5, 4]} color={persona.color} height={80} labels={['s1', '', '', '', '', '', '', '', '', '', '', 's12']} />
          </ChartCard>
        </div>
        <div className="col-span-5">
          <ChartCard title="Riscos mais mapeados" subtitle="Top 5 (últimos 90 dias)">
            <HorizontalBars items={[
              { label: 'Latência integração', value: 7, color: COLORS.warning },
              { label: 'PCI / LGPD', value: 5, color: COLORS.danger },
              { label: 'Resistência rollout', value: 4, color: '#8B5CF6' },
              { label: 'Dependência externa', value: 3, color: COLORS.info },
              { label: 'Migração dados', value: 2, color: COLORS.textSecondary },
            ]} max={8} />
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

function PMDashboard() {
  const { navigate, persona, demandState, rpVersion } = useApp();
  const rpReady = demandState === 'RP Congelado';
  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-bold mb-1 tracking-tight" style={{ color: COLORS.textPrimary }}>Bom dia, {persona.name.split(' ')[0]}.</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.textSecondary }}>Qualidade dos RPs que você recebe e velocity até execução.</p>

      <TourBanner personaId="pm" title="Como PM você vai..." items={[
        'Receber RP congelado pela PO',
        'Selecionar trechos para comentar, perguntar ou apontar gaps',
        'Aceitar ou devolver com gaps (v1.1)',
      ]} />

      <HeroMetric
        label="Taxa de aceite de RPs na 1ª revisão"
        value="74" suffix="%"
        trend="+8pp YTD" trendDir="up"
        sub="dos 27 RPs avaliados, 20 foram aceitos sem v1.1 — meta 80%"
        sparklineData={[58, 60, 62, 65, 64, 68, 70, 69, 71, 72, 73, 74]}
        sparklineLabel="evolução 12 meses"
        accent={persona.color}
        drilldownKey="pm-aceite"
      />

      {/* Showcase RP — sempre visível */}
      <div onClick={() => navigate('showcase-rp')}
        className="border-2 rounded-lg p-4 mb-6 cursor-pointer hover:shadow-md"
        style={{ borderColor: '#FCD34D', backgroundColor: '#FFFBEB' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F59E0B', color: 'white' }}>
              <Sparkles size={18} />
            </div>
            <div>
              <div className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>Case de exemplo · RP-2026-000 v1.0</div>
              <div className="text-xs" style={{ color: COLORS.textSecondary }}>Notificações em tempo real via WebSocket · veja como fica um RP final pronto</div>
            </div>
          </div>
          <Button size="sm" icon={ArrowRight}>Abrir exemplo</Button>
        </div>
      </div>

      {rpReady && (
        <div onClick={() => navigate('rp-view')}
          className="border-2 rounded-lg p-4 mb-6 cursor-pointer hover:shadow-md"
          style={{ borderColor: persona.color, backgroundColor: `${persona.color}08` }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: persona.color, color: 'white' }}>
                <Layers size={18} />
              </div>
              <div>
                <div className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>RP-2026-001 {rpVersion || 'v1.0'} — Gateway de Pagamento</div>
                <div className="text-xs" style={{ color: COLORS.textSecondary }}>34 dias úteis estimados · 4 ADRs · congelado agora</div>
              </div>
            </div>
            <Button size="sm" icon={ArrowRight}>Abrir RP</Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 mb-4">
        <CompactKPI label="Aguardando avaliação" value={rpReady ? 1 : 0} suffix="RPs" icon={Inbox} accent={persona.color} drilldownKey="pm-aguardando" />
        <CompactKPI label="Tempo até aceite" value={2.1} suffix="dias" trend="-0.3d" trendDir="up" icon={Clock} accent={COLORS.warning} />
        <CompactKPI label="Em execução" value={3} suffix="ativas" icon={Play} accent={COLORS.success} drilldownKey="pm-execucao" />
      </div>
      <div className="grid grid-cols-3 gap-3 mb-8">
        <CompactKPI label="Gaps YTD" value={14} sub="3 bloqueantes" icon={AlertTriangle} accent={COLORS.warning} drilldownKey="pm-gaps" />
        <CompactKPI label="Comentários ativos" value={5} sub="sem resposta" icon={MessageSquare} accent={COLORS.info} />
        <CompactKPI label="Aceitos no ano" value={20} suffix="de 27" trend="+8" trendDir="up" icon={Award} accent={COLORS.success} drilldownKey="pm-aceite" />
      </div>

      <div className="grid grid-cols-12 gap-4 mb-8">
        <div className="col-span-7">
          <ChartCard title="Funil de RPs" subtitle="Da recepção à execução (90 dias)">
            <Funnel steps={[
              { label: 'Recebidos', value: 27, color: '#8B5CF6' },
              { label: 'Lidos integralmente', value: 27, color: '#A78BFA' },
              { label: 'Comentados', value: 22, color: COLORS.info },
              { label: 'Aceitos 1ª vez', value: 20, color: COLORS.success },
              { label: 'Em execução', value: 18, color: '#059669' },
            ]} />
          </ChartCard>
        </div>
        <div className="col-span-5">
          <ChartCard title="Motivos de devolução" subtitle="dos 7 RPs devolvidos YTD">
            <DonutChart segments={[
              { label: 'Escopo ambíguo', value: 3, color: COLORS.warning },
              { label: 'Gap técnico', value: 2, color: COLORS.danger },
              { label: 'Dados insuficientes', value: 1, color: COLORS.info },
              { label: 'Estimativa irreal', value: 1, color: '#8B5CF6' },
            ]} centerValue="7" centerLabel="devoluções" />
          </ChartCard>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 mb-8">
        <div className="col-span-7">
          <ChartCard title="Seções que mais geram gaps" subtitle="(últimos 90 dias)">
            <HorizontalBars items={[
              { label: 'Critérios de aceite', value: 32, color: COLORS.danger },
              { label: 'Escopo IN/OUT', value: 24, color: COLORS.warning },
              { label: 'Riscos técnicos', value: 18, color: '#8B5CF6' },
              { label: 'Estimativa', value: 14, color: COLORS.info },
              { label: 'Dependências', value: 8, color: COLORS.textSecondary },
              { label: 'Rollout', value: 4, color: COLORS.success },
            ]} max={35} formatValue={(v) => `${v}%`} />
          </ChartCard>
        </div>
        <div className="col-span-5">
          <ChartCard title="RPs aceitos / mês" subtitle="Últimos 12 meses">
            <BarMini data={[1, 2, 1, 2, 2, 1, 2, 3, 2, 1, 2, 1]} color={persona.color} height={80} labels={['jun/25', '', '', '', '', '', '', '', '', '', '', 'mai/26']} />
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

function ViewerDashboard() {
  const { navigate, persona, demandState, rpVersion } = useApp();
  const rpReady = demandState === 'RP Congelado';
  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-bold mb-1 tracking-tight" style={{ color: COLORS.textPrimary }}>Bom dia, {persona.name.split(' ')[0]}.</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.textSecondary }}>Visão executiva — investimento, ROI e impacto financeiro dos RPs.</p>

      <TourBanner personaId="viewer" title="Como Viewer (CFO) você vai..." items={[
        'Ler RPs publicados onde você é stakeholder',
        'Comentar ou perguntar (não pode apontar gaps)',
        'Acompanhar investimento e ROI projetado',
      ]} />

      <HeroMetric
        label="Investimento total comprometido em RPs ativos"
        value="R$ 1.84M"
        sub="9 RPs · ROI projetado: R$ 412k/ano · payback médio: 22 meses"
        trend="R$ 320k vs T1" trendDir="up"
        sparklineData={[1.2, 1.3, 1.35, 1.4, 1.45, 1.5, 1.55, 1.6, 1.68, 1.72, 1.78, 1.84]}
        sparklineLabel="evolução YTD (R$ M)"
        accent={persona.color}
        drilldownKey="cfo-investimento"
      />

      {/* Showcase RP */}
      <div onClick={() => navigate('showcase-rp')}
        className="border-2 rounded-lg p-4 mb-6 cursor-pointer hover:shadow-md"
        style={{ borderColor: '#FCD34D', backgroundColor: '#FFFBEB' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F59E0B', color: 'white' }}>
              <Sparkles size={18} />
            </div>
            <div>
              <div className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>Case de exemplo · RP-2026-000 v1.0</div>
              <div className="text-xs" style={{ color: COLORS.textSecondary }}>Notificações em tempo real via WebSocket · veja um RP final pronto</div>
            </div>
          </div>
          <Button size="sm" icon={ArrowRight}>Abrir exemplo</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <CompactKPI label="RPs stakeholder" value={9} suffix="ativos" icon={FileText} accent={persona.color} drilldownKey="cfo-investimento" />
        <CompactKPI label="ROI projetado" value="R$ 412k" trend="+R$ 87k" trendDir="up" icon={TrendingUp} accent={COLORS.success} drilldownKey="cfo-roi" />
        <CompactKPI label="Esforço comprometido" value={284} suffix="dias úteis" icon={Briefcase} accent={COLORS.warning} />
      </div>
      <div className="grid grid-cols-3 gap-3 mb-8">
        <CompactKPI label="Afetam CAPEX" value={4} suffix="RPs" icon={DollarSign} accent={COLORS.info} drilldownKey="cfo-capex" />
        <CompactKPI label="Comentários" value={3} sub="2 respondidos" icon={MessageSquare} accent="#8B5CF6" />
        <CompactKPI label="Releases 30d" value={2} sub="entregas previstas" icon={Target} accent={COLORS.danger} />
      </div>

      <div className="grid grid-cols-12 gap-4 mb-8">
        <div className="col-span-7">
          <ChartCard title="Investimento por demanda" subtitle="R$ comprometido em RPs ativos">
            <HorizontalBars items={[
              { label: 'Gateway de Pagamento', value: 340, color: persona.color },
              { label: 'Notificações push', value: 280, color: '#8B5CF6' },
              { label: 'Refator billing', value: 250, color: COLORS.info },
              { label: 'Onboarding refeito', value: 220, color: COLORS.success },
              { label: 'Migração de auth', value: 195, color: COLORS.warning },
              { label: 'Performance dashboard', value: 165, color: '#0891B2' },
              { label: 'Integração SAP', value: 145, color: '#A78BFA' },
              { label: 'Outros (2 RPs)', value: 245, color: COLORS.textMuted },
            ]} max={350} formatValue={(v) => `R$ ${v}k`} />
          </ChartCard>
        </div>
        <div className="col-span-5">
          <ChartCard title="Distribuição financeira" subtitle="CAPEX vs OPEX">
            <DonutChart segments={[
              { label: 'CAPEX (4 RPs)', value: 1100, color: persona.color },
              { label: 'OPEX (5 RPs)', value: 740, color: COLORS.info },
            ]} centerValue="R$1.84M" centerLabel="total" />
          </ChartCard>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 mb-8">
        <div className="col-span-7">
          <ChartCard title="ROI por categoria" subtitle="Retorno anual estimado">
            <HorizontalBars items={[
              { label: 'Redução custo operacional', value: 180, color: COLORS.success },
              { label: 'Redução inadimplência', value: 105, color: '#059669' },
              { label: 'Ganho de produtividade', value: 78, color: COLORS.info },
              { label: 'Aumento de receita', value: 49, color: '#8B5CF6' },
            ]} max={200} formatValue={(v) => `R$ ${v}k`} />
          </ChartCard>
        </div>
        <div className="col-span-5">
          <ChartCard title="Histórico de investimento" subtitle="R$ por trimestre">
            <BarMini data={[280, 420, 580, 720, 1100, 1400, 1840]} color={persona.color} height={80} labels={['T3/24', '', '', '', '', '', 'T2/26']} />
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const { persona } = useApp();
  if (persona?.id === 'submitter') return <SubmitterDashboard />;
  if (persona?.id === 'po') return <PODashboard />;
  if (persona?.id === 'cto') return <CTODashboard />;
  if (persona?.id === 'pm') return <PMDashboard />;
  if (persona?.id === 'viewer') return <ViewerDashboard />;
  return null;
}

// ============================================================
// FLUXO: NEW DEMAND (Submitter)
// ============================================================
function NewDemandScreen() {
  const { navigate, showToast } = useApp();
  const [text, setText] = useState('A gente precisa começar a receber pagamento por cartão recorrente. Hoje é tudo boleto e isso tá nos atrasando — o time financeiro perde umas 30 horas por mês reconciliando manualmente.');
  const [processing, setProcessing] = useState(false);

  const handleContinue = () => {
    setProcessing(true);
    setTimeout(() => {
      navigate('capture-queue');
      showToast('Demanda DEM-2026-001 criada');
    }, 2500);
  };

  if (processing) {
    return (
      <div className="max-w-2xl mx-auto pt-16">
        <div className="border rounded-lg p-12 text-center" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
          <Loader2 size={32} className="animate-spin mb-3 mx-auto" style={{ color: COLORS.info }} />
          <div className="text-xl font-semibold mb-2" style={{ color: COLORS.textPrimary }}>Processando...</div>
          <div className="text-sm" style={{ color: COLORS.textSecondary }}>Lendo seu texto e identificando informações úteis.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <button onClick={() => navigate('dashboard')} className="flex items-center gap-1 text-sm mb-4" style={{ color: COLORS.textSecondary }}>
        <ChevronLeft size={14} /> Voltar
      </button>
      <h1 className="text-2xl font-bold mb-2" style={{ color: COLORS.textPrimary }}>Nova Demanda</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.textSecondary }}>Conta como se estivesse falando com um colega.</p>

      <div className="border rounded-lg p-6" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={8}
          className="w-full p-3 text-sm rounded-md border focus:outline-none resize-none"
          style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg, color: COLORS.textPrimary }}
        />
        <div className="flex gap-2 mt-3">
          <Button variant="secondary" size="sm" icon={Paperclip}>Subir documento</Button>
          <Button variant="secondary" size="sm" icon={Mic}>Gravar áudio</Button>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="secondary" onClick={() => navigate('dashboard')}>Cancelar</Button>
        <Button icon={ArrowRight} disabled={!text.trim()} onClick={handleContinue}>Continuar</Button>
      </div>
    </div>
  );
}

// ============================================================
// FLUXO: CAPTURE QUEUE (Submitter)
// ============================================================
function CaptureQueueScreen() {
  const { capturePendencies, captureScore, navigate, demandTitle, setDemandState, showToast } = useApp();
  const [selected, setSelected] = useState(null);

  const empty = capturePendencies.filter(p => p.status === 'empty');
  const lowConf = capturePendencies.filter(p => p.status === 'low_confidence');
  const resolved = capturePendencies.filter(p => ['resolved', 'manually_accepted'].includes(p.status));

  return (
    <div className="max-w-4xl">
      <button onClick={() => navigate('dashboard')} className="flex items-center gap-1 text-sm mb-4" style={{ color: COLORS.textSecondary }}>
        <ChevronLeft size={14} /> Dashboard
      </button>
      <div className="flex items-center gap-3 mb-2">
        <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: COLORS.bgSubtle, color: COLORS.textSecondary }}>DEM-2026-001</span>
        <StatusPill status="Em Captura" />
      </div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: COLORS.textPrimary }}>{demandTitle}</h1>

      <div className="border rounded-lg p-6 mb-8 flex items-center gap-8" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <ScoreRing score={captureScore} size={96} strokeWidth={8} />
        <div>
          <div className="text-xs uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>Próximo passo</div>
          <div className="text-base font-semibold" style={{ color: COLORS.textPrimary }}>
            {captureScore === 100 ? 'Enviar à Triagem' : `Responder ${empty.length + lowConf.length} pendências`}
          </div>
        </div>
      </div>

      {empty.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: COLORS.danger }}>Vazias · {empty.length}</h2>
          <div className="space-y-2">
            {empty.map(p => <PendencyCard key={p.id} pendency={p} onClick={() => setSelected(p)} />)}
          </div>
        </section>
      )}
      {lowConf.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: COLORS.warning }}>Baixa confiança · {lowConf.length}</h2>
          <div className="space-y-2">
            {lowConf.map(p => <PendencyCard key={p.id} pendency={p} onClick={() => setSelected(p)} />)}
          </div>
        </section>
      )}
      <section className="mb-20">
        <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: COLORS.success }}>Resolvidas · {resolved.length}</h2>
        <div className="space-y-2">
          {resolved.map(p => <PendencyCard key={p.id} pendency={p} onClick={() => setSelected(p)} />)}
        </div>
      </section>

      <div className="fixed bottom-4 left-64 right-4 max-w-4xl mx-auto border rounded-lg p-4 flex items-center justify-between shadow-md"
        style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="text-xs" style={{ color: COLORS.textMuted }}>
          {captureScore === 100 ? 'Pronto pra enviar' : `Faltam ${100 - captureScore}%`}
        </div>
        <Button icon={Send} disabled={captureScore !== 100}
          onClick={() => { setDemandState('Em Triagem'); showToast('Demanda enviada à Triagem'); navigate('dashboard'); }}>
          Enviar para Triagem
        </Button>
      </div>

      {selected && <CapturePendencyModal pendency={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function CapturePendencyModal({ pendency, onClose }) {
  const { updatePendency, showToast } = useApp();
  const [text, setText] = useState(pendency.a || '');

  const handleSave = () => {
    if (!text.trim()) return;
    updatePendency(pendency.id, { a: text, confidence: 95, status: 'resolved' });
    showToast('Pendência respondida');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-2xl rounded-xl shadow-2xl border"
        style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: COLORS.border }}>
          <div className="font-semibold text-base" style={{ color: COLORS.textPrimary }}>{pendency.q}</div>
        </div>
        <div className="p-6">
          {pendency.hint && (
            <div className="mb-4 p-3 rounded-md text-xs flex gap-2" style={{ backgroundColor: `${COLORS.info}10`, color: COLORS.textPrimary }}>
              <Sparkles size={14} style={{ color: COLORS.info, flexShrink: 0 }} />
              <span><strong>Dica:</strong> {pendency.hint}</span>
            </div>
          )}
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={6}
            placeholder="Sua resposta..."
            className="w-full p-3 text-sm rounded-md border focus:outline-none resize-none"
            style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg, color: COLORS.textPrimary }}
          />
        </div>
        <div className="px-6 py-4 border-t flex justify-end gap-2" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button disabled={!text.trim()} onClick={handleSave}>Salvar</Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// FLUXO: TRIAGE (PO)
// ============================================================
function TriageQueueScreen() {
  const { navigate, demandState } = useApp();
  return (
    <div className="max-w-5xl">
      <button onClick={() => navigate('dashboard')} className="flex items-center gap-1 text-sm mb-4" style={{ color: COLORS.textSecondary }}>
        <ChevronLeft size={14} /> Dashboard
      </button>
      <h1 className="text-2xl font-bold mb-6" style={{ color: COLORS.textPrimary }}>Fila de Triagem</h1>
      <div className="space-y-2">
        {TRIAGE_QUEUE.map(d => {
          const isMain = d.isMain && demandState === 'Em Triagem';
          return (
            <div key={d.id} onClick={() => isMain && navigate('triage-detail')}
              className={`border rounded-lg p-4 ${isMain ? 'cursor-pointer hover-lift' : 'opacity-60'}`}
              style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
              <div className="flex items-start gap-3">
                <span className="text-xs font-semibold px-2 py-0.5 rounded flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: `${d.priorityColor}15`, color: d.priorityColor }}>{d.priority}</span>
                <div className="flex-1">
                  <div className="font-semibold text-sm mb-1" style={{ color: COLORS.textPrimary }}>{d.title}</div>
                  <div className="text-xs" style={{ color: COLORS.textMuted }}>De: {d.from} · {d.arrived} · SLA: {d.sla}</div>
                </div>
                {isMain && <Button size="sm" icon={ArrowRight}>Triar</Button>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TriageDetailScreen() {
  const { navigate, capturePendencies, demandTitle, triageItems, updateTriageItem, triageScore, setDemandState, showToast } = useApp();
  const [selected, setSelected] = useState(null);
  const canConclude = triageScore === 100;

  return (
    <div className="max-w-6xl">
      <button onClick={() => navigate('triage-queue')} className="flex items-center gap-1 text-sm mb-4" style={{ color: COLORS.textSecondary }}>
        <ChevronLeft size={14} /> Fila
      </button>
      <div className="flex items-center gap-3 mb-2">
        <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: COLORS.bgSubtle, color: COLORS.textSecondary }}>DEM-2026-001</span>
        <StatusPill status="Em Triagem" />
      </div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: COLORS.textPrimary }}>{demandTitle}</h1>

      <div className="grid grid-cols-2 gap-4 mb-20">
        <div className="border rounded-lg overflow-hidden" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
          <div className="px-4 py-3 border-b text-xs font-semibold uppercase tracking-wider" style={{ borderColor: COLORS.border, color: COLORS.textMuted, backgroundColor: COLORS.bgSubtle }}>
            Captura (read-only)
          </div>
          <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
            {capturePendencies.map(p => (
              <div key={p.id}>
                <div className="text-xs font-semibold mb-1" style={{ color: COLORS.textMuted }}>{p.q}</div>
                <div className="text-sm" style={{ color: COLORS.textPrimary }}>{p.a || '—'}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.textMuted }}>Sua decisão</div>
            <ScoreRing score={triageScore} size={32} strokeWidth={4} />
          </div>
          <div className="p-4 space-y-2">
            {triageItems.map(item => {
              const decided = item.decision !== null;
              return (
                <div key={item.id} onClick={() => setSelected(item)}
                  className="border rounded-md p-3 cursor-pointer hover:shadow-sm"
                  style={{ backgroundColor: decided ? `${COLORS.success}08` : COLORS.bg, borderColor: decided ? `${COLORS.success}40` : COLORS.border }}>
                  <div className="flex items-start gap-2">
                    {decided ? <CheckCircle2 size={16} style={{ color: COLORS.success }} /> : <AlertCircle size={16} style={{ color: COLORS.danger }} />}
                    <div className="text-sm font-medium flex-1" style={{ color: COLORS.textPrimary }}>{item.q}</div>
                    <ChevronRight size={14} style={{ color: COLORS.textMuted }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 left-64 right-4 max-w-6xl mx-auto border rounded-lg p-4 flex items-center justify-between shadow-md"
        style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="text-xs" style={{ color: COLORS.textMuted }}>Score: {triageScore}%</div>
        <Button size="sm" disabled={!canConclude} onClick={() => {
          const path = triageItems.find(t => t.isPath);
          const decision = path?.decision || 'Product Ready';
          if (decision === 'Product Ready') setDemandState('Em Racionalização');
          else if (decision === 'Backlog') setDemandState('Backlog');
          else if (decision === 'Rejeitar') setDemandState('Rejeitada');
          showToast(`Triagem concluída: ${decision}`);
          navigate('dashboard');
        }}>
          Concluir Triagem
        </Button>
      </div>

      {selected && <TriageItemModal item={selected} onClose={() => setSelected(null)}
        onSave={(decision, justification) => { updateTriageItem(selected.id, { decision, justification }); setSelected(null); }} />}
    </div>
  );
}

function TriageItemModal({ item, onClose, onSave }) {
  const [decision, setDecision] = useState(item.decision);
  const [justification, setJustification] = useState(item.justification || '');
  const isPath = item.isPath;

  const options = isPath
    ? [
      { value: 'Product Ready', label: 'Product Ready', desc: 'Vai direto pra Racionalização.' },
      { value: 'Discovery', label: 'Discovery', desc: 'Investigar antes.' },
      { value: 'Backlog', label: 'Backlog', desc: 'Não é prioridade.' },
      { value: 'Rejeitar', label: 'Rejeitar', desc: 'Não vai pra frente.' },
    ]
    : [
      { value: 'yes', label: 'Sim' },
      { value: 'no', label: 'Não' },
      { value: 'partial', label: 'Parcial' },
    ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-2xl rounded-xl shadow-2xl border"
        style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: COLORS.border }}>
          <div className="font-semibold text-base" style={{ color: COLORS.textPrimary }}>{item.q}</div>
        </div>
        <div className="p-6">
          <div className="mb-4 p-3 rounded-md text-sm" style={{ backgroundColor: `${COLORS.info}10`, color: COLORS.textPrimary }}>
            <strong>Sugestão da plataforma ({item.confidence}%):</strong> {item.suggestion}
          </div>
          <div className={isPath ? 'space-y-2' : 'flex gap-2'}>
            {options.map(opt => (
              <button key={opt.value} onClick={() => setDecision(opt.value)}
                className={`${isPath ? 'w-full text-left p-3' : 'flex-1 p-2.5'} rounded-md border`}
                style={{ borderColor: decision === opt.value ? COLORS.info : COLORS.border, backgroundColor: decision === opt.value ? `${COLORS.info}10` : COLORS.bg }}>
                <div className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>{opt.label}</div>
                {opt.desc && <div className="text-xs mt-1" style={{ color: COLORS.textSecondary }}>{opt.desc}</div>}
              </button>
            ))}
          </div>
          <textarea
            value={justification}
            onChange={e => setJustification(e.target.value)}
            rows={2}
            placeholder="Justificativa (opcional)"
            className="w-full mt-4 p-3 text-sm rounded-md border focus:outline-none resize-none"
            style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg, color: COLORS.textPrimary }}
          />
        </div>
        <div className="px-6 py-4 border-t flex justify-end gap-2" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button disabled={!decision} onClick={() => onSave(decision, justification)}>Confirmar</Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// FLUXO: RATIONALIZATION (PO)
// ============================================================
function RationalizationScreen() {
  const { navigate, racPendencies, racScore, demandTitle, showToast, setDemandState } = useApp();
  const [selected, setSelected] = useState(null);

  const empty = racPendencies.filter(p => p.status === 'empty');
  const lowConf = racPendencies.filter(p => p.status === 'low_confidence');
  const resolved = racPendencies.filter(p => ['resolved', 'manually_accepted'].includes(p.status));

  return (
    <div className="max-w-5xl">
      <button onClick={() => navigate('dashboard')} className="flex items-center gap-1 text-sm mb-4" style={{ color: COLORS.textSecondary }}>
        <ChevronLeft size={14} /> Dashboard
      </button>
      <div className="flex items-center gap-3 mb-2">
        <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: COLORS.bgSubtle, color: COLORS.textSecondary }}>DEM-2026-001</span>
        <StatusPill status="Em Racionalização" />
      </div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: COLORS.textPrimary }}>{demandTitle}</h1>

      <div className="border rounded-lg p-5 mb-6 flex items-center gap-6" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <ScoreRing score={racScore} size={80} strokeWidth={7} />
        <div className="flex-1">
          <div className="text-xs uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>Racionalização</div>
          <div className="text-base font-semibold" style={{ color: COLORS.textPrimary }}>
            {racScore === 100 ? 'Pronto pra escalar ao CTO' : `${empty.length + lowConf.length} pendências restantes`}
          </div>
        </div>
      </div>

      {empty.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: COLORS.danger }}>Vazias · {empty.length}</h2>
          <div className="space-y-2">{empty.map(p => <PendencyCard key={p.id} pendency={p} onClick={() => setSelected(p)} />)}</div>
        </section>
      )}
      {lowConf.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: COLORS.warning }}>Baixa confiança · {lowConf.length}</h2>
          <div className="space-y-2">{lowConf.map(p => <PendencyCard key={p.id} pendency={p} onClick={() => setSelected(p)} />)}</div>
        </section>
      )}
      <section className="mb-20">
        <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: COLORS.success }}>Resolvidas · {resolved.length}</h2>
        <div className="space-y-2">{resolved.map(p => <PendencyCard key={p.id} pendency={p} onClick={() => setSelected(p)} />)}</div>
      </section>

      <div className="fixed bottom-4 left-64 right-4 max-w-5xl mx-auto border rounded-lg p-4 flex items-center justify-between shadow-md"
        style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="text-xs" style={{ color: COLORS.textMuted }}>Score: {racScore}%</div>
        <Button size="sm" icon={Send} disabled={racScore !== 100}
          onClick={() => { setDemandState('Em Avaliação Técnica'); showToast('Escalado ao CTO'); navigate('dashboard'); }}>
          Enviar ao CTO
        </Button>
      </div>

      {selected && <RacPendencyModal pendency={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function RacPendencyModal({ pendency, onClose }) {
  const { updateRacPendency, showToast } = useApp();
  const [text, setText] = useState(pendency.a || '');

  const handleSave = () => {
    if (!text.trim()) return;
    updateRacPendency(pendency.id, { a: text, confidence: 92, status: 'resolved' });
    showToast('Resposta salva');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-2xl rounded-xl shadow-2xl border"
        style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: COLORS.border }}>
          <div className="text-xs uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>{pendency.section}</div>
          <div className="font-semibold text-base" style={{ color: COLORS.textPrimary }}>{pendency.q}</div>
        </div>
        <div className="p-6">
          {pendency.hint && (
            <div className="mb-4 p-3 rounded-md text-xs flex gap-2" style={{ backgroundColor: `${COLORS.info}10`, color: COLORS.textPrimary }}>
              <Sparkles size={14} style={{ color: COLORS.info, flexShrink: 0 }} />
              <span><strong>Dica:</strong> {pendency.hint}</span>
            </div>
          )}
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={6}
            className="w-full p-3 text-sm rounded-md border focus:outline-none resize-none"
            style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg, color: COLORS.textPrimary }}
          />
        </div>
        <div className="px-6 py-4 border-t flex justify-end gap-2" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button disabled={!text.trim()} onClick={handleSave}>Salvar</Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// FLUXO: TECH EVALUATION (CTO)
// ============================================================
function TechEvaluationScreen() {
  const { navigate, demandTitle, techPendencies, techScore, setDemandState, adrs, setAdrs, showToast, updateTechPendency } = useApp();
  const [selected, setSelected] = useState(null);
  const [showAdrModal, setShowAdrModal] = useState(false);

  const empty = techPendencies.filter(p => p.status === 'empty');
  const resolved = techPendencies.filter(p => ['resolved', 'manually_accepted'].includes(p.status));

  return (
    <div className="max-w-5xl">
      <button onClick={() => navigate('dashboard')} className="flex items-center gap-1 text-sm mb-4" style={{ color: COLORS.textSecondary }}>
        <ChevronLeft size={14} /> Dashboard
      </button>
      <div className="flex items-center gap-3 mb-2">
        <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: COLORS.bgSubtle, color: COLORS.textSecondary }}>DEM-2026-001</span>
        <StatusPill status="Em Avaliação Técnica" />
      </div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: COLORS.textPrimary }}>{demandTitle}</h1>

      <div className="border rounded-lg p-5 mb-6 flex items-center gap-6" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <ScoreRing score={techScore} size={80} strokeWidth={7} />
        <div className="flex-1">
          <div className="text-xs uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>Avaliação Técnica</div>
          <div className="text-base font-semibold" style={{ color: COLORS.textPrimary }}>
            {techScore === 100 ? 'Pronto pra anexar ao RP' : `${empty.length} pendências restantes`}
          </div>
          <div className="text-sm mt-1" style={{ color: COLORS.textSecondary }}>{adrs.length} ADR{adrs.length !== 1 ? 's' : ''} criada{adrs.length !== 1 ? 's' : ''}</div>
        </div>
      </div>

      <div className="border rounded-lg p-3 mb-4 flex items-center justify-between" style={{ backgroundColor: '#F5F3FF', borderColor: '#DDD6FE' }}>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#6D28D9' }}>ADRs</div>
          <div className="text-sm" style={{ color: COLORS.textPrimary }}>
            {adrs.length === 0 ? 'Nenhuma ainda — registre decisões' : `${adrs.length} ADRs registradas`}
          </div>
        </div>
        <Button variant="secondary" size="sm" icon={Plus} onClick={() => setShowAdrModal(true)}>Adicionar ADR</Button>
      </div>

      {empty.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: COLORS.danger }}>Pendentes · {empty.length}</h2>
          <div className="space-y-2">
            {empty.map(p => <PendencyCard key={p.id} pendency={p} onClick={() => setSelected(p)} />)}
          </div>
        </section>
      )}
      {resolved.length > 0 && (
        <section className="mb-20">
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: COLORS.success }}>Resolvidas · {resolved.length}</h2>
          <div className="space-y-2">
            {resolved.map(p => <PendencyCard key={p.id} pendency={p} onClick={() => setSelected(p)} />)}
          </div>
        </section>
      )}

      <div className="fixed bottom-4 left-64 right-4 max-w-5xl mx-auto border rounded-lg p-4 flex items-center justify-between shadow-md"
        style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="text-xs" style={{ color: COLORS.textMuted }}>Score: {techScore}%</div>
        <Button size="sm" icon={Send} disabled={techScore !== 100}
          onClick={() => { setDemandState('Pronto para Congelamento'); showToast('Avaliação anexada ao RP'); navigate('dashboard'); }}>
          Anexar ao RP
        </Button>
      </div>

      {selected && <TechPendencyModal pendency={selected} onClose={() => setSelected(null)} />}
      {showAdrModal && <ADRModal onClose={() => setShowAdrModal(false)} />}
    </div>
  );
}

function TechPendencyModal({ pendency, onClose }) {
  const { updateTechPendency, showToast } = useApp();
  const [text, setText] = useState(pendency.a || '');
  const suggestion = TECH_SUGGESTIONS[pendency.id];

  const handleSave = () => {
    if (!text.trim()) return;
    updateTechPendency(pendency.id, { a: text, confidence: 92, status: 'resolved' });
    showToast('Resposta salva');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-2xl rounded-xl shadow-2xl border"
        style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: COLORS.border }}>
          <div className="text-xs uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>{pendency.section}</div>
          <div className="font-semibold text-base" style={{ color: COLORS.textPrimary }}>{pendency.q}</div>
        </div>
        <div className="p-6">
          {suggestion && (
            <div className="mb-4 p-3 rounded-md" style={{ backgroundColor: `${COLORS.info}10` }}>
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-semibold flex items-center gap-1" style={{ color: COLORS.info }}>
                  <Sparkles size={12} /> Sugestão da plataforma
                </div>
                <Button variant="ghost" size="sm" onClick={() => setText(suggestion)}>Usar sugestão</Button>
              </div>
              <div className="text-sm" style={{ color: COLORS.textPrimary }}>{suggestion}</div>
            </div>
          )}
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={6}
            className="w-full p-3 text-sm rounded-md border focus:outline-none resize-none"
            style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg, color: COLORS.textPrimary }}
          />
        </div>
        <div className="px-6 py-4 border-t flex justify-end gap-2" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button disabled={!text.trim()} onClick={handleSave}>Salvar</Button>
        </div>
      </div>
    </div>
  );
}

function ADRModal({ onClose }) {
  const { adrs, setAdrs, showToast, updateTechPendency, techPendencies } = useApp();

  const addAllSuggested = () => {
    const newAdrs = SUGGESTED_ADRS.filter(s => !adrs.find(a => a.id === s.id));
    setAdrs(prev => [...prev, ...newAdrs]);

    const adrsP = techPendencies.find(p => p.isAdrs);
    if (adrsP) {
      const all = [...adrs, ...newAdrs];
      updateTechPendency(adrsP.id, {
        a: `${all.length} ADRs: ${all.map(a => a.title).join(', ')}`,
        confidence: 95,
        status: 'resolved',
      });
    }
    showToast(`${newAdrs.length} ADRs adicionadas`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-2xl rounded-xl shadow-2xl border max-h-[80vh] overflow-hidden flex flex-col"
        style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: COLORS.border }}>
          <div className="font-semibold text-base" style={{ color: COLORS.textPrimary }}>ADRs</div>
          <button onClick={onClose} className="p-1 hover:bg-stone-100 rounded">
            <X size={18} style={{ color: COLORS.textMuted }} />
          </button>
        </div>
        <div className="p-6 overflow-auto flex-1">
          {adrs.length > 0 && (
            <div className="mb-4">
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>Registradas</div>
              {adrs.map(a => (
                <div key={a.id} className="p-3 mb-2 rounded-md border" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
                  <div className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>{a.id} — {a.title}</div>
                </div>
              ))}
            </div>
          )}
          <div className="border rounded-md p-4" style={{ borderColor: `${COLORS.info}30`, backgroundColor: `${COLORS.info}08` }}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1" style={{ color: COLORS.info }}>
                <Sparkles size={12} /> Sugestões
              </div>
              <Button variant="secondary" size="sm" onClick={addAllSuggested}>Adicionar todas</Button>
            </div>
            {SUGGESTED_ADRS.filter(s => !adrs.find(a => a.id === s.id)).map(s => (
              <div key={s.id} className="p-3 mb-2 rounded border" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
                <div className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>{s.id} — {s.title}</div>
                <div className="text-xs mt-1" style={{ color: COLORS.textSecondary }}>{s.decision.slice(0, 100)}...</div>
              </div>
            ))}
          </div>
        </div>
        <div className="px-6 py-4 border-t flex justify-end" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// FLUXO: RP FREEZE (PO)
// ============================================================
function RPFreezeScreen() {
  const { navigate, demandTitle, showToast, setDemandState, setRpVersion, adrs } = useApp();
  const realAdrs = adrs.length > 0 ? adrs : SUGGESTED_ADRS;

  return (
    <div className="max-w-5xl">
      <button onClick={() => navigate('dashboard')} className="flex items-center gap-1 text-sm mb-4" style={{ color: COLORS.textSecondary }}>
        <ChevronLeft size={14} /> Dashboard
      </button>
      <div className="flex items-center gap-3 mb-2">
        <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: COLORS.bgSubtle, color: COLORS.textSecondary }}>DEM-2026-001</span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: '#E0E7FF', color: '#4338CA' }}>Pronto para Congelamento</span>
      </div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: COLORS.textPrimary }}>{demandTitle}</h1>

      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="border rounded-lg p-3" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
          <div className="text-xs uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>Score</div>
          <div className="text-xl font-bold" style={{ color: COLORS.success }}>100%</div>
        </div>
        <div className="border rounded-lg p-3" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
          <div className="text-xs uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>Confiança</div>
          <div className="text-xl font-bold" style={{ color: COLORS.info }}>97%</div>
        </div>
        <div className="border rounded-lg p-3" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
          <div className="text-xs uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>ADRs</div>
          <div className="text-xl font-bold" style={{ color: '#8B5CF6' }}>{realAdrs.length}</div>
        </div>
        <div className="border rounded-lg p-3" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
          <div className="text-xs uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>Estimativa</div>
          <div className="text-xl font-bold" style={{ color: COLORS.textPrimary }}>34d</div>
        </div>
      </div>

      <div className="border rounded-lg p-6 mb-20" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <h3 className="text-base font-bold mb-3" style={{ color: COLORS.textPrimary }}>Sumário Executivo</h3>
        <p className="text-sm mb-4" style={{ color: COLORS.textSecondary }}>
          Implementar gateway de pagamento recorrente via cartão de crédito, com fluxo opt-in para clientes em boleto. Reduzir 30h/mês de reconciliação manual e levar inadimplência de 18% para ≤10% em 6 meses. Integração via Stripe, com camada de abstração que permita troca futura de provider. {realAdrs.length} ADRs registradas.
        </p>
        <h3 className="text-base font-bold mb-3 mt-6" style={{ color: COLORS.textPrimary }}>ADRs registradas</h3>
        <div className="space-y-2">
          {realAdrs.map(a => (
            <div key={a.id} className="p-3 rounded-md border" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
              <div className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>{a.id} — {a.title}</div>
              <div className="text-xs mt-1" style={{ color: COLORS.textSecondary }}>{(a.decision || '').slice(0, 120)}...</div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-4 left-64 right-4 max-w-5xl mx-auto border rounded-lg p-4 flex items-center justify-between shadow-md"
        style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="text-xs" style={{ color: COLORS.textMuted }}>Score 100% · {realAdrs.length} ADRs</div>
        <Button size="sm" icon={Check} onClick={() => {
          setRpVersion('v1.0');
          setDemandState('RP Congelado');
          showToast('RP v1.0 congelado!');
          navigate('dashboard');
        }}>
          Congelar e Enviar ao PM
        </Button>
      </div>
    </div>
  );
}

// ============================================================
// FLUXO: RP VIEW (PM/Viewer)
// ============================================================
function RPViewScreen() {
  const { navigate, persona, demandTitle, demandState, rpVersion, adrs, showToast, setDemandState } = useApp();
  const isPM = persona?.id === 'pm';
  const realAdrs = adrs.length > 0 ? adrs : SUGGESTED_ADRS;

  if (demandState !== 'RP Congelado' && !rpVersion) {
    return (
      <div className="max-w-2xl mx-auto pt-16">
        <div className="border rounded-lg p-12 text-center" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
          <Layers size={32} className="mx-auto mb-3" style={{ color: COLORS.textMuted }} />
          <div className="text-lg font-semibold mb-2" style={{ color: COLORS.textPrimary }}>Nenhum RP congelado ainda</div>
          <div className="text-sm mb-6" style={{ color: COLORS.textSecondary }}>Troque para Marina (PO), finalize a Racionalização e congele a v1.0.</div>
          <Button variant="secondary" onClick={() => navigate('dashboard')}>Voltar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      <button onClick={() => navigate('dashboard')} className="flex items-center gap-1 text-sm mb-4" style={{ color: COLORS.textSecondary }}>
        <ChevronLeft size={14} /> Dashboard
      </button>

      {persona?.id === 'viewer' && (
        <div className="mb-4 p-3 rounded-md border flex items-center gap-2 text-sm" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle, color: COLORS.textSecondary }}>
          <Eye size={14} /> Você está como <strong>Viewer</strong> (somente leitura + comentários)
        </div>
      )}

      <div className="flex items-center gap-3 mb-2">
        <Layers size={16} style={{ color: persona.color }} />
        <span className="font-semibold text-base" style={{ color: COLORS.textPrimary }}>RP-2026-001 {rpVersion || 'v1.0'}</span>
        <StatusPill status="RP Congelado" />
      </div>
      <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.textPrimary }}>{demandTitle}</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.textSecondary }}>PO: Marina · CTO: Rafael · congelado agora</p>

      <div className="border rounded-lg p-6 mb-20" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="space-y-6">
          <section>
            <h3 className="text-base font-bold mb-3 pb-2 border-b" style={{ color: COLORS.textPrimary, borderColor: COLORS.border }}>1. Contexto</h3>
            <p className="text-sm" style={{ color: COLORS.textSecondary }}>
              A plataforma cobra clientes via boleto/transferência com processo manual de reconciliação. O modelo precisa migrar para cartão de crédito recorrente.
            </p>
          </section>
          <section>
            <h3 className="text-base font-bold mb-3 pb-2 border-b" style={{ color: COLORS.textPrimary, borderColor: COLORS.border }}>2. Objetivos</h3>
            <ul className="list-disc ml-5 text-sm" style={{ color: COLORS.textSecondary }}>
              <li>Migrar 40% da base ativa em boleto para cartão recorrente em 6 meses</li>
              <li>Reduzir reconciliação manual de ~30h/mês para ≤5h/mês</li>
              <li>Levar inadimplência de 18% para ≤10%</li>
            </ul>
          </section>
          <section>
            <h3 className="text-base font-bold mb-3 pb-2 border-b" style={{ color: COLORS.textPrimary, borderColor: COLORS.border }}>3. ADRs</h3>
            <div className="space-y-2">
              {realAdrs.map(a => (
                <div key={a.id} className="p-3 rounded-md border" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
                  <div className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>{a.id} — {a.title}</div>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h3 className="text-base font-bold mb-3 pb-2 border-b" style={{ color: COLORS.textPrimary, borderColor: COLORS.border }}>4. Rollout</h3>
            <p className="text-sm" style={{ color: COLORS.textSecondary }}>Canário 5% → 25% → 50% → 100% em 3 semanas, com kill-switch via feature flag.</p>
          </section>
          <section>
            <h3 className="text-base font-bold mb-3 pb-2 border-b" style={{ color: COLORS.textPrimary, borderColor: COLORS.border }}>5. Estimativa</h3>
            <p className="text-sm" style={{ color: COLORS.textSecondary }}>34 dias úteis (12d backend, 8d frontend, 6d integração, 5d rollout, 3d buffer).</p>
          </section>
        </div>
      </div>

      {isPM && (
        <div className="fixed bottom-4 left-64 right-4 max-w-5xl mx-auto border rounded-lg p-4 flex items-center justify-between shadow-md"
          style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
          <div className="text-xs" style={{ color: COLORS.textMuted }}>Sem gaps apontados</div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">Devolver com gaps</Button>
            <Button size="sm" icon={Check} onClick={() => { setDemandState('Em Execução'); showToast('RP aceito! Demanda em execução'); navigate('dashboard'); }}>
              Aceitar e planejar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// FLUXO: ADR LIBRARY (CTO)
// ============================================================
function ADRLibraryScreen() {
  const { navigate, adrs } = useApp();
  const allAdrs = [
    ...adrs.map(a => ({ ...a, demand: 'DEM-2026-001' })),
    { id: 'ADR-099', title: 'JWT com refresh assimétrico', demand: 'DEM-2025-095', decision: 'RS256 com chave pública via JWKS.' },
    { id: 'ADR-098', title: 'Cache distribuído via Redis Cluster', demand: 'DEM-2025-094', decision: 'Redis Cluster ao invés de standalone.' },
  ];

  return (
    <div className="max-w-5xl">
      <button onClick={() => navigate('dashboard')} className="flex items-center gap-1 text-sm mb-4" style={{ color: COLORS.textSecondary }}>
        <ChevronLeft size={14} /> Dashboard
      </button>
      <h1 className="text-2xl font-bold mb-6" style={{ color: COLORS.textPrimary }}>Biblioteca de ADRs</h1>
      <div className="space-y-2">
        {allAdrs.map(a => (
          <div key={a.id} className="border rounded-lg p-4" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: '#F5F3FF', color: '#6D28D9' }}>{a.id}</span>
              <span className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>{a.title}</span>
            </div>
            <div className="text-xs mb-1" style={{ color: COLORS.textMuted }}>{a.demand}</div>
            <div className="text-sm" style={{ color: COLORS.textSecondary }}>{(a.decision || '').slice(0, 150)}...</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// FLUXO: SHOWCASE RP (case completo, mocado pronto)
// ============================================================
function ShowcaseRPScreen() {
  const { navigate, persona } = useApp();
  const rp = SHOWCASE_RP;
  const [activeSection, setActiveSection] = useState('sumario');

  return (
    <div className="max-w-[1400px]">
      <button onClick={() => navigate('dashboard')} className="flex items-center gap-1 text-sm mb-4" style={{ color: COLORS.textSecondary }}>
        <ChevronLeft size={14} /> Dashboard
      </button>

      <div className="mb-4 p-3 rounded-md border flex items-center gap-2 text-sm" style={{ borderColor: '#FCD34D', backgroundColor: '#FFFBEB' }}>
        <Sparkles size={14} style={{ color: '#92400E' }} />
        <span style={{ color: '#78350F' }}>
          <strong>Case de exemplo:</strong> este é um RP fictício, totalmente preenchido, para você ver como fica um Readiness Package final pronto.
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
          <div className="text-xl font-bold" style={{ color: '#8B5CF6' }}>{rp.adrs.length}</div>
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
        {/* Sidebar de índice */}
        <div className="col-span-3">
          <div className="border rounded-lg overflow-hidden sticky top-20" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
            <div className="px-3 py-2 border-b text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.textMuted, borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
              Índice
            </div>
            <div className="p-1 max-h-[600px] overflow-y-auto">
              {rp.sections.map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveSection(s.id);
                    document.getElementById(`rp-sec-${s.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between hover:bg-stone-50"
                  style={{
                    backgroundColor: activeSection === s.id ? COLORS.bgSubtle : 'transparent',
                    color: activeSection === s.id ? COLORS.textPrimary : COLORS.textSecondary,
                  }}
                >
                  <span className={activeSection === s.id ? 'font-semibold' : ''}>{s.title}</span>
                  <span className="text-xs font-mono" style={{ color: s.confidence >= 90 ? COLORS.success : s.confidence >= 70 ? COLORS.warning : COLORS.danger }}>
                    {s.confidence}%
                  </span>
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

        {/* Documento */}
        <div className="col-span-6">
          <div className="border rounded-lg" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
            <div className="p-8 space-y-8">
              {rp.sections.map(s => {
                const color = s.confidence >= 90 ? COLORS.success : s.confidence >= 70 ? COLORS.warning : COLORS.danger;
                const isAdrs = s.content === 'adrs';
                return (
                  <section key={s.id} id={`rp-sec-${s.id}`} className="scroll-mt-24">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b" style={{ borderColor: COLORS.border }}>
                      <h3 className="text-base font-bold" style={{ color: COLORS.textPrimary }}>{s.title}</h3>
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

        {/* Sidebar de comentários + timeline */}
        <div className="col-span-3 space-y-4">
          <div className="border rounded-lg overflow-hidden" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
            <div className="px-3 py-2 border-b text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.textMuted, borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
              Comentários ({rp.comments.length})
            </div>
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
                    {c.resolved && <CheckCircle2 size={11} style={{ color: COLORS.success }} title="Resolvido" />}
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
            <div className="px-3 py-2 border-b text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.textMuted, borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
              Histórico
            </div>
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
// MAIN APP
// ============================================================
function AppInner() {
  const { persona, route } = useApp();
  if (!persona || route.screen === 'login') return <LoginScreen />;

  const renderScreen = () => {
    switch (route.screen) {
      case 'dashboard': return <Dashboard />;
      case 'new-demand': return <NewDemandScreen />;
      case 'capture-queue': return <CaptureQueueScreen />;
      case 'triage-queue': return <TriageQueueScreen />;
      case 'triage-detail': return <TriageDetailScreen />;
      case 'rationalization': return <RationalizationScreen />;
      case 'rp-freeze': return <RPFreezeScreen />;
      case 'tech-evaluation': return <TechEvaluationScreen />;
      case 'rp-view': return <RPViewScreen />;
      case 'showcase-rp': return <ShowcaseRPScreen />;
      case 'adrs': return <ADRLibraryScreen />;
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
      <DrillDownModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <style>{`
        .hover-lift {
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .hover-lift:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        }
      `}</style>
      <AppInner />
    </AppProvider>
  );
}