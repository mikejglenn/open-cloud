import { User } from '../components/UserContext';

export type UnsavedAccount = {
  name: string;
  provider: string;
  account: string;
  accessKey: string;
  secretKey: string;
};
export type Account = UnsavedAccount & {
  accountId?: number;
};

const authKey = 'um.auth';

type Auth = {
  user: User;
  token: string;
};

export function saveAuth(user: User, token: string): void {
  const auth: Auth = { user, token };
  localStorage.setItem(authKey, JSON.stringify(auth));
}

export function removeAuth(): void {
  localStorage.removeItem(authKey);
}

export function readUser(): User | undefined {
  const auth = localStorage.getItem(authKey);
  if (!auth) return undefined;
  return (JSON.parse(auth) as Auth).user;
}

export function readToken(): string | undefined {
  const auth = localStorage.getItem(authKey);
  if (!auth) return undefined;
  return (JSON.parse(auth) as Auth).token;
}

export async function readAccounts(): Promise<Account[]> {
  const req = {
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  };
  const response = await fetch('/api/accounts', req);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = (await response.json()) as Account[];
  return data;
}

export async function readAccount(
  accountId: number
): Promise<Account | undefined> {
  const req = {
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  };
  const response = await fetch(`/api/accounts/${accountId}`, req);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = (await response.json()) as Account;
  return data;
}

export async function insertAccount(account: Account): Promise<Account> {
  const response = await fetch('/api/accounts/', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${readToken()}`,
    },
    body: JSON.stringify(account),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = (await response.json()) as Account;
  return data;
}

export async function updateAccount(account: Account): Promise<Account> {
  const response = await fetch(`/api/accounts/${account.accountId}`, {
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${readToken()}`,
    },
    body: JSON.stringify(account),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = (await response.json()) as Account;
  return data;
}

export async function removeAccount(accountId: number): Promise<void> {
  const response = await fetch(`/api/accounts/${accountId}`, {
    method: 'delete',
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
}
