'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { DashboardLayout } from '@/components/DashboardLayout';

export default function PayrollPage() {
  const [activeTab, setActiveTab] = useState<'processing' | 'runs' | 'approval'>('processing');
  const [error, setError] = useState<string | null>(null);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payroll Management</h1>
            <p className="text-gray-600 mt-2">Process and manage payroll for all employees</p>
          </div>
          <Button variant="primary">+ Process Payroll</Button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6">
            <Alert type="error" message={error} onClose={() => setError(null)} />
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            {(
              [
                { id: 'processing', label: 'Payroll Processing' },
                { id: 'runs', label: 'Payroll Runs' },
                { id: 'approval', label: 'Approvals' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'processing' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Process Payroll</h2>
                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <h3 className="font-semibold text-gray-900 mb-4">Payroll Period</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Select Month
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900">
                          <option>January 2026</option>
                          <option>December 2025</option>
                          <option>November 2025</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Year
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900">
                          <option>2026</option>
                          <option>2025</option>
                          <option>2024</option>
                        </select>
                      </div>
                      <div className="flex items-end">
                        <Button variant="primary" className="w-full">
                          Generate Payroll
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4">Payroll Status</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-white rounded border">
                        <div>
                          <p className="text-sm font-medium text-gray-900">January 2026</p>
                          <p className="text-xs text-gray-600">5 employees processed</p>
                        </div>
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                          Draft
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white rounded border">
                        <div>
                          <p className="text-sm font-medium text-gray-900">December 2025</p>
                          <p className="text-xs text-gray-600">5 employees processed</p>
                        </div>
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Completed
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'runs' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Payroll Runs</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Period
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Employees
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Total Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          January 2026
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">5</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">₹2,50,000</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                            Draft
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm gap-2 flex">
                          <Button size="sm" variant="secondary">
                            View
                          </Button>
                          <Button size="sm" variant="secondary">
                            Edit
                          </Button>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          December 2025
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">5</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">₹2,50,000</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Completed
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm gap-2 flex">
                          <Button size="sm" variant="secondary">
                            View
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'approval' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Approval Workflow</h2>
                <div className="space-y-4">
                  <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Pending Approval</h3>
                        <p className="text-sm text-gray-600">January 2026 Payroll Run</p>
                        <div className="mt-4">
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>5 employees</strong> • Total: <strong>₹2,50,000</strong>
                          </p>
                          <p className="text-xs text-gray-600">Submitted on Jan 20, 2026 by Admin</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="primary">Approve</Button>
                        <Button variant="secondary">Reject</Button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                    <h3 className="font-semibold text-gray-900 mb-4">Approved Payrolls</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-white rounded border">
                        <div>
                          <p className="text-sm font-medium text-gray-900">December 2025</p>
                          <p className="text-xs text-gray-600">Approved on Jan 5, 2026</p>
                        </div>
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Approved
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
