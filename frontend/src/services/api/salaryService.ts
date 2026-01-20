import { SalaryStructure, CreateSalaryStructureRequest, UpdateSalaryStructureRequest } from '@/types/models';
import apiClient from './client';

export const salaryService = {
  async getAll(page = 1, pageSize = 10): Promise<any> {
    const response = await apiClient.get('/salary-structures', {
      params: { page, pageSize },
    });
    return response.data;
  },

  async getById(id: string): Promise<SalaryStructure> {
    const response = await apiClient.get<SalaryStructure>(`/salary-structures/${id}`);
    return response.data!;
  },

  async getByEmployeeId(employeeId: string): Promise<SalaryStructure> {
    const response = await apiClient.get<SalaryStructure>(`/salary-structures/employee/${employeeId}`);
    return response.data!;
  },

  async create(data: CreateSalaryStructureRequest): Promise<SalaryStructure> {
    const response = await apiClient.post<SalaryStructure>('/salary-structures', data);
    return response.data!;
  },

  async update(id: string, data: UpdateSalaryStructureRequest): Promise<SalaryStructure> {
    const response = await apiClient.put<SalaryStructure>(`/salary-structures/${id}`, data);
    return response.data!;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/salary-structures/${id}`);
  },
};
