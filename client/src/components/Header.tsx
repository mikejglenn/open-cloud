import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useUser } from './useUser';

export function Header() {
  const { user, handleSignOut } = useUser();
  const navigate = useNavigate();

  return (
    <>
      <h1>Open Cloud</h1>
      <nav>
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
      </nav>
      <Outlet />
    </>
  );
}
