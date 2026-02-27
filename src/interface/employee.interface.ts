export interface Employee {
  _id: string;
  lastName: string;
  firstName: string;
  dob: Date;
  email: string;
  phone: string;
  address: string;
  role: 'manager' | 'admin' | 'staff';
  salary: number;
  createdAt: Date;
  updatedAt: Date | null;
  refreshToken?: string;
}