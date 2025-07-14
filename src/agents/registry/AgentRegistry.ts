import {
  AgentId,
  BaseAgentCapabilities,
  AgentConfig
} from '../../types/agents';
import { BaseAgent } from '../core/BaseAgent';
import { HealthMonitor } from './HealthMonitor';
import { AgentFactory } from './AgentFactory';

/**
 * Central registry for managing all agents in the system
 */
export class AgentRegistry {
  private agents: Map<AgentId, BaseAgent> = new Map();
  private capabilities: Map<AgentId, BaseAgentCapabilities> = new Map();
  private healthMonitor: HealthMonitor;
  private agentFactory: AgentFactory;
  private configs: Map<AgentId, AgentConfig> = new Map();

  constructor(configs: Record<AgentId, AgentConfig>) {
    this.agentFactory = new AgentFactory();
    this.healthMonitor = new HealthMonitor();
    this.initializeAgents(configs);
  }

  /**
   * Initialize all agents from configuration
   */
  private initializeAgents(configs: Record<AgentId, AgentConfig>): void {
    for (const [agentId, config] of Object.entries(configs) as [AgentId, AgentConfig][]) {
      try {
        const agent = this.agentFactory.createAgent(config);
        this.registerAgent(agentId, agent, config);
        console.log(`✅ Initialized agent: ${agentId}`);
      } catch (error) {
        console.error(`❌ Failed to initialize agent ${agentId}:`, error);
      }
    }
  }

  /**
   * Register a new agent
   */
  registerAgent(agentId: AgentId, agent: BaseAgent, config: AgentConfig): void {
    this.agents.set(agentId, agent);
    this.capabilities.set(agentId, agent.getCapabilities());
    this.configs.set(agentId, config);
    this.healthMonitor.registerAgent(agentId, agent);
    
    console.log(`Registered agent: ${agentId} with capabilities: ${agent.getCapabilities().capabilities.join(', ')}`);
  }

  /**
   * Get an agent by ID
   */
  getAgent(agentId: AgentId): BaseAgent {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new AgentNotFoundException(`Agent ${agentId} not found in registry`);
    }

    if (!this.healthMonitor.isHealthy(agentId)) {
      throw new AgentUnhealthyException(`Agent ${agentId} is currently unhealthy`);
    }

    return agent;
  }

  /**
   * Get all registered agents
   */
  getAllAgents(): Map<AgentId, BaseAgent> {
    return new Map(this.agents);
  }

  /**
   * Get agents that have a specific capability
   */
  getAgentsForCapability(capability: string): AgentId[] {
    const matchingAgents: AgentId[] = [];
    
    for (const [agentId, caps] of this.capabilities.entries()) {
      if (caps.capabilities.includes(capability)) {
        matchingAgents.push(agentId);
      }
    }
    
    return matchingAgents;
  }

  /**
   * Get agents that support a specific workflow
   */
  getAgentsForWorkflow(workflowId: string): AgentId[] {
    const matchingAgents: AgentId[] = [];
    
    for (const [agentId, caps] of this.capabilities.entries()) {
      if (caps.supportedWorkflows.includes(workflowId)) {
        matchingAgents.push(agentId);
      }
    }
    
    return matchingAgents;
  }

  /**
   * Get agent capabilities
   */
  getAgentCapabilities(agentId: AgentId): BaseAgentCapabilities | null {
    return this.capabilities.get(agentId) || null;
  }

  /**
   * Get all agent capabilities
   */
  getAllCapabilities(): Map<AgentId, BaseAgentCapabilities> {
    return new Map(this.capabilities);
  }

  /**
   * Check if an agent is registered
   */
  hasAgent(agentId: AgentId): boolean {
    return this.agents.has(agentId);
  }

  /**
   * Check if an agent is healthy
   */
  isAgentHealthy(agentId: AgentId): boolean {
    return this.healthMonitor.isHealthy(agentId);
  }

  /**
   * Get health status for all agents
   */
  getHealthStatus(): Map<AgentId, boolean> {
    return this.healthMonitor.getAllHealthStatus();
  }

  /**
   * Unregister an agent
   */
  unregisterAgent(agentId: AgentId): void {
    this.agents.delete(agentId);
    this.capabilities.delete(agentId);
    this.configs.delete(agentId);
    this.healthMonitor.unregisterAgent(agentId);
    
    console.log(`Unregistered agent: ${agentId}`);
  }

  /**
   * Reload an agent with new configuration
   */
  reloadAgent(agentId: AgentId, newConfig: AgentConfig): void {
    // Unregister existing agent
    this.unregisterAgent(agentId);
    
    // Create and register new agent
    try {
      const agent = this.agentFactory.createAgent(newConfig);
      this.registerAgent(agentId, agent, newConfig);
      console.log(`✅ Reloaded agent: ${agentId}`);
    } catch (error) {
      console.error(`❌ Failed to reload agent ${agentId}:`, error);
      throw error;
    }
  }

  /**
   * Get registry statistics
   */
  getStats(): RegistryStats {
    const totalAgents = this.agents.size;
    const healthyAgents = Array.from(this.agents.keys())
      .filter(agentId => this.healthMonitor.isHealthy(agentId)).length;
    
    const capabilityCount = new Map<string, number>();
    for (const caps of this.capabilities.values()) {
      for (const capability of caps.capabilities) {
        capabilityCount.set(capability, (capabilityCount.get(capability) || 0) + 1);
      }
    }

    return {
      totalAgents,
      healthyAgents,
      unhealthyAgents: totalAgents - healthyAgents,
      capabilityDistribution: Object.fromEntries(capabilityCount),
      lastUpdated: new Date()
    };
  }

  /**
   * Validate agent dependencies
   */
  validateDependencies(): DependencyValidationResult {
    const issues: string[] = [];
    const resolved: AgentId[] = [];
    const unresolved: AgentId[] = [];

    for (const [agentId, capabilities] of this.capabilities.entries()) {
      let hasUnresolvedDependencies = false;
      
      for (const dependency of capabilities.dependencies) {
        if (!this.hasAgent(dependency)) {
          issues.push(`Agent ${agentId} depends on ${dependency} which is not registered`);
          hasUnresolvedDependencies = true;
        } else if (!this.isAgentHealthy(dependency)) {
          issues.push(`Agent ${agentId} depends on ${dependency} which is unhealthy`);
          hasUnresolvedDependencies = true;
        }
      }
      
      if (hasUnresolvedDependencies) {
        unresolved.push(agentId);
      } else {
        resolved.push(agentId);
      }
    }

    return {
      isValid: issues.length === 0,
      issues,
      resolvedAgents: resolved,
      unresolvedAgents: unresolved
    };
  }

  /**
   * Shutdown all agents
   */
  async shutdown(): Promise<void> {
    console.log('Shutting down agent registry...');
    
    // Stop health monitoring
    this.healthMonitor.stop();
    
    // Clear all agents
    this.agents.clear();
    this.capabilities.clear();
    this.configs.clear();
    
    console.log('Agent registry shutdown complete');
  }
}

// ============================================
// Supporting Types and Classes
// ============================================

export class AgentNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AgentNotFoundException';
  }
}

export class AgentUnhealthyException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AgentUnhealthyException';
  }
}

export interface RegistryStats {
  totalAgents: number;
  healthyAgents: number;
  unhealthyAgents: number;
  capabilityDistribution: Record<string, number>;
  lastUpdated: Date;
}

export interface DependencyValidationResult {
  isValid: boolean;
  issues: string[];
  resolvedAgents: AgentId[];
  unresolvedAgents: AgentId[];
}