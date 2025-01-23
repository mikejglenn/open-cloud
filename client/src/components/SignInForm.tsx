import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, useUser } from './useUser';
import { Button, Card, Form, Hero, Input } from 'react-daisyui';

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
    <Hero>
      <Hero.Content>
        <h1>Sign In</h1>
        <Card>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Label title="Username" />
              <Input
                required
                name="username"
                type="text"
                className="input-bordered"
              />
              <Form.Label title="Password" />
              <Input
                required
                name="password"
                type="password"
                className="input-bordered"
              />
              <Button disabled={isLoading} className="btn-primary block">
                Sign In
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Hero.Content>
    </Hero>
  );
}
