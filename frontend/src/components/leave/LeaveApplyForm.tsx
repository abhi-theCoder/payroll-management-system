'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import leaveService, { LeaveType, LeaveBalance, ApplyLeaveInput } from '@/services/api/leaveService';

interface LeaveApplyFormProps {
  leaveTypes: LeaveType[];
  balances: LeaveBalance[];
  onSuccess?: () => void;
  onCancel?: () => void;
}

export  function LeaveApplyForm({
  leaveTypes,
  balances,
  onSuccess,
  onCancel,
}: LeaveApplyFormProps) {
  const [formData, setFormData] = useState<ApplyLeaveInput>({
    leaveTypeId: '',
    fromDate: '',
    toDate: '',
    reason: '',
    documentUrl: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [calculatedDays, setCalculatedDays] = useState(0);
  const [selectedBalance, setSelectedBalance] = useState<LeaveBalance | null>(null);

  // Calculate days when dates change
  useEffect(() => {
    if (formData.fromDate && formData.toDate) {
      const from = new Date(formData.fromDate);
      const to = new Date(formData.toDate);
      
      if (from <= to) {
        const diffTime = Math.abs(to.getTime() - from.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        setCalculatedDays(diffDays);
      }
    } else {
      setCalculatedDays(0);
    }
  }, [formData.fromDate, formData.toDate]);

  // Update selected balance when leave type changes
  useEffect(() => {
    if (formData.leaveTypeId) {
      const balance = balances.find(
        (b) => b.leaveTypeId === formData.leaveTypeId,
      );
      setSelectedBalance(balance || null);
    } else {
      setSelectedBalance(null);
    }
  }, [formData.leaveTypeId, balances]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation
    if (!formData.leaveTypeId) {
      setError('Please select a leave type');
      return;
    }
    if (!formData.fromDate) {
      setError('Please select a from date');
      return;
    }
    if (!formData.toDate) {
      setError('Please select a to date');
      return;
    }
    if (new Date(formData.fromDate) > new Date(formData.toDate)) {
      setError('From date must be before to date');
      return;
    }
    if (!formData.reason.trim()) {
      setError('Please provide a reason for the leave');
      return;
    }
    if (formData.reason.trim().length < 10) {
      setError('Reason must be at least 10 characters long');
      return;
    }

    // Check balance
    if (selectedBalance && calculatedDays > selectedBalance.remaining) {
      setError(
        `Insufficient balance. You have ${selectedBalance.remaining} days remaining`,
      );
      return;
    }

    setLoading(true);
    try {
      const input: ApplyLeaveInput = {
        leaveTypeId: formData.leaveTypeId,
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        reason: formData.reason,
        documentUrl: formData.documentUrl || undefined,
      };

      await leaveService.applyLeave(input);
      setSuccess(true);
      setFormData({
        leaveTypeId: '',
        fromDate: '',
        toDate: '',
        reason: '',
        documentUrl: '',
      });

      // Call success callback after 2 seconds
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to apply for leave',
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedLeaveType = leaveTypes.find(
    (lt) => lt.id === formData.leaveTypeId,
  );

  return (
    <div className="w-full max-w-2xl">
      {/* Success Message */}
      {success && (
        <Alert type="success" message='Leave request submitted successfully! Pending approval. ' className="mb-6" />
         
      )}

      {/* Error Message */}
      {error && (
        <Alert type="error" message={error} className="mb-6" />
      )}    
     

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        {/* Leave Type */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Leave Type <span className="text-red-500">*</span>
          </label>
          <select
            name="leaveTypeId"
            value={formData.leaveTypeId}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500"
            disabled={loading}
          >
            <option value="">Select leave type...</option>
            {leaveTypes.map((lt) => {
              const balance = balances.find((b) => b.leaveTypeId === lt.id);
              return (
                <option key={lt.id} value={lt.id}>
                  {lt.name} (Available: {balance?.remaining || 0} days)
                </option>
              );
            })}
          </select>
        </div>

        {/* From Date */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              From Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar size={18} className="absolute left-3 top-3 text-gray-500" />
              <input
                type="date"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500"
                disabled={loading}
              />
            </div>
          </div>

          {/* To Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              To Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar size={18} className="absolute left-3 top-3 text-gray-500" />
              <input
                type="date"
                name="toDate"
                value={formData.toDate}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Calculated Days */}
        {calculatedDays > 0 && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm text-gray-700">
              <p>
                <strong>Total Days:</strong> {calculatedDays} day(s)
              </p>
              {selectedBalance && (
                <p className="mt-2">
                  <strong>Remaining Balance:</strong> {selectedBalance.remaining} day(s)
                </p>
              )}
            </div>
          </div>
        )}

        {/* Reason */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="Enter reason for leave (minimum 10 characters)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 resize-none"
            rows={4}
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.reason.length}/minimum 10 characters
          </p>
        </div>

        {/* Document URL (optional) */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Document URL (Optional)
          </label>
          <Input
            type="url"
            name="documentUrl"
            value={formData.documentUrl || ''}
            onChange={handleChange}
            placeholder="https://example.com/document.pdf"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Upload proof/document if required for this leave type
          </p>
        </div>

        {/* Leave Type Info */}
        {selectedLeaveType && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Leave Type Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Type</p>
                <p className="font-semibold text-gray-900">{selectedLeaveType.name}</p>
              </div>
              <div>
                <p className="text-gray-600">Annual Quota</p>
                <p className="font-semibold text-gray-900">
                  {selectedLeaveType.maxPerYear} days
                </p>
              </div>
              <div>
                <p className="text-gray-600">Paid</p>
                <p className="font-semibold text-gray-900">
                  {selectedLeaveType.isPaid ? 'Yes' : 'No'}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Carry Forward</p>
                <p className="font-semibold text-gray-900">
                  {selectedLeaveType.carryForward} days
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex gap-4 pt-6 border-t border-gray-200">
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Submitting...' : 'Submit Leave Request'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

export default LeaveApplyForm;
