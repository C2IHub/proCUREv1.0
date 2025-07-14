import { WorkflowDefinition, CoordinationPattern } from '../../types/agents';

/**
 * Supplier Onboarding Workflow
 * Orchestrates the complete supplier onboarding process
 */
export const supplierOnboardingWorkflow: WorkflowDefinition = {
  id: 'supplier-onboarding',
  name: 'Supplier Onboarding Process',
  description: 'Complete workflow for onboarding new suppliers with document validation, compliance checks, and risk assessment',
  version: '1.0.0',
  trigger: {
    type: 'manual',
    conditions: [],
    description: 'Triggered when a new supplier submits onboarding documents'
  },
  coordinationPattern: 'sequential' as CoordinationPattern,
  steps: [
    {
      stepId: 'document-validation',
      name: 'Document Validation',
      agentId: 'document-validator',
      inputMapping: {
        source: 'context',
        mappings: {
          documents: {
            path: 'supplierContext.uploadedDocuments',
            required: true,
            transform: (docs: any[]) => docs.map(d => ({ name: d.name, type: d.type, content: d.content }))
          },
          supplierName: {
            path: 'supplierContext.supplierName',
            required: true
          }
        }
      },
      outputMapping: {
        destination: 'sharedMemory',
        mappings: {
          validationResults: {
            path: 'response',
            persist: true
          },
          validDocuments: {
            path: 'metadata.validDocuments',
            persist: true
          },
          documentIssues: {
            path: 'metadata.issues',
            persist: true
          }
        }
      },
      timeout: 60000,
      retryStrategy: {
        maxAttempts: 3,
        initialDelayMs: 1000,
        maxDelayMs: 5000,
        backoffMultiplier: 2,
        jitterEnabled: true,
        retryableErrors: ['TIMEOUT', 'NETWORK_ERROR']
      },
      errorHandling: {
        strategy: 'continue',
        fallbackAction: 'log_and_continue'
      }
    },
    {
      stepId: 'requirements-extraction',
      name: 'Requirements Extraction',
      agentId: 'requirements-extractor',
      dependencies: ['document-validation'],
      inputMapping: {
        source: 'sharedMemory',
        mappings: {
          validatedDocuments: {
            path: 'validDocuments',
            required: true
          },
          supplierCategory: {
            path: 'supplierContext.category',
            required: false,
            default: 'general'
          }
        }
      },
      outputMapping: {
        destination: 'sharedMemory',
        mappings: {
          extractedRequirements: {
            path: 'response',
            persist: true
          },
          complianceRequirements: {
            path: 'metadata.complianceRequirements',
            persist: true
          },
          missingRequirements: {
            path: 'metadata.missingRequirements',
            persist: true
          }
        }
      },
      timeout: 45000,
      retryStrategy: {
        maxAttempts: 2,
        initialDelayMs: 1000,
        maxDelayMs: 3000,
        backoffMultiplier: 2,
        jitterEnabled: false,
        retryableErrors: ['TIMEOUT']
      },
      errorHandling: {
        strategy: 'fail',
        fallbackAction: 'escalate'
      }
    },
    {
      stepId: 'compliance-assessment',
      name: 'Compliance Assessment',
      agentId: 'compliance-monitor',
      dependencies: ['requirements-extraction'],
      inputMapping: {
        source: 'sharedMemory',
        mappings: {
          requirements: {
            path: 'extractedRequirements',
            required: true
          },
          supplierData: {
            path: 'supplierContext',
            required: true
          }
        }
      },
      outputMapping: {
        destination: 'sharedMemory',
        mappings: {
          complianceResults: {
            path: 'response',
            persist: true
          },
          complianceScore: {
            path: 'metadata.complianceScore',
            persist: true
          },
          complianceGaps: {
            path: 'metadata.gaps',
            persist: true
          }
        }
      },
      timeout: 30000,
      retryStrategy: {
        maxAttempts: 3,
        initialDelayMs: 500,
        maxDelayMs: 2000,
        backoffMultiplier: 2,
        jitterEnabled: true,
        retryableErrors: ['TIMEOUT', 'RATE_LIMIT']
      },
      errorHandling: {
        strategy: 'retry',
        fallbackAction: 'use_cached_result'
      }
    },
    {
      stepId: 'risk-assessment',
      name: 'Risk Assessment',
      agentId: 'risk-predictor',
      dependencies: ['compliance-assessment'],
      inputMapping: {
        source: 'sharedMemory',
        mappings: {
          complianceData: {
            path: 'complianceResults',
            required: true
          },
          supplierProfile: {
            path: 'supplierContext',
            required: true
          },
          historicalData: {
            path: 'supplierContext.performanceMetrics',
            required: false,
            default: {}
          }
        }
      },
      outputMapping: {
        destination: 'sharedMemory',
        mappings: {
          riskAssessment: {
            path: 'response',
            persist: true
          },
          riskScore: {
            path: 'metadata.riskScore',
            persist: true
          },
          riskFactors: {
            path: 'metadata.riskFactors',
            persist: true
          },
          mitigationPlan: {
            path: 'metadata.mitigationPlan',
            persist: true
          }
        }
      },
      timeout: 45000,
      retryStrategy: {
        maxAttempts: 2,
        initialDelayMs: 1000,
        maxDelayMs: 4000,
        backoffMultiplier: 2,
        jitterEnabled: true,
        retryableErrors: ['TIMEOUT', 'RATE_LIMIT']
      },
      errorHandling: {
        strategy: 'continue',
        fallbackAction: 'use_default_risk_score'
      }
    },
    {
      stepId: 'workflow-setup',
      name: 'Workflow and Task Setup',
      agentId: 'workflow-automator',
      dependencies: ['risk-assessment'],
      inputMapping: {
        source: 'sharedMemory',
        mappings: {
          onboardingResults: {
            path: '*',
            required: true,
            transform: (data: any) => ({
              validation: data.validationResults,
              compliance: data.complianceResults,
              risk: data.riskAssessment
            })
          },
          supplierInfo: {
            path: 'supplierContext',
            required: true
          }
        }
      },
      outputMapping: {
        destination: 'sharedMemory',
        mappings: {
          workflowTasks: {
            path: 'response',
            persist: true
          },
          scheduledActions: {
            path: 'metadata.scheduledActions',
            persist: true
          },
          approvalWorkflow: {
            path: 'metadata.approvalWorkflow',
            persist: true
          }
        }
      },
      timeout: 30000,
      retryStrategy: {
        maxAttempts: 3,
        initialDelayMs: 500,
        maxDelayMs: 2000,
        backoffMultiplier: 2,
        jitterEnabled: false,
        retryableErrors: ['TIMEOUT']
      },
      errorHandling: {
        strategy: 'continue',
        fallbackAction: 'create_manual_tasks'
      }
    },
    {
      stepId: 'communication-setup',
      name: 'Communication and Notifications',
      agentId: 'communication-orchestrator',
      dependencies: ['workflow-setup'],
      inputMapping: {
        source: 'sharedMemory',
        mappings: {
          workflowData: {
            path: 'workflowTasks',
            required: true
          },
          supplierContact: {
            path: 'supplierContext.primaryContact',
            required: true
          },
          onboardingStatus: {
            path: '*',
            required: true,
            transform: (data: any) => ({
              documentsValid: data.validationResults?.status === 'valid',
              complianceScore: data.complianceScore || 0,
              riskLevel: data.riskScore?.level || 'medium',
              nextSteps: data.scheduledActions || []
            })
          }
        }
      },
      outputMapping: {
        destination: 'sharedMemory',
        mappings: {
          communicationPlan: {
            path: 'response',
            persist: true
          },
          notifications: {
            path: 'metadata.notifications',
            persist: true
          },
          followUpSchedule: {
            path: 'metadata.followUpSchedule',
            persist: true
          }
        }
      },
      timeout: 20000,
      retryStrategy: {
        maxAttempts: 2,
        initialDelayMs: 1000,
        maxDelayMs: 3000,
        backoffMultiplier: 2,
        jitterEnabled: true,
        retryableErrors: ['TIMEOUT', 'NETWORK_ERROR']
      },
      errorHandling: {
        strategy: 'continue',
        fallbackAction: 'send_basic_notification'
      }
    }
  ],
  sharedContext: {
    variables: [
      {
        name: 'supplierOnboardingId',
        type: 'string',
        required: true,
        description: 'Unique identifier for this onboarding process'
      },
      {
        name: 'onboardingStartTime',
        type: 'datetime',
        required: true,
        description: 'When the onboarding process started'
      },
      {
        name: 'approvalRequired',
        type: 'boolean',
        required: false,
        default: true,
        description: 'Whether manual approval is required'
      }
    ],
    artifacts: [
      {
        name: 'onboardingReport',
        type: 'document',
        description: 'Comprehensive onboarding report with all analysis results'
      },
      {
        name: 'complianceChecklist',
        type: 'checklist',
        description: 'Checklist of compliance requirements and their status'
      }
    ]
  },
  successCriteria: {
    conditions: [
      {
        type: 'step_completion',
        description: 'All steps must complete successfully',
        required: true
      },
      {
        type: 'validation_score',
        description: 'Document validation score must be above 70%',
        threshold: 70,
        required: true
      },
      {
        type: 'compliance_score',
        description: 'Compliance score must be above 60%',
        threshold: 60,
        required: false
      }
    ],
    actions: [
      {
        condition: 'success',
        action: 'approve_supplier',
        description: 'Automatically approve supplier if all criteria met'
      },
      {
        condition: 'partial_success',
        action: 'manual_review',
        description: 'Route to manual review if some criteria not met'
      },
      {
        condition: 'failure',
        action: 'reject_supplier',
        description: 'Reject supplier if critical criteria not met'
      }
    ]
  },
  fallbackStrategy: {
    type: 'degraded_mode',
    description: 'Continue with manual processes if automated workflow fails',
    actions: [
      {
        trigger: 'agent_failure',
        action: 'create_manual_task',
        description: 'Create manual task for failed agent step'
      },
      {
        trigger: 'timeout',
        action: 'escalate_to_manager',
        description: 'Escalate to manager if workflow times out'
      }
    ]
  },
  timeout: 300000, // 5 minutes total timeout
  metadata: {
    category: 'supplier_management',
    priority: 'high',
    estimatedDuration: 180000, // 3 minutes estimated
    requiredPermissions: ['supplier_onboard', 'compliance_review'],
    tags: ['onboarding', 'compliance', 'risk-assessment'],
    version: '1.0.0',
    lastUpdated: '2024-01-01T00:00:00Z',
    createdBy: 'system',
    approvedBy: 'compliance_team'
  }
};

