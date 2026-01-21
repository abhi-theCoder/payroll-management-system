'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { DashboardLayout } from '@/components/DashboardLayout';
import { RouteGuard } from '@/components/RouteGuard';
import { Permission } from '@/config/rbac';
import { employeeService } from '@/services/api/employeeService';
import { validateEmail } from '@/utils';

export default function NewEmployeePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  // Form state
  const [formData, setFormData] = useState({
    employeeCode: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    joiningDate: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    panNumber: '',
    aadharNumber: '',
    bankAccountNumber: '',
    bankIFSCCode: '',
    uanNumber: '',
    workingDaysPerWeek: '5',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    // Required fields
    if (!formData.employeeCode.trim()) errors.employeeCode = 'Employee code is required';
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email) errors.email = 'Email is required';
    else if (!validateEmail(formData.email)) errors.email = 'Invalid email format';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.department.trim()) errors.department = 'Department is required';
    if (!formData.designation.trim()) errors.designation = 'Designation is required';
    if (!formData.joiningDate) errors.joiningDate = 'Joining date is required';

    // Optional fields validation (if provided)
    if (formData.dateOfBirth && new Date(formData.dateOfBirth) > new Date()) {
      errors.dateOfBirth = 'Date of birth cannot be in the future';
    }
    if (formData.joiningDate && new Date(formData.joiningDate) > new Date()) {
      errors.joiningDate = 'Joining date cannot be in the future';
    }
    if (formData.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) {
      errors.panNumber = 'Invalid PAN format';
    }
    if (formData.aadharNumber && !/^\d{12}$/.test(formData.aadharNumber)) {
      errors.aadharNumber = 'Aadhar number must be 12 digits';
    }
    if (formData.bankAccountNumber && formData.bankAccountNumber.trim() && formData.bankAccountNumber.length < 9) {
      errors.bankAccountNumber = 'Bank account number must be at least 9 digits';
    }
    if (formData.bankIFSCCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.bankIFSCCode)) {
      errors.bankIFSCCode = 'Invalid IFSC code format';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const employeeData = {
        employeeCode: formData.employeeCode,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        designation: formData.designation,
        joiningDate: new Date(formData.joiningDate),
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined,
        gender: formData.gender || undefined,
        address: formData.address || undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        pincode: formData.pincode || undefined,
        panNumber: formData.panNumber || undefined,
        aadharNumber: formData.aadharNumber || undefined,
        bankAccountNumber: formData.bankAccountNumber || undefined,
        bankIFSCCode: formData.bankIFSCCode || undefined,
        uanNumber: formData.uanNumber || undefined,
        workingDaysPerWeek: parseInt(formData.workingDaysPerWeek) || 5,
      };

      await employeeService.create(employeeData);
      router.push('/dashboard/employees');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create employee');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RouteGuard requiredPermission={Permission.CREATE_EMPLOYEE}>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Employee</h1>
          <p className="text-gray-600 mt-2">Fill in the employee details below</p>
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
            {/* Basic Information Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Employee Code"
                  type="text"
                  name="employeeCode"
                  value={formData.employeeCode}
                  onChange={handleInputChange}
                  error={validationErrors.employeeCode}
                  placeholder="e.g., EMP001"
                  disabled={isLoading}
                />
                <Input
                  label="First Name"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  error={validationErrors.firstName}
                  placeholder="John"
                  disabled={isLoading}
                />
                <Input
                  label="Last Name"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  error={validationErrors.lastName}
                  placeholder="Doe"
                  disabled={isLoading}
                />
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={validationErrors.email}
                  placeholder="john.doe@company.com"
                  disabled={isLoading}
                />
                <Input
                  label="Phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  error={validationErrors.phone}
                  placeholder="+91 98765 43210"
                  disabled={isLoading}
                />
                <div>
                  <label className="form-label">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="form-input"
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Personal Information Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Date of Birth"
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  error={validationErrors.dateOfBirth}
                  disabled={isLoading}
                />
                <Input
                  label="Address"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Street address"
                  disabled={isLoading}
                />
                <Input
                  label="City"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  disabled={isLoading}
                />
                <Input
                  label="State"
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="State"
                  disabled={isLoading}
                />
                <Input
                  label="Pincode"
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="Postal code"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Employment Information Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b">Employment Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Department"
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  error={validationErrors.department}
                  placeholder="e.g., Human Resources"
                  disabled={isLoading}
                />
                <Input
                  label="Designation"
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  error={validationErrors.designation}
                  placeholder="e.g., Senior Manager"
                  disabled={isLoading}
                />
                <Input
                  label="Date of Joining"
                  type="date"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleInputChange}
                  error={validationErrors.joiningDate}
                  disabled={isLoading}
                />
                <div>
                  <label className="form-label">Working Days Per Week</label>
                  <select
                    name="workingDaysPerWeek"
                    value={formData.workingDaysPerWeek}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="form-input"
                  >
                    <option value="5">5 Days</option>
                    <option value="6">6 Days</option>
                    <option value="7">7 Days</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Government IDs Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b">Government IDs & Tax</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="PAN Number"
                  type="text"
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleInputChange}
                  error={validationErrors.panNumber}
                  placeholder="AAAAA0000A"
                  disabled={isLoading}
                />
                <Input
                  label="Aadhar Number"
                  type="text"
                  name="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={handleInputChange}
                  error={validationErrors.aadharNumber}
                  placeholder="12 digit number"
                  disabled={isLoading}
                />
                <Input
                  label="UAN Number"
                  type="text"
                  name="uanNumber"
                  value={formData.uanNumber}
                  onChange={handleInputChange}
                  placeholder="Unique Account Number"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Bank Information Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b">Bank Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Bank Account Number"
                  type="text"
                  name="bankAccountNumber"
                  value={formData.bankAccountNumber}
                  onChange={handleInputChange}
                  error={validationErrors.bankAccountNumber}
                  placeholder="Account number"
                  disabled={isLoading}
                />
                <Input
                  label="IFSC Code"
                  type="text"
                  name="bankIFSCCode"
                  value={formData.bankIFSCCode}
                  onChange={handleInputChange}
                  error={validationErrors.bankIFSCCode}
                  placeholder="SBIN0000001"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-8 border-t">
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                disabled={isLoading}
                className="flex-1"
              >
                Create Employee
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
    </RouteGuard>
  )}
