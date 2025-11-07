import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { transactionsService } from '../services/transactions';
import { Transaction } from '../types';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';

const TransactionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTransaction();
  }, [id]);

  const fetchTransaction = async () => {
    if (!id) return;

    setIsLoading(true);
    setError('');

    try {
      const data = await transactionsService.getTransaction(Number(id));
      setTransaction(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch transaction details');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading message="Loading transaction details..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchTransaction} />;
  }

  if (!transaction) {
    return <ErrorState message="Transaction not found" />;
  }

  return (
    <div className="container">
      <div className="transaction-detail">
        <Link to="/transactions" className="back-link">
          ← Back to Transactions
        </Link>

        <div className="transaction-detail-header">
          <h1>Transaction #{transaction.id}</h1>
          <p className="transaction-detail-date">
            {new Date(transaction.created_at).toLocaleString()}
          </p>
        </div>

        <div className="transaction-detail-summary">
          <div className="summary-item">
            <span className="summary-label">Total Items:</span>
            <span className="summary-value">{transaction.total_amount}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Total Price:</span>
            <span className="summary-value price">
              Rp {transaction.total_price.toLocaleString()}
            </span>
          </div>
          {transaction.status && (
            <div className="summary-item">
              <span className="summary-label">Status:</span>
              <span className={`status-badge status-${transaction.status}`}>
                {transaction.status}
              </span>
            </div>
          )}
        </div>

        {transaction.items && transaction.items.length > 0 && (
          <div className="transaction-items">
            <h2>Items</h2>
            <div className="items-list">
              {transaction.items.map((item) => (
                <div key={item.id} className="transaction-item">
                  <div className="item-info">
                    <h3 className="item-title">
                      {item.book?.title || 'Unknown Book'}
                    </h3>
                    {item.book && (
                      <p className="item-writer">by {item.book.writer}</p>
                    )}
                  </div>
                  <div className="item-details">
                    <span className="item-quantity">Qty: {item.quantity}</span>
                    <span className="item-price">
                      Rp {item.price.toLocaleString()}
                    </span>
                    <span className="item-subtotal">
                      Subtotal: Rp {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionDetail;
