'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Navigation } from '@/components/Navigation';
import { employeeService } from '@/services/api/employeeService';
import { Employee } from '@/types/models';

export default function EmployeeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const employeeId = params.id as string;

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const data = await employeeService.getById(employeeId);
        setEmployee(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch employee');
      } finally {
        setIsLoading(false);
      }
    };

    if (employeeId) {
      fetchEmployee();
    }
  }, [employeeId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-gray-500">Loading employee details...</p>
        </div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert type="error" message={error || 'Employee not found'} onClose={() => router.back()} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                {employee.firstName[0]}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {employee.firstName} {employee.lastName}
                </h1>
                <p className="text-gray-600">Employee ID: {employee.employeeCode}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => router.push(`/dashboard/employees/${employeeId}/edit`)}>
              Edit
            </Button>
            <Button variant="secondary" onClick={() => router.back()}>
              Back
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{employee.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{employee.phone || '-'}</p>
                </div>
              </div>
            </div>

            {/* Employment Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">Employment Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Department</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{employee.department || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Designation</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{employee.designation || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Joining Date</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {new Date(employee.joiningDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
                  <p className="text-sm font-medium mt-1">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        employee.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {employee.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Date of Birth</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {employee.dateOfBirth ? new Date(employee.dateOfBirth).toLocaleDateString() : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Gender</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{employee.gender || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Address</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{employee.address || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">City</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{employee.city || '-'}</p>
                </div>
              </div>
            </div>

            {/* Government IDs */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">Government IDs & Tax</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">PAN Number</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{employee.panNumber || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Aadhar Number</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{employee.aadharNumber || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">UAN Number</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{employee.uanNumber || '-'}</p>
                </div>
              </div>
            </div>

            {/* Bank Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">Bank Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Account Number</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{employee.bankAccountNumber || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">IFSC Code</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{employee.bankIFSCCode || '-'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="secondary" className="w-full justify-start">
                  📄 View Payslips
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  💼 Salary Details
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  📋 Attendance
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  🔔 Send Message
                </Button>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
              <div className="space-y-4">
                <div className="border-l-2 border-gray-200 pl-4">
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(employee.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="border-l-2 border-gray-200 pl-4">
                  <p className="text-xs text-gray-500">Last Updated</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(employee.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
