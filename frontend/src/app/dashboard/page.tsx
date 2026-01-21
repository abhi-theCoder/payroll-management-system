'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { ProfessionalDashboard } from '@/components/ProfessionalDashboard';
import { useAuth } from '@/hooks/useAuth';
import { COLORS } from '@/config/theme';

export default function DashboardPage() {
  const { user } = useAuth();

  // Only ADMIN sees the full dashboard with tiles
  if (user && user.role === 'ADMIN') {
    return (
      <DashboardLayout>
        <ProfessionalDashboard />
      </DashboardLayout>
    );
  }

  // Employees see a personalized welcome page
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.textPrimary }}>
            Welcome, {user?.firstName}!
          </h1>
          <p style={{ color: COLORS.textSecondary }}>
            Here's your personal information and payroll details.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Personal Information Card */}
          <div
            className="rounded-xl p-8 border shadow-sm"
            style={{ borderColor: COLORS.border, backgroundColor: COLORS.background }}
          >
            <h2 className="text-xl font-bold mb-6" style={{ color: COLORS.textPrimary }}>
              Personal Information
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm" style={{ color: COLORS.textSecondary }}>
                  Employee ID
                </p>
                <p className="text-lg font-semibold" style={{ color: COLORS.textPrimary }}>
                  EMP-001
                </p>
              </div>
              <div>
                <p className="text-sm" style={{ color: COLORS.textSecondary }}>
                  Email
                </p>
                <p className="text-lg font-semibold" style={{ color: COLORS.textPrimary }}>
                  {user?.email}
                </p>
              </div>
              <div>
                <p className="text-sm" style={{ color: COLORS.textSecondary }}>
                  Department
                </p>
                <p className="text-lg font-semibold" style={{ color: COLORS.textPrimary }}>
                  {user?.department}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links Card */}
          <div
            className="rounded-xl p-8 border shadow-sm"
            style={{ borderColor: COLORS.border, backgroundColor: COLORS.background }}
          >
            <h2 className="text-xl font-bold mb-6" style={{ color: COLORS.textPrimary }}>
              Quick Links
            </h2>
            <div className="space-y-3">
              <button
                className="w-full py-3 px-4 rounded-lg text-left font-medium transition"
                style={{
                  backgroundColor: 'rgb(30, 82, 143)',
                  color: '#FFFFFF',
                }}
              >
                📋 View My Payslips
              </button>
              <button
                className="w-full py-3 px-4 rounded-lg text-left font-medium transition border"
                style={{
                  borderColor: COLORS.border,
                  color: 'rgb(30, 58, 138)',
                }}
              >
                📊 View Salary Structure
              </button>
              <button
                className="w-full py-3 px-4 rounded-lg text-left font-medium transition border"
                style={{
                  borderColor: COLORS.border,
                  color: 'rgb(30, 58, 138)',
                }}
              >
                🎫 Apply Leave
              </button>
            </div>
          </div>
        </div>

        {/* Recent Payslips */}
        <div
          className="rounded-xl p-8 border shadow-sm mt-6"
          style={{ borderColor: COLORS.border, backgroundColor: COLORS.background }}
        >
          <h2 className="text-xl font-bold mb-6" style={{ color: COLORS.textPrimary }}>
            Recent Payslips
          </h2>
          <div className="space-y-3">
            {[
              { month: 'January 2026', status: 'Paid', amount: '₹45,000' },
              { month: 'December 2025', status: 'Paid', amount: '₹45,000' },
              { month: 'November 2025', status: 'Paid', amount: '₹45,000' },
            ].map((payslip) => (
              <div
                key={payslip.month}
                className="flex items-center justify-between p-4 rounded-lg border"
                style={{ borderColor: COLORS.border, backgroundColor: '#F9FAFB' }}
              >
                <div>
                  <p className="font-medium" style={{ color: COLORS.textPrimary }}>
                    {payslip.month}
                  </p>
                  <p className="text-sm" style={{ color: COLORS.textSecondary }}>
                    {payslip.status}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold" style={{ color: COLORS.textPrimary }}>
                    {payslip.amount}
                  </p>
                  <button
                    className="text-sm font-medium mt-1"
                    style={{ color: 'rgb(30, 58, 138)' }}
                  >
                    Download ↓
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
         
