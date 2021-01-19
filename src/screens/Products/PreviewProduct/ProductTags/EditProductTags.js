import React, { useContext } from 'react';

import { Avatar, CircularProgress, Container, Typography } from '@material-ui/core';
import LabelIcon from '@material-ui/icons/Label';
import { makeStyles } from '@material-ui/styles';
import { FormProvider, useForm } from 'react-hook-form';

import { FormSubmitButton, FormAutoComplete } from '../../../../components/Form';
import ErrorMessage from '../../../../components/Message/ErrorMessage';
import { ToastContext } from '../../../../components/Toast/ToastContext';
import { useUpdateProductTags, useProductTags } from '../../../../hooks/queries/productQueries';
import { useTags } from '../../../../hooks/queries/tagQueries';
import { useFormServerErrors } from '../../../../hooks/useFormServerErrors';
import { diff, isEmptyObject } from '../../../../utils/diff';

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

const formOpts = {
  mode: 'onChange',
  reValidateMode: 'onChange',
  defaultValues: {
    tags: [],
  },
};

function EditProductTags({ productId }) {
  const classes = useStyles();
  const toast = useContext(ToastContext);
  const [baseFormObj, setBaseFormObj] = React.useState({});

  const methods = useForm(formOpts);
  const { handleSubmit, setError, reset } = methods;

  const { data: tags } = useTags();
  const { data: productTags } = useProductTags(productId);

  const editProductTagsMutation = useUpdateProductTags(productId);

  const onSubmit = values => {
    const changes = diff(baseFormObj, values);

    if (isEmptyObject(changes)) {
      toast.info('No changes applied');
    }
    if (!isEmptyObject(changes)) {
      const tagIds = values?.tags?.map(x => x.tagId || x.id);
      editProductTagsMutation.mutate(tagIds);
    }
  };

  const onError = () => {
    toast.error('Form has errors, please check the details');
  };

  useFormServerErrors(editProductTagsMutation?.error, setError);

  React.useEffect(() => {
    if (productTags) {
      setBaseFormObj({ tags: productTags });
      reset({ tags: productTags });
    }
  }, [productTags, reset]);

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LabelIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Edit Tags
        </Typography>

        {editProductTagsMutation?.isLoading && <CircularProgress />}
        {editProductTagsMutation?.isError && <ErrorMessage message={editProductTagsMutation?.error?.message} />}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
            <FormAutoComplete
              filterSelectedOptions
              multiple
              name='tags'
              options={tags?.data || []}
              getOptionLabel={option => option?.name || ''}
              getOptionSelected={(option, value) => option?.name === value?.name}
              fullWidth
            />

            <FormSubmitButton className={classes.submit} fullWidth loading={editProductTagsMutation?.isLoading}>
              Update Tags
            </FormSubmitButton>
          </form>
        </FormProvider>
      </div>
    </Container>
  );
}

export default EditProductTags;
