import React, { lazy, Suspense } from 'react';

import { Router } from '@reach/router';

import AuthRoute from './components/AuthRoute/AuthRoute';
import { Main, Minimal } from './layouts';
import BrandRoutes from './screens/Brands/BrandRoutes';
import CategoryRoutes from './screens/Categories/CategoryRoutes';
import NotFound from './screens/NotFound/NotFound';
import OrderRoutes from './screens/Orders/OrderRoutes';
import ProductRoutes from './screens/Products/ProductRoutes';
import PromotionRoutes from './screens/Promotions/PromotionRoutes';
import TagRoutes from './screens/Tags/TagRoutes';
import UserRoutes from './screens/Users/UserRoutes';

const DashBoard = lazy(() => import('./screens/Dashboard/Dashboard'));
const Home = lazy(() => import('./screens/Home/Home'));
const Shop = lazy(() => import('./screens/Shop/Shop'));
const Login = lazy(() => import('./screens/Authentication/LoginForm'));
const Signup = lazy(() => import('./screens/Authentication/SignupForm'));
const PasswordForgot = lazy(() => import('./screens/PasswordRecovery/PasswordForgot'));
const PasswordReset = lazy(() => import('./screens/PasswordRecovery/PasswordReset'));
const Account = lazy(() => import('./screens/Account/Account'));
const Checkout = lazy(() => import('./screens/Checkout/Checkout'));
const Order = lazy(() => import('./screens/Orders/Order'));
const ProductSingle = lazy(() => import('./screens/Products/ProductSingle'));
const Wishlist = lazy(() => import('./screens/Wishlist/Wishlist'));

function AppRoutes() {
  return (
    <Suspense fallback={<span>Loading...</span>}>
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
        <AuthRoute
          path='/promotions/*'
          access='private'
          allowed={['admin']}
          component={PromotionRoutes}
          layout={Main}
        />
        <AuthRoute path='/orders/*' access='private' component={OrderRoutes} layout={Main} />
        <AuthRoute path='/categories/*' access='private' allowed={['admin']} component={CategoryRoutes} layout={Main} />
        <AuthRoute path='/brands/*' access='private' allowed={['admin']} component={BrandRoutes} layout={Main} />
        <AuthRoute path='/tags/*' access='private' allowed={['admin']} component={TagRoutes} layout={Main} />
        <NotFound default />
      </Router>
    </Suspense>
  );
}

export default AppRoutes;
