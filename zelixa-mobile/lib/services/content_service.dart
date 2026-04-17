import 'package:dio/dio.dart';
import '../models/content_section_model.dart';
import 'common_service.dart';

class ContentService extends CommonService {
  Future<List<ContentSection>> getActiveSections() async {
    try {
      final response = await get('/content-sections/active?platform=MOBILE');
      if (response.data != null && response.data is List) {
        final List<dynamic> list = response.data;
        return list.map((e) => ContentSection.fromJson(e)).toList();
      }
      return [];
    } catch (e) {
      rethrow;
    }
  }
}
