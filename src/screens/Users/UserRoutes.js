import React, { lazy, Suspense } from 'react';

import { Router } from '@reach/router';

const AuthRoute = lazy(() => import('../../components/AuthRoute/AuthRoute'));
const PreviewAddress = lazy(() => import('../Account/AccountAddress/PreviewAddress/PreviewAddress'));
const NotFound = lazy(() => import('../NotFound/NotFound'));
const CreateUser = lazy(() => import('./CreateUser/CreateUser'));
const EditUser = lazy(() => import('./EditUser/EditUser'));
const PreviewUser = lazy(() => import('./PreviewUser/PreviewUser'));
const Users = lazy(() => import('./Users'));

function UserRoutes() {
  return (
    <Suspense fallback={<span>Loading...</span>}>
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
    </Suspense>
  );
}

export default UserRoutes;
