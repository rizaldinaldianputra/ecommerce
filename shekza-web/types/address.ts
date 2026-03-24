export interface Address {
  id: number | string;
  label: string; // e.g. 'Home', 'Office'
  name: string;
  phone: string;
  province: string;
  city: string;
  subdistrict: string;
  address: string;
  postal: string;
  isDefault: boolean;
}
