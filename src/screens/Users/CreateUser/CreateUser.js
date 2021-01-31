import React, { useContext } from 'react';

import { yupResolver } from '@hookform/resolvers';
import { Avatar, CircularProgress, Container, FormLabel, Typography } from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { makeStyles } from '@material-ui/styles';
import { FormProvider, useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { FormTextField, FormSubmitButton, FormRadioGroup } from '../../../components/Form';
import ErrorMessage from '../../../components/Message/ErrorMessage';
import { ToastContext } from '../../../components/Toast/ToastContext';
import { useCreateUser } from '../../../hooks/queries/userQueries';
import { useFormServerErrors } from '../../../hooks/useFormServerErrors';
import { rules } from '../../../utils/validation';
import { AvatarUploadInput } from './AvatarUploadInput';

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
  username: Yup.string().required(),
  email: Yup.string().required(),
  gender: Yup.string().nullable(),
  role: Yup.string().required(),
  locale: Yup.string(),
  avatarUrl: rules.optionalImage,
  password: rules.password,
});

const formOpts = {
  mode: 'onChange',
  reValidateMode: 'onChange',
  defaultValues: {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    gender: '',
    role: 'user',
    locale: 'en',
    avatarUrl: '',
  },
  resolver: yupResolver(schema),
};

function CreateUserForm() {
  const classes = useStyles();
  const toast = useContext(ToastContext);

  const methods = useForm(formOpts);
  const { handleSubmit, setError } = methods;

  const createUserMutation = useCreateUser();

  const onSubmit = values => {
    const { avatarUrl, gender, ...rest } = values;
    const formData = new FormData();

    formData.append('avatar_url', avatarUrl);
    Object.keys(rest).forEach(name => {
      formData.append(name, rest[name]);
    });
    if (gender) {
      formData.append('gender', rest.gender);
    }
    formData.append('confirm_password', rest.password);

    createUserMutation.mutate(formData);
  };

  const onError = () => {
    toast.error('Form has errors, please check the details');
  };

  useFormServerErrors(createUserMutation?.error, setError);

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <PersonAddIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Create User
        </Typography>

        {createUserMutation?.isLoading && <CircularProgress />}
        {createUserMutation?.isError && <ErrorMessage message={createUserMutation?.error?.message} />}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
            <FormTextField name='firstName' fullWidth />
            <FormTextField name='lastName' fullWidth />
            <FormTextField name='username' fullWidth />
            <FormTextField name='email' type='email' fullWidth />
            <FormTextField name='password' type='password' fullWidth />

            <div style={{ marginTop: 6 }}>
              <FormLabel component='legend'>Gender</FormLabel>
            </div>
            <FormRadioGroup
              row
              name='gender'
              options={[
                { label: 'Male', value: 'm' },
                { label: 'Female', value: 'f' },
              ]}
            />

            <div style={{ marginTop: 6 }}>
              <FormLabel component='legend'>Locale</FormLabel>
            </div>
            <FormRadioGroup
              row
              name='locale'
              options={[
                { label: 'ENG', value: 'en' },
                { label: 'SRB', value: 'sr' },
              ]}
            />
            <AvatarUploadInput name='avatarUrl' />

            <FormSubmitButton className={classes.submit} fullWidth loading={createUserMutation?.isLoading}>
              Add User
            </FormSubmitButton>
          </form>
        </FormProvider>
      </div>
    </Container>
  );
}

export default CreateUserForm;
