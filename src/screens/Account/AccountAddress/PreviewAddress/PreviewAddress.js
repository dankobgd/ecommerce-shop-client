import React from 'react';

import { Card, CardContent, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import PreviewItem from '../../../../components/TableComponents/PreviewItem';
import { useUserAddress } from '../../../../hooks/queries/userQueries';
import { formatDate } from '../../../../utils/formatDate';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    marginTop: '2rem',
  },
});

function PreviewAddress({ addressId }) {
  const classes = useStyles();

  const { data: address } = useUserAddress(addressId);

  return (
    <>
      <Container component='main' maxWidth='md'>
        <Card className={classes.root} variant='outlined'>
          <CardContent>
            <PreviewItem title='ID' value={address?.id} />
            <PreviewItem title='Line 1' value={address?.line1} />
            <PreviewItem title='Line 2' value={address?.line2} />
            <PreviewItem title='City' value={address?.city} />
            <PreviewItem title='Country' value={address?.country} />
            <PreviewItem title='State' value={address?.state} />
            <PreviewItem title='ZIP' value={address?.zip} />
            <PreviewItem title='Latitude' value={address?.latitude} />
            <PreviewItem title='Longitude' value={address?.longitude} />
            <PreviewItem title='Phone' value={address?.phone} />
            <PreviewItem title='Created At' value={formatDate(address?.createdAt)} />
            <PreviewItem title='Updated At' value={formatDate(address?.updatedAt)} />
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default PreviewAddress;
