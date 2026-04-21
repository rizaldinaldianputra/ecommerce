import '../models/category_model.dart';
import 'common_service.dart';

class CategoryService extends CommonService {
  Future<List<Category>> getCategories() async {
    try {
      final response = await get('/categories');
      if (response.data != null && response.data['content'] != null) {
        final List<dynamic> list = response.data['content'];
        return list.map((e) => Category.fromJson(e)).toList();
      }
      return [];
    } catch (e) {
      rethrow;
    }
  }
}
