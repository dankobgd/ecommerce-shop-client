import React from 'react';

import { Router } from '@reach/router';

import AuthRoute from '../../components/AuthRoute/AuthRoute';
import PreviewAddress from '../Account/AccountAddress/PreviewAddress/PreviewAddress';
import NotFound from '../NotFound/NotFound';
import Users from './Users';

function UserRoutes() {
  return (
    <Router>
      <AuthRoute path='/' access='private' allowed={['admin']} component={Users} layout={null} />
      <AuthRoute
        path='/addresses/:addressId/preview'
        access='private'
        allowed={['user,', 'admin']}
        component={PreviewAddress}
        layout={null}
      />
      <NotFound default backLink={-1} />
    </Router>
  );
}

export default UserRoutes;
