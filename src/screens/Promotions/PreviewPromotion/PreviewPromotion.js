import React from 'react';

import { Card, CardContent, Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { usePromotion } from '../../../hooks/queries/promotionQueries';
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
    <>
      <Container component='main' maxWidth='md'>
        <PreviewToolbar />
        <Card className={classes.root} variant='outlined'>
          <CardContent>
            {promotion &&
              Object.entries(promotion).map(([key, val], idx) => (
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

export default PreviewPromotion;
