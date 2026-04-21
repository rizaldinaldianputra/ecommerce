import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../components/card_widget.dart';
import '../../components/home/home_app_bar.dart';
import '../../components/home/home_search_bar.dart';
import '../../components/home/home_promo_carousel.dart';
import '../../components/home/home_category_icons.dart';
import '../../components/home/home_flash_sale.dart';
import '../../components/home/home_trending_list.dart';
import '../../components/home/home_section_title.dart';
import '../../components/home/home_news_list.dart';
import '../../riverpod/home_provider.dart';

class HomePage extends ConsumerWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final featuredAsync = ref.watch(homeFeaturedContentProvider);

    return Scaffold(
      backgroundColor: const Color(0xFFF8F8F8),
      body: CustomScrollView(
        slivers: [
          const HomeSliverAppBar(),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 20),
              child: SizedBox(
                width: double.infinity,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 16),
                      child: HomeSearchBar(),
                    ),
                    const SizedBox(height: 24),
                    const HomePromoCarousel(),
                    const SizedBox(height: 32),
                    const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 16),
                      child: HomeCategoryIcons(),
                    ),
                    const SizedBox(height: 32),
                    const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 16),
                      child: HomeSectionTitle(
                        title: 'Flash Sale',
                        hasTimer: true,
                      ),
                    ),
                    const SizedBox(height: 16),
                    const HomeFlashSale(),
                    const SizedBox(height: 32),
                    const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 16),
                      child: HomeSectionTitle(title: 'Trending Now'),
                    ),
                    const SizedBox(height: 16),
                    const HomeTrendingList(),
                    const SizedBox(height: 32),
                    const HomeNewsList(),
                    const SizedBox(height: 32),
                    const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 16),
                      child: HomeSectionTitle(title: 'Featured Products'),
                    ),
                    const SizedBox(height: 16),
                  ],
                ),
              ),
            ),
          ),
          // Featured products grid (Content-based)
          featuredAsync.when(
            data: (items) {
              if (items.isEmpty) {
                return const SliverToBoxAdapter(child: SizedBox.shrink());
              }
              return SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                sliver: SliverGrid(
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    mainAxisSpacing: 16,
                    crossAxisSpacing: 16,
                    childAspectRatio: 0.55,
                  ),
                  delegate: SliverChildBuilderDelegate((context, index) {
                    final item = items[index];
                    final product = item.product;
                    
                    if (product == null) return const SizedBox.shrink();

                    final imageUrl = (product.images != null && product.images!.isNotEmpty) 
                        ? product.images!.first 
                        : (product.imageUrl ?? item.imageUrl ?? 'https://picsum.photos/300?random=$index');
                        
                    return ProductCard(
                      image: imageUrl,
                      title: product.name,
                      brand: 'Zelixa',
                      price: product.price,
                      originalPrice: product.discountPrice != null ? product.price : product.price * 1.2,
                      rating: 4.5,
                      description: product.shortDescription ?? product.description,
                      sizes: const ['S', 'M', 'L', 'XL'],
                      colorHexes: const [
                        '#FF5733',
                        '#33FF57',
                        '#3357FF',
                        '#F1C40F',
                      ],
                    );
                  }, childCount: items.length),
                ),
              );
            },
            loading: () => const SliverToBoxAdapter(
              child: Center(child: Padding(
                padding: EdgeInsets.all(20.0),
                child: CircularProgressIndicator(),
              )),
            ),
            error: (error, _) => const SliverToBoxAdapter(
              child: Center(child: Icon(Icons.error_outline)),
            ),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 120)),
        ],
      ),
    );
  }
}

