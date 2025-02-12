import { Link, useNavigate } from 'react-router-dom';
import { User, useUser } from '../components/useUser';
import { AccountList } from './AccountList';
import { useState } from 'react';

type AuthData = {
  user: User;
  token: string;
};

export function Home() {
  const { handleSignIn, user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleGuestClick() {
    try {
      setIsLoading(true);
      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'demo', password: 'password1' }),
      };
      const res = await fetch('/api/auth/sign-in', req);
      if (!res.ok) {
        throw new Error(`fetch Error ${res.status}`);
      }
      const { user, token } = (await res.json()) as AuthData;
      handleSignIn(user, token);
      navigate('/');
    } catch (err) {
      alert(`Error signing in: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center">
      {!user && (
        <>
          <Link
            to="sign-up"
            className="card bg-neutral text-neutral-content w-96 mb-2">
            <div className="card-body items-center text-center">
              <h2 className="card-title">Sign Up</h2>
            </div>
          </Link>
          <Link
            to="sign-in"
            className="card bg-neutral text-neutral-content w-96 mb-2">
            <div className="card-body items-center text-center">
              <h2 className="card-title">Sign In</h2>
            </div>
          </Link>
          <div
            hidden={isLoading}
            onClick={handleGuestClick}
            className="card bg-neutral text-neutral-content w-96 mb-2">
            <div className="card-body items-center text-center">
              <h2 className="card-title">Continue As Guest</h2>
            </div>
          </div>
        </>
      )}
      {user && (
        <>
          <p>Hello {user.username}</p>
          <AccountList />
        </>
      )}
    </div>
  );
}
