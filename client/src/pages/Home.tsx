import { useNavigate } from 'react-router-dom';
import { useUser } from '../components/useUser';
import { AccountList } from './AccountList';

export function Home() {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <>
      {!user && (
        <>
          <button onClick={() => navigate('sign-up')}>Sign Up</button>
          <button onClick={() => navigate('sign-in')}>Sign In</button>
        </>
      )}
      {/* {user && (
        <p>
          Signed in as {user.username} with ID: {user.userId}
        </p>
      )} */}
      {user && <AccountList />}
    </>
  );
}
