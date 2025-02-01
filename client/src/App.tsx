import { UserProvider } from './components/UserContext';
import { Routes, Route } from 'react-router-dom';
import { NotFound } from './pages/NotFound';
import { AuthPage } from './pages/AuthPage';
import { Header } from './components/Header';
import { Inventory } from './pages/Inventory';
import { AccountForm } from './pages/AccountForm';
import { Home } from './pages/Home';

export default function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={<Home />} />
          <Route path="accounts/:accountId" element={<AccountForm />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="/sign-up" element={<AuthPage mode="sign-up" />} />
          <Route path="/sign-in" element={<AuthPage mode="sign-in" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </UserProvider>
  );
}
