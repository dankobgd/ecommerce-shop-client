import React, { useContext } from 'react';

import { yupResolver } from '@hookform/resolvers';
import { Avatar, Button, CircularProgress, Container, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CategoryIcon from '@material-ui/icons/Category';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import HelpIcon from '@material-ui/icons/Help';
import { makeStyles } from '@material-ui/styles';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import * as Yup from 'yup';

import CustomTooltip from '../../../components/CustomTooltip/CustomTooltip';
import { FormTextField, FormSubmitButton, FormSwitch } from '../../../components/Form';
import ErrorMessage from '../../../components/Message/ErrorMessage';
import { ToastContext } from '../../../components/Toast/ToastContext';
import { useCreateCategory } from '../../../hooks/queries/categoryQueries';
import { useFormServerErrors } from '../../../hooks/useFormServerErrors';
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
  btnWrapper: {
    marginTop: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

const schema = Yup.object({
  name: Yup.string().required(),
  slug: Yup.string().required(),
  description: Yup.string(),
  logo: rules.requiredImage,
  properties: rules.categoryProperties,
});

const formOpts = {
  mode: 'onChange',
  reValidateMode: 'onChange',
  shouldUnregister: false,
  defaultValues: {
    name: '',
    slug: '',
    description: '',
    logo: '',
    properties: [],
    isFeatured: false,
  },
  resolver: yupResolver(schema),
};

function CreateCategoryForm() {
  const classes = useStyles();
  const toast = useContext(ToastContext);

  const methods = useForm(formOpts);
  const { handleSubmit, setError, control, errors, getValues, setValue } = methods;
  const { fields, append, remove, swap } = useFieldArray({ name: 'properties', control });

  const createCategoryMutation = useCreateCategory();

  const onSubmit = values => {
    const { logo, properties, ...rest } = values;
    const formData = new FormData();

    formData.append('logo', logo);
    Object.keys(rest).forEach(name => {
      formData.append(name, rest[name]);
    });

    const propertiesList = properties?.map((p, idx) => {
      // eslint-disable-next-line no-unused-vars
      const { choices, ...withoutChoices } = p;
      const importance = idx + 1;

      if (p.type === 'bool') {
        return { ...withoutChoices, importance };
      }
      return { ...p, importance };
    });

    if (properties?.length > 0) {
      formData.append('properties', JSON.stringify(transformKeysToSnakeCase(propertiesList)));
    }

    createCategoryMutation.mutate(formData);
  };

  const onError = () => {
    toast.error('Form has errors, please check the details');
  };

  useFormServerErrors(createCategoryMutation?.error, setError);

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

        {createCategoryMutation?.isLoading && <CircularProgress />}
        {createCategoryMutation?.isError && <ErrorMessage message={createCategoryMutation?.error?.message} />}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
            <FormTextField name='name' fullWidth />
            <FormTextField name='slug' fullWidth />
            <FormTextField name='description' fullWidth />
            <FormSwitch name='isFeatured' />
            <CategoryLogoUploadField name='logo' />

            {fields?.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <div style={{ display: 'flex' }}>
                  <Typography variant='subtitle1' style={{ marginRight: '0.5rem' }}>
                    Properties
                  </Typography>
                  <CustomTooltip
                    title={
                      <Typography variant='body1'>
                        Drag & Drop cards to reorder the filter importance (high to low)
                      </Typography>
                    }
                  >
                    <HelpIcon color='primary' />
                  </CustomTooltip>
                </div>
                {fields.map((card, idx) => (
                  <PropertyCard {...{ key: card.id, card, idx, errors, remove, moveCard, getValues, control }} />
                ))}
              </div>
            )}

            <div className={classes.btnWrapper}>
              <Button
                variant='contained'
                size='small'
                className={classes.button}
                startIcon={<AddIcon />}
                onClick={() => append({ name: '', label: '', type: 'text', filterable: true, choices: [] })}
              >
                Add Property
              </Button>

              {fields?.length > 0 && (
                <Button
                  variant='contained'
                  size='small'
                  className={classes.button}
                  startIcon={<ClearAllIcon />}
                  // onClick={() => reset(formOpts.defaultValues)}
                  onClick={() => setValue('properties', formOpts.defaultValues.properties)}
                >
                  Reset
                </Button>
              )}
            </div>

            <FormSubmitButton className={classes.submit} fullWidth loading={createCategoryMutation?.isLoading}>
              Add category
            </FormSubmitButton>
          </form>
        </FormProvider>
      </div>
    </Container>
  );
}

export default CreateCategoryForm;
