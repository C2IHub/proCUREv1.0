import { BedrockAgentRuntime } from '@aws-sdk/client-bedrock-agent-runtime';
import {
  AgentId,
  AgentInvokeRequest,
  AgentInvokeResponse,
  AgentConfig,
  BaseAgentCapabilities,
  ValidationResult,
  SecurityValidationResult,
  AgentError,
  PerformanceMetrics,
  ExecutionCost
} from '../../types/agents';
import { SecurityValidator } from './SecurityValidator';
import { PerformanceTracker } from './PerformanceTracker';
import { AgentMemory } from './AgentMemory';
import { RateLimiter } from './RateLimiter';

/**
 * Abstract base class for all AI agents in the proCURE system.
 * Implements the Template Method pattern for consistent agent behavior.
 */
export abstract class BaseAgent {
  protected client: BedrockAgentRuntime;
  protected config: AgentConfig;
  protected capabilities: BaseAgentCapabilities;
  protected memory: AgentMemory;
  protected performanceTracker: PerformanceTracker;
  protected securityValidator: SecurityValidator;
  protected rateLimiter: RateLimiter;

  constructor(config: AgentConfig) {
    this.config = config;
    this.initializeClient();
    this.initializeComponents();
    this.capabilities = this.defineCapabilities();
  }

  /**
   * Main entry point for agent invocation.
   * Implements the Template Method pattern.
   */
  async invoke(request: AgentInvokeRequest): Promise<AgentInvokeResponse> {
    const startTime = Date.now();
    const traceId = this.generateTraceId();

    try {
      // 1. Validate security
      const securityResult = await this.validateSecurity(request);
      if (!securityResult.isValid) {
        throw this.createSecurityError(securityResult);
      }

      // 2. Check rate limits
      await this.rateLimiter.checkLimit(request.agentId, request.context.userId);

      // 3. Validate input
      const validationResult = await this.validateInput(request);
      if (!validationResult.isValid) {
        throw this.createValidationError(validationResult);
      }

      // 4. Check cache
      if (request.options?.cacheEnabled !== false) {
        const cachedResponse = await this.checkCache(request);
        if (cachedResponse) {
          return this.enrichCachedResponse(cachedResponse, traceId);
        }
      }

      // 5. Build prompt
      const prompt = await this.buildPrompt(request);

      // 6. Execute with retry
      const response = await this.executeWithRetry(
        () => this.invokeBedrockAgent(prompt, request),
        this.config.capabilities.retryAttempts
      );

      // 7. Parse response
      const parsedResponse = await this.parseResponse(response, request);

      // 8. Update memory
      await this.updateMemory(request.context, parsedResponse);

      // 9. Cache response
      if (request.options?.cacheEnabled !== false) {
        await this.cacheResponse(request, parsedResponse);
      }

      // 10. Track performance
      const performance = this.trackPerformance(startTime, parsedResponse);
      parsedResponse.performance = performance;

      // 11. Calculate cost
      parsedResponse.cost = this.calculateCost(parsedResponse);

      return parsedResponse;

    } catch (error) {
      const agentError = this.handleError(error, request, traceId);
      this.performanceTracker.recordError(request.agentId, agentError);
      throw agentError;
    }
  }

  /**
   * Get agent capabilities
   */
  getCapabilities(): BaseAgentCapabilities {
    return this.capabilities;
  }

  /**
   * Check if agent is healthy
   */
  async healthCheck(): Promise<boolean> {
    try {
      // Perform basic health checks
      const memoryHealth = await this.memory.healthCheck();
      const rateLimiterHealth = this.rateLimiter.healthCheck();
      const clientHealth = await this.checkBedrockConnection();

      return memoryHealth && rateLimiterHealth && clientHealth;
    } catch (error) {
      console.error(`Health check failed for agent ${this.config.agentId}:`, error);
      return false;
    }
  }

  // ============================================
  // Abstract Methods (to be implemented by concrete agents)
  // ============================================

