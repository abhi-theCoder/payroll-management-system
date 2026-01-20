'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-900">
      <header className="bg-white bg-opacity-10 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">ERP Payroll System</h1>
          <div className="space-x-4">
            {isAuthenticated ? (
              <Button variant="secondary" onClick={() => router.push('/dashboard')}>
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button variant="secondary" onClick={() => router.push('/auth/login')}>
                  Login
                </Button>
                <Button variant="ghost" onClick={() => router.push('/auth/register')}>
                  Register
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-white mb-4">Comprehensive Payroll Management</h2>
          <p className="text-xl text-white text-opacity-90 mb-8">
            Streamline your HR and payroll operations with our enterprise-grade ERP system
          </p>

          {!isAuthenticated && (
            <div className="space-x-4">
              <Button variant="primary" size="lg" onClick={() => router.push('/login')}>
                Get Started
              </Button>
              <Button variant="secondary" size="lg" onClick={() => router.push('/register')}>
                Create Account
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          {[
            { title: 'Employee Management', description: 'Manage employee records, documents, and information centrally' },
            { title: 'Payroll Processing', description: 'Automate payroll calculations and generate payslips' },
            { title: 'Tax Compliance', description: 'Stay compliant with tax regulations and generate reports' },
            { title: 'Attendance Tracking', description: 'Track employee attendance and manage leave requests' },
            { title: 'Compliance Reports', description: 'Generate ESI, PF, PT and other compliance reports' },
            { title: 'Analytics', description: 'Gain insights with comprehensive reports and analytics' },
          ].map((feature, index) => (
            <div key={index} className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-white text-opacity-80">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
