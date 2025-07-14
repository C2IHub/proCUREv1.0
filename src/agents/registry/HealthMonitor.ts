import { AgentId } from '../../types/agents';
import { BaseAgent } from '../core/BaseAgent';

interface HealthStatus {
  isHealthy: boolean;
  lastCheck: Date;
  consecutiveFailures: number;
  lastError?: string;
}

/**
 * Health monitor for tracking agent health status
 */
export class HealthMonitor {
  private agents: Map<AgentId, BaseAgent> = new Map();
  private healthStatus: Map<AgentId, HealthStatus> = new Map();
  private checkInterval: number = 30000; // 30 seconds
  private maxConsecutiveFailures: number = 3;
  private intervalId?: NodeJS.Timeout;
  private isRunning: boolean = false;

  constructor(checkInterval: number = 30000) {
    this.checkInterval = checkInterval;
    this.start();
  }

  /**
   * Register an agent for health monitoring
   */
  registerAgent(agentId: AgentId, agent: BaseAgent): void {
    this.agents.set(agentId, agent);
    this.healthStatus.set(agentId, {
      isHealthy: true,
      lastCheck: new Date(),
      consecutiveFailures: 0
    });
    
    console.log(`Health monitor: Registered agent ${agentId}`);
  }

  /**
   * Unregister an agent from health monitoring
   */
  unregisterAgent(agentId: AgentId): void {
    this.agents.delete(agentId);
    this.healthStatus.delete(agentId);
    
    console.log(`Health monitor: Unregistered agent ${agentId}`);
  }

  /**
   * Check if an agent is healthy
   */
  isHealthy(agentId: AgentId): boolean {
    const status = this.healthStatus.get(agentId);
    return status?.isHealthy ?? false;
  }

  /**
   * Get health status for all agents
   */
  getAllHealthStatus(): Map<AgentId, boolean> {
    const status = new Map<AgentId, boolean>();
    for (const [agentId, healthStatus] of this.healthStatus.entries()) {
      status.set(agentId, healthStatus.isHealthy);
    }
    return status;
  }

  /**
   * Get detailed health information for an agent
   */
  getDetailedHealth(agentId: AgentId): HealthStatus | null {
    return this.healthStatus.get(agentId) || null;
  }

  /**
   * Force a health check for a specific agent
   */
  async checkAgentHealth(agentId: AgentId): Promise<boolean> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      console.warn(`Health monitor: Agent ${agentId} not found for health check`);
      return false;
    }

    try {
      const isHealthy = await agent.healthCheck();
      this.updateHealthStatus(agentId, isHealthy);
      return isHealthy;
    } catch (error) {
      console.error(`Health monitor: Health check failed for agent ${agentId}:`, error);
      this.updateHealthStatus(agentId, false, error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }

  /**
   * Force health check for all agents
   */
  async checkAllAgents(): Promise<Map<AgentId, boolean>> {
    const results = new Map<AgentId, boolean>();
    
    const checkPromises = Array.from(this.agents.keys()).map(async (agentId) => {
      const isHealthy = await this.checkAgentHealth(agentId);
      results.set(agentId, isHealthy);
      return { agentId, isHealthy };
    });

    await Promise.all(checkPromises);
    return results;
  }

  /**
   * Get health summary
   */
  getHealthSummary(): HealthSummary {
    const totalAgents = this.agents.size;
    let healthyAgents = 0;
    let unhealthyAgents = 0;
    const unhealthyAgentsList: AgentId[] = [];

    for (const [agentId, status] of this.healthStatus.entries()) {
      if (status.isHealthy) {
        healthyAgents++;
      } else {
        unhealthyAgents++;
        unhealthyAgentsList.push(agentId);
      }
    }

    return {
      totalAgents,
      healthyAgents,
      unhealthyAgents,
      healthyPercentage: totalAgents > 0 ? (healthyAgents / totalAgents) * 100 : 0,
      unhealthyAgentsList,
      lastCheck: new Date()
    };
  }

  /**
   * Start health monitoring
   */
  start(): void {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.intervalId = setInterval(() => {
      this.performHealthChecks();
    }, this.checkInterval);

    console.log(`Health monitor: Started with ${this.checkInterval}ms interval`);
  }

  /**
   * Stop health monitoring
   */
  stop(): void {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }

    console.log('Health monitor: Stopped');
  }

  /**
   * Set health check interval
   */
  setCheckInterval(intervalMs: number): void {
    this.checkInterval = intervalMs;
    
    if (this.isRunning) {
      this.stop();
      this.start();
    }
  }

  // ============================================
  // Private Methods
  // ============================================

  private async performHealthChecks(): Promise<void> {
    if (this.agents.size === 0) {
      return;
    }

    console.debug(`Health monitor: Checking ${this.agents.size} agents...`);
    
    try {
      await this.checkAllAgents();
      
      const summary = this.getHealthSummary();
      if (summary.unhealthyAgents > 0) {
        console.warn(`Health monitor: ${summary.unhealthyAgents} unhealthy agents: ${summary.unhealthyAgentsList.join(', ')}`);
      }
    } catch (error) {
      console.error('Health monitor: Error during health checks:', error);
    }
  }

  private updateHealthStatus(agentId: AgentId, isHealthy: boolean, error?: string): void {
    const currentStatus = this.healthStatus.get(agentId);
    if (!currentStatus) {
      return;
    }

    const newStatus: HealthStatus = {
      isHealthy,
      lastCheck: new Date(),
      consecutiveFailures: isHealthy ? 0 : currentStatus.consecutiveFailures + 1,
      lastError: error
    };

    // Mark as unhealthy if too many consecutive failures
    if (newStatus.consecutiveFailures >= this.maxConsecutiveFailures) {
      newStatus.isHealthy = false;
    }

    this.healthStatus.set(agentId, newStatus);

    // Log status changes
    if (currentStatus.isHealthy !== newStatus.isHealthy) {
      if (newStatus.isHealthy) {
        console.log(`✅ Agent ${agentId} is now healthy`);
      } else {
        console.warn(`❌ Agent ${agentId} is now unhealthy (${newStatus.consecutiveFailures} consecutive failures)`);
        if (error) {
          console.warn(`   Error: ${error}`);
        }
      }
    }
  }
}

// ============================================
// Supporting Types
// ============================================

export interface HealthSummary {
  totalAgents: number;
  healthyAgents: number;
  unhealthyAgents: number;
  healthyPercentage: number;
  unhealthyAgentsList: AgentId[];
  lastCheck: Date;
}