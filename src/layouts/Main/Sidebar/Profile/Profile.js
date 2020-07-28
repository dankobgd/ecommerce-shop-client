import React from 'react';
import clsx from 'clsx';
import { Link } from '@reach/router';
import { makeStyles } from '@material-ui/styles';
import { Avatar, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'fit-content',
  },
  avatar: {
    width: 60,
    height: 60,
  },
  name: {
    marginTop: theme.spacing(1),
  },
}));

function Profile(props) {
  const { className, ...rest } = props;
  const classes = useStyles();
  // const user = useSelector(identitySelectors.getUser);
  const user = {};

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Avatar
        alt='Person'
        className={classes.avatar}
        component={Link}
        src={user.avatar || 'https://i.pravatar.cc/200?img=19'}
        to='/account'
      />
      <Typography className={classes.name} variant='h4'>
        {user.username}
      </Typography>
      <Typography variant='body2'>{user.email}</Typography>
    </div>
  );
}

export default Profile;
