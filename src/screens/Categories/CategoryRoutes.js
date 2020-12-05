import React from 'react';

import { Router } from '@reach/router';

import AuthRoute from '../../components/AuthRoute/AuthRoute';
import NotFound from '../NotFound/NotFound';
import Categories from './Categories';
import CreateCategory from './CreateCategory/CreateCategory';
import EditCategory from './EditCategory/EditCategory';
import PreviewCategory from './PreviewCategory/PreviewCategory';

function CategoryRoutes() {
  return (
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
  );
}

export default CategoryRoutes;
