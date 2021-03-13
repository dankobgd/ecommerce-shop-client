import React from 'react';

import { Card, CardContent, Grid, Typography, Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
  },
  content: {
    alignItems: 'center',
    display: 'flex',
  },
  title: {
    fontWeight: 700,
  },
  avatar: {
    height: 56,
    width: 56,
  },
}));

export function TotalCountCard({ count, title, icon, bg }) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent>
        <Grid container justify='space-between'>
          <Grid item>
            <Typography className={classes.title} color='textSecondary' gutterBottom variant='body2'>
              {title}
            </Typography>
            <Typography variant='h3'>{count || 0}</Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar} style={{ backgroundColor: bg }}>
              {icon}
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
