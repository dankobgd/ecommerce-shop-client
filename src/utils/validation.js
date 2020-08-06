import * as Yup from 'yup';

export const regexes = {
  uppercase: /^(?=.*?[A-Z])/,
  lowercase: /^(?=.*?[a-z])/,
  number: /^(?=.*?[0-9])/,
  symbol: /^(?=.*?[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/,
};

export const rules = {
  username: Yup.string().required('Username is required'),

  emailRule: Yup.string().email('Enter a valid email').required('Email is required'),

  passwordRule: Yup.string()
    .min(3, 'Password must contain atleast 3 characters')
    .matches(regexes.uppercase, 'one uppercase character required')
    .matches(regexes.lowercase, 'one lowercase character required')
    .matches(regexes.number, 'one number required')
    .matches(regexes.symbol, 'one symbol required')
    .required('Password is required'),

  confirmPasswordRule: fieldName =>
    Yup.string()
      .oneOf([Yup.ref(fieldName), null], 'Passwords must match')
      .required(),
};
