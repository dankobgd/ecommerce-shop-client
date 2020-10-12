import React from 'react';

import { Divider, Drawer } from '@material-ui/core';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import CategoryIcon from '@material-ui/icons/Category';
import ClassIcon from '@material-ui/icons/Class';
import DashboardIcon from '@material-ui/icons/Dashboard';
import LabelIcon from '@material-ui/icons/Label';
import PeopleIcon from '@material-ui/icons/People';
import RateReviewIcon from '@material-ui/icons/RateReview';
import SettingsIcon from '@material-ui/icons/Settings';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import StarsIcon from '@material-ui/icons/Stars';
import StoreIcon from '@material-ui/icons/Store';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';

import Profile from './Profile/Profile';
import SidebarNav from './SidebarNav/SidebarNav';

const useStyles = makeStyles(theme => ({
  drawer: {
    width: 240,
    [theme.breakpoints.up('lg')]: {
      marginTop: 64,
      height: 'calc(100% - 64px)',
    },
  },
  root: {
    backgroundColor: theme.palette.white,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2),
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
  nav: {
    marginBottom: theme.spacing(2),
  },
}));

function Sidebar(props) {
  const { open, variant, onClose, className, ...rest } = props;
  const classes = useStyles();

  const pages = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: <DashboardIcon />,
    },
    {
      title: 'Account',
      href: '/account',
      icon: <AccountBoxIcon />,
    },
    {
      title: 'Users',
      href: '/users',
      icon: <PeopleIcon />,
    },
    {
      title: 'Products',
      href: '/products',
      icon: <ShoppingBasketIcon />,
    },
    {
      title: 'Orders',
      href: '/orders',
      icon: <StoreIcon />,
    },
    {
      title: 'Categories',
      href: '/categories',
      icon: <CategoryIcon />,
    },
    {
      title: 'Brands',
      href: '/brands',
      icon: <ClassIcon />,
    },
    {
      title: 'Tags',
      href: '/tags',
      icon: <LabelIcon />,
    },
    {
      title: 'Reviews',
      href: '/reviews',
      icon: <RateReviewIcon />,
    },
    {
      title: 'Wishlist',
      href: '/wishlist',
      icon: <StarsIcon />,
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: <SettingsIcon />,
    },
  ];

  return (
    <Drawer anchor='left' classes={{ paper: classes.drawer }} onClose={onClose} open={open} variant={variant}>
      <div {...rest} className={clsx(classes.root, className)}>
        <Profile />
        <Divider className={classes.divider} />
        <SidebarNav className={classes.nav} pages={pages} />
      </div>
    </Drawer>
  );
}

export default Sidebar;
