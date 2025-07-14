import {
  MemoryConfig,
  ConversationMessage,
  AgentInvokeResponse,
  MemoryVariable
} from '../../types/agents';

/**
 * Memory management for agents
 */
export class AgentMemory {
  private config: MemoryConfig;
  private conversations: Map<string, ConversationMessage[]> = new Map();
  private variables: Map<string, MemoryVariable> = new Map();
  private responseCache: Map<string, CachedResponse> = new Map();

  constructor(config: MemoryConfig) {
    this.config = config;
    this.startCleanupTimer();
  }

  /**
   * Update conversation history
   */
  async updateConversation(conversationId: string, message: ConversationMessage): Promise<void> {
    let messages = this.conversations.get(conversationId) || [];
    
    // Add new message
    messages.push(message);
    
    // Trim conversation if too long
    if (messages.length > this.config.maxConversationLength) {
      messages = messages.slice(-this.config.maxConversationLength);
    }
    
    this.conversations.set(conversationId, messages);
    
    // Persist if enabled
    if (this.config.persistenceEnabled) {
      await this.persistConversation(conversationId, messages);
    }
  }

  /**
   * Get conversation history
   */
  getConversation(conversationId: string): ConversationMessage[] {
    return this.conversations.get(conversationId) || [];
  }

  /**
   * Set a memory variable
   */
  setVariable(key: string, value: any, type: string, source: string, ttl?: number): void {
    const variable: MemoryVariable = {
      key,
      value,
      type,
      source,
      timestamp: new Date(),
      ttl
    };
    
    this.variables.set(key, variable);
  }

  /**
   * Get a memory variable
   */
  getVariable(key: string): MemoryVariable | null {
    const variable = this.variables.get(key);
    
    if (!variable) {
      return null;
    }
    
    // Check if expired
    if (variable.ttl && Date.now() - variable.timestamp.getTime() > variable.ttl * 1000) {
      this.variables.delete(key);
      return null;
    }
    
    return variable;
  }

  /**
   * Cache a response
   */
  async setCachedResponse(cacheKey: string, response: AgentInvokeResponse, ttl: number): Promise<void> {
    const cached: CachedResponse = {
      response,
      timestamp: Date.now(),
      ttl: ttl * 1000 // Convert to milliseconds
    };
    
    this.responseCache.set(cacheKey, cached);
  }

  /**
   * Get cached response
   */
  async getCachedResponse(cacheKey: string): Promise<AgentInvokeResponse | null> {
    const cached = this.responseCache.get(cacheKey);
    
    if (!cached) {
      return null;
    }
    
    // Check if expired
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.responseCache.delete(cacheKey);
      return null;
    }
    
    return cached.response;
  }

  /**
   * Clear conversation history
   */
  clearConversation(conversationId: string): void {
    this.conversations.delete(conversationId);
  }

  /**
   * Clear all memory
   */
  clearAll(): void {
    this.conversations.clear();
    this.variables.clear();
    this.responseCache.clear();
  }

  /**
   * Get memory usage statistics
   */
  getMemoryStats(): MemoryStats {
    const conversationCount = this.conversations.size;
    const totalMessages = Array.from(this.conversations.values())
      .reduce((sum, messages) => sum + messages.length, 0);
    const variableCount = this.variables.size;
    const cacheCount = this.responseCache.size;
    
    return {
      conversationCount,
      totalMessages,
      variableCount,
      cacheCount,
      estimatedSizeMB: this.estimateMemorySize()
    };
  }

  /**
   * Health check for memory system
   */
  async healthCheck(): Promise<boolean> {
    try {
      // Check if memory operations are working
      const testKey = 'health_check_test';
      this.setVariable(testKey, 'test', 'string', 'health_check', 1);
      const retrieved = this.getVariable(testKey);
      
      return retrieved !== null && retrieved.value === 'test';
    } catch (error) {
      console.error('Memory health check failed:', error);
      return false;
    }
  }

  /**
   * Compress conversation history
   */
  async compressConversation(conversationId: string): Promise<void> {
    if (!this.config.compressionEnabled) {
      return;
    }

    const messages = this.conversations.get(conversationId);
    if (!messages || messages.length < 10) {
      return; // Not worth compressing
    }

    // Simple compression: keep first and last few messages, summarize middle
    const keepFirst = 3;
    const keepLast = 3;
    
    if (messages.length <= keepFirst + keepLast) {
      return;
    }

    const firstMessages = messages.slice(0, keepFirst);
    const lastMessages = messages.slice(-keepLast);
    const middleMessages = messages.slice(keepFirst, -keepLast);

    // Create summary message
    const summaryMessage: ConversationMessage = {
      id: `summary-${Date.now()}`,
      role: 'system',
      content: `[Conversation summary: ${middleMessages.length} messages compressed]`,
      timestamp: new Date(),
      metadata: { compressed: true, originalCount: middleMessages.length }
    };

    const compressedMessages = [...firstMessages, summaryMessage, ...lastMessages];
    this.conversations.set(conversationId, compressedMessages);
  }

  // ============================================
  // Private Methods
  // ============================================

  private startCleanupTimer(): void {
    // Clean up expired data every hour
    setInterval(() => {
      this.cleanupExpiredData();
    }, 60 * 60 * 1000);
  }

  private cleanupExpiredData(): void {
    const now = Date.now();
    const retentionMs = this.config.memoryRetentionHours * 60 * 60 * 1000;

    // Clean up old conversations
    for (const [conversationId, messages] of this.conversations.entries()) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && now - lastMessage.timestamp.getTime() > retentionMs) {
        this.conversations.delete(conversationId);
      }
    }

    // Clean up expired variables
    for (const [key, variable] of this.variables.entries()) {
      if (variable.ttl && now - variable.timestamp.getTime() > variable.ttl * 1000) {
        this.variables.delete(key);
      }
    }

    // Clean up expired cache
    for (const [key, cached] of this.responseCache.entries()) {
      if (now - cached.timestamp > cached.ttl) {
        this.responseCache.delete(key);
      }
    }
  }

  private async persistConversation(conversationId: string, messages: ConversationMessage[]): Promise<void> {
    // In a real implementation, this would persist to a database
    // For now, we'll just log that persistence would happen
    console.debug(`Would persist conversation ${conversationId} with ${messages.length} messages`);
  }

  private estimateMemorySize(): number {
    // Rough estimation of memory usage in MB
    let size = 0;
    
    // Estimate conversation size
    for (const messages of this.conversations.values()) {
      size += messages.length * 1000; // Rough estimate: 1KB per message
    }
    
    // Estimate variable size
    for (const variable of this.variables.values()) {
      size += JSON.stringify(variable).length;
    }
    
    // Estimate cache size
    for (const cached of this.responseCache.values()) {
      size += JSON.stringify(cached.response).length;
    }
    
    return size / (1024 * 1024); // Convert to MB
  }
}

// ============================================
// Supporting Types
// ============================================

interface CachedResponse {
  response: AgentInvokeResponse;
  timestamp: number;
  ttl: number;
}

export interface MemoryStats {
  conversationCount: number;
  totalMessages: number;
  variableCount: number;
  cacheCount: number;
  estimatedSizeMB: number;
}