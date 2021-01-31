import React, { useContext } from 'react';

import { yupResolver } from '@hookform/resolvers';
import { Avatar, CircularProgress, Container, FormLabel, Typography } from '@material-ui/core';
import LabelIcon from '@material-ui/icons/Label';
import { makeStyles } from '@material-ui/styles';
import { FormProvider, useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { FormTextField, FormSubmitButton, FormRadioGroup } from '../../../components/Form';
import ErrorMessage from '../../../components/Message/ErrorMessage';
import { ToastContext } from '../../../components/Toast/ToastContext';
import { useUpdateUser, useUser, useUserFromCache } from '../../../hooks/queries/userQueries';
import { useFormServerErrors } from '../../../hooks/useFormServerErrors';
import { diff, isEmptyObject } from '../../../utils/diff';
import { rules } from '../../../utils/validation';
import { AvatarUploadInput } from '../CreateUser/AvatarUploadInput';

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
  locale: Yup.string(),
  avatarUrl: rules.optionalImage,
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
    avatarUrl: '',
  },
  resolver: yupResolver(schema),
};

function EditUserForm({ userId }) {
  const classes = useStyles();
  const toast = useContext(ToastContext);
  const [baseFormObj, setBaseFormObj] = React.useState({});

  const methods = useForm(formOpts);
  const { handleSubmit, setError, reset } = methods;

  const { data: user } = useUser(userId);

  const authUser = useUserFromCache();

  const editUserMutation = useUpdateUser(authUser.id, userId);

  const onSubmit = values => {
    const changes = diff(baseFormObj, values);
    const { avatarUrl, ...rest } = changes;
    const formData = new FormData();

    if (avatarUrl) {
      formData.append('avatar_url', avatarUrl);
    }
    Object.keys(rest).forEach(name => {
      formData.append(name, rest[name]);
    });

    if (isEmptyObject(changes)) {
      toast.info('No changes applied');
    }
    if (!isEmptyObject(changes)) {
      editUserMutation.mutate(formData);
    }
  };

  const onError = () => {
    toast.error('Form has errors, please check the details');
  };

  React.useEffect(() => {
    if (user) {
      // eslint-disable-next-line no-unused-vars
      const { avatarUrl, ...rest } = user;
      const obj = { ...rest, avatarUrl: '' };

      setBaseFormObj(obj);
      reset(obj);
    }
  }, [user, reset]);

  useFormServerErrors(editUserMutation?.error, setError);

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LabelIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Edit User
        </Typography>

        {editUserMutation?.isLoading && <CircularProgress />}
        {editUserMutation?.isError && <ErrorMessage message={editUserMutation?.error?.message} />}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
            <FormTextField name='firstName' fullWidth />
            <FormTextField name='lastName' fullWidth />
            <FormTextField name='username' fullWidth />
            <FormTextField name='email' fullWidth />
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

            <FormSubmitButton className={classes.submit} fullWidth loading={editUserMutation?.isLoading}>
              Save Changes
            </FormSubmitButton>
          </form>
        </FormProvider>
      </div>
    </Container>
  );
}

export default EditUserForm;
