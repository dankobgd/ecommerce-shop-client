import React, { useContext } from 'react';

import { yupResolver } from '@hookform/resolvers';
import { Avatar, Button, CircularProgress, Container, Tooltip, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CategoryIcon from '@material-ui/icons/Category';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import HelpIcon from '@material-ui/icons/Help';
import { makeStyles, withStyles } from '@material-ui/styles';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { useMutation, useQueryCache } from 'react-query';
import * as Yup from 'yup';

import api from '../../../api';
import { FormTextField, FormSubmitButton, FormSwitch } from '../../../components/Form';
import ErrorMessage from '../../../components/Message/ErrorMessage';
import { useFormServerErrors } from '../../../hooks/useFormServerErrors';
import { ToastContext } from '../../../store/toast/toast';
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
  properties: rules.properties,
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
  const cache = useQueryCache();

  const methods = useForm(formOpts);
  const { handleSubmit, setError, control, errors, getValues, setValue } = methods;
  const { fields, append, remove, swap } = useFieldArray({ name: 'properties', control });

  const [createCategory, { isLoading, isError, error }] = useMutation(formData => api.categories.create(formData), {
    onMutate: formData => {
      cache.cancelQueries('categories');
      const previousValue = cache.getQueryData('categories');
      cache.setQueryData('categories', old => ({
        ...old,
        formData,
      }));
      return previousValue;
    },
    onSuccess: () => {
      toast.success('Category created');
    },
    onError: (_, __, previousValue) => {
      cache.setQueryData('categories', previousValue);
      toast.error('Form has errors, please check the details');
    },
    onSettled: () => {
      cache.invalidateQueries('categories');
    },
  });

  const onSubmit = async values => {
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

    await createCategory(formData);
  };

  const onError = () => {
    toast.error('Form has errors, please check the details');
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

        {isLoading && <CircularProgress />}
        {isError && <ErrorMessage message={error.message} />}

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

            <FormSubmitButton className={classes.submit} fullWidth loading={isLoading}>
              Add category
            </FormSubmitButton>
          </form>
        </FormProvider>
      </div>
    </Container>
  );
}

const CustomTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 350,
    fontSize: theme.typography.pxToRem(16),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

export default CreateCategoryForm;
