import React, { lazy, Suspense } from 'react';

import { Router } from '@reach/router';

const AuthRoute = lazy(() => import('../../components/AuthRoute/AuthRoute'));
const NotFound = lazy(() => import('../NotFound/NotFound'));
const CreateTag = lazy(() => import('./CreateTag/CreateTag'));
const EditTag = lazy(() => import('./EditTag/EditTag'));
const PreviewTag = lazy(() => import('./PreviewTag/PreviewTag'));
const Tags = lazy(() => import('./Tags'));

function TagRoutes() {
  return (
    <Suspense fallback={<span>Loading...</span>}>
      <Router>
        <AuthRoute path='/' access='private' allowed={['admin']} component={Tags} layout={null} />
        <AuthRoute path='create' access='private' allowed={['admin']} component={CreateTag} layout={null} />
        <AuthRoute path=':tagId/:tagName/edit' access='private' allowed={['admin']} component={EditTag} layout={null} />
        <AuthRoute
          path=':tagId/:tagName/preview'
          access='private'
          allowed={['admin']}
          component={PreviewTag}
          layout={null}
        />
        <NotFound default backLink={-1} />
      </Router>
    </Suspense>
  );
}

export default TagRoutes;
