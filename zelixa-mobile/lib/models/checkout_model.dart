class CheckoutRequest {
  final String shippingService;
  final String destinationSubdistrictId;
  final double shippingAmount;
  final String? voucherCode;

  CheckoutRequest({
    required this.shippingService,
    required this.destinationSubdistrictId,
    required this.shippingAmount,
    this.voucherCode,
  });

  Map<String, dynamic> toJson() {
    return {
      'shippingService': shippingService,
      'destinationSubdistrictId': destinationSubdistrictId,
      'shippingAmount': shippingAmount,
      'voucherCode': voucherCode,
    };
  }
}

class OrderItemResponse {
  final int id;
  final int productId;
  final String productName;
  final String groupName;
  final String size;
  final String color;
  final String imageUrl;
  final int quantity;
  final double price;

  OrderItemResponse({
    required this.id,
    required this.productId,
    required this.productName,
    required this.groupName,
    required this.size,
    required this.color,
    required this.imageUrl,
    required this.quantity,
    required this.price,
  });

  factory OrderItemResponse.fromJson(Map<String, dynamic> json) {
    return OrderItemResponse(
      id: json['id'] ?? 0,
      productId: json['productId'] ?? 0,
      productName: json['productName'] ?? '',
      groupName: json['groupName'] ?? '',
      size: json['size'] ?? '',
      color: json['color'] ?? '',
      imageUrl: json['imageUrl'] ?? 'https://picsum.photos/200',
      quantity: json['quantity'] ?? 0,
      price: (json['price'] ?? 0).toDouble(),
    );
  }
}

class OrderResponse {
  final int id;
  final String orderNumber;
  final int userId;
  final double totalAmount;
  final String status;
  final String? trackingNumber;
  final String? paymentToken;
  final String? paymentUrl;
  final double shippingAmount;
  final String? shippingService;
  final String? createdAt;
  final String? updatedAt;
  final List<OrderItemResponse> items;

  OrderResponse({
    required this.id,
    required this.orderNumber,
    required this.userId,
    required this.totalAmount,
    required this.status,
    this.trackingNumber,
    this.paymentToken,
    this.paymentUrl,
    required this.shippingAmount,
    this.shippingService,
    this.createdAt,
    this.updatedAt,
    this.items = const [],
  });

  factory OrderResponse.fromJson(Map<String, dynamic> json) {
    return OrderResponse(
      id: json['id'] ?? 0,
      orderNumber: json['orderNumber'] ?? '',
      userId: json['userId'] ?? 0,
      totalAmount: (json['totalAmount'] ?? 0).toDouble(),
      status: json['status'] ?? 'PENDING',
      trackingNumber: json['trackingNumber'],
      paymentToken: json['paymentToken'],
      paymentUrl: json['paymentUrl'],
      shippingAmount: (json['shippingAmount'] ?? 0).toDouble(),
      shippingService: json['shippingService'],
      createdAt: json['createdAt'],
      updatedAt: json['updatedAt'],
      items: json['items'] != null ? (json['items'] as List).map((i) => OrderItemResponse.fromJson(i)).toList() : [],
    );
  }
}
