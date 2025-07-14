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