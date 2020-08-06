import React from 'react';
import clsx from 'clsx';
import { CircularProgress, Card, CardHeader, CardContent, CardActions, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import * as Yup from 'yup';

import { userChangePassword } from '../../../store/user/userSlice';
import { rules } from '../../../utils/validation';
import ErrorMessage from '../../../components/Message/ErrorMessage';
import { useFormServerErrors } from '../../../hooks/useFormServerErrors';
import { selectUIState } from '../../../store/ui';
import { SubmitButton, Input } from '../../../components/Form';

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
            <Input name='oldPassword' type='password' />
            <Input name='newPassword' type='password' />
            <Input name='confirmPassword' type='password' />
          </CardContent>
          <Divider />
          <CardActions>
            <SubmitButton>Update Password</SubmitButton>
          </CardActions>
        </form>
      </FormProvider>
    </Card>
  );
}

export default AccountPassword;
