import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/content_section_model.dart';
import '../services/content_service.dart';
import '../services/category_service.dart';
import '../models/category_model.dart';

final contentServiceProvider = Provider<ContentService>((ref) {
  return ContentService();
});

final categoryServiceProvider = Provider<CategoryService>((ref) {
  return CategoryService();
});


// Promo Banners Provider (Content Items)
final homePromoBannersProvider = FutureProvider<List<ContentItem>>((ref) async {
  final service = ref.read(contentServiceProvider);
  return service.getItemsByType('PROMO');
});

// Featured Products Content Provider
final homeFeaturedContentProvider = FutureProvider<List<ContentItem>>((ref) async {
  final service = ref.read(contentServiceProvider);
  return service.getItemsByType('FEATURED_PRODUCTS');
});

// Flash Sale Content Provider
final homeFlashSaleContentProvider = FutureProvider<List<ContentItem>>((ref) async {
  final service = ref.read(contentServiceProvider);
  return service.getItemsByType('FLASH_SALE');
});

// Trending Now Content Provider
final homeTrendingContentProvider = FutureProvider<List<ContentItem>>((ref) async {
  final service = ref.read(contentServiceProvider);
  return service.getItemsByType('TRENDING_NOW');
});

// News Content Provider
final homeNewsContentProvider = FutureProvider<List<ContentItem>>((ref) async {
  final service = ref.read(contentServiceProvider);
  return service.getItemsByType('NEWS');
});

// Home Categories Provider
final homeCategoriesProvider = FutureProvider<List<Category>>((ref) async {
  final service = ref.read(categoryServiceProvider);
  return service.getCategories();
});
