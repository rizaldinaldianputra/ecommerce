import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../config/app_style.dart';
import '../../components/card_widget.dart';

class WishlistPage extends StatefulWidget {
  const WishlistPage({super.key});

  @override
  State<WishlistPage> createState() => _WishlistPageState();
}

class _WishlistPageState extends State<WishlistPage> {
  final List<Map<String, dynamic>> _wishlistItems = [
    {
      'id': '1',
      'title': 'Premium Casual Hoodie',
      'brand': 'ZELIXA WEAR',
      'price': 250000.0,
      'originalPrice': 350000.0,
      'image': 'https://picsum.photos/300/400?random=10',
      'rating': 4.8,
      'sizes': ['S', 'M', 'L', 'XL'],
      'colorHexes': ['#2575FC', '#1A1A1A', '#F8F9FA'],
      'description': 'Premium casual hoodie with soft fabric.',
    },
    {
      'id': '2',
      'title': 'Slim Fit Denim Jacket',
      'brand': 'ZELIXA DENIM',
      'price': 450000.0,
      'originalPrice': 600000.0,
      'image': 'https://picsum.photos/300/400?random=20',
      'rating': 4.6,
      'sizes': ['S', 'M', 'L'],
      'colorHexes': ['#3357FF', '#6A11CB'],
      'description': 'Slim fit denim jacket for all occasions.',
    },
    {
      'id': '3',
      'title': 'Oversized Graphic Tee',
      'brand': 'ZELIXA STREET',
      'price': 120000.0,
      'originalPrice': 180000.0,
      'image': 'https://picsum.photos/300/400?random=30',
      'rating': 4.5,
      'sizes': ['M', 'L', 'XL', 'XXL'],
      'colorHexes': ['#FF4D4D', '#FFFFFF', '#1A1A1A'],
      'description': 'Oversized graphic tee, street style.',
    },
    {
      'id': '4',
      'title': 'Linen Summer Shirt',
      'brand': 'ZELIXA RESORT',
      'price': 195000.0,
      'originalPrice': 260000.0,
      'image': 'https://picsum.photos/300/400?random=40',
      'rating': 4.7,
      'sizes': ['S', 'M', 'L'],
      'colorHexes': ['#F1C40F', '#FFFFFF', '#2ECC71'],
      'description': 'Breezy linen shirt perfect for summer.',
    },
  ];

  void _removeItem(String id) {
    setState(() {
      _wishlistItems.removeWhere((item) => item['id'] == id);
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('Item removed from wishlist'),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        backgroundColor: AppColors.primary,
        duration: const Duration(seconds: 2),
        action: SnackBarAction(
          label: 'Undo',
          textColor: Colors.white,
          onPressed: () {},
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F8F8),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.black87, size: 20),
          onPressed: () => context.pop(),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'My Wishlist',
              style: AppStyle.heading.copyWith(fontSize: 20, color: AppColors.primary),
            ),
            if (_wishlistItems.isNotEmpty)
              Text(
                '${_wishlistItems.length} items saved',
                style: AppStyle.bodyText.copyWith(fontSize: 12),
              ),
          ],
        ),
        actions: [
          if (_wishlistItems.isNotEmpty)
            TextButton(
              onPressed: () {
                showDialog(
                  context: context,
                  builder: (ctx) => AlertDialog(
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    title: const Text('Clear Wishlist', style: TextStyle(fontWeight: FontWeight.bold)),
                    content: const Text('Are you sure you want to remove all wishlisted items?'),
                    actions: [
                      TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
                      ElevatedButton(
                        onPressed: () {
                          setState(() => _wishlistItems.clear());
                          Navigator.pop(ctx);
                        },
                        style: ElevatedButton.styleFrom(backgroundColor: AppColors.accent, foregroundColor: Colors.white),
                        child: const Text('Clear'),
                      ),
                    ],
                  ),
                );
              },
              child: Text('Clear All', style: TextStyle(color: AppColors.accent, fontSize: 13)),
            ),
          const SizedBox(width: 8),
        ],
      ),
      body: _wishlistItems.isEmpty ? _buildEmptyState() : _buildWishlistGrid(),
    );
  }

  Widget _buildWishlistGrid() {
    return GridView.builder(
      padding: const EdgeInsets.all(16),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        mainAxisSpacing: 16,
        crossAxisSpacing: 16,
        childAspectRatio: 0.55,
      ),
      itemCount: _wishlistItems.length,
      itemBuilder: (context, index) {
        final item = _wishlistItems[index];
        return Stack(
          children: [
            ProductCard(
              image: item['image'],
              title: item['title'],
              brand: item['brand'],
              price: item['price'],
              originalPrice: item['originalPrice'],
              rating: item['rating'],
              description: item['description'],
              sizes: List<String>.from(item['sizes']),
              colorHexes: List<String>.from(item['colorHexes']),
            ),
            Positioned(
              top: 8,
              right: 8,
              child: GestureDetector(
                onTap: () => _removeItem(item['id']),
                child: Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(color: Colors.black.withValues(alpha: 0.1), blurRadius: 6, offset: const Offset(0, 2)),
                    ],
                  ),
                  child: const Icon(Icons.favorite_rounded, color: Color(0xFFFF4D4D), size: 18),
                ),
              ),
            ),
          ],
        );
      },
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 120,
            height: 120,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: LinearGradient(
                colors: [AppColors.primary.withValues(alpha: 0.1), AppColors.secondary.withValues(alpha: 0.15)],
              ),
            ),
            child: Icon(Icons.favorite_border_rounded, size: 56, color: AppColors.primary.withValues(alpha: 0.5)),
          ),
          const SizedBox(height: 24),
          Text(
            'Your wishlist is empty',
            style: AppStyle.subHeading.copyWith(fontSize: 18),
          ),
          const SizedBox(height: 8),
          Text(
            'Save items you love and shop them later',
            style: AppStyle.bodyText.copyWith(fontSize: 13),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 32),
          ElevatedButton.icon(
            onPressed: () => context.pop(),
            icon: const Icon(Icons.shopping_bag_outlined, size: 18),
            label: const Text('Start Shopping'),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 14),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
        ],
      ),
    );
  }
}
