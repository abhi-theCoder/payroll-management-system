'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Calendar, AlertCircle, Plus, Edit, Loader2, CheckCircle2 } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/DashboardLayout';
import { RouteGuard } from '@/components/RouteGuard';
import { Permission } from '@/config/rbac';
import leaveService, { LeaveBalance, LeaveRequest, LeaveType } from '@/services/api/leaveService';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/models';

type TabType = 'balance' | 'apply' | 'history' | 'approvals' | 'settings';

function LeaveManagementContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>((searchParams.get('tab') as TabType) || 'balance');
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [history, setHistory] = useState<LeaveRequest[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    leaveTypeId: '',
    fromDate: '',
    toDate: '',
    reason: '',
  });

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['balance', 'apply', 'history', 'approvals', 'settings'].includes(tab)) {
      setActiveTab(tab as TabType);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [balanceRes, historyRes, typesRes] = await Promise.all([
        leaveService.getLeaveBalance(),
        leaveService.getLeaveHistory(),
        leaveService.getLeaveTypes(),
      ]);

      // The backend returns balance as an object with leaveTypes array
      const balanceData = (balanceRes as any).leaveTypes || [];
      setBalances(balanceData);
      setHistory(historyRes);
      setLeaveTypes(typesRes);
    } catch (err: any) {
      console.error('Failed to fetch leave data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.leaveTypeId || !formData.fromDate || !formData.toDate || !formData.reason) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await leaveService.applyLeave(formData);
      setSuccess('Leave request submitted successfully!');
      setFormData({ leaveTypeId: '', fromDate: '', toDate: '', reason: '' });
      await fetchData();
      setTimeout(() => {
        setActiveTab('history');
        setSuccess(null);
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to submit leave request');
    } finally {
      setSubmitting(false);
    }
  };

  const tabs: { value: TabType; label: string; icon: React.ReactNode; show: boolean }[] = [
    {
      value: 'balance',
      label: 'Leave Balance',
      icon: <Calendar size={20} />,
      show: true,
    },
    {
      value: 'apply',
      label: 'Apply Leave',
      icon: <Plus size={20} />,
      show: true,
    },
    {
      value: 'history',
      label: 'My Leaves',
      icon: <Calendar size={20} />,
      show: true,
    },
    {
      value: 'approvals',
      label: 'Pending Approvals',
      icon: <CheckCircle2 size={20} />,
      show: user?.role === UserRole.ADMIN || user?.role === UserRole.HR || user?.role === UserRole.MANAGER,
    },
    {
      value: 'settings',
      label: 'Admin',
      icon: <Edit size={20} />,
      show: user?.role === UserRole.ADMIN,
    },
  ];

  return (
    <RouteGuard requiredPermission={Permission.VIEW_LEAVE}>
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-6 flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-teal-50 rounded-lg text-teal-600">
                  <Calendar size={28} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
                  <p className="text-gray-500">Track balance, request leave, and view history</p>
                </div>
              </div>
              <div className="text-right">
                <label className="text-sm font-medium text-gray-700 block mb-1">Financial Year</label>
                <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-32 p-2">
                  <option>2026</option>
                  <option>2025</option>
                </select>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex flex-wrap border-b border-gray-100">
                {tabs
                  .filter((tab) => tab.show)
                  .map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => {
                        setActiveTab(tab.value);
                        router.push(`/dashboard/leave?tab=${tab.value}`);
                      }}
                      className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-all ${activeTab === tab.value
                        ? 'border-teal-600 text-teal-600 bg-teal-50/30'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
              {loading ? (
                <div className="flex items-center justify-center p-20">
                  <Loader2 className="animate-spin text-teal-600" size={40} />
                </div>
              ) : (
                <>
                  {activeTab === 'balance' && (
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        Your Leave Balances
                        <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">As of today</span>
                      </h3>

                      <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-teal-700 text-white font-medium">
                            <tr>
                              <th className="px-4 py-3 border-r border-teal-600">Leave Type</th>
                              <th className="px-4 py-3 text-center border-r border-teal-600">Available Accrued</th>
                              <th className="px-4 py-3 text-center border-r border-teal-600">+ Carryover Leave</th>
                              <th className="px-4 py-3 text-center border-r border-teal-600">+ Additional Leave(ADJ)</th>
                              <th className="px-4 py-3 text-center border-r border-teal-600 font-bold bg-teal-800">= Total Available</th>
                              <th className="px-4 py-3 text-center border-r border-teal-600 text-red-100">- Used</th>
                              <th className="px-4 py-3 text-center font-bold bg-teal-800 text-yellow-100">= Current Balance</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {balances.length > 0 ? balances.map((row: any, i) => (
                              <tr key={i} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-900 border-r border-gray-100 bg-gray-50/50">{row.leaveTypeName}</td>
                                <td className="px-4 py-3 text-center border-r border-gray-100">{(row.total - row.carriedForward).toFixed(1)}</td>
                                <td className="px-4 py-3 text-center border-r border-gray-100">{row.carriedForward}</td>
                                <td className="px-4 py-3 text-center border-r border-gray-100">0</td>
                                <td className="px-4 py-3 text-center border-r border-gray-100 font-bold text-gray-800 bg-blue-50/30">{row.total.toFixed(1)}</td>
                                <td className="px-4 py-3 text-center border-r border-gray-100 text-red-600">{row.used}</td>
                                <td className="px-4 py-3 text-center font-bold text-teal-700 bg-teal-50/30">{row.balance.toFixed(1)}</td>
                              </tr>
                            )) : (
                              <tr>
                                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">No leave balances found.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {activeTab === 'apply' && (
                    <div className="p-8 max-w-2xl mx-auto">
                      <h2 className="text-xl font-bold text-gray-900 mb-6">Request Time Off</h2>

                      {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center gap-3">
                          <AlertCircle size={20} />
                          <p className="text-sm">{error}</p>
                        </div>
                      )}

                      {success && (
                        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-center gap-3">
                          <CheckCircle2 size={20} />
                          <p className="text-sm">{success}</p>
                        </div>
                      )}

                      <form onSubmit={handleApplyLeave} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                            <select
                              value={formData.leaveTypeId}
                              onChange={(e) => setFormData({ ...formData, leaveTypeId: e.target.value })}
                              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
                            >
                              <option value="">Select type...</option>
                              {leaveTypes.map(type => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                            <input
                              type="text"
                              value={formData.reason}
                              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                              placeholder="Vacation, Personal emergency, etc."
                              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                            <input
                              type="date"
                              value={formData.fromDate}
                              onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                            <input
                              type="date"
                              value={formData.toDate}
                              onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                          </div>
                        </div>

                        <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg text-sm">
                          Requesting leave requires approval. Please ensure you have sufficient balance.
                        </div>

                        <button
                          type="submit"
                          disabled={submitting}
                          className="bg-teal-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-teal-700 w-full sm:w-auto transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="animate-spin" size={18} />
                              Submitting...
                            </>
                          ) : 'Submit Request'}
                        </button>
                      </form>
                    </div>
                  )}

                  {activeTab === 'history' && (
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-6">Leave History</h2>
                      <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-gray-50 text-gray-700 font-medium">
                            <tr>
                              <th className="px-4 py-3">Type</th>
                              <th className="px-4 py-3">Dates</th>
                              <th className="px-4 py-3 text-center">Days</th>
                              <th className="px-4 py-3">Reason</th>
                              <th className="px-4 py-3 text-center">Status</th>
                              <th className="px-4 py-3">Applied On</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {history.length > 0 ? history.map((leave, i) => (
                              <tr key={i} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-900">{(leave as any).leaveType?.name}</td>
                                <td className="px-4 py-3">
                                  {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3 text-center">{leave.days}</td>
                                <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{leave.reason}</td>
                                <td className="px-4 py-3 text-center">
                                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${leave.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                    leave.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                      'bg-amber-100 text-amber-700'
                                    }`}>
                                    {leave.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-gray-500">
                                  {new Date(leave.createdAt).toLocaleDateString()}
                                </td>
                              </tr>
                            )) : (
                              <tr>
                                <td colSpan={6} className="px-4 py-12 text-center text-gray-500">No leave history found.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </RouteGuard>
  );
}

export default function LeaveManagementPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="animate-spin text-teal-600" size={40} />
        </div>
      </DashboardLayout>
    }>
      <LeaveManagementContent />
    </Suspense>
  );
}
