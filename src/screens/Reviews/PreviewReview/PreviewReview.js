import React from 'react';

import { Card, CardContent, Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { useReview } from '../../../hooks/queries/reviewQueries';
import PreviewToolbar from '../ReviewsToolbar/PreviewToolbar';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    marginTop: '2rem',
  },
});

function PreviewReview({ reviewId }) {
  const classes = useStyles();

  const { data: review } = useReview(reviewId);

  return (
    <>
      <Container component='main' maxWidth='md'>
        <PreviewToolbar />
        <Card className={classes.root} variant='outlined'>
          <CardContent>
            {review &&
              Object.entries(review).map(([key, val], idx) => (
                <div key={key} style={{ marginTop: idx !== 0 ? '1rem' : 0 }}>
                  <Typography variant='subtitle2' color='textSecondary' gutterBottom>
                    {key}
                  </Typography>
                  <Typography variant='h5' color='textPrimary' gutterBottom>
                    {val}
                  </Typography>
                </div>
              ))}
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default PreviewReview;
