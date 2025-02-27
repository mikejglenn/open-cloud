import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  type Account,
  insertAccount,
  readAccount,
  removeAccount,
  updateAccount,
} from '../lib';

export function AccountForm() {
  const { accountId } = useParams();
  const [account, setAccount] = useState<Account>();
  const [provider, setProvider] = useState<Account['provider']>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>();
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const isEditing = accountId && accountId !== 'new';

  useEffect(() => {
    async function load(id: number) {
      setIsLoading(true);
      try {
        const account = await readAccount(id);
        if (!account) throw new Error(`Account with ID ${id} not found`);
        setAccount(account);
        setProvider(account.provider);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (isEditing) load(+accountId);
  }, [accountId, isEditing]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newAccount = Object.fromEntries(formData) as unknown as Account;
    if (isEditing) {
      updateAccount({ ...account, ...newAccount });
    } else {
      insertAccount(newAccount);
    }
    navigate('/');
  }

  function handleDelete() {
    if (!account?.accountId) throw new Error('Should never happen');
    removeAccount(account.accountId);
    navigate('/');
  }

  if (isLoading)
    return <span className="loading loading-spinner loading-lg"></span>;
  if (error) {
    return (
      <div>
        Error Loading Account with ID {accountId}:{' '}
        {error instanceof Error ? error.message : 'Unknown Error'}
      </div>
    );
  }

  return (
    <>
      <h1>{isEditing ? 'Edit Account' : 'New Account'}</h1>

      <form onSubmit={handleSubmit} className="form">
        <label className="label" htmlFor="accountName">
          {!provider || provider === 'AWS' ? 'Account Name' : 'Project Name'}
        </label>
        <input
          className="input"
          name="name"
          defaultValue={account?.name ?? ''}
          required
          type="text"
          id="accountName"
        />

        <fieldset className="fieldset flex">
          <legend className="fieldset-legend">Provider</legend>

          <label htmlFor="aws" className="label inline">
            AWS
          </label>
          <input
            className="radio inline"
            checked={provider === 'AWS' ? true : false}
            type="radio"
            name="provider"
            value="AWS"
            id="aws"
            required
            onClick={() => setProvider('AWS')}
          />

          <label htmlFor="gcp" className="label inline">
            GCP
          </label>
          <input
            className="radio inline"
            checked={provider === 'GCP' ? true : false}
            type="radio"
            name="provider"
            value="GCP"
            id="gcp"
            required
            onClick={() => setProvider('GCP')}
          />
        </fieldset>

        <label className="label" htmlFor="accountId">
          {!provider || provider === 'AWS' ? 'Account ID' : 'Project ID'}
        </label>
        <input
          className="input block"
          name="account"
          defaultValue={account?.account ?? ''}
          required
          type="text"
          id="accountId"
        />

        <label className="label" htmlFor="credentialIdentity">
          {!provider || provider === 'AWS' ? 'Access Key' : 'Client Email'}
        </label>
        <input
          type="password"
          className="input block"
          name="credentialIdentity"
          defaultValue={account?.credentialIdentity ?? ''}
          required
          id="credentialIdentity"
        />

        <label className="label" htmlFor="credentialSecret">
          {!provider || provider === 'AWS' ? 'Secret Key' : 'Private Key'}
        </label>
        <input
          type="password"
          className="input block"
          name="credentialSecret"
          defaultValue={account?.credentialSecret ?? ''}
          required
          id="credentialSecret"
        />
        {isEditing && (
          <button
            className="hidden"
            type="button"
            onClick={() => setIsDeleting(true)}>
            Delete Account
          </button>
        )}
        <button className="btn">SAVE</button>
      </form>
      {isDeleting && (
        <>
          <p>Are you sure you want to delete this account?</p>
          <button onClick={() => setIsDeleting(false)}>Cancel</button>
          <button onClick={handleDelete}>Confirm</button>
        </>
      )}
    </>
  );
}
