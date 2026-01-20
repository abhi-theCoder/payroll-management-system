import { Employee, CreateEmployeeRequest, UpdateEmployeeRequest } from '@/types/models';
import apiClient from './client';

export const employeeService = {
  async getAll(page = 1, pageSize = 10): Promise<any> {
    const response = await apiClient.get('/employees', {
      params: { page, pageSize },
    });
    return response.data;
  },

  async getById(id: string): Promise<Employee> {
    const response = await apiClient.get<Employee>(`/employees/${id}`);
    return response.data!;
  },

  async create(data: CreateEmployeeRequest): Promise<Employee> {
    const response = await apiClient.post<Employee>('/employees', data);
    return response.data!;
  },

  async update(id: string, data: UpdateEmployeeRequest): Promise<Employee> {
    const response = await apiClient.put<Employee>(`/employees/${id}`, data);
    return response.data!;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/employees/${id}`);
  },

  async search(query: string): Promise<Employee[]> {
    const response = await apiClient.get<Employee[]>('/employees/search', {
      params: { q: query },
    });
    return response.data || [];
  },
};
