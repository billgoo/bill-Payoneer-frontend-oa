/**
 * Gender Options - List of gender options available for selection
 * This file contains all the gender options that users can select from
 * in the registration form.
 */

export interface GenderOption {
  key: string;
  text: string;
}

// Gender options for user selection
export const GENDER_OPTIONS: GenderOption[] = [
  { key: 'male', text: 'Male' },
  { key: 'female', text: 'Female' },
  { key: 'other', text: 'Other' },
  { key: 'decline', text: 'Decline to self-identify' },
];
