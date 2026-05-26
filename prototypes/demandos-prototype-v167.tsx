// DemandOS — Protótipo Funcional
import React, { useState, useEffect, useRef, createContext, useContext, useMemo } from 'react';
import {
  Plus, FileText, Mic, Paperclip, X, Check, ChevronRight, ChevronDown,
  AlertCircle, AlertTriangle, CheckCircle2, Circle, MessageSquare, Bell,
  Home, Inbox, Archive, Settings, BookOpen, Layers, Send, Edit3,
  Sparkles, Search, ArrowRight, ArrowLeft, Clock, User, Users,
  LogOut, ChevronLeft, Loader2, Square, Play, Pause, Trash2, Eye
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
// INITIAL DATA — DEM-2026-001
// ============================================================
const INITIAL_CAPTURE_PENDENCIES = [
  { id: 'cap-1', q: 'Qual problema essa demanda resolve?', a: 'A plataforma cobra clientes via boleto/transferência com processo manual de reconciliação. O modelo precisa migrar para cartão de crédito recorrente para reduzir esforço operacional e inadimplência.', confidence: 94, source: 'PDF estrategia-monetizacao.pdf', status: 'resolved' },
  { id: 'cap-2', q: 'Quem é o originador e em que contexto?', a: 'Carlos Silva, COO. Reunião de planejamento estratégico do Q2 2026.', confidence: 100, source: 'Submitter direto', status: 'resolved' },
  { id: 'cap-3', q: 'Quem é impactado?', a: 'Clientes pagantes ativos e time financeiro', confidence: 72, source: 'PDF estrategia-monetizacao.pdf, página 4', status: 'low_confidence', hint: 'A confiança ficou baixa porque o documento não citou explicitamente o time de CS, que pode ser impactado por suporte de cobrança.' },
  { id: 'cap-4', q: 'Qual a urgência e por quê?', a: '90 dias. Meta de operacionalizar até fim do trimestre para reduzir esforço manual de cobrança.', confidence: 92, source: 'PDF + texto Submitter', status: 'resolved' },
  { id: 'cap-5', q: 'Existe alguma restrição já conhecida? (prazo, regulatório, orçamento)', a: '', confidence: 0, source: '', status: 'empty' },
  { id: 'cap-6', q: 'Há expectativa de receita ou economia mensurável?', a: 'Redução de ~30h/mês em reconciliação', confidence: 68, source: 'PDF + estimativa', status: 'low_confidence', hint: 'A confiança ficou baixa porque o impacto em inadimplência foi mencionado mas não quantificado no documento original.' },
  { id: 'cap-7', q: 'Existe algum documento ou conversa anterior sobre isso?', a: 'PDF de estratégia anexado: estrategia-monetizacao.pdf', confidence: 100, source: 'Anexo', status: 'resolved' },
  { id: 'cap-8', q: 'Quem precisa estar a par desta demanda? (stakeholders)', a: '', confidence: 0, source: '', status: 'empty' },
];

const INITIAL_ATTACHMENTS = [
  { id: 'att-1', name: 'estrategia-monetizacao.pdf', size: '2.3 MB', type: 'pdf' },
];

// Triagem do PO — 5 itens de compliance (4 avaliações + 1 caminho), alinhado ao spec seção 8.2
const INITIAL_TRIAGE_ITEMS = [
  { id: 'tri-1', q: 'Demanda é real e tem evidência?', suggestion: 'Sim. PDF de estratégia do COO + meta declarada em comitê + economia operacional mensurável. Evidência sólida.', confidence: 92, decision: null, justification: '' },
  { id: 'tri-2', q: 'Alinhada com roadmap?', suggestion: 'Sim. Está no pilar "Eficiência Operacional" do roadmap Q2-Q3 2026, com prioridade declarada do COO.', confidence: 88, decision: null, justification: '' },
  { id: 'tri-3', q: 'Há incógnitas bloqueantes?', suggestion: 'Não bloqueantes. Há decisão técnica em aberto (qual gateway), mas é resolvível no Discovery do PO.', confidence: 85, decision: null, justification: '' },
  { id: 'tri-4', q: 'Premissas a validar?', suggestion: 'Sim, 2 premissas críticas: (1) % de clientes que aceitam migrar opt-in; (2) viabilidade técnica de chargeback no parceiro escolhido.', confidence: 90, decision: null, justification: '' },
  { id: 'tri-5', q: 'Caminho da demanda', suggestion: 'Recomendação: Product Ready. Contexto é claro, incógnitas são resolvíveis no Discovery do PO.', confidence: 87, decision: null, justification: '', isPath: true },
];

// Racionalização do PO — 12 pendências
const INITIAL_RATIONALIZATION_PENDENCIES = [
  { id: 'rac-1', q: 'Definição clara do problema', section: 'Contexto', a: 'Cobrança por boleto gera ~30h/mês de reconciliação manual e inadimplência de 18%. Problema operacional + impacto financeiro.', confidence: 90, status: 'low_confidence', hint: 'Falta quantificar impacto em NPS dos clientes.' },
  { id: 'rac-2', q: 'Objetivos de negócio mensuráveis', section: 'Contexto', a: '', confidence: 0, status: 'empty' },
  { id: 'rac-3', q: 'Personas impactadas', section: 'Contexto', a: 'Clientes pagantes (B2B), time financeiro, CS, jurídico.', confidence: 75, status: 'low_confidence', hint: 'Não está claro se inclui clientes pessoa física do plano free.' },
  { id: 'rac-4', q: 'Premissas a validar', section: 'Contexto', a: 'Premissa: 40% dos clientes aceitam migração opt-in nos primeiros 6 meses.', confidence: 60, status: 'low_confidence', hint: 'O número 40% precisa ser validado com CS antes do congelamento.' },
  { id: 'rac-5', q: 'Escopo: o que ENTRA na entrega', section: 'Escopo', a: '', confidence: 0, status: 'empty' },
  { id: 'rac-6', q: 'Escopo: o que NÃO entra', section: 'Escopo', a: '', confidence: 0, status: 'empty' },
  { id: 'rac-7', q: 'Regras de negócio', section: 'Regras', a: '', confidence: 0, status: 'empty' },
  { id: 'rac-8', q: 'Critérios de aceite', section: 'Validação', a: '', confidence: 0, status: 'empty' },
  { id: 'rac-9', q: 'Critérios de sucesso (métricas)', section: 'Validação', a: '', confidence: 0, status: 'empty' },
  { id: 'rac-10', q: 'Riscos de produto', section: 'Riscos', a: '', confidence: 0, status: 'empty' },
  { id: 'rac-11', q: 'Stakeholders e responsabilidades', section: 'Stakeholders', a: '', confidence: 0, status: 'empty' },
  { id: 'rac-12', q: 'Dependências externas', section: 'Dependências', a: '', confidence: 0, status: 'empty' },
];

// Demandas na fila de triagem do PO
const TRIAGE_QUEUE = [
  { id: 'DEM-2026-001', title: 'Gateway de Pagamento Recorrente', from: 'Carlos Silva (COO)', priority: 'Crítica', priorityColor: '#EF4444', arrived: 'há 3h', sla: '21h restantes', preview: 'Plataforma precisa receber pagamento por cartão recorrente. Hoje é tudo boleto...', isMain: true },
  { id: 'DEM-2026-002', title: 'Integração SAP enterprise', from: 'Carlos Silva (COO)', priority: 'Alta', priorityColor: '#F97316', arrived: 'há 1 dia', sla: '2 dias restantes', preview: 'Cliente Acme pediu integração com SAP deles' },
  { id: 'DEM-2026-003', title: 'Filtro de exportação no relatório', from: 'Maria Pereira (CS)', priority: 'Média', priorityColor: '#F59E0B', arrived: 'há 2 dias', sla: '5 dias restantes', preview: 'CS precisa filtrar relatório por data customizada' },
  { id: 'DEM-2026-004', title: 'Renomear campos no dashboard de vendas', from: 'João Reis (Sales)', priority: 'Baixa', priorityColor: '#6B7280', arrived: 'há 3 dias', sla: '7 dias restantes', preview: 'Os nomes atuais confundem o time comercial' },
];

// Racionalizações ativas do PO
const ACTIVE_RATIONALIZATIONS = [
  { id: 'DEM-2025-099', title: 'Sistema de notificações push', score: 65 },
  { id: 'DEM-2025-098', title: 'Refatoração do módulo de billing', score: 30 },
  { id: 'DEM-2025-097', title: 'Onboarding de novos usuários', score: 80 },
];

// Avaliação Técnica do CTO — 15 pendências (seção 10 do spec)
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

// Mock de respostas sugeridas (para quando o CTO pedir "sugestão")
const TECH_SUGGESTIONS = {
  'tech-1': 'Médio. Introduz nova camada de Payment Provider abstrata. Impacta Billing Service e exige novo Webhook handler. Sem mudança no domínio de Customer.',
  'tech-3': 'Billing Service (refactor de cobranças), Customer API (campos de método de pagamento), Notification Service (novos eventos), Audit Log (rastro de PCI).',
  'tech-4': 'SDK oficial do Stripe via biblioteca server-side. Comunicação síncrona para tokenização, assíncrona via webhook para eventos de cobrança. Retry exponencial com idempotency-key.',
  'tech-5': 'Nova entidade PaymentMethod (id, customer_id, provider, token, last4, expires_at, status). Tabela CobrancaEvento (id, charge_id, status, attempts, payload). FK em Invoice para PaymentMethod.',
  'tech-6': 'PCI-DSS: tokenização no provider, zero PAN persistido (ADR-003). LGPD: consentimento explícito, DPA com Stripe, base legal de execução de contrato. Audit log de todas as operações sensíveis.',
  'tech-7': '5 riscos principais: (1) chargeback alto em 30 dias iniciais, (2) latência de webhook em pico, (3) falha de conciliação com ERP, (4) resistência enterprise ao opt-in, (5) PCI audit pendente Q3.',
  'tech-8': 'Canário 5% → 25% → 50% → 100% em 3 semanas. Kill-switch global via feature flag. Por cohort de cliente (free / pro / enterprise).',
  'tech-9': 'Unitários (cobertura ≥80% Payment Service). Integração com Stripe sandbox. E2E do fluxo opt-in. Load test com 10x picos atuais. Chaos test no webhook handler.',
  'tech-10': 'Dashboards: latência webhook, taxa falha cobrança, distribuição chargeback, % migração por cohort. Alertas: webhook offline >1min, falha >5% em 5min, latência p99 >10s.',
  'tech-11': 'Feature flag global. Em caso de incidente: desativar flag, clientes voltam a boleto, eventos pending re-enfileirados após reativação. RTO: 5min. RPO: zero (eventos não são perdidos).',
  'tech-12': 'Stripe (provider externo, SLA 99.99%). Audit log service (interno). Notification provider (Sendgrid já contratado). Nenhuma dependência nova bloqueante.',
  'tech-13': '34 dias úteis. Breakdown: 12d backend (Payment Service + Webhook), 8d frontend (UI consentimento + gestão), 6d integração/teste, 5d rollout/observabilidade, 3d buffer.',
  'tech-14': '2 backend sêniors + 1 frontend pleno. Revisões pontuais do CTO em ADR-001 (abstração) e ADR-003 (PCI). DevOps em apoio para feature flag.',
};

// ADRs pré-sugeridas para o CTO usar como base
const SUGGESTED_ADRS = [
  { id: 'ADR-001', title: 'Camada de abstração de Payment Provider', context: 'Precisamos integrar Stripe mas evitar lock-in. Provider pode mudar.', decision: 'Criar interface PaymentProvider com implementação StripeProvider. Toda comunicação passa pela interface.', alternatives: 'Acoplar direto ao Stripe SDK (rejeitado: lock-in). Múltiplos providers em paralelo desde v1 (rejeitado: complexidade desnecessária).', consequences: 'Trocar de provider exige nova implementação, mas não toca em domínio. Custo extra de 2-3 dias de design upfront.' },
  { id: 'ADR-002', title: 'Webhook handler com retry exponencial', context: 'Eventos do provider podem chegar duplicados ou fora de ordem.', decision: 'Handler idempotente com idempotency-key, retry exponencial até 5 tentativas, dead letter queue.', alternatives: 'Processar inline sem retry (rejeitado: perda de eventos em falha transitória).', consequences: 'Latência levemente maior em casos de retry. Garante entrega.' },
  { id: 'ADR-003', title: 'Vault tokenizado para dados de cartão', context: 'PCI-DSS exige escopo mínimo de dados sensíveis.', decision: 'Tokenização no Stripe. Zero PAN persistido localmente. Apenas token + last4.', alternatives: 'Vault próprio (rejeitado: aumenta escopo PCI). Pass-through (rejeitado: viola PCI).', consequences: 'PCI-DSS Level 4 mantido (escopo mínimo). Dependência do provider para qualquer operação no cartão.' },
  { id: 'ADR-004', title: 'Estratégia de migração opt-in', context: 'Não podemos forçar mudança de método em contratos existentes.', decision: 'Feature flag por cliente + UI de consentimento explícito. Migração ativada após cliente confirmar.', alternatives: 'Migração forçada (rejeitado: viola contrato). Big bang (rejeitado: risco operacional).', consequences: 'Adesão depende de incentivo e UX. Maior controle, menor risco.' },
];

const OTHER_DEMANDS = [
  { id: 'DEM-2026-002', title: 'Integração SAP enterprise', priority: 'Alta', state: 'Em Captura', stateColor: 'info', score: 60, owner: 'Carlos Silva', updated: 'há 1 dia', preview: 'Cliente Acme pediu integração com SAP deles' },
  { id: 'DEM-2025-090', title: 'Dashboard de churn em tempo real', priority: 'Baixa', state: 'Arquivada', stateColor: 'muted', owner: 'Carlos Silva', updated: 'há 12 dias' },
];

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
  const [demandTitle, setDemandTitle] = useState('Gateway de Pagamento Recorrente');
  const [demandState, setDemandState] = useState('Em Captura');
  const [toast, setToast] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  // PO state
  const [triageItems, setTriageItems] = useState(INITIAL_TRIAGE_ITEMS);
  const [racPendencies, setRacPendencies] = useState(INITIAL_RATIONALIZATION_PENDENCIES);
  const [discoveryResults, setDiscoveryResults] = useState({});
  const [racDraftSavedAt, setRacDraftSavedAt] = useState(null);
  const [triageDraftSavedAt, setTriageDraftSavedAt] = useState(null);
  const [rpVersion, setRpVersion] = useState(null);
  // CTO state
  const [techPendencies, setTechPendencies] = useState(INITIAL_TECH_PENDENCIES);
  const [techDraftSavedAt, setTechDraftSavedAt] = useState(null);
  const [adrs, setAdrs] = useState([]);
  // PM state
  const [rpComments, setRpComments] = useState([]);
  const [returnedGaps, setReturnedGaps] = useState([]);
  const [v11Changes, setV11Changes] = useState({});
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [seenTours, setSeenTours] = useState(new Set());
  // Notifications + collects
  const [notifications, setNotifications] = useState([]);
  const [pendingCollects, setPendingCollects] = useState([]); // [{id, demandId, questions, askedBy, status}]

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const addNotification = (notif) => {
    setNotifications(prev => [{
      id: `n-${Date.now()}`,
      timestamp: new Date(),
      read: false,
      ...notif,
    }, ...prev]);
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

  const updateTechPendency = (id, updates) => {
    setTechPendencies(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

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

  return (
    <AppContext.Provider value={{
      persona, setPersona, selectPersona,
      route, navigate,
      capturePendencies, updatePendency, captureScore, captureStats, setCapturePendencies,
      attachments, setAttachments,
      demandTitle, setDemandTitle, demandState, setDemandState,
      toast, showToast,
      chatOpen, setChatOpen,
      chatMessages, setChatMessages,
      triageItems, updateTriageItem, triageScore, setTriageItems,
      racPendencies, updateRacPendency, racScore, racStats, setRacPendencies,
      discoveryResults, setDiscoveryResults,
      racDraftSavedAt, setRacDraftSavedAt,
      triageDraftSavedAt, setTriageDraftSavedAt,
      rpVersion, setRpVersion,
      techPendencies, setTechPendencies, updateTechPendency, techScore, techStats,
      techDraftSavedAt, setTechDraftSavedAt,
      adrs, setAdrs,
      rpComments, setRpComments,
      returnedGaps, setReturnedGaps,
      v11Changes, setV11Changes,
      shortcutsOpen, setShortcutsOpen,
      seenTours, setSeenTours,
      notifications, setNotifications, addNotification,
      pendingCollects, setPendingCollects,
    }}>
      {children}
    </AppContext.Provider>
  );
}

// ============================================================
// REUSABLE UI COMPONENTS
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
    success: { backgroundColor: disabled ? COLORS.borderStrong : COLORS.success, color: 'white' },
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

function ScoreRing({ score, size = 64, strokeWidth = 6, label, sublabel }) {
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
    success: { backgroundColor: disabled ? COLORS.borderStrong : COLORS.success, color: 'white' },
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

function ScoreRing({ score, size = 64, strokeWidth = 6, label, sublabel }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [displayScore, setDisplayScore] = useState(0);
  const [diff, setDiff] = useState(null);
  const prevScoreRef = useRef(0);

  useEffect(() => {
    const start = displayScore;
    const diffVal = score - start;
    if (diffVal > 0 && prevScoreRef.current > 0) {
      setDiff(`+${diffVal}%`);
      const t = setTimeout(() => setDiff(null), 1200);
      // capture for cleanup
    }
    prevScoreRef.current = score;
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
        {diff && (
          <div
            className="absolute left-1/2 -translate-x-1/2 -top-2 text-xs font-bold animate-float-up pointer-events-none"
            style={{ color: COLORS.success }}
          >
            {diff}
          </div>
        )}
      </div>
      {label && <div className="text-xs font-medium" style={{ color: COLORS.textSecondary }}>{label}</div>}
      {sublabel && <div className="text-xs" style={{ color: COLORS.textMuted }}>{sublabel}</div>}
    </div>
  );
}

function ConfidenceBar({ value, compact = false }) {
  const color = value >= 90 ? COLORS.success : value >= 70 ? COLORS.warning : COLORS.danger;
  const segments = 10;
  const filled = Math.round((value / 100) * segments);

  return (
    <div className="inline-flex items-center gap-2">
      <span className="text-xs font-medium" style={{ color: COLORS.textSecondary }}>
        Confiança: {value}%
      </span>
      {!compact && (
        <div className="flex gap-0.5">
          {Array.from({ length: segments }).map((_, i) => (
            <div
              key={i}
              className="w-1 h-2.5 rounded-sm transition-colors"
              style={{ backgroundColor: i < filled ? color : COLORS.border }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// KPI COMPONENTS
// ============================================================
function KPICard({ label, value, suffix, trend, trendDir, sub, accent, icon: Icon, large }) {
  const trendColor = trendDir === 'up' ? COLORS.success : trendDir === 'down' ? COLORS.danger : COLORS.textMuted;
  const trendIcon = trendDir === 'up' ? '↑' : trendDir === 'down' ? '↓' : '→';
  return (
    <div
      className="border rounded-lg p-5 hover-lift"
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
          style={{ color: COLORS.textPrimary, fontVariantNumeric: 'tabular-nums' }}>
          {value}
        </div>
        {suffix && <div className="text-sm font-medium" style={{ color: COLORS.textMuted }}>{suffix}</div>}
        {trend !== undefined && (
          <div className="text-xs font-semibold ml-1.5" style={{ color: trendColor }}>
            {trendIcon} {trend}
          </div>
        )}
      </div>
      {sub && <div className="text-xs" style={{ color: COLORS.textMuted }}>{sub}</div>}
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
  const lastX = width;
  const lastY = height - ((data[data.length - 1] - min) / range) * height;
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastX} cy={lastY} r="2.5" fill={color} />
    </svg>
  );
}

function BarMini({ data, color = COLORS.info, height = 36 }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-0.5" style={{ height }}>
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm"
          style={{ height: `${(v / max) * 100}%`, minHeight: '2px', backgroundColor: i === data.length - 1 ? color : `${color}80` }}
        />
      ))}
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

function ProgressBar({ value, max, color, height = 6 }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full rounded-full overflow-hidden" style={{ height, backgroundColor: COLORS.bgSubtle }}>
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color || COLORS.info }} />
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
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: `${s.color}15`, color: s.color }}
    >
      <Icon size={10} />
      {status}
    </span>
  );
}

function PendencyCard({ pendency, onClick }) {
  const { discoveryResults } = useApp();
  const hasDiscovery = discoveryResults && discoveryResults[pendency.id];
  const config = {
    empty: { icon: AlertCircle, color: COLORS.danger, bg: '#FEF2F2', label: 'Vazia', action: 'Responder' },
    low_confidence: { icon: AlertTriangle, color: COLORS.warning, bg: '#FFFBEB', label: 'Baixa confiança', action: 'Revisar' },
    resolved: { icon: CheckCircle2, color: COLORS.success, bg: '#F0FDF4', label: 'Resolvida', action: 'Editar' },
    manually_accepted: { icon: CheckCircle2, color: '#0891B2', bg: '#ECFEFF', label: 'Aceita manualmente', action: 'Editar' },
    not_applicable: { icon: Circle, color: COLORS.textMuted, bg: COLORS.bgSubtle, label: 'N/A', action: 'Editar' },
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
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>
              {pendency.q}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {hasDiscovery && (
                <span
                  className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium"
                  style={{ backgroundColor: `${COLORS.info}15`, color: COLORS.info }}
                  title={`Discovery: ${hasDiscovery.type}`}
                >
                  <Search size={10} />
                </span>
              )}
              {pendency.status === 'manually_accepted' && (
                <span
                  className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium"
                  style={{ backgroundColor: '#ECFEFF', color: '#0891B2' }}
                  title="Aceita manualmente pelo usuário"
                >
                  manual
                </span>
              )}
            </div>
          </div>
          {pendency.a && (
            <div className="text-sm mb-3 overflow-hidden" style={{ color: COLORS.textSecondary, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {pendency.a}
            </div>
          )}
          {pendency.status === 'not_applicable' && pendency.naReason && (
            <div className="text-xs italic mb-3" style={{ color: COLORS.textMuted }}>
              N/A — {pendency.naReason}
            </div>
          )}
          <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: COLORS.border }}>
            {pendency.status === 'empty' ? (
              <span className="text-xs font-medium" style={{ color: COLORS.danger }}>Vazia</span>
            ) : pendency.status === 'not_applicable' ? (
              <span className="text-xs font-medium" style={{ color: COLORS.textMuted }}>Não aplicável</span>
            ) : pendency.status === 'manually_accepted' ? (
              <span className="text-xs font-medium" style={{ color: '#0891B2' }}>Aceita manualmente ({pendency.confidence}%)</span>
            ) : (
              <ConfidenceBar value={pendency.confidence} />
            )}
            <span className="text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: COLORS.textSecondary }}>
              {c.action} <ChevronRight size={12} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// LAYOUT
// ============================================================
function TopBar() {
  const { persona, setPersona, route, navigate, showToast,
    setCapturePendencies, setAttachments, setDemandState, setTriageItems, setRacPendencies, setDiscoveryResults, setRacDraftSavedAt, setTriageDraftSavedAt, setRpVersion, setChatMessages,
    setTechPendencies, setTechDraftSavedAt, setAdrs, setRpComments, setReturnedGaps, setV11Changes, setShortcutsOpen, setNotifications, setPendingCollects, notifications } = useApp();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(n => n.forPersona === persona?.id && !n.read).length;

  if (!persona) return null;

  const resetPrototype = () => {
    setCapturePendencies(INITIAL_CAPTURE_PENDENCIES);
    setAttachments(INITIAL_ATTACHMENTS);
    setDemandState('Em Captura');
    setTriageItems(INITIAL_TRIAGE_ITEMS);
    setRacPendencies(INITIAL_RATIONALIZATION_PENDENCIES);
    setDiscoveryResults({});
    setRacDraftSavedAt(null);
    setTriageDraftSavedAt(null);
    setRpVersion(null);
    setChatMessages([]);
    setTechPendencies(INITIAL_TECH_PENDENCIES);
    setTechDraftSavedAt(null);
    setAdrs([]);
    setRpComments([]);
    setReturnedGaps([]);
    setV11Changes({});
    setNotifications([]);
    setPendingCollects([]);
    setDropdownOpen(false);
    navigate('dashboard');
    showToast('Protótipo resetado para o estado inicial');
  };
  if (false) return null;

  const breadcrumb = (() => {
    if (route.screen === 'dashboard') return 'Dashboard';
    if (route.screen === 'new-demand') return 'Demandas / Nova';
    if (route.screen === 'capture-queue') return 'Demandas / DEM-2026-001 / Captura';
    if (route.screen === 'capture-review') return 'Demandas / DEM-2026-001 / Revisão';
    if (route.screen === 'triage-queue') return 'Triagem / Fila';
    if (route.screen === 'triage-detail') return 'Triagem / DEM-2026-001';
    if (route.screen === 'rationalizations') return 'Racionalizações';
    if (route.screen === 'rationalization') return 'Racionalização / DEM-2026-001';
    if (route.screen === 'rp-freeze') return 'Congelamento / DEM-2026-001';
    if (route.screen === 'timeline') return 'Histórico / DEM-2026-001';
    return route.screen;
  })();

  return (
    <>
      {/* Persona color stripe */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50" style={{ backgroundColor: persona.color }} />
      <div className="sticky top-1 z-40 h-14 border-b flex items-center justify-between px-6"
        style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="flex items-center gap-8">
          <div className="font-mono font-bold text-base" style={{ color: COLORS.textPrimary }}>
            DemandOS
          </div>
          <span
            className="text-xs font-medium px-2 py-0.5 rounded uppercase tracking-wider"
            style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}
            title="Este é um protótipo. Dados não persistem entre sessões."
          >
            Demo
          </span>
          <div className="text-xs" style={{ color: COLORS.textMuted }}>
            {breadcrumb}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="p-2 rounded-md hover:bg-stone-100 flex items-center gap-1.5"
            title="Cmd+K para trocar de persona, ? para todos os atalhos"
            onClick={() => setShortcutsOpen(true)}
          >
            <kbd className="text-xs px-1.5 py-0.5 rounded font-mono" style={{ backgroundColor: COLORS.bgSubtle, color: COLORS.textMuted }}>⌘K</kbd>
          </button>
          <button
            className="p-2 rounded-md hover:bg-stone-100 relative"
            onClick={() => navigate('notifications')}
            title="Notificações"
          >
            <Bell size={16} style={{ color: COLORS.textSecondary }} />
            {unreadCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: COLORS.danger, fontSize: '10px' }}
              >
                {unreadCount}
              </span>
            )}
          </button>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-stone-100"
            >
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                style={{ backgroundColor: persona.color }}>
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
                <div className="px-3 py-2 text-xs font-semibold border-b"
                  style={{ color: COLORS.textMuted, borderColor: COLORS.border }}>
                  Trocar de persona
                </div>
                {Object.values(PERSONAS).map(p => (
                  <button
                    key={p.id}
                    onClick={() => { setPersona(p); setDropdownOpen(false); navigate('dashboard'); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-stone-50 text-left"
                    style={{ backgroundColor: p.id === persona.id ? COLORS.bgSubtle : 'transparent' }}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                      style={{ backgroundColor: p.color }}>
                      {p.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>{p.name}</div>
                      <div className="text-xs" style={{ color: COLORS.textMuted }}>{p.role} · {p.label}</div>
                    </div>
                    {p.id === persona.id && <Check size={14} style={{ color: p.color }} />}
                  </button>
                ))}
                <div className="border-t" style={{ borderColor: COLORS.border }}>
                  <button
                    onClick={resetPrototype}
                    className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-stone-50 text-left"
                  >
                    <Sparkles size={14} style={{ color: COLORS.warning }} />
                    <div>
                      <div className="text-sm" style={{ color: COLORS.textPrimary }}>Resetar protótipo</div>
                      <div className="text-xs" style={{ color: COLORS.textMuted }}>Volta tudo ao estado inicial</div>
                    </div>
                  </button>
                  <button
                    onClick={() => { setPersona(null); setDropdownOpen(false); navigate('login'); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-stone-50 text-left border-t"
                    style={{ borderColor: COLORS.border }}
                  >
                    <LogOut size={14} style={{ color: COLORS.textMuted }} />
                    <span className="text-sm" style={{ color: COLORS.textSecondary }}>Sair</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Sidebar() {
  const { persona, route, navigate, captureStats, notifications, pendingCollects } = useApp();
  if (!persona) return null;

  const unreadCount = notifications.filter(n => n.forPersona === persona.id && !n.read).length;
  const pendingCollectsForMe = persona.id === 'submitter'
    ? pendingCollects.filter(c => c.status === 'pending').length
    : 0;

  const menus = {
    submitter: [
      { icon: Home, label: 'Dashboard', screen: 'dashboard' },
      { icon: Plus, label: 'Nova Demanda', screen: 'new-demand' },
      { icon: FileText, label: 'Minhas Demandas', screen: 'my-demands' },
      ...(pendingCollectsForMe > 0 ? [{ icon: MessageSquare, label: 'Coletas pendentes', screen: 'collect-inbox', badge: pendingCollectsForMe }] : []),
      { icon: Bell, label: 'Notificações', screen: 'notifications', badge: unreadCount > 0 ? unreadCount : null },
    ],
    po: [
      { icon: Home, label: 'Dashboard', screen: 'dashboard' },
      { icon: Inbox, label: 'Fila de Triagem', screen: 'triage-queue', badge: 4 },
      { icon: Layers, label: 'Racionalizações Ativas', screen: 'rationalizations', badge: 3 },
      { icon: Archive, label: 'Backlog', screen: 'backlog' },
      { icon: Archive, label: 'Demandas Arquivadas', screen: 'archived' },
      { icon: Bell, label: 'Notificações', screen: 'notifications', badge: unreadCount > 0 ? unreadCount : null },
    ],
    cto: [
      { icon: Home, label: 'Dashboard', screen: 'dashboard' },
      { icon: Inbox, label: 'Escalas Técnicas', screen: 'tech-evaluation', badge: 1 },
      { icon: Layers, label: 'Avaliações em Andamento', screen: 'tech-active', badge: 2 },
      { icon: BookOpen, label: 'ADRs (biblioteca)', screen: 'adrs' },
      { icon: BookOpen, label: 'Base de Conhecimento', screen: 'kb' },
      { icon: Bell, label: 'Notificações', screen: 'notifications', badge: unreadCount > 0 ? unreadCount : null },
    ],
    pm: [
      { icon: Home, label: 'Dashboard', screen: 'dashboard' },
      { icon: Inbox, label: 'RPs Aguardando', screen: 'rp-view', badge: 1 },
      { icon: Play, label: 'Em Execução', screen: 'execution', disabled: true },
      { icon: Bell, label: 'Notificações', screen: 'notifications', badge: unreadCount > 0 ? unreadCount : null },
    ],
    viewer: [
      { icon: Home, label: 'Dashboard', screen: 'dashboard' },
      { icon: FileText, label: 'RPs Publicados', screen: 'rp-view' },
      { icon: MessageSquare, label: 'Meus Comentários', screen: 'my-comments' },
      { icon: Bell, label: 'Notificações', screen: 'notifications', badge: unreadCount > 0 ? unreadCount : null },
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
              onClick={() => !item.disabled && navigate(item.screen)}
              disabled={item.disabled}
              className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md mb-0.5 text-left transition-colors ${item.disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-stone-200/60'}`}
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
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: persona.color, color: 'white' }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div className="p-3 border-t text-xs" style={{ borderColor: COLORS.border, color: COLORS.textMuted }}>
        v0.1 · Protótipo
      </div>
    </div>
  );
}

function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  const config = {
    success: { color: COLORS.success, icon: CheckCircle2, bg: '#F0FDF4' },
    warning: { color: COLORS.warning, icon: AlertTriangle, bg: '#FFFBEB' },
    error: { color: COLORS.danger, icon: AlertCircle, bg: '#FEF2F2' },
  };
  const c = config[toast.type] || config.success;
  const Icon = c.icon;
  return (
    <div className="fixed top-20 right-6 z-[100] animate-slide-in">
      <div className="flex items-center gap-3 pl-3 pr-4 py-3 rounded-lg shadow-lg border max-w-md"
        style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border, borderLeftWidth: '3px', borderLeftColor: c.color }}>
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: c.bg }}>
          <Icon size={14} style={{ color: c.color }} />
        </div>
        <span className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>{toast.message}</span>
      </div>
    </div>
  );
}

// ============================================================
// CHAT PANEL
// ============================================================
function ChatPanel() {
  const { chatOpen, setChatOpen, chatMessages, setChatMessages, persona, route } = useApp();
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  const context = useMemo(() => {
    if (route.screen === 'capture-queue') return 'Captura — DEM-2026-001';
    if (route.screen === 'new-demand') return 'Nova Demanda';
    if (route.screen === 'triage-detail') return 'Triagem — DEM-2026-001';
    if (route.screen === 'rp-freeze') return 'Congelamento RP — DEM-2026-001';
    return 'Dashboard';
  }, [route]);

  useEffect(() => {
    if (chatOpen && chatMessages.length === 0) {
      setChatMessages([{
        from: 'bot',
        text: `Olá ${persona?.name?.split(' ')[0]}. Estou ciente de que você está em ${context.toLowerCase()}. Em que posso ajudar?`,
        suggestions: ['💡 Ajude com pendências vazias', '💡 Mostre demandas similares', '💡 Como funciona o Readiness Score?']
      }]);
    }
  }, [chatOpen, persona, context, chatMessages.length, setChatMessages]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chatMessages]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = { from: 'user', text };
    setChatMessages(prev => [...prev, userMsg]);
    setInput('');
    setTimeout(() => {
      let response;
      const lower = text.toLowerCase();
      if (lower.includes('vazia') || lower.includes('pendência') || lower.includes('ajude')) {
        response = {
          from: 'bot',
          text: 'Você tem 2 pendências vazias: "Restrições conhecidas" e "Stakeholders". Para restrições, pense em: prazo, regulatório, orçamento, integrações existentes. Para stakeholders, quem precisa ser informado da decisão? Posso sugerir uma estrutura de resposta?',
          suggestions: ['Sim, estruture restrições', 'Sim, estruture stakeholders']
        };
      } else if (lower.includes('similar') || lower.includes('parecid')) {
        response = {
          from: 'bot',
          text: 'Encontrei 2 demandas similares no histórico:\n\n📄 DEM-2025-067 — Cobrança automática via PIX (concluída)\n📄 DEM-2025-089 — Migração de billing (em execução)\n\nQuer ver as decisões e ADRs registradas?'
        };
      } else if (lower.includes('score') || lower.includes('readiness')) {
        response = {
          from: 'bot',
          text: 'O Readiness Score representa quanto do compliance list da etapa atual está cumprido. Cada pendência tem peso igual. Para avançar à próxima etapa, o score precisa estar em 100%. Pendências com baixa confiança contam como parciais (mas não 100%).'
        };
      } else if (lower.includes('estrutur')) {
        response = {
          from: 'bot',
          text: 'Sugestão estruturada:\n\n**Restrições conhecidas:**\n• Prazo: limite definido pelo trimestre?\n• Regulatório: LGPD, PCI-DSS aplicáveis?\n• Orçamento: dentro do CAPEX de eng?\n• Integrações: sistemas legados que não podem ser tocados?\n\nQuer que eu pré-preencha com base no seu PDF?'
        };
      } else {
        response = {
          from: 'bot',
          text: 'Posso ajudar de várias formas: 1) Pesquisa externa, 2) Estruturar respostas, 3) Buscar demandas similares na base de conhecimento. O que você prefere?'
        };
      }
      setChatMessages(prev => [...prev, response]);
    }, 800);
  };

  if (!persona) return null;

  return (
    <>
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
        style={{ backgroundColor: persona.color, color: 'white' }}
      >
        {chatOpen ? <X size={20} /> : <MessageSquare size={20} />}
      </button>

      {chatOpen && (
        <div className="fixed top-16 right-0 bottom-0 w-[400px] border-l flex flex-col shadow-xl z-30 animate-slide-in-right"
          style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
          <div className="p-4 border-b" style={{ borderColor: COLORS.border }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={16} style={{ color: persona.color }} />
                <span className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>Chat</span>
              </div>
              <button onClick={() => setChatOpen(false)} className="p-1 hover:bg-stone-100 rounded">
                <X size={14} style={{ color: COLORS.textMuted }} />
              </button>
            </div>
            <div className="text-xs mt-1" style={{ color: COLORS.textMuted }}>
              Contexto: {context} · Você é {persona.name.split(' ')[0]}
            </div>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg, i) => (
              <div key={i}>
                {msg.from === 'bot' && (
                  <div className="text-xs font-semibold mb-1" style={{ color: COLORS.textMuted }}>Plataforma</div>
                )}
                {msg.from === 'user' && (
                  <div className="text-xs font-semibold mb-1 text-right" style={{ color: persona.color }}>{persona.name.split(' ')[0]}</div>
                )}
                <div
                  className={`text-sm whitespace-pre-wrap rounded-lg px-3 py-2 ${msg.from === 'user' ? 'ml-8' : 'mr-8'}`}
                  style={{
                    backgroundColor: msg.from === 'user' ? `${persona.color}15` : COLORS.bgSubtle,
                    color: COLORS.textPrimary,
                  }}
                >
                  {msg.text}
                </div>
                {msg.suggestions && (
                  <div className="flex flex-wrap gap-2 mt-2 mr-8">
                    {msg.suggestions.map((s, j) => (
                      <button
                        key={j}
                        onClick={() => sendMessage(s.replace(/^[💡🔍📚]\s*/, ''))}
                        className="text-xs px-2.5 py-1 rounded-full border hover:bg-stone-50"
                        style={{ borderColor: COLORS.border, color: COLORS.textSecondary }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="p-3 border-t" style={{ borderColor: COLORS.border }}>
            <div className="flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                placeholder="Digite sua mensagem..."
                className="flex-1 px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-2"
                style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
              />
              <button
                onClick={() => sendMessage(input)}
                className="p-2 rounded-md"
                style={{ backgroundColor: persona.color, color: 'white' }}
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ============================================================
// SCREEN: LOGIN
// ============================================================
function LoginScreen() {
  const { selectPersona } = useApp();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8" style={{ backgroundColor: COLORS.bg }}>
      <div className="max-w-md w-full">
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="font-mono font-bold text-4xl mb-3 tracking-tight" style={{ color: COLORS.textPrimary }}>
            DemandOS
          </div>
          <div className="text-sm" style={{ color: COLORS.textSecondary }}>
            A fábrica de Readiness Packages
          </div>
        </div>

        <div className="text-xs font-semibold mb-3 uppercase tracking-wider animate-fade-in" style={{ color: COLORS.textMuted }}>
          Entre como
        </div>

        <div className="space-y-2">
          {Object.values(PERSONAS).map((p, i) => (
            <button
              key={p.id}
              onClick={() => selectPersona(p.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-lg border text-left hover-lift group animate-fade-in-up stagger-${i + 1}`}
              style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border, transition: 'border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = p.color}
              onMouseLeave={e => e.currentTarget.style.borderColor = COLORS.border}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-base font-semibold text-white flex-shrink-0"
                style={{ backgroundColor: p.color }}>
                {p.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>{p.name}</div>
                <div className="text-xs font-medium mb-1" style={{ color: p.color }}>
                  {p.role} · {p.label}
                </div>
                <div className="text-xs" style={{ color: COLORS.textMuted }}>{p.desc}</div>
              </div>
              <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" style={{ color: COLORS.textMuted }} />
            </button>
          ))}
        </div>

        <div className="text-center mt-8 animate-fade-in">
          <button className="text-xs underline" style={{ color: COLORS.textMuted }}>
            Sobre este protótipo
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SCREEN: DASHBOARD
// ============================================================
function SubmitterDashboard() {
  const { navigate, captureScore, demandTitle, demandState, persona } = useApp();

  // Mocked exec data
  const totalSubmitted = 14;
  const inExecution = 3;
  const conversionRate = 64;
  const avgLeadTime = 8.5;
  const projectedSavings = 412;
  const monthlyTrend = [2, 1, 3, 2, 4, 5, 3, 6, 4, 7, 6, 8];
  const conversionTrend = [45, 48, 52, 55, 58, 62, 60, 63, 64];

  return (
    <div className="max-w-6xl animate-fade-in">
      <h1 className="text-2xl font-bold mb-1 tracking-tight" style={{ color: COLORS.textPrimary }}>
        Olá, {persona.name.split(' ')[0]}.
      </h1>
      <p className="text-sm mb-8" style={{ color: COLORS.textSecondary }}>
        Suas demandas, o que está acontecendo com elas, e o impacto que estão gerando.
      </p>

      <TourBanner
        personaId="submitter"
        title="Como Submitter você vai..."
        items={[
          'Criar uma demanda nova clicando em "+ Nova Demanda" — pode anexar PDF ou gravar áudio',
          'Responder pendências que a plataforma não conseguiu extrair sozinha (vermelhas = vazias, amarelas = baixa confiança)',
          'Acompanhar lead time, taxa de conversão e impacto financeiro projetado das suas demandas',
        ]}
      />

      {/* Hero metric: impacto financeiro */}
      <div className="border rounded-xl p-6 mb-6 animate-fade-in-up"
        style={{ background: `linear-gradient(135deg, ${persona.color}08 0%, ${COLORS.bgElevated} 100%)`, borderColor: COLORS.border }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>
              Impacto projetado das suas demandas em execução
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-5xl font-bold tracking-tight" style={{ color: COLORS.textPrimary, fontVariantNumeric: 'tabular-nums' }}>
                R$ {projectedSavings}k
              </div>
              <div className="text-sm font-medium" style={{ color: COLORS.success }}>
                ↑ R$ 87k este trimestre
              </div>
            </div>
            <div className="text-xs mt-2" style={{ color: COLORS.textSecondary }}>
              economia operacional + redução de inadimplência + ganhos de eficiência (anualizado)
            </div>
          </div>
          <div className="text-right">
            <Sparkline data={[280, 295, 310, 325, 340, 355, 370, 380, 395, 412]} color={persona.color} width={140} height={40} />
            <div className="text-xs mt-1" style={{ color: COLORS.textMuted }}>últimos 10 meses</div>
          </div>
        </div>
      </div>

      {/* KPIs operacionais */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="animate-fade-in-up stagger-1">
          <KPICard
            label="Total submetidas"
            value={totalSubmitted}
            sub="desde o início de 2026"
            icon={FileText}
            accent={persona.color}
          />
        </div>
        <div className="animate-fade-in-up stagger-2">
          <KPICard
            label="Em execução"
            value={inExecution}
            sub={`${Math.round((inExecution / totalSubmitted) * 100)}% da base`}
            icon={Play}
            accent={COLORS.success}
          />
        </div>
        <div className="animate-fade-in-up stagger-3">
          <KPICard
            label="Taxa de conversão"
            value={conversionRate}
            suffix="%"
            trend="+4pp"
            trendDir="up"
            sub="demanda → RP congelado"
            icon={CheckCircle2}
            accent={COLORS.info}
          />
        </div>
        <div className="animate-fade-in-up stagger-4">
          <KPICard
            label="Lead time médio"
            value={avgLeadTime}
            suffix="dias"
            trend="-1.2d"
            trendDir="up"
            sub="submissão → RP congelado"
            icon={Clock}
            accent={COLORS.warning}
          />
        </div>
      </div>

      {/* Visualizações em duas colunas */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {/* Funil */}
        <div className="col-span-2 border rounded-lg p-5 animate-fade-in-up" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-semibold" style={{ color: COLORS.textPrimary }}>Funil das suas demandas</div>
              <div className="text-xs" style={{ color: COLORS.textMuted }}>Onde a base de 14 se acomoda</div>
            </div>
            <span className="text-xs" style={{ color: COLORS.textMuted }}>YTD</span>
          </div>
          <Funnel steps={[
            { label: 'Submetidas', value: 14, color: COLORS.info },
            { label: 'Aprovadas em triagem', value: 11, color: '#F97316' },
            { label: 'RP congelado', value: 9, color: '#8B5CF6' },
            { label: 'Aceitas pelo PM', value: 7, color: COLORS.success },
            { label: 'Em execução', value: 3, color: '#059669' },
          ]} />
        </div>

        {/* Submissões por mês */}
        <div className="border rounded-lg p-5 animate-fade-in-up" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
          <div className="text-sm font-semibold mb-1" style={{ color: COLORS.textPrimary }}>Submissões / mês</div>
          <div className="text-xs mb-4" style={{ color: COLORS.textMuted }}>Últimos 12 meses</div>
          <div className="mb-3">
            <BarMini data={monthlyTrend} color={persona.color} height={64} />
          </div>
          <div className="flex justify-between text-xs" style={{ color: COLORS.textMuted }}>
            <span>jun/25</span>
            <span>mai/26</span>
          </div>
          <div className="mt-4 pt-3 border-t flex items-center justify-between" style={{ borderColor: COLORS.border }}>
            <span className="text-xs" style={{ color: COLORS.textSecondary }}>Mês atual</span>
            <span className="text-sm font-bold" style={{ color: COLORS.textPrimary, fontVariantNumeric: 'tabular-nums' }}>8 ↑</span>
          </div>
        </div>
      </div>

      {/* CTA + Demandas recentes */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: COLORS.textMuted }}>
          Suas demandas ativas
        </h2>
        <Button size="sm" icon={Plus} onClick={() => navigate('new-demand')}>Nova Demanda</Button>
      </div>

      <div className="space-y-2">
        <div
          onClick={() => navigate('capture-queue')}
          className="border rounded-lg p-4 cursor-pointer hover-lift animate-fade-in-up stagger-1"
          style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}
        >
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
              <div className="text-sm" style={{ color: COLORS.textSecondary }}>
                "Plataforma precisa receber por cartão recorrente"
              </div>
            </div>
            <ChevronRight size={16} style={{ color: COLORS.textMuted }} />
          </div>
        </div>

        {OTHER_DEMANDS.map((d, i) => (
          <div
            key={d.id}
            className={`border rounded-lg p-4 hover-lift animate-fade-in-up stagger-${i + 2}`}
            style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <FileText size={14} style={{ color: COLORS.textMuted }} />
                  <span className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>{d.title}</span>
                </div>
                <div className="flex items-center gap-3 text-xs mb-2">
                  <StatusPill status={d.state} />
                  {d.score !== undefined && <span style={{ color: COLORS.textMuted }}>Score: {d.score}%</span>}
                  <span style={{ color: COLORS.textMuted }}>{d.updated}</span>
                </div>
                {d.preview && (
                  <div className="text-sm" style={{ color: COLORS.textSecondary }}>"{d.preview}"</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlaceholderDashboard() {
  const { persona } = useApp();
  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.textPrimary }}>
        Bom dia, {persona.name.split(' ')[0]}.
      </h1>
      <p className="text-sm mb-8" style={{ color: COLORS.textSecondary }}>
        Dashboard de {persona.label}.
      </p>

      <div className="border rounded-lg p-8 text-center"
        style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border, borderStyle: 'dashed' }}>
        <Sparkles size={32} className="mx-auto mb-3" style={{ color: persona.color }} />
        <div className="font-semibold mb-1" style={{ color: COLORS.textPrimary }}>
          Visão de {persona.label} em construção
        </div>
        <div className="text-sm max-w-md mx-auto" style={{ color: COLORS.textSecondary }}>
          Esta versão do protótipo foca na jornada do Submitter ponta-a-ponta. As telas de {persona.label} serão adicionadas na próxima iteração.
        </div>
        <div className="text-xs mt-4" style={{ color: COLORS.textMuted }}>
          Troque para "Carlos Silva (Submitter)" no canto superior direito para ver o fluxo completo.
        </div>
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
        <button
          onClick={() => {
            const next = new Set(seenTours);
            next.add(tourKey);
            setSeenTours(next);
          }}
          className="text-xs underline hover:opacity-70"
          style={{ color: '#92400E' }}
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

function Dashboard() {
  const { persona } = useApp();
  if (persona?.id === 'submitter') return <SubmitterDashboard />;
  if (persona?.id === 'po') return <PODashboard />;
  if (persona?.id === 'cto') return <CTODashboard />;
  if (persona?.id === 'pm') return <PMDashboard />;
  if (persona?.id === 'viewer') return <ViewerDashboard />;
  return <PlaceholderDashboard />;
}

// ============================================================
// CTO DASHBOARD
// ============================================================
function CTODashboard() {
  const { navigate, persona, demandState, techScore } = useApp();
  const demandReadyForCTO = demandState === 'Em Avaliação Técnica';

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.textPrimary }}>
        Bom dia, {persona.name.split(' ')[0]}.
      </h1>
      <p className="text-sm mb-6" style={{ color: COLORS.textSecondary }}>Avaliações técnicas e ADRs.</p>

      <TourBanner
        personaId="cto"
        title="Como CTO você vai..."
        items={[
          'Receber demandas escaladas pelo PO com o pacote completo de produto',
          'Preencher 15 pendências técnicas (cada uma com sugestão da plataforma — "Usar essa sugestão" acelera)',
          'Registrar ADRs (4 sugeridas pré-preenchidas) — adicionar todas em 1 clique resolve a pendência',
          'No final, decidir se há bloqueador crítico. Sem bloqueador → anexa ao RP. Com bloqueador → volta pro PO',
        ]}
      />

      <div className="space-y-2 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: demandReadyForCTO ? COLORS.warning : COLORS.textMuted }} />
          <span className="text-sm" style={{ color: COLORS.textPrimary }}>
            <strong>{demandReadyForCTO ? '1' : '0'} escalada técnica</strong> aguardando você
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#7C3AED' }} />
          <span className="text-sm" style={{ color: COLORS.textPrimary }}>
            <strong>2 avaliações</strong> em andamento (mockadas)
          </span>
        </div>
      </div>

      {/* Escalas técnicas */}
      <section className="mb-10">
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: COLORS.textMuted }}>
          Escalas Técnicas
        </h2>

        {demandReadyForCTO ? (
          <div
            onClick={() => navigate('tech-evaluation')}
            className="border-2 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all"
            style={{ borderColor: persona.color, backgroundColor: `${persona.color}08` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>
                    Gateway de Pagamento Recorrente
                  </span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: COLORS.bgSubtle, color: COLORS.textSecondary }}>
                    DEM-2026-001
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs mb-2" style={{ color: COLORS.textMuted }}>
                  <span>Escalado por: Marina (PO)</span>
                  <span>·</span>
                  <span>há 1 dia</span>
                </div>
                <div className="flex items-center gap-3 text-xs" style={{ color: COLORS.textSecondary }}>
                  <span>Score do PO: <strong style={{ color: COLORS.success }}>100%</strong></span>
                  <span>·</span>
                  <span>Avaliação técnica: <strong>{techScore}%</strong></span>
                </div>
              </div>
              <Button size="sm" icon={ArrowRight} onClick={(e) => { e?.stopPropagation?.(); navigate('tech-evaluation'); }}>
                {techScore > 0 ? 'Continuar' : 'Iniciar avaliação'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="border rounded-lg p-8 text-center" style={{ backgroundColor: COLORS.bgSubtle, borderColor: COLORS.border, borderStyle: 'dashed' }}>
            <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
              style={{ backgroundColor: COLORS.bgElevated, border: `2px dashed ${COLORS.borderStrong}` }}>
              <Inbox size={20} style={{ color: COLORS.textMuted }} />
            </div>
            <div className="text-sm font-semibold mb-1" style={{ color: COLORS.textPrimary }}>
              Caixa vazia
            </div>
            <div className="text-xs max-w-sm mx-auto" style={{ color: COLORS.textMuted }}>
              Quando o PO concluir a racionalização e enviar ao CTO, a demanda aparece aqui com um ping de notificação.
            </div>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: COLORS.textMuted }}>
          Avaliações em andamento
        </h2>
        <div className="space-y-2">
          <div className="border rounded-lg p-4" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText size={14} style={{ color: COLORS.textMuted }} />
                <span className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>Migração de auth</span>
              </div>
              <span className="text-xs font-medium" style={{ color: COLORS.textSecondary }}>Score técnico: 70%</span>
            </div>
          </div>
          <div className="border rounded-lg p-4" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText size={14} style={{ color: COLORS.textMuted }} />
                <span className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>Performance do dashboard</span>
              </div>
              <span className="text-xs font-medium" style={{ color: COLORS.textSecondary }}>Score técnico: 45%</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ============================================================
// PM DASHBOARD
// ============================================================
function PMDashboard() {
  const { navigate, persona, demandState, rpVersion } = useApp();
  const rpReady = demandState === 'RP Congelado';

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.textPrimary }}>
        Bom dia, {persona.name.split(' ')[0]}.
      </h1>
      <p className="text-sm mb-6" style={{ color: COLORS.textSecondary }}>Readiness Packages aguardando sua avaliação.</p>

      <TourBanner
        personaId="pm"
        title="Como PM você vai..."
        items={[
          'Receber o RP congelado pela PO com avaliação técnica do CTO já anexada',
          'Selecionar trechos do documento para comentar, perguntar ou apontar gaps',
          'Gaps bloqueantes geram v1.1 obrigatória (volta pra Marina endereçar)',
          'Ou aceitar e dar prosseguimento — a demanda passa para Execução',
        ]}
      />

      <div className="mb-8">
        <span className="text-sm" style={{ color: COLORS.textPrimary }}>
          📦 <strong>{rpReady ? '1' : '0'} Readiness Package</strong> aguardando sua avaliação
        </span>
      </div>

      <section className="mb-10">
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: COLORS.textMuted }}>
          RPs Aguardando
        </h2>

        {rpReady ? (
          <div
            onClick={() => navigate('rp-view')}
            className="border-2 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all"
            style={{ borderColor: persona.color, backgroundColor: `${persona.color}08` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Layers size={14} style={{ color: persona.color }} />
                  <span className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>
                    RP-2026-001 {rpVersion || 'v1.0'} — Gateway de Pagamento Recorrente
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs mb-1" style={{ color: COLORS.textMuted }}>
                  <span>Congelado há: agora</span>
                  <span>·</span>
                  <span>PO: Marina</span>
                  <span>·</span>
                  <span>CTO: Rafael</span>
                </div>
                <div className="text-xs" style={{ color: COLORS.textSecondary }}>
                  Estimativa total: <strong>34 dias úteis</strong>
                </div>
              </div>
              <Button size="sm" icon={ArrowRight} onClick={(e) => { e?.stopPropagation?.(); navigate('rp-view'); }}>
                Abrir RP
              </Button>
            </div>
          </div>
        ) : (
          <div className="border rounded-lg p-8 text-center" style={{ backgroundColor: COLORS.bgSubtle, borderColor: COLORS.border, borderStyle: 'dashed' }}>
            <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
              style={{ backgroundColor: COLORS.bgElevated, border: `2px dashed ${COLORS.borderStrong}` }}>
              <Layers size={20} style={{ color: COLORS.textMuted }} />
            </div>
            <div className="text-sm font-semibold mb-1" style={{ color: COLORS.textPrimary }}>
              Nenhum RP aguardando avaliação
            </div>
            <div className="text-xs max-w-sm mx-auto" style={{ color: COLORS.textMuted }}>
              Quando o PO congelar um RP, você é notificada e o documento aparece aqui pra revisão.
            </div>
          </div>
        )}

        <div className="mt-3 border rounded-lg p-4 opacity-60" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Layers size={14} style={{ color: COLORS.textMuted }} />
              <span className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>
                RP-2025-099 v1.2 — Sistema de notificações push
              </span>
            </div>
            <span className="text-xs" style={{ color: COLORS.textMuted }}>Congelado há 5 dias</span>
          </div>
        </div>
      </section>
    </div>
  );
}

// ============================================================
// VIEWER DASHBOARD
// ============================================================
function ViewerDashboard() {
  const { navigate, persona, demandState, rpVersion } = useApp();
  const rpReady = demandState === 'RP Congelado';

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.textPrimary }}>
        Bom dia, {persona.name.split(' ')[0]}.
      </h1>
      <p className="text-sm mb-6" style={{ color: COLORS.textSecondary }}>Você tem acesso a Readiness Packages publicados.</p>

      <TourBanner
        personaId="viewer"
        title="Como Viewer você vai..."
        items={[
          'Ler RPs publicados onde você é stakeholder declarado (somente leitura)',
          'Selecionar trechos para comentar ou perguntar (não pode apontar gaps — só PM)',
          'Acompanhar o histórico completo via botão "🕐 Histórico" no topo',
        ]}
      />

      <section className="mb-10">
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: COLORS.textMuted }}>
          RPs Publicados
        </h2>
        {rpReady ? (
          <div
            onClick={() => navigate('rp-view')}
            className="border rounded-lg p-4 cursor-pointer hover:shadow-sm transition-all"
            style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Layers size={14} style={{ color: COLORS.textMuted }} />
                  <span className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>
                    RP-2026-001 {rpVersion || 'v1.0'} — Gateway de Pagamento Recorrente
                  </span>
                </div>
                <div className="text-xs" style={{ color: COLORS.textMuted }}>Atualizado agora</div>
              </div>
              <ChevronRight size={16} style={{ color: COLORS.textMuted }} />
            </div>
          </div>
        ) : (
          <div className="border rounded-lg p-8 text-center" style={{ backgroundColor: COLORS.bgSubtle, borderColor: COLORS.border, borderStyle: 'dashed' }}>
            <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
              style={{ backgroundColor: COLORS.bgElevated, border: `2px dashed ${COLORS.borderStrong}` }}>
              <Layers size={20} style={{ color: COLORS.textMuted }} />
            </div>
            <div className="text-sm font-semibold mb-1" style={{ color: COLORS.textPrimary }}>
              Nenhum RP publicado ainda
            </div>
            <div className="text-xs max-w-sm mx-auto" style={{ color: COLORS.textMuted }}>
              Você verá aqui quando o PO congelar um RP que inclua você como stakeholder declarado.
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

// ============================================================
// PO DASHBOARD
// ============================================================
function PODashboard() {
  const { navigate, persona, triageScore, racScore, demandState, returnedGaps } = useApp();
  const demandInTriage = demandState === 'Em Triagem';
  const demandInRac = demandState === 'Em Racionalização';
  const demandReadyToFreeze = demandState === 'Pronto para Congelamento';
  const demandReturned = demandState === 'Devolvido pelo PM';

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.textPrimary }}>
        Bom dia, {persona.name.split(' ')[0]}.
      </h1>
      <p className="text-sm mb-6" style={{ color: COLORS.textSecondary }}>
        Hoje você tem:
      </p>

      <TourBanner
        personaId="po"
        title="Como PO você vai..."
        items={[
          'Triar demandas novas (decidir entre Product Ready, Discovery, Backlog ou Rejeitar)',
          'Racionalizar com 12 pendências em 3 colunas — use o Chat na 3ª coluna pra ajuda contextual',
          'Iniciar Discovery (pesquisa externa, coleta, base de conhecimento) quando tiver dúvida',
          'Congelar a v1.0 do RP depois que o CTO devolver a avaliação técnica',
        ]}
      />

      <div className="space-y-2 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.danger }} />
          <span className="text-sm" style={{ color: COLORS.textPrimary }}>
            <strong>1 demanda crítica</strong> esperando triagem (chegou há 3h)
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#8B5CF6' }} />
          <span className="text-sm" style={{ color: COLORS.textPrimary }}>
            <strong>{ACTIVE_RATIONALIZATIONS.length + (demandInRac ? 1 : 0)} racionalizações</strong> em andamento
          </span>
        </div>
        {demandReadyToFreeze && (
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.success }} />
            <span className="text-sm" style={{ color: COLORS.textPrimary }}>
              <strong>1 demanda pronta para congelamento</strong> — CTO devolveu a avaliação técnica
            </span>
          </div>
        )}
      </div>

      {/* Ready to freeze CTA */}
      {demandReadyToFreeze && (
        <div
          onClick={() => navigate('rp-freeze')}
          className="border-2 rounded-lg p-4 mb-8 cursor-pointer hover:shadow-md transition-all"
          style={{ borderColor: COLORS.success, backgroundColor: `${COLORS.success}08` }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: COLORS.success, color: 'white' }}>
                <Check size={18} />
              </div>
              <div>
                <div className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>
                  Gateway de Pagamento Recorrente · pronto para congelamento
                </div>
                <div className="text-xs" style={{ color: COLORS.textSecondary }}>
                  CTO Rafael devolveu · 4 ADRs · 34 dias úteis estimados
                </div>
              </div>
            </div>
            <Button size="sm" icon={ArrowRight} onClick={(e) => { e?.stopPropagation?.(); navigate('rp-freeze'); }}>
              Revisar e congelar
            </Button>
          </div>
        </div>
      )}

      {/* Returned by PM CTA */}
      {demandReturned && (
        <div
          onClick={() => navigate('rp-revision')}
          className="border-2 rounded-lg p-4 mb-8 cursor-pointer hover:shadow-md transition-all"
          style={{ borderColor: COLORS.warning, backgroundColor: `${COLORS.warning}08` }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: COLORS.warning, color: 'white' }}>
                <AlertTriangle size={18} />
              </div>
              <div>
                <div className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>
                  Gateway de Pagamento Recorrente · devolvido pelo PM
                </div>
                <div className="text-xs" style={{ color: COLORS.textSecondary }}>
                  {returnedGaps.length} gap{returnedGaps.length !== 1 ? 's' : ''} bloqueante{returnedGaps.length !== 1 ? 's' : ''} · v1.1 a gerar
                </div>
              </div>
            </div>
            <Button size="sm" icon={ArrowRight} onClick={(e) => { e?.stopPropagation?.(); navigate('rp-revision'); }}>
              Revisar gaps
            </Button>
          </div>
        </div>
      )}

      {/* Triagem section */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: COLORS.textMuted }}>
            Fila de Triagem ({TRIAGE_QUEUE.length})
          </h2>
          <button onClick={() => navigate('triage-queue')} className="text-xs font-medium" style={{ color: persona.color }}>
            Ver todas →
          </button>
        </div>

        <div className="space-y-2">
          {TRIAGE_QUEUE.slice(0, 3).map(d => (
            <div
              key={d.id}
              onClick={() => navigate(d.isMain ? 'triage-detail' : 'triage-queue')}
              className="border rounded-lg p-4 cursor-pointer hover:shadow-sm transition-all"
              style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}
            >
              <div className="flex items-start gap-3">
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: `${d.priorityColor}15`, color: d.priorityColor }}
                >
                  {d.priority}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm mb-1" style={{ color: COLORS.textPrimary }}>
                    {d.title}
                  </div>
                  <div className="flex items-center gap-2 text-xs mb-2" style={{ color: COLORS.textMuted }}>
                    <span>De: {d.from}</span>
                    <span>·</span>
                    <span>{d.arrived}</span>
                    <span>·</span>
                    <span>SLA: {d.sla}</span>
                  </div>
                  <div className="text-sm" style={{ color: COLORS.textSecondary }}>
                    "{d.preview}"
                  </div>
                </div>
                <ChevronRight size={16} className="flex-shrink-0 mt-1" style={{ color: COLORS.textMuted }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rationalizations section */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: COLORS.textMuted }}>
          Racionalizações em andamento
        </h2>
        <div className="space-y-2">
          {demandInRac && (
            <div
              onClick={() => navigate('rationalization')}
              className="border rounded-lg p-4 cursor-pointer hover:shadow-sm transition-all"
              style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText size={14} style={{ color: COLORS.textMuted }} />
                  <span className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>
                    Gateway de Pagamento Recorrente
                  </span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: COLORS.bgSubtle, color: COLORS.textSecondary }}>
                    DEM-2026-001
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium" style={{ color: COLORS.textSecondary }}>Score: {racScore}%</span>
                  <ChevronRight size={16} style={{ color: COLORS.textMuted }} />
                </div>
              </div>
            </div>
          )}
          {ACTIVE_RATIONALIZATIONS.map(d => (
            <div
              key={d.id}
              className="border rounded-lg p-4"
              style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText size={14} style={{ color: COLORS.textMuted }} />
                  <span className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>{d.title}</span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: COLORS.bgSubtle, color: COLORS.textSecondary }}>
                    {d.id}
                  </span>
                </div>
                <span className="text-xs font-medium" style={{ color: COLORS.textSecondary }}>Score: {d.score}%</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ============================================================
// SCREEN: NEW DEMAND
// ============================================================
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
    // Persistir áudio gravado como anexo
    if (audio) {
      const newAudioAttachment = {
        id: `att-audio-${Date.now()}`,
        name: `audio-demanda-${audio.duration}s.mp3`,
        size: `${(audio.duration * 0.08).toFixed(1)} MB`,
        type: 'audio',
        duration: audio.duration,
      };
      setAttachments(prev => [...prev.filter(a => a.type !== 'audio'), newAudioAttachment]);
    }
    setProcessing(true);
    setProcessStage(0);
    setTimeout(() => setProcessStage(1), 800);
    setTimeout(() => setProcessStage(2), 1800);
    setTimeout(() => setProcessStage(3), 3000);
  };

  if (processing) {
    return (
      <div className="max-w-2xl mx-auto pt-16">
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
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: `${COLORS.success}20` }}>
                <Check size={32} style={{ color: COLORS.success }} />
              </div>
              <div className="text-xl font-semibold mb-2" style={{ color: COLORS.textPrimary }}>
                Processamento concluído
              </div>
              <div className="text-sm mb-6 max-w-md mx-auto" style={{ color: COLORS.textSecondary }}>
                Li seu documento e identifiquei 5 informações úteis. Vou usar pra adiantar o preenchimento. Faltam apenas 3 pendências pra você responder.
              </div>
              <Button size="lg" icon={ArrowRight} onClick={() => { navigate('capture-queue'); showToast('Demanda DEM-2026-001 criada'); }}>
                Continuar
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <button onClick={() => navigate('dashboard')} className="flex items-center gap-1 text-sm mb-4 hover:opacity-70" style={{ color: COLORS.textSecondary }}>
        <ChevronLeft size={14} /> Voltar
      </button>

      <h1 className="text-2xl font-bold mb-2" style={{ color: COLORS.textPrimary }}>Nova Demanda</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.textSecondary }}>
        Conta como se estivesse falando com um colega. A plataforma estrutura o resto.
      </p>

      <div className="border rounded-lg p-6" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: COLORS.textMuted }}>
          O que aconteceu?
        </label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={8}
          placeholder="Ex: A gente precisa começar a receber pagamento por cartão recorrente..."
          className="w-full p-3 text-sm rounded-md border focus:outline-none focus:ring-2 resize-none font-normal"
          style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg, color: COLORS.textPrimary }}
        />

        <div className="mt-4">
          <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: COLORS.textMuted }}>
            Ou anexe algo que ajude
          </label>
          <div className="flex gap-2 mb-3">
            <Button
              variant="secondary"
              size="sm"
              icon={Paperclip}
              onClick={() => setFiles(prev => [...prev, { id: Date.now(), name: 'documento-extra.pdf', size: '1.1 MB' }])}
            >
              Subir documento
            </Button>
            {!recording && !audio && (
              <Button variant="secondary" size="sm" icon={Mic} onClick={() => { setRecording(true); setRecordTime(0); }}>
                Gravar áudio
              </Button>
            )}
            {recording && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border" style={{ borderColor: COLORS.danger, backgroundColor: `${COLORS.danger}10` }}>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: COLORS.danger }} />
                <span className="text-xs font-medium" style={{ color: COLORS.danger }}>
                  Gravando {Math.floor(recordTime / 60)}:{String(recordTime % 60).padStart(2, '0')}
                </span>
                <button
                  onClick={() => { setRecording(false); setAudio({ duration: recordTime }); }}
                  className="ml-1 p-0.5 rounded hover:bg-red-100"
                >
                  <Square size={12} style={{ color: COLORS.danger }} fill={COLORS.danger} />
                </button>
              </div>
            )}
          </div>

          {files.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-xs font-medium" style={{ color: COLORS.textMuted }}>Documentos anexados:</div>
              {files.map(f => (
                <div key={f.id} className="flex items-center justify-between px-3 py-2 rounded-md border" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
                  <div className="flex items-center gap-2">
                    <FileText size={14} style={{ color: COLORS.textSecondary }} />
                    <span className="text-sm" style={{ color: COLORS.textPrimary }}>{f.name}</span>
                    <span className="text-xs" style={{ color: COLORS.textMuted }}>({f.size})</span>
                  </div>
                  <button onClick={() => setFiles(files.filter(x => x.id !== f.id))} className="p-1 hover:bg-stone-200 rounded">
                    <X size={12} style={{ color: COLORS.textMuted }} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {audio && (
            <div className="mt-2 flex items-center justify-between px-3 py-2 rounded-md border" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
              <div className="flex items-center gap-2">
                <Mic size={14} style={{ color: COLORS.textSecondary }} />
                <span className="text-sm" style={{ color: COLORS.textPrimary }}>
                  Áudio gravado: {Math.floor(audio.duration / 60)}:{String(audio.duration % 60).padStart(2, '0')}
                </span>
              </div>
              <button onClick={() => setAudio(null)} className="p-1 hover:bg-stone-200 rounded">
                <X size={12} style={{ color: COLORS.textMuted }} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="secondary" onClick={() => navigate('dashboard')}>Cancelar</Button>
        <Button
          icon={ArrowRight}
          disabled={!text.trim() && files.length === 0 && !audio}
          onClick={handleContinue}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}

function ProcessStep({ done, active, text }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      {done ? (
        <Check size={16} style={{ color: COLORS.success }} />
      ) : active ? (
        <Loader2 size={16} className="animate-spin" style={{ color: COLORS.info }} />
      ) : (
        <Circle size={16} style={{ color: COLORS.textMuted }} />
      )}
      <span style={{ color: done ? COLORS.textPrimary : active ? COLORS.textPrimary : COLORS.textMuted }}>{text}</span>
    </div>
  );
}

// ============================================================
// SCREEN: CAPTURE QUEUE
// ============================================================
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
    <div className="max-w-5xl animate-fade-in">
      <button onClick={() => navigate('dashboard')} className="flex items-center gap-1 text-sm mb-4 hover:opacity-70" style={{ color: COLORS.textSecondary }}>
        <ChevronLeft size={14} /> Dashboard
      </button>

      <div className="flex items-center gap-3 mb-2">
        <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: COLORS.bgSubtle, color: COLORS.textSecondary }}>
          DEM-2026-001
        </span>
        <StatusPill status="Em Captura" />
        <button
          onClick={() => navigate('timeline')}
          className="ml-auto text-xs flex items-center gap-1 px-2 py-1 rounded hover:bg-stone-100"
          style={{ color: COLORS.textSecondary }}
        >
          <Clock size={12} /> Histórico
        </button>
      </div>
      <h1 className="text-2xl font-bold mb-6 tracking-tight" style={{ color: COLORS.textPrimary }}>{demandTitle}</h1>

      {/* Header with score */}
      <div className="border rounded-lg p-6 mb-8 flex items-center gap-8" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <ScoreRing score={captureScore} size={96} strokeWidth={8} />
        <div className="flex-1">
          <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>
            Próximo passo
          </div>
          <div className="text-base font-semibold mb-1" style={{ color: COLORS.textPrimary }}>
            {captureScore === 100
              ? 'Tudo pronto! Envie para Triagem do PO.'
              : `Responder ${captureStats.empty + captureStats.lowConf} pendência${captureStats.empty + captureStats.lowConf > 1 ? 's' : ''}`}
          </div>
          {captureScore < 100 && (
            <div className="text-sm" style={{ color: COLORS.textSecondary }}>
              {captureStats.empty} {captureStats.empty === 1 ? 'vazia' : 'vazias'}, {captureStats.lowConf} com baixa confiança
            </div>
          )}
          <div className="mt-3 flex items-center gap-4 text-xs" style={{ color: COLORS.textMuted }}>
            <span>{captureStats.resolved} de {captureStats.total} resolvidas</span>
            <span>·</span>
            <span>{attachments.length} {attachments.length === 1 ? 'anexo' : 'anexos'}</span>
          </div>
        </div>
      </div>

      {/* Empty section */}
      {emptyOnes.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.danger }} />
            <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.danger }}>
              Precisam de você · {emptyOnes.length} {emptyOnes.length === 1 ? 'vazia' : 'vazias'}
            </h2>
          </div>
          <div className="space-y-2">
            {emptyOnes.map(p => <PendencyCard key={p.id} pendency={p} onClick={() => setSelected(p)} />)}
          </div>
        </section>
      )}

      {/* Low confidence section */}
      {lowConfOnes.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.warning }} />
            <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.warning }}>
              Precisam de confirmação · {lowConfOnes.length} com baixa confiança
            </h2>
          </div>
          <div className="space-y-2">
            {lowConfOnes.map(p => <PendencyCard key={p.id} pendency={p} onClick={() => setSelected(p)} />)}
          </div>
        </section>
      )}

      {/* Resolved section */}
      <section className="mb-8">
        <button
          onClick={() => setShowResolved(!showResolved)}
          className="flex items-center gap-2 mb-3 hover:opacity-80"
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.success }} />
          <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.success }}>
            Já resolvidas · {resolvedOnes.length}
          </h2>
          {showResolved ? <ChevronDown size={14} style={{ color: COLORS.textMuted }} /> : <ChevronRight size={14} style={{ color: COLORS.textMuted }} />}
        </button>
        {showResolved && (
          <div className="space-y-2">
            {resolvedOnes.map(p => <PendencyCard key={p.id} pendency={p} onClick={() => setSelected(p)} />)}
          </div>
        )}
      </section>

      {/* N/A section */}
      {naOnes.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.textMuted }} />
            <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.textMuted }}>
              Não aplicáveis · {naOnes.length}
            </h2>
          </div>
          <div className="space-y-2">
            {naOnes.map(p => <PendencyCard key={p.id} pendency={p} onClick={() => setSelected(p)} />)}
          </div>
        </section>
      )}

      {/* Action footer */}
      <div className="border rounded-lg p-4 flex items-center justify-between sticky bottom-4 shadow-md"
        style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div>
          <div className="text-xs" style={{ color: COLORS.textMuted }}>
            {canSend ? 'Pronto pra enviar' : `Faltam ${100 - captureScore}% pra liberar envio`}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate('capture-review')}>Revisar tudo</Button>
          <Button
            icon={Send}
            disabled={!canSend}
            onClick={() => navigate('capture-review')}
            className={canSend ? 'animate-pulse-slow' : ''}
          >
            Enviar para Triagem
          </Button>
        </div>
      </div>

      {selected && (
        <PendencyAnswerModal
          pendency={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

// ============================================================
// MODAL: PENDENCY ANSWER
// ============================================================
function PendencyAnswerModal({ pendency, onClose }) {
  const { updatePendency, showToast, capturePendencies } = useApp();
  const [mode, setMode] = useState('text'); // text, audio, file
  const [text, setText] = useState(pendency.a || '');
  const [audioStage, setAudioStage] = useState('idle'); // idle, recording, transcribing, done
  const [audioTime, setAudioTime] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [showNA, setShowNA] = useState(false);
  const [naReason, setNaReason] = useState('');

  const isLowConf = pendency.status === 'low_confidence';
  const isResolved = pendency.status === 'resolved';
  const isManual = pendency.status === 'manually_accepted';
  const isNA = pendency.status === 'not_applicable';
  const isEmpty = pendency.status === 'empty';

  // Pre-built mock transcriptions per pendency
  const MOCK_TRANSCRIPTIONS = {
    'cap-5': {
      transcription: 'A gente não pode mexer no contrato dos clientes existentes que pagam via boleto. Só novos clientes e quem topar migrar. Sobre orçamento, o custo de integração precisa caber no budget de eng do trimestre. E temos um compromisso de LGPD compliance no contrato com 2 clientes enterprise.',
      structured: [
        'Clientes em boleto existente: migração opt-in apenas',
        'Orçamento: dentro do trimestre de engenharia',
        'LGPD compliance é compromisso contratual com 2 clientes enterprise',
      ]
    },
    'cap-8': {
      transcription: 'Precisa avisar a CFO Ana, o head de eng Pedro, a Lucia que é CS lead e o Roberto do jurídico.',
      structured: [
        'CFO Ana Santos',
        'Head de Eng Pedro Costa',
        'CS Lead Lucia Mendes',
        'Jurídico Roberto Lima',
      ]
    }
  };

  useEffect(() => {
    if (audioStage !== 'recording') return;
    const t = setInterval(() => setAudioTime(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [audioStage]);

  const startRecording = () => { setAudioStage('recording'); setAudioTime(0); };
  const stopRecording = () => {
    setAudioStage('transcribing');
    setTimeout(() => setAudioStage('done'), 1800);
  };

  const handleSave = () => {
    const newAnswer = text.trim();
    if (!newAnswer) return;

    if (isLowConf || isResolved) {
      setAnalyzing(true);
      setTimeout(() => {
        // Determine new confidence based on whether text actually changed
        const changed = newAnswer !== pendency.a;
        const newConfidence = changed ? Math.min(98, pendency.confidence + 22) : pendency.confidence;
        updatePendency(pendency.id, {
          a: newAnswer,
          confidence: newConfidence,
          status: newConfidence >= 90 ? 'resolved' : 'low_confidence',
        });
        showToast(changed ? `Re-analisado! Confiança subiu para ${newConfidence}%` : 'Resposta confirmada');
        onClose();
      }, 1200);
    } else {
      updatePendency(pendency.id, {
        a: newAnswer,
        confidence: 95,
        status: 'resolved',
      });
      showToast('Pendência respondida');
      onClose();
    }
  };

  const acceptAsIs = () => {
    updatePendency(pendency.id, {
      a: pendency.a,
      confidence: pendency.confidence,
      status: 'manually_accepted',
    });
    showToast('Resposta aceita manualmente');
    onClose();
  };

  const markNotApplicable = (reason) => {
    updatePendency(pendency.id, {
      a: '',
      confidence: 0,
      status: 'not_applicable',
      naReason: reason,
    });
    showToast('Pendência marcada como N/A');
    onClose();
  };

  const useAudioTranscription = () => {
    const mock = MOCK_TRANSCRIPTIONS[pendency.id];
    if (mock) {
      const formatted = mock.structured.map((s, i) => `${i + 1}. ${s}`).join('\n');
      setText(formatted);
      setAudioStage('idle');
      setMode('text');
    }
  };

  const transcription = MOCK_TRANSCRIPTIONS[pendency.id];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-2xl rounded-xl shadow-2xl border max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}
      >
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: COLORS.border }}>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>
              {isEmpty ? 'Responder pendência' : isLowConf ? 'Revisar resposta' : 'Editar resposta'}
            </div>
            <div className="font-semibold text-base" style={{ color: COLORS.textPrimary }}>{pendency.q}</div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-stone-100 rounded">
            <X size={18} style={{ color: COLORS.textMuted }} />
          </button>
        </div>

        <div className="p-6">
          {/* If low confidence, show suggested answer with origin */}
          {isLowConf && (
            <div className="mb-5">
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>
                Resposta sugerida ({pendency.confidence}% de confiança)
              </div>
              <div className="border rounded-md p-3 mb-2" style={{ backgroundColor: `${COLORS.warning}10`, borderColor: `${COLORS.warning}40` }}>
                <div className="text-sm" style={{ color: COLORS.textPrimary }}>{pendency.a}</div>
              </div>
              <div className="text-xs" style={{ color: COLORS.textMuted }}>
                Origem: {pendency.source}
              </div>
              {pendency.hint && (
                <div className="flex gap-2 mt-3 p-3 rounded-md border" style={{ backgroundColor: `${COLORS.info}10`, borderColor: `${COLORS.info}30` }}>
                  <Sparkles size={14} className="flex-shrink-0 mt-0.5" style={{ color: COLORS.info }} />
                  <div className="text-xs" style={{ color: COLORS.textPrimary }}>
                    <span className="font-semibold">Dica:</span> {pendency.hint}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mode tabs */}
          {isEmpty && (
            <div className="mb-4">
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>
                Como você quer responder?
              </div>
              <div className="flex gap-2">
                <ModeButton active={mode === 'text'} icon={Edit3} label="Texto" onClick={() => setMode('text')} />
                <ModeButton active={mode === 'audio'} icon={Mic} label="Áudio" onClick={() => setMode('audio')} />
                <ModeButton active={mode === 'file'} icon={Paperclip} label="Anexar arquivo" onClick={() => setMode('file')} />
              </div>
            </div>
          )}

          {/* Text mode */}
          {(mode === 'text' || isLowConf || isResolved) && (
            <>
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>
                {isLowConf ? 'Edite se necessário' : 'Sua resposta'}
              </div>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                rows={6}
                placeholder="Pode escrever livremente. A plataforma vai estruturar pra você."
                className="w-full p-3 text-sm rounded-md border focus:outline-none focus:ring-2 resize-none"
                style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg, color: COLORS.textPrimary }}
              />
            </>
          )}

          {/* Audio mode */}
          {mode === 'audio' && isEmpty && (
            <div className="border rounded-lg p-6 text-center" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
              {audioStage === 'idle' && (
                <>
                  <Mic size={32} className="mx-auto mb-3" style={{ color: COLORS.textSecondary }} />
                  <div className="text-sm mb-4" style={{ color: COLORS.textPrimary }}>
                    Pressione para começar a gravar
                  </div>
                  <Button icon={Mic} onClick={startRecording}>Gravar</Button>
                </>
              )}
              {audioStage === 'recording' && (
                <>
                  <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center animate-pulse"
                    style={{ backgroundColor: `${COLORS.danger}20` }}>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.danger }} />
                  </div>
                  <div className="text-base font-semibold mb-1" style={{ color: COLORS.danger }}>
                    Gravando {Math.floor(audioTime / 60)}:{String(audioTime % 60).padStart(2, '0')}
                  </div>
                  <Button variant="danger" icon={Square} onClick={stopRecording}>Parar</Button>
                </>
              )}
              {audioStage === 'transcribing' && (
                <>
                  <Loader2 size={32} className="animate-spin mx-auto mb-3" style={{ color: COLORS.info }} />
                  <div className="text-sm" style={{ color: COLORS.textPrimary }}>
                    Áudio gravado. Transcrevendo...
                  </div>
                </>
              )}
              {audioStage === 'done' && transcription && (
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <Check size={16} style={{ color: COLORS.success }} />
                    <div className="text-sm font-semibold" style={{ color: COLORS.textPrimary }}>Transcrito:</div>
                  </div>
                  <div className="text-sm mb-4 p-3 rounded-md border" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border, color: COLORS.textSecondary, fontStyle: 'italic' }}>
                    "{transcription.transcription}"
                  </div>
                  <div className="text-sm font-medium mb-2" style={{ color: COLORS.textPrimary }}>
                    A plataforma identificou {transcription.structured.length} {transcription.structured.length === 1 ? 'item' : 'itens'} estruturados:
                  </div>
                  <div className="space-y-1.5 mb-4">
                    {transcription.structured.map((s, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-xs font-mono mt-0.5" style={{ color: COLORS.textMuted }}>{i + 1}.</span>
                        <span style={{ color: COLORS.textPrimary }}>{s}</span>
                      </div>
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

          {/* File mode */}
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
          <button
            onClick={() => setShowNA(!showNA)}
            className="text-xs underline hover:opacity-70"
            style={{ color: COLORS.textMuted }}
          >
            {showNA ? 'Cancelar N/A' : 'Não se aplica a esta demanda'}
          </button>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose} disabled={analyzing}>Cancelar</Button>
            {isLowConf && (
              <Button variant="secondary" onClick={acceptAsIs} disabled={analyzing}>Confirmar como está</Button>
            )}
            <Button onClick={handleSave} disabled={!text.trim() || analyzing}>
              {isLowConf ? 'Salvar edição' : 'Salvar resposta'}
            </Button>
          </div>
        </div>

        {showNA && (
          <div className="px-6 py-4 border-t" style={{ borderColor: COLORS.border, backgroundColor: '#FAFAF9' }}>
            <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>
              Justificativa de N/A (obrigatória)
            </div>
            <textarea
              value={naReason}
              onChange={e => setNaReason(e.target.value)}
              rows={2}
              placeholder="Ex: Esta demanda não tem dependências externas — todo o escopo é interno ao nosso stack."
              className="w-full p-2.5 text-sm rounded-md border focus:outline-none resize-none mb-2"
              style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgElevated, color: COLORS.textPrimary }}
            />
            <div className="flex justify-end">
              <Button size="sm" disabled={!naReason.trim()} onClick={() => markNotApplicable(naReason)}>
                Marcar como N/A
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ModeButton({ active, icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm font-medium transition-all"
      style={{
        backgroundColor: active ? COLORS.bgElevated : 'transparent',
        borderColor: active ? COLORS.borderStrong : COLORS.border,
        color: active ? COLORS.textPrimary : COLORS.textSecondary,
      }}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}

// ============================================================
// SCREEN: CAPTURE REVIEW (final review before sending)
// ============================================================
function CaptureReviewScreen() {
  const { capturePendencies, captureScore, navigate, showToast, demandTitle, setDemandState, addNotification } = useApp();
  const [showConfirm, setShowConfirm] = useState(false);
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="max-w-2xl mx-auto pt-16">
        <div className="border rounded-lg p-12 text-center" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: `${COLORS.success}20` }}>
            <Check size={32} style={{ color: COLORS.success }} />
          </div>
          <div className="text-xl font-semibold mb-2" style={{ color: COLORS.textPrimary }}>
            Demanda enviada à Triagem
          </div>
          <div className="text-sm mb-6 max-w-md mx-auto" style={{ color: COLORS.textSecondary }}>
            Marina (PO) recebeu sua demanda. Você será notificado quando a triagem começar. SLA esperado: até 3 dias úteis.
          </div>
          <div className="flex gap-2 justify-center">
            <Button variant="secondary" onClick={() => navigate('dashboard')}>Ir ao Dashboard</Button>
            <Button onClick={() => navigate('capture-queue')}>Ver demanda</Button>
          </div>
        </div>
      </div>
    );
  }

  const canSend = captureScore === 100;

  return (
    <div className="max-w-3xl">
      <button onClick={() => navigate('capture-queue')} className="flex items-center gap-1 text-sm mb-4 hover:opacity-70" style={{ color: COLORS.textSecondary }}>
        <ChevronLeft size={14} /> Voltar à fila
      </button>

      <div className="flex items-center gap-3 mb-2">
        <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: COLORS.bgSubtle, color: COLORS.textSecondary }}>
          DEM-2026-001
        </span>
        <StatusPill status="Em Captura" />
      </div>
      <h1 className="text-2xl font-bold mb-2" style={{ color: COLORS.textPrimary }}>Revisão da Captura</h1>
      <p className="text-sm mb-8" style={{ color: COLORS.textSecondary }}>{demandTitle}</p>

      {!canSend && (
        <div className="mb-6 p-4 rounded-lg border flex items-start gap-3" style={{ backgroundColor: `${COLORS.warning}10`, borderColor: `${COLORS.warning}40` }}>
          <AlertTriangle size={18} style={{ color: COLORS.warning }} className="flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-sm mb-1" style={{ color: COLORS.textPrimary }}>
              Captura ainda incompleta (Score: {captureScore}%)
            </div>
            <div className="text-sm" style={{ color: COLORS.textSecondary }}>
              Resolva todas as pendências antes de enviar para Triagem. <button onClick={() => navigate('capture-queue')} className="underline font-medium">Voltar à fila</button>
            </div>
          </div>
        </div>
      )}

      <div className="border rounded-lg" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: COLORS.border }}>
          <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.textMuted }}>
            Contexto Capturado
          </div>
        </div>
        <div className="p-6 space-y-6">
          {capturePendencies.map(p => (
            <div key={p.id} className="pb-5 border-b last:border-0 last:pb-0" style={{ borderColor: COLORS.border }}>
              <div className="text-sm font-semibold mb-2" style={{ color: COLORS.textPrimary }}>{p.q}</div>
              {p.a ? (
                <div className="text-sm mb-2 whitespace-pre-wrap" style={{ color: COLORS.textSecondary }}>{p.a}</div>
              ) : (
                <div className="text-sm italic mb-2" style={{ color: COLORS.danger }}>Sem resposta</div>
              )}
              <div className="flex items-center justify-between">
                {p.confidence > 0 && <ConfidenceBar value={p.confidence} compact />}
                <button onClick={() => navigate('capture-queue')} className="text-xs font-medium underline" style={{ color: COLORS.textSecondary }}>
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="secondary" onClick={() => navigate('capture-queue')}>Voltar a editar</Button>
        <Button icon={Send} disabled={!canSend} onClick={() => setShowConfirm(true)}>
          Enviar para Triagem do PO
        </Button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowConfirm(false)}>
          <div onClick={e => e.stopPropagation()} className="w-full max-w-md rounded-xl shadow-2xl border p-6"
            style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
            <div className="font-semibold text-lg mb-1" style={{ color: COLORS.textPrimary }}>
              Enviar para Triagem do PO?
            </div>
            <div className="text-sm mb-5" style={{ color: COLORS.textSecondary }}>
              Ao enviar:
            </div>
            <ul className="space-y-2 mb-5">
              {[
                'A demanda entra na fila de Marina (PO)',
                'Você será notificado quando ela triar',
                'Você ainda pode editar antes da triagem começar',
              ].map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check size={14} className="mt-0.5 flex-shrink-0" style={{ color: COLORS.success }} />
                  <span style={{ color: COLORS.textSecondary }}>{s}</span>
                </li>
              ))}
            </ul>
            <div className="text-xs mb-5 p-3 rounded-md" style={{ backgroundColor: COLORS.bgSubtle, color: COLORS.textSecondary }}>
              SLA esperado: até 3 dias úteis (prioridade Alta)
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancelar</Button>
              <Button
                onClick={() => {
                  setShowConfirm(false);
                  setSent(true);
                  setDemandState('Em Triagem');
                  addNotification({
                    forPersona: 'po',
                    type: 'demand-submitted',
                    title: 'Nova demanda na fila de Triagem',
                    body: 'Carlos Silva enviou "Gateway de Pagamento Recorrente" — prioridade Alta, SLA 3 dias',
                    demandId: 'DEM-2026-001',
                    icon: 'inbox',
                  });
                  showToast('Demanda enviada à Triagem!');
                }}
              >
                Confirmar envio
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// SCREEN: TRIAGE QUEUE
// ============================================================
function TriageQueueScreen() {
  const { navigate, demandState } = useApp();
  const [filter, setFilter] = useState('Todas');

  const filtered = filter === 'Todas' ? TRIAGE_QUEUE : TRIAGE_QUEUE.filter(d => d.priority === filter);

  return (
    <div className="max-w-5xl">
      <button onClick={() => navigate('dashboard')} className="flex items-center gap-1 text-sm mb-4 hover:opacity-70" style={{ color: COLORS.textSecondary }}>
        <ChevronLeft size={14} /> Dashboard
      </button>

      <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.textPrimary }}>Fila de Triagem</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.textSecondary }}>
        {TRIAGE_QUEUE.length} demandas aguardando sua decisão
      </p>

      <div className="flex gap-1 mb-6">
        {['Todas', 'Crítica', 'Alta', 'Média', 'Baixa'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
            style={{
              backgroundColor: filter === f ? COLORS.bgElevated : 'transparent',
              border: `1px solid ${filter === f ? COLORS.borderStrong : COLORS.border}`,
              color: filter === f ? COLORS.textPrimary : COLORS.textSecondary,
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map(d => {
          const isMain = d.isMain && demandState === 'Em Triagem';
          const isAlreadyTriaged = d.isMain && demandState !== 'Em Triagem';
          return (
            <div
              key={d.id}
              onClick={() => isMain ? navigate('triage-detail') : null}
              className={`border rounded-lg p-4 transition-all ${isMain ? 'cursor-pointer hover:shadow-sm' : 'opacity-60'}`}
              style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}
            >
              <div className="flex items-start gap-3">
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: `${d.priorityColor}15`, color: d.priorityColor }}
                >
                  {d.priority}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>{d.title}</span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: COLORS.bgSubtle, color: COLORS.textSecondary }}>
                      {d.id}
                    </span>
                    {isAlreadyTriaged && <StatusPill status={demandState} />}
                  </div>
                  <div className="flex items-center gap-2 text-xs mb-2" style={{ color: COLORS.textMuted }}>
                    <span>De: {d.from}</span>
                    <span>·</span>
                    <span>{d.arrived}</span>
                    <span>·</span>
                    <span>SLA: {d.sla}</span>
                  </div>
                  <div className="text-sm" style={{ color: COLORS.textSecondary }}>
                    "{d.preview}"
                  </div>
                </div>
                {isMain && (
                  <Button size="sm" icon={ArrowRight} onClick={(e) => { e?.stopPropagation?.(); navigate('triage-detail'); }}>
                    Triar agora
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// SCREEN: TRIAGE DETAIL
// ============================================================
function TriageDetailScreen() {
  const { navigate, capturePendencies, attachments, demandTitle, triageItems, updateTriageItem, triageScore, setDemandState, showToast, triageDraftSavedAt, setTriageDraftSavedAt, addNotification } = useApp();
  const [selected, setSelected] = useState(null);
  const [done, setDone] = useState(false);
  const [finalDecision, setFinalDecision] = useState(null);

  const canConclude = triageScore === 100;

  if (done) {
    return (
      <div className="max-w-2xl mx-auto pt-16">
        <div className="border rounded-lg p-12 text-center" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: `${COLORS.success}20` }}>
            <Check size={32} style={{ color: COLORS.success }} />
          </div>
          <div className="text-xl font-semibold mb-2" style={{ color: COLORS.textPrimary }}>
            Triagem concluída
          </div>
          <div className="text-base font-medium mb-1" style={{ color: COLORS.textPrimary }}>
            Decisão: <span style={{ color: COLORS.success }}>{finalDecision}</span>
          </div>
          <div className="text-sm mb-6 max-w-md mx-auto" style={{ color: COLORS.textSecondary }}>
            {finalDecision === 'Product Ready' && 'A demanda passa para Racionalização. Carlos foi notificado.'}
            {finalDecision === 'Discovery' && 'Discovery aberto com time-box de 2 semanas.'}
            {finalDecision === 'Backlog' && 'Demanda movida para o Backlog.'}
            {finalDecision === 'Rejeitar' && 'Submitter foi notificado da decisão.'}
          </div>
          <div className="flex gap-2 justify-center">
            <Button variant="secondary" onClick={() => navigate('dashboard')}>Voltar ao Dashboard</Button>
            {finalDecision === 'Product Ready' && (
              <Button icon={ArrowRight} onClick={() => navigate('rationalization')}>
                Ir para Racionalização
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <button onClick={() => navigate('triage-queue')} className="flex items-center gap-1 text-sm mb-4 hover:opacity-70" style={{ color: COLORS.textSecondary }}>
        <ChevronLeft size={14} /> Fila
      </button>

      <div className="flex items-center gap-3 mb-2">
        <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: COLORS.bgSubtle, color: COLORS.textSecondary }}>
          DEM-2026-001
        </span>
        <StatusPill status="Em Triagem" />
        <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: '#FEF2F2', color: COLORS.danger }}>
          Crítica
        </span>
      </div>
      <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.textPrimary }}>{demandTitle}</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.textSecondary }}>De: Carlos Silva (COO) · Prioridade declarada: Alta</p>

      <div className="grid grid-cols-2 gap-4 mb-20">
        {/* Coluna 1: Captura read-only */}
        <div className="border rounded-lg overflow-hidden" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.textMuted }}>
              Captura
            </div>
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

        {/* Coluna 2: Decisão */}
        <div className="border rounded-lg overflow-hidden" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.textMuted }}>
              Sua decisão
            </div>
            <div className="flex items-center gap-2">
              <ScoreRing score={triageScore} size={32} strokeWidth={4} />
            </div>
          </div>
          <div className="p-4 space-y-2">
            {triageItems.map(item => {
              const isDecided = item.decision !== null;
              const decisionLabel = isDecided ? (item.isPath ? item.decision : { yes: 'Sim', no: 'Não', partial: 'Parcial' }[item.decision]) : null;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className="border rounded-md p-3 cursor-pointer hover:shadow-sm transition-all"
                  style={{
                    backgroundColor: isDecided ? `${COLORS.success}08` : COLORS.bg,
                    borderColor: isDecided ? `${COLORS.success}40` : COLORS.border,
                  }}
                >
                  <div className="flex items-start gap-2">
                    {isDecided ? (
                      <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" style={{ color: COLORS.success }} />
                    ) : (
                      <AlertCircle size={16} className="mt-0.5 flex-shrink-0" style={{ color: COLORS.danger }} />
                    )}
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

      {/* Footer */}
      <div className="fixed bottom-4 left-64 right-4 max-w-6xl mx-auto border rounded-lg p-4 flex items-center justify-between shadow-md"
        style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="text-xs" style={{ color: COLORS.textMuted }}>
          {canConclude ? 'Pronto pra concluir' : `Score: ${triageScore}% — avalie todos os itens`}
          {triageDraftSavedAt && <span className="ml-2">· Rascunho salvo {triageDraftSavedAt}</span>}
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => {
            const now = new Date();
            const hhmm = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
            setTriageDraftSavedAt(hhmm);
            showToast('Rascunho salvo');
          }}>Salvar rascunho</Button>
          <Button
            size="sm"
            disabled={!canConclude}
            onClick={() => {
              const pathItem = triageItems.find(t => t.isPath);
              const decision = pathItem?.decision || 'Product Ready';
              setFinalDecision(decision);
              if (decision === 'Product Ready') {
                setDemandState('Em Racionalização');
              } else if (decision === 'Backlog') {
                setDemandState('Backlog');
              } else if (decision === 'Rejeitar') {
                setDemandState('Rejeitada');
              } else if (decision === 'Discovery') {
                setDemandState('Em Discovery');
              }
              addNotification({
                forPersona: 'submitter',
                type: 'triage-done',
                title: `Triagem da sua demanda: ${decision}`,
                body: `Marina Costa concluiu a triagem de "Gateway de Pagamento Recorrente"`,
                demandId: 'DEM-2026-001',
                icon: 'check',
              });
              setDone(true);
              showToast(`Triagem concluída: ${decision}`);
            }}
          >
            Concluir Triagem
          </Button>
        </div>
      </div>

      {selected && (
        <TriageItemModal
          item={selected}
          onClose={() => setSelected(null)}
          onSave={(decision, justification) => {
            updateTriageItem(selected.id, { decision, justification });
            setSelected(null);
            showToast('Item avaliado');
          }}
        />
      )}
    </div>
  );
}

// ============================================================
// MODAL: TRIAGE ITEM
// ============================================================
function TriageItemModal({ item, onClose, onSave }) {
  const [decision, setDecision] = useState(item.decision);
  const [justification, setJustification] = useState(item.justification || '');

  const isPath = item.isPath;
  const options = isPath
    ? [
        { value: 'Product Ready', label: 'Product Ready', desc: 'Vai direto para Racionalização. Contexto claro, sem incógnitas bloqueantes.' },
        { value: 'Discovery', label: 'Discovery', desc: 'Investigar antes de racionalizar. Time-box de 2 semanas.' },
        { value: 'Backlog', label: 'Backlog', desc: 'Boa demanda, mas não é prioridade agora.' },
        { value: 'Rejeitar', label: 'Rejeitar', desc: 'Não vai pra frente. Submitter notificado com justificativa.' },
      ]
    : [
        { value: 'yes', label: 'Sim', color: COLORS.success },
        { value: 'no', label: 'Não', color: COLORS.danger },
        { value: 'partial', label: 'Parcialmente', color: COLORS.warning },
      ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-2xl rounded-xl shadow-2xl border max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: COLORS.border }}>
          <div className="font-semibold text-base" style={{ color: COLORS.textPrimary }}>{item.q}</div>
          <button onClick={onClose} className="p-1 hover:bg-stone-100 rounded">
            <X size={18} style={{ color: COLORS.textMuted }} />
          </button>
        </div>

        <div className="p-6">
          {!isPath && (
            <div className="mb-5">
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>
                Sugestão da plataforma ({item.confidence}% de confiança)
              </div>
              <div className="border rounded-md p-3" style={{ backgroundColor: `${COLORS.info}10`, borderColor: `${COLORS.info}30` }}>
                <div className="text-sm" style={{ color: COLORS.textPrimary }}>{item.suggestion}</div>
              </div>
            </div>
          )}

          <div className="mb-5">
            <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>
              {isPath ? 'Escolha o caminho' : 'Sua avaliação'}
            </div>
            <div className={isPath ? 'space-y-2' : 'flex gap-2'}>
              {options.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setDecision(opt.value)}
                  className={`${isPath ? 'w-full text-left p-3' : 'flex-1 p-2.5'} rounded-md border transition-all`}
                  style={{
                    borderColor: decision === opt.value ? (opt.color || COLORS.info) : COLORS.border,
                    backgroundColor: decision === opt.value ? `${opt.color || COLORS.info}10` : COLORS.bg,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                      style={{ borderColor: decision === opt.value ? (opt.color || COLORS.info) : COLORS.borderStrong }}>
                      {decision === opt.value && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: opt.color || COLORS.info }} />}
                    </div>
                    <div className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>{opt.label}</div>
                  </div>
                  {opt.desc && (
                    <div className="text-xs mt-1 ml-6" style={{ color: COLORS.textSecondary }}>{opt.desc}</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-2">
            <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>
              Justificativa {!isPath && '(opcional se "Sim")'}
            </div>
            <textarea
              value={justification}
              onChange={e => setJustification(e.target.value)}
              rows={3}
              className="w-full p-3 text-sm rounded-md border focus:outline-none resize-none"
              style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg, color: COLORS.textPrimary }}
            />
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

// ============================================================
// SCREEN: RATIONALIZATIONS LIST
// ============================================================
function RationalizationsListScreen() {
  const { navigate, racScore, demandState } = useApp();
  const demandInRac = demandState === 'Em Racionalização';

  return (
    <div className="max-w-5xl">
      <button onClick={() => navigate('dashboard')} className="flex items-center gap-1 text-sm mb-4 hover:opacity-70" style={{ color: COLORS.textSecondary }}>
        <ChevronLeft size={14} /> Dashboard
      </button>

      <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.textPrimary }}>Racionalizações Ativas</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.textSecondary }}>
        {ACTIVE_RATIONALIZATIONS.length + (demandInRac ? 1 : 0)} demandas em racionalização
      </p>

      <div className="space-y-2">
        {demandInRac && (
          <div
            onClick={() => navigate('rationalization')}
            className="border rounded-lg p-4 cursor-pointer hover:shadow-sm transition-all"
            style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}
          >
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
// SCREEN: RATIONALIZATION (the big one)
// ============================================================
function RationalizationScreen() {
  const { navigate, racPendencies, racScore, racStats, demandTitle, capturePendencies, attachments, showToast, setDemandState, setRacPendencies, discoveryResults, racDraftSavedAt, setRacDraftSavedAt, addNotification } = useApp();
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
      <div className="max-w-2xl mx-auto pt-16">
        <div className="border rounded-lg p-12 text-center" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: `${COLORS.success}20` }}>
            <Check size={32} style={{ color: COLORS.success }} />
          </div>
          <div className="text-xl font-semibold mb-2" style={{ color: COLORS.textPrimary }}>
            Racionalização concluída
          </div>
          <div className="text-sm mb-6 max-w-md mx-auto" style={{ color: COLORS.textSecondary }}>
            Demanda escalada ao CTO Rafael. Para ver a próxima etapa, troque para o Rafael no canto superior direito.
          </div>
          <div className="flex gap-2 justify-center">
            <Button variant="secondary" onClick={() => navigate('dashboard')}>Voltar ao Dashboard</Button>
            <Button icon={ArrowRight} onClick={() => navigate('timeline')}>Ver histórico →</Button>
          </div>
        </div>
      </div>
    );
  }

  const addCustomPendency = () => {
    if (!customQ.trim()) return;
    const newP = {
      id: `rac-custom-${Date.now()}`,
      q: customQ.trim(),
      section: customSection,
      a: '',
      confidence: 0,
      status: 'empty',
      custom: true,
    };
    setRacPendencies(prev => [...prev, newP]);
    setCustomQ('');
    setShowAddCustom(false);
    showToast('Pendência customizada adicionada');
  };

  const saveDraft = () => {
    const now = new Date();
    const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setRacDraftSavedAt(hhmm);
    showToast('Rascunho salvo');
  };

  const escalateEarly = () => {
    setShowEscalate(true);
  };

  return (
    <div className="max-w-[1400px]">
      <button onClick={() => navigate('dashboard')} className="flex items-center gap-1 text-sm mb-4 hover:opacity-70" style={{ color: COLORS.textSecondary }}>
        <ChevronLeft size={14} /> Dashboard
      </button>

      <div className="flex items-center gap-3 mb-2">
        <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: COLORS.bgSubtle, color: COLORS.textSecondary }}>
          DEM-2026-001
        </span>
        <StatusPill status="Em Racionalização" />
        <button
          onClick={() => navigate('timeline')}
          className="ml-auto text-xs flex items-center gap-1 px-2 py-1 rounded hover:bg-stone-100"
          style={{ color: COLORS.textSecondary }}
        >
          <Clock size={12} /> Histórico
        </button>
      </div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: COLORS.textPrimary }}>{demandTitle}</h1>

      {/* Score header */}
      <div className="border rounded-lg p-5 mb-6 flex items-center gap-6"
        style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <ScoreRing score={racScore} size={80} strokeWidth={7} />
        <div className="flex-1">
          <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>
            Racionalização
          </div>
          <div className="text-base font-semibold mb-1" style={{ color: COLORS.textPrimary }}>
            {racScore === 100 ? 'Tudo pronto pra escalar ao CTO' : `${racStats.empty + racStats.lowConf} pendência${racStats.empty + racStats.lowConf > 1 ? 's' : ''} restante${racStats.empty + racStats.lowConf > 1 ? 's' : ''}`}
          </div>
          <div className="text-sm" style={{ color: COLORS.textSecondary }}>
            {racStats.resolved} de {racStats.total} resolvidas · {Object.keys(discoveryResults).length} discovery{Object.keys(discoveryResults).length !== 1 ? 's' : ''} feito{Object.keys(discoveryResults).length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* 3-COLUMN LAYOUT per spec */}
      <div className="grid grid-cols-12 gap-4 mb-24">
        {/* Col 1: Context (3/12) */}
        <div className="col-span-3">
          <button
            onClick={() => setContextOpen(!contextOpen)}
            className="w-full border rounded-lg p-3 mb-2 flex items-center justify-between hover:shadow-sm transition-all"
            style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}
          >
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.textMuted }}>Contexto</div>
            {contextOpen ? <ChevronDown size={14} style={{ color: COLORS.textMuted }} /> : <ChevronRight size={14} style={{ color: COLORS.textMuted }} />}
          </button>

          {contextOpen && (
            <div className="border rounded-lg p-4 space-y-4 max-h-[600px] overflow-y-auto"
              style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
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
                  <Check size={12} style={{ color: COLORS.success }} />
                  Product Ready — Marina
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
                    <div className="text-xs font-semibold mt-3 mb-2 uppercase tracking-wider" style={{ color: COLORS.textMuted }}>
                      Discoveries
                    </div>
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

        {/* Col 2: Pendency queue (6/12) — main column */}
        <div className="col-span-6">
          {empty.length > 0 && (
            <section className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.danger }} />
                <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.danger }}>
                  Vazias · {empty.length}
                </h2>
              </div>
              <div className="space-y-2">
                {empty.map(p => <PendencyCard key={p.id} pendency={p} onClick={() => setSelected(p)} />)}
              </div>
            </section>
          )}

          {lowConf.length > 0 && (
            <section className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.warning }} />
                <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.warning }}>
                  Baixa confiança · {lowConf.length}
                </h2>
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
                <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.success }}>
                  Resolvidas · {resolved.length}
                </h2>
              </div>
              <div className="space-y-2">
                {resolved.map(p => <PendencyCard key={p.id} pendency={p} onClick={() => setSelected(p)} />)}
              </div>
            </section>
          )}

          {naItems.length > 0 && (
            <section className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.textMuted }} />
                <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.textMuted }}>
                  Não aplicáveis · {naItems.length}
                </h2>
              </div>
              <div className="space-y-2">
                {naItems.map(p => <PendencyCard key={p.id} pendency={p} onClick={() => setSelected(p)} />)}
              </div>
            </section>
          )}

          {/* Add custom pendency */}
          {showAddCustom ? (
            <div className="border rounded-lg p-4" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: COLORS.textMuted }}>
                Nova pendência customizada
              </div>
              <input
                value={customQ}
                onChange={e => setCustomQ(e.target.value)}
                placeholder="Ex: Como tratamos casos de retry após falha no cartão?"
                className="w-full p-2.5 text-sm rounded-md border focus:outline-none mb-3"
                style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg, color: COLORS.textPrimary }}
              />
              <div className="flex gap-2 mb-3">
                {['Contexto', 'Escopo', 'Regras', 'Validação', 'Riscos', 'Stakeholders', 'Dependências'].map(s => (
                  <button
                    key={s}
                    onClick={() => setCustomSection(s)}
                    className="px-2.5 py-1 rounded-md text-xs font-medium transition-all"
                    style={{
                      backgroundColor: customSection === s ? '#8B5CF6' : 'transparent',
                      color: customSection === s ? 'white' : COLORS.textSecondary,
                      border: `1px solid ${customSection === s ? '#8B5CF6' : COLORS.border}`,
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="secondary" size="sm" onClick={() => { setShowAddCustom(false); setCustomQ(''); }}>Cancelar</Button>
                <Button size="sm" disabled={!customQ.trim()} onClick={addCustomPendency}>Adicionar</Button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddCustom(true)}
              className="w-full border-2 border-dashed rounded-lg p-4 flex items-center justify-center gap-2 text-sm font-medium hover:bg-stone-50 transition-all"
              style={{ borderColor: COLORS.border, color: COLORS.textSecondary }}
            >
              <Plus size={14} />
              Adicionar pendência customizada
            </button>
          )}
        </div>

        {/* Col 3: Inline chat (3/12) per spec */}
        <div className="col-span-3">
          <InlineChat context="Racionalização — DEM-2026-001" />
        </div>
      </div>

      {/* Action footer */}
      <div className="fixed bottom-4 left-64 right-4 max-w-[1400px] mx-auto border rounded-lg p-4 flex items-center justify-between shadow-md"
        style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="text-xs" style={{ color: COLORS.textMuted }}>
          {racScore === 100 ? 'Pronto pra escalar ao CTO' : `Faltam ${100 - racScore}% pra liberar o envio ao CTO`}
          {racDraftSavedAt && <span className="ml-2">· Rascunho salvo {racDraftSavedAt}</span>}
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={saveDraft}>Salvar rascunho</Button>
          <Button variant="secondary" size="sm" onClick={escalateEarly}>Escalar para CTO antes do tempo</Button>
          <Button
            size="sm"
            icon={Send}
            disabled={racScore !== 100}
            onClick={() => {
              setCompleted(true);
              setDemandState('Em Avaliação Técnica');
              addNotification({
                forPersona: 'cto',
                type: 'tech-escalation',
                title: 'Nova escalada técnica',
                body: 'Marina escalou "Gateway de Pagamento Recorrente" para avaliação técnica',
                demandId: 'DEM-2026-001',
                icon: 'inbox',
              });
              showToast('Demanda escalada ao CTO!');
            }}
          >
            Enviar ao CTO
          </Button>
        </div>
      </div>

      {selected && (
        <RacPendencyModal
          pendency={selected}
          onClose={() => setSelected(null)}
        />
      )}

      {showEscalate && (
        <EscalateEarlyModal
          score={racScore}
          onClose={() => setShowEscalate(false)}
          onConfirm={(reason) => {
            setShowEscalate(false);
            setCompleted(true);
            setDemandState('Em Avaliação Técnica');
            showToast('Escalada antecipada enviada ao CTO');
          }}
        />
      )}
    </div>
  );
}

// ============================================================
// INLINE CHAT (3rd column on Racionalização)
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
        suggestions: ['💡 Ajude com Objetivos', '💡 Ajude com Critérios de sucesso', '💡 Mostre demandas similares'],
      }]);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const send = (text) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { from: 'user', text }]);
    setInput('');
    setTimeout(() => {
      let resp;
      const l = text.toLowerCase();
      if (l.includes('objetivo')) {
        resp = {
          from: 'bot',
          text: 'Para objetivos SMART, trabalho com 3 dimensões: redução de custo, aumento de receita, melhoria de experiência. Qual a meta de % de migração nos primeiros 6 meses?',
          suggestions: ['20%', '40%', '60%', 'Outro valor'],
        };
      } else if (l.includes('critério') || l.includes('sucesso')) {
        resp = {
          from: 'bot',
          text: 'Critérios de sucesso devem ser quantitativos e mensuráveis pós-entrega:\n\n• % de migração\n• Redução de horas em reconciliação\n• Redução de inadimplência\n• NPS dos clientes migrados\n\nQuer que eu sugira metas específicas?',
        };
      } else if (l.includes('similar')) {
        resp = {
          from: 'bot',
          text: '2 demandas similares:\n\n📄 DEM-2025-067 — Cobrança PIX (concluída)\n📄 DEM-2025-089 — Migração billing (em execução)\n\nQuer ver ADRs e critérios usados?',
        };
      } else if (['20%', '40%', '60%'].includes(text)) {
        resp = {
          from: 'bot',
          text: `Boa. Com meta de ${text} de migração em 6 meses, sugiro estes objetivos:\n\n1. Migrar ${text} da base ativa em boleto para cartão recorrente\n2. Reduzir 30h/mês em reconciliação manual\n3. Diminuir inadimplência de 18% para ≤10%\n\nUse isto na pendência "Objetivos de negócio".`,
        };
      } else {
        resp = {
          from: 'bot',
          text: 'Posso te ajudar de 3 formas: 1) Estruturar uma resposta, 2) Buscar referências externas, 3) Buscar demandas similares na base. O que você prefere?',
        };
      }
      setMessages(prev => [...prev, resp]);
    }, 700);
  };

  return (
    <div className="border rounded-lg flex flex-col h-[600px]"
      style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
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
            {msg.from === 'bot' && (
              <div className="text-xs font-semibold mb-1" style={{ color: COLORS.textMuted }}>Plataforma</div>
            )}
            {msg.from === 'user' && (
              <div className="text-xs font-semibold mb-1 text-right" style={{ color: persona?.color }}>Você</div>
            )}
            <div
              className={`text-xs whitespace-pre-wrap rounded-lg px-2.5 py-2 ${msg.from === 'user' ? 'ml-4' : 'mr-4'}`}
              style={{
                backgroundColor: msg.from === 'user' ? `${persona?.color}15` : COLORS.bgSubtle,
                color: COLORS.textPrimary,
              }}
            >
              {msg.text}
            </div>
            {msg.suggestions && (
              <div className="flex flex-wrap gap-1 mt-2 mr-4">
                {msg.suggestions.map((s, j) => (
                  <button
                    key={j}
                    onClick={() => send(s.replace(/^[💡🔍📚]\s*/, ''))}
                    className="text-xs px-2 py-0.5 rounded-full border hover:bg-stone-50"
                    style={{ borderColor: COLORS.border, color: COLORS.textSecondary }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="p-2 border-t" style={{ borderColor: COLORS.border }}>
        <div className="flex gap-1">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send(input)}
            placeholder="Pergunte ou peça ajuda..."
            className="flex-1 px-2 py-1.5 text-xs rounded-md border focus:outline-none"
            style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
          />
          <button
            onClick={() => send(input)}
            className="p-1.5 rounded-md"
            style={{ backgroundColor: persona?.color, color: 'white' }}
          >
            <Send size={12} />
          </button>
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
      <div onClick={e => e.stopPropagation()} className="w-full max-w-md rounded-xl shadow-2xl border p-6"
        style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="font-semibold text-lg mb-1" style={{ color: COLORS.textPrimary }}>
          Escalar ao CTO antes do tempo?
        </div>
        <div className="text-sm mb-4" style={{ color: COLORS.textSecondary }}>
          Score atual: <strong>{score}%</strong>. Use quando precisar de validação técnica para destravar pendências do produto.
        </div>
        <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>
          Motivo da escalada (obrigatório)
        </div>
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          rows={3}
          placeholder="Ex: Preciso da decisão técnica sobre payment provider antes de fechar Escopo IN."
          className="w-full p-3 text-sm rounded-md border focus:outline-none resize-none mb-4"
          style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg, color: COLORS.textPrimary }}
        />
        <div className="text-xs mb-5 p-3 rounded-md" style={{ backgroundColor: `${COLORS.warning}10`, color: COLORS.textSecondary }}>
          ⚠️ A escalada antecipada notifica o CTO sobre racionalização incompleta. Ele pode ajudar, devolver pra mais discovery, ou aceitar tocar em paralelo.
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
// MODAL: RAC PENDENCY (with Discovery)
// ============================================================
function RacPendencyModal({ pendency, onClose }) {
  const { updateRacPendency, showToast, discoveryResults, setDiscoveryResults, pendingCollects, setPendingCollects, addNotification } = useApp();
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
      const newConfidence = isLowConf
        ? (text !== pendency.a ? Math.min(98, pendency.confidence + 25) : pendency.confidence)
        : 92;
      updateRacPendency(pendency.id, {
        a: text.trim(),
        confidence: newConfidence,
        status: newConfidence >= 90 ? 'resolved' : 'low_confidence',
      });
      showToast('Resposta salva');
      onClose();
    }, 1000);
  };

  const acceptAsIs = () => {
    updateRacPendency(pendency.id, { status: 'manually_accepted' });
    showToast('Resposta aceita manualmente');
    onClose();
  };

  const markNotApplicable = () => {
    updateRacPendency(pendency.id, {
      a: '',
      confidence: 0,
      status: 'not_applicable',
      naReason: naReason,
    });
    showToast('Pendência marcada como N/A');
    onClose();
  };

  const runDiscovery = () => {
    setDiscoveryStage('querying');
    setTimeout(() => {
      setDiscoveryStage('results');
      setDiscoveryResults({
        ...discoveryResults,
        [pendency.id]: {
          type: 'Pesquisa externa',
          summary: 'Stripe / Pagar.me / Mercado Pago — comparativo',
          date: new Date().toISOString(),
        }
      });
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-3xl rounded-xl shadow-2xl border max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: COLORS.border }}>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>
              {pendency.section}
            </div>
            <div className="font-semibold text-base" style={{ color: COLORS.textPrimary }}>{pendency.q}</div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-stone-100 rounded">
            <X size={18} style={{ color: COLORS.textMuted }} />
          </button>
        </div>

        <div className="p-6">
          {isLowConf && (
            <div className="mb-5">
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>
                Resposta atual ({pendency.confidence}% de confiança)
              </div>
              <div className="border rounded-md p-3 mb-2" style={{ backgroundColor: `${COLORS.warning}10`, borderColor: `${COLORS.warning}40` }}>
                <div className="text-sm" style={{ color: COLORS.textPrimary }}>{pendency.a}</div>
              </div>
              {pendency.hint && (
                <div className="flex gap-2 p-3 rounded-md border" style={{ backgroundColor: `${COLORS.info}10`, borderColor: `${COLORS.info}30` }}>
                  <Sparkles size={14} className="flex-shrink-0 mt-0.5" style={{ color: COLORS.info }} />
                  <div className="text-xs" style={{ color: COLORS.textPrimary }}>
                    <span className="font-semibold">Dica:</span> {pendency.hint}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Discovery section */}
          {discoveryStage === 'idle' && !existingResult && (
            <div className="border rounded-md p-4 mb-5" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
              <div className="flex items-start gap-3">
                <Search size={16} className="mt-0.5" style={{ color: COLORS.info }} />
                <div className="flex-1">
                  <div className="text-sm font-semibold mb-1" style={{ color: COLORS.textPrimary }}>
                    Está com dúvida? Inicie um Discovery.
                  </div>
                  <div className="text-xs mb-3" style={{ color: COLORS.textSecondary }}>
                    A plataforma busca, traz comparativos, e você valida.
                  </div>
                  <Button variant="secondary" size="sm" icon={Search} onClick={() => setDiscoveryStage('choosing')}>
                    Iniciar Discovery
                  </Button>
                </div>
              </div>
            </div>
          )}

          {discoveryStage === 'idle' && existingResult && (
            <div className="border rounded-md p-4 mb-5" style={{ borderColor: `${COLORS.success}40`, backgroundColor: `${COLORS.success}08` }}>
              <div className="flex items-start gap-3">
                <Check size={16} className="mt-0.5" style={{ color: COLORS.success }} />
                <div className="flex-1">
                  <div className="text-sm font-semibold mb-1" style={{ color: COLORS.textPrimary }}>
                    Discovery realizado: {existingResult.type}
                  </div>
                  <div className="text-xs mb-3" style={{ color: COLORS.textSecondary }}>
                    {existingResult.summary}
                  </div>
                  <Button variant="ghost" size="sm" icon={Search} onClick={() => setDiscoveryStage('choosing')}>
                    Refazer ou adicionar outro Discovery
                  </Button>
                </div>
              </div>
            </div>
          )}

          {discoveryStage === 'choosing' && (
            <div className="mb-5">
              <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: COLORS.textMuted }}>
                Que tipo de Discovery?
              </div>
              <div className="space-y-2">
                {[
                  { id: 'external', icon: '🌐', title: 'Pesquisa em fontes externas', desc: 'A plataforma busca, traz comparativos, você valida.' },
                  { id: 'collect', icon: '💬', title: 'Coleta com originador / cliente', desc: 'Dispara perguntas estruturadas pro Submitter ou stakeholder.' },
                  { id: 'kb', icon: '📚', title: 'Base de conhecimento interna', desc: 'Decisões anteriores, projetos similares, ADRs registrados.' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setDiscoveryType(opt.id);
                      if (opt.id === 'external') {
                        setDiscoveryStage('querying-form');
                      } else {
                        setDiscoveryStage('querying');
                        setTimeout(() => {
                          setDiscoveryStage('results-other');
                          setDiscoveryResults({
                            ...discoveryResults,
                            [pendency.id]: {
                              type: opt.id === 'collect' ? 'Coleta com originador' : 'Base de conhecimento',
                              summary: opt.id === 'collect' ? '3 perguntas estruturadas enviadas' : '2 demandas similares encontradas',
                              date: new Date().toISOString(),
                            }
                          });
                        }, 2000);
                      }
                    }}
                    className="w-full text-left p-3 rounded-md border hover:shadow-sm transition-all"
                    style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
                  >
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
              <button onClick={() => setDiscoveryStage('idle')} className="mt-3 text-xs underline" style={{ color: COLORS.textMuted }}>
                Cancelar Discovery
              </button>
            </div>
          )}

          {discoveryStage === 'querying-form' && (
            <div className="mb-5 border rounded-md p-4" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>
                O que você quer pesquisar?
              </div>
              <textarea
                value={discoveryQuery}
                onChange={e => setDiscoveryQuery(e.target.value)}
                rows={3}
                className="w-full p-3 text-sm rounded-md border focus:outline-none resize-none mb-3"
                style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgElevated, color: COLORS.textPrimary }}
              />
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
                <div className="text-sm font-semibold" style={{ color: COLORS.textPrimary }}>
                  Discovery concluído — 5 fontes encontradas
                </div>
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
                  <tbody style={{ color: COLORS.textSecondary }}>
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
                          <td key={j} className="p-2 border" style={{ borderColor: COLORS.border, color: j === 0 ? COLORS.textPrimary : COLORS.textSecondary, fontWeight: j === 0 ? 600 : 400 }}>
                            {cell}
                          </td>
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
                <Button variant="secondary" size="sm" icon={Paperclip} onClick={() => showToast('Discovery anexado à pendência')}>
                  Anexar à pendência
                </Button>
                <Button size="sm" onClick={() => {
                  setText(`Escopo IN: Integração via Stripe (taxa 3,99% + R$0,39, melhor doc, chargeback avançado, LGPD com DPA, integração em 2-3 semanas). Implementar fluxo opt-in para clientes em boleto, webhook robusto, retry automático em falhas.`);
                  setDiscoveryStage('idle');
                }}>
                  Usar como base
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setDiscoveryStage('querying-form')}>Refinar pesquisa</Button>
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
                  <div className="text-sm mb-3" style={{ color: COLORS.textPrimary }}>
                    Vou enviar 3 perguntas estruturadas a Carlos (COO):
                  </div>
                  <ul className="text-sm space-y-1.5 mb-3 ml-4" style={{ color: COLORS.textSecondary }}>
                    <li>1. Qual a meta de % de migração nos primeiros 6 meses?</li>
                    <li>2. Há incentivo para clientes que migrarem (desconto, brinde)?</li>
                    <li>3. Quem assina a decisão de cancelar contratos de clientes que não migrarem?</li>
                  </ul>
                  <Button size="sm" onClick={() => {
                    const collectId = `col-${Date.now()}`;
                    setPendingCollects(prev => [...prev, {
                      id: collectId,
                      demandId: 'DEM-2026-001',
                      demandTitle: 'Gateway de Pagamento Recorrente',
                      pendencyContext: pendency.q,
                      askedBy: 'Marina Costa (PO)',
                      questions: [
                        'Qual a meta de % de migração nos primeiros 6 meses?',
                        'Há incentivo para clientes que migrarem (desconto, brinde)?',
                        'Quem assina a decisão de cancelar contratos de clientes que não migrarem?',
                      ],
                      status: 'pending',
                      timestamp: new Date(),
                    }]);
                    addNotification({
                      forPersona: 'submitter',
                      type: 'collect-request',
                      title: 'Marina precisa de mais informações',
                      body: '3 perguntas sobre "Gateway de Pagamento Recorrente"',
                      demandId: 'DEM-2026-001',
                      icon: 'message',
                      actionScreen: 'collect-inbox',
                    });
                    showToast('Coleta enviada ao Submitter');
                    setDiscoveryStage('idle');
                  }}>
                    Enviar coleta
                  </Button>
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

          {/* Text input */}
          <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>
            Sua resposta
          </div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={6}
            placeholder="Pode escrever livremente. A plataforma vai estruturar pra você."
            className="w-full p-3 text-sm rounded-md border focus:outline-none resize-none"
            style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg, color: COLORS.textPrimary }}
          />

          {analyzing && (
            <div className="mt-4 flex items-center gap-2 p-3 rounded-md" style={{ backgroundColor: `${COLORS.info}10` }}>
              <Loader2 size={14} className="animate-spin" style={{ color: COLORS.info }} />
              <span className="text-sm" style={{ color: COLORS.info }}>Re-analisando confiança...</span>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t flex justify-between items-center gap-2" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
          <button
            onClick={() => setShowNA(!showNA)}
            className="text-xs underline hover:opacity-70"
            style={{ color: COLORS.textMuted }}
          >
            {showNA ? 'Cancelar N/A' : 'Não se aplica a esta demanda'}
          </button>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose} disabled={analyzing}>Cancelar</Button>
            {isLowConf && <Button variant="secondary" onClick={acceptAsIs} disabled={analyzing}>Confirmar como está</Button>}
            <Button onClick={handleSave} disabled={!text.trim() || analyzing}>Salvar resposta</Button>
          </div>
        </div>

        {showNA && (
          <div className="px-6 py-4 border-t" style={{ borderColor: COLORS.border, backgroundColor: '#FAFAF9' }}>
            <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>
              Justificativa de N/A (obrigatória)
            </div>
            <textarea
              value={naReason}
              onChange={e => setNaReason(e.target.value)}
              rows={2}
              placeholder="Ex: Esta demanda não tem dependências externas — todo o escopo é interno ao nosso stack."
              className="w-full p-2.5 text-sm rounded-md border focus:outline-none resize-none mb-2"
              style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgElevated, color: COLORS.textPrimary }}
            />
            <div className="flex justify-end">
              <Button size="sm" disabled={!naReason.trim()} onClick={markNotApplicable}>
                Marcar como N/A
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// SCREEN: RP FREEZE (PO reviews + congelamento — seção 11.1/11.2)
// ============================================================
function RPFreezeScreen() {
  const { navigate, capturePendencies, racPendencies, demandTitle, showToast, setDemandState, setRpVersion, adrs: realAdrs, addNotification } = useApp();
  const [activeSection, setActiveSection] = useState('contexto');
  const [showFreezeModal, setShowFreezeModal] = useState(false);
  const [frozen, setFrozen] = useState(false);

  // Use real ADRs from CTO if available, else fallback to mock
  const adrsToUse = realAdrs && realAdrs.length > 0 ? realAdrs : [
    { id: 'ADR-001', title: 'Camada de abstração de Payment Provider', summary: 'Implementar interface unificada para permitir trocar de provider sem reescrita.' },
    { id: 'ADR-002', title: 'Webhook handler com retry exponencial', summary: 'Garantir entrega idempotente de eventos do gateway.' },
    { id: 'ADR-003', title: 'Vault tokenizado para dados de cartão', summary: 'PCI-DSS compliance via tokenização no provider, nenhum PAN persiste.' },
    { id: 'ADR-004', title: 'Estratégia de migração opt-in', summary: 'Feature flag por cliente + UI de consentimento explícito.' },
  ];

  const ctoOutput = {
    adrs: adrsToUse.map(a => ({ id: a.id, title: a.title, summary: a.summary || a.decision?.slice(0, 120) || '' })),
    systemsAffected: ['Billing Service', 'Customer API', 'Notification Service', 'Audit Log'],
    risks: [
      'Chargeback inesperado em primeiros 30 dias',
      'Latência de webhook do provider em horário de pico',
      'Falha de conciliação com ERP em casos de estorno',
      'Resistência de clientes enterprise ao opt-in',
      'PCI-DSS audit pendente para Q3',
    ],
    estimateDays: 34,
    rollout: 'Canário 5% → 25% → 50% → 100% em 3 semanas, com kill-switch por feature flag.',
    blocker: false,
  };

  const sections = [
    { id: 'sumario', label: 'Sumário', confidence: 100 },
    { id: 'contexto', label: 'Contexto', confidence: 96 },
    { id: 'objetivos', label: 'Objetivos', confidence: 92 },
    { id: 'escopo', label: 'Escopo (IN/OUT)', confidence: 95 },
    { id: 'personas', label: 'Personas', confidence: 90 },
    { id: 'regras', label: 'Regras de negócio', confidence: 94 },
    { id: 'aceite', label: 'Critérios de aceite', confidence: 96 },
    { id: 'sucesso', label: 'Critérios de sucesso', confidence: 93 },
    { id: 'riscos-p', label: 'Riscos de produto', confidence: 88 },
    { id: 'adrs', label: 'ADRs', confidence: 100 },
    { id: 'sistemas', label: 'Sistemas afetados', confidence: 100 },
    { id: 'seguranca', label: 'Segurança', confidence: 95 },
    { id: 'riscos-t', label: 'Riscos técnicos', confidence: 90 },
    { id: 'rollout', label: 'Rollout', confidence: 98 },
    { id: 'testes', label: 'Testes', confidence: 95 },
    { id: 'observ', label: 'Observabilidade', confidence: 92 },
    { id: 'rollback', label: 'Rollback', confidence: 96 },
    { id: 'estimativa', label: 'Estimativa de esforço', confidence: 87 },
  ];

  const avgConfidence = Math.round(sections.reduce((s, x) => s + x.confidence, 0) / sections.length);

  if (frozen) {
    return (
      <div className="max-w-2xl mx-auto pt-16">
        <div className="border rounded-lg p-12 text-center" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: `${COLORS.success}20` }}>
            <Check size={32} style={{ color: COLORS.success }} />
          </div>
          <div className="text-xl font-semibold mb-2" style={{ color: COLORS.textPrimary }}>
            RP-2026-001 v1.0 congelado
          </div>
          <div className="text-sm mb-6 max-w-md mx-auto" style={{ color: COLORS.textSecondary }}>
            5 stakeholders foram notificados. Juliana (PM) já pode avaliar e dar prosseguimento.
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
        <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: COLORS.bgSubtle, color: COLORS.textSecondary }}>
          DEM-2026-001
        </span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: '#E0E7FF', color: '#4338CA' }}>
          Pronto para Congelamento
        </span>
        <button
          onClick={() => navigate('timeline')}
          className="ml-auto text-xs flex items-center gap-1 px-2 py-1 rounded hover:bg-stone-100"
          style={{ color: COLORS.textSecondary }}
        >
          <Clock size={12} /> Histórico
        </button>
      </div>
      <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.textPrimary }}>{demandTitle}</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.textSecondary }}>
        CTO Rafael devolveu a avaliação técnica. Revise o documento completo e congele a v1.0.
      </p>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Score Geral', value: '100%', color: COLORS.success },
          { label: 'Confiança média', value: `${avgConfidence}%`, color: COLORS.info },
          { label: 'ADRs', value: ctoOutput.adrs.length, color: '#8B5CF6' },
          { label: 'Estimativa', value: `${ctoOutput.estimateDays} dias`, color: COLORS.textPrimary },
        ].map(s => (
          <div key={s.label} className="border rounded-lg p-3" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
            <div className="text-xs uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>{s.label}</div>
            <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-4 mb-24">
        {/* Index sidebar */}
        <div className="col-span-3">
          <div className="border rounded-lg overflow-hidden sticky top-20"
            style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
            <div className="px-3 py-2 border-b text-xs font-semibold uppercase tracking-wider"
              style={{ color: COLORS.textMuted, borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
              Índice
            </div>
            <div className="p-1 max-h-[600px] overflow-y-auto">
              {sections.map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveSection(s.id);
                    document.getElementById(`section-${s.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between hover:bg-stone-50"
                  style={{
                    backgroundColor: activeSection === s.id ? COLORS.bgSubtle : 'transparent',
                    color: activeSection === s.id ? COLORS.textPrimary : COLORS.textSecondary,
                  }}
                >
                  <span className={activeSection === s.id ? 'font-semibold' : ''}>{s.label}</span>
                  <span
                    className="text-xs font-mono"
                    style={{ color: s.confidence >= 90 ? COLORS.success : s.confidence >= 70 ? COLORS.warning : COLORS.danger }}
                  >
                    {s.confidence}%
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Document */}
        <div className="col-span-9">
          <div className="border rounded-lg" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
            <div className="p-8 space-y-8">
              <DocSection id="sumario" title="Sumário Executivo" confidence={100}>
                <p>Implementar gateway de pagamento recorrente via cartão de crédito, com fluxo opt-in para clientes em boleto. Reduzir 30h/mês de reconciliação manual e levar inadimplência de 18% para ≤10% em 6 meses. Integração via Stripe (3,99% + R$0,39), com camada de abstração que permita troca futura de provider. Estimativa: {ctoOutput.estimateDays} dias úteis. {ctoOutput.adrs.length} ADRs registradas, {ctoOutput.risks.length} riscos mapeados.</p>
              </DocSection>

              <DocSection id="contexto" title="1. Contexto e Problema" confidence={96}>
                <p>{capturePendencies[0]?.a}</p>
                <p className="mt-2">{capturePendencies[3]?.a}</p>
              </DocSection>

              <DocSection id="objetivos" title="2. Objetivos" confidence={92}>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Migrar 40% da base ativa em boleto para cartão recorrente em 6 meses</li>
                  <li>Reduzir reconciliação manual de ~30h/mês para ≤5h/mês</li>
                  <li>Levar inadimplência de 18% para ≤10%</li>
                </ul>
              </DocSection>

              <DocSection id="escopo" title="3. Escopo (IN / OUT)" confidence={95}>
                <div className="mb-3">
                  <div className="font-semibold mb-1" style={{ color: COLORS.success }}>IN</div>
                  <ul className="list-disc ml-5 space-y-1">
                    <li>Integração Stripe via SDK oficial</li>
                    <li>Fluxo opt-in com consentimento explícito</li>
                    <li>Webhook handler idempotente com retry</li>
                    <li>UI de gerenciamento de método de pagamento</li>
                  </ul>
                </div>
                <div>
                  <div className="font-semibold mb-1" style={{ color: COLORS.danger }}>OUT</div>
                  <ul className="list-disc ml-5 space-y-1">
                    <li>Migração forçada de clientes enterprise</li>
                    <li>Suporte a outros gateways (fica para v2)</li>
                    <li>PIX recorrente</li>
                  </ul>
                </div>
              </DocSection>

              <DocSection id="personas" title="4. Personas Impactadas" confidence={90}>
                <p>Clientes pagantes B2B (550 contas), time financeiro (3 pessoas), CS (8 pessoas), jurídico (parecer já obtido).</p>
              </DocSection>

              <DocSection id="regras" title="5. Regras de Negócio" confidence={94}>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Cobrança em D+1 do vencimento</li>
                  <li>3 tentativas com intervalo de 24h em caso de falha</li>
                  <li>Notificação por email após 1ª falha e bloqueio após 3ª</li>
                  <li>Cliente pode trocar cartão sem perder histórico</li>
                </ul>
              </DocSection>

              <DocSection id="aceite" title="6. Critérios de Aceite" confidence={96}>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Cliente consegue cadastrar cartão em &lt; 60 segundos</li>
                  <li>Cobrança falhada gera evento auditável no log</li>
                  <li>Webhook processa 99,9% dos eventos em &lt; 5s</li>
                  <li>UI funciona em desktop e mobile</li>
                </ul>
              </DocSection>

              <DocSection id="sucesso" title="7. Critérios de Sucesso" confidence={93}>
                <p>Métricas mensuradas 30 / 60 / 90 dias pós-lançamento: % migração, h/mês reconciliação, % inadimplência, NPS dos migrados.</p>
              </DocSection>

              <DocSection id="riscos-p" title="8. Riscos de Produto" confidence={88}>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Adesão abaixo do esperado se incentivo for fraco</li>
                  <li>Resistência cultural em segmento enterprise</li>
                  <li>Suporte sobrecarregado em primeiros 30 dias</li>
                </ul>
              </DocSection>

              <DocSection id="adrs" title="9. ADRs (Decisões Arquiteturais)" confidence={100}>
                <div className="space-y-2">
                  {ctoOutput.adrs.map(adr => (
                    <div key={adr.id} className="p-3 rounded-md border" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
                      <div className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>{adr.id} — {adr.title}</div>
                      <div className="text-xs mt-1" style={{ color: COLORS.textSecondary }}>{adr.summary}</div>
                    </div>
                  ))}
                </div>
              </DocSection>

              <DocSection id="sistemas" title="10. Sistemas Afetados" confidence={100}>
                <ul className="list-disc ml-5 space-y-1">
                  {ctoOutput.systemsAffected.map(s => <li key={s}>{s}</li>)}
                </ul>
              </DocSection>

              <DocSection id="seguranca" title="11. Segurança (PCI / LGPD)" confidence={95}>
                <p>Tokenização no provider (ADR-003), zero PAN persistido localmente. LGPD: consentimento explícito de processamento, DPA assinado com Stripe. Auditoria PCI-DSS marcada para Q3.</p>
              </DocSection>

              <DocSection id="riscos-t" title="12. Riscos Técnicos" confidence={90}>
                <ul className="list-disc ml-5 space-y-1">
                  {ctoOutput.risks.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </DocSection>

              <DocSection id="rollout" title="13. Estratégia de Rollout" confidence={98}>
                <p>{ctoOutput.rollout}</p>
              </DocSection>

              <DocSection id="testes" title="14. Estratégia de Testes" confidence={95}>
                <p>Unitários (cobertura ≥80% no Payment Service), integração com Stripe sandbox, E2E no fluxo opt-in, load test com 10x picos atuais.</p>
              </DocSection>

              <DocSection id="observ" title="15. Observabilidade" confidence={92}>
                <p>Dashboards de: latência de webhook, taxa de falha de cobrança, distribuição de chargeback, % migração por cohort. Alertas críticos: webhook offline &gt; 1min, falha &gt; 5% em 5min.</p>
              </DocSection>

              <DocSection id="rollback" title="16. Plano de Rollback" confidence={96}>
                <p>Feature flag global por cliente. Em caso de incidente: desativar flag, clientes voltam a boleto, eventos pending são re-enfileirados após reativação.</p>
              </DocSection>

              <DocSection id="estimativa" title="17. Estimativa de Esforço" confidence={87}>
                <p>{ctoOutput.estimateDays} dias úteis (2 backend + 1 frontend, com revisão do CTO em pontos críticos). Buffer de 20% incluso.</p>
              </DocSection>
            </div>
          </div>
        </div>
      </div>

      {/* Action footer */}
      <div className="fixed bottom-4 left-64 right-4 max-w-[1400px] mx-auto border rounded-lg p-4 flex items-center justify-between shadow-md"
        style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="text-xs" style={{ color: COLORS.textMuted }}>
          Score Geral: <strong style={{ color: COLORS.success }}>100%</strong> · Confiança média: <strong>{avgConfidence}%</strong> · {ctoOutput.adrs.length} ADRs
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">Revisar pendências &lt;90%</Button>
          <Button variant="secondary" size="sm">Devolver ao CTO com pedidos</Button>
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
            addNotification({
              forPersona: 'pm',
              type: 'rp-frozen',
              title: 'Novo RP aguardando sua avaliação',
              body: 'Marina congelou RP-2026-001 v1.0 — 34 dias estimados, 4 ADRs',
              demandId: 'DEM-2026-001',
              icon: 'layers',
            });
            addNotification({
              forPersona: 'viewer',
              type: 'rp-published',
              title: 'RP publicado: você é stakeholder',
              body: 'RP-2026-001 v1.0 — Gateway de Pagamento Recorrente',
              demandId: 'DEM-2026-001',
              icon: 'layers',
            });
            addNotification({
              forPersona: 'submitter',
              type: 'rp-frozen',
              title: 'Sua demanda virou um Readiness Package',
              body: 'RP-2026-001 v1.0 está congelado. PM Juliana vai planejar a execução.',
              demandId: 'DEM-2026-001',
              icon: 'check',
            });
            showToast('RP-2026-001 v1.0 congelado!');
          }}
        />
      )}
    </div>
  );
}

function DocSection({ id, title, confidence, children }) {
  const color = confidence >= 90 ? COLORS.success : confidence >= 70 ? COLORS.warning : COLORS.danger;
  return (
    <section id={`section-${id}`} className="scroll-mt-24">
      <div className="flex items-center justify-between mb-3 pb-2 border-b" style={{ borderColor: COLORS.border }}>
        <h3 className="text-base font-bold" style={{ color: COLORS.textPrimary }}>{title}</h3>
        <span className="text-xs font-medium" style={{ color }}>Confiança {confidence}%</span>
      </div>
      <div className="text-sm leading-relaxed" style={{ color: COLORS.textSecondary }}>
        {children}
      </div>
    </section>
  );
}

function FreezeConfirmModal({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-lg rounded-xl shadow-2xl border p-6"
        style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="font-semibold text-lg mb-3" style={{ color: COLORS.textPrimary }}>
          Congelar Readiness Package?
        </div>
        <div className="text-sm mb-4" style={{ color: COLORS.textSecondary }}>
          Ao congelar:
        </div>
        <ul className="space-y-2 mb-5">
          {[
            'Vira versão 1.0 imutável',
            'PM (Juliana) recebe notificação',
            'Stakeholders declarados são notificados',
            'Edições futuras geram v1.1, v1.2 com diff visível',
            'Mudanças técnicas em v1.1 exigem re-avaliação do CTO',
          ].map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <Check size={14} className="mt-0.5 flex-shrink-0" style={{ color: COLORS.success }} />
              <span style={{ color: COLORS.textSecondary }}>{s}</span>
            </li>
          ))}
        </ul>
        <div className="border rounded-md p-3 mb-5" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
          <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>
            Stakeholders notificados
          </div>
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
// SCREEN: TIMELINE (Histórico — seção 11.5)
// ============================================================
function TimelineScreen() {
  const { navigate, demandTitle, demandState, captureScore, racScore, rpVersion, discoveryResults } = useApp();

  // Derive events from current state
  const events = [];

  events.push({
    type: 'capture-created',
    icon: Plus,
    color: COLORS.info,
    title: 'Captura criada',
    by: 'Carlos Silva (COO)',
    when: 'há 6 dias',
    desc: 'Demanda registrada com texto livre + PDF de estratégia anexado',
  });

  if (captureScore === 100 || ['Em Triagem', 'Em Racionalização', 'Em Avaliação Técnica', 'RP Congelado'].includes(demandState)) {
    events.push({
      type: 'capture-done',
      icon: CheckCircle2,
      color: COLORS.info,
      title: 'Captura concluída (Score 100%)',
      by: 'Carlos Silva (COO)',
      when: 'há 6 dias',
      desc: '8 pendências respondidas, 1 áudio gravado, 1 PDF anexado',
    });
  }

  if (['Em Racionalização', 'Em Avaliação Técnica', 'RP Congelado'].includes(demandState)) {
    events.push({
      type: 'triage-done',
      icon: CheckCircle2,
      color: '#F97316',
      title: 'Triagem — Product Ready',
      by: 'Marina Costa (PO)',
      when: 'há 5 dias',
      desc: 'Demanda real, alinhada com roadmap, sem incógnitas bloqueantes',
    });
  }

  if (['Em Avaliação Técnica', 'RP Congelado'].includes(demandState)) {
    const discoveryCount = Object.keys(discoveryResults).length;
    events.push({
      type: 'rac-done',
      icon: CheckCircle2,
      color: '#8B5CF6',
      title: 'Racionalização (PO) concluída',
      by: 'Marina Costa (PO)',
      when: 'há 3 dias',
      desc: `12 pendências resolvidas${discoveryCount > 0 ? `, ${discoveryCount} discovery${discoveryCount > 1 ? 's' : ''} realizado${discoveryCount > 1 ? 's' : ''}` : ''}`,
    });
    events.push({
      type: 'tech-done',
      icon: CheckCircle2,
      color: '#7C3AED',
      title: 'Avaliação técnica concluída',
      by: 'Rafael Lima (CTO)',
      when: 'há 1 dia',
      desc: '4 ADRs criadas, 5 riscos mapeados, 34 dias úteis estimados',
    });
  }

  if (rpVersion) {
    events.push({
      type: 'frozen',
      icon: Layers,
      color: COLORS.success,
      title: `RP ${rpVersion} congelado`,
      by: 'Marina Costa (PO)',
      when: 'agora',
      desc: '5 stakeholders notificados. PM Juliana Reis pode iniciar avaliação',
      isCurrent: true,
    });
  }

  return (
    <div className="max-w-3xl">
      <button onClick={() => navigate('dashboard')} className="flex items-center gap-1 text-sm mb-4 hover:opacity-70" style={{ color: COLORS.textSecondary }}>
        <ChevronLeft size={14} /> Voltar
      </button>

      <div className="flex items-center gap-3 mb-2">
        <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: COLORS.bgSubtle, color: COLORS.textSecondary }}>
          DEM-2026-001
        </span>
        <StatusPill status={demandState} />
      </div>
      <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.textPrimary }}>Histórico</h1>
      <p className="text-sm mb-8" style={{ color: COLORS.textSecondary }}>{demandTitle}</p>

      <div className="relative">
        {/* Timeline line */}
        <div
          className="absolute left-[15px] top-2 bottom-2 w-0.5"
          style={{ backgroundColor: COLORS.border }}
        />

        {events.slice().reverse().map((event, i) => {
          const Icon = event.icon;
          return (
            <div key={i} className="relative pl-12 pb-6 last:pb-0">
              <div
                className="absolute left-0 w-8 h-8 rounded-full border-4 flex items-center justify-center"
                style={{
                  backgroundColor: COLORS.bgElevated,
                  borderColor: event.color,
                  boxShadow: event.isCurrent ? `0 0 0 4px ${event.color}30` : 'none',
                }}
              >
                <Icon size={14} style={{ color: event.color }} />
              </div>
              <div
                className="border rounded-lg p-4"
                style={{
                  backgroundColor: COLORS.bgElevated,
                  borderColor: event.isCurrent ? event.color : COLORS.border,
                }}
              >
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
          <div className="text-sm" style={{ color: COLORS.textSecondary }}>
            💡 <strong>Dica:</strong> avance no fluxo (Captura → Triagem → Racionalização → CTO → Congelamento) e veja a timeline crescer.
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// SCREEN: TECH EVALUATION (CTO — seção 10)
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
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: `${COLORS.success}20` }}>
            <Check size={32} style={{ color: COLORS.success }} />
          </div>
          <div className="text-xl font-semibold mb-2" style={{ color: COLORS.textPrimary }}>
            Avaliação técnica concluída
          </div>
          <div className="text-sm mb-4 max-w-md mx-auto" style={{ color: COLORS.textSecondary }}>
            Sua avaliação foi anexada ao Readiness Package. Marina (PO) recebe agora para o congelamento final.
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
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: `${COLORS.danger}20` }}>
            <AlertCircle size={32} style={{ color: COLORS.danger }} />
          </div>
          <div className="text-xl font-semibold mb-2" style={{ color: COLORS.textPrimary }}>
            Bloqueador crítico sinalizado
          </div>
          <div className="text-sm mb-6 max-w-md mx-auto" style={{ color: COLORS.textSecondary }}>
            A demanda volta para Marina (PO) com sua justificativa. Ela decidirá entre redesenhar escopo, abrir novo Discovery ou rejeitar.
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
        <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: COLORS.bgSubtle, color: COLORS.textSecondary }}>
          DEM-2026-001
        </span>
        <StatusPill status="Em Avaliação Técnica" />
        <span className="text-xs" style={{ color: COLORS.textMuted }}>Escalado por Marina (PO) · há 1 dia</span>
        <button
          onClick={() => navigate('timeline')}
          className="ml-auto text-xs flex items-center gap-1 px-2 py-1 rounded hover:bg-stone-100"
          style={{ color: COLORS.textSecondary }}
        >
          <Clock size={12} /> Histórico
        </button>
      </div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: COLORS.textPrimary }}>{demandTitle}</h1>

      <div className="border rounded-lg p-5 mb-6 flex items-center gap-6" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <ScoreRing score={techScore} size={80} strokeWidth={7} />
        <div className="flex-1">
          <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>Avaliação Técnica</div>
          <div className="text-base font-semibold mb-1" style={{ color: COLORS.textPrimary }}>
            {techScore === 100 ? 'Tudo pronto pra anexar ao RP' : `${techStats.empty + techStats.lowConf} pendência${techStats.empty + techStats.lowConf !== 1 ? 's' : ''} restante${techStats.empty + techStats.lowConf !== 1 ? 's' : ''}`}
          </div>
          <div className="text-sm" style={{ color: COLORS.textSecondary }}>
            {techStats.resolved} de {techStats.total} resolvidas · {adrs.length} ADR{adrs.length !== 1 ? 's' : ''} criada{adrs.length !== 1 ? 's' : ''}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>Score do PO</div>
          <div className="text-xl font-bold" style={{ color: COLORS.success }}>100%</div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 mb-24">
        {/* Col 1: Pacote do PO (5/12) */}
        <div className="col-span-5">
          <div className="border rounded-lg overflow-hidden" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
            <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.textMuted }}>
                Pacote do PO
              </div>
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
              <button
                onClick={() => setProposeScopeChange(!proposeScopeChange)}
                className="text-xs underline hover:opacity-70"
                style={{ color: COLORS.textMuted }}
              >
                {proposeScopeChange ? 'Cancelar' : '⚠️ Propor mudança de escopo ao PO'}
              </button>
            </div>
            {proposeScopeChange && (
              <div className="px-4 py-3 border-t" style={{ borderColor: COLORS.border, backgroundColor: '#FFFBEB' }}>
                <textarea
                  value={scopeChangeText}
                  onChange={e => setScopeChangeText(e.target.value)}
                  rows={3}
                  placeholder="Ex: Sugiro mover X para fora do escopo da v1 porque exige refactor de Y..."
                  className="w-full p-2 text-xs rounded-md border focus:outline-none resize-none mb-2"
                  style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgElevated, color: COLORS.textPrimary }}
                />
                <Button size="sm" disabled={!scopeChangeText.trim()} onClick={() => {
                  showToast('Proposta de mudança enviada ao PO');
                  setScopeChangeText('');
                  setProposeScopeChange(false);
                }}>Enviar proposta</Button>
              </div>
            )}
          </div>
        </div>

        {/* Col 2: Workspace técnico (7/12) */}
        <div className="col-span-7">
          {/* Quick action: ADRs */}
          <div className="border rounded-lg p-3 mb-4 flex items-center justify-between" style={{ backgroundColor: '#F5F3FF', borderColor: '#DDD6FE' }}>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#6D28D9' }}>ADRs criadas</div>
              <div className="text-sm" style={{ color: COLORS.textPrimary }}>
                {adrs.length === 0 ? 'Nenhuma ADR ainda — registre decisões arquiteturais' : `${adrs.length} ADR${adrs.length !== 1 ? 's' : ''} registrada${adrs.length !== 1 ? 's' : ''}`}
              </div>
            </div>
            <Button variant="secondary" size="sm" icon={Plus} onClick={() => setShowAdrModal(true)}>
              Adicionar ADR
            </Button>
          </div>

          {empty.length > 0 && (
            <section className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.danger }} />
                <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.danger }}>
                  Vazias · {empty.length}
                </h2>
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
                <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.warning }}>
                  Baixa confiança · {lowConf.length}
                </h2>
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
                <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.success }}>
                  Resolvidas · {resolved.length}
                </h2>
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
                <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.textMuted }}>
                  Não aplicáveis · {naItems.length}
                </h2>
              </div>
              <div className="space-y-2">
                {naItems.map(p => <PendencyCard key={p.id} pendency={p} onClick={() => setSelected(p)} />)}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Action footer */}
      <div className="fixed bottom-4 left-64 right-4 max-w-[1400px] mx-auto border rounded-lg p-4 flex items-center justify-between shadow-md"
        style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
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
          <Button
            size="sm"
            icon={Send}
            disabled={!canConclude}
            onClick={() => {
              setDone(true);
              setDemandState('Pronto para Congelamento');
              addNotification({
                forPersona: 'po',
                type: 'tech-eval-done',
                title: 'Avaliação técnica concluída',
                body: `Rafael Lima devolveu a avaliação técnica com ${adrs.length} ADRs e 34 dias estimados`,
                demandId: 'DEM-2026-001',
                icon: 'check',
              });
              showToast('Avaliação técnica anexada ao RP — PO notificada');
            }}
          >
            Anexar ao RP
          </Button>
        </div>
      </div>

      {selected && (
        <TechPendencyModal pendency={selected} onClose={() => setSelected(null)} />
      )}
      {showAdrModal && (
        <ADRModal onClose={() => setShowAdrModal(false)} />
      )}
      {showBlockerModal && (
        <BlockerModal
          onClose={() => setShowBlockerModal(false)}
          onConfirmBlocker={(reason) => {
            setShowBlockerModal(false);
            setBlockerSent(true);
            setDemandState('Em Racionalização');
            showToast('Bloqueador sinalizado, demanda volta ao PO');
          }}
          onConfirmNoBlocker={() => {
            // Marca a pendência tech-15 como resolvida
            const blockerP = techPendencies.find(p => p.isBlocker);
            if (blockerP) {
              setSelected(null);
              showToast('Sem bloqueador crítico — avaliação prossegue');
            }
            setShowBlockerModal(false);
          }}
        />
      )}
    </div>
  );
}

