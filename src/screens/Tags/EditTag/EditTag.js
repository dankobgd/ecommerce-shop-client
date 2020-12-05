import React, { useContext } from 'react';

import { yupResolver } from '@hookform/resolvers';
import { Avatar, CircularProgress, Container, Typography } from '@material-ui/core';
import LabelIcon from '@material-ui/icons/Label';
import { makeStyles } from '@material-ui/styles';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryCache } from 'react-query';
import * as Yup from 'yup';

import api from '../../../api';
import { FormTextField, FormSubmitButton } from '../../../components/Form';
import ErrorMessage from '../../../components/Message/ErrorMessage';
import { useFormServerErrors } from '../../../hooks/useFormServerErrors';
import { ToastContext } from '../../../store/toast/toast';
import { diff } from '../../../utils/diff';

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
  description: Yup.string(),
});

const formOpts = {
  mode: 'onChange',
  reValidateMode: 'onChange',
  defaultValues: {
    name: '',
    slug: '',
    description: '',
  },
  resolver: yupResolver(schema),
};

function EditTagForm({ tagId }) {
  const classes = useStyles();
  const cache = useQueryCache();
  const toast = useContext(ToastContext);
  const [baseFormObj, setBaseFormObj] = React.useState({});

  const methods = useForm(formOpts);
  const { handleSubmit, setError, reset } = methods;

  const { data: tag } = useQuery(['tags', tagId], () => api.tags.get(tagId), {
    initialData: () => cache.getQueryData('tags')?.data?.find(x => x.id === tagId),
  });

  const [editTag, { isLoading, isError, error }] = useMutation(({ id, values }) => api.tags.update(id, values), {
    onMutate: values => {
      cache.cancelQueries(['tags', tagId]);
      const previousValue = cache.getQueryData(['tags', tagId]);
      cache.setQueryData(['tags', tagId], values);
      return previousValue;
    },
    onSuccess: () => {
      toast.success('Tag updated');
    },
    onError: (_, __, previousValue) => {
      cache.setQueryData(['tags', tagId], previousValue);
      toast.error('Form has errors, please check the details');
    },
    onSettled: () => {
      cache.invalidateQueries(['tags', tagId]);
    },
  });

  const onSubmit = async values => {
    const changes = diff(baseFormObj, values);

    if (Object.keys(changes).length === 0) {
      toast.info('No changes applied');
    }

    if (Object.keys(changes).length > 0) {
      await editTag({ id: tag.id, values });
    }
  };

  const onError = () => {
    toast.error('Form has errors, please check the details');
  };

  React.useEffect(() => {
    if (tag) {
      setBaseFormObj(tag);
      reset(tag);
    }
  }, [tag, reset]);

  useFormServerErrors(error, setError);

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LabelIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Edit Tag
        </Typography>

        {isLoading && <CircularProgress />}
        {isError && <ErrorMessage message={error.message} />}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
            <FormTextField name='id' fullWidth inputProps={{ readOnly: true }} disabled />
            <FormTextField name='name' fullWidth />
            <FormTextField name='slug' fullWidth />
            <FormTextField name='description' fullWidth />
            <FormSubmitButton className={classes.submit} fullWidth loading={isLoading}>
              Save Changes
            </FormSubmitButton>
          </form>
        </FormProvider>
      </div>
    </Container>
  );
}

export default EditTagForm;
