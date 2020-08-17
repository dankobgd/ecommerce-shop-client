import React, { useState } from 'react';

import { AppBar, Toolbar, Badge, Hidden, IconButton } from '@material-ui/core';
import InputIcon from '@material-ui/icons/Input';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import { makeStyles } from '@material-ui/styles';
import { Link } from '@reach/router';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';

import { userLogout } from '../../../store/user/userSlice';

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

function Topbar(props) {
  const { className, onSidebarOpen, ...rest } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [notifications] = useState([]);

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
          <IconButton className={classes.signOutButton} color='inherit' onClick={() => dispatch(userLogout())}>
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
