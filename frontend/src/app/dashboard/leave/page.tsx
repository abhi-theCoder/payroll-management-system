'use client';

import React, { useState } from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { RouteGuard } from '@/components/RouteGuard';
import { Permission } from '@/config/rbac';

type TabType = 'balance' | 'apply' | 'history' | 'approvals' | 'settings';

export default function LeaveManagementPage() {
  const [activeTab, setActiveTab] = useState<TabType>('balance');

  const tabs: { value: TabType; label: string; icon: React.ReactNode; show: boolean }[] = [
    {
      value: 'balance',
      label: 'Leave Balance',
      icon: <Calendar size={20} />,
      show: true,
    },
    {
      value: 'apply',
      label: 'Apply Leave',
      icon: <Calendar size={20} />,
      show: true,
    },
    {
      value: 'history',
      label: 'My Leaves',
      icon: <Calendar size={20} />,
      show: true,
    },
    {
      value: 'approvals',
      label: 'Pending Approvals',
      icon: <Calendar size={20} />,
      show: false, // For now
    },
    {
      value: 'settings',
      label: 'Policy Settings',
      icon: <Calendar size={20} />,
      show: false, // For now
    },
  ];

  return (
    <RouteGuard requiredPermission={Permission.VIEW_LEAVE}>
      <DashboardLayout>
        <div className="min-h-screen bg-gray-100 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Calendar size={32} className="text-blue-600" />
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">Leave Management</h1>
                  <p className="text-gray-600 mt-1">Manage your leave requests and view balance</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-8 bg-white rounded-lg shadow">
              <div className="flex flex-wrap border-b border-gray-200">
                {tabs
                  .filter((tab) => tab.show)
                  .map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => setActiveTab(tab.value)}
                      className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-colors ${
                        activeTab === tab.value
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'balance' && (
                  <div className="text-center py-12">
                    <Calendar size={48} className="mx-auto text-blue-400 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900">Leave Balance</h2>
                    <p className="text-gray-600 mt-2">Your leave balance will appear here</p>
                  </div>
                )}

                {activeTab === 'apply' && (
                  <div className="text-center py-12">
                    <Calendar size={48} className="mx-auto text-green-400 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900">Apply for Leave</h2>
                    <p className="text-gray-600 mt-2">Submit your leave request here</p>
                  </div>
                )}

                {activeTab === 'history' && (
                  <div className="text-center py-12">
                    <Calendar size={48} className="mx-auto text-purple-400 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900">Leave History</h2>
                    <p className="text-gray-600 mt-2">Your leave requests will appear here</p>
                  </div>
                )}
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 flex items-start gap-4">
              <AlertCircle size={24} className="text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Leave Management Information</h3>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>Leave balance is calculated based on your leave type</li>
                  <li>You can apply for leave and track your requests</li>
                  <li>Weekends and holidays are excluded from leave days</li>
                  <li>Leave requests go through approval workflow</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </RouteGuard>
  );
}
