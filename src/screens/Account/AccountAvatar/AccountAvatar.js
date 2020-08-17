import React, { useState } from 'react';

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
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';

import AvatarFallback from '../../../components/AvatarFallback/AvatarFallback';
import ErrorMessage from '../../../components/Message/ErrorMessage';
import { selectUIState } from '../../../store/ui';
import { userUploadAvatar, userDeleteAvatar, selectUserProfile } from '../../../store/user/userSlice';

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

function AccountAvatar(props) {
  const { className, ...rest } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const { loading: loadingUpload, error: errorUpload } = useSelector(selectUIState(userUploadAvatar));
  const { loading: loadingDelete, error: errorDelete } = useSelector(selectUIState(userDeleteAvatar));
  const user = useSelector(selectUserProfile);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [showUploadButton, setShowUploadButton] = useState(false);

  const handleFileChange = e => {
    e.preventDefault();
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadAvatar = async e => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('avatar', selectedFile);
    try {
      await dispatch(userUploadAvatar(formData));
      // eslint-disable-next-line no-empty
    } catch (error) {
    } finally {
      setShowUploadButton(false);
    }
  };

  const handleDeleteAvatar = e => {
    e.preventDefault();
    dispatch(userDeleteAvatar());
  };

  React.useEffect(() => {
    if (user) {
      setPreviewUrl(user?.avatarUrl);
    }
  }, [user]);

  React.useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl('');
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    setShowUploadButton(true);

    return () => {
      URL.revokeObjectURL(objectUrl);
      setShowUploadButton(false);
    };
  }, [selectedFile]);

  let url;
  if (user?.avatarUrl && !previewUrl) {
    url = user?.avatarUrl;
  } else if (user?.avatarUrl && previewUrl) {
    url = previewUrl;
  } else if (!user?.avatarUrl && previewUrl) {
    url = previewUrl;
  }

  const avatarName = user ? `${user.firstName} ${user.lastName}` : '';

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader title='Avatar' />
      <Divider />
      <CardContent>
        {errorUpload && <ErrorMessage message={errorUpload.message} />}
        {errorDelete && <ErrorMessage message={errorDelete.message} />}

        <div className={classes.details}>
          <div className={classes.pictureSection}>
            <AvatarFallback name={avatarName} url={url} size={125} />
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

        {showUploadButton && (
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

export default AccountAvatar;
