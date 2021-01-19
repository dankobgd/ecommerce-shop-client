import React from 'react';

import { Router } from '@reach/router';

import AuthRoute from '../../components/AuthRoute/AuthRoute';
import NotFound from '../NotFound/NotFound';
import CreateProduct from './CreateProduct/CreateProduct';
import EditProduct from './EditProduct/EditProduct';
import PreviewProduct from './PreviewProduct/PreviewProduct';
import CreateProductImages from './PreviewProduct/ProductImages/CreateProductImages';
import CreateProductReview from './PreviewProduct/ProductReviews/CreateProductReview';
import EditProductReview from './PreviewProduct/ProductReviews/EditProductReview';
import PreviewProductReview from './PreviewProduct/ProductReviews/PreviewProductReview';
import CreateProductTag from './PreviewProduct/ProductTags/CreateProductTag';
import EditProductTags from './PreviewProduct/ProductTags/EditProductTags';
import Products from './Products';

function ProductRoutes() {
  return (
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
  );
}

export default ProductRoutes;
