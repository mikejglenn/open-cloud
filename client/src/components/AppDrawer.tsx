import { NavLink, Outlet } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { useState } from 'react';

export type MenuItem = {
  name: string;
  iconUrl: string;
  path: string;
};

type Props = {
  menuItems: MenuItem[];
  menuHeading: string;
};

export function AppDrawer({ menuItems, menuHeading }: Props) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex w-full">
      <nav
        className={`pl-2 text-white bg-gray-900 ${isOpen ? 'w-64' : 'w-16'}`}>
        <FaBars onClick={() => setIsOpen(!isOpen)} className="my-5 text-3xl" />
        {isOpen && <h2 className="w-full mb-5 text-2xl">{menuHeading}</h2>}
        <Menu items={menuItems} isOpen={isOpen} />
      </nav>
      <div className="grow">
        <Outlet />
      </div>
    </div>
  );
}

type MenuProps = {
  items: MenuItem[];
  isOpen: boolean;
};

function Menu({ items, isOpen }: MenuProps) {
  return (
    <ul>
      {items.map((menu) => (
        <li key={menu.name} className="inline-block py-2 px-2 w-full">
          <NavLink
            to={menu.path}
            // className="text-white flex items-center"
            // className={`${({ isActive }) =>
            //   isActive ? 'bg-black' : ''} text-white flex items-center`}
            className={({ isActive }) =>
              (isActive ? 'bg-black ' : '') + 'text-white flex items-center'
            }>
            <img src={menu.iconUrl} className="w-4" />
            <span className="ml-1">{isOpen && menu.name}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  );
}
