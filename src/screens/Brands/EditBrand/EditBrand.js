import React, { useContext } from 'react';

import { yupResolver } from '@hookform/resolvers';
import { Avatar, CircularProgress, Container, Typography } from '@material-ui/core';
import ClassIcon from '@material-ui/icons/Class';
import { makeStyles } from '@material-ui/styles';
import { FormProvider, useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { FormTextField, FormSubmitButton } from '../../../components/Form';
import ErrorMessage from '../../../components/Message/ErrorMessage';
import { ToastContext } from '../../../components/Toast/ToastContext';
import { useBrand, useUpdateBrand } from '../../../hooks/queries/brandQueries';
import { useFormServerErrors } from '../../../hooks/useFormServerErrors';
import { diff, isEmptyObject } from '../../../utils/diff';
import { rules } from '../../../utils/validation';
import { BrandLogoUploadField } from './FileUploadInputs';

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
  name: Yup.string().required(),
  slug: Yup.string().required(),
  type: Yup.string().required(),
  description: Yup.string(),
  email: rules.email,
  logo: rules.optionalImage,
  websiteUrl: Yup.string().required(),
});

const formOpts = {
  mode: 'onChange',
  reValidateMode: 'onChange',
  defaultValues: {
    name: '',
    slug: '',
    type: '',
    email: '',
    description: '',
    logo: '',
    websiteUrl: '',
  },
  resolver: yupResolver(schema),
};

function EditBrandForm({ brandId }) {
  const classes = useStyles();
  const toast = useContext(ToastContext);
  const [baseFormObj, setBaseFormObj] = React.useState({});

  const methods = useForm(formOpts);
  const { handleSubmit, setError, reset } = methods;

  const { data: brand } = useBrand(brandId);

  const editBrandMutation = useUpdateBrand(brandId);

  const onSubmit = values => {
    const changes = diff(baseFormObj, values);
    const { logo, ...rest } = changes;
    const formData = new FormData();

    if (logo) {
      formData.append('logo', logo);
    }
    Object.keys(rest).forEach(name => {
      formData.append(name, rest[name]);
    });

    if (isEmptyObject(changes)) {
      toast.info('No changes applied');
    }
    if (!isEmptyObject(changes)) {
      editBrandMutation.mutate(formData);
    }
  };

  const onError = () => {
    toast.error('Form has errors, please check the details');
  };

  React.useEffect(() => {
    if (brand) {
      // eslint-disable-next-line no-unused-vars
      const { logo, ...rest } = brand;
      const obj = { ...rest, logo: '' };

      setBaseFormObj(obj);
      reset(obj);
    }
  }, [brand, reset]);

  useFormServerErrors(editBrandMutation?.error, setError);

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <ClassIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Edit Brand
        </Typography>

        {editBrandMutation?.isLoading && <CircularProgress />}
        {editBrandMutation?.isError && <ErrorMessage message={editBrandMutation?.error?.message} />}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
            <FormTextField name='id' fullWidth inputProps={{ readOnly: true }} disabled />
            <FormTextField name='name' fullWidth />
            <FormTextField name='slug' fullWidth />
            <FormTextField name='type' fullWidth />
            <FormTextField name='description' multiline fullWidth rows={5} />
            <FormTextField name='email' fullWidth />
            <FormTextField name='websiteUrl' fullWidth />
            <BrandLogoUploadField name='logo' />

            <FormSubmitButton className={classes.submit} fullWidth loading={editBrandMutation?.isLoading}>
              Save Changes
            </FormSubmitButton>
          </form>
        </FormProvider>
      </div>
    </Container>
  );
}

export default EditBrandForm;
