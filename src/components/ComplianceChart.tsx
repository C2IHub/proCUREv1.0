import React from 'react';
import { useComplianceData } from '../hooks/useApi';

export default function ComplianceChart() {
  const { data: chartData = [], isLoading, error } = useComplianceData();

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Compliance Trends</h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Compliant</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Warning</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Critical</span>
            </div>
          </div>
        </div>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-pulse text-gray-500">Loading compliance data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Compliance Trends</h3>
        </div>
        <div className="h-64 flex items-center justify-center">
          <div className="text-red-500">Error loading compliance data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Compliance Trends</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Compliant</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Warning</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Critical</span>
          </div>
        </div>
      </div>
      
      <div className="h-64 flex items-end justify-between space-x-4">
        {chartData.map((item, index) => {
          const total = item.compliant + item.warning + item.critical;
          const compliantHeight = (item.compliant / total) * 200;
          const warningHeight = (item.warning / total) * 200;
          const criticalHeight = (item.critical / total) * 200;
          
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="flex flex-col w-full max-w-12 mb-2">
                <div 
                  className="bg-red-500 rounded-t"
                  style={{ height: `${criticalHeight}px` }}
                ></div>
                <div 
                  className="bg-yellow-500"
                  style={{ height: `${warningHeight}px` }}
                ></div>
                <div 
                  className="bg-green-500 rounded-b"
                  style={{ height: `${compliantHeight}px` }}
                ></div>
              </div>
              <span className="text-xs text-gray-600 mt-2">{item.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}