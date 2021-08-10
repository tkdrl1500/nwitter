import React, { useEffect, useState } from 'react';
import AppRouter from 'components/Router';
import { authService } from 'fbase'; //fbase가 우리의 firebase instance 이다

function App() {
  const [init, setInit] = useState(false);
  const [isLogginedIn, setIsLogginedIn] = useState(false);

  // 사용자의 로그인 상태의 변화를 관찰하는 관찰자를 추가
  // 변화가 있는지 듣고 있다가 계정생성, 로그인, 이미 로그인 했거나, firebase는 스스로 초기화하는 것을 끝냈기 때문이다
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLogginedIn(true);
      } else {
        setIsLogginedIn(false);
      }
      // init이 false라면 router를 숨길것이라서 true를 해줌
      setInit(true);
    });
  }, []);
  return (
    <>
      {init ? <AppRouter isLogginedIn={isLogginedIn} /> : 'Initializing...'}
      <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
    </>
  );
}

export default App;
