import React, { forwardRef } from 'react';

import { List, ListItem, Button, colors } from '@material-ui/core';
import LogoutIcon from '@material-ui/icons/Input';
import { makeStyles } from '@material-ui/styles';
import { Link } from '@reach/router';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';

import { userLogout } from '../../../../store/user/userSlice';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    height: '100%',
  },
  lastItem: {
    marginTop: 'auto',
  },
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0,
  },
  button: {
    color: colors.blueGrey[800],
    padding: '10px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontWeight: theme.typography.fontWeightMedium,
  },
  icon: {
    color: theme.palette.icon,
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1),
  },
  active: {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
    '& $icon': {
      color: theme.palette.primary.main,
    },
  },
}));

/* eslint-disable react/display-name */
const CustomRouterLink = forwardRef((props, ref) => (
  <div ref={ref} style={{ flexGrow: 1 }}>
    <Link {...props} />
  </div>
));

function SidebarNav(props) {
  const { pages, className, ...rest } = props;
  const classes = useStyles();
  const dispatch = useDispatch();

  return (
    <List {...rest} className={clsx(classes.root, className)}>
      {pages.map(page => (
        <ListItem className={classes.item} disableGutters key={page.title}>
          <Button className={classes.button} component={CustomRouterLink} to={page.href}>
            <div className={classes.icon}>{page.icon}</div>
            {page.title}
          </Button>
        </ListItem>
      ))}

      <ListItem className={clsx(classes.item, classes.lastItem)} disableGutters>
        <Button className={classes.button} component={CustomRouterLink} to='/' onClick={() => dispatch(userLogout())}>
          <div className={classes.icon}>
            <LogoutIcon />
          </div>
          Logout
        </Button>
      </ListItem>
    </List>
  );
}

export default SidebarNav;
