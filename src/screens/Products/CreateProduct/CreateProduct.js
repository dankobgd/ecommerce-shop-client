import React from 'react';

import { yupResolver } from '@hookform/resolvers';
import { Avatar, CircularProgress, Container, Typography } from '@material-ui/core';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import { makeStyles } from '@material-ui/styles';
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
import { productCreate } from '../../../store/product/productSlice';
import { tagGetAll, selectAllTags } from '../../../store/tag/tagSlice';
import { selectUIState } from '../../../store/ui';
import { transformKeysToSnakeCase } from '../../../utils/transformObjectKeys';
import { ProductImagesDropzone, ProductSingleUpload } from './FileUploadInputs';

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

const schema = Yup.object({});

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
  },
  resolver: yupResolver(schema),
};

function CreateProductForm() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const methods = useForm(formOpts);
  const { handleSubmit, setError } = methods;
  const { loading, error } = useSelector(selectUIState(productCreate));
  const tagList = useSelector(selectAllTags);
  const brandList = useSelector(selectAllBrands);
  const categoryList = useSelector(selectAllCategories);

  React.useEffect(() => {
    async function fetchDropdownValues() {
      await Promise.all([dispatch(brandGetAll()), dispatch(categoryGetAll()), dispatch(tagGetAll())]);
    }
    fetchDropdownValues();
  }, [dispatch]);

  const onSubmit = async data => {
    const { brandId, categoryId, tags, image, images, ...rest } = data;
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
            <ProductSingleUpload />
            <ProductImagesDropzone />

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
