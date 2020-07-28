// import React from 'react';
// import PropTypes from 'prop-types';
// import clsx from 'clsx';
// import {
//   Button,
//   TextField,
//   CircularProgress,
//   Card,
//   CardHeader,
//   CardContent,
//   CardActions,
//   Divider,
// } from '@material-ui/core';
// import { makeStyles } from '@material-ui/styles';
// import { Formik, Form } from 'formik';
// import { useSelector, useDispatch } from 'react-redux';

// import { identityActions, identitySelectors } from '../../../../redux/identity';
// import { changePasswordSchema } from './validation';
// import ErrorMessage from '../../../../components/message/ErrorMessage';
// import { useClearErrors } from '../../../../hooks';

// const useStyles = makeStyles(theme => ({
//   root: {},
// }));

// const initialValues = {
//   currentPassword: '',
//   password: '',
//   confirmPassword: '',
// };

// function AccountPassword(props) {
//   const { className, ...rest } = props;
//   const classes = useStyles();
//   const dispatch = useDispatch();

//   const [loading, error] = useSelector(identitySelectors.getChangePasswordUI);
//   useClearErrors();

//   return (
//     <Formik
//       initialValues={initialValues}
//       validationSchema={changePasswordSchema}
//       onSubmit={(values, actions) => {
//         dispatch(identityActions.changePassword(values));
//         actions.setSubmitting(false);
//       }}
//     >
//       {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
//         <Card {...rest} className={clsx(classes.root, className)}>
//           <CardHeader subheader='Change password' title='Password' />

//           {loading && <CircularProgress />}
//           {error && <ErrorMessage message={error.message} />}

//           <Form>
//             <Divider />
//             <CardContent>
//               <TextField
//                 id='currentPassword'
//                 name='currentPassword'
//                 label='Current Password'
//                 type='password'
//                 margin='normal'
//                 variant='outlined'
//                 value={values.currentPassword}
//                 error={touched.currentPassword && Boolean(errors.currentPassword)}
//                 helperText={touched.currentPassword ? errors.currentPassword : ''}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 fullWidth
//               />
//               <TextField
//                 id='password'
//                 name='password'
//                 label='Password'
//                 type='password'
//                 margin='normal'
//                 variant='outlined'
//                 value={values.password}
//                 error={touched.password && Boolean(errors.password)}
//                 helperText={touched.password ? errors.password : ''}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 fullWidth
//               />
//               <TextField
//                 id='confirmPassword'
//                 name='confirmPassword'
//                 label='Confirm Password'
//                 type='password'
//                 margin='normal'
//                 variant='outlined'
//                 value={values.confirmPassword}
//                 error={touched.confirmPassword && Boolean(errors.confirmPassword)}
//                 helperText={touched.confirmPassword ? errors.confirmPassword : ''}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 fullWidth
//               />
//             </CardContent>
//             <Divider />
//             <CardActions>
//               <Button type='submit' color='primary' variant='contained' disabled={isSubmitting} onSubmit={handleSubmit}>
//                 Change Password
//               </Button>
//             </CardActions>
//           </Form>
//         </Card>
//       )}
//     </Formik>
//   );
// }

// AccountPassword.propTypes = {
//   className: PropTypes.string,
// };

// export default AccountPassword;
