'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Navigation } from '@/components/Navigation';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.firstName}!</h1>
          <p className="text-gray-600 mt-2">Here's an overview of your payroll management system</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Employees */}
          <div className="card hover:shadow-lg transition">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2zm0 0h6v-2a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5">
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" className="mt-4 w-full" onClick={() => router.push('/dashboard/employees')}>
              Manage Employees
            </Button>
          </div>

          {/* Active Payroll Runs */}
          <div className="card hover:shadow-lg transition">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5">
                <p className="text-sm text-gray-600">Total Payroll</p>
                <p className="text-2xl font-bold text-gray-900">₹0</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" className="mt-4 w-full" onClick={() => router.push('/dashboard/payroll')}>
              View Payroll
            </Button>
          </div>

          {/* Payslips Generated */}
          <div className="card hover:shadow-lg transition">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5">
                <p className="text-sm text-gray-600">Payslips Generated</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" className="mt-4 w-full" onClick={() => router.push('/dashboard/reports')}>
              View Reports
            </Button>
          </div>

          {/* Pending Tasks */}
          <div className="card hover:shadow-lg transition">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5">
                <p className="text-sm text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" className="mt-4 w-full" onClick={() => router.push('/dashboard/payroll')}>
              Review
            </Button>
          </div>
        </div>

        {/* Quick Actions and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button 
                variant="secondary" 
                className="w-full justify-start"
                onClick={() => router.push('/dashboard/employees/new')}
              >
                ➕ Add New Employee
              </Button>
              <Button 
                variant="secondary" 
                className="w-full justify-start"
                onClick={() => router.push('/dashboard/salary')}
              >
                💼 Manage Salary Structure
              </Button>
              <Button 
                variant="secondary" 
                className="w-full justify-start"
                onClick={() => router.push('/dashboard/payroll')}
              >
                📋 Create Payroll Run
              </Button>
              <Button 
                variant="secondary" 
                className="w-full justify-start"
                onClick={() => router.push('/dashboard/reports')}
              >
                📈 Generate Reports
              </Button>
            </div>
          </div>

          {/* Navigation Guide */}
          <div className="card lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Navigation Guide</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-900">👥 Employees</p>
                <p className="text-xs text-blue-700 mt-1">Manage employee records, add new employees, update information</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm font-medium text-green-900">💼 Salary</p>
                <p className="text-xs text-green-700 mt-1">Configure salary structures, components, and calculation rules</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm font-medium text-purple-900">📋 Payroll</p>
                <p className="text-xs text-purple-700 mt-1">Process payroll runs, manage approvals, track status</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm font-medium text-orange-900">📈 Reports</p>
                <p className="text-xs text-orange-700 mt-1">Generate salary registers, tax summaries, compliance reports</p>
              </div>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="mt-8 card bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2">Welcome to ERP Payroll System</h3>
              <p className="text-primary-700 text-sm mb-3">
                Your comprehensive payroll and salary management platform. Manage employees, configure salary structures, process payroll, and generate reports all in one place.
              </p>
              <div className="text-xs text-primary-600">
                <p>📌 Logged in as: <strong>{user.email}</strong></p>
                <p>📌 Role: <strong>{user.role}</strong></p>
              </div>
            </div>
            <div className="hidden sm:block text-6xl opacity-20">💼</div>
          </div>
        </div>
      </main>
    </div>
  );
}
