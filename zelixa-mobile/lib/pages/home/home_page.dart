import 'package:flutter/material.dart';
import '../../components/card_widget.dart';
import '../../components/home/home_app_bar.dart';
import '../../components/home/home_search_bar.dart';
import '../../components/home/home_promo_carousel.dart';
import '../../components/home/home_category_icons.dart';
import '../../components/home/home_flash_sale.dart';
import '../../components/home/home_trending_list.dart';
import '../../components/home/home_section_title.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
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
          // Featured products grid
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            sliver: SliverGrid(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                mainAxisSpacing: 16,
                crossAxisSpacing: 16,
                childAspectRatio: 0.55,
              ),
              delegate: SliverChildBuilderDelegate((context, index) {
                return ProductCard(
                  image: 'https://picsum.photos/300?random=$index',
                  title: 'Premium Outfit $index',
                  brand: 'Zelixa',
                  price: 150000 + (index * 20000),
                  originalPrice: 200000 + (index * 20000),
                  rating: 4.5,
                  description: 'Premium Outfit $index',
                  sizes: const ['S', 'M', 'L', 'XL'],
                  colorHexes: const [
                    '#FF5733',
                    '#33FF57',
                    '#3357FF',
                    '#F1C40F',
                  ],
                );
              }, childCount: 6),
            ),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 120)),
        ],
      ),
    );
  }
}
