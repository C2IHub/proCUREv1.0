import { RateLimitConfig, AgentId } from '../../types/agents';

interface RateLimitEntry {
  count: number;
  resetTime: number;
  lastRequest: number;
}

/**
 * Rate limiter for agent requests
 */
export class RateLimiter {
  private config: RateLimitConfig;
  private userLimits: Map<string, RateLimitEntry> = new Map();
  private agentLimits: Map<string, RateLimitEntry> = new Map();

  constructor(config: RateLimitConfig) {
    this.config = config;
    this.startCleanupTimer();
  }

  /**
   * Check if request is within rate limits
   */
  async checkLimit(agentId: AgentId, userId: string): Promise<void> {
    const now = Date.now();

    // Check user rate limit
    await this.checkUserLimit(userId, now);

    // Check agent-specific rate limit
    await this.checkAgentLimit(agentId, userId, now);
  }

  /**
   * Get current rate limit status for a user
   */
  getRateLimitStatus(userId: string): RateLimitStatus {
    const userEntry = this.userLimits.get(userId);
    const now = Date.now();

    if (!userEntry) {
      return {
        requestsRemaining: this.config.requestsPerMinute,
        resetTime: now + 60000,
        isLimited: false
      };
    }

    const isExpired = now >= userEntry.resetTime;
    if (isExpired) {
      return {
        requestsRemaining: this.config.requestsPerMinute,
        resetTime: now + 60000,
        isLimited: false
      };
    }

    const requestsRemaining = Math.max(0, this.config.requestsPerMinute - userEntry.count);
    return {
      requestsRemaining,
      resetTime: userEntry.resetTime,
      isLimited: requestsRemaining === 0
    };
  }

  /**
   * Health check for rate limiter
   */
  healthCheck(): boolean {
    try {
      // Simple health check - verify data structures are accessible
      const userCount = this.userLimits.size;
      const agentCount = this.agentLimits.size;
      return userCount >= 0 && agentCount >= 0;
    } catch (error) {
      console.error('Rate limiter health check failed:', error);
      return false;
    }
  }

  /**
   * Reset rate limits for a user
   */
  resetUserLimits(userId: string): void {
    this.userLimits.delete(userId);
  }

  /**
   * Get rate limit statistics
   */
  getStats(): RateLimitStats {
    const now = Date.now();
    let activeUsers = 0;
    let totalRequests = 0;

    for (const entry of this.userLimits.values()) {
      if (now < entry.resetTime) {
        activeUsers++;
        totalRequests += entry.count;
      }
    }

    return {
      activeUsers,
      totalRequests,
      averageRequestsPerUser: activeUsers > 0 ? totalRequests / activeUsers : 0
    };
  }

  // ============================================
  // Private Methods
  // ============================================

  private async checkUserLimit(userId: string, now: number): Promise<void> {
    const key = userId;
    let entry = this.userLimits.get(key);

    // Initialize or reset if expired
    if (!entry || now >= entry.resetTime) {
      entry = {
        count: 0,
        resetTime: now + 60000, // 1 minute window
        lastRequest: now
      };
      this.userLimits.set(key, entry);
    }

    // Check burst limit
    if (now - entry.lastRequest < this.config.cooldownMs && entry.count >= this.config.burstLimit) {
      throw new RateLimitError(
        `Burst limit exceeded. Please wait ${this.config.cooldownMs}ms between requests.`,
        'BURST_LIMIT_EXCEEDED',
        entry.resetTime
      );
    }

    // Check per-minute limit
    if (entry.count >= this.config.requestsPerMinute) {
      throw new RateLimitError(
        `Rate limit exceeded. ${this.config.requestsPerMinute} requests per minute allowed.`,
        'RATE_LIMIT_EXCEEDED',
        entry.resetTime
      );
    }

    // Update counters
    entry.count++;
    entry.lastRequest = now;
  }

  private async checkAgentLimit(agentId: AgentId, userId: string, now: number): Promise<void> {
    const key = `${agentId}:${userId}`;
    let entry = this.agentLimits.get(key);

    // Initialize or reset if expired
    if (!entry || now >= entry.resetTime) {
      entry = {
        count: 0,
        resetTime: now + 3600000, // 1 hour window
        lastRequest: now
      };
      this.agentLimits.set(key, entry);
    }

    // Check hourly limit
    if (entry.count >= this.config.requestsPerHour) {
      throw new RateLimitError(
        `Agent rate limit exceeded. ${this.config.requestsPerHour} requests per hour allowed for agent ${agentId}.`,
        'AGENT_RATE_LIMIT_EXCEEDED',
        entry.resetTime
      );
    }

    // Update counters
    entry.count++;
    entry.lastRequest = now;
  }

  private startCleanupTimer(): void {
    // Clean up expired entries every 5 minutes
    setInterval(() => {
      this.cleanupExpiredEntries();
    }, 5 * 60 * 1000);
  }

  private cleanupExpiredEntries(): void {
    const now = Date.now();

    // Clean up user limits
    for (const [key, entry] of this.userLimits.entries()) {
      if (now >= entry.resetTime) {
        this.userLimits.delete(key);
      }
    }

    // Clean up agent limits
    for (const [key, entry] of this.agentLimits.entries()) {
      if (now >= entry.resetTime) {
        this.agentLimits.delete(key);
      }
    }
  }
}

// ============================================
// Supporting Types and Classes
// ============================================

export class RateLimitError extends Error {
  constructor(
    message: string,
    public code: string,
    public resetTime: number
  ) {
    super(message);
    this.name = 'RateLimitError';
  }
}

export interface RateLimitStatus {
  requestsRemaining: number;
  resetTime: number;
  isLimited: boolean;
}

export interface RateLimitStats {
  activeUsers: number;
  totalRequests: number;
  averageRequestsPerUser: number;
}