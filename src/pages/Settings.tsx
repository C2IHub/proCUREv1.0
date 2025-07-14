import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Database, Zap, Save } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'integrations', name: 'Integrations', icon: Database },
    { id: 'agents', name: 'AI Agents', icon: Zap }
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account and application preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className={`mr-3 h-4 w-4 ${
                    activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {activeTab === 'profile' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      defaultValue="Sarah Chen"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue="sarah.chen@company.com"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Compliance Manager</option>
                      <option>Procurement Manager</option>
                      <option>Quality Manager</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Risk Alerts</h4>
                      <p className="text-sm text-gray-600">Get notified about high-risk suppliers</p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Compliance Deadlines</h4>
                      <p className="text-sm text-gray-600">Reminders for upcoming compliance deadlines</p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">RFP Updates</h4>
                      <p className="text-sm text-gray-600">Updates on RFP responses and evaluations</p>
                    </div>
                    <input type="checkbox" className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600 mb-3">Add an extra layer of security to your account</p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Enable 2FA
                    </button>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Session Timeout</h4>
                    <select className="w-full max-w-xs p-3 border border-gray-300 rounded-lg">
                      <option>30 minutes</option>
                      <option>1 hour</option>
                      <option>4 hours</option>
                      <option>8 hours</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Integrations</h3>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">AWS Bedrock</h4>
                        <p className="text-sm text-gray-600">AI agent integration for compliance analysis</p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Connected</span>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Database Connection</h4>
                        <p className="text-sm text-gray-600">Primary data source for supplier information</p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Connected</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'agents' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Agent Configuration</h3>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Compliance Agent</h4>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Analyzes supplier compliance with regulatory standards</p>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">Configure</button>
                      <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">View Logs</button>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Risk Assessment Agent</h4>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Performs predictive risk analysis and mitigation planning</p>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">Configure</button>
                      <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">View Logs</button>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Document Validation Agent</h4>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Validates and processes supplier documentation</p>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">Configure</button>
                      <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">View Logs</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}