import { useState } from 'react';
import LoginPage from './components/LoginPage';
import CodeReviewInterface from './components/CodeReviewInterface';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      {!isLoggedIn ? (
        <LoginPage onLogin={() => setIsLoggedIn(true)} />
      ) : (
        <CodeReviewInterface onLogout={() => setIsLoggedIn(false)} />
      )}
    </>
  );
}

export default App;
