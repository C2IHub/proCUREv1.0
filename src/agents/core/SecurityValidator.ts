import {
  AgentInvokeRequest,
  SecurityValidationResult,
  SecurityViolation,
  SecurityConfig
} from '../../types/agents';

/**
 * Security validator for agent requests
 */
export class SecurityValidator {
  private config: SecurityConfig;
  private suspiciousPatterns: RegExp[];
  private blockedDomains: Set<string>;

  constructor(config: SecurityConfig) {
    this.config = config;
    this.initializeSecurityPatterns();
    this.blockedDomains = new Set(['malicious.com', 'phishing.net']); // Example blocked domains
  }

  /**
   * Validate security of an agent request
   */
  async validateRequest(request: AgentInvokeRequest): Promise<SecurityValidationResult> {
    const violations: SecurityViolation[] = [];
    let riskScore = 0;

    // 1. Input validation
    if (this.config.enableInputValidation) {
      const inputViolations = this.validateInput(request);
      violations.push(...inputViolations);
      riskScore += inputViolations.length * 10;
    }

    // 2. Injection detection
    const injectionViolations = this.detectInjectionAttempts(request.prompt);
    violations.push(...injectionViolations);
    riskScore += injectionViolations.length * 25;

    // 3. Rate limiting check
    if (this.config.enableRateLimiting) {
      const rateLimitViolations = await this.checkRateLimits(request);
      violations.push(...rateLimitViolations);
      riskScore += rateLimitViolations.length * 15;
    }

    // 4. Content policy check
    const contentViolations = this.checkContentPolicy(request.prompt);
    violations.push(...contentViolations);
    riskScore += contentViolations.length * 20;

    // 5. User permissions check
    const permissionViolations = await this.checkUserPermissions(request);
    violations.push(...permissionViolations);
    riskScore += permissionViolations.length * 30;

    return {
      isValid: violations.length === 0,
      violations,
      riskScore: Math.min(riskScore, 100)
    };
  }

  /**
   * Sanitize input text
   */
  sanitizeInput(input: string): string {
    if (!this.config.enableInputValidation) {
      return input;
    }

    // Remove potentially dangerous characters and patterns
    let sanitized = input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/javascript:/gi, '') // Remove javascript: URLs
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .replace(/data:text\/html/gi, '') // Remove data URLs
      .trim();

    // Limit length
    if (sanitized.length > this.config.maxPromptLength) {
      sanitized = sanitized.substring(0, this.config.maxPromptLength);
    }

    return sanitized;
  }

  // ============================================
  // Private Methods
  // ============================================

  private initializeSecurityPatterns(): void {
    this.suspiciousPatterns = [
      // SQL injection patterns
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER)\b)/gi,
      
      // Script injection patterns
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      
      // Command injection patterns
      /(\||&|;|\$\(|\`)/g,
      
      // Path traversal patterns
      /\.\.\//g,
      /\.\.\\\/g,
      
      // LDAP injection patterns
      /(\(|\)|&|\||\*)/g,
      
      // XPath injection patterns
      /(\[|\]|'|"|\|)/g
    ];
  }

  private validateInput(request: AgentInvokeRequest): SecurityViolation[] {
    const violations: SecurityViolation[] = [];

    // Check prompt length
    if (request.prompt.length > this.config.maxPromptLength) {
      violations.push({
        type: 'input_length_exceeded',
        severity: 'medium',
        description: `Prompt length ${request.prompt.length} exceeds maximum allowed ${this.config.maxPromptLength}`,
        evidence: [`Prompt length: ${request.prompt.length}`]
      });
    }

    // Check for null bytes
    if (request.prompt.includes('\0')) {
      violations.push({
        type: 'null_byte_injection',
        severity: 'high',
        description: 'Null byte detected in prompt',
        evidence: ['Null byte found in input']
      });
    }

    // Check encoding
    try {
      decodeURIComponent(request.prompt);
    } catch (error) {
      violations.push({
        type: 'encoding_violation',
        severity: 'medium',
        description: 'Invalid URL encoding detected',
        evidence: ['Invalid encoding in prompt']
      });
    }

    return violations;
  }

  private detectInjectionAttempts(prompt: string): SecurityViolation[] {
    const violations: SecurityViolation[] = [];

    for (const pattern of this.suspiciousPatterns) {
      const matches = prompt.match(pattern);
      if (matches) {
        violations.push({
          type: 'injection_attempt',
          severity: 'high',
          description: `Potential injection attack detected: ${pattern.source}`,
          evidence: matches
        });
      }
    }

    return violations;
  }

  private async checkRateLimits(request: AgentInvokeRequest): Promise<SecurityViolation[]> {
    const violations: SecurityViolation[] = [];

    // This would integrate with actual rate limiting service
    // For now, we'll do a simple check
    const userRequestCount = await this.getUserRequestCount(request.context.userId);
    
    if (userRequestCount > 100) { // Example threshold
      violations.push({
        type: 'rate_limit_abuse',
        severity: 'medium',
        description: 'User has exceeded normal request patterns',
        evidence: [`Request count: ${userRequestCount}`]
      });
    }

    return violations;
  }

  private checkContentPolicy(prompt: string): SecurityViolation[] {
    const violations: SecurityViolation[] = [];

    // Check for prohibited content
    const prohibitedTerms = [
      'password', 'secret', 'token', 'api_key', 'private_key',
      'ssn', 'social security', 'credit card', 'bank account'
    ];

    const lowerPrompt = prompt.toLowerCase();
    for (const term of prohibitedTerms) {
      if (lowerPrompt.includes(term)) {
        violations.push({
          type: 'sensitive_data',
          severity: 'high',
          description: `Potential sensitive data detected: ${term}`,
          evidence: [term]
        });
      }
    }

    return violations;
  }

  private async checkUserPermissions(request: AgentInvokeRequest): Promise<SecurityViolation[]> {
    const violations: SecurityViolation[] = [];

    // Check if user has permission to use this agent
    const hasPermission = await this.checkAgentPermission(
      request.context.userId,
      request.agentId
    );

    if (!hasPermission) {
      violations.push({
        type: 'unauthorized_access',
        severity: 'critical',
        description: `User ${request.context.userId} does not have permission to use agent ${request.agentId}`,
        evidence: [`User: ${request.context.userId}`, `Agent: ${request.agentId}`]
      });
    }

    return violations;
  }

  private async getUserRequestCount(userId: string): Promise<number> {
    // This would query actual rate limiting storage
    // For now, return a mock value
    return Math.floor(Math.random() * 150);
  }

  private async checkAgentPermission(userId: string, agentId: string): Promise<boolean> {
    // This would check actual user permissions
    // For now, allow all requests
    return true;
  }
}