import React from 'react';
import { Link } from '@reach/router';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Toolbar } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    boxShadow: 'none',
  },
}));

function Topbar(props) {
  const { className, ...rest } = props;
  const classes = useStyles();

  return (
    <AppBar {...rest} className={clsx(classes.root, className)} color='primary' position='fixed'>
      <Toolbar>
        <Link to='/'>
          <img alt='Logo' src='https://via.placeholder.com/50' />
        </Link>
      </Toolbar>
    </AppBar>
  );
}

export default Topbar;
