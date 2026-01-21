'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { DashboardLayout } from '@/components/DashboardLayout';

export default function SalaryPage() {
  const [activeTab, setActiveTab] = useState<'structure' | 'components' | 'calculation'>('structure');
  const [error, setError] = useState<string | null>(null);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Salary Management</h1>
          <p className="text-gray-600 mt-2">Manage employee salary structures and components</p>
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
                { id: 'structure', label: 'Salary Structure' },
                { id: 'components', label: 'Salary Components' },
                { id: 'calculation', label: 'Salary Calculation Rules' },
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
            {activeTab === 'structure' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Salary Structure</h2>
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <p className="text-gray-600 mb-4">
                    Define salary structures for different employee categories. Each structure consists of:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>Base Salary</li>
                    <li>Dearness Allowance (DA)</li>
                    <li>House Rent Allowance (HRA)</li>
                    <li>Other Allowances</li>
                    <li>Deductions (PF, Insurance, etc.)</li>
                  </ul>
                  <Button variant="primary" className="mt-6">
                    + Create Salary Structure
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'components' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Salary Components</h2>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2">Earnings</h3>
                    <p className="text-sm text-gray-600 mb-4">Components that add to the salary</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded border border-gray-200">
                        <p className="text-sm font-medium">Base Salary</p>
                        <p className="text-xs text-gray-600">Core compensation</p>
                      </div>
                      <div className="bg-white p-4 rounded border border-gray-200">
                        <p className="text-sm font-medium">DA (Dearness Allowance)</p>
                        <p className="text-xs text-gray-600">To counter inflation</p>
                      </div>
                      <div className="bg-white p-4 rounded border border-gray-200">
                        <p className="text-sm font-medium">HRA (House Rent)</p>
                        <p className="text-xs text-gray-600">Housing assistance</p>
                      </div>
                      <div className="bg-white p-4 rounded border border-gray-200">
                        <p className="text-sm font-medium">Other Allowances</p>
                        <p className="text-xs text-gray-600">Additional benefits</p>
                      </div>
                    </div>
                    <Button variant="secondary" className="mt-4">
                      + Add Earning Component
                    </Button>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2">Deductions</h3>
                    <p className="text-sm text-gray-600 mb-4">Components that reduce the salary</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded border border-gray-200">
                        <p className="text-sm font-medium">PF (Provident Fund)</p>
                        <p className="text-xs text-gray-600">Employee contribution</p>
                      </div>
                      <div className="bg-white p-4 rounded border border-gray-200">
                        <p className="text-sm font-medium">Income Tax</p>
                        <p className="text-xs text-gray-600">Tax deduction</p>
                      </div>
                      <div className="bg-white p-4 rounded border border-gray-200">
                        <p className="text-sm font-medium">Insurance</p>
                        <p className="text-xs text-gray-600">Health/life insurance</p>
                      </div>
                      <div className="bg-white p-4 rounded border border-gray-200">
                        <p className="text-sm font-medium">Other Deductions</p>
                        <p className="text-xs text-gray-600">Additional deductions</p>
                      </div>
                    </div>
                    <Button variant="secondary" className="mt-4">
                      + Add Deduction Component
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'calculation' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Salary Calculation Rules</h2>
                <div className="space-y-6">
                  <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
                    <h3 className="font-semibold text-gray-900 mb-4">Tax Rules</h3>
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded border border-gray-200">
                        <p className="text-sm font-medium text-gray-900">Annual Tax Slab</p>
                        <p className="text-xs text-gray-600 mt-1">Define tax calculation based on annual income</p>
                      </div>
                      <div className="bg-white p-4 rounded border border-gray-200">
                        <p className="text-sm font-medium text-gray-900">HRA Exemption</p>
                        <p className="text-xs text-gray-600 mt-1">Calculate HRA exemption for tax relief</p>
                      </div>
                      <div className="bg-white p-4 rounded border border-gray-200">
                        <p className="text-sm font-medium text-gray-900">Standard Deduction</p>
                        <p className="text-xs text-gray-600 mt-1">Fixed deduction under Section 16</p>
                      </div>
                    </div>
                    <Button variant="secondary" className="mt-4">
                      Configure Tax Rules
                    </Button>
                  </div>

                  <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                    <h3 className="font-semibold text-gray-900 mb-4">PF & ESI Rules</h3>
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded border border-gray-200">
                        <p className="text-sm font-medium text-gray-900">PF Calculation</p>
                        <p className="text-xs text-gray-600 mt-1">Employee (12%) & Employer (12%) contribution</p>
                      </div>
                      <div className="bg-white p-4 rounded border border-gray-200">
                        <p className="text-sm font-medium text-gray-900">ESI Rules</p>
                        <p className="text-xs text-gray-600 mt-1">Applicable when monthly salary is below threshold</p>
                      </div>
                    </div>
                    <Button variant="secondary" className="mt-4">
                      Configure PF & ESI
                    </Button>
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
