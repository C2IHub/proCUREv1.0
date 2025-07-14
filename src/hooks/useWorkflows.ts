import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  WorkflowDefinition, 
  WorkflowExecution, 
  AgentExecutionContext 
} from '../types/agents';
import { useAgentSystem } from '../context/AgentSystemProvider';
import { supplierOnboardingWorkflow, complianceReviewWorkflow } from '../agents/workflows/SupplierOnboardingWorkflow';

// Query keys for workflows
export const workflowQueryKeys = {
  executions: ['workflow-executions'] as const,
  execution: (id: string) => ['workflow-executions', id] as const,
  definitions: ['workflow-definitions'] as const,
  definition: (id: string) => ['workflow-definitions', id] as const,
};

/**
 * Hook to get available workflow definitions
 */
export function useWorkflowDefinitions() {
  return useQuery({
    queryKey: workflowQueryKeys.definitions,
    queryFn: async () => {
      // Return predefined workflows
      const workflows: WorkflowDefinition[] = [
        supplierOnboardingWorkflow,
        complianceReviewWorkflow
      ];
      return workflows;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to get a specific workflow definition
 */
export function useWorkflowDefinition(workflowId: string) {
  return useQuery({
    queryKey: workflowQueryKeys.definition(workflowId),
    queryFn: async () => {
      const workflows = [supplierOnboardingWorkflow, complianceReviewWorkflow];
      const workflow = workflows.find(w => w.id === workflowId);
      if (!workflow) {
        throw new Error(`Workflow ${workflowId} not found`);
      }
      return workflow;
    },
    enabled: !!workflowId,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to execute a workflow
 */
export function useExecuteWorkflow() {
  const queryClient = useQueryClient();
  const { executeWorkflow } = useAgentSystem();

  return useMutation({
    mutationFn: async ({ 
      workflow, 
      context 
    }: { 
      workflow: WorkflowDefinition; 
      context: AgentExecutionContext;
    }) => {
      return await executeWorkflow(workflow, context);
    },
    onSuccess: (execution) => {
      // Update executions cache
      queryClient.setQueryData(
        workflowQueryKeys.execution(execution.executionId), 
        execution
      );
      
      // Invalidate executions list
      queryClient.invalidateQueries({
        queryKey: workflowQueryKeys.executions
      });
    },
  });
}

/**
 * Hook to get workflow execution status
 */
export function useWorkflowExecution(executionId: string) {
  const { orchestrator } = useAgentSystem();

  return useQuery({
    queryKey: workflowQueryKeys.execution(executionId),
    queryFn: async () => {
      const execution = orchestrator.getExecutionStatus(executionId);
      if (!execution) {
        throw new Error(`Execution ${executionId} not found`);
      }
      return execution;
    },
    enabled: !!executionId,
    refetchInterval: (data) => {
      // Refetch every 2 seconds if execution is still running
      if (data?.status === 'executing' || data?.status === 'queued') {
        return 2000;
      }
      return false;
    },
  });
}

/**
 * Hook to cancel a workflow execution
 */
export function useCancelWorkflow() {
  const queryClient = useQueryClient();
  const { orchestrator } = useAgentSystem();

  return useMutation({
    mutationFn: async (executionId: string) => {
      return await orchestrator.cancelExecution(executionId);
    },
    onSuccess: (_, executionId) => {
      // Invalidate the specific execution query
      queryClient.invalidateQueries({
        queryKey: workflowQueryKeys.execution(executionId)
      });
    },
  });
}

/**
 * Hook to create execution context for workflows
 */
export function useCreateExecutionContext() {
  return (overrides: Partial<AgentExecutionContext> = {}): AgentExecutionContext => {
    const baseContext: AgentExecutionContext = {
      sessionId: `session-${Date.now()}`,
      conversationId: `conv-${Date.now()}`,
      userId: 'current-user',
      organizationId: 'current-org',
      userRole: 'compliance_manager',
      permissions: [
        { action: 'supplier_onboard', resource: '*' },
        { action: 'compliance_review', resource: '*' },
        { action: 'view_compliance_data', resource: '*' },
        { action: 'view_risk_data', resource: '*' }
      ],
      pageContext: 'dashboard',
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
      },
      ...overrides
    };

    return baseContext;
  };
}

/**
 * Hook for supplier onboarding workflow
 */
export function useSupplierOnboarding() {
  const executeWorkflow = useExecuteWorkflow();
  const createContext = useCreateExecutionContext();

  const startOnboarding = async (supplierData: {
    supplierId: string;
    supplierName: string;
    category: string;
    uploadedDocuments: any[];
    primaryContact: any;
  }) => {
    const context = createContext({
      pageContext: 'supplier-tracker',
      supplierContext: {
        supplierId: supplierData.supplierId,
        supplierName: supplierData.supplierName,
        riskLevel: 'medium',
        complianceStatus: 'pending',
        certifications: [],
        uploadedDocuments: supplierData.uploadedDocuments,
        primaryContact: supplierData.primaryContact
      }
    });

    return executeWorkflow.mutateAsync({
      workflow: supplierOnboardingWorkflow,
      context
    });
  };

  return {
    startOnboarding,
    isLoading: executeWorkflow.isPending,
    error: executeWorkflow.error,
    data: executeWorkflow.data
  };
}

/**
 * Hook for compliance review workflow
 */
export function useComplianceReview() {
  const executeWorkflow = useExecuteWorkflow();
  const createContext = useCreateExecutionContext();

  const startReview = async (supplierIds: string[], reviewType: 'monthly' | 'quarterly' | 'annual' = 'monthly') => {
    const context = createContext({
      pageContext: 'dashboard',
      pageData: {
        reviewType,
        supplierIds
      },
      supplierContext: {
        supplierId: 'multiple',
        supplierName: 'Multiple Suppliers',
        riskLevel: 'medium',
        complianceStatus: 'review_pending',
        certifications: []
      }
    });

    return executeWorkflow.mutateAsync({
      workflow: complianceReviewWorkflow,
      context
    });
  };

  return {
    startReview,
    isLoading: executeWorkflow.isPending,
    error: executeWorkflow.error,
    data: executeWorkflow.data
  };
}