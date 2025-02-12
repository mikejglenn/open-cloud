import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useUser } from './useUser';
import { FaBars } from 'react-icons/fa6';
import { LuMoon, LuSun } from 'react-icons/lu';
import { IoMdExit } from 'react-icons/io';
import { useState } from 'react';

export function Header() {
  const { user, handleSignOut } = useUser();
  const [mobileMenu, setMobileMenu] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 bg-base-300 relative">
        <div className="navbar shadow-sm flex justify-between items-center">
          <div>
            {user && (
              <FaBars
                className="inline sm:hidden"
                onClick={() => setMobileMenu(!mobileMenu)}
              />
            )}
            <NavLink to="/" className="btn text-2xl">
              <span className="uppercase text-accent">Open</span>
              <span className="uppercase">Cloud</span>
            </NavLink>
            {user && (
              <>
                <NavLink
                  to="/accounts"
                  className={({ isActive }) =>
                    (isActive ? 'btn-active ' : '') + 'btn btn-ghost'
                  }>
                  Accounts
                </NavLink>
                <NavLink
                  to="/inventory"
                  className={({ isActive }) =>
                    (isActive ? 'btn-active ' : '') + 'btn btn-ghost'
                  }>
                  Inventory
                </NavLink>
                <NavLink
                  to="/cost"
                  className={({ isActive }) =>
                    (isActive ? 'btn-active ' : '') + 'btn btn-ghost hidden'
                  }>
                  Cost
                </NavLink>
              </>
            )}
          </div>
          {user && (
            <div>
              <label className="swap swap-rotate hidden">
                <input
                  type="checkbox"
                  className="theme-controller"
                  value="corporate"
                />
                <LuMoon className="swap-off h-5 w-5 fill-current" />
                <LuSun className="swap-on h-5 w-5 fill-current" />
              </label>

              <IoMdExit
                title="Sign Out"
                className="text-3xl ml-4"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  handleSignOut();
                  navigate('/');
                }}
              />
            </div>
          )}
        </div>
        {user && (
          <ul
            className="menu bg-base-200 w-56 absolute z-10"
            hidden={mobileMenu}>
            <li>
              <NavLink
                onClick={() => setMobileMenu(!mobileMenu)}
                to="/inventory/virtual-machines"
                className={({ isActive }) => (isActive ? 'menu-active ' : '')}>
                Virtual Machines
              </NavLink>
            </li>
            <li>
              <NavLink
                onClick={() => setMobileMenu(!mobileMenu)}
                to="/inventory/object-storage"
                className={({ isActive }) => (isActive ? 'menu-active ' : '')}>
                Object Storage
              </NavLink>
            </li>
            <li className="hidden">
              <NavLink
                onClick={() => setMobileMenu(!mobileMenu)}
                to="/inventory/managed-databases"
                className={({ isActive }) => (isActive ? 'menu-active ' : '')}>
                Managed Databases
              </NavLink>
            </li>
          </ul>
        )}
      </header>

      <div className="flex flex-row flex-grow">
        {user && (
          <aside className="w-64 p-4 hidden sm:block">
            <ul className="menu bg-base-200 w-56">
              <li>
                <NavLink
                  to="/inventory/virtual-machines"
                  className={({ isActive }) => (isActive ? 'menu-active' : '')}>
                  Virtual Machines
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/inventory/object-storage"
                  className={({ isActive }) => (isActive ? 'menu-active' : '')}>
                  Object Storage
                </NavLink>
              </li>
              <li className="hidden">
                <NavLink
                  to="/inventory/managed-databases"
                  className={({ isActive }) => (isActive ? 'menu-active' : '')}>
                  Managed Databases
                </NavLink>
              </li>
            </ul>
          </aside>
        )}

        <main className="flex-grow w-64 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
