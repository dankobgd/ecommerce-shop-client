import React, { lazy, Suspense } from 'react';

import { Router } from '@reach/router';

const AuthRoute = lazy(() => import('../../components/AuthRoute/AuthRoute'));
const NotFound = lazy(() => import('../NotFound/NotFound'));
const Categories = lazy(() => import('./Categories'));
const CreateCategory = lazy(() => import('./CreateCategory/CreateCategory'));
const EditCategory = lazy(() => import('./EditCategory/EditCategory'));
const PreviewCategory = lazy(() => import('./PreviewCategory/PreviewCategory'));

function CategoryRoutes() {
  return (
    <Suspense fallback={<span>Loading...</span>}>
      <Router>
        <AuthRoute path='/' access='private' allowed={['admin']} component={Categories} layout={null} />
        <AuthRoute path='create' access='private' allowed={['admin']} component={CreateCategory} layout={null} />
        <AuthRoute
          path=':categoryId/:categoryName/edit'
          access='private'
          allowed={['admin']}
          component={EditCategory}
          layout={null}
        />
        <AuthRoute
          path=':categoryId/:categoryName/preview'
          access='private'
          allowed={['admin']}
          component={PreviewCategory}
          layout={null}
        />
        <NotFound default backLink={-1} />
      </Router>
    </Suspense>
  );
}

export default CategoryRoutes;
