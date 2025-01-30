import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useUser } from './useUser';
// import { FaBars, FaEllipsis } from 'react-icons/fa6';

export function Header() {
  const { user, handleSignOut } = useUser();
  const navigate = useNavigate();

  return (
    <>
      <header>
        {!user && (
          <>
            <Link to="/sign-up">Sign Up</Link>
            <Link to="/sign-in">Sign In</Link>
          </>
        )}
        {user && (
          <>
            <Link to="/inventory">Inventory</Link>
            <Link to="/cost">Cost</Link>
            <button
              onClick={() => {
                handleSignOut();
                navigate('/');
              }}>
              Sign Out
            </button>
          </>
        )}
      </header>
      <main>
        <Outlet />
      </main>
      <footer></footer>
    </>
  );
}
