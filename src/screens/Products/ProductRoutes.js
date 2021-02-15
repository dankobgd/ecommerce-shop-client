import React, { lazy, Suspense } from 'react';

import { Router } from '@reach/router';

const AuthRoute = lazy(() => import('../../components/AuthRoute/AuthRoute'));
const NotFound = lazy(() => import('../NotFound/NotFound'));
const CreateProduct = lazy(() => import('./CreateProduct/CreateProduct'));
const EditProduct = lazy(() => import('./EditProduct/EditProduct'));
const PreviewProduct = lazy(() => import('./PreviewProduct/PreviewProduct'));
const CreateProductImages = lazy(() => import('./PreviewProduct/ProductImages/CreateProductImages'));
const CreateProductReview = lazy(() => import('./PreviewProduct/ProductReviews/CreateProductReview'));
const EditProductReview = lazy(() => import('./PreviewProduct/ProductReviews/EditProductReview'));
const PreviewProductReview = lazy(() => import('./PreviewProduct/ProductReviews/PreviewProductReview'));
const CreateProductTag = lazy(() => import('./PreviewProduct/ProductTags/CreateProductTag'));
const EditProductTags = lazy(() => import('./PreviewProduct/ProductTags/EditProductTags'));
const Products = lazy(() => import('./Products'));

function ProductRoutes() {
  return (
    <Suspense fallback={<span>Loading...</span>}>
      <Router>
        <AuthRoute path='/' access='private' allowed={['admin']} component={Products} layout={null} />
        <AuthRoute path='create' access='private' allowed={['admin']} component={CreateProduct} layout={null} />
        <AuthRoute
          path='/:productId/:productSlug/edit'
          access='private'
          allowed={['admin']}
          component={EditProduct}
          layout={null}
        />
        <AuthRoute
          path='/:productId/:productSlug/preview'
          access='private'
          allowed={['admin']}
          component={PreviewProduct}
          layout={null}
        />
        <AuthRoute
          path='/:productId/:productSlug/tags/create'
          access='private'
          allowed={['admin']}
          component={CreateProductTag}
          layout={null}
        />
        <AuthRoute
          path='/:productId/:productSlug/tags/edit'
          access='private'
          allowed={['admin']}
          component={EditProductTags}
          layout={null}
        />
        <AuthRoute
          path='/:productId/:productSlug/images/create'
          access='private'
          allowed={['admin']}
          component={CreateProductImages}
          layout={null}
        />
        <AuthRoute
          path='/:productId/:productSlug/reviews/create'
          access='private'
          allowed={['admin']}
          component={CreateProductReview}
          layout={null}
        />
        <AuthRoute
          path='/:productId/:productSlug/reviews/:reviewId/edit'
          access='private'
          allowed={['admin']}
          component={EditProductReview}
          layout={null}
        />
        <AuthRoute
          path='/:productId/:productSlug/reviews/:reviewId/preview'
          access='private'
          allowed={['admin']}
          component={PreviewProductReview}
          layout={null}
        />
        <NotFound default backLink={-1} />
      </Router>
    </Suspense>
  );
}

export default ProductRoutes;
