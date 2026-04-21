import 'package:dio/dio.dart';
import '../models/content_section_model.dart';
import 'common_service.dart';

class ContentService extends CommonService {
  Future<List<ContentItem>> getItemsByType(String type, {bool activeOnly = true}) async {
    try {
      final response = await get('/v1/content/items/type/$type?platform=MOBILE&activeOnly=$activeOnly');
      if (response.data != null && response.data is List) {
        final List<dynamic> list = response.data;
        return list.map((e) => ContentItem.fromJson(e)).toList();
      }
      return [];
    } catch (e) {
      rethrow;
    }
  }

  Future<List<ContentItem>> getAllMobileItems() async {
    try {
      final response = await get('/v1/content/items?platform=MOBILE');
      if (response.data != null && response.data is List) {
        final List<dynamic> list = response.data;
        return list.map((e) => ContentItem.fromJson(e)).toList();
      }
      return [];
    } catch (e) {
      rethrow;
    }
  }
}
