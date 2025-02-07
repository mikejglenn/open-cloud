import { Link } from 'react-router-dom';
import { useUser } from '../components/useUser';

export function Inventory() {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="flex flex-col items-center">
      <Link
        to="/inventory/virtual-machines"
        className="card bg-neutral text-neutral-content w-96 mb-2">
        <div className="card-body items-center text-center">
          <h2 className="card-title">Virtual Machines</h2>
        </div>
      </Link>
      <Link
        to="/inventory/object-storage"
        className="card bg-neutral text-neutral-content w-96 mb-2">
        <div className="card-body items-center text-center">
          <h2 className="card-title">Object Storage</h2>
        </div>
      </Link>
      <Link
        to="/inventory/managed-databases"
        className="card bg-neutral text-neutral-content w-96 mb-2 hidden">
        <div className="card-body items-center text-center">
          <h2 className="card-title">Managed Databases</h2>
        </div>
      </Link>
    </div>
  );
}
