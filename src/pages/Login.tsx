import { useState, useEffect, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/auth';
import Input from '../components/Input';
import Button from '../components/Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/books');
    }
  }, [isAuthenticated, navigate]);

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';

    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await authService.login({ email, password });

      // 🔹 Simpan user + token ke context
      login(response.user, response.token);

      // 🔹 Langsung arahkan ke halaman utama
      navigate('/books');
    } catch (error: any) {
      setApiError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Login</h1>
        <p className="auth-subtitle">Welcome back to IT Literature Shop</p>

        {apiError && <div className="alert alert-error">{apiError}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            placeholder="your.email@example.com"
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            placeholder="Enter your password"
          />

          <Button type="submit" isLoading={isLoading} className="auth-submit">
            Login
          </Button>
        </form>

        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
