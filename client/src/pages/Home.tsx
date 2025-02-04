import { Link } from 'react-router-dom';
import { useUser } from '../components/useUser';
import { AccountList } from './AccountList';

export function Home() {
  const { user } = useUser();

  return (
    <>
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
