import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { transactionsService } from '../services/transactions';
import { Transaction, TransactionFilters } from '../types';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState<TransactionFilters>({
    search: '',
    sort_by: 'id',
    order: 'desc',
    page: 1,
    per_page: 10,
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });

  const fetchTransactions = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await transactionsService.getTransactions(filters);
      setTransactions(response.data);

      if (response.meta) {
        setPagination({
          currentPage: response.meta.current_page,
          totalPages: response.meta.last_page,
          total: response.meta.total,
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch transactions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
  };

  const handleFilterChange = (key: keyof TransactionFilters, value: string) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading && transactions.length === 0) {
    return <Loading message="Loading transactions..." />;
  }

  if (error && transactions.length === 0) {
    return <ErrorState message={error} onRetry={fetchTransactions} />;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>My Transactions</h1>
      </div>

      <div className="filters-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search by transaction ID..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="search-input"
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>

        <div className="filters-row">
          <select
            value={filters.sort_by}
            onChange={(e) => handleFilterChange('sort_by', e.target.value)}
            className="filter-select"
          >
            <option value="id">Sort by ID</option>
            <option value="total_amount">Sort by Amount</option>
            <option value="total_price">Sort by Price</option>
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
        <p>Showing {transactions.length} of {pagination.total} transactions</p>
      </div>

      {transactions.length === 0 ? (
        <EmptyState message="No transactions found" icon="🛒" />
      ) : (
        <>
          <div className="transactions-list">
            {transactions.map((transaction) => (
              <Link
                key={transaction.id}
                to={`/transactions/${transaction.id}`}
                className="transaction-card"
              >
                <div className="transaction-header">
                  <span className="transaction-id">ID: #{transaction.id}</span>
                  <span className="transaction-date">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="transaction-details">
                  <div className="transaction-info">
                    <span className="info-label">Total Items:</span>
                    <span className="info-value">{transaction.total_amount}</span>
                  </div>
                  <div className="transaction-info">
                    <span className="info-label">Total Price:</span>
                    <span className="info-value price">
                      Rp {transaction.total_price.toLocaleString()}
                    </span>
                  </div>
                </div>
                {transaction.status && (
                  <span className={`transaction-status status-${transaction.status}`}>
                    {transaction.status}
                  </span>
                )}
              </Link>
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

export default Transactions;
