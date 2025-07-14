import React, { createContext, useContext, ReactNode } from 'react';
import { 
  AgentInvokeRequest, 
  AgentInvokeResponse, 
  AgentId,
  AgentExecutionContext 
} from '../types/agents';
import { useAgentSystem } from './AgentSystemProvider';

/**
 * Legacy BedrockAgentProvider for backward compatibility
 * Now wraps the new AgentSystemProvider
 */
interface BedrockAgentContextValue {
  complianceAgent: LegacyAgentWrapper;
  riskAgent: LegacyAgentWrapper;
  documentAgent: LegacyAgentWrapper;
  isConfigured: boolean;
}

interface LegacyAgentWrapper {
  invoke: (request: LegacyAgentRequest) => Promise<AgentInvokeResponse>;
  agentId: string;
  status: 'available' | 'unavailable' | 'error';
}

interface LegacyAgentRequest {
  prompt: string;
  sessionId?: string;
  context?: Record<string, any>;
}

interface BedrockAgentProviderProps {
  children: ReactNode;
}

const BedrockAgentContext = createContext<BedrockAgentContextValue | null>(null);

/**
 * Legacy wrapper class for backward compatibility
 */
class LegacyAgentWrapper {
  constructor(
    private agentId: AgentId,
    private invokeAgent: (request: AgentInvokeRequest) => Promise<AgentInvokeResponse>
  ) {}

  status: 'available' | 'unavailable' | 'error' = 'available';

  async invoke(request: LegacyAgentRequest): Promise<AgentInvokeResponse> {
    // Convert legacy request to new format
    const agentRequest: AgentInvokeRequest = {
      agentId: this.agentId,
      prompt: request.prompt,
      context: this.createExecutionContext(request),
      parameters: {
        maxTokens: 2000,
        temperature: 0.7,
        includeReasoning: true
      }
    };

    return await this.invokeAgent(agentRequest);
  }

  private createExecutionContext(request: LegacyAgentRequest): AgentExecutionContext {
    return {
      sessionId: request.sessionId || `session-${Date.now()}`,
      conversationId: `conv-${Date.now()}`,
      userId: 'current-user',
      organizationId: 'current-org',
      userRole: 'compliance_manager',
      permissions: [
        { action: 'view_compliance_data', resource: '*' },
        { action: 'view_risk_data', resource: '*' }
      ],
      pageContext: 'dashboard',
      pageData: request.context,
      previousAgentOutputs: [],
      sharedMemory: {
        variables: new Map(),
        conversation: {
          messages: [],
          topics: [],
          sentiment: { score: 0, label: 'neutral' },
          keyInsights: []
        },
        artifacts: new Map(),
        metrics: new Map()
      },
      executionMetadata: {
        startTime: new Date(),
        requestId: `req-${Date.now()}`,
        traceId: `trace-${Date.now()}`
      },
      features: {
        useRealAgents: true,
        enableWorkflows: true,
        enableStreaming: false,
        enableCaching: true,
        enableMetrics: true,
        enableTracing: false,
        debugMode: false,
        agentFlags: {},
        workflowFlags: {}
      }
    };
  }
}

export function BedrockAgentProvider({ children }: BedrockAgentProviderProps) {
  const agentSystem = useAgentSystem();

  // Create legacy wrapper agents
  const complianceAgent = new LegacyAgentWrapper(
    'compliance-monitor',
    agentSystem.invokeAgent
  );

  const riskAgent = new LegacyAgentWrapper(
    'risk-predictor',
    agentSystem.invokeAgent
  );

  const documentAgent = new LegacyAgentWrapper(
    'document-validator',
    agentSystem.invokeAgent
  );

  const value: BedrockAgentContextValue = {
    complianceAgent,
    riskAgent,
    documentAgent,
    isConfigured: agentSystem.isInitialized
  };

  return (
    <BedrockAgentContext.Provider value={value}>
      {children}
    </BedrockAgentContext.Provider>
  );
}

export function useBedrockAgents() {
  const context = useContext(BedrockAgentContext);
  if (!context) {
    throw new Error('useBedrockAgents must be used within a BedrockAgentProvider');
  }
  return context;
}

// Individual agent hooks for convenience
export function useComplianceAgent() {
  const { complianceAgent } = useBedrockAgents();
  return complianceAgent;
}

export function useRiskAgent() {
  const { riskAgent } = useBedrockAgents();
  return riskAgent;
}

export function useDocumentAgent() {
  const { documentAgent } = useBedrockAgents();
  return documentAgent;
}

// Export the new agent system hook for direct access
export { useAgentSystem } from './AgentSystemProvider';