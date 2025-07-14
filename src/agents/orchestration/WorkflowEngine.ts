import {
  WorkflowDefinition,
  WorkflowExecution,
  WorkflowStep,
  StepExecution,
  AgentExecutionContext,
  CoordinationPattern,
  WorkflowStatus,
  StepStatus,
  AgentId,
  SharedMemory,
  ExecutionMetadata
} from '../../types/agents';
import { AgentRegistry } from '../registry/AgentRegistry';
import { BaseAgent } from '../core/BaseAgent';

/**
 * Workflow Engine for orchestrating multi-agent workflows
 */
export class WorkflowEngine {
  private registry: AgentRegistry;
  private activeExecutions: Map<string, WorkflowExecution> = new Map();
  private strategies: Map<CoordinationPattern, WorkflowStrategy> = new Map();

  constructor(registry: AgentRegistry) {
    this.registry = registry;
    this.initializeStrategies();
  }

  /**
   * Execute a workflow with the specified coordination pattern
   */
  async executeWorkflow(
    workflow: WorkflowDefinition,
    context: AgentExecutionContext
  ): Promise<WorkflowExecution> {
    const executionId = this.generateExecutionId();
    const execution = this.createExecution(workflow, executionId, context);
    
    this.activeExecutions.set(executionId, execution);

    try {
      // Get coordination strategy
      const strategy = this.strategies.get(workflow.coordinationPattern);
      if (!strategy) {
        throw new Error(`Unsupported coordination pattern: ${workflow.coordinationPattern}`);
      }

      // Execute workflow with selected strategy
      const result = await strategy.execute(workflow, execution, context);
      
      // Update execution status
      execution.status = 'completed';
      execution.timeline.endTime = new Date();
      
      return result;
    } catch (error) {
      execution.status = 'failed';
      execution.errorDetails = {
        code: 'WORKFLOW_EXECUTION_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
        severity: 'high',
        category: 'system'
      };
      throw error;
    } finally {
      this.activeExecutions.delete(executionId);
    }
  }

  /**
   * Get execution status
   */
  getExecution(executionId: string): WorkflowExecution | null {
    return this.activeExecutions.get(executionId) || null;
  }

  /**
   * Cancel a running workflow
   */
  async cancelWorkflow(executionId: string): Promise<boolean> {
    const execution = this.activeExecutions.get(executionId);
    if (!execution) {
      return false;
    }

    execution.status = 'cancelled';
    execution.timeline.endTime = new Date();
    
    // Cancel any running steps
    for (const step of execution.steps) {
      if (step.status === 'running') {
        step.status = 'skipped';
        step.endTime = new Date();
      }
    }

    return true;
  }

  /**
   * Get all active executions
   */
  getActiveExecutions(): WorkflowExecution[] {
    return Array.from(this.activeExecutions.values());
  }

  // Private methods
  private initializeStrategies(): void {
    this.strategies.set('sequential', new SequentialWorkflowStrategy(this.registry));
    this.strategies.set('parallel', new ParallelWorkflowStrategy(this.registry));
    this.strategies.set('conditional', new ConditionalWorkflowStrategy(this.registry));
    this.strategies.set('event-driven', new EventDrivenWorkflowStrategy(this.registry));
  }

  private createExecution(
    workflow: WorkflowDefinition,
    executionId: string,
    context: AgentExecutionContext
  ): WorkflowExecution {
    return {
      workflowId: workflow.id,
      executionId,
      status: 'initializing',
      currentStep: 0,
      steps: workflow.steps.map(step => this.createStepExecution(step)),
      sharedContext: {
        variables: new Map(),
        conversation: {
          messages: [],
          topics: [],
          sentiment: { score: 0, label: 'neutral' },
          sentiment: { score: 0, label: 'neutral' },
          keyInsights: []
        },
        artifacts: new Map(),
        metrics: new Map()
      },
      timeline: {
        startTime: new Date(),
        estimatedDuration: workflow.timeout,
        milestones: []
      },
      cost: {
        totalCost: 0,
        stepCosts: new Map(),
        currency: 'USD'
      },
      performance: {
        totalDurationMs: 0,
        stepDurations: new Map(),
        parallelizationEfficiency: 0,
        resourceUtilization: {
          avgCpuPercent: 0,
          avgMemoryMB: 0,
          peakMemoryMB: 0
        },
        bottlenecks: []
      }
    };
  }

