import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Account, readAccounts } from '../lib';
import { useUser } from '../components/useUser';
import { AccountCard } from '../components/AccountCard';

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
      <h2 className="text-2xl m-2">Accounts</h2>
      <Link to="/accounts/new" className="btn text-xl">
        Create New Account
      </Link>
      <ul className="flex flex-wrap justify-center">
        {accounts.length === 0 && <span>There are no accounts.</span>}
        {accounts.map((account) => (
          <AccountCard key={account.accountId} account={account} />
        ))}
      </ul>
    </>
  );
}
