# proCURE1 - Pharmaceutical Procurement & Compliance Platform

A modern React application for pharmaceutical supplier compliance management with AI-driven decision making powered by AWS Bedrock agents.

## Features

- **Multi-Supplier Support**: Dynamic routing and context for managing multiple suppliers
- **AI-Driven Compliance**: Integration with AWS Bedrock agents for compliance analysis, risk assessment, and document validation
- **Real-time Data**: React Query integration for efficient data fetching and caching
- **Comprehensive Analytics**: Supplier scoring, risk mitigation, and audit trails
- **Modern UI**: Built with React, TypeScript, and TailwindCSS

## Prerequisites

- Node.js 18+ and npm
- AWS Account with Bedrock access (for AI features)
- Modern web browser

## Quick Start

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd proCURE1
npm install
```

2. **Start the development server:**
```bash
npm run dev
```

3. **Build for production:**
```bash
npm run build
```

## AWS Bedrock Configuration

To enable AI agent functionality, you'll need to configure AWS Bedrock agents:

### 1. Set up AWS Credentials

Configure AWS credentials using one of these methods:

**Option A: AWS CLI**
```bash
aws configure
```

**Option B: Environment Variables**
```bash
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_DEFAULT_REGION=us-east-1
```

**Option C: IAM Roles** (recommended for production)
Use IAM roles when running on AWS infrastructure.

### 2. Create Bedrock Agents

Create three Bedrock agents in your AWS account:

1. **Compliance Agent**: For analyzing EU GMP, FDA, and other regulatory compliance
2. **Risk Assessment Agent**: For predictive risk analysis and mitigation strategies  
3. **Document Validation Agent**: For validating and processing supplier documentation

### 3. Configure Agent IDs

Update the BedrockAgentProvider with your agent configurations:

```typescript
// In src/context/BedrockAgentProvider.tsx
const bedrockConfig = {
  compliance: {
    region: 'us-east-1',
    agentId: 'your-compliance-agent-id',
    agentAliasId: 'your-compliance-agent-alias-id'
  },
  risk: {
    region: 'us-east-1', 
    agentId: 'your-risk-agent-id',
    agentAliasId: 'your-risk-agent-alias-id'
  },
  document: {
    region: 'us-east-1',
    agentId: 'your-document-agent-id', 
    agentAliasId: 'your-document-agent-alias-id'
  }
};
```

### 4. Required IAM Permissions

Your AWS credentials need the following permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeAgent",
        "bedrock:InvokeModel"
      ],
      "Resource": [
        "arn:aws:bedrock:*:*:agent/*",
        "arn:aws:bedrock:*:*:agent-alias/*"
      ]
    }
  ]
}
```

## Development Mode

In development mode, the application uses mock AI agents that simulate real Bedrock responses. This allows you to develop and test without AWS credentials.

To use real Bedrock agents, set the environment variable:
```bash
export NODE_ENV=production
```

## API Integration

The application is designed to work with a REST API backend. Currently, it uses mock data for demonstration. To integrate with your backend:

1. Update the API endpoints in `src/api/mockApi.ts`
2. Replace mock functions with real HTTP calls
3. Configure authentication and error handling as needed

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── api/           # API service layer and mock data
├── components/    # Reusable UI components
├── context/       # React context providers (Bedrock, Supplier)
├── hooks/         # Custom React hooks and React Query hooks
├── pages/         # Page components and routing
├── types/         # TypeScript type definitions
└── App.tsx        # Main application component
```

## Key Technologies

- **Frontend**: React 18, TypeScript, React Router
- **Styling**: TailwindCSS, Lucide React icons
- **State Management**: React Query for server state
- **AI Integration**: AWS Bedrock SDK
- **Build Tool**: Vite
- **Code Quality**: ESLint, TypeScript

## Contributing

1. Follow the existing code style and TypeScript patterns
2. Add proper type definitions for new features
3. Include loading and error states for async operations
4. Test changes with both mock and real data
5. Update documentation for new features

## License

This project is licensed under the MIT License.
