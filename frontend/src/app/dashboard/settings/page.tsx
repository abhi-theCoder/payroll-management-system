'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { DashboardLayout } from '@/components/DashboardLayout';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'company' | 'payroll' | 'tax' | 'system'>('company');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setTimeout(() => {
      setSuccessMessage('Settings saved successfully');
      setIsSaving(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-2">Configure system-wide settings and preferences</p>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-6">
            <Alert type="success" message={successMessage} onClose={() => setSuccessMessage(null)} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="divide-y">
                {(
                  [
                    { id: 'company', label: 'Company Details', icon: '🏢' },
                    { id: 'payroll', label: 'Payroll Settings', icon: '💰' },
                    { id: 'tax', label: 'Tax Configuration', icon: '📊' },
                    { id: 'system', label: 'System Settings', icon: '⚙️' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full px-4 py-3 text-left transition flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-8">
              {/* Company Details */}
              {activeTab === 'company' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Company Details</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input label="Company Name" type="text" value="ERP Payroll System" />
                      <Input label="Company Code" type="text" value="ERPP001" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input label="Registration Number" type="text" value="123456789" />
                      <Input label="CIN" type="text" value="U12345AB1234CIZ123456" />
                    </div>
                    <div>
                      <Input label="Address" type="text" value="123 Business Street, Mumbai" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Input label="City" type="text" value="Mumbai" />
                      <Input label="State" type="text" value="Maharashtra" />
                      <Input label="Pincode" type="text" value="400001" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input label="Phone" type="tel" value="+91 22 1234 5678" />
                      <Input label="Email" type="email" value="contact@company.com" />
                    </div>
                    <Button variant="primary" onClick={handleSave} isLoading={isSaving}>
                      Save Company Details
                    </Button>
                  </div>
                </div>
              )}

              {/* Payroll Settings */}
              {activeTab === 'payroll' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Payroll Settings</h2>
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-900 mb-3">Payroll Frequency</h3>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input type="radio" name="frequency" defaultChecked className="mr-2" />
                          <span className="text-sm text-blue-800">Monthly</span>
                        </label>
                        <label className="flex items-center">
                          <input type="radio" name="frequency" className="mr-2" />
                          <span className="text-sm text-blue-800">Weekly</span>
                        </label>
                        <label className="flex items-center">
                          <input type="radio" name="frequency" className="mr-2" />
                          <span className="text-sm text-blue-800">Bi-weekly</span>
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input label="Financial Year Start Month" type="number" value="4" />
                      <Input label="Default Working Days" type="number" value="5" />
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h3 className="font-semibold text-green-900 mb-3">Salary Components</h3>
                      <p className="text-sm text-green-800 mb-3">Default salary structure components</p>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-2" />
                          <span className="text-sm text-green-800">Basic Salary</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-2" />
                          <span className="text-sm text-green-800">Dearness Allowance (DA)</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-2" />
                          <span className="text-sm text-green-800">House Rent Allowance (HRA)</span>
                        </label>
                      </div>
                    </div>

                    <Button variant="primary" onClick={handleSave} isLoading={isSaving}>
                      Save Payroll Settings
                    </Button>
                  </div>
                </div>
              )}

              {/* Tax Configuration */}
              {activeTab === 'tax' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Tax Configuration</h2>
                  <div className="space-y-6">
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                      <h3 className="font-semibold text-purple-900 mb-4">Income Tax Slabs</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <Input label="From (₹)" type="number" value="0" />
                          <Input label="To (₹)" type="number" value="250000" />
                          <Input label="Rate (%)" type="number" value="0" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <Input label="From (₹)" type="number" value="250001" />
                          <Input label="To (₹)" type="number" value="500000" />
                          <Input label="Rate (%)" type="number" value="5" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <Input label="From (₹)" type="number" value="500001" />
                          <Input label="To (₹)" type="number" value="1000000" />
                          <Input label="Rate (%)" type="number" value="20" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input label="Standard Deduction (₹)" type="number" value="50000" />
                      <Input label="Rebate (₹)" type="number" value="12500" />
                    </div>

                    <Button variant="primary" onClick={handleSave} isLoading={isSaving}>
                      Save Tax Configuration
                    </Button>
                  </div>
                </div>
              )}

              {/* System Settings */}
              {activeTab === 'system' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">System Settings</h2>
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-4">Application Settings</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Currency</p>
                          <select defaultValue="INR" className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900">
                            <option value="INR">Indian Rupee (₹)</option>
                            <option value="USD">US Dollar ($)</option>
                            <option value="EUR">Euro (€)</option>
                          </select>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Date Format</p>
                          <select defaultValue="DD-MM-YYYY" className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900">
                            <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                            <option value="MM-DD-YYYY">MM-DD-YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                          </select>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Time Zone</p>
                          <select defaultValue="IST" className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900">
                            <option value="IST">IST (UTC +5:30)</option>
                            <option value="UTC">UTC</option>
                            <option value="GMT">GMT</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-4">Security Settings</h3>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-2" />
                          <span className="text-sm text-gray-700">Enable two-factor authentication</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-2" />
                          <span className="text-sm text-gray-700">Require password change every 90 days</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-sm text-gray-700">Enable audit logging</span>
                        </label>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-4">Backup Settings</h3>
                      <p className="text-sm text-gray-600 mb-3">Last backup: Today at 02:00 AM</p>
                      <Button variant="secondary" size="sm">
                        Backup Now
                      </Button>
                    </div>

                    <Button variant="primary" onClick={handleSave} isLoading={isSaving}>
                      Save System Settings
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
