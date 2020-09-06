import React from 'react';

import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  sideBarOuter: {
    border: '1px solid #eee',
  },
}));

function SideBar() {
  const classes = useStyles();

  return <div className={classes.sideBarOuter}>Sidebar</div>;
}

export default SideBar;
