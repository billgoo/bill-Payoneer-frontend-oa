// Form data types
export interface BasicInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: Date | null;
}

export interface Details {
  country: string;
  gender: string;
  avatar?: File | null;
}

export interface AccountInfo {
  email: string;
  password: string;
}

export interface FormData extends BasicInfo, Details, AccountInfo { }

// Component types
export interface StepProps {
  id: number;
  title: string;
  description: string;
  errors: { [key: string]: string };
}
