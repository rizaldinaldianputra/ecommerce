export interface Address {
  id: number | string;
  label: string;
  recipientName: string;
  phoneNumber: string;
  provinceId: string;
  provinceName: string;
  cityId: string;
  cityName: string;
  districtId: string;
  districtName: string;
  subdistrictId: string;
  subdistrictName: string;
  addressLine: string;
  postalCode: string;
  isDefault: boolean;
}
