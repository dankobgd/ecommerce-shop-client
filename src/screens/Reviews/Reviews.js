import React from 'react';

import { makeStyles } from '@material-ui/styles';
import { useQuery } from 'react-query';

import api from '../../api';
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
  const info = useQuery('reviews', () => api.reviews.getAll());

  return (
    <div className={classes.root}>
      <ReviewsToolbar />
      <div className={classes.content}>
        <ReviewsTable info={info} />
      </div>
    </div>
  );
}

export default Reviews;
