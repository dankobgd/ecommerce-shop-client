import React from 'react';

import { Router } from '@reach/router';

import AuthRoute from '../../components/AuthRoute/AuthRoute';
import NotFound from '../NotFound/NotFound';
import Users from './Users';

function UserRoutes() {
  return (
    <Router>
      <AuthRoute path='/' access='private' allowed={['admin']} component={Users} layout={null} />
      <NotFound default backLink={-1} />
    </Router>
  );
}

export default UserRoutes;
