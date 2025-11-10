import api from './api';
import { ApiResponse, Order, CreateOrderData } from '../types';

export const transactionsService = {
  async getTransactions() {
    const res = await api.get<ApiResponse<Order[]>>('/transactions');
    return res.data.data;
  },

  async getTransaction(id: string) {
    const res = await api.get<ApiResponse<Order>>(`/transactions/${id}`);
    return res.data.data;
  },

  async createTransaction(payload: CreateOrderData) {
    const res = await api.post<ApiResponse<Order>>('/transactions', payload);
    return res.data.data;
  },

  async getStatistics() {
    const res = await api.get<ApiResponse<any>>('/transactions/statistics');
    return res.data.data;
  },
};
