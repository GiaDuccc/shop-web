export interface Customer {
  _id: string;
  lastName: string;
  firstName: string;
  country: string;
  dob: Date;
  email: string;
  phone: string;
  slug?: string;
  role: 'manager' | 'admin' | 'client';
  address: string;
  refreshToken: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date | null;
}