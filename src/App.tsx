
import Create from './page/create';  
import { useAuthenticator } from '@aws-amplify/ui-react';


function App() {
  const { signOut } = useAuthenticator();
  return (
    <div className='app'>
      <main className='content' style={{ paddingTop: '5vh' }}>
      <button onClick={signOut}>Sign out</button>
      <Create />
    </main>
    </div>
    
  );
}

export default App;
