import React from 'react';
import clsx from 'clsx';
import { Link } from '@reach/router';
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';

import { selectUserProfile } from '../../../../store/user/userSlice';
import AvatarFallback from '../../../../components/AvatarFallback/AvatarFallback';

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
  const user = useSelector(selectUserProfile);

  const avatarName = user ? `${user.firstName} ${user.lastName}` : '';

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Link to='/dashboard' style={{ textDecoration: 'none' }}>
        <AvatarFallback name={avatarName} url={user?.avatarUrl} size={75} />
      </Link>
      <Typography className={classes.name} variant='h4'>
        {user?.username}
      </Typography>
      <Typography variant='body2'>{user?.email}</Typography>
    </div>
  );
}

export default Profile;
