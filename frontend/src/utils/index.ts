export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(value);
};

export const formatDate = (date: Date | string): string => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

export const formatDateTime = (date: Date | string): string => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

export const calculateNetSalary = (earnings: number, deductions: number): number => {
  return earnings - deductions;
};

export const calculateTaxableIncome = (baseSalary: number, deductions: number): number => {
  return Math.max(0, baseSalary - deductions);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

export const validatePAN = (pan: string): boolean => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan.toUpperCase());
};

export const validateAadhar = (aadhar: string): boolean => {
  const aadharRegex = /^[0-9]{12}$/;
  return aadharRegex.test(aadhar.replace(/\D/g, ''));
};

export const generateEmployeeCode = (firstName: string, lastName: string, id: string): string => {
  const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  const randomNum = Math.floor(Math.random() * 10000);
  return `EMP${initials}${randomNum.toString().padStart(4, '0')}`;
};

export const getFullName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`.trim();
};

export const truncateText = (text: string, length: number): string => {
  return text.length > length ? `${text.substring(0, length)}...` : text;
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
