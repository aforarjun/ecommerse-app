import * as yup from 'yup';
import isEmailValidator from 'validator/lib/isEmail';

export const LoginSchema = yup
  .object()
  .shape({
    email: yup
      .string()
      .email('Invalid email format')
      .required('Email is required')
      .test(
        'is-valid',
        (message) => `${message.path} is invalid`,
        (value) =>
          value ? isEmailValidator(value) : new yup.ValidationError('Invalid email format')
      )
      .default(''),
    password: yup.string().required('Password is required').default(''),
    rememberMe: yup.boolean().default(false)
  })
  .required();

export const SignupSchema = yup
  .object()
  .shape({
    name: yup.string().required('Full name is required').default(''),
    email: yup
      .string()
      .email('Invalid email format')
      .required('Email is required')
      .test(
        'is-valid',
        (message) => `${message.path} is invalid`,
        (value) =>
          value ? isEmailValidator(value) : new yup.ValidationError('Invalid email format')
      )
      .default(''),
    password: yup.string().required('Password is required').default(''),
    confirmPassword: yup
      .string()
      .required('Confirm password is required')
      .default('')
      .oneOf([yup.ref('password')], 'Password and confirm password does not match'),
    avatar: yup.mixed().nullable()
  })
  .required();

// Shop Schema
export const CreateSellerSchema = yup
  .object()
  .shape({
    name: yup.string().required('Full name is required').default(''),
    shopName: yup.string().required('Shop name is required').default(''),
    email: yup
      .string()
      .email('Invalid email format')
      .required('Email is required')
      .test(
        'is-valid',
        (message) => `${message.path} is invalid`,
        (value) =>
          value ? isEmailValidator(value) : new yup.ValidationError('Invalid email format')
      )
      .default(''),
    phoneNumber: yup
      .string()
      .matches(/^[0-9]+$/, 'Must be only digits')
      .default('')
      .default(null),
    address: yup
      .object()
      .shape({
        country: yup
          .object()
          .shape({
            index: yup.string(),
            value: yup.string()
          })
          .nullable()
          .required('Select country, Required'),
        city: yup
          .object()
          .shape({
            index: yup.string(),
            value: yup.string()
          })
          .nullable()
          .required('Select city, Required'),
        address1: yup.string().default('').required('Required'),
        address2: yup.string().default('').notRequired(),
        zipCode: yup
          .string()
          .nullable()
          .matches(/^[0-9]+$/, 'Must be only digits')
          .default('')
          .required('Required')
      })
      .nullable()
      .default(null),
    password: yup.string().required('Password is required').default(''),
    confirmPassword: yup
      .string()
      .required('Confirm password is required')
      .default('')
      .oneOf([yup.ref('password')], 'Password and confirm password does not match'),
    avatar: yup.mixed()
  })
  .required();

export const UpdateShopSchema = yup
  .object()
  .shape({
    name: yup.string().required('Full name is required').default(''),
    shopName: yup.string().required('Shop name is required').default(''),
    email: yup
      .string()
      .email('Invalid email format')
      .required('Email is required')
      .test(
        'is-valid',
        (message) => `${message.path} is invalid`,
        (value) =>
          value ? isEmailValidator(value) : new yup.ValidationError('Invalid email format')
      )
      .default(''),
    phoneNumber: yup
      .string()
      .nullable()
      .matches(/^[0-9]+$/, 'Must be only digits')
      .default('')
      .required('Required'),
    address: yup
      .object()
      .shape({
        country: yup
          .object()
          .shape({
            index: yup.string(),
            value: yup.string()
          })
          .nullable()
          .required('Select country, Required'),
        city: yup
          .object()
          .shape({
            index: yup.string(),
            value: yup.string()
          })
          .nullable()
          .required('Select city, Required'),
        address1: yup.string().default('').required('Required'),
        address2: yup.string().default('').notRequired(),
        zipCode: yup
          .string()
          .nullable()
          .matches(/^[0-9]+$/, 'Must be only digits')
          .default('')
          .required('Required')
      })
      .nullable()
      .default(null)
  })
  .required();

// create event schema
export const CreateEventSchema = yup.object().shape({
  images: yup.array().of(yup.string()).required('Project Images is required, (Atleast one.)'),
  name: yup.string().required('Project name is required.'),
  description: yup.string().required('Project description is required.'),
  category: yup
    .object({
      index: yup.number(),
      value: yup.string()
    })
    .default(null)
    .required('Project category is required.'),
  tags: yup.string().required('Project tags is required.'),
  originalPrice: yup.number().required('Required'),
  discountPrice: yup.number().required('Required'),
  stock: yup.number().required('Required'),
  startDate: yup
    .date()
    .nullable()
    .min(new Date(Date.now() - 86400000), 'Min start date must be more then today.')
    .required('Start date is required'),
  endDate: yup
    .date()
    .nullable()
    .when('startDate', (startDate: Date[], schema: any) => {
      if (!startDate[0]) {
        return schema.required('End date is required');
      }

      return schema.min(
        new Date(startDate[0]?.getTime() + 2 * 24 * 60 * 60 * 1000),
        'End date should be min after 2 days of start date'
      );
    })
    .required('End date is required')
});
