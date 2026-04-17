class CartItemResponse {
  final int id;
  final int productId;
  final String productName;
  final int productVariantId;
  final String size;
  final String color;
  final String groupName;
  final double price;
  final double discountPrice;
  final int quantity;
  final String imageUrl;

  CartItemResponse({
    required this.id,
    required this.productId,
    required this.productName,
    required this.productVariantId,
    required this.size,
    required this.color,
    required this.groupName,
    required this.price,
    required this.discountPrice,
    required this.quantity,
    required this.imageUrl,
  });

  factory CartItemResponse.fromJson(Map<String, dynamic> json) {
    return CartItemResponse(
      id: json['id'] ?? 0,
      productId: json['productId'] ?? 0,
      productName: json['productName'] ?? '',
      productVariantId: json['productVariantId'] ?? 0,
      size: json['size'] ?? '',
      color: json['color'] ?? '',
      groupName: json['groupName'] ?? '',
      price: (json['price'] ?? 0).toDouble(),
      discountPrice: (json['discountPrice'] ?? 0).toDouble(),
      quantity: json['quantity'] ?? 1,
      imageUrl: json['imageUrl'] ?? '',
    );
  }
}

class CartItemRequest {
  final int productVariantId;
  final int quantity;

  CartItemRequest({
    required this.productVariantId,
    required this.quantity,
  });

  Map<String, dynamic> toJson() {
    return {
      'productVariantId': productVariantId,
      'quantity': quantity,
    };
  }
}
