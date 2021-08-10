import React, { useState } from 'react';
import AppRouter from 'components/Router';
import { authService } from 'fbase'; //fbase가 우리의 firebase instance 이다

function App() {
  const [isLogginedIn, setIsLogginedIn] = useState(authService.currentUser);

  return (
    <>
      <AppRouter isLogginedIn={isLogginedIn} />
      <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
    </>
  );
}

export default App;
