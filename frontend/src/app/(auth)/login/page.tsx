'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { validateEmail } from '@/utils';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState<{ [key: string]: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError({});

    // Validation
    if (!email) {
      setValidationError({ email: 'Email is required' });
      return;
    }
    if (!validateEmail(email)) {
      setValidationError({ email: 'Invalid email address' });
      return;
    }
    if (!password) {
      setValidationError({ password: 'Password is required' });
      return;
    }

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      // Error is handled by the store
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">ERP Payroll</h1>
            <p className="text-gray-600 mt-2">Welcome back</p>
          </div>

          {error && (
            <div className="mb-6">
              <Alert type="error" message={error} onClose={clearError} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={validationError.email}
              placeholder="you@example.com"
              disabled={isLoading}
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={validationError.password}
              placeholder="Enter your password"
              disabled={isLoading}
            />

            <Button type="submit" variant="primary" isLoading={isLoading} className="w-full">
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/auth/register" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign up
              </a>
            </p>
          </div>
        </div>

        <p className="text-center text-white mt-8 text-sm">
          © 2024 ERP Payroll System. All rights reserved.
        </p>
      </div>
    </div>
  );
}
