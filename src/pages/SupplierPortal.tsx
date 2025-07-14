import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Upload, Shield, MessageCircle, FileText, Clock, CheckCircle, AlertTriangle, Download, ArrowLeft } from 'lucide-react';
import { useSupplier } from '../hooks/useApi';
import AgenticInterface from '../components/AgenticInterface';

export default function SupplierPortal() {
  const { id: supplierId } = useParams<{ id: string }>();
  const { data: supplier } = useSupplier(supplierId || '');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [uploadProgress, setUploadProgress] = useState(0);

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: Shield },
    { id: 'documents', name: 'Documents', icon: FileText },
    { id: 'communications', name: 'Communications', icon: MessageCircle },
    { id: 'submissions', name: 'RFP Submissions', icon: Upload }
  ];

  const complianceStatus = {
    overall: 92,
    euGMP: { status: 'compliant', score: 95, expires: '2025-06-15' },
    fda: { status: 'compliant', score: 88, expires: '2025-12-01' },
    iso15378: { status: 'compliant', score: 94, expires: '2025-09-30' },
    reach: { status: 'warning', score: 76, expires: '2024-03-15' }
  };

  const pendingActions = [
    {
      id: 1,
      type: 'document',
      title: 'REACH Compliance Update Required',
      description: 'Please submit updated REACH compliance documentation',
      priority: 'high',
      deadline: '2024-02-15'
    },
    {
      id: 2,
      type: 'certification',
      title: 'ISO 15378 Renewal Due',
      description: 'ISO 15378 certification expires in 6 months',
      priority: 'medium',
      deadline: '2024-09-30'
    },
    {
      id: 3,
      type: 'questionnaire',
      title: 'Sustainability Assessment',
      description: 'Complete the quarterly sustainability questionnaire',
      priority: 'low',
      deadline: '2024-02-28'
    }
  ];

  const recentDocuments = [
    {
      id: 1,
      name: 'EU GMP Certificate 2024',
      type: 'Certification',
      uploadDate: '2024-01-15',
      status: 'approved',
      size: '2.4 MB'
    },
    {
      id: 2,
      name: 'Quality Management Manual v3.2',
      type: 'Quality Documentation',
      uploadDate: '2024-01-10',
      status: 'under-review',
      size: '15.7 MB'
    },
    {
      id: 3,
      name: 'Sustainability Report Q4 2023',
      type: 'Sustainability',
      uploadDate: '2024-01-08',
      status: 'approved',
      size: '8.1 MB'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
      case 'approved': return 'text-green-600 bg-green-50';
      case 'warning':
      case 'under-review': return 'text-yellow-600 bg-yellow-50';
      case 'critical':
      case 'rejected': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Supplier Collaboration</h1>
        <div className="flex items-center">
          <button 
            onClick={() => window.history.back()} 
            className="flex items-center text-blue-600 hover:text-blue-800 mb-2">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Supplier Analytics
          </button>
        </div>
        <p className="text-gray-600">Secure collaboration platform for compliance documentation and communications</p>
      </div>

      {/* Supplier Info Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Welcome, {supplier?.name || 'Supplier'}
            </h2>
            <p className="text-gray-600">{supplier?.category || 'Supplier'} • Active Supplier</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {supplier?.complianceScore.overall || complianceStatus.overall}%
            </div>
            <p className="text-sm text-gray-600">Overall Compliance Score</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Compliance Overview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Status Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">EU GMP</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(complianceStatus.euGMP.status)}`}>
                      {complianceStatus.euGMP.status}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-green-600 mb-1">{complianceStatus.euGMP.score}%</div>
                  <p className="text-sm text-gray-600">Expires: {complianceStatus.euGMP.expires}</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">FDA</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(complianceStatus.fda.status)}`}>
                      {complianceStatus.fda.status}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-green-600 mb-1">{complianceStatus.fda.score}%</div>
                  <p className="text-sm text-gray-600">Expires: {complianceStatus.fda.expires}</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">ISO 15378</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(complianceStatus.iso15378.status)}`}>
                      {complianceStatus.iso15378.status}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-green-600 mb-1">{complianceStatus.iso15378.score}%</div>
                  <p className="text-sm text-gray-600">Expires: {complianceStatus.iso15378.expires}</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">REACH</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(complianceStatus.reach.status)}`}>
                      {complianceStatus.reach.status}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-yellow-600 mb-1">{complianceStatus.reach.score}%</div>
                  <p className="text-sm text-gray-600">Expires: {complianceStatus.reach.expires}</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentDocuments.slice(0, 3).map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-sm text-gray-600">{doc.type} • {doc.uploadDate}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(doc.status)}`}>
                      {doc.status.replace('-', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pending Actions */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Actions</h3>
              <div className="space-y-4">
                {pendingActions.map((action) => (
                  <div key={action.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{action.title}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(action.priority)}`}>
                        {action.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        Due: {action.deadline}
                      </div>
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        Take Action →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Document Management</h3>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Upload Zone */}
            <div className="lg:col-span-1">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-900 mb-1">Upload Documents</p>
                <p className="text-xs text-gray-600">PDF, DOC, or image files</p>
                <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                  Browse Files
                </button>
              </div>
            </div>

            {/* Document List */}
            <div className="lg:col-span-3">
              <div className="space-y-3">
                {recentDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center">
                      <FileText className="h-6 w-6 text-blue-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-sm text-gray-600">{doc.type} • {doc.size} • {doc.uploadDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(doc.status)}`}>
                        {doc.status.replace('-', ' ')}
                      </span>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'communications' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Communications Center</h3>
          <div className="text-center py-12">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Communications Feature</h4>
            <p className="text-gray-600">Secure messaging and collaboration tools will be available here.</p>
          </div>
        </div>
      )}

      {activeTab === 'submissions' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">RFP Submissions</h3>
          <div className="text-center py-12">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">RFP Submission Portal</h4>
            <p className="text-gray-600">Submit responses to active RFPs and track submission status.</p>
          </div>
        </div>
      )}

    </div>
  );
}