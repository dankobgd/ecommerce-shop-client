import React from 'react';

import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import LatestOrders from './LatestOrders/LatestOrders';
import TotalUsers from './TotalUsers/TotalUsers';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
  },
}));

const Dashboard = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <TotalUsers />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item>
          <LatestOrders />
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
