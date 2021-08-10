import React from 'react';
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import Auth from 'routes/Auth';
import Home from 'routes/Home';
import Navigation from 'components/Navigation';
import Profile from 'routes/Profile';

const AppRouter = ({ isLogginedIn }) => {
  return (
    <Router>
      {/* (&&)은 Navigation이  존재하려면 isLogginedIn이 true 여야 한다는걸 의미한다.*/}
      {isLogginedIn && <Navigation />}
      <Switch>
        {isLogginedIn ? (
          <>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/profile">
              <Profile />
            </Route>
            {/* <Redirect from="*" to="/" /> */}
          </>
        ) : (
          <>
            <Route exact path="/">
              <Auth />
            </Route>
            {/*Redirect: "/" route알고 다른 경로에 있으면 "/"로 돌아가라는 뜻 <- useHistory로 대체함*/}
            {/* <Redirect from="*" to="/" /> */}
          </>
        )}
      </Switch>
    </Router>
  );
};

export default AppRouter;
