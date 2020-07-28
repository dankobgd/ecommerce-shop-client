import React from 'react';
import { Button, Avatar, TextField, Typography, Grid, Container, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { LockOutlined } from '@material-ui/icons';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { yupResolver } from '@hookform/resolvers';
import { Link, useLocation } from '@reach/router';
import * as Yup from 'yup';
import { parse } from 'query-string';

import { rules } from '../../utils/validation';
import { userResetPassword, selectUser } from '../../store/user/userSlice';
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
  password: rules.passwordRule,
  confirmPassword: rules.confirmPasswordRule,
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
  const { register, handleSubmit, errors, formState, setError, clearErrors } = useForm(formOpts);
  const { isSubmitting } = formState;
  const { loading, error } = useSelector(selectUser, shallowEqual);
  const { token } = parse(useLocation().search);

  const onSubmit = async data => {
    dispatch(userResetPassword({ ...data, token }));
  };

  useFormServerErrors(error, setError, clearErrors, dispatch);

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

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            name='password'
            label='Password'
            type='password'
            margin='normal'
            variant='outlined'
            error={!!errors.password}
            helperText={errors?.password?.message}
            fullWidth
            inputRef={register}
          />
          <TextField
            name='confirmPassword'
            label='Confirm Password'
            type='password'
            margin='normal'
            variant='outlined'
            error={!!errors.confirmPassword}
            helperText={errors?.confirmPassword?.message}
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
            Update Password
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

export default PasswordResetForm;
