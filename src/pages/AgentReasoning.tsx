import React, { useState, useEffect } from 'react';
import { Brain, Eye, CheckCircle, ArrowLeft, MessageSquare, Loader } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAgents, useSupplier } from '../hooks/useApi';
import { useComplianceAgent, useRiskAgent, useDocumentAgent } from '../context/BedrockAgentProvider';
import AgenticInterface from '../components/AgenticInterface';

export default function AgentReasoning() {
  const { id: supplierId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [expandedAgent, setExpandedAgent] = useState<string | null>('compliance-analyzer');
  const [agentResponse, setAgentResponse] = useState<string>('');
  const [isInvoking, setIsInvoking] = useState(false);
  const [selectedAgentType, setSelectedAgentType] = useState<'compliance' | 'risk' | 'document'>('compliance');

  const { data: agents = [], isLoading: agentsLoading } = useAgents();
  const { data: supplier, isLoading: supplierLoading } = useSupplier(supplierId || '');

  const complianceAgent = useComplianceAgent();
  const riskAgent = useRiskAgent();
  const documentAgent = useDocumentAgent();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'completed': return 'text-blue-600 bg-blue-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleAgentInvoke = async (agentType: 'compliance' | 'risk' | 'document') => {
    if (!supplier) return;

    setIsInvoking(true);
    setSelectedAgentType(agentType);

    try {
      let agent;
      let prompt = '';

      switch (agentType) {
        case 'compliance':
          agent = complianceAgent;
          prompt = `Analyze the compliance status for supplier "${supplier.name}" with the following details:
- Category: ${supplier.category}
- Current compliance score: ${supplier.complianceScore.overall}
- Risk level: ${supplier.riskScore.level}
- Certifications: ${supplier.certifications.join(', ')}
- Last audit: ${supplier.lastAudit}

Please provide a detailed compliance analysis including strengths, areas for improvement, and regulatory compliance status.`;
          break;

        case 'risk':
          agent = riskAgent;
          prompt = `Perform a risk assessment for supplier "${supplier.name}" with the following profile:
- Overall risk score: ${supplier.riskScore.overall}
- Risk level: ${supplier.riskScore.level}
- Risk trend: ${supplier.riskScore.trend}
- Category: ${supplier.category}

Analyze potential risks and provide recommendations for risk mitigation.`;
          break;

        case 'document':
          agent = documentAgent;
          prompt = `Validate documentation for supplier "${supplier.name}":
- Certifications: ${supplier.certifications.join(', ')}
- Last audit date: ${supplier.lastAudit}
- Category: ${supplier.category}

Review document completeness, validity, and compliance with current regulations.`;
          break;
      }

      const response = await agent.invoke({
        prompt,
        sessionId: `supplier-${supplier.id}-${Date.now()}`,
        context: { supplierId: supplier.id, supplierName: supplier.name }
      });

      setAgentResponse(response.response);
    } catch (error) {
      console.error('Error invoking agent:', error);
      setAgentResponse('Error occurred while analyzing. Please try again.');
    } finally {
      setIsInvoking(false);
    }
  };

  if (agentsLoading || supplierLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <Loader className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading agent data...</span>
        </div>
      </div>
    );
  }

  if (!supplier && supplierId) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800">Supplier not found.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Reasoning & Explainability</h1>
        <div className="flex items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-blue-600 hover:text-blue-800 mb-2">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Supplier Analytics
          </button>
        </div>
        <p className="text-gray-600">
          {supplier 
            ? `Explore how AI agents analyze compliance for ${supplier.name}`
            : 'Explore how AI agents make compliance decisions and understand their reasoning process'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Agents */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Active AI Agents</h3>
            <div className="space-y-4">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  onClick={() => setExpandedAgent(expandedAgent === agent.id ? null : agent.id)}
                  className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Brain className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-medium text-gray-900">{agent.name}</span>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(agent.status)}`}>
                      {agent.status}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{agent.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Confidence: {agent.confidence}%</span>
                    <span className="text-gray-500">{agent.lastUpdate}</span>
                  </div>

                  {expandedAgent === agent.id && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Confidence Level</span>
                          <span className="font-medium">{agent.confidence}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${agent.confidence}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* AI Agent Interaction */}
            {supplier && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Ask AI Agents</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => handleAgentInvoke('compliance')}
                    disabled={isInvoking}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
                  >
                    {isInvoking && selectedAgentType === 'compliance' ? (
                      <><Loader className="h-4 w-4 mr-2 animate-spin inline" />Analyzing...</>
                    ) : (
                      'Compliance Analysis'
                    )}
                  </button>
                  <button
                    onClick={() => handleAgentInvoke('risk')}
                    disabled={isInvoking}
                    className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 text-sm font-medium"
                  >
                    {isInvoking && selectedAgentType === 'risk' ? (
                      <><Loader className="h-4 w-4 mr-2 animate-spin inline" />Analyzing...</>
                    ) : (
                      'Risk Assessment'
                    )}
                  </button>
                  <button
                    onClick={() => handleAgentInvoke('document')}
                    disabled={isInvoking}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm font-medium"
                  >
                    {isInvoking && selectedAgentType === 'document' ? (
                      <><Loader className="h-4 w-4 mr-2 animate-spin inline" />Analyzing...</>
                    ) : (
                      'Document Validation'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Decision Breakdown / Agent Response */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {agentResponse ? 'AI Agent Analysis' : 'Decision Breakdown'}
              </h3>
              <div className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-blue-600 font-medium">Explainable AI</span>
              </div>
            </div>

            {agentResponse ? (
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <MessageSquare className="h-5 w-5 text-blue-600 mr-2" />
                    <h4 className="text-lg font-semibold text-gray-900">
                      {selectedAgentType.charAt(0).toUpperCase() + selectedAgentType.slice(1)} Agent Response
                    </h4>
                  </div>
                  {supplier && (
                    <p className="text-sm text-gray-600 mb-3">Analysis for: {supplier.name}</p>
                  )}
                </div>
                
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {agentResponse}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setAgentResponse('')}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    ← Back to overview
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Default decision breakdown for demo */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {supplier ? `${supplier.name} - Compliance Score: ${supplier.complianceScore.overall}%` : 'Sample Analysis'}
                  </h4>
                  <p className="text-gray-600">
                    {supplier 
                      ? `${supplier.riskScore.level.toUpperCase()} risk supplier with ${supplier.complianceScore.status} compliance status`
                      : 'High compliance score based on comprehensive analysis'
                    }
                  </p>
                </div>

                {supplier && (
                  <>
                    {/* Scoring Factors */}
                    <div>
                      <h5 className="text-md font-semibold text-gray-900 mb-4">Scoring Breakdown</h5>
                      <div className="space-y-3">
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">Compliance</span>
                            <span className="font-semibold text-gray-900">{supplier.complianceScore.overall}/100</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                supplier.complianceScore.overall >= 90 ? 'bg-green-500' :
                                supplier.complianceScore.overall >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${supplier.complianceScore.overall}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">Risk Score</span>
                            <span className="font-semibold text-gray-900">{supplier.riskScore.overall}/100</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                supplier.riskScore.overall <= 30 ? 'bg-green-500' :
                                supplier.riskScore.overall <= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${supplier.riskScore.overall}%` }}
                            ></div>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Key Findings */}
                    <div>
                      <h5 className="text-md font-semibold text-gray-900 mb-4">Key Findings</h5>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Certifications: {supplier.certifications.join(', ')}</span>
                        </div>
                        <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Risk Level: {supplier.riskScore.level.toUpperCase()}</span>
                        </div>
                        <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Supplier Rating: {supplier.supplierRating.toUpperCase()}</span>
                        </div>
                        <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Risk Level: {supplier.riskScore.level.toUpperCase()}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">
                    💡 <strong>Tip:</strong> Click the "Ask AI Agents" buttons above to get real-time analysis from our compliance, risk, and document validation agents.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}