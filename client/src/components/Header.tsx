import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useUser } from './useUser';
// import { FaBars, FaEllipsis } from 'react-icons/fa6';

export function Header() {
  const { user, handleSignOut } = useUser();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 flex justify-between items-center bg-base-300">
        <div className="navbar shadow-sm">
          <NavLink to="/" className="btn text-2xl">
            <span className="uppercase text-accent">Open</span>
            <span className="uppercase">Cloud</span>
          </NavLink>
          <NavLink to="/" className="btn btn-ghost text-xl">
            Accounts
          </NavLink>
          <NavLink to="/inventory" className="btn btn-ghost text-xl">
            Inventory
          </NavLink>
          <NavLink to="/cost" className="btn btn-ghost text-xl">
            Cost
          </NavLink>
        </div>

        {user && (
          <button
            className="btn btn-secondary text-xl"
            onClick={() => {
              handleSignOut();
              navigate('/');
            }}>
            Sign Out
          </button>
        )}
      </header>

      <div className="flex flex-row flex-grow">
        <aside className="w-64 p-4 hidden sm:block">
          <ul className="menu bg-base-200 w-56">
            <li>
              <Link to="/inventory/virtual-machines">Virtual Machines</Link>
            </li>
            <li>
              <Link to="/inventory/object-storage">Object Storage</Link>
            </li>
            <li>
              <Link to="/inventory/vpc-networks">VPC Networks</Link>
            </li>
          </ul>
        </aside>

        <main className="flex-grow w-64 p-4">
          {!user && <p>Not signed in!</p>}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
