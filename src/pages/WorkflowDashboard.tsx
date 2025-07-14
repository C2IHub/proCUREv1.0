import React, { useState } from 'react';
import { 
  Play, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Users, 
  FileText,
  Settings,
  Plus,
  Filter,
  Search
} from 'lucide-react';
import { 
  useWorkflowDefinitions, 
  useSupplierOnboarding, 
  useComplianceReview,
  useCreateExecutionContext 
} from '../hooks/useWorkflows';
import WorkflowStatus from '../components/WorkflowStatus';

export default function WorkflowDashboard() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [showExecutionModal, setShowExecutionModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: workflows = [], isLoading: workflowsLoading } = useWorkflowDefinitions();
  const supplierOnboarding = useSupplierOnboarding();
  const complianceReview = useComplianceReview();
  const createContext = useCreateExecutionContext();

  const handleStartWorkflow = async (workflowId: string) => {
    switch (workflowId) {
      case 'supplier-onboarding':
        await supplierOnboarding.startOnboarding({
          supplierId: 'SUP999',
          supplierName: 'Demo Supplier',
          category: 'Primary Packaging',
          uploadedDocuments: [
            { name: 'ISO Certificate.pdf', type: 'certification', uploadDate: new Date() },
            { name: 'Quality Manual.pdf', type: 'documentation', uploadDate: new Date() }
          ],
          primaryContact: {
            name: 'John Demo',
            email: 'john@demosupplier.com',
            phone: '+1-555-0123'
          }
        });
        break;
      case 'compliance-review':
        await complianceReview.startReview(['SUP001', 'SUP002', 'SUP003'], 'monthly');
        break;
    }
    setShowExecutionModal(false);
  };

  const getWorkflowIcon = (workflowId: string) => {
    switch (workflowId) {
      case 'supplier-onboarding':
        return <Users className="h-6 w-6" />;
      case 'compliance-review':
        return <FileText className="h-6 w-6" />;
      default:
        return <Settings className="h-6 w-6" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'text-blue-600 bg-blue-50';
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredWorkflows = workflows.filter(workflow =>
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (workflowsLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading workflows...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Workflow Dashboard</h1>
        <p className="text-gray-600">Manage and monitor automated workflows</p>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Play className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Workflows</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Today</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Duration</p>
              <p className="text-2xl font-bold text-gray-900">4.2m</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-50 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search workflows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Workflow Definitions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {filteredWorkflows.map((workflow) => (
          <div key={workflow.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="p-3 bg-blue-50 rounded-lg mr-4">
                  {getWorkflowIcon(workflow.id)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{workflow.name}</h3>
                  <p className="text-sm text-gray-600">{workflow.description}</p>
                </div>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                v{workflow.version}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Steps</p>
                <p className="text-sm text-gray-900">{workflow.steps.length}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Est. Duration</p>
                <p className="text-sm text-gray-900">
                  {Math.round(workflow.metadata.estimatedDuration / 60000)}m
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Priority</p>
                <p className="text-sm text-gray-900 capitalize">{workflow.metadata.priority}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Category</p>
                <p className="text-sm text-gray-900">{workflow.metadata.category}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                {workflow.metadata.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                    {tag}
                  </span>
                ))}
              </div>
              <button
                onClick={() => {
                  setSelectedWorkflow(workflow.id);
                  setShowExecutionModal(true);
                }}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Play className="h-4 w-4 mr-2" />
                Start
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Executions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Executions</h3>
        <div className="space-y-3">
          {/* Mock recent executions */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-green-50 rounded-lg mr-3">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Supplier Onboarding</p>
                <p className="text-sm text-gray-600">Completed 2 minutes ago</p>
              </div>
            </div>
            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
              Completed
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg mr-3">
                <Clock className="h-4 w-4 text-blue-600 animate-spin" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Compliance Review</p>
                <p className="text-sm text-gray-600">Running for 1 minute</p>
              </div>
            </div>
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              Running
            </span>
          </div>
        </div>
      </div>

      {/* Execution Modal */}
      {showExecutionModal && selectedWorkflow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Start Workflow
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to start the {workflows.find(w => w.id === selectedWorkflow)?.name} workflow?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowExecutionModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStartWorkflow(selectedWorkflow)}
                disabled={supplierOnboarding.isLoading || complianceReview.isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {supplierOnboarding.isLoading || complianceReview.isLoading ? 'Starting...' : 'Start'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}