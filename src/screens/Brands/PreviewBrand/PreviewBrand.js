import React from 'react';

import { Card, CardContent, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import PreviewItem from '../../../components/TableComponents/PreviewItem';
import { useBrand } from '../../../hooks/queries/brandQueries';
import { formatDate } from '../../../utils/formatDate';
import PreviewToolbar from '../BrandsToolbar/PreviewToolbar';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    marginTop: '2rem',
  },
});

function PreviewBrand({ brandId }) {
  const classes = useStyles();

  const { data: brand } = useBrand(brandId);

  return (
    <>
      <Container component='main' maxWidth='md'>
        <PreviewToolbar />
        <Card className={classes.root} variant='outlined'>
          <CardContent>
            <PreviewItem title='ID' value={brand?.id} />
            <PreviewItem title='Name' value={brand?.name} />
            <PreviewItem title='Slug' value={brand?.slug} />
            <PreviewItem title='Type' value={brand?.type} />
            <PreviewItem title='Description' value={brand?.description} />
            <PreviewItem title='Email' value={brand?.email} />
            <PreviewItem title='Website URL' value={brand?.websiteUrl} />
            <PreviewItem title='Logo' value={<a href={brand?.logo || ''}>{brand?.logo}</a>} />
            <PreviewItem title='Logo Public ID' value={brand?.logoPublicId} />
            <PreviewItem title='Created at' value={formatDate(brand?.createdAt)} />
            <PreviewItem title='Updated at' value={formatDate(brand?.updatedAt)} />
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default PreviewBrand;
