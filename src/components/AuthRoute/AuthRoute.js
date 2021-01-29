import React from 'react';

import { Redirect } from '@reach/router';

import { useMe } from '../../hooks/queries/userQueries';
import { useIsAuthenticated } from '../../hooks/useIsAuthenticated';

const Loading = () => <div>Loading...</div>;

function AuthRoute(props) {
  const {
    layout: Layout,
    component: Component,
    allowed = ['admin', 'user'],
    access = 'public',
    roleRedirectUrl = '/dashboard',
    redirectUrl = '/login',
    location,
    ...rest
  } = props;

  const { data: user, isLoading } = useMe();
  const isAuthenticated = useIsAuthenticated();

  const renderPrivateRoute = () => {
    if (access === 'private') {
      if (isLoading) return <Loading />;

      if (isAuthenticated) {
        if (user && !allowed.includes(user.role)) {
          return <Redirect to={roleRedirectUrl} noThrow />;
        }

        if (Layout) {
          return (
            <Layout>
              <Component {...rest} location={location} />
            </Layout>
          );
        }
        return <Component {...rest} location={location} />;
      }
      return <Redirect to={redirectUrl} noThrow />;
    }
  };

  const renderGuestRoute = () => {
    if (access === 'guest') {
      if (isLoading) return <Loading />;

      if (isAuthenticated) {
        return <Redirect to={redirectUrl} noThrow />;
      }

      if (Layout) {
        return (
          <Layout>
            <Component {...rest} location={location} />
          </Layout>
        );
      }
      return <Component {...rest} location={location} />;
    }
  };

  const renderPublicRoute = () => {
    if (access === 'public') {
      if (isLoading) return <Loading />;

      if (Layout) {
        return (
          <Layout>
            <Component {...rest} location={location} />
          </Layout>
        );
      }
      return <Component {...rest} location={location} />;
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
