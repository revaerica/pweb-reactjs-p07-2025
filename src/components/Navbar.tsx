import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from './Button';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          📚 IT Literature Shop
        </Link>

        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              <Link to="/books" className="navbar-link">
                Books
              </Link>
              <Link to="/transactions" className="navbar-link">
                Transactions
              </Link>
              <div className="navbar-user">
                <span className="user-email">{user?.email}</span>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="navbar-link">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
