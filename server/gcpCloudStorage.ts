import { Storage } from '@google-cloud/storage';
import { Account } from './account';
import { decryptText } from './crypto-text';
import { Bucket } from './object-storage';

export async function getAllGcpBuckets(account: Account): Promise<Bucket[]> {
  const bucketsInfo: Bucket[] = [];

  const storage = new Storage({
    projectId: account.account,
    credentials: {
      client_email: decryptText(account.credentialIdentity),
      private_key: decryptText(account.credentialSecret),
    },
  });

  const [buckets] = await storage.getBuckets();
  for (const bucket of buckets) {
    bucketsInfo.push({
      name: bucket.name ?? '',
      provider: 'GCP',
      account: account.account,
      region: bucket.metadata.location ?? '',
      creationDate: new Date(bucket.metadata.timeCreated ?? ''),
    });
  }

  return bucketsInfo;
}
