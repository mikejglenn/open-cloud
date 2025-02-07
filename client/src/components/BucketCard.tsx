import { FiExternalLink } from 'react-icons/fi';
import { Bucket } from '../lib';

type Props = {
  bucket: Bucket | undefined;
};

export function BucketCard({ bucket }: Props) {
  if (!bucket)
    return (
      <div className="border-2 border-base-300 p-4">
        Select an item for details.
      </div>
    );

  return (
    <div className="border-2 border-base-300 p-4">
      <h3 className="font-bold text-2xl">Details</h3>
      <div>
        <span className="font-bold">Name:</span> {bucket.name}{' '}
        <a
          className="link"
          href={
            bucket.provider === 'AWS'
              ? `https://${bucket.region}.console.aws.amazon.com/s3/buckets/${bucket.name}`
              : `https://console.cloud.google.com/storage/browser/${bucket.name}`
          }
          target="_blank">
          <FiExternalLink className="inline pb-1" />
        </a>
      </div>
      <div>
        <span className="font-bold">Provider:</span> {bucket.provider}
        <img
          src={`/${bucket.provider}.svg`}
          className="w-8 inline ml-2 pb-1"
          alt="cloud"
        />
      </div>
      <div>
        <span className="font-bold">Account:</span> {bucket.accountName}
      </div>
      <div>
        <span className="font-bold">Region:</span> {bucket.region}
      </div>
      <div>
        <span className="font-bold">Creation Date:</span>{' '}
        {`${bucket.creationDate}`}
      </div>
      <div>
        <span className="font-bold">Last Seen:</span> {`${bucket.lastSeen}`}
      </div>
    </div>
  );
}
