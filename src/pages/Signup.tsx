import styles from './Signup.module.css';
import { useState, type SubmitEvent } from 'react';
import Button from '../components/Button';
import { useMutation } from '@tanstack/react-query';
import { createUser } from '../api/auth.api';
import type { ApiErrorResponse } from '../types/auth.types';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setrepeatPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      setSuccess(true);
    },
    onError: (error: ApiErrorResponse) => {
      const errors: Record<string, string> = {};

      error.details?.forEach((detail) => {
        errors[detail.field] = detail.message;
      });

      setFieldErrors(errors);
    },
  });

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    setFieldErrors({});

    if (password !== repeatPassword) {
      setFieldErrors({ password: 'Passwords do not match.' });
      return;
    }

    mutation.mutate({ name, email, password });
  }

  return (
    <div className={styles.container}>
      {success ? (
        <p>
          You have succesfilly created your profile. Please go to the{' '}
          <a href="/login">Login</a> page.
        </p>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <h1 className={styles.title}>Sign up</h1>

          {fieldErrors &&
            Object.values(fieldErrors).map((detail) => (
              <p key={detail} className={styles.error}>
                {detail}
              </p>
            ))}

          <label>
            Name
            <input
              type="text"
              min={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </label>

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

          <label>
            Repeat Password
            <input
              type="password"
              value={repeatPassword}
              onChange={(e) => setrepeatPassword(e.target.value)}
              placeholder="Repeat Password"
              required
            />
          </label>

          <Button
            type="submit"
            loading={mutation.isPending}
            variant="primary"
            size="large"
          >
            Signup
          </Button>
        </form>
      )}
    </div>
  );
}
