import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, useUser } from './useUser';

type AuthData = {
  user: User;
  token: string;
};

export function SignInForm() {
  const { handleSignIn } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(event.currentTarget);
      const userData = Object.fromEntries(formData);
      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
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
    <div className="hero">
      <div className="hero-content">
        <h1>Sign In</h1>
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <label title="Username" />
              <input
                required
                name="username"
                type="text"
                className="input-bordered"
              />
              <label title="Password" />
              <input
                required
                name="password"
                type="password"
                className="input-bordered"
              />
              <button disabled={isLoading} className="btn-primary block">
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
