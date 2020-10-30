import React from 'react';

import { Router } from '@reach/router';

import AuthRoute from './components/AuthRoute/AuthRoute';
import { Main, Minimal } from './layouts';
import Account from './screens/Account/Account';
import Login from './screens/Authentication/LoginForm';
import Signup from './screens/Authentication/SignupForm';
import BrandRoutes from './screens/Brands/BrandRoutes';
import CategoryRoutes from './screens/Categories/CategoryRoutes';
import Checkout from './screens/Checkout/Checkout';
import DashBoard from './screens/Dashboard/Dashboard';
import Home from './screens/Home/Home';
import NotFound from './screens/NotFound/NotFound';
import Order from './screens/Orders/Order';
import OrderRoutes from './screens/Orders/OrderRoutes';
import PasswordForgot from './screens/PasswordRecovery/PasswordForgot';
import PasswordReset from './screens/PasswordRecovery/PasswordReset';
import ProductRoutes from './screens/Products/ProductRoutes';
import ProductSingle from './screens/Products/ProductSingle';
import PromotionRoutes from './screens/Promotions/PromotionRoutes';
import ReviewRoutes from './screens/Reviews/ReviewRoutes';
import Shop from './screens/Shop/Shop';
import TagRoutes from './screens/Tags/TagRoutes';
import UserRoutes from './screens/Users/UserRoutes';
import Wishlist from './screens/Wishlist/Wishlist';

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
      <AuthRoute path='/shop' access='public' component={Shop} layout={Minimal} />
      <AuthRoute path='/checkout' access='private' component={Checkout} layout={Minimal} />
      <AuthRoute path='/checkout/order' access='private' component={Order} layout={Minimal} />
      <AuthRoute path='/product/:productId/:productSlug' access='public' component={ProductSingle} layout={Minimal} />
      <AuthRoute path='/wishlist' access='private' component={Wishlist} layout={Main} />
      <AuthRoute path='/users/*' access='private' allowed={['admin']} component={UserRoutes} layout={Main} />
      <AuthRoute path='/products/*' access='private' allowed={['admin']} component={ProductRoutes} layout={Main} />
      <AuthRoute path='/reviews/*' access='private' allowed={['admin']} component={ReviewRoutes} layout={Main} />
      <AuthRoute path='/promotions/*' access='private' allowed={['admin']} component={PromotionRoutes} layout={Main} />
      <AuthRoute path='/orders/*' access='private' component={OrderRoutes} layout={Main} />
      <AuthRoute path='/categories/*' access='private' allowed={['admin']} component={CategoryRoutes} layout={Main} />
      <AuthRoute path='/brands/*' access='private' allowed={['admin']} component={BrandRoutes} layout={Main} />
      <AuthRoute path='/tags/*' access='private' allowed={['admin']} component={TagRoutes} layout={Main} />
      <NotFound default />
    </Router>
  );
}

export default AppRoutes;
