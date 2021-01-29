import React, { useState, useEffect } from 'react';

import { IconButton, Snackbar, SnackbarContent } from '@material-ui/core';
import { amber, green } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import { CheckCircle, Error, Info, Close, Warning } from '@material-ui/icons';
import clsx from 'clsx';

const variantIcon = {
  success: CheckCircle,
  warning: Warning,
  error: Error,
  info: Info,
};

const useStyles = makeStyles(theme => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.main,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  margin: {
    margin: theme.spacing(1),
  },
}));

function SnackBarNotification(props) {
  const classes = useStyles();
  const { className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={clsx(classes[variant], className)}
      aria-describedby='client-snackbar'
      message={
        <span id='client-snackbar' className={classes.message}>
          <Icon className={clsx(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton key='close' aria-label='close' color='inherit' onClick={onClose}>
          <Close className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  );
}

function Toast({ type, message, removeToast, vertical = 'bottom', horizontal = 'left' }) {
  const [open, setOpen] = useState(false);
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    removeToast();
  };

  useEffect(() => {
    setOpen(true);
  }, []);

  return (
    <Snackbar anchorOrigin={{ vertical, horizontal }} open={open} autoHideDuration={3000} onClose={handleClose}>
      <SnackBarNotification onClose={handleClose} variant={type} message={message} />
    </Snackbar>
  );
}

export default Toast;
