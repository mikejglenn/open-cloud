import { db } from './db';

export type Account = {
  accountId: number;
  userId: number;
  name: string;
  provider: string;
  account: string;
  accessKey: string;
  secretKey: string;
};

export async function getAccountByAccountId(
  accountId: number
): Promise<Account> {
  const sql = `
      select *
        from "accounts"
      where "accountId" = $1;
    `;
  const result = await db.query<Account>(sql, [accountId]);
  const account = result.rows[0];
  return account;
}
