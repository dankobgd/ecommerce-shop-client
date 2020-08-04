import React from 'react';
import { Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  circle: {
    display: 'flex',
    height: 125,
    width: 125,
    flexShrink: 0,
    flexGrow: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
  },
  initials: {
    fontSize: 24,
    lineHeight: 1,
    color: '#fff',
  },
}));

const colors = [
  'purple',
  'darkred',
  '#264653',
  '#457b9d',
  '#1d3557',
  '#b5838d',
  '#43aa8b',
  '#5f0f40',
  '#9a031e',
  '#6d597a',
  '#3c096c',
  '#da627d',
  '#ffbc42',
  '#8f2d56',
  '#7d4e57',
  '#87bba2',
  '#f6ae2d',
];
const randColor = colors[Math.floor(Math.random() * colors.length)];

function AvatarInitials({ user, avatarUrl, previewUrl }) {
  const classes = useStyles();
  const [color] = React.useState(randColor);
  const [url, setUrl] = React.useState(avatarUrl);

  React.useEffect(() => {
    if (previewUrl) {
      setUrl(previewUrl);
    }
  }, [previewUrl]);

  let initials;
  if (user?.firstName && user?.lastName) {
    initials = `${user.firstName} ${user.lastName}`
      .split(' ')
      .map(n => n[0])
      .join('.');
  } else {
    initials = user?.username[0]; // eslint-disable-line
  }

  if (url) {
    return <Avatar className={classes.circle} src={url} />;
  }

  return (
    <div className={classes.circle} style={{ backgroundColor: color }}>
      <div className={classes.initials}>{initials}</div>
    </div>
  );
}

export default AvatarInitials;
