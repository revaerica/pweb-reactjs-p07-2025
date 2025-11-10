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
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Book {
  id: string;           
  title: string;
  writer: string;
  publisher?: string;
  price: number;
  stock_quantity: number;
  genre_id: string;     
  genre?: Genre;
  description?: string;
  publication_year?: number;
  image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Genre {
  id: string;          
  name: string;
}

export interface BookFormData {
  title: string;
  writer: string;
  publisher?: string;
  price: number;
  stock_quantity: number;
  genre_id: string;     
  description?: string;
  publication_year?: number;
}

export interface OrderItem {
  book_id: string;
  title: string;
  quantity: number;
  price_each: number;
  subtotal: number;
  book?: {
    id: string;
    title: string;
    price: number;
  };
}

export interface Order {
  order_id: string;          
  user_id: string;
  total_price: number;
  total_amount: number;
  created_at?: string;
  updated_at?: string;
  items: OrderItem[];
  user?: {
    id: string;
    email: string;
  };
}

export interface CreateOrderData {
  items: {
    book_id: string;
    quantity: number;
  }[];
}

export interface TransactionFilters {
  search?: string;
  orderBy?: 'id' | 'total_amount' | 'total_price';
  order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
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
  orderBy?: 'title' | 'publication_year';
  order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

export interface TransactionFilters {
  search?: string;
  orderBy?: 'id' | 'total_amount' | 'total_price';
  order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}
