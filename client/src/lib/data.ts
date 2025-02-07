import { User } from '../components/UserContext';

export type UnsavedAccount = {
  name: string;
  provider: string;
  account: string;
  credentialIdentity: string;
  credentialSecret: string;
};
export type Account = UnsavedAccount & {
  accountId?: number;
};

const authKey = 'um.auth';

type Auth = {
  user: User;
  token: string;
};

export type VirtualMachine = {
  name: string;
  provider: string;
  accountName: string;
  account: string;
  instanceId: string;
  region: string;
  zone: string;
  vpcId: string;
  subnetId: string;
  instanceState: string;
  instanceType: string;
  instanceOs: string;
  privateIp: string;
  publicIp: string;
  tags: string;
  launchTime: Date | undefined;
  lastSeen: Date;
};

export type Bucket = {
  name: string;
  provider: string;
  accountName: string;
  account: string;
  region: string;
  creationDate: Date | undefined;
  lastSeen: Date;
};

export function stateNormalize(state: string): string {
  const states: Record<string, string> = {
    pending: 'Pending',
    running: 'Running',
    'shutting-down': 'Shutting-Down',
    stopped: 'Stopped',
    stopping: 'Stopping',
    terminated: 'Terminated',
    PENDING_STOP: 'Shutting-Down',
    PROVISIONING: 'Provisioning',
    REPAIRING: 'Repairing',
    RUNNING: 'Running',
    STOPPING: 'Stopping',
    STAGING: 'Staging',
    SUSPENDED: 'Suspended',
    SUSPENDING: 'Suspending',
    TERMINATED: 'Stopped',
  };
  return states[state];
}

// needed if private key is pasted with literal '\n'
function gcpPrivateKeyNewlineReplace(account: Account): void {
  if (account.provider === 'GCP')
    account.credentialSecret = account.credentialSecret.replace(/\\n/g, '\n');
}

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
  // needed if private key is pasted with literal '\n'
  gcpPrivateKeyNewlineReplace(account);
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
  // needed if private key is pasted with literal '\n'
  gcpPrivateKeyNewlineReplace(account);
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

export async function readVirtualMachines(
  refresh: string
): Promise<VirtualMachine[]> {
  const req = {
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  };
  const response = await fetch(
    `/api/inventory/virtual-machines?refresh=${refresh}`,
    req
  );
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = (await response.json()) as VirtualMachine[];
  return data;
}

export async function readBuckets(refresh: string): Promise<Bucket[]> {
  const req = {
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  };
  const response = await fetch(
    `/api/inventory/object-storage?refresh=${refresh}`,
    req
  );
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = (await response.json()) as Bucket[];
  return data;
}
