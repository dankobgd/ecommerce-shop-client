import React from 'react';

import { yupResolver } from '@hookform/resolvers';
import { Card, CardActions, CardContent, CardHeader, CircularProgress, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import { FormTextField, FormSubmitButton } from '../../../components/Form';
import ErrorMessage from '../../../components/Message/ErrorMessage';
import { useFormServerErrors } from '../../../hooks/useFormServerErrors';
import { selectUIState } from '../../../store/ui';
import { userChangePassword } from '../../../store/user/userSlice';
import { rules } from '../../../utils/validation';

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
  const methods = useForm(formOpts);
  const { handleSubmit, setError } = methods;
  const { loading, error } = useSelector(selectUIState(userChangePassword));

  const onSubmit = async data => {
    dispatch(userChangePassword(data));
  };

  useFormServerErrors(error, setError);

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader title='Password' />

      {loading && <CircularProgress />}
      {error && <ErrorMessage message={error.message} />}

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Divider />
          <CardContent>
            <FormTextField name='oldPassword' type='password' />
            <FormTextField name='newPassword' type='password' />
            <FormTextField name='confirmPassword' type='password' />
          </CardContent>
          <Divider />
          <CardActions>
            <FormSubmitButton>Update Password</FormSubmitButton>
          </CardActions>
        </form>
      </FormProvider>
    </Card>
  );
}

export default AccountPassword;
