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
    final sectionsAsync = ref.watch(homeSectionsProvider);

    return Scaffold(
      backgroundColor: const Color(0xFFF8F8F8),
      body: sectionsAsync.when(
        data: (sections) {
          final activeSections = sections.where((s) => s.isActive).toList();
          
          return CustomScrollView(
            slivers: [
              const HomeSliverAppBar(),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(16, 20, 16, 0),
                  child: Column(
                    children: const [
                      HomeSearchBar(),
                      SizedBox(height: 24),
                      HomeCategoryIcons(),
                      SizedBox(height: 32),
                    ],
                  ),
                ),
              ),
              
              // Dynamic Sections Rendering
              ...activeSections.map((section) {
                if (section.items.isEmpty) return const SliverToBoxAdapter(child: SizedBox.shrink());

                switch (section.type) {
                  case 'MOBILE_PROMO':
                    return SliverToBoxAdapter(
                      child: Padding(
                        padding: const EdgeInsets.only(bottom: 32),
                        child: HomePromoCarousel(), // Note: Ideally this would take items from section.items
                      ),
                    );
                  
                  case 'FLASH_SALE_MOBILE':
                    return SliverToBoxAdapter(
                      child: Padding(
                        padding: const EdgeInsets.only(bottom: 32),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 16),
                              child: HomeSectionTitle(
                                title: section.title ?? 'Flash Sale',
                                hasTimer: true,
                              ),
                            ),
                            const SizedBox(height: 16),
                            const HomeFlashSale(),
                          ],
                        ),
                      ),
                    );

                  case 'TRENDING_LIST':
                    return SliverToBoxAdapter(
                      child: Padding(
                        padding: const EdgeInsets.only(bottom: 32),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 16),
                              child: HomeSectionTitle(title: section.title ?? 'Trending Now'),
                            ),
                            const SizedBox(height: 16),
                            const HomeTrendingList(),
                          ],
                        ),
                      ),
                    );

                  case 'NEWS':
                    return SliverToBoxAdapter(
                      child: const Padding(
                        padding: EdgeInsets.only(bottom: 32),
                        child: HomeNewsList(),
                      ),
                    );

                  case 'FEATURED_MOBILE':
                    return SliverPadding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      sliver: SliverMainAxisGroup(
                        slivers: [
                          SliverToBoxAdapter(
                            child: Padding(
                              padding: const EdgeInsets.only(bottom: 16),
                              child: HomeSectionTitle(title: section.title ?? 'Featured Products'),
                            ),
                          ),
                          SliverGrid(
                            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: 2,
                              mainAxisSpacing: 16,
                              crossAxisSpacing: 16,
                              childAspectRatio: 0.55,
                            ),
                            delegate: SliverChildBuilderDelegate((context, index) {
                              final item = section.items[index];
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
                            }, childCount: section.items.length),
                          ),
                        ],
                      ),
                    );

                  default:
                    return const SliverToBoxAdapter(child: SizedBox.shrink());
                }
              }).toList(),

              const SliverToBoxAdapter(child: SizedBox(height: 120)),
            ],
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, _) => Center(child: Text('Error: $error')),
      ),
    );
  }
}

