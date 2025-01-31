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
    <table
      style={{ display: 'block', overflowX: 'auto', whiteSpace: 'nowrap' }}>
      <thead>
        <tr>
          <th>Name</th>
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
          <tr key={vm.instanceId}>
            <td>{vm.name}</td>
            <td>{vm.region}</td>
            <td>{vm.instanceId}</td>
            <td>{vm.vpcId}</td>
            <td>{vm.subnetId}</td>
            <td>{vm.state}</td>
            <td>{vm.type}</td>
            <td>{vm.privateIp}</td>
            <td>{vm.publicIp}</td>
            <td>{vm.tags}</td>
            <td>{`${vm.launchTime}`}</td>
            <td>null</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
