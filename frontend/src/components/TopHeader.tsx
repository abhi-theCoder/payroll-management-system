'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { COLORS } from '@/config/theme';
import { Bell, LogOut, Settings, User } from 'lucide-react';

interface TopHeaderProps {
  isSidebarCollapsed?: boolean;
}

export const TopHeader = ({ isSidebarCollapsed = false }: TopHeaderProps) => {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header
      className="fixed top-0 right-0 h-16 border-b bg-white z-30 transition-all duration-300 flex items-center justify-between px-8"
      style={{
        left: isSidebarCollapsed ? '80px' : '280px',
        borderBottomColor: COLORS.border,
      }}
    >
      {/* Breadcrumb / Title */}
      <div className="flex-1" />

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="p-2 hover:bg-gray-100 rounded-lg transition relative">
          <Bell size={20} style={{ color: COLORS.textSecondary }} />
          <span
            className="absolute top-1 right-1 w-2 h-2 rounded-full"
            style={{ backgroundColor: COLORS.error }}
          />
        </button>

        {/* Divider */}
        <div style={{ width: '1px', height: '24px', backgroundColor: COLORS.border }} />

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg transition"
          >
            <div className="flex flex-col items-end">
              <p className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs" style={{ color: COLORS.textSecondary }}>
                {user?.role}
              </p>
            </div>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: COLORS.primary[600] }}
            >
              {user?.firstName?.[0]?.toUpperCase()}
              {user?.lastName?.[0]?.toUpperCase()}
            </div>
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div
              className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white py-2 z-50"
              style={{ boxShadow: `0 10px 15px -3px rgba(30, 58, 138, 0.1)` }}
            >
              <button
                onClick={() => {
                  router.push('/dashboard/profile');
                  setIsProfileOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition"
                style={{ color: COLORS.textPrimary }}
              >
                <User size={18} />
                View Profile
              </button>

              <button
                onClick={() => {
                  router.push('/dashboard/settings');
                  setIsProfileOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition"
                style={{ color: COLORS.textPrimary }}
              >
                <Settings size={18} />
                Settings
              </button>

              <div
                className="my-2"
                style={{ height: '1px', backgroundColor: COLORS.border }}
              />

              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-red-50 transition"
                style={{ color: COLORS.error }}
              >
                <LogOut size={18} />
                {isLoading ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
