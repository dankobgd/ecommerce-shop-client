import React from 'react';

import { Router } from '@reach/router';

import AuthRoute from '../../components/AuthRoute/AuthRoute';
import NotFound from '../NotFound/NotFound';
import CreateTag from './CreateTag/CreateTag';
import EditTag from './EditTag/EditTag';
import PreviewTag from './PreviewTag/PreviewTag';
import Tags from './Tags';

function TagRoutes() {
  return (
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
  );
}

export default TagRoutes;
