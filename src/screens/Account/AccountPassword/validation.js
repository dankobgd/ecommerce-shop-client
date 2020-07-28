import * as Yup from 'yup';

export const changePasswordSchema = Yup.object({
  currentPassword: Yup.string('Enter current password')
    .min(3, 'Password must contain atleast 3 characters')
    .required('Enter current password'),
  password: Yup.string('Enter new password')
    .min(3, 'Password must contain atleast 3 characters')
    .required('Enter new password'),
  confirmPassword: Yup.string('Confirm your password')
    .required('Confirm your password')
    .oneOf([Yup.ref('password')], 'Password does not match'),
});
