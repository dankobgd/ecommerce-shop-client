import * as Yup from 'yup';

export const regexes = {
  uppercase: /^(?=.*?[A-Z])/,
  lowercase: /^(?=.*?[a-z])/,
  number: /^(?=.*?[0-9])/,
  symbol: /^(?=.*?[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/,
};

export const maxFileSize = 3000000;
export const supportedFileFormats = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png', 'image/bmp', 'image/webp'];

function isFileExists(file) {
  return !!file;
}

function isValidFileSize(file) {
  if (!file?.size) return false;
  if (file.size > maxFileSize) return false;
  return true;
}

function isValidFileType(file) {
  if (!file?.type) return false;
  if (!supportedFileFormats.includes(file.type)) return false;
  return true;
}

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

  requiredImage: Yup.mixed()
    .test('required', 'File is required', isFileExists)
    .test('fileSize', 'File size is too large', isValidFileSize)
    .test('fileType', 'Unsupported file format', isValidFileType),

  requiredImagesList: Yup.array()
    .of(
      Yup.mixed()
        .test('required', 'File is required', isFileExists)
        .test('fileSize', 'File size is too large', isValidFileSize)
        .test('fileType', 'Unsupported file format', isValidFileType)
    )
    .min(1),

  optionalImage: Yup.mixed()
    .test('fileSize', 'File size is too large', value => (!value.size ? true : value.size <= maxFileSize))
    .test('fileType', 'Unsupported file format', value =>
      !value.size ? true : supportedFileFormats.includes(value.type)
    ),

  optionalImagesList: Yup.array().of(
    Yup.mixed()
      .test('fileSize', 'File size is too large', value => (!value.size ? true : value.size <= maxFileSize))
      .test('fileType', 'Unsupported file format', value =>
        !value.size ? true : supportedFileFormats.includes(value.type)
      )
  ),

  confirmPassword: pwdRef =>
    Yup.string()
      .oneOf([Yup.ref(pwdRef), null], 'Passwords must match')
      .required(),

  startDate: Yup.date().required().nullable().default(undefined),

  endDate: startRef =>
    Yup.date()
      .min(Yup.ref(startRef), () => 'End date needs to be after start date')
      .required()
      .nullable()
      .default(undefined),

  categoryProperties: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required(),
        label: Yup.string().required(),
        type: Yup.string().required(),
        filterable: Yup.bool().required(),
      })
    )
    .nullable(),

  productProperties: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required(),
        label: Yup.string().required(),
        type: Yup.string().required(),
        filterable: Yup.bool().required(),
      })
    )
    .nullable(),

  requiredPositiveNumber: Yup.number()
    .positive()
    .required()
    .nullable()
    .transform((v, o) => (o === '' ? null : v)),
};
