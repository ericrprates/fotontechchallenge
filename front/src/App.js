import React from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { ThemeProvider } from '@material-ui/styles';
import validate from 'validate.js';

import theme from './theme';
import 'react-perfect-scrollbar/dist/css/styles.css';
import './assets/scss/index.scss';
import validators from './common/validators';
import Routes from './Routes';
import store from './store';
import { Provider } from 'react-redux';

const browserHistory = createBrowserHistory();

validate.validators = {
  ...validate.validators,
  ...validators
};

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Router history={browserHistory}>
          <Routes />
        </Router>
      </ThemeProvider>
    </Provider>
  );
}
