import { RegistrationForm } from '../components/RegistrationForm';
import { SignInForm } from '../components/SignInForm';

type Props = {
  mode: 'sign-up' | 'sign-in';
};
export function AuthPage({ mode }: Props) {
  return (
    <>
      {mode === 'sign-up' && <RegistrationForm />}
      {mode === 'sign-in' && <SignInForm />}
    </>
  );
}
