import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { booksService } from '../services/books';
import { Book } from '../types';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import Button from '../components/Button';

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    if (!id) return;

    setIsLoading(true);
    setError('');

    try {
      const data = await booksService.getBook(id); // ⚡ gunakan string id
      setBook(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch book details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!book || !window.confirm('Are you sure you want to delete this book?')) return;

    setIsDeleting(true);

    try {
      await booksService.deleteBook(book.id);
      alert('Book deleted successfully!');
      navigate('/books');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete book');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) return <Loading message="Loading book details..." />;
  if (error) return <ErrorState message={error} onRetry={fetchBook} />;
  if (!book) return <ErrorState message="Book not found" />;

  return (
    <div className="container">
      <div className="book-detail">
        <div className="book-detail-header">
          <Link to="/books" className="back-link">← Back to Books</Link>
          <div className="book-detail-actions">
            <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>
              Delete Book
            </Button>
          </div>
        </div>

        <div className="book-detail-content">
          <div className="book-detail-image">
            {book.book_image ? (
              <img
                src={book.book_image}
                alt={book.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : (
              <div className="book-image-placeholder-large">
                <span className="placeholder-icon">📚</span>
                <span className="placeholder-text">No Image Available</span>
              </div>
            )}
          </div>

          <div className="book-detail-info">
            <h1 className="book-detail-title">{book.title}</h1>
            <p className="book-detail-writer">by {book.writer}</p>

            {book.genre && <span className="book-genre-badge">{book.genre.name}</span>}

            <div className="book-detail-meta">
              <div className="meta-item">
                <span className="meta-label">Price:</span>
                <span className="meta-value">Rp {book.price.toLocaleString()}</span>
              </div>

              <div className="meta-item">
                <span className="meta-label">Stock:</span>
                <span className={`meta-value ${book.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                  {book.stock > 0 ? book.stock : 'Out of Stock'}
                </span>
              </div>

              {book.publisher && (
                <div className="meta-item">
                  <span className="meta-label">Publisher:</span>
                  <span className="meta-value">{book.publisher}</span>
                </div>
              )}

              {book.isbn && (
                <div className="meta-item">
                  <span className="meta-label">ISBN:</span>
                  <span className="meta-value">{book.isbn}</span>
                </div>
              )}

              {book.publication_year && (
                <div className="meta-item">
                  <span className="meta-label">Publication Year:</span>
                  <span className="meta-value">{book.publication_year}</span>
                </div>
              )}

              {book.condition && (
                <div className="meta-item">
                  <span className="meta-label">Condition:</span>
                  <span className={`condition-badge condition-${book.condition}`}>
                    {book.condition}
                  </span>
                </div>
              )}
            </div>

            {book.description && (
              <div className="book-description">
                <h3>Description</h3>
                <p>{book.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
