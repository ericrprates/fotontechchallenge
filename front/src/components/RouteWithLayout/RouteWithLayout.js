import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

function querystring(name, url = window.location.href) {
  name = name.replace(/[[]]/g, '\\$&');

  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)', 'i');
  const results = regex.exec(url);

  if (!results) {
    return null;
  }
  if (!results[2]) {
    return '';
  }

  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

const RouteWithLayout = props => {
  const { layout: Layout, component: Component, ...rest } = props;
  const redirect = querystring('redirect');
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  return (
    <Route
      {...rest}
      render={matchProps =>
        !isAuthenticated ? (
          <Layout>
            <Component {...matchProps} />
          </Layout>
        ) : (
          <Redirect
            to={redirect === '' || redirect === null ? '/' : redirect}
          />
        )
      }
    />
  );
};

RouteWithLayout.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string
};

export default RouteWithLayout;
