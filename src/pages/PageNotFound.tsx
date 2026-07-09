import { Link } from 'react-router';
import styles from './PageNotFound.module.css';

export default function PageNotFound() {
  return (
    <div className={styles.container}>
      <h1 className={styles.code}>404</h1>
      <h2 className={styles.title}>Page Not Found</h2>
      <p className={styles.description}>
        The page you are looking for doesn't exist or may have been moved.
      </p>
      <Link to="/" className={styles.button}>
        Return Home
      </Link>
    </div>
  );
}
