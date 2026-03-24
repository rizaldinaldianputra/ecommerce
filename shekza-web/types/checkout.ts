import { LucideIcon } from 'lucide-react';

export interface CheckoutStep {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface Courier {
  id: string;
  name: string;
  price: number;
  speed: string;
  icon: LucideIcon;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: LucideIcon;
  desc: string;
}
