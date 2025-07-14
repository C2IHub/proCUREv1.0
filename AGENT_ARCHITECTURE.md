# proCURE Agent System Architecture

## Overview

The proCURE Agent System is a comprehensive AI-powered platform for pharmaceutical procurement and compliance management. It implements a multi-agent architecture with workflow orchestration, real-time monitoring, and enterprise-grade security features.

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend (React/TypeScript)                  │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   UI Components │  │  Agent Interface│  │ Workflow Dashboard│ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                    Agent System Layer                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ Agent Registry  │  │  Orchestrator   │  │ Workflow Engine │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                    Agent Implementation Layer                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ Compliance Agent│  │   Risk Agent    │  │ Document Agent  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                    AWS Bedrock Integration                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ Bedrock Agents  │  │   Claude Models │  │  Knowledge Base │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Agent System Provider (`src/context/AgentSystemProvider.tsx`)

**Purpose**: Central provider for the entire agent system
**Key Features**:
- Agent registry initialization
- Feature flag management
- System health monitoring
- Configuration management

**Dependencies**:
- Agent Registry
- Agent Orchestrator
- Feature flags configuration

### 2. Agent Registry (`src/agents/registry/AgentRegistry.ts`)

**Purpose**: Central registry for managing all agents
**Key Features**:
- Agent registration and discovery
- Health monitoring
- Capability management
- Dependency validation

**Key Methods**:
```typescript
registerAgent(agentId: AgentId, agent: BaseAgent, config: AgentConfig): void
getAgent(agentId: AgentId): BaseAgent
getAgentsForCapability(capability: string): AgentId[]
validateDependencies(): DependencyValidationResult
```

### 3. Agent Orchestrator (`src/agents/orchestration/AgentOrchestrator.ts`)

**Purpose**: Coordinates agent invocations and workflow execution
**Key Features**:
- Single agent invocation
- Multi-agent workflow execution
- Execution queue management
- Performance monitoring

**Key Methods**:
```typescript
invokeAgent(request: AgentInvokeRequest): Promise<AgentInvokeResponse>
executeWorkflow(workflow: WorkflowDefinition, context: AgentExecutionContext): Promise<WorkflowExecution>
```

### 4. Workflow Engine (`src/agents/orchestration/WorkflowEngine.ts`)

**Purpose**: Executes multi-agent workflows with different coordination patterns
**Key Features**:
- Sequential execution
- Parallel execution
- Conditional execution
- Event-driven execution

**Coordination Patterns**:
- **Sequential**: Steps execute one after another
- **Parallel**: Independent steps execute concurrently
- **Conditional**: Steps execute based on conditions
- **Event-driven**: Steps execute based on events

### 5. Base Agent (`src/agents/core/BaseAgent.ts`)

**Purpose**: Abstract base class for all agents
**Key Features**:
- Template method pattern
- Security validation
- Rate limiting
- Performance tracking
- Memory management
- Caching

**Abstract Methods** (must be implemented by concrete agents):
```typescript
defineCapabilities(): BaseAgentCapabilities
buildPrompt(request: AgentInvokeRequest): Promise<string>
parseResponse(response: any, request: AgentInvokeRequest): Promise<AgentInvokeResponse>
validateInput(request: AgentInvokeRequest): Promise<ValidationResult>
```

## Agent Implementations

### 1. Compliance Monitor Agent (`src/agents/implementations/ComplianceMonitorAgent.ts`)

**Purpose**: Regulatory analysis and certification tracking
**Capabilities**:
- `regulatory_analysis`
- `certification_tracking`
- `audit_scheduling`
- `violation_detection`
- `compliance_scoring`

**Supported Workflows**:
- `supplier_onboarding`
- `compliance_review`
- `audit_workflow`

### 2. Risk Predictor Agent (`src/agents/implementations/RiskPredictorAgent.ts`)

**Purpose**: Financial and operational risk analysis
**Capabilities**:
- `financial_risk_analysis`
- `supply_chain_assessment`
- `operational_risk_evaluation`
- `predictive_modeling`
- `geopolitical_risk_analysis`

**Dependencies**: `compliance-monitor`

### 3. Document Intelligence Agent (`src/agents/implementations/DocumentIntelligenceAgent.ts`)

