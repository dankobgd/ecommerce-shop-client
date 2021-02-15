import React, { lazy, Suspense } from 'react';

import { Router } from '@reach/router';

const AuthRoute = lazy(() => import('../../components/AuthRoute/AuthRoute'));
const NotFound = lazy(() => import('../NotFound/NotFound'));
const CreatePromotion = lazy(() => import('./CreatePromotion/CreatePromotion'));
const EditPromotion = lazy(() => import('./EditPromotion/EditPromotion'));
const PreviewPromotion = lazy(() => import('./PreviewPromotion/PreviewPromotion'));
const Promotions = lazy(() => import('./Promotions'));

function TagRoutes() {
  return (
    <Suspense fallback={<span>Loading...</span>}>
      <Router>
        <AuthRoute path='/' access='private' allowed={['admin']} component={Promotions} layout={null} />
        <AuthRoute path='create' access='private' allowed={['admin']} component={CreatePromotion} layout={null} />
        <AuthRoute
          path=':promoCode/edit'
          access='private'
          allowed={['admin']}
          component={EditPromotion}
          layout={null}
        />
        <AuthRoute
          path=':promoCode/preview'
          access='private'
          allowed={['admin']}
          component={PreviewPromotion}
          layout={null}
        />
        <NotFound default backLink={-1} />
      </Router>
    </Suspense>
  );
}

export default TagRoutes;
