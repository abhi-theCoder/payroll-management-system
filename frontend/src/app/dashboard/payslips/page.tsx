'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { DashboardLayout } from '@/components/DashboardLayout';

export default function PayslipsPage() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedPayslip, setSelectedPayslip] = useState<string | null>(null);

  const payslips = [
    {
      id: 1,
      period: 'January 2026',
      employee: 'John Doe',
      grossSalary: 50000,
      netSalary: 42500,
      status: 'Generated',
    },
    {
      id: 2,
      period: 'December 2025',
      employee: 'John Doe',
      grossSalary: 50000,
      netSalary: 42500,
      status: 'Generated',
    },
    {
      id: 3,
      period: 'November 2025',
      employee: 'John Doe',
      grossSalary: 50000,
      netSalary: 42500,
      status: 'Generated',
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payslips</h1>
          <p className="text-gray-600 mt-2">View and download employee payslips</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Month</label>
              <select
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(2026, i, 1).toLocaleDateString('en-US', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Year</label>
              <select
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                {[2024, 2025, 2026].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="primary" className="w-full">
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Payslips List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {payslips.map((payslip) => (
            <div
              key={payslip.id}
              onClick={() => setSelectedPayslip(payslip.id.toString())}
              className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition transform hover:scale-105 ${
                selectedPayslip === payslip.id.toString()
                  ? 'ring-2 ring-primary-500 shadow-lg'
                  : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{payslip.period}</h3>
                  <p className="text-sm text-gray-600">{payslip.employee}</p>
                </div>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                  {payslip.status}
                </span>
              </div>

              <div className="space-y-3 mb-4 pb-4 border-b">
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600">Gross Salary</p>
                  <p className="text-sm font-medium text-gray-900">₹{payslip.grossSalary.toLocaleString()}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600">Net Salary</p>
                  <p className="text-lg font-semibold text-primary-600">₹{payslip.netSalary.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1">
                  View
                </Button>
                <Button variant="secondary" size="sm" className="flex-1">
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Payslip Detail View */}
        {selectedPayslip && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-8">
            <div className="flex justify-between items-center mb-6 pb-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Payslip Details</h2>
              <Button variant="primary">Download PDF</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Company Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Company</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>ERP Payroll System</p>
                  <p>123 Business Street</p>
                  <p>Mumbai, India 400001</p>
                </div>
              </div>

              {/* Employee Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Employee</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>John Doe</p>
                  <p>EMP001</p>
                  <p>Senior Manager</p>
                  <p>HR Department</p>
                </div>
              </div>

              {/* Period Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Payroll Period</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>January 2026</p>
                  <p>From: 01-Jan-2026</p>
                  <p>To: 31-Jan-2026</p>
                </div>
              </div>
            </div>

            {/* Salary Details */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Earnings */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Earnings</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Basic Salary</span>
                    <span className="font-medium text-gray-900">₹30,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Dearness Allowance (DA)</span>
                    <span className="font-medium text-gray-900">₹5,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">House Rent Allowance (HRA)</span>
                    <span className="font-medium text-gray-900">₹9,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Other Allowances</span>
                    <span className="font-medium text-gray-900">₹6,000</span>
                  </div>
                  <div className="flex justify-between text-sm border-t pt-2 font-semibold">
                    <span>Total Earnings</span>
                    <span className="text-primary-600">₹50,000</span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Deductions</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Provident Fund (PF)</span>
                    <span className="font-medium text-gray-900">₹3,600</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Income Tax</span>
                    <span className="font-medium text-gray-900">₹2,500</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Health Insurance</span>
                    <span className="font-medium text-gray-900">₹1,400</span>
                  </div>
                  <div className="flex justify-between text-sm border-t pt-2 font-semibold">
                    <span>Total Deductions</span>
                    <span className="text-red-600">₹7,500</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Salary */}
            <div className="mt-8 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-6 border border-primary-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-primary-900">Net Salary</h3>
                <p className="text-3xl font-bold text-primary-600">₹42,500</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
