import React from 'react';
import { Button, Avatar, TextField, Typography, Grid, Container, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { LockOutlined } from '@material-ui/icons';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { yupResolver } from '@hookform/resolvers';
import { Link } from '@reach/router';
import * as Yup from 'yup';

import { rules } from '../../utils/validation';
import { userForgotPassword, selectUser } from '../../store/user/userSlice';
import ErrorMessage from '../../components/Message/ErrorMessage';
import { useFormServerErrors } from '../../hooks/useFormServerErrors';

const useStyles = makeStyles(theme => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const schema = Yup.object({
  email: rules.emailRule,
});

const formOpts = {
  mode: 'onChange',
  reValidateMode: 'onChange',
  defaultValues: { email: '' },
  resolver: yupResolver(schema),
};

function PasswordForgotForm() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { register, handleSubmit, errors, formState, setError, clearErrors } = useForm(formOpts);
  const { isSubmitting } = formState;
  const { loading, error } = useSelector(selectUser, shallowEqual);

  const onSubmit = async data => {
    dispatch(userForgotPassword(data));
  };

  useFormServerErrors(error, setError, clearErrors, dispatch);

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlined />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Request Password Change
        </Typography>

        {loading && <CircularProgress />}
        {error && <ErrorMessage message={error.message} />}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            name='email'
            label='Email'
            type='email'
            margin='normal'
            variant='outlined'
            error={!!errors.email}
            helperText={errors?.email?.message}
            fullWidth
            inputRef={register}
          />

          <Button
            type='submit'
            color='primary'
            variant='contained'
            disabled={!!isSubmitting}
            className={classes.submit}
            fullWidth
          >
            Send Password Reset Email
          </Button>

          <Grid container>
            <Grid item xs>
              <Link to='/'>
                <Typography variant='body2'>Back to Homepage</Typography>
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

export default PasswordForgotForm;
