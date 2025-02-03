import { UserProvider } from './components/UserContext';
import { Routes, Route } from 'react-router-dom';
import { NotFound } from './pages/NotFound';
import { AuthPage } from './pages/AuthPage';
import { Header } from './components/Header';
import { AccountForm } from './pages/AccountForm';
import { Home } from './pages/Home';
import { Inventory } from './pages/Inventory';
import { VirtualMachines } from './pages/VirtualMachines';
import { ObjectStorage } from './pages/ObjectStorage';

export default function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={<Home />} />
          <Route path="accounts/:accountId" element={<AccountForm />} />
          <Route path="inventory" element={<Inventory />} />
          <Route
            path="inventory/virtual-machines"
            element={<VirtualMachines />}
          />
          <Route path="inventory/object-storage" element={<ObjectStorage />} />
          <Route path="inventory/vpc-networks" element={<Inventory />} />
          <Route path="/sign-up" element={<AuthPage mode="sign-up" />} />
          <Route path="/sign-in" element={<AuthPage mode="sign-in" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </UserProvider>
  );
}
