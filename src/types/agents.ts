// ============================================
// Core Agent Type Definitions
// ============================================

// Agent Identifiers
export type AgentId = 
  | 'compliance-monitor'
  | 'risk-predictor' 
  | 'document-validator'
  | 'requirements-extractor'
  | 'communication-orchestrator'
  | 'workflow-automator'
  | 'performance-analyzer'
  | 'audit-intelligence'
  | 'sustainability-advisor'
  | 'financial-intelligence';

// Page Context Types
export type PageContext = 
  | 'dashboard'
  | 'supplier-tracker'
  | 'rfp-wizard'
  | 'rfp-tracker'
  | 'agent-reasoning'
  | 'audit-trail'
  | 'supplier-portal'
  | 'settings';

// Workflow Coordination Patterns
export type CoordinationPattern = 
  | 'sequential' 
  | 'parallel' 
  | 'conditional' 
  | 'event-driven';

// ============================================
// Agent Capability Definitions
// ============================================

export interface BaseAgentCapabilities {
  id: AgentId;
  name: string;
  version: string;
  capabilities: string[];
  supportedWorkflows: string[];
  dependencies: AgentId[];
  resourceRequirements: ResourceRequirements;
}

export interface ResourceRequirements {
  maxMemoryMB: number;
  maxConcurrentRequests: number;
  estimatedTokensPerRequest: {
    input: number;
    output: number;
  };
  timeoutMs: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

// ============================================
// Agent Execution Context
// ============================================

export interface AgentExecutionContext {
  // Session Information
  sessionId: string;
  workflowId?: string;
  conversationId: string;
  
  // User Context
  userId: string;
  organizationId: string;
  userRole: string;
  
  // Page Context
  pageContext: PageContext;
  pageData?: Record<string, any>;
  
  // Business Context
  supplierContext?: SupplierContext;
  rfpContext?: RFPContext;
  complianceContext?: ComplianceContext;
  
  // Execution Context
  previousAgentOutputs: AgentOutput[];
  sharedMemory: SharedMemory;
  executionMetadata: ExecutionMetadata;
  
