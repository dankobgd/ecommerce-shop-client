import React from 'react';

import { yupResolver } from '@hookform/resolvers';
import { Avatar, CircularProgress, Container, Grid, Typography } from '@material-ui/core';
import { LockOutlined } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import { Link, useLocation } from '@reach/router';
import { parse } from 'query-string';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import { FormTextField, FormSubmitButton } from '../../components/Form';
import ErrorMessage from '../../components/Message/ErrorMessage';
import { useFormServerErrors } from '../../hooks/useFormServerErrors';
import { selectUIState } from '../../store/ui';
import { userResetPassword } from '../../store/user/userSlice';
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
  password: rules.passwordRule,
  confirmPassword: rules.confirmPasswordRule('password'),
});

const formOpts = {
  mode: 'onChange',
  reValidateMode: 'onChange',
  defaultValues: {
    password: '',
    confirmPassword: '',
  },
  resolver: yupResolver(schema),
};

function PasswordResetForm() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const methods = useForm(formOpts);
  const { handleSubmit, setError } = methods;
  const { loading, error } = useSelector(selectUIState(userResetPassword));
  const { token } = parse(useLocation().search);

  const onSubmit = async data => {
    dispatch(userResetPassword({ ...data, token }));
  };

  useFormServerErrors(error, setError);

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlined />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Reset Password
        </Typography>

        {loading && <CircularProgress />}
        {error && <ErrorMessage message={error.message} />}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormTextField name='password' type='password' fullWidth />
            <FormTextField name='confirmPassword' type='password' fullWidth />
            <FormSubmitButton className={classes.submit} fullWidth>
              Update Password
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

export default PasswordResetForm;
