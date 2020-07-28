import React from 'react';
import { Redirect } from '@reach/router';
import { useSelector } from 'react-redux';

import { selectUserProfile, selectIsUserAuthenticated, selectIsUserLoading } from '../../store/user/userSlice';

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
  const isAuthenticated = useSelector(selectIsUserAuthenticated);
  const loading = useSelector(selectIsUserLoading);

  if (access === 'private') {
    return (
      <>
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
