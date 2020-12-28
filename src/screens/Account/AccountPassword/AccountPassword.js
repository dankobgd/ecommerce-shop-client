import React, { useContext } from 'react';

import { yupResolver } from '@hookform/resolvers';
import { Card, CardActions, CardContent, CardHeader, CircularProgress, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { FormProvider, useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { FormTextField, FormSubmitButton } from '../../../components/Form';
import ErrorMessage from '../../../components/Message/ErrorMessage';
import { ToastContext } from '../../../components/Toast/ToastContext';
import { useChangePassword } from '../../../hooks/queries/userQueries';
import { useFormServerErrors } from '../../../hooks/useFormServerErrors';
import { rules } from '../../../utils/validation';

const useStyles = makeStyles(() => ({
  root: {},
}));

const schema = Yup.object({
  oldPassword: rules.password,
  newPassword: rules.password,
  confirmPassword: rules.confirmPassword('newPassword'),
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

function AccountPassword({ className, ...rest }) {
  const classes = useStyles();
  const toast = useContext(ToastContext);

  const methods = useForm(formOpts);
  const { handleSubmit, setError } = methods;

  const changePasswordMutatiom = useChangePassword();

  const onSubmit = values => {
    changePasswordMutatiom.mutate(values);
  };

  const onError = () => {
    toast.error('Form has errors, please check the details');
  };

  useFormServerErrors(changePasswordMutatiom?.error, setError);

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader title='Password' />

      {changePasswordMutatiom?.isLoading && <CircularProgress />}
      {changePasswordMutatiom?.isError && <ErrorMessage message={changePasswordMutatiom?.error?.message} />}

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
          <Divider />
          <CardContent>
            <FormTextField name='oldPassword' type='password' fullWidth />
            <FormTextField name='newPassword' type='password' fullWidth />
            <FormTextField name='confirmPassword' type='password' fullWidth />
          </CardContent>
          <Divider />
          <CardActions>
            <FormSubmitButton fullWidth loading={changePasswordMutatiom?.isLoading}>
              Update Password
            </FormSubmitButton>
          </CardActions>
        </form>
      </FormProvider>
    </Card>
  );
}

export default AccountPassword;