  /**
   * Define agent-specific capabilities
   */
  protected abstract defineCapabilities(): BaseAgentCapabilities;

  /**
   * Build the prompt for the specific agent
   */
  protected abstract buildPrompt(request: AgentInvokeRequest): Promise<string>;

  /**
   * Parse the response from Bedrock into the standard format
   */
  protected abstract parseResponse(response: any, request: AgentInvokeRequest): Promise<AgentInvokeResponse>;

  /**
   * Validate agent-specific input requirements
   */
  protected abstract validateInput(request: AgentInvokeRequest): Promise<ValidationResult>;

  // ============================================
  // Protected Methods (can be overridden by concrete agents)
  // ============================================

  /**
   * Initialize the Bedrock client
   */
  protected initializeClient(): void {
    this.client = new BedrockAgentRuntime({
      region: this.config.bedrockConfig.region,
      // Credentials will be picked up from environment or IAM role
    });
  }

  /**
   * Initialize supporting components
   */
  protected initializeComponents(): void {
    this.memory = new AgentMemory(this.config.memory);
    this.performanceTracker = new PerformanceTracker();
    this.securityValidator = new SecurityValidator(this.config.security);
    this.rateLimiter = new RateLimiter(this.config.capabilities.rateLimit);
  }

  /**
   * Invoke the Bedrock agent
   */
  protected async invokeBedrockAgent(prompt: string, request: AgentInvokeRequest): Promise<any> {
    const params = {
      agentId: this.config.bedrockConfig.agentId,
      agentAliasId: this.config.bedrockConfig.agentAliasId,
      sessionId: request.context.sessionId,
      inputText: prompt,
      enableTrace: request.options?.traceEnabled !== false,
      endSession: false
    };

    return await this.client.invokeAgent(params);
  }

  /**
   * Execute operation with retry logic
   */
  protected async executeWithRetry<T>(
    operation: () => Promise<T>,
    maxAttempts: number
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxAttempts || !this.isRetryableError(error)) {
          break;
        }

