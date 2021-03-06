import React from 'react';

import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import AccountAddress from './AccountAddress/AccountAddress';
import AccountAvatar from './AccountAvatar/AccountAvatar';
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
          <AccountAvatar />
        </Grid>
        <Grid item lg={6} md={6} xl={8} xs={12}>
          <AccountPassword />
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <AccountDetails />
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <AccountAddress />
        </Grid>
      </Grid>
    </div>
  );
};

export default Account;
