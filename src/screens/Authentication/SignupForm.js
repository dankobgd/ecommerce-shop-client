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
import { useSignup } from '../../hooks/queries/userQueries';
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
  username: Yup.string().required(),
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  email: rules.email,
  password: rules.password,
  confirmPassword: rules.confirmPassword('password'),
});

const formOpts = {
  mode: 'onChange',
  reValidateMode: 'onChange',
  defaultValues: {
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  },
  resolver: yupResolver(schema),
};

function SignupForm() {
  const classes = useStyles();
  const toast = useContext(ToastContext);

  const methods = useForm(formOpts);
  const { handleSubmit, setError } = methods;

  const signupMutation = useSignup();

  const onSubmit = values => {
    signupMutation.mutate(values);
  };

  const onError = () => {
    toast.error('Form has errors, please check the details');
  };

  useFormServerErrors(signupMutation?.error, setError);

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlined />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Signup
        </Typography>

        {signupMutation?.isLoading && <CircularProgress />}
        {signupMutation?.isError && <ErrorMessage message={signupMutation?.error?.message} />}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
            <FormTextField name='username' fullWidth />
            <FormTextField name='firstName' fullWidth />
            <FormTextField name='lastName' fullWidth />
            <FormTextField name='email' type='email' fullWidth />
            <FormTextField name='password' type='password' fullWidth />
            <FormTextField name='confirmPassword' type='password' fullWidth />
            <FormSubmitButton className={classes.submit} fullWidth loading={signupMutation?.isLoading}>
              Signup
            </FormSubmitButton>

            <Grid container>
              <Grid item xs>
                <Link to='/login'>
                  <Typography variant='body2'>Already have an account? Login</Typography>
                </Link>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </div>
    </Container>
  );
}

export default SignupForm;
