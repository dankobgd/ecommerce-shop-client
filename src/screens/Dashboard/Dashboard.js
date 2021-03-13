import React from 'react';

import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { TotalCountsGrid } from './TotalCountsGrid/TotalCountsGrid';

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
        <TotalCountsGrid />
      </Grid>
    </div>
  );
};

export default Dashboard;
