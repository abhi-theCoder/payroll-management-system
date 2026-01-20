'use client';

import { BarChart3, Users, TrendingUp, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { COLORS } from '@/config/theme';

interface DashboardWidgetProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: number;
  color?: 'blue' | 'green' | 'yellow' | 'red';
}

const DashboardWidget = ({ title, value, subtitle, icon, trend, color = 'blue' }: DashboardWidgetProps) => {
  const colorMap = {
    blue: { bg: '#DBEAFE', text: '#2563EB', icon: '#2563EB' },
    green: { bg: '#D1FAE5', text: '#10B981', icon: '#10B981' },
    yellow: { bg: '#FEF3C7', text: '#F59E0B', icon: '#F59E0B' },
    red: { bg: '#FEE2E2', text: '#EF4444', icon: '#EF4444' },
  };

  const colors = colorMap[color];

  return (
    <div
      className="p-6 rounded-xl border transition hover:shadow-lg"
      style={{
        backgroundColor: COLORS.background,
        borderColor: COLORS.border,
        boxShadow: '0 1px 3px rgba(30, 58, 138, 0.1)',
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: colors.bg }}
        >
          <div style={{ color: colors.icon }}>{icon}</div>
        </div>
        {trend && (
          <div
            className="flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded"
            style={{
              backgroundColor: trend > 0 ? '#D1FAE5' : '#FEE2E2',
              color: trend > 0 ? '#10B981' : '#EF4444',
            }}
          >
            <TrendingUp size={16} />
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>

      <h3 style={{ color: COLORS.textSecondary }} className="text-sm font-medium mb-2">
        {title}
      </h3>

      <p className="text-3xl font-bold mb-1" style={{ color: COLORS.textPrimary }}>
        {value}
      </p>

      {subtitle && (
        <p style={{ color: COLORS.textMuted }} className="text-xs">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export const ProfessionalDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.textPrimary }}>
          Dashboard
        </h1>
        <p style={{ color: COLORS.textSecondary }}>Welcome back! Here's your payroll overview.</p>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardWidget
          title="Total Employees"
          value="1,245"
          subtitle="Active employees"
          icon={<Users size={24} />}
          trend={8}
          color="blue"
        />

        <DashboardWidget
          title="Monthly Payroll"
          value="₹2,450,000"
          subtitle="Current month cost"
          icon={<BarChart3 size={24} />}
          trend={5}
          color="green"
        />

        <DashboardWidget
          title="Payroll Status"
          value="In Progress"
          subtitle="Processing January"
          icon={<Clock size={24} />}
          color="yellow"
        />

        <DashboardWidget
          title="Statutory Dues"
          value="₹485,200"
          subtitle="PF & ESI dues"
          icon={<CheckCircle size={24} />}
          trend={2}
          color="green"
        />

        <DashboardWidget
          title="Pending Approvals"
          value="23"
          subtitle="Awaiting review"
          icon={<AlertCircle size={24} />}
          color="red"
        />

        <DashboardWidget
          title="Tax Declarations"
          value="95%"
          subtitle="Employees filed"
          icon={<CheckCircle size={24} />}
          trend={12}
          color="green"
        />
      </div>

      {/* Quick Actions */}
      <div
        className="p-6 rounded-xl border"
        style={{
          backgroundColor: COLORS.background,
          borderColor: COLORS.border,
        }}
      >
        <h2 className="text-lg font-bold mb-4" style={{ color: COLORS.textPrimary }}>
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Process Payroll', icon: '⚡' },
            { label: 'Add Employee', icon: '👤' },
            { label: 'Generate Reports', icon: '📊' },
            { label: 'File Compliance', icon: '✓' },
          ].map((action) => (
            <button
              key={action.label}
              className="p-4 rounded-lg border-2 transition hover:bg-blue-50"
              style={{
                borderColor: COLORS.border,
                color: COLORS.primary[800],
              }}
            >
              <div className="text-2xl mb-2">{action.icon}</div>
              <span className="font-medium text-sm">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div
          className="p-6 rounded-xl border"
          style={{
            backgroundColor: COLORS.background,
            borderColor: COLORS.border,
          }}
        >
          <h3 className="text-lg font-bold mb-4" style={{ color: COLORS.textPrimary }}>
            Recent Activity
          </h3>
          <div className="space-y-3">
            {[
              { title: 'Payroll Executed', time: '2 hours ago', status: 'completed' },
              { title: 'Employee Added: John Doe', time: '4 hours ago', status: 'completed' },
              { title: 'Compliance Check', time: '1 day ago', status: 'completed' },
            ].map((activity) => (
              <div key={activity.title} className="flex items-start gap-3 pb-3 border-b" style={{ borderBottomColor: COLORS.border }}>
                <div
                  className="w-2 h-2 rounded-full mt-1.5"
                  style={{ backgroundColor: COLORS.success }}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>
                    {activity.title}
                  </p>
                  <p className="text-xs" style={{ color: COLORS.textMuted }}>
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div
          className="p-6 rounded-xl border"
          style={{
            backgroundColor: COLORS.background,
            borderColor: COLORS.border,
          }}
        >
          <h3 className="text-lg font-bold mb-4" style={{ color: COLORS.textPrimary }}>
            Upcoming Tasks
          </h3>
          <div className="space-y-3">
            {[
              { title: 'End of Month Payroll', date: 'Jan 31', priority: 'high' },
              { title: 'File PF Returns', date: 'Feb 15', priority: 'medium' },
              { title: 'Tax Audit Review', date: 'Feb 28', priority: 'medium' },
            ].map((task) => (
              <div key={task.title} className="flex items-start gap-3 pb-3 border-b" style={{ borderBottomColor: COLORS.border }}>
                <div
                  className={`w-2 h-2 rounded-full mt-1.5`}
                  style={{
                    backgroundColor:
                      task.priority === 'high' ? COLORS.error : COLORS.warning,
                  }}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>
                    {task.title}
                  </p>
                  <p className="text-xs" style={{ color: COLORS.textMuted }}>
                    Due: {task.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
