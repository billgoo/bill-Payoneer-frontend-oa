/**
 * Available Countries - List of countries available for selection
 * This file contains all the country options that users can select from
 * in the registration form using the country-list library for comprehensive data.
 */

import * as countryList from 'country-list';

export interface CountryOption {
  key: string;
  text: string;
}

// Generate comprehensive country list from country-list library
export const COUNTRIES: CountryOption[] = countryList
  .getData()
  .map((country: any) => ({
    key: country.code.toLowerCase(),
    text: country.name,
  }))
  .sort((a, b) => a.text.localeCompare(b.text)); // Sort alphabetically by name

// Helper function to validate if a country is valid
export const isValidCountry = (name: string): boolean => {
  return COUNTRIES.some(c => c.text === name);
};

// Helper function to search countries by name
export const searchCountries = (searchTerm: string): CountryOption[] => {
  const term = searchTerm.toLowerCase();
  return COUNTRIES.filter(country =>
    country.text.toLowerCase().includes(term) ||
    country.key.includes(term)
  );
};
