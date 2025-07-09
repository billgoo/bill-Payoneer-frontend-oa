import { validateFileType, validateFileSize, formatFileSize } from './fileUtils';

describe('fileUtils', () => {
  describe('validateFileType', () => {
    test('accepts valid image types', () => {
      const jpegFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const jpgFile = new File(['content'], 'test.jpg', { type: 'image/jpg' });
      const pngFile = new File(['content'], 'test.png', { type: 'image/png' });
      const gifFile = new File(['content'], 'test.gif', { type: 'image/gif' });

      expect(validateFileType(jpegFile)).toBe(true);
      expect(validateFileType(jpgFile)).toBe(true);
      expect(validateFileType(pngFile)).toBe(true);
      expect(validateFileType(gifFile)).toBe(true);
    });

    test('rejects invalid file types', () => {
      const txtFile = new File(['content'], 'test.txt', { type: 'text/plain' });
      const pdfFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const webpFile = new File(['content'], 'test.webp', { type: 'image/webp' });

      expect(validateFileType(txtFile)).toBe(false);
      expect(validateFileType(pdfFile)).toBe(false);
      expect(validateFileType(webpFile)).toBe(false);
    });

    test('handles edge cases', () => {
      const noTypeFile = new File(['content'], 'test.jpg', { type: '' });
      const undefinedFile = new File(['content'], 'test.jpg', { type: undefined as any });

      expect(validateFileType(noTypeFile)).toBe(false);
      expect(validateFileType(undefinedFile)).toBe(false);
    });
  });

  describe('validateFileSize', () => {
    test('accepts files within size limit', () => {
      const smallFile = new File(['a'.repeat(1000)], 'small.jpg', { type: 'image/jpeg' });
      const mediumFile = new File(['a'.repeat(1000000)], 'medium.jpg', { type: 'image/jpeg' });

      expect(validateFileSize(smallFile)).toBe(true);
      expect(validateFileSize(mediumFile)).toBe(true);
    });

    test('rejects files over size limit', () => {
      // Create a file larger than 2MB
      const largeFile = new File(['a'.repeat(3000000)], 'large.jpg', { type: 'image/jpeg' });

      expect(validateFileSize(largeFile)).toBe(false);
    });

    test('handles edge case at exact limit', () => {
      // Create a file exactly at 2MB limit
      const exactLimitFile = new File(['a'.repeat(2 * 1024 * 1024)], 'exact.jpg', { type: 'image/jpeg' });

      expect(validateFileSize(exactLimitFile)).toBe(true);
    });
  });

  describe('formatFileSize', () => {
    test('formats bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(500)).toBe('500 Bytes');
      expect(formatFileSize(999)).toBe('999 Bytes');
    });

    test('formats kilobytes correctly', () => {
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(2048)).toBe('2 KB');
      expect(formatFileSize(102400)).toBe('100 KB');
    });

    test('formats megabytes correctly', () => {
      expect(formatFileSize(1048576)).toBe('1 MB');
      expect(formatFileSize(1572864)).toBe('1.5 MB');
      expect(formatFileSize(2097152)).toBe('2 MB');
      expect(formatFileSize(10485760)).toBe('10 MB');
    });

    test('formats gigabytes correctly', () => {
      expect(formatFileSize(1073741824)).toBe('1 GB');
      expect(formatFileSize(1610612736)).toBe('1.5 GB');
    });

    test('handles edge cases', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(1)).toBe('1 Bytes');
    });

    test('rounds to two decimal places', () => {
      expect(formatFileSize(1234)).toBe('1.21 KB');
      expect(formatFileSize(1234567)).toBe('1.18 MB');
      expect(formatFileSize(1234567890)).toBe('1.15 GB');
    });
  });
});
