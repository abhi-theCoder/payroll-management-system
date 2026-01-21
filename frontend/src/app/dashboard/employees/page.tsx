'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { DashboardLayout } from '@/components/DashboardLayout';
import { RouteGuard } from '@/components/RouteGuard';
import { Permission } from '@/config/rbac';
import { employeeService } from '@/services/api/employeeService';
import { Employee } from '@/types/models';
import { COLORS } from '@/config/theme';
import { Search, Plus, Edit, Eye, Trash2 } from 'lucide-react';

export default function EmployeesPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(10);

  const fetchEmployees = async (pageNum: number) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Fetching employees from page:', pageNum);
      const response = await employeeService.getAll(pageNum, pageSize);
      console.log('API Response:', response);
      
      // Handle both direct array and paginated response
      const employeeData = Array.isArray(response) ? response : response?.data || response?.employees || [];
      const totalCount = response?.total || response?.count || employeeData.length || 0;
      
      console.log('Processed employees:', employeeData);
      setEmployees(employeeData);
      setTotal(totalCount);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch employees';
      console.error('Fetch error:', err);
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees(page);
  }, [page]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setPage(1);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const results = await employeeService.search(searchQuery);
      setEmployees(results || []);
      setTotal(results?.length || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeService.delete(id);
        setEmployees(employees.filter((e) => e.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete employee');
      }
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <RouteGuard requiredPermission={Permission.VIEW_EMPLOYEES}>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: COLORS.textPrimary }}>
                Employees
              </h1>
              <p className="mt-2" style={{ color: COLORS.textSecondary }}>
                Manage all company employees
              </p>
            </div>
            <Button variant="primary" onClick={() => router.push('/dashboard/employees/new')}>
              <Plus size={18} className="mr-2" /> Add Employee
            </Button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6">
              <Alert type="error" message={error} onClose={() => setError(null)} />
            </div>
          )}

          {/* Search Bar */}
          <div
            className="rounded-lg p-6 mb-6 border shadow-sm"
            style={{ borderColor: COLORS.border, backgroundColor: COLORS.background }}
          >
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search by name, email, or employee code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" variant="primary" isLoading={isLoading}>
                <Search size={18} />
              </Button>
              {searchQuery && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setSearchQuery('');
                    setPage(1);
                  }}
                  disabled={isLoading}
                >
                  Clear
                </Button>
              )}
            </form>
          </div>

          {/* Employees Table */}
          <div
            className="rounded-lg overflow-hidden border shadow-sm"
            style={{ borderColor: COLORS.border, backgroundColor: COLORS.background }}
          >
            {isLoading && !employees.length ? (
              <div className="p-8 text-center">
                <div className="inline-block">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'rgb(30, 58, 138)' }}></div>
                </div>
                <p className="mt-4" style={{ color: COLORS.textSecondary }}>
                  Loading employees...
                </p>
              </div>
            ) : employees.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-lg" style={{ color: COLORS.textSecondary }}>
                  No employees found
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead style={{ backgroundColor: '#F9FAFB', borderBottomColor: COLORS.border, borderBottomWidth: '1px' }}>
                      <tr>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                          style={{ color: COLORS.textSecondary }}
                        >
                          Employee Code
                        </th>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                          style={{ color: COLORS.textSecondary }}
                        >
                          Name
                        </th>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                          style={{ color: COLORS.textSecondary }}
                        >
                          Email
                        </th>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                          style={{ color: COLORS.textSecondary }}
                        >
                          Department
                        </th>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                          style={{ color: COLORS.textSecondary }}
                        >
                          Designation
                        </th>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                          style={{ color: COLORS.textSecondary }}
                        >
                          Status
                        </th>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                          style={{ color: COLORS.textSecondary }}
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody style={{ borderTopColor: COLORS.border, borderTopWidth: '1px' }}>
                      {employees.map((employee) => (
                        <tr
                          key={employee.id}
                          className="transition"
                          style={{
                            borderBottomColor: COLORS.border,
                            borderBottomWidth: '1px',
                          }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: COLORS.textPrimary }}>
                            {employee.employeeCode}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>
                              {employee.firstName} {employee.lastName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: COLORS.textSecondary }}>
                            {employee.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: COLORS.textSecondary }}>
                            {employee.department || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: COLORS.textSecondary }}>
                            {employee.designation || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className="px-3 py-1 text-xs font-medium rounded-full"
                              style={{
                                backgroundColor: employee.isActive ? '#D1FAE5' : '#FEE2E2',
                                color: employee.isActive ? '#10B981' : '#EF4444',
                              }}
                            >
                              {employee.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm gap-2 flex">
                            <button
                              onClick={() => router.push(`/dashboard/employees/${employee.id}`)}
                              className="p-2 rounded hover:opacity-70 transition"
                              style={{ color: 'rgb(30, 58, 138)' }}
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => router.push(`/dashboard/employees/${employee.id}/edit`)}
                              className="p-2 rounded hover:opacity-70 transition"
                              style={{ color: 'rgb(30, 58, 138)' }}
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(employee.id)}
                              className="p-2 rounded hover:opacity-70 transition"
                              style={{ color: COLORS.error }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div
                  className="px-6 py-4 flex items-center justify-between"
                  style={{
                    backgroundColor: '#F9FAFB',
                    borderTopColor: COLORS.border,
                    borderTopWidth: '1px',
                  }}
                >
                  <div className="text-sm" style={{ color: COLORS.textSecondary }}>
                    Showing {employees.length > 0 ? (page - 1) * pageSize + 1 : 0} to{' '}
                    {Math.min(page * pageSize, total)} of {total} employees
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1 || isLoading}
                    >
                      Previous
                    </Button>
                    <span className="px-4 py-2 text-sm font-medium" style={{ color: COLORS.textPrimary }}>
                      Page {page} of {totalPages || 1}
                    </span>
                    <Button
                      variant="secondary"
                      onClick={() => setPage(page + 1)}
                      disabled={page >= totalPages || isLoading}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </DashboardLayout>
    </RouteGuard>
  );
}

 