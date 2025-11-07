import api from './api';
import { Transaction, CreateTransactionData, ApiResponse, TransactionFilters } from '../types';

export const transactionsService = {
  async getTransactions(filters?: TransactionFilters): Promise<ApiResponse<Transaction[]>> {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.sort_by) params.append('sort_by', filters.sort_by);
    if (filters?.order) params.append('order', filters.order);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.per_page) params.append('per_page', filters.per_page.toString());

    const response = await api.get<ApiResponse<Transaction[]>>(`/transactions?${params.toString()}`);
    return response.data;
  },

  async getTransaction(id: number): Promise<Transaction> {
    const response = await api.get<{ data: Transaction }>(`/transactions/${id}`);
    return response.data.data;
  },

  async createTransaction(data: CreateTransactionData): Promise<Transaction> {
    const response = await api.post<{ data: Transaction }>('/transactions', data);
    return response.data.data;
  },
};
