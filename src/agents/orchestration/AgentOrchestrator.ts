import {
  AgentInvokeRequest,
  AgentInvokeResponse,
  AgentExecutionContext,
  WorkflowDefinition,
  WorkflowExecution,
  AgentId,
  WorkflowStatus
} from '../../types/agents';
import { AgentRegistry } from '../registry/AgentRegistry';
import { WorkflowEngine } from './WorkflowEngine';

/**
 * Central orchestrator for managing agent invocations and workflows
 */
export class AgentOrchestrator {
  private registry: AgentRegistry;
  private workflowEngine: WorkflowEngine;
  private executionQueue: Map<string, QueuedExecution> = new Map();
  private maxConcurrentExecutions: number = 10;

  constructor(registry: AgentRegistry) {
    this.registry = registry;
    this.workflowEngine = new WorkflowEngine(registry);
  }

  /**
   * Invoke a single agent
   */
  async invokeAgent(request: AgentInvokeRequest): Promise<AgentInvokeResponse> {
    try {
      // Get agent from registry
      const agent = this.registry.getAgent(request.agentId);
      
      // Execute agent
      const response = await agent.invoke(request);
      
      return response;
    } catch (error) {
      throw new Error(`Agent invocation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Execute a multi-agent workflow
   */
  async executeWorkflow(
    workflow: WorkflowDefinition,
    context: AgentExecutionContext
  ): Promise<WorkflowExecution> {
    // Check if we're at capacity
    if (this.executionQueue.size >= this.maxConcurrentExecutions) {
      throw new Error('Maximum concurrent executions reached. Please try again later.');
    }

    const executionId = this.generateExecutionId();
    const queuedExecution: QueuedExecution = {
      id: executionId,
      workflow,
      context,
      status: 'queued',
      queuedAt: new Date()
    };

    this.executionQueue.set(executionId, queuedExecution);

    try {
      queuedExecution.status = 'executing';
      queuedExecution.startedAt = new Date();

      const execution = await this.workflowEngine.executeWorkflow(workflow, context);
      
      queuedExecution.status = 'completed';
      queuedExecution.completedAt = new Date();
      
      return execution;
    } catch (error) {
      queuedExecution.status = 'failed';
      queuedExecution.error = error instanceof Error ? error.message : 'Unknown error';
      throw error;
    } finally {
      // Clean up after a delay
      setTimeout(() => {
        this.executionQueue.delete(executionId);
      }, 60000); // Keep for 1 minute for status queries
    }
  }

  /**
   * Get execution status
   */
  getExecutionStatus(executionId: string): QueuedExecution | null {
    return this.executionQueue.get(executionId) || null;
  }

  /**
   * Cancel an execution
   */
  async cancelExecution(executionId: string): Promise<boolean> {
    const queuedExecution = this.executionQueue.get(executionId);
    if (!queuedExecution) {
      return false;
    }

    if (queuedExecution.status === 'executing') {
      // Try to cancel the workflow
      const cancelled = await this.workflowEngine.cancelWorkflow(executionId);
      if (cancelled) {
        queuedExecution.status = 'cancelled';
        queuedExecution.completedAt = new Date();
      }
      return cancelled;
    } else if (queuedExecution.status === 'queued') {
      queuedExecution.status = 'cancelled';
      queuedExecution.completedAt = new Date();
      return true;
    }

    return false;
  }

  /**
   * Get orchestrator statistics
   */
  getStats(): OrchestratorStats {
    const executions = Array.from(this.executionQueue.values());
    
    return {
      totalExecutions: executions.length,
      queuedExecutions: executions.filter(e => e.status === 'queued').length,
      runningExecutions: executions.filter(e => e.status === 'executing').length,
      completedExecutions: executions.filter(e => e.status === 'completed').length,
      failedExecutions: executions.filter(e => e.status === 'failed').length,
      cancelledExecutions: executions.filter(e => e.status === 'cancelled').length,
      averageExecutionTime: this.calculateAverageExecutionTime(executions),
      agentUtilization: this.calculateAgentUtilization()
    };
  }

  /**
   * Health check for orchestrator
   */
  async healthCheck(): Promise<boolean> {
    try {
      // Check if registry is healthy
      const registryHealth = this.registry.getHealthStatus();
      const healthyAgents = Array.from(registryHealth.values()).filter(h => h).length;
      const totalAgents = registryHealth.size;
      
      // Consider healthy if at least 80% of agents are healthy
      const healthPercentage = totalAgents > 0 ? (healthyAgents / totalAgents) : 1;
      
      return healthPercentage >= 0.8;
    } catch (error) {
      console.error('Orchestrator health check failed:', error);
      return false;
    }
  }

  // Private methods
  private generateExecutionId(): string {
    return `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private calculateAverageExecutionTime(executions: QueuedExecution[]): number {
    const completedExecutions = executions.filter(e => 
      e.status === 'completed' && e.startedAt && e.completedAt
    );

    if (completedExecutions.length === 0) return 0;

    const totalTime = completedExecutions.reduce((sum, exec) => {
      const duration = exec.completedAt!.getTime() - exec.startedAt!.getTime();
      return sum + duration;
    }, 0);

    return totalTime / completedExecutions.length;
  }

  private calculateAgentUtilization(): Map<AgentId, number> {
    const utilization = new Map<AgentId, number>();
    
    // Get all agents from registry
    const allAgents = this.registry.getAllAgents();
    
    // Calculate utilization based on recent executions
    // This is a simplified calculation - in production, you'd want more sophisticated metrics
    for (const [agentId] of allAgents) {
      // For now, return a mock utilization percentage
      utilization.set(agentId, Math.random() * 100);
    }
    
    return utilization;
  }
}

// Supporting interfaces
interface QueuedExecution {
  id: string;
  workflow: WorkflowDefinition;
  context: AgentExecutionContext;
  status: 'queued' | 'executing' | 'completed' | 'failed' | 'cancelled';
  queuedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
}

interface OrchestratorStats {
  totalExecutions: number;
  queuedExecutions: number;
  runningExecutions: number;
  completedExecutions: number;
  failedExecutions: number;
  cancelledExecutions: number;
  averageExecutionTime: number;
  agentUtilization: Map<AgentId, number>;
}