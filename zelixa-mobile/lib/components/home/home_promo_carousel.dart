import 'package:flutter/material.dart';

class HomePromoCarousel extends StatefulWidget {
  const HomePromoCarousel({super.key});

  @override
  State<HomePromoCarousel> createState() => _HomePromoCarouselState();
}

class _HomePromoCarouselState extends State<HomePromoCarousel> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        SizedBox(
          height: 200,
          child: PageView(
            onPageChanged: (index) {
              setState(() {
                _currentIndex = index;
              });
            },
            children: [
              _buildPromoBannerContent(
                title: 'Summer Collection',
                subtitle: 'Up to 40% OFF',
                tag: 'New Arrival',
                color1: const Color(0xFF6A1B9A),
                color2: const Color(0xFFAB47BC),
              ),
              _buildPromoBannerContent(
                title: 'Exclusive Watches',
                subtitle: 'Starting at \$99',
                tag: 'Limited Edition',
                color1: const Color(0xFF1A237E),
                color2: const Color(0xFF3949AB),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(
            2,
            (index) => Padding(
              padding: const EdgeInsets.symmetric(horizontal: 4),
              child: _buildIndicator(_currentIndex == index),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildIndicator(bool isActive) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      width: isActive ? 16 : 6,
      height: 6,
      decoration: BoxDecoration(
        color: isActive ? const Color(0xFF6A1B9A) : Colors.grey[300],
        borderRadius: BorderRadius.circular(3),
      ),
    );
  }

  Widget _buildPromoBannerContent({
    required String title,
    required String subtitle,
    required String tag,
    required Color color1,
    required Color color2,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20), // <-- radius banner
        child: Container(
          decoration: BoxDecoration(
            color: Colors.white,
            border: Border.all(color: Colors.grey.shade200),
          ),
          child: Stack(
            children: [
              Positioned(
                right: -40,
                bottom: -40,
                child: Icon(
                  Icons.local_mall_outlined,
                  size: 220,
                  color: Colors.black.withOpacity(0.03),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.grey.shade100,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        tag,
                        style: TextStyle(
                          color: color1,
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      title,
                      style: const TextStyle(
                        color: Colors.black,
                        fontSize: 26,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 0.5,
                      ),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Special Offer Just For You',
                      style: TextStyle(
                        color: Colors.grey,
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 20),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                      decoration: BoxDecoration(
                        color: color1,
                        borderRadius: BorderRadius.circular(30),
                      ),
                      child: const Text(
                        'Shop Now',
                        style: TextStyle(
                          color: Colors.white,
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
}
