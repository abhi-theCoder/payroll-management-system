'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { COLORS } from '@/config/theme';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('puspendu.developer@gmail.com');
  const [password, setPassword] = useState('Test@123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      
      // Check if user was trying to access a specific page before login
      const redirectTo = localStorage.getItem('redirectAfterLogin') || '/dashboard';
      localStorage.removeItem('redirectAfterLogin');
      
      router.push(redirectTo);
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: COLORS.background }}
    >
      {/* Left Panel - Brand & Features */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12"
        style={{ backgroundColor: COLORS.primary[800] }}
      >
        <div>
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
              <span
                className="text-lg font-bold"
                style={{ color: COLORS.primary[800] }}
              >
                ERP
              </span>
            </div>
            <span className="text-2xl font-bold text-white">Payroll</span>
          </Link>
        </div>

        <div className="text-white">
          <h1 className="text-4xl font-bold mb-6">
            Enterprise Payroll Management System
          </h1>
          <p className="text-lg opacity-90 mb-8">
            Streamline your payroll operations with our comprehensive HRMS solution.
          </p>

          <div className="space-y-4">
            {[
              { icon: '✓', title: 'Role-Based Access', desc: 'Secure permissions for all user types' },
              { icon: '✓', title: 'Automated Payroll', desc: 'Process payroll effortlessly' },
              { icon: '✓', title: 'Compliance Ready', desc: 'Tax & statutory compliance built-in' },
              { icon: '✓', title: 'Real-Time Reports', desc: 'Generate reports instantly' },
            ].map((feature) => (
              <div key={feature.title} className="flex gap-3 items-start">
                <span className="text-2xl">{feature.icon}</span>
                <div>
                  <p className="font-semibold text-white">{feature.title}</p>
                  <p className="text-sm opacity-80">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-white text-sm opacity-75">
          <p>© 2026 ERP Payroll System. All rights reserved.</p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 lg:p-0">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2" style={{ color: COLORS.textPrimary }}>
              Welcome Back
            </h2>
            <p style={{ color: COLORS.textSecondary }}>
              Sign in to your account to access the payroll management system
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="p-4 rounded-lg mb-6 border"
              style={{
                backgroundColor: '#FEE2E2',
                borderColor: '#FCA5A5',
                color: '#7F1D1D',
              }}
            >
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: COLORS.textPrimary }}
              >
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg border focus:outline-none transition"
                style={{
                  borderColor: COLORS.border,
                  color: COLORS.textPrimary,
                  backgroundColor: COLORS.backgroundLight,
                  boxShadow: `inset 0 1px 3px rgba(30, 58, 138, 0.1)`,
                }}
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: COLORS.textPrimary }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-lg border focus:outline-none transition"
                style={{
                  borderColor: COLORS.border,
                  color: COLORS.textPrimary,
                  backgroundColor: COLORS.backgroundLight,
                  boxShadow: `inset 0 1px 3px rgba(30, 58, 138, 0.1)`,
                }}
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="rounded"
                  style={{ accentColor: COLORS.primary[600] }}
                />
                <span style={{ color: COLORS.textSecondary }}>Remember me</span>
              </label>
              <Link
                href="#"
                className="transition"
                style={{ color: COLORS.primary[600] }}
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg font-medium text-white transition disabled:opacity-50"
              style={{ backgroundColor: COLORS.primary[800] }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div
            className="mt-8 p-4 rounded-lg border"
            style={{
              backgroundColor: COLORS.backgroundLight,
              borderColor: COLORS.border,
            }}
          >
            <p
              className="text-xs font-semibold mb-3 uppercase tracking-wide"
              style={{ color: COLORS.textSecondary }}
            >
              Demo Credentials
            </p>
            <div className="space-y-2 text-xs">
              {[
                { role: 'Admin', email: 'admin@example.com', password: 'Admin@123' },
                { role: 'HR', email: 'hr@example.com', password: 'HR@123' },
                { role: 'Accounts', email: 'accounts@example.com', password: 'Accounts@123' },
                { role: 'Employee', email: 'puspendu.developer@gmail.com', password: 'Test@123' },
              ].map((cred) => (
                <div key={cred.role} style={{ color: COLORS.textMuted }}>
                  <strong>{cred.role}:</strong> {cred.email} / {cred.password}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-sm" style={{ color: COLORS.textSecondary }}>
            By signing in, you agree to our{' '}
            <Link href="#" className="underline" style={{ color: COLORS.primary[600] }}>
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="#" className="underline" style={{ color: COLORS.primary[600] }}>
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
