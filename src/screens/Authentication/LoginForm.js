import React, { useContext } from 'react';

import { yupResolver } from '@hookform/resolvers';
import { Avatar, CircularProgress, Container, Grid, Typography } from '@material-ui/core';
import { LockOutlined } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import { Link } from '@reach/router';
import { FormProvider, useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { FormTextField, FormSubmitButton } from '../../components/Form';
import ErrorMessage from '../../components/Message/ErrorMessage';
import { ToastContext } from '../../components/Toast/ToastContext';
import { useLogin } from '../../hooks/queries/userQueries';
import { useFormServerErrors } from '../../hooks/useFormServerErrors';
import { rules } from '../../utils/validation';

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
  email: rules.email,
  password: rules.password,
});

const formOpts = {
  mode: 'onChange',
  reValidateMode: 'onChange',
  defaultValues: {
    email: '',
    password: '',
  },
  resolver: yupResolver(schema),
};

function LoginForm() {
  const classes = useStyles();
  const toast = useContext(ToastContext);

  const methods = useForm(formOpts);
  const { handleSubmit, setError } = methods;

  const loginMutation = useLogin();

  const onSubmit = values => {
    loginMutation.mutate(values);
  };

  const onError = () => {
    toast.error('Form has errors, please check the details');
  };

  useFormServerErrors(loginMutation?.error, setError);

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlined />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Login
        </Typography>

        {loginMutation?.isLoading && <CircularProgress />}
        {loginMutation?.isError && <ErrorMessage message={loginMutation?.error?.message} />}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
            <FormTextField name='email' type='email' fullWidth />
            <FormTextField name='password' type='password' fullWidth />
            <FormSubmitButton className={classes.submit} fullWidth loading={loginMutation?.isLoading}>
              Login
            </FormSubmitButton>

            <Grid container>
              <Grid item xs>
                <Link to='/password/forgot'>
                  <Typography variant='body2'>Forgot password?</Typography>
                </Link>
              </Grid>
              <Grid item xs>
                <Link to='/signup'>
                  <Typography variant='body2'>Don't have an account? Create one</Typography>
                </Link>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </div>
    </Container>
  );
}

export default LoginForm;
