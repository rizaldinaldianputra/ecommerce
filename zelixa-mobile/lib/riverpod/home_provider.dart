import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/category_model.dart';
import '../models/content_section_model.dart';
import '../models/flash_sale_model.dart';
import '../models/product_model.dart';
import '../services/category_service.dart';
import '../services/content_service.dart';
import '../services/flash_sale_service.dart';
import '../services/product_service.dart';

final categoryServiceProvider = Provider<CategoryService>((ref) {
  return CategoryService();
});

final productServiceProvider = Provider<ProductService>((ref) {
  return ProductService();
});

final flashSaleServiceProvider = Provider<FlashSaleService>((ref) {
  return FlashSaleService();
});

final contentServiceProvider = Provider<ContentService>((ref) {
  return ContentService();
});

// Categories Provider
final homeCategoriesProvider = FutureProvider<List<Category>>((ref) async {
  final service = ref.read(categoryServiceProvider);
  return service.getCategories();
});

// Trending Products Provider
final homeTrendingProvider = FutureProvider<List<Product>>((ref) async {
  final service = ref.read(productServiceProvider);
  return service.getTrendingProducts();
});

// Recommended Products Provider
final homeRecommendedProvider = FutureProvider<List<Product>>((ref) async {
  final service = ref.read(productServiceProvider);
  return service.getRecommendedProducts();
});

// Flash Sale Provider
final homeFlashSaleProvider = FutureProvider<FlashSale?>((ref) async {
  final service = ref.read(flashSaleServiceProvider);
  final sales = await service.getActiveFlashSales();
  if (sales.isNotEmpty) {
    return sales.first;
  }
  return null;
});

// Promo Banners Provider (Content Sections)
final homePromoBannersProvider = FutureProvider<List<ContentItem>>((ref) async {
  final service = ref.read(contentServiceProvider);
  final sections = await service.getActiveSections();
  if (sections.isNotEmpty) {
    // Return all items from the first section as banners
    // or filter by section type == "HERO_BANNER" or something similar.
    final heroSection = sections.firstWhere((s) => s.type == "BANNER", orElse: () => sections.first);
    return heroSection.items;
  }
  return [];
});
