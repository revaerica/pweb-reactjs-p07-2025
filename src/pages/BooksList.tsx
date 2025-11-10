import { useState, useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { booksService } from '../services/books';
import { Book, BookFilters, ApiResponse } from '../types';
import BookCard from '../components/BookCard';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import Button from '../components/Button';

const BooksList = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState<BookFilters>({
    search: '',
    orderBy: 'title',
    order: 'asc',
    page: 1,
    per_page: 12,
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });

  const fetchBooks = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response: ApiResponse<any> = await booksService.getBooks(filters);

      // ✅ FIX STRUKTUR DATA BACKEND
      const bookData = response.data?.data ?? [];
      const meta = response.data?.meta;

      setBooks(Array.isArray(bookData) ? bookData : []);

      if (meta) {
        setPagination({
          currentPage: meta.page,
          totalPages: meta.totalPages,
          total: meta.total,
        });
      } else {
        setPagination({
          currentPage: 1,
          totalPages: 1,
          total: bookData.length,
        });
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to fetch books');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [filters]);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
  };

  const handleFilterChange = (key: keyof BookFilters, value: string) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading && books.length === 0) {
    return <Loading message="Loading books..." />;
  }

  if (error && books.length === 0) {
    return <ErrorState message={error} onRetry={fetchBooks} />;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Books Catalog</h1>
        <Link to="/books/add">
          <Button>Add New Book</Button>
        </Link>
      </div>

      <div className="filters-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search by title or writer..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="search-input"
          />
          <Button type="submit">Search</Button>
        </form>

        <div className="filters-row">

          <select
            value={filters.orderBy}
            onChange={(e) => handleFilterChange('orderBy', e.target.value)}
            className="filter-select"
          >
            <option value="title">Sort by Title</option>
            <option value="publication_year">Sort by Publication Year</option>
          </select>

          <select
            value={filters.order}
            onChange={(e) => handleFilterChange('order', e.target.value)}
            className="filter-select"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      <div className="results-info">
        <p>Showing {books.length} of {pagination.total} books</p>
      </div>

      {books.length === 0 ? (
        <EmptyState message="No books found" icon="📚" />
      ) : (
        <>
          <div className="books-grid">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default BooksList;
