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
 * Risk Predictor Agent
 * Specializes in financial, operational, and supply chain risk analysis
 */
export class RiskPredictorAgent extends BaseAgent {
  protected defineCapabilities(): BaseAgentCapabilities {
    return {
      id: 'risk-predictor' as AgentId,
      name: 'Predictive Risk Assessor',
      version: '1.0.0',
      capabilities: [
        'financial_risk_analysis',
        'supply_chain_assessment',
        'operational_risk_evaluation',
        'predictive_modeling',
        'geopolitical_risk_analysis',
        'market_volatility_assessment',
        'supplier_stability_scoring'
      ],
      supportedWorkflows: [
        'risk_assessment',
        'supplier_evaluation',
        'risk_monitoring',
        'supplier_onboarding'
      ],
      dependencies: ['compliance-monitor' as AgentId],
      resourceRequirements: {
        maxMemoryMB: 768,
        maxConcurrentRequests: 8,
        estimatedTokensPerRequest: {
          input: 2000,
          output: 1200
        },
        timeoutMs: 45000,
        priority: 'high'
      },
      configSchema: {
        type: 'object',
        properties: {
          riskFactors: { type: 'array', items: { type: 'string' } },
          thresholds: { type: 'object' },
          modelParameters: { type: 'object' }
        }
      }
    };
  }

  protected async buildPrompt(request: AgentInvokeRequest): Promise<string> {
    const context = request.context;
    let prompt = `You are the Predictive Risk Assessor for the proCURE pharmaceutical procurement platform.

Your expertise includes:
- Financial risk analysis and credit assessment
- Supply chain disruption prediction
- Operational risk evaluation
- Geopolitical and market risk assessment
- Predictive modeling for risk forecasting
- Supplier stability and performance analysis

Current Context:
- Page: ${context.pageContext}
- User Role: ${context.userRole}
- Analysis Date: ${new Date().toISOString()}
`;

    // Add supplier-specific context
    if (context.supplierContext) {
      prompt += `
Supplier Risk Profile:
- Supplier: ${context.supplierContext.supplierName}
- Current Risk Level: ${context.supplierContext.riskLevel}
- Performance Metrics: ${JSON.stringify(context.supplierContext.performanceMetrics)}
- Upcoming Milestones: ${context.supplierContext.upcomingMilestones?.map(m => m.description).join(', ') || 'None'}
`;
    }

    // Add RFP context for risk assessment
    if (context.rfpContext) {
      prompt += `
RFP Risk Context:
- RFP: ${context.rfpContext.rfpTitle}
- Status: ${context.rfpContext.status}
- Budget: ${context.rfpContext.budget}
- Timeline: ${context.rfpContext.timeline}
- Requirements: ${context.rfpContext.requirements?.length || 0} requirements
`;
    }

    // Add previous agent outputs for context
    if (context.previousAgentOutputs?.length > 0) {
      prompt += `
Previous Analysis Results:
`;
      context.previousAgentOutputs.forEach(output => {
        prompt += `- ${output.agentId}: ${JSON.stringify(output.output).substring(0, 200)}...\n`;
      });
    }

    // Add page-specific risk analysis requirements
    switch (context.pageContext) {
      case 'dashboard':
        prompt += `
Dashboard Risk Analysis Required:
- Provide portfolio-wide risk overview
- Identify top risk contributors
- Highlight emerging risk trends
- Recommend risk mitigation priorities
- Calculate overall risk score and trend
`;
        break;
      case 'supplier-tracker':
        prompt += `
Supplier Risk Analysis Required:
- Evaluate individual supplier risk profiles
- Compare risk levels across supplier portfolio
- Identify high-risk suppliers requiring attention
- Assess risk trend directions
- Recommend risk mitigation strategies
`;
        break;
      case 'rfp-wizard':
        prompt += `
RFP Risk Analysis Required:
- Assess procurement risk factors
- Evaluate supplier selection risks
- Identify potential project risks
- Recommend risk mitigation in RFP design
- Suggest risk evaluation criteria
`;
        break;
    }

    prompt += `
User Request: ${request.prompt}

Please provide a comprehensive risk analysis including:

1. **Risk Assessment Summary**
   - Overall risk score (0-100 scale)
   - Risk level classification (Low/Medium/High/Critical)
   - Primary risk drivers

2. **Risk Factor Analysis**
   - Financial risk (25% weight): Credit, cash flow, debt levels
   - Operational risk (25% weight): Capacity, processes, dependencies
   - Supply chain risk (20% weight): Geographic, supplier, logistics
   - Market risk (15% weight): Volatility, competition, demand
   - Regulatory risk (15% weight): Compliance, policy changes

3. **Predictive Insights**
   - Risk trend direction (improving/stable/deteriorating)
   - Probability of issues in next 6-12 months
   - Early warning indicators to monitor

4. **Mitigation Recommendations**
   - Immediate actions required
   - Medium-term risk reduction strategies
   - Contingency planning suggestions
   - Monitoring and review schedule

5. **Risk Scoring Methodology**
   - Explain key factors in risk calculation
   - Confidence level in assessment
   - Data quality and limitations

Format your response with clear sections, specific metrics, and actionable recommendations.`;

    return prompt;
  }

