import React from 'react';

import { yupResolver } from '@hookform/resolvers';
import { Avatar, CircularProgress, Container, Typography } from '@material-ui/core';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import { makeStyles } from '@material-ui/styles';
import { nanoid } from 'nanoid';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import {
  FormTextField,
  FormSwitch,
  FormSubmitButton,
  FormAutoComplete,
  FormNumberField,
} from '../../../components/Form';
import ErrorMessage from '../../../components/Message/ErrorMessage';
import { useFormServerErrors } from '../../../hooks/useFormServerErrors';
import { brandGetAll, selectAllBrands } from '../../../store/brand/brandSlice';
import { categoryGetAll, selectAllCategories } from '../../../store/category/categorySlice';
import { productCreate, productGetProperties, selectProductProperties } from '../../../store/product/productSlice';
import { tagGetAll, selectAllTags } from '../../../store/tag/tagSlice';
import { selectUIState } from '../../../store/ui';
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
  description: Yup.string().required(),
  price: Yup.string().required(),
  inStock: Yup.boolean().required(),
  isFeatured: Yup.boolean().required(),
  image: rules.imageRule,
});

const formOpts = {
  mode: 'onChange',
  reValidateMode: 'onChange',
  defaultValues: {
    // discountId: '',
    brandId: null,
    categoryId: null,
    name: '',
    slug: '',
    description: '',
    price: '',
    inStock: true,
    isFeatured: false,
    tags: [],
    image: '',
    images: [],
    properties: null,
  },
  resolver: yupResolver(schema),
};

function renderCategoryProperties(chosenCategory, validProperties) {
  const opts = chosenCategory && validProperties[chosenCategory.name];
  const createLabel = name => `${chosenCategory?.name.charAt(0).toUpperCase() + chosenCategory?.name.slice(1)} ${name}`;

  return opts
    ? Object.keys(opts).map(key => (
        <FormAutoComplete
          getOptionSelected={(option, value) => (value ? option === value : true)}
          key={nanoid()}
          name={`properties.${key}`}
          label={createLabel(key)}
          options={opts[key] || []}
          fullWidth
        />
      ))
    : null;
}

function CreateProductForm() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const methods = useForm(formOpts);
  const { handleSubmit, setError, watch } = methods;
  const { loading, error } = useSelector(selectUIState(productCreate));
  const tagList = useSelector(selectAllTags);
  const brandList = useSelector(selectAllBrands);
  const categoryList = useSelector(selectAllCategories);
  const validProperties = useSelector(selectProductProperties);
  const chosenCategory = watch('categoryId');

  React.useEffect(() => {
    async function fetchDropdownValues() {
      await Promise.all([
        dispatch(productGetProperties()),
        dispatch(brandGetAll()),
        dispatch(categoryGetAll()),
        dispatch(tagGetAll()),
      ]);
    }
    fetchDropdownValues();
  }, [dispatch]);

  const onSubmit = async data => {
    const { brandId, categoryId, tags, image, images, properties, ...rest } = data;
    const formData = new FormData();
    const fields = transformKeysToSnakeCase(rest);

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
    formData.append('properties', JSON.stringify(transformKeysToSnakeCase(properties)));

    await dispatch(productCreate(formData));
  };

  useFormServerErrors(error, setError);

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <ShoppingBasketIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Create Product
        </Typography>

        {loading && <CircularProgress />}
        {error && <ErrorMessage message={error.message} />}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <BrandDropdown fullWidth options={brandList} />
            <CategoryDropdown fullWidth options={categoryList} />
            <FormTextField name='name' fullWidth />
            <FormTextField name='slug' fullWidth />
            <FormTextField name='description' fullWidth />
            <FormNumberField name='price' fullWidth />
            <FormSwitch name='inStock' />
            <FormSwitch name='isFeatured' />
            <TagsDropdown fullWidth options={tagList} />
            <ProductThumbnailUploadField name='image' />
            <ProductImagesDropzoneField name='images' />

            {renderCategoryProperties(chosenCategory, validProperties)}

            <FormSubmitButton className={classes.submit} fullWidth>
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
