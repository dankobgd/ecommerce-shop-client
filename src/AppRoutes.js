import React from 'react';

import { Router } from '@reach/router';

import AuthRoute from './components/AuthRoute/AuthRoute';
import { Main, Minimal } from './layouts';
import Account from './screens/Account/Account';
import Login from './screens/Authentication/LoginForm';
import Signup from './screens/Authentication/SignupForm';
import BrandRoutes from './screens/Brands/BrandRoutes';
import CategoryRoutes from './screens/Categories/CategoryRoutes';
import DashBoard from './screens/Dashboard/Dashboard';
import Home from './screens/Home/Home';
import NotFound from './screens/NotFound/NotFound';
import PasswordForgot from './screens/PasswordRecovery/PasswordForgot';
import PasswordReset from './screens/PasswordRecovery/PasswordReset';
import ProductRoutes from './screens/Products/ProductRoutes';
import UserRoutes from './screens/Users/UserRoutes';

function AppRoutes() {
  return (
    <Router>
      <AuthRoute path='/' access='public' component={Home} layout={Minimal} />
      <AuthRoute path='/login' access='public' component={Login} layout={Minimal} />
      <AuthRoute path='/signup' access='public' component={Signup} layout={Minimal} />
      <AuthRoute path='/password/forgot' access='guest' component={PasswordForgot} layout={Minimal} />
      <AuthRoute path='/password/reset' access='guest' component={PasswordReset} layout={Minimal} />
      <AuthRoute path='/dashboard' access='private' component={DashBoard} layout={Main} />
      <AuthRoute path='/account' access='private' component={Account} layout={Main} />
      <AuthRoute path='/products/*' access='private' allowed={['admin']} component={ProductRoutes} layout={Main} />
      <AuthRoute path='/users/*' access='private' allowed={['admin']} component={UserRoutes} layout={Main} />
      <AuthRoute path='/categories/*' access='private' allowed={['admin']} component={CategoryRoutes} layout={Main} />
      <AuthRoute path='/brands/*' access='private' allowed={['admin']} component={BrandRoutes} layout={Main} />
      <NotFound default />
    </Router>
  );
}

export default AppRoutes;
