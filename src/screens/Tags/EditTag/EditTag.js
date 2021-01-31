import React, { useContext } from 'react';

import { yupResolver } from '@hookform/resolvers';
import { Avatar, CircularProgress, Container, Typography } from '@material-ui/core';
import LabelIcon from '@material-ui/icons/Label';
import { makeStyles } from '@material-ui/styles';
import { FormProvider, useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { FormTextField, FormSubmitButton } from '../../../components/Form';
import ErrorMessage from '../../../components/Message/ErrorMessage';
import { ToastContext } from '../../../components/Toast/ToastContext';
import { useTag, useUpdateTag } from '../../../hooks/queries/tagQueries';
import { useFormServerErrors } from '../../../hooks/useFormServerErrors';
import { diff, isEmptyObject } from '../../../utils/diff';

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
  const toast = useContext(ToastContext);
  const [baseFormObj, setBaseFormObj] = React.useState({});

  const methods = useForm(formOpts);
  const { handleSubmit, setError, reset } = methods;

  const { data: tag } = useTag(tagId);

  const editTagMutation = useUpdateTag(tagId);

  const onSubmit = values => {
    const changes = diff(baseFormObj, values);

    if (isEmptyObject(changes)) {
      toast.info('No changes applied');
    }
    if (!isEmptyObject(changes)) {
      editTagMutation.mutate(changes);
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

  useFormServerErrors(editTagMutation?.error, setError);

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LabelIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Edit Tag
        </Typography>

        {editTagMutation?.isLoading && <CircularProgress />}
        {editTagMutation?.isError && <ErrorMessage message={editTagMutation?.error?.message} />}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
            <FormTextField name='id' fullWidth inputProps={{ readOnly: true }} disabled />
            <FormTextField name='name' fullWidth />
            <FormTextField name='slug' fullWidth />
            <FormTextField name='description' multiline fullWidth rows={5} />
            <FormSubmitButton className={classes.submit} fullWidth loading={editTagMutation?.isLoading}>
              Save Changes
            </FormSubmitButton>
          </form>
        </FormProvider>
      </div>
    </Container>
  );
}

export default EditTagForm;