/**
 * Compliance Review Workflow
 * Periodic compliance review for existing suppliers
 */
export const complianceReviewWorkflow: WorkflowDefinition = {
  id: 'compliance-review',
  name: 'Supplier Compliance Review',
  description: 'Periodic review of supplier compliance status and certification renewals',
  version: '1.0.0',
  trigger: {
    type: 'scheduled',
    conditions: [
      {
        type: 'time_based',
        schedule: 'monthly',
        description: 'Run monthly compliance reviews'
      },
      {
        type: 'event_based',
        event: 'certification_expiring',
        description: 'Triggered when certifications are expiring'
      }
    ],
    description: 'Triggered monthly or when certifications are expiring'
  },
  coordinationPattern: 'parallel' as CoordinationPattern,
  steps: [
    {
      stepId: 'compliance-check',
      name: 'Compliance Status Check',
      agentId: 'compliance-monitor',
      inputMapping: {
        source: 'context',
        mappings: {
          supplierList: {
            path: 'supplierContext.supplierIds',
            required: true
          },
          reviewType: {
            path: 'reviewType',
            required: false,
            default: 'monthly'
          }
        }
      },
      outputMapping: {
        destination: 'sharedMemory',
        mappings: {
          complianceStatus: {
            path: 'response',
            persist: true
          }
        }
      },
      timeout: 60000,
      retryStrategy: {
        maxAttempts: 2,
        initialDelayMs: 1000,
        maxDelayMs: 3000,
        backoffMultiplier: 2,
        jitterEnabled: true,
        retryableErrors: ['TIMEOUT']
      },
      errorHandling: {
        strategy: 'continue',
        fallbackAction: 'use_cached_data'
      }
    },
    {
      stepId: 'risk-update',
      name: 'Risk Profile Update',
      agentId: 'risk-predictor',
      inputMapping: {
        source: 'context',
        mappings: {
          supplierList: {
            path: 'supplierContext.supplierIds',
            required: true
          }
        }
      },
      outputMapping: {
        destination: 'sharedMemory',
        mappings: {
          riskUpdates: {
            path: 'response',
            persist: true
          }
        }
      },
      timeout: 45000,
      retryStrategy: {
        maxAttempts: 2,
        initialDelayMs: 1000,
        maxDelayMs: 3000,
        backoffMultiplier: 2,
        jitterEnabled: true,
        retryableErrors: ['TIMEOUT']
      },
      errorHandling: {
        strategy: 'continue',
        fallbackAction: 'skip_risk_update'
      }
    }
  ],
  sharedContext: {
    variables: [
      {
        name: 'reviewId',
        type: 'string',
        required: true,
        description: 'Unique identifier for this review cycle'
      },
      {
        name: 'reviewDate',
        type: 'datetime',
        required: true,
        description: 'Date of the review'
      }
    ],
    artifacts: [
      {
        name: 'complianceReport',
        type: 'document',
        description: 'Monthly compliance review report'
      }
    ]
  },
  successCriteria: {
    conditions: [
      {
        type: 'step_completion',
        description: 'All review steps must complete',
        required: true
      }
    ],
    actions: [
      {
        condition: 'success',
        action: 'generate_report',
        description: 'Generate compliance review report'
      }
    ]
  },
  fallbackStrategy: {
    type: 'manual_review',
    description: 'Fall back to manual review process',
    actions: [
      {
        trigger: 'workflow_failure',
        action: 'create_manual_review_task',
        description: 'Create manual review task'
      }
    ]
  },
  timeout: 180000, // 3 minutes
  metadata: {
    category: 'compliance',
    priority: 'medium',
    estimatedDuration: 120000, // 2 minutes
    requiredPermissions: ['compliance_review'],
    tags: ['compliance', 'review', 'monitoring'],
    version: '1.0.0',
    lastUpdated: '2024-01-01T00:00:00Z',
    createdBy: 'system',
    approvedBy: 'compliance_team'
  }
};

export { supplierOnboardingWorkflow, complianceReviewWorkflow };