**Purpose**: Document validation and content extraction
**Capabilities**:
- `document_validation`
- `content_extraction`
- `format_compliance_check`
- `anomaly_detection`
- `document_classification`

## AWS Bedrock Integration

### Required AWS Services

1. **Amazon Bedrock Agents**
   - Service for creating and managing AI agents
   - Handles prompt engineering and response generation
   - Provides built-in memory and conversation management

2. **Amazon Bedrock Runtime**
   - Service for invoking Bedrock agents
   - Handles authentication and request routing
   - Provides streaming and batch processing capabilities

3. **Claude Models**
   - Primary AI model: `anthropic.claude-3-sonnet-20240229-v1:0`
   - Used for natural language processing and reasoning
   - Provides high-quality responses with reasoning capabilities

### AWS Configuration Requirements

#### 1. IAM Permissions

Create an IAM policy with the following permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeAgent",
        "bedrock:InvokeModel",
        "bedrock:GetAgent",
        "bedrock:GetAgentAlias"
      ],
      "Resource": [
        "arn:aws:bedrock:*:*:agent/*",
        "arn:aws:bedrock:*:*:agent-alias/*",
        "arn:aws:bedrock:*:*:foundation-model/*"
      ]
    }
  ]
}
```

#### 2. Environment Variables

Set the following environment variables:

```bash
# AWS Configuration
VITE_AWS_REGION=us-east-1

# Bedrock Agent IDs (to be created in AWS Console)
VITE_COMPLIANCE_AGENT_ID=your-compliance-agent-id
VITE_RISK_AGENT_ID=your-risk-agent-id
VITE_DOCUMENT_AGENT_ID=your-document-agent-id
VITE_REQUIREMENTS_AGENT_ID=your-requirements-agent-id
VITE_COMMUNICATION_AGENT_ID=your-communication-agent-id
VITE_WORKFLOW_AGENT_ID=your-workflow-agent-id
VITE_PERFORMANCE_AGENT_ID=your-performance-agent-id
VITE_AUDIT_AGENT_ID=your-audit-agent-id
VITE_SUSTAINABILITY_AGENT_ID=your-sustainability-agent-id
VITE_FINANCIAL_AGENT_ID=your-financial-agent-id
```

#### 3. Bedrock Agent Creation

For each agent, create a Bedrock agent in the AWS Console with:

**Agent Configuration**:
- Model: `anthropic.claude-3-sonnet-20240229-v1:0`
- Instructions: Agent-specific prompt templates
- Memory: Enabled for conversation context
- Timeout: 30 seconds

**Example Agent Instructions for Compliance Monitor**:
```
You are a Compliance Monitor Agent for pharmaceutical procurement. Your role is to:

1. Analyze regulatory compliance across EU GMP, FDA, and ISO standards
2. Track certification status and expiration dates
3. Identify compliance gaps and violations
4. Provide actionable compliance recommendations
5. Schedule audits and compliance reviews

Always provide structured responses with:
- Current compliance status
- Identified risks and gaps
- Specific regulatory requirements
- Actionable recommendations
- Timeline for compliance actions

