import React from 'react';

import { makeStyles } from '@material-ui/core';

import Search from './Search';

const useStyles = makeStyles(() => ({
  headerOuter: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchOuter: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInner: {
    width: '100%',
    padding: '2rem 5rem',
    maxWidth: '640px',
  },

  subHeader: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: '2rem',
    width: '100%',
  },
  cartIcon: {
    fontSize: 40,
    cursor: 'pointer',
  },
}));

function Header() {
  const classes = useStyles();

  return (
    <div className={classes.headerOuter}>
      <div className={classes.searchOuter}>
        <div className={classes.searchInner}>
          <Search />
        </div>
      </div>
    </div>
  );
}

export default Header;
