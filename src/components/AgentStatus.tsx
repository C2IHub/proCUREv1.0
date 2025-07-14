import React from 'react';
import { Brain, Zap, Clock, CheckCircle } from 'lucide-react';

export default function AgentStatus() {
  const agents = [
    {
      name: 'EU GMP Analyzer',
      status: 'active',
      task: 'Analyzing 12 supplier certifications',
      progress: 75,
      icon: Brain
    },
    {
      name: 'FDA Compliance Checker',
      status: 'active',
      task: 'Processing new supplier onboarding',
      progress: 45,
      icon: Zap
    },
    {
      name: 'Risk Assessment Engine',
      status: 'idle',
      task: 'Waiting for next scheduled scan',
      progress: 100,
      icon: Clock
    },
    {
      name: 'Document Validator',
      status: 'completed',
      task: 'Validated 8 supplier documents',
      progress: 100,
      icon: CheckCircle
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'idle': return 'text-yellow-600 bg-yellow-50';
      case 'completed': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Agent Status</h3>
      <div className="space-y-4">
        {agents.map((agent, index) => (
          <div key={index} className="border border-gray-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${getStatusColor(agent.status)} mr-3`}>
                  <agent.icon className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{agent.name}</h4>
                  <p className="text-sm text-gray-600">{agent.task}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(agent.status)}`}>
                {agent.status}
              </span>
            </div>
            
            {agent.status === 'active' && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{agent.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${agent.progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}