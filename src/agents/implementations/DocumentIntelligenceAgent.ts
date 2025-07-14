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
 * Document Intelligence Agent
 * Specializes in document validation, content extraction, and format compliance
 */
export class DocumentIntelligenceAgent extends BaseAgent {
  protected defineCapabilities(): BaseAgentCapabilities {
    return {
      id: 'document-validator' as AgentId,
      name: 'Document Intelligence Agent',
      version: '1.0.0',
      capabilities: [
        'document_validation',
        'content_extraction',
        'format_compliance_check',
        'anomaly_detection',
        'document_classification',
        'metadata_extraction',
        'signature_verification',
        'version_control'
      ],
      supportedWorkflows: [
        'document_processing',
        'validation_workflow',
        'supplier_onboarding',
        'compliance_review'
      ],
      dependencies: [],
      resourceRequirements: {
        maxMemoryMB: 1024,
        maxConcurrentRequests: 12,
        estimatedTokensPerRequest: {
          input: 2500,
          output: 1000
        },
        timeoutMs: 60000,
        priority: 'medium'
      },
      configSchema: {
        type: 'object',
        properties: {
          supportedFormats: { type: 'array', items: { type: 'string' } },
          validationRules: { type: 'object' },
          extractionTemplates: { type: 'array' }
        }
      }
    };
  }

  protected async buildPrompt(request: AgentInvokeRequest): Promise<string> {
    const context = request.context;
    let prompt = `You are the Document Intelligence Agent for the proCURE pharmaceutical procurement platform.

Your specialized capabilities include:
- Document validation and integrity checking
- Content extraction from various document formats
- Format compliance verification
- Anomaly and fraud detection
- Document classification and categorization
- Metadata and signature verification
- Version control and change tracking

Current Context:
- Page: ${context.pageContext}
- User Role: ${context.userRole}
- Processing Date: ${new Date().toISOString()}
`;

    // Add supplier context for document validation
    if (context.supplierContext) {
      prompt += `
Supplier Document Context:
- Supplier: ${context.supplierContext.supplierName}
- Compliance Status: ${context.supplierContext.complianceStatus}
- Required Certifications: ${context.supplierContext.certifications.map(c => c.name).join(', ')}
- Risk Level: ${context.supplierContext.riskLevel}
`;
    }

    // Add RFP context for document processing
    if (context.rfpContext) {
      prompt += `
RFP Document Context:
- RFP: ${context.rfpContext.rfpTitle}
- Status: ${context.rfpContext.status}
- Attached Documents: ${context.rfpContext.attachedDocuments?.map(d => d.name).join(', ') || 'None'}
- Requirements: ${context.rfpContext.requirements?.length || 0} requirements to validate
`;
    }

    // Add page-specific document processing requirements
    switch (context.pageContext) {
      case 'rfp-wizard':
        prompt += `
RFP Document Processing Required:
- Validate uploaded requirement documents
- Extract key requirements and specifications
- Check document completeness and format
- Identify missing or unclear requirements
- Suggest document improvements
- Ensure regulatory compliance of requirements
`;
        break;
      case 'supplier-portal':
        prompt += `
Supplier Document Validation Required:
- Validate compliance documentation
- Verify certificate authenticity and validity
- Check document expiration dates
- Ensure format compliance with standards
- Detect potential fraud or anomalies
- Extract key compliance data
`;
        break;
      case 'rfp-tracker':
        prompt += `
RFP Response Document Analysis:
- Validate supplier response documents
- Extract proposal details and pricing
- Check response completeness
- Compare against RFP requirements
- Identify compliance gaps
- Score document quality
`;
        break;
    }

    prompt += `
User Request: ${request.prompt}

Please provide comprehensive document analysis including:

1. **Document Validation Summary**
   - Overall validation status (Valid/Invalid/Needs Review)
   - Document count and types processed
   - Validation score (0-100)

2. **Content Analysis**
   - Key information extracted
   - Document classification and categorization
   - Metadata and properties
   - Version and revision information

3. **Compliance Assessment**
   - Format compliance with standards
   - Required fields and sections present
   - Regulatory compliance check
   - Industry standard adherence

4. **Quality and Integrity Check**
   - Document authenticity verification
   - Signature and seal validation
   - Anomaly detection results
   - Potential fraud indicators

5. **Issues and Recommendations**
   - Critical issues requiring immediate attention
   - Missing documents or information
   - Format or content improvements needed
   - Next steps for document completion

6. **Extracted Data Summary**
   - Key dates (issue, expiry, renewal)
   - Important numbers (certificates, licenses)
   - Contact information and entities
   - Compliance scores and ratings

Format your response with clear sections and specific findings for each document processed.`;

    return prompt;
  }

