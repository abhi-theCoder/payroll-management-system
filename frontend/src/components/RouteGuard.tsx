'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { hasPermission, Permission, UserRole } from '@/config/rbac';
import { COLORS } from '@/config/theme';
import type { UserRole as UserRoleModel } from '@/types/models';

interface RouteGuardProps {
  requiredPermission: Permission;
  children: React.ReactNode;
}

export const RouteGuard = ({ requiredPermission, children }: RouteGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, isHydrated } = useAuth();

  useEffect(() => {
    // Wait for hydration to complete before doing any redirects
    if (!isHydrated) return;
    
    // Wait for auth to load
    if (isLoading) return;

    // Check if user exists and has required permission
    if (!user || !user.role) {
      // Store the page they were trying to access
      localStorage.setItem('redirectAfterLogin', pathname);
      router.push('/login');
      return;
    }

    const userRole = (user.role as unknown) as UserRole;
    if (!hasPermission(userRole, requiredPermission)) {
      // Redirect to dashboard if user doesn't have permission
      router.push('/dashboard');
      return;
    }
  }, [user, isLoading, requiredPermission, router, pathname, isHydrated]);

  // Show loading state
  if (isLoading) {
    return (
      <div
        className="w-full h-screen flex items-center justify-center"
        style={{ backgroundColor: COLORS.background }}
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

  // Show unauthorized message if user doesn't have permission
  if (!user || !user.role) {
    return null;
  }

  const userRole = (user.role as unknown) as UserRole;
  if (!hasPermission(userRole, requiredPermission)) {
    return (
      <div
        className="w-full h-screen flex items-center justify-center"
        style={{ backgroundColor: COLORS.background }}
      >
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto"
            style={{ backgroundColor: COLORS.error }}
          >
            <span style={{ fontSize: '32px' }}>🔒</span>
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: COLORS.textPrimary }}>
            Access Denied
          </h1>
          <p style={{ color: COLORS.textSecondary }} className="mb-6">
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2 rounded-lg text-white font-medium transition"
            style={{ backgroundColor: COLORS.primary[800] }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
