import * as Yup from 'yup';

export const regexes = {
  uppercase: /^(?=.*?[A-Z])/,
  lowercase: /^(?=.*?[a-z])/,
  number: /^(?=.*?[0-9])/,
  symbol: /^(?=.*?[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/,
};

export const maxFileSize = 2000000;
export const supportedFileFormats = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png', 'image/bmp'];

export const rules = {
  username: Yup.string().required('Username is required'),

  email: Yup.string().email('Enter a valid email').required('Email is required'),

  password: Yup.string()
    .min(3, 'Password must contain atleast 3 characters')
    .matches(regexes.uppercase, 'one uppercase character required')
    .matches(regexes.lowercase, 'one lowercase character required')
    .matches(regexes.number, 'one number required')
    .matches(regexes.symbol, 'one symbol required')
    .required('Password is required'),

  image: Yup.mixed()
    .test('required', 'File is required', value => !!value)
    .test('fileSize', 'File size is too large', value => value.size <= maxFileSize)
    .test('fileType', 'Unsupported file format', value => supportedFileFormats.includes(value.type)),

  confirmPassword: pwdRef =>
    Yup.string()
      .oneOf([Yup.ref(pwdRef), null], 'Passwords must match')
      .required(),

  startDate: Yup.date().required().nullable().default(undefined),

  endDate: startRef =>
    Yup.date()
      .min(Yup.ref(startRef), () => 'End date needs to be before start date')
      .required()
      .nullable()
      .default(undefined),
};
