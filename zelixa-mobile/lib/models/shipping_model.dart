class ShippingCourierResponse {
  final String code;
  final String name;
  final String service;
  final String description;
  final double cost;
  final String etd;

  ShippingCourierResponse({
    required this.code,
    required this.name,
    required this.service,
    required this.description,
    required this.cost,
    required this.etd,
  });

  factory ShippingCourierResponse.fromJson(Map<String, dynamic> json) {
    return ShippingCourierResponse(
      code: json['code'] ?? '',
      name: json['name'] ?? '',
      service: json['service'] ?? '',
      description: json['description'] ?? '',
      cost: (json['cost'] ?? 0).toDouble(),
      etd: json['etd'] ?? '',
    );
  }
}
