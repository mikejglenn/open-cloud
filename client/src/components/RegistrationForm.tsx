import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from './UserContext';

export function RegistrationForm() {
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
      const res = await fetch('/api/auth/sign-up', req);
      if (!res.ok) {
        throw new Error(`fetch Error ${res.status}`);
      }
      const user = (await res.json()) as User;
      alert(
        `Successfully registered ${user.username} as userId ${user.userId}.`
      );
      navigate('/sign-in');
    } catch (err) {
      alert(`Error registering user: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="hero">
      <div className="hero-content">
        <h1>Register now!</h1>
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
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