// ============================================================
// MODAL: TECH PENDENCY
// ============================================================
function TechPendencyModal({ pendency, onClose }) {
  const { updateTechPendency, showToast } = useApp();
  const [text, setText] = useState(pendency.a || '');
  const [analyzing, setAnalyzing] = useState(false);
  const [showNA, setShowNA] = useState(false);
  const [naReason, setNaReason] = useState('');

  const isLowConf = pendency.status === 'low_confidence';
  const suggestion = TECH_SUGGESTIONS[pendency.id];

  const useSuggestion = () => {
    if (suggestion) setText(suggestion);
  };

  const handleSave = () => {
    if (!text.trim()) return;
    setAnalyzing(true);
    setTimeout(() => {
      // Use higher confidence if text matches suggestion (CTO accepted the AI proposal)
      const matchesSuggestion = suggestion && text.trim() === suggestion;
      const newConfidence = matchesSuggestion ? 95 : 92;
      updateTechPendency(pendency.id, {
        a: text.trim(),
        confidence: newConfidence,
        status: 'resolved',
      });
      showToast('Resposta salva');
      onClose();
    }, 800);
  };

  const markNotApplicable = () => {
    updateTechPendency(pendency.id, {
      a: '',
      confidence: 0,
      status: 'not_applicable',
      naReason,
    });
    showToast('Pendência marcada como N/A');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-3xl rounded-xl shadow-2xl border max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: COLORS.border }}>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>
              {pendency.section}
            </div>
            <div className="font-semibold text-base" style={{ color: COLORS.textPrimary }}>{pendency.q}</div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-stone-100 rounded">
            <X size={18} style={{ color: COLORS.textMuted }} />
          </button>
        </div>

        <div className="p-6">
          {suggestion && (
            <div className="border rounded-md p-3 mb-4" style={{ backgroundColor: `${COLORS.info}10`, borderColor: `${COLORS.info}30` }}>
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: COLORS.info }}>
                  <Sparkles size={12} /> Sugestão da plataforma
                </div>
                <Button variant="ghost" size="sm" onClick={useSuggestion}>Usar essa sugestão</Button>
              </div>
              <div className="text-sm" style={{ color: COLORS.textPrimary }}>{suggestion}</div>
            </div>
          )}

          <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>
            Sua resposta técnica
          </div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={7}
            placeholder="Detalhe a decisão, riscos, alternativas consideradas..."
            className="w-full p-3 text-sm rounded-md border focus:outline-none resize-none"
            style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg, color: COLORS.textPrimary }}
          />

          {analyzing && (
            <div className="mt-4 flex items-center gap-2 p-3 rounded-md" style={{ backgroundColor: `${COLORS.info}10` }}>
              <Loader2 size={14} className="animate-spin" style={{ color: COLORS.info }} />
              <span className="text-sm" style={{ color: COLORS.info }}>Validando resposta...</span>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t flex justify-between items-center" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
          <button
            onClick={() => setShowNA(!showNA)}
            className="text-xs underline hover:opacity-70"
            style={{ color: COLORS.textMuted }}
          >
            {showNA ? 'Cancelar N/A' : 'Não se aplica'}
          </button>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose} disabled={analyzing}>Cancelar</Button>
            <Button onClick={handleSave} disabled={!text.trim() || analyzing}>Salvar resposta</Button>
          </div>
        </div>

        {showNA && (
          <div className="px-6 py-4 border-t" style={{ borderColor: COLORS.border, backgroundColor: '#FAFAF9' }}>
            <textarea
              value={naReason}
              onChange={e => setNaReason(e.target.value)}
              rows={2}
              placeholder="Justifique por que essa pendência não se aplica..."
              className="w-full p-2.5 text-sm rounded-md border focus:outline-none resize-none mb-2"
              style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgElevated, color: COLORS.textPrimary }}
            />
            <div className="flex justify-end">
              <Button size="sm" disabled={!naReason.trim()} onClick={markNotApplicable}>Marcar como N/A</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// MODAL: ADR
// ============================================================
function ADRModal({ onClose }) {
  const { adrs, setAdrs, showToast, updateTechPendency, techPendencies } = useApp();
  const [showSuggested, setShowSuggested] = useState(true);
  const [form, setForm] = useState({ title: '', context: '', decision: '', alternatives: '', consequences: '' });

  const addAdr = (adr) => {
    const id = adr.id || `ADR-${String(adrs.length + 1).padStart(3, '0')}`;
    setAdrs(prev => [...prev, { ...adr, id }]);

    // Marca pendência "ADRs necessárias" como resolvida automaticamente
    const adrsPendency = techPendencies.find(p => p.isAdrs);
    if (adrsPendency) {
      const allAdrs = [...adrs, { ...adr, id }];
      updateTechPendency(adrsPendency.id, {
        a: `${allAdrs.length} ADR${allAdrs.length > 1 ? 's' : ''}: ${allAdrs.map(a => a.title).join(', ')}`,
        confidence: 95,
        status: 'resolved',
      });
    }

    showToast(`${id} adicionada`);
  };

  const addFromSuggested = (sugg) => {
    addAdr({ id: sugg.id, title: sugg.title, context: sugg.context, decision: sugg.decision, alternatives: sugg.alternatives, consequences: sugg.consequences });
  };

  const addAllSuggested = () => {
    const newAdrs = SUGGESTED_ADRS.filter(s => !adrs.find(a => a.id === s.id));
    setAdrs(prev => [...prev, ...newAdrs]);

    const adrsPendency = techPendencies.find(p => p.isAdrs);
    if (adrsPendency) {
      const allAdrs = [...adrs, ...newAdrs];
      updateTechPendency(adrsPendency.id, {
        a: `${allAdrs.length} ADRs: ${allAdrs.map(a => a.title).join(', ')}`,
        confidence: 95,
        status: 'resolved',
      });
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
      <div onClick={e => e.stopPropagation()} className="w-full max-w-3xl rounded-xl shadow-2xl border max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: COLORS.border }}>
          <div>
            <div className="font-semibold text-base" style={{ color: COLORS.textPrimary }}>
              Decisões Arquiteturais (ADRs)
            </div>
            <div className="text-xs mt-0.5" style={{ color: COLORS.textMuted }}>
              {adrs.length} registrada{adrs.length !== 1 ? 's' : ''}
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-stone-100 rounded">
            <X size={18} style={{ color: COLORS.textMuted }} />
          </button>
        </div>

        <div className="p-6">
          {/* Existing ADRs */}
          {adrs.length > 0 && (
            <div className="mb-6">
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>
                ADRs registradas
              </div>
              <div className="space-y-2">
                {adrs.map(adr => (
                  <div key={adr.id} className="border rounded-md p-3" style={{ backgroundColor: COLORS.bgSubtle, borderColor: COLORS.border }}>
                    <div className="font-semibold text-sm mb-1" style={{ color: COLORS.textPrimary }}>
                      {adr.id} — {adr.title}
                    </div>
                    <div className="text-xs" style={{ color: COLORS.textSecondary }}>
                      {adr.decision?.slice(0, 120)}{adr.decision?.length > 120 ? '...' : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggested ADRs */}
          {showSuggested && SUGGESTED_ADRS.some(s => !adrs.find(a => a.id === s.id)) && (
            <div className="mb-6 border rounded-md p-4" style={{ borderColor: `${COLORS.info}30`, backgroundColor: `${COLORS.info}08` }}>
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: COLORS.info }}>
                  <Sparkles size={12} /> Sugestões da plataforma
                </div>
                <Button variant="ghost" size="sm" onClick={addAllSuggested}>Adicionar todas</Button>
              </div>
              <div className="space-y-2">
                {SUGGESTED_ADRS.filter(s => !adrs.find(a => a.id === s.id)).map(sugg => (
                  <div key={sugg.id} className="flex items-start justify-between gap-3 p-3 rounded border" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>
                        {sugg.id} — {sugg.title}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: COLORS.textSecondary }}>
                        {sugg.decision.slice(0, 100)}...
                      </div>
                    </div>
                    <Button size="sm" variant="secondary" onClick={() => addFromSuggested(sugg)}>
                      Adicionar
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom ADR form */}
          <div className="border-t pt-5" style={{ borderColor: COLORS.border }}>
            <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: COLORS.textMuted }}>
              Adicionar ADR customizada
            </div>
            <div className="space-y-3">
              <input
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Título da decisão"
                className="w-full p-2.5 text-sm rounded-md border focus:outline-none"
                style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg, color: COLORS.textPrimary }}
              />
              <textarea
                value={form.context}
                onChange={e => setForm({ ...form, context: e.target.value })}
                placeholder="Contexto: por que essa decisão precisa ser tomada?"
                rows={2}
                className="w-full p-2.5 text-sm rounded-md border focus:outline-none resize-none"
                style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg, color: COLORS.textPrimary }}
              />
              <textarea
                value={form.decision}
                onChange={e => setForm({ ...form, decision: e.target.value })}
                placeholder="Decisão: o que será feito?"
                rows={2}
                className="w-full p-2.5 text-sm rounded-md border focus:outline-none resize-none"
                style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg, color: COLORS.textPrimary }}
              />
              <textarea
                value={form.alternatives}
                onChange={e => setForm({ ...form, alternatives: e.target.value })}
                placeholder="Alternativas consideradas e por que foram rejeitadas"
                rows={2}
                className="w-full p-2.5 text-sm rounded-md border focus:outline-none resize-none"
                style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg, color: COLORS.textPrimary }}
              />
              <textarea
                value={form.consequences}
                onChange={e => setForm({ ...form, consequences: e.target.value })}
                placeholder="Consequências e trade-offs"
                rows={2}
                className="w-full p-2.5 text-sm rounded-md border focus:outline-none resize-none"
                style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg, color: COLORS.textPrimary }}
              />
              <div className="flex justify-end">
                <Button size="sm" icon={Plus} disabled={!form.title.trim() || !form.decision.trim()} onClick={addCustom}>
                  Adicionar ADR
                </Button>
              </div>
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

