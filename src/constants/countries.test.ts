import { COUNTRIES, searchCountries, isValidCountry } from './countries';

describe('countries', () => {
  describe('COUNTRIES constant', () => {
    test('contains expected country data structure', () => {
      expect(Array.isArray(COUNTRIES)).toBe(true);
      expect(COUNTRIES.length).toBeGreaterThan(0);

      // Check first country has correct structure
      const firstCountry = COUNTRIES[0];
      expect(firstCountry).toHaveProperty('key');
      expect(firstCountry).toHaveProperty('text');
      expect(typeof firstCountry.key).toBe('string');
      expect(typeof firstCountry.text).toBe('string');
    });

    test('includes common countries', () => {
      const countryKeys = COUNTRIES.map(c => c.key);
      const countryNames = COUNTRIES.map(c => c.text);

      expect(countryKeys).toContain('us');
      expect(countryKeys).toContain('ca');
      expect(countryKeys).toContain('gb');
      expect(countryKeys).toContain('fr');
      expect(countryKeys).toContain('de');

      expect(countryNames).toContain('United States of America');
      expect(countryNames).toContain('China');
    });

    test('has unique country keys', () => {
      const keys = COUNTRIES.map(c => c.key);
      const uniqueKeys = Array.from(new Set(keys));
      expect(keys.length).toBe(uniqueKeys.length);
    });

    test('has non-empty country names', () => {
      COUNTRIES.forEach(country => {
        expect(country.key).toBeTruthy();
        expect(country.text).toBeTruthy();
        expect(country.key.length).toBeGreaterThan(0);
        expect(country.text.length).toBeGreaterThan(0);
      });
    });

    test('countries are sorted alphabetically', () => {
      for (let i = 1; i < COUNTRIES.length; i++) {
        expect(COUNTRIES[i].text.localeCompare(COUNTRIES[i - 1].text)).toBeGreaterThanOrEqual(0);
      }
    });
  });
});

describe('searchCountries function', () => {
  test('returns all countries when search is empty', () => {
    expect(searchCountries('')).toEqual(COUNTRIES);
    expect(searchCountries('   ')).toEqual(COUNTRIES);
  });

  test('filters countries by name (case insensitive)', () => {
    const results1 = searchCountries('united');
    expect(results1.length).toBeGreaterThan(0);
    expect(results1.every(c => c.text.toLowerCase().includes('united'))).toBe(true);

    const results2 = searchCountries('UNITED');
    expect(results2).toEqual(results1); // Should be case insensitive

    const results3 = searchCountries('United');
    expect(results3).toEqual(results1); // Should be case insensitive
  });

  test('filters countries by country code', () => {
    const results = searchCountries('us');
    expect(results.some(c => c.key === 'us')).toBe(true);
  });

  test('handles partial matches', () => {
    const results = searchCountries('can');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(c => c.text.toLowerCase().includes('can'))).toBe(true);
  });

  test('returns empty array for non-existent countries', () => {
    const results = searchCountries('xyz123nonexistent');
    expect(results).toEqual([]);
  });

  test('trims whitespace from search query', () => {
    const results1 = searchCountries('  united  ');
    const results2 = searchCountries('united');
    expect(results1).toEqual(results2);
  });

  test('handles special characters in search', () => {
    const results = searchCountries('côte');
    // Should handle accented characters if present in country names
    expect(Array.isArray(results)).toBe(true);
  });
});

describe('isValidCountry function', () => {
  test('returns true for valid country codes', () => {
    expect(isValidCountry('us')).toBe(true);
    expect(isValidCountry('ca')).toBe(true);
    expect(isValidCountry('gb')).toBe(true);
    expect(isValidCountry('fr')).toBe(true);
  });

  test('returns false for invalid country codes', () => {
    expect(isValidCountry('INVALID')).toBe(false);
    expect(isValidCountry('')).toBe(false);
    expect(isValidCountry('XYZ')).toBe(false);
    expect(isValidCountry('123')).toBe(false);
  });

  test('handles null and undefined inputs', () => {
    expect(isValidCountry(null as any)).toBe(false);
    expect(isValidCountry(undefined as any)).toBe(false);
  });

  test('is case sensitive', () => {
    expect(isValidCountry('US')).toBe(false); // Should be case sensitive - expects lowercase
    expect(isValidCountry('us')).toBe(true);
  });
});

describe('Edge cases', () => {
  test('handles countries with special characters in names', () => {
    const allResults = searchCountries('');
    const specialCharCountries = allResults.filter(c =>
      /[àáäâèéëêìíïîòóöôùúüûñç]/i.test(c.text)
    );

    // If there are countries with special characters, ensure they're searchable
    if (specialCharCountries.length === 0) {
      return;
    }
    const firstSpecial = specialCharCountries[0];
    const searchResults = searchCountries(firstSpecial.text.substring(0, 3));
    expect(searchResults.length).toBeGreaterThan(0);
  });

  test('maintains original array integrity', () => {
    const originalLength = COUNTRIES.length;
    searchCountries('test');
    expect(COUNTRIES.length).toBe(originalLength);

    // Ensure original array is not modified
    const firstCountry = COUNTRIES[0];
    expect(firstCountry).toHaveProperty('key');
    expect(firstCountry).toHaveProperty('text');
  });
});
