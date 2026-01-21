'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { DashboardLayout } from '@/components/DashboardLayout';

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reports = [
    {
      id: 'salary-register',
      name: 'Salary Register',
      description: 'Monthly salary register for all employees',
      icon: '📊',
    },
    {
      id: 'payslip',
      name: 'Payslips',
      description: 'Generate and view employee payslips',
      icon: '📄',
    },
    {
      id: 'attendance',
      name: 'Attendance Report',
      description: 'Attendance details and statistics',
      icon: '📅',
    },
    {
      id: 'tax-summary',
      name: 'Tax Summary',
      description: 'Annual tax computation and summary',
      icon: '💰',
    },
    {
      id: 'pf-esi',
      name: 'PF & ESI Report',
      description: 'PF and ESI contribution details',
      icon: '📋',
    },
    {
      id: 'compliance',
      name: 'Compliance Report',
      description: 'Compliance status and requirements',
      icon: '✓',
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-2">Generate and manage payroll reports</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6">
            <Alert type="error" message={error} onClose={() => setError(null)} />
          </div>
        )}

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {reports.map((report) => (
            <div
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`p-6 rounded-lg shadow-md cursor-pointer transition transform hover:scale-105 ${
                selectedReport === report.id
                  ? 'bg-primary-50 border-2 border-primary-500'
                  : 'bg-white border-2 border-transparent hover:border-gray-200'
              }`}
            >
              <div className="text-4xl mb-3">{report.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{report.description}</p>
              <Button variant="secondary" size="sm">
                Generate
              </Button>
            </div>
          ))}
        </div>

        {/* Report Configuration */}
        {selectedReport && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {reports.find((r) => r.id === selectedReport)?.name}
            </h2>

            <div className="space-y-6">
              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">From Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">To Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Department</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900">
                    <option>All Departments</option>
                    <option>HR</option>
                    <option>Finance</option>
                    <option>Operations</option>
                  </select>
                </div>
              </div>

              {/* Format Selection */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Export Format</h3>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input type="radio" name="format" value="pdf" defaultChecked className="mr-2" />
                    <span className="text-sm text-gray-700">PDF</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="format" value="excel" className="mr-2" />
                    <span className="text-sm text-gray-700">Excel (XLSX)</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="format" value="csv" className="mr-2" />
                    <span className="text-sm text-gray-700">CSV</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t">
                <Button variant="primary">Generate Report</Button>
                <Button
                  variant="secondary"
                  onClick={() => setSelectedReport(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Recent Reports */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Reports</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Report Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Generated On
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Format
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Salary Register - December 2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    Jan 15, 2026
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">PDF</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm gap-2 flex">
                    <Button size="sm" variant="secondary">
                      Download
                    </Button>
                    <Button size="sm" variant="secondary">
                      View
                    </Button>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Tax Summary - FY 2025-26
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    Jan 10, 2026
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Excel</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm gap-2 flex">
                    <Button size="sm" variant="secondary">
                      Download
                    </Button>
                    <Button size="sm" variant="secondary">
                      View
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