// ============================================================
// MODAL: BLOCKER
// ============================================================
function BlockerModal({ onClose, onConfirmBlocker, onConfirmNoBlocker }) {
  const [choice, setChoice] = useState(null);
  const [reason, setReason] = useState('');
  const { updateTechPendency, techPendencies } = useApp();

  const handleNoBlocker = () => {
    const blockerP = techPendencies.find(p => p.isBlocker);
    if (blockerP) {
      updateTechPendency(blockerP.id, {
        a: 'Sem bloqueador crítico identificado. Demanda viável tecnicamente.',
        confidence: 95,
        status: 'resolved',
      });
    }
    onConfirmNoBlocker();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-lg rounded-xl shadow-2xl border"
        style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: COLORS.border }}>
          <div className="font-semibold text-base" style={{ color: COLORS.textPrimary }}>
            Bloqueador técnico crítico?
          </div>
          <div className="text-xs mt-0.5" style={{ color: COLORS.textMuted }}>
            Decisão final da sua avaliação
          </div>
        </div>

        <div className="p-6 space-y-3">
          <button
            onClick={() => setChoice('no')}
            className="w-full text-left p-4 rounded-md border transition-all"
            style={{
              borderColor: choice === 'no' ? COLORS.success : COLORS.border,
              backgroundColor: choice === 'no' ? `${COLORS.success}10` : COLORS.bg,
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                style={{ borderColor: choice === 'no' ? COLORS.success : COLORS.borderStrong }}>
                {choice === 'no' && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.success }} />}
              </div>
              <div className="text-sm font-semibold" style={{ color: COLORS.textPrimary }}>Não há bloqueador crítico</div>
            </div>
            <div className="text-xs ml-6" style={{ color: COLORS.textSecondary }}>
              Demanda é viável. Sua avaliação técnica prossegue normalmente.
            </div>
          </button>

          <button
            onClick={() => setChoice('yes')}
            className="w-full text-left p-4 rounded-md border transition-all"
            style={{
              borderColor: choice === 'yes' ? COLORS.danger : COLORS.border,
              backgroundColor: choice === 'yes' ? `${COLORS.danger}10` : COLORS.bg,
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                style={{ borderColor: choice === 'yes' ? COLORS.danger : COLORS.borderStrong }}>
                {choice === 'yes' && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.danger }} />}
              </div>
              <div className="text-sm font-semibold" style={{ color: COLORS.textPrimary }}>Sim, há bloqueador crítico</div>
            </div>
            <div className="text-xs ml-6" style={{ color: COLORS.textSecondary }}>
              Demanda volta para Marina (PO) com sua justificativa. Ela decide entre redesenhar, abrir Discovery ou rejeitar.
            </div>
          </button>

          {choice === 'yes' && (
            <div className="pt-2">
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>
                Justificativa (obrigatória)
              </div>
              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                rows={3}
                placeholder="Ex: Integração com SAP exige nova auth layer que viola PCI-DSS atual. Precisamos redesenhar antes."
                className="w-full p-2.5 text-sm rounded-md border focus:outline-none resize-none"
                style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg, color: COLORS.textPrimary }}
              />
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t flex justify-end gap-2" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button
            variant={choice === 'yes' ? 'danger' : 'primary'}
            disabled={!choice || (choice === 'yes' && !reason.trim())}
            onClick={() => choice === 'yes' ? onConfirmBlocker(reason) : handleNoBlocker()}
          >
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SCREEN: RP VIEW (PM / Viewer — seções 11.3, 11.4, 11.6)
// ============================================================
function RPViewScreen() {
  const { navigate, persona, demandTitle, demandState, rpVersion, rpComments, setRpComments, capturePendencies, showToast, setDemandState, setReturnedGaps, adrs, v11Changes, addNotification } = useApp();
  const [activeSection, setActiveSection] = useState('contexto');
  const [selection, setSelection] = useState(null);
  const [showGapModal, setShowGapModal] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [commentTrecho, setCommentTrecho] = useState('');
  const [showAcceptConfirm, setShowAcceptConfirm] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [showDiff, setShowDiff] = useState(true);

  const isPM = persona?.id === 'pm';
  const isViewer = persona?.id === 'viewer';
  const isV11 = rpVersion === 'v1.1';
  const hasChanges = Object.keys(v11Changes).length > 0;

  // Fallback if no RP exists yet
  if (demandState !== 'RP Congelado' && !rpVersion) {
    return (
      <div className="max-w-2xl mx-auto pt-16">
        <div className="border rounded-lg p-12 text-center" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
          <Layers size={32} className="mx-auto mb-3" style={{ color: COLORS.textMuted }} />
          <div className="text-lg font-semibold mb-2" style={{ color: COLORS.textPrimary }}>
            Nenhum RP congelado ainda
          </div>
          <div className="text-sm mb-6 max-w-md mx-auto" style={{ color: COLORS.textSecondary }}>
            Para ver esta tela, o PO precisa congelar a v1.0 do RP. Troque para Marina (PO), finalize a Racionalização e congele.
          </div>
          <Button variant="secondary" onClick={() => navigate('dashboard')}>Voltar ao Dashboard</Button>
        </div>
      </div>
    );
  }

  if (accepted) {
    return (
      <div className="max-w-2xl mx-auto pt-16">
        <div className="border rounded-lg p-12 text-center" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: `${COLORS.success}20` }}>
            <Check size={32} style={{ color: COLORS.success }} />
          </div>
          <div className="text-xl font-semibold mb-2" style={{ color: COLORS.textPrimary }}>
            RP aceito e em execução
          </div>
          <div className="text-sm mb-6 max-w-md mx-auto" style={{ color: COLORS.textSecondary }}>
            A demanda passa para "Em Execução". O time de engenharia foi notificado e pode começar.
          </div>
          <Button variant="secondary" onClick={() => navigate('dashboard')}>Voltar ao Dashboard</Button>
        </div>
      </div>
    );
  }

  const sections = [
    { id: 'sumario', label: 'Sumário', confidence: 100 },
    { id: 'contexto', label: 'Contexto', confidence: 96 },
    { id: 'objetivos', label: 'Objetivos', confidence: 92 },
    { id: 'escopo', label: 'Escopo', confidence: 95 },
    { id: 'adrs', label: 'ADRs', confidence: 100 },
    { id: 'riscos', label: 'Riscos', confidence: 90 },
    { id: 'rollout', label: 'Rollout', confidence: 98 },
    { id: 'estimativa', label: 'Estimativa', confidence: 87 },
  ];

  const handleTextSelection = (sectionId) => {
    setTimeout(() => {
      const sel = window.getSelection?.();
      if (sel && sel.toString().trim().length > 5) {
        const text = sel.toString().trim();
        const rect = sel.getRangeAt(0).getBoundingClientRect();
        setSelection({ text, sectionId, rect });
      } else {
        setSelection(null);
      }
    }, 10);
  };

  const addComment = (type) => {
    if (!selection) return;
    setCommentTrecho(selection.text);
    if (type === 'gap') {
      setShowGapModal(true);
    } else {
      // open a simpler comment composer inline
      setShowGapModal(true);
    }
  };

  const submitComment = (text, type, blocking = false) => {
    const newComment = {
      id: `c-${Date.now()}`,
      sectionId: selection?.sectionId,
      trecho: commentTrecho,
      author: persona.name,
      authorRole: persona.label,
      authorColor: persona.color,
      text,
      type, // 'comment', 'question', 'gap'
      blocking,
      timestamp: new Date(),
      resolved: false,
    };
    setRpComments(prev => [...prev, newComment]);
    setSelection(null);
    setShowGapModal(false);
    setCommentInput('');
    setCommentTrecho('');
    showToast(type === 'gap' ? 'Gap apontado' : 'Comentário adicionado');
  };

  return (
    <div className="max-w-[1400px]">
      <button onClick={() => navigate('dashboard')} className="flex items-center gap-1 text-sm mb-4 hover:opacity-70" style={{ color: COLORS.textSecondary }}>
        <ChevronLeft size={14} /> Dashboard
      </button>

      {isViewer && (
        <div className="mb-4 p-3 rounded-md border flex items-center gap-2 text-sm" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle, color: COLORS.textSecondary }}>
          <Eye size={14} />
          Você está visualizando como <strong>Viewer</strong> (somente leitura + comentários)
        </div>
      )}

      <div className="flex items-center gap-3 mb-2">
        <Layers size={16} style={{ color: persona.color }} />
        <span className="font-semibold text-base" style={{ color: COLORS.textPrimary }}>
          RP-2026-001 {rpVersion || 'v1.0'}
        </span>
        <StatusPill status="RP Congelado" />
        <button
          onClick={() => navigate('timeline')}
          className="ml-auto text-xs flex items-center gap-1 px-2 py-1 rounded hover:bg-stone-100"
          style={{ color: COLORS.textSecondary }}
        >
          <Clock size={12} /> Histórico
        </button>
      </div>
      <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.textPrimary }}>{demandTitle}</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.textSecondary }}>
        Congelado por Marina · PO: Marina · CTO: Rafael · {rpComments.length} comentário{rpComments.length !== 1 ? 's' : ''}
      </p>

      {isV11 && hasChanges && (
        <div className="mb-6 p-4 rounded-lg border flex items-center justify-between" style={{ borderColor: `${COLORS.info}40`, backgroundColor: `${COLORS.info}08` }}>
          <div className="flex items-center gap-3">
            <Layers size={18} style={{ color: COLORS.info }} />
            <div>
              <div className="text-sm font-semibold" style={{ color: COLORS.textPrimary }}>
                v1.1 — {Object.keys(v11Changes).length} mudança{Object.keys(v11Changes).length !== 1 ? 's' : ''} desde v1.0
              </div>
              <div className="text-xs" style={{ color: COLORS.textSecondary }}>
                Marina endereçou os gaps apontados anteriormente. As seções modificadas mostram o diff.
              </div>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={showDiff} onChange={e => setShowDiff(e.target.checked)} />
            <span style={{ color: COLORS.textPrimary }}>Mostrar diff</span>
          </label>
        </div>
      )}

      <div className="grid grid-cols-12 gap-4 mb-24">
        {/* Sidebar with index */}
        <div className="col-span-3">
          <div className="border rounded-lg overflow-hidden sticky top-20"
            style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
            <div className="px-3 py-2 border-b text-xs font-semibold uppercase tracking-wider"
              style={{ color: COLORS.textMuted, borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
              Índice
            </div>
            <div className="p-1">
              {sections.map(s => {
                const sectionComments = rpComments.filter(c => c.sectionId === s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setActiveSection(s.id);
                      document.getElementById(`rpv-${s.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between hover:bg-stone-50"
                    style={{
                      backgroundColor: activeSection === s.id ? COLORS.bgSubtle : 'transparent',
                      color: activeSection === s.id ? COLORS.textPrimary : COLORS.textSecondary,
                    }}
                  >
                    <span className={activeSection === s.id ? 'font-semibold' : ''}>{s.label}</span>
                    <div className="flex items-center gap-1.5">
                      {sectionComments.length > 0 && (
                        <span
                          className="text-xs font-medium px-1.5 py-0.5 rounded-full"
                          style={{ backgroundColor: persona.color, color: 'white' }}
                        >
                          {sectionComments.length}
                        </span>
                      )}
                      <span className="text-xs font-mono" style={{ color: s.confidence >= 90 ? COLORS.success : s.confidence >= 70 ? COLORS.warning : COLORS.danger }}>
                        {s.confidence}%
                      </span>
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

        {/* Document */}
        <div className="col-span-6">
          <div className="border rounded-lg" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
            <div className="p-8 space-y-8">
              <RPViewSection id="sumario" title="Sumário Executivo" confidence={100} onSelect={handleTextSelection} changes={isV11 && showDiff ? Object.values(v11Changes).filter(c => c.sectionId === 'sumario') : []}>
                <p>Implementar gateway de pagamento recorrente via cartão de crédito, com fluxo opt-in para clientes em boleto. Reduzir 30h/mês de reconciliação manual e levar inadimplência de 18% para ≤10% em 6 meses.</p>
              </RPViewSection>

              <RPViewSection id="contexto" title="1. Contexto e Problema" confidence={96} onSelect={handleTextSelection} changes={isV11 && showDiff ? Object.values(v11Changes).filter(c => c.sectionId === 'contexto') : []}>
                <p>{capturePendencies[0]?.a}</p>
              </RPViewSection>

              <RPViewSection id="objetivos" title="2. Objetivos" confidence={92} onSelect={handleTextSelection} changes={isV11 && showDiff ? Object.values(v11Changes).filter(c => c.sectionId === 'objetivos') : []}>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Migrar 40% dos clientes ativos em boleto para cobrança recorrente em 6 meses</li>
                  <li>Reduzir reconciliação manual de ~30h/mês para ≤5h/mês</li>
                  <li>Levar inadimplência de 18% para ≤10%</li>
                </ul>
              </RPViewSection>

              <RPViewSection id="escopo" title="3. Escopo" confidence={95} onSelect={handleTextSelection} changes={isV11 && showDiff ? Object.values(v11Changes).filter(c => c.sectionId === 'escopo') : []}>
                <div className="mb-3">
                  <div className="font-semibold mb-1" style={{ color: COLORS.success }}>IN</div>
                  <ul className="list-disc ml-5 space-y-1">
                    <li>Integração Stripe via SDK oficial</li>
                    <li>Fluxo opt-in com consentimento explícito</li>
                    <li>Webhook handler idempotente com retry</li>
                  </ul>
                </div>
                <div>
                  <div className="font-semibold mb-1" style={{ color: COLORS.danger }}>OUT</div>
                  <ul className="list-disc ml-5 space-y-1">
                    <li>Migração forçada de clientes enterprise</li>
                    <li>Suporte a outros gateways (v2)</li>
                  </ul>
                </div>
              </RPViewSection>

              <RPViewSection id="adrs" title="4. ADRs" confidence={100} onSelect={handleTextSelection} changes={isV11 && showDiff ? Object.values(v11Changes).filter(c => c.sectionId === 'adrs') : []}>
                <div className="space-y-2">
                  {(adrs.length > 0 ? adrs : SUGGESTED_ADRS).map(adr => (
                    <div key={adr.id} className="p-3 rounded-md border" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
                      <div className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>{adr.id} — {adr.title}</div>
                      <div className="text-xs mt-1" style={{ color: COLORS.textSecondary }}>{adr.decision?.slice(0, 150)}{adr.decision?.length > 150 ? '...' : ''}</div>
                    </div>
                  ))}
                </div>
              </RPViewSection>

              <RPViewSection id="riscos" title="5. Riscos Técnicos" confidence={90} onSelect={handleTextSelection} changes={isV11 && showDiff ? Object.values(v11Changes).filter(c => c.sectionId === 'riscos') : []}>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Chargeback inesperado em primeiros 30 dias</li>
                  <li>Latência de webhook do provider em horário de pico</li>
                  <li>Falha de conciliação com ERP em casos de estorno</li>
                  <li>Resistência de clientes enterprise ao opt-in</li>
                </ul>
              </RPViewSection>

              <RPViewSection id="rollout" title="6. Estratégia de Rollout" confidence={98} onSelect={handleTextSelection} changes={isV11 && showDiff ? Object.values(v11Changes).filter(c => c.sectionId === 'rollout') : []}>
                <p>Canário 5% → 25% → 50% → 100% em 3 semanas, com kill-switch global por feature flag.</p>
              </RPViewSection>

              <RPViewSection id="estimativa" title="7. Estimativa" confidence={87} onSelect={handleTextSelection} changes={isV11 && showDiff ? Object.values(v11Changes).filter(c => c.sectionId === 'estimativa') : []}>
                <p>34 dias úteis. Breakdown: 12d backend, 8d frontend, 6d integração, 5d rollout, 3d buffer.</p>
              </RPViewSection>
            </div>
          </div>
        </div>

        {/* Comments sidebar */}
        <div className="col-span-3">
          <div className="border rounded-lg sticky top-20" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
            <div className="px-3 py-2 border-b text-xs font-semibold uppercase tracking-wider"
              style={{ color: COLORS.textMuted, borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
              Comentários ({rpComments.length})
            </div>
            <div className="p-3 max-h-[600px] overflow-y-auto space-y-3">
              {rpComments.length === 0 ? (
                <div className="text-xs text-center py-6" style={{ color: COLORS.textMuted }}>
                  Selecione um trecho do documento para comentar
                </div>
              ) : (
                rpComments.map(c => (
                  <div key={c.id} className="border rounded-md p-2.5" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
                        style={{ backgroundColor: c.authorColor }}>
                        {c.author.split(' ').map(p => p[0]).join('').slice(0, 2)}
                      </div>
                      <span className="text-xs font-semibold" style={{ color: COLORS.textPrimary }}>{c.author.split(' ')[0]}</span>
                      <span
                        className="text-xs px-1.5 py-0.5 rounded font-medium"
                        style={{
                          backgroundColor: c.type === 'gap' ? `${COLORS.danger}15` : `${COLORS.info}15`,
                          color: c.type === 'gap' ? COLORS.danger : COLORS.info,
                        }}
                      >
                        {c.type === 'gap' ? 'Gap' : c.type === 'question' ? 'Pergunta' : 'Coment.'}
                      </span>
                      {c.blocking && (
                        <span className="text-xs" title="Bloqueante">🔒</span>
                      )}
                    </div>
                    <div className="text-xs italic mb-1.5 line-clamp-2 px-1.5 py-1 rounded"
                      style={{ color: COLORS.textMuted, backgroundColor: COLORS.bgSubtle, fontSize: '11px' }}>
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

      {/* Floating selection menu */}
      {selection && (
        <div
          className="fixed z-50 flex gap-1 p-1 rounded-md border shadow-lg"
          style={{
            left: `${selection.rect.left + selection.rect.width / 2 - 80}px`,
            top: `${selection.rect.top - 44}px`,
            backgroundColor: COLORS.bgElevated,
            borderColor: COLORS.border,
          }}
        >
          <button
            onClick={() => addComment('comment')}
            className="px-2 py-1 text-xs rounded hover:bg-stone-100 flex items-center gap-1"
            style={{ color: COLORS.textPrimary }}
          >
            <MessageSquare size={11} /> Comentar
          </button>
          <button
            onClick={() => addComment('question')}
            className="px-2 py-1 text-xs rounded hover:bg-stone-100 flex items-center gap-1"
            style={{ color: COLORS.textPrimary }}
          >
            ❓ Perguntar
          </button>
          {isPM && (
            <button
              onClick={() => addComment('gap')}
              className="px-2 py-1 text-xs rounded hover:bg-stone-100 flex items-center gap-1"
              style={{ color: COLORS.danger }}
            >
              <AlertTriangle size={11} /> Apontar gap
            </button>
          )}
        </div>
      )}

      {/* Action footer (PM only) */}
      {isPM && (
        <div className="fixed bottom-4 left-64 right-4 max-w-[1400px] mx-auto border rounded-lg p-4 flex items-center justify-between shadow-md"
          style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
          <div className="text-xs" style={{ color: COLORS.textMuted }}>
            {rpComments.filter(c => c.blocking).length > 0
              ? `${rpComments.filter(c => c.blocking).length} gap${rpComments.filter(c => c.blocking).length !== 1 ? 's' : ''} bloqueante${rpComments.filter(c => c.blocking).length !== 1 ? 's' : ''} apontado${rpComments.filter(c => c.blocking).length !== 1 ? 's' : ''}`
              : 'Sem gaps bloqueantes — pronto para aceitar'}
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={rpComments.filter(c => c.blocking).length === 0}
              onClick={() => {
                const blockingGaps = rpComments.filter(c => c.blocking);
                setReturnedGaps(blockingGaps);
                setDemandState('Devolvido pelo PM');
                addNotification({
                  forPersona: 'po',
                  type: 'rp-returned',
                  title: 'RP devolvido pelo PM',
                  body: `Juliana apontou ${blockingGaps.length} gap${blockingGaps.length !== 1 ? 's' : ''} bloqueante${blockingGaps.length !== 1 ? 's' : ''}. v1.1 deve ser gerada.`,
                  demandId: 'DEM-2026-001',
                  icon: 'alert',
                });
                showToast(`${blockingGaps.length} gap(s) devolvido(s) ao PO — v1.1 será gerada`);
                navigate('dashboard');
              }}
            >
              ⚠️ Devolver com gaps
            </Button>
            <Button
              size="sm"
              icon={Check}
              onClick={() => setShowAcceptConfirm(true)}
            >
              Aceitar e planejar
            </Button>
          </div>
        </div>
      )}

      {/* Gap/Comment modal */}
      {showGapModal && (
        <CommentModal
          trecho={commentTrecho}
          allowGap={isPM}
          onClose={() => { setShowGapModal(false); setSelection(null); }}
          onSubmit={submitComment}
        />
      )}

      {showAcceptConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowAcceptConfirm(false)}>
          <div onClick={e => e.stopPropagation()} className="w-full max-w-md rounded-xl shadow-2xl border p-6"
            style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
            <div className="font-semibold text-lg mb-2" style={{ color: COLORS.textPrimary }}>Aceitar RP?</div>
            <div className="text-sm mb-5" style={{ color: COLORS.textSecondary }}>
              Ao aceitar, a demanda passa para "Em Execução". Time de engenharia será notificado.
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setShowAcceptConfirm(false)}>Cancelar</Button>
              <Button onClick={() => {
                setAccepted(true);
                setDemandState('Em Execução');
                setShowAcceptConfirm(false);
                addNotification({
                  forPersona: 'po',
                  type: 'rp-accepted',
                  title: 'RP aceito pelo PM — em execução',
                  body: 'Juliana aceitou o RP. A demanda está em execução pelo time.',
                  demandId: 'DEM-2026-001',
                  icon: 'check',
                });
                addNotification({
                  forPersona: 'submitter',
                  type: 'rp-accepted',
                  title: 'Sua demanda está em execução! 🎉',
                  body: 'PM Juliana aceitou o RP. O time começou os trabalhos.',
                  demandId: 'DEM-2026-001',
                  icon: 'check',
                });
              }}>Aceitar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RPViewSection({ id, title, confidence, children, onSelect, changes }) {
  const color = confidence >= 90 ? COLORS.success : confidence >= 70 ? COLORS.warning : COLORS.danger;
  const hasChanges = changes && changes.length > 0;
  return (
    <section id={`rpv-${id}`} className="scroll-mt-24" onMouseUp={() => onSelect(id)}>
      <div className="flex items-center justify-between mb-3 pb-2 border-b" style={{ borderColor: COLORS.border }}>
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold" style={{ color: COLORS.textPrimary }}>{title}</h3>
          {hasChanges && (
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: `${COLORS.info}15`, color: COLORS.info }}>
              Modificada em v1.1
            </span>
          )}
        </div>
        <span className="text-xs font-medium" style={{ color }}>{confidence}%</span>
      </div>
      {hasChanges && (
        <div className="mb-4 space-y-2">
          {changes.map((change, i) => (
            <div key={i} className="border rounded-md overflow-hidden">
              <div className="px-3 py-2 text-xs border-b flex items-center gap-2"
                style={{ backgroundColor: COLORS.bgSubtle, borderColor: COLORS.border, color: COLORS.textMuted }}>
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
      <div className="text-sm leading-relaxed select-text" style={{ color: COLORS.textSecondary }}>
        {children}
      </div>
    </section>
  );
}

function CommentModal({ trecho, allowGap, onClose, onSubmit }) {
  const [text, setText] = useState('');
  const [type, setType] = useState('comment');
  const [blocking, setBlocking] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-lg rounded-xl shadow-2xl border"
        style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: COLORS.border }}>
          <div className="font-semibold text-base" style={{ color: COLORS.textPrimary }}>
            {type === 'gap' ? 'Apontar gap' : type === 'question' ? 'Perguntar' : 'Comentar'}
          </div>
        </div>

        <div className="p-6">
          <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>
            Trecho selecionado
          </div>
          <div className="border rounded-md p-3 mb-4 text-sm italic" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle, color: COLORS.textPrimary }}>
            "{trecho}"
          </div>

          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setType('comment')}
              className="px-3 py-1.5 text-xs font-medium rounded-md border"
              style={{
                backgroundColor: type === 'comment' ? COLORS.bgSubtle : 'transparent',
                borderColor: type === 'comment' ? COLORS.borderStrong : COLORS.border,
                color: COLORS.textPrimary,
              }}
            >
              💬 Comentário
            </button>
            <button
              onClick={() => setType('question')}
              className="px-3 py-1.5 text-xs font-medium rounded-md border"
              style={{
                backgroundColor: type === 'question' ? COLORS.bgSubtle : 'transparent',
                borderColor: type === 'question' ? COLORS.borderStrong : COLORS.border,
                color: COLORS.textPrimary,
              }}
            >
              ❓ Pergunta
            </button>
            {allowGap && (
              <button
                onClick={() => setType('gap')}
                className="px-3 py-1.5 text-xs font-medium rounded-md border"
                style={{
                  backgroundColor: type === 'gap' ? `${COLORS.danger}10` : 'transparent',
                  borderColor: type === 'gap' ? COLORS.danger : COLORS.border,
                  color: type === 'gap' ? COLORS.danger : COLORS.textPrimary,
                }}
              >
                ⚠️ Gap
              </button>
            )}
          </div>

          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={4}
            placeholder={type === 'gap' ? 'O que está faltando?' : 'Sua observação...'}
            className="w-full p-3 text-sm rounded-md border focus:outline-none resize-none"
            style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg, color: COLORS.textPrimary }}
          />

          {type === 'gap' && (
            <div className="mt-3">
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>
                Esse gap exige:
              </div>
              <div className="space-y-2">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="radio" name="blocking" checked={!blocking} onChange={() => setBlocking(false)} className="mt-0.5" />
                  <div>
                    <div className="text-sm" style={{ color: COLORS.textPrimary }}>Resposta no comentário (não bloqueante)</div>
                    <div className="text-xs" style={{ color: COLORS.textMuted }}>Pode ser respondido sem nova versão</div>
                  </div>
                </label>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="radio" name="blocking" checked={blocking} onChange={() => setBlocking(true)} className="mt-0.5" />
                  <div>
                    <div className="text-sm" style={{ color: COLORS.textPrimary }}>Nova versão do RP (v1.1 obrigatória)</div>
                    <div className="text-xs" style={{ color: COLORS.textMuted }}>RP volta ao PO para revisão</div>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t flex justify-end gap-2" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button disabled={!text.trim()} onClick={() => onSubmit(text, type, blocking)}>
            Enviar
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SCREEN: RP REVISION (PO endereça gaps do PM, gera v1.1)
// ============================================================
function RPRevisionScreen() {
  const { navigate, demandTitle, returnedGaps, setReturnedGaps, showToast, setDemandState, setRpVersion, v11Changes, setV11Changes, rpComments, addNotification } = useApp();
  const [selectedGap, setSelectedGap] = useState(null);
  const [v11Frozen, setV11Frozen] = useState(false);

  const allAddressed = returnedGaps.every(g => v11Changes[g.id]);

  const addressGap = (gap, newText) => {
    setV11Changes(prev => ({
      ...prev,
      [gap.id]: {
        gapId: gap.id,
        sectionId: gap.sectionId,
        before: gap.trecho,
        after: newText,
        addressedBy: 'Marina Costa',
      }
    }));
    setSelectedGap(null);
    showToast('Gap endereçado');
  };

  const freezeV11 = () => {
    setRpVersion('v1.1');
    setDemandState('RP Congelado');
    setReturnedGaps([]);
    setV11Frozen(true);
    addNotification({
      forPersona: 'pm',
      type: 'rp-v11-frozen',
      title: 'RP v1.1 disponível para revisão',
      body: `Marina endereçou ${Object.keys(v11Changes).length} gap${Object.keys(v11Changes).length !== 1 ? 's' : ''} apontado${Object.keys(v11Changes).length !== 1 ? 's' : ''}. Veja o diff.`,
      demandId: 'DEM-2026-001',
      icon: 'layers',
    });
    showToast('RP v1.1 congelado — PM notificado');
  };

  if (v11Frozen) {
    return (
      <div className="max-w-2xl mx-auto pt-16">
        <div className="border rounded-lg p-12 text-center" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: `${COLORS.success}20` }}>
            <Check size={32} style={{ color: COLORS.success }} />
          </div>
          <div className="text-xl font-semibold mb-2" style={{ color: COLORS.textPrimary }}>
            RP-2026-001 v1.1 congelado
          </div>
          <div className="text-sm mb-6 max-w-md mx-auto" style={{ color: COLORS.textSecondary }}>
            PM Juliana Reis foi notificada. Os {Object.keys(v11Changes).length} {Object.keys(v11Changes).length === 1 ? 'gap endereçado vai' : 'gaps endereçados vão'} aparecer como diff sobre a v1.0.
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
        <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: COLORS.bgSubtle, color: COLORS.textSecondary }}>
          DEM-2026-001
        </span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: `${COLORS.warning}15`, color: COLORS.warning }}>
          Devolvido pelo PM · v1.0 → v1.1
        </span>
        <button
          onClick={() => navigate('timeline')}
          className="ml-auto text-xs flex items-center gap-1 px-2 py-1 rounded hover:bg-stone-100"
          style={{ color: COLORS.textSecondary }}
        >
          <Clock size={12} /> Histórico
        </button>
      </div>
      <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.textPrimary }}>{demandTitle}</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.textSecondary }}>
        PM apontou {returnedGaps.length} gap{returnedGaps.length !== 1 ? 's' : ''} bloqueante{returnedGaps.length !== 1 ? 's' : ''}. Enderece cada um pra liberar a v1.1.
      </p>

      <div className="border rounded-lg p-5 mb-6 flex items-center gap-6" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <ScoreRing score={Math.round((Object.keys(v11Changes).length / Math.max(returnedGaps.length, 1)) * 100)} size={64} strokeWidth={6} />
        <div className="flex-1">
          <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>v1.1 em construção</div>
          <div className="text-base font-semibold" style={{ color: COLORS.textPrimary }}>
            {Object.keys(v11Changes).length} de {returnedGaps.length} gaps endereçados
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-24">
        {returnedGaps.map(gap => {
          const addressed = v11Changes[gap.id];
          return (
            <div
              key={gap.id}
              onClick={() => setSelectedGap(gap)}
              className="border rounded-lg p-4 cursor-pointer hover:shadow-sm transition-all"
              style={{
                backgroundColor: addressed ? `${COLORS.success}05` : COLORS.bgElevated,
                borderColor: addressed ? `${COLORS.success}40` : COLORS.border,
              }}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0">
                  {addressed ? (
                    <CheckCircle2 size={18} style={{ color: COLORS.success }} />
                  ) : (
                    <AlertTriangle size={18} style={{ color: COLORS.danger }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ backgroundColor: `${COLORS.danger}15`, color: COLORS.danger }}>
                      Gap bloqueante
                    </span>
                    <span className="text-xs" style={{ color: COLORS.textMuted }}>seção: {gap.sectionId}</span>
                    <span className="text-xs" style={{ color: COLORS.textMuted }}>· por {gap.author.split(' ')[0]}</span>
                  </div>
                  <div className="text-xs italic mb-2 p-2 rounded" style={{ backgroundColor: COLORS.bgSubtle, color: COLORS.textSecondary }}>
                    "{gap.trecho.slice(0, 120)}{gap.trecho.length > 120 ? '...' : ''}"
                  </div>
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

      <div className="fixed bottom-4 left-64 right-4 max-w-5xl mx-auto border rounded-lg p-4 flex items-center justify-between shadow-md"
        style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
        <div className="text-xs" style={{ color: COLORS.textMuted }}>
          {allAddressed ? 'Todos os gaps endereçados — pronto para v1.1' : `Faltam ${returnedGaps.length - Object.keys(v11Changes).length} gap(s)`}
        </div>
        <Button
          size="sm"
          icon={Layers}
          disabled={!allAddressed}
          onClick={freezeV11}
        >
          Congelar v1.1
        </Button>
      </div>

      {selectedGap && (
        <AddressGapModal
          gap={selectedGap}
          existing={v11Changes[selectedGap.id]}
          onClose={() => setSelectedGap(null)}
          onSubmit={(newText) => addressGap(selectedGap, newText)}
        />
      )}
    </div>
  );
}

function AddressGapModal({ gap, existing, onClose, onSubmit }) {
  const [text, setText] = useState(existing?.after || '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-2xl rounded-xl shadow-2xl border"
        style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
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
          <div className="text-sm mb-4 p-3 rounded-md" style={{ backgroundColor: `${COLORS.warning}10`, color: COLORS.textPrimary }}>
            {gap.text}
          </div>

          <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>Nova versão para v1.1</div>
          <div className="border rounded-md p-3" style={{ borderColor: `${COLORS.success}40`, backgroundColor: `${COLORS.success}05` }}>
            <div className="text-xs font-mono mb-1" style={{ color: COLORS.success }}>+ adicionado</div>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              rows={4}
              placeholder="Escreva o trecho corrigido que vai entrar na v1.1..."
              className="w-full p-2 text-sm rounded border focus:outline-none resize-none bg-transparent"
              style={{ borderColor: COLORS.border, color: COLORS.textPrimary }}
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t flex justify-end gap-2" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgSubtle }}>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button disabled={!text.trim()} onClick={() => onSubmit(text)}>
            {existing ? 'Atualizar endereçamento' : 'Endereçar gap'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SCREEN: ADR LIBRARY (CTO sidebar)
// ============================================================
function ADRLibraryScreen() {
  const { navigate, adrs } = useApp();
  const [selected, setSelected] = useState(null);
  const allAdrs = [
    ...adrs.map(a => ({ ...a, demand: 'DEM-2026-001', date: 'agora' })),
    { id: 'ADR-099', title: 'JWT com refresh assimétrico', demand: 'DEM-2025-095', date: 'há 12 dias', decision: 'Usar RS256 com chave pública distribuída via JWKS.', context: 'Migração de auth precisa escalar para múltiplos serviços.', alternatives: 'HS256 (rejeitado: segredo compartilhado).', consequences: 'Rotação de chave mais complexa, mas maior segurança.' },
    { id: 'ADR-098', title: 'Cache distribuído via Redis Cluster', demand: 'DEM-2025-094', date: 'há 20 dias', decision: 'Adotar Redis Cluster ao invés de Redis standalone para o dashboard.', context: 'Performance do dashboard exige cache distribuído com alta disponibilidade.', alternatives: 'Memcached (rejeitado: sem persistência).', consequences: 'Maior complexidade operacional, mas escala horizontal.' },
    { id: 'ADR-067', title: 'Event sourcing para auditoria PIX', demand: 'DEM-2025-067', date: 'há 60 dias', decision: 'Armazenar todos eventos PIX em append-only log com replay.', context: 'Auditoria de cobrança PIX exige rastro imutável.', alternatives: 'CRUD com soft-delete (rejeitado: violação de imutabilidade).', consequences: 'Storage maior, queries mais complexas, mas compliance pleno.' },
  ];

  return (
    <div className="max-w-5xl">
      <button onClick={() => navigate('dashboard')} className="flex items-center gap-1 text-sm mb-4 hover:opacity-70" style={{ color: COLORS.textSecondary }}>
        <ChevronLeft size={14} /> Dashboard
      </button>

      <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.textPrimary }}>Biblioteca de ADRs</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.textSecondary }}>
        Todas as decisões arquiteturais registradas pela engenharia.
      </p>

      <div className="space-y-2">
        {allAdrs.map(adr => (
          <div
            key={adr.id}
            onClick={() => setSelected(adr)}
            className="border rounded-lg p-4 cursor-pointer hover:shadow-sm transition-all"
            style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: '#F5F3FF', color: '#6D28D9' }}>
                    {adr.id}
                  </span>
                  <span className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>{adr.title}</span>
                </div>
                <div className="flex items-center gap-3 text-xs mb-2" style={{ color: COLORS.textMuted }}>
                  <span>{adr.demand}</span>
                  <span>·</span>
                  <span>{adr.date}</span>
                </div>
                <div className="text-sm overflow-hidden" style={{ color: COLORS.textSecondary, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {adr.decision}
                </div>
              </div>
              <ChevronRight size={16} className="flex-shrink-0 mt-1" style={{ color: COLORS.textMuted }} />
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setSelected(null)}>
          <div onClick={e => e.stopPropagation()} className="w-full max-w-2xl rounded-xl shadow-2xl border max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
            <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: COLORS.border }}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: '#F5F3FF', color: '#6D28D9' }}>
                    {selected.id}
                  </span>
                  <span className="text-xs" style={{ color: COLORS.textMuted }}>{selected.demand} · {selected.date}</span>
                </div>
                <div className="font-semibold text-base" style={{ color: COLORS.textPrimary }}>{selected.title}</div>
              </div>
              <button onClick={() => setSelected(null)} className="p-1 hover:bg-stone-100 rounded">
                <X size={18} style={{ color: COLORS.textMuted }} />
              </button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              {selected.context && (
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>Contexto</div>
                  <div style={{ color: COLORS.textPrimary }}>{selected.context}</div>
                </div>
              )}
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>Decisão</div>
                <div style={{ color: COLORS.textPrimary }}>{selected.decision}</div>
              </div>
              {selected.alternatives && (
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>Alternativas</div>
                  <div style={{ color: COLORS.textPrimary }}>{selected.alternatives}</div>
                </div>
              )}
              {selected.consequences && (
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>Consequências</div>
                  <div style={{ color: COLORS.textPrimary }}>{selected.consequences}</div>
                </div>
              )}
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
      <p className="text-sm mb-6" style={{ color: COLORS.textSecondary }}>
        Todas as demandas que você criou, em qualquer estado.
      </p>

      <div className="space-y-2">
        {allMine.map(d => (
          <div
            key={d.id}
            onClick={() => d.isMain && navigate('capture-queue')}
            className={`border rounded-lg p-4 ${d.isMain ? 'cursor-pointer hover:shadow-sm' : ''} transition-all`}
            style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <FileText size={14} style={{ color: COLORS.textMuted }} />
                  <span className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>{d.title}</span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: COLORS.bgSubtle, color: COLORS.textSecondary }}>
                    {d.id}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs mb-2">
                  <StatusPill status={d.state} />
                  {d.score !== undefined && <span style={{ color: COLORS.textMuted }}>Score: {d.score}%</span>}
                  <span style={{ color: COLORS.textMuted }}>{d.updated}</span>
                </div>
                {d.preview && (
                  <div className="text-sm" style={{ color: COLORS.textSecondary }}>"{d.preview}"</div>
                )}
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
// SCREEN: MY COMMENTS (Viewer/PM)
// ============================================================
function MyCommentsScreen() {
  const { navigate, rpComments, persona } = useApp();
  const mine = rpComments.filter(c => c.author === persona?.name);

  return (
    <div className="max-w-3xl">
      <button onClick={() => navigate('dashboard')} className="flex items-center gap-1 text-sm mb-4 hover:opacity-70" style={{ color: COLORS.textSecondary }}>
        <ChevronLeft size={14} /> Dashboard
      </button>
      <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.textPrimary }}>Meus Comentários</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.textSecondary }}>
        {mine.length} comentário{mine.length !== 1 ? 's' : ''} em RPs publicados.
      </p>

      {mine.length === 0 ? (
        <div className="border rounded-lg p-8 text-center" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border, borderStyle: 'dashed' }}>
          <MessageSquare size={28} className="mx-auto mb-2" style={{ color: COLORS.textMuted }} />
          <div className="text-sm font-medium mb-1" style={{ color: COLORS.textSecondary }}>
            Você ainda não comentou em nenhum RP
          </div>
          <div className="text-xs" style={{ color: COLORS.textMuted }}>
            Abra um RP e selecione um trecho para comentar.
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {mine.map(c => (
            <div
              key={c.id}
              onClick={() => navigate('rp-view')}
              className="border rounded-lg p-4 cursor-pointer hover:shadow-sm transition-all"
              style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: COLORS.bgSubtle, color: COLORS.textSecondary }}>
                  DEM-2026-001 · {c.sectionId}
                </span>
                <span
                  className="text-xs px-1.5 py-0.5 rounded font-medium"
                  style={{
                    backgroundColor: c.type === 'gap' ? `${COLORS.danger}15` : `${COLORS.info}15`,
                    color: c.type === 'gap' ? COLORS.danger : COLORS.info,
                  }}
                >
                  {c.type === 'gap' ? 'Gap' : c.type === 'question' ? 'Pergunta' : 'Comentário'}
                </span>
              </div>
              <div className="text-xs italic mb-2 p-2 rounded" style={{ backgroundColor: COLORS.bgSubtle, color: COLORS.textMuted }}>
                "{c.trecho.slice(0, 100)}{c.trecho.length > 100 ? '...' : ''}"
              </div>
              <div className="text-sm" style={{ color: COLORS.textPrimary }}>{c.text}</div>
            </div>
          ))}
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

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => n.forPersona === persona?.id ? { ...n, read: true } : n));
  };

  const goToNotif = (n) => {
    markRead(n.id);
    if (n.actionScreen) {
      navigate(n.actionScreen);
    } else if (n.demandId) {
      // Navigate based on persona and current demand state
      if (persona?.id === 'submitter') navigate('my-demands');
      else if (persona?.id === 'po') navigate('dashboard');
      else if (persona?.id === 'cto') navigate('dashboard');
      else if (persona?.id === 'pm' || persona?.id === 'viewer') navigate('rp-view');
    }
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

  const iconFor = (type) => {
    const map = {
      'inbox': Inbox,
      'check': CheckCircle2,
      'alert': AlertTriangle,
      'layers': Layers,
      'message': MessageSquare,
    };
    return map[type] || Bell;
  };

  return (
    <div className="max-w-3xl">
      <button onClick={() => navigate('dashboard')} className="flex items-center gap-1 text-sm mb-4 hover:opacity-70" style={{ color: COLORS.textSecondary }}>
        <ChevronLeft size={14} /> Dashboard
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: COLORS.textPrimary }}>Notificações</h1>
          <p className="text-sm mt-1" style={{ color: COLORS.textSecondary }}>
            {unread.length > 0 ? `${unread.length} não lida${unread.length !== 1 ? 's' : ''}` : 'Tudo em dia'}
          </p>
        </div>
        {unread.length > 0 && (
          <Button variant="secondary" size="sm" onClick={markAllRead}>Marcar todas como lidas</Button>
        )}
      </div>

      {mine.length === 0 ? (
        <div className="border rounded-lg p-12 text-center" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border, borderStyle: 'dashed' }}>
          <Bell size={32} className="mx-auto mb-3" style={{ color: COLORS.textMuted }} />
          <div className="font-semibold mb-1" style={{ color: COLORS.textPrimary }}>Sem notificações ainda</div>
          <div className="text-sm" style={{ color: COLORS.textSecondary }}>
            Avance no fluxo (criar demanda, triar, racionalizar...) — você receberá notificações relevantes para sua persona.
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {unread.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>
                Não lidas · {unread.length}
              </h2>
              <div className="space-y-2">
                {unread.map(n => {
                  const Icon = iconFor(n.icon);
                  return (
                    <div
                      key={n.id}
                      onClick={() => goToNotif(n)}
                      className="border rounded-lg p-4 cursor-pointer hover:shadow-sm transition-all relative"
                      style={{ backgroundColor: COLORS.bgElevated, borderColor: persona?.color, borderLeftWidth: '3px' }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${persona?.color}15`, color: persona?.color }}>
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
              <h2 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>
                Lidas · {read.length}
              </h2>
              <div className="space-y-2 opacity-60">
                {read.map(n => {
                  const Icon = iconFor(n.icon);
                  return (
                    <div
                      key={n.id}
                      onClick={() => goToNotif(n)}
                      className="border rounded-lg p-4 cursor-pointer hover:shadow-sm transition-all"
                      style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: COLORS.bgSubtle, color: COLORS.textMuted }}>
                          <Icon size={14} />
                        </div>
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
// SCREEN: BACKLOG (PO)
// ============================================================
function BacklogScreen() {
  const { navigate, demandState, demandTitle } = useApp();
  const isMainInBacklog = demandState === 'Backlog';

  const items = [
    ...(isMainInBacklog ? [{
      id: 'DEM-2026-001',
      title: demandTitle,
      from: 'Carlos Silva (COO)',
      addedAt: 'agora',
      reviewDate: '2026-08-15',
      reason: 'Aguardando aprovação de orçamento adicional',
      trigger: 'Quando orçamento Q3 for liberado',
      isMain: true,
    }] : []),
    {
      id: 'DEM-2025-077',
      title: 'Reformular fluxo de onboarding mobile',
      from: 'Lucia Mendes (CS Lead)',
      addedAt: 'há 32 dias',
      reviewDate: '2026-07-01',
      reason: 'Boa demanda mas competiria com sprint de billing',
      trigger: 'Após release de billing v2',
    },
    {
      id: 'DEM-2025-070',
      title: 'Suporte a múltiplas moedas',
      from: 'Carlos Silva (COO)',
      addedAt: 'há 45 dias',
      reviewDate: '2026-09-01',
      reason: 'Depende de expansão internacional confirmada',
      trigger: 'Quando primeiro contrato US for assinado',
    },
  ];

  return (
    <div className="max-w-5xl">
      <button onClick={() => navigate('dashboard')} className="flex items-center gap-1 text-sm mb-4 hover:opacity-70" style={{ color: COLORS.textSecondary }}>
        <ChevronLeft size={14} /> Dashboard
      </button>
      <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.textPrimary }}>Backlog</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.textSecondary }}>
        Demandas válidas que não são prioridade agora. Cada uma tem data de revisão ou trigger para destravar.
      </p>

      {items.length === 0 ? (
        <div className="border rounded-lg p-12 text-center" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border, borderStyle: 'dashed' }}>
          <Archive size={32} className="mx-auto mb-3" style={{ color: COLORS.textMuted }} />
          <div className="font-semibold mb-1" style={{ color: COLORS.textPrimary }}>Backlog vazio</div>
          <div className="text-sm" style={{ color: COLORS.textSecondary }}>
            Quando você triar demandas como "Backlog", elas aparecerão aqui.
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map(d => (
            <div
              key={d.id}
              className={`border rounded-lg p-4 ${d.isMain ? 'border-2' : ''}`}
              style={{ backgroundColor: COLORS.bgElevated, borderColor: d.isMain ? '#8B5CF6' : COLORS.border }}
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Archive size={14} style={{ color: COLORS.textMuted }} />
                    <span className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>{d.title}</span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: COLORS.bgSubtle, color: COLORS.textSecondary }}>
                      {d.id}
                    </span>
                    {d.isMain && (
                      <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ backgroundColor: '#F5F3FF', color: '#6D28D9' }}>
                        adicionada agora
                      </span>
                    )}
                  </div>
                  <div className="text-xs mb-2" style={{ color: COLORS.textMuted }}>
                    De: {d.from} · adicionada {d.addedAt}
                  </div>
                </div>
                <Button variant="ghost" size="sm">Reativar →</Button>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm mt-3 pt-3 border-t" style={{ borderColor: COLORS.border }}>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>Motivo</div>
                  <div style={{ color: COLORS.textSecondary }}>{d.reason}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>Trigger / Revisar em</div>
                  <div style={{ color: COLORS.textSecondary }}>{d.trigger} ({d.reviewDate})</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// SCREEN: ARCHIVED (PO)
// ============================================================
function ArchivedScreen() {
  const { navigate, demandState, demandTitle } = useApp();
  const isMainArchived = demandState === 'Rejeitada' || demandState === 'Arquivada';

  const items = [
    ...(isMainArchived ? [{
      id: 'DEM-2026-001',
      title: demandTitle,
      from: 'Carlos Silva (COO)',
      archivedAt: 'agora',
      reason: demandState === 'Rejeitada' ? 'Rejeitada na triagem' : 'Arquivada',
      justification: 'Veja a triagem para justificativa',
      isMain: true,
    }] : []),
    {
      id: 'DEM-2025-080',
      title: 'Webhook customizado por cliente',
      from: 'Pedro Costa (Eng)',
      archivedAt: 'há 18 dias',
      reason: 'Rejeitada',
      justification: 'Conflito com arquitetura — discutido com CTO. Cliente migrou para padrão.',
    },
    {
      id: 'DEM-2025-065',
      title: 'Suporte legado IE11',
      from: 'Maria Pereira (CS)',
      archivedAt: 'há 60 dias',
      reason: 'Rejeitada',
      justification: 'IE11 é menos de 0.1% da base. Custo de manutenção não justifica.',
    },
    {
      id: 'DEM-2025-050',
      title: 'Dashboard de churn em tempo real',
      from: 'Ana Santos (CFO)',
      archivedAt: 'há 90 dias',
      reason: 'Cancelada pelo originador',
      justification: 'Cliente desistiu após análise de impacto técnico.',
    },
  ];

  return (
    <div className="max-w-5xl">
      <button onClick={() => navigate('dashboard')} className="flex items-center gap-1 text-sm mb-4 hover:opacity-70" style={{ color: COLORS.textSecondary }}>
        <ChevronLeft size={14} /> Dashboard
      </button>
      <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.textPrimary }}>Demandas Arquivadas</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.textSecondary }}>
        Demandas rejeitadas ou canceladas. Mantidas para histórico e auditoria.
      </p>

      <div className="space-y-2">
        {items.map(d => (
          <div key={d.id} className="border rounded-lg p-4 opacity-90" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Archive size={14} style={{ color: COLORS.textMuted }} />
                  <span className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>{d.title}</span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: COLORS.bgSubtle, color: COLORS.textSecondary }}>
                    {d.id}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded font-medium"
                    style={{ backgroundColor: `${COLORS.danger}15`, color: COLORS.danger }}
                  >
                    {d.reason}
                  </span>
                </div>
                <div className="text-xs mb-2" style={{ color: COLORS.textMuted }}>
                  De: {d.from} · arquivada {d.archivedAt}
                </div>
                <div className="text-sm" style={{ color: COLORS.textSecondary }}>
                  {d.justification}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// SCREEN: COLLECT INBOX (Submitter)
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
    if (!allAnswered) {
      showToast('Responda todas as perguntas', 'warning');
      return;
    }
    setPendingCollects(prev => prev.map(c =>
      c.id === selected.id
        ? { ...c, status: 'answered', answers: selected.questions.map((q, i) => ({ q, a: answers[i] })) }
        : c
    ));
    addNotification({
      forPersona: 'po',
      type: 'collect-answered',
      title: 'Coleta respondida pelo originador',
      body: `Carlos respondeu ${selected.questions.length} perguntas sobre "${selected.demandTitle}"`,
      demandId: selected.demandId,
      icon: 'message',
    });
    showToast('Respostas enviadas à PO');
    setSelected(null);
    setAnswers({});
  };

  return (
    <div className="max-w-3xl">
      <button onClick={() => navigate('dashboard')} className="flex items-center gap-1 text-sm mb-4 hover:opacity-70" style={{ color: COLORS.textSecondary }}>
        <ChevronLeft size={14} /> Dashboard
      </button>
      <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.textPrimary }}>Coletas pendentes</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.textSecondary }}>
        Perguntas que o PO precisa que você responda para destravar sua demanda.
      </p>

      {pending.length === 0 && answered.length === 0 ? (
        <div className="border rounded-lg p-12 text-center" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border, borderStyle: 'dashed' }}>
          <MessageSquare size={32} className="mx-auto mb-3" style={{ color: COLORS.textMuted }} />
          <div className="font-semibold mb-1" style={{ color: COLORS.textPrimary }}>Nenhuma coleta pendente</div>
          <div className="text-sm" style={{ color: COLORS.textSecondary }}>
            Quando o PO precisar de mais informação durante a racionalização, as perguntas chegarão aqui.
          </div>
        </div>
      ) : (
        <>
          {pending.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.danger }}>
                Aguardando você · {pending.length}
              </h2>
              <div className="space-y-2">
                {pending.map(c => (
                  <div
                    key={c.id}
                    onClick={() => setSelected(c)}
                    className="border rounded-lg p-4 cursor-pointer hover:shadow-sm transition-all"
                    style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border, borderLeftWidth: '3px', borderLeftColor: COLORS.danger }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <MessageSquare size={14} style={{ color: COLORS.danger }} />
                          <span className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>{c.demandTitle}</span>
                        </div>
                        <div className="text-xs mb-2" style={{ color: COLORS.textMuted }}>
                          De: {c.askedBy} · contexto: {c.pendencyContext}
                        </div>
                        <div className="text-sm" style={{ color: COLORS.textSecondary }}>
                          {c.questions.length} pergunta{c.questions.length !== 1 ? 's' : ''} estruturada{c.questions.length !== 1 ? 's' : ''}
                        </div>
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
              <h2 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.success }}>
                Respondidas · {answered.length}
              </h2>
              <div className="space-y-2 opacity-70">
                {answered.map(c => (
                  <div key={c.id} className="border rounded-lg p-4" style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 size={14} style={{ color: COLORS.success }} />
                      <span className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>{c.demandTitle}</span>
                    </div>
                    <div className="text-xs" style={{ color: COLORS.textMuted }}>
                      Respondida · {c.questions.length} pergunta{c.questions.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setSelected(null)}>
          <div onClick={e => e.stopPropagation()} className="w-full max-w-2xl rounded-xl shadow-2xl border max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}>
            <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: COLORS.border }}>
              <div>
                <div className="text-xs uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted }}>Coleta</div>
                <div className="font-semibold text-base" style={{ color: COLORS.textPrimary }}>{selected.demandTitle}</div>
                <div className="text-xs mt-1" style={{ color: COLORS.textMuted }}>De: {selected.askedBy}</div>
              </div>
              <button onClick={() => setSelected(null)} className="p-1 hover:bg-stone-100 rounded">
                <X size={18} style={{ color: COLORS.textMuted }} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {selected.questions.map((q, i) => (
                <div key={i}>
                  <div className="text-sm font-medium mb-2" style={{ color: COLORS.textPrimary }}>
                    <span className="text-xs font-mono mr-2" style={{ color: COLORS.textMuted }}>{i + 1}.</span>
                    {q}
                  </div>
                  <textarea
                    value={answers[i] || ''}
                    onChange={e => setAnswers({ ...answers, [i]: e.target.value })}
                    rows={2}
                    placeholder="Sua resposta..."
                    className="w-full p-2.5 text-sm rounded-md border focus:outline-none resize-none"
                    style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg, color: COLORS.textPrimary }}
                  />
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
      <div className="border rounded-lg p-12 text-center mt-6"
        style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border, borderStyle: 'dashed' }}>
        <Layers size={32} className="mx-auto mb-3" style={{ color: COLORS.textMuted }} />
        <div className="font-semibold mb-1" style={{ color: COLORS.textPrimary }}>Tela em construção</div>
        <div className="text-sm" style={{ color: COLORS.textSecondary }}>Será implementada na próxima iteração.</div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
