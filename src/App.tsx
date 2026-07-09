import { Outlet } from 'react-router';
import './styles/App.css';

export default function App() {
  return (
    <>
      <header>Navbar</header>

      <main>
        <Outlet />
      </main>
    </>
  );
}
