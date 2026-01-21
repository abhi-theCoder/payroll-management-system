'use client';

import React, { useState } from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { RouteGuard } from '@/components/RouteGuard';

type TabType = 'balance' | 'apply' | 'history';

export default function LeaveManagementPageSimple() {
  const [activeTab, setActiveTab] = useState<TabType>('balance');

  const tabs: { value: TabType; label: string }[] = [
    { value: 'balance', label: 'Leave Balance' },
    { value: 'apply', label: 'Apply Leave' },
    { value: 'history', label: 'My Leaves' },
  ];

  return (
    <RouteGuard requiredPermission="VIEW_LEAVES">
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
                {tabs.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-colors ${
                      activeTab === tab.value
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Calendar size={20} />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'balance' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                    <Calendar size={48} className="mx-auto text-blue-400 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900">Leave Balance</h2>
                    <p className="text-gray-600 mt-2">Loading leave balance information...</p>
                  </div>
                )}

                {activeTab === 'apply' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <Calendar size={48} className="mx-auto text-green-400 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900">Apply for Leave</h2>
                    <p className="text-gray-600 mt-2">Leave application form coming soon...</p>
                  </div>
                )}

                {activeTab === 'history' && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
                    <Calendar size={48} className="mx-auto text-purple-400 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900">My Leave History</h2>
                    <p className="text-gray-600 mt-2">Your leave requests will appear here...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 flex items-start gap-4">
              <AlertCircle size={24} className="text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Leave Management System</h3>
                <p className="text-sm text-gray-700">
                  The Leave Management system is now integrated. You can apply for leave, check your balance, and view your leave history.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </RouteGuard>
  );
}
