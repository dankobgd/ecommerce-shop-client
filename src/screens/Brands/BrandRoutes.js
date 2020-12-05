import React from 'react';

import { Router } from '@reach/router';

import AuthRoute from '../../components/AuthRoute/AuthRoute';
import NotFound from '../NotFound/NotFound';
import Brands from './Brands';
import CreateProduct from './CreateBrand/CreateBrand';
import EditBrand from './EditBrand/EditBrand';
import PreviewBrand from './PreviewBrand/PreviewBrand';

function BrandROutes() {
  return (
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
  );
}

export default BrandROutes;
