import 'package:dio/dio.dart';
import '../models/product_model.dart';
import 'common_service.dart';

class ProductService extends CommonService {
  Future<List<Product>> getRecommendedProducts() async {
    try {
      final response = await get('/products/recommended?size=6');
      if (response.data != null && response.data['content'] != null) {
        final List<dynamic> list = response.data['content'];
        return list.map((e) => Product.fromJson(e)).toList();
      }
      return [];
    } catch (e) {
      rethrow;
    }
  }

  Future<List<Product>> getTrendingProducts() async {
    try {
      final response = await get('/products/top?size=6');
      if (response.data != null && response.data['content'] != null) {
        final List<dynamic> list = response.data['content'];
        return list.map((e) => Product.fromJson(e)).toList();
      }
      return [];
    } catch (e) {
      rethrow;
    }
  }
}
