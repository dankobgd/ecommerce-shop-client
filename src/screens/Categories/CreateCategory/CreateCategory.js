import React from 'react';

import { yupResolver } from '@hookform/resolvers';
import { Avatar, Button, CircularProgress, Container, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CategoryIcon from '@material-ui/icons/Category';
import { makeStyles } from '@material-ui/styles';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import { FormTextField, FormSubmitButton } from '../../../components/Form';
import ErrorMessage from '../../../components/Message/ErrorMessage';
import { useFormServerErrors } from '../../../hooks/useFormServerErrors';
import { categoryCreate } from '../../../store/category/categorySlice';
import { selectUIState } from '../../../store/ui';
import { transformKeysToSnakeCase } from '../../../utils/transformObjectKeys';
import { rules } from '../../../utils/validation';
import { CategoryLogoUploadField } from './FileUploadInputs';
import PropertyCard from './PropertyCard';

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
  description: Yup.string().required(),
  logo: rules.image,
  properties: rules.properties,
});

const formOpts = {
  mode: 'onChange',
  reValidateMode: 'onChange',
  defaultValues: {
    name: '',
    slug: '',
    description: '',
    logo: '',
    properties: [{ name: '', label: '', type: 'text', filterable: true }],
  },
  resolver: yupResolver(schema),
};

function CreateCategoryForm() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const methods = useForm(formOpts);
  const { handleSubmit, setError, control, errors } = methods;
  const { fields, append, remove, swap } = useFieldArray({ name: 'properties', control });
  const { loading, error } = useSelector(selectUIState(categoryCreate));

  const onSubmit = async data => {
    const { logo, properties, ...rest } = data;
    const formData = new FormData();

    formData.append('logo', logo);
    Object.keys(rest).forEach(name => {
      formData.append(name, rest[name]);
    });
    const withFilterImportance = properties.map((elm, idx) => ({ ...elm, importance: idx + 1 }));
    formData.append('properties', JSON.stringify(transformKeysToSnakeCase(withFilterImportance)));

    await dispatch(categoryCreate(formData));
  };

  useFormServerErrors(error, setError);

  const moveCard = React.useCallback(
    (dragIndex, hoverIndex) => {
      swap(dragIndex, hoverIndex);
    },
    [swap]
  );

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <CategoryIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Create Category
        </Typography>

        {loading && <CircularProgress />}
        {error && <ErrorMessage message={error.message} />}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormTextField name='name' fullWidth />
            <FormTextField name='slug' fullWidth />
            <FormTextField name='description' fullWidth />
            <CategoryLogoUploadField name='logo' />

            <Typography variant='body1' style={{ margin: '1rem 0 0 0' }}>
              Drag & Drop property cards to reorder the filter importance (high to low)
            </Typography>

            {fields.map((card, idx) => (
              <PropertyCard key={card.id} card={card} idx={idx} errors={errors} remove={remove} moveCard={moveCard} />
            ))}

            <Button
              variant='contained'
              size='small'
              className={classes.button}
              startIcon={<AddIcon />}
              onClick={() => append({ name: '', label: '', type: 'text', filterable: true })}
            >
              Add Property
            </Button>

            <FormSubmitButton className={classes.submit} fullWidth>
              Add category
            </FormSubmitButton>
          </form>
        </FormProvider>
      </div>
    </Container>
  );
}

export default CreateCategoryForm;
