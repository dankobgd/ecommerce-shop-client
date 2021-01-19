import React from 'react';

import { Card, CardContent, Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import PreviewItem from '../../../components/TableComponents/PreviewItem';
import { useCategory } from '../../../hooks/queries/categoryQueries';
import { formatDate } from '../../../utils/formatDate';
import PreviewToolbar from '../CategoriesToolbar/PreviewToolbar';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    marginTop: '2rem',
  },
});

function PreviewCategory({ categoryId }) {
  const classes = useStyles();
  const { data: category } = useCategory(categoryId);

  return (
    <>
      <Container component='main' maxWidth='md'>
        <PreviewToolbar />
        <Card className={classes.root} variant='outlined'>
          <CardContent>
            <PreviewItem title='ID' value={category?.id} />
            <PreviewItem title='Name' value={category?.name} />
            <PreviewItem title='Slug' value={category?.slug} />
            <PreviewItem title='Description' value={category?.description} />
            <PreviewItem title='Is Featured' value={category?.isFeatured ? 'Yes' : 'No'} />
            <PreviewItem title='Logo' value={<a href={category?.logo || ''}>{category?.logo}</a>} />
            <PreviewItem title='Logo Public ID' value={category?.logoPublicId} />
            <PreviewItem title='Created at' value={formatDate(category?.createdAt)} />
            <PreviewItem title='Updated at' value={formatDate(category?.updatedAt)} />

            <PreviewItem title='Properties' value='' style={{ marginTop: '2rem' }} />
            {category?.properties?.map((prop, i) => (
              <div key={i} style={{ padding: 10, marginTop: 10, background: i % 2 === 0 ? '#f8f8f8' : '#fff' }}>
                {Object.entries(prop).map(([k, v], j) => (
                  <div key={`${v}_${j}`} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <Typography variant='subtitle2' color='textSecondary' gutterBottom>
                      {k}:
                    </Typography>
                    <Typography variant='h5' color='textPrimary' gutterBottom style={{ marginLeft: 10 }}>
                      {/* eslint-disable-next-line no-nested-ternary */}
                      {Array.isArray(v) ? JSON.stringify(v) : typeof v === 'boolean' ? v?.toString() : v}
                    </Typography>
                  </div>
                ))}
              </div>
            ))}
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default PreviewCategory;
