import { db } from './db';
import { Account } from './account';
import { getAllAwsBuckets } from './aws-s3';
import { getAllGcpBuckets } from './gcp-cloud-storage';

export type Bucket = {
  name: string;
  provider: string;
  account: string;
  region: string;
  creationDate: Date | undefined;
  lastSeen: Date;
};

async function dbSelectAccountBuckets(accountId: number): Promise<Bucket[]> {
  const sql = `
    SELECT "b"."name", "provider", "a"."name" AS "accountName", "account",
    "region", "creationDate", "lastSeen"
      FROM "buckets" AS "b"
      JOIN "accounts" AS "a" USING ("accountId")
     WHERE "accountId" = $1
     ORDER BY "bucketId";
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
      INSERT INTO "buckets" ("accountId", "name", "region", "creationDate",
      "lastSeen")
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT ("name")
      DO UPDATE SET "updatedAt"         = now(),
                    "name"              = $2,
                    "region"            = $3,
                    "creationDate"      = $4,
                    "lastSeen"          = $5
      RETURNING *;
    `;
    const params = [accountId, b.name, b.region, b.creationDate, b.lastSeen];
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
          buckets.push(...(await getAllGcpBuckets(account)));
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
