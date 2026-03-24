import { Customer } from '@/types/customer';
import { BaseService } from './base.service';

class CustomerServiceClass extends BaseService<Customer> {
  constructor() {
    super('/customers');
  }
}

export const CustomerService = new CustomerServiceClass();