  private createStepExecution(step: WorkflowStep): StepExecution {
    return {
      stepId: step.stepId,
      agentId: step.agentId,
      status: 'pending',
      input: {},
      startTime: new Date(),
      attempts: 0,
      cost: {
        tokenCost: 0,
        computeCost: 0,
        totalCost: 0,
        currency: 'USD'
      },
      performance: {
        responseTimeMs: 0,
        tokenUsage: {
          inputTokens: 0,
          outputTokens: 0,
          totalTokens: 0
        },
        memoryUsageMB: 0
      },
      logs: []
    };
  }

  private generateExecutionId(): string {
    return `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Base class for workflow coordination strategies
 */
abstract class WorkflowStrategy {
  protected registry: AgentRegistry;

  constructor(registry: AgentRegistry) {
    this.registry = registry;
  }

  abstract execute(
    workflow: WorkflowDefinition,
    execution: WorkflowExecution,
    context: AgentExecutionContext
  ): Promise<WorkflowExecution>;

  protected async executeStep(
    step: WorkflowStep,
    stepExecution: StepExecution,
    context: AgentExecutionContext,
    sharedMemory: SharedMemory
  ): Promise<void> {
    stepExecution.status = 'running';
    stepExecution.startTime = new Date();

    try {
      // Get agent
      const agent = this.registry.getAgent(step.agentId);
      
      // Prepare input
      const input = this.prepareStepInput(step, context, sharedMemory);
      stepExecution.input = input;

      // Execute agent
      const response = await agent.invoke({
        agentId: step.agentId,
        prompt: input.prompt || context.pageData?.prompt || 'Execute workflow step',
        context: {
          ...context,
          sharedMemory,
          executionMetadata: {
            ...context.executionMetadata,
            stepId: step.stepId
          }
        },
        parameters: input.parameters
      });

      // Store output
      stepExecution.output = response;
      stepExecution.status = 'completed';
      stepExecution.endTime = new Date();
      stepExecution.duration = stepExecution.endTime.getTime() - stepExecution.startTime.getTime();

      // Update shared memory
      this.updateSharedMemory(step, response, sharedMemory);

      // Log success
      stepExecution.logs.push({
        timestamp: new Date(),
        level: 'info',
        message: `Step ${step.stepId} completed successfully`,
        data: { confidence: response.confidence }
      });

    } catch (error) {
      stepExecution.status = 'failed';
      stepExecution.endTime = new Date();
      stepExecution.errorDetails = {
        code: 'STEP_EXECUTION_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
        severity: 'high',
        category: 'execution'
      };

      // Log error
      stepExecution.logs.push({
        timestamp: new Date(),
        level: 'error',
        message: `Step ${step.stepId} failed: ${stepExecution.errorDetails.message}`,
        data: { error: stepExecution.errorDetails }
      });

      throw error;
    }
  }

  private prepareStepInput(
    step: WorkflowStep,
    context: AgentExecutionContext,
    sharedMemory: SharedMemory
  ): any {
    const input: any = {};

    // Apply input mappings
    if (step.inputMapping) {
      for (const [key, mapping] of Object.entries(step.inputMapping.mappings)) {
        let value;

        switch (step.inputMapping.source) {
          case 'context':
            value = this.getValueFromPath(context, mapping.path);
            break;
          case 'sharedMemory':
            value = sharedMemory.variables.get(mapping.path)?.value;
            break;
          case 'static':
            value = mapping.default;
            break;
          default:
            value = mapping.default;
        }

        if (value !== undefined) {
          input[key] = mapping.transform ? mapping.transform(value) : value;
        } else if (mapping.required) {
          throw new Error(`Required input ${key} not found for step ${step.stepId}`);
        } else if (mapping.default !== undefined) {
          input[key] = mapping.default;
        }
      }
    }

    return input;
  }

  private updateSharedMemory(
    step: WorkflowStep,
    response: any,
    sharedMemory: SharedMemory
  ): void {
    if (step.outputMapping) {
      for (const [key, mapping] of Object.entries(step.outputMapping.mappings)) {
        const value = this.getValueFromPath(response, mapping.path);
        
        if (value !== undefined) {
          const transformedValue = mapping.transform ? mapping.transform(value) : value;
          
          switch (step.outputMapping.destination) {
            case 'sharedMemory':
              sharedMemory.variables.set(key, {
                key,
                value: transformedValue,
                type: typeof transformedValue,
                source: step.agentId,
                timestamp: new Date()
              });
              break;
          }
        }
      }
    }
  }

  private getValueFromPath(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
}

/**
 * Sequential workflow strategy - executes steps one after another
 */
class SequentialWorkflowStrategy extends WorkflowStrategy {
  async execute(
    workflow: WorkflowDefinition,
    execution: WorkflowExecution,
    context: AgentExecutionContext
  ): Promise<WorkflowExecution> {
    execution.status = 'running';

    for (let i = 0; i < workflow.steps.length; i++) {
      const step = workflow.steps[i];
      const stepExecution = execution.steps[i];
      
      execution.currentStep = i;

      // Check dependencies
      if (step.dependencies) {
        for (const depStepId of step.dependencies) {
          const depStep = execution.steps.find(s => s.stepId === depStepId);
          if (!depStep || depStep.status !== 'completed') {
            throw new Error(`Dependency ${depStepId} not completed for step ${step.stepId}`);
          }
        }
      }

      // Execute step
      await this.executeStep(step, stepExecution, context, execution.sharedContext);
    }

    return execution;
  }
}

/**
 * Parallel workflow strategy - executes independent steps concurrently
 */
class ParallelWorkflowStrategy extends WorkflowStrategy {
  async execute(
    workflow: WorkflowDefinition,
    execution: WorkflowExecution,
    context: AgentExecutionContext
  ): Promise<WorkflowExecution> {
    execution.status = 'running';

    // Group steps by dependencies
    const stepGroups = this.groupStepsByDependencies(workflow.steps);
    
    // Execute groups sequentially, steps within groups in parallel
    for (const group of stepGroups) {
      const promises = group.map(async (step) => {
        const stepExecution = execution.steps.find(s => s.stepId === step.stepId)!;
        await this.executeStep(step, stepExecution, context, execution.sharedContext);
      });

      await Promise.all(promises);
    }

    return execution;
  }

  private groupStepsByDependencies(steps: WorkflowStep[]): WorkflowStep[][] {
    const groups: WorkflowStep[][] = [];
    const processed = new Set<string>();
    
    while (processed.size < steps.length) {
      const currentGroup: WorkflowStep[] = [];
      
      for (const step of steps) {
        if (processed.has(step.stepId)) continue;
        
        // Check if all dependencies are processed
        const canExecute = !step.dependencies || 
          step.dependencies.every(dep => processed.has(dep));
        
        if (canExecute) {
          currentGroup.push(step);
          processed.add(step.stepId);
        }
      }
      
      if (currentGroup.length === 0) {
        throw new Error('Circular dependency detected in workflow steps');
      }
      
      groups.push(currentGroup);
    }
    
    return groups;
  }
}

/**
 * Conditional workflow strategy - executes steps based on conditions
 */
class ConditionalWorkflowStrategy extends WorkflowStrategy {
  async execute(
    workflow: WorkflowDefinition,
    execution: WorkflowExecution,
    context: AgentExecutionContext
  ): Promise<WorkflowExecution> {
    execution.status = 'running';

    for (let i = 0; i < workflow.steps.length; i++) {
      const step = workflow.steps[i];
      const stepExecution = execution.steps[i];
      
      execution.currentStep = i;

      // Evaluate conditions
      if (step.conditions) {
        const shouldExecute = this.evaluateConditions(step.conditions, execution.sharedContext);
        if (!shouldExecute) {
          stepExecution.status = 'skipped';
          continue;
        }
      }

      // Execute step
      await this.executeStep(step, stepExecution, context, execution.sharedContext);
    }

    return execution;
  }

  private evaluateConditions(conditions: any[], sharedMemory: SharedMemory): boolean {
    // Simple condition evaluation - can be enhanced
    return conditions.every(condition => {
      // Implement condition evaluation logic
      return true; // Placeholder
    });
  }
}

/**
 * Event-driven workflow strategy - executes steps based on events
 */
class EventDrivenWorkflowStrategy extends WorkflowStrategy {
  async execute(
    workflow: WorkflowDefinition,
    execution: WorkflowExecution,
    context: AgentExecutionContext
  ): Promise<WorkflowExecution> {
    execution.status = 'running';

    // For now, implement as sequential with event logging
    // Can be enhanced to support true event-driven execution
    for (let i = 0; i < workflow.steps.length; i++) {
      const step = workflow.steps[i];
      const stepExecution = execution.steps[i];
      
      execution.currentStep = i;

      // Execute step
      await this.executeStep(step, stepExecution, context, execution.sharedContext);
      
      // Emit step completion event
      this.emitStepEvent(step.stepId, 'completed', stepExecution.output);
    }

    return execution;
  }

  private emitStepEvent(stepId: string, event: string, data: any): void {
    // Implement event emission logic
    console.log(`Event: ${event} for step ${stepId}`, data);
  }
}
