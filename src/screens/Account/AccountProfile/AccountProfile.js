// import React, { useState } from 'react';
// import clsx from 'clsx';
// import { makeStyles } from '@material-ui/styles';
// import {
//   Card,
//   CardActions,
//   CardHeader,
//   CardContent,
//   Avatar,
//   Typography,
//   Divider,
//   Button,
//   LinearProgress,
// } from '@material-ui/core';
// import CloudUploadIcon from '@material-ui/icons/CloudUpload';
// import { useSelector, useDispatch } from 'react-redux';

// import { identityActions, identitySelectors } from '../../../../redux/identity';

// const useStyles = makeStyles(theme => ({
//   root: {},
//   details: {
//     display: 'flex',
//   },
//   avatar: {
//     marginLeft: 'auto',
//     height: 110,
//     width: 100,
//     flexShrink: 0,
//     flexGrow: 0,
//   },
//   progress: {
//     marginTop: theme.spacing(2),
//   },
//   uploadButton: {
//     marginRight: theme.spacing(2),
//   },
// }));

// const AccountProfile = props => {
//   const { className, ...rest } = props;
//   const classes = useStyles();
//   const dispatch = useDispatch();
//   const user = useSelector(identitySelectors.getUser);

//   const [avatarFile, setAvatarFile] = useState(null);

//   const handleFileChange = e => {
//     e.preventDefault();
//     setAvatarFile(e.target.files[0]);
//   };

//   const handleSaveAvatar = () => {
//     const formData = new FormData();
//     formData.append('avatar', avatarFile);
//     dispatch(identityActions.uploadAvatar(formData));
//   };

//   const handleDeleteAvatar = () => {
//     dispatch(identityActions.deleteAvatar(user.avatar));
//   };

//   return (
//     <Card {...rest} className={clsx(classes.root, className)}>
//       <CardHeader subheader='User profile information' title='Profile' />
//       <Divider />
//       <CardContent>
//         <div className={classes.details}>
//           <div>
//             <Typography gutterBottom variant='h2'>
//               {user.username}
//             </Typography>
//             <Typography className={classes.locationText} color='textSecondary' variant='body1'>
//               {user.email}, {user.role}
//             </Typography>
//             <Typography className={classes.dateText} color='textSecondary' variant='body1'>
//               {new Date().toUTCString()}
//             </Typography>
//           </div>
//           <Avatar className={classes.avatar} src={user.avatar || 'https://i.pravatar.cc/200?img=19'} />
//         </div>
//         <div className={classes.progress}>
//           <Typography variant='body1'>Profile Completeness: 70%</Typography>
//           <LinearProgress value={70} variant='determinate' />
//         </div>
//       </CardContent>
//       <Divider />
//       <CardActions>
//         <Button
//           component='label'
//           variant='contained'
//           color='primary'
//           className={classes.uploadButton}
//           disabled={false}
//           onClick={() => null}
//         >
//           Upload Avatar
//           <CloudUploadIcon className={classes.rightIcon} />
//           <input style={{ display: 'none' }} type='file' name='avatar' accept='image/*' onChange={handleFileChange} />
//         </Button>

//         <Button onClick={handleSaveAvatar}>SAVE AVATAR</Button>

//         <Button onClick={handleDeleteAvatar} variant='text'>
//           Delete avatar
//         </Button>
//       </CardActions>
//     </Card>
//   );
// };

// export default AccountProfile;
