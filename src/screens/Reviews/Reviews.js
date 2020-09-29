import React from 'react';

import { makeStyles } from '@material-ui/styles';
import { useDispatch, useSelector } from 'react-redux';

import { reviewGetAll, selectAllReviews } from '../../store/review/reviewSlice';
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
  const dispatch = useDispatch();
  const reviews = useSelector(selectAllReviews);

  React.useEffect(() => {
    dispatch(reviewGetAll());
  }, [dispatch]);

  return (
    <div className={classes.root}>
      <ReviewsToolbar />
      <div className={classes.content}>
        <ReviewsTable reviews={reviews} />
      </div>
    </div>
  );
}

export default Reviews;
