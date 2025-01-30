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
    <>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <label title="Username" />
        <input required name="username" type="text" />
        <label title="Password" />
        <input required name="password" type="password" />
        <button disabled={isLoading}>Sign In</button>
      </form>
    </>
  );
}
