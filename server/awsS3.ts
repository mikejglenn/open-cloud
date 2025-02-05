import { ListBucketsCommand, S3Client } from '@aws-sdk/client-s3';
import { Account } from './account';
import { decryptText } from './crypto-text';
import { Bucket } from './object-storage';

export async function getAllAwsBuckets(account: Account): Promise<Bucket[]> {
  const bucketsInfo: Bucket[] = [];

  const region = 'us-west-2';
  const client = new S3Client({
    region,
    credentials: {
      accessKeyId: decryptText(account.credentialIdentity),
      secretAccessKey: decryptText(account.credentialSecret),
    },
  });

  const command = new ListBucketsCommand({ MaxBuckets: 200 });
  const response = await client.send(command);
  const { Buckets } = response;
  if (Buckets) {
    for (const bucket of Buckets) {
      bucketsInfo.push({
        name: bucket.Name ?? '',
        provider: 'AWS',
        account: account.account,
        region: bucket.BucketRegion ?? '',
        creationDate: bucket.CreationDate,
      });
    }
  }

  return bucketsInfo;
}