function AppInner() {
  const { persona, route } = useApp();

  if (!persona || route.screen === 'login') {
    return <LoginScreen />;
  }

  const renderScreen = () => {
    switch (route.screen) {
      case 'dashboard': return <Dashboard />;
      case 'new-demand': return <NewDemandScreen />;
      case 'capture-queue': return <CaptureQueueScreen />;
      case 'capture-review': return <CaptureReviewScreen />;
      case 'my-demands': return <MyDemandsScreen />;
      case 'my-comments': return <MyCommentsScreen />;
      case 'notifications': return <NotificationsScreen />;
      case 'backlog': return <BacklogScreen />;
      case 'archived': return <ArchivedScreen />;
      case 'collect-inbox': return <CollectInboxScreen />;
      case 'triage-queue': return <TriageQueueScreen />;
      case 'triage-detail': return <TriageDetailScreen />;
      case 'rationalizations': return <RationalizationsListScreen />;
      case 'rationalization': return <RationalizationScreen />;
      case 'rp-freeze': return <RPFreezeScreen />;
      case 'tech-evaluation': return <TechEvaluationScreen />;
      case 'rp-view': return <RPViewScreen />;
      case 'rp-revision': return <RPRevisionScreen />;
      case 'adrs': return <ADRLibraryScreen />;
      case 'tech-queue': return <PlaceholderScreen title="Escalas Técnicas (use o Dashboard)" />;
      case 'rps-pending': return <PlaceholderScreen title="RPs Aguardando (use o Dashboard)" />;
      case 'rps-published': return <PlaceholderScreen title="RPs Publicados (use o Dashboard)" />;
      case 'timeline': return <TimelineScreen />;
      case 'backlog': return <PlaceholderScreen title="Backlog" />;
      case 'archived': return <PlaceholderScreen title="Demandas Arquivadas" />;
      case 'tech-queue': return <PlaceholderScreen title="Escalas Técnicas" />;
      case 'tech-active': return <PlaceholderScreen title="Avaliações em Andamento" />;
      case 'kb': return <PlaceholderScreen title="Base de Conhecimento" />;
      case 'rps-pending': return <PlaceholderScreen title="RPs Aguardando" />;
      case 'rps-published': return <PlaceholderScreen title="RPs Publicados" />;
      case 'my-comments': return <PlaceholderScreen title="Meus Comentários" />;
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
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <style>{`
        @keyframes slide-in {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes pulse-slow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
          50% { box-shadow: 0 0 0 6px rgba(59, 130, 246, 0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes float-up {
          0% { opacity: 0; transform: translateY(0); }
          20% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-30px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-slide-in { animation: slide-in 0.25s ease-out; }
        .animate-slide-in-right { animation: slide-in-right 0.3s ease-out; }
        .animate-pulse-slow { animation: pulse-slow 2s infinite; }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.35s ease-out backwards; }
        .animate-float-up { animation: float-up 1.2s ease-out forwards; }
        .shimmer-bg {
          background: linear-gradient(90deg, #F5F5F4 0%, #FAFAF9 50%, #F5F5F4 100%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        .stagger-1 { animation-delay: 0.05s; }
        .stagger-2 { animation-delay: 0.1s; }
        .stagger-3 { animation-delay: 0.15s; }
        .stagger-4 { animation-delay: 0.2s; }
        .stagger-5 { animation-delay: 0.25s; }
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