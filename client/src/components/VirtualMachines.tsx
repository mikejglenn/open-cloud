import { useEffect, useState } from 'react';
import { useUser } from '../components/useUser';
import { VirtualMachine, readVirtualMachines } from '../lib';

export function VirtualMachines() {
  const [virtualMachines, setVirtualMachines] = useState<VirtualMachine[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>();
  const { user } = useUser();

  useEffect(() => {
    async function load() {
      try {
        if (user) {
          const virtualMachines = await readVirtualMachines();
          setVirtualMachines(virtualMachines);
        }
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [user]);

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
      {virtualMachines.map((vm) => (
        <pre>{vm.name}</pre>
      ))}
    </>
  );
}
