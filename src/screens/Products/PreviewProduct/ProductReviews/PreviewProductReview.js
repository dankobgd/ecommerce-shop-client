import React from 'react';

import { Card, CardContent, Container, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import PreviewItem from '../../../../components/TableComponents/PreviewItem';
import { useProductReview } from '../../../../hooks/queries/productQueries';
import PreviewProductReviewToolbar from '../PreviewProductReviewToolbar/PreviewProductReviewToolbar';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    marginTop: '2rem',
  },
});

function PreviewProductReview({ productId, productSlug, reviewId }) {
  const classes = useStyles();

  const { data: review } = useProductReview(productId, reviewId);

  return (
    <>
      <Container component='main' maxWidth='md'>
        <PreviewProductReviewToolbar productId={productId} productSlug={productSlug} reviewId={reviewId} />
        <Card className={classes.root} variant='outlined'>
          <CardContent>
            <PreviewItem title='Rating' value={review?.rating} />
            <PreviewItem title='Title' value={review?.title} />
            <PreviewItem title='Comment' value={review?.comment} />

            <Divider style={{ marginTop: '2rem' }} />
            <PreviewItem title='User' value='' />
            <PreviewItem title='ID' value={review?.user?.id} />
            <PreviewItem title='Username' value={review?.user?.username} />
            <PreviewItem title='First Name' value={review?.user?.firstName} />
            <PreviewItem title='Last Name' value={review?.user?.lastName} />
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default PreviewProductReview;
