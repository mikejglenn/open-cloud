import { Link } from 'react-router-dom';
import { Account } from '../lib';

type AccountProps = {
  account: Account;
};

export function AccountCard({ account }: AccountProps) {
  return (
    <li className="card bg-neutral text-neutral-content w-96 m-2">
      <Link to={`/accounts/${account.accountId}`}>
        <div className="card-body items-center text-center">
          <img src={`/${account.provider}.svg`} alt="cloud" className="w-12" />
          <h2 className="card-title">Name: {account.name}</h2>
          <p>ID: {account.account}</p>
        </div>
      </Link>
    </li>
  );
}
