import 'package:flutter/material.dart';
import '../pages/product/product_detail_page.dart';

class ProductCard extends StatelessWidget {
  final String image;
  final String title;
  final String brand;
  final String? description; // <-- deskripsi singkat
  final double price;
  final double? originalPrice;
  final double rating;
  final List<String>? sizes;
  final List<String>? colorHexes; // <-- Hex colors sebagai string
  final bool isFavorite;
  final VoidCallback? onTap;
  final VoidCallback? onFavoriteTap;

  const ProductCard({
    super.key,
    required this.image,
    required this.title,
    required this.brand,
    this.description,
    required this.price,
    this.originalPrice,
    this.rating = 4.5,
    this.sizes,
    this.colorHexes,
    this.isFavorite = false,
    this.onTap,
    this.onFavoriteTap,
  });

  // Helper: convert hex string ke Color
  Color _hexToColor(String hex) {
    hex = hex.replaceAll('#', '');
    if (hex.length == 6) hex = 'FF$hex'; // tambahkan alpha jika tidak ada
    return Color(int.parse(hex, radix: 16));
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => ProductDetailPage(
              images: [image, 'https://picsum.photos/600/600?random=${title.length}'],
              title: title,
              brand: brand,
              price: price,
              originalPrice: originalPrice,
              rating: rating,
              description: description,
              stock: 85,
              soldCount: 120,
            ),
          ),
        );
      },
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.grey.shade200),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // IMAGE
            Expanded(
              flex: 12,
              child: Stack(
                children: [
                  Positioned.fill(
                    child: ClipRRect(
                      borderRadius: const BorderRadius.vertical(
                        top: Radius.circular(16),
                      ),
                      child: Image.network(image, fit: BoxFit.cover),
                    ),
                  ),
                  Positioned(
                    top: 8,
                    right: 8,
                    child: GestureDetector(
                      onTap: onFavoriteTap,
                      child: Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.9),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          isFavorite ? Icons.favorite : Icons.favorite_border,
                          size: 16,
                          color: isFavorite ? Colors.red : Colors.grey,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // CONTENT
            Expanded(
              flex: 15,
              child: Padding(
                padding: const EdgeInsets.all(10),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Brand
                    Text(
                      brand,
                      style: const TextStyle(fontSize: 10, color: Colors.grey),
                    ),
                    const SizedBox(height: 2),

                    // Title
                    Text(
                      title,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 2),

                    // Deskripsi 2 baris
                    if (description != null)
                      Text(
                        description!,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 10,
                          color: Colors.grey,
                        ),
                      ),
                    const SizedBox(height: 4),

                    // Rating
                    Row(
                      children: [
                        const Icon(Icons.star, size: 12, color: Colors.amber),
                        const SizedBox(width: 4),
                        Text(
                          rating.toString(),
                          style: const TextStyle(fontSize: 10),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),

                    // Price
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.baseline,
                      textBaseline: TextBaseline.alphabetic,
                      children: [
                        Text(
                          "Rp ${price.toStringAsFixed(0)}",
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                            color: Colors.deepPurple,
                          ),
                        ),
                        if (originalPrice != null) ...[
                          const SizedBox(width: 4),
                          Text(
                            "Rp ${originalPrice!.toStringAsFixed(0)}",
                            style: const TextStyle(
                              fontSize: 9,
                              color: Colors.grey,
                              decoration: TextDecoration.lineThrough,
                            ),
                          ),
                        ],
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSizeBadge(String size) {
    return Container(
      margin: const EdgeInsets.only(right: 4),
      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey.shade300),
        borderRadius: BorderRadius.circular(4),
      ),
      child: Text(size, style: const TextStyle(fontSize: 8)),
    );
  }

  Widget _buildMoreBadge(int count) {
    return Container(
      margin: const EdgeInsets.only(right: 4),
      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey.shade300),
        borderRadius: BorderRadius.circular(4),
        color: Colors.grey.shade50,
      ),
      child: Text(
        '+$count',
        style: const TextStyle(fontSize: 8, color: Colors.grey),
      ),
    );
  }

  Widget _buildColorDot(String hex) {
    return Container(
      margin: const EdgeInsets.only(right: 4),
      width: 10,
      height: 10,
      decoration: BoxDecoration(
        color: _hexToColor(hex),
        shape: BoxShape.circle,
        border: Border.all(color: Colors.grey.shade200, width: 0.5),
      ),
    );
  }

  Widget _buildMoreText(int count) {
    return Text(
      '+$count',
      style: const TextStyle(fontSize: 8, color: Colors.grey),
    );
  }
}
