import React from 'react';

import { Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  circle: {
    borderRadius: '50%',
    textAlign: 'center',
    fontSize: '100%',
    width: props => `${props.size}px`,
    height: props => `${props.size}px`,
  },
  initials: {
    top: props => `calc(${props.size}px * 0.25)`,
    fontSize: props => `calc(${props.size}px * 0.35)`,
    lineHeight: props => `calc(${props.size}px * 0.5)`,
    color: '#fff',
    position: 'relative',
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

function AvatarFallback({ name, url, size }) {
  const classes = useStyles({ size });
  const [color] = React.useState(randColor);

  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('');

  if (url) {
    return <Avatar className={classes.circle} src={url} />;
  }

  return (
    <div className={classes.circle} style={{ backgroundColor: color }}>
      <div className={classes.initials}>{initials}</div>
    </div>
  );
}

export default AvatarFallback;
