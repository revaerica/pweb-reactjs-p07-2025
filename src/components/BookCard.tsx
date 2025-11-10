import { Link } from 'react-router-dom';
import { Book } from '../types';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <div className="book-card">
      <div className="book-image-container">
        {book.image ? (
          <img
            src={book.image}
            alt={book.title}
            className="book-image"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23E7DECD" width="200" height="200"/%3E%3Ctext fill="%230A122A" font-size="20" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
            }}
          />
        ) : (
          <div className="book-image-placeholder">
            <span className="placeholder-icon">📚</span>
            <span className="placeholder-text">No Image</span>
          </div>
        )}
      </div>
      <div className="book-content">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-writer">by {book.writer}</p>
        
        {book.genre && (
          <span className="book-genre">{book.genre.name}</span>
        )}
        
        <div className="book-details">
          <span className="book-price">Rp {book.price.toLocaleString()}</span>
          <span className={`book-stock_quantity ${book.stock_quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
            {book.stock_quantity > 0 ? `Stock: ${book.stock_quantity}` : 'Out of Stock'}
          </span>
        </div>

        <Link to={`/books/${book.id}`} className="btn btn-primary btn-small">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default BookCard;
