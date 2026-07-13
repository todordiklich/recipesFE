import { useAuth } from '../context/useAuth';
import styles from './NavBar.module.css';

export default function NavBar() {
  const { isAuthenticated } = useAuth();
  return (
    <header className={styles.header}>
      {isAuthenticated ? (
        <a className={styles.link} href="/logout">
          Logout
        </a>
      ) : (
        <>
          <a className={styles.link} href="/login">
            Login
          </a>
          <a className={styles.link} href="/signup">
            Signup
          </a>
        </>
      )}
    </header>
  );
}
