import React from 'react';

import { Router } from '@reach/router';

import AuthRoute from '../../components/AuthRoute/AuthRoute';
import NotFound from '../NotFound/NotFound';
import CreateReview from './CreateReview/CreateReview';
import EditReview from './EditReview/EditReview';
import PreviewReview from './PreviewReview/PreviewReview';
import Reviews from './Reviews';

function ReviewRoutes() {
  return (
    <Router>
      <AuthRoute path='/' access='private' allowed={['admin']} component={Reviews} layout={null} />
      <AuthRoute path='create' access='private' allowed={['admin']} component={CreateReview} layout={null} />
      <AuthRoute path=':reviewId/edit' access='private' allowed={['admin']} component={EditReview} layout={null} />
      <AuthRoute
        path=':reviewId/preview'
        access='private'
        allowed={['admin']}
        component={PreviewReview}
        layout={null}
      />
      <NotFound default backLink={-1} />
    </Router>
  );
}

export default ReviewRoutes;
