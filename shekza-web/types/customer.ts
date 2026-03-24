export interface Customer {
  id: number;
  code: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  npwp?: string;
  creditLimit?: number;
  active: boolean;
}
