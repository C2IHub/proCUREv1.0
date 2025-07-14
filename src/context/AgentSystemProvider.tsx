import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { AgentRegistry } from '../agents/registry/AgentRegistry';
import { AgentOrchestrator } from '../agents/orchestration/AgentOrchestrator';
import { ComplianceMonitorAgent } from '../agents/implementations/ComplianceMonitorAgent';
import { RiskPredictorAgent } from '../agents/implementations/RiskPredictorAgent';
import { DocumentIntelligenceAgent } from '../agents/implementations/DocumentIntelligenceAgent';
import {
  AgentConfig,
  AgentId,
  AgentInvokeRequest,
  AgentInvokeResponse,
  WorkflowDefinition,
  WorkflowExecution,
  AgentExecutionContext,
  FeatureFlags
} from '../types/agents';

interface AgentSystemContextValue {
  orchestrator: AgentOrchestrator;
  registry: AgentRegistry;
  isInitialized: boolean;
  features: FeatureFlags;
  
  // Agent invocation methods
  invokeAgent: (request: AgentInvokeRequest) => Promise<AgentInvokeResponse>;
  executeWorkflow: (workflow: WorkflowDefinition, context: AgentExecutionContext) => Promise<WorkflowExecution>;
  
  // System status
  getSystemHealth: () => Promise<boolean>;
  getAgentStats: () => any;
}

interface AgentSystemProviderProps {
  children: ReactNode;
  config?: Partial<AgentSystemConfig>;
}

interface AgentSystemConfig {
  useRealAgents: boolean;
  enableWorkflows: boolean;
  enableStreaming: boolean;
  enableCaching: boolean;
  debugMode: boolean;
  agentConfigs: Record<AgentId, AgentConfig>;
}

const AgentSystemContext = createContext<AgentSystemContextValue | null>(null);

export function AgentSystemProvider({ children, config }: AgentSystemProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [registry, setRegistry] = useState<AgentRegistry | null>(null);
  const [orchestrator, setOrchestrator] = useState<AgentOrchestrator | null>(null);

  // Feature flags configuration
  const features: FeatureFlags = {
    useRealAgents: config?.useRealAgents ?? process.env.NODE_ENV === 'production',
    enableWorkflows: config?.enableWorkflows ?? true,
    enableStreaming: config?.enableStreaming ?? false,
    enableCaching: config?.enableCaching ?? true,
    enableMetrics: true,
    enableTracing: config?.debugMode ?? false,
    debugMode: config?.debugMode ?? process.env.NODE_ENV === 'development',
    
    agentFlags: {
      'compliance-monitor': {
        enabled: true,
        rolloutPercentage: 100,
        features: { 'advanced_analysis': true }
      },
      'risk-predictor': {
        enabled: true,
        rolloutPercentage: 100,
        features: { 'predictive_modeling': true }
      },
      'document-validator': {
        enabled: true,
        rolloutPercentage: 100,
        features: { 'ai_validation': true }
      },
      'requirements-extractor': {
        enabled: true,
        rolloutPercentage: 80,
        features: { 'smart_extraction': true }
      },
      'communication-orchestrator': {
        enabled: true,
        rolloutPercentage: 90,
        features: { 'auto_routing': true }
      },
      'workflow-automator': {
        enabled: true,
        rolloutPercentage: 100,
        features: { 'parallel_execution': true }
      },
      'performance-analyzer': {
        enabled: true,
        rolloutPercentage: 100,
        features: { 'real_time_metrics': true }
      },
      'audit-intelligence': {
        enabled: true,
        rolloutPercentage: 90,
        features: { 'automated_reporting': true }
      },
      'sustainability-advisor': {
        enabled: true,
        rolloutPercentage: 70,
        features: { 'esg_scoring': true }
      },
      'financial-intelligence': {
        enabled: true,
        rolloutPercentage: 85,
        features: { 'cost_optimization': true }
      }
    },
    
    workflowFlags: {
      'supplier-onboarding': {
        enabled: true,
        rolloutPercentage: 100,
        maxConcurrent: 5
      },
      'compliance-review': {
        enabled: true,
        rolloutPercentage: 100,
        maxConcurrent: 10
      },
      'risk-assessment': {
        enabled: true,
        rolloutPercentage: 90,
        maxConcurrent: 8
      }
    }
  };

  // Initialize the agent system
  useEffect(() => {
    async function initializeSystem() {
      try {
        console.log('🚀 Initializing Agent System...');
        
        // Create agent configurations
        const agentConfigs = createAgentConfigs(features);
        
        // Initialize registry
        const newRegistry = new AgentRegistry(agentConfigs);
        
        // Initialize orchestrator
        const newOrchestrator = new AgentOrchestrator(newRegistry);
        
        // Validate system health
        const isHealthy = await newOrchestrator.healthCheck();
        if (!isHealthy) {
          console.warn('⚠️ Agent system health check failed, but continuing...');
        }
        
        setRegistry(newRegistry);
        setOrchestrator(newOrchestrator);
        setIsInitialized(true);
        
        console.log('✅ Agent System initialized successfully');
        console.log(`📊 Agents registered: ${newRegistry.getAllAgents().size}`);
        
      } catch (error) {
        console.error('❌ Failed to initialize Agent System:', error);
        // In development, we can continue with mock agents
        if (process.env.NODE_ENV === 'development') {
          console.log('🔄 Falling back to mock agent system...');
          // Initialize with mock configurations
          const mockConfigs = createMockAgentConfigs();
          const newRegistry = new AgentRegistry(mockConfigs);
          const newOrchestrator = new AgentOrchestrator(newRegistry);
          
          setRegistry(newRegistry);
          setOrchestrator(newOrchestrator);
          setIsInitialized(true);
        }
      }
    }

    initializeSystem();
  }, []);

  // Agent invocation method
  const invokeAgent = async (request: AgentInvokeRequest): Promise<AgentInvokeResponse> => {
    if (!orchestrator) {
      throw new Error('Agent system not initialized');
    }

    // Add feature flags to context
    const enhancedRequest = {
      ...request,
      context: {
        ...request.context,
        features
      }
    };

    return await orchestrator.invokeAgent(enhancedRequest);
  };

  // Workflow execution method
  const executeWorkflow = async (
    workflow: WorkflowDefinition,
    context: AgentExecutionContext
  ): Promise<WorkflowExecution> => {
    if (!orchestrator) {
      throw new Error('Agent system not initialized');
    }

    // Add feature flags to context
    const enhancedContext = {
      ...context,
      features
    };

    return await orchestrator.executeWorkflow(workflow, enhancedContext);
  };

  // System health check
  const getSystemHealth = async (): Promise<boolean> => {
    if (!orchestrator) return false;
    return await orchestrator.healthCheck();
  };

  // Get agent statistics
  const getAgentStats = () => {
    if (!registry || !orchestrator) return null;
    
    return {
      registry: registry.getStats(),
      orchestrator: orchestrator.getStats(),
      health: registry.getHealthStatus()
    };
  };

  const value: AgentSystemContextValue = {
    orchestrator: orchestrator!,
    registry: registry!,
    isInitialized,
    features,
    invokeAgent,
    executeWorkflow,
    getSystemHealth,
    getAgentStats
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing AI Agent System...</p>
        </div>
      </div>
    );
  }

  return (
    <AgentSystemContext.Provider value={value}>
      {children}
    </AgentSystemContext.Provider>
  );
}

