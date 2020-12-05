import React from 'react';

import { Card, CardContent, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useQuery, useQueryCache } from 'react-query';

import api from '../../../api';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    marginTop: '2rem',
  },
});

function PreviewProduct({ productId }) {
  const classes = useStyles();
  const cache = useQueryCache();

  const { data: product } = useQuery(['products', productId], () => api.products.get(productId), {
    initialData: () => cache.getQueryData('products')?.data?.find(x => x.id === productId),
  });
  const { data: tags } = useQuery(['products', productId, 'tags'], () => api.products.getTags(productId), {
    initialData: () => cache.getQueryData(['products', productId, 'tags']),
  });
  const { data: images } = useQuery(['products', productId, 'images'], () => api.products.getImages(productId), {
    initialData: () => cache.getQueryData(['products', productId, 'images']),
  });
  const { data: reviews } = useQuery(['products', productId, 'reviews'], () => api.products.getReviews(productId), {
    initialData: () => cache.getQueryData(['products', productId, 'reviews']),
  });

  return (
    <Container component='main' maxWidth='md'>
      <Card className={classes.root} variant='outlined'>
        <CardContent>
          <pre>product: {JSON.stringify(product, null, 2)}</pre>
          <pre>tags: {JSON.stringify(tags, null, 2)}</pre>
          <pre>images: {JSON.stringify(images, null, 2)}</pre>
          <pre>reviews: {JSON.stringify(reviews, null, 2)}</pre>
        </CardContent>
      </Card>
    </Container>
  );
}

export default PreviewProduct;
