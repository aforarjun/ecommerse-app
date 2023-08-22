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
    rememberMe: yup.boolean()
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
    avatar: yup.string()
  })
  .required();
