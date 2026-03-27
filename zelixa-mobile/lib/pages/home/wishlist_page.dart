import 'package:flutter/material.dart';
import '../../config/app_style.dart';
import '../../components/card_widget.dart';

class WishlistPage extends StatelessWidget {
  const WishlistPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F8F8),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: Text(
          'My Wishlist',
          style: AppStyle.heading.copyWith(color: AppColors.primary),
        ),
      ),
      body: GridView.builder(
        padding: const EdgeInsets.all(16),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          mainAxisSpacing: 16,
          crossAxisSpacing: 16,
          childAspectRatio: 0.6,
        ),
        itemCount: 4,
        itemBuilder: (context, index) {
          return ProductCard(
            image: 'https://picsum.photos/300?random=${index + 100}',
            title: 'Wishlist Item $index',
            brand: 'Zelixa',
            price: 250000,
            rating: 4.8,
          );
        },
      ),
    );
  }
}
