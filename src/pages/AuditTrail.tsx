import React, { useState, useMemo } from 'react';
import { History, Search, Filter, Download, Eye, User, Bot, FileText, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { useAuditEvents } from '../hooks/useApi';
import AgenticInterface from '../components/AgenticInterface';

export default function AuditTrail() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: auditData, isLoading, error } = useAuditEvents(currentPage, 20);

  const filteredEvents = useMemo(() => {
    if (!auditData?.data) return [];
    
    return auditData.data.filter(event => {
      const matchesFilter = selectedFilter === 'all' || event.type === selectedFilter;
      const matchesSearch = event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (event.supplierName?.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }, [auditData?.data, selectedFilter, searchTerm]);

  const getImpactColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'compliance_check': return <CheckCircle className="h-5 w-5" />;
      case 'risk_assessment': return <AlertTriangle className="h-5 w-5" />;
      case 'document_upload': return <FileText className="h-5 w-5" />;
      case 'score_update': return <History className="h-5 w-5" />;
      case 'alert': return <AlertTriangle className="h-5 w-5" />;
      case 'approval': return <CheckCircle className="h-5 w-5" />;
      default: return <Clock className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Audit Trail</h1>
          <p className="text-gray-600">Complete history of AI decisions and human interventions</p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="w-48 h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="w-64 h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="w-32 h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Audit Trail</h1>
          <p className="text-gray-600">Complete history of AI decisions and human interventions</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800">Error loading audit events. Please try again.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Audit Trail</h1>
        <p className="text-gray-600">Complete history of AI decisions and human interventions</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filter by type:</span>
            </div>
            <div className="flex space-x-2">
              {['all', 'compliance_check', 'risk_assessment', 'document_upload', 'alert'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg capitalize transition-colors ${
                    selectedFilter === filter
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              {/* Icon */}
              <div className={`p-3 rounded-lg ${getImpactColor(event.severity)}`}>
                {getCategoryIcon(event.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-gray-900">{event.type.replace('_', ' ').toUpperCase()}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getImpactColor(event.severity)}`}>
                      {event.severity}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                    <button className="flex items-center text-blue-600 hover:text-blue-700 text-sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-3">{event.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {event.supplierName && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium">Supplier:</span>
                        <span className="ml-1">{event.supplierName}</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium">Status:</span>
                      <span className={`ml-1 capitalize ${
                        event.status === 'completed' ? 'text-green-600' :
                        event.status === 'pending' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {event.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="h-4 w-4 mr-1" />
                    <span>System Event</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <History className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No audit events found</h3>
          <p className="text-gray-600">Try adjusting your filters or search terms</p>
        </div>
      )}

      {/* Pagination */}
      {auditData && auditData.total > auditData.pageSize && (
        <div className="mt-8 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-gray-600">
              Page {currentPage} of {Math.ceil(auditData.total / auditData.pageSize)}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={!auditData.hasNext}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

    </div>
  );
}