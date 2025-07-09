import { validateStep } from './validationSchemas';
import { FormData } from './types';

describe('validationSchemas', () => {
  const mockFormData: FormData = {
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: new Date('1990-01-01'),
    country: 'us', // lowercase to match countries.ts implementation
    gender: 'male',
    avatar: null,
    email: 'john.doe@example.com',
    password: 'password123',
  };

  describe('Step 1 - Basic Information Validation', () => {
    test('validates successfully with complete data', async () => {
      const result = await validateStep(1, mockFormData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    test('fails validation with missing first name', async () => {
      const invalidData = { ...mockFormData, firstName: '' };
      const result = await validateStep(1, invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.firstName).toBeDefined();
    });

    test('fails validation with missing last name', async () => {
      const invalidData = { ...mockFormData, lastName: '' };
      const result = await validateStep(1, invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.lastName).toBeDefined();
    });

    test('fails validation with missing date of birth', async () => {
      const invalidData = { ...mockFormData, dateOfBirth: null };
      const result = await validateStep(1, invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.dateOfBirth).toBeDefined();
    });

    test('validates first name length constraints', async () => {
      const validShortName = { ...mockFormData, firstName: 'A' };
      const result1 = await validateStep(1, validShortName);
      expect(result1.isValid).toBe(true); // 1 character is valid according to schema

      const longName = { ...mockFormData, firstName: 'A'.repeat(51) };
      const result2 = await validateStep(1, longName);
      expect(result2.isValid).toBe(false);
      expect(result2.errors.firstName).toContain('less than 50 characters');
    });

    test('validates last name length constraints', async () => {
      const validShortName = { ...mockFormData, lastName: 'A' };
      const result1 = await validateStep(1, validShortName);
      expect(result1.isValid).toBe(true); // 1 character is valid according to schema

      const longName = { ...mockFormData, lastName: 'A'.repeat(51) };
      const result2 = await validateStep(1, longName);
      expect(result2.isValid).toBe(false);
      expect(result2.errors.lastName).toContain('less than 50 characters');
    });

    test('validates date of birth constraints', async () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);

      const invalidData = { ...mockFormData, dateOfBirth: futureDate };
      const result = await validateStep(1, invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.dateOfBirth).toContain('cannot be in the future');
    });
  });

  describe('Step 2 - Details Validation', () => {
    test('validates successfully with complete data', async () => {
      const result = await validateStep(2, mockFormData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    test('fails validation with missing country', async () => {
      const invalidData = { ...mockFormData, country: '' };
      const result = await validateStep(2, invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.country).toBeDefined();
    });

    test('fails validation with missing gender', async () => {
      const invalidData = { ...mockFormData, gender: '' };
      const result = await validateStep(2, invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.gender).toBeDefined();
    });

    test('fails validation with invalid country', async () => {
      const invalidData = { ...mockFormData, country: 'INVALID' };
      const result = await validateStep(2, invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.country).toContain('valid country');
    });

    test('fails validation with invalid gender', async () => {
      const invalidData = { ...mockFormData, gender: 'invalid' };
      const result = await validateStep(2, invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.gender).toContain('valid gender');
    });

    test('validates with optional avatar', async () => {
      const dataWithoutAvatar = { ...mockFormData, avatar: null };
      const result = await validateStep(2, dataWithoutAvatar);
      expect(result.isValid).toBe(true);
    });
  });

  describe('Step 3 - Account Validation', () => {
    test('validates successfully with complete data', async () => {
      const result = await validateStep(3, mockFormData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    test('fails validation with missing email', async () => {
      const invalidData = { ...mockFormData, email: '' };
      const result = await validateStep(3, invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBeDefined();
    });

    test('fails validation with invalid email format', async () => {
      const invalidData = { ...mockFormData, email: 'invalid-email' };
      const result = await validateStep(3, invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toContain('valid email');
    });

    test('fails validation with missing password', async () => {
      const invalidData = { ...mockFormData, password: '' };
      const result = await validateStep(3, invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.password).toBeDefined();
    });

    test('validates password length requirements', async () => {
      const shortPassword = { ...mockFormData, password: 'short' };
      const result = await validateStep(3, shortPassword);
      expect(result.isValid).toBe(false);
      expect(result.errors.password).toContain('at least 8 characters');
    });

    test('accepts various valid email formats', async () => {
      const validEmails = [
        'user@example.com',
        'user.name@example.com',
        'user+tag@example.com',
        'user123@example-site.com',
        'user@subdomain.example.com',
      ];

      for (const email of validEmails) {
        const data = { ...mockFormData, email };
        const result = await validateStep(3, data);
        expect(result.isValid).toBe(true);
      }
    });

    test('rejects invalid email formats', async () => {
      const invalidEmails = [
        'plainaddress',
        '@missinglocal.com',
        'missing@.com',
        'missing.domain@',
        'spaces in@email.com',
        'double@@example.com',
      ];

      for (const email of invalidEmails) {
        const data = { ...mockFormData, email };
        const result = await validateStep(3, data);
        expect(result.isValid).toBe(false);
        expect(result.errors.email).toBeDefined();
      }
    });
  });

  describe('Step 4 - Confirmation Validation', () => {
    test('validates successfully (no validation required)', async () => {
      const result = await validateStep(4, mockFormData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    test('validates even with incomplete data', async () => {
      const incompleteData = { ...mockFormData, firstName: '', email: '' };
      const result = await validateStep(4, incompleteData);
      expect(result.isValid).toBe(true);
    });
  });

  describe('Invalid Step Number', () => {
    test('returns valid for invalid step numbers', async () => {
      const result1 = await validateStep(0, mockFormData);
      expect(result1.isValid).toBe(true);

      const result2 = await validateStep(5, mockFormData);
      expect(result2.isValid).toBe(true);

      const result3 = await validateStep(-1, mockFormData);
      expect(result3.isValid).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    test('handles null/undefined values gracefully', async () => {
      const nullData = {
        firstName: null as any,
        lastName: undefined as any,
        dateOfBirth: null,
        country: null as any,
        gender: null as any,
        avatar: null,
        email: null as any,
        password: undefined as any,
      };

      const result = await validateStep(1, nullData);
      expect(result.isValid).toBe(false);
      expect(Object.keys(result.errors)).toHaveLength(3); // firstName, lastName, dateOfBirth
    });

    test('handles empty strings consistently', async () => {
      const emptyData = {
        firstName: '',
        lastName: '',
        dateOfBirth: null,
        country: '',
        gender: '',
        avatar: null,
        email: '',
        password: '',
      };

      const result1 = await validateStep(1, emptyData);
      expect(result1.isValid).toBe(false);

      const result2 = await validateStep(2, emptyData);
      expect(result2.isValid).toBe(false);

      const result3 = await validateStep(3, emptyData);
      expect(result3.isValid).toBe(false);
    });
  });
});
