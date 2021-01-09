import React from 'react';

import { Card, CardContent, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import PreviewItem from '../../../components/TableComponents/PreviewItem';
import { usePromotion } from '../../../hooks/queries/promotionQueries';
import { formatDate } from '../../../utils/formatDate';
import PreviewToolbar from '../PromotionsToolbar/PreviewToolbar';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    marginTop: '2rem',
  },
});

function PreviewPromotion({ promoCode }) {
  const classes = useStyles();
  const { data: promotion } = usePromotion(promoCode);

  return (
    <Container component='main' maxWidth='md'>
      <PreviewToolbar />
      <Card className={classes.root} variant='outlined'>
        <CardContent>
          <PreviewItem title='Promo Code' value={promotion?.promoCode} />
          <PreviewItem title='Type' value={promotion?.type} />
          <PreviewItem
            title='Amount'
            value={promotion?.type === 'fixed' ? `$${promotion?.amount}` : `${promotion?.amount}%`}
          />
          <PreviewItem title='Description' value={promotion?.description} />
          <PreviewItem title='Starts at' value={formatDate(promotion?.startsAt)} />
          <PreviewItem title='Ends at' value={formatDate(promotion?.endsAt)} />
        </CardContent>
      </Card>
    </Container>
  );
}

export default PreviewPromotion;
