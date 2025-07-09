/**
 * Available Countries - List of countries available for selection
 * This file contains all the country options that users can select from
 * in the registration form using the countries-list library for comprehensive data.
 */

export interface CountryOption {
  key: string;
  text: string;
}

// Define the country data type from countries-list
interface CountryData {
  name: string;
}

// Import countries data using require for better compatibility
const countriesData = require('countries-list');
const countries = countriesData.countries as Record<string, CountryData>;

// Generate comprehensive country list from countries-list library
export const COUNTRIES: CountryOption[] = Object.entries(countries)
  .map(([code, country]: [string, any]) => {
    const countryData = country as CountryData;
    return {
      key: code.toLowerCase(),
      text: countryData.name,
    };
  })
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
