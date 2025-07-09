import { FormData } from '../utils/types';

// Mock API simulation
export const simulateApiCall = (data: FormData): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Form submission data:', data);
      resolve({
        success: true,
        message: 'Registration completed successfully!',
      });
    }, 2000);
  });
};
