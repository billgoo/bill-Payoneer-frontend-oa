import * as yup from 'yup';
import { isValidCountry } from '../constants/countries';
import { GENDER_OPTIONS } from '../constants/gender';

// Basic Information Step Schema
export const basicInfoSchema = yup.object().shape({
  firstName: yup
    .string()
    .required('First name is required')
    .min(1, 'First name must be at least 1 character')
    .max(50, 'First name must be less than 50 characters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(1, 'Last name must be at least 1 character')
    .max(50, 'Last name must be less than 50 characters'),
  dateOfBirth: yup
    .date()
    .required('Date of birth is required')
    .min(new Date(new Date().setFullYear(new Date().getFullYear() - 200)), 'No person could live more than 200 years in reality currently')
    .max(new Date(), 'Date of birth cannot be in the future'),
});

// Details Step Schema
export const detailsSchema = yup.object().shape({
  country: yup
    .string()
    .required('Country is required')
    .test('validCountry', 'Please input a valid country', (value) => {
      return isValidCountry(value);
    }),
  gender: yup
    .string()
    .required('Gender is required')
    .oneOf(GENDER_OPTIONS.map(g => g.key), 'Please select a valid gender'),
});

// Account Step Schema
export const accountSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

// Complete form schema
export const completeFormSchema = basicInfoSchema
  .concat(detailsSchema)
  .concat(accountSchema);

// Individual step validation
export const validateStep = async (stepId: number, data: any) => {
  try {
    switch (stepId) {
      case 1:
        await basicInfoSchema.validate(data, { abortEarly: false });
        return { isValid: true, errors: {} };
      case 2:
        await detailsSchema.validate(data, { abortEarly: false });
        return { isValid: true, errors: {} };
      case 3:
        await accountSchema.validate(data, { abortEarly: false });
        return { isValid: true, errors: {} };
      default:
        return { isValid: true, errors: {} };
    }
  } catch (error: any) {
    const errors: { [key: string]: string } = {};
    if (error.inner) {
      error.inner.forEach((err: any) => {
        if (err.path) {
          errors[err.path] = err.message;
        }
      });
    }
    return { isValid: false, errors };
  }
};
