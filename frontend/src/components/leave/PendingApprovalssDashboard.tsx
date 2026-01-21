'use client';

import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import leaveService, { LeaveRequest } from '@/services/api/leaveService';

interface PendingApprovalsProps {
  onRefresh?: () => void;
}

export default function PendingApprovalssDashboard({ onRefresh }: PendingApprovalsProps) {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [approvalRemark, setApprovalRemark] = useState<Record<string, string>>({});
  const [rejectionReason, setRejectionReason] = useState<Record<string, string>>({});
  const [showApprovalForm, setShowApprovalForm] = useState<string | null>(null);
  const [showRejectionForm, setShowRejectionForm] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadPendingLeaves = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await leaveService.getPendingLeaves();
      setLeaves(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pending leaves');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingLeaves();
  }, []);

  const handleApprove = async (leaveId: string) => {
    setActionInProgress(leaveId);
    try {
      await leaveService.approveLeave(leaveId, {
        remarks: approvalRemark[leaveId],
      });
      setSuccess(`Leave request approved successfully!`);
      setShowApprovalForm(null);
      setApprovalRemark((prev) => ({ ...prev, [leaveId]: '' }));
      loadPendingLeaves();
      onRefresh?.();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve leave');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleReject = async (leaveId: string) => {
    if (!rejectionReason[leaveId]?.trim()) {
      setError('Rejection reason is required');
      return;
    }

    setActionInProgress(leaveId);
    try {
      await leaveService.rejectLeave(leaveId, {
        reason: rejectionReason[leaveId],
      });
      setSuccess(`Leave request rejected successfully!`);
      setShowRejectionForm(null);
      setRejectionReason((prev) => ({ ...prev, [leaveId]: '' }));
      loadPendingLeaves();
      onRefresh?.();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject leave');
    } finally {
      setActionInProgress(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading pending leave approvals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Success Message */}
      {success && (
        <Alert type="success" message={success} className="mb-6" />
     
      )}

      {/* Error Message */}
      {error && (
        <Alert type="error" message={error} className="mb-6" />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pending Approvals</h2>
          <p className="text-gray-600 mt-1">
            {leaves.length} leave request(s) awaiting approval
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={loadPendingLeaves}>
          Refresh
        </Button>
      </div>

      {/* Stats */}
      {leaves.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">Total Pending</p>
            <p className="text-3xl font-bold text-blue-600">{leaves.length}</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">Awaiting First Approval</p>
            <p className="text-3xl font-bold text-purple-600">
              {leaves.filter((l) => !l.approvals || l.approvals.length === 0).length}
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">Multi-Level Approvals</p>
            <p className="text-3xl font-bold text-amber-600">
              {leaves.filter((l) => l.approvals && l.approvals.length > 0).length}
            </p>
          </div>
        </div>
      )}

      {/* Leave Requests */}
      {leaves.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <CheckCircle size={48} className="mx-auto text-green-400 mb-4" />
          <p className="text-gray-600 text-lg">No pending leave approvals</p>
          <p className="text-gray-500 text-sm mt-2">All leave requests are processed!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {leaves.map((leave) => {
            const isExpanded = expandedId === leave.id;
            const isProcessing = actionInProgress === leave.id;

            return (
              <div
                key={leave.id}
                className="bg-white rounded-lg shadow border-l-4 border-amber-400 overflow-hidden"
              >
                {/* Request Header */}
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : leave.id)
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <Clock size={24} className="text-amber-600" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {leave.leaveType?.name || 'Leave Request'}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {formatDate(leave.fromDate)} to{' '}
                          {formatDate(leave.toDate)} ({leave.days} day
                          {leave.days !== 1 ? 's' : ''})
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Applied</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatDateTime(leave.createdAt)}
                        </p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp size={24} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={24} className="text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50 space-y-6">
                    {/* Reason */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Reason for Leave
                      </h4>
                      <p className="text-gray-700 p-3 bg-white rounded border border-gray-200">
                        {leave.reason}
                      </p>
                    </div>

                    {/* Approval Workflow */}
                    {leave.approvals && leave.approvals.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Approval Status
                        </h4>
                        <div className="space-y-3">
                          {leave.approvals.map((approval, idx) => (
                            <div
                              key={approval.id}
                              className="p-4 bg-white rounded border border-gray-200 flex items-start gap-4"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-sm font-semibold text-gray-900">
                                    Level {approval.level} Approval
                                  </span>
                                  {approval.status === 'APPROVED' && (
                                    <CheckCircle size={16} className="text-green-600" />
                                  )}
                                  {approval.status === 'REJECTED' && (
                                    <XCircle size={16} className="text-red-600" />
                                  )}
                                  {approval.status === 'PENDING' && (
                                    <Clock size={16} className="text-yellow-600" />
                                  )}
                                </div>
                                <p className="text-xs text-gray-600">
                                  Status: {approval.status}
                                </p>
                                {approval.remarks && (
                                  <p className="text-sm text-gray-700 mt-2 p-2 bg-gray-100 rounded">
                                    {approval.remarks}
                                  </p>
                                )}
                                {approval.approvedAt && (
                                  <p className="text-xs text-gray-500 mt-2">
                                    {formatDateTime(approval.approvedAt)}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-gray-200 space-y-4">
                      {/* Approval Form */}
                      {showApprovalForm === leave.id && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                              Approval Remarks (Optional)
                            </label>
                            <textarea
                              value={approvalRemark[leave.id] || ''}
                              onChange={(e) =>
                                setApprovalRemark((prev) => ({
                                  ...prev,
                                  [leave.id]: e.target.value,
                                }))
                              }
                              placeholder="Add any remarks for this approval..."
                              className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 text-sm resize-none"
                              rows={3}
                              disabled={isProcessing}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleApprove(leave.id)}
                              disabled={isProcessing}
                              className="flex-1"
                            >
                              {isProcessing ? 'Approving...' : 'Confirm Approval'}
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setShowApprovalForm(null)}
                              disabled={isProcessing}
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Rejection Form */}
                      {showRejectionForm === leave.id && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                              Rejection Reason <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              value={rejectionReason[leave.id] || ''}
                              onChange={(e) =>
                                setRejectionReason((prev) => ({
                                  ...prev,
                                  [leave.id]: e.target.value,
                                }))
                              }
                              placeholder="Enter reason for rejection..."
                              className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 text-sm resize-none"
                              rows={3}
                              disabled={isProcessing}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleReject(leave.id)}
                              disabled={isProcessing || !rejectionReason[leave.id]?.trim()}
                              className="flex-1"
                            >
                              {isProcessing ? 'Rejecting...' : 'Confirm Rejection'}
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setShowRejectionForm(null)}
                              disabled={isProcessing}
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {showApprovalForm !== leave.id && showRejectionForm !== leave.id && (
                        <div className="flex gap-3">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => setShowApprovalForm(leave.id)}
                            disabled={isProcessing}
                            className="flex-1 flex items-center justify-center gap-2"
                          >
                            <CheckCircle size={16} />
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => setShowRejectionForm(leave.id)}
                            disabled={isProcessing}
                            className="flex-1 flex items-center justify-center gap-2"
                          >
                            <XCircle size={16} />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
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
