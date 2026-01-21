'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { DashboardLayout } from '@/components/DashboardLayout';

export default function CompliancePage() {
  const [selectedCompliance, setSelectedCompliance] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const complianceItems = [
    {
      id: 'pf-filing',
      name: 'PF Filing',
      status: 'Pending',
      dueDate: '2026-02-15',
      description: 'Monthly PF filing with EPFO',
      icon: '📋',
    },
    {
      id: 'esi-filing',
      name: 'ESI Filing',
      status: 'Completed',
      dueDate: '2026-01-15',
      description: 'ESI monthly contribution filing',
      icon: '✓',
    },
    {
      id: 'income-tax',
      name: 'Income Tax Return',
      status: 'Pending',
      dueDate: '2026-07-31',
      description: 'Annual income tax return filing',
      icon: '💰',
    },
    {
      id: 'statutory-audit',
      name: 'Statutory Audit',
      status: 'Completed',
      dueDate: '2025-12-31',
      description: 'Annual statutory audit completed',
      icon: '✓',
    },
    {
      id: 'labor-compliance',
      name: 'Labor Compliance',
      status: 'Completed',
      dueDate: '2025-12-31',
      description: 'Labor laws and compliance adherence',
      icon: '✓',
    },
    {
      id: 'gratuity-fund',
      name: 'Gratuity Fund',
      status: 'On Track',
      dueDate: 'N/A',
      description: 'Employee gratuity fund management',
      icon: '🎁',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'On Track':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Compliance Management</h1>
          <p className="text-gray-600 mt-2">Track and manage payroll compliance requirements</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6">
            <Alert type="error" message={error} onClose={() => setError(null)} />
          </div>
        )}

        {/* Compliance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">3</p>
              <p className="text-sm text-gray-600 mt-2">Completed</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">2</p>
              <p className="text-sm text-gray-600 mt-2">Pending</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">1</p>
              <p className="text-sm text-gray-600 mt-2">On Track</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600">50%</p>
              <p className="text-sm text-gray-600 mt-2">Compliance Rate</p>
            </div>
          </div>
        </div>

        {/* Compliance Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {complianceItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedCompliance(item.id)}
              className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition transform hover:scale-105 ${
                selectedCompliance === item.id ? 'ring-2 ring-primary-500 shadow-lg' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">{item.icon}</div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{item.description}</p>
              <p className="text-xs text-gray-500">
                {item.dueDate === 'N/A' ? 'Ongoing' : `Due: ${new Date(item.dueDate).toLocaleDateString()}`}
              </p>
            </div>
          ))}
        </div>

        {/* Compliance Detail */}
        {selectedCompliance && (
          <div className="bg-white rounded-lg shadow-md p-8">
            {(() => {
              const item = complianceItems.find((c) => c.id === selectedCompliance);
              return item ? (
                <>
                  <div className="flex justify-between items-center mb-6 pb-6 border-b">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{item.icon}</div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{item.name}</h2>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <p className="text-sm text-gray-600 uppercase tracking-wide mb-2">Status</p>
                      <p className="text-lg font-semibold text-gray-900">{item.status}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <p className="text-sm text-gray-600 uppercase tracking-wide mb-2">Due Date</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {item.dueDate === 'N/A' ? 'Ongoing' : new Date(item.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <p className="text-sm text-gray-600 uppercase tracking-wide mb-2">Last Updated</p>
                      <p className="text-lg font-semibold text-gray-900">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-6 border border-blue-200 mb-8">
                    <h3 className="font-semibold text-blue-900 mb-3">Requirements</h3>
                    <ul className="space-y-2 text-sm text-blue-800">
                      <li>✓ File monthly statements with regulatory authorities</li>
                      <li>✓ Maintain compliance with statutory requirements</li>
                      <li>✓ Submit timely reports and documentation</li>
                      <li>✓ Keep records updated and accessible</li>
                    </ul>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="primary">Mark as Complete</Button>
                    <Button variant="secondary">View Documents</Button>
                    <Button variant="secondary">Send Reminder</Button>
                  </div>
                </>
              ) : null;
            })()}
          </div>
        )}

        {/* Compliance Calendar */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Upcoming Deadlines</h2>
          <div className="space-y-4">
            {complianceItems
              .filter((item) => item.status === 'Pending')
              .map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Due: {new Date(item.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Take Action
                  </Button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
