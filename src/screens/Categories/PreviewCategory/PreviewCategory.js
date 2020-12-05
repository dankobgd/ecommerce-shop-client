import React from 'react';

import { Card, CardContent, Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useQuery, useQueryCache } from 'react-query';

import api from '../../../api';
import PreviewToolbar from '../CategoriesToolbar/PreviewToolbar';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    marginTop: '2rem',
  },
});

function PreviewCategory({ categoryId }) {
  const classes = useStyles();
  const cache = useQueryCache();

  const { data: category } = useQuery(['categories', categoryId], () => api.categories.get(categoryId), {
    initialData: () => cache.getQueryData('categories')?.data?.find(x => x.id === categoryId),
  });

  const { properties = [], ...rest } = category || {};

  return (
    <>
      <Container component='main' maxWidth='md'>
        <PreviewToolbar />
        <Card className={classes.root} variant='outlined'>
          <CardContent>
            {category &&
              Object.entries(rest)?.map(([key, val], idx) => (
                <div key={key} style={{ marginTop: idx !== 0 ? '1rem' : 0 }}>
                  <Typography variant='subtitle2' color='textSecondary' gutterBottom>
                    {key}
                  </Typography>
                  <Typography variant='h5' color='textPrimary' gutterBottom>
                    {typeof val === 'boolean' ? val.toString() : val}
                  </Typography>
                </div>
              ))}

            <Typography variant='subtitle2' color='textSecondary' gutterBottom>
              Properties
            </Typography>
            <Typography variant='h5' color='textPrimary' gutterBottom>
              {JSON.stringify(properties, null, 2)}
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default PreviewCategory;
