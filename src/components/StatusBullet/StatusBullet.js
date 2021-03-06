import React from 'react';

import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'inline-block',
    borderRadius: '50%',
    flexGrow: 0,
    flexShrink: 0,
  },
  sm: {
    height: theme.spacing(1),
    width: theme.spacing(1),
  },
  md: {
    height: theme.spacing(2),
    width: theme.spacing(2),
  },
  lg: {
    height: theme.spacing(3),
    width: theme.spacing(3),
  },
  neutral: {
    backgroundColor: theme.palette.neutral,
  },
  primary: {
    backgroundColor: theme.palette.primary.main,
  },
  info: {
    backgroundColor: theme.palette.info.main,
  },
  warning: {
    backgroundColor: theme.palette.warning.main,
  },
  danger: {
    backgroundColor: theme.palette.error.main,
  },
  success: {
    backgroundColor: theme.palette.success.main,
  },
}));

const StatusBullet = props => {
  const { className, size = 'md', color = 'default', ...rest } = props;
  const classes = useStyles();

  return (
    <span
      {...rest}
      className={clsx(
        {
          [classes.root]: true,
          [classes[size]]: size,
          [classes[color]]: color,
        },
        className
      )}
    />
  );
};

export default StatusBullet;
