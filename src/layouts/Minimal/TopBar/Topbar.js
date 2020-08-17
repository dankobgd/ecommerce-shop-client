import React from 'react';

import { AppBar, Toolbar, IconButton, MenuItem, Menu, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from '@reach/router';
import { useSelector, useDispatch } from 'react-redux';

import AvatarFallback from '../../../components/AvatarFallback/AvatarFallback';
import { selectIsUserAuthenticated, userLogout, selectUserProfile } from '../../../store/user/userSlice';

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none',
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  loginBtn: {
    color: theme.palette.white,
    border: `1px solid ${theme.palette.white}`,
  },
  signupBtn: {
    marginLeft: theme.spacing(1),
    backgroundColor: theme.palette.white,
    color: theme.palette.black,
  },
  linkAuthBtn: {
    textDecoration: 'none',
  },
}));

export default function MenuAppBar() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const user = useSelector(selectUserProfile);
  const isAuthenticated = useSelector(selectIsUserAuthenticated);

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    dispatch(userLogout());
  };

  const avatarName = user ? `${user.firstName} ${user.lastName}` : '';

  return (
    <div className={classes.root}>
      <AppBar className={classes.root} color='primary' position='fixed'>
        <Toolbar>
          <div className={classes.title}>
            <Link to='/'>
              <img alt='Logo' src='https://via.placeholder.com/50' />
            </Link>
          </div>
          {isAuthenticated ? (
            <div>
              <IconButton
                aria-label='account of current user'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={handleMenu}
                color='inherit'
              >
                <AvatarFallback name={avatarName} url={user?.avatarUrl} size={40} />
              </IconButton>
              <Menu
                id='menu-appbar'
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <Link to='/dashboard' style={{ textDecoration: 'none' }}>
                  <MenuItem onClick={handleClose}>Dashboard</MenuItem>
                </Link>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          ) : (
            <div>
              <Link to='/login' className={classes.linkAuthBtn}>
                <Button variant='outlined' className={classes.loginBtn}>
                  Login
                </Button>
              </Link>
              <Link to='/signup' className={classes.linkAuthBtn}>
                <Button variant='contained' className={classes.signupBtn}>
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
