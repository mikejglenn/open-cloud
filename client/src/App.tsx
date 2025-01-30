import { UserProvider } from './components/UserContext';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
// import { Inventory } from './pages/Inventory';
import { AuthPage } from './pages/AuthPage';
import { AccountForm } from './pages/AccountForm';
import { NotFound } from './pages/NotFound';

export default function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Header />} />
        {/* <Route index element={<Inventory />} /> */}
        <Route path="account/:accountId" element={<AccountForm />} />
        <Route path="/sign-up" element={<AuthPage mode="sign-up" />} />
        <Route path="/sign-in" element={<AuthPage mode="sign-in" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </UserProvider>
  );
}
