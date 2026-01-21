'use client';

import React, { useState, useEffect } from 'react';
import { Settings, AlertCircle, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import leaveService, { LeavePolicy, UpdatePolicyInput } from '@/services/api/leaveService';

export default function LeaveSettingsPanel() {
  const [policy, setPolicy] = useState<LeavePolicy | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<UpdatePolicyInput>({
    weekendDays: [],
    financialYearStart: 4,
    financialYearEnd: 3,
    lopConfiguration: {
      deductionPercentage: 100,
      applicableOnly: ['LOP', 'UNPAID'],
    },
    encashmentRules: {
      allowEncashment: true,
      maxEncashableDays: 10,
    },
  });

  useEffect(() => {
    loadPolicy();
  }, []);

  const loadPolicy = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await leaveService.getLeavePolicy();
      setPolicy(data);
      setFormData({
        weekendDays: data.weekendDays,
        financialYearStart: data.financialYearStart,
        financialYearEnd: data.financialYearEnd,
        lopConfiguration: data.lopConfiguration,
        encashmentRules: data.encashmentRules,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load leave policy',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleWeekendChange = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      weekendDays: prev.weekendDays?.includes(day)
        ? prev.weekendDays.filter((d) => d !== day)
        : [...(prev.weekendDays || []), day],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);

    try {
      await leaveService.updateLeavePolicy(formData);
      setSuccess(true);
      loadPolicy();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to update leave policy',
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading leave policy settings...</p>
      </div>
    );
  }

  const weekDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Settings size={32} className="text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Leave Policy Settings</h1>
            <p className="text-gray-600 mt-1">Configure company-wide leave policies</p>
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={loadPolicy}>
          Refresh
        </Button>
      </div>

      {/* Success Message */}
      {success && (
       
        <Alert type="success" message="Leave policy updated successfully!" className="mb-6" />
      )}

      {/* Error Message */}
      {error && (
       
        <Alert type="error" message={error} className="mb-6" />
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Financial Year Configuration */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Financial Year Settings</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Financial Year Start */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Financial Year Start Month
              </label>
              <select
                value={formData.financialYearStart || 4}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    financialYearStart: parseInt(e.target.value),
                  }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500"
                disabled={saving}
              >
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Financial Year End */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Financial Year End Month
              </label>
              <select
                value={formData.financialYearEnd || 3}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    financialYearEnd: parseInt(e.target.value),
                  }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500"
                disabled={saving}
              >
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Weekend Configuration */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Weekend Configuration</h2>
          <p className="text-gray-600 mb-4">Select days that are considered as weekends</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {weekDays.map((day) => (
              <label key={day} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.weekendDays?.includes(day) || false}
                  onChange={() => handleWeekendChange(day)}
                  className="w-4 h-4 text-blue-600 rounded"
                  disabled={saving}
                />
                <span className="text-gray-900">{day}</span>
              </label>
            ))}
          </div>
        </div>

        {/* LOP Configuration */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Leave Without Pay (LOP) Settings</h2>

          <div className="space-y-4">
            {/* LOP Deduction Percentage */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                LOP Salary Deduction (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={formData.lopConfiguration?.deductionPercentage || 100}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    lopConfiguration: {
                      ...prev.lopConfiguration!,
                      deductionPercentage: parseInt(e.target.value),
                    },
                  }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500"
                disabled={saving}
              />
              <p className="text-xs text-gray-500 mt-1">
                Percentage of salary to be deducted for LOP days
              </p>
            </div>

            {/* LOP Applicable Leave Types */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Leave Types Where LOP Applies
              </label>
              <div className="space-y-2">
                {['LOP', 'UNPAID', 'LWOP'].map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={
                        formData.lopConfiguration?.applicableOnly?.includes(type) || false
                      }
                      onChange={(e) => {
                        const current = formData.lopConfiguration?.applicableOnly || [];
                        const updated = e.target.checked
                          ? [...current, type]
                          : current.filter((t) => t !== type);

                        setFormData((prev) => ({
                          ...prev,
                          lopConfiguration: {
                            ...prev.lopConfiguration!,
                            applicableOnly: updated,
                          },
                        }));
                      }}
                      className="w-4 h-4 text-blue-600 rounded"
                      disabled={saving}
                    />
                    <span className="text-gray-900">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Encashment Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Leave Encashment Rules</h2>

          <div className="space-y-4">
            {/* Allow Encashment */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.encashmentRules?.allowEncashment || false}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    encashmentRules: {
                      ...prev.encashmentRules!,
                      allowEncashment: e.target.checked,
                    },
                  }))
                }
                className="w-4 h-4 text-blue-600 rounded"
                disabled={saving}
              />
              <span className="text-gray-900 font-semibold">
                Allow leave encashment
              </span>
            </label>

            {/* Max Encashable Days */}
            {formData.encashmentRules?.allowEncashment && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Maximum Encashable Days per Year
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={formData.encashmentRules?.maxEncashableDays || 0}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      encashmentRules: {
                        ...prev.encashmentRules!,
                        maxEncashableDays: parseInt(e.target.value),
                      },
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500"
                  disabled={saving}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum number of days that can be encashed in a year
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Policy Summary */}
        {policy && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Policy Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Financial Year</p>
                <p className="font-semibold text-gray-900">
                  {months.find((m) => m.value === policy.financialYearStart)?.label} -{' '}
                  {months.find((m) => m.value === policy.financialYearEnd)?.label}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Weekends</p>
                <p className="font-semibold text-gray-900">
                  {policy.weekendDays.join(', ')}
                </p>
              </div>
              <div>
                <p className="text-gray-600">LOP Deduction</p>
                <p className="font-semibold text-gray-900">
                  {policy.lopConfiguration.deductionPercentage}%
                </p>
              </div>
              <div>
                <p className="text-gray-600">Encashment</p>
                <p className="font-semibold text-gray-900">
                  {policy.encashmentRules.allowEncashment
                    ? `Up to ${policy.encashmentRules.maxEncashableDays} days/year`
                    : 'Not Allowed'}
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
            disabled={saving}
            className="flex-1"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={loadPolicy}
            disabled={saving}
            className="flex-1"
          >
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
}
