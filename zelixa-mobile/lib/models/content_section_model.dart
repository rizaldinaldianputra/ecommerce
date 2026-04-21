import 'product_model.dart';

class ContentItem {
  final int? id;
  final String? platform;
  final String? type;
  final String? tag;
  final String? imageUrl;
  final String? title;
  final String? subtitle;
  final String? badgeText;
  final String? ctaText;
  final String? linkUrl;
  final String? emoji;
  final String? iconName;
  final int? productId;
  final String? styleConfig;
  final int? displayOrder;
  final Product? product;
  final List<Product>? products;
  final DateTime? startDate;
  final DateTime? endDate;
  final String? contentBody;
  final String? bannerUrl;
  final String? productIds;

  ContentItem({
    this.id,
    this.platform,
    this.type,
    this.tag,
    this.imageUrl,
    this.title,
    this.subtitle,
    this.badgeText,
    this.ctaText,
    this.linkUrl,
    this.emoji,
    this.iconName,
    this.productId,
    this.styleConfig,
    this.displayOrder,
    this.product,
    this.products,
    this.startDate,
    this.endDate,
    this.contentBody,
    this.bannerUrl,
    this.productIds,
  });

  factory ContentItem.fromJson(Map<String, dynamic> json) {
    return ContentItem(
      id: json['id'],
      platform: json['platform'],
      type: json['type'],
      tag: json['tag'],
      imageUrl: json['imageUrl'],
      title: json['title'],
      subtitle: json['subtitle'],
      badgeText: json['badgeText'],
      ctaText: json['ctaText'],
      linkUrl: json['linkUrl'],
      emoji: json['emoji'],
      iconName: json['iconName'],
      productId: json['productId'],
      styleConfig: json['styleConfig'],
      displayOrder: json['displayOrder'],
      product: json['product'] != null ? Product.fromJson(json['product']) : null,
      products: json['products'] != null 
          ? (json['products'] as List).map((p) => Product.fromJson(p)).toList() 
          : null,
      startDate: json['startDate'] != null ? DateTime.parse(json['startDate']) : null,
      endDate: json['endDate'] != null ? DateTime.parse(json['endDate']) : null,
      contentBody: json['contentBody'],
      bannerUrl: json['bannerUrl'],
      productIds: json['productIds'],
    );
  }
}

class ContentSection {
  final int? id;
  final String platform;
  final String type;
  final String? title;
  final String? subtitle;
  final int displayOrder;
  final bool isActive;
  final List<ContentItem> items;

  ContentSection({
    this.id,
    required this.platform,
    required this.type,
    this.title,
    this.subtitle,
    required this.displayOrder,
    required this.isActive,
    required this.items,
  });

  factory ContentSection.fromJson(Map<String, dynamic> json) {
    return ContentSection(
      id: json['id'],
      platform: json['platform'] ?? 'MOBILE',
      type: json['type'] ?? '',
      title: json['title'],
      subtitle: json['subtitle'],
      displayOrder: json['displayOrder'] ?? 0,
      isActive: json['isActive'] ?? false,
      items: json['items'] != null
          ? (json['items'] as List).map((i) => ContentItem.fromJson(i)).toList()
          : [],
    );
  }
}