export function useAgentSystem() {
  const context = useContext(AgentSystemContext);
  if (!context) {
    throw new Error('useAgentSystem must be used within an AgentSystemProvider');
  }
  return context;
}

// Helper function to create agent configurations
function createAgentConfigs(features: FeatureFlags): Record<AgentId, AgentConfig> {
  const baseConfig = {
    bedrockConfig: {
      region: process.env.VITE_AWS_REGION || 'us-east-1',
      agentId: '', // Will be set per agent
      agentAliasId: 'TSTALIASID', // Default test alias
      modelId: 'anthropic.claude-3-sonnet-20240229-v1:0'
    },
    capabilities: {
      maxConcurrentRequests: 10,
      timeoutMs: 30000,
      retryAttempts: 3,
      cacheTTL: 300,
      rateLimit: {
        requestsPerMinute: 60,
        requestsPerHour: 1000,
        burstLimit: 10,
        cooldownMs: 1000
      }
    },
    memory: {
      maxConversationLength: 50,
      memoryRetentionHours: 24,
      compressionEnabled: true,
      persistenceEnabled: false
    },
    performance: {
      enableCaching: features.enableCaching,
      cacheStrategy: 'lru' as const,
      maxCacheSize: 1000,
      enableBatching: false,
      batchSize: 5,
      batchTimeoutMs: 1000
    },
    security: {
      enableInputValidation: true,
      enableOutputSanitization: true,
      enableRateLimiting: true,
      enableAuditLogging: true,
      maxPromptLength: 10000,
      allowedDomains: ['*']
    },
    monitoring: {
      enableMetrics: features.enableMetrics,
      enableTracing: features.enableTracing,
      metricsInterval: 60000,
      healthCheckInterval: 30000
    }
  };

  return {
    'compliance-monitor': {
      ...baseConfig,
      agentId: 'compliance-monitor',
      bedrockConfig: {
        ...baseConfig.bedrockConfig,
        agentId: process.env.VITE_COMPLIANCE_AGENT_ID || 'COMPLIANCE_AGENT_ID'
      }
    },
    'risk-predictor': {
      ...baseConfig,
      agentId: 'risk-predictor',
      bedrockConfig: {
        ...baseConfig.bedrockConfig,
        agentId: process.env.VITE_RISK_AGENT_ID || 'RISK_AGENT_ID'
      }
    },
    'document-validator': {
      ...baseConfig,
      agentId: 'document-validator',
      bedrockConfig: {
        ...baseConfig.bedrockConfig,
        agentId: process.env.VITE_DOCUMENT_AGENT_ID || 'DOCUMENT_AGENT_ID'
      }
    },
    'requirements-extractor': {
      ...baseConfig,
      agentId: 'requirements-extractor',
      bedrockConfig: {
        ...baseConfig.bedrockConfig,
        agentId: process.env.VITE_REQUIREMENTS_AGENT_ID || 'REQUIREMENTS_AGENT_ID'
      }
    },
    'communication-orchestrator': {
      ...baseConfig,
      agentId: 'communication-orchestrator',
      bedrockConfig: {
        ...baseConfig.bedrockConfig,
        agentId: process.env.VITE_COMMUNICATION_AGENT_ID || 'COMMUNICATION_AGENT_ID'
      }
    },
    'workflow-automator': {
      ...baseConfig,
      agentId: 'workflow-automator',
      bedrockConfig: {
        ...baseConfig.bedrockConfig,
        agentId: process.env.VITE_WORKFLOW_AGENT_ID || 'WORKFLOW_AGENT_ID'
      }
    },
    'performance-analyzer': {
      ...baseConfig,
      agentId: 'performance-analyzer',
      bedrockConfig: {
        ...baseConfig.bedrockConfig,
        agentId: process.env.VITE_PERFORMANCE_AGENT_ID || 'PERFORMANCE_AGENT_ID'
      }
    },
    'audit-intelligence': {
      ...baseConfig,
      agentId: 'audit-intelligence',
      bedrockConfig: {
        ...baseConfig.bedrockConfig,
        agentId: process.env.VITE_AUDIT_AGENT_ID || 'AUDIT_AGENT_ID'
      }
    },
    'sustainability-advisor': {
      ...baseConfig,
      agentId: 'sustainability-advisor',
      bedrockConfig: {
        ...baseConfig.bedrockConfig,
        agentId: process.env.VITE_SUSTAINABILITY_AGENT_ID || 'SUSTAINABILITY_AGENT_ID'
      }
    },
    'financial-intelligence': {
      ...baseConfig,
      agentId: 'financial-intelligence',
      bedrockConfig: {
        ...baseConfig.bedrockConfig,
        agentId: process.env.VITE_FINANCIAL_AGENT_ID || 'FINANCIAL_AGENT_ID'
      }
    }
  };
}

