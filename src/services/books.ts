import api from './api';
import { Book, BookFormData, Genre, ApiResponse, BookFilters } from '../types';

export const booksService = {
  // GET all books dengan filter
  async getBooks(filters?: BookFilters): Promise<ApiResponse<Book[]>> {
    const params = new URLSearchParams();

    if (filters?.search) params.append('search', filters.search);
    if (filters?.condition) params.append('condition', filters.condition);
    if (filters?.sort_by) params.append('sort_by', filters.sort_by);
    if (filters?.order) params.append('order', filters.order);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.per_page) params.append('per_page', filters.per_page.toString());

    const response = await api.get<ApiResponse<Book[]>>(`/books?${params.toString()}`);
    return response.data;
  },

  // GET book by ID
  async getBook(id: string): Promise<Book> {
    const response = await api.get<{ data: Book }>(`/books/${id}`);
    return response.data.data;
  },

  // CREATE book (tanpa image)
  async createBook(data: BookFormData): Promise<Book> {
    const response = await api.post<{ data: Book }>('/books', data);
    return response.data.data;
  },

  // CREATE book dengan image
  async createBookWithImage(formData: FormData): Promise<Book> {
    const response = await api.post<{ data: Book }>('/books', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  // UPDATE book
  async updateBook(id: string, data: Partial<BookFormData>): Promise<Book> {
    const response = await api.put<{ data: Book }>(`/books/${id}`, data);
    return response.data.data;
  },

  // DELETE book
  async deleteBook(id: string): Promise<void> {
    await api.delete(`/books/${id}`);
  },

  // GET all genres
  async getGenres(): Promise<Genre[]> {
    const response = await api.get<{ data: Genre[] }>('/genres');
    return response.data.data;
  },
};
