import { useEffect, useState } from 'react';
import { useUser } from '../components/useUser';
import { Bucket, readBuckets } from '../lib';
import { BucketCard } from '../components/BucketCard';
import { FiExternalLink } from 'react-icons/fi';

export function ObjectStorage() {
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [bucket, setBucket] = useState<Bucket>();
  const [active, setActive] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>();
  const { user } = useUser();

  useEffect(() => {
    async function load() {
      try {
        if (user) {
          const buckets = await readBuckets();
          setBuckets(buckets);
        }
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [user]);

  function handleOnClick(bucket: Bucket) {
    setActive(bucket.name);
    setBucket(bucket);
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) {
    return (
      <div>
        Error Loading Accounts:{' '}
        {error instanceof Error ? error.message : 'Unknown Error'}
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <div className="overflow-x-auto border-2 border-base-300">
        <table className="table table-zebra whitespace-nowrap">
          <thead>
            <tr>
              <th>Name</th>
              <th>Provider</th>
              <th>Account</th>
              <th>Region</th>
              <th>Creation Date</th>
              {/* <th>Last Seen</th> */}
            </tr>
          </thead>
          <tbody>
            {buckets.map((bucket) => (
              <tr
                key={bucket.name}
                className={active === bucket.name ? '!bg-neutral' : undefined}
                onClick={() => handleOnClick(bucket)}>
                <td>
                  {bucket.name}
                  <a
                    className="link"
                    href={
                      bucket.provider === 'AWS'
                        ? `https://${bucket.region}.console.aws.amazon.com/s3/buckets/${bucket.name}`
                        : '' //`https://console.cloud.google.com/compute/instancesDetail/zones/${vm.zone}/instances/${vm.name}?project=${vm.account}`
                    }
                    target="_blank">
                    <FiExternalLink className="inline pb-1 pl-1" />
                  </a>
                </td>
                <td>{bucket.provider}</td>
                <td>{bucket.accountName}</td>
                <td>{bucket.region}</td>
                <td>{`${bucket.creationDate}`}</td>
                {/* <td>null</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <BucketCard bucket={bucket} />
    </>
  );
}
