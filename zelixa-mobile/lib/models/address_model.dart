class AddressResponse {
  final int id;
  final String label;
  final String recipientName;
  final String phoneNumber;
  final String? provinceId;
  final String? provinceName;
  final String? cityId;
  final String? cityName;
  final String? districtId;
  final String? districtName;
  final String subdistrictId;
  final String subdistrictName;
  final String addressLine;
  final String? postalCode;
  final bool isDefault;

  AddressResponse({
    required this.id,
    required this.label,
    required this.recipientName,
    required this.phoneNumber,
    this.provinceId,
    this.provinceName,
    this.cityId,
    this.cityName,
    this.districtId,
    this.districtName,
    required this.subdistrictId,
    required this.subdistrictName,
    required this.addressLine,
    this.postalCode,
    required this.isDefault,
  });

  factory AddressResponse.fromJson(Map<String, dynamic> json) {
    return AddressResponse(
      id: json['id'] ?? 0,
      label: json['label'] ?? '',
      recipientName: json['recipientName'] ?? '',
      phoneNumber: json['phoneNumber'] ?? '',
      provinceId: json['provinceId'],
      provinceName: json['provinceName'],
      cityId: json['cityId'],
      cityName: json['cityName'],
      districtId: json['districtId'],
      districtName: json['districtName'],
      subdistrictId: json['subdistrictId'] ?? '',
      subdistrictName: json['subdistrictName'] ?? '',
      addressLine: json['addressLine'] ?? '',
      postalCode: json['postalCode'],
      isDefault: json['isDefault'] ?? false,
    );
  }
}

class AddressRequest {
  final String label;
  final String recipientName;
  final String phoneNumber;
  final String? provinceId;
  final String? provinceName;
  final String? cityId;
  final String? cityName;
  final String? districtId;
  final String? districtName;
  final String subdistrictId;
  final String subdistrictName;
  final String addressLine;
  final String? postalCode;
  final bool isDefault;

  AddressRequest({
    required this.label,
    required this.recipientName,
    required this.phoneNumber,
    this.provinceId,
    this.provinceName,
    this.cityId,
    this.cityName,
    this.districtId,
    this.districtName,
    required this.subdistrictId,
    required this.subdistrictName,
    required this.addressLine,
    this.postalCode,
    required this.isDefault,
  });

  Map<String, dynamic> toJson() {
    return {
      'label': label,
      'recipientName': recipientName,
      'phoneNumber': phoneNumber,
      'provinceId': provinceId,
      'provinceName': provinceName,
      'cityId': cityId,
      'cityName': cityName,
      'districtId': districtId,
      'districtName': districtName,
      'subdistrictId': subdistrictId,
      'subdistrictName': subdistrictName,
      'addressLine': addressLine,
      'postalCode': postalCode,
      'isDefault': isDefault,
    };
  }
}
