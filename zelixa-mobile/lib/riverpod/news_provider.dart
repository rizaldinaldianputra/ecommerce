import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/news_model.dart';
import '../services/news_service.dart';

final newsServiceProvider = Provider<NewsService>((ref) {
  return NewsService();
});

class NewsNotifier extends StateNotifier<AsyncValue<List<NewsModel>>> {
  final NewsService _newsService;

  NewsNotifier(this._newsService) : super(const AsyncValue.loading()) {
    fetchNews();
  }

  Future<void> fetchNews() async {
    try {
      state = const AsyncValue.loading();
      final newsList = await _newsService.getAllNews();
      state = AsyncValue.data(newsList);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}

final newsProvider = StateNotifierProvider<NewsNotifier, AsyncValue<List<NewsModel>>>((ref) {
  final service = ref.read(newsServiceProvider);
  return NewsNotifier(service);
});
