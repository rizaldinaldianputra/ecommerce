import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../config/app_style.dart';

class ProductDetailPage extends StatefulWidget {
  final String title;
  final String brand;
  final List<String> images;
  final double price;
  final double? originalPrice;
  final double rating;
  final String? description;
  final List<String>? sizes;
  final List<String>? colorHexes;
  final int stock;
  final int soldCount;

  const ProductDetailPage({
    super.key,
    required this.images,
    required this.title,
    required this.brand,
    required this.price,
    this.originalPrice,
    this.rating = 4.5,
    this.description,
    this.sizes,
    this.colorHexes,
    this.stock = 100,
    this.soldCount = 45,
  });

  @override
  State<ProductDetailPage> createState() => _ProductDetailPageState();
}

class _ProductDetailPageState extends State<ProductDetailPage> {
  String? selectedSize;
  String? selectedColorHex;
  int quantity = 1;
  int activeImageIndex = 0;
  final PageController _pageController = PageController();

  final List<String> defaultSizes = ['S', 'M', 'L', 'XL'];
  final List<String> defaultColors = [
    '#FF5733',
    '#33FF57',
    '#3357FF',
    '#000000',
  ];

  @override
  void initState() {
    super.initState();
    selectedSize = (widget.sizes != null && widget.sizes!.isNotEmpty)
        ? widget.sizes![0]
        : 'M';
    selectedColorHex =
        (widget.colorHexes != null && widget.colorHexes!.isNotEmpty)
        ? widget.colorHexes![0]
        : '#FF5733';
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  Color _hexToColor(String hex) {
    hex = hex.replaceAll('#', '');
    if (hex.length == 6) hex = 'FF$hex';
    return Color(int.parse(hex, radix: 16));
  }

  @override
  Widget build(BuildContext context) {
    final sizes = widget.sizes ?? defaultSizes;
    final colorHexes = widget.colorHexes ?? defaultColors;

    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        children: [
          CustomScrollView(
            slivers: [
              // Product Image with Hero & Gallery Support
              SliverAppBar(
                expandedHeight: 450,
                pinned: true,
                leading: Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: CircleAvatar(
                    backgroundColor: Colors.white.withAlpha(200),
                    child: IconButton(
                      icon: const Icon(Icons.arrow_back, color: Colors.black),
                      onPressed: () => Navigator.pop(context),
                    ),
                  ),
                ),
                actions: [
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: CircleAvatar(
                      backgroundColor: Colors.white.withAlpha(200),
                      child: IconButton(
                        icon: const Icon(
                          Icons.favorite_border,
                          color: Colors.black,
                        ),
                        onPressed: () {},
                      ),
                    ),
                  ),
                ],
                backgroundColor: Colors.white,
                flexibleSpace: FlexibleSpaceBar(
                  background: Hero(
                    tag: 'product-${widget.title}',
                    child: PageView.builder(
                      controller: _pageController,
                      onPageChanged: (index) =>
                          setState(() => activeImageIndex = index),
                      itemCount: widget.images.length,
                      itemBuilder: (context, index) {
                        return Image.network(
                          widget.images[index],
                          fit: BoxFit.cover,
                        );
                      },
                    ),
                  ),
                ),
              ),

              // Content
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Image Gallery Thumbnails
                      if (widget.images.length > 1)
                        Container(
                          height: 60,
                          margin: const EdgeInsets.only(bottom: 24),
                          child: ListView.builder(
                            scrollDirection: Axis.horizontal,
                            itemCount: widget.images.length,
                            itemBuilder: (context, index) {
                              final isSelected = activeImageIndex == index;
                              return GestureDetector(
                                onTap: () {
                                  _pageController.animateToPage(
                                    index,
                                    duration: const Duration(milliseconds: 300),
                                    curve: Curves.easeInOut,
                                  );
                                },
                                child: Container(
                                  width: 60,
                                  margin: const EdgeInsets.only(right: 12),
                                  decoration: BoxDecoration(
                                    borderRadius: BorderRadius.circular(10),
                                    border: Border.all(
                                      color: isSelected
                                          ? AppColors.primary
                                          : Colors.grey.shade200,
                                      width: 2,
                                    ),
                                    image: DecorationImage(
                                      image: NetworkImage(widget.images[index]),
                                      fit: BoxFit.cover,
                                    ),
                                  ),
                                ),
                              );
                            },
                          ),
                        ),

                      // Brand & Statistics
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                widget.brand.toUpperCase(),
                                style: AppStyle.bodyText.copyWith(
                                  color: AppColors.primary,
                                  fontWeight: FontWeight.bold,
                                  letterSpacing: 1.2,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Row(
                                children: [
                                  const Icon(
                                    Icons.shopping_bag_outlined,
                                    size: 14,
                                    color: Colors.grey,
                                  ),
                                  const SizedBox(width: 4),
                                  Text(
                                    '${widget.soldCount} terjual',
                                    style: const TextStyle(
                                      color: Colors.grey,
                                      fontSize: 12,
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  const Icon(
                                    Icons.inventory_2_outlined,
                                    size: 14,
                                    color: Colors.grey,
                                  ),
                                  const SizedBox(width: 4),
                                  Text(
                                    'Stok: ${widget.stock}',
                                    style: const TextStyle(
                                      color: Colors.grey,
                                      fontSize: 12,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 10,
                              vertical: 5,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.amber.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Row(
                              children: [
                                const Icon(
                                  Icons.star,
                                  color: Colors.amber,
                                  size: 16,
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  '${widget.rating}',
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Text(
                        widget.title,
                        style: AppStyle.heading.copyWith(
                          fontSize: 26,
                          height: 1.2,
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Price & Quantity Selector
                      Row(
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Rp ${widget.price.toInt()}',
                                style: AppStyle.priceText.copyWith(
                                  fontSize: 24,
                                ),
                              ),
                              if (widget.originalPrice != null)
                                Text(
                                  'Rp ${widget.originalPrice!.toInt()}',
                                  style: const TextStyle(
                                    color: Colors.grey,
                                    fontSize: 14,
                                    decoration: TextDecoration.lineThrough,
                                  ),
                                ),
                            ],
                          ),
                          const Spacer(),
                          Container(
                            decoration: BoxDecoration(
                              color: Colors.grey.shade100,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Row(
                              children: [
                                IconButton(
                                  icon: const Icon(Icons.remove, size: 18),
                                  onPressed: () {
                                    if (quantity > 1)
                                      setState(() => quantity--);
                                  },
                                ),
                                Text(
                                  '$quantity',
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16,
                                  ),
                                ),
                                IconButton(
                                  icon: const Icon(Icons.add, size: 18),
                                  onPressed: () {
                                    if (quantity < widget.stock)
                                      setState(() => quantity++);
                                  },
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 32),

                      // Size Selection
                      Text('Pilih Ukuran', style: AppStyle.subHeading),
                      const SizedBox(height: 16),
                      SizedBox(
                        height: 50,
                        child: ListView.builder(
                          scrollDirection: Axis.horizontal,
                          itemCount: sizes.length,
                          itemBuilder: (context, index) {
                            final isSelected = selectedSize == sizes[index];
                            return GestureDetector(
                              onTap: () =>
                                  setState(() => selectedSize = sizes[index]),
                              child: AnimatedContainer(
                                duration: const Duration(milliseconds: 200),
                                margin: const EdgeInsets.only(right: 12),
                                width: 50,
                                decoration: BoxDecoration(
                                  color: isSelected
                                      ? AppColors.primary
                                      : Colors.white,
                                  borderRadius: BorderRadius.circular(15),
                                  border: Border.all(
                                    color: isSelected
                                        ? AppColors.primary
                                        : Colors.grey.shade200,
                                    width: 1.5,
                                  ),
                                ),
                                child: Center(
                                  child: Text(
                                    sizes[index],
                                    style: TextStyle(
                                      color: isSelected
                                          ? Colors.white
                                          : Colors.black87,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                              ),
                            );
                          },
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Color Selection
                      Text('Pilih Warna', style: AppStyle.subHeading),
                      const SizedBox(height: 16),
                      Row(
                        children: colorHexes.map((hex) {
                          final isSelected = selectedColorHex == hex;
                          return GestureDetector(
                            onTap: () => setState(() => selectedColorHex = hex),
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 200),
                              margin: const EdgeInsets.only(right: 16),
                              padding: const EdgeInsets.all(3),
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: isSelected
                                      ? AppColors.primary
                                      : Colors.transparent,
                                  width: 2,
                                ),
                              ),
                              child: CircleAvatar(
                                radius: 18,
                                backgroundColor: _hexToColor(hex),
                              ),
                            ),
                          );
                        }).toList(),
                      ),
                      const SizedBox(height: 32),

                      // Description
                      Text('Deskripsi', style: AppStyle.subHeading),
                      const SizedBox(height: 12),
                      Text(
                        widget.description ??
                            'Produk ini dirancang dengan kualitas premium untuk memberikan kenyamanan maksimal. Sangat cocok untuk gaya hidup modern yang mengutamakan estetika dan durabilitas.',
                        style: AppStyle.bodyText.copyWith(height: 1.6),
                      ),
                      const SizedBox(height: 32),

                      // Specifications
                      Text('Spesifikasi Produk', style: AppStyle.subHeading),
                      const SizedBox(height: 12),
                      _buildSpecItem('Kategori', 'Fashion Wanita'),
                      _buildSpecItem('Material', 'Premium Cotton Fabric'),
                      _buildSpecItem('Asal Produk', 'Import'),
                      _buildSpecItem('Gaya', 'Casual / Formal'),
                      const SizedBox(height: 32),

                      // Reviews Section
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('Ulasan Pembeli', style: AppStyle.subHeading),
                          TextButton(
                            onPressed: () {},
                            child: const Text('Lihat Semua'),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      _buildReviewItem(
                        'Rizal Dinaldian',
                        'Sangat bagus bahannya adem dan nyaman dipakai. Respon penjual juga sangat cepat! 🔥',
                        5.0,
                        'https://i.pravatar.cc/150?u=rizal',
                      ),
                      const SizedBox(height: 16),
                      _buildReviewItem(
                        'Shekza Zelixa',
                        'Packing rapih, barang sampai tepat waktu. Kualitas premium banget sesuai harga.',
                        4.5,
                        'https://i.pravatar.cc/150?u=shekza',
                      ),
                      const SizedBox(height: 140),
                    ],
                  ),
                ),
              ),
            ],
          ),

          // Footer with TWO buttons
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 34),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(30),
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.06),
                    blurRadius: 20,
                    offset: const Offset(0, -10),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Expanded(
                    flex: 1,
                    child: OutlinedButton(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Ditambahkan ke keranjang!'),
                            behavior: SnackBarBehavior.floating,
                          ),
                        );
                      },
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        side: BorderSide(color: AppColors.primary),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(15),
                        ),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.shopping_cart, color: AppColors.primary),
                          const SizedBox(width: 8),
                          Text(
                            'Keranjang',
                            style: TextStyle(
                              color: AppColors.primary,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),

                  // Buy Now
                  Expanded(
                    flex: 1,
                    child: ElevatedButton(
                      onPressed: () {
                        context.push(
                          '/checkout',
                          extra: {
                            'title': widget.title,
                            'price': widget.price,
                            'image': widget.images[0],
                            'quantity': quantity,
                            'size': selectedSize,
                            'color': selectedColorHex,
                            'brand': widget.brand,
                          },
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(15),
                        ),
                        elevation: 0,
                      ),
                      child: const Text(
                        'Beli Sekarang',
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSpecItem(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Colors.grey, fontSize: 13)),
          Text(
            value,
            style: const TextStyle(fontWeight: FontWeight.w500, fontSize: 13),
          ),
        ],
      ),
    );
  }

  Widget _buildReviewItem(
    String name,
    String comment,
    double rating,
    String avatar,
  ) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.grey.shade50,
        borderRadius: BorderRadius.circular(15),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(radius: 14, backgroundImage: NetworkImage(avatar)),
              const SizedBox(width: 8),
              Text(
                name,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 13,
                ),
              ),
              const Spacer(),
              Row(
                children: List.generate(5, (index) {
                  return Icon(
                    Icons.star,
                    size: 10,
                    color: index < rating ? Colors.amber : Colors.grey.shade300,
                  );
                }),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            comment,
            style: const TextStyle(
              fontSize: 12,
              color: Colors.black87,
              height: 1.4,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFooterAction(IconData icon, String label) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 22, color: Colors.grey.shade700),
        const SizedBox(height: 2),
        Text(label, style: const TextStyle(fontSize: 10, color: Colors.grey)),
      ],
    );
  }
}
