'use client';

import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DashboardLayout } from '@/components/DashboardLayout';
import { COLORS } from '@/config/theme';
import { User, Mail, Phone, Building2, Lock, Bell, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department: user?.department || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsEditing(false);
    }, 1000);
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: COLORS.textPrimary }}>
            My Profile
          </h1>
          <p className="mt-2" style={{ color: COLORS.textSecondary }}>
            Manage your account settings and preferences
          </p>
        </div>

        {/* Profile Header Card */}
        <div
          className="rounded-xl overflow-hidden mb-8 shadow-sm border"
          style={{ borderColor: COLORS.border, backgroundColor: COLORS.background }}
        >
          {/* Blue Header Banner */}
          <div className="h-32" style={{ backgroundColor: 'rgb(30, 58, 138)' }}></div>

          {/* Profile Content */}
          <div className="px-8 py-6 relative">
            {/* Avatar */}
            <div className="absolute -top-16 left-8">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4"
                style={{ backgroundColor: 'rgb(30, 58, 138)', borderColor: COLORS.background }}
              >
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </div>
            </div>

            {/* Profile Info */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold" style={{ color: COLORS.textPrimary }}>
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="mt-1" style={{ color: COLORS.textSecondary }}>
                {user?.email}
              </p>
              <div className="flex gap-2 mt-4">
                <span
                  className="px-3 py-1 text-sm font-medium rounded-full"
                  style={{ backgroundColor: 'rgb(30, 82, 143)', color: '#FFFFFF' }}
                >
                  {user?.role}
                </span>
                <span
                  className="px-3 py-1 text-sm font-medium rounded-full"
                  style={{ backgroundColor: COLORS.success, color: '#FFFFFF' }}
                >
                  ✓ Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div
          className="rounded-xl p-8 mb-8 shadow-sm border"
          style={{ borderColor: COLORS.border, backgroundColor: COLORS.background }}
        >
          <div className="flex justify-between items-center mb-6 pb-6" style={{ borderBottomColor: COLORS.border, borderBottomWidth: '1px' }}>
            <div className="flex items-center gap-3">
              <User size={24} style={{ color: 'rgb(30, 58, 138)' }} />
              <h3 className="text-xl font-semibold" style={{ color: COLORS.textPrimary }}>
                Personal Information
              </h3>
            </div>
            <Button
              variant={isEditing ? 'secondary' : 'primary'}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : '✏️ Edit Profile'}
            </Button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.textPrimary }}>
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg border transition"
                  style={{
                    borderColor: COLORS.border,
                    backgroundColor: isEditing ? COLORS.background : '#F9FAFB',
                    color: '#1F2937',
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.textPrimary }}>
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg border transition"
                  style={{
                    borderColor: COLORS.border,
                    backgroundColor: isEditing ? COLORS.background : '#F9FAFB',
                    color: '#1F2937',
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.textPrimary }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 rounded-lg border transition"
                style={{
                  borderColor: COLORS.border,
                  backgroundColor: isEditing ? COLORS.background : '#F9FAFB',
                  color: '#1F2937',
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.textPrimary }}>
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg border transition"
                  style={{
                    borderColor: COLORS.border,
                    backgroundColor: isEditing ? COLORS.background : '#F9FAFB',
                    color: '#1F2937',
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.textPrimary }}>
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg border transition"
                  style={{
                    borderColor: COLORS.border,
                    backgroundColor: isEditing ? COLORS.background : '#F9FAFB',
                    color: '#1F2937',
                  }}
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-4 pt-4" style={{ borderTopColor: COLORS.border, borderTopWidth: '1px' }}>
                <Button variant="primary" onClick={handleSave} isLoading={isLoading}>
                  💾 Save Changes
                </Button>
                <Button variant="secondary" onClick={() => setIsEditing(false)} disabled={isLoading}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Security Settings */}
        <div
          className="rounded-xl p-8 mb-8 shadow-sm border"
          style={{ borderColor: COLORS.border, backgroundColor: COLORS.background }}
        >
          <div className="flex items-center gap-3 mb-6 pb-6" style={{ borderBottomColor: COLORS.border, borderBottomWidth: '1px' }}>
            <Lock size={24} style={{ color: 'rgb(30, 58, 138)' }} />
            <h3 className="text-xl font-semibold" style={{ color: COLORS.textPrimary }}>
              Security Settings
            </h3>
          </div>
          <div className="space-y-4">
            <div
              className="flex items-center justify-between p-4 rounded-lg border"
              style={{ borderColor: COLORS.border, backgroundColor: '#F9FAFB' }}
            >
              <div>
                <p className="font-medium" style={{ color: COLORS.textPrimary }}>
                  Password
                </p>
                <p className="text-sm" style={{ color: COLORS.textSecondary }}>
                  Last changed 3 months ago
                </p>
              </div>
              <Button variant="secondary" size="sm">
                Change Password
              </Button>
            </div>
            <div
              className="flex items-center justify-between p-4 rounded-lg border"
              style={{ borderColor: COLORS.border, backgroundColor: '#F9FAFB' }}
            >
              <div>
                <p className="font-medium" style={{ color: COLORS.textPrimary }}>
                  Two-Factor Authentication
                </p>
                <p className="text-sm" style={{ color: COLORS.textSecondary }}>
                  Not enabled
                </p>
              </div>
              <Button variant="secondary" size="sm">
                Enable
              </Button>
            </div>
            <div
              className="flex items-center justify-between p-4 rounded-lg border"
              style={{ borderColor: COLORS.border, backgroundColor: '#F9FAFB' }}
            >
              <div>
                <p className="font-medium" style={{ color: COLORS.textPrimary }}>
                  Login Activity
                </p>
                <p className="text-sm" style={{ color: COLORS.textSecondary }}>
                  Last login today
                </p>
              </div>
              <Button variant="secondary" size="sm">
                View Log
              </Button>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div
          className="rounded-xl p-8 mb-8 shadow-sm border"
          style={{ borderColor: COLORS.border, backgroundColor: COLORS.background }}
        >
          <div className="flex items-center gap-3 mb-6 pb-6" style={{ borderBottomColor: COLORS.border, borderBottomWidth: '1px' }}>
            <Bell size={24} style={{ color: 'rgb(30, 58, 138)' }} />
            <h3 className="text-xl font-semibold" style={{ color: COLORS.textPrimary }}>
              Preferences
            </h3>
          </div>
          <div className="space-y-4">
            <div
              className="flex items-center justify-between p-4 rounded-lg border"
              style={{ borderColor: COLORS.border, backgroundColor: '#F9FAFB' }}
            >
              <div>
                <p className="font-medium" style={{ color: COLORS.textPrimary }}>
                  Email Notifications
                </p>
                <p className="text-sm" style={{ color: COLORS.textSecondary }}>
                  Receive email alerts for important updates
                </p>
              </div>
              <input type="checkbox" className="h-4 w-4" defaultChecked />
            </div>
            <div
              className="flex items-center justify-between p-4 rounded-lg border"
              style={{ borderColor: COLORS.border, backgroundColor: '#F9FAFB' }}
            >
              <div>
                <p className="font-medium" style={{ color: COLORS.textPrimary }}>
                  Language
                </p>
                <p className="text-sm" style={{ color: COLORS.textSecondary }}>
                  English
                </p>
              </div>
              <select
                className="px-3 py-2 rounded-md text-sm border"
                style={{ borderColor: COLORS.border, color: '#1F2937', backgroundColor: COLORS.background }}
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Spanish</option>
              </select>
            </div>
          </div>
        </div>

        {/* Logout Section */}
        <div
          className="rounded-xl p-8 shadow-sm border"
          style={{
            borderColor: COLORS.error,
            backgroundColor: COLORS.background,
            borderWidth: '2px',
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <LogOut size={24} style={{ color: COLORS.error }} />
            <h3 className="text-xl font-semibold" style={{ color: COLORS.error }}>
              Logout
            </h3>
          </div>
          <p className="text-sm mb-6" style={{ color: COLORS.textSecondary }}>
            Click below to end your current session. You will need to sign in again to access the application.
          </p>
          <Button
            variant="primary"
            onClick={handleLogout}
            isLoading={isLoading}
            style={{ backgroundColor: COLORS.error }}
          >
            🚪 Logout
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
