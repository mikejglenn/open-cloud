import { useEffect, useState } from 'react';
import { Theme, Button } from 'react-daisyui';

export default function App() {
  const [serverData, setServerData] = useState('');

  useEffect(() => {
    async function readServerData() {
      const resp = await fetch('/api/hello');
      const data = await resp.json();

      console.log('Data from server:', data);

      setServerData(data.message);
    }

    readServerData();
  }, []);

  return (
    <>
      <h1>{serverData}</h1>
      <Theme dataTheme="dark">
        <Button color="primary">Click me, dark!</Button>
      </Theme>
      <Theme dataTheme="light">
        <Button color="primary">Click me, light!</Button>
      </Theme>
    </>
  );
}
