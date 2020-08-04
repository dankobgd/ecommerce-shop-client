import React from 'react';
import clsx from 'clsx';
import {
  Button,
  TextField,
  CircularProgress,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import * as Yup from 'yup';

import { userChangePassword } from '../../../store/user/userSlice';
import { rules } from '../../../utils/validation';
import ErrorMessage from '../../../components/Message/ErrorMessage';
import { useFormServerErrors } from '../../../hooks/useFormServerErrors';
import { selectUIState } from '../../../store/ui/ui';

const useStyles = makeStyles(() => ({
  root: {},
}));

const schema = Yup.object({
  oldPassword: rules.passwordRule,
  newPassword: rules.passwordRule,
  confirmPassword: rules.confirmPasswordRule('newPassword'),
});

const formOpts = {
  mode: 'onChange',
  reValidateMode: 'onChange',
  defaultValues: {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  },
  resolver: yupResolver(schema),
};

function AccountPassword(props) {
  const { className, ...rest } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const { register, handleSubmit, errors, formState, setError, clearErrors } = useForm(formOpts);
  const { isSubmitting } = formState;
  const { loading, error } = useSelector(selectUIState(userChangePassword));

  const onSubmit = async data => {
    dispatch(userChangePassword(data));
  };

  useFormServerErrors(error, setError, clearErrors, dispatch);

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader title='Password' />

      {loading && <CircularProgress />}
      {error && <ErrorMessage message={error.message} />}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Divider />
        <CardContent>
          <TextField
            name='oldPassword'
            label='Current Password'
            type='password'
            margin='normal'
            variant='outlined'
            error={!!errors.oldPassword}
            helperText={errors?.oldPassword?.message}
            fullWidth
            inputRef={register}
          />
          <TextField
            name='newPassword'
            label='New Password'
            type='password'
            margin='normal'
            variant='outlined'
            error={!!errors.newPassword}
            helperText={errors?.newPassword?.message}
            fullWidth
            inputRef={register}
          />
          <TextField
            name='confirmPassword'
            label='Confirm New Password'
            type='password'
            margin='normal'
            variant='outlined'
            error={!!errors.confirmPassword}
            helperText={errors?.confirmPassword?.message}
            fullWidth
            inputRef={register}
          />
        </CardContent>
        <Divider />
        <CardActions>
          <Button type='submit' color='primary' variant='contained' disabled={isSubmitting}>
            Update Password
          </Button>
        </CardActions>
      </form>
    </Card>
  );
}

export default AccountPassword;
