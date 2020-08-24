import React from 'react';

import { Redirect } from '@reach/router';
import { useSelector } from 'react-redux';

import { selectUIState } from '../../store/ui';
import { selectUserProfile, getCurrentUser, selectIsUserAuthenticated } from '../../store/user/userSlice';

const Loading = () => <div>Loading...</div>;

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
  const { loading } = useSelector(selectUIState(getCurrentUser));

  const renderPrivateRoute = () => {
    if (access === 'private') {
      if (loading) return <Loading />;

      if (isAuthenticated) {
        if (user && !allowed.includes(user.role)) {
          return <Redirect to={roleRedirectUrl} noThrow />;
        }
        if (Layout) {
          return (
            <Layout>
              <Component {...rest} />
            </Layout>
          );
        }
        return <Component {...rest} />;
      }
      return <Redirect to={redirectUrl} noThrow />;
    }
  };

  const renderGuestRoute = () => {
    if (access === 'guest') {
      if (loading) return <Loading />;

      if (isAuthenticated) {
        return <Redirect to={redirectUrl} noThrow />;
      }

      if (Layout) {
        return (
          <Layout>
            <Component {...rest} />
          </Layout>
        );
      }
      return <Component {...rest} />;
    }
  };

  const renderPublicRoute = () => {
    if (access === 'public') {
      if (loading) return <Loading />;

      if (Layout) {
        return (
          <Layout>
            <Component {...rest} />
          </Layout>
        );
      }
      return <Component {...rest} />;
    }
  };

  return (
    <>
      {renderPrivateRoute()}
      {renderGuestRoute()}
      {renderPublicRoute()}
    </>
  );
}

export default AuthRoute;
