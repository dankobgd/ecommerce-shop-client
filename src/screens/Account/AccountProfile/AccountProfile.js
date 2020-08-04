import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardHeader,
  CardContent,
  Typography,
  Divider,
  Button,
  LinearProgress,
  CircularProgress,
} from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { useSelector, useDispatch } from 'react-redux';

import ErrorMessage from '../../../components/Message/ErrorMessage';
import AvatarInitials from './AvatarInitials';
import { userUploadAvatar, userDeleteAvatar, selectUserProfile } from '../../../store/user/userSlice';
import { selectUIState } from '../../../store/ui/ui';

const useStyles = makeStyles(theme => ({
  root: {},
  details: {
    display: 'flex',
  },
  pictureSection: {
    marginRight: 'auto',
  },
  infoSection: {
    paddingLeft: '2rem',
    paddingRight: '2rem',
  },
  avatar: {
    height: 125,
    width: 125,
    flexShrink: 0,
    flexGrow: 0,
  },
  progress: {
    marginTop: theme.spacing(2),
  },
  uploadButton: {
    marginRight: theme.spacing(2),
  },
}));

function AccountProfile(props) {
  const { className, ...rest } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const { loading: loadingUpload, error: errorUpload } = useSelector(selectUIState(userUploadAvatar));
  const { loading: loadingDelete, error: errorDelete } = useSelector(selectUIState(userDeleteAvatar));
  const user = useSelector(selectUserProfile);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.avatarUrl);

  const handleFileChange = e => {
    e.preventDefault();
    setSelectedFile(e.target.files[0]);
    setPreviewUrl(URL.createObjectURL(e.target.files[0]));
  };

  const handleUploadAvatar = e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('avatar', selectedFile);
    dispatch(userUploadAvatar(formData));
  };

  const handleDeleteAvatar = e => {
    e.preventDefault();
    dispatch(userDeleteAvatar());
  };

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader title='Avatar' />
      <Divider />
      <CardContent>
        {errorUpload && <ErrorMessage message={errorUpload.message} />}
        {errorDelete && <ErrorMessage message={errorDelete.message} />}

        <div className={classes.details}>
          <div className={classes.pictureSection}>
            <AvatarInitials user={user} avatar={user?.avatarUrl} previewUrl={previewUrl} />
          </div>
          <div className={classes.infoSection}>
            <Typography gutterBottom variant='h2'>
              {user?.username}
            </Typography>
            <Typography className={classes.locationText} color='textSecondary' variant='body1'>
              {user?.email}
            </Typography>
          </div>
        </div>

        {loadingUpload && (
          <div className={classes.progress}>
            <LinearProgress variant='indeterminate' />
          </div>
        )}
        {loadingDelete && (
          <div className={classes.progress}>
            <CircularProgress variant='indeterminate' />
          </div>
        )}
      </CardContent>
      <Divider />
      <CardActions>
        <Button
          type='button'
          name='upload'
          component='label'
          variant='contained'
          color='primary'
          className={classes.uploadButton}
        >
          Upload Avatar
          <CloudUploadIcon className={classes.rightIcon} />
          <input style={{ display: 'none' }} type='file' name='avatar' accept='image/*' onChange={handleFileChange} />
        </Button>

        {previewUrl && previewUrl !== user.avatarUrl && (
          <Button type='button' color='primary' variant='contained' onClick={handleUploadAvatar}>
            Save Avatar
          </Button>
        )}

        {user?.avatarUrl && (
          <Button type='button' variant='text' onClick={handleDeleteAvatar}>
            Delete avatar
          </Button>
        )}
      </CardActions>
    </Card>
  );
}

export default AccountProfile;
