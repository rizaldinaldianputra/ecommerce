import 'package:dio/dio.dart';
import '../models/address_model.dart';
import 'common_service.dart';

class AddressService extends CommonService {
  Future<List<AddressResponse>> getUserAddresses() async {
    try {
      final response = await get('/addresses');
      if (response.data != null && response.data['data'] != null) {
        final List<dynamic> list = response.data['data'];
        return list.map((e) => AddressResponse.fromJson(e)).toList();
      }
      return [];
    } catch (e) {
      rethrow;
    }
  }

  Future<AddressResponse> createAddress(AddressRequest request) async {
    try {
      final response = await post('/addresses', data: request.toJson());
      if (response.data != null && response.data['data'] != null) {
        return AddressResponse.fromJson(response.data['data']);
      }
      throw Exception('Failed to create address: Invalid response');
    } catch (e) {
      rethrow;
    }
  }
}
