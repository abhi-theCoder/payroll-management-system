'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { Navigation } from '@/components/Navigation';
import { employeeService } from '@/services/api/employeeService';
import { Employee } from '@/types/models';
import { validateEmail } from '@/utils';

export default function EditEmployeePage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.id as string;

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState<Partial<Employee>>({});

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const data = await employeeService.getById(employeeId);
        setEmployee(data);
        setFormData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch employee');
      } finally {
        setIsLoading(false);
      }
    };

    if (employeeId) {
      fetchEmployee();
    }
  }, [employeeId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formData.email) errors.email = 'Email is required';
    else if (!validateEmail(formData.email)) errors.email = 'Invalid email format';

    if (!formData.phone) errors.phone = 'Phone is required';

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setIsSaving(true);
    try {
      await employeeService.update(employeeId, formData);
      router.push(`/dashboard/employees/${employeeId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update employee');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-gray-500">Loading employee details...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert type="error" message="Employee not found" onClose={() => router.back()} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Employee</h1>
          <p className="text-gray-600 mt-2">
            Update information for {employee.firstName} {employee.lastName}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6">
            <Alert type="error" message={error} onClose={() => setError(null)} />
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="First Name"
                  type="text"
                  name="firstName"
                  value={formData.firstName || ''}
                  onChange={handleInputChange}
                  disabled={isSaving}
                />
                <Input
                  label="Last Name"
                  type="text"
                  name="lastName"
                  value={formData.lastName || ''}
                  onChange={handleInputChange}
                  disabled={isSaving}
                />
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  error={validationErrors.email}
                  disabled={isSaving}
                />
                <Input
                  label="Phone"
                  type="tel"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  error={validationErrors.phone}
                  disabled={isSaving}
                />
              </div>
            </div>

            {/* Employment Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b">Employment Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Department"
                  type="text"
                  name="department"
                  value={formData.department || ''}
                  onChange={handleInputChange}
                  disabled={isSaving}
                />
                <Input
                  label="Designation"
                  type="text"
                  name="designation"
                  value={formData.designation || ''}
                  onChange={handleInputChange}
                  disabled={isSaving}
                />
              </div>
            </div>

            {/* Personal Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Date of Birth"
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ''}
                  onChange={handleInputChange}
                  disabled={isSaving}
                />
                <Input
                  label="Address"
                  type="text"
                  name="address"
                  value={formData.address || ''}
                  onChange={handleInputChange}
                  disabled={isSaving}
                />
                <Input
                  label="City"
                  type="text"
                  name="city"
                  value={formData.city || ''}
                  onChange={handleInputChange}
                  disabled={isSaving}
                />
                <Input
                  label="State"
                  type="text"
                  name="state"
                  value={formData.state || ''}
                  onChange={handleInputChange}
                  disabled={isSaving}
                />
              </div>
            </div>

            {/* Government IDs */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b">Government IDs & Tax</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="PAN Number"
                  type="text"
                  name="panNumber"
                  value={formData.panNumber || ''}
                  onChange={handleInputChange}
                  disabled={isSaving}
                />
                <Input
                  label="Aadhar Number"
                  type="text"
                  name="aadharNumber"
                  value={formData.aadharNumber || ''}
                  onChange={handleInputChange}
                  disabled={isSaving}
                />
              </div>
            </div>

            {/* Bank Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b">Bank Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Bank Account Number"
                  type="text"
                  name="bankAccountNumber"
                  value={formData.bankAccountNumber || ''}
                  onChange={handleInputChange}
                  disabled={isSaving}
                />
                <Input
                  label="IFSC Code"
                  type="text"
                  name="bankIFSCCode"
                  value={formData.bankIFSCCode || ''}
                  onChange={handleInputChange}
                  disabled={isSaving}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-8 border-t">
              <Button
                type="submit"
                variant="primary"
                isLoading={isSaving}
                disabled={isSaving}
                className="flex-1"
              >
                Save Changes
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
                disabled={isSaving}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
