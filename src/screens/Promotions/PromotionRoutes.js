import React from 'react';

import { Router } from '@reach/router';

import AuthRoute from '../../components/AuthRoute/AuthRoute';
import NotFound from '../NotFound/NotFound';
import CreatePromotion from './CreatePromotion/CreatePromotion';
import EditPromotion from './EditPromotion/EditPromotion';
import Promotions from './Promotions';

function TagRoutes() {
  return (
    <Router>
      <AuthRoute path='/' access='private' allowed={['admin']} component={Promotions} layout={null} />
      <AuthRoute path='create' access='private' allowed={['admin']} component={CreatePromotion} layout={null} />
      <AuthRoute path=':promoCode/edit' access='private' allowed={['admin']} component={EditPromotion} layout={null} />
      <NotFound default backLink={-1} />
    </Router>
  );
}

export default TagRoutes;
