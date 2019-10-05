import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import { AuthRouteWithLayout, RouteWithLayout } from './components';
import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';

import {
  ProductList as ProductListView,
  ProductForm,
  SignUp as SignUpView,
  SignIn as SignInView,
  NotFound as NotFoundView
} from './views';

const Routes = ({ childProps }) => {
  return (
    <Switch>
      <Redirect exact from="/" to="/products" />
      <AuthRouteWithLayout
        component={ProductListView}
        exact
        layout={MainLayout}
        path="/products"
      />

      <AuthRouteWithLayout
        component={ProductForm}
        exact
        layout={MainLayout}
        path="/products/create"
      />
      <AuthRouteWithLayout
        component={ProductForm}
        exact
        layout={MainLayout}
        path="/products/:id"
      />
      <RouteWithLayout
        component={SignUpView}
        exact
        layout={MinimalLayout}
        path="/sign-up"
      />
      <RouteWithLayout
        component={SignInView}
        exact
        layout={MinimalLayout}
        path="/sign-in"
      />
      <RouteWithLayout
        component={NotFoundView}
        exact
        layout={MinimalLayout}
        path="/not-found"
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;
