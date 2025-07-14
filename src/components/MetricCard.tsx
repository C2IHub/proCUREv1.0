import React from 'react';
import { DivideIcon as LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
  color: 'red' | 'green' | 'yellow' | 'blue';
}

export default function MetricCard({ title, value, change, trend, icon: Icon, color }: MetricCardProps) {
  const colorClasses = {
    red: 'bg-red-50 text-red-600 border-red-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200'
  };

  const trendColors = {
    up: trend === 'up' ? 'text-green-600' : 'text-red-600',
    down: trend === 'down' ? 'text-green-600' : 'text-red-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex items-center text-sm">
          {trend === 'up' ? (
            <TrendingUp className={`h-4 w-4 mr-1 ${trendColors.up}`} />
          ) : (
            <TrendingDown className={`h-4 w-4 mr-1 ${trendColors.down}`} />
          )}
          <span className={trend === 'up' ? 'text-green-600' : 'text-red-600'}>
            {change}
          </span>
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </div>
  );
}