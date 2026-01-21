'use client';

import Link from 'next/link';
import { COLORS } from '@/config/theme';

export default function HomePage() {

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.background }}>
      {/* Navigation Bar */}
      <nav
        className="fixed top-0 w-full z-50 border-b"
        style={{ borderBottomColor: COLORS.border, backgroundColor: COLORS.background }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: COLORS.primary[800] }}
            >
              ERP
            </div>
            <span className="text-xl font-bold" style={{ color: COLORS.primary[800] }}>
              Payroll
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="px-6 py-2 rounded-lg font-medium transition text-white"
              style={{ backgroundColor: COLORS.primary[800] }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-6" style={{ backgroundColor: COLORS.backgroundLight }}>
        <div className="max-w-4xl mx-auto text-center py-20">
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ color: COLORS.primary[800] }}>
            Enterprise Payroll Management System
          </h1>
          <p className="text-xl mb-8" style={{ color: COLORS.textSecondary }}>
            A modern, comprehensive platform for managing employee payroll, salary structures, and compliance requirements. Built for enterprise HR and finance teams.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-3 rounded-lg font-medium text-white transition hover:shadow-lg"
              style={{ backgroundColor: COLORS.primary[600] }}
            >
              Get Started
            </Link>
            <button
              className="px-8 py-3 rounded-lg font-medium border-2 transition hover:bg-gray-50"
              style={{ borderColor: COLORS.primary[800], color: COLORS.primary[800] }}
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16" style={{ color: COLORS.textPrimary }}>
            Powerful Features
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '👥',
                title: 'Employee Management',
                desc: 'Manage employee records, documents, and personnel information centrally.',
              },
              {
                icon: '💰',
                title: 'Salary Management',
                desc: 'Configure salary structures, components, and calculate payroll automatically.',
              },
              {
                icon: '📋',
                title: 'Payroll Processing',
                desc: 'Process payroll efficiently with approval workflows and compliance checks.',
              },
              {
                icon: '✓',
                title: 'Compliance & Tax',
                desc: 'Stay compliant with tax regulations, PF, and ESI filing requirements.',
              },
              {
                icon: '📊',
                title: 'Reports & Analytics',
                desc: 'Generate comprehensive reports for HR, finance, and compliance teams.',
              },
              {
                icon: '🔐',
                title: 'Role-Based Access',
                desc: 'Fine-grained permissions for Admin, HR, Accounts, and Employees.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-8 rounded-xl border transition hover:shadow-lg"
                style={{
                  backgroundColor: COLORS.background,
                  borderColor: COLORS.border,
                }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3" style={{ color: COLORS.textPrimary }}>
                  {feature.title}
                </h3>
                <p style={{ color: COLORS.textSecondary }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20 px-6" style={{ backgroundColor: COLORS.backgroundLight }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16" style={{ color: COLORS.textPrimary }}>
            Built for Every Role
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                role: 'Admin',
                desc: 'Full access to all modules, user management, and system configuration.',
                permissions: [
                  'Manage all employees',
                  'Configure salary rules',
                  'Execute payroll',
                  'Lock payroll',
                  'Access all reports',
                  'System settings',
                ],
              },
              {
                role: 'HR Manager',
                desc: 'Manage employees, view payroll, and handle leave management.',
                permissions: [
                  'Manage employees',
                  'View salary structure',
                  'Approve leave',
                  'Limited reports',
                  'Attendance tracking',
                  'Compliance status',
                ],
              },
              {
                role: 'Accounts',
                desc: 'Execute payroll, manage compliance, and generate financial reports.',
                permissions: [
                  'Execute payroll',
                  'Lock payroll',
                  'Tax declarations',
                  'Financial reports',
                  'Compliance filing',
                  'ESI/PF management',
                ],
              },
              {
                role: 'Employee',
                desc: 'View personal payslips, tax information, and leave balance.',
                permissions: [
                  'View payslips',
                  'Download payslips',
                  'Tax declarations',
                  'Salary breakdown',
                  'Profile settings',
                  'Apply leave',
                ],
              },
            ].map((item) => (
              <div
                key={item.role}
                className="p-8 rounded-xl border"
                style={{
                  backgroundColor: COLORS.background,
                  borderColor: COLORS.border,
                }}
              >
                <h3 className="text-2xl font-bold mb-3" style={{ color: COLORS.primary[800] }}>
                  {item.role}
                </h3>
                <p className="mb-6" style={{ color: COLORS.textSecondary }}>
                  {item.desc}
                </p>
                <div className="space-y-2">
                  {item.permissions.map((perm) => (
                    <div key={perm} className="flex items-center gap-3 text-sm" style={{ color: COLORS.textPrimary }}>
                      <span style={{ color: COLORS.success }}>✓</span>
                      {perm}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div
          className="max-w-3xl mx-auto rounded-xl p-12 text-center text-white"
          style={{ backgroundColor: COLORS.primary[800] }}
        >
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Payroll?</h2>
          <p className="text-lg opacity-90 mb-8">
            Start managing your payroll efficiently with our enterprise-grade system.
          </p>
          <Link
            href="/login"
            className="inline-block px-8 py-3 rounded-lg font-medium text-white transition hover:opacity-90"
            style={{ backgroundColor: COLORS.background, color: COLORS.primary[800] }}
          >
            Sign In Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t py-8 px-6"
        style={{ borderTopColor: COLORS.border, backgroundColor: COLORS.backgroundLight }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: COLORS.primary[800] }}
            >
              ERP
            </div>
            <span className="font-bold" style={{ color: COLORS.textPrimary }}>
              Payroll System
            </span>
          </div>
          <p style={{ color: COLORS.textSecondary }}>
            © 2026 Enterprise Payroll System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
        