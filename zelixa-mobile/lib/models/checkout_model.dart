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
  int? id;
  // Let's map whatever we need
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
    );
  }
}
