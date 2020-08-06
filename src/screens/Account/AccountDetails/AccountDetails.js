import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Card, CardHeader, CardContent, CardActions, Divider, Grid, CircularProgress } from '@material-ui/core';
import { yupResolver } from '@hookform/resolvers';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, FormProvider } from 'react-hook-form';

import { userUpdateProfileDetails, selectUserProfile } from '../../../store/user/userSlice';
import { rules } from '../../../utils/validation';
import ErrorMessage from '../../../components/Message/ErrorMessage';
import { Input, Select, SubmitButton } from '../../../components/Form';
import { useFormServerErrors } from '../../../hooks/useFormServerErrors';
import { selectUIState } from '../../../store/ui';

const useStyles = makeStyles(() => ({
  root: {},
}));

const schema = Yup.object({
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  username: Yup.string().required(),
  email: rules.emailRule,
  locale: Yup.string().required(),
});

const formOpts = user => ({
  mode: 'onChange',
  reValidateMode: 'onChange',
  defaultValues: {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    email: user?.email || '',
    gender: user?.gender || '',
    locale: user?.locale || '',
  },
  resolver: yupResolver(schema),
});

function AccountDetails(props) {
  const { className, ...rest } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector(selectUserProfile);
  const { loading, error } = useSelector(selectUIState(userUpdateProfileDetails));
  const methods = useForm(formOpts(user));
  const { handleSubmit, setError } = methods;

  const onSubmit = async data => {
    dispatch(userUpdateProfileDetails(data));
  };

  useFormServerErrors(error, setError);

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <CardHeader title='Details' />

          {loading && <CircularProgress />}
          {error && <ErrorMessage message={error.message} />}

          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <Input name='firstName' />
              </Grid>
              <Grid item md={6} xs={12}>
                <Input name='lastName' />
              </Grid>
              <Grid item md={6} xs={12}>
                <Input name='username' />
              </Grid>
              <Grid item md={6} xs={12}>
                <Input name='email' type='email' />
              </Grid>
              <Grid item md={6} xs={6}>
                <Select
                  name='gender'
                  options={[
                    { value: 'm', label: 'Male' },
                    { value: 'f', label: 'Female' },
                  ]}
                />
              </Grid>
              <Grid item md={6} xs={6}>
                <Select
                  name='locale'
                  options={[
                    { value: 'en', label: 'EN' },
                    { value: 'sr', label: 'SR' },
                  ]}
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardActions>
            <SubmitButton>Save Details</SubmitButton>
          </CardActions>
        </form>
      </FormProvider>
    </Card>
  );
}

export default AccountDetails;
