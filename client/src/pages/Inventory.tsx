import { useUser } from '../components/useUser';
import { VirtualMachines } from '../components/VirtualMachines';

export function Inventory() {
  const { user } = useUser();

  if (!user) return null;

  return <VirtualMachines />;
}
