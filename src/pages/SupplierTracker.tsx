import React, { useState } from 'react';
import { Building2, Shield, AlertTriangle, CheckCircle, ExternalLink, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Supplier {
  id: string;
  name: string;
  category: string;
  complianceScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  certifications: string[];
  lastAudit: string;
  status: 'active' | 'pending' | 'suspended';
}

const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'TechCorp Solutions',
    category: 'Technology Services',
    complianceScore: 92,
    riskLevel: 'low',
    certifications: ['ISO 27001', 'SOC 2', 'GDPR'],
    lastAudit: '2024-01-15',
    status: 'active'
  },
  {
    id: '2',
    name: 'Global Manufacturing Inc',
    category: 'Manufacturing',
    complianceScore: 78,
    riskLevel: 'medium',
    certifications: ['ISO 9001', 'ISO 14001'],
    lastAudit: '2023-12-10',
    status: 'active'
  },
  {
    id: '3',
    name: 'DataSecure Ltd',
    category: 'Data Processing',
    complianceScore: 65,
    riskLevel: 'high',
    certifications: ['SOC 2'],
    lastAudit: '2023-11-20',
    status: 'pending'
  },
  {
    id: '4',
    name: 'CloudServices Pro',
    category: 'Cloud Infrastructure',
    complianceScore: 88,
    riskLevel: 'low',
    certifications: ['ISO 27001', 'SOC 2', 'PCI DSS', 'HIPAA'],
    lastAudit: '2024-01-08',
    status: 'active'
  },
  {
    id: '5',
    name: 'LogisticFlow Systems',
    category: 'Logistics',
    complianceScore: 74,
    riskLevel: 'medium',
    certifications: ['ISO 9001'],
    lastAudit: '2023-12-22',
    status: 'active'
  }
];

const SupplierTracker: React.FC = () => {
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>('1'); // First supplier selected by default
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredSuppliers = mockSuppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getComplianceColor = (score: number) => {
    if (score >= 85) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  const handleViewPortal = () => {
    if (selectedSupplier) {
      navigate(`/supplier/${selectedSupplier}/portal`);
    }
  };

  const handleAnalyzeCompliance = () => {
    if (selectedSupplier) {
      navigate(`/supplier/${selectedSupplier}/reasoning`);
    }
  };

  const totalSuppliers = mockSuppliers.length;
  const activeSuppliers = mockSuppliers.filter(s => s.status === 'active').length;
  const highRiskSuppliers = mockSuppliers.filter(s => s.riskLevel === 'high').length;
  const avgComplianceScore = Math.round(mockSuppliers.reduce((sum, s) => sum + s.complianceScore, 0) / totalSuppliers);

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Supplier Tracker</h1>
          <p className="text-gray-600">Monitor and manage supplier compliance and risk</p>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Suppliers</p>
              <p className="text-2xl font-bold text-gray-900">{totalSuppliers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Suppliers</p>
              <p className="text-2xl font-bold text-gray-900">{activeSuppliers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Risk</p>
              <p className="text-2xl font-bold text-gray-900">{highRiskSuppliers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Compliance</p>
              <p className="text-2xl font-bold text-gray-900">{avgComplianceScore}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Selected Supplier Actions - Moved to Top */}
      {selectedSupplier && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Selected: {filteredSuppliers.find(s => s.id === selectedSupplier)?.name}
                </h3>
                <p className="text-xs text-gray-600">Choose an action for this supplier</p>
              </div>
              <div className="flex space-x-3">
                <button className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                  onClick={handleViewPortal}
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Portal
                </button>
                <button className="flex items-center px-3 py-1.5 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 text-sm">
                  onClick={handleAnalyzeCompliance}
                  <Shield className="h-4 w-4 mr-2" />
                  Analyze Compliance
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suppliers Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Compliance Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Certifications
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Audit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSuppliers.map((supplier) => (
                <tr
                  key={supplier.id}
                  onClick={() => setSelectedSupplier(supplier.id)}
                  className={`cursor-pointer hover:bg-gray-50 ${
                    selectedSupplier === supplier.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                      <div className="text-sm text-gray-500">{supplier.category}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getComplianceColor(supplier.complianceScore)}`}>
                      {supplier.complianceScore}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getRiskColor(supplier.riskLevel)}`}>
                      {supplier.riskLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {supplier.certifications.length} certifications
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(supplier.lastAudit).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(supplier.status)}`}>
                      {supplier.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SupplierTracker;