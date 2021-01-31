import React from 'react';

import { Router } from '@reach/router';

import AuthRoute from '../../components/AuthRoute/AuthRoute';
import PreviewAddress from '../Account/AccountAddress/PreviewAddress/PreviewAddress';
import NotFound from '../NotFound/NotFound';
import CreateUser from './CreateUser/CreateUser';
import EditUser from './EditUser/EditUser';
import PreviewUser from './PreviewUser/PreviewUser';
import Users from './Users';

function UserRoutes() {
  return (
    <Router>
      <AuthRoute path='/' access='private' allowed={['admin']} component={Users} layout={null} />
      <AuthRoute path='create' access='private' allowed={['admin']} component={CreateUser} layout={null} />
      <AuthRoute
        path=':userId/:username/edit'
        access='private'
        allowed={['admin']}
        component={EditUser}
        layout={null}
      />
      <AuthRoute
        path=':userId/:username/preview'
        access='private'
        allowed={['admin']}
        component={PreviewUser}
        layout={null}
      />
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