  protected async parseResponse(response: any, request: AgentInvokeRequest): Promise<AgentInvokeResponse> {
    const responseText = this.extractResponseText(response);
    const riskData = this.parseRiskData(responseText);
    
    return {
      agentId: this.config.agentId,
      sessionId: request.context.sessionId,
      response: responseText,
      confidence: this.calculateConfidence(response, riskData),
      reasoning: {
        steps: [
          {
            step: 1,
            description: 'Analyzed financial and operational data',
            evidence: ['Financial statements', 'Performance metrics', 'Market data'],
            confidence: 0.88,
            timestamp: Date.now()
          },
          {
            step: 2,
            description: 'Evaluated supply chain and market risks',
            evidence: ['Supply chain mapping', 'Geopolitical analysis', 'Market trends'],
            confidence: 0.85,
            timestamp: Date.now()
          },
          {
            step: 3,
            description: 'Applied predictive risk models',
            evidence: ['Historical patterns', 'Statistical models', 'Industry benchmarks'],
            confidence: 0.82,
            timestamp: Date.now()
          },
          {
            step: 4,
            description: 'Generated risk mitigation strategies',
            evidence: ['Best practices', 'Risk management frameworks', 'Industry standards'],
            confidence: 0.87,
            timestamp: Date.now()
          }
        ],
        conclusion: 'Comprehensive risk assessment completed with predictive insights and mitigation strategies',
        confidence: 0.85
      },
      sources: [
        {
          type: 'database',
          source: 'Financial Risk Database',
          relevance: 0.92,
          excerpt: 'Credit ratings, financial ratios, and market indicators'
        },
        {
          type: 'api',
          source: 'Market Intelligence API',
          relevance: 0.88,
          excerpt: 'Real-time market data and economic indicators'
        },
        {
          type: 'knowledge_base',
          source: 'Risk Management Best Practices',
          relevance: 0.85,
          excerpt: 'Industry risk assessment methodologies and frameworks'
        }
      ],
      recommendations: this.generateRiskRecommendations(riskData),
      nextActions: this.generateRiskActions(riskData),
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
        message: 'Prompt is required for risk analysis',
        code: 'REQUIRED_FIELD'
      });
    }

    // Validate context
    if (!request.context.pageContext) {
      errors.push({
        field: 'context.pageContext',
        message: 'Page context is required for risk analysis',
        code: 'REQUIRED_FIELD'
      });
    }

    // Validate user permissions for risk analysis
    if (!request.context.permissions?.some(p => p.action === 'view_risk_data')) {
      errors.push({
        field: 'context.permissions',
        message: 'User does not have permission to view risk data',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Private helper methods
  private extractResponseText(response: any): string {
    if (response.completion) return response.completion;
    if (response.body) return response.body;
    return response.toString();
  }

  private parseRiskData(responseText: string): any {
    return {
      overallRiskScore: this.extractRiskScore(responseText),
      riskLevel: this.extractRiskLevel(responseText),
      riskFactors: this.extractRiskFactors(responseText),
      trend: this.extractTrend(responseText),
      probability: this.extractProbability(responseText),
      mitigationStrategies: this.extractMitigationStrategies(responseText)
    };
  }

  private extractRiskScore(text: string): number {
    const scoreMatch = text.match(/(?:overall\s+)?risk\s+score:?\s*(\d+(?:\.\d+)?)/i);
    return scoreMatch ? parseFloat(scoreMatch[1]) : 50;
  }

  private extractRiskLevel(text: string): string {
    const levelMatch = text.match(/risk\s+level:?\s*(low|medium|high|critical)/i);
    return levelMatch ? levelMatch[1].toLowerCase() : 'medium';
  }

  private extractRiskFactors(text: string): any {
    const factors = {
      financial: this.extractFactorScore(text, 'financial'),
      operational: this.extractFactorScore(text, 'operational'),
      supplyChain: this.extractFactorScore(text, 'supply.?chain'),
      market: this.extractFactorScore(text, 'market'),
      regulatory: this.extractFactorScore(text, 'regulatory')
    };
    return factors;
  }

  private extractFactorScore(text: string, factor: string): number {
    const regex = new RegExp(`${factor}\\s+risk:?\\s*(\\d+(?:\\.\\d+)?)`, 'i');
    const match = text.match(regex);
    return match ? parseFloat(match[1]) : 50;
  }

  private extractTrend(text: string): string {
    const trendMatch = text.match(/trend:?\s*(improving|stable|deteriorating)/i);
    return trendMatch ? trendMatch[1].toLowerCase() : 'stable';
  }

  private extractProbability(text: string): number {
    const probMatch = text.match(/probability:?\s*(\d+(?:\.\d+)?)%?/i);
    return probMatch ? parseFloat(probMatch[1]) : 25;
  }

  private extractMitigationStrategies(text: string): string[] {
    const strategies = [];
    const mitigationSection = text.match(/mitigation.*?:?\s*(.*?)(?:\n\n|\n[A-Z]|$)/is);
    if (mitigationSection) {
      const strategyLines = mitigationSection[1].split('\n').filter(line => line.trim());
      strategies.push(...strategyLines.map(line => line.replace(/^[-•*]\s*/, '').trim()));
    }
    return strategies;
  }

  private calculateConfidence(response: any, riskData: any): number {
    let confidence = 0.75; // Base confidence
    
    const responseText = this.extractResponseText(response);
    
    // Adjust based on response completeness
    if (responseText.length > 800) confidence += 0.1;
    if (riskData.overallRiskScore > 0) confidence += 0.05;
    if (riskData.mitigationStrategies.length > 0) confidence += 0.05;
    if (responseText.includes('probability')) confidence += 0.05;
    
    return Math.min(confidence, 0.92);
  }

  private generateRiskRecommendations(riskData: any): any[] {
    const recommendations = [];
    
    if (riskData.overallRiskScore > 70) {
      recommendations.push({
        type: 'action',
        title: 'Immediate Risk Mitigation Required',
        description: 'High risk score detected. Implement immediate risk reduction measures.',
        priority: 'high',
        actionable: true
      });
    }
    
    if (riskData.trend === 'deteriorating') {
      recommendations.push({
        type: 'warning',
        title: 'Risk Trend Deteriorating',
        description: 'Risk levels are increasing. Enhanced monitoring and intervention required.',
        priority: 'medium',
        actionable: true
      });
    }
    
    recommendations.push({
      type: 'information',
      title: 'Risk Monitoring Schedule',
      description: 'Establish regular risk review cycles based on current risk level.',
      priority: 'medium',
      actionable: false
    });
    
    return recommendations;
  }

  private generateRiskActions(riskData: any): any[] {
    const actions = [];
    
    if (riskData.overallRiskScore > 60) {
      actions.push({
        action: 'enhance_monitoring',
        description: 'Increase monitoring frequency for high-risk suppliers',
        parameters: { 
          frequency: 'weekly',
          riskThreshold: riskData.overallRiskScore
        }
      });
    }
    
    actions.push({
      action: 'update_risk_profile',
      description: 'Update supplier risk profiles with latest assessment',
      parameters: {
        riskScore: riskData.overallRiskScore,
        riskLevel: riskData.riskLevel,
        trend: riskData.trend
      }
    });
    
    if (riskData.mitigationStrategies.length > 0) {
      actions.push({
        action: 'implement_mitigation',
        description: 'Implement recommended risk mitigation strategies',
        parameters: {
          strategies: riskData.mitigationStrategies,
          priority: riskData.overallRiskScore > 70 ? 'high' : 'medium'
        }
      });
    }
    
    return actions;
  }

  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
}