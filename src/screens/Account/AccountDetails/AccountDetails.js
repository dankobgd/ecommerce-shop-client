import React, { useContext } from 'react';

import { yupResolver } from '@hookform/resolvers';
import { Card, CardActions, CardContent, CardHeader, CircularProgress, Divider, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { FormProvider, useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { FormSelect, FormTextField, FormSubmitButton } from '../../../components/Form';
import ErrorMessage from '../../../components/Message/ErrorMessage';
import { ToastContext } from '../../../components/Toast/ToastContext';
import { useEditProfile, useUserFromCache } from '../../../hooks/queries/userQueries';
import { useFormServerErrors } from '../../../hooks/useFormServerErrors';
import { diff, isEmptyObject } from '../../../utils/diff';
import { rules } from '../../../utils/validation';

const useStyles = makeStyles(() => ({
  root: {},
}));

const schema = Yup.object({
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  username: Yup.string().required(),
  email: rules.email,
  locale: Yup.string().required(),
});

const formOpts = {
  mode: 'onChange',
  reValidateMode: 'onChange',
  defaultValues: {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    gender: '',
    locale: '',
  },
  resolver: yupResolver(schema),
};

function AccountDetails({ className, ...rest }) {
  const classes = useStyles();
  const toast = useContext(ToastContext);
  const [baseFormObj, setBaseFormObj] = React.useState({});

  const user = useUserFromCache();
  const methods = useForm(formOpts);
  const { handleSubmit, setError, reset } = methods;

  const editProfileMutation = useEditProfile();

  const onSubmit = values => {
    const changes = diff(baseFormObj, values);

    if (isEmptyObject(changes)) {
      toast.info('No changes applied');
    }
    if (!isEmptyObject(changes)) {
      editProfileMutation.mutate(values);
    }
  };

  const onError = () => {
    toast.error('Form has errors, please check the details');
  };

  React.useEffect(() => {
    if (user) {
      setBaseFormObj(user);
      reset(user);
    }
  }, [user, reset]);

  useFormServerErrors(editProfileMutation?.error, setError);

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
          <CardHeader title='Details' />

          {editProfileMutation?.isLoading && <CircularProgress />}
          {editProfileMutation?.isError && <ErrorMessage message={editProfileMutation?.error?.message} />}

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
            <FormSubmitButton fullWidth loading={editProfileMutation?.isLoading}>
              Save Details
            </FormSubmitButton>
          </CardActions>
        </form>
      </FormProvider>
    </Card>
  );
}

export default AccountDetails;
