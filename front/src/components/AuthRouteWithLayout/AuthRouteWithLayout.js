import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const AuthRouteWithLayout = ({
  layout: Layout,
  component: Component,
  location,
  ...rest
}) => {
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  return (
    <Route
      {...rest}
      render={matchProps =>
        isAuthenticated ? (
          <Layout>
            <Component {...matchProps} />
          </Layout>
        ) : (
          <Redirect
            to={`/sign-in?redirect=${location.pathname}${location.search}`}
          />
        )
      }
    />
  );
};

AuthRouteWithLayout.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string
};

export default AuthRouteWithLayout;
