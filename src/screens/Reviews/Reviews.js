import React from 'react';

import { makeStyles } from '@material-ui/styles';

import ReviewsTable from './ReviewsTable/ReviewsTable';
import ReviewsToolbar from './ReviewsToolbar/ReviewsToolbar';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
  },
  content: {
    marginTop: theme.spacing(2),
  },
}));

function Reviews() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ReviewsToolbar />
      <div className={classes.content}>
        <ReviewsTable />
      </div>
    </div>
  );
}

export default Reviews;
