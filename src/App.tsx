import { Outlet } from 'react-router';
import './styles/App.css';
import NavBar from './components/NavBar';

export default function App() {
  return (
    <>
      <NavBar></NavBar>

      <main>
        <Outlet />
      </main>
    </>
  );
}
