import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  AppBar,
  Toolbar,
  Hidden,
  IconButton,
  Typography
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import InputIcon from '@material-ui/icons/Input';
import { useDispatch } from 'react-redux';
import reducers from '../../../../constants/reducers';

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none'
  },
  flexGrow: {
    flexGrow: 1
  },
  signOutButton: {
    marginLeft: theme.spacing(1)
  },
  appName: {
    color: 'whitesmoke'
  }
}));

const Topbar = props => {
  const { className, onSidebarOpen, ...rest } = props;
  const dispatch = useDispatch();
  const classes = useStyles();

  async function handleSignOut() {
    dispatch({
      type: reducers.user.signOut
    });
  }

  return (
    <AppBar {...rest} className={clsx(classes.root, className)}>
      <Toolbar>
        <RouterLink to="/">
          <Typography className={classes.appName} variant="h3">
            {process.env.REACT_APP_APP_NAME}
          </Typography>
        </RouterLink>
        <div className={classes.flexGrow} />
        <Hidden mdDown>
          <IconButton
            className={classes.signOutButton}
            color="inherit"
            onClick={handleSignOut}>
            <InputIcon />
          </IconButton>
        </Hidden>
        <Hidden lgUp>
          <IconButton color="inherit" onClick={onSidebarOpen}>
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func
};

export default Topbar;
