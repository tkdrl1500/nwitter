import React, { useEffect, useState } from 'react';
import AppRouter from 'components/Router';
import { authService } from 'fbase'; //fbase가 우리의 firebase instance 이다

function App() {
  const [init, setInit] = useState(false);
  // const [isLogginedIn, setIsLogginedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  // 사용자의 로그인 상태의 변화를 관찰하는 관찰자를 추가
  // 변화가 있는지 듣고 있다가 계정생성, 로그인, 이미 로그인 했거나 할때 발생하거나 어플리케이션이 초기화 될때 발생한다. firebase는 스스로 초기화하는 것을 끝냈기 때문이다
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setUserObj(user);
      }
      // init이 false라면 router를 숨기고 "Initializing..."만 보여줄 것이다. 그래서 항상 true로 했다
      setInit(true);
    });
  }, []);
  //userObj를 통해서 isLogginedIn을 대신 했기 때문에 render를 하나 줄임
  // useEffect(() => {
  //   authService.onAuthStateChanged((user) => {
  //     if (user) {
  //       setIsLogginedIn(true);
  //       setUserObj(user);
  //     } else {
  //       setIsLogginedIn(false);
  //     }
  //     // init이 false라면 router를 숨기고 "Initializing..."만 보여줄 것이다. 그래서 항상 true로 했다
  //     setInit(true);
  //   });
  // }, []);
  return (
    <>
      {init ? (
        <AppRouter isLogginedIn={Boolean(userObj)} userObj={userObj} />
      ) : (
        'Initializing...'
      )}
    </>
  );
}

export default App;
