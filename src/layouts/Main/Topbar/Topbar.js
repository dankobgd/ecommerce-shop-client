import React, { useContext } from 'react';

import { AppBar, Toolbar, Badge, Hidden, IconButton, Popover, Typography } from '@material-ui/core';
import InputIcon from '@material-ui/icons/Input';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCartOutlined';
import StorefrontTwoToneIcon from '@material-ui/icons/StorefrontTwoTone';
import { makeStyles } from '@material-ui/styles';
import { Link } from '@reach/router';
import clsx from 'clsx';

import { CartContext, openDrawer } from '../../../components/ShoppingCart/CartContext';
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

  subHeader: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: '2rem',
    width: '100%',
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

function Topbar({ className, onSidebarOpen, ...rest }) {
  const classes = useStyles();
  const [notifications] = React.useState([]);
  const logoutMutation = useLogout();

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

  return (
    <AppBar {...rest} className={clsx(classes.root, className)}>
      <Toolbar>
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
            style={{ fontSize: '1.3rem', color: '#fff', marginLeft: 10, fontFamily: 'cursive', fontStyle: 'italic' }}
          >
            Ecommerce shop
          </Typography>
        </Link>
        <div className={classes.flexGrow} />

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

        <div className={classes.subHeader}>
          <Badge classes={{ badge: classes.customBadge }} badgeContent={cart?.totalQuantity} onClick={handleDrawer}>
            <ShoppingCartIcon className={classes.cartIcon} />
          </Badge>
        </div>

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
