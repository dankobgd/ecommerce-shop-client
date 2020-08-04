import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';

import AccountProfile from './AccountProfile/AccountProfile';
import AccountDetails from './AccountDetails/AccountDetails';
import AccountPassword from './AccountPassword/AccountPassword';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
  },
}));

const Account = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item lg={6} md={6} xl={4} xs={12}>
          <AccountProfile />
        </Grid>
        <Grid item lg={6} md={6} xl={8} xs={12}>
          <AccountPassword />
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item>
          <AccountDetails />
        </Grid>
      </Grid>
    </div>
  );
};

export default Account;
