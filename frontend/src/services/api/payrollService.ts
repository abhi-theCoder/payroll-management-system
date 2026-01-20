import { PayrollRun, PaySlip } from '@/types/models';
import apiClient from './client';

export const payrollService = {
  async getPayrollRuns(page = 1, pageSize = 10): Promise<any> {
    const response = await apiClient.get('/payroll', {
      params: { page, pageSize },
    });
    return response.data;
  },

  async getPayrollRunById(id: string): Promise<PayrollRun> {
    const response = await apiClient.get<PayrollRun>(`/payroll/${id}`);
    return response.data!;
  },

  async createPayrollRun(data: { month: number; year: number }): Promise<PayrollRun> {
    const response = await apiClient.post<PayrollRun>('/payroll', data);
    return response.data!;
  },

  async processPayroll(id: string): Promise<PayrollRun> {
    const response = await apiClient.post<PayrollRun>(`/payroll/${id}/process`, {});
    return response.data!;
  },

  async getPayslips(payrollRunId: string, page = 1, pageSize = 10): Promise<any> {
    const response = await apiClient.get('/payslips', {
      params: { payrollRunId, page, pageSize },
    });
    return response.data;
  },

  async getPayslipById(id: string): Promise<PaySlip> {
    const response = await apiClient.get<PaySlip>(`/payslips/${id}`);
    return response.data!;
  },

  async generatePayslips(payrollRunId: string): Promise<PaySlip[]> {
    const response = await apiClient.post<PaySlip[]>(`/payroll/${payrollRunId}/generate-payslips`, {});
    return response.data || [];
  },

  async downloadPayslip(id: string): Promise<Blob> {
    const response = await apiClient.get(`/payslips/${id}/download`, {
      responseType: 'blob',
    });
    return response as any;
  },
};
