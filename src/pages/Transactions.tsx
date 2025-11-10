import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { transactionsService } from '../services/transactions';
import { Order } from '../types';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';

const Transactions = () => {
  const [transactions, setTransactions] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTransactions = async () => {
    setIsLoading(true);
    setError('');

    try {
      // 🟢 Ambil data langsung dari backend (tanpa pagination/filter)
      const data = await transactionsService.getTransactions();
      setTransactions(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch transactions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (isLoading) {
    return <Loading message="Loading transactions..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchTransactions} />;
  }

  if (transactions.length === 0) {
    return <EmptyState message="No transactions found" icon="🛒" />;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>My Transactions</h1>
      </div>

      <div className="transactions-list">
        {transactions.map((transaction) => (
          <Link
            key={transaction.order_id}
            to={`/transactions/${transaction.order_id}`}
            className="transaction-card"
          >
            <div className="transaction-header">
              <span className="transaction-id">ID: #{transaction.order_id}</span>
              <span className="transaction-date">
                {transaction.created_at
                  ? new Date(transaction.created_at).toLocaleDateString()
                  : '—'}
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
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Transactions;
