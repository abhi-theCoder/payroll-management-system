'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash2,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import leaveService, { LeaveRequest } from '@/services/api/leaveService';

interface LeaveHistoryProps {
  employeeId?: string;
  onRefresh?: () => void;
}

type StatusType = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

const statusConfig: Record<StatusType, { color: string; icon: React.ReactNode; bg: string }> = {
  PENDING: {
    color: 'text-yellow-700',
    icon: <Clock size={18} />,
    bg: 'bg-yellow-50 border-yellow-200',
  },
  APPROVED: {
    color: 'text-green-700',
    icon: <CheckCircle size={18} />,
    bg: 'bg-green-50 border-green-200',
  },
  REJECTED: {
    color: 'text-red-700',
    icon: <XCircle size={18} />,
    bg: 'bg-red-50 border-red-200',
  },
  CANCELLED: {
    color: 'text-gray-700',
    icon: <AlertCircle size={18} />,
    bg: 'bg-gray-50 border-gray-200',
  },
};

export default function LeaveHistory({ employeeId, onRefresh }: LeaveHistoryProps) {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [filter, setFilter] = useState<StatusType | 'ALL'>('ALL');

  const loadLeaves = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await leaveService.getLeaveHistory();
      setLeaves(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leave history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, [employeeId]);

  const handleCancel = async (leaveId: string) => {
    if (!confirm('Are you sure you want to cancel this leave request?')) {
      return;
    }

    setCancelling(leaveId);
    try {
      await leaveService.cancelLeave(leaveId);
      setCancelSuccess(true);
      loadLeaves();
      setTimeout(() => setCancelSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel leave');
    } finally {
      setCancelling(null);
    }
  };

  const filteredLeaves =
    filter === 'ALL' ? leaves : leaves.filter((l) => l.status === filter);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading leave history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Success Message */}
      {cancelSuccess && (
        <Alert type="success" message="Leave request cancelled successfully!" className="mb-6" />
      )}

      {/* Error Message */}
      {error && (
        <Alert type="error" message={error} className="mb-6" />
      )}

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2 border-b border-gray-200">
        {(['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              filter === status
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {status === 'ALL' ? 'All Leaves' : status}
            {status !== 'ALL' && (
              <span className="ml-2 text-sm">
                ({leaves.filter((l) => l.status === status).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Leave Cards */}
      {filteredLeaves.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">No leave records found</p>
          <p className="text-gray-500 text-sm mt-2">Your leave history will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLeaves.map((leave) => {
            const config = statusConfig[leave.status as StatusType];
            const canCancel =
              leave.status === 'APPROVED' &&
              new Date(leave.fromDate) > new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

            return (
              <div
                key={leave.id}
                className={`rounded-lg border-2 p-6 transition-all hover:shadow-md ${config.bg}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`${config.color}`}>{config.icon}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {leave.leaveType?.name || 'Leave Request'}
                      </h3>
                      <p className="text-sm text-gray-600">{leave.reason}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${config.color}`}>
                    {leave.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-600">From</p>
                    <p className="font-semibold text-gray-900">{formatDate(leave.fromDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">To</p>
                    <p className="font-semibold text-gray-900">{formatDate(leave.toDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Total Days</p>
                    <p className="font-semibold text-gray-900">{leave.days}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Applied On</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(leave.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Approvals Info */}
                {leave.approvals && leave.approvals.length > 0 && (
                  <div className="mb-4 p-4 bg-white bg-opacity-50 rounded border border-gray-300">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Approval Status</h4>
                    <div className="space-y-2">
                      {leave.approvals.map((approval, idx) => (
                        <div key={approval.id} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Level {approval.level} Approval</span>
                          <span
                            className={`font-semibold ${
                              approval.status === 'APPROVED'
                                ? 'text-green-700'
                                : approval.status === 'REJECTED'
                                  ? 'text-red-700'
                                  : 'text-yellow-700'
                            }`}
                          >
                            {approval.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                {canCancel && (
                  <div className="flex gap-2 pt-4 border-t border-gray-300">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleCancel(leave.id)}
                      disabled={cancelling === leave.id}
                      className="flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      {cancelling === leave.id ? 'Cancelling...' : 'Cancel Leave'}
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
