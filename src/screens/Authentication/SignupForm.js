import React from 'react';
import { Avatar, Typography, Container, CircularProgress, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { LockOutlined } from '@material-ui/icons';
import { useForm, FormProvider } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers';
import { Link } from '@reach/router';
import * as Yup from 'yup';

import ErrorMessage from '../../components/Message/ErrorMessage';
import { SubmitButton, Input } from '../../components/Form';
import { rules } from '../../utils/validation';
import { userSignup } from '../../store/user/userSlice';
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
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  email: rules.emailRule,
  password: rules.passwordRule,
  confirmPassword: rules.confirmPasswordRule('password'),
});

const formOpts = {
  mode: 'onChange',
  reValidateMode: 'onChange',
  defaultValues: {
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
  const dispatch = useDispatch();
  const methods = useForm(formOpts);
  const { handleSubmit, setError } = methods;
  const { loading, error } = useSelector(selectUIState(userSignup));

  const onSubmit = async data => {
    dispatch(userSignup(data));
  };

  useFormServerErrors(error, setError);

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlined />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Signup
        </Typography>

        {loading && <CircularProgress />}
        {error && <ErrorMessage message={error.message} />}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Input name='firstName' />
            <Input name='lastName' />
            <Input name='email' type='email' />
            <Input name='password' type='password' />
            <Input name='confirmPassword' type='password' />
            <SubmitButton className={classes.submit}>Signup</SubmitButton>

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
