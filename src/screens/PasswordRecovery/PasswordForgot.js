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
import { useForgotPassword } from '../../hooks/queries/userQueries';
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
});

const formOpts = {
  mode: 'onChange',
  reValidateMode: 'onChange',
  defaultValues: { email: '' },
  resolver: yupResolver(schema),
};

function PasswordForgotForm() {
  const classes = useStyles();
  const toast = useContext(ToastContext);

  const methods = useForm(formOpts);
  const { handleSubmit, setError } = methods;

  const forgotPasswordMutation = useForgotPassword();

  const onSubmit = values => {
    forgotPasswordMutation.mutate(values);
  };

  const onError = () => {
    toast.error('Form has errors, please check the details');
  };

  useFormServerErrors(forgotPasswordMutation?.error, setError);

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlined />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Request Password Change
        </Typography>

        {forgotPasswordMutation?.isLoading && <CircularProgress />}
        {forgotPasswordMutation?.isError && <ErrorMessage message={forgotPasswordMutation?.error?.message} />}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
            <FormTextField name='email' type='email' fullWidth />
            <FormSubmitButton className={classes.submit} fullWidth loading={forgotPasswordMutation?.isLoading}>
              Send Password Reset Email
            </FormSubmitButton>

            <Grid container>
              <Grid item xs>
                <Link to='/'>
                  <Typography variant='body2'>Back to Homepage</Typography>
                </Link>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </div>
    </Container>
  );
}

export default PasswordForgotForm;
