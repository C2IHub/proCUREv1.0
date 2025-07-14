import React from 'react';
import { AlertTriangle, CheckCircle, FileText, Users, Clock } from 'lucide-react';
import { useRecentActivity } from '../hooks/useApi';

const iconMap = {
  'alert': AlertTriangle,
  'approval': CheckCircle,
  'update': Users,
  'upload': FileText,
};

const colorMap = {
  'high': 'text-red-600 bg-red-50',
  'medium': 'text-yellow-600 bg-yellow-50',
  'low': 'text-green-600 bg-green-50',
};

export default function RecentActivity() {
  const { data: activities = [], isLoading, error } = useRecentActivity();

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-start space-x-3 p-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 min-w-0">
                <div className="w-48 h-4 bg-gray-200 rounded mb-2"></div>
                <div className="w-64 h-3 bg-gray-200 rounded mb-1"></div>
                <div className="w-20 h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="flex items-center justify-center py-8">
          <div className="text-red-500">Error loading recent activity</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => {
          const IconComponent = iconMap[activity.type as keyof typeof iconMap] || Clock;
          const colorClass = colorMap[activity.priority] || 'text-gray-600 bg-gray-50';
          
          return (
            <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className={`p-2 rounded-lg ${colorClass}`}>
                <IconComponent className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 mb-1">{activity.title}</h4>
                <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
                <p className="text-xs text-gray-500">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}