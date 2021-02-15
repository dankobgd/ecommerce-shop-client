import React, { lazy, Suspense } from 'react';

import { Router } from '@reach/router';

const AuthRoute = lazy(() => import('../../components/AuthRoute/AuthRoute'));
const NotFound = lazy(() => import('../NotFound/NotFound'));
const Brands = lazy(() => import('./Brands'));
const CreateProduct = lazy(() => import('./CreateBrand/CreateBrand'));
const EditBrand = lazy(() => import('./EditBrand/EditBrand'));
const PreviewBrand = lazy(() => import('./PreviewBrand/PreviewBrand'));

function BrandROutes() {
  return (
    <Suspense fallback={<span>Loading...</span>}>
      <Router>
        <AuthRoute path='/' access='private' allowed={['admin']} component={Brands} layout={null} />
        <AuthRoute path='create' access='private' allowed={['admin']} component={CreateProduct} layout={null} />
        <AuthRoute
          path=':brandId/:brandName/edit'
          access='private'
          allowed={['admin']}
          component={EditBrand}
          layout={null}
        />
        <AuthRoute
          path=':brandId/:brandName/preview'
          access='private'
          allowed={['admin']}
          component={PreviewBrand}
          layout={null}
        />
        <NotFound default backLink={-1} />
      </Router>
    </Suspense>
  );
}

export default BrandROutes;
