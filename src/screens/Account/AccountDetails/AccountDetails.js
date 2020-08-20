import React from 'react';

import { yupResolver } from '@hookform/resolvers';
import { Card, CardActions, CardContent, CardHeader, CircularProgress, Divider, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import { FormSelect, FormTextField, FormSubmitButton } from '../../../components/Form';
import ErrorMessage from '../../../components/Message/ErrorMessage';
import { useFormServerErrors } from '../../../hooks/useFormServerErrors';
import { selectUIState } from '../../../store/ui';
import { selectUserProfile, userUpdateProfileDetails } from '../../../store/user/userSlice';
import { rules } from '../../../utils/validation';

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
    await dispatch(userUpdateProfileDetails(data));
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
                <FormTextField name='firstName' fullWidth />
              </Grid>
              <Grid item md={6} xs={12}>
                <FormTextField name='lastName' fullWidth />
              </Grid>
              <Grid item md={6} xs={12}>
                <FormTextField name='username' fullWidth />
              </Grid>
              <Grid item md={6} xs={12}>
                <FormTextField name='email' type='email' fullWidth />
              </Grid>
              <Grid item md={6} xs={6}>
                <FormSelect
                  name='gender'
                  options={[
                    { value: 'm', label: 'Male' },
                    { value: 'f', label: 'Female' },
                  ]}
                />
              </Grid>
              <Grid item md={6} xs={6}>
                <FormSelect
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
            <FormSubmitButton fullWidth>Save Details</FormSubmitButton>
          </CardActions>
        </form>
      </FormProvider>
    </Card>
  );
}

export default AccountDetails;
