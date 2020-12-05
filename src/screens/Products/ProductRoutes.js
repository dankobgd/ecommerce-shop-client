import React from 'react';

import { Router } from '@reach/router';

import AuthRoute from '../../components/AuthRoute/AuthRoute';
import NotFound from '../NotFound/NotFound';
import CreateProduct from './CreateProduct/CreateProduct';
import EditProduct from './EditProduct/EditProduct';
import PreviewProduct from './PreviewProduct/PreviewProduct';
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
      <NotFound default backLink={-1} />
    </Router>
  );
}

export default ProductRoutes;
