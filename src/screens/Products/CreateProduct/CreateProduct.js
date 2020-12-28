import React, { useContext } from 'react';

import { yupResolver } from '@hookform/resolvers';
import { Avatar, CircularProgress, Container, Typography } from '@material-ui/core';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import { makeStyles } from '@material-ui/styles';
import { FormProvider, useForm } from 'react-hook-form';
import * as Yup from 'yup';

import {
  FormTextField,
  FormSwitch,
  FormSubmitButton,
  FormAutoComplete,
  FormNumberField,
  FormCheckbox,
} from '../../../components/Form';
import ErrorMessage from '../../../components/Message/ErrorMessage';
import { ToastContext } from '../../../components/Toast/ToastContext';
import { useBrands } from '../../../hooks/queries/brandQueries';
import { useCategories } from '../../../hooks/queries/categoryQueries';
import { useCreateProduct } from '../../../hooks/queries/productQueries';
import { useTags } from '../../../hooks/queries/tagQueries';
import { useFormServerErrors } from '../../../hooks/useFormServerErrors';
import { priceToLowestCurrencyDenomination } from '../../../utils/priceFormat';
import { transformKeysToSnakeCase } from '../../../utils/transformObjectKeys';
import { rules } from '../../../utils/validation';
import { ProductImagesDropzoneField, ProductThumbnailUploadField } from './FileUploadInputs';

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
  brandId: Yup.object()
    .test('required', 'brand is a required field', value => !!value)
    .nullable(),
  categoryId: Yup.object()
    .test('required', 'category is a required field', value => !!value)
    .nullable(),
  name: Yup.string().required(),
  slug: Yup.string().required(),
  description: Yup.string(),
  price: Yup.string().required(),
  inStock: Yup.boolean().required(),
  isFeatured: Yup.boolean().required(),
  image: rules.requiredImage,
  // properties: rules.productProperties,
});

const formOpts = {
  mode: 'onChange',
  reValidateMode: 'onChange',
  defaultValues: {
    brandId: null,
    categoryId: null,
    name: '',
    slug: '',
    description: '',
    // price: '',
    inStock: true,
    isFeatured: false,
    image: '',
    properties: null,
    tags: [],
    images: [],
    Pricing: {
      price: '',
    },
  },
  resolver: yupResolver(schema),
};

const renderPropertyInputType = property => {
  if (property.type === 'text') {
    return (
      <FormAutoComplete
        key={property.name}
        name={`properties.${property.name}`}
        label={property.label}
        options={property.choices}
        getOptionLabel={option => option.name || ''}
        getOptionSelected={(option, value) => option.name === value.name}
        fullWidth
      />
    );
  }
  // @TODO: init default form property vals to fix uncontroll field err
  if (property.type === 'bool') {
    return <FormCheckbox key={property.name} name={`properties.${property.name}`} label={property.label} fullWidth />;
  }
  return null;
};

const CategoryProperties = ({ chosenCategory }) => {
  const properties = chosenCategory?.properties
    ? chosenCategory?.properties.filter(x => Boolean(x.filterable)).sort((a, b) => a.importance - b.importance)
    : [];

  return (
    properties.length > 0 && (
      <div style={{ marginTop: '1rem' }}>
        <Typography variant='subtitle1'>Properties</Typography>
        {properties.map(prop => renderPropertyInputType(prop))}
      </div>
    )
  );
};

function CreateProductForm() {
  const classes = useStyles();
  const toast = useContext(ToastContext);

  const methods = useForm(formOpts);
  const { handleSubmit, setError, watch } = methods;

  const { data: brandsList } = useBrands();
  const { data: tagsList } = useTags();
  const { data: categoriesList } = useCategories();

  const createProductMutation = useCreateProduct();

  const chosenCategory = watch('categoryId');

  const onSubmit = values => {
    const { brandId, categoryId, tags, image, images, properties, price, ...rest } = values;
    const formData = new FormData();

    const fields = transformKeysToSnakeCase(rest);

    formData.append('price', priceToLowestCurrencyDenomination(Number.parseFloat(price)));
    formData.append('image', image);
    formData.append('brand_id', brandId.id);
    formData.append('category_id', categoryId.id);
    Object.keys(fields).forEach(name => {
      formData.append(name, fields[name]);
    });
    Object.values(images).forEach(img => {
      formData.append('images', img);
    });
    tags.forEach(tag => {
      formData.append('tags', tag.id);
    });
    if (properties) {
      formData.append('properties', JSON.stringify(transformKeysToSnakeCase(properties)));
    }

    createProductMutation.mutate(formData);
  };

  const onError = () => {
    toast.error('Form has errors, please check the details');
  };

  useFormServerErrors(createProductMutation?.error, setError);

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <ShoppingBasketIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Create Product
        </Typography>

        {createProductMutation?.isLoading && <CircularProgress />}
        {createProductMutation?.isError && <ErrorMessage message={createProductMutation?.error?.message} />}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
            <BrandDropdown fullWidth options={brandsList?.data || []} />
            <CategoryDropdown fullWidth options={categoriesList?.data || []} />
            <FormTextField name='name' fullWidth />
            <FormTextField name='slug' fullWidth />
            <FormTextField name='description' fullWidth />
            <FormNumberField name='price' fullWidth prefix='$' />
            <FormSwitch name='inStock' />
            <FormSwitch name='isFeatured' />
            <ProductThumbnailUploadField name='image' />
            <TagsDropdown fullWidth options={tagsList?.data || []} />
            <ProductImagesDropzoneField name='images' />
            <CategoryProperties chosenCategory={chosenCategory} />

            <FormSubmitButton className={classes.submit} fullWidth loading={createProductMutation?.isLoading}>
              Add product
            </FormSubmitButton>
          </form>
        </FormProvider>
      </div>
    </Container>
  );
}

const getOptionLabel = option => option.name || '';
const getOptionSelected = (option, value) => option.id === value.id;

const BrandDropdown = ({ options, ...rest }) => (
  <FormAutoComplete
    {...rest}
    name='brandId'
    label='Brand'
    options={options}
    getOptionLabel={getOptionLabel}
    getOptionSelected={getOptionSelected}
  />
);

const CategoryDropdown = ({ options, ...rest }) => (
  <FormAutoComplete
    {...rest}
    name='categoryId'
    label='Category'
    options={options}
    getOptionLabel={getOptionLabel}
    getOptionSelected={getOptionSelected}
  />
);
const TagsDropdown = ({ options, ...rest }) => (
  <FormAutoComplete
    {...rest}
    multiple
    name='tags'
    options={options}
    getOptionLabel={getOptionLabel}
    getOptionSelected={getOptionSelected}
  />
);

export default CreateProductForm;
