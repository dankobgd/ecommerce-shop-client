import React from 'react';

import { Card, CardContent, Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { useTag } from '../../../hooks/queries/tagQueries';
import PreviewToolbar from '../TagsToolbar/PreviewToolbar';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    marginTop: '2rem',
  },
});

function PreviewTag({ tagId }) {
  const classes = useStyles();

  const { data: tag } = useTag(tagId);

  return (
    <>
      <Container component='main' maxWidth='md'>
        <PreviewToolbar />
        <Card className={classes.root} variant='outlined'>
          <CardContent>
            {tag &&
              Object.entries(tag).map(([key, val], idx) => (
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

export default PreviewTag;
