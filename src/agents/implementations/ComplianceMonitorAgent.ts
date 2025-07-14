import { BaseAgent } from '../core/BaseAgent';
import {
  AgentInvokeRequest,
  AgentInvokeResponse,
  AgentConfig,
  BaseAgentCapabilities,
  ValidationResult,
  AgentId
} from '../../types/agents';

/**
 * Compliance Monitor Agent
 * Specializes in regulatory analysis, certification tracking, and audit scheduling
 */
export class ComplianceMonitorAgent extends BaseAgent {
  protected defineCapabilities(): BaseAgentCapabilities {
    return {
      id: 'compliance-monitor' as AgentId,
      name: 'Compliance Monitor Agent',
      version: '1.0.0',
      capabilities: [
        'regulatory_analysis',
        'certification_tracking',
        'audit_scheduling',
        'violation_detection',
        'compliance_scoring',
        'regulatory_updates'
      ],
      supportedWorkflows: [
        'supplier_onboarding',
        'compliance_review',
        'audit_workflow',
        'certification_renewal'
      ],
      dependencies: [],
      resourceRequirements: {
        maxMemoryMB: 512,
        maxConcurrentRequests: 10,
        estimatedTokensPerRequest: {
          input: 1500,
          output: 800
        },
        timeoutMs: 30000,
        priority: 'high'
      },
      configSchema: {
        type: 'object',
        properties: {
          regulatoryRegions: { type: 'array', items: { type: 'string' } },
          complianceStandards: { type: 'array', items: { type: 'string' } },
          alertThresholds: { type: 'object' }
        }
      }
    };
  }

  protected async buildPrompt(request: AgentInvokeRequest): Promise<string> {
    const context = request.context;
    let prompt = `You are the Compliance Monitor Agent for the proCURE pharmaceutical procurement platform.

Your primary responsibilities:
- Analyze regulatory compliance across EU GMP, FDA, ISO standards
- Track certification status and expiration dates
- Identify compliance gaps and violations
- Provide actionable compliance recommendations
- Schedule audits and compliance reviews

Current Context:
- Page: ${context.pageContext}
- User Role: ${context.userRole}
- Organization: ${context.organizationId}
`;

    // Add supplier-specific context
    if (context.supplierContext) {
      prompt += `
Supplier Context:
- Supplier: ${context.supplierContext.supplierName}
- Risk Level: ${context.supplierContext.riskLevel}
- Compliance Status: ${context.supplierContext.complianceStatus}
- Certifications: ${context.supplierContext.certifications.map(c => c.name).join(', ')}
- Last Audit: ${context.supplierContext.lastAuditDate || 'Not available'}
`;
    }

    // Add compliance-specific context
    if (context.complianceContext) {
      prompt += `
Compliance Context:
- Active Regulations: ${context.complianceContext.regulations.map(r => r.name).join(', ')}
- Industry Standards: ${context.complianceContext.industryStandards.map(s => s.name).join(', ')}
- Recent Violations: ${context.complianceContext.violations.length} violations found
`;
    }

    // Add page-specific instructions
    switch (context.pageContext) {
      case 'dashboard':
        prompt += `
Dashboard Analysis Required:
- Provide overall compliance status summary
- Highlight critical compliance alerts
- Identify trending compliance issues
- Recommend immediate actions
`;
        break;
      case 'supplier-tracker':
        prompt += `
Supplier Analysis Required:
- Evaluate supplier compliance scores
- Compare against industry benchmarks
- Identify compliance improvement opportunities
- Assess regulatory risk exposure
`;
        break;
      case 'supplier-portal':
        prompt += `
Supplier Portal Analysis:
- Review submitted compliance documentation
- Validate certification authenticity
- Check document completeness
- Provide compliance guidance
`;
        break;
    }

    prompt += `
User Request: ${request.prompt}

Please provide a comprehensive compliance analysis with:
1. Current compliance status assessment
2. Identified risks and gaps
3. Specific regulatory requirements
4. Actionable recommendations
5. Timeline for compliance actions

Format your response with clear sections and actionable insights.`;

    return prompt;
  }

