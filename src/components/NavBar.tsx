import { Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import styles from './NavBar.module.css';

export default function NavBar() {
  const { isAuthenticated } = useAuth();
  return (
    <header className={styles.header}>
      {isAuthenticated ? (
        <>
          <Link className={styles.link} to="/">
            Recipes
          </Link>
          <Link className={styles.link} to="/mealPlans">
            My Meal Plans
          </Link>
          <Link className={styles.link} to="/logout">
            Logout
          </Link>
        </>
      ) : (
        <>
          <Link className={styles.link} to="/login">
            Login
          </Link>
          <Link className={styles.link} to="/signup">
            Signup
          </Link>
        </>
      )}
    </header>
  );
}
