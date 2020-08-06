import React from 'react';
import { Avatar, Typography, Grid, Container, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { LockOutlined } from '@material-ui/icons';
import { useForm, FormProvider } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers';
import { Link } from '@reach/router';
import * as Yup from 'yup';

import { rules } from '../../utils/validation';
import { userForgotPassword } from '../../store/user/userSlice';
import ErrorMessage from '../../components/Message/ErrorMessage';
import { SubmitButton, Input } from '../../components/Form';
import { useFormServerErrors } from '../../hooks/useFormServerErrors';
import { selectUIState } from '../../store/ui';

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
  const methods = useForm(formOpts);
  const { handleSubmit, setError } = methods;
  const { loading, error } = useSelector(selectUIState(userForgotPassword));

  const onSubmit = async data => {
    dispatch(userForgotPassword(data));
  };

  useFormServerErrors(error, setError);

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

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Input name='email' type='email' />
            <SubmitButton className={classes.submit}>Send Password Reset Email</SubmitButton>

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
