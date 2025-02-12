import { useEffect, useState } from 'react';
import { useUser } from '../components/useUser';
import { Bucket, readBuckets } from '../lib';
import { BucketCard } from '../components/BucketCard';
import { FiExternalLink } from 'react-icons/fi';
import { FaMagnifyingGlass } from 'react-icons/fa6';

export function ObjectStorage() {
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [bucket, setBucket] = useState<Bucket>();
  const [active, setActive] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>();
  const { user } = useUser();
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        if (user) {
          // stale while refresh call. first refresh from db then refresh 'yes'
          let buckets = await readBuckets('no');
          setBuckets(buckets);
          setIsLoading(false);
          buckets = await readBuckets('yes');
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

  if (isLoading)
    return <span className="loading loading-spinner loading-lg"></span>;
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
      <label className="input" htmlFor="search">
        <FaMagnifyingGlass
          className="opacity-50"
          style={{ paddingTop: '2px' }}
        />
        <input
          id="search"
          type="search"
          required
          placeholder="Search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </label>
      <div className="overflow-x-auto border-2 border-base-300">
        <table className="table table-zebra whitespace-nowrap">
          <thead>
            <tr>
              <th>Bucket Name</th>
              <th>Provider</th>
              <th>Account</th>
              <th>Region</th>
              <th>Creation Date</th>
              <th>Last Seen</th>
            </tr>
          </thead>
          <tbody>
            {buckets
              .filter((fb) =>
                Object.values(fb).find((b) =>
                  b
                    ?.toString()
                    .toLocaleLowerCase()
                    .includes(searchInput.toLocaleLowerCase())
                )
              )
              .map((bucket) => (
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
                          : `https://console.cloud.google.com/storage/browser/${bucket.name}`
                      }
                      target="_blank">
                      <FiExternalLink className="inline pb-1 pl-1" />
                    </a>
                  </td>
                  <td>
                    {bucket.provider}
                    <img
                      src={`/${bucket.provider}.svg`}
                      className="w-8 inline ml-2 pb-1"
                      alt="cloud"
                    />
                  </td>
                  <td>{bucket.accountName}</td>
                  <td>{bucket.region}</td>
                  <td>{`${bucket.creationDate}`}</td>
                  <td>{`${bucket.lastSeen}`}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <BucketCard bucket={bucket} />
    </>
  );
}
