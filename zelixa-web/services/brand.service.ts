import { Brand } from '@/types/brand';
import { BaseService } from './base.service';

class BrandServiceClass extends BaseService<Brand> {
  constructor() {
    super('/v1/brands');
  }
}

export const BrandService = new BrandServiceClass();
