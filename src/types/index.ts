// Core data models for the proCURE application

export interface Supplier {
  id: string;
  name: string;
  category: string;
  complianceScore: ComplianceScore;
  riskScore: RiskScore;
  lastAudit: string;
  supplierRating: 'preferred' | 'approved' | 'conditional';
  certifications: string[];
  lastUpdated: string;
}

export interface ComplianceScore {
  overall: number; // 0-100
  certifications: number; // 40% weight
  audits: number; // 30% weight
  documentation: number; // 20% weight
  regulatoryHistory: number; // 10% weight
  status: 'compliant' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  lastCalculated: string;
  nextReview: string;
}

export interface RiskScore {
  overall: number; // 0-100 (0 = no risk, 100 = maximum risk)
  level: 'low' | 'medium' | 'high';
  financial: number; // 25% weight
  operational: number; // 25% weight
  qualityTrend: number; // 20% weight
  supplyChain: number; // 15% weight
  regulatory: number; // 15% weight
  probability: number; // Probability of issues in next 12 months (0-100)
  trend: 'improving' | 'stable' | 'deteriorating';
  lastCalculated: string;
  nextAssessment: string;
}

export interface ScoreDetail {
  score: number;
  trend: 'up' | 'down' | 'stable';
  status: 'compliant' | 'warning' | 'critical' | 'good' | 'excellent';
}

// Master supplier data structure
export interface SupplierMaster {
  id: string;
  name: string;
  category: string;
  region: string;
  establishedYear: number;
  employeeCount: number;
  annualRevenue: string;
  facilities: string[];
  primaryContact: {
    name: string;
    email: string;
    phone: string;
  };
  onboardingDate: string;
  status: 'active' | 'inactive' | 'pending';
}

// Compliance requirements mapping
export interface ComplianceRequirement {
  id: string;
  supplierId: string;
  category: string;
  requirements: RequirementDetail[];
  region: string;
  lastUpdated: string;
}

export interface RequirementDetail {
  id: string;
  name: string;
  type: 'certification' | 'documentation' | 'audit' | 'process';
  mandatory: boolean;
  description: string;
  validityPeriod: number; // in months
  renewalNotice: number; // days before expiry
  regulatoryBody: string;
  currentStatus: 'valid' | 'expiring' | 'expired' | 'pending' | 'not_applicable';
  expiryDate?: string;
  lastVerified?: string;
  documentUrl?: string;
}

export interface AgentStatus {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'completed' | 'warning' | 'error';
  description?: string;
  task?: string;
  progress?: number;
  confidence?: number;
  lastUpdate: string;
  icon?: string;
}

export interface DecisionBreakdown {
  id: string;
  title: string;
  reasoning: string;
  factors: DecisionFactor[];
  keyFindings: string[];
  recommendations: string[];
  confidence: number;
  supplierId?: string;
}

export interface DecisionFactor {
  factor: string;
  score: number;
  weight: number;
  description?: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  type: 'compliance_check' | 'risk_assessment' | 'document_upload' | 'score_update' | 'alert' | 'approval';
  description: string;
  supplierId?: string;
  supplierName?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'completed' | 'failed';
  details?: Record<string, any>;
}

export interface Metric {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: string;
  color: 'red' | 'green' | 'yellow' | 'blue';
  category?: 'compliance' | 'risk' | 'quality' | 'sustainability';
}

export interface ComplianceData {
  month: string;
  compliant: number;
  warning: number;
  critical: number;
}

export interface RecentActivityItem {
  id: string;
  type: 'alert' | 'approval' | 'update' | 'upload';
  title: string;
  description: string;
  timestamp: string;
  supplierId?: string;
  priority: 'low' | 'medium' | 'high';
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
}

// Error types
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

// AWS Bedrock Agent types
export interface BedrockAgentConfig {
  region: string;
  agentId: string;
  agentAliasId: string;
}

export interface AgentInvokeRequest {
  prompt: string;
  sessionId?: string;
  context?: Record<string, any>;
}

export interface AgentInvokeResponse {
  response: string;
  sessionId: string;
  confidence?: number;
  sources?: string[];
}

// Supplier Context types
export interface SupplierContextValue {
  currentSupplierId: string | null;
  setCurrentSupplierId: (id: string | null) => void;
  suppliers: Supplier[];
  isLoading: boolean;
  error: Error | null;
}