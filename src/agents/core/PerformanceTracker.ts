import {
  AgentId,
  PerformanceMetrics,
  AgentError
} from '../../types/agents';

interface AgentMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalResponseTime: number;
  responseTimes: number[];
  errorCounts: Map<string, number>;
  lastUpdated: Date;
}

/**
 * Performance tracker for monitoring agent performance
 */
export class PerformanceTracker {
  private metrics: Map<AgentId, AgentMetrics> = new Map();
  private readonly maxResponseTimeHistory = 1000; // Keep last 1000 response times

  /**
   * Record performance metrics for an agent
   */
  recordMetrics(agentId: AgentId, metrics: PerformanceMetrics): void {
    const agentMetrics = this.getOrCreateMetrics(agentId);

    // Update counters
    agentMetrics.totalRequests++;
    agentMetrics.successfulRequests++;
    agentMetrics.totalResponseTime += metrics.responseTimeMs;

    // Update response time history
    agentMetrics.responseTimes.push(metrics.responseTimeMs);
    if (agentMetrics.responseTimes.length > this.maxResponseTimeHistory) {
      agentMetrics.responseTimes.shift();
    }

    agentMetrics.lastUpdated = new Date();
  }

  /**
   * Record an error for an agent
   */
  recordError(agentId: AgentId, error: AgentError): void {
    const agentMetrics = this.getOrCreateMetrics(agentId);

    agentMetrics.totalRequests++;
    agentMetrics.failedRequests++;

    // Track error types
    const errorCount = agentMetrics.errorCounts.get(error.code) || 0;
    agentMetrics.errorCounts.set(error.code, errorCount + 1);

    agentMetrics.lastUpdated = new Date();
  }

  /**
   * Get performance statistics for an agent
   */
  getAgentStats(agentId: AgentId): AgentPerformanceStats | null {
    const metrics = this.metrics.get(agentId);
    if (!metrics) {
      return null;
    }

    const averageResponseTime = metrics.successfulRequests > 0 
      ? metrics.totalResponseTime / metrics.successfulRequests 
      : 0;

    const successRate = metrics.totalRequests > 0 
      ? (metrics.successfulRequests / metrics.totalRequests) * 100 
      : 0;

    const errorRate = metrics.totalRequests > 0 
      ? (metrics.failedRequests / metrics.totalRequests) * 100 
      : 0;

    // Calculate percentiles
    const sortedTimes = [...metrics.responseTimes].sort((a, b) => a - b);
    const p50 = this.calculatePercentile(sortedTimes, 50);
    const p95 = this.calculatePercentile(sortedTimes, 95);
    const p99 = this.calculatePercentile(sortedTimes, 99);

    return {
      agentId,
      totalRequests: metrics.totalRequests,
      successfulRequests: metrics.successfulRequests,
      failedRequests: metrics.failedRequests,
      successRate,
      errorRate,
      averageResponseTime,
      p50ResponseTime: p50,
      p95ResponseTime: p95,
      p99ResponseTime: p99,
      errorBreakdown: Object.fromEntries(metrics.errorCounts),
      lastUpdated: metrics.lastUpdated
    };
  }

  /**
   * Get performance statistics for all agents
   */
  getAllAgentStats(): AgentPerformanceStats[] {
    const stats: AgentPerformanceStats[] = [];
    
    for (const agentId of this.metrics.keys()) {
      const agentStats = this.getAgentStats(agentId);
      if (agentStats) {
        stats.push(agentStats);
      }
    }

    return stats;
  }

  /**
   * Reset metrics for an agent
   */
  resetAgentMetrics(agentId: AgentId): void {
    this.metrics.delete(agentId);
  }

  /**
   * Reset all metrics
   */
  resetAllMetrics(): void {
    this.metrics.clear();
  }

  /**
   * Check if agent performance is healthy
   */
  isAgentHealthy(agentId: AgentId): boolean {
    const stats = this.getAgentStats(agentId);
    if (!stats) {
      return true; // No data yet, assume healthy
    }

    // Define health thresholds
    const maxErrorRate = 10; // 10%
    const maxAverageResponseTime = 30000; // 30 seconds
    const maxP95ResponseTime = 60000; // 60 seconds

    return stats.errorRate <= maxErrorRate &&
           stats.averageResponseTime <= maxAverageResponseTime &&
           stats.p95ResponseTime <= maxP95ResponseTime;
  }

  /**
   * Get performance alerts for an agent
   */
  getPerformanceAlerts(agentId: AgentId): PerformanceAlert[] {
    const stats = this.getAgentStats(agentId);
    if (!stats) {
      return [];
    }

    const alerts: PerformanceAlert[] = [];

    // High error rate alert
    if (stats.errorRate > 10) {
      alerts.push({
        type: 'high_error_rate',
        severity: stats.errorRate > 25 ? 'critical' : 'warning',
        message: `Error rate is ${stats.errorRate.toFixed(1)}%`,
        value: stats.errorRate,
        threshold: 10
      });
    }

    // High response time alert
    if (stats.averageResponseTime > 30000) {
      alerts.push({
        type: 'high_response_time',
        severity: stats.averageResponseTime > 60000 ? 'critical' : 'warning',
        message: `Average response time is ${stats.averageResponseTime.toFixed(0)}ms`,
        value: stats.averageResponseTime,
        threshold: 30000
      });
    }

    // P95 response time alert
    if (stats.p95ResponseTime > 60000) {
      alerts.push({
        type: 'high_p95_response_time',
        severity: 'warning',
        message: `P95 response time is ${stats.p95ResponseTime.toFixed(0)}ms`,
        value: stats.p95ResponseTime,
        threshold: 60000
      });
    }

    return alerts;
  }

  // ============================================
  // Private Methods
  // ============================================

  private getOrCreateMetrics(agentId: AgentId): AgentMetrics {
    let metrics = this.metrics.get(agentId);
    if (!metrics) {
      metrics = {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        totalResponseTime: 0,
        responseTimes: [],
        errorCounts: new Map(),
        lastUpdated: new Date()
      };
      this.metrics.set(agentId, metrics);
    }
    return metrics;
  }

  private calculatePercentile(sortedArray: number[], percentile: number): number {
    if (sortedArray.length === 0) return 0;
    
    const index = (percentile / 100) * (sortedArray.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    
    if (lower === upper) {
      return sortedArray[lower];
    }
    
    const weight = index - lower;
    return sortedArray[lower] * (1 - weight) + sortedArray[upper] * weight;
  }
}

// ============================================
// Supporting Types
// ============================================

export interface AgentPerformanceStats {
  agentId: AgentId;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  successRate: number;
  errorRate: number;
  averageResponseTime: number;
  p50ResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  errorBreakdown: Record<string, number>;
  lastUpdated: Date;
}

export interface PerformanceAlert {
  type: 'high_error_rate' | 'high_response_time' | 'high_p95_response_time';
  severity: 'warning' | 'critical';
  message: string;
  value: number;
  threshold: number;
}