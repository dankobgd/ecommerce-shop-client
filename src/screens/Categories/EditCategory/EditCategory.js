import React, { useContext } from 'react';

import { yupResolver } from '@hookform/resolvers';
import { Avatar, Button, CircularProgress, Container, Tooltip, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CategoryIcon from '@material-ui/icons/Category';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import HelpIcon from '@material-ui/icons/Help';
import { makeStyles, withStyles } from '@material-ui/styles';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryCache } from 'react-query';
import * as Yup from 'yup';

import api from '../../../api';
import { FormTextField, FormSubmitButton, FormSwitch } from '../../../components/Form';
import ErrorMessage from '../../../components/Message/ErrorMessage';
import { useFormServerErrors } from '../../../hooks/useFormServerErrors';
import { ToastContext } from '../../../store/toast/toast';
import { diff } from '../../../utils/diff';
import { transformKeysToSnakeCase } from '../../../utils/transformObjectKeys';
import { rules } from '../../../utils/validation';
import PropertyCard from '../CreateCategory/PropertyCard';
import { CategoryLogoUploadField } from './FileUploadInputs';

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
  logo: rules.optionalImage,
  description: Yup.string(),
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
    isFeatured: false,
    properties: [],
  },
  resolver: yupResolver(schema),
};

function EditCategoryForm({ categoryId }) {
  const classes = useStyles();
  const cache = useQueryCache();
  const toast = useContext(ToastContext);
  const [baseFormObj, setBaseFormObj] = React.useState({});

  const methods = useForm(formOpts);
  const { handleSubmit, control, setError, errors, getValues, setValue, reset } = methods;
  const { fields, append, remove, swap } = useFieldArray({ name: 'properties', control });

  const { data: category } = useQuery(['categories', categoryId], () => api.categories.get(categoryId), {
    initialData: () => cache.getQueryData('categories')?.data?.find(x => x.id === categoryId),
  });

  const [editCategory, { isLoading, isError, error }] = useMutation(
    ({ id, formData }) => api.categories.update(id, formData),
    {
      onMutate: formData => {
        cache.cancelQueries(['categories', categoryId]);
        const previousValue = cache.getQueryData(['categories', categoryId]);
        cache.setQueryData(['categories', categoryId], formData);
        return previousValue;
      },
      onSuccess: () => {
        toast.success('Category updated');
      },
      onError: (_, __, previousValue) => {
        cache.setQueryData(['categories', categoryId], previousValue);
        toast.error('Form has errors, please check the details');
      },
      onSettled: () => {
        cache.invalidateQueries(['categories', categoryId]);
      },
    }
  );

  const onSubmit = async values => {
    const changes = diff(baseFormObj, values);
    const { properties } = values;
    const { logo, ...rest } = changes;
    const formData = new FormData();

    if (logo) {
      formData.append('logo', logo);
    }
    Object.keys(rest).forEach(name => {
      formData.append(name, rest[name]);
    });

    if (Object.keys(changes).length === 0) {
      toast.info('No changes applied');
    }

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
    } else {
      formData.append('properties', '');
    }

    if (Object.keys(changes).length > 0) {
      await editCategory({ id: category.id, formData });
    }
  };

  const onError = () => {
    toast.error('Form has errors, please check the details');
  };

  React.useEffect(() => {
    if (category) {
      // eslint-disable-next-line no-unused-vars
      const { logo, properties, ...rest } = category;
      const obj = { ...rest, logo: '', properties: properties || [] };

      setBaseFormObj(obj);
      reset(obj);
    }
  }, [category, reset]);

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
          Edit Category
        </Typography>

        {isLoading && <CircularProgress />}
        {isError && <ErrorMessage message={error.message} />}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
            <FormTextField name='id' fullWidth inputProps={{ readOnly: true }} disabled />
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
                  onClick={() => setValue('properties', formOpts.defaultValues.properties)}
                >
                  Reset
                </Button>
              )}
            </div>

            <FormSubmitButton className={classes.submit} fullWidth loading={isLoading}>
              Save Changes
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

export default EditCategoryForm;
