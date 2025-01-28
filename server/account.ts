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

export async function getAccountsByUserId(userId: number): Promise<Account[]> {
  const sql = `
      select * from "accounts"
      where "userId" = $1;
    `;
  const result = await db.query<Account>(sql, [userId]);
  const accounts = result.rows;
  return accounts;
}
