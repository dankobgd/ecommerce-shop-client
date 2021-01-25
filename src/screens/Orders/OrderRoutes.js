import React from 'react';

import { Router } from '@reach/router';

import AuthRoute from '../../components/AuthRoute/AuthRoute';
import NotFound from '../NotFound/NotFound';
import Orders from './Orders';
import PreviewOrder from './PreviewOrder/PreviewOrder';

function TagRoutes() {
  return (
    <Router>
      <AuthRoute path='/' access='private' allowed={['admin']} component={Orders} layout={null} />
      <AuthRoute
        path=':orderId/preview'
        access='private'
        allowed={['admin', 'user']}
        component={PreviewOrder}
        layout={null}
      />
      <NotFound default backLink={-1} />
    </Router>
  );
}

export default TagRoutes;
