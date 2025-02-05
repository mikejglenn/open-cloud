import { db } from './db';
import { Account } from './account';
import { getAllAwsBuckets } from './awsS3';
// import { getAllGcpBuckets } from './gcpCompute';

export type Bucket = {
  name: string;
  provider: string;
  account: string;
  region: string;
  creationDate: Date | undefined;
};

async function dbSelectAccountBuckets(accountId: number): Promise<Bucket[]> {
  const sql = `
    select "b"."name", "provider", "a"."name" as "accountName", "account",
    "region", "creationDate"
      from "buckets" as "b"
      join "accounts" as "a" using ("accountId")
     where "accountId" = $1;
  `;
  const result = await db.query<Bucket>(sql, [accountId]);
  return result.rows;
}

async function dbWriteBuckets(
  accountId: number,
  buckets: Bucket[]
): Promise<void> {
  for (const b of buckets) {
    const sql = `
      insert into "buckets" ("accountId", "name", "region", "creationDate")
      values ($1, $2, $3, $4)
      on conflict ("name")
      do update set "name"              = $2,
                    "region"            = $3,
                    "creationDate"      = $4
      returning *;
    `;
    const params = [accountId, b.name, b.region, b.creationDate];
    await db.query<Bucket>(sql, params);
  }
}

export async function getAllBuckets(
  accounts: Account[],
  refresh: string | undefined
): Promise<Bucket[]> {
  let buckets = [];

  if (refresh === 'yes') {
    for (const account of accounts) {
      switch (account.provider) {
        case 'AWS':
          buckets.push(...(await getAllAwsBuckets(account)));
          break;
        case 'GCP':
          // buckets.push(...(await getAllGcpBuckets(account)));
          break;
      }
      await dbWriteBuckets(account.accountId, buckets);
    }
  }

  buckets = [];
  for (const account of accounts) {
    buckets.push(...(await dbSelectAccountBuckets(account.accountId)));
  }

  return buckets;
}
