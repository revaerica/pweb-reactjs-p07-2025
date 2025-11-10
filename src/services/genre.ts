import api from './api';
import { Genre } from '../types';

export const genreService = {
  // ✅ GET all genres (pakai pagination & search dari backend)
  async getGenres(search?: string, page: number = 1, limit: number = 10): Promise<Genre[]> {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams();

    if (search) params.append('search', search);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await api.get(`/genre?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'If-None-Match': '',
      },
    });

    // backend kirim: data.data.data
    return response.data.data.data;
  },

  // ✅ GET genre by ID
  async getGenreById(id: string): Promise<Genre> {
    const token = localStorage.getItem('token');
    const response = await api.get(`/genre/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // backend kirim: data.data
    return response.data.data;
  },

  // ✅ CREATE
  async createGenre(name: string): Promise<Genre> {
    const token = localStorage.getItem('token');
    const response = await api.post(
      '/genre',
      { name },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data.data;
  },

  // ✅ UPDATE
  async updateGenre(id: string, name: string): Promise<Genre> {
    const token = localStorage.getItem('token');
    const response = await api.patch(
      `/genre/${id}`,
      { name },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data.data;
  },

  // ✅ DELETE (soft delete)
  async deleteGenre(id: string): Promise<void> {
    const token = localStorage.getItem('token');
    await api.delete(`/genre/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
