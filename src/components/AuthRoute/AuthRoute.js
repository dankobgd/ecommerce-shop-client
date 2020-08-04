import React from 'react';
import { Redirect } from '@reach/router';
import { useSelector } from 'react-redux';

import { selectUserProfile, getCurrentUser } from '../../store/user/userSlice';
import { selectUIState } from '../../store/ui/ui';

function AuthRoute(props) {
  const {
    layout: Layout,
    component: Component,
    allowed = ['admin', 'user'],
    access = 'public',
    roleRedirectUrl = '/dashboard',
    redirectUrl = '/login',
    ...rest
  } = props;

  const user = useSelector(selectUserProfile);
  const isAuthenticated = JSON.parse(localStorage.getItem('ecommerce/logged_in'));
  const { loading } = useSelector(selectUIState(getCurrentUser));

  if (access === 'private') {
    return (
      <>
        {loading && <div>Loading...</div>}

        {!loading && isAuthenticated && (
          <Layout>
            <Component {...rest} />
          </Layout>
        )}

        {!loading && !isAuthenticated && <Redirect to={redirectUrl} noThrow />}

        {allowed && user && !allowed.includes(user.role) && <Redirect to={roleRedirectUrl} noThrow />}
      </>
    );
  }

  if (access === 'guest') {
    return (
      <>
        {loading && <div>Loading...</div>}

        {!loading && !isAuthenticated && (
          <Layout>
            <Component {...rest} />
          </Layout>
        )}

        {!loading && isAuthenticated && <Redirect to={redirectUrl} noThrow />}
      </>
    );
  }

  if (access === 'public') {
    return (
      <Layout>
        <Component {...rest} />
      </Layout>
    );
  }
}

export default AuthRoute;
