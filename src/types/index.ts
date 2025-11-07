export interface User {
  id: string;            // ⚡ ubah jadi string karena bisa UUID
  email: string;
  name?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Book {
  id: string;            // ⚡ ubah jadi string
  title: string;
  writer: string;
  publisher?: string;
  price: number;
  stock: number;
  genre_id: string;      // ⚡ UUID string
  genre?: Genre;
  isbn?: string;
  description?: string;
  publication_year?: number;
  condition?: 'new' | 'used' | 'refurbished';
  book_image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Genre {
  id: string;            // ⚡ UUID string
  name: string;
}

export interface BookFormData {
  title: string;
  writer: string;
  publisher?: string;
  price: number;
  stock: number;
  genre_id: string;      // ⚡ string sesuai dropdown UUID
  isbn?: string;
  description?: string;
  publication_year?: number;
  condition?: 'new' | 'used' | 'refurbished';
}

export interface Transaction {
  id: string;            // ⚡ string karena bisa UUID
  user_id: string;       // ⚡ string
  total_amount: number;
  total_price: number;
  status?: string;
  created_at: string;
  items?: TransactionItem[];
}

export interface TransactionItem {
  id: string;            // ⚡ string
  transaction_id: string; // ⚡ string
  book_id: string;       // ⚡ string
  book?: Book;
  quantity: number;
  price: number;
}

export interface CreateTransactionData {
  items: {
    book_id: string;     // ⚡ string
    quantity: number;
  }[];
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
  message?: string;
}

export interface BookFilters {
  search?: string;
  condition?: string;
  sort_by?: 'title' | 'publication_year';
  order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

export interface TransactionFilters {
  search?: string;
  sort_by?: 'id' | 'total_amount' | 'total_price';
  order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}