  // Feature Flags
  features: FeatureFlags;
}

export interface SupplierContext {
  supplierId: string;
  supplierName: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  complianceStatus: string;
  certifications: string[];
  lastAuditDate?: Date;
}

export interface RFPContext {
  rfpId: string;
  rfpTitle: string;
  status: string;
  requirements: string[];
  timeline: string;
  budget: string;
}

export interface ComplianceContext {
  regulations: string[];
  industryStandards: string[];
  internalPolicies: string[];
  violations: string[];
}

export interface AgentOutput {
  agentId: AgentId;
  output: any;
  timestamp: Date;
  confidence: number;
}

export interface SharedMemory {
  variables: Map<string, MemoryVariable>;
  conversation: ConversationHistory;
  artifacts: Map<string, any>;
  metrics: Map<string, any>;
}

export interface MemoryVariable {
  key: string;
  value: any;
  type: string;
  source: string;
  timestamp: Date;
  ttl?: number;
}

export interface ConversationHistory {
  messages: ConversationMessage[];
  summary?: string;
  topics: string[];
  keyInsights: string[];
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'agent' | 'system';
  agentId?: AgentId;
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface ExecutionMetadata {
  startTime: Date;
  requestId: string;
  traceId: string;
  parentSpanId?: string;
}

export interface FeatureFlags {
  useRealAgents: boolean;
  enableWorkflows: boolean;
  enableStreaming: boolean;
  enableCaching: boolean;
  enableMetrics: boolean;
  enableTracing: boolean;
  debugMode: boolean;
}

// ============================================
// Agent Request/Response Models
// ============================================

export interface AgentInvokeRequest {
  agentId: AgentId;
  prompt: string;
  context: AgentExecutionContext;
  parameters?: AgentParameters;
  streaming?: boolean;
  options?: InvocationOptions;
}

export interface AgentParameters {
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  stopSequences?: string[];
  responseFormat?: 'text' | 'json' | 'structured';
  includeReasoning?: boolean;
}

export interface InvocationOptions {
  timeout?: number;
  retryCount?: number;
  cacheEnabled?: boolean;
  cacheTTL?: number;
  priority?: 'low' | 'normal' | 'high';
  traceEnabled?: boolean;
}

export interface AgentInvokeResponse {
  agentId: AgentId;
  sessionId: string;
  response: string;
  confidence: number;
  reasoning: ReasoningTrace;
  sources: SourceReference[];
  recommendations: Recommendation[];
  nextActions: NextAction[];
  metadata: ResponseMetadata;
  cost: ExecutionCost;
  performance: PerformanceMetrics;
}

export interface ReasoningTrace {
  steps: ReasoningStep[];
  conclusion: string;
  confidence: number;
}

export interface ReasoningStep {
  step: number;
  description: string;
  evidence: string[];
  confidence: number;
  timestamp: number;
}

export interface SourceReference {
  type: 'document' | 'database' | 'api' | 'knowledge_base';
  source: string;
  relevance: number;
  excerpt?: string;
}

export interface Recommendation {
  type: 'action' | 'information' | 'warning';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
}

export interface NextAction {
  action: string;
  description: string;
  agentId?: AgentId;
  parameters?: Record<string, any>;
}

export interface ResponseMetadata {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  processingTimeMs: number;
  modelUsed: string;
  cacheHit: boolean;
}

export interface ExecutionCost {
  tokenCost: number;
  computeCost: number;
  totalCost: number;
  currency: string;
}

export interface PerformanceMetrics {
  responseTimeMs: number;
  tokenUsage: TokenUsage;
  memoryUsageMB: number;
  queueWaitTimeMs?: number;
}

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cachedTokens?: number;
}

// ============================================
// Error Handling Types
// ============================================

export interface AgentError extends Error {
  code: string;
  agentId?: AgentId;
  recoverable: boolean;
  context?: Record<string, any>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface SecurityValidationResult {
  isValid: boolean;
  violations: SecurityViolation[];
  riskScore: number;
}

export interface SecurityViolation {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  evidence: string[];
}

// ============================================
// Configuration Types
// ============================================

export interface AgentConfig {
  agentId: AgentId;
  bedrockConfig: BedrockConfig;
  capabilities: CapabilityConfig;
  memory: MemoryConfig;
  performance: PerformanceConfig;
  security: SecurityConfig;
  monitoring: MonitoringConfig;
}

export interface BedrockConfig {
  region: string;
  agentId: string;
  agentAliasId: string;
  modelId?: string;
  endpoint?: string;
}

export interface CapabilityConfig {
  maxConcurrentRequests: number;
  timeoutMs: number;
  retryAttempts: number;
  cacheTTL: number;
  rateLimit: RateLimitConfig;
}

export interface RateLimitConfig {
  requestsPerMinute: number;
  requestsPerHour: number;
  burstLimit: number;
  cooldownMs: number;
}

export interface MemoryConfig {
  maxConversationLength: number;
  memoryRetentionHours: number;
  compressionEnabled: boolean;
  persistenceEnabled: boolean;
}

export interface PerformanceConfig {
  enableCaching: boolean;
  cacheStrategy: 'lru' | 'ttl' | 'adaptive';
  maxCacheSize: number;
  enableBatching: boolean;
  batchSize: number;
  batchTimeoutMs: number;
}

export interface SecurityConfig {
  enableInputValidation: boolean;
  enableOutputSanitization: boolean;
  enableRateLimiting: boolean;
  enableAuditLogging: boolean;
  maxPromptLength: number;
  allowedDomains: string[];
}
export interface MonitoringConfig {
  enableMetrics: boolean;
  enableTracing: boolean;
  metricsInterval: number;
  healthCheckInterval: number;
}

// ============================================
// Workflow Types
// ============================================

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  version: string;
  trigger: WorkflowTrigger;
  coordinationPattern: CoordinationPattern;
  steps: WorkflowStep[];
  sharedContext: WorkflowContext;
  successCriteria: SuccessCriteria;
  fallbackStrategy: FallbackStrategy;
  timeout: number;
  metadata: WorkflowMetadata;
}

export interface WorkflowTrigger {
  type: 'manual' | 'scheduled' | 'event_based';
  conditions: TriggerCondition[];
  description: string;
}

export interface TriggerCondition {
  type: string;
  schedule?: string;
  event?: string;
  description: string;
}

export interface WorkflowStep {
  stepId: string;
  name: string;
  agentId: AgentId;
  dependencies?: string[];
  conditions?: any[];
  inputMapping?: InputMapping;
  outputMapping?: OutputMapping;
  timeout: number;
  retryStrategy: RetryStrategy;
  errorHandling: ErrorHandling;
}

export interface InputMapping {
  source: 'context' | 'sharedMemory' | 'static';
  mappings: Record<string, FieldMapping>;
}

export interface OutputMapping {
  destination: 'sharedMemory' | 'context';
  mappings: Record<string, FieldMapping>;
}

export interface FieldMapping {
  path: string;
  required?: boolean;
  default?: any;
  transform?: (value: any) => any;
  persist?: boolean;
}

export interface RetryStrategy {
  maxAttempts: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
  jitterEnabled: boolean;
  retryableErrors: string[];
}

export interface ErrorHandling {
  strategy: 'fail' | 'continue' | 'retry';
  fallbackAction: string;
}

export interface WorkflowContext {
  variables: ContextVariable[];
  artifacts: ContextArtifact[];
}

export interface ContextVariable {
  name: string;
  type: string;
  required: boolean;
  default?: any;
  description: string;
}

export interface ContextArtifact {
  name: string;
  type: string;
  description: string;
}

export interface SuccessCriteria {
  conditions: SuccessCondition[];
  actions: SuccessAction[];
}

export interface SuccessCondition {
  type: string;
  description: string;
  threshold?: number;
  required: boolean;
}

export interface SuccessAction {
  condition: string;
  action: string;
  description: string;
}

export interface FallbackStrategy {
  type: string;
  description: string;
  actions: FallbackAction[];
}

export interface FallbackAction {
  trigger: string;
  action: string;
  description: string;
}

export interface WorkflowMetadata {
  category: string;
  priority: string;
  estimatedDuration: number;
  requiredPermissions: string[];
  tags: string[];
  version: string;
  lastUpdated: string;
  createdBy: string;
  approvedBy: string;
}

export interface WorkflowExecution {
  workflowId: string;
  executionId: string;
  status: WorkflowStatus;
  currentStep: number;
  steps: StepExecution[];
  sharedContext: SharedMemory;
  timeline: ExecutionTimeline;
  cost: WorkflowCost;
  performance: WorkflowPerformance;
  errorDetails?: ErrorDetails;
}

export interface StepExecution {
  stepId: string;
  agentId: AgentId;
  status: StepStatus;
  input: any;
  output?: any;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  attempts: number;
  cost: ExecutionCost;
  performance: PerformanceMetrics;
  errorDetails?: ErrorDetails;
  logs: LogEntry[];
}

export interface ExecutionTimeline {
  startTime: Date;
  endTime?: Date;
  estimatedDuration: number;
  milestones: Milestone[];
}

export interface Milestone {
  name: string;
  timestamp: Date;
  description: string;
}

export interface WorkflowCost {
  totalCost: number;
  stepCosts: Map<string, number>;
  currency: string;
}

export interface WorkflowPerformance {
  totalDurationMs: number;
  stepDurations: Map<string, number>;
  parallelizationEfficiency: number;
  resourceUtilization: ResourceUtilization;
  bottlenecks: Bottleneck[];
}

export interface ResourceUtilization {
  avgCpuPercent: number;
  avgMemoryMB: number;
  peakMemoryMB: number;
}

export interface Bottleneck {
  stepId: string;
  type: 'cpu' | 'memory' | 'network' | 'agent';
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export interface ErrorDetails {
  code: string;
  message: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'validation' | 'execution' | 'system' | 'network';
}

export interface LogEntry {
  timestamp: Date;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  data?: any;
}

export type WorkflowStatus = 'initializing' | 'running' | 'completed' | 'failed' | 'cancelled';
export type StepStatus = 'pending' | 'running' | 'completed' | 'failed' | 'skipped';

// ============================================
// Enhanced Feature Flags
// ============================================

export interface FeatureFlags {
  useRealAgents: boolean;
  enableWorkflows: boolean;
  enableStreaming: boolean;
  enableCaching: boolean;
  enableMetrics: boolean;
  enableTracing: boolean;
  debugMode: boolean;
  agentFlags: Record<AgentId, AgentFeatureFlags>;
  workflowFlags: Record<string, WorkflowFeatureFlags>;
}

export interface AgentFeatureFlags {
  enabled: boolean;
  rolloutPercentage: number;
  features: Record<string, boolean>;
}

export interface WorkflowFeatureFlags {
  enabled: boolean;
  rolloutPercentage: number;
  maxConcurrent: number;
}

// ============================================
// Enhanced Context Types
// ============================================

export interface AgentExecutionContext {
  // Session Information
  sessionId: string;
  workflowId?: string;
  conversationId: string;
  
