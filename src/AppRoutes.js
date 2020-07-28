import React from 'react';
import { Router } from '@reach/router';

import { Main, Minimal } from './layouts';
import AuthRoute from './components/AuthRoute/AuthRoute';
import Home from './screens/Home/Home';
import Signup from './screens/Authentication/SignupForm';
import Login from './screens/Authentication/LoginForm';
import NotFound from './screens/NotFound/NotFound';
import PasswordForgot from './screens/PasswordRecovery/PasswordForgot';
import PasswordReset from './screens/PasswordRecovery/PasswordReset';
import DashBoard from './screens/Dashboard/Dashboard';
import Account from './screens/Account/Account';
import Users from './screens/Users/Users';

function AppRoutes() {
  return (
    <Router>
      {/* prettier-ignore */}
      <AuthRoute
        path='/'
        access='public'
        allowed={['admin', 'user']}
        component={Home}
        layout={Minimal}
      />
      {/* prettier-ignore */}
      <AuthRoute
        path='/login'
        access='public'
        allowed={['admin', 'user']}
        component={Login}
        layout={Minimal}
      />
      {/* prettier-ignore */}
      <AuthRoute
        path='/signup'
        access='public'
        allowed={['admin', 'user']}
        component={Signup}
        layout={Minimal}
      />
      {/* prettier-ignore */}
      <AuthRoute
        path="/password/forgot"
        access="guest"
        allowed={['admin', 'user']}
        component={PasswordForgot}
        layout={Minimal}
      />
      {/* prettier-ignore */}
      <AuthRoute
        path="/password/reset"
        access="guest"
        allowed={['admin', 'user']}
        component={PasswordReset}
        layout={Minimal}
      />
      {/* prettier-ignore */}
      <AuthRoute
        path="/dashboard"
        access="private"
        allowed={['admin', 'user']}
        component={DashBoard}
        layout={Main}
      />
      {/* prettier-ignore */}
      <AuthRoute
        path="/account"
        access="private"
        allowed={['admin', 'user']}
        component={Account}
        layout={Main}
      />
      {/* prettier-ignore */}
      <AuthRoute 
        path="/users" 
        access="private" 
        allowed={['admin']} 
        component={Users} 
        layout={Main} 
      />

      <NotFound default />
    </Router>
  );
}

export default AppRoutes;
