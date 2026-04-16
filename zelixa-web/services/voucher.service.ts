import { Voucher } from '@/types/voucher';
import { BaseService } from './base.service';

class VoucherServiceClass extends BaseService<Voucher> {
  constructor() {
    super('/vouchers');
  }
}

export const VoucherService = new VoucherServiceClass();
