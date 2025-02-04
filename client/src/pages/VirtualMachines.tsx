import { useEffect, useState } from 'react';
import { useUser } from '../components/useUser';
import { VirtualMachine, readVirtualMachines } from '../lib';
import { VmCard } from '../components/VmCard';

export function VirtualMachines() {
  const [virtualMachines, setVirtualMachines] = useState<VirtualMachine[]>([]);
  const [virtualMachine, setVirtualMachine] = useState<VirtualMachine>();
  const [active, setActive] = useState<string>('');
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

  function handleOnClick(vm: VirtualMachine) {
    setActive(vm.instanceId);
    console.log(active, vm.instanceId);
    setVirtualMachine(vm);
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
              <th>Instance ID</th>
              <th>VPC ID</th>
              <th>Subnet ID</th>
              <th>State</th>
              <th>Instance Type</th>
              <th>Private IP</th>
              <th>Public IP</th>
              <th>Tags</th>
              <th>Launch Time</th>
              <th>Last Seen</th>
            </tr>
          </thead>
          <tbody>
            {virtualMachines.map((vm) => (
              <tr
                key={vm.instanceId}
                className={active === vm.instanceId ? '!bg-neutral' : undefined}
                onClick={() => handleOnClick(vm)}>
                <td>{vm.name}</td>
                <td>provider</td>
                <td>account</td>
                <td>{vm.region}</td>
                <td>{vm.instanceId}</td>
                <td>{vm.vpcId}</td>
                <td>{vm.subnetId}</td>
                <td>{vm.instanceState}</td>
                <td>{vm.instanceType}</td>
                <td>{vm.privateIp}</td>
                <td>{vm.publicIp}</td>
                <td>{vm.tags}</td>
                <td>{`${vm.launchTime}`}</td>
                <td>null</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <VmCard vm={virtualMachine} />
    </>
  );
}
