import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPencilAlt } from 'react-icons/fa';
import { Account, readAccounts } from '../lib';
import { useUser } from '../components/useUser';

export function AccountList() {
  const [accounts, setAccount] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>();

  const { user } = useUser();

  useEffect(() => {
    async function load() {
      try {
        if (user) {
          const accounts = await readAccounts();
          setAccount(accounts);
        }
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [user]);

  if (isLoading) return <div>Loading...</div>;
  if (error) {
    return (
      <div>
        Error Loading Accounts:{' '}
        {error instanceof Error ? error.message : 'Unknown Error'}
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <h2 className="text-2xl">Accounts</h2>
      <h3>
        <Link to="/accounts/new" className="btn">
          NEW
        </Link>
      </h3>

      <ul>
        {accounts.length === 0 && <span>There are no entries.</span>}
        {accounts.map((account) => (
          <AccountCard key={account.accountId} account={account} />
        ))}
      </ul>
    </>
  );
}

type AccountProps = {
  account: Account;
};
function AccountCard({ account }: AccountProps) {
  return (
    <li className="card bg-base-100 w-96 shadow-sm">
      <div className="card-body">
        <h2 className="card-title">Account Name: {account.name}</h2>
        <Link to={`accounts/${account.accountId}`}>
          <FaPencilAlt />
        </Link>
        <p>Account ID: {account.account}</p>
      </div>
    </li>
  );
}