// Mock configurations for development
function createMockAgentConfigs(): Record<AgentId, AgentConfig> {
  const mockConfig = {
    bedrockConfig: {
      region: 'us-east-1',
      agentId: 'MOCK_AGENT',
      agentAliasId: 'MOCK_ALIAS',
      modelId: 'mock-model'
    },
    capabilities: {
      maxConcurrentRequests: 5,
      timeoutMs: 10000,
      retryAttempts: 1,
      cacheTTL: 60,
      rateLimit: {
        requestsPerMinute: 30,
        requestsPerHour: 500,
        burstLimit: 5,
        cooldownMs: 500
      }
    },
    memory: {
      maxConversationLength: 20,
      memoryRetentionHours: 1,
      compressionEnabled: false,
      persistenceEnabled: false
    },
    performance: {
      enableCaching: true,
      cacheStrategy: 'lru' as const,
      maxCacheSize: 100,
      enableBatching: false,
      batchSize: 1,
      batchTimeoutMs: 100
    },
    security: {
      enableInputValidation: true,
      enableOutputSanitization: false,
      enableRateLimiting: false,
      enableAuditLogging: false,
      maxPromptLength: 5000,
      allowedDomains: ['*']
    },
    monitoring: {
      enableMetrics: false,
      enableTracing: false,
      metricsInterval: 30000,
      healthCheckInterval: 15000
    }
  };

  const agentIds: AgentId[] = [
    'compliance-monitor',
    'risk-predictor',
    'document-validator',
    'requirements-extractor',
    'communication-orchestrator',
    'workflow-automator',
    'performance-analyzer',
    'audit-intelligence',
    'sustainability-advisor',
    'financial-intelligence'
  ];

  const configs: Record<AgentId, AgentConfig> = {} as Record<AgentId, AgentConfig>;
  
  agentIds.forEach(agentId => {
    configs[agentId] = {
      ...mockConfig,
      agentId
    };
  });

  return configs;
}