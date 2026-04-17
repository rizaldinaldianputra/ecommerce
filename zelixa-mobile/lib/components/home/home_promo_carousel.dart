import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../models/content_section_model.dart';
import '../../riverpod/home_provider.dart';

class HomePromoCarousel extends ConsumerStatefulWidget {
  const HomePromoCarousel({super.key});

  @override
  ConsumerState<HomePromoCarousel> createState() => _HomePromoCarouselState();
}

class _HomePromoCarouselState extends ConsumerState<HomePromoCarousel> {
  final PageController _controller = PageController();
  int _currentIndex = 0;
  Timer? _timer;
  int _itemCount = 0;

  @override
  void initState() {
    super.initState();
    _startAutoSlide();
  }

  void _startAutoSlide() {
    _timer = Timer.periodic(const Duration(seconds: 4), (timer) {
      if (_itemCount > 0) {
        int nextPage = (_currentIndex + 1) % _itemCount;
        if (_controller.hasClients) {
          _controller.animateToPage(
            nextPage,
            duration: const Duration(milliseconds: 600),
            curve: Curves.easeInOut,
          );
        }
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    _controller.dispose();
    super.dispose();
  }

  // Helper to parse hex colors securely
  Color parseColor(String? hexString, Color defaultColor) {
    if (hexString == null || hexString.isEmpty) return defaultColor;
    try {
      final hex = hexString.replaceAll('#', '');
      return Color(int.parse('FF$hex', radix: 16));
    } catch (_) {
      return defaultColor;
    }
  }

  @override
  Widget build(BuildContext context) {
    final bannersAsync = ref.watch(homePromoBannersProvider);

    return bannersAsync.when(
      data: (banners) {
        if (banners.isEmpty) return const SizedBox.shrink();

        _itemCount = banners.length;

        return Column(
          children: [
            SizedBox(
              height: 200,
              child: PageView.builder(
                controller: _controller,
                itemCount: banners.length,
                onPageChanged: (index) {
                  setState(() => _currentIndex = index);
                },
                itemBuilder: (context, index) {
                  return _buildBanner(banners[index]);
                },
              ),
            ),
            const SizedBox(height: 12),
            _buildIndicator(banners.length),
          ],
        );
      },
      loading: () => const SizedBox(
        height: 200,
        child: Center(child: CircularProgressIndicator()),
      ),
      error: (error, _) => const SizedBox(
        height: 200,
        child: Center(child: Icon(Icons.error_outline)),
      ),
    );
  }

  Widget _buildIndicator(int length) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(length, (index) {
        bool isActive = _currentIndex == index;
        return AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          margin: const EdgeInsets.symmetric(horizontal: 4),
          width: isActive ? 20 : 6,
          height: 6,
          decoration: BoxDecoration(
            color: isActive ? Colors.deepPurple : Colors.grey[300],
            borderRadius: BorderRadius.circular(3),
          ),
        );
      }),
    );
  }

  Widget _buildBanner(ContentItem item) {
    // We try to extract colors from styleConfig if available, else fallback
    // e.g. styleConfig = '{"bgFrom":"#6A1B9A","bgTo":"#AB47BC","accent":"#ffffff"}'
    Color color1 = const Color(0xFF6A1B9A);
    Color color2 = const Color(0xFFAB47BC);

    if (item.styleConfig != null && item.styleConfig!.contains('bgFrom')) {
      final Map<String, dynamic> config = _parseJsonOrFallback(item.styleConfig!);
      color1 = parseColor(config['bgFrom'], color1);
      color2 = parseColor(config['bgTo'], color2);
    }

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: Container(
          decoration: BoxDecoration(
             image: item.imageUrl != null 
             ? DecorationImage(
                image: NetworkImage(item.imageUrl!),
                fit: BoxFit.cover,
                colorFilter: ColorFilter.mode(Colors.black.withOpacity(0.3), BlendMode.darken),
               )
             : null,
            gradient: item.imageUrl == null ? LinearGradient(
              colors: [color1, color2],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ) : null,
          ),
          child: Stack(
            children: [
              if (item.imageUrl == null)
                Positioned(
                  right: -30,
                  bottom: -30,
                  child: Icon(
                    item.iconName != null ? _getIconData(item.iconName!) : Icons.shopping_bag_outlined,
                    size: 180,
                    color: Colors.white.withOpacity(0.1),
                  ),
                ),
              Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    if (item.badgeText != null && item.badgeText!.isNotEmpty)
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 10,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Text(
                          item.badgeText!,
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                          ),
                        ),
                      ),
                    const SizedBox(height: 10),
                    Text(
                      item.title ?? 'Promo Banner',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    if (item.subtitle != null)
                      Text(
                        item.subtitle!,
                        style: const TextStyle(
                          color: Colors.white70,
                          fontSize: 14,
                        ),
                      ),
                    const SizedBox(height: 16),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 20,
                        vertical: 10,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(30),
                      ),
                      child: Text(
                        item.ctaText ?? "Shop Now",
                        style: TextStyle(
                          color: color1,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  IconData _getIconData(String iconName) {
    switch (iconName) {
      case 'star': return Icons.star;
      case 'local_fire_department': return Icons.local_fire_department;
      case 'new_releases': return Icons.new_releases;
      default: return Icons.shopping_bag_outlined;
    }
  }

  Map<String, dynamic> _parseJsonOrFallback(String jsonStr) {
    try {
      return json.decode(jsonStr);
    } catch (_) {
      return {};
    }
  }
}