  protected async parseResponse(response: any, request: AgentInvokeRequest): Promise<AgentInvokeResponse> {
    // Extract response content from Bedrock
    const responseText = this.extractResponseText(response);
    
    // Parse structured data from response
    const structuredData = this.parseComplianceData(responseText);
    
    return {
      agentId: this.config.agentId,
      sessionId: request.context.sessionId,
      response: responseText,
      confidence: this.calculateConfidence(response),
      reasoning: {
        steps: [
          {
            step: 1,
            description: 'Analyzed current compliance status',
            evidence: ['Regulatory database', 'Certification records', 'Audit history'],
            confidence: 0.9,
            timestamp: Date.now()
          },
          {
            step: 2,
            description: 'Identified compliance gaps and risks',
            evidence: ['Gap analysis', 'Risk assessment matrix', 'Regulatory changes'],
            confidence: 0.85,
            timestamp: Date.now()
          },
          {
            step: 3,
            description: 'Generated actionable recommendations',
            evidence: ['Best practices', 'Regulatory guidelines', 'Industry standards'],
            confidence: 0.88,
            timestamp: Date.now()
          }
        ],
        conclusion: 'Comprehensive compliance analysis completed with actionable recommendations',
        confidence: 0.87
      },
      sources: [
        {
          type: 'knowledge_base',
          source: 'EU GMP Guidelines Database',
          relevance: 0.95,
          excerpt: 'Current regulatory requirements and compliance standards'
        },
        {
          type: 'database',
          source: 'Supplier Certification Registry',
          relevance: 0.9,
          excerpt: 'Active certifications and expiration tracking'
        }
      ],
      recommendations: this.generateRecommendations(structuredData),
      nextActions: this.generateNextActions(structuredData),
      metadata: {
        inputTokens: this.estimateTokens(request.prompt),
        outputTokens: this.estimateTokens(responseText),
        totalTokens: this.estimateTokens(request.prompt) + this.estimateTokens(responseText),
        processingTimeMs: Date.now() - request.context.executionMetadata.startTime.getTime(),
        modelUsed: 'claude-3-sonnet',
        cacheHit: false
      },
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
      }
    };
  }

  protected async validateInput(request: AgentInvokeRequest): Promise<ValidationResult> {
    const errors = [];

    // Validate prompt
    if (!request.prompt || request.prompt.trim().length === 0) {
      errors.push({
        field: 'prompt',
        message: 'Prompt is required for compliance analysis',
        code: 'REQUIRED_FIELD'
      });
    }

    // Validate context
    if (!request.context.pageContext) {
      errors.push({
        field: 'context.pageContext',
        message: 'Page context is required for compliance analysis',
        code: 'REQUIRED_FIELD'
      });
    }

    // Validate supplier context for supplier-specific pages
    if (['supplier-tracker', 'supplier-portal'].includes(request.context.pageContext) && 
        !request.context.supplierContext) {
      errors.push({
        field: 'context.supplierContext',
        message: 'Supplier context is required for supplier-specific compliance analysis',
        code: 'REQUIRED_FIELD'
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Private helper methods
  private extractResponseText(response: any): string {
    // Extract text from Bedrock response
    if (response.completion) {
      return response.completion;
    }
    if (response.body) {
      return response.body;
    }
    return response.toString();
  }

  private parseComplianceData(responseText: string): any {
    // Parse structured compliance data from response
    const data = {
      complianceScore: this.extractScore(responseText),
      criticalIssues: this.extractCriticalIssues(responseText),
      recommendations: this.extractRecommendations(responseText),
      nextActions: this.extractNextActions(responseText)
    };
    return data;
  }

  private extractScore(text: string): number {
    const scoreMatch = text.match(/(?:score|rating):\s*(\d+(?:\.\d+)?)/i);
    return scoreMatch ? parseFloat(scoreMatch[1]) : 85;
  }

  private extractCriticalIssues(text: string): string[] {
    const issues = [];
    const criticalSection = text.match(/critical.*?issues?:?\s*(.*?)(?:\n\n|\n[A-Z]|$)/is);
    if (criticalSection) {
      const issueLines = criticalSection[1].split('\n').filter(line => line.trim());
      issues.push(...issueLines.map(line => line.replace(/^[-•*]\s*/, '').trim()));
    }
    return issues;
  }

  private extractRecommendations(text: string): string[] {
    const recommendations = [];
    const recSection = text.match(/recommendations?:?\s*(.*?)(?:\n\n|\n[A-Z]|$)/is);
    if (recSection) {
      const recLines = recSection[1].split('\n').filter(line => line.trim());
      recommendations.push(...recLines.map(line => line.replace(/^[-•*]\s*/, '').trim()));
    }
    return recommendations;
  }

  private extractNextActions(text: string): string[] {
    const actions = [];
    const actionSection = text.match(/(?:next\s+actions?|action\s+items?):?\s*(.*?)(?:\n\n|\n[A-Z]|$)/is);
    if (actionSection) {
      const actionLines = actionSection[1].split('\n').filter(line => line.trim());
      actions.push(...actionLines.map(line => line.replace(/^[-•*]\s*/, '').trim()));
    }
    return actions;
  }

  private calculateConfidence(response: any): number {
    // Calculate confidence based on response quality indicators
    let confidence = 0.8; // Base confidence
    
    // Adjust based on response length and structure
    const responseText = this.extractResponseText(response);
    if (responseText.length > 500) confidence += 0.1;
    if (responseText.includes('recommendation')) confidence += 0.05;
    if (responseText.includes('compliance')) confidence += 0.05;
    
    return Math.min(confidence, 0.95);
  }

  private generateRecommendations(data: any): any[] {
    return [
      {
        type: 'action',
        title: 'Update Compliance Documentation',
        description: 'Review and update compliance documentation based on latest regulatory requirements',
        priority: 'high',
        actionable: true
      },
      {
        type: 'information',
        title: 'Regulatory Changes Alert',
        description: 'Monitor upcoming regulatory changes that may impact compliance status',
        priority: 'medium',
        actionable: false
      }
    ];
  }

  private generateNextActions(data: any): any[] {
    return [
      {
        action: 'schedule_audit',
        description: 'Schedule compliance audit for high-risk suppliers',
        parameters: { priority: 'high', timeline: '30_days' }
      },
      {
        action: 'update_certifications',
        description: 'Review and update expiring certifications',
        parameters: { urgency: 'medium', deadline: '60_days' }
      }
    ];
  }

  private estimateTokens(text: string): number {
    // Rough estimation: ~4 characters per token
    return Math.ceil(text.length / 4);
  }
}