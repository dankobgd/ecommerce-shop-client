import React from 'react';

import { AppBar, Toolbar, Badge, Hidden, IconButton } from '@material-ui/core';
import InputIcon from '@material-ui/icons/Input';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import { makeStyles } from '@material-ui/styles';
import { Link } from '@reach/router';
import clsx from 'clsx';

import { useLogout } from '../../../hooks/queries/userQueries';

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none',
  },
  flexGrow: {
    flexGrow: 1,
  },
  signOutButton: {
    marginLeft: theme.spacing(1),
  },
}));

function Topbar({ className, onSidebarOpen, ...rest }) {
  const classes = useStyles();
  const [notifications] = React.useState([]);
  const logoutMutation = useLogout();

  return (
    <AppBar {...rest} className={clsx(classes.root, className)}>
      <Toolbar>
        <Link to='/'>
          <img alt='Logo' src='https://via.placeholder.com/50' />
        </Link>
        <div className={classes.flexGrow} />
        <Hidden mdDown>
          <IconButton color='inherit'>
            <Badge badgeContent={notifications.length} color='primary' variant='dot'>
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            className={classes.signOutButton}
            color='inherit'
            onClick={() => {
              logoutMutation.mutate();
            }}
          >
            <InputIcon />
          </IconButton>
        </Hidden>
        <Hidden lgUp>
          <IconButton color='inherit' onClick={onSidebarOpen}>
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
}

export default Topbar;