        // Exponential backoff
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
        await this.sleep(delay);
      }
    }

    throw lastError!;
  }

  // ============================================
  // Private Methods
  // ============================================

  private async validateSecurity(request: AgentInvokeRequest): Promise<SecurityValidationResult> {
    return await this.securityValidator.validateRequest(request);
  }

  private async checkCache(request: AgentInvokeRequest): Promise<AgentInvokeResponse | null> {
    if (!this.config.performance.enableCaching) {
      return null;
    }

    const cacheKey = this.generateCacheKey(request);
    return await this.memory.getCachedResponse(cacheKey);
  }

  private async cacheResponse(request: AgentInvokeRequest, response: AgentInvokeResponse): Promise<void> {
    if (!this.config.performance.enableCaching) {
      return;
    }

    const cacheKey = this.generateCacheKey(request);
    const ttl = request.options?.cacheTTL || this.config.capabilities.cacheTTL;
    await this.memory.setCachedResponse(cacheKey, response, ttl);
  }

  private generateCacheKey(request: AgentInvokeRequest): string {
    // Create a hash of the request for caching
    const keyData = {
      agentId: request.agentId,
      prompt: request.prompt,
      parameters: request.parameters,
      contextHash: this.hashContext(request.context)
    };
    return this.hashObject(keyData);
  }

  private hashContext(context: any): string {
    // Create a hash of relevant context data
    const relevantContext = {
      pageContext: context.pageContext,
      supplierContext: context.supplierContext,
      rfpContext: context.rfpContext
    };
    return this.hashObject(relevantContext);
  }

  private hashObject(obj: any): string {
    // Simple hash function for caching keys
    return Buffer.from(JSON.stringify(obj)).toString('base64');
  }

  private enrichCachedResponse(response: AgentInvokeResponse, traceId: string): AgentInvokeResponse {
    return {
      ...response,
      metadata: {
        ...response.metadata,
        cacheHit: true,
        processingTimeMs: 0
      }
    };
  }

  private updateMemory(context: any, response: AgentInvokeResponse): Promise<void> {
    return this.memory.updateConversation(context.conversationId, {
      id: this.generateMessageId(),
      role: 'agent',
      agentId: this.config.agentId,
      content: response.response,
      timestamp: new Date(),
      metadata: response.metadata
    });
  }

  private trackPerformance(startTime: number, response: AgentInvokeResponse): PerformanceMetrics {
    const endTime = Date.now();
    const responseTimeMs = endTime - startTime;

    const metrics: PerformanceMetrics = {
      responseTimeMs,
      tokenUsage: {
        inputTokens: response.metadata.inputTokens,
        outputTokens: response.metadata.outputTokens,
        totalTokens: response.metadata.totalTokens,
        cachedTokens: response.metadata.cacheHit ? response.metadata.totalTokens : 0
      },
      memoryUsageMB: process.memoryUsage().heapUsed / 1024 / 1024,
      queueWaitTimeMs: 0 // Will be set by orchestrator if applicable
    };

    this.performanceTracker.recordMetrics(this.config.agentId, metrics);
    return metrics;
  }

  private calculateCost(response: AgentInvokeResponse): ExecutionCost {
    // Cost calculation based on token usage
    const inputCostPerToken = 0.00001; // Example rate
    const outputCostPerToken = 0.00003; // Example rate

    const tokenCost = 
      (response.metadata.inputTokens * inputCostPerToken) +
      (response.metadata.outputTokens * outputCostPerToken);

    return {
      tokenCost,
      computeCost: 0, // Would be calculated based on compute time
      totalCost: tokenCost,
      currency: 'USD'
    };
  }

  private createSecurityError(result: SecurityValidationResult): AgentError {
    const error = new Error(`Security validation failed: ${result.violations.map(v => v.description).join(', ')}`) as AgentError;
    error.code = 'SECURITY_VIOLATION';
    error.agentId = this.config.agentId;
    error.recoverable = false;
    error.context = { violations: result.violations };
    return error;
  }

  private createValidationError(result: ValidationResult): AgentError {
    const error = new Error(`Input validation failed: ${result.errors.map(e => e.message).join(', ')}`) as AgentError;
    error.code = 'VALIDATION_ERROR';
    error.agentId = this.config.agentId;
    error.recoverable = false;
    error.context = { errors: result.errors };
    return error;
  }

  private handleError(error: any, request: AgentInvokeRequest, traceId: string): AgentError {
    if (error.code) {
      // Already an AgentError
      return error;
    }

    // Convert to AgentError
    const agentError = new Error(error.message || 'Unknown agent error') as AgentError;
    agentError.code = this.mapErrorCode(error);
    agentError.agentId = this.config.agentId;
    agentError.recoverable = this.isRetryableError(error);
    agentError.context = { originalError: error, traceId, request: request.agentId };

    return agentError;
  }

  private mapErrorCode(error: any): string {
    if (error.name === 'ThrottlingException') return 'RATE_LIMIT';
    if (error.name === 'TimeoutError') return 'TIMEOUT';
    if (error.name === 'ValidationException') return 'VALIDATION_ERROR';
    if (error.name === 'AccessDeniedException') return 'ACCESS_DENIED';
    return 'UNKNOWN_ERROR';
  }

  private isRetryableError(error: any): boolean {
    const retryableCodes = ['RATE_LIMIT', 'TIMEOUT', 'NETWORK_ERROR', 'SERVICE_UNAVAILABLE'];
    return retryableCodes.includes(this.mapErrorCode(error));
  }

  private async checkBedrockConnection(): Promise<boolean> {
    try {
      // Simple health check - could be improved
      return true;
    } catch (error) {
      return false;
    }
  }

  private generateTraceId(): string {
    return `trace-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateMessageId(): string {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}