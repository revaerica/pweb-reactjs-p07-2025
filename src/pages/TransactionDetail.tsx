import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { transactionsService } from '../services/transactions';
import { Order } from '../types';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';

const TransactionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [transaction, setTransaction] = useState<Order | null>(null);
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
      // 🟢 backend kamu pakai UUID string, jadi cukup kirim `id` langsung
      const data = await transactionsService.getTransaction(id);
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
          <h1>Transaction #{transaction.order_id}</h1>
          <p className="transaction-detail-date"> 
            {new Date(transaction.created_at as string).toLocaleString()}
            </p>
        </div>

        <div className="transaction-detail-summary">
          {/* 🟢 total_amount & total_price dari backend */}
          {transaction.total_amount && (
            <div className="summary-item">
              <span className="summary-label">Total Items:</span>
              <span className="summary-value">{transaction.total_amount}</span>
            </div>
          )}
          <div className="summary-item">
            <span className="summary-label">Total Price:</span>
            <span className="summary-value price">
              Rp {transaction.total_price.toLocaleString()}
            </span>
          </div>
        </div>

        {transaction.items && transaction.items.length > 0 && (
          <div className="transaction-items">
            <h2>Items</h2>
            <div className="items-list">
              {transaction.items.map((item) => (
                <div key={item.book_id} className="transaction-item">
                  <div className="item-info">
                    <h3 className="item-title">
                      {item.book?.title || 'Unknown Book'}
                    </h3>
                  </div>
                  <div className="item-details">
                    <span className="item-quantity">Qty: {item.quantity}</span>
                    {/* 🟢 kalau backend pakai price_each */}
                    <span className="item-price">
                      Rp {item.price_each?.toLocaleString()}
                    </span>
                    <span className="item-subtotal">
                      Subtotal: Rp {(item.price_each * item.quantity).toLocaleString()}
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
