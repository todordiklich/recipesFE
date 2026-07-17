import { useEffect, useState } from 'react';
import { type SubmitEvent } from 'react';
import { useLocation, useNavigate } from 'react-router';
import styles from './Login.module.css';
import Button from '../components/Button';
import { useAuth } from '../context/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, isAuthenticated } = useAuth();

  const from = (
    location.state as { from?: { pathname?: string; search?: string } } | null
  )?.from;
  const redirectTo = from ? `${from.pathname ?? '/'}${from.search ?? ''}` : '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    setError('');

    try {
      await login({ email, password });

      navigate(redirectTo, { replace: true });
    } catch {
      setError('Invalid email or password');
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Login</h1>

        {error && <p className={styles.error}>{error}</p>}

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </label>

        <Button type="submit" loading={loading} variant="primary" size="large">
          Login
        </Button>
      </form>
    </div>
  );
}
