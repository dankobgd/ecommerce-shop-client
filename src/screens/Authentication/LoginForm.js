import React from 'react';
import { Avatar, Typography, Grid, Container, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { LockOutlined } from '@material-ui/icons';
import { useForm, FormProvider } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers';
import { Link } from '@reach/router';
import * as Yup from 'yup';

import { userLogin } from '../../store/user/userSlice';
import ErrorMessage from '../../components/Message/ErrorMessage';
import { useFormServerErrors } from '../../hooks/useFormServerErrors';
import { SubmitButton, Input } from '../../components/Form';
import { rules } from '../../utils/validation';
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
  password: rules.passwordRule,
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
  const dispatch = useDispatch();
  const methods = useForm(formOpts);
  const { handleSubmit, setError } = methods;
  const { loading, error } = useSelector(selectUIState(userLogin));

  const onSubmit = async data => {
    dispatch(userLogin(data));
  };

  useFormServerErrors(error, setError);

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlined />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Login
        </Typography>

        {loading && <CircularProgress />}
        {error && <ErrorMessage message={error.message} />}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Input name='email' type='email' />
            <Input name='password' type='password' />
            <SubmitButton className={classes.submit}>Login</SubmitButton>

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
