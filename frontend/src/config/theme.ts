/**
 * Enterprise Blue & White Theme Configuration
 * Strict professional color palette for Payroll Management System
 */

export const COLORS = {
  // Primary Blue
  primary: {
    900: '#0F172A', // Almost black
    800: '#1E3A8A', // Corporate Trust Blue (PRIMARY)
    700: '#1E40AF',
    600: '#2563EB', // Accent Blue
    500: '#3B82F6',
    400: '#60A5FA',
    300: '#93C5FD',
    200: '#BFDBFE',
    100: '#DBEAFE',
    50: '#EFF6FF',
  },

  // Grayscale
  gray: {
    900: '#111827',
    800: '#1F2937',
    700: '#374151',
    600: '#4B5563',
    500: '#6B7280',
    400: '#9CA3AF',
    300: '#D1D5DB',
    200: '#E5E7EB', // Border / Divider
    100: '#F3F4F6',
    50: '#F9FAFB',
  },

  // Semantic Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#2563EB',

  // Background
  background: '#FFFFFF',
  backgroundLight: '#F5F8FF',
  border: '#E5E7EB',

  // Text
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
};

export const SHADOWS = {
  xs: '0 1px 2px 0 rgba(30, 58, 138, 0.05)',
  sm: '0 1px 3px 0 rgba(30, 58, 138, 0.1), 0 1px 2px 0 rgba(30, 58, 138, 0.06)',
  md: '0 4px 6px -1px rgba(30, 58, 138, 0.1), 0 2px 4px -1px rgba(30, 58, 138, 0.06)',
  lg: '0 10px 15px -3px rgba(30, 58, 138, 0.1), 0 4px 6px -2px rgba(30, 58, 138, 0.05)',
};

export const BORDER_RADIUS = {
  none: '0px',
  xs: '0.25rem',
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
};

export const SPACING = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
};