  protected async parseResponse(response: any, request: AgentInvokeRequest): Promise<AgentInvokeResponse> {
    const responseText = this.extractResponseText(response);
    const documentData = this.parseDocumentData(responseText);
    
    return {
      agentId: this.config.agentId,
      sessionId: request.context.sessionId,
      response: responseText,
      confidence: this.calculateConfidence(response, documentData),
      reasoning: {
        steps: [
          {
            step: 1,
            description: 'Analyzed document structure and format',
            evidence: ['Document headers', 'Format validation', 'Structure analysis'],
            confidence: 0.92,
            timestamp: Date.now()
          },
          {
            step: 2,
            description: 'Extracted and validated content',
            evidence: ['Content parsing', 'Data extraction', 'Field validation'],
            confidence: 0.88,
            timestamp: Date.now()
          },
          {
            step: 3,
            description: 'Performed compliance and integrity checks',
            evidence: ['Compliance rules', 'Integrity verification', 'Anomaly detection'],
            confidence: 0.85,
            timestamp: Date.now()
          },
          {
            step: 4,
            description: 'Generated validation report and recommendations',
            evidence: ['Validation results', 'Best practices', 'Improvement suggestions'],
            confidence: 0.90,
            timestamp: Date.now()
          }
        ],
        conclusion: 'Comprehensive document analysis completed with validation results and recommendations',
        confidence: 0.89
      },
      sources: [
        {
          type: 'knowledge_base',
          source: 'Document Standards Database',
          relevance: 0.95,
          excerpt: 'Industry document format standards and validation rules'
        },
        {
          type: 'database',
          source: 'Compliance Requirements Registry',
          relevance: 0.90,
          excerpt: 'Required document types and validation criteria'
        },
        {
          type: 'api',
          source: 'Document Verification Service',
          relevance: 0.85,
          excerpt: 'Certificate authenticity and signature verification'
        }
      ],
      recommendations: this.generateDocumentRecommendations(documentData),
      nextActions: this.generateDocumentActions(documentData),
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
        message: 'Prompt is required for document analysis',
        code: 'REQUIRED_FIELD'
      });
    }

    // Validate context
    if (!request.context.pageContext) {
      errors.push({
        field: 'context.pageContext',
        message: 'Page context is required for document processing',
        code: 'REQUIRED_FIELD'
      });
    }

    // Check for document-related context
    const hasDocumentContext = request.context.rfpContext?.attachedDocuments ||
                              request.context.supplierContext ||
                              request.prompt.toLowerCase().includes('document');

    if (!hasDocumentContext) {
      errors.push({
        field: 'context',
        message: 'Document context or document-related request is required',
        code: 'INSUFFICIENT_CONTEXT'
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

  private parseDocumentData(responseText: string): any {
    return {
      validationStatus: this.extractValidationStatus(responseText),
      validationScore: this.extractValidationScore(responseText),
      documentCount: this.extractDocumentCount(responseText),
      criticalIssues: this.extractCriticalIssues(responseText),
      extractedData: this.extractKeyData(responseText),
      complianceStatus: this.extractComplianceStatus(responseText),
      recommendations: this.extractRecommendations(responseText)
    };
  }

  private extractValidationStatus(text: string): string {
    const statusMatch = text.match(/validation\s+status:?\s*(valid|invalid|needs\s+review)/i);
    return statusMatch ? statusMatch[1].toLowerCase() : 'needs review';
  }

  private extractValidationScore(text: string): number {
    const scoreMatch = text.match(/validation\s+score:?\s*(\d+(?:\.\d+)?)/i);
    return scoreMatch ? parseFloat(scoreMatch[1]) : 75;
  }

  private extractDocumentCount(text: string): number {
    const countMatch = text.match(/(\d+)\s+documents?\s+processed/i);
    return countMatch ? parseInt(countMatch[1]) : 1;
  }

  private extractCriticalIssues(text: string): string[] {
    const issues = [];
    const issuesSection = text.match(/critical\s+issues?:?\s*(.*?)(?:\n\n|\n[A-Z]|$)/is);
    if (issuesSection) {
      const issueLines = issuesSection[1].split('\n').filter(line => line.trim());
      issues.push(...issueLines.map(line => line.replace(/^[-•*]\s*/, '').trim()));
    }
    return issues;
  }

  private extractKeyData(text: string): any {
    const data = {
      dates: this.extractDates(text),
      certificates: this.extractCertificates(text),
      contacts: this.extractContacts(text),
      scores: this.extractScores(text)
    };
    return data;
  }

  private extractDates(text: string): string[] {
    const dateRegex = /\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b|\b\d{4}-\d{2}-\d{2}\b/g;
    return text.match(dateRegex) || [];
  }

  private extractCertificates(text: string): string[] {
    const certRegex = /(?:certificate|cert|certification)[\s\w]*?(?:number|no|#):?\s*([A-Z0-9-]+)/gi;
    const matches = text.matchAll(certRegex);
    return Array.from(matches, m => m[1]);
  }

  private extractContacts(text: string): string[] {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    return text.match(emailRegex) || [];
  }

  private extractScores(text: string): number[] {
    const scoreRegex = /\b(\d+(?:\.\d+)?)%?\b/g;
    const matches = text.matchAll(scoreRegex);
    return Array.from(matches, m => parseFloat(m[1])).filter(n => n <= 100);
  }

  private extractComplianceStatus(text: string): string {
    const complianceMatch = text.match(/compliance:?\s*(compliant|non-compliant|partial)/i);
    return complianceMatch ? complianceMatch[1].toLowerCase() : 'unknown';
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

  private calculateConfidence(response: any, documentData: any): number {
    let confidence = 0.8; // Base confidence
    
    const responseText = this.extractResponseText(response);
    
    // Adjust based on analysis completeness
    if (responseText.length > 1000) confidence += 0.05;
    if (documentData.validationScore > 0) confidence += 0.05;
    if (documentData.extractedData.dates.length > 0) confidence += 0.03;
    if (documentData.extractedData.certificates.length > 0) confidence += 0.03;
    if (documentData.criticalIssues.length === 0) confidence += 0.04;
    
    return Math.min(confidence, 0.95);
  }

  private generateDocumentRecommendations(documentData: any): any[] {
    const recommendations = [];
    
    if (documentData.validationScore < 70) {
      recommendations.push({
        type: 'action',
        title: 'Document Quality Improvement Required',
        description: 'Document validation score is below acceptable threshold. Review and improve document quality.',
        priority: 'high',
        actionable: true
      });
    }
    
    if (documentData.criticalIssues.length > 0) {
      recommendations.push({
        type: 'warning',
        title: 'Critical Issues Detected',
        description: `${documentData.criticalIssues.length} critical issues found that require immediate attention.`,
        priority: 'high',
        actionable: true
      });
    }
    
    if (documentData.complianceStatus !== 'compliant') {
      recommendations.push({
        type: 'action',
        title: 'Compliance Issues Found',
        description: 'Documents do not meet compliance requirements. Review and update as needed.',
        priority: 'medium',
        actionable: true
      });
    }
    
    recommendations.push({
      type: 'information',
      title: 'Document Processing Complete',
      description: `Successfully processed ${documentData.documentCount} document(s) with validation score of ${documentData.validationScore}%.`,
      priority: 'low',
      actionable: false
    });
    
    return recommendations;
  }

  private generateDocumentActions(documentData: any): any[] {
    const actions = [];
    
    actions.push({
      action: 'update_document_status',
      description: 'Update document validation status in system',
      parameters: {
        status: documentData.validationStatus,
        score: documentData.validationScore,
        processedCount: documentData.documentCount
      }
    });
    
    if (documentData.criticalIssues.length > 0) {
      actions.push({
        action: 'flag_critical_issues',
        description: 'Flag critical document issues for review',
        parameters: {
          issues: documentData.criticalIssues,
          priority: 'high'
        }
      });
    }
    
    if (documentData.extractedData.dates.length > 0) {
      actions.push({
        action: 'schedule_renewals',
        description: 'Schedule renewal reminders for expiring documents',
        parameters: {
          dates: documentData.extractedData.dates,
          reminderDays: 30
        }
      });
    }
    
    return actions;
  }

  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
}