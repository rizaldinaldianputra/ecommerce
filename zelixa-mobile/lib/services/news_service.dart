import 'package:dio/dio.dart';
import '../models/news_model.dart';
import 'common_service.dart';

class NewsService extends CommonService {
  Future<List<NewsModel>> getAllNews() async {
    try {
      final response = await get('/news');
      // Backend returns either direct list or inside data depending on wrapper.
      // NewsController looks like it returns List<News> directly or ApiResponse.
      List<dynamic> list;
      if (response.data is List) {
        list = response.data;
      } else if (response.data != null && response.data['data'] != null) {
        list = response.data['data'];
      } else {
        list = [];
      }
      return list.map((e) => NewsModel.fromJson(e)).toList();
    } catch (e) {
      rethrow;
    }
  }
}
