import React, { useContext } from 'react';

import { yupResolver } from '@hookform/resolvers';
import { Avatar, CircularProgress, Container, Typography } from '@material-ui/core';
import LabelIcon from '@material-ui/icons/Label';
import { makeStyles } from '@material-ui/styles';
import { FormProvider, useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { FormSubmitButton, FormAutoComplete } from '../../../../components/Form';
import ErrorMessage from '../../../../components/Message/ErrorMessage';
import { ToastContext } from '../../../../components/Toast/ToastContext';
import { useCreateProductTag, useProductTags } from '../../../../hooks/queries/productQueries';
import { useTags } from '../../../../hooks/queries/tagQueries';
import { useFormServerErrors } from '../../../../hooks/useFormServerErrors';

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
  tagId: Yup.object()
    .test('required', 'tag is a required field', value => !!value)
    .nullable(),
});

const formOpts = {
  mode: 'onChange',
  reValidateMode: 'onChange',
  defaultValues: {
    tagId: null,
  },
  resolver: yupResolver(schema),
};

function CreateProductTag({ productId }) {
  const classes = useStyles();
  const toast = useContext(ToastContext);

  const methods = useForm(formOpts);
  const { handleSubmit, setError, reset } = methods;

  const { data: tags } = useTags();
  const { data: productTags } = useProductTags(productId);
  const options = tags?.data?.filter(t => !productTags?.some(pt => pt.tagId === t.id)) ?? [];

  const createProductTagMutation = useCreateProductTag(productId);

  const onSubmit = values => {
    const payload = { tag_id: values.tagId.id };
    createProductTagMutation.mutate(payload, {
      onSuccess: () => reset(),
    });
  };

  const onError = () => {
    toast.error('Form has errors, please check the details');
  };

  useFormServerErrors(createProductTagMutation?.error, setError);

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LabelIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Create Tag
        </Typography>

        {createProductTagMutation?.isLoading && <CircularProgress />}
        {createProductTagMutation?.isError && <ErrorMessage message={createProductTagMutation?.error?.message} />}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
            <FormAutoComplete
              name='tagId'
              label='Tag'
              options={options}
              getOptionLabel={option => option?.name || ''}
              getOptionSelected={(option, value) => option?.id === value?.id}
              fullWidth
            />

            <FormSubmitButton className={classes.submit} fullWidth loading={createProductTagMutation?.isLoading}>
              Add Tag
            </FormSubmitButton>
          </form>
        </FormProvider>
      </div>
    </Container>
  );
}

export default CreateProductTag;
