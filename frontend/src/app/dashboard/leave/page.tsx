'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Navigation } from '@/components/Navigation';

export default function LeaveManagementPage() {
  const [activeTab, setActiveTab] = useState<'apply' | 'history' | 'balance'>('apply');
  const [isApplying, setIsApplying] = useState(false);

  const leaveTypes = [
    { id: 1, name: 'Casual Leave', balance: 8, total: 12 },
    { id: 2, name: 'Earned Leave', balance: 10, total: 20 },
    { id: 3, name: 'Sick Leave', balance: 5, total: 8 },
    { id: 4, name: 'Maternity Leave', balance: 0, total: 90 },
    { id: 5, name: 'Paternity Leave', balance: 0, total: 15 },
  ];

  const leaveHistory = [
    {
      id: 1,
      type: 'Casual Leave',
      from: '2024-01-15',
      to: '2024-01-16',
      days: 2,
      status: 'Approved',
      approver: 'John Manager',
    },
    {
      id: 2,
      type: 'Sick Leave',
      from: '2024-01-10',
      to: '2024-01-10',
      days: 1,
      status: 'Approved',
      approver: 'John Manager',
    },
    {
      id: 3,
      type: 'Earned Leave',
      from: '2024-02-01',
      to: '2024-02-05',
      days: 5,
      status: 'Pending',
      approver: 'Awaiting Approval',
    },
    {
      id: 4,
      type: 'Casual Leave',
      from: '2024-01-01',
      to: '2024-01-03',
      days: 3,
      status: 'Rejected',
      approver: 'John Manager',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApplyLeave = async () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      alert('Leave application submitted successfully!');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
          <p className="text-gray-600 mt-2">Manage your leave requests and view leave balance</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
          <div className="flex border-b">
            {(
              [
                { id: 'apply', label: '📝 Apply Leave', icon: '📝' },
                { id: 'history', label: '📋 Leave History', icon: '📋' },
                { id: 'balance', label: '⏳ Leave Balance', icon: '⏳' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 font-medium transition ${
                  activeTab === tab.id
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Apply Leave Tab */}
        {activeTab === 'apply' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Apply for Leave</h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500">
                        <option>Select Leave Type</option>
                        {leaveTypes.map((type) => (
                          <option key={type.id}>
                            {type.name} (Available: {type.balance})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Duration Type</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500">
                        <option>Full Day</option>
                        <option>Half Day (Morning)</option>
                        <option>Half Day (Afternoon)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input type="date" label="From Date" />
                    <Input type="date" label="To Date" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Days</label>
                    <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                      2.5 days
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                    <textarea
                      placeholder="Enter reason for leave (optional)"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
                    ></textarea>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> Your leave will be forwarded to your manager for approval. You will receive a
                      notification once approved or rejected.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="primary" onClick={handleApplyLeave} isLoading={isApplying}>
                      Submit Request
                    </Button>
                    <Button variant="secondary">Reset</Button>
                  </div>
                </form>
              </div>
            </div>

            {/* Quick Leave Balance */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Balance</h3>
                <div className="space-y-3">
                  {leaveTypes.map((type) => (
                    <div key={type.id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">{type.name}</p>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${(type.balance / type.total) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        {type.balance} / {type.total} days
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Leave History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Leave Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">From</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">To</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Days</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {leaveHistory.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{record.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{record.from}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{record.to}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{record.days}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {record.status === 'Pending' && (
                        <Button variant="secondary" size="sm">
                          Withdraw
                        </Button>
                      )}
                      {record.status === 'Approved' && (
                        <Button variant="secondary" size="sm">
                          View
                        </Button>
                      )}
                      {record.status === 'Rejected' && (
                        <Button variant="primary" size="sm">
                          Reapply
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Leave Balance Tab */}
        {activeTab === 'balance' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {leaveTypes.map((type) => (
              <div key={type.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{type.name}</h3>
                    <p className="text-sm text-gray-600">Balance: {type.balance} days</p>
                  </div>
                  <div className="text-3xl font-bold text-primary-600">{type.balance}</div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Allocation</span>
                    <span className="font-medium text-gray-900">{type.total} days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Used</span>
                    <span className="font-medium text-gray-900">{type.total - type.balance} days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Utilization</span>
                    <span className="font-medium text-gray-900">
                      {Math.round(((type.total - type.balance) / type.total) * 100)}%
                    </span>
                  </div>
                </div>

                <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-primary-600 h-3 rounded-full transition"
                    style={{ width: `${((type.total - type.balance) / type.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
