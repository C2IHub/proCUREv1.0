import React from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Play, 
  Pause,
  RotateCcw,
  Loader
} from 'lucide-react';
import { WorkflowExecution, StepExecution } from '../types/agents';

interface WorkflowStatusProps {
  execution: WorkflowExecution;
  onCancel?: () => void;
  onRetry?: () => void;
}

export default function WorkflowStatus({ execution, onCancel, onRetry }: WorkflowStatusProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'initializing':
      case 'running':
        return <Loader className="h-5 w-5 animate-spin text-blue-600" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'cancelled':
        return <Pause className="h-5 w-5 text-gray-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'initializing':
      case 'running':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'cancelled':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Loader className="h-4 w-4 animate-spin text-blue-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'skipped':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'pending':
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const calculateProgress = () => {
    const completedSteps = execution.steps.filter(s => s.status === 'completed').length;
    return Math.round((completedSteps / execution.steps.length) * 100);
  };

  const progress = calculateProgress();
  const duration = execution.timeline.endTime 
    ? execution.timeline.endTime.getTime() - execution.timeline.startTime.getTime()
    : Date.now() - execution.timeline.startTime.getTime();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          {getStatusIcon(execution.status)}
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Workflow Execution
            </h3>
            <p className="text-sm text-gray-600">
              ID: {execution.executionId}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(execution.status)}`}>
            {execution.status.toUpperCase()}
          </span>
          {execution.status === 'running' && onCancel && (
            <button
              onClick={onCancel}
              className="px-3 py-1 text-sm text-red-600 hover:text-red-700 border border-red-300 rounded-lg hover:bg-red-50"
            >
              Cancel
            </button>
          )}
          {execution.status === 'failed' && onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Retry
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-600">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              execution.status === 'completed' ? 'bg-green-500' :
              execution.status === 'failed' ? 'bg-red-500' :
              execution.status === 'running' ? 'bg-blue-500' : 'bg-gray-400'
            }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Execution Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div>
          <p className="text-sm font-medium text-gray-600">Started</p>
          <p className="text-sm text-gray-900">
            {execution.timeline.startTime.toLocaleTimeString()}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Duration</p>
          <p className="text-sm text-gray-900">
            {formatDuration(duration)}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Steps</p>
          <p className="text-sm text-gray-900">
            {execution.currentStep + 1} / {execution.steps.length}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Cost</p>
          <p className="text-sm text-gray-900">
            ${execution.cost.totalCost.toFixed(4)}
          </p>
        </div>
      </div>

      {/* Steps */}
      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-4">Execution Steps</h4>
        <div className="space-y-3">
          {execution.steps.map((step, index) => (
            <div 
              key={step.stepId}
              className={`flex items-center p-3 rounded-lg border ${
                index === execution.currentStep ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center flex-1">
                {getStepStatusIcon(step.status)}
                <div className="ml-3">
                  <p className="font-medium text-gray-900">{step.stepId}</p>
                  <p className="text-sm text-gray-600">Agent: {step.agentId}</p>
                </div>
              </div>
              <div className="text-right">
                {step.duration && (
                  <p className="text-sm text-gray-600">
                    {formatDuration(step.duration)}
                  </p>
                )}
                <p className="text-xs text-gray-500 capitalize">
                  {step.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Error Details */}
      {execution.errorDetails && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center mb-2">
            <XCircle className="h-5 w-5 text-red-600 mr-2" />
            <h5 className="font-medium text-red-900">Execution Error</h5>
          </div>
          <p className="text-sm text-red-700 mb-2">
            {execution.errorDetails.message}
          </p>
          <p className="text-xs text-red-600">
            Code: {execution.errorDetails.code} | 
            Severity: {execution.errorDetails.severity} |
            Time: {execution.errorDetails.timestamp.toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}