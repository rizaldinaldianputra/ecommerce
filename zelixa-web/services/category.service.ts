import { Category } from '@/types/category';
import { BaseService } from './base.service';

class CategoryServiceClass extends BaseService<Category> {
  constructor() {
    super('/v1/categories');
  }
}

export const CategoryService = new CategoryServiceClass();
