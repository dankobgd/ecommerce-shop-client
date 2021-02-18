import React, { useContext } from 'react';

import { AppBar, Toolbar, IconButton, MenuItem, Menu, Button, Popover, Typography, Badge } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCartOutlined';
import StorefrontTwoToneIcon from '@material-ui/icons/StorefrontTwoTone';
import { Link } from '@reach/router';

import AvatarFallback from '../../../components/AvatarFallback/AvatarFallback';
import { CartContext, openDrawer } from '../../../components/ShoppingCart/CartContext';
import { useLogout, useUserFromCache } from '../../../hooks/queries/userQueries';
import { useIsAuthenticated } from '../../../hooks/useIsAuthenticated';

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

  cartIconWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '2rem',
  },
  cartIcon: {
    fontSize: 30,
    cursor: 'pointer',
  },
  customBadge: {
    backgroundColor: '#00AFD7',
    color: '#fff',
  },
}));

export default function MenuAppBar() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const { cart, dispatch } = useContext(CartContext);

  const [popoverAnchor, setPopoverAnchor] = React.useState(null);

  const handleDrawer = event => {
    if (!cart?.items?.length || cart?.items?.length === 0) {
      setPopoverAnchor(event.currentTarget);
    } else if (cart?.items?.length > 0) {
      dispatch(openDrawer());
    }
  };

  const id = popoverAnchor ? 'empty-cart-popover' : undefined;

  const user = useUserFromCache();
  const isAuthenticated = useIsAuthenticated();
  const logoutMutation = useLogout();

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    logoutMutation.mutate();
  };

  const avatarName = user ? `${user.firstName} ${user.lastName}` : '';

  return (
    <div className={classes.root}>
      <AppBar className={classes.root} color='primary' position='fixed'>
        <Toolbar>
          <div className={classes.title}>
            <Link
              to='/'
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                textDecoration: 'none',
                width: '100%',
              }}
            >
              <StorefrontTwoToneIcon style={{ fontSize: 40, color: '#fff' }} />
              <Typography
                variant='h1'
                style={{
                  fontSize: '1.3rem',
                  color: '#fff',
                  marginLeft: 10,
                  fontFamily: 'cursive',
                  fontStyle: 'italic',
                }}
              >
                Ecommerce shop
              </Typography>
            </Link>
          </div>
          {isAuthenticated ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Popover
                id={id}
                open={!!popoverAnchor}
                anchorEl={popoverAnchor}
                onClose={() => setPopoverAnchor(null)}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <Typography style={{ padding: 10 }}>Shopping cart is empty</Typography>
              </Popover>

              <div className={classes.cartIconWrapper}>
                <Badge
                  classes={{ badge: classes.customBadge }}
                  badgeContent={cart?.totalQuantity}
                  onClick={handleDrawer}
                >
                  <ShoppingCartIcon className={classes.cartIcon} />
                </Badge>
              </div>

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