  // User Context
  userId: string;
  organizationId: string;
  userRole: string;
  permissions: Permission[];
  
  // Page Context
  pageContext: PageContext;
  pageData?: Record<string, any>;
  
  // Business Context
  supplierContext?: SupplierContext;
  rfpContext?: RFPContext;
  complianceContext?: ComplianceContext;
  
  // Execution Context
  previousAgentOutputs: AgentOutput[];
  sharedMemory: SharedMemory;
  executionMetadata: ExecutionMetadata;
  
  // Feature Flags
  features: FeatureFlags;
}

export interface Permission {
  action: string;
  resource: string;
}

export interface SupplierContext {
  supplierId: string;
  supplierName: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  complianceStatus: string;
  certifications: Certification[];
  lastAuditDate?: Date;
  performanceMetrics?: Record<string, any>;
  upcomingMilestones?: Milestone[];
  uploadedDocuments?: Document[];
  primaryContact?: Contact;
}

export interface Certification {
  name: string;
  issuer: string;
  expiryDate: Date;
  status: 'valid' | 'expiring' | 'expired';
}

export interface Document {
  name: string;
  type: string;
  content?: string;
  uploadDate: Date;
}

export interface Contact {
  name: string;
  email: string;
  phone: string;
}

export interface RFPContext {
  rfpId: string;
  rfpTitle: string;
  status: string;
  requirements: string[];
  timeline: string;
  budget: string;
  attachedDocuments?: Document[];
}

export interface ComplianceContext {
  regulations: Regulation[];
  industryStandards: Standard[];
  internalPolicies: Policy[];
  violations: Violation[];
}

export interface Regulation {
  name: string;
  authority: string;
  effectiveDate: Date;
}

export interface Standard {
  name: string;
  organization: string;
  version: string;
}

export interface Policy {
  name: string;
  department: string;
  lastUpdated: Date;
}

export interface Violation {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  date: Date;
}

export interface SharedMemory {
  variables: Map<string, MemoryVariable>;
  conversation: ConversationHistory;
  artifacts: Map<string, any>;
  metrics: Map<string, any>;
}

export interface ConversationHistory {
  messages: ConversationMessage[];
  summary?: string;
  topics: string[];
  sentiment: SentimentAnalysis;
  keyInsights: string[];
}

export interface SentimentAnalysis {
  score: number;
  label: 'positive' | 'negative' | 'neutral';
}