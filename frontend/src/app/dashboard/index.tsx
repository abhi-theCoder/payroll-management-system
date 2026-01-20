'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { ProfessionalDashboard } from '@/components/ProfessionalDashboard';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <ProfessionalDashboard />
    </DashboardLayout>
  );
}
