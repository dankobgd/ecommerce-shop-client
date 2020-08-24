import React from 'react';

import { Router } from '@reach/router';

import AuthRoute from '../../components/AuthRoute/AuthRoute';
import NotFound from '../NotFound/NotFound';
import Categories from './Categories';
import CreateCategory from './CreateCategory/CreateCategory';
import EditCategory from './EditCategory/EditCategory';

function ProductRoutes() {
  return (
    <Router>
      <AuthRoute path='/' access='private' allowed={['admin']} component={Categories} layout={null} />
      <AuthRoute path='create' access='private' allowed={['admin']} component={CreateCategory} layout={null} />
      <AuthRoute path='edit' access='private' allowed={['admin']} component={EditCategory} layout={null} />
      <NotFound default backLink={-1} />
    </Router>
  );
}

export default ProductRoutes;
