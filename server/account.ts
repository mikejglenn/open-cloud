import { db } from './db';
import { ClientError } from './lib';
import { encryptText } from './crypto-text';

export type Account = {
  accountId: number;
  userId: number;
  name: string;
  provider: string;
  account: string;
  accessKey: string;
  secretKey: string;
};

export async function getAccountsByUserId(userId: number): Promise<Account[]> {
  const sql = `
    select *
    from "accounts"
    where "userId" = $1
    order by "accountId";
  `;
  const result = await db.query<Account>(sql, [userId]);
  const accounts = result.rows;
  return accounts;
}

export async function createAccount(
  userId: number,
  body: any
): Promise<Account> {
  const { name, provider, account, accessKey, secretKey } = body;
  if (!name || !provider || !account || !accessKey || !secretKey) {
    throw new ClientError(400, 'account info is missing');
  }
  const sql = `
    insert into "accounts" ("userId", "name", "provider", "account", "accessKey", "secretKey")
    values ($1, $2, $3, $4, $5, $6)
    returning *;
  `;
  const params = [
    userId,
    name,
    provider,
    account,
    encryptText(accessKey),
    encryptText(secretKey),
  ];
  const result = await db.query(sql, params);
  const createdAccount = result.rows[0];
  return createdAccount;
}
