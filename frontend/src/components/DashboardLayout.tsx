'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Sidebar } from '@/components/Sidebar';
import { TopHeader } from '@/components/TopHeader';
import { COLORS } from '@/config/theme';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div
        className="w-full h-screen flex items-center justify-center"
        style={{ backgroundColor: COLORS.backgroundLight }}
      >
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-full animate-spin mb-4 mx-auto"
            style={{
              borderTop: `3px solid ${COLORS.primary[800]}`,
              borderRight: `3px solid ${COLORS.primary[200]}`,
              borderBottom: `3px solid ${COLORS.primary[200]}`,
              borderLeft: `3px solid ${COLORS.primary[200]}`,
            }}
          />
          <p style={{ color: COLORS.textSecondary }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: COLORS.backgroundLight }}>
      {/* Sidebar */}
      <Sidebar isCollapsed={isSidebarCollapsed} onCollapse={setIsSidebarCollapsed} />

      {/* Top Header */}
      <TopHeader isSidebarCollapsed={isSidebarCollapsed} />

      {/* Main Content */}
      <main
        className="transition-all duration-300 pt-16"
        style={{
          marginLeft: isSidebarCollapsed ? '80px' : '280px',
        }}
      >
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