Focus on pharmaceutical industry regulations and maintain high accuracy in compliance assessments.
```

## Workflow Definitions

### 1. Supplier Onboarding Workflow

**File**: `src/agents/workflows/SupplierOnboardingWorkflow.ts`

**Steps**:
1. **Document Validation** (Document Agent)
2. **Requirements Extraction** (Requirements Agent)
3. **Compliance Assessment** (Compliance Agent)
4. **Risk Assessment** (Risk Agent)
5. **Workflow Setup** (Workflow Agent)
6. **Communication Setup** (Communication Agent)

**Coordination**: Sequential execution with dependencies

### 2. Compliance Review Workflow

**Steps**:
1. **Compliance Check** (Compliance Agent)
2. **Risk Update** (Risk Agent)

**Coordination**: Parallel execution

## Security Architecture

### 1. Security Validator (`src/agents/core/SecurityValidator.ts`)

**Features**:
- Input validation and sanitization
- Injection attack detection
- Rate limiting enforcement
- Content policy checking
- User permission validation

**Security Patterns Detected**:
- SQL injection
- Script injection
- Command injection
- Path traversal
- LDAP injection
- XPath injection

### 2. Rate Limiter (`src/agents/core/RateLimiter.ts`)

**Features**:
- Per-user rate limiting
- Per-agent rate limiting
- Burst protection
- Exponential backoff

**Limits**:
- 60 requests per minute per user
- 1000 requests per hour per user
- 10 burst requests with cooldown

## Performance Monitoring

### 1. Performance Tracker (`src/agents/core/PerformanceTracker.ts`)

**Metrics Tracked**:
- Response times (P50, P95, P99)
- Token usage and costs
- Memory consumption
- Error rates
- Success rates

### 2. Health Monitor (`src/agents/registry/HealthMonitor.ts`)

**Features**:
- Continuous health checking
- Failure detection
- Recovery monitoring
- Health status reporting

## Memory Management

### Agent Memory (`src/agents/core/AgentMemory.ts`)

**Features**:
- Conversation history
- Variable storage
- Response caching
- Memory compression
- TTL-based cleanup

**Configuration**:
- Max conversation length: 50 messages
- Memory retention: 24 hours
- Cache TTL: 5 minutes
- Compression enabled for long conversations

## Feature Flags

### Agent Feature Flags

```typescript
agentFlags: {
  'compliance-monitor': {
    enabled: true,
    rolloutPercentage: 100,
    features: { 'advanced_analysis': true }
  },
  'risk-predictor': {
    enabled: true,
    rolloutPercentage: 100,
    features: { 'predictive_modeling': true }
  }
  // ... other agents
}
```

### Workflow Feature Flags

```typescript
workflowFlags: {
  'supplier-onboarding': {
    enabled: true,
    rolloutPercentage: 100,
    maxConcurrent: 5
  },
  'compliance-review': {
    enabled: true,
    rolloutPercentage: 100,
    maxConcurrent: 10
  }
}
```

## Implementation Steps

### Phase 1: AWS Setup

1. **Create AWS Account** and configure IAM permissions
2. **Set up Bedrock Agents** in AWS Console for each agent type
3. **Configure environment variables** with agent IDs
4. **Test connectivity** using AWS CLI or SDK

### Phase 2: Agent Configuration

1. **Update agent configurations** in `AgentSystemProvider.tsx`
2. **Implement agent-specific prompts** in each agent implementation
3. **Configure memory and performance settings**
4. **Set up security policies**

### Phase 3: Testing and Validation

1. **Test individual agents** using the agent interface
2. **Validate workflow execution** using the workflow dashboard
3. **Monitor performance metrics** and adjust configurations
4. **Test error handling** and recovery mechanisms

## Monitoring and Observability

### Metrics Dashboard

Access via `/workflows` page:
- Active workflow executions
- Agent performance metrics
- Error rates and types
- Cost tracking
- Health status

### Logging

- Agent invocation logs
- Workflow execution logs
- Error and exception logs
- Performance metrics logs
- Security violation logs

## Troubleshooting

### Common Issues

1. **Agent Not Found**: Check agent registration in registry
2. **AWS Permissions**: Verify IAM policies and credentials
3. **Rate Limiting**: Check rate limit configurations
4. **Memory Issues**: Monitor memory usage and cleanup
5. **Network Timeouts**: Adjust timeout configurations

### Debug Mode

Enable debug mode with:
```typescript
features: {
  debugMode: true,
  enableTracing: true
}
```

## Cost Optimization

### Token Usage Optimization

- Implement response caching
- Use conversation compression
- Optimize prompt engineering
- Monitor token consumption

### Resource Management

- Configure appropriate timeouts
- Implement circuit breakers
- Use batch processing where possible
- Monitor and alert on cost thresholds

## Security Best Practices

1. **Input Validation**: Always validate and sanitize inputs
2. **Rate Limiting**: Implement appropriate rate limits
3. **Authentication**: Use proper AWS credentials
4. **Encryption**: Use HTTPS for all communications
5. **Audit Logging**: Log all security-relevant events
6. **Regular Updates**: Keep dependencies updated

## Conclusion

The proCURE Agent System provides a robust, scalable, and secure platform for AI-powered pharmaceutical procurement and compliance management. The architecture supports enterprise-grade requirements with comprehensive monitoring, security, and performance optimization features.

For implementation support, refer to the individual component documentation and AWS Bedrock documentation for detailed configuration instructions.