import 'category_model.dart';

class ProductVariant {
  final int id;
  final String sku;
  final String? size;
  final String? color;
  final String? hexColor;
  final String? groupName;
  final double price;
  final double? discountPrice;
  final double? costPrice;
  final String? barcode;
  final int stock;
  final bool isActive;
  final String? imageUrl;

  ProductVariant({
    required this.id,
    required this.sku,
    this.size,
    this.color,
    this.hexColor,
    this.groupName,
    required this.price,
    this.discountPrice,
    this.costPrice,
    this.barcode,
    required this.stock,
    required this.isActive,
    this.imageUrl,
  });

  factory ProductVariant.fromJson(Map<String, dynamic> json) {
    return ProductVariant(
      id: json['id'] ?? 0,
      sku: json['sku'] ?? '',
      size: json['size'],
      color: json['color'],
      hexColor: json['hexColor'],
      groupName: json['groupName'],
      price: (json['price'] ?? 0).toDouble(),
      discountPrice: json['discountPrice'] != null ? json['discountPrice'].toDouble() : null,
      costPrice: json['costPrice'] != null ? json['costPrice'].toDouble() : null,
      barcode: json['barcode'],
      stock: json['stock'] ?? 0,
      isActive: json['isActive'] ?? false,
      imageUrl: json['imageUrl'],
    );
  }
}

class Product {
  final int id;
  final String name;
  final String slug;
  final String? description;
  final String? imageUrl;
  final String? shortDescription;
  final int categoryId;
  final int? brandId;
  final String? gender;
  final String? material;
  final double? weight;
  final bool isActive;
  final bool isFeatured;
  final bool isTopProduct;
  final bool isBestSeller;
  final bool isRecommended;
  final Category? category;
  final List<ProductVariant> variants;
  final List<String>? images;

  // Helpers
  double get price => variants.isNotEmpty ? variants.first.price : 0;
  double? get discountPrice => variants.isNotEmpty ? variants.first.discountPrice : null;
  int get totalStock => variants.fold(0, (sum, v) => sum + v.stock);

  Product({
    required this.id,
    required this.name,
    required this.slug,
    this.description,
    this.imageUrl,
    this.shortDescription,
    required this.categoryId,
    this.brandId,
    this.gender,
    this.material,
    this.weight,
    required this.isActive,
    required this.isFeatured,
    required this.isTopProduct,
    required this.isBestSeller,
    required this.isRecommended,
    this.category,
    required this.variants,
    this.images,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      slug: json['slug'] ?? '',
      description: json['description'],
      imageUrl: json['imageUrl'],
      shortDescription: json['shortDescription'],
      categoryId: json['categoryId'] ?? 0,
      brandId: json['brandId'],
      gender: json['gender'],
      material: json['material'],
      weight: json['weight'] != null ? json['weight'].toDouble() : null,
      isActive: json['isActive'] ?? false,
      isFeatured: json['isFeatured'] ?? false,
      isTopProduct: json['isTopProduct'] ?? false,
      isBestSeller: json['isBestSeller'] ?? false,
      isRecommended: json['isRecommended'] ?? false,
      category: json['category'] != null ? Category.fromJson(json['category']) : null,
      variants: json['variants'] != null
          ? (json['variants'] as List).map((v) => ProductVariant.fromJson(v)).toList()
          : [],
      images: json['images'] != null ? List<String>.from(json['images']) : null,
    );
  }
}
