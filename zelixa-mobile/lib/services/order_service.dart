import 'package:dio/dio.dart';
import '../models/checkout_model.dart'; // Contains OrderResponse
import 'common_service.dart';

class OrderService extends CommonService {
  Future<List<OrderResponse>> getMyOrders() async {
    try {
      final response = await get('/v1/orders/my');
      
      List<dynamic> list;
      if (response.data != null && response.data['data'] != null) {
        list = response.data['data'];
      } else if (response.data is List) {
        list = response.data;
      } else {
        list = [];
      }
      return list.map((e) => OrderResponse.fromJson(e)).toList();
    } catch (e) {
      rethrow;
    }
  }

  Future<OrderResponse> checkout(CheckoutRequest request) async {
    try {
      final response = await post('/v1/orders/checkout', data: request.toJson());
      if (response.data != null && response.data['data'] != null) {
        return OrderResponse.fromJson(response.data['data']);
      }
      throw Exception('Failed to create order: Invalid response');
    } catch (e) {
      rethrow;
    }
  }
}
